import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Clinical Service is running!';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      service: 'clinical-service',
      timestamp: new Date().toISOString(),
    };
  }
}
