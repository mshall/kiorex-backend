"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const medication_entity_1 = require("../entities/medication.entity");
let MedicationService = class MedicationService {
    constructor(medicationRepository) {
        this.medicationRepository = medicationRepository;
    }
    async createMedication(createDto) {
        const existingMedication = await this.medicationRepository.findOne({
            where: { name: createDto.name },
        });
        if (existingMedication) {
            throw new common_1.BadRequestException('Medication with this name already exists');
        }
        const medication = this.medicationRepository.create(createDto);
        return await this.medicationRepository.save(medication);
    }
    async getMedications(filters) {
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
            query.andWhere('(medication.name ILIKE :search OR medication.genericName ILIKE :search OR medication.description ILIKE :search)', { search: `%${filters.search}%` });
        }
        const [data, total] = await query
            .orderBy('medication.name', 'ASC')
            .getManyAndCount();
        return { data, total };
    }
    async getMedication(id) {
        const medication = await this.medicationRepository.findOne({
            where: { id },
        });
        if (!medication) {
            throw new common_1.NotFoundException('Medication not found');
        }
        return medication;
    }
    async getMedicationByName(name) {
        const medication = await this.medicationRepository.findOne({
            where: { name },
        });
        if (!medication) {
            throw new common_1.NotFoundException('Medication not found');
        }
        return medication;
    }
    async updateMedication(id, updateDto) {
        const medication = await this.getMedication(id);
        if (updateDto.name && updateDto.name !== medication.name) {
            const existingMedication = await this.medicationRepository.findOne({
                where: { name: updateDto.name },
            });
            if (existingMedication) {
                throw new common_1.BadRequestException('Medication with this name already exists');
            }
        }
        Object.assign(medication, updateDto);
        return await this.medicationRepository.save(medication);
    }
    async deleteMedication(id) {
        const medication = await this.getMedication(id);
        await this.medicationRepository.remove(medication);
    }
    async getMedicationsByCategory(category) {
        return await this.medicationRepository.find({
            where: { category, isActive: true },
            order: { name: 'ASC' },
        });
    }
    async getMedicationsByDosageForm(dosageForm) {
        return await this.medicationRepository.find({
            where: { dosageForm, isActive: true },
            order: { name: 'ASC' },
        });
    }
    async getLowStockMedications() {
        return await this.medicationRepository
            .createQueryBuilder('medication')
            .where('medication.stockQuantity <= medication.minimumStockLevel')
            .andWhere('medication.isActive = :isActive', { isActive: true })
            .orderBy('medication.stockQuantity', 'ASC')
            .getMany();
    }
    async getExpiredMedications() {
        return await this.medicationRepository
            .createQueryBuilder('medication')
            .where('medication.expiryDate < :now', { now: new Date() })
            .andWhere('medication.isActive = :isActive', { isActive: true })
            .orderBy('medication.expiryDate', 'ASC')
            .getMany();
    }
    async getMedicationsExpiringSoon(days = 30) {
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
    async searchMedications(searchTerm) {
        return await this.medicationRepository
            .createQueryBuilder('medication')
            .where('(medication.name ILIKE :search OR medication.genericName ILIKE :search OR medication.description ILIKE :search)', { search: `%${searchTerm}%` })
            .andWhere('medication.isActive = :isActive', { isActive: true })
            .orderBy('medication.name', 'ASC')
            .getMany();
    }
    async getMedicationStatistics() {
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
    async updateStock(medicationId, quantity, operation) {
        const medication = await this.getMedication(medicationId);
        if (operation === 'add') {
            medication.stockQuantity += quantity;
        }
        else {
            medication.stockQuantity = Math.max(0, medication.stockQuantity - quantity);
        }
        return await this.medicationRepository.save(medication);
    }
};
exports.MedicationService = MedicationService;
exports.MedicationService = MedicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(medication_entity_1.Medication)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MedicationService);
//# sourceMappingURL=medication.service.js.map