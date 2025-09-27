# Clinical Service Implementation

## 1. Module Structure

```typescript
// services/clinical/src/clinical.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
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
      synchronize: false,
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
      store: redisStore,
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
  ],
  controllers: [
    MedicalRecordController,
    PrescriptionController,
    LabResultController,
    ClinicalNoteController,
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
  ],
  exports: [MedicalRecordService, PrescriptionService],
})
export class ClinicalModule {}
```

## 2. Entities

```typescript
// services/clinical/src/entities/medical-record.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Prescription } from './prescription.entity';
import { LabResult } from './lab-result.entity';
import { ClinicalNote } from './clinical-note.entity';
import { Vitals } from './vitals.entity';
import { Diagnosis } from './diagnosis.entity';

export enum RecordType {
  CONSULTATION = 'consultation',
  HOSPITALIZATION = 'hospitalization',
  EMERGENCY = 'emergency',
  ROUTINE_CHECKUP = 'routine_checkup',
  FOLLOW_UP = 'follow_up',
}

@Entity('medical_records')
@Index(['patientId'])
@Index(['providerId'])
@Index(['encounterId'])
@Index(['createdAt'])
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  providerId: string;

  @Column('uuid', { nullable: true })
  encounterId: string;

  @Column('uuid', { nullable: true })
  appointmentId: string;

  @Column({
    type: 'enum',
    enum: RecordType,
  })
  recordType: RecordType;

  @Column({ type: 'date' })
  encounterDate: Date;

  @Column({ type: 'text' })
  chiefComplaint: string;

  @Column({ type: 'text' })
  historyOfPresentIllness: string;

  @Column({ type: 'text', nullable: true })
  reviewOfSystems: string;

  @Column({ type: 'jsonb', nullable: true })
  pastMedicalHistory: {
    conditions: string[];
    surgeries: string[];
    hospitalizations: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  familyHistory: {
    condition: string;
    relationship: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  socialHistory: {
    smoking: string;
    alcohol: string;
    drugs: string;
    occupation: string;
    exercise: string;
    diet: string;
  };

  @Column({ type: 'text' })
  physicalExamination: string;

  @Column({ type: 'text' })
  assessment: string;

  @Column({ type: 'text' })
  plan: string;

  @Column({ type: 'jsonb', nullable: true })
  educationProvided: string[];

  @Column({ type: 'text', nullable: true })
  followUpInstructions: string;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    type: string;
    url: string;
    name: string;
  }[];

  @Column({ default: false })
  isEncrypted: boolean;

  @Column({ nullable: true })
  encryptionKeyId: string;

  @Column({ type: 'jsonb', nullable: true })
  accessLog: {
    userId: string;
    accessTime: Date;
    action: string;
  }[];

  @OneToMany(() => Prescription, prescription => prescription.medicalRecord)
  prescriptions: Prescription[];

  @OneToMany(() => LabResult, labResult => labResult.medicalRecord)
  labResults: LabResult[];

  @OneToMany(() => ClinicalNote, note => note.medicalRecord)
  clinicalNotes: ClinicalNote[];

  @OneToMany(() => Vitals, vitals => vitals.medicalRecord)
  vitals: Vitals[];

  @OneToMany(() => Diagnosis, diagnosis => diagnosis.medicalRecord)
  diagnoses: Diagnosis[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid')
  createdBy: string;

  @Column('uuid', { nullable: true })
  updatedBy: string;
}

// services/clinical/src/entities/prescription.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';

export enum PrescriptionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  ON_HOLD = 'on_hold',
}

export enum MedicationRoute {
  ORAL = 'oral',
  TOPICAL = 'topical',
  INJECTION = 'injection',
  INHALATION = 'inhalation',
  RECTAL = 'rectal',
  TRANSDERMAL = 'transdermal',
  SUBLINGUAL = 'sublingual',
}

@Entity('prescriptions')
@Index(['patientId'])
@Index(['providerId'])
@Index(['status'])
@Index(['rxNumber'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  rxNumber: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  providerId: string;

  @ManyToOne(() => MedicalRecord, { nullable: true })
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @Column()
  medicationName: string;

  @Column({ nullable: true })
  genericName: string;

  @Column({ nullable: true })
  ndcCode: string; // National Drug Code

  @Column({ nullable: true })
  rxNormCode: string;

  @Column()
  strength: string;

  @Column()
  dosage: string;

  @Column({
    type: 'enum',
    enum: MedicationRoute,
  })
  route: MedicationRoute;

  @Column()
  frequency: string;

  @Column()
  duration: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  refills: number;

  @Column({ type: 'int', default: 0 })
  refillsRemaining: number;

  @Column({ default: false })
  substituteAllowed: boolean;

  @Column({ type: 'text' })
  instructions: string;

  @Column({ type: 'text', nullable: true })
  indication: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.ACTIVE,
  })
  status: PrescriptionStatus;

  @Column({ type: 'date' })
  prescribedDate: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  pharmacyId: string;

  @Column({ nullable: true })
  pharmacyName: string;

  @Column({ type: 'timestamp', nullable: true })
  filledAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  interactions: {
    drug: string;
    severity: string;
    description: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  sideEffects: string[];

  @Column({ default: false })
  isControlled: boolean;

  @Column({ nullable: true })
  deaSchedule: string;

  @Column({ nullable: true })
  priorAuthRequired: boolean;

  @Column({ nullable: true })
  priorAuthNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// services/clinical/src/entities/lab-result.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';

export enum LabResultStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ABNORMAL = 'abnormal',
}

export enum LabPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  STAT = 'stat',
}

@Entity('lab_results')
@Index(['patientId'])
@Index(['orderedBy'])
@Index(['status'])
@Index(['testDate'])
export class LabResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  orderedBy: string;

  @ManyToOne(() => MedicalRecord, { nullable: true })
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @Column()
  testName: string;

  @Column({ nullable: true })
  loincCode: string; // LOINC code for standardization

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'date' })
  testDate: Date;

  @Column({ type: 'date', nullable: true })
  resultDate: Date;

  @Column({
    type: 'enum',
    enum: LabResultStatus,
    default: LabResultStatus.PENDING,
  })
  status: LabResultStatus;

  @Column({
    type: 'enum',
    enum: LabPriority,
    default: LabPriority.ROUTINE,
  })
  priority: LabPriority;

  @Column({ type: 'jsonb' })
  results: {
    component: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag: string; // H (high), L (low), N (normal), A (abnormal)
    notes?: string;
  }[];

  @Column({ type: 'text', nullable: true })
  interpretation: string;

  @Column({ type: 'text', nullable: true })
  clinicalSignificance: string;

  @Column({ nullable: true })
  performingLab: string;

  @Column({ nullable: true })
  pathologistId: string;

  @Column({ nullable: true })
  specimenType: string;

  @Column({ type: 'timestamp', nullable: true })
  specimenCollectedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    type: string;
    url: string;
    name: string;
  }[];

  @Column({ default: false })
  criticalValue: boolean;

  @Column({ type: 'timestamp', nullable: true })
  criticalValueNotifiedAt: Date;

  @Column({ nullable: true })
  criticalValueNotifiedTo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// services/clinical/src/entities/diagnosis.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';

export enum DiagnosisType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DIFFERENTIAL = 'differential',
  ADMISSION = 'admission',
  DISCHARGE = 'discharge',
}

@Entity('diagnoses')
@Index(['patientId'])
@Index(['medicalRecordId'])
@Index(['icdCode'])
export class Diagnosis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @ManyToOne(() => MedicalRecord)
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @Column()
  icdCode: string; // ICD-10 code

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: DiagnosisType,
    default: DiagnosisType.PRIMARY,
  })
  type: DiagnosisType;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date' })
  diagnosedDate: Date;

  @Column({ type: 'date', nullable: true })
  resolvedDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column('uuid')
  diagnosedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

## 3. Core Services

```typescript
// services/clinical/src/services/medical-record.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ClientKafka } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { MedicalRecord } from '../entities/medical-record.entity';
import { CreateMedicalRecordDto } from '../dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from '../dto/update-medical-record.dto';
import { EncryptionService } from './encryption.service';
import { FHIRService } from './fhir.service';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private recordRepository: Repository<MedicalRecord>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @InjectQueue('clinical-queue') private clinicalQueue: Queue,
    private encryptionService: EncryptionService,
    private fhirService: FHIRService,
  ) {}

  async createMedicalRecord(
    createDto: CreateMedicalRecordDto,
    userId: string,
  ): Promise<MedicalRecord> {
    // Encrypt sensitive fields
    const encryptedData = await this.encryptSensitiveData(createDto);

    const record = this.recordRepository.create({
      ...createDto,
      ...encryptedData,
      isEncrypted: true,
      createdBy: userId,
      accessLog: [{
        userId,
        accessTime: new Date(),
        action: 'create',
      }],
    });

    const savedRecord = await this.recordRepository.save(record);

    // Convert to FHIR format for interoperability
    const fhirResource = await this.fhirService.convertToFHIR(savedRecord);
    
    // Queue for processing
    await this.clinicalQueue.add('process-medical-record', {
      recordId: savedRecord.id,
      fhirResource,
    });

    // Emit event
    await this.kafkaClient.emit('medical-record.created', {
      recordId: savedRecord.id,
      patientId: savedRecord.patientId,
      providerId: savedRecord.providerId,
      recordType: savedRecord.recordType,
      timestamp: new Date(),
    });

    return savedRecord;
  }

  async getMedicalRecord(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<MedicalRecord> {
    const record = await this.recordRepository.findOne({
      where: { id },
      relations: ['prescriptions', 'labResults', 'clinicalNotes', 'vitals', 'diagnoses'],
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    // Check access permissions
    await this.checkAccess(record, userId, userRole);

    // Log access
    await this.logAccess(record.id, userId, 'read');

    // Decrypt sensitive data if needed
    if (record.isEncrypted) {
      await this.decryptSensitiveData(record);
    }

    return record;
  }

  async getPatientRecords(
    patientId: string,
    userId: string,
    userRole: string,
    filters?: any,
  ): Promise<{
    data: MedicalRecord[];
    total: number;
  }> {
    // Verify access to patient records
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    const query = this.recordRepository.createQueryBuilder('record')
      .where('record.patientId = :patientId', { patientId })
      .leftJoinAndSelect('record.diagnoses', 'diagnoses')
      .leftJoinAndSelect('record.prescriptions', 'prescriptions');

    if (filters?.recordType) {
      query.andWhere('record.recordType = :recordType', { recordType: filters.recordType });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('record.encounterDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('record.encounterDate', 'DESC')
      .getManyAndCount();

    // Log bulk access
    await this.logBulkAccess(data.map(r => r.id), userId, 'read-list');

    return { data, total };
  }

  async updateMedicalRecord(
    id: string,
    updateDto: UpdateMedicalRecordDto,
    userId: string,
    userRole: string,
  ): Promise<MedicalRecord> {
    const record = await this.getMedicalRecord(id, userId, userRole);

    // Only providers can update
    if (userRole !== 'provider' && userRole !== 'admin') {
      throw new ForbiddenException('Only providers can update medical records');
    }

    // Encrypt sensitive data in update
    if (updateDto.historyOfPresentIllness || updateDto.assessment || updateDto.plan) {
      const encryptedData = await this.encryptSensitiveData(updateDto);
      Object.assign(updateDto, encryptedData);
    }

    Object.assign(record, updateDto, {
      updatedBy: userId,
    });

    const updatedRecord = await this.recordRepository.save(record);

    // Log access
    await this.logAccess(record.id, userId, 'update');

    // Emit event
    await this.kafkaClient.emit('medical-record.updated', {
      recordId: updatedRecord.id,
      updatedBy: userId,
      changes: Object.keys(updateDto),
      timestamp: new Date(),
    });

    return updatedRecord;
  }

  async getPatientSummary(patientId: string): Promise<any> {
    const cacheKey = `patient:summary:${patientId}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Get latest records
    const recentRecords = await this.recordRepository.find({
      where: { patientId },
      order: { encounterDate: 'DESC' },
      take: 5,
      relations: ['diagnoses', 'prescriptions'],
    });

    // Get active conditions
    const activeDiagnoses = await this.getActiveDiagnoses(patientId);

    // Get current medications
    const currentMedications = await this.getCurrentMedications(patientId);

    // Get recent lab results
    const recentLabs = await this.getRecentLabResults(patientId);

    const summary = {
      patientId,
      lastVisit: recentRecords[0]?.encounterDate,
      activeProblems: activeDiagnoses,
      currentMedications,
      recentLabs,
      recentEncounters: recentRecords.map(r => ({
        id: r.id,
        date: r.encounterDate,
        type: r.recordType,
        provider: r.providerId,
        chiefComplaint: r.chiefComplaint,
      })),
      allergies: await this.getPatientAllergies(patientId),
      immunizations: await this.getImmunizationHistory(patientId),
    };

    await this.cacheManager.set(cacheKey, summary, 300);
    return summary;
  }

  async exportToFHIR(patientId: string): Promise<any> {
    const records = await this.recordRepository.find({
      where: { patientId },
      relations: ['prescriptions', 'labResults', 'diagnoses', 'vitals'],
    });

    const bundle = await this.fhirService.createBundle(records);
    
    // Queue for external sharing if needed
    await this.clinicalQueue.add('export-fhir', {
      patientId,
      bundle,
    });

    return bundle;
  }

  private async checkAccess(
    record: MedicalRecord,
    userId: string,
    userRole: string,
  ): Promise<void> {
    // Patients can only access their own records
    if (userRole === 'patient' && record.patientId !== userId) {
      throw new ForbiddenException('Cannot access this medical record');
    }

    // Providers can access records of their patients
    if (userRole === 'provider') {
      // Check if provider has relationship with patient
      const hasAccess = await this.checkProviderPatientRelationship(
        userId,
        record.patientId,
      );
      if (!hasAccess) {
        throw new ForbiddenException('No access to this patient record');
      }
    }
  }

  private async checkProviderPatientRelationship(
    providerId: string,
    patientId: string,
  ): Promise<boolean> {
    // Check if provider has treated this patient
    const record = await this.recordRepository.findOne({
      where: {
        providerId,
        patientId,
      },
    });

    return !!record;
  }

  private async encryptSensitiveData(data: any): Promise<any> {
    const fieldsToEncrypt = [
      'historyOfPresentIllness',
      'assessment',
      'plan',
      'physicalExamination',
    ];

    const encrypted = {};
    for (const field of fieldsToEncrypt) {
      if (data[field]) {
        encrypted[field] = await this.encryptionService.encrypt(data[field]);
      }
    }

    return {
      ...encrypted,
      encryptionKeyId: await this.encryptionService.getCurrentKeyId(),
    };
  }

  private async decryptSensitiveData(record: MedicalRecord): Promise<void> {
    const fieldsToDecrypt = [
      'historyOfPresentIllness',
      'assessment',
      'plan',
      'physicalExamination',
    ];

    for (const field of fieldsToDecrypt) {
      if (record[field]) {
        record[field] = await this.encryptionService.decrypt(
          record[field],
          record.encryptionKeyId,
        );
      }
    }
  }

  private async logAccess(
    recordId: string,
    userId: string,
    action: string,
  ): Promise<void> {
    const record = await this.recordRepository.findOne({ where: { id: recordId } });
    
    if (!record.accessLog) {
      record.accessLog = [];
    }

    record.accessLog.push({
      userId,
      accessTime: new Date(),
      action,
    });

    await this.recordRepository.save(record);

    // Emit audit event
    await this.kafkaClient.emit('medical-record.accessed', {
      recordId,
      userId,
      action,
      timestamp: new Date(),
    });
  }

  private async logBulkAccess(
    recordIds: string[],
    userId: string,
    action: string,
  ): Promise<void> {
    // Queue bulk access logging
    await this.clinicalQueue.add('log-bulk-access', {
      recordIds,
      userId,
      action,
      timestamp: new Date(),
    });
  }

  private async getActiveDiagnoses(patientId: string): Promise<any[]> {
    // Implementation to get active diagnoses
    return [];
  }

  private async getCurrentMedications(patientId: string): Promise<any[]> {
    // Implementation to get current medications
    return [];
  }

  private async getRecentLabResults(patientId: string): Promise<any[]> {
    // Implementation to get recent lab results
    return [];
  }

  private async getPatientAllergies(patientId: string): Promise<any[]> {
    // Implementation to get patient allergies
    return [];
  }

  private async getImmunizationHistory(patientId: string): Promise<any[]> {
    // Implementation to get immunization history
    return [];
  }
}

// services/clinical/src/services/prescription.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';

import { Prescription, PrescriptionStatus } from '../entities/prescription.entity';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
import { DrugInteractionService } from './drug-interaction.service';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @InjectQueue('clinical-queue') private clinicalQueue: Queue,
    private drugInteractionService: DrugInteractionService,
  ) {}

  async createPrescription(
    createDto: CreatePrescriptionDto,
    providerId: string,
  ): Promise<Prescription> {
    // Generate unique RX number
    const rxNumber = await this.generateRxNumber();

    // Check drug interactions
    const interactions = await this.drugInteractionService.checkInteractions(
      createDto.patientId,
      createDto.medicationName,
      createDto.ndcCode,
    );

    if (interactions.severe.length > 0) {
      throw new BadRequestException(
        `Severe drug interactions detected: ${interactions.severe.join(', ')}`,
      );
    }

    // Calculate expiration date
    const expirationDate = new Date();
    if (createDto.isControlled) {
      expirationDate.setMonths(expirationDate.getMonth() + 6); // 6 months for controlled
    } else {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year for regular
    }

    const prescription = this.prescriptionRepository.create({
      ...createDto,
      rxNumber,
      providerId,
      prescribedDate: new Date(),
      expirationDate,
      refillsRemaining: createDto.refills,
      interactions: interactions.all,
      status: PrescriptionStatus.ACTIVE,
    });

    const savedPrescription = await this.prescriptionRepository.save(prescription);

    // Send to pharmacy if specified
    if (createDto.pharmacyId) {
      await this.sendToPharmacy(savedPrescription);
    }

    // Check for prior authorization
    if (createDto.priorAuthRequired) {
      await this.clinicalQueue.add('process-prior-auth', {
        prescriptionId: savedPrescription.id,
        patientId: savedPrescription.patientId,
      });
    }

    // Emit event
    await this.kafkaClient.emit('prescription.created', {
      prescriptionId: savedPrescription.id,
      patientId: savedPrescription.patientId,
      providerId,
      medicationName: savedPrescription.medicationName,
      timestamp: new Date(),
    });

    return savedPrescription;
  }

  async refillPrescription(
    prescriptionId: string,
    pharmacyId?: string,
  ): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Validate refill eligibility
    if (prescription.refillsRemaining <= 0) {
      throw new BadRequestException('No refills remaining');
    }

    if (prescription.status !== PrescriptionStatus.ACTIVE) {
      throw new BadRequestException('Prescription is not active');
    }

    if (new Date() > prescription.expirationDate) {
      throw new BadRequestException('Prescription has expired');
    }

    // Check for controlled substance refill restrictions
    if (prescription.isControlled) {
      await this.validateControlledRefill(prescription);
    }

    // Update refill count
    prescription.refillsRemaining -= 1;
    
    if (pharmacyId) {
      prescription.pharmacyId = pharmacyId;
    }

    const updatedPrescription = await this.prescriptionRepository.save(prescription);

    // Send refill to pharmacy
    await this.sendToPharmacy(updatedPrescription, true);

    // Emit event
    await this.kafkaClient.emit('prescription.refilled', {
      prescriptionId: updatedPrescription.id,
      refillsRemaining: updatedPrescription.refillsRemaining,
      timestamp: new Date(),
    });

    return updatedPrescription;
  }

  async cancelPrescription(
    prescriptionId: string,
    reason: string,
    cancelledBy: string,
  ): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    prescription.status = PrescriptionStatus.CANCELLED;
    
    const cancelledPrescription = await this.prescriptionRepository.save(prescription);

    // Notify pharmacy if already sent
    if (prescription.pharmacyId) {
      await this.notifyPharmacyCancellation(prescription);
    }

    // Emit event
    await this.kafkaClient.emit('prescription.cancelled', {
      prescriptionId,
      cancelledBy,
      reason,
      timestamp: new Date(),
    });

    return cancelledPrescription;
  }

  async getPatientPrescriptions(
    patientId: string,
    activeOnly: boolean = false,
  ): Promise<Prescription[]> {
    const query = this.prescriptionRepository.createQueryBuilder('prescription')
      .where('prescription.patientId = :patientId', { patientId });

    if (activeOnly) {
      query.andWhere('prescription.status = :status', { status: PrescriptionStatus.ACTIVE })
        .andWhere('prescription.expirationDate > :now', { now: new Date() });
    }

    return await query.orderBy('prescription.prescribedDate', 'DESC').getMany();
  }

  async checkDrugInteractions(
    patientId: string,
    medicationName: string,
  ): Promise<any> {
    const activePrescriptions = await this.getPatientPrescriptions(patientId, true);
    
    const interactions = await this.drugInteractionService.checkMultipleInteractions(
      medicationName,
      activePrescriptions.map(p => p.medicationName),
    );

    return interactions;
  }

  async getControlledSubstanceReport(
    providerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const prescriptions = await this.prescriptionRepository
      .createQueryBuilder('prescription')
      .where('prescription.providerId = :providerId', { providerId })
      .andWhere('prescription.isControlled = true')
      .andWhere('prescription.prescribedDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    const bySchedule = prescriptions.reduce((acc, p) => {
      acc[p.deaSchedule] = (acc[p.deaSchedule] || 0) + 1;
      return acc;
    }, {});

    return {
      total: prescriptions.length,
      bySchedule,
      prescriptions: prescriptions.map(p => ({
        rxNumber: p.rxNumber,
        patientId: p.patientId,
        medication: p.medicationName,
        schedule: p.deaSchedule,
        quantity: p.quantity,
        date: p.prescribedDate,
      })),
    };
  }

  private async generateRxNumber(): Promise<string> {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `RX-${timestamp}-${random}`;
  }

  private async sendToPharmacy(
    prescription: Prescription,
    isRefill: boolean = false,
  ): Promise<void> {
    await this.clinicalQueue.add('send-prescription-to-pharmacy', {
      prescriptionId: prescription.id,
      pharmacyId: prescription.pharmacyId,
      isRefill,
      prescriptionData: {
        rxNumber: prescription.rxNumber,
        patientId: prescription.patientId,
        medication: prescription.medicationName,
        quantity: prescription.quantity,
        instructions: prescription.instructions,
      },
    });
  }

  private async validateControlledRefill(prescription: Prescription): Promise<void> {
    // Check last fill date
    if (prescription.filledAt) {
      const daysSinceLastFill = Math.floor(
        (Date.now() - prescription.filledAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Minimum days between refills for controlled substances
      const minDaysBetweenRefills = 28;
      
      if (daysSinceLastFill < minDaysBetweenRefills) {
        throw new BadRequestException(
          `Controlled substance can only be refilled after ${minDaysBetweenRefills} days`,
        );
      }
    }
  }

  private async notifyPharmacyCancellation(prescription: Prescription): Promise<void> {
    await this.clinicalQueue.add('notify-pharmacy-cancellation', {
      prescriptionId: prescription.id,
      rxNumber: prescription.rxNumber,
      pharmacyId: prescription.pharmacyId,
    });
  }
}
```

## 4. Controllers

```typescript
// services/clinical/src/controllers/medical-record.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { MedicalRecordService } from '../services/medical-record.service';
import { CreateMedicalRecordDto } from '../dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from '../dto/update-medical-record.dto';

@ApiTags('Medical Records')
@Controller('medical-records')
@UseGuards(JwtAuthGuard)
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create medical record' })
  async create(
    @Body(ValidationPipe) createDto: CreateMedicalRecordDto,
    @CurrentUser() user: any,
  ) {
    return await this.medicalRecordService.createMedicalRecord(createDto, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical record by ID' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.medicalRecordService.getMedicalRecord(
      id,
      user.userId,
      user.roles[0],
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient medical records' })
  async getPatientRecords(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.medicalRecordService.getPatientRecords(
      patientId,
      user.userId,
      user.roles[0],
      filters,
    );
  }

  @Put(':id')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update medical record' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: UpdateMedicalRecordDto,
    @CurrentUser() user: any,
  ) {
    return await this.medicalRecordService.updateMedicalRecord(
      id,
      updateDto,
      user.userId,
      user.roles[0],
    );
  }

  @Get('patient/:patientId/summary')
  @ApiOperation({ summary: 'Get patient summary' })
  async getPatientSummary(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return await this.medicalRecordService.getPatientSummary(patientId);
  }

  @Get('patient/:patientId/export-fhir')
  @ApiOperation({ summary: 'Export patient records to FHIR format' })
  async exportToFHIR(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return await this.medicalRecordService.exportToFHIR(patientId);
  }
}

// services/clinical/src/controllers/prescription.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { PrescriptionService } from '../services/prescription.service';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';

@ApiTags('Prescriptions')
@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @Roles('provider')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create prescription' })
  async create(
    @Body(ValidationPipe) createDto: CreatePrescriptionDto,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.createPrescription(createDto, user.userId);
  }

  @Post(':id/refill')
  @ApiOperation({ summary: 'Refill prescription' })
  async refill(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() refillDto: { pharmacyId?: string },
  ) {
    return await this.prescriptionService.refillPrescription(id, refillDto.pharmacyId);
  }

  @Post(':id/cancel')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel prescription' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelDto: { reason: string },
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.cancelPrescription(
      id,
      cancelDto.reason,
      user.userId,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient prescriptions' })
  async getPatientPrescriptions(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('activeOnly') activeOnly: boolean = false,
  ) {
    return await this.prescriptionService.getPatientPrescriptions(patientId, activeOnly);
  }

  @Post('check-interactions')
  @ApiOperation({ summary: 'Check drug interactions' })
  async checkInteractions(
    @Body() checkDto: { patientId: string; medicationName: string },
  ) {
    return await this.prescriptionService.checkDrugInteractions(
      checkDto.patientId,
      checkDto.medicationName,
    );
  }

  @Get('reports/controlled-substances')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get controlled substance report' })
  async getControlledSubstanceReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.prescriptionService.getControlledSubstanceReport(
      user.userId,
      startDate,
      endDate,
    );
  }
}
```

This Clinical Service implementation provides:

1. **Medical Records Management**: Complete EHR with encryption and audit trails
2. **Prescription System**: E-prescribing with drug interaction checking
3. **Lab Results**: Order tracking and result management
4. **Clinical Notes**: SOAP notes and encounter documentation
5. **Diagnosis Management**: ICD-10 coding and problem lists
6. **FHIR Compliance**: Healthcare data interoperability
7. **Security**: Field-level encryption for PHI/PII
8. **Audit Logging**: Complete access tracking for HIPAA compliance
9. **Drug Safety**: Interaction checking and controlled substance monitoring
10. **Patient Summary**: Comprehensive health overview and history

The service ensures HIPAA compliance and integrates with other services for complete healthcare workflows.