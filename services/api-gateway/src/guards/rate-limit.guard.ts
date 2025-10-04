import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { RateLimitService } from '../services/rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimitService: RateLimitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Skip rate limiting for health checks
    if (this.isHealthEndpoint(request.url)) {
      return true;
    }

    const identifier = this.getIdentifier(request);
    const endpoint = this.getEndpoint(request.url);
    const ip = request.ip || request.connection.remoteAddress || 'unknown';

    const rateLimitResult = await this.rateLimitService.checkLimit(identifier, endpoint, ip);

    // Add rate limit headers
    response.setHeader('X-RateLimit-Limit', 100);
    response.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
    response.setHeader('X-RateLimit-Reset', rateLimitResult.resetAt);

    if (!rateLimitResult.allowed) {
      throw new HttpException(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests',
          retryAfter: rateLimitResult.resetAt,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getIdentifier(request: any): string {
    // Use user ID if available, otherwise use IP address
    if (request['user']?.userId) {
      return request['user'].userId;
    }

    return request.ip || request.connection.remoteAddress || 'unknown';
  }

  private getEndpoint(url: string): string {
    // Extract the base path for rate limiting
    const pathSegments = url.split('/').filter(Boolean);
    if (pathSegments.length === 0) return '/';
    
    return `/${pathSegments[0]}`;
  }

  private isHealthEndpoint(url: string): boolean {
    return url.startsWith('/health');
  }
}
