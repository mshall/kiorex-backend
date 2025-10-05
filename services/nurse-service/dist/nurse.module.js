"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NurseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const nurse_shift_entity_1 = require("./entities/nurse-shift.entity");
const patient_care_entity_1 = require("./entities/patient-care.entity");
const nurse_notes_entity_1 = require("./entities/nurse-notes.entity");
const nurse_schedule_entity_1 = require("./entities/nurse-schedule.entity");
const nurse_shift_service_1 = require("./services/nurse-shift.service");
const patient_care_service_1 = require("./services/patient-care.service");
const nurse_notes_service_1 = require("./services/nurse-notes.service");
const nurse_shift_controller_1 = require("./controllers/nurse-shift.controller");
const patient_care_controller_1 = require("./controllers/patient-care.controller");
const nurse_notes_controller_1 = require("./controllers/nurse-notes.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let NurseModule = class NurseModule {
};
exports.NurseModule = NurseModule;
exports.NurseModule = NurseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([
                nurse_shift_entity_1.NurseShift,
                patient_care_entity_1.PatientCare,
                nurse_notes_entity_1.NurseNotes,
                nurse_schedule_entity_1.NurseSchedule,
            ]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
            }),
        ],
        controllers: [nurse_shift_controller_1.NurseShiftController, patient_care_controller_1.PatientCareController, nurse_notes_controller_1.NurseNotesController],
        providers: [nurse_shift_service_1.NurseShiftService, patient_care_service_1.PatientCareService, nurse_notes_service_1.NurseNotesService, jwt_strategy_1.JwtStrategy],
        exports: [nurse_shift_service_1.NurseShiftService, patient_care_service_1.PatientCareService, nurse_notes_service_1.NurseNotesService],
    })
], NurseModule);
//# sourceMappingURL=nurse.module.js.map