# 🏥 Clinical Service

## Description

The Clinical Service is a comprehensive medical records and clinical data management microservice for the Kiorex Healthcare Platform. It handles electronic health records (EHR), medical history, vital signs, prescriptions, clinical notes, diagnoses, treatments, and all clinical workflows for healthcare providers and patients.

## Use Cases & Features

### Electronic Health Records (EHR)
- **Patient Medical Records**: Complete patient medical history and records
- **Clinical Documentation**: Comprehensive clinical documentation and notes
- **Medical History**: Complete medical history tracking and management
- **Allergy Management**: Patient allergy tracking and medication interactions
- **Immunization Records**: Vaccination history and immunization tracking

### Clinical Workflows
- **Vital Signs**: Real-time vital signs monitoring and recording
- **Clinical Notes**: Provider clinical notes and observations
- **Diagnosis Management**: Diagnosis coding and management (ICD-10)
- **Treatment Plans**: Comprehensive treatment plan development and tracking
- **Progress Notes**: Patient progress tracking and documentation

### Prescription Management
- **Electronic Prescriptions**: Digital prescription generation and management
- **Medication History**: Complete patient medication history
- **Drug Interactions**: Medication interaction checking and alerts
- **Prescription Refills**: Automated prescription refill management
- **Medication Adherence**: Patient medication adherence tracking

### Clinical Decision Support
- **Clinical Guidelines**: Evidence-based clinical guidelines and protocols
- **Alert Systems**: Clinical alerts and reminders for providers
- **Risk Assessment**: Patient risk assessment and stratification
- **Quality Measures**: Clinical quality measures and reporting
- **Outcome Tracking**: Patient outcome tracking and analytics

### Healthcare-Specific Features
- **FHIR Compliance**: HL7 FHIR standard compliance for interoperability
- **Clinical Coding**: ICD-10, CPT, and other clinical coding support
- **Care Coordination**: Multi-provider care coordination and communication
- **Clinical Pathways**: Standardized clinical pathways and protocols
- **Evidence-Based Medicine**: Integration with evidence-based medicine resources

## API Endpoints

### Patient Records Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/patients` | Get all patients | JWT Required |
| `GET` | `/patients/:id` | Get patient by ID | JWT Required |
| `POST` | `/patients` | Create new patient | JWT Required |
| `PUT` | `/patients/:id` | Update patient | JWT Required |
| `DELETE` | `/patients/:id` | Delete patient | JWT Required |
| `GET` | `/patients/search` | Search patients | JWT Required |
| `GET` | `/patients/:id/records` | Get patient medical records | JWT Required |
| `POST` | `/patients/:id/records` | Create new medical record | JWT Required |
| `PUT` | `/patients/:id/records/:recordId` | Update medical record | JWT Required |
| `DELETE` | `/patients/:id/records/:recordId` | Delete medical record | JWT Required |
| `GET` | `/patients/:id/history` | Get patient medical history | JWT Required |

### Vital Signs Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/patients/:id/vitals` | Get patient vital signs | JWT Required |
| `POST` | `/patients/:id/vitals` | Record new vital signs | JWT Required |
| `PUT` | `/patients/:id/vitals/:vitalId` | Update vital signs | JWT Required |
| `GET` | `/patients/:id/vitals/history` | Get vital signs history | JWT Required |
| `POST` | `/patients/:id/vitals/bulk` | Bulk vital signs entry | JWT Required |

### Clinical Notes Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/patients/:id/notes` | Get patient clinical notes | JWT Required |
| `POST` | `/patients/:id/notes` | Create clinical note | JWT Required |
| `PUT` | `/patients/:id/notes/:noteId` | Update clinical note | JWT Required |
| `GET` | `/providers/:id/notes` | Get provider clinical notes | JWT Required |
| `POST` | `/notes/:id/sign` | Sign clinical note | JWT Required |

### Prescription Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/patients/:id/prescriptions` | Get patient prescriptions | JWT Required |
| `POST` | `/patients/:id/prescriptions` | Create new prescription | JWT Required |
| `PUT` | `/prescriptions/:id` | Update prescription | JWT Required |
| `POST` | `/prescriptions/:id/refill` | Request prescription refill | JWT Required |
| `GET` | `/prescriptions/:id/interactions` | Check drug interactions | JWT Required |

### Diagnosis Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/patients/:id/diagnoses` | Get patient diagnoses | JWT Required |
| `POST` | `/patients/:id/diagnoses` | Add new diagnosis | JWT Required |
| `PUT` | `/diagnoses/:id` | Update diagnosis | JWT Required |
| `GET` | `/diagnoses/codes` | Get diagnosis codes (ICD-10) | JWT Required |
| `POST` | `/diagnoses/:id/resolve` | Resolve diagnosis | JWT Required |

