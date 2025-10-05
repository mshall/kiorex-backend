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
exports.PatientCare = exports.Priority = exports.CareStatus = exports.CareType = void 0;
const typeorm_1 = require("typeorm");
var CareType;
(function (CareType) {
    CareType["MEDICATION"] = "medication";
    CareType["VITALS"] = "vitals";
    CareType["HYGIENE"] = "hygiene";
    CareType["MOBILITY"] = "mobility";
    CareType["NUTRITION"] = "nutrition";
    CareType["EMOTIONAL"] = "emotional";
    CareType["EDUCATION"] = "education";
    CareType["ASSESSMENT"] = "assessment";
    CareType["PROCEDURE"] = "procedure";
    CareType["EMERGENCY"] = "emergency";
})(CareType || (exports.CareType = CareType = {}));
var CareStatus;
(function (CareStatus) {
    CareStatus["SCHEDULED"] = "scheduled";
    CareStatus["IN_PROGRESS"] = "in_progress";
    CareStatus["COMPLETED"] = "completed";
    CareStatus["CANCELLED"] = "cancelled";
    CareStatus["MISSED"] = "missed";
})(CareStatus || (exports.CareStatus = CareStatus = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["MEDIUM"] = "medium";
    Priority["HIGH"] = "high";
    Priority["URGENT"] = "urgent";
    Priority["CRITICAL"] = "critical";
})(Priority || (exports.Priority = Priority = {}));
let PatientCare = class PatientCare {
};
exports.PatientCare = PatientCare;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PatientCare.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], PatientCare.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], PatientCare.prototype, "nurseId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PatientCare.prototype, "nurseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CareType }),
    __metadata("design:type", String)
], PatientCare.prototype, "careType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CareStatus, default: CareStatus.SCHEDULED }),
    __metadata("design:type", String)
], PatientCare.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Priority, default: Priority.MEDIUM }),
    __metadata("design:type", String)
], PatientCare.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], PatientCare.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PatientCare.prototype, "actualStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PatientCare.prototype, "actualEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PatientCare.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "outcome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PatientCare.prototype, "medications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], PatientCare.prototype, "vitals", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PatientCare.prototype, "assessments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PatientCare.prototype, "procedures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], PatientCare.prototype, "education", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], PatientCare.prototype, "familyCommunication", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PatientCare.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PatientCare.prototype, "safetyChecks", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "supervisorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "supervisorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PatientCare.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "reviewNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PatientCare.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PatientCare.prototype, "requiresFollowUp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PatientCare.prototype, "followUpTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "followUpNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PatientCare.prototype, "incidentReported", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "incidentDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PatientCare.prototype, "incidentSeverity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PatientCare.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PatientCare.prototype, "updatedAt", void 0);
exports.PatientCare = PatientCare = __decorate([
    (0, typeorm_1.Entity)('patient_care'),
    (0, typeorm_1.Index)(['patientId']),
    (0, typeorm_1.Index)(['nurseId']),
    (0, typeorm_1.Index)(['careType']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['scheduledTime'])
], PatientCare);
//# sourceMappingURL=patient-care.entity.js.map