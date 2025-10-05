import { ConfigService } from '@nestjs/config';
export declare class PushNotificationService {
    private configService;
    private firebaseApp;
    constructor(configService: ConfigService);
    sendPushNotification(data: {
        token: string;
        title: string;
        body: string;
        data?: any;
    }): Promise<void>;
    sendBulkPushNotifications(notifications: {
        token: string;
        title: string;
        body: string;
        data?: any;
    }[]): Promise<void>;
    sendToTopic(topic: string, data: {
        title: string;
        body: string;
        data?: any;
    }): Promise<void>;
}
