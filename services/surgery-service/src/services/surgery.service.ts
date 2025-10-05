import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Surgery, SurgeryStatus } from '../entities/surgery.entity';
import { CreateSurgeryDto } from '../dto/create-surgery.dto';

@Injectable()
export class SurgeryService {
  constructor(
    @InjectRepository(Surgery)
    private surgeryRepository: Repository<Surgery>,
  ) {}

  async createSurgery(createDto: CreateSurgeryDto, userId: string): Promise<Surgery> {
    const surgery = this.surgeryRepository.create({
      ...createDto,
      status: SurgeryStatus.SCHEDULED,
    });

    return await this.surgeryRepository.save(surgery);
  }

  async getSurgeries(
    userId: string,
    userRole: string,
    filters?: {
      patientId?: string;
      surgeonId?: string;
      status?: SurgeryStatus;
      type?: string;
      category?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ data: Surgery[]; total: number }> {
    const query = this.surgeryRepository.createQueryBuilder('surgery');

    // Role-based access control
    if (userRole === 'patient') {
      query.where('surgery.patientId = :userId', { userId });
    } else if (userRole === 'surgeon') {
      query.where('surgery.surgeonId = :userId', { userId });
    }

    // Apply filters
    if (filters?.patientId) {
      query.andWhere('surgery.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.surgeonId) {
      query.andWhere('surgery.surgeonId = :surgeonId', { surgeonId: filters.surgeonId });
    }
    if (filters?.status) {
      query.andWhere('surgery.status = :status', { status: filters.status });
    }
    if (filters?.type) {
      query.andWhere('surgery.type = :type', { type: filters.type });
    }
    if (filters?.category) {
      query.andWhere('surgery.category = :category', { category: filters.category });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('surgery.scheduledDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('surgery.scheduledDate', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async getSurgery(id: string, userId: string, userRole: string): Promise<Surgery> {
    const surgery = await this.surgeryRepository.findOne({
      where: { id },
    });

    if (!surgery) {
      throw new NotFoundException('Surgery not found');
    }

    // Verify access
    if (userRole === 'patient' && surgery.patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient surgeries');
    }
    if (userRole === 'surgeon' && surgery.surgeonId !== userId) {
      throw new ForbiddenException('Cannot access other surgeon surgeries');
    }

    return surgery;
  }

  async updateSurgery(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<Surgery> {
    const surgery = await this.getSurgery(id, userId, userRole);

    // Only surgeons and admin can update surgeries
    if (!['surgeon', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to update surgery');
    }

    Object.assign(surgery, updateDto);
    return await this.surgeryRepository.save(surgery);
  }

  async startSurgery(id: string, userId: string, userRole: string): Promise<Surgery> {
    const surgery = await this.getSurgery(id, userId, userRole);

    if (surgery.status !== SurgeryStatus.SCHEDULED) {
      throw new BadRequestException('Only scheduled surgeries can be started');
    }

    surgery.status = SurgeryStatus.IN_PROGRESS;
    surgery.actualStartTime = new Date();

    return await this.surgeryRepository.save(surgery);
  }

  async completeSurgery(
    id: string,
    operativeNotes: string,
    userId: string,
    userRole: string,
  ): Promise<Surgery> {
    const surgery = await this.getSurgery(id, userId, userRole);

    if (surgery.status !== SurgeryStatus.IN_PROGRESS) {
      throw new BadRequestException('Only surgeries in progress can be completed');
    }

    surgery.status = SurgeryStatus.COMPLETED;
    surgery.actualEndTime = new Date();
    surgery.operativeNotes = operativeNotes;

    // Calculate actual duration
    if (surgery.actualStartTime) {
      const duration = surgery.actualEndTime.getTime() - surgery.actualStartTime.getTime();
      surgery.actualDuration = Math.round(duration / (1000 * 60)); // Convert to minutes
    }

    return await this.surgeryRepository.save(surgery);
  }

  async cancelSurgery(
    id: string,
    cancellationReason: string,
    userId: string,
    userRole: string,
  ): Promise<Surgery> {
    const surgery = await this.getSurgery(id, userId, userRole);

    if (surgery.status === SurgeryStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed surgery');
    }

    surgery.status = SurgeryStatus.CANCELLED;
    surgery.cancelledBy = userId;
    surgery.cancelledAt = new Date();
    surgery.cancellationReason = cancellationReason;

    return await this.surgeryRepository.save(surgery);
  }

  async postponeSurgery(
    id: string,
    postponementReason: string,
    rescheduledDate: Date,
    userId: string,
    userRole: string,
  ): Promise<Surgery> {
    const surgery = await this.getSurgery(id, userId, userRole);

    if (surgery.status === SurgeryStatus.COMPLETED) {
      throw new BadRequestException('Cannot postpone completed surgery');
    }

    surgery.status = SurgeryStatus.POSTPONED;
    surgery.postponedBy = userId;
    surgery.postponedAt = new Date();
    surgery.postponementReason = postponementReason;
    surgery.rescheduledDate = rescheduledDate;

    return await this.surgeryRepository.save(surgery);
  }

  async getSurgeriesByPatient(patientId: string, userId: string, userRole: string): Promise<Surgery[]> {
    // Verify access
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient surgeries');
    }

    return await this.surgeryRepository.find({
      where: { patientId },
      order: { scheduledDate: 'DESC' },
    });
  }

  async getSurgeriesBySurgeon(surgeonId: string, userId: string, userRole: string): Promise<Surgery[]> {
    // Verify access
    if (userRole === 'surgeon' && surgeonId !== userId) {
      throw new ForbiddenException('Cannot access other surgeon surgeries');
    }

    return await this.surgeryRepository.find({
      where: { surgeonId },
      order: { scheduledDate: 'DESC' },
    });
  }

  async getScheduledSurgeries(userId: string, userRole: string): Promise<Surgery[]> {
    if (!['surgeon', 'admin', 'nurse'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view scheduled surgeries');
    }

    return await this.surgeryRepository.find({
      where: { status: SurgeryStatus.SCHEDULED },
      order: { scheduledDate: 'ASC' },
    });
  }

  async getSurgeryStatistics(userId: string, userRole: string): Promise<any> {
    if (!['admin', 'surgeon'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view surgery statistics');
    }

    const total = await this.surgeryRepository.count();
    const scheduled = await this.surgeryRepository.count({ where: { status: SurgeryStatus.SCHEDULED } });
    const inProgress = await this.surgeryRepository.count({ where: { status: SurgeryStatus.IN_PROGRESS } });
    const completed = await this.surgeryRepository.count({ where: { status: SurgeryStatus.COMPLETED } });
    const cancelled = await this.surgeryRepository.count({ where: { status: SurgeryStatus.CANCELLED } });
    const postponed = await this.surgeryRepository.count({ where: { status: SurgeryStatus.POSTPONED } });

    const categoryStats = await this.surgeryRepository
      .createQueryBuilder('surgery')
      .select('surgery.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('surgery.category')
      .getRawMany();

    const typeStats = await this.surgeryRepository
      .createQueryBuilder('surgery')
      .select('surgery.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('surgery.type')
      .getRawMany();

    return {
      total,
      scheduled,
      inProgress,
      completed,
      cancelled,
      postponed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      categoryStats,
      typeStats,
    };
  }

  async getSurgeryHistory(patientId: string, userId: string, userRole: string): Promise<Surgery[]> {
    // Verify access
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient surgery history');
    }

    return await this.surgeryRepository.find({
      where: { patientId },
      order: { scheduledDate: 'DESC' },
    });
  }

  async getUpcomingSurgeries(days: number = 7): Promise<Surgery[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.surgeryRepository
      .createQueryBuilder('surgery')
      .where('surgery.scheduledDate BETWEEN :now AND :futureDate', {
        now: new Date(),
        futureDate,
      })
      .andWhere('surgery.status = :status', { status: SurgeryStatus.SCHEDULED })
      .orderBy('surgery.scheduledDate', 'ASC')
      .getMany();
  }
}
