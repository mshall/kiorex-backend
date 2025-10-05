"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurgeryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const surgery_entity_1 = require("./entities/surgery.entity");
const surgery_team_entity_1 = require("./entities/surgery-team.entity");
const surgery_room_entity_1 = require("./entities/surgery-room.entity");
const surgery_schedule_entity_1 = require("./entities/surgery-schedule.entity");
const surgery_service_1 = require("./services/surgery.service");
const surgery_team_service_1 = require("./services/surgery-team.service");
const surgery_room_service_1 = require("./services/surgery-room.service");
const surgery_controller_1 = require("./controllers/surgery.controller");
const surgery_team_controller_1 = require("./controllers/surgery-team.controller");
const surgery_room_controller_1 = require("./controllers/surgery-room.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let SurgeryModule = class SurgeryModule {
};
exports.SurgeryModule = SurgeryModule;
exports.SurgeryModule = SurgeryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([
                surgery_entity_1.Surgery,
                surgery_team_entity_1.SurgeryTeam,
                surgery_room_entity_1.SurgeryRoom,
                surgery_schedule_entity_1.SurgerySchedule,
            ]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
            }),
        ],
        controllers: [surgery_controller_1.SurgeryController, surgery_team_controller_1.SurgeryTeamController, surgery_room_controller_1.SurgeryRoomController],
        providers: [surgery_service_1.SurgeryService, surgery_team_service_1.SurgeryTeamService, surgery_room_service_1.SurgeryRoomService, jwt_strategy_1.JwtStrategy],
        exports: [surgery_service_1.SurgeryService, surgery_team_service_1.SurgeryTeamService, surgery_room_service_1.SurgeryRoomService],
    })
], SurgeryModule);
//# sourceMappingURL=surgery.module.js.map