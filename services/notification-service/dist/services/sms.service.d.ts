import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private configService;
    private twilioClient;
    constructor(configService: ConfigService);
    sendSms(data: {
        to: string;
        body: string;
    }): Promise<void>;
    sendWhatsApp(data: {
        to: string;
        body: string;
        mediaUrl?: string;
    }): Promise<void>;
}
