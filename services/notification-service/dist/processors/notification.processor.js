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
exports.NotificationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const email_service_1 = require("../services/email.service");
const sms_service_1 = require("../services/sms.service");
const push_notification_service_1 = require("../services/push-notification.service");
let NotificationProcessor = class NotificationProcessor {
    constructor(emailService, smsService, pushService) {
        this.emailService = emailService;
        this.smsService = smsService;
        this.pushService = pushService;
    }
    async sendEmail(job) {
        const { notificationId, userId, content } = job.data;
        try {
            const userEmail = await this.getUserEmail(userId);
            await this.emailService.sendEmail({
                to: userEmail,
                subject: content.title,
                html: content.body,
                text: content.body,
            });
            console.log(`Email sent for notification ${notificationId}`);
        }
        catch (error) {
            console.error(`Failed to send email for notification ${notificationId}:`, error);
            throw error;
        }
    }
    async sendSms(job) {
        const { notificationId, userId, content } = job.data;
        try {
            const userPhone = await this.getUserPhone(userId);
            await this.smsService.sendSms({
                to: userPhone,
                body: content.body,
            });
            console.log(`SMS sent for notification ${notificationId}`);
        }
        catch (error) {
            console.error(`Failed to send SMS for notification ${notificationId}:`, error);
            throw error;
        }
    }
    async sendPush(job) {
        const { notificationId, userId, content } = job.data;
        try {
            const pushToken = await this.getUserPushToken(userId);
            await this.pushService.sendPushNotification({
                token: pushToken,
                title: content.title,
                body: content.body,
                data: content.data,
            });
            console.log(`Push notification sent for notification ${notificationId}`);
        }
        catch (error) {
            console.error(`Failed to send push notification ${notificationId}:`, error);
            throw error;
        }
    }
    async processBulkNotification(job) {
        const { userIds, type, templateId, data } = job.data;
        console.log(`Processing bulk notification for ${userIds.length} users`);
        for (const userId of userIds) {
        }
    }
    async getUserEmail(userId) {
        return `user${userId}@example.com`;
    }
    async getUserPhone(userId) {
        return `+1234567890`;
    }
    async getUserPushToken(userId) {
        return `push_token_${userId}`;
    }
};
exports.NotificationProcessor = NotificationProcessor;
__decorate([
    (0, bull_1.Process)('send-email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "sendEmail", null);
__decorate([
    (0, bull_1.Process)('send-sms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "sendSms", null);
__decorate([
    (0, bull_1.Process)('send-push'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "sendPush", null);
__decorate([
    (0, bull_1.Process)('process-bulk-notification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "processBulkNotification", null);
exports.NotificationProcessor = NotificationProcessor = __decorate([
    (0, bull_1.Processor)('notification-queue'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        sms_service_1.SmsService,
        push_notification_service_1.PushNotificationService])
], NotificationProcessor);
//# sourceMappingURL=notification.processor.js.map