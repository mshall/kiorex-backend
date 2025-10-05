import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription, PrescriptionStatus } from '../entities/prescription.entity';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
  ) {}

  async createPrescription(createDto: CreatePrescriptionDto, userId: string): Promise<Prescription> {
    const prescription = this.prescriptionRepository.create({
      ...createDto,
      status: PrescriptionStatus.PENDING,
      prescribedBy: userId,
      prescribedAt: new Date(),
    });

    return await this.prescriptionRepository.save(prescription);
  }

  async getPrescriptions(
    userId: string,
    userRole: string,
    filters?: {
      patientId?: string;
      providerId?: string;
      status?: PrescriptionStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ data: Prescription[]; total: number }> {
    const query = this.prescriptionRepository.createQueryBuilder('prescription');

    // Role-based access control
    if (userRole === 'patient') {
      query.where('prescription.patientId = :userId', { userId });
    } else if (userRole === 'provider') {
      query.where('prescription.providerId = :userId', { userId });
    }

    // Apply filters
    if (filters?.patientId) {
      query.andWhere('prescription.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.providerId) {
      query.andWhere('prescription.providerId = :providerId', { providerId: filters.providerId });
    }
    if (filters?.status) {
      query.andWhere('prescription.status = :status', { status: filters.status });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('prescription.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('prescription.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async getPrescription(id: string, userId: string, userRole: string): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Verify access
    if (userRole === 'patient' && prescription.patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient prescriptions');
    }
    if (userRole === 'provider' && prescription.providerId !== userId) {
      throw new ForbiddenException('Cannot access other provider prescriptions');
    }

    return prescription;
  }

  async updatePrescription(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<Prescription> {
    const prescription = await this.getPrescription(id, userId, userRole);

    // Only providers and pharmacists can update prescriptions
    if (!['provider', 'pharmacist', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to update prescription');
    }

    Object.assign(prescription, updateDto);
    return await this.prescriptionRepository.save(prescription);
  }

  async approvePrescription(id: string, userId: string, userRole: string): Promise<Prescription> {
    const prescription = await this.getPrescription(id, userId, userRole);

    if (prescription.status !== PrescriptionStatus.PENDING) {
      throw new BadRequestException('Only pending prescriptions can be approved');
    }

    prescription.status = PrescriptionStatus.APPROVED;
    prescription.approvedBy = userId;
    prescription.approvedAt = new Date();

    return await this.prescriptionRepository.save(prescription);
  }

  async rejectPrescription(
    id: string,
    rejectionReason: string,
    userId: string,
    userRole: string,
  ): Promise<Prescription> {
    const prescription = await this.getPrescription(id, userId, userRole);

    if (prescription.status !== PrescriptionStatus.PENDING) {
      throw new BadRequestException('Only pending prescriptions can be rejected');
    }

    prescription.status = PrescriptionStatus.REJECTED;
    prescription.rejectedBy = userId;
    prescription.rejectedAt = new Date();
    prescription.rejectionReason = rejectionReason;

    return await this.prescriptionRepository.save(prescription);
  }

  async dispensePrescription(id: string, userId: string, userRole: string): Promise<Prescription> {
    const prescription = await this.getPrescription(id, userId, userRole);

    if (prescription.status !== PrescriptionStatus.APPROVED) {
      throw new BadRequestException('Only approved prescriptions can be dispensed');
    }

    prescription.status = PrescriptionStatus.DISPENSED;
    prescription.dispensedBy = userId;
    prescription.dispensedAt = new Date();

    return await this.prescriptionRepository.save(prescription);
  }

  async completePrescription(id: string, userId: string, userRole: string): Promise<Prescription> {
    const prescription = await this.getPrescription(id, userId, userRole);

    if (prescription.status !== PrescriptionStatus.DISPENSED) {
      throw new BadRequestException('Only dispensed prescriptions can be completed');
    }

    prescription.status = PrescriptionStatus.COMPLETED;
    prescription.completedAt = new Date();

    return await this.prescriptionRepository.save(prescription);
  }

  async cancelPrescription(
    id: string,
    cancellationReason: string,
    userId: string,
    userRole: string,
  ): Promise<Prescription> {
    const prescription = await this.getPrescription(id, userId, userRole);

    if (prescription.status === PrescriptionStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed prescription');
    }

    prescription.status = PrescriptionStatus.CANCELLED;
    prescription.cancelledBy = userId;
    prescription.cancelledAt = new Date();
    prescription.cancellationReason = cancellationReason;

    return await this.prescriptionRepository.save(prescription);
  }

  async getPrescriptionsByPatient(patientId: string, userId: string, userRole: string): Promise<Prescription[]> {
    // Verify access
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient prescriptions');
    }

    return await this.prescriptionRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPrescriptionsByProvider(providerId: string, userId: string, userRole: string): Promise<Prescription[]> {
    // Verify access
    if (userRole === 'provider' && providerId !== userId) {
      throw new ForbiddenException('Cannot access other provider prescriptions');
    }

    return await this.prescriptionRepository.find({
      where: { providerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingPrescriptions(userId: string, userRole: string): Promise<Prescription[]> {
    if (!['pharmacist', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view pending prescriptions');
    }

    return await this.prescriptionRepository.find({
      where: { status: PrescriptionStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async getPrescriptionStatistics(userId: string, userRole: string): Promise<any> {
    if (!['admin', 'pharmacist'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view prescription statistics');
    }

    const total = await this.prescriptionRepository.count();
    const pending = await this.prescriptionRepository.count({ where: { status: PrescriptionStatus.PENDING } });
    const approved = await this.prescriptionRepository.count({ where: { status: PrescriptionStatus.APPROVED } });
    const dispensed = await this.prescriptionRepository.count({ where: { status: PrescriptionStatus.DISPENSED } });
    const completed = await this.prescriptionRepository.count({ where: { status: PrescriptionStatus.COMPLETED } });
    const rejected = await this.prescriptionRepository.count({ where: { status: PrescriptionStatus.REJECTED } });
    const cancelled = await this.prescriptionRepository.count({ where: { status: PrescriptionStatus.CANCELLED } });

    return {
      total,
      pending,
      approved,
      dispensed,
      completed,
      rejected,
      cancelled,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  async getPrescriptionHistory(patientId: string, medicationName: string, userId: string, userRole: string): Promise<Prescription[]> {
    // Verify access
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient prescription history');
    }

    return await this.prescriptionRepository.find({
      where: { 
        patientId,
        medicationName,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async checkDrugInteractions(medicationIds: string[]): Promise<any> {
    // This would typically integrate with a drug interaction database
    // For now, return a mock response
    return {
      hasInteractions: false,
      interactions: [],
      severity: 'none',
    };
  }

  async checkAllergies(patientId: string, medicationName: string): Promise<any> {
    // This would typically check against patient allergy records
    // For now, return a mock response
    return {
      hasAllergies: false,
      allergies: [],
      severity: 'none',
    };
  }
}
