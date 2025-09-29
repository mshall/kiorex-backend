import { Injectable } from '@nestjs/common';
import CircuitBreaker from 'opossum';

@Injectable()
export class CircuitBreakerService {
  private breakers: Map<string, CircuitBreaker> = new Map();

  private readonly defaultOptions = {
    timeout: 30000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    volumeThreshold: 10,
  };

  async execute<T>(service: string, operation: () => Promise<T>): Promise<T> {
    let breaker = this.breakers.get(service);
    
    if (!breaker) {
      breaker = new CircuitBreaker(operation, this.defaultOptions);
      
      breaker.on('open', () => {
        console.log(`Circuit breaker opened for ${service}`);
      });
      
      breaker.on('halfOpen', () => {
        console.log(`Circuit breaker half-open for ${service}`);
      });
      
      breaker.on('close', () => {
        console.log(`Circuit breaker closed for ${service}`);
      });
      
      this.breakers.set(service, breaker);
    }
    
    return await breaker.fire();
  }

  getStatus(service: string): any {
    const breaker = this.breakers.get(service);
    if (!breaker) {
      return { status: 'unknown' };
    }
    
    return {
      status: breaker.opened ? 'open' : breaker.halfOpen ? 'half-open' : 'closed',
      stats: breaker.stats,
    };
  }
}