# 🧪 Lab Service

## Description

The Lab Service is a comprehensive laboratory management microservice for the Kiorex Healthcare Platform. It handles laboratory test orders, test results, lab bookings, lab partner management, and complete laboratory workflow management for healthcare organizations.

## Use Cases & Features

### Laboratory Management
- **Test Orders**: Laboratory test ordering and management
- **Test Results**: Laboratory result processing and delivery
- **Lab Bookings**: Laboratory appointment scheduling
- **Lab Partners**: External laboratory partner management
- **Quality Control**: Laboratory quality assurance and control

### Healthcare-Specific Features
- **Medical Tests**: Comprehensive medical test catalog
- **Result Interpretation**: Test result interpretation and analysis
- **Reference Ranges**: Normal and abnormal value ranges
- **Critical Values**: Critical result alerting and notification
- **Turnaround Times**: Test turnaround time tracking

### Integration Features
- **EHR Integration**: Electronic Health Records integration
- **Provider Communication**: Provider notification and communication
- **Patient Portal**: Patient access to lab results
- **Billing Integration**: Laboratory billing and payment processing
- **Compliance**: HIPAA and CLIA compliance management

## API Endpoints

### Lab Orders Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/lab-orders` | Get all lab orders | JWT Required |
| `GET` | `/lab-orders/:id` | Get specific lab order | JWT Required |
| `POST` | `/lab-orders` | Create new lab order | JWT Required |
| `PUT` | `/lab-orders/:id` | Update lab order | JWT Required |
| `DELETE` | `/lab-orders/:id` | Cancel lab order | JWT Required |
| `POST` | `/lab-orders/:id/process` | Process lab order | JWT Required |

### Lab Results Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/lab-results` | Get all lab results | JWT Required |
| `GET` | `/lab-results/:id` | Get specific lab result | JWT Required |
| `POST` | `/lab-results` | Create new lab result | JWT Required |
| `PUT` | `/lab-results/:id` | Update lab result | JWT Required |
| `GET` | `/lab-results/patient/:patientId` | Get patient lab results | JWT Required |
| `POST` | `/lab-results/:id/interpret` | Interpret lab result | JWT Required |

### Lab Tests Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/lab-tests` | Get all lab tests | JWT Required |
| `GET` | `/lab-tests/:id` | Get specific lab test | JWT Required |
| `POST` | `/lab-tests` | Create new lab test | JWT Required |
| `PUT` | `/lab-tests/:id` | Update lab test | JWT Required |
| `DELETE` | `/lab-tests/:id` | Delete lab test | JWT Required |
| `GET` | `/lab-tests/category/:category` | Get tests by category | JWT Required |

### Lab Bookings Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/lab-bookings` | Get all lab bookings | JWT Required |
| `GET` | `/lab-bookings/:id` | Get specific lab booking | JWT Required |
| `POST` | `/lab-bookings` | Create new lab booking | JWT Required |
| `PUT` | `/lab-bookings/:id` | Update lab booking | JWT Required |
| `DELETE` | `/lab-bookings/:id` | Cancel lab booking | JWT Required |
| `GET` | `/lab-bookings/available` | Get available booking slots | JWT Required |

### Lab Partners Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/lab-partners` | Get all lab partners | JWT Required |
| `GET` | `/lab-partners/:id` | Get specific lab partner | JWT Required |
| `POST` | `/lab-partners` | Create new lab partner | JWT Required |
| `PUT` | `/lab-partners/:id` | Update lab partner | JWT Required |
| `DELETE` | `/lab-partners/:id` | Delete lab partner | JWT Required |
| `GET` | `/lab-partners/:id/tests` | Get partner available tests | JWT Required |

