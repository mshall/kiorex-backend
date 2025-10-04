import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CreateRefundDto } from '../dto/create-refund.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    // Ensure user can only create payments for themselves
    if (createPaymentDto.userId !== req.user.userId) {
      createPaymentDto.userId = req.user.userId;
    }
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Post(':id/confirm')
  async confirmPayment(
    @Param('id') paymentId: string,
    @Body() body: { paymentMethodId?: string },
    @Request() req,
  ) {
    const payment = await this.paymentService.getPayment(paymentId);
    
    // Ensure user can only confirm their own payments
    if (payment.userId !== req.user.userId) {
      throw new Error('Unauthorized');
    }
    
    return this.paymentService.confirmPayment(paymentId, body.paymentMethodId);
  }

  @Get()
  async getPaymentsByUser(@Request() req) {
    return this.paymentService.getPaymentsByUser(req.user.userId);
  }

  @Get(':id')
  async getPayment(@Param('id') paymentId: string, @Request() req) {
    const payment = await this.paymentService.getPayment(paymentId);
    
    // Ensure user can only view their own payments
    if (payment.userId !== req.user.userId) {
      throw new Error('Unauthorized');
    }
    
    return payment;
  }

  @Get('appointment/:appointmentId')
  async getPaymentsByAppointment(
    @Param('appointmentId') appointmentId: string,
    @Request() req,
  ) {
    return this.paymentService.getPaymentsByAppointment(appointmentId);
  }

  @Post('refunds')
  async createRefund(@Body() createRefundDto: CreateRefundDto, @Request() req) {
    // Ensure user can only create refunds for their own payments
    if (createRefundDto.userId !== req.user.userId) {
      createRefundDto.userId = req.user.userId;
    }
    return this.paymentService.createRefund(createRefundDto);
  }

  @Get('refunds')
  async getRefundsByUser(@Request() req) {
    return this.paymentService.getRefundsByUser(req.user.userId);
  }

  @Get('refunds/:paymentId')
  async getRefundsByPayment(@Param('paymentId') paymentId: string) {
    return this.paymentService.getRefundsByPayment(paymentId);
  }

  @Post('payment-methods')
  async createPaymentMethod(
    @Body() body: { type: string; card: any },
    @Request() req,
  ) {
    return this.paymentService.createPaymentMethod(req.user.userId, body.type, body.card);
  }

  @Get('payment-methods')
  async getPaymentMethodsByUser(@Request() req) {
    return this.paymentService.getPaymentMethodsByUser(req.user.userId);
  }

  @Put('payment-methods/:id/default')
  async setDefaultPaymentMethod(
    @Param('id') paymentMethodId: string,
    @Request() req,
  ) {
    return this.paymentService.setDefaultPaymentMethod(req.user.userId, paymentMethodId);
  }

  @Delete('payment-methods/:id')
  async deletePaymentMethod(
    @Param('id') paymentMethodId: string,
    @Request() req,
  ) {
    await this.paymentService.deletePaymentMethod(req.user.userId, paymentMethodId);
    return { message: 'Payment method deleted successfully' };
  }
}
