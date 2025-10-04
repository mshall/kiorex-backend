import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
export declare class InAppNotificationService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    create(notification: Notification): Promise<void>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
    getUnreadCount(userId: string): Promise<number>;
}
