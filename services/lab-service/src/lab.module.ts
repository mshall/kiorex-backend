import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LabOrder } from './entities/lab-order.entity';
import { LabResult } from './entities/lab-result.entity';
import { LabTest } from './entities/lab-test.entity';
import { LabOrderService } from './services/lab-order.service';
import { LabResultService } from './services/lab-result.service';
import { LabTestService } from './services/lab-test.service';
import { LabOrderController } from './controllers/lab-order.controller';
import { LabResultController } from './controllers/lab-result.controller';
import { LabTestController } from './controllers/lab-test.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([LabOrder, LabResult, LabTest]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [LabOrderController, LabResultController, LabTestController],
  providers: [LabOrderService, LabResultService, LabTestService, JwtStrategy],
  exports: [LabOrderService, LabResultService, LabTestService],
})
export class LabModule {}
