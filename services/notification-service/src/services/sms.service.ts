import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: any;

  constructor(private configService: ConfigService) {
    this.twilioClient = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSms(data: {
    to: string;
    body: string;
  }): Promise<void> {
    await this.twilioClient.messages.create({
      body: data.body,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      to: data.to,
    });
  }

  async sendWhatsApp(data: {
    to: string;
    body: string;
    mediaUrl?: string;
  }): Promise<void> {
    await this.twilioClient.messages.create({
      body: data.body,
      from: `whatsapp:${this.configService.get('TWILIO_WHATSAPP_NUMBER')}`,
      to: `whatsapp:${data.to}`,
      mediaUrl: data.mediaUrl,
    });
  }
}
