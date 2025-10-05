import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Medication } from './entities/medication.entity';
import { Prescription } from './entities/prescription.entity';
import { Inventory } from './entities/inventory.entity';
import { MedicationInteraction } from './entities/medication-interaction.entity';
import { MedicationAllergy } from './entities/medication-allergy.entity';
import { MedicationService } from './services/medication.service';
import { PrescriptionService } from './services/prescription.service';
import { InventoryService } from './services/inventory.service';
import { MedicationController } from './controllers/medication.controller';
import { PrescriptionController } from './controllers/prescription.controller';
import { InventoryController } from './controllers/inventory.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Medication,
      Prescription,
      Inventory,
      MedicationInteraction,
      MedicationAllergy,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [MedicationController, PrescriptionController, InventoryController],
  providers: [MedicationService, PrescriptionService, InventoryService, JwtStrategy],
  exports: [MedicationService, PrescriptionService, InventoryService],
})
export class PharmacyModule {}
