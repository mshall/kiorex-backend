export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    BANK_TRANSFER = "bank_transfer",
    PAYPAL = "paypal",
    STRIPE = "stripe",
    CASH = "cash"
}
export declare class Payment {
    id: string;
    userId: string;
    appointmentId: string;
    providerId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    stripePaymentIntentId: string;
    stripeChargeId: string;
    transactionId: string;
    description: string;
    metadata: any;
    paymentDetails: {
        last4?: string;
        brand?: string;
        expMonth?: number;
        expYear?: number;
        funding?: string;
    };
    billingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    failureReason: string;
    processedAt: Date;
    refundedAt: Date;
    refundAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
