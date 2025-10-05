# 🌐 API Gateway

## Description

The API Gateway is the central entry point and orchestration layer for the Kiorex Healthcare Platform. It provides unified API access, request routing, authentication, authorization, rate limiting, circuit breaking, and monitoring for all microservices in the healthcare platform.

## Use Cases & Features

### API Management
- **Unified API**: Single entry point for all healthcare platform APIs
- **Request Routing**: Intelligent request routing to appropriate microservices
- **Load Balancing**: Distributed load balancing across service instances
- **API Versioning**: Support for multiple API versions and backward compatibility
- **Request/Response Transformation**: Data transformation and normalization

### Security & Authentication
- **Centralized Authentication**: JWT token validation and user authentication
- **Authorization**: Role-based access control (RBAC) and permission management
- **Rate Limiting**: API rate limiting and throttling to prevent abuse
- **CORS Management**: Cross-origin resource sharing configuration
- **Security Headers**: Security headers and protection mechanisms

### Monitoring & Observability
- **Request Logging**: Comprehensive request and response logging
- **Performance Monitoring**: API performance metrics and monitoring
- **Error Tracking**: Error tracking and alerting
- **Health Checks**: Service health monitoring and status reporting
- **Analytics**: API usage analytics and insights

### Healthcare-Specific Features
- **HIPAA Compliance**: HIPAA-compliant request handling and logging
- **Audit Logging**: Complete audit trails for compliance
- **Data Protection**: Secure handling of protected health information (PHI)
- **Compliance Monitoring**: Real-time compliance monitoring and alerting
- **Privacy Controls**: Patient privacy protection and data minimization

## API Endpoints

### Gateway Management
- `GET /health` - Gateway health check
- `GET /status` - Gateway status and service health
- `GET /metrics` - Gateway metrics and performance data
- `GET /routes` - Available routes and service mappings
- `GET /services` - Connected services and their status

### Authentication & Authorization
- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `GET /auth/validate` - Token validation
- `GET /auth/user` - Current user information

### Service Routing
- `GET /users/*` - Route to User Service
- `GET /appointments/*` - Route to Appointment Service
- `GET /payments/*` - Route to Payment Service
- `GET /clinical/*` - Route to Clinical Service
- `GET /notifications/*` - Route to Notification Service
- `GET /search/*` - Route to Search Service
- `GET /video/*` - Route to Video Service
- `GET /analytics/*` - Route to Analytics Service
- `GET /lab/*` - Route to Lab Service
- `GET /pharmacy/*` - Route to Pharmacy Service
- `GET /surgery/*` - Route to Surgery Service
- `GET /nurse/*` - Route to Nurse Service
- `GET /documents/*` - Route to Document Service
- `GET /admin/*` - Route to Admin Service

### Rate Limiting & Throttling
- `GET /rate-limits` - Get current rate limit status
- `POST /rate-limits/reset` - Reset rate limits (admin only)
- `GET /throttling` - Get throttling configuration
- `PUT /throttling` - Update throttling settings (admin only)

### Monitoring & Analytics
- `GET /analytics/requests` - Request analytics
- `GET /analytics/performance` - Performance analytics
- `GET /analytics/errors` - Error analytics
- `GET /analytics/users` - User analytics
- `GET /analytics/export` - Export analytics data

### Health & Monitoring
- `GET /health` - Service health check
- `GET /metrics` - Gateway service metrics

## Installation & Setup Guide

### Prerequisites
- Node.js 18+
- npm 9+
- Redis 7+
- All microservices running

### Local Development Setup

1. **Navigate to service directory**
   ```bash
   cd api-gateway
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   
   # Service URLs
   AUTH_SERVICE_URL=http://localhost:3001
   USER_SERVICE_URL=http://localhost:3002
   PAYMENT_SERVICE_URL=http://localhost:3004
   APPOINTMENT_SERVICE_URL=http://localhost:3005
   CLINICAL_SERVICE_URL=http://localhost:3006
   NOTIFICATION_SERVICE_URL=http://localhost:3007
   SEARCH_SERVICE_URL=http://localhost:3008
   VIDEO_SERVICE_URL=http://localhost:3009
   ANALYTICS_SERVICE_URL=http://localhost:3010
   LAB_SERVICE_URL=http://localhost:3011
   PHARMACY_SERVICE_URL=http://localhost:3012
   SURGERY_SERVICE_URL=http://localhost:3013
   NURSE_SERVICE_URL=http://localhost:3014
   DOCUMENT_SERVICE_URL=http://localhost:3015
   ADMIN_SERVICE_URL=http://localhost:3016
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Circuit Breaker
   CIRCUIT_BREAKER_THRESHOLD=5
   CIRCUIT_BREAKER_TIMEOUT=60000
   ```

