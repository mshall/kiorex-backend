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
exports.SurgeryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const surgery_entity_1 = require("../entities/surgery.entity");
let SurgeryService = class SurgeryService {
    constructor(surgeryRepository) {
        this.surgeryRepository = surgeryRepository;
    }
    async createSurgery(createDto, userId) {
        const surgery = this.surgeryRepository.create({
            ...createDto,
            status: surgery_entity_1.SurgeryStatus.SCHEDULED,
        });
        return await this.surgeryRepository.save(surgery);
    }
    async getSurgeries(userId, userRole, filters) {
        const query = this.surgeryRepository.createQueryBuilder('surgery');
        if (userRole === 'patient') {
            query.where('surgery.patientId = :userId', { userId });
        }
        else if (userRole === 'surgeon') {
            query.where('surgery.surgeonId = :userId', { userId });
        }
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
    async getSurgery(id, userId, userRole) {
        const surgery = await this.surgeryRepository.findOne({
            where: { id },
        });
        if (!surgery) {
            throw new common_1.NotFoundException('Surgery not found');
        }
        if (userRole === 'patient' && surgery.patientId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other patient surgeries');
        }
        if (userRole === 'surgeon' && surgery.surgeonId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other surgeon surgeries');
        }
        return surgery;
    }
    async updateSurgery(id, updateDto, userId, userRole) {
        const surgery = await this.getSurgery(id, userId, userRole);
        if (!['surgeon', 'admin'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to update surgery');
        }
        Object.assign(surgery, updateDto);
        return await this.surgeryRepository.save(surgery);
    }
    async startSurgery(id, userId, userRole) {
        const surgery = await this.getSurgery(id, userId, userRole);
        if (surgery.status !== surgery_entity_1.SurgeryStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Only scheduled surgeries can be started');
        }
        surgery.status = surgery_entity_1.SurgeryStatus.IN_PROGRESS;
        surgery.actualStartTime = new Date();
        return await this.surgeryRepository.save(surgery);
    }
    async completeSurgery(id, operativeNotes, userId, userRole) {
        const surgery = await this.getSurgery(id, userId, userRole);
        if (surgery.status !== surgery_entity_1.SurgeryStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Only surgeries in progress can be completed');
        }
        surgery.status = surgery_entity_1.SurgeryStatus.COMPLETED;
        surgery.actualEndTime = new Date();
        surgery.operativeNotes = operativeNotes;
        if (surgery.actualStartTime) {
            const duration = surgery.actualEndTime.getTime() - surgery.actualStartTime.getTime();
            surgery.actualDuration = Math.round(duration / (1000 * 60));
        }
        return await this.surgeryRepository.save(surgery);
    }
    async cancelSurgery(id, cancellationReason, userId, userRole) {
        const surgery = await this.getSurgery(id, userId, userRole);
        if (surgery.status === surgery_entity_1.SurgeryStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel completed surgery');
        }
        surgery.status = surgery_entity_1.SurgeryStatus.CANCELLED;
        surgery.cancelledBy = userId;
        surgery.cancelledAt = new Date();
        surgery.cancellationReason = cancellationReason;
        return await this.surgeryRepository.save(surgery);
    }
    async postponeSurgery(id, postponementReason, rescheduledDate, userId, userRole) {
        const surgery = await this.getSurgery(id, userId, userRole);
        if (surgery.status === surgery_entity_1.SurgeryStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot postpone completed surgery');
        }
        surgery.status = surgery_entity_1.SurgeryStatus.POSTPONED;
        surgery.postponedBy = userId;
        surgery.postponedAt = new Date();
        surgery.postponementReason = postponementReason;
        surgery.rescheduledDate = rescheduledDate;
        return await this.surgeryRepository.save(surgery);
    }
    async getSurgeriesByPatient(patientId, userId, userRole) {
        if (userRole === 'patient' && patientId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other patient surgeries');
        }
        return await this.surgeryRepository.find({
            where: { patientId },
            order: { scheduledDate: 'DESC' },
        });
    }
    async getSurgeriesBySurgeon(surgeonId, userId, userRole) {
        if (userRole === 'surgeon' && surgeonId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other surgeon surgeries');
        }
        return await this.surgeryRepository.find({
            where: { surgeonId },
            order: { scheduledDate: 'DESC' },
        });
    }
    async getScheduledSurgeries(userId, userRole) {
        if (!['surgeon', 'admin', 'nurse'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to view scheduled surgeries');
        }
        return await this.surgeryRepository.find({
            where: { status: surgery_entity_1.SurgeryStatus.SCHEDULED },
            order: { scheduledDate: 'ASC' },
        });
    }
    async getSurgeryStatistics(userId, userRole) {
        if (!['admin', 'surgeon'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to view surgery statistics');
        }
        const total = await this.surgeryRepository.count();
        const scheduled = await this.surgeryRepository.count({ where: { status: surgery_entity_1.SurgeryStatus.SCHEDULED } });
        const inProgress = await this.surgeryRepository.count({ where: { status: surgery_entity_1.SurgeryStatus.IN_PROGRESS } });
        const completed = await this.surgeryRepository.count({ where: { status: surgery_entity_1.SurgeryStatus.COMPLETED } });
        const cancelled = await this.surgeryRepository.count({ where: { status: surgery_entity_1.SurgeryStatus.CANCELLED } });
        const postponed = await this.surgeryRepository.count({ where: { status: surgery_entity_1.SurgeryStatus.POSTPONED } });
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
    async getSurgeryHistory(patientId, userId, userRole) {
        if (userRole === 'patient' && patientId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other patient surgery history');
        }
        return await this.surgeryRepository.find({
            where: { patientId },
            order: { scheduledDate: 'DESC' },
        });
    }
    async getUpcomingSurgeries(days = 7) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        return await this.surgeryRepository
            .createQueryBuilder('surgery')
            .where('surgery.scheduledDate BETWEEN :now AND :futureDate', {
            now: new Date(),
            futureDate,
        })
            .andWhere('surgery.status = :status', { status: surgery_entity_1.SurgeryStatus.SCHEDULED })
            .orderBy('surgery.scheduledDate', 'ASC')
            .getMany();
    }
};
exports.SurgeryService = SurgeryService;
exports.SurgeryService = SurgeryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(surgery_entity_1.Surgery)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SurgeryService);
//# sourceMappingURL=surgery.service.js.map