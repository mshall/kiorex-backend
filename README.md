# Kiorex Healthcare Platform

A comprehensive microservices-based healthcare platform built with NestJS, providing complete healthcare management solutions.

## 🏗️ Architecture

This platform consists of 9 microservices:

| Service | Port | Description | Database |
|---------|------|-------------|----------|
| **API Gateway** | 3000 | Central routing and load balancing | - |
| **Auth Service** | 3001 | Authentication & authorization | `auth_db` |
| **User Service** | 3002 | User management & profiles | `users_db` |
| **Payment Service** | 3004 | Payment processing | `payments_db` |
| **Appointment Service** | 3005 | Appointment scheduling | `appointments_db` |
| **Clinical Service** | 3006 | Medical records & prescriptions | `clinical_db` |
| **Notification Service** | 3007 | Multi-channel notifications | `notifications_db` |
| **Search Service** | 3008 | Full-text search with Elasticsearch | `search_db` |
| **Video Service** | 3009 | Video conferencing | `video_db` |
| **Analytics Service** | 3010 | Analytics & reporting | `analytics_db` |

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+
- Redis 7+
- Elasticsearch 8+

### 1. Clone Repository
```bash
git clone https://github.com/mshall/kiorex-backend.git
cd kiorex-backend
```

### 2. Start Services
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start specific services
docker-compose up -d postgres redis kafka elasticsearch
docker-compose up -d auth-service user-service appointment-service
```

### 3. Seed Database
```bash
# Run the master seed script
./scripts/seed-all-databases.sh

# Or seed individual databases
psql -h localhost -p 5432 -U postgres -d auth_db -f scripts/seed-data/auth-seed.sql
```

### 4. Test APIs
Import the Postman collection and start testing:
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