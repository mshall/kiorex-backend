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
exports.NurseShiftController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const nurse_shift_service_1 = require("../services/nurse-shift.service");
const create_nurse_shift_dto_1 = require("../dto/create-nurse-shift.dto");
let NurseShiftController = class NurseShiftController {
    constructor(nurseShiftService) {
        this.nurseShiftService = nurseShiftService;
    }
    async create(createDto, user) {
        return await this.nurseShiftService.createNurseShift(createDto, user.userId);
    }
    async findAll(filters, user) {
        return await this.nurseShiftService.getNurseShifts(user.userId, user.role, filters);
    }
    async findOne(id, user) {
        return await this.nurseShiftService.getNurseShift(id, user.userId, user.role);
    }
    async update(id, updateDto, user) {
        return await this.nurseShiftService.updateNurseShift(id, updateDto, user.userId, user.role);
    }
    async start(id, user) {
        return await this.nurseShiftService.startShift(id, user.userId, user.role);
    }
    async end(id, handoverNotes, user) {
        return await this.nurseShiftService.endShift(id, handoverNotes, user.userId, user.role);
    }
    async cancel(id, cancellationReason, user) {
        return await this.nurseShiftService.cancelShift(id, cancellationReason, user.userId, user.role);
    }
    async getByNurse(nurseId, user) {
        return await this.nurseShiftService.getShiftsByNurse(nurseId, user.userId, user.role);
    }
    async getByUnit(unit) {
        return await this.nurseShiftService.getShiftsByUnit(unit);
    }
    async getCurrentShifts() {
        return await this.nurseShiftService.getCurrentShifts();
    }
    async getUpcomingShifts(days = 7) {
        return await this.nurseShiftService.getUpcomingShifts(days);
    }
    async getStatistics(user) {
        return await this.nurseShiftService.getShiftStatistics(user.userId, user.role);
    }
    async getWorkload(nurseId, startDate, endDate) {
        return await this.nurseShiftService.getNurseWorkload(nurseId, startDate, endDate);
    }
};
exports.NurseShiftController = NurseShiftController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'supervisor'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create new nurse shift' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Nurse shift created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_nurse_shift_dto_1.CreateNurseShiftDto, Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get nurse shifts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse shifts retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nurse shift by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse shift retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse shift not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('nurse', 'supervisor', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update nurse shift' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse shift updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse shift not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/start'),
    (0, roles_decorator_1.Roles)('nurse', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Start nurse shift' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse shift started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse shift not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "start", null);
__decorate([
    (0, common_1.Put)(':id/end'),
    (0, roles_decorator_1.Roles)('nurse', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'End nurse shift' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse shift ended successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse shift not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('handoverNotes')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "end", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, roles_decorator_1.Roles)('nurse', 'supervisor', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel nurse shift' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse shift cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nurse shift not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('cancellationReason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('nurse/:nurseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shifts by nurse' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse shifts retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('nurseId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "getByNurse", null);
__decorate([
    (0, common_1.Get)('unit/:unit'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shifts by unit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unit shifts retrieved successfully' }),
    __param(0, (0, common_1.Param)('unit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "getByUnit", null);
__decorate([
    (0, common_1.Get)('current/shifts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current shifts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current shifts retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "getCurrentShifts", null);
__decorate([
    (0, common_1.Get)('upcoming/shifts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming shifts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upcoming shifts retrieved successfully' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "getUpcomingShifts", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'supervisor'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get shift statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shift statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('workload/:nurseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nurse workload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse workload retrieved successfully' }),
    __param(0, (0, common_1.Param)('nurseId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], NurseShiftController.prototype, "getWorkload", null);
exports.NurseShiftController = NurseShiftController = __decorate([
    (0, swagger_1.ApiTags)('Nurse Shifts'),
    (0, common_1.Controller)('nurse-shifts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [nurse_shift_service_1.NurseShiftService])
], NurseShiftController);
//# sourceMappingURL=nurse-shift.controller.js.map