import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Refund } from '../entities/refund.entity';
import { PaymentMethod } from '../entities/payment-method.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CreateRefundDto } from '../dto/create-refund.dto';
import { StripeService } from './stripe.service';
export declare class PaymentService {
    private paymentRepository;
    private refundRepository;
    private paymentMethodRepository;
    private stripeService;
    private readonly logger;
    constructor(paymentRepository: Repository<Payment>, refundRepository: Repository<Refund>, paymentMethodRepository: Repository<PaymentMethod>, stripeService: StripeService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    confirmPayment(paymentId: string, paymentMethodId?: string): Promise<Payment>;
    getPayment(paymentId: string): Promise<Payment>;
    getPaymentsByUser(userId: string): Promise<Payment[]>;
    getPaymentsByAppointment(appointmentId: string): Promise<Payment[]>;
    createRefund(createRefundDto: CreateRefundDto): Promise<Refund>;
    getRefundsByUser(userId: string): Promise<Refund[]>;
    getRefundsByPayment(paymentId: string): Promise<Refund[]>;
    createPaymentMethod(userId: string, type: string, card: any): Promise<PaymentMethod>;
    getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]>;
    setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethod>;
    deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void>;
}
