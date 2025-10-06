import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConsultationsController } from './controllers/consultations.controller';
import { ConsultationsService } from './services/consultations.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    PassportModule,
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService, JwtStrategy],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
