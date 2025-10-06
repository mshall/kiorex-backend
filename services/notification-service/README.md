# 📧 Notification Service

## Description

The Notification Service is a comprehensive multi-channel communication microservice for the Kiorex Healthcare Platform. It handles email notifications, SMS messaging, push notifications, in-app notifications, and automated communication workflows for patients, healthcare providers, and administrative staff.

## Use Cases & Features

### Multi-Channel Communication
- **Email Notifications**: Automated email notifications via SendGrid
- **SMS Messaging**: SMS notifications via Twilio for urgent communications
- **Push Notifications**: Mobile push notifications via Firebase
- **In-App Notifications**: Real-time in-app notification system
- **Voice Calls**: Automated voice calls for critical notifications

### Healthcare-Specific Notifications
- **Appointment Reminders**: Automated appointment reminders and confirmations
- **Prescription Alerts**: Medication reminders and prescription notifications
- **Lab Results**: Laboratory result notifications and alerts
- **Emergency Alerts**: Critical health alerts and emergency notifications
- **Insurance Updates**: Insurance verification and coverage notifications

### Communication Workflows
- **Automated Workflows**: Automated notification workflows and triggers
- **Template Management**: Dynamic notification templates and personalization
- **Delivery Tracking**: Notification delivery status and tracking
- **Preference Management**: User notification preferences and opt-out management
- **Compliance Notifications**: Regulatory compliance and audit notifications

### Advanced Features
- **Smart Scheduling**: Intelligent notification scheduling based on user preferences
- **A/B Testing**: Notification content and timing optimization
- **Analytics**: Comprehensive notification analytics and reporting
- **Bulk Messaging**: Bulk notification campaigns and marketing communications
- **Integration**: Seamless integration with all healthcare platform services

## API Endpoints

### Notification Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/notifications` | Get all notifications (with filtering and pagination) | JWT Required |
| `GET` | `/notifications/:id` | Get specific notification details | JWT Required |
| `POST` | `/notifications` | Create new notification | JWT Required |
| `PUT` | `/notifications/:id` | Update notification | JWT Required |
| `DELETE` | `/notifications/:id` | Delete notification | JWT Required |
| `POST` | `/notifications/:id/send` | Send notification immediately | JWT Required |

### Email Notifications
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/notifications/email` | Send email notification | JWT Required |
| `GET` | `/notifications/email/templates` | Get email templates | JWT Required |
| `POST` | `/notifications/email/templates` | Create email template | JWT Required |
| `PUT` | `/notifications/email/templates/:id` | Update email template | JWT Required |
| `GET` | `/notifications/email/status/:id` | Get email delivery status | JWT Required |

### SMS Notifications
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/notifications/sms` | Send SMS notification | JWT Required |
| `GET` | `/notifications/sms/templates` | Get SMS templates | JWT Required |
| `POST` | `/notifications/sms/templates` | Create SMS template | JWT Required |
| `PUT` | `/notifications/sms/templates/:id` | Update SMS template | JWT Required |
| `GET` | `/notifications/sms/status/:id` | Get SMS delivery status | JWT Required |

### Push Notifications
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/notifications/push` | Send push notification | JWT Required |
| `GET` | `/notifications/push/templates` | Get push notification templates | JWT Required |
| `POST` | `/notifications/push/templates` | Create push notification template | JWT Required |
| `PUT` | `/notifications/push/templates/:id` | Update push notification template | JWT Required |
| `GET` | `/notifications/push/status/:id` | Get push notification delivery status | JWT Required |

### In-App Notifications
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/notifications/in-app` | Get in-app notifications | JWT Required |
| `POST` | `/notifications/in-app` | Create in-app notification | JWT Required |
| `PUT` | `/notifications/in-app/:id/read` | Mark notification as read | JWT Required |
| `DELETE` | `/notifications/in-app/:id` | Delete in-app notification | JWT Required |
| `GET` | `/notifications/in-app/unread` | Get unread notifications | JWT Required |

### User Preferences
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/notifications/preferences/:userId` | Get user notification preferences | JWT Required |
| `PUT` | `/notifications/preferences/:userId` | Update user notification preferences | JWT Required |
| `POST` | `/notifications/preferences/:userId/opt-out` | Opt out of notifications | JWT Required |
| `POST` | `/notifications/preferences/:userId/opt-in` | Opt in to notifications | JWT Required |

### Templates & Campaigns
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/notifications/templates` | Get all notification templates | JWT Required |
| `POST` | `/notifications/templates` | Create notification template | JWT Required |
| `PUT` | `/notifications/templates/:id` | Update notification template | JWT Required |
| `DELETE` | `/notifications/templates/:id` | Delete notification template | JWT Required |
| `POST` | `/notifications/campaigns` | Create notification campaign | JWT Required |

