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
exports.PrescriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prescription_entity_1 = require("../entities/prescription.entity");
let PrescriptionService = class PrescriptionService {
    constructor(prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    async createPrescription(createDto, userId) {
        const prescription = this.prescriptionRepository.create({
            ...createDto,
            status: prescription_entity_1.PrescriptionStatus.PENDING,
            prescribedBy: userId,
            prescribedAt: new Date(),
        });
        return await this.prescriptionRepository.save(prescription);
    }
    async getPrescriptions(userId, userRole, filters) {
        const query = this.prescriptionRepository.createQueryBuilder('prescription');
        if (userRole === 'patient') {
            query.where('prescription.patientId = :userId', { userId });
        }
        else if (userRole === 'provider') {
            query.where('prescription.providerId = :userId', { userId });
        }
        if (filters?.patientId) {
            query.andWhere('prescription.patientId = :patientId', { patientId: filters.patientId });
        }
        if (filters?.providerId) {
            query.andWhere('prescription.providerId = :providerId', { providerId: filters.providerId });
        }
        if (filters?.status) {
            query.andWhere('prescription.status = :status', { status: filters.status });
        }
        if (filters?.startDate && filters?.endDate) {
            query.andWhere('prescription.createdAt BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }
        const [data, total] = await query
            .orderBy('prescription.createdAt', 'DESC')
            .getManyAndCount();
        return { data, total };
    }
    async getPrescription(id, userId, userRole) {
        const prescription = await this.prescriptionRepository.findOne({
            where: { id },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (userRole === 'patient' && prescription.patientId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other patient prescriptions');
        }
        if (userRole === 'provider' && prescription.providerId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other provider prescriptions');
        }
        return prescription;
    }
    async updatePrescription(id, updateDto, userId, userRole) {
        const prescription = await this.getPrescription(id, userId, userRole);
        if (!['provider', 'pharmacist', 'admin'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to update prescription');
        }
        Object.assign(prescription, updateDto);
        return await this.prescriptionRepository.save(prescription);
    }
    async approvePrescription(id, userId, userRole) {
        const prescription = await this.getPrescription(id, userId, userRole);
        if (prescription.status !== prescription_entity_1.PrescriptionStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending prescriptions can be approved');
        }
        prescription.status = prescription_entity_1.PrescriptionStatus.APPROVED;
        prescription.approvedBy = userId;
        prescription.approvedAt = new Date();
        return await this.prescriptionRepository.save(prescription);
    }
    async rejectPrescription(id, rejectionReason, userId, userRole) {
        const prescription = await this.getPrescription(id, userId, userRole);
        if (prescription.status !== prescription_entity_1.PrescriptionStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending prescriptions can be rejected');
        }
        prescription.status = prescription_entity_1.PrescriptionStatus.REJECTED;
        prescription.rejectedBy = userId;
        prescription.rejectedAt = new Date();
        prescription.rejectionReason = rejectionReason;
        return await this.prescriptionRepository.save(prescription);
    }
    async dispensePrescription(id, userId, userRole) {
        const prescription = await this.getPrescription(id, userId, userRole);
        if (prescription.status !== prescription_entity_1.PrescriptionStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved prescriptions can be dispensed');
        }
        prescription.status = prescription_entity_1.PrescriptionStatus.DISPENSED;
        prescription.dispensedBy = userId;
        prescription.dispensedAt = new Date();
        return await this.prescriptionRepository.save(prescription);
    }
    async completePrescription(id, userId, userRole) {
        const prescription = await this.getPrescription(id, userId, userRole);
        if (prescription.status !== prescription_entity_1.PrescriptionStatus.DISPENSED) {
            throw new common_1.BadRequestException('Only dispensed prescriptions can be completed');
        }
        prescription.status = prescription_entity_1.PrescriptionStatus.COMPLETED;
        prescription.completedAt = new Date();
        return await this.prescriptionRepository.save(prescription);
    }
    async cancelPrescription(id, cancellationReason, userId, userRole) {
        const prescription = await this.getPrescription(id, userId, userRole);
        if (prescription.status === prescription_entity_1.PrescriptionStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel completed prescription');
        }
        prescription.status = prescription_entity_1.PrescriptionStatus.CANCELLED;
        prescription.cancelledBy = userId;
        prescription.cancelledAt = new Date();
        prescription.cancellationReason = cancellationReason;
        return await this.prescriptionRepository.save(prescription);
    }
    async getPrescriptionsByPatient(patientId, userId, userRole) {
        if (userRole === 'patient' && patientId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other patient prescriptions');
        }
        return await this.prescriptionRepository.find({
            where: { patientId },
            order: { createdAt: 'DESC' },
        });
    }
    async getPrescriptionsByProvider(providerId, userId, userRole) {
        if (userRole === 'provider' && providerId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other provider prescriptions');
        }
        return await this.prescriptionRepository.find({
            where: { providerId },
            order: { createdAt: 'DESC' },
        });
    }
    async getPendingPrescriptions(userId, userRole) {
        if (!['pharmacist', 'admin'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to view pending prescriptions');
        }
        return await this.prescriptionRepository.find({
            where: { status: prescription_entity_1.PrescriptionStatus.PENDING },
            order: { createdAt: 'ASC' },
        });
    }
    async getPrescriptionStatistics(userId, userRole) {
        if (!['admin', 'pharmacist'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to view prescription statistics');
        }
        const total = await this.prescriptionRepository.count();
        const pending = await this.prescriptionRepository.count({ where: { status: prescription_entity_1.PrescriptionStatus.PENDING } });
        const approved = await this.prescriptionRepository.count({ where: { status: prescription_entity_1.PrescriptionStatus.APPROVED } });
        const dispensed = await this.prescriptionRepository.count({ where: { status: prescription_entity_1.PrescriptionStatus.DISPENSED } });
        const completed = await this.prescriptionRepository.count({ where: { status: prescription_entity_1.PrescriptionStatus.COMPLETED } });
        const rejected = await this.prescriptionRepository.count({ where: { status: prescription_entity_1.PrescriptionStatus.REJECTED } });
        const cancelled = await this.prescriptionRepository.count({ where: { status: prescription_entity_1.PrescriptionStatus.CANCELLED } });
        return {
            total,
            pending,
            approved,
            dispensed,
            completed,
            rejected,
            cancelled,
            completionRate: total > 0 ? (completed / total) * 100 : 0,
        };
    }
    async getPrescriptionHistory(patientId, medicationName, userId, userRole) {
        if (userRole === 'patient' && patientId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other patient prescription history');
        }
        return await this.prescriptionRepository.find({
            where: {
                patientId,
                medicationName,
            },
            order: { createdAt: 'DESC' },
        });
    }
    async checkDrugInteractions(medicationIds) {
        return {
            hasInteractions: false,
            interactions: [],
            severity: 'none',
        };
    }
    async checkAllergies(patientId, medicationName) {
        return {
            hasAllergies: false,
            allergies: [],
            severity: 'none',
        };
    }
};
exports.PrescriptionService = PrescriptionService;
exports.PrescriptionService = PrescriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prescription_entity_1.Prescription)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PrescriptionService);
//# sourceMappingURL=prescription.service.js.map