import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { PushNotificationService } from '../services/push-notification.service';

@Processor('notification-queue')
@Injectable()
export class NotificationProcessor {
  constructor(
    private emailService: EmailService,
    private smsService: SmsService,
    private pushService: PushNotificationService,
  ) {}

  @Process('send-email')
  async sendEmail(job: Job) {
    const { notificationId, userId, content } = job.data;
    
    try {
      // Get user email from user service or database
      const userEmail = await this.getUserEmail(userId);
      
      await this.emailService.sendEmail({
        to: userEmail,
        subject: content.title,
        html: content.body,
        text: content.body,
      });

      console.log(`Email sent for notification ${notificationId}`);
    } catch (error) {
      console.error(`Failed to send email for notification ${notificationId}:`, error);
      throw error;
    }
  }

  @Process('send-sms')
  async sendSms(job: Job) {
    const { notificationId, userId, content } = job.data;
    
    try {
      // Get user phone from user service or database
      const userPhone = await this.getUserPhone(userId);
      
      await this.smsService.sendSms({
        to: userPhone,
        body: content.body,
      });

      console.log(`SMS sent for notification ${notificationId}`);
    } catch (error) {
      console.error(`Failed to send SMS for notification ${notificationId}:`, error);
      throw error;
    }
  }

  @Process('send-push')
  async sendPush(job: Job) {
    const { notificationId, userId, content } = job.data;
    
    try {
      // Get user push token from user service or database
      const pushToken = await this.getUserPushToken(userId);
      
      await this.pushService.sendPushNotification({
        token: pushToken,
        title: content.title,
        body: content.body,
        data: content.data,
      });

      console.log(`Push notification sent for notification ${notificationId}`);
    } catch (error) {
      console.error(`Failed to send push notification ${notificationId}:`, error);
      throw error;
    }
  }

  @Process('process-bulk-notification')
  async processBulkNotification(job: Job) {
    const { userIds, type, templateId, data } = job.data;
    
    console.log(`Processing bulk notification for ${userIds.length} users`);
    
    // Process each user individually
    for (const userId of userIds) {
      // Queue individual notification
      // This would typically call the notification service
    }
  }

  private async getUserEmail(userId: string): Promise<string> {
    // In a real implementation, this would call the user service
    return `user${userId}@example.com`;
  }

  private async getUserPhone(userId: string): Promise<string> {
    // In a real implementation, this would call the user service
    return `+1234567890`;
  }

  private async getUserPushToken(userId: string): Promise<string> {
    // In a real implementation, this would call the user service
    return `push_token_${userId}`;
  }
}
