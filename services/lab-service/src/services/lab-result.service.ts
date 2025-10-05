import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabResult } from '../entities/lab-result.entity';
import { CreateLabResultDto } from '../dto/create-lab-result.dto';
import { LabResultStatus } from '../dto/create-lab-result.dto';

@Injectable()
export class LabResultService {
  constructor(
    @InjectRepository(LabResult)
    private labResultRepository: Repository<LabResult>,
  ) {}

  async createLabResult(createDto: CreateLabResultDto, userId: string): Promise<LabResult> {
    const labResult = this.labResultRepository.create({
      ...createDto,
      status: LabResultStatus.PENDING,
      processedBy: userId,
    });

    return await this.labResultRepository.save(labResult);
  }

  async getLabResults(
    userId: string,
    userRole: string,
    filters?: {
      patientId?: string;
      providerId?: string;
      status?: LabResultStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ data: LabResult[]; total: number }> {
    const query = this.labResultRepository.createQueryBuilder('labResult');

    // Role-based access control
    if (userRole === 'patient') {
      query.where('labResult.patientId = :userId', { userId });
    } else if (userRole === 'provider') {
      query.where('labResult.providerId = :userId', { userId });
    }

    // Apply filters
    if (filters?.patientId) {
      query.andWhere('labResult.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.providerId) {
      query.andWhere('labResult.providerId = :providerId', { providerId: filters.providerId });
    }
    if (filters?.status) {
      query.andWhere('labResult.status = :status', { status: filters.status });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('labResult.completedAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('labResult.completedAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async getLabResult(id: string, userId: string, userRole: string): Promise<LabResult> {
    const labResult = await this.labResultRepository.findOne({
      where: { id },
    });

    if (!labResult) {
      throw new NotFoundException('Lab result not found');
    }

    // Verify access
    if (userRole === 'patient' && labResult.patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient lab results');
    }
    if (userRole === 'provider' && labResult.providerId !== userId) {
      throw new ForbiddenException('Cannot access other provider lab results');
    }

    return labResult;
  }

  async updateLabResult(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<LabResult> {
    const labResult = await this.getLabResult(id, userId, userRole);

    // Only lab staff can update lab results
    if (!['lab_technician', 'lab_manager', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to update lab result');
    }

    Object.assign(labResult, updateDto);
    return await this.labResultRepository.save(labResult);
  }

  async getLabResultsByPatient(patientId: string, userId: string, userRole: string): Promise<LabResult[]> {
    // Verify access
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient lab results');
    }

    return await this.labResultRepository.find({
      where: { patientId },
      order: { completedAt: 'DESC' },
    });
  }

  async getLabResultsByProvider(providerId: string, userId: string, userRole: string): Promise<LabResult[]> {
    // Verify access
    if (userRole === 'provider' && providerId !== userId) {
      throw new ForbiddenException('Cannot access other provider lab results');
    }

    return await this.labResultRepository.find({
      where: { providerId },
      order: { completedAt: 'DESC' },
    });
  }

  async getPendingLabResults(userId: string, userRole: string): Promise<LabResult[]> {
    if (!['lab_technician', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view pending lab results');
    }

    return await this.labResultRepository.find({
      where: { status: LabResultStatus.PENDING },
      order: { completedAt: 'ASC' },
    });
  }

  async getCriticalLabResults(userId: string, userRole: string): Promise<LabResult[]> {
    if (!['provider', 'lab_technician', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view critical lab results');
    }

    return await this.labResultRepository.find({
      where: { status: LabResultStatus.CRITICAL },
      order: { completedAt: 'DESC' },
    });
  }

  async getLabResultStatistics(userId: string, userRole: string): Promise<any> {
    if (!['admin', 'lab_manager'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to view lab result statistics');
    }

    const total = await this.labResultRepository.count();
    const pending = await this.labResultRepository.count({ where: { status: LabResultStatus.PENDING } });
    const completed = await this.labResultRepository.count({ where: { status: LabResultStatus.COMPLETED } });
    const abnormal = await this.labResultRepository.count({ where: { status: LabResultStatus.ABNORMAL } });
    const critical = await this.labResultRepository.count({ where: { status: LabResultStatus.CRITICAL } });

    return {
      total,
      pending,
      completed,
      abnormal,
      critical,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  async getLabResultTrends(
    patientId: string,
    testCode: string,
    userId: string,
    userRole: string,
  ): Promise<any> {
    // Verify access
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient lab result trends');
    }

    const results = await this.labResultRepository
      .createQueryBuilder('labResult')
      .where('labResult.patientId = :patientId', { patientId })
      .andWhere('labResult.results::text LIKE :testCode', { testCode: `%${testCode}%` })
      .orderBy('labResult.completedAt', 'ASC')
      .getMany();

    return results.map(result => ({
      id: result.id,
      completedAt: result.completedAt,
      results: result.results,
    }));
  }
}
