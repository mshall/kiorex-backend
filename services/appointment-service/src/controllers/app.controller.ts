import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Appointment Service is running!';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      service: 'appointment-service',
      timestamp: new Date().toISOString(),
    };
  }
}
