import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RateLimitService {
  private readonly limits = {
    global: { window: 60, limit: 1000 },
    user: { window: 60, limit: 100 },
    endpoint: {
      '/api/auth/login': { window: 300, limit: 5 },
      '/api/payments': { window: 60, limit: 20 },
      '/api/search': { window: 60, limit: 50 },
    },
  };

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async checkLimit(
    userId: string,
    endpoint: string,
    ip: string,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    
    // Check global rate limit
    const globalAllowed = await this.checkSpecificLimit(
      `global:${ip}`,
      this.limits.global,
      now,
    );
    
    if (!globalAllowed.allowed) {
      return globalAllowed;
    }
    
    // Check user rate limit
    if (userId) {
      const userAllowed = await this.checkSpecificLimit(
        `user:${userId}`,
        this.limits.user,
        now,
      );
      
      if (!userAllowed.allowed) {
        return userAllowed;
      }
    }
    
    // Check endpoint-specific limit
    const endpointLimit = this.limits.endpoint[endpoint];
    if (endpointLimit) {
      return await this.checkSpecificLimit(
        `endpoint:${userId || ip}:${endpoint}`,
        endpointLimit,
        now,
      );
    }
    
    return { allowed: true, remaining: 100, resetAt: now + 60000 };
  }

  private async checkSpecificLimit(
    key: string,
    limit: { window: number; limit: number },
    now: number,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const windowKey = `ratelimit:${key}:${Math.floor(now / (limit.window * 1000))}`;
    
    const current = await this.cacheManager.get<number>(windowKey) || 0;
    
    if (current >= limit.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: Math.ceil(now / (limit.window * 1000)) * (limit.window * 1000),
      };
    }
    
    await this.cacheManager.set(
      windowKey,
      current + 1,
      limit.window * 1000,
    );
    
    return {
      allowed: true,
      remaining: limit.limit - current - 1,
      resetAt: Math.ceil(now / (limit.window * 1000)) * (limit.window * 1000),
    };
  }
}