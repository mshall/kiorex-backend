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
exports.PatientCareService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_care_entity_1 = require("../entities/patient-care.entity");
let PatientCareService = class PatientCareService {
    constructor(patientCareRepository) {
        this.patientCareRepository = patientCareRepository;
    }
    async createPatientCare(createDto, userId) {
        const care = this.patientCareRepository.create({
            ...createDto,
            status: patient_care_entity_1.CareStatus.SCHEDULED,
        });
        return await this.patientCareRepository.save(care);
    }
    async getPatientCare(userId, userRole, filters) {
        const query = this.patientCareRepository.createQueryBuilder('care');
        if (userRole === 'nurse') {
            query.where('care.nurseId = :userId', { userId });
        }
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
    async getPatientCareById(id, userId, userRole) {
        const care = await this.patientCareRepository.findOne({
            where: { id },
        });
        if (!care) {
            throw new common_1.NotFoundException('Patient care not found');
        }
        if (userRole === 'nurse' && care.nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other nurse patient care');
        }
        return care;
    }
    async updatePatientCare(id, updateDto, userId, userRole) {
        const care = await this.getPatientCareById(id, userId, userRole);
        if (!['nurse', 'supervisor', 'admin'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to update patient care');
        }
        Object.assign(care, updateDto);
        return await this.patientCareRepository.save(care);
    }
    async startCare(id, userId, userRole) {
        const care = await this.getPatientCareById(id, userId, userRole);
        if (care.status !== patient_care_entity_1.CareStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Only scheduled care can be started');
        }
        care.status = patient_care_entity_1.CareStatus.IN_PROGRESS;
        care.actualStartTime = new Date();
        return await this.patientCareRepository.save(care);
    }
    async completeCare(id, outcome, notes, userId, userRole) {
        const care = await this.getPatientCareById(id, userId, userRole);
        if (care.status !== patient_care_entity_1.CareStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Only care in progress can be completed');
        }
        care.status = patient_care_entity_1.CareStatus.COMPLETED;
        care.actualEndTime = new Date();
        care.outcome = outcome;
        care.notes = notes;
        if (care.actualStartTime) {
            const duration = care.actualEndTime.getTime() - care.actualStartTime.getTime();
            care.duration = Math.round(duration / (1000 * 60));
        }
        return await this.patientCareRepository.save(care);
    }
    async cancelCare(id, reason, userId, userRole) {
        const care = await this.getPatientCareById(id, userId, userRole);
        if (care.status === patient_care_entity_1.CareStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel completed care');
        }
        care.status = patient_care_entity_1.CareStatus.CANCELLED;
        care.notes = reason;
        return await this.patientCareRepository.save(care);
    }
    async getCareByPatient(patientId, userId, userRole) {
        return await this.patientCareRepository.find({
            where: { patientId },
            order: { scheduledTime: 'DESC' },
        });
    }
    async getCareByNurse(nurseId, userId, userRole) {
        if (userRole === 'nurse' && nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other nurse patient care');
        }
        return await this.patientCareRepository.find({
            where: { nurseId },
            order: { scheduledTime: 'DESC' },
        });
    }
    async getPendingCare() {
        return await this.patientCareRepository.find({
            where: { status: patient_care_entity_1.CareStatus.SCHEDULED },
            order: { scheduledTime: 'ASC' },
        });
    }
    async getOverdueCare() {
        const now = new Date();
        return await this.patientCareRepository
            .createQueryBuilder('care')
            .where('care.status = :status', { status: patient_care_entity_1.CareStatus.SCHEDULED })
            .andWhere('care.scheduledTime < :now', { now })
            .orderBy('care.scheduledTime', 'ASC')
            .getMany();
    }
    async getCareStatistics(userId, userRole) {
        if (!['admin', 'supervisor'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to view care statistics');
        }
        const total = await this.patientCareRepository.count();
        const scheduled = await this.patientCareRepository.count({ where: { status: patient_care_entity_1.CareStatus.SCHEDULED } });
        const inProgress = await this.patientCareRepository.count({ where: { status: patient_care_entity_1.CareStatus.IN_PROGRESS } });
        const completed = await this.patientCareRepository.count({ where: { status: patient_care_entity_1.CareStatus.COMPLETED } });
        const cancelled = await this.patientCareRepository.count({ where: { status: patient_care_entity_1.CareStatus.CANCELLED } });
        const missed = await this.patientCareRepository.count({ where: { status: patient_care_entity_1.CareStatus.MISSED } });
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
    async getNurseCareWorkload(nurseId, startDate, endDate) {
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
            completed: care.filter(c => c.status === patient_care_entity_1.CareStatus.COMPLETED).length,
            pending: care.filter(c => c.status === patient_care_entity_1.CareStatus.SCHEDULED).length,
            inProgress: care.filter(c => c.status === patient_care_entity_1.CareStatus.IN_PROGRESS).length,
            averageDuration: care.length > 0 ?
                care.reduce((sum, c) => sum + (c.duration || 0), 0) / care.length : 0,
        };
    }
};
exports.PatientCareService = PatientCareService;
exports.PatientCareService = PatientCareService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_care_entity_1.PatientCare)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientCareService);
//# sourceMappingURL=patient-care.service.js.map