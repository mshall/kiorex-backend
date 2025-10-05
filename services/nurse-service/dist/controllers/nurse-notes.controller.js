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
exports.NurseNotesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const nurse_notes_service_1 = require("../services/nurse-notes.service");
const create_nurse_notes_dto_1 = require("../dto/create-nurse-notes.dto");
let NurseNotesController = class NurseNotesController {
    constructor(nurseNotesService) {
        this.nurseNotesService = nurseNotesService;
    }
    async create(createDto, user) {
        return await this.nurseNotesService.createNurseNotes(createDto, user.userId);
    }
    async findAll(filters, user) {
        return await this.nurseNotesService.getNurseNotes(user.userId, user.role, filters);
    }
    async search(searchTerm, user) {
        return await this.nurseNotesService.searchNotes(searchTerm, user.userId, user.role);
    }
    async findOne(id, user) {
        return await this.nurseNotesService.getNurseNotesById(id, user.userId, user.role);
    }
    async update(id, updateDto, user) {
        return await this.nurseNotesService.updateNurseNotes(id, updateDto, user.userId, user.role);
    }
    async publish(id, user) {
        return await this.nurseNotesService.publishNotes(id, user.userId, user.role);
    }
    async review(id, reviewComments, user) {
        return await this.nurseNotesService.reviewNotes(id, reviewComments, user.userId, user.role);
    }
    async remove(id, user) {
        await this.nurseNotesService.deleteNurseNotes(id, user.userId, user.role);
        return { message: 'Nurse notes deleted successfully' };
    }
    async getByPatient(patientId, user) {
        return await this.nurseNotesService.getNotesByPatient(patientId, user.userId, user.role);
    }
    async getByNurse(nurseId, user) {
        return await this.nurseNotesService.getNotesByNurse(nurseId, user.userId, user.role);
    }
    async getDrafts(nurseId, user) {
        return await this.nurseNotesService.getDraftNotes(nurseId, user.userId, user.role);
    }
    async getNotesRequiringReview(user) {
        return await this.nurseNotesService.getNotesRequiringReview();
    }
    async getNotesRequiringFollowUp() {
        return await this.nurseNotesService.getNotesRequiringFollowUp();
    }
    async getStatistics(user) {
        return await this.nurseNotesService.getNotesStatistics(user.userId, user.role);
    }
};
exports.NurseNotesController = NurseNotesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('nurse', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create new nurse notes' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Nurse notes created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_nurse_notes_dto_1.CreateNurseNotesDto, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get nurse notes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse notes retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search nurse notes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse notes search results' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nurse notes by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse notes retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse notes not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('nurse', 'supervisor', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update nurse notes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse notes updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse notes not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/publish'),
    (0, roles_decorator_1.Roles)('nurse', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Publish nurse notes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse notes published successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse notes not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "publish", null);
__decorate([
    (0, common_1.Put)(':id/review'),
    (0, roles_decorator_1.Roles)('supervisor', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Review nurse notes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse notes reviewed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse notes not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reviewComments')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "review", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('nurse', 'supervisor', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete nurse notes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse notes deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse notes not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notes by patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient notes retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "getByPatient", null);
__decorate([
    (0, common_1.Get)('nurse/:nurseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notes by nurse' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse notes retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('nurseId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "getByNurse", null);
__decorate([
    (0, common_1.Get)('drafts/:nurseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get draft notes by nurse' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Draft notes retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('nurseId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "getDrafts", null);
__decorate([
    (0, common_1.Get)('pending/review'),
    (0, roles_decorator_1.Roles)('supervisor', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get notes requiring review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notes requiring review retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "getNotesRequiringReview", null);
__decorate([
    (0, common_1.Get)('pending/follow-up'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notes requiring follow-up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notes requiring follow-up retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "getNotesRequiringFollowUp", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'supervisor'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get notes statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notes statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NurseNotesController.prototype, "getStatistics", null);
exports.NurseNotesController = NurseNotesController = __decorate([
    (0, swagger_1.ApiTags)('Nurse Notes'),
    (0, common_1.Controller)('nurse-notes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [nurse_notes_service_1.NurseNotesService])
], NurseNotesController);
//# sourceMappingURL=nurse-notes.controller.js.map