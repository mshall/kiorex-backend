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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const microservices_1 = require("@nestjs/microservices");
const notification_entity_1 = require("../entities/notification.entity");
const notification_preference_entity_1 = require("../entities/notification-preference.entity");
const email_service_1 = require("./email.service");
const sms_service_1 = require("./sms.service");
const push_notification_service_1 = require("./push-notification.service");
const in_app_notification_service_1 = require("./in-app-notification.service");
const template_service_1 = require("./template.service");
let NotificationService = class NotificationService {
    constructor(notificationRepository, preferenceRepository, notificationQueue, kafkaClient, emailService, smsService, pushService, inAppService, templateService) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
        this.notificationQueue = notificationQueue;
        this.kafkaClient = kafkaClient;
        this.emailService = emailService;
        this.smsService = smsService;
        this.pushService = pushService;
        this.inAppService = inAppService;
        this.templateService = templateService;
    }
    async sendNotification(data) {
        const preferences = await this.getUserPreferences(data.userId);
        if (!this.shouldSendNotification(preferences, data.type)) {
            return;
        }
        const template = await this.templateService.getTemplate(data.templateId);
        const notification = this.notificationRepository.create({
            userId: data.userId,
            type: data.type,
            title: await this.templateService.renderTitle(template, data.data),
            body: await this.templateService.renderBody(template, data.data),
            data: data.data,
            status: notification_entity_1.NotificationStatus.PENDING,
            priority: data.priority || 'normal',
        });
        const savedNotification = await this.notificationRepository.save(notification);
        const notificationData = Array.isArray(savedNotification) ? savedNotification[0] : savedNotification;
        const channels = this.getEnabledChannels(preferences, data.type);
        for (const channel of channels) {
            await this.notificationQueue.add(`send-${channel}`, {
                notificationId: notificationData.id,
                userId: data.userId,
                channel,
                content: {
                    title: notificationData.title,
                    body: notificationData.body,
                    data: notificationData.data,
                },
            });
        }
        await this.inAppService.create(notificationData);
    }
    async sendBulkNotification(data) {
        await this.notificationQueue.add('process-bulk-notification', {
            ...data,
            timestamp: new Date(),
        });
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, userId },
        });
        if (notification && !notification.readAt) {
            notification.readAt = new Date();
            notification.status = notification_entity_1.NotificationStatus.READ;
            await this.notificationRepository.save(notification);
            await this.kafkaClient.emit('notification.read', {
                notificationId,
                userId,
                timestamp: new Date(),
            });
        }
    }
    async getUserNotifications(userId, filters) {
        const query = this.notificationRepository.createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId });
        if (filters?.unreadOnly) {
            query.andWhere('notification.readAt IS NULL');
        }
        if (filters?.type) {
            query.andWhere('notification.type = :type', { type: filters.type });
        }
        const [notifications, total] = await query
            .orderBy('notification.createdAt', 'DESC')
            .take(filters?.limit || 50)
            .skip(filters?.offset || 0)
            .getManyAndCount();
        return {
            data: notifications,
            total,
            unreadCount: await this.getUnreadCount(userId),
        };
    }
    async updatePreferences(userId, preferences) {
        let userPreference = await this.preferenceRepository.findOne({
            where: { userId },
        });
        if (!userPreference) {
            const newPreference = this.preferenceRepository.create({
                userId,
                enabled: true,
                email: true,
                sms: false,
                push: true,
                inApp: true,
                quietHours: false,
                ...preferences,
            });
            userPreference = Array.isArray(newPreference) ? newPreference[0] : newPreference;
        }
        else {
            Object.assign(userPreference, preferences);
        }
        const savedPreference = await this.preferenceRepository.save(userPreference);
        return Array.isArray(savedPreference) ? savedPreference[0] : savedPreference;
    }
    async getUserPreferences(userId) {
        let preferences = await this.preferenceRepository.findOne({
            where: { userId },
        });
        if (!preferences) {
            preferences = this.preferenceRepository.create({
                userId,
                email: true,
                sms: false,
                push: true,
                inApp: true,
                preferences: {
                    appointments: { email: true, sms: true, push: true },
                    payments: { email: true, sms: false, push: true },
                    reminders: { email: false, sms: true, push: true },
                    marketing: { email: true, sms: false, push: false },
                },
            });
            await this.preferenceRepository.save(preferences);
        }
        return preferences;
    }
    shouldSendNotification(preferences, type) {
        if (!preferences.enabled)
            return false;
        if (preferences.quietHours) {
            const now = new Date();
            const currentHour = now.getHours();
            if (currentHour >= preferences.quietHoursStart || currentHour < preferences.quietHoursEnd) {
                return false;
            }
        }
        return true;
    }
    getEnabledChannels(preferences, type) {
        const channels = [];
        const typePrefs = preferences.preferences?.[type] || {};
        if (preferences.email && typePrefs.email !== false)
            channels.push('email');
        if (preferences.sms && typePrefs.sms !== false)
            channels.push('sms');
        if (preferences.push && typePrefs.push !== false)
            channels.push('push');
        return channels;
    }
    async getUnreadCount(userId) {
        return await this.notificationRepository.count({
            where: { userId, readAt: null },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(notification_preference_entity_1.NotificationPreference)),
    __param(2, (0, bull_1.InjectQueue)('notification-queue')),
    __param(3, (0, common_1.Inject)('KAFKA_SERVICE')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object, microservices_1.ClientKafka,
        email_service_1.EmailService,
        sms_service_1.SmsService,
        push_notification_service_1.PushNotificationService,
        in_app_notification_service_1.InAppNotificationService,
        template_service_1.TemplateService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map