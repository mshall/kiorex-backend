import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vitals } from '../entities/vitals.entity';

@Injectable()
export class VitalsService {
  constructor(
    @InjectRepository(Vitals)
    private vitalsRepository: Repository<Vitals>,
  ) {}

  async createVitals(vitalsData: any, userId: string): Promise<Vitals> {
    const vitals = this.vitalsRepository.create({
      ...vitalsData,
      recordedBy: userId,
    });

    const savedVitals = await this.vitalsRepository.save(vitals);
    return Array.isArray(savedVitals) ? savedVitals[0] : savedVitals;
  }

  async getPatientVitals(
    patientId: string,
    userId: string,
    userRole: string,
    filters?: any,
  ): Promise<{ data: Vitals[]; total: number }> {
    // Verify access to patient records
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    const query = this.vitalsRepository.createQueryBuilder('vitals')
      .where('vitals.patientId = :patientId', { patientId });

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('vitals.recordedAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('vitals.recordedAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async getLatestVitals(patientId: string): Promise<Vitals | null> {
    return await this.vitalsRepository.findOne({
      where: { patientId },
      order: { recordedAt: 'DESC' },
    });
  }
}
