"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const bull_1 = require("@nestjs/bull");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const notification_entity_1 = require("./entities/notification.entity");
const notification_template_entity_1 = require("./entities/notification-template.entity");
const notification_preference_entity_1 = require("./entities/notification-preference.entity");
const notification_log_entity_1 = require("./entities/notification-log.entity");
const notification_controller_1 = require("./controllers/notification.controller");
const app_controller_1 = require("./controllers/app.controller");
const notification_service_1 = require("./services/notification.service");
const email_service_1 = require("./services/email.service");
const sms_service_1 = require("./services/sms.service");
const push_notification_service_1 = require("./services/push-notification.service");
const in_app_notification_service_1 = require("./services/in-app-notification.service");
const template_service_1 = require("./services/template.service");
const notification_processor_1 = require("./processors/notification.processor");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT, 10) || 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'notification_db',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: process.env.NODE_ENV === 'development',
            }),
            typeorm_1.TypeOrmModule.forFeature([
                notification_entity_1.Notification,
                notification_template_entity_1.NotificationTemplate,
                notification_preference_entity_1.NotificationPreference,
                notification_log_entity_1.NotificationLog,
            ]),
            microservices_1.ClientsModule.register([
                {
                    name: 'KAFKA_SERVICE',
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'notification-service',
                            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                        },
                        consumer: {
                            groupId: 'notification-service-consumer',
                        },
                    },
                },
            ]),
            bull_1.BullModule.registerQueue({
                name: 'notification-queue',
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                },
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
            }),
        ],
        controllers: [notification_controller_1.NotificationController, app_controller_1.AppController],
        providers: [
            notification_service_1.NotificationService,
            in_app_notification_service_1.InAppNotificationService,
            template_service_1.TemplateService,
            notification_processor_1.NotificationProcessor,
            email_service_1.EmailService,
            sms_service_1.SmsService,
            push_notification_service_1.PushNotificationService,
            jwt_strategy_1.JwtStrategy,
        ],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map