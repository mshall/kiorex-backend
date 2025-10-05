import { NotificationService } from '../services/notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(data: any): Promise<void>;
    sendBulkNotification(data: any): Promise<void>;
    getUserNotifications(user: any, filters: any): Promise<any>;
    markAsRead(id: string, user: any): Promise<void>;
}
