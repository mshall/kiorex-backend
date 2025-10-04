import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Payment } from './entities/payment.entity';
import { Refund } from './entities/refund.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';
import { PaymentController } from './controllers/payment.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Payment, Refund, PaymentMethod]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, JwtStrategy, RolesGuard],
  exports: [PaymentService],
})
export class PaymentModule {}
