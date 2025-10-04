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
exports.PushNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = __importStar(require("firebase-admin"));
let PushNotificationService = class PushNotificationService {
    constructor(configService) {
        this.configService = configService;
        const projectId = this.configService.get('FIREBASE_PROJECT_ID');
        const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');
        const privateKey = this.configService.get('FIREBASE_PRIVATE_KEY');
        if (projectId && clientEmail && privateKey && !admin.apps.length) {
            try {
                this.firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey,
                    }),
                });
            }
            catch (error) {
                console.warn('Firebase initialization failed:', error.message);
            }
        }
        else {
            console.warn('Firebase credentials not provided - push notifications will be disabled');
        }
    }
    async sendPushNotification(data) {
        if (!this.firebaseApp) {
            console.warn('Firebase not initialized - push notification skipped');
            return;
        }
        const message = {
            token: data.token,
            notification: {
                title: data.title,
                body: data.body,
            },
            data: data.data || {},
        };
        try {
            await this.firebaseApp.messaging().send(message);
        }
        catch (error) {
            console.error('Failed to send push notification:', error);
            throw error;
        }
    }
    async sendBulkPushNotifications(notifications) {
        if (!this.firebaseApp) {
            console.warn('Firebase not initialized - bulk push notifications skipped');
            return;
        }
        const messages = notifications.map(notification => ({
            token: notification.token,
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: notification.data || {},
        }));
        for (const message of messages) {
            try {
                await this.firebaseApp.messaging().send(message);
            }
            catch (error) {
                console.error('Failed to send bulk push notification:', error);
            }
        }
    }
    async sendToTopic(topic, data) {
        const message = {
            topic,
            notification: {
                title: data.title,
                body: data.body,
            },
            data: data.data || {},
        };
        await this.firebaseApp.messaging().send(message);
    }
};
exports.PushNotificationService = PushNotificationService;
exports.PushNotificationService = PushNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PushNotificationService);
//# sourceMappingURL=push-notification.service.js.map