import {
  Controller,
  All,
  Req,
  Res,
  Headers,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../services/proxy.service';
import { RateLimitService } from '../services/rate-limit.service';

@Controller()
export class GatewayController {
  constructor(
    private proxyService: ProxyService,
    private rateLimitService: RateLimitService,
  ) {}

  @All('api/*')
  async handleRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Check rate limits
    const rateLimit = await this.rateLimitService.checkLimit(
      userId,
      req.path,
      ip,
    );
    
    if (!rateLimit.allowed) {
      res.setHeader('X-RateLimit-Limit', '0');
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', rateLimit.resetAt.toString());
      
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimit.resetAt.toString());
    
    try {
      // Forward request
      const result = await this.proxyService.forward(
        req.path,
        req.method,
        headers,
        body,
        query,
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}