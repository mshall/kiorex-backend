# 🩺 Consultations Service

## Description

The Consultations Service is a comprehensive patient consultation management microservice for the Kiorex Healthcare Platform. It handles the actual patient consultations that occur during scheduled appointments, including clinical notes, assessments, diagnoses, treatment plans, and complete consultation workflows for healthcare providers.

## Use Cases & Features

### Consultation Management
- **Consultation Sessions**: Complete consultation session management
- **Clinical Documentation**: Comprehensive clinical notes and assessments
- **Patient Assessment**: Detailed patient evaluation and examination
- **Diagnosis Management**: Diagnosis recording and management
- **Treatment Planning**: Treatment plan development and tracking

### Healthcare-Specific Features
- **SOAP Notes**: Structured clinical documentation (Subjective, Objective, Assessment, Plan)
- **Vital Signs Integration**: Real-time vital signs recording during consultations
- **Clinical Decision Support**: Evidence-based clinical decision support
- **Prescription Integration**: Prescription generation during consultations
- **Follow-up Management**: Follow-up consultation scheduling and tracking

### Clinical Workflow
- **Consultation Templates**: Standardized consultation templates
- **Clinical Protocols**: Evidence-based clinical protocols and guidelines
- **Quality Assurance**: Clinical quality measures and compliance
- **Audit Trails**: Complete consultation audit trails
- **Clinical Analytics**: Consultation analytics and reporting

### Integration Features
- **Appointment Integration**: Seamless integration with appointment scheduling
- **EHR Integration**: Electronic Health Records integration
- **Clinical Service Integration**: Integration with clinical data and records
- **Prescription Integration**: Pharmacy service integration
- **Billing Integration**: Consultation billing and coding

## API Endpoints

### Consultation Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/consultations` | Get all consultations | JWT Required |
| `GET` | `/consultations/:id` | Get specific consultation | JWT Required |
| `POST` | `/consultations` | Create new consultation | JWT Required |
| `PUT` | `/consultations/:id` | Update consultation | JWT Required |
| `DELETE` | `/consultations/:id` | Cancel consultation | JWT Required |
| `POST` | `/consultations/:id/start` | Start consultation session | JWT Required |
| `POST` | `/consultations/:id/complete` | Complete consultation | JWT Required |

### Clinical Documentation
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/consultations/:id/notes` | Get consultation notes | JWT Required |
| `POST` | `/consultations/:id/notes` | Add clinical notes | JWT Required |
| `PUT` | `/consultations/:id/notes/:noteId` | Update clinical notes | JWT Required |
| `GET` | `/consultations/:id/soap-notes` | Get SOAP notes | JWT Required |
| `POST` | `/consultations/:id/soap-notes` | Create SOAP notes | JWT Required |
| `PUT` | `/consultations/:id/soap-notes/:noteId` | Update SOAP notes | JWT Required |

### Patient Assessment
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/consultations/:id/assessment` | Get patient assessment | JWT Required |
| `POST` | `/consultations/:id/assessment` | Record patient assessment | JWT Required |
| `PUT` | `/consultations/:id/assessment` | Update patient assessment | JWT Required |
| `GET` | `/consultations/:id/vital-signs` | Get vital signs | JWT Required |
| `POST` | `/consultations/:id/vital-signs` | Record vital signs | JWT Required |
| `GET` | `/consultations/:id/examination` | Get examination findings | JWT Required |
| `POST` | `/consultations/:id/examination` | Record examination findings | JWT Required |

### Diagnosis & Treatment
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/consultations/:id/diagnoses` | Get consultation diagnoses | JWT Required |
| `POST` | `/consultations/:id/diagnoses` | Add diagnosis | JWT Required |
| `PUT` | `/consultations/:id/diagnoses/:diagnosisId` | Update diagnosis | JWT Required |
| `DELETE` | `/consultations/:id/diagnoses/:diagnosisId` | Remove diagnosis | JWT Required |
| `GET` | `/consultations/:id/treatment-plan` | Get treatment plan | JWT Required |
| `POST` | `/consultations/:id/treatment-plan` | Create treatment plan | JWT Required |
| `PUT` | `/consultations/:id/treatment-plan` | Update treatment plan | JWT Required |

### Prescription Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/consultations/:id/prescriptions` | Get consultation prescriptions | JWT Required |
| `POST` | `/consultations/:id/prescriptions` | Create prescription | JWT Required |
| `PUT` | `/consultations/:id/prescriptions/:prescriptionId` | Update prescription | JWT Required |
| `DELETE` | `/consultations/:id/prescriptions/:prescriptionId` | Cancel prescription | JWT Required |

### Follow-up Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/consultations/:id/follow-ups` | Get follow-up recommendations | JWT Required |
| `POST` | `/consultations/:id/follow-ups` | Create follow-up recommendation | JWT Required |
| `PUT` | `/consultations/:id/follow-ups/:followUpId` | Update follow-up | JWT Required |
| `DELETE` | `/consultations/:id/follow-ups/:followUpId` | Remove follow-up | JWT Required |

