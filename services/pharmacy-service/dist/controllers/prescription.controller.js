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
exports.PrescriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const prescription_service_1 = require("../services/prescription.service");
const create_prescription_dto_1 = require("../dto/create-prescription.dto");
let PrescriptionController = class PrescriptionController {
    constructor(prescriptionService) {
        this.prescriptionService = prescriptionService;
    }
    async create(createDto, user) {
        return await this.prescriptionService.createPrescription(createDto, user.userId);
    }
    async findAll(filters, user) {
        return await this.prescriptionService.getPrescriptions(user.userId, user.role, filters);
    }
    async findOne(id, user) {
        return await this.prescriptionService.getPrescription(id, user.userId, user.role);
    }
    async update(id, updateDto, user) {
        return await this.prescriptionService.updatePrescription(id, updateDto, user.userId, user.role);
    }
    async approve(id, user) {
        return await this.prescriptionService.approvePrescription(id, user.userId, user.role);
    }
    async reject(id, rejectionReason, user) {
        return await this.prescriptionService.rejectPrescription(id, rejectionReason, user.userId, user.role);
    }
    async dispense(id, user) {
        return await this.prescriptionService.dispensePrescription(id, user.userId, user.role);
    }
    async complete(id, user) {
        return await this.prescriptionService.completePrescription(id, user.userId, user.role);
    }
    async cancel(id, cancellationReason, user) {
        return await this.prescriptionService.cancelPrescription(id, cancellationReason, user.userId, user.role);
    }
    async getByPatient(patientId, user) {
        return await this.prescriptionService.getPrescriptionsByPatient(patientId, user.userId, user.role);
    }
    async getByProvider(providerId, user) {
        return await this.prescriptionService.getPrescriptionsByProvider(providerId, user.userId, user.role);
    }
    async getPendingPrescriptions(user) {
        return await this.prescriptionService.getPendingPrescriptions(user.userId, user.role);
    }
    async getStatistics(user) {
        return await this.prescriptionService.getPrescriptionStatistics(user.userId, user.role);
    }
    async getPrescriptionHistory(patientId, medicationName, user) {
        return await this.prescriptionService.getPrescriptionHistory(patientId, medicationName, user.userId, user.role);
    }
    async checkDrugInteractions(medicationIds, user) {
        return await this.prescriptionService.checkDrugInteractions(medicationIds);
    }
    async checkAllergies(patientId, medicationName, user) {
        return await this.prescriptionService.checkAllergies(patientId, medicationName);
    }
};
exports.PrescriptionController = PrescriptionController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('provider', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create new prescription' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prescription created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_prescription_dto_1.CreatePrescriptionDto, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescriptions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescriptions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('provider', 'pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, roles_decorator_1.Roles)('pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Approve prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription approved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, roles_decorator_1.Roles)('pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Reject prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription rejected successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('rejectionReason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "reject", null);
__decorate([
    (0, common_1.Put)(':id/dispense'),
    (0, roles_decorator_1.Roles)('pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Dispense prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription dispensed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "dispense", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    (0, roles_decorator_1.Roles)('pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Complete prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "complete", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, roles_decorator_1.Roles)('provider', 'pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('cancellationReason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescriptions by patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient prescriptions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getByPatient", null);
__decorate([
    (0, common_1.Get)('provider/:providerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescriptions by provider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Provider prescriptions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('providerId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getByProvider", null);
__decorate([
    (0, common_1.Get)('pending/prescriptions'),
    (0, roles_decorator_1.Roles)('pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending prescriptions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending prescriptions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPendingPrescriptions", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('history/patient/:patientId/medication/:medicationName'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription history for a specific medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription history retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('medicationName')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPrescriptionHistory", null);
__decorate([
    (0, common_1.Post)('check-interactions'),
    (0, roles_decorator_1.Roles)('provider', 'pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Check drug interactions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drug interactions checked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)('medicationIds')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "checkDrugInteractions", null);
__decorate([
    (0, common_1.Post)('check-allergies'),
    (0, roles_decorator_1.Roles)('provider', 'pharmacist', 'admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Check medication allergies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication allergies checked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)('patientId')),
    __param(1, (0, common_1.Body)('medicationName')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "checkAllergies", null);
exports.PrescriptionController = PrescriptionController = __decorate([
    (0, swagger_1.ApiTags)('Prescriptions'),
    (0, common_1.Controller)('prescriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [prescription_service_1.PrescriptionService])
], PrescriptionController);
//# sourceMappingURL=prescription.controller.js.map