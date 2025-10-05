# 📅 Appointment Service

## Description

The Appointment Service is a comprehensive scheduling and appointment management microservice for the Kiorex Healthcare Platform. It handles appointment scheduling, calendar management, provider availability, patient booking, appointment reminders, and scheduling optimization for healthcare organizations.

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
- `GET /appointments` - Get all appointments (with filtering and pagination)
- `GET /appointments/:id` - Get specific appointment details
- `POST /appointments` - Create new appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment
- `POST /appointments/:id/reschedule` - Reschedule appointment

### Provider Scheduling
- `GET /providers/:id/availability` - Get provider availability
- `POST /providers/:id/availability` - Set provider availability
- `GET /providers/:id/schedule` - Get provider schedule
- `POST /providers/:id/block-time` - Block time slots
- `DELETE /providers/:id/block-time/:blockId` - Remove blocked time

### Patient Booking
- `GET /appointments/available` - Get available appointment slots
- `POST /appointments/book` - Book new appointment
- `GET /appointments/patient/:patientId` - Get patient appointments
- `POST /appointments/:id/check-in` - Patient check-in
- `POST /appointments/:id/complete` - Mark appointment as completed

### Calendar Management
- `GET /calendars` - Get all calendars
- `GET /calendars/:id` - Get specific calendar
- `POST /calendars` - Create new calendar
- `PUT /calendars/:id` - Update calendar settings
- `GET /calendars/:id/events` - Get calendar events

### Reminders & Notifications
- `GET /reminders` - Get all reminders
- `POST /reminders` - Create new reminder
- `PUT /reminders/:id` - Update reminder
- `DELETE /reminders/:id` - Delete reminder
- `POST /reminders/send` - Send appointment reminders

### Reporting & Analytics
- `GET /reports/appointments` - Appointment reports
- `GET /reports/provider-utilization` - Provider utilization reports
- `GET /reports/patient-satisfaction` - Patient satisfaction reports
- `GET /reports/no-shows` - No-show reports and analytics

### Health & Monitoring
- `GET /appointments/health` - Service health check
- `GET /appointments/metrics` - Appointment service metrics

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

### Database Schema

#### Appointments Table
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  appointment_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  location VARCHAR(100),
  room_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Provider Schedules Table
```sql
CREATE TABLE provider_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Appointment Reminders Table
```sql
CREATE TABLE appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id),
  reminder_type VARCHAR(20) NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

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