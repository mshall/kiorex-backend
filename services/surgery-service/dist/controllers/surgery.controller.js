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
exports.SurgeryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const surgery_service_1 = require("../services/surgery.service");
const create_surgery_dto_1 = require("../dto/create-surgery.dto");
let SurgeryController = class SurgeryController {
    constructor(surgeryService) {
        this.surgeryService = surgeryService;
    }
    async create(createDto, user) {
        return await this.surgeryService.createSurgery(createDto, user.userId);
    }
    async findAll(filters, user) {
        return await this.surgeryService.getSurgeries(user.userId, user.role, filters);
    }
    async findOne(id, user) {
        return await this.surgeryService.getSurgery(id, user.userId, user.role);
    }
    async update(id, updateDto, user) {
        return await this.surgeryService.updateSurgery(id, updateDto, user.userId, user.role);
    }
    async start(id, user) {
        return await this.surgeryService.startSurgery(id, user.userId, user.role);
    }
    async complete(id, operativeNotes, user) {
        return await this.surgeryService.completeSurgery(id, operativeNotes, user.userId, user.role);
    }
    async cancel(id, cancellationReason, user) {
        return await this.surgeryService.cancelSurgery(id, cancellationReason, user.userId, user.role);
    }
    async postpone(id, postponementReason, rescheduledDate, user) {
        return await this.surgeryService.postponeSurgery(id, postponementReason, rescheduledDate, user.userId, user.role);
    }
    async getByPatient(patientId, user) {
        return await this.surgeryService.getSurgeriesByPatient(patientId, user.userId, user.role);
    }
    async getBySurgeon(surgeonId, user) {
        return await this.surgeryService.getSurgeriesBySurgeon(surgeonId, user.userId, user.role);
    }
    async getScheduledSurgeries(user) {
        return await this.surgeryService.getScheduledSurgeries(user.userId, user.role);
    }
    async getUpcomingSurgeries(days = 7) {
        return await this.surgeryService.getUpcomingSurgeries(days);
    }
    async getStatistics(user) {
        return await this.surgeryService.getSurgeryStatistics(user.userId, user.role);
    }
    async getSurgeryHistory(patientId, user) {
        return await this.surgeryService.getSurgeryHistory(patientId, user.userId, user.role);
    }
};
exports.SurgeryController = SurgeryController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create new surgery' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Surgery created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_surgery_dto_1.CreateSurgeryDto, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgeries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgeries retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update surgery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/start'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Start surgery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "start", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Complete surgery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('operativeNotes')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "complete", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel surgery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('cancellationReason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "cancel", null);
__decorate([
    (0, common_1.Put)(':id/postpone'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Postpone surgery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery postponed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('postponementReason')),
    __param(2, (0, common_1.Body)('rescheduledDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Date, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "postpone", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgeries by patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient surgeries retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "getByPatient", null);
__decorate([
    (0, common_1.Get)('surgeon/:surgeonId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgeries by surgeon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgeon surgeries retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('surgeonId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "getBySurgeon", null);
__decorate([
    (0, common_1.Get)('scheduled/list'),
    (0, roles_decorator_1.Roles)('surgeon', 'admin', 'nurse'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get scheduled surgeries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scheduled surgeries retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "getScheduledSurgeries", null);
__decorate([
    (0, common_1.Get)('upcoming/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming surgeries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upcoming surgeries retrieved successfully' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "getUpcomingSurgeries", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'surgeon'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('history/patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery history for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery history retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryController.prototype, "getSurgeryHistory", null);
exports.SurgeryController = SurgeryController = __decorate([
    (0, swagger_1.ApiTags)('Surgeries'),
    (0, common_1.Controller)('surgeries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [surgery_service_1.SurgeryService])
], SurgeryController);
//# sourceMappingURL=surgery.controller.js.map