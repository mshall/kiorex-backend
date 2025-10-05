import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientCare, CareStatus } from '../entities/patient-care.entity';
import { CreatePatientCareDto } from '../dto/create-patient-care.dto';

@Injectable()
export class PatientCareService {
  constructor(
    @InjectRepository(PatientCare)
    private patientCareRepository: Repository<PatientCare>,
  ) {}

  async createPatientCare(createDto: CreatePatientCareDto, userId: string): Promise<PatientCare> {
    const care = this.patientCareRepository.create({
      ...createDto,
      status: CareStatus.SCHEDULED,
    });

    return await this.patientCareRepository.save(care);
  }

  async getPatientCare(
    userId: string,
    userRole: string,
    filters?: {
      patientId?: string;
      nurseId?: string;
      careType?: string;
      status?: CareStatus;
      priority?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ data: PatientCare[]; total: number }> {
    const query = this.patientCareRepository.createQueryBuilder('care');

    // Role-based access control
    if (userRole === 'nurse') {
      query.where('care.nurseId = :userId', { userId });
    }

    // Apply filters
    if (filters?.patientId) {
      query.andWhere('care.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.nurseId) {
      query.andWhere('care.nurseId = :nurseId', { nurseId: filters.nurseId });
    }
    if (filters?.careType) {
      query.andWhere('care.careType = :careType', { careType: filters.careType });
    }
    if (filters?.status) {
      query.andWhere('care.status = :status', { status: filters.status });
    }
    if (filters?.priority) {
      query.andWhere('care.priority = :priority', { priority: filters.priority });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('care.scheduledTime BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('care.scheduledTime', 'ASC')
      .getManyAndCount();

    return { data, total };
  }

  async getPatientCareById(id: string, userId: string, userRole: string): Promise<PatientCare> {
    const care = await this.patientCareRepository.findOne({
      where: { id },
    });

    if (!care) {
      throw new NotFoundException('Patient care not found');
    }

    // Verify access
    if (userRole === 'nurse' && care.nurseId !== userId) {
      throw new ForbiddenException('Cannot access other nurse patient care');
    }

    return care;
  }

  async updatePatientCare(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<PatientCare> {
    const care = await this.getPatientCareById(id, userId, userRole);

    // Only nurses and supervisors can update patient care
    if (!['nurse', 'supervisor', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to update patient care');
    }

    Object.assign(care, updateDto);
    return await this.patientCareRepository.save(care);
  }

  async startCare(id: string, userId: string, userRole: string): Promise<PatientCare> {
    const care = await this.getPatientCareById(id, userId, userRole);

    if (care.status !== CareStatus.SCHEDULED) {
      throw new BadRequestException('Only scheduled care can be started');
    }

    care.status = CareStatus.IN_PROGRESS;
    care.actualStartTime = new Date();

    return await this.patientCareRepository.save(care);
  }

  async completeCare(
    id: string,
    outcome: string,
    notes: string,
    userId: string,
    userRole: string,
  ): Promise<PatientCare> {
    const care = await this.getPatientCareById(id, userId, userRole);

    if (care.status !== CareStatus.IN_PROGRESS) {
      throw new BadRequestException('Only care in progress can be completed');
    }

    care.status = CareStatus.COMPLETED;
    care.actualEndTime = new Date();
    care.outcome = outcome;
    care.notes = notes;

    // Calculate duration
    if (care.actualStartTime) {
      const duration = care.actualEndTime.getTime() - care.actualStartTime.getTime();
      care.duration = Math.round(duration / (1000 * 60)); // Convert to minutes
    }

    return await this.patientCareRepository.save(care);
  }

  async cancelCare(
    id: string,
    reason: string,
    userId: string,
    userRole: string,
  ): Promise<PatientCare> {
    const care = await this.getPatientCareById(id, userId, userRole);

    if (care.status === CareStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed care');
    }

    care.status = CareStatus.CANCELLED;
    care.notes = reason;

    return await this.patientCareRepository.save(care);
  }

  async getCareByPatient(patientId: string, userId: string, userRole: string): Promise<PatientCare[]> {
    return await this.patientCareRepository.find({
      where: { patientId },
      order: { scheduledTime: 'DESC' },
    });
  }

  async getCareByNurse(nurseId: string, userId: string, userRole: string): Promise<PatientCare[]> {
    // Verify access
    if (userRole === 'nurse' && nurseId !== userId) {
      throw new ForbiddenException('Cannot access other nurse patient care');
    }

    return await this.patientCareRepository.find({
      where: { nurseId },
      order: { scheduledTime: 'DESC' },
    });
  }

  async getPendingCare(): Promise<PatientCare[]> {
    return await this.patientCareRepository.find({
      where: { status: CareStatus.SCHEDULED },
      order: { scheduledTime: 'ASC' },
    });
  }

  async getOverdueCare(): Promise<PatientCare[]> {
    const now = new Date();
    return await this.patientCareRepository
      .createQueryBuilder('care')
      .where('care.status = :status', { status: CareStatus.SCHEDULED })
      .andWhere('care.scheduledTime < :now', { now })
      .orderBy('care.scheduledTime', 'ASC')
      .getMany();
  }

  async getCareStatistics(userId: string, userRole: string): Promise<any> {
    if (!['admin', 'supervisor'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view care statistics');
    }

    const total = await this.patientCareRepository.count();
    const scheduled = await this.patientCareRepository.count({ where: { status: CareStatus.SCHEDULED } });
    const inProgress = await this.patientCareRepository.count({ where: { status: CareStatus.IN_PROGRESS } });
    const completed = await this.patientCareRepository.count({ where: { status: CareStatus.COMPLETED } });
    const cancelled = await this.patientCareRepository.count({ where: { status: CareStatus.CANCELLED } });
    const missed = await this.patientCareRepository.count({ where: { status: CareStatus.MISSED } });

    const typeStats = await this.patientCareRepository
      .createQueryBuilder('care')
      .select('care.careType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('care.careType')
      .getRawMany();

    const priorityStats = await this.patientCareRepository
      .createQueryBuilder('care')
      .select('care.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('care.priority')
      .getRawMany();

    return {
      total,
      scheduled,
      inProgress,
      completed,
      cancelled,
      missed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      typeStats,
      priorityStats,
    };
  }

  async getNurseCareWorkload(nurseId: string, startDate: Date, endDate: Date): Promise<any> {
    const care = await this.patientCareRepository
      .createQueryBuilder('care')
      .where('care.nurseId = :nurseId', { nurseId })
      .andWhere('care.scheduledTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return {
      nurseId,
      period: { startDate, endDate },
      totalCare: care.length,
      completed: care.filter(c => c.status === CareStatus.COMPLETED).length,
      pending: care.filter(c => c.status === CareStatus.SCHEDULED).length,
      inProgress: care.filter(c => c.status === CareStatus.IN_PROGRESS).length,
      averageDuration: care.length > 0 ? 
        care.reduce((sum, c) => sum + (c.duration || 0), 0) / care.length : 0,
    };
  }
}
