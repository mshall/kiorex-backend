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
exports.SurgeryTeam = exports.TeamMemberRole = void 0;
const typeorm_1 = require("typeorm");
var TeamMemberRole;
(function (TeamMemberRole) {
    TeamMemberRole["SURGEON"] = "surgeon";
    TeamMemberRole["ASSISTANT_SURGEON"] = "assistant_surgeon";
    TeamMemberRole["ANESTHESIOLOGIST"] = "anesthesiologist";
    TeamMemberRole["NURSE"] = "nurse";
    TeamMemberRole["TECHNICIAN"] = "technician";
    TeamMemberRole["RESIDENT"] = "resident";
    TeamMemberRole["INTERN"] = "intern";
    TeamMemberRole["OBSERVER"] = "observer";
})(TeamMemberRole || (exports.TeamMemberRole = TeamMemberRole = {}));
let SurgeryTeam = class SurgeryTeam {
};
exports.SurgeryTeam = SurgeryTeam;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "surgeryId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "memberName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TeamMemberRole }),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "contactInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SurgeryTeam.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "assignedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SurgeryTeam.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SurgeryTeam.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SurgeryTeam.prototype, "declinedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SurgeryTeam.prototype, "declineReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SurgeryTeam.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SurgeryTeam.prototype, "updatedAt", void 0);
exports.SurgeryTeam = SurgeryTeam = __decorate([
    (0, typeorm_1.Entity)('surgery_teams'),
    (0, typeorm_1.Index)(['surgeryId']),
    (0, typeorm_1.Index)(['memberId']),
    (0, typeorm_1.Index)(['role'])
], SurgeryTeam);
//# sourceMappingURL=surgery-team.entity.js.map