import { PaymentMethod } from '../entities/payment.entity';
export declare class CreatePaymentDto {
    userId: string;
    appointmentId?: string;
    providerId?: string;
    amount: number;
    currency?: string;
    paymentMethod: PaymentMethod;
    description?: string;
    stripePaymentMethodId?: string;
    metadata?: any;
    billingAddress?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}
