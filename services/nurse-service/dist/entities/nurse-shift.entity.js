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
exports.NurseShift = exports.ShiftStatus = exports.ShiftType = void 0;
const typeorm_1 = require("typeorm");
var ShiftType;
(function (ShiftType) {
    ShiftType["DAY"] = "day";
    ShiftType["EVENING"] = "evening";
    ShiftType["NIGHT"] = "night";
    ShiftType["ROTATING"] = "rotating";
})(ShiftType || (exports.ShiftType = ShiftType = {}));
var ShiftStatus;
(function (ShiftStatus) {
    ShiftStatus["SCHEDULED"] = "scheduled";
    ShiftStatus["IN_PROGRESS"] = "in_progress";
    ShiftStatus["COMPLETED"] = "completed";
    ShiftStatus["CANCELLED"] = "cancelled";
    ShiftStatus["NO_SHOW"] = "no_show";
})(ShiftStatus || (exports.ShiftStatus = ShiftStatus = {}));
let NurseShift = class NurseShift {
};
exports.NurseShift = NurseShift;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NurseShift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], NurseShift.prototype, "nurseId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NurseShift.prototype, "nurseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], NurseShift.prototype, "shiftDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ShiftType }),
    __metadata("design:type", String)
], NurseShift.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ShiftStatus, default: ShiftStatus.SCHEDULED }),
    __metadata("design:type", String)
], NurseShift.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], NurseShift.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], NurseShift.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "actualStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "actualEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], NurseShift.prototype, "patientCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "handoverNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseShift.prototype, "assignedPatients", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseShift.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseShift.prototype, "medications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseShift.prototype, "vitals", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseShift.prototype, "incidents", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "supervisorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "supervisorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "breakStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "breakEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], NurseShift.prototype, "breakDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], NurseShift.prototype, "overtimeHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "overtimeReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], NurseShift.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseShift.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NurseShift.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], NurseShift.prototype, "updatedAt", void 0);
exports.NurseShift = NurseShift = __decorate([
    (0, typeorm_1.Entity)('nurse_shifts'),
    (0, typeorm_1.Index)(['nurseId']),
    (0, typeorm_1.Index)(['shiftDate']),
    (0, typeorm_1.Index)(['status'])
], NurseShift);
//# sourceMappingURL=nurse-shift.entity.js.map