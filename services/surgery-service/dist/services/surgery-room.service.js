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
exports.SurgeryRoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const surgery_room_entity_1 = require("../entities/surgery-room.entity");
let SurgeryRoomService = class SurgeryRoomService {
    constructor(surgeryRoomRepository) {
        this.surgeryRoomRepository = surgeryRoomRepository;
    }
    async createSurgeryRoom(createDto) {
        const existingRoom = await this.surgeryRoomRepository.findOne({
            where: { roomNumber: createDto.roomNumber },
        });
        if (existingRoom) {
            throw new common_1.BadRequestException('Room with this number already exists');
        }
        const room = this.surgeryRoomRepository.create(createDto);
        return await this.surgeryRoomRepository.save(room);
    }
    async getSurgeryRooms(filters) {
        const query = this.surgeryRoomRepository.createQueryBuilder('room');
        if (filters?.type) {
            query.andWhere('room.type = :type', { type: filters.type });
        }
        if (filters?.status) {
            query.andWhere('room.status = :status', { status: filters.status });
        }
        if (filters?.isActive !== undefined) {
            query.andWhere('room.isActive = :isActive', { isActive: filters.isActive });
        }
        if (filters?.search) {
            query.andWhere('(room.name ILIKE :search OR room.roomNumber ILIKE :search OR room.description ILIKE :search)', { search: `%${filters.search}%` });
        }
        const [data, total] = await query
            .orderBy('room.roomNumber', 'ASC')
            .getManyAndCount();
        return { data, total };
    }
    async getSurgeryRoom(id) {
        const room = await this.surgeryRoomRepository.findOne({
            where: { id },
        });
        if (!room) {
            throw new common_1.NotFoundException('Surgery room not found');
        }
        return room;
    }
    async getSurgeryRoomByNumber(roomNumber) {
        const room = await this.surgeryRoomRepository.findOne({
            where: { roomNumber },
        });
        if (!room) {
            throw new common_1.NotFoundException('Surgery room not found');
        }
        return room;
    }
    async updateSurgeryRoom(id, updateDto) {
        const room = await this.getSurgeryRoom(id);
        if (updateDto.roomNumber && updateDto.roomNumber !== room.roomNumber) {
            const existingRoom = await this.surgeryRoomRepository.findOne({
                where: { roomNumber: updateDto.roomNumber },
            });
            if (existingRoom) {
                throw new common_1.BadRequestException('Room with this number already exists');
            }
        }
        Object.assign(room, updateDto);
        return await this.surgeryRoomRepository.save(room);
    }
    async deleteSurgeryRoom(id) {
        const room = await this.getSurgeryRoom(id);
        await this.surgeryRoomRepository.remove(room);
    }
    async getAvailableRooms(startDate, endDate, roomType) {
        const query = this.surgeryRoomRepository
            .createQueryBuilder('room')
            .where('room.status = :status', { status: surgery_room_entity_1.RoomStatus.AVAILABLE })
            .andWhere('room.isActive = :isActive', { isActive: true });
        if (roomType) {
            query.andWhere('room.type = :type', { type: roomType });
        }
        return await query
            .orderBy('room.roomNumber', 'ASC')
            .getMany();
    }
    async getRoomsByType(type) {
        return await this.surgeryRoomRepository.find({
            where: { type: type, isActive: true },
            order: { roomNumber: 'ASC' },
        });
    }
    async getRoomsByStatus(status) {
        return await this.surgeryRoomRepository.find({
            where: { status, isActive: true },
            order: { roomNumber: 'ASC' },
        });
    }
    async updateRoomStatus(id, status) {
        const room = await this.getSurgeryRoom(id);
        room.status = status;
        return await this.surgeryRoomRepository.save(room);
    }
    async getRoomStatistics() {
        const total = await this.surgeryRoomRepository.count();
        const active = await this.surgeryRoomRepository.count({ where: { isActive: true } });
        const available = await this.surgeryRoomRepository.count({
            where: { status: surgery_room_entity_1.RoomStatus.AVAILABLE, isActive: true }
        });
        const occupied = await this.surgeryRoomRepository.count({
            where: { status: surgery_room_entity_1.RoomStatus.OCCUPIED, isActive: true }
        });
        const maintenance = await this.surgeryRoomRepository.count({
            where: { status: surgery_room_entity_1.RoomStatus.MAINTENANCE, isActive: true }
        });
        const outOfOrder = await this.surgeryRoomRepository.count({
            where: { status: surgery_room_entity_1.RoomStatus.OUT_OF_ORDER, isActive: true }
        });
        const typeStats = await this.surgeryRoomRepository
            .createQueryBuilder('room')
            .select('room.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .where('room.isActive = :isActive', { isActive: true })
            .groupBy('room.type')
            .getRawMany();
        const statusStats = await this.surgeryRoomRepository
            .createQueryBuilder('room')
            .select('room.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('room.isActive = :isActive', { isActive: true })
            .groupBy('room.status')
            .getRawMany();
        return {
            total,
            active,
            available,
            occupied,
            maintenance,
            outOfOrder,
            utilizationRate: total > 0 ? (occupied / total) * 100 : 0,
            typeStats,
            statusStats,
        };
    }
    async getRoomsNeedingMaintenance() {
        return await this.surgeryRoomRepository
            .createQueryBuilder('room')
            .where('room.status = :status', { status: surgery_room_entity_1.RoomStatus.MAINTENANCE })
            .andWhere('room.isActive = :isActive', { isActive: true })
            .orderBy('room.roomNumber', 'ASC')
            .getMany();
    }
    async getRoomsOutOfOrder() {
        return await this.surgeryRoomRepository
            .createQueryBuilder('room')
            .where('room.status = :status', { status: surgery_room_entity_1.RoomStatus.OUT_OF_ORDER })
            .andWhere('room.isActive = :isActive', { isActive: true })
            .orderBy('room.roomNumber', 'ASC')
            .getMany();
    }
    async searchRooms(searchTerm) {
        return await this.surgeryRoomRepository
            .createQueryBuilder('room')
            .where('(room.name ILIKE :search OR room.roomNumber ILIKE :search OR room.description ILIKE :search)', { search: `%${searchTerm}%` })
            .andWhere('room.isActive = :isActive', { isActive: true })
            .orderBy('room.roomNumber', 'ASC')
            .getMany();
    }
    async getRoomUtilization(roomId, startDate, endDate) {
        return {
            roomId,
            period: { startDate, endDate },
            totalHours: 0,
            utilizedHours: 0,
            utilizationRate: 0,
        };
    }
};
exports.SurgeryRoomService = SurgeryRoomService;
exports.SurgeryRoomService = SurgeryRoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(surgery_room_entity_1.SurgeryRoom)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SurgeryRoomService);
//# sourceMappingURL=surgery-room.service.js.map