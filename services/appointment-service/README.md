# 📅 Appointment Service

## Description

The Appointment Service is a comprehensive scheduling and appointment management microservice for the Kiorex Healthcare Platform. It handles appointment scheduling, calendar management, provider availability, patient booking, appointment reminders, and scheduling optimization for healthcare organizations.

**Important Distinction**: This service manages the **scheduling** of appointments (when and where they occur), while the **Consultations Service** handles the actual **clinical consultations** that take place during those appointments (clinical notes, assessments, diagnoses, treatment plans).

## Use Cases & Features

### Appointment Scheduling
- **Patient Booking**: Online appointment booking with real-time availability
- **Provider Scheduling**: Provider calendar management and availability
- **Recurring Appointments**: Support for recurring appointment series
- **Waitlist Management**: Automated waitlist management for popular time slots
- **Appointment Types**: Different appointment types (consultation, procedure, follow-up)

### Calendar Management
- **Provider Calendars**: Individual provider calendar management
- **Department Scheduling**: Department-wide scheduling and coordination
- **Resource Booking**: Room and equipment booking for appointments
- **Time Zone Support**: Multi-timezone support for global healthcare organizations
- **Holiday Management**: Holiday and vacation day management

### Patient Experience
- **Online Booking**: Patient self-service appointment booking
- **Appointment History**: Complete appointment history and records
- **Reminder System**: Automated appointment reminders via SMS, email, and push notifications
- **Rescheduling**: Easy appointment rescheduling and cancellation
- **Check-in Process**: Digital check-in and arrival notifications

### Healthcare-Specific Features
- **Provider Specialties**: Appointment scheduling based on provider specialties
- **Insurance Verification**: Pre-appointment insurance verification
- **Prior Authorization**: Integration with prior authorization workflows
- **Telehealth Support**: Virtual appointment scheduling and management
- **Emergency Slots**: Emergency appointment slot management

## API Endpoints

### Appointment Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/appointments` | Get all appointments (with filtering and pagination) | JWT Required |
| `GET` | `/appointments/:id` | Get specific appointment details | JWT Required |
| `POST` | `/appointments` | Create new appointment | JWT Required |
| `PUT` | `/appointments/:id` | Update appointment | JWT Required |
| `DELETE` | `/appointments/:id` | Cancel appointment | JWT Required |
| `POST` | `/appointments/:id/reschedule` | Reschedule appointment | JWT Required |

### Provider Scheduling
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/providers/:id/availability` | Get provider availability | JWT Required |
| `POST` | `/providers/:id/availability` | Set provider availability | JWT Required |
| `GET` | `/providers/:id/schedule` | Get provider schedule | JWT Required |
| `POST` | `/providers/:id/block-time` | Block time slots | JWT Required |
| `DELETE` | `/providers/:id/block-time/:blockId` | Remove blocked time | JWT Required |

### Patient Booking
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/appointments/available` | Get available appointment slots | JWT Required |
| `POST` | `/appointments/book` | Book new appointment | JWT Required |
| `GET` | `/appointments/patient/:patientId` | Get patient appointments | JWT Required |
| `POST` | `/appointments/:id/check-in` | Patient check-in | JWT Required |
| `POST` | `/appointments/:id/complete` | Mark appointment as completed | JWT Required |

### Calendar Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/calendars` | Get all calendars | JWT Required |
| `GET` | `/calendars/:id` | Get specific calendar | JWT Required |
| `POST` | `/calendars` | Create new calendar | JWT Required |
| `PUT` | `/calendars/:id` | Update calendar settings | JWT Required |
| `GET` | `/calendars/:id/events` | Get calendar events | JWT Required |

### Reminders & Notifications
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/reminders` | Get all reminders | JWT Required |
| `POST` | `/reminders` | Create new reminder | JWT Required |
| `PUT` | `/reminders/:id` | Update reminder | JWT Required |
| `DELETE` | `/reminders/:id` | Delete reminder | JWT Required |
| `POST` | `/reminders/send` | Send appointment reminders | JWT Required |

### Reporting & Analytics
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/reports/appointments` | Appointment reports | JWT Required |
| `GET` | `/reports/provider-utilization` | Provider utilization reports | JWT Required |
| `GET` | `/reports/patient-satisfaction` | Patient satisfaction reports | JWT Required |
| `GET` | `/reports/no-shows` | No-show reports and analytics | JWT Required |

