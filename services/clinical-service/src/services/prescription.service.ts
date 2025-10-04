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
      expirationDate.setMonth(expirationDate.getMonth() + 6); // 6 months for controlled
    } else {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year for regular
    }

    const prescription = this.prescriptionRepository.create({
      ...createDto,
      rxNumber,
      providerId,
      prescribedDate: new Date(),
      expirationDate,
      refillsRemaining: createDto.refills || 0,
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
