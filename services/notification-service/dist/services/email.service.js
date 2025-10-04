"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sgMail = __importStar(require("@sendgrid/mail"));
const nodemailer = __importStar(require("nodemailer"));
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        const emailProvider = this.configService.get('EMAIL_PROVIDER') || 'smtp';
        if (emailProvider === 'sendgrid') {
            sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY') || 'dummy-key');
        }
        else {
            this.transporter = nodemailer.createTransport({
                host: this.configService.get('SMTP_HOST') || 'localhost',
                port: parseInt(this.configService.get('SMTP_PORT')) || 587,
                secure: false,
                auth: {
                    user: this.configService.get('SMTP_USER') || 'dummy@example.com',
                    pass: this.configService.get('SMTP_PASSWORD') || 'dummy-password',
                },
            });
        }
    }
    async sendEmail(data) {
        const emailProvider = this.configService.get('EMAIL_PROVIDER');
        if (emailProvider === 'sendgrid') {
            await sgMail.send({
                to: data.to,
                from: this.configService.get('EMAIL_FROM'),
                subject: data.subject,
                html: data.html,
                text: data.text,
                attachments: data.attachments,
            });
        }
        else {
            await this.transporter.sendMail({
                from: this.configService.get('EMAIL_FROM'),
                to: data.to,
                subject: data.subject,
                html: data.html,
                text: data.text,
                attachments: data.attachments,
            });
        }
    }
    async sendBulkEmails(recipients, template) {
        const batchSize = 100;
        for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);
            await Promise.all(batch.map(recipient => this.sendEmail({
                to: recipient,
                subject: template.subject,
                html: template.html,
                text: template.text,
            })));
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map