### Health & Monitoring
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/appointments/health` | Service health check | None |
| `GET` | `/appointments/metrics` | Appointment service metrics | JWT Required |

## Installation & Setup Guide

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 15+
- Redis 7+
- Kafka (for event streaming)

### Local Development Setup

1. **Navigate to service directory**
   ```bash
   cd services/appointment-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3005
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=appointments_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   KAFKA_BROKERS=localhost:9092
   TIMEZONE=UTC
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
   docker build -t healthcare-appointment-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up appointment-service
   ```

## Database Schema

### Core Tables

#### `appointments`
Patient appointment scheduling and management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Reference to patient |
| provider_id | UUID | Reference to healthcare provider |
| appointment_type | VARCHAR(50) | Type of appointment |
| status | VARCHAR(20) | Appointment status |
| scheduled_date | TIMESTAMP | Scheduled appointment time |
| duration_minutes | INTEGER | Appointment duration |
| notes | TEXT | Additional notes |
| location | VARCHAR(100) | Appointment location |
| room_id | UUID | Reference to room |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `provider_schedules`
Healthcare provider availability and scheduling.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_id | UUID | Reference to healthcare provider |
| day_of_week | INTEGER | Day of week (0-6) |
| start_time | TIME | Available start time |
| end_time | TIME | Available end time |
| is_available | BOOLEAN | Availability status |
| created_at | TIMESTAMP | Creation timestamp |

#### `appointment_reminders`
Appointment reminder notifications and tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| appointment_id | UUID | Reference to appointment |
| reminder_type | VARCHAR(20) | Type of reminder |
| scheduled_time | TIMESTAMP | Reminder scheduled time |
| status | VARCHAR(20) | Reminder status |
| sent_at | TIMESTAMP | Reminder sent timestamp |
| created_at | TIMESTAMP | Creation timestamp |

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /appointments/health`
- **Response**: Service status, database connectivity, Redis status, Kafka connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Appointment booking success rates
- Provider utilization and availability
- Patient satisfaction scores
- No-show rates and patterns
- Appointment duration analytics

### Logging
- Appointment booking and cancellation events
- Provider schedule changes
- Patient check-in and completion events
- Reminder delivery and response tracking
- Administrative actions and data exports

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to appointment data
- **Audit Logging**: Complete appointment audit trails
- **Data Encryption**: Encrypted storage of sensitive data
- **Secure Transmission**: TLS encryption for all communications

### Privacy Protection
- **Patient Privacy**: Secure handling of patient appointment data
- **Provider Privacy**: Protection of provider schedule information
- **Data Minimization**: Collection of only necessary appointment data
- **Consent Management**: Patient consent for appointment data processing
- **Right to be Forgotten**: Patient data deletion capabilities

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Scheduling Features
- **AI-Powered Scheduling**: Machine learning for optimal appointment scheduling
- **Predictive Analytics**: Predictive analytics for appointment demand
- **Smart Scheduling**: Intelligent scheduling based on patient preferences
- **Resource Optimization**: Advanced resource utilization optimization
- **Conflict Resolution**: Automated conflict resolution for scheduling

### Patient Experience Enhancements
- **Mobile App Integration**: Enhanced mobile app for appointment management
- **Virtual Waiting Room**: Virtual waiting room with real-time updates
- **Appointment Preparation**: Pre-appointment preparation and instructions
- **Feedback System**: Patient feedback and rating system
- **Loyalty Programs**: Patient loyalty and rewards programs

### Healthcare-Specific Features
- **Telehealth Integration**: Advanced telehealth appointment management
- **Multi-Location Support**: Support for multiple healthcare locations
- **Provider Networks**: Provider network management and scheduling
- **Insurance Integration**: Real-time insurance verification and authorization
- **Clinical Workflow**: Integration with clinical workflows and protocols

### Integration Capabilities
- **EHR Integration**: Electronic Health Records integration
- **Practice Management**: Practice management system integration
- **Billing Integration**: Integration with billing and payment systems
- **Communication Systems**: Integration with communication platforms
- **Analytics Platforms**: Integration with business intelligence tools

### Performance & Scalability
- **Caching Strategy**: Advanced caching for appointment data
- **Database Optimization**: Query optimization and performance tuning
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for appointment pages
- **Microservice Architecture**: Enhanced microservice communication

### Compliance & Reporting
- **Regulatory Compliance**: Automated compliance with healthcare regulations
- **Audit Support**: Comprehensive audit support and documentation
- **Reporting**: Advanced reporting and analytics capabilities
- **Compliance Monitoring**: Real-time compliance monitoring and alerting
- **Data Governance**: Comprehensive data governance and stewardship

## Sample Data

### Sample Appointment
```json
{
  "patient_id": "123e4567-e89b-12d3-a456-426614174001",
  "provider_id": "123e4567-e89b-12d3-a456-426614174002",
  "appointment_type": "consultation",
  "status": "scheduled",
  "scheduled_date": "2024-01-20T10:00:00Z",
  "duration_minutes": 30,
  "notes": "Follow-up visit for diabetes management",
  "location": "Main Clinic - Room 101",
  "room_id": "123e4567-e89b-12d3-a456-426614174003"
}
```

### Sample Provider Schedule
```json
{
  "provider_id": "123e4567-e89b-12d3-a456-426614174002",
  "day_of_week": 1,
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "is_available": true
}
```

### Sample Appointment Reminder
```json
{
  "appointment_id": "123e4567-e89b-12d3-a456-426614174004",
  "reminder_type": "email",
  "scheduled_time": "2024-01-19T18:00:00Z",
  "status": "pending"
}
```

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

### Scheduling Dependencies
- `node-cron` - Cron job scheduling
- `moment` - Date and time manipulation
- `moment-timezone` - Timezone support
- `ical-generator` - Calendar generation

### Database Dependencies
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `redis` - Redis client for caching

### Message Queue Dependencies
- `kafkajs` - Kafka client for event streaming
- `@nestjs/microservices` - Microservice communication

### Development Dependencies
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing
- `@types/node-cron` - TypeScript types

## Contact & Support

- **Service Owner**: Scheduling Team
- **Documentation**: [Appointment Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*