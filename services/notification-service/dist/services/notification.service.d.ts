import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { ClientKafka } from '@nestjs/microservices';
import { Notification, NotificationType } from '../entities/notification.entity';
import { NotificationPreference } from '../entities/notification-preference.entity';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { PushNotificationService } from './push-notification.service';
import { InAppNotificationService } from './in-app-notification.service';
import { TemplateService } from './template.service';
export declare class NotificationService {
    private notificationRepository;
    private preferenceRepository;
    private notificationQueue;
    private kafkaClient;
    private emailService;
    private smsService;
    private pushService;
    private inAppService;
    private templateService;
    constructor(notificationRepository: Repository<Notification>, preferenceRepository: Repository<NotificationPreference>, notificationQueue: Queue, kafkaClient: ClientKafka, emailService: EmailService, smsService: SmsService, pushService: PushNotificationService, inAppService: InAppNotificationService, templateService: TemplateService);
    sendNotification(data: {
        userId: string;
        type: NotificationType;
        templateId: string;
        data: any;
        priority?: string;
    }): Promise<void>;
    sendBulkNotification(data: {
        userIds: string[];
        type: NotificationType;
        templateId: string;
        data: any;
    }): Promise<void>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    getUserNotifications(userId: string, filters?: any): Promise<any>;
    updatePreferences(userId: string, preferences: any): Promise<NotificationPreference>;
    private getUserPreferences;
    private shouldSendNotification;
    private getEnabledChannels;
    private getUnreadCount;
}
