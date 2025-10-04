export declare class NotificationPreference {
    id: string;
    userId: string;
    enabled: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
    quietHours: boolean;
    quietHoursStart: number;
    quietHoursEnd: number;
    preferences: {
        [key: string]: {
            email?: boolean;
            sms?: boolean;
            push?: boolean;
            inApp?: boolean;
        };
    };
    channels: {
        email?: string;
        phone?: string;
        pushToken?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
