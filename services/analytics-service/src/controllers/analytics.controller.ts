import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('events')
  async trackEvent(
    @Body() data: { eventType: string; eventData: any; sessionId: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.analyticsService.trackEvent(data.eventType, data.eventData, userId, data.sessionId);
  }

  @Get('metrics')
  @UseGuards(RolesGuard)
  @Roles('admin', 'doctor')
  async getMetrics(@Query() query: { start: string; end: string }) {
    return this.analyticsService.getMetrics({
      start: new Date(query.start),
      end: new Date(query.end),
    });
  }

  @Post('dashboards')
  @UseGuards(RolesGuard)
  @Roles('admin', 'doctor')
  async createDashboard(
    @Body() data: { name: string; description: string; widgets: any[] },
    @CurrentUser('id') userId: string,
  ) {
    return this.analyticsService.createDashboard({ ...data, userId });
  }
}