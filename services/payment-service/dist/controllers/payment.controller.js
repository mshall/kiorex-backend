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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("../services/payment.service");
const create_payment_dto_1 = require("../dto/create-payment.dto");
const create_refund_dto_1 = require("../dto/create-refund.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createPayment(createPaymentDto, req) {
        if (createPaymentDto.userId !== req.user.userId) {
            createPaymentDto.userId = req.user.userId;
        }
        return this.paymentService.createPayment(createPaymentDto);
    }
    async confirmPayment(paymentId, body, req) {
        const payment = await this.paymentService.getPayment(paymentId);
        if (payment.userId !== req.user.userId) {
            throw new Error('Unauthorized');
        }
        return this.paymentService.confirmPayment(paymentId, body.paymentMethodId);
    }
    async getPaymentsByUser(req) {
        return this.paymentService.getPaymentsByUser(req.user.userId);
    }
    async getPayment(paymentId, req) {
        const payment = await this.paymentService.getPayment(paymentId);
        if (payment.userId !== req.user.userId) {
            throw new Error('Unauthorized');
        }
        return payment;
    }
    async getPaymentsByAppointment(appointmentId, req) {
        return this.paymentService.getPaymentsByAppointment(appointmentId);
    }
    async createRefund(createRefundDto, req) {
        if (createRefundDto.userId !== req.user.userId) {
            createRefundDto.userId = req.user.userId;
        }
        return this.paymentService.createRefund(createRefundDto);
    }
    async getRefundsByUser(req) {
        return this.paymentService.getRefundsByUser(req.user.userId);
    }
    async getRefundsByPayment(paymentId) {
        return this.paymentService.getRefundsByPayment(paymentId);
    }
    async createPaymentMethod(body, req) {
        return this.paymentService.createPaymentMethod(req.user.userId, body.type, body.card);
    }
    async getPaymentMethodsByUser(req) {
        return this.paymentService.getPaymentMethodsByUser(req.user.userId);
    }
    async setDefaultPaymentMethod(paymentMethodId, req) {
        return this.paymentService.setDefaultPaymentMethod(req.user.userId, paymentMethodId);
    }
    async deletePaymentMethod(paymentMethodId, req) {
        await this.paymentService.deletePaymentMethod(req.user.userId, paymentMethodId);
        return { message: 'Payment method deleted successfully' };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentsByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Get)('appointment/:appointmentId'),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentsByAppointment", null);
__decorate([
    (0, common_1.Post)('refunds'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_refund_dto_1.CreateRefundDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createRefund", null);
__decorate([
    (0, common_1.Get)('refunds'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getRefundsByUser", null);
__decorate([
    (0, common_1.Get)('refunds/:paymentId'),
    __param(0, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getRefundsByPayment", null);
__decorate([
    (0, common_1.Post)('payment-methods'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentMethod", null);
__decorate([
    (0, common_1.Get)('payment-methods'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentMethodsByUser", null);
__decorate([
    (0, common_1.Put)('payment-methods/:id/default'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "setDefaultPaymentMethod", null);
__decorate([
    (0, common_1.Delete)('payment-methods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "deletePaymentMethod", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map