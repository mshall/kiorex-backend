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
exports.MedicationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const medication_service_1 = require("../services/medication.service");
const create_medication_dto_1 = require("../dto/create-medication.dto");
let MedicationController = class MedicationController {
    constructor(medicationService) {
        this.medicationService = medicationService;
    }
    async create(createDto, user) {
        return await this.medicationService.createMedication(createDto);
    }
    async findAll(filters) {
        return await this.medicationService.getMedications(filters);
    }
    async search(searchTerm) {
        return await this.medicationService.searchMedications(searchTerm);
    }
    async findOne(id) {
        return await this.medicationService.getMedication(id);
    }
    async findByName(name) {
        return await this.medicationService.getMedicationByName(name);
    }
    async update(id, updateDto, user) {
        return await this.medicationService.updateMedication(id, updateDto);
    }
    async remove(id, user) {
        await this.medicationService.deleteMedication(id);
        return { message: 'Medication deleted successfully' };
    }
    async getByCategory(category) {
        return await this.medicationService.getMedicationsByCategory(category);
    }
    async getByDosageForm(dosageForm) {
        return await this.medicationService.getMedicationsByDosageForm(dosageForm);
    }
    async getLowStock(user) {
        return await this.medicationService.getLowStockMedications();
    }
    async getExpired(user) {
        return await this.medicationService.getExpiredMedications();
    }
    async getExpiringSoon(days = 30, user) {
        return await this.medicationService.getMedicationsExpiringSoon(days);
    }
    async getStatistics(user) {
        return await this.medicationService.getMedicationStatistics();
    }
    async updateStock(id, quantity, operation, user) {
        return await this.medicationService.updateStock(id, quantity, operation);
    }
};
exports.MedicationController = MedicationController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create new medication' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Medication created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medication_dto_1.CreateMedicationDto, Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get medications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medications retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search medications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medications search results' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medication by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medication by name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "findByName", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medications by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medications by category retrieved successfully' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getByCategory", null);
__decorate([
    (0, common_1.Get)('dosage-form/:dosageForm'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medications by dosage form' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medications by dosage form retrieved successfully' }),
    __param(0, (0, common_1.Param)('dosageForm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getByDosageForm", null);
__decorate([
    (0, common_1.Get)('stock/low'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock medications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Low stock medications retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)('stock/expired'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get expired medications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired medications retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getExpired", null);
__decorate([
    (0, common_1.Get)('stock/expiring-soon'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get medications expiring soon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medications expiring soon retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getExpiringSoon", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get medication statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Put)(':id/stock'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update medication stock' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication stock updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('quantity')),
    __param(2, (0, common_1.Body)('operation')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "updateStock", null);
exports.MedicationController = MedicationController = __decorate([
    (0, swagger_1.ApiTags)('Medications'),
    (0, common_1.Controller)('medications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [medication_service_1.MedicationService])
], MedicationController);
//# sourceMappingURL=medication.controller.js.map