### Treatment Plan Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/patients/:id/treatment-plans` | Get patient treatment plans | JWT Required |
| `POST` | `/patients/:id/treatment-plans` | Create treatment plan | JWT Required |
| `PUT` | `/treatment-plans/:id` | Update treatment plan | JWT Required |
| `POST` | `/treatment-plans/:id/complete` | Mark treatment as completed | JWT Required |
| `GET` | `/treatment-plans/:id/progress` | Get treatment progress | JWT Required |

### Clinical Reports & Analytics
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/reports/clinical-summary` | Clinical summary reports | JWT Required |
| `GET` | `/reports/patient-outcomes` | Patient outcome reports | JWT Required |
| `GET` | `/reports/quality-measures` | Quality measure reports | JWT Required |
| `GET` | `/reports/clinical-analytics` | Clinical analytics reports | JWT Required |
| `GET` | `/reports/export` | Export clinical data | JWT Required |

### Health & Monitoring
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/clinical/health` | Service health check | None |
| `GET` | `/clinical/metrics` | Clinical service metrics | JWT Required |

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
   cd services/clinical-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3006
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=clinical_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   KAFKA_BROKERS=localhost:9092
   FHIR_SERVER_URL=http://localhost:8080/fhir
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
   docker build -t healthcare-clinical-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up clinical-service
   ```

## Database Schema

### Core Tables

#### `medical_records`
Patient medical records and clinical documentation.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Reference to patient |
| provider_id | UUID | Reference to healthcare provider |
| record_type | VARCHAR(50) | Type of medical record |
| title | VARCHAR(200) | Record title |
| content | TEXT | Record content |
| status | VARCHAR(20) | Record status |
| is_signed | BOOLEAN | Digital signature status |
| signed_by | UUID | Provider who signed the record |
| signed_at | TIMESTAMP | Signature timestamp |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `vital_signs`
Patient vital signs measurements and tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Reference to patient |
| provider_id | UUID | Reference to healthcare provider |
| temperature | DECIMAL(4,1) | Body temperature |
| blood_pressure_systolic | INTEGER | Systolic blood pressure |
| blood_pressure_diastolic | INTEGER | Diastolic blood pressure |
| heart_rate | INTEGER | Heart rate (BPM) |
| respiratory_rate | INTEGER | Respiratory rate |
| oxygen_saturation | DECIMAL(4,1) | Oxygen saturation percentage |
| weight | DECIMAL(5,2) | Patient weight |
| height | DECIMAL(5,2) | Patient height |
| bmi | DECIMAL(4,1) | Body Mass Index |
| recorded_at | TIMESTAMP | Recording timestamp |
| created_at | TIMESTAMP | Creation timestamp |

#### `prescriptions`
Patient medication prescriptions and management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Reference to patient |
| provider_id | UUID | Reference to prescribing provider |
| medication_name | VARCHAR(200) | Medication name |
| dosage | VARCHAR(100) | Medication dosage |
| frequency | VARCHAR(100) | Administration frequency |
| duration | VARCHAR(100) | Prescription duration |
| instructions | TEXT | Administration instructions |
| status | VARCHAR(20) | Prescription status |
| prescribed_at | TIMESTAMP | Prescription timestamp |
| created_at | TIMESTAMP | Creation timestamp |

#### `diagnoses`
Patient diagnoses and medical conditions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Reference to patient |
| provider_id | UUID | Reference to diagnosing provider |
| diagnosis_code | VARCHAR(20) | ICD-10 diagnosis code |
| diagnosis_name | VARCHAR(200) | Diagnosis name |
| description | TEXT | Diagnosis description |
| status | VARCHAR(20) | Diagnosis status |
| diagnosed_at | TIMESTAMP | Diagnosis timestamp |
| resolved_at | TIMESTAMP | Resolution timestamp |
| created_at | TIMESTAMP | Creation timestamp |

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /clinical/health`
- **Response**: Service status, database connectivity, Redis status, Kafka connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Clinical record creation and update rates
- Vital signs monitoring frequency
- Prescription processing times
- Diagnosis accuracy and coding
- Clinical outcome measures

### Logging
- Clinical record access and modifications
- Vital signs recording and monitoring
- Prescription generation and management
- Diagnosis and treatment activities
- Clinical decision support events

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to clinical data
- **Audit Logging**: Complete clinical audit trails
- **Data Encryption**: Encrypted storage of sensitive clinical data
- **Secure Transmission**: TLS encryption for all communications

