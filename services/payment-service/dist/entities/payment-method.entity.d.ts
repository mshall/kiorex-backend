export declare enum PaymentMethodType {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    BANK_ACCOUNT = "bank_account",
    PAYPAL = "paypal"
}
export declare class PaymentMethod {
    id: string;
    userId: string;
    type: PaymentMethodType;
    stripePaymentMethodId: string;
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
    funding: string;
    isDefault: boolean;
    isActive: boolean;
    billingDetails: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
