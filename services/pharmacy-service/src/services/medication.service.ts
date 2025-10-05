import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from '../entities/medication.entity';
import { CreateMedicationDto } from '../dto/create-medication.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  async createMedication(createDto: CreateMedicationDto): Promise<Medication> {
    // Check if medication with same name already exists
    const existingMedication = await this.medicationRepository.findOne({
      where: { name: createDto.name },
    });

    if (existingMedication) {
      throw new BadRequestException('Medication with this name already exists');
    }

    const medication = this.medicationRepository.create(createDto);
    return await this.medicationRepository.save(medication);
  }

  async getMedications(filters?: {
    category?: string;
    isActive?: boolean;
    requiresPrescription?: boolean;
    search?: string;
  }): Promise<{ data: Medication[]; total: number }> {
    const query = this.medicationRepository.createQueryBuilder('medication');

    if (filters?.category) {
      query.andWhere('medication.category = :category', { category: filters.category });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('medication.isActive = :isActive', { isActive: filters.isActive });
    }
    if (filters?.requiresPrescription !== undefined) {
      query.andWhere('medication.requiresPrescription = :requiresPrescription', { 
        requiresPrescription: filters.requiresPrescription 
      });
    }
    if (filters?.search) {
      query.andWhere(
        '(medication.name ILIKE :search OR medication.genericName ILIKE :search OR medication.description ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('medication.name', 'ASC')
      .getManyAndCount();

    return { data, total };
  }

  async getMedication(id: string): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id },
    });

    if (!medication) {
      throw new NotFoundException('Medication not found');
    }

    return medication;
  }

  async getMedicationByName(name: string): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { name },
    });

    if (!medication) {
      throw new NotFoundException('Medication not found');
    }

    return medication;
  }

  async updateMedication(id: string, updateDto: Partial<CreateMedicationDto>): Promise<Medication> {
    const medication = await this.getMedication(id);

    // Check if name is being changed and if it already exists
    if (updateDto.name && updateDto.name !== medication.name) {
      const existingMedication = await this.medicationRepository.findOne({
        where: { name: updateDto.name },
      });

      if (existingMedication) {
        throw new BadRequestException('Medication with this name already exists');
      }
    }

    Object.assign(medication, updateDto);
    return await this.medicationRepository.save(medication);
  }

  async deleteMedication(id: string): Promise<void> {
    const medication = await this.getMedication(id);
    await this.medicationRepository.remove(medication);
  }

  async getMedicationsByCategory(category: string): Promise<Medication[]> {
    return await this.medicationRepository.find({
      where: { category, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getMedicationsByDosageForm(dosageForm: string): Promise<Medication[]> {
    return await this.medicationRepository.find({
      where: { dosageForm, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getLowStockMedications(): Promise<Medication[]> {
    return await this.medicationRepository
      .createQueryBuilder('medication')
      .where('medication.stockQuantity <= medication.minimumStockLevel')
      .andWhere('medication.isActive = :isActive', { isActive: true })
      .orderBy('medication.stockQuantity', 'ASC')
      .getMany();
  }

  async getExpiredMedications(): Promise<Medication[]> {
    return await this.medicationRepository
      .createQueryBuilder('medication')
      .where('medication.expiryDate < :now', { now: new Date() })
      .andWhere('medication.isActive = :isActive', { isActive: true })
      .orderBy('medication.expiryDate', 'ASC')
      .getMany();
  }

  async getMedicationsExpiringSoon(days: number = 30): Promise<Medication[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.medicationRepository
      .createQueryBuilder('medication')
      .where('medication.expiryDate BETWEEN :now AND :futureDate', { 
        now: new Date(), 
        futureDate 
      })
      .andWhere('medication.isActive = :isActive', { isActive: true })
      .orderBy('medication.expiryDate', 'ASC')
      .getMany();
  }

  async searchMedications(searchTerm: string): Promise<Medication[]> {
    return await this.medicationRepository
      .createQueryBuilder('medication')
      .where(
        '(medication.name ILIKE :search OR medication.genericName ILIKE :search OR medication.description ILIKE :search)',
        { search: `%${searchTerm}%` }
      )
      .andWhere('medication.isActive = :isActive', { isActive: true })
      .orderBy('medication.name', 'ASC')
      .getMany();
  }

  async getMedicationStatistics(): Promise<any> {
    const total = await this.medicationRepository.count();
    const active = await this.medicationRepository.count({ where: { isActive: true } });
    const inactive = await this.medicationRepository.count({ where: { isActive: false } });
    const prescriptionRequired = await this.medicationRepository.count({ 
      where: { requiresPrescription: true, isActive: true } 
    });
    const overTheCounter = await this.medicationRepository.count({ 
      where: { requiresPrescription: false, isActive: true } 
    });

    const categoryStats = await this.medicationRepository
      .createQueryBuilder('medication')
      .select('medication.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('medication.category')
      .getRawMany();

    const lowStock = await this.medicationRepository
      .createQueryBuilder('medication')
      .where('medication.stockQuantity <= medication.minimumStockLevel')
      .andWhere('medication.isActive = :isActive', { isActive: true })
      .getCount();

    return {
      total,
      active,
      inactive,
      prescriptionRequired,
      overTheCounter,
      lowStock,
      categoryStats,
    };
  }

  async updateStock(medicationId: string, quantity: number, operation: 'add' | 'subtract'): Promise<Medication> {
    const medication = await this.getMedication(medicationId);
    
    if (operation === 'add') {
      medication.stockQuantity += quantity;
    } else {
      medication.stockQuantity = Math.max(0, medication.stockQuantity - quantity);
    }

    return await this.medicationRepository.save(medication);
  }
}
