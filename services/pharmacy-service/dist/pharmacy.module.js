"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const medication_entity_1 = require("./entities/medication.entity");
const prescription_entity_1 = require("./entities/prescription.entity");
const inventory_entity_1 = require("./entities/inventory.entity");
const medication_interaction_entity_1 = require("./entities/medication-interaction.entity");
const medication_allergy_entity_1 = require("./entities/medication-allergy.entity");
const medication_service_1 = require("./services/medication.service");
const prescription_service_1 = require("./services/prescription.service");
const inventory_service_1 = require("./services/inventory.service");
const medication_controller_1 = require("./controllers/medication.controller");
const prescription_controller_1 = require("./controllers/prescription.controller");
const inventory_controller_1 = require("./controllers/inventory.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let PharmacyModule = class PharmacyModule {
};
exports.PharmacyModule = PharmacyModule;
exports.PharmacyModule = PharmacyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([
                medication_entity_1.Medication,
                prescription_entity_1.Prescription,
                inventory_entity_1.Inventory,
                medication_interaction_entity_1.MedicationInteraction,
                medication_allergy_entity_1.MedicationAllergy,
            ]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
            }),
        ],
        controllers: [medication_controller_1.MedicationController, prescription_controller_1.PrescriptionController, inventory_controller_1.InventoryController],
        providers: [medication_service_1.MedicationService, prescription_service_1.PrescriptionService, inventory_service_1.InventoryService, jwt_strategy_1.JwtStrategy],
        exports: [medication_service_1.MedicationService, prescription_service_1.PrescriptionService, inventory_service_1.InventoryService],
    })
], PharmacyModule);
//# sourceMappingURL=pharmacy.module.js.map