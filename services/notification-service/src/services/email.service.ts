import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: any;

  constructor(private configService: ConfigService) {
    const emailProvider = this.configService.get('EMAIL_PROVIDER') || 'smtp';

    if (emailProvider === 'sendgrid') {
      sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY') || 'dummy-key');
    } else {
      // Use nodemailer for other providers
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST') || 'localhost',
        port: parseInt(this.configService.get('SMTP_PORT')) || 587,
        secure: false,
        auth: {
          user: this.configService.get('SMTP_USER') || 'dummy@example.com',
          pass: this.configService.get('SMTP_PASSWORD') || 'dummy-password',
        },
      });
    }
  }

  async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    attachments?: any[];
  }): Promise<void> {
    const emailProvider = this.configService.get('EMAIL_PROVIDER');

    if (emailProvider === 'sendgrid') {
      await sgMail.send({
        to: data.to,
        from: this.configService.get('EMAIL_FROM'),
        subject: data.subject,
        html: data.html,
        text: data.text,
        attachments: data.attachments,
      });
    } else {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
        attachments: data.attachments,
      });
    }
  }

  async sendBulkEmails(recipients: string[], template: any): Promise<void> {
    // Implement bulk email sending with rate limiting
    const batchSize = 100;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      await Promise.all(
        batch.map(recipient => this.sendEmail({
          to: recipient,
          subject: template.subject,
          html: template.html,
          text: template.text,
        }))
      );
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