### Analytics & Reporting
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/notifications/analytics` | Get notification analytics | JWT Required |
| `GET` | `/notifications/reports/delivery` | Get delivery reports | JWT Required |
| `GET` | `/notifications/reports/engagement` | Get engagement reports | JWT Required |
| `GET` | `/notifications/reports/export` | Export notification data | JWT Required |

### Health & Monitoring
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/notifications/health` | Service health check | None |
| `GET` | `/notifications/metrics` | Notification service metrics | JWT Required |

## Installation & Setup Guide

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 15+
- Redis 7+
- Kafka (for event streaming)
- SendGrid Account (for email)
- Twilio Account (for SMS)
- Firebase Account (for push notifications)

### Local Development Setup

1. **Navigate to service directory**
   ```bash
   cd services/notification-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3007
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=notifications_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   KAFKA_BROKERS=localhost:9092
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@kiorex.com
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run migration:run
   
   # Seed initial data
   npm run seed:run
   ```

5. **Start the service**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

### Docker Setup

1. **Build Docker image**
   ```bash
   docker build -t healthcare-notification-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up notification-service
   ```

### Database Schema

#### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  subject VARCHAR(200),
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Notification Templates Table
```sql
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  subject VARCHAR(200),
  content TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### User Preferences Table
```sql
CREATE TABLE user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  channel VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  frequency VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Notification Logs Table
```sql
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id),
  event_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /notifications/health`
- **Response**: Service status, database connectivity, Redis status, external service connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Notification delivery success rates
- Email, SMS, and push notification volumes
- User engagement and open rates
- Template performance and effectiveness
- Delivery time and latency metrics

### Logging
- Notification creation and sending events
- Delivery status and error tracking
- User preference changes
- Template usage and performance
- External service integration events

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to notification data
- **Audit Logging**: Complete notification audit trails
- **Data Encryption**: Encrypted storage of sensitive data
- **Secure Transmission**: TLS encryption for all communications

### Communication Security
- **Content Security**: Secure handling of notification content
- **Delivery Security**: Secure notification delivery mechanisms
- **User Privacy**: Protection of user communication preferences
- **Spam Prevention**: Anti-spam measures and rate limiting
- **Opt-out Compliance**: Proper opt-out and unsubscribe handling

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Communication Features
- **AI-Powered Personalization**: Machine learning for personalized notifications
- **Smart Timing**: Intelligent notification timing based on user behavior
- **Multi-Language Support**: Comprehensive internationalization
- **Voice Notifications**: Voice-based notifications and alerts
- **Video Notifications**: Video message notifications

### Healthcare-Specific Enhancements
- **Clinical Alerts**: Advanced clinical alert systems
- **Emergency Communications**: Emergency communication protocols
- **Provider Communications**: Enhanced provider-to-provider communication
- **Patient Education**: Automated patient education notifications
- **Care Coordination**: Care team communication and coordination

### Integration Capabilities
- **EHR Integration**: Electronic Health Records integration
- **Practice Management**: Practice management system integration
- **Third-Party Systems**: Integration with external healthcare systems
- **API Gateway**: Enhanced API Gateway integration
- **Microservice Communication**: Improved service-to-service communication

### Analytics & Optimization
- **Advanced Analytics**: Comprehensive notification analytics
- **A/B Testing**: Advanced A/B testing capabilities
- **Performance Optimization**: Notification performance optimization
- **User Segmentation**: Advanced user segmentation and targeting
- **Predictive Analytics**: Predictive analytics for notification effectiveness

### Compliance & Governance
- **Regulatory Compliance**: Automated compliance with healthcare regulations
- **Audit Support**: Comprehensive audit support and documentation
- **Data Governance**: Comprehensive data governance and stewardship
- **Privacy Controls**: Enhanced privacy controls and consent management
- **Compliance Monitoring**: Real-time compliance monitoring and alerting

### User Experience Improvements
- **Mobile App Integration**: Enhanced mobile app integration
- **Real-Time Updates**: Real-time notification updates
- **Interactive Notifications**: Interactive notification capabilities
- **Notification History**: Comprehensive notification history
- **User Feedback**: User feedback and rating system

## Dependencies

### Core Dependencies
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common NestJS utilities
- `@nestjs/typeorm` - TypeORM integration
- `@nestjs/jwt` - JWT token handling
- `@nestjs/passport` - Passport.js integration
- `passport-jwt` - JWT strategy for Passport
- `class-validator` - DTO validation
- `class-transformer` - Object transformation

### Communication Dependencies
- `@sendgrid/mail` - SendGrid email service
- `twilio` - Twilio SMS service
- `firebase-admin` - Firebase push notifications
- `nodemailer` - Email sending library
- `handlebars` - Template engine

### Database Dependencies
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `redis` - Redis client for caching

### Message Queue Dependencies
- `kafkajs` - Kafka client for event streaming
- `@nestjs/microservices` - Microservice communication
- `bull` - Job queue processing

### Development Dependencies
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing
- `@types/nodemailer` - TypeScript types

## Contact & Support

- **Service Owner**: Communication Team
- **Documentation**: [Notification Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*