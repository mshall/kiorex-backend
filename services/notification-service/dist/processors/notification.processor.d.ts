import { Job } from 'bull';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { PushNotificationService } from '../services/push-notification.service';
export declare class NotificationProcessor {
    private emailService;
    private smsService;
    private pushService;
    constructor(emailService: EmailService, smsService: SmsService, pushService: PushNotificationService);
    sendEmail(job: Job): Promise<void>;
    sendSms(job: Job): Promise<void>;
    sendPush(job: Job): Promise<void>;
    processBulkNotification(job: Job): Promise<void>;
    private getUserEmail;
    private getUserPhone;
    private getUserPushToken;
}
