import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // Skip auth for health checks and public endpoints
    if (this.isPublicEndpoint(request.url)) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const user = await this.authService.extractUserFromToken(token);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      request['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      '/health',
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
    ];

    return publicEndpoints.some(endpoint => url.startsWith(endpoint));
  }
}
