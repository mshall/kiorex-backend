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
exports.SurgeryRoomController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const surgery_room_service_1 = require("../services/surgery-room.service");
const create_surgery_room_dto_1 = require("../dto/create-surgery-room.dto");
const surgery_room_entity_1 = require("../entities/surgery-room.entity");
let SurgeryRoomController = class SurgeryRoomController {
    constructor(surgeryRoomService) {
        this.surgeryRoomService = surgeryRoomService;
    }
    async create(createDto, user) {
        return await this.surgeryRoomService.createSurgeryRoom(createDto);
    }
    async findAll(filters) {
        return await this.surgeryRoomService.getSurgeryRooms(filters);
    }
    async search(searchTerm) {
        return await this.surgeryRoomService.searchRooms(searchTerm);
    }
    async findOne(id) {
        return await this.surgeryRoomService.getSurgeryRoom(id);
    }
    async findByNumber(roomNumber) {
        return await this.surgeryRoomService.getSurgeryRoomByNumber(roomNumber);
    }
    async update(id, updateDto, user) {
        return await this.surgeryRoomService.updateSurgeryRoom(id, updateDto);
    }
    async remove(id, user) {
        await this.surgeryRoomService.deleteSurgeryRoom(id);
        return { message: 'Surgery room deleted successfully' };
    }
    async getAvailableRooms(startDate, endDate, roomType) {
        return await this.surgeryRoomService.getAvailableRooms(startDate, endDate, roomType);
    }
    async getByType(type) {
        return await this.surgeryRoomService.getRoomsByType(type);
    }
    async getByStatus(status) {
        return await this.surgeryRoomService.getRoomsByStatus(status);
    }
    async updateStatus(id, status, user) {
        return await this.surgeryRoomService.updateRoomStatus(id, status);
    }
    async getStatistics(user) {
        return await this.surgeryRoomService.getRoomStatistics();
    }
    async getRoomsNeedingMaintenance(user) {
        return await this.surgeryRoomService.getRoomsNeedingMaintenance();
    }
    async getRoomsOutOfOrder(user) {
        return await this.surgeryRoomService.getRoomsOutOfOrder();
    }
    async getRoomUtilization(roomId, startDate, endDate, user) {
        return await this.surgeryRoomService.getRoomUtilization(roomId, startDate, endDate);
    }
};
exports.SurgeryRoomController = SurgeryRoomController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create new surgery room' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Surgery room created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_surgery_room_dto_1.CreateSurgeryRoomDto, Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery rooms' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery rooms retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search surgery rooms' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery rooms search results' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery room by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery room retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery room not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('number/:roomNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery room by number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery room retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery room not found' }),
    __param(0, (0, common_1.Param)('roomNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update surgery room' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery room updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery room not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete surgery room' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery room deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery room not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('available/rooms'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available surgery rooms' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available surgery rooms retrieved successfully' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('roomType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "getAvailableRooms", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery rooms by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery rooms by type retrieved successfully' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery rooms by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery rooms by status retrieved successfully' }),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "getByStatus", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, roles_decorator_1.Roles)('admin', 'nurse'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update room status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Surgery room not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('statistics/overview'),
    (0, roles_decorator_1.Roles)('admin', 'nurse'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get room statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('maintenance/needed'),
    (0, roles_decorator_1.Roles)('admin', 'nurse'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get rooms needing maintenance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rooms needing maintenance retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "getRoomsNeedingMaintenance", null);
__decorate([
    (0, common_1.Get)('out-of-order/list'),
    (0, roles_decorator_1.Roles)('admin', 'nurse'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get rooms out of order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rooms out of order retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "getRoomsOutOfOrder", null);
__decorate([
    (0, common_1.Get)('utilization/:roomId'),
    (0, roles_decorator_1.Roles)('admin', 'nurse'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get room utilization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room utilization retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date, Object]),
    __metadata("design:returntype", Promise)
], SurgeryRoomController.prototype, "getRoomUtilization", null);
exports.SurgeryRoomController = SurgeryRoomController = __decorate([
    (0, swagger_1.ApiTags)('Surgery Rooms'),
    (0, common_1.Controller)('surgery-rooms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [surgery_room_service_1.SurgeryRoomService])
], SurgeryRoomController);
//# sourceMappingURL=surgery-room.controller.js.map