import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class PushNotificationService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    // Initialize Firebase Admin SDK only if proper credentials are provided
    const projectId = this.configService.get('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService.get('FIREBASE_PRIVATE_KEY');
    
    if (projectId && clientEmail && privateKey && !admin.apps.length) {
      try {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } catch (error) {
        console.warn('Firebase initialization failed:', error.message);
        // Continue without Firebase - service will still work for other notification types
      }
    } else {
      console.warn('Firebase credentials not provided - push notifications will be disabled');
    }
  }

  async sendPushNotification(data: {
    token: string;
    title: string;
    body: string;
    data?: any;
  }): Promise<void> {
    if (!this.firebaseApp) {
      console.warn('Firebase not initialized - push notification skipped');
      return;
    }

    const message = {
      token: data.token,
      notification: {
        title: data.title,
        body: data.body,
      },
      data: data.data || {},
    };

    try {
      await this.firebaseApp.messaging().send(message);
    } catch (error) {
      console.error('Failed to send push notification:', error);
      throw error;
    }
  }

  async sendBulkPushNotifications(notifications: {
    token: string;
    title: string;
    body: string;
    data?: any;
  }[]): Promise<void> {
    if (!this.firebaseApp) {
      console.warn('Firebase not initialized - bulk push notifications skipped');
      return;
    }

    const messages = notifications.map(notification => ({
      token: notification.token,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
    }));

    for (const message of messages) {
      try {
        await this.firebaseApp.messaging().send(message);
      } catch (error) {
        console.error('Failed to send bulk push notification:', error);
        // Continue with other messages
      }
    }
  }

  async sendToTopic(topic: string, data: {
    title: string;
    body: string;
    data?: any;
  }): Promise<void> {
    const message = {
      topic,
      notification: {
        title: data.title,
        body: data.body,
      },
      data: data.data || {},
    };

    await this.firebaseApp.messaging().send(message);
  }
}
