# Kiorex Healthcare Platform

A comprehensive microservices-based healthcare platform built with NestJS, providing complete healthcare management solutions.

## 🏗️ Architecture

This platform consists of 9 microservices:

| Service | Port | Description | Database |
|---------|------|-------------|----------|
| **API Gateway** | 3000 | Central routing and load balancing | - |
| **Auth Service** | 3001 | Authentication & authorization | `auth_db` |
| **User Service** | 3002 | User management & profiles | `users_db` |
| **Appointment Service** | 3003 | Appointment scheduling | `appointment_db` |
| **Payment Service** | 3004 | Payment processing | `payment_db` |
| **Clinical Service** | 3005 | Medical records & prescriptions | `clinical_db` |
| **Notification Service** | 3006 | Multi-channel notifications | `notification_db` |
| **Search Service** | 3007 | Full-text search with Elasticsearch | `search_db` |
| **Video Service** | 3008 | Video conferencing | `video_db` |
| **Analytics Service** | 3009 | Analytics & reporting | `analytics_db` |

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (for infrastructure)
- **Node.js 18+** (for local development)
- **npm 9+** (for package management)
- **PostgreSQL 15+** (via Docker)
- **Redis 7+** (via Docker)
- **Elasticsearch 8+** (via Docker)
- **Kafka** (via Docker)
- **Kubernetes** (for production deployment)

### 1. Clone Repository
```bash
git clone https://github.com/mshall/kiorex-backend.git
cd kiorex-backend
```

### 2. Global Installation (One-Time Setup)
```bash
# Install global dependencies (run once)
npm install -g @nestjs/cli typescript ts-node nodemon

# Install all service dependencies at once
npm run install:all

# This command installs dependencies for all services:
# - services/auth-service
# - services/user-service  
# - services/appointment-service
# - services/clinical-service
# - services/notification-service
# - services/search-service
# - services/video-service
# - services/analytics-service
# - services/api-gateway
```

### 3. Infrastructure Setup
```bash
# Start all infrastructure services (PostgreSQL, Redis, Kafka, Elasticsearch)
npm run start:infrastructure

# Or manually with Docker Compose
docker-compose up -d postgres redis kafka elasticsearch minio
```

### 4. Environment Configuration
Create `.env` files for each service with the following templates:

**Global Environment Variables (All Services)**
```env
# JWT Configuration (MUST be same across all services)
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis123

# Kafka Configuration
KAFKA_BROKER=localhost:9092
```

**Service-Specific Environment Files:**

**Auth Service** (`services/auth-service/.env`)
```env
# Copy global variables above
DB_NAME=auth_db
PORT=3001
```

**User Service** (`services/user-service/.env`)
```env
# Copy global variables above
DB_NAME=users_db
PORT=3002
```

**Appointment Service** (`services/appointment-service/.env`)
```env
# Copy global variables above
DB_NAME=appointment_db
PORT=3003
```

**Clinical Service** (`services/clinical-service/.env`)
```env
# Copy global variables above
DB_NAME=clinical_db
PORT=3004
```

**Notification Service** (`services/notification-service/.env`)
```env
# Copy global variables above
DB_NAME=notification_db
PORT=3006

# Email Configuration
SENDGRID_API_KEY=SG...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SMS Configuration
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Push Notifications
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
```

**Search Service** (`services/search-service/.env`)
```env
# Copy global variables above
DB_NAME=search_db
PORT=3007

# Elasticsearch Configuration
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

**Video Service** (`services/video-service/.env`)
```env
# Copy global variables above
DB_NAME=video_db
PORT=3008

# Twilio Video Configuration
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_API_KEY_SID=SK...
TWILIO_API_KEY_SECRET=...
```

**Analytics Service** (`services/analytics-service/.env`)
```env
# Copy global variables above
DB_NAME=analytics_db
PORT=3009
```

**API Gateway** (`services/api-gateway/.env`)
```env
# Copy global variables above
PORT=3000

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
APPOINTMENT_SERVICE_URL=http://localhost:3003
CLINICAL_SERVICE_URL=http://localhost:3004
NOTIFICATION_SERVICE_URL=http://localhost:3006
SEARCH_SERVICE_URL=http://localhost:3007
VIDEO_SERVICE_URL=http://localhost:3008
ANALYTICS_SERVICE_URL=http://localhost:3009

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

