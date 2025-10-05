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
exports.SurgeryTeamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const surgery_team_entity_1 = require("../entities/surgery-team.entity");
let SurgeryTeamService = class SurgeryTeamService {
    constructor(surgeryTeamRepository) {
        this.surgeryTeamRepository = surgeryTeamRepository;
    }
    async createSurgeryTeam(createDto, userId) {
        const teamMembers = createDto.teamMembers.map(member => this.surgeryTeamRepository.create({
            ...member,
            surgeryId: createDto.surgeryId,
            assignedBy: createDto.assignedBy || userId,
            assignedAt: new Date(),
        }));
        return await this.surgeryTeamRepository.save(teamMembers);
    }
    async getSurgeryTeam(surgeryId) {
        return await this.surgeryTeamRepository.find({
            where: { surgeryId, isActive: true },
            order: { role: 'ASC' },
        });
    }
    async getTeamMember(id) {
        const teamMember = await this.surgeryTeamRepository.findOne({
            where: { id },
        });
        if (!teamMember) {
            throw new common_1.NotFoundException('Team member not found');
        }
        return teamMember;
    }
    async updateTeamMember(id, updateDto, userId, userRole) {
        const teamMember = await this.getTeamMember(id);
        if (!['surgeon', 'admin'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to update team member');
        }
        Object.assign(teamMember, updateDto);
        return await this.surgeryTeamRepository.save(teamMember);
    }
    async confirmTeamMember(id, userId, userRole) {
        const teamMember = await this.getTeamMember(id);
        if (teamMember.memberId !== userId) {
            throw new common_1.ForbiddenException('Only the assigned team member can confirm');
        }
        teamMember.confirmedAt = new Date();
        return await this.surgeryTeamRepository.save(teamMember);
    }
    async declineTeamMember(id, declineReason, userId, userRole) {
        const teamMember = await this.getTeamMember(id);
        if (teamMember.memberId !== userId) {
            throw new common_1.ForbiddenException('Only the assigned team member can decline');
        }
        teamMember.declinedAt = new Date();
        teamMember.declineReason = declineReason;
        teamMember.isActive = false;
        return await this.surgeryTeamRepository.save(teamMember);
    }
    async removeTeamMember(id, userId, userRole) {
        const teamMember = await this.getTeamMember(id);
        if (!['surgeon', 'admin'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to remove team member');
        }
        teamMember.isActive = false;
        await this.surgeryTeamRepository.save(teamMember);
    }
    async getTeamMembersByRole(role) {
        return await this.surgeryTeamRepository.find({
            where: { role, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async getTeamMembersBySurgery(surgeryId) {
        return await this.surgeryTeamRepository.find({
            where: { surgeryId, isActive: true },
            order: { role: 'ASC' },
        });
    }
    async getTeamMembersByMember(memberId) {
        return await this.surgeryTeamRepository.find({
            where: { memberId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async getPendingConfirmations(memberId) {
        return await this.surgeryTeamRepository.find({
            where: {
                memberId,
                isActive: true,
                confirmedAt: null,
                declinedAt: null,
            },
            order: { assignedAt: 'ASC' },
        });
    }
    async getTeamStatistics() {
        const total = await this.surgeryTeamRepository.count();
        const active = await this.surgeryTeamRepository.count({ where: { isActive: true } });
        const confirmed = await this.surgeryTeamRepository
            .createQueryBuilder('team')
            .where('team.confirmedAt IS NOT NULL')
            .andWhere('team.isActive = :isActive', { isActive: true })
            .getCount();
        const declined = await this.surgeryTeamRepository
            .createQueryBuilder('team')
            .where('team.declinedAt IS NOT NULL')
            .getCount();
        const roleStats = await this.surgeryTeamRepository
            .createQueryBuilder('team')
            .select('team.role', 'role')
            .addSelect('COUNT(*)', 'count')
            .where('team.isActive = :isActive', { isActive: true })
            .groupBy('team.role')
            .getRawMany();
        return {
            total,
            active,
            confirmed,
            declined,
            confirmationRate: total > 0 ? (confirmed / total) * 100 : 0,
            roleStats,
        };
    }
    async getAvailableTeamMembers(role, startDate, endDate) {
        return [];
    }
    async getTeamMemberWorkload(memberId, startDate, endDate) {
        const assignments = await this.surgeryTeamRepository
            .createQueryBuilder('team')
            .leftJoin('team.surgery', 'surgery')
            .where('team.memberId = :memberId', { memberId })
            .andWhere('team.isActive = :isActive', { isActive: true })
            .andWhere('surgery.scheduledDate BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .getMany();
        return {
            memberId,
            totalAssignments: assignments.length,
            confirmed: assignments.filter(a => a.confirmedAt).length,
            declined: assignments.filter(a => a.declinedAt).length,
            pending: assignments.filter(a => !a.confirmedAt && !a.declinedAt).length,
        };
    }
};
exports.SurgeryTeamService = SurgeryTeamService;
exports.SurgeryTeamService = SurgeryTeamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(surgery_team_entity_1.SurgeryTeam)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SurgeryTeamService);
//# sourceMappingURL=surgery-team.service.js.map