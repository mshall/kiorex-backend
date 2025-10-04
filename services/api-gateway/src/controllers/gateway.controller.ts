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
  async handleApiRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
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

  @All('test')
  async testEndpoint(@Req() req: Request, @Res() res: Response) {
    res.json({ message: 'API Gateway is working!', timestamp: new Date().toISOString() });
  }

  @All('auth/*')
  async handleAuthRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
      // Direct HTTP call to auth service for testing
      const axios = require('axios');
      const targetUrl = `http://localhost:3001${req.path}`;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Auth request error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }

  @All('users/*')
  async handleUserRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
      // Direct HTTP call to user service for testing
      const axios = require('axios');
      const targetUrl = `http://localhost:3002${req.path.replace('/users', '')}`;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.authorization,
        },
        data: body,
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('User request error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }

  @All('appointments/*')
  async handleAppointmentRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
      // Direct HTTP call to appointment service for testing
      const axios = require('axios');
      const targetUrl = `http://localhost:3003${req.path}`;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.authorization,
        },
        data: body,
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Appointment request error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }

  @All('clinical/*')
  async handleClinicalRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
      // Direct HTTP call to clinical service for testing
      const axios = require('axios');
      const targetUrl = `http://localhost:3004${req.path.replace('/clinical', '')}`;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.authorization,
        },
        data: body,
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Clinical request error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }

  @All('notifications/*')
  async handleNotificationRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
      // Direct HTTP call to notification service for testing
      const axios = require('axios');
      const targetUrl = `http://localhost:3006${req.path}`;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.authorization,
        },
        data: body,
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Notification request error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }

  @All('search/*')
  async handleSearchRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
      // Direct HTTP call to search service for testing
      const axios = require('axios');
      const targetUrl = `http://localhost:3007${req.path.replace('/search', '')}`;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.authorization,
        },
        data: body,
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Search request error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }

  @All('video/*')
  async handleVideoRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
      // Direct HTTP call to video service for testing
      const axios = require('axios');
      const targetUrl = `http://localhost:3008${req.path}`;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.authorization,
        },
        data: body,
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Video request error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }

  @All('analytics/*')
  async handleAnalyticsRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any,
    @Query() query: any,
  ) {
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', '100');
    res.setHeader('X-RateLimit-Reset', (Date.now() + 60000).toString());
    
    try {
      // Direct HTTP call to analytics service for testing
      const axios = require('axios');
      const targetUrl = `http://localhost:3009${req.path}`;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.authorization,
        },
        data: body,
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Analytics request error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }
}