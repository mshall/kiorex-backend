import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as redisStore from 'cache-manager-redis-store';

// Entities
import { MedicalRecord } from './entities/medical-record.entity';
import { Prescription } from './entities/prescription.entity';
import { LabResult } from './entities/lab-result.entity';
import { ClinicalNote } from './entities/clinical-note.entity';
import { Vitals } from './entities/vitals.entity';
import { Allergy } from './entities/allergy.entity';
import { Medication } from './entities/medication.entity';
import { Diagnosis } from './entities/diagnosis.entity';
import { Procedure } from './entities/procedure.entity';
import { Immunization } from './entities/immunization.entity';

// Controllers
import { MedicalRecordController } from './controllers/medical-record.controller';
import { PrescriptionController } from './controllers/prescription.controller';
import { LabResultController } from './controllers/lab-result.controller';
import { ClinicalNoteController } from './controllers/clinical-note.controller';
import { VitalsController } from './controllers/vitals.controller';

// Services  
import { MedicalRecordService } from './services/medical-record.service';
import { PrescriptionService } from './services/prescription.service';
import { LabResultService } from './services/lab-result.service';
import { ClinicalNoteService } from './services/clinical-note.service';
import { VitalsService } from './services/vitals.service';
import { FHIRService } from './services/fhir.service';
import { EncryptionService } from './services/encryption.service';
import { DrugInteractionService } from './services/drug-interaction.service';

// Processors
import { ClinicalProcessor } from './processors/clinical.processor';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([
      MedicalRecord,
      Prescription,
      LabResult,
      ClinicalNote,
      Vitals,
      Allergy,
      Medication,
      Diagnosis,
      Procedure,
      Immunization,
    ]),
    CacheModule.register({
      store: redisStore as any,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 600,
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'clinical-service',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'clinical-service-consumer',
          },
        },
      },
    ]),
    BullModule.registerQueue({
      name: 'clinical-queue',
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [
    MedicalRecordController,
    PrescriptionController,
    LabResultController,
    ClinicalNoteController,
    VitalsController,
  ],
  providers: [
    MedicalRecordService,
    PrescriptionService,
    LabResultService,
    ClinicalNoteService,
    VitalsService,
    FHIRService,
    EncryptionService,
    DrugInteractionService,
    ClinicalProcessor,
    JwtStrategy,
  ],
  exports: [],
})
export class ClinicalModule {}
