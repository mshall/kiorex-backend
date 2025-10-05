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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const inventory_service_1 = require("../services/inventory.service");
const create_inventory_dto_1 = require("../dto/create-inventory.dto");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async create(createDto, user) {
        return await this.inventoryService.createInventoryTransaction(createDto);
    }
    async findAll(filters) {
        return await this.inventoryService.getInventoryTransactions(filters);
    }
    async findOne(id) {
        return await this.inventoryService.getInventoryTransaction(id);
    }
    async getByMedication(medicationId) {
        return await this.inventoryService.getInventoryByMedication(medicationId);
    }
    async getCurrentStock(medicationId) {
        const stock = await this.inventoryService.getCurrentStock(medicationId);
        return { medicationId, currentStock: stock };
    }
    async getStatistics(user) {
        return await this.inventoryService.getInventoryStatistics();
    }
    async getLowStock(user) {
        return await this.inventoryService.getLowStockMedications();
    }
    async getExpired(user) {
        return await this.inventoryService.getExpiredMedications();
    }
    async getExpiringSoon(days = 30, user) {
        return await this.inventoryService.getMedicationsExpiringSoon(days);
    }
    async getInventoryValue(user) {
        const value = await this.inventoryService.getInventoryValue();
        return { totalValue: value };
    }
    async getInventoryTurnover(medicationId, days = 30, user) {
        const turnover = await this.inventoryService.getInventoryTurnover(medicationId, days);
        return { medicationId, turnover, period: days };
    }
    async getInventoryReport(startDate, endDate, user) {
        return await this.inventoryService.getInventoryReport(startDate, endDate);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create new inventory transaction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Inventory transaction created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateInventoryDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory transactions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory transactions retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory transaction by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory transaction retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inventory transaction not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('medication/:medicationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory transactions by medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication inventory transactions retrieved successfully' }),
    __param(0, (0, common_1.Param)('medicationId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getByMedication", null);
__decorate([
    (0, common_1.Get)('stock/:medicationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current stock for medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current stock retrieved successfully' }),
    __param(0, (0, common_1.Param)('medicationId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getCurrentStock", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStatistics", null);
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
], InventoryController.prototype, "getLowStock", null);
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
], InventoryController.prototype, "getExpired", null);
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
], InventoryController.prototype, "getExpiringSoon", null);
__decorate([
    (0, common_1.Get)('value/total'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get total inventory value' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Total inventory value retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryValue", null);
__decorate([
    (0, common_1.Get)('turnover/:medicationId'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory turnover for medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory turnover retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('medicationId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('days')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryTurnover", null);
__decorate([
    (0, common_1.Get)('report/period'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory report for period' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory report retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryReport", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map