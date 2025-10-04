import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get('STRIPE_SECRET_KEY') || 'sk_test_mock';
    
    if (secretKey.startsWith('sk_')) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2022-11-15',
      });
    } else {
      this.logger.warn('Stripe not properly configured - running in mock mode');
      this.stripe = null;
    }
  }

  async createPaymentIntent(amount: number, currency: string, metadata: any = {}): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      return {
        id: 'pi_mock_payment_intent',
        amount: Math.round(amount * 100),
        currency,
        status: 'succeeded',
        client_secret: 'pi_mock_payment_intent_secret',
        metadata,
      } as Stripe.PaymentIntent;
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      return {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 1000,
        currency: 'usd',
      } as Stripe.PaymentIntent;
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to confirm payment intent:', error);
      throw error;
    }
  }

  async createRefund(chargeId: string, amount?: number, reason?: string): Promise<Stripe.Refund> {
    if (!this.stripe) {
      return {
        id: 're_mock_refund',
        amount: amount ? Math.round(amount * 100) : 1000,
        currency: 'usd',
        status: 'succeeded',
        charge: chargeId,
        reason,
      } as Stripe.Refund;
    }

    try {
      const refund = await this.stripe.refunds.create({
        charge: chargeId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as Stripe.RefundCreateParams.Reason,
      });

      return refund;
    } catch (error) {
      this.logger.error('Failed to create refund:', error);
      throw error;
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      return {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 1000,
        currency: 'usd',
      } as Stripe.PaymentIntent;
    }

    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error('Failed to retrieve payment intent:', error);
      throw error;
    }
  }

  async createPaymentMethod(type: string, card: any): Promise<Stripe.PaymentMethod> {
    if (!this.stripe) {
      return {
        id: 'pm_mock_payment_method',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025,
          funding: 'credit',
        },
      } as Stripe.PaymentMethod;
    }

    try {
      return await this.stripe.paymentMethods.create({
        type: type as Stripe.PaymentMethodCreateParams.Type,
        card,
      });
    } catch (error) {
      this.logger.error('Failed to create payment method:', error);
      throw error;
    }
  }
}
