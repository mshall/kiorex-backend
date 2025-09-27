import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from '../services/health-check.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  async getHealth() {
    return this.healthCheckService.getHealthStatus();
  }

  @Get('ready')
  async getReadiness() {
    return this.healthCheckService.getReadinessStatus();
  }

  @Get('live')
  async getLiveness() {
    return this.healthCheckService.getLivenessStatus();
  }
}
