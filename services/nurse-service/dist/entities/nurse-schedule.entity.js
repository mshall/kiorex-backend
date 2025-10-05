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
exports.NurseSchedule = exports.ScheduleType = exports.ScheduleStatus = void 0;
const typeorm_1 = require("typeorm");
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["AVAILABLE"] = "available";
    ScheduleStatus["SCHEDULED"] = "scheduled";
    ScheduleStatus["BLOCKED"] = "blocked";
    ScheduleStatus["VACATION"] = "vacation";
    ScheduleStatus["SICK_LEAVE"] = "sick_leave";
    ScheduleStatus["TRAINING"] = "training";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
var ScheduleType;
(function (ScheduleType) {
    ScheduleType["REGULAR"] = "regular";
    ScheduleType["OVERTIME"] = "overtime";
    ScheduleType["ON_CALL"] = "on_call";
    ScheduleType["FLOAT"] = "float";
    ScheduleType["PRECEPTOR"] = "preceptor";
    ScheduleType["CHARGE"] = "charge";
})(ScheduleType || (exports.ScheduleType = ScheduleType = {}));
let NurseSchedule = class NurseSchedule {
};
exports.NurseSchedule = NurseSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NurseSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], NurseSchedule.prototype, "nurseId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NurseSchedule.prototype, "nurseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], NurseSchedule.prototype, "scheduleDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScheduleStatus, default: ScheduleStatus.AVAILABLE }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScheduleType, default: ScheduleType.REGULAR }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], NurseSchedule.prototype, "patientLoad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseSchedule.prototype, "responsibilities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseSchedule.prototype, "competencies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseSchedule.prototype, "assignments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseSchedule.prototype, "breaks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseSchedule.prototype, "training", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseSchedule.prototype, "meetings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], NurseSchedule.prototype, "hours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], NurseSchedule.prototype, "overtimeHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], NurseSchedule.prototype, "payRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], NurseSchedule.prototype, "totalPay", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "supervisorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "supervisorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "scheduledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], NurseSchedule.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "confirmedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], NurseSchedule.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "declinedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], NurseSchedule.prototype, "declinedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "declineReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], NurseSchedule.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseSchedule.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], NurseSchedule.prototype, "recurringPattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseSchedule.prototype, "exceptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NurseSchedule.prototype, "isOnCall", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NurseSchedule.prototype, "isFloat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NurseSchedule.prototype, "isCharge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NurseSchedule.prototype, "isPreceptor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NurseSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], NurseSchedule.prototype, "updatedAt", void 0);
exports.NurseSchedule = NurseSchedule = __decorate([
    (0, typeorm_1.Entity)('nurse_schedules'),
    (0, typeorm_1.Index)(['nurseId']),
    (0, typeorm_1.Index)(['scheduleDate']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['type'])
], NurseSchedule);
//# sourceMappingURL=nurse-schedule.entity.js.map