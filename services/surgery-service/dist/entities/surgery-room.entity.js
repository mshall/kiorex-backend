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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurgeryRoom = exports.RoomType = exports.RoomStatus = void 0;
const typeorm_1 = require("typeorm");
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["AVAILABLE"] = "available";
    RoomStatus["OCCUPIED"] = "occupied";
    RoomStatus["MAINTENANCE"] = "maintenance";
    RoomStatus["OUT_OF_ORDER"] = "out_of_order";
})(RoomStatus || (exports.RoomStatus = RoomStatus = {}));
var RoomType;
(function (RoomType) {
    RoomType["OPERATING_ROOM"] = "operating_room";
    RoomType["RECOVERY_ROOM"] = "recovery_room";
    RoomType["PREP_ROOM"] = "prep_room";
    RoomType["HOLDING_ROOM"] = "holding_room";
})(RoomType || (exports.RoomType = RoomType = {}));
let SurgeryRoom = class SurgeryRoom {
};
exports.SurgeryRoom = SurgeryRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "roomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RoomType }),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RoomStatus, default: RoomStatus.AVAILABLE }),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], SurgeryRoom.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], SurgeryRoom.prototype, "capabilities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SurgeryRoom.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], SurgeryRoom.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "wing", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgeryRoom.prototype, "building", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SurgeryRoom.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SurgeryRoom.prototype, "maintenanceSchedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SurgeryRoom.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], SurgeryRoom.prototype, "hourlyRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], SurgeryRoom.prototype, "restrictions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], SurgeryRoom.prototype, "specialRequirements", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SurgeryRoom.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SurgeryRoom.prototype, "updatedAt", void 0);
exports.SurgeryRoom = SurgeryRoom = __decorate([
    (0, typeorm_1.Entity)('surgery_rooms'),
    (0, typeorm_1.Index)(['roomNumber']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['type'])
], SurgeryRoom);
//# sourceMappingURL=surgery-room.entity.js.map