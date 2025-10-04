export declare enum RefundStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class Refund {
    id: string;
    paymentId: string;
    userId: string;
    amount: number;
    currency: string;
    status: RefundStatus;
    stripeRefundId: string;
    reason: string;
    description: string;
    metadata: any;
    failureReason: string;
    processedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
