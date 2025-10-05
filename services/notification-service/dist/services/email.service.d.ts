import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(data: {
        to: string;
        subject: string;
        html: string;
        text?: string;
        attachments?: any[];
    }): Promise<void>;
    sendBulkEmails(recipients: string[], template: any): Promise<void>;
}
