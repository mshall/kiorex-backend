# 👤 User Service

## Description

The User Service is a comprehensive user management microservice for the Kiorex Healthcare Platform. It handles user profiles, preferences, demographics, contact information, and user-related data for all healthcare system participants including patients, healthcare providers, administrative staff, and other system users.

## Use Cases & Features

### User Profile Management
- **Profile Creation & Updates**: Complete user profile management with validation
- **Demographic Information**: Age, gender, address, emergency contacts
- **Contact Management**: Multiple contact methods (phone, email, address)
- **Profile Pictures**: Avatar and profile image management
- **User Preferences**: Notification preferences, language settings, timezone

### Healthcare-Specific Features
- **Patient Demographics**: Medical history, allergies, medications, insurance information
- **Provider Profiles**: Medical credentials, specialties, certifications, availability
- **Staff Management**: Employee information, departments, roles, schedules
- **Emergency Contacts**: Critical contact information for medical emergencies
- **Insurance Information**: Insurance provider details, policy numbers, coverage

### User Data Management
- **Data Validation**: Comprehensive input validation and sanitization
- **Data Privacy**: GDPR/CCPA compliant data handling
- **Audit Logging**: Complete user data change tracking
- **Data Export**: User data export for compliance requirements
- **Data Retention**: Configurable data retention policies

### Integration Features
- **Authentication Integration**: Seamless integration with Auth Service
- **Notification Integration**: User preference-based notification routing
- **Search Integration**: User data indexing for search functionality
- **Analytics Integration**: User behavior and engagement tracking

## API Endpoints

### User Management
- `GET /users` - Get all users (with pagination and filtering)
- `GET /users/:id` - Get specific user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Soft delete user (admin only)
- `PATCH /users/:id/status` - Update user status (active/inactive)

### Profile Management
- `GET /users/:id/profile` - Get user profile
- `PUT /users/:id/profile` - Update user profile
- `POST /users/:id/avatar` - Upload profile picture
- `DELETE /users/:id/avatar` - Remove profile picture
- `GET /users/:id/preferences` - Get user preferences
- `PUT /users/:id/preferences` - Update user preferences

### Healthcare-Specific Endpoints
- `GET /users/:id/medical-info` - Get patient medical information
- `PUT /users/:id/medical-info` - Update medical information
- `GET /users/:id/insurance` - Get insurance information
- `PUT /users/:id/insurance` - Update insurance information
- `GET /users/:id/emergency-contacts` - Get emergency contacts
- `POST /users/:id/emergency-contacts` - Add emergency contact
- `PUT /users/:id/emergency-contacts/:contactId` - Update emergency contact
- `DELETE /users/:id/emergency-contacts/:contactId` - Remove emergency contact

### Provider Management
- `GET /providers` - Get all healthcare providers
- `GET /providers/:id` - Get specific provider
- `PUT /providers/:id/credentials` - Update provider credentials
- `GET /providers/:id/specialties` - Get provider specialties
- `POST /providers/:id/specialties` - Add specialty
- `GET /providers/:id/availability` - Get provider availability

### Search & Filtering
- `GET /users/search` - Search users by various criteria
- `GET /users/filter` - Filter users by role, status, department
- `GET /users/export` - Export user data (admin only)

### Health & Monitoring
- `GET /users/health` - Service health check
- `GET /users/metrics` - User service metrics

## Installation & Setup Guide

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 15+
- Redis 7+
- MinIO (for file storage)

### Local Development Setup

1. **Navigate to service directory**
   ```bash
   cd services/user-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3002
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=users_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   MINIO_BUCKET=user-avatars
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
   docker build -t healthcare-user-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up user-service
   ```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  address JSONB,
  profile_picture_url VARCHAR(500),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  preferences JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Patient Medical Info Table
