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
exports.MedicationInteraction = exports.InteractionSeverity = void 0;
const typeorm_1 = require("typeorm");
var InteractionSeverity;
(function (InteractionSeverity) {
    InteractionSeverity["MINOR"] = "minor";
    InteractionSeverity["MODERATE"] = "moderate";
    InteractionSeverity["MAJOR"] = "major";
    InteractionSeverity["CONTRAINDICATED"] = "contraindicated";
})(InteractionSeverity || (exports.InteractionSeverity = InteractionSeverity = {}));
let MedicationInteraction = class MedicationInteraction {
};
exports.MedicationInteraction = MedicationInteraction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "medication1Id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "medication1Name", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "medication2Id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "medication2Name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InteractionSeverity }),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "mechanism", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "clinicalEffects", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "management", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "monitoring", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], MedicationInteraction.prototype, "references", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MedicationInteraction.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MedicationInteraction.prototype, "lastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MedicationInteraction.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MedicationInteraction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MedicationInteraction.prototype, "updatedAt", void 0);
exports.MedicationInteraction = MedicationInteraction = __decorate([
    (0, typeorm_1.Entity)('medication_interactions'),
    (0, typeorm_1.Index)(['medication1Id']),
    (0, typeorm_1.Index)(['medication2Id']),
    (0, typeorm_1.Index)(['severity'])
], MedicationInteraction);
//# sourceMappingURL=medication-interaction.entity.js.map