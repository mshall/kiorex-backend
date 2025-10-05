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
exports.NurseShiftService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nurse_shift_entity_1 = require("../entities/nurse-shift.entity");
let NurseShiftService = class NurseShiftService {
    constructor(nurseShiftRepository) {
        this.nurseShiftRepository = nurseShiftRepository;
    }
    async createNurseShift(createDto, userId) {
        const shift = this.nurseShiftRepository.create({
            ...createDto,
            status: nurse_shift_entity_1.ShiftStatus.SCHEDULED,
        });
        return await this.nurseShiftRepository.save(shift);
    }
    async getNurseShifts(userId, userRole, filters) {
        const query = this.nurseShiftRepository.createQueryBuilder('shift');
        if (userRole === 'nurse') {
            query.where('shift.nurseId = :userId', { userId });
        }
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
    async getNurseShift(id, userId, userRole) {
        const shift = await this.nurseShiftRepository.findOne({
            where: { id },
        });
        if (!shift) {
            throw new common_1.NotFoundException('Nurse shift not found');
        }
        if (userRole === 'nurse' && shift.nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other nurse shifts');
        }
        return shift;
    }
    async updateNurseShift(id, updateDto, userId, userRole) {
        const shift = await this.getNurseShift(id, userId, userRole);
        if (!['nurse', 'supervisor', 'admin'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to update nurse shift');
        }
        Object.assign(shift, updateDto);
        return await this.nurseShiftRepository.save(shift);
    }
    async startShift(id, userId, userRole) {
        const shift = await this.getNurseShift(id, userId, userRole);
        if (shift.status !== nurse_shift_entity_1.ShiftStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Only scheduled shifts can be started');
        }
        shift.status = nurse_shift_entity_1.ShiftStatus.IN_PROGRESS;
        shift.actualStartTime = new Date().toTimeString().split(' ')[0];
        return await this.nurseShiftRepository.save(shift);
    }
    async endShift(id, handoverNotes, userId, userRole) {
        const shift = await this.getNurseShift(id, userId, userRole);
        if (shift.status !== nurse_shift_entity_1.ShiftStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Only shifts in progress can be ended');
        }
        shift.status = nurse_shift_entity_1.ShiftStatus.COMPLETED;
        shift.actualEndTime = new Date().toTimeString().split(' ')[0];
        shift.handoverNotes = handoverNotes;
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
    async cancelShift(id, cancellationReason, userId, userRole) {
        const shift = await this.getNurseShift(id, userId, userRole);
        if (shift.status === nurse_shift_entity_1.ShiftStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel completed shift');
        }
        shift.status = nurse_shift_entity_1.ShiftStatus.CANCELLED;
        shift.cancelledBy = userId;
        shift.cancelledAt = new Date();
        shift.cancellationReason = cancellationReason;
        return await this.nurseShiftRepository.save(shift);
    }
    async getShiftsByNurse(nurseId, userId, userRole) {
        if (userRole === 'nurse' && nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other nurse shifts');
        }
        return await this.nurseShiftRepository.find({
            where: { nurseId },
            order: { shiftDate: 'DESC' },
        });
    }
    async getShiftsByUnit(unit) {
        return await this.nurseShiftRepository.find({
            where: { unit },
            order: { shiftDate: 'DESC' },
        });
    }
    async getCurrentShifts() {
        return await this.nurseShiftRepository.find({
            where: { status: nurse_shift_entity_1.ShiftStatus.IN_PROGRESS },
            order: { shiftDate: 'ASC' },
        });
    }
    async getUpcomingShifts(days = 7) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        return await this.nurseShiftRepository
            .createQueryBuilder('shift')
            .where('shift.shiftDate BETWEEN :now AND :futureDate', {
            now: new Date(),
            futureDate,
        })
            .andWhere('shift.status = :status', { status: nurse_shift_entity_1.ShiftStatus.SCHEDULED })
            .orderBy('shift.shiftDate', 'ASC')
            .addOrderBy('shift.startTime', 'ASC')
            .getMany();
    }
    async getShiftStatistics(userId, userRole) {
        if (!['admin', 'supervisor'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to view shift statistics');
        }
        const total = await this.nurseShiftRepository.count();
        const scheduled = await this.nurseShiftRepository.count({ where: { status: nurse_shift_entity_1.ShiftStatus.SCHEDULED } });
        const inProgress = await this.nurseShiftRepository.count({ where: { status: nurse_shift_entity_1.ShiftStatus.IN_PROGRESS } });
        const completed = await this.nurseShiftRepository.count({ where: { status: nurse_shift_entity_1.ShiftStatus.COMPLETED } });
        const cancelled = await this.nurseShiftRepository.count({ where: { status: nurse_shift_entity_1.ShiftStatus.CANCELLED } });
        const noShow = await this.nurseShiftRepository.count({ where: { status: nurse_shift_entity_1.ShiftStatus.NO_SHOW } });
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
    async getNurseWorkload(nurseId, startDate, endDate) {
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
            completedShifts: shifts.filter(s => s.status === nurse_shift_entity_1.ShiftStatus.COMPLETED).length,
            totalHours,
            averageHoursPerShift: shifts.length > 0 ? totalHours / shifts.length : 0,
        };
    }
};
exports.NurseShiftService = NurseShiftService;
exports.NurseShiftService = NurseShiftService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nurse_shift_entity_1.NurseShift)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NurseShiftService);
//# sourceMappingURL=nurse-shift.service.js.map