### 5. Database Setup
```bash
# Create all databases and run migrations
npm run migration:run

# Seed test data for all services
npm run seed:data

# This will:
# - Create all required PostgreSQL databases
# - Run TypeORM migrations for all services
# - Seed test data (users, appointments, etc.)
```

### 6. Start All Services
```bash
# Start all microservices in development mode
npm run start:dev

# This command starts all services simultaneously:
# - API Gateway (port 3000)
# - Auth Service (port 3001)
# - User Service (port 3002)
# - Appointment Service (port 3003)
# - Clinical Service (port 3004)
# - Notification Service (port 3006)
# - Search Service (port 3007)
# - Video Service (port 3008)
# - Analytics Service (port 3009)

# Alternative: Start with Docker Compose
docker-compose up
```

### 7. Testing & Verification
```bash
# Run all tests across all services
npm run test

# Run integration tests
npm run test:e2e

# Run load tests
npm run test:load

# Run smoke tests (health checks)
npm run test:smoke

# Test API endpoints
curl http://localhost:3000/health
```

### 7. Production Deployment
For AWS deployment:

1. Set up EKS cluster using the Terraform configs
2. Configure secrets in AWS Secrets Manager
3. Deploy using the Kubernetes manifests
4. Set up monitoring with Prometheus/Grafana
5. Configure auto-scaling policies

## 🔧 Development Commands

### Global Service Management
```bash
# Install all dependencies for all services (run once)
npm run install:all

# Start all services in development mode
npm run start:dev

# Start only infrastructure services (PostgreSQL, Redis, Kafka, etc.)
npm run start:infrastructure

# Stop all services
npm run stop

# Build all services for production
npm run build

# Start all services in production mode
npm run start:all
```

### Individual Service Management
```bash
# Start specific service
cd services/auth-service && npm run start:dev

# Build specific service
cd services/auth-service && npm run build

# Test specific service
cd services/auth-service && npm test

# Install dependencies for specific service
cd services/auth-service && npm install
```

### Database Operations
```bash
# Generate migrations for all services
npm run migration:generate

# Run migrations for all services
npm run migration:run

# Seed test data for all services
npm run seed:data

# Create all databases
psql -h localhost -U postgres -f scripts/create-all-databases.sql

# Seed all databases with test data
psql -h localhost -U postgres -f scripts/seed-data-corrected.sql
```

### Testing
```bash
# Run all tests across all services
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:e2e

# Run load tests
npm run test:load

# Run smoke tests (health checks)
npm run test:smoke

# Test specific service
cd services/auth-service && npm test
```

### Building
```bash
# Build all services
npm run build

# Build specific service
cd services/auth-service && npm run build
```

### Code Quality
```bash
# Lint all services
npm run lint

# Format all services
npm run format
```

## 🐳 Docker Commands

### Development
```bash
# Start all services with Docker
docker-compose up -d

# Start specific services
docker-compose up -d postgres redis kafka elasticsearch

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down
```

### Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (EKS, GKE, AKS, or local)
- kubectl configured
- Helm (optional)

### Deploy to Kubernetes
```bash
# Create namespace
kubectl create namespace health-platform

# Apply configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n health-platform

# View logs
kubectl logs -f deployment/auth-service -n health-platform
```

### Scaling
```bash
# Scale specific service
kubectl scale deployment auth-service --replicas=5 -n health-platform

# Auto-scaling is configured via HPA
kubectl get hpa -n health-platform
```

## 📊 Monitoring & Observability

### Access Points
- **API Gateway**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3030 (admin/admin123)
- **Jaeger**: http://localhost:16686

### Health Checks
```bash
# Check all services health
npm run test:smoke

# Check specific service
curl http://localhost:3000/health
curl http://localhost:3001/health
```

## 🔗 API Testing

