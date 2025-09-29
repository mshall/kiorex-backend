import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Skip auth for health checks and public endpoints
    if (this.isPublicEndpoint(req.url)) {
      return next();
    }

    const token = this.extractTokenFromHeader(req);
    
    if (!token) {
      return next(); // Continue without user context
    }

    try {
      const payload = this.jwtService.verify(token);
      req['user'] = {
        userId: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
      };
    } catch (error) {
      // Invalid token, continue without user context
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      '/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh',
    ];

    return publicEndpoints.some(endpoint => url.startsWith(endpoint));
  }
}
