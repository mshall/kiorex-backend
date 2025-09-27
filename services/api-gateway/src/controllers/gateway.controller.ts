import {
  Controller,
  All,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../services/proxy.service';
import { AuthGuard } from '../guards/auth.guard';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { CircuitBreakerInterceptor } from '../interceptors/circuit-breaker.interceptor';

@Controller()
@UseGuards(AuthGuard, RateLimitGuard)
@UseInterceptors(CircuitBreakerInterceptor)
export class GatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('/auth/*')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'auth-service', 3001);
  }

  @All('/users/*')
  async proxyUsers(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'user-service', 3002);
  }

  @All('/appointments/*')
  async proxyAppointments(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'appointment-service', 3005);
  }

  @All('/payments/*')
  async proxyPayments(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'payment-service', 3004);
  }

  @All('/clinical/*')
  async proxyClinical(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'clinical-service', 3006);
  }

  @All('/notifications/*')
  async proxyNotifications(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'notification-service', 3007);
  }

  @All('/search/*')
  async proxySearch(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'search-service', 3008);
  }

  @All('/video/*')
  async proxyVideo(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'video-service', 3009);
  }

  @All('/analytics/*')
  async proxyAnalytics(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'analytics-service', 3010);
  }
}
