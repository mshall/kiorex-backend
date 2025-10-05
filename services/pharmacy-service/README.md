# 💊 Pharmacy Service

## Description

The Pharmacy Service is a comprehensive medication and prescription management microservice for the Kiorex Healthcare Platform. It handles medication inventory, prescription processing, drug interactions, medication allergies, and complete pharmacy workflow management for healthcare organizations.

## Use Cases & Features

### Medication Management
- **Medication Catalog**: Comprehensive medication database and catalog
- **Drug Information**: Detailed drug information and specifications
- **Inventory Management**: Real-time medication inventory tracking
- **Stock Management**: Automated stock level monitoring and alerts
- **Expiry Tracking**: Medication expiration date tracking and alerts

### Prescription Processing
- **Electronic Prescriptions**: Digital prescription generation and processing
- **Prescription Validation**: Drug interaction and allergy checking
- **Dosage Calculation**: Automated dosage calculation and verification
- **Refill Management**: Prescription refill tracking and processing
- **Insurance Verification**: Insurance coverage and prior authorization

### Healthcare-Specific Features
- **Drug Interactions**: Comprehensive drug interaction checking
- **Allergy Management**: Patient medication allergy tracking
- **Formulary Management**: Insurance formulary and coverage management
- **Prior Authorization**: Prior authorization workflow management
- **Clinical Decision Support**: Medication-related clinical decision support

### Integration Features
- **EHR Integration**: Electronic Health Records integration
- **Provider Communication**: Provider notification and communication
- **Patient Portal**: Patient access to prescription information
- **Billing Integration**: Pharmacy billing and payment processing
- **Compliance**: HIPAA and pharmacy compliance management

## API Endpoints

### Medication Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/medications` | Get all medications | JWT Required |
| `GET` | `/medications/:id` | Get specific medication | JWT Required |
| `POST` | `/medications` | Create new medication | JWT Required |
| `PUT` | `/medications/:id` | Update medication | JWT Required |
| `DELETE` | `/medications/:id` | Delete medication | JWT Required |
| `GET` | `/medications/search` | Search medications | JWT Required |
| `GET` | `/medications/category/:category` | Get medications by category | JWT Required |

### Prescription Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/prescriptions` | Get all prescriptions | JWT Required |
| `GET` | `/prescriptions/:id` | Get specific prescription | JWT Required |
| `POST` | `/prescriptions` | Create new prescription | JWT Required |
| `PUT` | `/prescriptions/:id` | Update prescription | JWT Required |
| `DELETE` | `/prescriptions/:id` | Cancel prescription | JWT Required |
| `GET` | `/prescriptions/patient/:patientId` | Get patient prescriptions | JWT Required |
| `POST` | `/prescriptions/:id/refill` | Request prescription refill | JWT Required |
| `POST` | `/prescriptions/:id/verify` | Verify prescription | JWT Required |

### Inventory Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/inventory` | Get inventory items | JWT Required |
| `GET` | `/inventory/:id` | Get specific inventory item | JWT Required |
| `POST` | `/inventory` | Add inventory item | JWT Required |
| `PUT` | `/inventory/:id` | Update inventory item | JWT Required |
| `DELETE` | `/inventory/:id` | Remove inventory item | JWT Required |
| `GET` | `/inventory/low-stock` | Get low stock items | JWT Required |
| `POST` | `/inventory/:id/restock` | Restock inventory item | JWT Required |

### Drug Interactions & Allergies
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/interactions` | Get drug interactions | JWT Required |
| `POST` | `/interactions/check` | Check drug interactions | JWT Required |
| `GET` | `/allergies` | Get medication allergies | JWT Required |
| `POST` | `/allergies` | Add medication allergy | JWT Required |
| `PUT` | `/allergies/:id` | Update medication allergy | JWT Required |
| `DELETE` | `/allergies/:id` | Remove medication allergy | JWT Required |

### Pharmacy Analytics
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/analytics/prescriptions` | Get prescription analytics | JWT Required |
| `GET` | `/analytics/inventory` | Get inventory analytics | JWT Required |
| `GET` | `/analytics/medications` | Get medication analytics | JWT Required |
| `GET` | `/analytics/usage` | Get medication usage analytics | JWT Required |
| `GET` | `/reports/summary` | Get pharmacy summary report | JWT Required |

