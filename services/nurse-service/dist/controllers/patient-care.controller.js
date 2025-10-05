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
exports.PatientCareController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const patient_care_service_1 = require("../services/patient-care.service");
const create_patient_care_dto_1 = require("../dto/create-patient-care.dto");
let PatientCareController = class PatientCareController {
    constructor(patientCareService) {
        this.patientCareService = patientCareService;
    }
    async create(createDto, user) {
        return await this.patientCareService.createPatientCare(createDto, user.userId);
    }
    async findAll(filters, user) {
        return await this.patientCareService.getPatientCare(user.userId, user.role, filters);
    }
    async findOne(id, user) {
        return await this.patientCareService.getPatientCareById(id, user.userId, user.role);
    }
    async update(id, updateDto, user) {
        return await this.patientCareService.updatePatientCare(id, updateDto, user.userId, user.role);
    }
    async start(id, user) {
        return await this.patientCareService.startCare(id, user.userId, user.role);
    }
    async complete(id, outcome, notes, user) {
        return await this.patientCareService.completeCare(id, outcome, notes, user.userId, user.role);
    }
    async cancel(id, reason, user) {
        return await this.patientCareService.cancelCare(id, reason, user.userId, user.role);
    }
    async getByPatient(patientId, user) {
        return await this.patientCareService.getCareByPatient(patientId, user.userId, user.role);
    }
    async getByNurse(nurseId, user) {
        return await this.patientCareService.getCareByNurse(nurseId, user.userId, user.role);
    }
    async getPendingCare() {
        return await this.patientCareService.getPendingCare();
    }
    async getOverdueCare() {
        return await this.patientCareService.getOverdueCare();
    }
    async getStatistics(user) {
        return await this.patientCareService.getCareStatistics(user.userId, user.role);
    }
    async getWorkload(nurseId, startDate, endDate) {
        return await this.patientCareService.getNurseCareWorkload(nurseId, startDate, endDate);
    }
};
exports.PatientCareController = PatientCareController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('nurse', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create new patient care' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient care created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_patient_care_dto_1.CreatePatientCareDto, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient care' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient care retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient care by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient care retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient care not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('nurse', 'supervisor', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update patient care' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient care updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient care not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/start'),
    (0, roles_decorator_1.Roles)('nurse', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Start patient care' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient care started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient care not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "start", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    (0, roles_decorator_1.Roles)('nurse', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Complete patient care' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient care completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient care not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('outcome')),
    __param(2, (0, common_1.Body)('notes')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "complete", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, roles_decorator_1.Roles)('nurse', 'supervisor', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel patient care' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient care cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient care not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get care by patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient care retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "getByPatient", null);
__decorate([
    (0, common_1.Get)('nurse/:nurseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get care by nurse' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse care retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('nurseId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "getByNurse", null);
__decorate([
    (0, common_1.Get)('pending/care'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending care' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending care retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "getPendingCare", null);
__decorate([
    (0, common_1.Get)('overdue/care'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue care' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overdue care retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "getOverdueCare", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'supervisor'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get care statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Care statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('workload/:nurseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nurse care workload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nurse care workload retrieved successfully' }),
    __param(0, (0, common_1.Param)('nurseId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], PatientCareController.prototype, "getWorkload", null);
exports.PatientCareController = PatientCareController = __decorate([
    (0, swagger_1.ApiTags)('Patient Care'),
    (0, common_1.Controller)('patient-care'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [patient_care_service_1.PatientCareService])
], PatientCareController);
//# sourceMappingURL=patient-care.controller.js.map