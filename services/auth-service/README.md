# 🔐 Auth Service

## Description

The Auth Service is the central authentication and authorization microservice for the Kiorex Healthcare Platform. It handles user authentication, JWT token generation, password management, and role-based access control (RBAC) for all healthcare system users including patients, doctors, nurses, administrators, and other healthcare staff.

## Use Cases & Features

### Core Authentication Features
- **User Registration & Login**: Secure user authentication with email/password
- **JWT Token Management**: Stateless authentication with configurable expiration
- **Password Security**: Bcrypt hashing with salt rounds for password protection
- **Session Management**: Token-based session handling with refresh capabilities
- **Multi-Role Support**: Authentication for patients, doctors, nurses, admins, and staff

### Authorization & Access Control
- **Role-Based Access Control (RBAC)**: Granular permissions based on user roles
- **Permission Management**: Fine-grained access control for healthcare data
- **Token Validation**: Middleware for protecting API endpoints
- **User Context**: Current user information extraction from tokens

### Security Features
- **Password Policies**: Enforced password complexity requirements
- **Account Lockout**: Protection against brute force attacks
- **Audit Logging**: Comprehensive authentication event logging
- **Token Blacklisting**: Secure logout with token invalidation

### Healthcare-Specific Features
- **HIPAA Compliance**: Secure handling of protected health information (PHI)
- **Audit Trails**: Complete authentication audit logs for compliance
- **Multi-Factor Authentication**: Enhanced security for sensitive operations
- **Session Timeout**: Automatic session expiration for security

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user account
- `POST /auth/login` - User login with credentials
- `POST /auth/logout` - User logout and token invalidation
- `POST /auth/refresh` - Refresh expired JWT tokens
- `POST /auth/forgot-password` - Initiate password reset process
- `POST /auth/reset-password` - Complete password reset with token

### User Management
- `GET /auth/profile` - Get current user profile
- `PUT /auth/profile` - Update user profile information
- `POST /auth/change-password` - Change user password
- `GET /auth/verify-email` - Verify user email address
- `POST /auth/resend-verification` - Resend email verification

### Role & Permission Management
- `GET /auth/roles` - Get all available roles
- `GET /auth/permissions` - Get user permissions
- `POST /auth/assign-role` - Assign role to user (admin only)
- `DELETE /auth/remove-role` - Remove role from user (admin only)

### Health & Monitoring
- `GET /auth/health` - Service health check
- `GET /auth/metrics` - Authentication metrics and statistics

## Installation & Setup Guide

### Prerequisites
- Node.js 18+ 
- npm 9+
- PostgreSQL 15+
- Redis 7+

### Local Development Setup

1. **Navigate to service directory**
   ```bash
   cd services/auth-service
   ```

2. **Install dependencies**
```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3001
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=auth_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
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
   docker build -t healthcare-auth-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up auth-service
   ```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'patient',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Roles Table
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /auth/health`
- **Response**: Service status, database connectivity, Redis status
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Authentication success/failure rates
- Token generation and validation counts
- User registration and login patterns
- Password reset request frequency
- Role assignment activities

### Logging
- Authentication events (login, logout, registration)
- Security events (failed logins, suspicious activity)
- Administrative actions (role changes, user management)
- Performance metrics (response times, error rates)

## Security Considerations

### Password Security
- Minimum 8 characters with complexity requirements
- Bcrypt hashing with salt rounds (12+)
- Password history to prevent reuse
- Account lockout after failed attempts

### Token Security
- JWT tokens with RS256 or HS256 signing
- Configurable expiration times
- Token blacklisting for secure logout
- Refresh token rotation

### Data Protection
- Encrypted storage of sensitive data
- Secure transmission (HTTPS/TLS)
- Audit logging for compliance
- GDPR/CCPA data handling

## Future Enhancement Opportunities

### Advanced Security Features
- **Multi-Factor Authentication (MFA)**: SMS, email, or authenticator app integration
- **Biometric Authentication**: Fingerprint, face recognition for mobile apps
- **Single Sign-On (SSO)**: Integration with enterprise identity providers (Active Directory, LDAP)
- **OAuth 2.0/OpenID Connect**: Third-party authentication (Google, Microsoft, Apple)
- **Risk-Based Authentication**: Adaptive authentication based on user behavior and location

### Healthcare-Specific Enhancements
- **Provider Credentialing**: Integration with medical licensing databases
- **Patient Identity Verification**: Enhanced identity verification for patient registration
- **Emergency Access**: Break-glass authentication for emergency situations
- **Audit Compliance**: Enhanced audit trails for HIPAA, GDPR, and other regulations
- **Consent Management**: Patient consent tracking and management

### User Experience Improvements
- **Social Login**: Integration with social media platforms
- **Passwordless Authentication**: Magic links, SMS codes, or biometric authentication
- **Remember Me**: Extended session management with security considerations
- **Account Recovery**: Enhanced account recovery with multiple verification methods
- **User Onboarding**: Streamlined registration process for different user types

### Integration Capabilities
- **API Gateway Integration**: Enhanced integration with API Gateway for centralized authentication
- **Microservice Communication**: Service-to-service authentication with service accounts
- **External System Integration**: Integration with hospital information systems (HIS)
- **Mobile App Support**: Enhanced mobile authentication with device management
- **Webhook Support**: Real-time authentication events to other services

### Performance & Scalability
- **Caching Strategy**: Redis-based caching for user sessions and permissions
- **Load Balancing**: Horizontal scaling with session affinity
- **Database Optimization**: Query optimization and connection pooling
- **Rate Limiting**: API rate limiting to prevent abuse
- **Monitoring**: Enhanced monitoring and alerting for authentication metrics

### Compliance & Governance
- **Data Retention**: Configurable data retention policies
- **Privacy Controls**: Enhanced privacy controls for patient data
- **Regulatory Compliance**: Automated compliance reporting and monitoring
- **Data Export**: User data export for GDPR compliance
- **Consent Management**: Granular consent tracking and management

## Dependencies

### Core Dependencies
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common NestJS utilities
- `@nestjs/typeorm` - TypeORM integration
- `@nestjs/jwt` - JWT token handling
- `@nestjs/passport` - Passport.js integration
- `passport-jwt` - JWT strategy for Passport
- `bcrypt` - Password hashing
- `class-validator` - DTO validation
- `class-transformer` - Object transformation

### Database Dependencies
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `redis` - Redis client for caching

### Development Dependencies
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing
- `@types/bcrypt` - TypeScript types

## Contact & Support

- **Service Owner**: Authentication Team
- **Documentation**: [Auth Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*