### Consultation Analytics
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/consultations/analytics/volume` | Get consultation volume analytics | JWT Required |
| `GET` | `/consultations/analytics/duration` | Get consultation duration analytics | JWT Required |
| `GET` | `/consultations/analytics/outcomes` | Get consultation outcome analytics | JWT Required |
| `GET` | `/consultations/analytics/provider` | Get provider consultation analytics | JWT Required |
| `GET` | `/consultations/reports/summary` | Get consultation summary report | JWT Required |

### Health & Monitoring
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/consultations/health` | Service health check | None |
| `GET` | `/consultations/metrics` | Consultation service metrics | JWT Required |

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
   cd services/consultations-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3018
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=consultations_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   KAFKA_BROKERS=localhost:9092
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
   docker build -t healthcare-consultations-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up consultations-service
   ```

### Database Schema

#### Consultations Table
```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  consultation_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  chief_complaint TEXT,
  consultation_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Clinical Notes Table
```sql
CREATE TABLE clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  note_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### SOAP Notes Table
```sql
CREATE TABLE soap_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Patient Assessments Table
```sql
CREATE TABLE patient_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL,
  findings TEXT,
  recommendations TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Consultation Diagnoses Table
```sql
CREATE TABLE consultation_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  diagnosis_code VARCHAR(20) NOT NULL,
  diagnosis_name VARCHAR(200) NOT NULL,
  diagnosis_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Treatment Plans Table
```sql
CREATE TABLE treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  plan_name VARCHAR(200) NOT NULL,
  description TEXT,
  goals TEXT,
  interventions TEXT,
  follow_up_instructions TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Follow-up Recommendations Table
```sql
CREATE TABLE follow_up_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  follow_up_type VARCHAR(50) NOT NULL,
  recommended_date DATE,
  urgency VARCHAR(20) NOT NULL,
  instructions TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /consultations/health`
- **Response**: Service status, database connectivity, Redis status, Kafka connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Consultation completion rates
- Average consultation duration
- Provider productivity metrics
- Clinical outcome measures
- Follow-up compliance rates

### Logging
- Consultation session events
- Clinical documentation activities
- Diagnosis and treatment activities
- Follow-up recommendation tracking
- Provider performance metrics

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to consultation data
- **Audit Logging**: Complete consultation audit trails
- **Data Encryption**: Encrypted storage of sensitive data
- **Secure Transmission**: TLS encryption for all communications

### Clinical Data Security
- **PHI Protection**: Secure handling of protected health information
- **Access Logging**: Complete access logging for consultation data
- **Data Integrity**: Clinical data integrity and validation
- **Backup Security**: Secure backup and recovery of consultation data
- **Compliance Monitoring**: Real-time compliance monitoring

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Clinical Features
- **AI-Powered Documentation**: AI-assisted clinical note generation
- **Clinical Decision Support**: Advanced clinical decision support systems
- **Predictive Analytics**: Predictive analytics for patient outcomes
- **Risk Stratification**: Patient risk assessment and stratification
- **Quality Measures**: Advanced clinical quality measures

### Healthcare-Specific Enhancements
- **Telemedicine Integration**: Advanced telehealth consultation capabilities
- **Remote Monitoring**: Integration with remote patient monitoring
- **Clinical Protocols**: Evidence-based clinical protocol integration
- **Outcome Tracking**: Advanced patient outcome tracking
- **Population Health**: Population health management integration

### Integration Capabilities
- **EHR Integration**: Enhanced Electronic Health Records integration
- **Clinical Systems**: Integration with clinical information systems
- **Laboratory Integration**: Real-time lab result integration
- **Imaging Integration**: Medical imaging integration
- **External APIs**: Integration with external healthcare systems

### Performance & Scalability
- **Consultation Optimization**: Advanced consultation workflow optimization
- **Caching Strategy**: Intelligent caching for consultation data
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for consultation content
- **Microservice Architecture**: Enhanced microservice communication

### Analytics & Reporting
- **Consultation Analytics**: Comprehensive consultation analytics and reporting
- **Clinical Analytics**: Advanced clinical analytics and insights
- **Provider Analytics**: Provider performance analytics
- **Outcome Analytics**: Patient outcome analytics and reporting
- **Business Intelligence**: Consultation-based business intelligence

### Compliance & Governance
- **Regulatory Compliance**: Automated compliance with healthcare regulations
- **Audit Support**: Comprehensive audit support and documentation
- **Data Governance**: Comprehensive data governance and stewardship
- **Privacy Controls**: Enhanced privacy controls and consent management
- **Compliance Monitoring**: Real-time compliance monitoring and alerting

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

### Consultation Dependencies
- `moment` - Date and time manipulation
- `lodash` - Utility functions for data manipulation
- `uuid` - UUID generation

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
- `@types/lodash` - TypeScript types

## Contact & Support

- **Service Owner**: Clinical Team
- **Documentation**: [Consultations Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*
