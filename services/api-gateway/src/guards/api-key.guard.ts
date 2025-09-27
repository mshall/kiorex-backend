import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    // Skip API key check for health checks and public endpoints
    if (this.isPublicEndpoint(request.url)) {
      return true;
    }

    if (!apiKey) {
      throw new UnauthorizedException('API key required');
    }

    // In production, validate against database or external service
    const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
    if (!validApiKeys.includes(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      '/health',
      '/auth/login',
      '/auth/register',
    ];

    return publicEndpoints.some(endpoint => url.startsWith(endpoint));
  }
}
