import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CircuitBreakerService } from './circuit-breaker.service';
import { LoadBalancerService } from './load-balancer.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly serviceMap = {
    '/api/auth': { service: 'auth-service', port: 3001 },
    '/auth': { service: 'auth-service', port: 3001 },
    '/api/users': { service: 'user-service', port: 3002 },
    '/users': { service: 'user-service', port: 3002 },
    '/api/appointments': { service: 'appointment-service', port: 3003 },
    '/appointments': { service: 'appointment-service', port: 3003 },
    '/api/payments': { service: 'payment-service', port: 3004 },
    '/payments': { service: 'payment-service', port: 3004 },
    '/api/clinical': { service: 'clinical-service', port: 3005 },
    '/clinical': { service: 'clinical-service', port: 3005 },
    '/api/notifications': { service: 'notification-service', port: 3006 },
    '/notifications': { service: 'notification-service', port: 3006 },
    '/api/search': { service: 'search-service', port: 3007 },
    '/search': { service: 'search-service', port: 3007 },
    '/api/video': { service: 'video-service', port: 3008 },
    '/video': { service: 'video-service', port: 3008 },
    '/api/analytics': { service: 'analytics-service', port: 3009 },
    '/analytics': { service: 'analytics-service', port: 3009 },
  };

  constructor(
    private httpService: HttpService,
    private circuitBreaker: CircuitBreakerService,
    private loadBalancer: LoadBalancerService,
  ) {}

  async forward(
    path: string,
    method: string,
    headers: any,
    body?: any,
    query?: any,
  ): Promise<any> {
    const serviceConfig = this.getServiceConfig(path);
    
    if (!serviceConfig) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    // Get healthy instance
    const instance = await this.loadBalancer.getHealthyInstance(serviceConfig.service);
    
    if (!instance) {
      throw new HttpException(
        'Service temporarily unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Transform path for the target service
    let targetPath = path;
    if (path.startsWith('/auth/')) {
      targetPath = path; // Keep /auth for auth service
    } else if (path.startsWith('/api/auth/')) {
      targetPath = path.replace('/api/auth', '/auth');
    } else if (path.startsWith('/users/')) {
      targetPath = path.replace('/users', '/api/users');
    } else if (path.startsWith('/appointments/')) {
      targetPath = path.replace('/appointments', '/api/appointments');
    } else if (path.startsWith('/payments/')) {
      targetPath = path.replace('/payments', '/api/payments');
    } else if (path.startsWith('/clinical/')) {
      targetPath = path.replace('/clinical', '/api/clinical');
    } else if (path.startsWith('/notifications/')) {
      targetPath = path.replace('/notifications', '/api/notifications');
    } else if (path.startsWith('/search/')) {
      targetPath = path.replace('/search', '/api/search');
    } else if (path.startsWith('/video/')) {
      targetPath = path.replace('/video', '/api/video');
    } else if (path.startsWith('/analytics/')) {
      targetPath = path.replace('/analytics', '/api/analytics');
    }
    
    // Build target URL
    const targetUrl = `http://${instance.host}:${instance.port}${targetPath}`;

    // Execute with circuit breaker
    return await this.circuitBreaker.execute(
      serviceConfig.service,
      async () => {
        const response = await firstValueFrom(
          this.httpService.request({
            url: targetUrl,
            method,
            headers: this.filterHeaders(headers),
            data: body,
            params: query,
            timeout: 30000,
          }),
        );
        return response.data;
      },
    );
  }

  private getServiceConfig(path: string): any {
    for (const [prefix, config] of Object.entries(this.serviceMap)) {
      if (path.startsWith(prefix)) {
        return config;
      }
    }
    return null;
  }

  private filterHeaders(headers: any): any {
    const filtered = { ...headers };
    // Remove hop-by-hop headers
    delete filtered['connection'];
    delete filtered['keep-alive'];
    delete filtered['proxy-authenticate'];
    delete filtered['proxy-authorization'];
    delete filtered['te'];
    delete filtered['trailers'];
    delete filtered['transfer-encoding'];
    delete filtered['upgrade'];
    
    // Add correlation ID
    if (!filtered['x-correlation-id']) {
      filtered['x-correlation-id'] = this.generateCorrelationId();
    }
    
    return filtered;
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}