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
    const recordData = Array.isArray(savedRecord) ? savedRecord[0] : savedRecord;

    // Convert to FHIR format for interoperability
    const fhirResource = await this.fhirService.convertToFHIR(recordData);
    
    // Queue for processing
    await this.clinicalQueue.add('process-medical-record', {
      recordId: recordData.id,
      fhirResource,
    });

    // Emit event
    await this.kafkaClient.emit('medical-record.created', {
      recordId: recordData.id,
      patientId: recordData.patientId,
      providerId: recordData.providerId,
      recordType: recordData.recordType,
      timestamp: new Date(),
    });

    return recordData;
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
