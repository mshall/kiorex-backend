export declare enum NotificationType {
    APPOINTMENT = "appointment",
    PAYMENT = "payment",
    REMINDER = "reminder",
    MARKETING = "marketing",
    SYSTEM = "system",
    EMERGENCY = "emergency"
}
export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum NotificationPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data: any;
    status: NotificationStatus;
    priority: NotificationPriority;
    templateId: string;
    channels: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
        inApp?: boolean;
    };
    scheduledAt: Date;
    sentAt: Date;
    deliveredAt: Date;
    readAt: Date;
    errorMessage: string;
    retryCount: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
