import { Injectable } from '@nestjs/common';

interface ServiceInstance {
  id: string;
  host: string;
  port: number;
  healthy: boolean;
  lastHealthCheck: Date;
  load: number;
}

@Injectable()
export class LoadBalancerService {
  private instances: Map<string, ServiceInstance[]> = new Map();

  constructor() {
    this.initializeInstances();
  }

  private initializeInstances() {
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
      this.instances.set(service.name, [
        {
          id: `${service.name}-1`,
          host: service.name,
          port: service.port,
          healthy: true,
          lastHealthCheck: new Date(),
          load: 0,
        },
      ]);
    });
  }

  async getHealthyInstance(serviceName: string): Promise<ServiceInstance | null> {
    const instances = this.instances.get(serviceName);
    if (!instances || instances.length === 0) {
      return null;
    }

    // Filter healthy instances
    const healthyInstances = instances.filter(instance => instance.healthy);
    if (healthyInstances.length === 0) {
      return null;
    }

    // Simple round-robin load balancing
    const instance = this.selectInstance(healthyInstances);
    
    // Update load
    instance.load++;
    instance.lastHealthCheck = new Date();

    return instance;
  }

  private selectInstance(instances: ServiceInstance[]): ServiceInstance {
    // Simple round-robin selection
    const totalLoad = instances.reduce((sum, instance) => sum + instance.load, 0);
    const random = Math.floor(Math.random() * totalLoad);
    
    let currentLoad = 0;
    for (const instance of instances) {
      currentLoad += instance.load;
      if (random < currentLoad) {
        return instance;
      }
    }

    // Fallback to first instance
    return instances[0];
  }

  async markInstanceUnhealthy(serviceName: string, instanceId: string): Promise<void> {
    const instances = this.instances.get(serviceName);
    if (instances) {
      const instance = instances.find(i => i.id === instanceId);
      if (instance) {
        instance.healthy = false;
        console.warn(`Marked instance ${instanceId} as unhealthy`);
      }
    }
  }

  async markInstanceHealthy(serviceName: string, instanceId: string): Promise<void> {
    const instances = this.instances.get(serviceName);
    if (instances) {
      const instance = instances.find(i => i.id === instanceId);
      if (instance) {
        instance.healthy = true;
        instance.lastHealthCheck = new Date();
        console.info(`Marked instance ${instanceId} as healthy`);
      }
    }
  }

  async getServiceStatus(serviceName: string): Promise<{
    total: number;
    healthy: number;
    unhealthy: number;
    instances: ServiceInstance[];
  }> {
    const instances = this.instances.get(serviceName) || [];
    const healthy = instances.filter(i => i.healthy).length;
    const unhealthy = instances.length - healthy;

    return {
      total: instances.length,
      healthy,
      unhealthy,
      instances,
    };
  }
}
