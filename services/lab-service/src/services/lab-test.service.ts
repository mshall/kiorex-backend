import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabTest } from '../entities/lab-test.entity';
import { CreateLabTestDto } from '../dto/create-lab-test.dto';
import { LabTestCategory, LabTestType } from '../dto/create-lab-test.dto';

@Injectable()
export class LabTestService {
  constructor(
    @InjectRepository(LabTest)
    private labTestRepository: Repository<LabTest>,
  ) {}

  async createLabTest(createDto: CreateLabTestDto): Promise<LabTest> {
    // Check if test code already exists
    const existingTest = await this.labTestRepository.findOne({
      where: { testCode: createDto.testCode },
    });

    if (existingTest) {
      throw new BadRequestException('Lab test with this code already exists');
    }

    const labTest = this.labTestRepository.create(createDto);
    return await this.labTestRepository.save(labTest);
  }

  async getLabTests(filters?: {
    category?: LabTestCategory;
    specimenType?: LabTestType;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: LabTest[]; total: number }> {
    const query = this.labTestRepository.createQueryBuilder('labTest');

    if (filters?.category) {
      query.andWhere('labTest.category = :category', { category: filters.category });
    }
    if (filters?.specimenType) {
      query.andWhere('labTest.specimenType = :specimenType', { specimenType: filters.specimenType });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('labTest.isActive = :isActive', { isActive: filters.isActive });
    }
    if (filters?.search) {
      query.andWhere(
        '(labTest.testName ILIKE :search OR labTest.testCode ILIKE :search OR labTest.description ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('labTest.testName', 'ASC')
      .getManyAndCount();

    return { data, total };
  }

  async getLabTest(id: string): Promise<LabTest> {
    const labTest = await this.labTestRepository.findOne({
      where: { id },
    });

    if (!labTest) {
      throw new NotFoundException('Lab test not found');
    }

    return labTest;
  }

  async getLabTestByCode(testCode: string): Promise<LabTest> {
    const labTest = await this.labTestRepository.findOne({
      where: { testCode },
    });

    if (!labTest) {
      throw new NotFoundException('Lab test not found');
    }

    return labTest;
  }

  async updateLabTest(id: string, updateDto: Partial<CreateLabTestDto>): Promise<LabTest> {
    const labTest = await this.getLabTest(id);

    // Check if test code is being changed and if it already exists
    if (updateDto.testCode && updateDto.testCode !== labTest.testCode) {
      const existingTest = await this.labTestRepository.findOne({
        where: { testCode: updateDto.testCode },
      });

      if (existingTest) {
        throw new BadRequestException('Lab test with this code already exists');
      }
    }

    Object.assign(labTest, updateDto);
    return await this.labTestRepository.save(labTest);
  }

  async deleteLabTest(id: string): Promise<void> {
    const labTest = await this.getLabTest(id);
    await this.labTestRepository.remove(labTest);
  }

  async getLabTestsByCategory(category: LabTestCategory): Promise<LabTest[]> {
    return await this.labTestRepository.find({
      where: { category, isActive: true },
      order: { testName: 'ASC' },
    });
  }

  async getLabTestsBySpecimenType(specimenType: LabTestType): Promise<LabTest[]> {
    return await this.labTestRepository.find({
      where: { specimenType, isActive: true },
      order: { testName: 'ASC' },
    });
  }

  async getRelatedLabTests(testCode: string): Promise<LabTest[]> {
    const labTest = await this.getLabTestByCode(testCode);
    
    if (!labTest.relatedTests || labTest.relatedTests.length === 0) {
      return [];
    }

    return await this.labTestRepository.find({
      where: { testCode: labTest.relatedTests },
      order: { testName: 'ASC' },
    });
  }

  async getLabTestStatistics(): Promise<any> {
    const total = await this.labTestRepository.count();
    const active = await this.labTestRepository.count({ where: { isActive: true } });
    const inactive = await this.labTestRepository.count({ where: { isActive: false } });

    const categoryStats = await this.labTestRepository
      .createQueryBuilder('labTest')
      .select('labTest.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('labTest.category')
      .getRawMany();

    const specimenTypeStats = await this.labTestRepository
      .createQueryBuilder('labTest')
      .select('labTest.specimenType', 'specimenType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('labTest.specimenType')
      .getRawMany();

    return {
      total,
      active,
      inactive,
      categoryStats,
      specimenTypeStats,
    };
  }

  async searchLabTests(searchTerm: string): Promise<LabTest[]> {
    return await this.labTestRepository
      .createQueryBuilder('labTest')
      .where(
        '(labTest.testName ILIKE :search OR labTest.testCode ILIKE :search OR labTest.description ILIKE :search)',
        { search: `%${searchTerm}%` }
      )
      .andWhere('labTest.isActive = :isActive', { isActive: true })
      .orderBy('labTest.testName', 'ASC')
      .getMany();
  }
}