### Health & Monitoring
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/health` | Service health check | None |
| `GET` | `/metrics` | Pharmacy service metrics | JWT Required |

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
   cd services/pharmacy-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3012
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=pharmacy_db
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
   docker build -t healthcare-pharmacy-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up pharmacy-service
   ```

### Database Schema

#### Medications Table
```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  generic_name VARCHAR(200),
  dosage_form VARCHAR(100) NOT NULL,
  strength VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(200),
  ndc_code VARCHAR(20) UNIQUE,
  description TEXT,
  category VARCHAR(100),
  is_prescription BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Prescriptions Table
```sql
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  medication_id UUID REFERENCES medications(id),
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100),
  instructions TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  prescribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  refills_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Inventory Table
```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medications(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_cost DECIMAL(10,2),
  supplier VARCHAR(200),
  batch_number VARCHAR(100),
  expiry_date DATE,
  location VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Medication Allergies Table
```sql
CREATE TABLE medication_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  medication_id UUID REFERENCES medications(id),
  allergy_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  reaction_description TEXT,
  onset_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Drug Interactions Table
```sql
CREATE TABLE drug_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication1_id UUID REFERENCES medications(id),
  medication2_id UUID REFERENCES medications(id),
  interaction_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  description TEXT,
  clinical_effect TEXT,
  management TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /health`
- **Response**: Service status, database connectivity, Redis status, Kafka connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Prescription processing times
- Medication inventory levels
- Drug interaction alerts
- Allergy detection rates
- Pharmacy workflow efficiency

### Logging
- Prescription creation and processing
- Medication inventory changes
- Drug interaction checks
- Allergy detection events
- Pharmacy workflow activities

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to pharmacy data
- **Audit Logging**: Complete pharmacy audit trails
- **Data Encryption**: Encrypted storage of sensitive data
- **Secure Transmission**: TLS encryption for all communications

### Pharmacy Data Security
- **Prescription Security**: Secure handling of prescription data
- **Access Logging**: Complete access logging for pharmacy data
- **Data Integrity**: Pharmacy data integrity and validation
- **Backup Security**: Secure backup and recovery of pharmacy data
- **Compliance Monitoring**: Real-time compliance monitoring

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Pharmacy Features
- **AI-Powered Drug Discovery**: Machine learning for drug discovery and development
- **Predictive Analytics**: Predictive analytics for medication adherence
- **Smart Dispensing**: Automated medication dispensing systems
- **Personalized Medicine**: Personalized medication recommendations
- **Drug Safety Monitoring**: Advanced drug safety monitoring and reporting

### Healthcare-Specific Enhancements
- **Clinical Decision Support**: Advanced clinical decision support for medications
- **Population Health**: Population health medication analytics
- **Adverse Event Reporting**: Automated adverse event reporting
- **Drug Utilization Review**: Advanced drug utilization review
- **Pharmacogenomics**: Genetic-based medication recommendations

### Integration Capabilities
- **EHR Integration**: Enhanced Electronic Health Records integration
- **LIMS Integration**: Laboratory Information Management System integration
- **PBM Integration**: Pharmacy Benefit Manager integration
- **Insurance Integration**: Real-time insurance verification
- **External APIs**: Integration with external pharmacy systems

### Performance & Scalability
- **Pharmacy Optimization**: Advanced pharmacy workflow optimization
- **Caching Strategy**: Intelligent caching for pharmacy data
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for pharmacy content
- **Microservice Architecture**: Enhanced microservice communication

### Analytics & Reporting
- **Pharmacy Analytics**: Comprehensive pharmacy analytics and reporting
- **Medication Analytics**: Advanced medication usage analytics
- **Cost Analysis**: Pharmacy cost analysis and optimization
- **Quality Metrics**: Pharmacy quality metrics and benchmarking
- **Business Intelligence**: Pharmacy-based business intelligence

### Compliance & Governance
- **Regulatory Compliance**: Automated compliance with pharmacy regulations
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

### Pharmacy Dependencies
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

- **Service Owner**: Pharmacy Team
- **Documentation**: [Pharmacy Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*
