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
exports.NurseNotes = exports.NotePriority = exports.NoteType = void 0;
const typeorm_1 = require("typeorm");
var NoteType;
(function (NoteType) {
    NoteType["ASSESSMENT"] = "assessment";
    NoteType["CARE_PLAN"] = "care_plan";
    NoteType["PROGRESS"] = "progress";
    NoteType["MEDICATION"] = "medication";
    NoteType["VITALS"] = "vitals";
    NoteType["INCIDENT"] = "incident";
    NoteType["HANDOVER"] = "handover";
    NoteType["EDUCATION"] = "education";
    NoteType["FAMILY"] = "family";
    NoteType["DISCHARGE"] = "discharge";
})(NoteType || (exports.NoteType = NoteType = {}));
var NotePriority;
(function (NotePriority) {
    NotePriority["LOW"] = "low";
    NotePriority["MEDIUM"] = "medium";
    NotePriority["HIGH"] = "high";
    NotePriority["URGENT"] = "urgent";
})(NotePriority || (exports.NotePriority = NotePriority = {}));
let NurseNotes = class NurseNotes {
};
exports.NurseNotes = NurseNotes;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NurseNotes.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], NurseNotes.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], NurseNotes.prototype, "nurseId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NurseNotes.prototype, "nurseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NoteType }),
    __metadata("design:type", String)
], NurseNotes.prototype, "noteType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotePriority, default: NotePriority.MEDIUM }),
    __metadata("design:type", String)
], NurseNotes.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], NurseNotes.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseNotes.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseNotes.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseNotes.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseNotes.prototype, "relatedCare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], NurseNotes.prototype, "vitalSigns", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseNotes.prototype, "medications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseNotes.prototype, "assessments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseNotes.prototype, "interventions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], NurseNotes.prototype, "patientResponse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], NurseNotes.prototype, "familyCommunication", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseNotes.prototype, "safetyConcerns", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], NurseNotes.prototype, "carePlanUpdates", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NurseNotes.prototype, "requiresFollowUp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], NurseNotes.prototype, "followUpTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseNotes.prototype, "followUpNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NurseNotes.prototype, "requiresSupervisorReview", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseNotes.prototype, "supervisorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseNotes.prototype, "supervisorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NurseNotes.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], NurseNotes.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NurseNotes.prototype, "reviewComments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NurseNotes.prototype, "isConfidential", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NurseNotes.prototype, "isDraft", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], NurseNotes.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], NurseNotes.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NurseNotes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], NurseNotes.prototype, "updatedAt", void 0);
exports.NurseNotes = NurseNotes = __decorate([
    (0, typeorm_1.Entity)('nurse_notes'),
    (0, typeorm_1.Index)(['patientId']),
    (0, typeorm_1.Index)(['nurseId']),
    (0, typeorm_1.Index)(['noteType']),
    (0, typeorm_1.Index)(['priority']),
    (0, typeorm_1.Index)(['createdAt'])
], NurseNotes);
//# sourceMappingURL=nurse-notes.entity.js.map