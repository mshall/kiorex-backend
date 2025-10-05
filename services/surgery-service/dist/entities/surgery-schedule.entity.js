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
exports.SurgerySchedule = exports.ScheduleStatus = void 0;
const typeorm_1 = require("typeorm");
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["AVAILABLE"] = "available";
    ScheduleStatus["BOOKED"] = "booked";
    ScheduleStatus["BLOCKED"] = "blocked";
    ScheduleStatus["MAINTENANCE"] = "maintenance";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
let SurgerySchedule = class SurgerySchedule {
};
exports.SurgerySchedule = SurgerySchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "surgeonId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "surgeryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], SurgerySchedule.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], SurgerySchedule.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], SurgerySchedule.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScheduleStatus, default: ScheduleStatus.AVAILABLE }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "blockedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SurgerySchedule.prototype, "blockedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "blockReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "unblockedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SurgerySchedule.prototype, "unblockedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SurgerySchedule.prototype, "recurringPattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], SurgerySchedule.prototype, "exceptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], SurgerySchedule.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgerySchedule.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SurgerySchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SurgerySchedule.prototype, "updatedAt", void 0);
exports.SurgerySchedule = SurgerySchedule = __decorate([
    (0, typeorm_1.Entity)('surgery_schedules'),
    (0, typeorm_1.Index)(['roomId']),
    (0, typeorm_1.Index)(['surgeonId']),
    (0, typeorm_1.Index)(['scheduledDate']),
    (0, typeorm_1.Index)(['status'])
], SurgerySchedule);
//# sourceMappingURL=surgery-schedule.entity.js.map