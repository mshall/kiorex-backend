import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { Refund, RefundStatus } from '../entities/refund.entity';
import { PaymentMethod } from '../entities/payment-method.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CreateRefundDto } from '../dto/create-refund.dto';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Refund)
    private refundRepository: Repository<Refund>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    private stripeService: StripeService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = this.paymentRepository.create({
        ...createPaymentDto,
        status: PaymentStatus.PENDING,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // Create Stripe payment intent
      const paymentIntent = await this.stripeService.createPaymentIntent(
        createPaymentDto.amount,
        createPaymentDto.currency || 'USD',
        {
          paymentId: savedPayment.id,
          userId: createPaymentDto.userId,
          appointmentId: createPaymentDto.appointmentId,
        }
      );

      // Update payment with Stripe details
      savedPayment.stripePaymentIntentId = paymentIntent.id;
      savedPayment.status = PaymentStatus.PROCESSING;

      return await this.paymentRepository.save(savedPayment);
    } catch (error) {
      this.logger.error('Failed to create payment:', error);
      throw new BadRequestException('Failed to create payment');
    }
  }

  async confirmPayment(paymentId: string, paymentMethodId?: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PROCESSING) {
      throw new BadRequestException('Payment is not in processing status');
    }

    try {
      const paymentIntent = await this.stripeService.confirmPaymentIntent(
        payment.stripePaymentIntentId,
        paymentMethodId
      );

      if (paymentIntent.status === 'succeeded') {
        payment.status = PaymentStatus.COMPLETED;
        payment.processedAt = new Date();
        payment.stripeChargeId = (paymentIntent as any).charges?.data[0]?.id;
        payment.transactionId = paymentIntent.id;
      } else {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
      }

      return await this.paymentRepository.save(payment);
    } catch (error) {
      this.logger.error('Failed to confirm payment:', error);
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = error.message;
      await this.paymentRepository.save(payment);
      throw new BadRequestException('Failed to confirm payment');
    }
  }

  async getPayment(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentsByAppointment(appointmentId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { appointmentId },
      order: { createdAt: 'DESC' },
    });
  }

  async createRefund(createRefundDto: CreateRefundDto): Promise<Refund> {
    const payment = await this.paymentRepository.findOne({
      where: { id: createRefundDto.paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment must be completed to create refund');
    }

    const refundAmount = createRefundDto.amount || payment.amount;

    if (refundAmount > payment.amount) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    try {
      const refund = this.refundRepository.create({
        ...createRefundDto,
        amount: refundAmount,
        currency: payment.currency,
        status: RefundStatus.PENDING,
      });

      const savedRefund = await this.refundRepository.save(refund);

      // Create Stripe refund
      const stripeRefund = await this.stripeService.createRefund(
        payment.stripeChargeId,
        refundAmount,
        createRefundDto.reason
      );

      savedRefund.stripeRefundId = stripeRefund.id;
      savedRefund.status = RefundStatus.SUCCEEDED;
      savedRefund.processedAt = new Date();

      const updatedRefund = await this.refundRepository.save(savedRefund);

      // Update payment
      payment.status = PaymentStatus.REFUNDED;
      payment.refundAmount = refundAmount;
      payment.refundedAt = new Date();
      await this.paymentRepository.save(payment);

      return updatedRefund;
    } catch (error) {
      this.logger.error('Failed to create refund:', error);
      throw new BadRequestException('Failed to create refund');
    }
  }

  async getRefundsByUser(userId: string): Promise<Refund[]> {
    return this.refundRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getRefundsByPayment(paymentId: string): Promise<Refund[]> {
    return this.refundRepository.find({
      where: { paymentId },
      order: { createdAt: 'DESC' },
    });
  }

  async createPaymentMethod(userId: string, type: string, card: any): Promise<PaymentMethod> {
    try {
      const paymentMethod = await this.stripeService.createPaymentMethod(type, card);

      const savedPaymentMethod = this.paymentMethodRepository.create({
        userId,
        type: type as any,
        stripePaymentMethodId: paymentMethod.id,
        last4: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
        expMonth: paymentMethod.card?.exp_month,
        expYear: paymentMethod.card?.exp_year,
        funding: paymentMethod.card?.funding,
      });

      return await this.paymentMethodRepository.save(savedPaymentMethod);
    } catch (error) {
      this.logger.error('Failed to create payment method:', error);
      throw new BadRequestException('Failed to create payment method');
    }
  }

  async getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      where: { userId, isActive: true },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethod> {
    // Remove default from all payment methods
    await this.paymentMethodRepository.update(
      { userId },
      { isDefault: false }
    );

    // Set new default
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    paymentMethod.isDefault = true;
    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    paymentMethod.isActive = false;
    await this.paymentMethodRepository.save(paymentMethod);
  }
}
