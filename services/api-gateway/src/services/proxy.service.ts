import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CircuitBreakerService } from './circuit-breaker.service';
import { LoadBalancerService } from './load-balancer.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly serviceMap = {
    '/api/auth': { service: 'auth-service', port: 3001 },
    '/api/users': { service: 'user-service', port: 3002 },
    '/api/appointments': { service: 'appointment-service', port: 3005 },
    '/api/payments': { service: 'payment-service', port: 3004 },
    '/api/clinical': { service: 'clinical-service', port: 3006 },
    '/api/notifications': { service: 'notification-service', port: 3007 },
    '/api/search': { service: 'search-service', port: 3008 },
    '/api/video': { service: 'video-service', port: 3009 },
    '/api/analytics': { service: 'analytics-service', port: 3010 },
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

    // Build target URL
    const targetUrl = `http://${instance.host}:${instance.port}${path}`;

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