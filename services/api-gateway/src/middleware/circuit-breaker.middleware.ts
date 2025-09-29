import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CircuitBreakerService } from '../services/circuit-breaker.service';

@Injectable()
export class CircuitBreakerMiddleware implements NestMiddleware {
  constructor(private circuitBreaker: CircuitBreakerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Extract service name from path
    const serviceName = this.getServiceNameFromPath(req.path);
    
    if (!serviceName) {
      return next();
    }

    // Check circuit breaker status
    const status = this.circuitBreaker.getStatus(serviceName);
    
    if (status.status === 'open') {
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Circuit breaker is open',
        service: serviceName,
      });
      return;
    }

    next();
  }

  private getServiceNameFromPath(path: string): string | null {
    const serviceMap = {
      '/api/auth': 'auth-service',
      '/api/users': 'user-service',
      '/api/appointments': 'appointment-service',
      '/api/payments': 'payment-service',
      '/api/clinical': 'clinical-service',
      '/api/notifications': 'notification-service',
      '/api/search': 'search-service',
      '/api/video': 'video-service',
      '/api/analytics': 'analytics-service',
    };

    for (const [prefix, service] of Object.entries(serviceMap)) {
      if (path.startsWith(prefix)) {
        return service;
      }
    }

    return null;
  }
}
