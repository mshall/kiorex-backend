import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService {
    private configService;
    private readonly logger;
    private stripe;
    constructor(configService: ConfigService);
    createPaymentIntent(amount: number, currency: string, metadata?: any): Promise<Stripe.PaymentIntent>;
    confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string): Promise<Stripe.PaymentIntent>;
    createRefund(chargeId: string, amount?: number, reason?: string): Promise<Stripe.Refund>;
    retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    createPaymentMethod(type: string, card: any): Promise<Stripe.PaymentMethod>;
}