### Current Service Status
- ✅ **Auth Service**: Fully functional with JWT authentication
- ✅ **API Gateway**: Working with proper routing and rate limiting
- ✅ **User Service**: Running with JWT authentication
- ✅ **Appointment Service**: Running with JWT authentication
- ✅ **Payment Service**: Running with JWT authentication and Stripe integration
- ✅ **Clinical Service**: Running with JWT authentication
- ✅ **Notification Service**: Running with JWT authentication
- ✅ **Search Service**: Running with JWT authentication
- ✅ **Video Service**: Running with JWT authentication
- ✅ **Analytics Service**: Running with JWT authentication

### Postman Collection
We provide a comprehensive Postman collection for testing all microservices:

**Collection Files:**
- `postman/Kiorex-Healthcare-API.postman_collection.json` - Complete API collection
- `postman/Kiorex-Healthcare-Environment.postman_environment.json` - Environment variables
- `postman/README.md` - Detailed testing documentation

**Quick Setup:**
1. Import both JSON files into Postman
2. Select "Kiorex Healthcare Environment"
3. Start all services: `npm run start:dev`
4. Run the "Admin Login" request to get authentication token
5. All subsequent requests will automatically use the token

**Test Credentials:**
- **Admin**: `admin@healthcare.com` / `Admin@123456`
- **Doctor**: `doctor1@healthcare.com` / `Doctor@123456`
- **Patient**: `patient1@healthcare.com` / `Patient@123456`

**Working Endpoints:**
- ✅ Authentication: `/auth/login`, `/auth/register`, `/auth/profile`
- ✅ User Management: `/users/profile`, `/users/update`
- ✅ Appointments: `/appointments`, `/appointments/slots`
- ✅ Payments: `/payments`, `/payments/refunds`, `/payments/payment-methods`
- ✅ Clinical: `/clinical/medical-records`, `/clinical/prescriptions`
- ✅ Notifications: `/notifications`, `/notifications/preferences`
- ✅ Search: `/search/providers`, `/search/appointments`, `/search/clinical-records`
- ✅ Video: `/video/sessions`, `/video/sessions/:id/join`
- ✅ Analytics: `/analytics/events`, `/analytics/metrics`
- ✅ API Gateway: All routing and health checks

