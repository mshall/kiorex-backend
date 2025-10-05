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
exports.Surgery = exports.SurgeryCategory = exports.SurgeryType = exports.SurgeryStatus = void 0;
const typeorm_1 = require("typeorm");
var SurgeryStatus;
(function (SurgeryStatus) {
    SurgeryStatus["SCHEDULED"] = "scheduled";
    SurgeryStatus["IN_PROGRESS"] = "in_progress";
    SurgeryStatus["COMPLETED"] = "completed";
    SurgeryStatus["CANCELLED"] = "cancelled";
    SurgeryStatus["POSTPONED"] = "postponed";
})(SurgeryStatus || (exports.SurgeryStatus = SurgeryStatus = {}));
var SurgeryType;
(function (SurgeryType) {
    SurgeryType["ELECTIVE"] = "elective";
    SurgeryType["EMERGENCY"] = "emergency";
    SurgeryType["URGENT"] = "urgent";
})(SurgeryType || (exports.SurgeryType = SurgeryType = {}));
var SurgeryCategory;
(function (SurgeryCategory) {
    SurgeryCategory["CARDIAC"] = "cardiac";
    SurgeryCategory["NEUROSURGERY"] = "neurosurgery";
    SurgeryCategory["ORTHOPEDIC"] = "orthopedic";
    SurgeryCategory["GENERAL"] = "general";
    SurgeryCategory["PLASTIC"] = "plastic";
    SurgeryCategory["UROLOGY"] = "urology";
    SurgeryCategory["GYNECOLOGY"] = "gynecology";
    SurgeryCategory["ONCOLOGY"] = "oncology";
    SurgeryCategory["PEDIATRIC"] = "pediatric";
    SurgeryCategory["TRAUMA"] = "trauma";
})(SurgeryCategory || (exports.SurgeryCategory = SurgeryCategory = {}));
let Surgery = class Surgery {
};
exports.Surgery = Surgery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Surgery.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Surgery.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Surgery.prototype, "surgeonId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Surgery.prototype, "procedureName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SurgeryType }),
    __metadata("design:type", String)
], Surgery.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SurgeryCategory }),
    __metadata("design:type", String)
], Surgery.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SurgeryStatus, default: SurgeryStatus.SCHEDULED }),
    __metadata("design:type", String)
], Surgery.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Surgery.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Surgery.prototype, "actualStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Surgery.prototype, "actualEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Surgery.prototype, "estimatedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Surgery.prototype, "actualDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "operatingRoom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "preoperativeNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "operativeNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "postoperativeNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "complications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "anesthesia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "bloodLoss", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "specimens", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Surgery.prototype, "teamMembers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Surgery.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Surgery.prototype, "medications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Surgery.prototype, "complicationsList", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Surgery.prototype, "followUpInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Surgery.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "insuranceCoverage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "priorAuthorization", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "consentForm", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "preoperativeChecklist", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "postoperativeChecklist", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "dischargeInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Surgery.prototype, "followUpDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Surgery.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "postponedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Surgery.prototype, "postponedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "postponementReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Surgery.prototype, "rescheduledDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Surgery.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Surgery.prototype, "updatedAt", void 0);
exports.Surgery = Surgery = __decorate([
    (0, typeorm_1.Entity)('surgeries'),
    (0, typeorm_1.Index)(['patientId']),
    (0, typeorm_1.Index)(['surgeonId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['scheduledDate'])
], Surgery);
//# sourceMappingURL=surgery.entity.js.map