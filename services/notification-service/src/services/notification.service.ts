import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ClientKafka } from '@nestjs/microservices';

import { Notification, NotificationStatus, NotificationType } from '../entities/notification.entity';
import { NotificationPreference } from '../entities/notification-preference.entity';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { PushNotificationService } from './push-notification.service';
import { InAppNotificationService } from './in-app-notification.service';
import { TemplateService } from './template.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private preferenceRepository: Repository<NotificationPreference>,
    @InjectQueue('notification-queue') private notificationQueue: Queue,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    private emailService: EmailService,
    private smsService: SmsService,
    private pushService: PushNotificationService,
    private inAppService: InAppNotificationService,
    private templateService: TemplateService,
  ) {}

  async sendNotification(data: {
    userId: string;
    type: NotificationType;
    templateId: string;
    data: any;
    priority?: string;
  }): Promise<void> {
    // Get user preferences
    const preferences = await this.getUserPreferences(data.userId);

    // Check if user wants this type of notification
    if (!this.shouldSendNotification(preferences, data.type)) {
      return;
    }

    // Get template
    const template = await this.templateService.getTemplate(data.templateId);

    // Create notification record
    const notification = this.notificationRepository.create({
      userId: data.userId,
      type: data.type,
      title: await this.templateService.renderTitle(template, data.data),
      body: await this.templateService.renderBody(template, data.data),
      data: data.data,
      status: NotificationStatus.PENDING,
      priority: data.priority || 'normal',
    });

    const savedNotification = await this.notificationRepository.save(notification);

    // Queue for delivery based on preferences
    const channels = this.getEnabledChannels(preferences, data.type);
    
    for (const channel of channels) {
      await this.notificationQueue.add(`send-${channel}`, {
        notificationId: savedNotification.id,
        userId: data.userId,
        channel,
        content: {
          title: savedNotification.title,
          body: savedNotification.body,
          data: savedNotification.data,
        },
      });
    }

    // Always send in-app notification
    await this.inAppService.create(savedNotification);
  }

  async sendBulkNotification(data: {
    userIds: string[];
    type: NotificationType;
    templateId: string;
    data: any;
  }): Promise<void> {
    // Queue bulk processing
    await this.notificationQueue.add('process-bulk-notification', {
      ...data,
      timestamp: new Date(),
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (notification && !notification.readAt) {
      notification.readAt = new Date();
      notification.status = NotificationStatus.READ;
      await this.notificationRepository.save(notification);

      // Emit event
      await this.kafkaClient.emit('notification.read', {
        notificationId,
        userId,
        timestamp: new Date(),
      });
    }
  }

  async getUserNotifications(userId: string, filters?: any): Promise<any> {
    const query = this.notificationRepository.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId });

    if (filters?.unreadOnly) {
      query.andWhere('notification.readAt IS NULL');
    }

    if (filters?.type) {
      query.andWhere('notification.type = :type', { type: filters.type });
    }

    const [notifications, total] = await query
      .orderBy('notification.createdAt', 'DESC')
      .take(filters?.limit || 50)
      .skip(filters?.offset || 0)
      .getManyAndCount();

    return {
      data: notifications,
      total,
      unreadCount: await this.getUnreadCount(userId),
    };
  }

  async updatePreferences(userId: string, preferences: any): Promise<NotificationPreference> {
    let userPreference = await this.preferenceRepository.findOne({
      where: { userId },
    });

    if (!userPreference) {
      userPreference = this.preferenceRepository.create({
        userId,
        ...preferences,
      });
    } else {
      Object.assign(userPreference, preferences);
    }

    return await this.preferenceRepository.save(userPreference);
  }

  private async getUserPreferences(userId: string): Promise<NotificationPreference> {
    let preferences = await this.preferenceRepository.findOne({
      where: { userId },
    });

    if (!preferences) {
      // Create default preferences
      preferences = this.preferenceRepository.create({
        userId,
        email: true,
        sms: false,
        push: true,
        inApp: true,
        preferences: {
          appointments: { email: true, sms: true, push: true },
          payments: { email: true, sms: false, push: true },
          reminders: { email: false, sms: true, push: true },
          marketing: { email: true, sms: false, push: false },
        },
      });
      await this.preferenceRepository.save(preferences);
    }

    return preferences;
  }

  private shouldSendNotification(
    preferences: NotificationPreference,
    type: NotificationType,
  ): boolean {
    // Check global opt-out
    if (!preferences.enabled) return false;

    // Check quiet hours
    if (preferences.quietHours) {
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour >= preferences.quietHoursStart || currentHour < preferences.quietHoursEnd) {
        return false;
      }
    }

    return true;
  }

  private getEnabledChannels(
    preferences: NotificationPreference,
    type: NotificationType,
  ): string[] {
    const channels = [];
    const typePrefs = preferences.preferences?.[type] || {};

    if (preferences.email && typePrefs.email !== false) channels.push('email');
    if (preferences.sms && typePrefs.sms !== false) channels.push('sms');
    if (preferences.push && typePrefs.push !== false) channels.push('push');

    return channels;
  }

  private async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, readAt: null },
    });
  }
}