**Online Collection:**
- **Collection**: [Kiorex Healthcare Platform API Collection](https://www.postman.com/kiorex-healthcare/workspace/kiorex-healthcare-platform/collection/kiorex-healthcare-api-collection)

## 📊 Database Access

### Direct Database Access
```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d [database_name]

# Using Docker
docker exec -it healthcare-postgres psql -U postgres -d [database_name]

# Connection string
postgresql://postgres:postgres123@localhost:5432/[database_name]
```

### Available Databases
- `auth_db` - Authentication data
- `users_db` - User profiles and preferences
- `appointments_db` - Appointments and scheduling
- `payments_db` - Payment transactions
- `clinical_db` - Medical records and prescriptions
- `notifications_db` - Notifications and templates
- `search_db` - Search analytics and queries
- `video_db` - Video sessions and recordings
- `analytics_db` - Analytics metrics and events

## 🔧 Development

### Local Development Setup
```bash
# Install dependencies for a specific service
cd services/auth-service
npm install

# Start in development mode
npm run start:dev

# Build for production
npm run build
npm run start:prod
```

### Environment Variables
Each service requires specific environment variables. See individual service READMEs for details.

### Testing
```bash
# Run tests for a specific service
cd services/auth-service
npm test

# Run e2e tests
npm run test:e2e
```

## 📚 API Documentation

### Postman Collection
- **Comprehensive API Collection**: [Import Here](https://www.postman.com/kiorex-healthcare/workspace/kiorex-healthcare-platform/collection/kiorex-healthcare-api-collection)
- **Pre-configured requests** with sample data
- **Environment variables** for easy testing
- **Authentication flow** included

### Service-Specific Documentation
- [Auth Service](services/auth-service/README.md)
- [User Service](services/user-service/README.md)
- [Appointment Service](services/appointment-service/README.md)
- [Clinical Service](services/clinical-service/README.md)
- [Notification Service](services/notification-service/README.md)
- [Search Service](services/search-service/README.md)
- [Video Service](services/video-service/README.md)
- [Analytics Service](services/analytics-service/README.md)

## 🛠️ Infrastructure

### Monitoring
- **Prometheus**: Metrics collection (port 9090)
- **Grafana**: Dashboards and visualization (port 3030)
- **Jaeger**: Distributed tracing (port 16686)

### Message Queue
- **Kafka**: Event streaming and messaging
- **Redis**: Caching and session storage

### Storage
- **PostgreSQL**: Primary database
- **Elasticsearch**: Search and analytics
- **MinIO**: File storage (S3-compatible)

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Field-level encryption** for PHI data
- **HIPAA compliance** measures
- **Audit logging** for all operations
- **Multi-factor authentication** (MFA)

## 📈 Scalability

- **Microservices architecture** for independent scaling
- **Horizontal scaling** with load balancers
- **Database sharding** capabilities
- **Caching strategies** with Redis
- **Message queuing** for async processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the service-specific README files
- Review the Postman collection for API examples

## 🎯 Features

### Core Healthcare Features
- ✅ **Patient Management** - Complete patient profiles and history
- ✅ **Appointment Scheduling** - Advanced scheduling with conflict resolution
- ✅ **Medical Records** - Comprehensive EHR with FHIR compliance
- ✅ **Prescription Management** - E-prescribing with drug interaction checking
- ✅ **Lab Results** - Order tracking and result management
- ✅ **Video Consultations** - Telemedicine with Twilio Video
- ✅ **Notifications** - Multi-channel notifications (Email, SMS, Push)
- ✅ **Search** - Full-text search with Elasticsearch
- ✅ **Analytics** - Comprehensive reporting and dashboards
- ✅ **Payment Processing** - Integrated payment handling

### Technical Features
- ✅ **Microservices Architecture** - Scalable and maintainable
- ✅ **API Gateway** - Centralized routing and load balancing
- ✅ **Event-Driven** - Kafka-based event streaming
- ✅ **Caching** - Redis for performance optimization
- ✅ **Monitoring** - Prometheus, Grafana, and Jaeger
- ✅ **Security** - JWT, RBAC, encryption, and audit logging
- ✅ **Testing** - Comprehensive test coverage
- ✅ **Documentation** - Detailed API documentation

## 🚀 Next Steps for Your Implementation

### 1. Environment Setup
```bash
# Clone your repository
git clone https://github.com/mshall/kiorex-backend.git
cd kiorex-backend

# Copy the service implementations into your structure
# Add the new service code to each service directory

# Install dependencies for each service
npm run install:all
```

### 2. Configuration
Create `.env` files for each service with:

- Database credentials
- Redis connection
- Kafka brokers
- Stripe API keys
- Twilio credentials
- SendGrid/SMTP settings

### 3. Database Setup
```bash
# Run migrations for each service
npm run migration:generate
npm run migration:run

# Seed test data
npm run seed:data
```

### 4. Local Development
```bash
# Start infrastructure
docker-compose up -d postgres redis kafka elasticsearch minio

# Start all services
npm run start:dev

# Or use Docker
docker-compose up
```

### 5. Testing
```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Load testing
npm run test:load
```

### 6. Production Deployment
For AWS deployment:

1. Set up EKS cluster using the Terraform configs
2. Configure secrets in AWS Secrets Manager
3. Deploy using the Kubernetes manifests
4. Set up monitoring with Prometheus/Grafana
5. Configure auto-scaling policies

### Key Integration Points to Verify:

- **Auth Service** → All other services (JWT validation)
- **User Service** → Appointment, Payment, Clinical
- **Appointment Service** → Notification, Payment, Video
- **Payment Service** → Stripe webhooks
- **Clinical Service** → Search indexing
- **Notification Service** → All services for alerts
- **Analytics Service** → Kafka consumer for all events

### Performance Benchmarks to Achieve:

- **API Response Time**: < 100ms p99
- **Database Queries**: < 50ms p95
- **Cache Hit Rate**: > 80%
- **Service Availability**: > 99.99%
- **Concurrent Users**: 100,000+
- **Requests/Second**: 50,000+