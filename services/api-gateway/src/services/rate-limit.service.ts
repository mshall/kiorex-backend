import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

@Injectable()
export class RateLimitService {
  private configs: Map<string, RateLimitConfig> = new Map();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.initializeConfigs();
  }

  private initializeConfigs() {
    // Different rate limits for different endpoints
    this.configs.set('default', { windowMs: 60000, maxRequests: 100 });
    this.configs.set('/auth/login', { windowMs: 900000, maxRequests: 5 }); // 5 attempts per 15 min
    this.configs.set('/payments', { windowMs: 60000, maxRequests: 30 });
    this.configs.set('/search', { windowMs: 60000, maxRequests: 200 });
    this.configs.set('/video', { windowMs: 60000, maxRequests: 10 });
  }

  async checkRateLimit(
    identifier: string,
    endpoint: string,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const config = this.configs.get(endpoint) || this.configs.get('default')!;
    const key = `rate_limit:${identifier}:${endpoint}`;
    
    const current = await this.getCurrentCount(key);
    const resetAt = await this.getResetTime(key, config.windowMs);

    if (current >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    await this.incrementCount(key, config.windowMs);

    return {
      allowed: true,
      remaining: config.maxRequests - current - 1,
      resetAt,
    };
  }

  private async getCurrentCount(key: string): Promise<number> {
    const count = await this.cacheManager.get<number>(key);
    return count || 0;
  }

  private async incrementCount(key: string, windowMs: number): Promise<void> {
    const current = await this.getCurrentCount(key);
    await this.cacheManager.set(key, current + 1, windowMs);
  }

  private async getResetTime(key: string, windowMs: number): Promise<Date> {
    const ttl = await this.cacheManager.ttl(key);
    if (ttl > 0) {
      return new Date(Date.now() + ttl * 1000);
    }
    return new Date(Date.now() + windowMs);
  }
}
