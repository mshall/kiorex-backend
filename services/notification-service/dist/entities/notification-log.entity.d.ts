export declare enum LogType {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed",
    BOUNCED = "bounced",
    COMPLAINED = "complained"
}
export declare class NotificationLog {
    id: string;
    notificationId: string;
    userId: string;
    channel: string;
    type: LogType;
    message: string;
    metadata: any;
    errorMessage: string;
    responseCode: number;
    createdAt: Date;
}
