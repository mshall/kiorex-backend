import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as httpProxy from 'http-proxy-middleware';
import { LoadBalancerService } from './load-balancer.service';
import { CircuitBreakerService } from './circuit-breaker.service';

@Injectable()
export class ProxyService {
  private proxies: Map<string, any> = new Map();

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private loadBalancer: LoadBalancerService,
    private circuitBreaker: CircuitBreakerService,
  ) {
    this.initializeProxies();
  }

  private initializeProxies() {
    const services = [
      { name: 'auth-service', port: 3001 },
      { name: 'user-service', port: 3002 },
      { name: 'appointment-service', port: 3005 },
      { name: 'payment-service', port: 3004 },
      { name: 'clinical-service', port: 3006 },
      { name: 'notification-service', port: 3007 },
      { name: 'search-service', port: 3008 },
      { name: 'video-service', port: 3009 },
      { name: 'analytics-service', port: 3010 },
    ];

    services.forEach(service => {
      const proxy = httpProxy.createProxyMiddleware({
        target: `http://${service.name}:${service.port}`,
        changeOrigin: true,
        pathRewrite: {
          [`^/${service.name.split('-')[0]}`]: '',
        },
        onProxyReq: this.onProxyReq.bind(this),
        onProxyRes: this.onProxyRes.bind(this),
        onError: this.onProxyError.bind(this),
      });

      this.proxies.set(service.name, proxy);
    });
  }

  async forward(req: Request, res: Response, serviceName: string, port: number) {
    // Check circuit breaker
    if (await this.circuitBreaker.isOpen(serviceName)) {
      throw new HttpException(
        'Service temporarily unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Get healthy instance from load balancer
    const instance = await this.loadBalancer.getHealthyInstance(serviceName);
    if (!instance) {
      throw new HttpException(
        'No healthy instances available',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const proxy = this.proxies.get(serviceName);
    if (!proxy) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    // Add tracking headers
    req.headers['X-Forwarded-By'] = 'api-gateway';
    req.headers['X-Request-Id'] = req['requestId'];
    req.headers['X-Service-Name'] = serviceName;

    return proxy(req, res);
  }

  private onProxyReq(proxyReq: any, req: Request, res: Response) {
    // Add user context from JWT
    if (req['user']) {
      proxyReq.setHeader('X-User-Id', req['user'].userId);
      proxyReq.setHeader('X-User-Roles', JSON.stringify(req['user'].roles));
    }

    // Add trace headers
    proxyReq.setHeader('X-Trace-Id', req.headers['x-trace-id'] || req['requestId']);
    proxyReq.setHeader('X-Span-Id', this.generateSpanId());
  }

  private onProxyRes(proxyRes: any, req: Request, res: Response) {
    // Cache GET responses if cacheable
    if (req.method === 'GET' && proxyRes.statusCode === 200) {
      const cacheKey = this.getCacheKey(req);
      const shouldCache = this.shouldCache(req.path);

      if (shouldCache) {
        let body = '';
        proxyRes.on('data', (chunk) => {
          body += chunk;
        });

        proxyRes.on('end', async () => {
          await this.cacheManager.set(cacheKey, body, 60);
        });
      }
    }

    // Record metrics
    this.recordMetrics(req, proxyRes);
  }

  private onProxyError(err: Error, req: Request, res: Response) {
    console.error('Proxy error:', err);
    
    // Trigger circuit breaker
    const serviceName = req.headers['X-Service-Name'] as string;
    this.circuitBreaker.recordFailure(serviceName);

    res.status(HttpStatus.BAD_GATEWAY).json({
      error: 'Service communication error',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  private getCacheKey(req: Request): string {
    return `cache:${req.method}:${req.path}:${JSON.stringify(req.query)}`;
  }

  private shouldCache(path: string): boolean {
    const cacheablePaths = [
      '/users/profile',
      '/appointments/available',
      '/search',
    ];

    return cacheablePaths.some(p => path.includes(p));
  }

  private recordMetrics(req: Request, proxyRes: any) {
    // Record response time, status code, etc.
    const responseTime = Date.now() - req['startTime'];
    const labels = {
      method: req.method,
      path: req.path,
      status: proxyRes.statusCode,
      service: req.headers['X-Service-Name'],
    };

    // Send to metrics service
    this.sendMetrics({
      type: 'http_request',
      labels,
      value: responseTime,
    });
  }

  private generateSpanId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private sendMetrics(metrics: any): void {
    // Implementation to send metrics
    console.log('Metrics:', metrics);
  }
}
