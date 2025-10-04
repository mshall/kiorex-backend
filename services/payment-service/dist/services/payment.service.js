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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const refund_entity_1 = require("../entities/refund.entity");
const payment_method_entity_1 = require("../entities/payment-method.entity");
const stripe_service_1 = require("./stripe.service");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(paymentRepository, refundRepository, paymentMethodRepository, stripeService) {
        this.paymentRepository = paymentRepository;
        this.refundRepository = refundRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.stripeService = stripeService;
        this.logger = new common_1.Logger(PaymentService_1.name);
    }
    async createPayment(createPaymentDto) {
        try {
            const payment = this.paymentRepository.create({
                ...createPaymentDto,
                status: payment_entity_1.PaymentStatus.PENDING,
            });
            const savedPayment = await this.paymentRepository.save(payment);
            const paymentIntent = await this.stripeService.createPaymentIntent(createPaymentDto.amount, createPaymentDto.currency || 'USD', {
                paymentId: savedPayment.id,
                userId: createPaymentDto.userId,
                appointmentId: createPaymentDto.appointmentId,
            });
            savedPayment.stripePaymentIntentId = paymentIntent.id;
            savedPayment.status = payment_entity_1.PaymentStatus.PROCESSING;
            return await this.paymentRepository.save(savedPayment);
        }
        catch (error) {
            this.logger.error('Failed to create payment:', error);
            throw new common_1.BadRequestException('Failed to create payment');
        }
    }
    async confirmPayment(paymentId, paymentMethodId) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== payment_entity_1.PaymentStatus.PROCESSING) {
            throw new common_1.BadRequestException('Payment is not in processing status');
        }
        try {
            const paymentIntent = await this.stripeService.confirmPaymentIntent(payment.stripePaymentIntentId, paymentMethodId);
            if (paymentIntent.status === 'succeeded') {
                payment.status = payment_entity_1.PaymentStatus.COMPLETED;
                payment.processedAt = new Date();
                payment.stripeChargeId = paymentIntent.charges?.data[0]?.id;
                payment.transactionId = paymentIntent.id;
            }
            else {
                payment.status = payment_entity_1.PaymentStatus.FAILED;
                payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
            }
            return await this.paymentRepository.save(payment);
        }
        catch (error) {
            this.logger.error('Failed to confirm payment:', error);
            payment.status = payment_entity_1.PaymentStatus.FAILED;
            payment.failureReason = error.message;
            await this.paymentRepository.save(payment);
            throw new common_1.BadRequestException('Failed to confirm payment');
        }
    }
    async getPayment(paymentId) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async getPaymentsByUser(userId) {
        return this.paymentRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getPaymentsByAppointment(appointmentId) {
        return this.paymentRepository.find({
            where: { appointmentId },
            order: { createdAt: 'DESC' },
        });
    }
    async createRefund(createRefundDto) {
        const payment = await this.paymentRepository.findOne({
            where: { id: createRefundDto.paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Payment must be completed to create refund');
        }
        const refundAmount = createRefundDto.amount || payment.amount;
        if (refundAmount > payment.amount) {
            throw new common_1.BadRequestException('Refund amount cannot exceed payment amount');
        }
        try {
            const refund = this.refundRepository.create({
                ...createRefundDto,
                amount: refundAmount,
                currency: payment.currency,
                status: refund_entity_1.RefundStatus.PENDING,
            });
            const savedRefund = await this.refundRepository.save(refund);
            const stripeRefund = await this.stripeService.createRefund(payment.stripeChargeId, refundAmount, createRefundDto.reason);
            savedRefund.stripeRefundId = stripeRefund.id;
            savedRefund.status = refund_entity_1.RefundStatus.SUCCEEDED;
            savedRefund.processedAt = new Date();
            const updatedRefund = await this.refundRepository.save(savedRefund);
            payment.status = payment_entity_1.PaymentStatus.REFUNDED;
            payment.refundAmount = refundAmount;
            payment.refundedAt = new Date();
            await this.paymentRepository.save(payment);
            return updatedRefund;
        }
        catch (error) {
            this.logger.error('Failed to create refund:', error);
            throw new common_1.BadRequestException('Failed to create refund');
        }
    }
    async getRefundsByUser(userId) {
        return this.refundRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getRefundsByPayment(paymentId) {
        return this.refundRepository.find({
            where: { paymentId },
            order: { createdAt: 'DESC' },
        });
    }
    async createPaymentMethod(userId, type, card) {
        try {
            const paymentMethod = await this.stripeService.createPaymentMethod(type, card);
            const savedPaymentMethod = this.paymentMethodRepository.create({
                userId,
                type: type,
                stripePaymentMethodId: paymentMethod.id,
                last4: paymentMethod.card?.last4,
                brand: paymentMethod.card?.brand,
                expMonth: paymentMethod.card?.exp_month,
                expYear: paymentMethod.card?.exp_year,
                funding: paymentMethod.card?.funding,
            });
            return await this.paymentMethodRepository.save(savedPaymentMethod);
        }
        catch (error) {
            this.logger.error('Failed to create payment method:', error);
            throw new common_1.BadRequestException('Failed to create payment method');
        }
    }
    async getPaymentMethodsByUser(userId) {
        return this.paymentMethodRepository.find({
            where: { userId, isActive: true },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
    }
    async setDefaultPaymentMethod(userId, paymentMethodId) {
        await this.paymentMethodRepository.update({ userId }, { isDefault: false });
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: { id: paymentMethodId, userId },
        });
        if (!paymentMethod) {
            throw new common_1.NotFoundException('Payment method not found');
        }
        paymentMethod.isDefault = true;
        return await this.paymentMethodRepository.save(paymentMethod);
    }
    async deletePaymentMethod(userId, paymentMethodId) {
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: { id: paymentMethodId, userId },
        });
        if (!paymentMethod) {
            throw new common_1.NotFoundException('Payment method not found');
        }
        paymentMethod.isActive = false;
        await this.paymentMethodRepository.save(paymentMethod);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(refund_entity_1.Refund)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_method_entity_1.PaymentMethod)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_service_1.StripeService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map