```sql
CREATE TABLE patient_medical_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id),
  blood_type VARCHAR(10),
  allergies JSONB,
  medications JSONB,
  medical_conditions JSONB,
  emergency_contact JSONB,
  insurance_info JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Provider Credentials Table
```sql
CREATE TABLE provider_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES users(id),
  license_number VARCHAR(100),
  specialty VARCHAR(100),
  certifications JSONB,
  education JSONB,
  experience_years INTEGER,
  hospital_affiliations JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /users/health`
- **Response**: Service status, database connectivity, Redis status, MinIO status
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- User registration and profile update rates
- Profile picture upload/download statistics
- Search query performance and frequency
- Data export and compliance requests
- User engagement and activity patterns

### Logging
- User profile changes and updates
- Data access and modification events
- Search and filtering activities
- File upload/download operations
- Administrative actions and data exports

## Security Considerations

### Data Protection
- **PII Encryption**: Personal identifiable information encryption at rest
- **Access Control**: Role-based access to user data
- **Audit Logging**: Complete audit trail for data access
- **Data Masking**: Sensitive data masking in logs and responses
- **GDPR Compliance**: Right to be forgotten and data portability

### File Security
- **Secure Upload**: Virus scanning and file type validation
- **Access Control**: Secure file access with authentication
- **Storage Security**: Encrypted file storage in MinIO
- **Backup Security**: Secure backup and recovery procedures

### API Security
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control

## Future Enhancement Opportunities

### Advanced User Management
- **User Onboarding**: Automated onboarding workflows for different user types
- **Profile Completion**: Guided profile completion with progress tracking
- **User Segmentation**: Advanced user segmentation and targeting
- **Bulk Operations**: Bulk user management and data operations
- **User Analytics**: Advanced user behavior analytics and insights

### Healthcare-Specific Enhancements
- **Medical Records Integration**: Integration with electronic health records (EHR)
- **Provider Directory**: Comprehensive provider directory with search and filtering
- **Patient Matching**: Advanced patient matching algorithms
- **Insurance Verification**: Real-time insurance verification and eligibility
- **Credentialing Management**: Automated provider credentialing and verification

### Data Management Improvements
- **Data Quality**: Automated data quality checks and validation
- **Data Synchronization**: Real-time data synchronization across services
- **Data Archiving**: Automated data archiving and retention management
- **Data Analytics**: Advanced data analytics and reporting
- **Compliance Reporting**: Automated compliance reporting and monitoring

### Integration Capabilities
- **Third-Party Integrations**: Integration with external healthcare systems
- **API Gateway**: Enhanced API Gateway integration for centralized user management
- **Microservice Communication**: Improved service-to-service communication
- **Webhook Support**: Real-time user data changes to other services
- **Mobile App Support**: Enhanced mobile app integration and offline capabilities

### User Experience Enhancements
- **Profile Customization**: Advanced profile customization options
- **Social Features**: User connections and social features
- **Notification Preferences**: Granular notification preference management
- **Accessibility**: Enhanced accessibility features for users with disabilities
- **Multi-language Support**: Comprehensive internationalization support

### Performance & Scalability
- **Caching Strategy**: Advanced caching for user data and profiles
- **Database Optimization**: Query optimization and database performance tuning
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for profile pictures and files
- **Search Optimization**: Advanced search indexing and optimization

### Compliance & Governance
- **Privacy Controls**: Enhanced privacy controls and consent management
- **Data Governance**: Comprehensive data governance and stewardship
- **Regulatory Compliance**: Automated compliance with healthcare regulations
- **Audit Capabilities**: Enhanced audit and compliance reporting
- **Data Lineage**: Complete data lineage tracking and documentation

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

### Database Dependencies
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `redis` - Redis client for caching

### File Storage Dependencies
- `minio` - MinIO client for file storage
- `multer` - File upload handling
- `sharp` - Image processing and optimization

### Development Dependencies
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing
- `@types/multer` - TypeScript types

## Contact & Support

- **Service Owner**: User Management Team
- **Documentation**: [User Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*