import { Injectable } from '@nestjs/common';
import { LoadBalancerService } from './load-balancer.service';

@Injectable()
export class HealthCheckService {
  constructor(private readonly loadBalancer: LoadBalancerService) {}

  async getHealthStatus() {
    const services = [
      'auth-service',
      'user-service',
      'appointment-service',
      'payment-service',
      'clinical-service',
      'notification-service',
      'search-service',
      'video-service',
      'analytics-service',
    ];

    const serviceStatuses = await Promise.all(
      services.map(async (service) => {
        const status = await this.loadBalancer.getServiceStatus(service);
        return {
          name: service,
          status: status.healthy > 0 ? 'healthy' : 'unhealthy',
          instances: status.healthy,
          total: status.total,
        };
      }),
    );

    const overallHealth = serviceStatuses.every(s => s.status === 'healthy') ? 'healthy' : 'degraded';

    return {
      status: overallHealth,
      timestamp: new Date().toISOString(),
      services: serviceStatuses,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  async getReadinessStatus() {
    const criticalServices = [
      'auth-service',
      'user-service',
      'appointment-service',
    ];

    const criticalStatuses = await Promise.all(
      criticalServices.map(async (service) => {
        const status = await this.loadBalancer.getServiceStatus(service);
        return {
          name: service,
          ready: status.healthy > 0,
        };
      }),
    );

    const ready = criticalStatuses.every(s => s.ready);

    return {
      ready,
      timestamp: new Date().toISOString(),
      criticalServices: criticalStatuses,
    };
  }

  async getLivenessStatus() {
    return {
      alive: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
