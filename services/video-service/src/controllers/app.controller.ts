import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Video Service is running!';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      service: 'video-service',
      timestamp: new Date().toISOString(),
    };
  }
}