### Clinical Data Security
- **PHI Protection**: Secure handling of protected health information
- **Access Logging**: Complete access logging for clinical data
- **Data Integrity**: Clinical data integrity and validation
- **Backup Security**: Secure backup and recovery of clinical data
- **Compliance Monitoring**: Real-time compliance monitoring

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Clinical Features
- **AI-Powered Diagnostics**: Machine learning for diagnostic support
- **Clinical Decision Support**: Advanced clinical decision support systems
- **Predictive Analytics**: Predictive analytics for patient outcomes
- **Risk Stratification**: Advanced patient risk stratification
- **Clinical Pathways**: Automated clinical pathway management

### Interoperability Enhancements
- **FHIR Integration**: Advanced FHIR R4/R5 compliance
- **HL7 Integration**: HL7 message processing and integration
- **EHR Integration**: Enhanced EHR system integration
- **API Standardization**: Standardized clinical APIs
- **Data Exchange**: Secure clinical data exchange

### Clinical Workflow Improvements
- **Workflow Automation**: Automated clinical workflows
- **Care Coordination**: Enhanced care coordination tools
- **Clinical Protocols**: Standardized clinical protocols
- **Quality Measures**: Automated quality measure reporting
- **Outcome Tracking**: Advanced outcome tracking and analytics

### Patient Engagement
- **Patient Portal**: Enhanced patient portal for clinical data
- **Mobile Health**: Mobile health integration and monitoring
- **Telehealth**: Advanced telehealth capabilities
- **Patient Education**: Patient education and engagement tools
- **Self-Management**: Patient self-management tools

### Analytics & Reporting
- **Clinical Analytics**: Advanced clinical analytics and reporting
- **Population Health**: Population health management tools
- **Quality Reporting**: Automated quality reporting
- **Research Support**: Clinical research support tools
- **Benchmarking**: Clinical benchmarking and comparison

### Integration Capabilities
- **Laboratory Integration**: Laboratory system integration
- **Imaging Integration**: Medical imaging system integration
- **Pharmacy Integration**: Pharmacy system integration
- **Billing Integration**: Billing and coding integration
- **External Systems**: Integration with external healthcare systems

## Sample Data

### Sample Medical Record
```json
{
  "patient_id": "123e4567-e89b-12d3-a456-426614174001",
  "provider_id": "123e4567-e89b-12d3-a456-426614174002",
  "record_type": "progress_note",
  "title": "Follow-up Visit - Diabetes Management",
  "content": "Patient reports good blood sugar control. HbA1c improved from 8.2% to 7.1%. Continue current medication regimen.",
  "status": "signed",
  "is_signed": true,
  "signed_by": "123e4567-e89b-12d3-a456-426614174002",
  "signed_at": "2024-01-15T10:30:00Z"
}
```

### Sample Vital Signs
```json
{
  "patient_id": "123e4567-e89b-12d3-a456-426614174001",
  "provider_id": "123e4567-e89b-12d3-a456-426614174002",
  "temperature": 98.6,
  "blood_pressure_systolic": 120,
  "blood_pressure_diastolic": 80,
  "heart_rate": 72,
  "respiratory_rate": 16,
  "oxygen_saturation": 98.5,
  "weight": 70.5,
  "height": 175.0,
  "bmi": 23.0,
  "recorded_at": "2024-01-15T10:00:00Z"
}
```

### Sample Prescription
```json
{
  "patient_id": "123e4567-e89b-12d3-a456-426614174001",
  "provider_id": "123e4567-e89b-12d3-a456-426614174002",
  "medication_name": "Metformin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "duration": "Ongoing",
  "instructions": "Take with meals to reduce gastrointestinal side effects",
  "status": "active",
  "prescribed_at": "2024-01-15T10:15:00Z"
}
```

### Sample Diagnosis
```json
{
  "patient_id": "123e4567-e89b-12d3-a456-426614174001",
  "provider_id": "123e4567-e89b-12d3-a456-426614174002",
  "diagnosis_code": "E11.9",
  "diagnosis_name": "Type 2 diabetes mellitus without complications",
  "description": "Well controlled diabetes on metformin therapy",
  "status": "active",
  "diagnosed_at": "2024-01-15T10:20:00Z"
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

### Clinical Dependencies
- `fhir-kit-client` - FHIR client for interoperability
- `moment` - Date and time manipulation
- `lodash` - Utility functions for data manipulation

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
- **Documentation**: [Clinical Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*