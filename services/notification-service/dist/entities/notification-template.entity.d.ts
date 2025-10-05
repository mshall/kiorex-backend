export declare enum TemplateType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app"
}
export declare class NotificationTemplate {
    id: string;
    name: string;
    displayName: string;
    type: TemplateType;
    subject: string;
    content: string;
    htmlContent: string;
    variables: {
        name: string;
        type: string;
        required: boolean;
        defaultValue?: string;
    }[];
    isActive: boolean;
    description: string;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
}
