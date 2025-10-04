"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
let StripeService = StripeService_1 = class StripeService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StripeService_1.name);
        const secretKey = this.configService.get('STRIPE_SECRET_KEY') || 'sk_test_mock';
        if (secretKey.startsWith('sk_')) {
            this.stripe = new stripe_1.default(secretKey, {
                apiVersion: '2022-11-15',
            });
        }
        else {
            this.logger.warn('Stripe not properly configured - running in mock mode');
            this.stripe = null;
        }
    }
    async createPaymentIntent(amount, currency, metadata = {}) {
        if (!this.stripe) {
            return {
                id: 'pi_mock_payment_intent',
                amount: Math.round(amount * 100),
                currency,
                status: 'succeeded',
                client_secret: 'pi_mock_payment_intent_secret',
                metadata,
            };
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
        }
        catch (error) {
            this.logger.error('Failed to create payment intent:', error);
            throw error;
        }
    }
    async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
        if (!this.stripe) {
            return {
                id: paymentIntentId,
                status: 'succeeded',
                amount: 1000,
                currency: 'usd',
            };
        }
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
                payment_method: paymentMethodId,
            });
            return paymentIntent;
        }
        catch (error) {
            this.logger.error('Failed to confirm payment intent:', error);
            throw error;
        }
    }
    async createRefund(chargeId, amount, reason) {
        if (!this.stripe) {
            return {
                id: 're_mock_refund',
                amount: amount ? Math.round(amount * 100) : 1000,
                currency: 'usd',
                status: 'succeeded',
                charge: chargeId,
                reason,
            };
        }
        try {
            const refund = await this.stripe.refunds.create({
                charge: chargeId,
                amount: amount ? Math.round(amount * 100) : undefined,
                reason: reason,
            });
            return refund;
        }
        catch (error) {
            this.logger.error('Failed to create refund:', error);
            throw error;
        }
    }
    async retrievePaymentIntent(paymentIntentId) {
        if (!this.stripe) {
            return {
                id: paymentIntentId,
                status: 'succeeded',
                amount: 1000,
                currency: 'usd',
            };
        }
        try {
            return await this.stripe.paymentIntents.retrieve(paymentIntentId);
        }
        catch (error) {
            this.logger.error('Failed to retrieve payment intent:', error);
            throw error;
        }
    }
    async createPaymentMethod(type, card) {
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
            };
        }
        try {
            return await this.stripe.paymentMethods.create({
                type: type,
                card,
            });
        }
        catch (error) {
            this.logger.error('Failed to create payment method:', error);
            throw error;
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map