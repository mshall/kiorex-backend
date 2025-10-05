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
exports.MedicationAllergy = exports.AllergyType = exports.AllergySeverity = void 0;
const typeorm_1 = require("typeorm");
var AllergySeverity;
(function (AllergySeverity) {
    AllergySeverity["MILD"] = "mild";
    AllergySeverity["MODERATE"] = "moderate";
    AllergySeverity["SEVERE"] = "severe";
    AllergySeverity["LIFE_THREATENING"] = "life_threatening";
})(AllergySeverity || (exports.AllergySeverity = AllergySeverity = {}));
var AllergyType;
(function (AllergyType) {
    AllergyType["MEDICATION"] = "medication";
    AllergyType["FOOD"] = "food";
    AllergyType["ENVIRONMENTAL"] = "environmental";
    AllergyType["CONTACT"] = "contact";
})(AllergyType || (exports.AllergyType = AllergyType = {}));
let MedicationAllergy = class MedicationAllergy {
};
exports.MedicationAllergy = MedicationAllergy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "medicationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "medicationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AllergyType }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "allergyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AllergySeverity }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "symptoms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "treatment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MedicationAllergy.prototype, "onsetDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MedicationAllergy.prototype, "lastOccurrence", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "reportedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MedicationAllergy.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MedicationAllergy.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MedicationAllergy.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], MedicationAllergy.prototype, "crossReactions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], MedicationAllergy.prototype, "alternativeMedications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], MedicationAllergy.prototype, "documentation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MedicationAllergy.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MedicationAllergy.prototype, "updatedAt", void 0);
exports.MedicationAllergy = MedicationAllergy = __decorate([
    (0, typeorm_1.Entity)('medication_allergies'),
    (0, typeorm_1.Index)(['patientId']),
    (0, typeorm_1.Index)(['medicationId']),
    (0, typeorm_1.Index)(['allergyType']),
    (0, typeorm_1.Index)(['severity'])
], MedicationAllergy);
//# sourceMappingURL=medication-allergy.entity.js.map