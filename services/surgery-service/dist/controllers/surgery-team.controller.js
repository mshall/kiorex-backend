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
exports.SurgeryTeamController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const surgery_team_service_1 = require("../services/surgery-team.service");
const create_surgery_team_dto_1 = require("../dto/create-surgery-team.dto");
const surgery_team_entity_1 = require("../entities/surgery-team.entity");
let SurgeryTeamController = class SurgeryTeamController {
    constructor(surgeryTeamService) {
        this.surgeryTeamService = surgeryTeamService;
    }
    async create(createDto, user) {
        return await this.surgeryTeamService.createSurgeryTeam(createDto, user.userId);
    }
    async getSurgeryTeam(surgeryId) {
        return await this.surgeryTeamService.getSurgeryTeam(surgeryId);
    }
    async findOne(id) {
        return await this.surgeryTeamService.getTeamMember(id);
    }
    async update(id, updateDto, user) {
        return await this.surgeryTeamService.updateTeamMember(id, updateDto, user.userId, user.role);
    }
    async confirm(id, user) {
        return await this.surgeryTeamService.confirmTeamMember(id, user.userId, user.role);
    }
    async decline(id, declineReason, user) {
        return await this.surgeryTeamService.declineTeamMember(id, declineReason, user.userId, user.role);
    }
    async remove(id, user) {
        await this.surgeryTeamService.removeTeamMember(id, user.userId, user.role);
        return { message: 'Team member removed successfully' };
    }
    async getByRole(role) {
        return await this.surgeryTeamService.getTeamMembersByRole(role);
    }
    async getByMember(memberId) {
        return await this.surgeryTeamService.getTeamMembersByMember(memberId);
    }
    async getPendingConfirmations(memberId) {
        return await this.surgeryTeamService.getPendingConfirmations(memberId);
    }
    async getStatistics(user) {
        return await this.surgeryTeamService.getTeamStatistics();
    }
    async getWorkload(memberId, startDate, endDate) {
        return await this.surgeryTeamService.getTeamMemberWorkload(memberId, startDate, endDate);
    }
    async getAvailableTeamMembers(role, startDate, endDate, user) {
        return await this.surgeryTeamService.getAvailableTeamMembers(role, startDate, endDate);
    }
};
exports.SurgeryTeamController = SurgeryTeamController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create surgery team' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Surgery team created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_surgery_team_dto_1.CreateSurgeryTeamDto, Object]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('surgery/:surgeryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery team' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery team retrieved successfully' }),
    __param(0, (0, common_1.Param)('surgeryId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "getSurgeryTeam", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get team member by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update team member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm team member assignment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member confirmed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "confirm", null);
__decorate([
    (0, common_1.Put)(':id/decline'),
    (0, swagger_1.ApiOperation)({ summary: 'Decline team member assignment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member declined successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('declineReason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "decline", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remove team member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('role/:role'),
    (0, swagger_1.ApiOperation)({ summary: 'Get team members by role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team members by role retrieved successfully' }),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "getByRole", null);
__decorate([
    (0, common_1.Get)('member/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get team members by member ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team members by member ID retrieved successfully' }),
    __param(0, (0, common_1.Param)('memberId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "getByMember", null);
__decorate([
    (0, common_1.Get)('pending/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending confirmations for member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending confirmations retrieved successfully' }),
    __param(0, (0, common_1.Param)('memberId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "getPendingConfirmations", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'surgeon'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get team statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('workload/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get team member workload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member workload retrieved successfully' }),
    __param(0, (0, common_1.Param)('memberId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "getWorkload", null);
__decorate([
    (0, common_1.Get)('available/:role'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get available team members by role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available team members retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('role')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date, Object]),
    __metadata("design:returntype", Promise)
], SurgeryTeamController.prototype, "getAvailableTeamMembers", null);
exports.SurgeryTeamController = SurgeryTeamController = __decorate([
    (0, swagger_1.ApiTags)('Surgery Teams'),
    (0, common_1.Controller)('surgery-teams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [surgery_team_service_1.SurgeryTeamService])
], SurgeryTeamController);
//# sourceMappingURL=surgery-team.controller.js.map