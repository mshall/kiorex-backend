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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = __importDefault(require("twilio"));
let SmsService = class SmsService {
    constructor(configService) {
        this.configService = configService;
        this.twilioClient = (0, twilio_1.default)(this.configService.get('TWILIO_ACCOUNT_SID') || 'AC1234567890abcdef1234567890abcdef', this.configService.get('TWILIO_AUTH_TOKEN') || '1234567890abcdef1234567890abcdef');
    }
    async sendSms(data) {
        await this.twilioClient.messages.create({
            body: data.body,
            from: this.configService.get('TWILIO_PHONE_NUMBER'),
            to: data.to,
        });
    }
    async sendWhatsApp(data) {
        await this.twilioClient.messages.create({
            body: data.body,
            from: `whatsapp:${this.configService.get('TWILIO_WHATSAPP_NUMBER')}`,
            to: `whatsapp:${data.to}`,
            mediaUrl: data.mediaUrl,
        });
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map