### Lab Analytics & Reporting
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/lab-analytics/orders` | Get lab order analytics | JWT Required |
| `GET` | `/lab-analytics/results` | Get lab result analytics | JWT Required |
| `GET` | `/lab-analytics/turnaround` | Get turnaround time analytics | JWT Required |
| `GET` | `/lab-analytics/quality` | Get quality metrics | JWT Required |
| `GET` | `/lab-reports/summary` | Get lab summary report | JWT Required |

### Health & Monitoring
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/health` | Service health check | None |
| `GET` | `/metrics` | Lab service metrics | JWT Required |

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
   cd services/lab-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3011
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=lab_db
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
   docker build -t healthcare-lab-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up lab-service
   ```

### Database Schema

#### Lab Orders Table
```sql
CREATE TABLE lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  requested_at TIMESTAMP NOT NULL,
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Lab Results Table
```sql
CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_order_id UUID REFERENCES lab_orders(id),
  test_name VARCHAR(200) NOT NULL,
  result_value VARCHAR(100),
  result_unit VARCHAR(20),
  reference_range VARCHAR(100),
  status VARCHAR(20) NOT NULL,
  interpretation TEXT,
  is_critical BOOLEAN DEFAULT false,
  technician_id UUID,
  verified_by UUID,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Lab Tests Table
```sql
CREATE TABLE lab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_code VARCHAR(50) UNIQUE NOT NULL,
  test_name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  specimen_type VARCHAR(100),
  preparation_instructions TEXT,
  turnaround_hours INTEGER,
  reference_ranges JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Lab Bookings Table
```sql
CREATE TABLE lab_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  lab_order_id UUID REFERENCES lab_orders(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Lab Partners Table
```sql
CREATE TABLE lab_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  contact_person VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  services JSONB,
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
- Lab order processing times
- Test result turnaround times
- Lab booking success rates
- Quality control metrics
- Partner performance analytics

### Logging
- Lab order creation and processing
- Test result generation and delivery
- Lab booking management
- Quality control events
- Partner integration activities

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to lab data
- **Audit Logging**: Complete lab audit trails
- **Data Encryption**: Encrypted storage of sensitive data
- **Secure Transmission**: TLS encryption for all communications

### Lab Data Security
- **Result Security**: Secure handling of lab results
- **Access Logging**: Complete access logging for lab data
- **Data Integrity**: Lab data integrity and validation
- **Backup Security**: Secure backup and recovery of lab data
- **Compliance Monitoring**: Real-time compliance monitoring

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Lab Features
- **AI-Powered Analysis**: Machine learning for lab result interpretation
- **Predictive Analytics**: Predictive analytics for lab trends
- **Automated Quality Control**: Automated quality control processes
- **Smart Ordering**: AI-powered lab test ordering recommendations
- **Result Correlation**: Advanced result correlation and pattern recognition

### Healthcare-Specific Enhancements
- **Clinical Decision Support**: Lab-based clinical decision support
- **Population Health**: Population health lab analytics
- **Outbreak Detection**: Automated outbreak detection from lab data
- **Drug Monitoring**: Therapeutic drug monitoring integration
- **Genetic Testing**: Advanced genetic testing capabilities

### Integration Capabilities
- **EHR Integration**: Enhanced Electronic Health Records integration
- **LIS Integration**: Laboratory Information System integration
- **HIS Integration**: Hospital Information System integration
- **PACS Integration**: Picture Archiving and Communication System integration
- **External Labs**: Integration with external laboratory networks

### Performance & Scalability
- **Lab Optimization**: Advanced lab workflow optimization
- **Caching Strategy**: Intelligent caching for lab data
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for lab reports
- **Microservice Architecture**: Enhanced microservice communication

### Analytics & Reporting
- **Lab Analytics**: Comprehensive lab analytics and reporting
- **Quality Metrics**: Advanced quality metrics and benchmarking
- **Performance Monitoring**: Real-time lab performance monitoring
- **Trend Analysis**: Lab trend analysis and forecasting
- **Business Intelligence**: Lab-based business intelligence

### Compliance & Governance
- **Regulatory Compliance**: Automated compliance with lab regulations
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

### Lab Dependencies
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

- **Service Owner**: Laboratory Team
- **Documentation**: [Lab Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*