4. **Start the service**
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
   docker build -t healthcare-api-gateway .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up api-gateway
   ```

### Configuration

#### Service Mapping
```typescript
const serviceMap = {
  '/auth': process.env.AUTH_SERVICE_URL,
  '/users': process.env.USER_SERVICE_URL,
  '/payments': process.env.PAYMENT_SERVICE_URL,
  '/appointments': process.env.APPOINTMENT_SERVICE_URL,
  '/clinical': process.env.CLINICAL_SERVICE_URL,
  '/notifications': process.env.NOTIFICATION_SERVICE_URL,
  '/search': process.env.SEARCH_SERVICE_URL,
  '/video': process.env.VIDEO_SERVICE_URL,
  '/analytics': process.env.ANALYTICS_SERVICE_URL,
  '/lab': process.env.LAB_SERVICE_URL,
  '/pharmacy': process.env.PHARMACY_SERVICE_URL,
  '/surgery': process.env.SURGERY_SERVICE_URL,
  '/nurse': process.env.NURSE_SERVICE_URL,
  '/documents': process.env.DOCUMENT_SERVICE_URL,
  '/admin': process.env.ADMIN_SERVICE_URL,
};
```

#### Rate Limiting Configuration
```typescript
const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};
```

#### Circuit Breaker Configuration
```typescript
const circuitBreakerConfig = {
  threshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD) || 5,
  timeout: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT) || 60000,
  resetTimeout: 30000,
};
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /health`
- **Response**: Gateway status, service connectivity, Redis status
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Request volume and response times
- Service availability and health
- Rate limiting and throttling statistics
- Error rates and types
- Authentication and authorization metrics

### Logging
- Request and response logging
- Authentication and authorization events
- Rate limiting and throttling events
- Circuit breaker events
- Service health and connectivity events

## Security Considerations

### API Security
- **Authentication**: JWT token validation for all requests
- **Authorization**: Role-based access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Request validation and sanitization
- **CORS Configuration**: Proper CORS configuration

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Audit Logging**: Complete request audit trails
- **Data Encryption**: Encrypted transmission of sensitive data
- **Access Control**: Secure access to backend services
- **Privacy Protection**: Patient privacy protection

### Gateway Security
- **Request Filtering**: Malicious request filtering
- **DDoS Protection**: Distributed denial of service protection
- **Security Headers**: Security headers and protection
- **SSL/TLS**: Secure communication protocols
- **Vulnerability Scanning**: Regular security vulnerability scanning

## Future Enhancement Opportunities

### Advanced Gateway Features
- **API Versioning**: Advanced API versioning and backward compatibility
- **Request Transformation**: Advanced request/response transformation
- **Response Caching**: Intelligent response caching and optimization
- **API Documentation**: Automated API documentation generation
- **Developer Portal**: Self-service developer portal

### Healthcare-Specific Enhancements
- **Clinical Workflow Integration**: Integration with clinical workflows
- **Patient Data Protection**: Enhanced patient data protection
- **Compliance Automation**: Automated compliance monitoring and reporting
- **Audit Trail Enhancement**: Enhanced audit trail capabilities
- **Privacy Controls**: Advanced privacy controls and consent management

### Performance & Scalability
- **Load Balancing**: Advanced load balancing algorithms
- **Caching Strategy**: Intelligent caching for improved performance
- **CDN Integration**: Content delivery network integration
- **Microservice Optimization**: Optimized microservice communication
- **Horizontal Scaling**: Enhanced horizontal scaling capabilities

### Integration Capabilities
- **Third-Party Integration**: Integration with external healthcare systems
- **API Marketplace**: Healthcare API marketplace and ecosystem
- **Webhook Support**: Webhook support for real-time integrations
- **Event Streaming**: Event streaming and real-time communication
- **Message Queue Integration**: Advanced message queue integration

### Analytics & Monitoring
- **Advanced Analytics**: Comprehensive API analytics and insights
- **Real-Time Monitoring**: Real-time monitoring and alerting
- **Performance Optimization**: Automated performance optimization
- **Usage Analytics**: Advanced usage analytics and reporting
- **Business Intelligence**: API-based business intelligence

### Security Enhancements
- **Advanced Authentication**: Multi-factor authentication and biometrics
- **Security Analytics**: Advanced security analytics and threat detection
- **Compliance Automation**: Automated compliance monitoring and reporting
- **Vulnerability Management**: Advanced vulnerability management
- **Security Orchestration**: Security orchestration and automation

## Dependencies

### Core Dependencies
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common NestJS utilities
- `@nestjs/jwt` - JWT token handling
- `@nestjs/passport` - Passport.js integration
- `passport-jwt` - JWT strategy for Passport
- `class-validator` - DTO validation
- `class-transformer` - Object transformation

### Gateway Dependencies
- `express-rate-limit` - Rate limiting middleware
- `opossum` - Circuit breaker implementation
- `axios` - HTTP client for service communication
- `helmet` - Security headers middleware
- `cors` - CORS middleware

### Caching Dependencies
- `redis` - Redis client for caching
- `ioredis` - Advanced Redis client

### Monitoring Dependencies
- `prom-client` - Prometheus metrics
- `winston` - Logging library
- `@nestjs/terminus` - Health checks

### Development Dependencies
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing
- `@types/express` - TypeScript types

## Contact & Support

- **Service Owner**: Platform Team
- **Documentation**: [API Gateway Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*
