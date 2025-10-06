# 💳 Payment Service

## Description

The Payment Service is a comprehensive payment processing microservice for the Kiorex Healthcare Platform. It handles all financial transactions including patient payments, insurance claims, provider reimbursements, subscription billing, and financial reporting. The service integrates with Stripe for secure payment processing and provides a complete financial management solution for healthcare organizations.

## Use Cases & Features

### Payment Processing
- **Patient Payments**: Online payments for consultations, procedures, and services
- **Insurance Claims**: Automated insurance claim processing and tracking
- **Provider Reimbursements**: Payment processing for healthcare providers
- **Subscription Billing**: Recurring billing for premium services and memberships
- **Refund Management**: Automated refund processing and tracking

### Financial Management
- **Transaction History**: Complete transaction history and audit trails
- **Payment Methods**: Support for credit cards, debit cards, bank transfers, and digital wallets
- **Invoice Generation**: Automated invoice generation and delivery
- **Payment Plans**: Flexible payment plan management for large medical bills
- **Financial Reporting**: Comprehensive financial reports and analytics

### Healthcare-Specific Features
- **Insurance Integration**: Real-time insurance verification and eligibility checking
- **Co-payment Processing**: Automated co-payment calculation and collection
- **Deductible Tracking**: Patient deductible tracking and management
- **Prior Authorization**: Insurance prior authorization workflow integration
- **Claims Management**: Complete insurance claims lifecycle management

### Security & Compliance
- **PCI DSS Compliance**: Secure handling of payment card data
- **HIPAA Compliance**: Protected health information (PHI) security
- **Audit Logging**: Complete financial audit trails for compliance
- **Fraud Detection**: Advanced fraud detection and prevention
- **Data Encryption**: End-to-end encryption for sensitive financial data

## API Endpoints

### Payment Processing
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/payments` | Create new payment | JWT Required |
| `GET` | `/payments` | Get all payments (with filtering and pagination) | JWT Required |
| `GET` | `/payments/:id` | Get specific payment details | JWT Required |
| `POST` | `/payments/:id/capture` | Capture authorized payment | JWT Required |
| `POST` | `/payments/:id/refund` | Process refund | JWT Required |
| `POST` | `/payments/:id/void` | Void payment | JWT Required |

### Payment Methods
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/payment-methods` | Get user payment methods | JWT Required |
| `POST` | `/payment-methods` | Add new payment method | JWT Required |
| `PUT` | `/payment-methods/:id` | Update payment method | JWT Required |
| `DELETE` | `/payment-methods/:id` | Remove payment method | JWT Required |
| `POST` | `/payment-methods/:id/set-default` | Set default payment method | JWT Required |

### Invoices & Billing
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/invoices` | Get all invoices | JWT Required |
| `GET` | `/invoices/:id` | Get specific invoice | JWT Required |
| `POST` | `/invoices` | Create new invoice | JWT Required |
| `PUT` | `/invoices/:id` | Update invoice | JWT Required |
| `POST` | `/invoices/:id/send` | Send invoice to patient | JWT Required |
| `POST` | `/invoices/:id/pay` | Process invoice payment | JWT Required |

### Insurance Claims
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/claims` | Get all insurance claims | JWT Required |
| `POST` | `/claims` | Submit new insurance claim | JWT Required |
| `GET` | `/claims/:id` | Get specific claim details | JWT Required |
| `PUT` | `/claims/:id` | Update claim information | JWT Required |
| `POST` | `/claims/:id/submit` | Submit claim to insurance | JWT Required |
| `GET` | `/claims/:id/status` | Check claim status | JWT Required |

### Payment Plans
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/payment-plans` | Get all payment plans | JWT Required |
| `POST` | `/payment-plans` | Create new payment plan | JWT Required |
| `GET` | `/payment-plans/:id` | Get specific payment plan | JWT Required |
| `PUT` | `/payment-plans/:id` | Update payment plan | JWT Required |
| `POST` | `/payment-plans/:id/process` | Process payment plan payment | JWT Required |

### Financial Reporting
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/reports/revenue` | Revenue reports | JWT Required |
| `GET` | `/reports/transactions` | Transaction reports | JWT Required |
| `GET` | `/reports/refunds` | Refund reports | JWT Required |
| `GET` | `/reports/insurance` | Insurance payment reports | JWT Required |
| `GET` | `/reports/export` | Export financial data | JWT Required |

