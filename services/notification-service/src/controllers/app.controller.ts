import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Notification Service is running!';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
    };
  }
}
