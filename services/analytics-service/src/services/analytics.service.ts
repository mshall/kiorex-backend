import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metric } from '../entities/metric.entity';
import { AnalyticsEvent } from '../entities/analytics-event.entity';
import { AnalyticsDashboard } from '../entities/analytics-dashboard.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
    @InjectRepository(AnalyticsEvent)
    private eventRepository: Repository<AnalyticsEvent>,
    @InjectRepository(AnalyticsDashboard)
    private dashboardRepository: Repository<AnalyticsDashboard>,
  ) {}

  async trackEvent(eventType: string, eventData: any, userId: string, sessionId: string) {
    const event = this.eventRepository.create({
      eventType,
      properties: eventData,
      userId,
      sessionId,
      timestamp: new Date(),
    });
    return this.eventRepository.save(event);
  }

  async getMetrics(timeRange: { start: Date; end: Date }) {
    return this.metricRepository.find({
      where: {
        createdAt: {
          $gte: timeRange.start,
          $lte: timeRange.end,
        } as any,
      },
    });
  }

  async createDashboard(data: { name: string; description: string; widgets: any[]; userId: string }) {
    const dashboard = this.dashboardRepository.create(data);
    return this.dashboardRepository.save(dashboard);
  }
}