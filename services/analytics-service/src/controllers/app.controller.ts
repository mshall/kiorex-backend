import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Analytics Service is running!';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      service: 'analytics-service',
      timestamp: new Date().toISOString(),
    };
  }
}
