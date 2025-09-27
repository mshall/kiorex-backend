import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabResult } from '../entities/lab-result.entity';
import { CreateLabResultDto } from '../dto/create-lab-result.dto';

@Injectable()
export class LabResultService {
  constructor(
    @InjectRepository(LabResult)
    private labResultRepository: Repository<LabResult>,
  ) {}

  async createLabResult(createDto: CreateLabResultDto, userId: string): Promise<LabResult> {
    const labResult = this.labResultRepository.create({
      ...createDto,
      orderedBy: userId,
    });

    return await this.labResultRepository.save(labResult);
  }

  async getLabResult(id: string, userId: string, userRole: string): Promise<LabResult> {
    const labResult = await this.labResultRepository.findOne({
      where: { id },
    });

    if (!labResult) {
      throw new NotFoundException('Lab result not found');
    }

    // Check access permissions
    await this.checkAccess(labResult, userId, userRole);

    return labResult;
  }

  async getPatientLabResults(
    patientId: string,
    userId: string,
    userRole: string,
    filters?: any,
  ): Promise<{ data: LabResult[]; total: number }> {
    // Verify access to patient records
    if (userRole === 'patient' && patientId !== userId) {
      throw new ForbiddenException('Cannot access other patient records');
    }

    const query = this.labResultRepository.createQueryBuilder('labResult')
      .where('labResult.patientId = :patientId', { patientId });

    if (filters?.status) {
      query.andWhere('labResult.status = :status', { status: filters.status });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('labResult.testDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('labResult.testDate', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async updateLabResult(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<LabResult> {
    const labResult = await this.getLabResult(id, userId, userRole);

    // Only providers can update
    if (userRole !== 'provider' && userRole !== 'admin') {
      throw new ForbiddenException('Only providers can update lab results');
    }

    Object.assign(labResult, updateDto);
    return await this.labResultRepository.save(labResult);
  }

  async addInterpretation(
    id: string,
    interpretationDto: { interpretation: string; clinicalSignificance?: string },
    userId: string,
  ): Promise<LabResult> {
    const labResult = await this.labResultRepository.findOne({ where: { id } });

    if (!labResult) {
      throw new NotFoundException('Lab result not found');
    }

    labResult.interpretation = interpretationDto.interpretation;
    if (interpretationDto.clinicalSignificance) {
      labResult.clinicalSignificance = interpretationDto.clinicalSignificance;
    }

    return await this.labResultRepository.save(labResult);
  }

  private async checkAccess(
    labResult: LabResult,
    userId: string,
    userRole: string,
  ): Promise<void> {
    // Patients can only access their own lab results
    if (userRole === 'patient' && labResult.patientId !== userId) {
      throw new ForbiddenException('Cannot access this lab result');
    }

    // Providers can access lab results of their patients
    if (userRole === 'provider') {
      // Check if provider has relationship with patient
      const hasAccess = await this.checkProviderPatientRelationship(
        userId,
        labResult.patientId,
      );
      if (!hasAccess) {
        throw new ForbiddenException('No access to this patient lab result');
      }
    }
  }

  private async checkProviderPatientRelationship(
    providerId: string,
    patientId: string,
  ): Promise<boolean> {
    // Check if provider has treated this patient
    const labResult = await this.labResultRepository.findOne({
      where: {
        orderedBy: providerId,
        patientId,
      },
    });

    return !!labResult;
  }
}
