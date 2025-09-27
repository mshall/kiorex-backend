import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class PushNotificationService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get('FIREBASE_PROJECT_ID'),
          clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.configService.get('FIREBASE_PRIVATE_KEY'),
        }),
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  async sendPushNotification(data: {
    token: string;
    title: string;
    body: string;
    data?: any;
  }): Promise<void> {
    const message = {
      token: data.token,
      notification: {
        title: data.title,
        body: data.body,
      },
      data: data.data || {},
    };

    await this.firebaseApp.messaging().send(message);
  }

  async sendBulkPushNotifications(notifications: {
    token: string;
    title: string;
    body: string;
    data?: any;
  }[]): Promise<void> {
    const messages = notifications.map(notification => ({
      token: notification.token,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
    }));

    await this.firebaseApp.messaging().sendAll(messages);
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
