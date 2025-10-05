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

  async getLatestVitals(patientId: string, userId: string, userRole: string): Promise<Vitals | null> {
    // Verify access to patient records
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    return await this.vitalsRepository.findOne({
      where: { patientId },
      order: { recordedAt: 'DESC' },
    });
  }

  async getVitals(id: string, userId: string, userRole: string): Promise<Vitals> {
    const vitals = await this.vitalsRepository.findOne({
      where: { id },
    });

    if (!vitals) {
      throw new NotFoundException('Vitals not found');
    }

    // Verify access to patient records
    if (userRole === 'patient' && vitals.patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    return vitals;
  }

  async updateVitals(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<Vitals> {
    const vitals = await this.vitalsRepository.findOne({
      where: { id },
    });

    if (!vitals) {
      throw new NotFoundException('Vitals not found');
    }

    // Verify access to patient records
    if (userRole === 'patient' && vitals.patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    Object.assign(vitals, updateDto);
    return await this.vitalsRepository.save(vitals);
  }

  async getVitalsTrends(
    patientId: string,
    userId: string,
    userRole: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      vitalType?: string;
    },
  ): Promise<any> {
    // Verify access to patient records
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    const query = this.vitalsRepository.createQueryBuilder('vitals')
      .where('vitals.patientId = :patientId', { patientId });

    if (filters.startDate && filters.endDate) {
      query.andWhere('vitals.recordedAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    return await query
      .orderBy('vitals.recordedAt', 'ASC')
      .getMany();
  }

  async getVitalsAlerts(
    patientId: string,
    userId: string,
    userRole: string,
  ): Promise<any> {
    // Verify access to patient records
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    const latestVitals = await this.getLatestVitals(patientId, userId, userRole);
    
    if (!latestVitals) {
      return { alerts: [] };
    }

    const alerts = [];
    
    // Check for abnormal vital signs
    if (latestVitals.temperature && (latestVitals.temperature < 95 || latestVitals.temperature > 103)) {
      alerts.push({
        type: 'temperature',
        message: `Abnormal temperature: ${latestVitals.temperature}°F`,
        severity: latestVitals.temperature < 95 || latestVitals.temperature > 102 ? 'high' : 'medium',
      });
    }

    if (latestVitals.heartRate && (latestVitals.heartRate < 50 || latestVitals.heartRate > 120)) {
      alerts.push({
        type: 'heartRate',
        message: `Abnormal heart rate: ${latestVitals.heartRate} bpm`,
        severity: latestVitals.heartRate < 40 || latestVitals.heartRate > 140 ? 'high' : 'medium',
      });
    }

    if (latestVitals.systolicBP && (latestVitals.systolicBP < 90 || latestVitals.systolicBP > 180)) {
      alerts.push({
        type: 'bloodPressure',
        message: `Abnormal blood pressure: ${latestVitals.systolicBP}/${latestVitals.diastolicBP} mmHg`,
        severity: latestVitals.systolicBP < 80 || latestVitals.systolicBP > 200 ? 'high' : 'medium',
      });
    }

    return { alerts };
  }

  async createBulkVitals(vitalsArray: any[], userId: string): Promise<Vitals[]> {
    const vitals = vitalsArray.map(vitalsData => 
      this.vitalsRepository.create({
        ...vitalsData,
        recordedBy: userId,
      })
    );

    const savedVitals = await this.vitalsRepository.save(vitals as any);
    return savedVitals as Vitals[];
  }
}
