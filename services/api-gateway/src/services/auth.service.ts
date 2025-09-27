import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  }

  async extractUserFromToken(token: string): Promise<any> {
    const payload = await this.validateToken(token);
    if (!payload) {
      return null;
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    };
  }
}
