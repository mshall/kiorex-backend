import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NurseShift, ShiftStatus } from '../entities/nurse-shift.entity';
import { CreateNurseShiftDto } from '../dto/create-nurse-shift.dto';

@Injectable()
export class NurseShiftService {
  constructor(
    @InjectRepository(NurseShift)
    private nurseShiftRepository: Repository<NurseShift>,
  ) {}

  async createNurseShift(createDto: CreateNurseShiftDto, userId: string): Promise<NurseShift> {
    const shift = this.nurseShiftRepository.create({
      ...createDto,
      status: ShiftStatus.SCHEDULED,
    });

    return await this.nurseShiftRepository.save(shift);
  }

  async getNurseShifts(
    userId: string,
    userRole: string,
    filters?: {
      nurseId?: string;
      shiftDate?: Date;
      status?: ShiftStatus;
      type?: string;
      unit?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ data: NurseShift[]; total: number }> {
    const query = this.nurseShiftRepository.createQueryBuilder('shift');

    // Role-based access control
    if (userRole === 'nurse') {
      query.where('shift.nurseId = :userId', { userId });
    }

    // Apply filters
    if (filters?.nurseId) {
      query.andWhere('shift.nurseId = :nurseId', { nurseId: filters.nurseId });
    }
    if (filters?.shiftDate) {
      query.andWhere('shift.shiftDate = :shiftDate', { shiftDate: filters.shiftDate });
    }
    if (filters?.status) {
      query.andWhere('shift.status = :status', { status: filters.status });
    }
    if (filters?.type) {
      query.andWhere('shift.type = :type', { type: filters.type });
    }
    if (filters?.unit) {
      query.andWhere('shift.unit = :unit', { unit: filters.unit });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('shift.shiftDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('shift.shiftDate', 'DESC')
      .addOrderBy('shift.startTime', 'ASC')
      .getManyAndCount();

    return { data, total };
  }

  async getNurseShift(id: string, userId: string, userRole: string): Promise<NurseShift> {
    const shift = await this.nurseShiftRepository.findOne({
      where: { id },
    });

    if (!shift) {
      throw new NotFoundException('Nurse shift not found');
    }

    // Verify access
    if (userRole === 'nurse' && shift.nurseId !== userId) {
      throw new ForbiddenException('Cannot access other nurse shifts');
    }

    return shift;
  }

  async updateNurseShift(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<NurseShift> {
    const shift = await this.getNurseShift(id, userId, userRole);

    // Only nurses and supervisors can update shifts
    if (!['nurse', 'supervisor', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to update nurse shift');
    }

    Object.assign(shift, updateDto);
    return await this.nurseShiftRepository.save(shift);
  }

  async startShift(id: string, userId: string, userRole: string): Promise<NurseShift> {
    const shift = await this.getNurseShift(id, userId, userRole);

    if (shift.status !== ShiftStatus.SCHEDULED) {
      throw new BadRequestException('Only scheduled shifts can be started');
    }

    shift.status = ShiftStatus.IN_PROGRESS;
    shift.actualStartTime = new Date().toTimeString().split(' ')[0];

    return await this.nurseShiftRepository.save(shift);
  }

  async endShift(
    id: string,
    handoverNotes: string,
    userId: string,
    userRole: string,
  ): Promise<NurseShift> {
    const shift = await this.getNurseShift(id, userId, userRole);

    if (shift.status !== ShiftStatus.IN_PROGRESS) {
      throw new BadRequestException('Only shifts in progress can be ended');
    }

    shift.status = ShiftStatus.COMPLETED;
    shift.actualEndTime = new Date().toTimeString().split(' ')[0];
    shift.handoverNotes = handoverNotes;

    // Calculate overtime if applicable
    if (shift.actualStartTime && shift.actualEndTime) {
      const startTime = new Date(`2000-01-01T${shift.actualStartTime}`);
      const endTime = new Date(`2000-01-01T${shift.actualEndTime}`);
      const scheduledEnd = new Date(`2000-01-01T${shift.endTime}`);
      
      if (endTime > scheduledEnd) {
        const overtimeMs = endTime.getTime() - scheduledEnd.getTime();
        shift.overtimeHours = overtimeMs / (1000 * 60 * 60);
      }
    }

    return await this.nurseShiftRepository.save(shift);
  }

  async cancelShift(
    id: string,
    cancellationReason: string,
    userId: string,
    userRole: string,
  ): Promise<NurseShift> {
    const shift = await this.getNurseShift(id, userId, userRole);

    if (shift.status === ShiftStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed shift');
    }

    shift.status = ShiftStatus.CANCELLED;
    shift.cancelledBy = userId;
    shift.cancelledAt = new Date();
    shift.cancellationReason = cancellationReason;

    return await this.nurseShiftRepository.save(shift);
  }

  async getShiftsByNurse(nurseId: string, userId: string, userRole: string): Promise<NurseShift[]> {
    // Verify access
    if (userRole === 'nurse' && nurseId !== userId) {
      throw new ForbiddenException('Cannot access other nurse shifts');
    }

    return await this.nurseShiftRepository.find({
      where: { nurseId },
      order: { shiftDate: 'DESC' },
    });
  }

  async getShiftsByUnit(unit: string): Promise<NurseShift[]> {
    return await this.nurseShiftRepository.find({
      where: { unit },
      order: { shiftDate: 'DESC' },
    });
  }

  async getCurrentShifts(): Promise<NurseShift[]> {
    return await this.nurseShiftRepository.find({
      where: { status: ShiftStatus.IN_PROGRESS },
      order: { shiftDate: 'ASC' },
    });
  }

  async getUpcomingShifts(days: number = 7): Promise<NurseShift[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.nurseShiftRepository
      .createQueryBuilder('shift')
      .where('shift.shiftDate BETWEEN :now AND :futureDate', {
        now: new Date(),
        futureDate,
      })
      .andWhere('shift.status = :status', { status: ShiftStatus.SCHEDULED })
      .orderBy('shift.shiftDate', 'ASC')
      .addOrderBy('shift.startTime', 'ASC')
      .getMany();
  }

  async getShiftStatistics(userId: string, userRole: string): Promise<any> {
    if (!['admin', 'supervisor'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view shift statistics');
    }

    const total = await this.nurseShiftRepository.count();
    const scheduled = await this.nurseShiftRepository.count({ where: { status: ShiftStatus.SCHEDULED } });
    const inProgress = await this.nurseShiftRepository.count({ where: { status: ShiftStatus.IN_PROGRESS } });
    const completed = await this.nurseShiftRepository.count({ where: { status: ShiftStatus.COMPLETED } });
    const cancelled = await this.nurseShiftRepository.count({ where: { status: ShiftStatus.CANCELLED } });
    const noShow = await this.nurseShiftRepository.count({ where: { status: ShiftStatus.NO_SHOW } });

    const typeStats = await this.nurseShiftRepository
      .createQueryBuilder('shift')
      .select('shift.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('shift.type')
      .getRawMany();

    const unitStats = await this.nurseShiftRepository
      .createQueryBuilder('shift')
      .select('shift.unit', 'unit')
      .addSelect('COUNT(*)', 'count')
      .groupBy('shift.unit')
      .getRawMany();

    return {
      total,
      scheduled,
      inProgress,
      completed,
      cancelled,
      noShow,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      typeStats,
      unitStats,
    };
  }

  async getNurseWorkload(nurseId: string, startDate: Date, endDate: Date): Promise<any> {
    const shifts = await this.nurseShiftRepository
      .createQueryBuilder('shift')
      .where('shift.nurseId = :nurseId', { nurseId })
      .andWhere('shift.shiftDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    const totalHours = shifts.reduce((sum, shift) => {
      if (shift.actualStartTime && shift.actualEndTime) {
        const start = new Date(`2000-01-01T${shift.actualStartTime}`);
        const end = new Date(`2000-01-01T${shift.actualEndTime}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);

    return {
      nurseId,
      period: { startDate, endDate },
      totalShifts: shifts.length,
      completedShifts: shifts.filter(s => s.status === ShiftStatus.COMPLETED).length,
      totalHours,
      averageHoursPerShift: shifts.length > 0 ? totalHours / shifts.length : 0,
    };
  }
}
