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
exports.NurseNotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nurse_notes_entity_1 = require("../entities/nurse-notes.entity");
let NurseNotesService = class NurseNotesService {
    constructor(nurseNotesRepository) {
        this.nurseNotesRepository = nurseNotesRepository;
    }
    async createNurseNotes(createDto, userId) {
        const notes = this.nurseNotesRepository.create({
            ...createDto,
            isDraft: createDto.isDraft || false,
        });
        if (!notes.isDraft) {
            notes.publishedAt = new Date();
        }
        return await this.nurseNotesRepository.save(notes);
    }
    async getNurseNotes(userId, userRole, filters) {
        const query = this.nurseNotesRepository.createQueryBuilder('notes');
        if (userRole === 'nurse') {
            query.where('notes.nurseId = :userId', { userId });
        }
        if (filters?.patientId) {
            query.andWhere('notes.patientId = :patientId', { patientId: filters.patientId });
        }
        if (filters?.nurseId) {
            query.andWhere('notes.nurseId = :nurseId', { nurseId: filters.nurseId });
        }
        if (filters?.noteType) {
            query.andWhere('notes.noteType = :noteType', { noteType: filters.noteType });
        }
        if (filters?.priority) {
            query.andWhere('notes.priority = :priority', { priority: filters.priority });
        }
        if (filters?.isDraft !== undefined) {
            query.andWhere('notes.isDraft = :isDraft', { isDraft: filters.isDraft });
        }
        if (filters?.isConfidential !== undefined) {
            query.andWhere('notes.isConfidential = :isConfidential', { isConfidential: filters.isConfidential });
        }
        if (filters?.startDate && filters?.endDate) {
            query.andWhere('notes.createdAt BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }
        const [data, total] = await query
            .orderBy('notes.createdAt', 'DESC')
            .getManyAndCount();
        return { data, total };
    }
    async getNurseNotesById(id, userId, userRole) {
        const notes = await this.nurseNotesRepository.findOne({
            where: { id },
        });
        if (!notes) {
            throw new common_1.NotFoundException('Nurse notes not found');
        }
        if (userRole === 'nurse' && notes.nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other nurse notes');
        }
        return notes;
    }
    async updateNurseNotes(id, updateDto, userId, userRole) {
        const notes = await this.getNurseNotesById(id, userId, userRole);
        if (userRole === 'nurse' && notes.nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot update other nurse notes');
        }
        Object.assign(notes, updateDto);
        if (!notes.isDraft && !notes.publishedAt) {
            notes.publishedAt = new Date();
        }
        return await this.nurseNotesRepository.save(notes);
    }
    async publishNotes(id, userId, userRole) {
        const notes = await this.getNurseNotesById(id, userId, userRole);
        if (!notes.isDraft) {
            throw new common_1.BadRequestException('Notes are already published');
        }
        notes.isDraft = false;
        notes.publishedAt = new Date();
        return await this.nurseNotesRepository.save(notes);
    }
    async reviewNotes(id, reviewComments, userId, userRole) {
        const notes = await this.getNurseNotesById(id, userId, userRole);
        if (!['supervisor', 'admin'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to review notes');
        }
        notes.reviewedBy = userId;
        notes.reviewedAt = new Date();
        notes.reviewComments = reviewComments;
        notes.requiresSupervisorReview = false;
        return await this.nurseNotesRepository.save(notes);
    }
    async deleteNurseNotes(id, userId, userRole) {
        const notes = await this.getNurseNotesById(id, userId, userRole);
        if (userRole === 'nurse' && notes.nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot delete other nurse notes');
        }
        await this.nurseNotesRepository.remove(notes);
    }
    async getNotesByPatient(patientId, userId, userRole) {
        return await this.nurseNotesRepository.find({
            where: { patientId, isDraft: false },
            order: { createdAt: 'DESC' },
        });
    }
    async getNotesByNurse(nurseId, userId, userRole) {
        if (userRole === 'nurse' && nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other nurse notes');
        }
        return await this.nurseNotesRepository.find({
            where: { nurseId },
            order: { createdAt: 'DESC' },
        });
    }
    async getDraftNotes(nurseId, userId, userRole) {
        if (userRole === 'nurse' && nurseId !== userId) {
            throw new common_1.ForbiddenException('Cannot access other nurse draft notes');
        }
        return await this.nurseNotesRepository.find({
            where: { nurseId, isDraft: true },
            order: { createdAt: 'DESC' },
        });
    }
    async getNotesRequiringReview() {
        return await this.nurseNotesRepository.find({
            where: { requiresSupervisorReview: true, isDraft: false },
            order: { createdAt: 'ASC' },
        });
    }
    async getNotesRequiringFollowUp() {
        return await this.nurseNotesRepository.find({
            where: { requiresFollowUp: true, isDraft: false },
            order: { followUpTime: 'ASC' },
        });
    }
    async getNotesStatistics(userId, userRole) {
        if (!['admin', 'supervisor'].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to view notes statistics');
        }
        const total = await this.nurseNotesRepository.count();
        const published = await this.nurseNotesRepository.count({ where: { isDraft: false } });
        const drafts = await this.nurseNotesRepository.count({ where: { isDraft: true } });
        const confidential = await this.nurseNotesRepository.count({ where: { isConfidential: true } });
        const requiringReview = await this.nurseNotesRepository.count({ where: { requiresSupervisorReview: true } });
        const requiringFollowUp = await this.nurseNotesRepository.count({ where: { requiresFollowUp: true } });
        const typeStats = await this.nurseNotesRepository
            .createQueryBuilder('notes')
            .select('notes.noteType', 'type')
            .addSelect('COUNT(*)', 'count')
            .where('notes.isDraft = :isDraft', { isDraft: false })
            .groupBy('notes.noteType')
            .getRawMany();
        const priorityStats = await this.nurseNotesRepository
            .createQueryBuilder('notes')
            .select('notes.priority', 'priority')
            .addSelect('COUNT(*)', 'count')
            .where('notes.isDraft = :isDraft', { isDraft: false })
            .groupBy('notes.priority')
            .getRawMany();
        return {
            total,
            published,
            drafts,
            confidential,
            requiringReview,
            requiringFollowUp,
            typeStats,
            priorityStats,
        };
    }
    async searchNotes(searchTerm, userId, userRole) {
        const query = this.nurseNotesRepository
            .createQueryBuilder('notes')
            .where('notes.isDraft = :isDraft', { isDraft: false })
            .andWhere('(notes.content ILIKE :search OR notes.summary ILIKE :search)', { search: `%${searchTerm}%` });
        if (userRole === 'nurse') {
            query.andWhere('notes.nurseId = :userId', { userId });
        }
        return await query
            .orderBy('notes.createdAt', 'DESC')
            .getMany();
    }
};
exports.NurseNotesService = NurseNotesService;
exports.NurseNotesService = NurseNotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nurse_notes_entity_1.NurseNotes)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NurseNotesService);
//# sourceMappingURL=nurse-notes.service.js.map