### Health & Monitoring
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/payments/health` | Service health check | None |
| `GET` | `/payments/metrics` | Payment service metrics | JWT Required |

## Installation & Setup Guide

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 15+
- Redis 7+
- Stripe Account (for payment processing)

### Local Development Setup

1. **Navigate to service directory**
   ```bash
   cd services/payment-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3004
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=payments_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
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
   docker build -t healthcare-payment-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up payment-service
   ```

### Database Schema

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL,
  payment_method_id VARCHAR(100),
  stripe_payment_intent_id VARCHAR(100),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Payment Methods Table
```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_payment_method_id VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,
  card_last_four VARCHAR(4),
  card_brand VARCHAR(20),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL,
  due_date DATE,
  description TEXT,
  line_items JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Insurance Claims Table
```sql
CREATE TABLE insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  claim_number VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  insurance_provider VARCHAR(100),
  policy_number VARCHAR(100),
  diagnosis_codes JSONB,
  procedure_codes JSONB,
  submitted_at TIMESTAMP,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /payments/health`
- **Response**: Service status, database connectivity, Redis status, Stripe connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Payment success/failure rates
- Transaction volume and value
- Refund rates and amounts
- Insurance claim processing times
- Revenue analytics and trends

### Logging
- Payment processing events
- Financial transaction logs
- Security and fraud detection events
- Insurance claim submissions and updates
- Administrative actions and data exports

## Security Considerations

### Payment Security
- **PCI DSS Compliance**: Secure handling of payment card data
- **Tokenization**: Card data tokenization for security
- **Encryption**: End-to-end encryption for sensitive data
- **Fraud Detection**: Advanced fraud detection algorithms
- **Secure Storage**: Encrypted storage of financial data

### Data Protection
- **HIPAA Compliance**: Protected health information security
- **Audit Logging**: Complete financial audit trails
- **Access Control**: Role-based access to financial data
- **Data Masking**: Sensitive data masking in logs
- **Secure Transmission**: TLS encryption for all communications

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **Webhook Security**: Secure webhook handling

## Future Enhancement Opportunities

### Advanced Payment Features
- **Multi-Currency Support**: Support for multiple currencies and exchange rates
- **Cryptocurrency Payments**: Bitcoin, Ethereum, and other cryptocurrency support
- **Mobile Payments**: Apple Pay, Google Pay, Samsung Pay integration
- **International Payments**: Support for international payment methods
- **Recurring Billing**: Advanced recurring billing with proration and upgrades

### Healthcare-Specific Enhancements
- **HSA/FSA Integration**: Health Savings Account and Flexible Spending Account support
- **Insurance API Integration**: Real-time insurance verification and eligibility
- **Prior Authorization Automation**: Automated prior authorization workflows
- **Claims Processing**: Advanced claims processing with AI/ML
- **Provider Network Management**: Provider network fee schedule management

### Financial Analytics
- **Revenue Analytics**: Advanced revenue analytics and forecasting
- **Cost Analysis**: Healthcare cost analysis and optimization
- **Profitability Analysis**: Service line profitability analysis
- **Trend Analysis**: Financial trend analysis and reporting
- **Predictive Analytics**: Predictive analytics for revenue and costs

### Integration Capabilities
- **EHR Integration**: Electronic Health Records integration
- **Practice Management**: Practice management system integration
- **Accounting Software**: QuickBooks, Xero, and other accounting software integration
- **Banking Integration**: Direct bank account integration
- **Tax Software**: Tax preparation software integration

### Compliance & Reporting
- **Regulatory Compliance**: Automated compliance with healthcare regulations
- **Audit Support**: Comprehensive audit support and documentation
- **Tax Reporting**: Automated tax reporting and compliance
- **Financial Reporting**: Advanced financial reporting and analytics
- **Compliance Monitoring**: Real-time compliance monitoring and alerting

### User Experience Improvements
- **Payment Plans**: Flexible payment plan management
- **Digital Wallets**: Digital wallet integration and management
- **Payment Reminders**: Automated payment reminders and notifications
- **Self-Service Portal**: Patient self-service payment portal
- **Mobile App**: Mobile payment application

### Performance & Scalability
- **Caching Strategy**: Advanced caching for payment data
- **Database Optimization**: Query optimization and performance tuning
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for payment pages
- **Microservice Architecture**: Enhanced microservice communication

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

### Payment Dependencies
- `stripe` - Stripe payment processing SDK
- `@stripe/stripe-js` - Stripe JavaScript SDK
- `@stripe/react-stripe-js` - React Stripe components

### Database Dependencies
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `redis` - Redis client for caching

### Development Dependencies
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing
- `@types/stripe` - TypeScript types

## Contact & Support

- **Service Owner**: Payment Processing Team
- **Documentation**: [Payment Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*