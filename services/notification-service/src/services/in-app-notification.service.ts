import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class InAppNotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(notification: Notification): Promise<void> {
    // In-app notifications are created directly in the database
    // This service handles the in-app specific logic
    notification.channels = {
      ...notification.channels,
      inApp: true,
    };

    await this.notificationRepository.save(notification);
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (notification && !notification.readAt) {
      notification.readAt = new Date();
      notification.status = 'read' as any;
      await this.notificationRepository.save(notification);
    }
  }

  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, readAt: null },
    });
  }
}
