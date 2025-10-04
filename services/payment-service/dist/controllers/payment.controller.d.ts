import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CreateRefundDto } from '../dto/create-refund.dto';
export declare class PaymentController {
    private paymentService;
    constructor(paymentService: PaymentService);
    createPayment(createPaymentDto: CreatePaymentDto, req: any): Promise<import("../entities/payment.entity").Payment>;
    confirmPayment(paymentId: string, body: {
        paymentMethodId?: string;
    }, req: any): Promise<import("../entities/payment.entity").Payment>;
    getPaymentsByUser(req: any): Promise<import("../entities/payment.entity").Payment[]>;
    getPayment(paymentId: string, req: any): Promise<import("../entities/payment.entity").Payment>;
    getPaymentsByAppointment(appointmentId: string, req: any): Promise<import("../entities/payment.entity").Payment[]>;
    createRefund(createRefundDto: CreateRefundDto, req: any): Promise<import("../entities/refund.entity").Refund>;
    getRefundsByUser(req: any): Promise<import("../entities/refund.entity").Refund[]>;
    getRefundsByPayment(paymentId: string): Promise<import("../entities/refund.entity").Refund[]>;
    createPaymentMethod(body: {
        type: string;
        card: any;
    }, req: any): Promise<import("../entities/payment-method.entity").PaymentMethod>;
    getPaymentMethodsByUser(req: any): Promise<import("../entities/payment-method.entity").PaymentMethod[]>;
    setDefaultPaymentMethod(paymentMethodId: string, req: any): Promise<import("../entities/payment-method.entity").PaymentMethod>;
    deletePaymentMethod(paymentMethodId: string, req: any): Promise<{
        message: string;
    }>;
}
