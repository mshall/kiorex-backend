# 📦 Inventory Service

## Description

The Inventory Service is a comprehensive inventory management microservice for the Kiorex Healthcare Platform. It handles medical supplies, equipment, medications, and all healthcare-related inventory items with real-time tracking, automated reordering, and complete supply chain management for healthcare organizations.

## Use Cases & Features

### Inventory Management
- **Item Catalog**: Comprehensive catalog of medical supplies and equipment
- **Stock Tracking**: Real-time inventory level monitoring and tracking
- **Multi-Location Support**: Inventory management across multiple facilities
- **Category Management**: Organized inventory by categories and types
- **Supplier Management**: Vendor and supplier relationship management

### Healthcare-Specific Features
- **Medical Supplies**: Specialized medical supply management
- **Equipment Tracking**: Medical equipment lifecycle management
- **Medication Inventory**: Pharmaceutical inventory management
- **Expiration Tracking**: Product expiration date monitoring and alerts
- **Regulatory Compliance**: FDA and healthcare regulatory compliance

### Supply Chain Management
- **Automated Reordering**: Intelligent reorder point management
- **Purchase Orders**: Complete purchase order lifecycle
- **Receiving Management**: Goods receipt and inspection
- **Quality Control**: Product quality assurance and testing
- **Cost Management**: Inventory cost tracking and optimization

### Integration Features
- **EHR Integration**: Electronic Health Records integration
- **Pharmacy Integration**: Pharmacy system integration
- **Lab Integration**: Laboratory supply management
- **Billing Integration**: Inventory billing and cost allocation
- **Analytics Integration**: Inventory analytics and reporting

## API Endpoints

### Inventory Items Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/inventory/items` | Get all inventory items | JWT Required |
| `GET` | `/inventory/items/:id` | Get specific inventory item | JWT Required |
| `POST` | `/inventory/items` | Create new inventory item | JWT Required |
| `PUT` | `/inventory/items/:id` | Update inventory item | JWT Required |
| `DELETE` | `/inventory/items/:id` | Delete inventory item | JWT Required |
| `GET` | `/inventory/items/search` | Search inventory items | JWT Required |
| `GET` | `/inventory/items/category/:category` | Get items by category | JWT Required |

### Stock Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/inventory/stock` | Get stock levels | JWT Required |
| `GET` | `/inventory/stock/:itemId` | Get item stock level | JWT Required |
| `POST` | `/inventory/stock/adjust` | Adjust stock levels | JWT Required |
| `POST` | `/inventory/stock/transfer` | Transfer stock between locations | JWT Required |
| `GET` | `/inventory/stock/low` | Get low stock items | JWT Required |
| `GET` | `/inventory/stock/expiring` | Get expiring items | JWT Required |

### Purchase Orders
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/inventory/purchase-orders` | Get all purchase orders | JWT Required |
| `GET` | `/inventory/purchase-orders/:id` | Get specific purchase order | JWT Required |
| `POST` | `/inventory/purchase-orders` | Create new purchase order | JWT Required |
| `PUT` | `/inventory/purchase-orders/:id` | Update purchase order | JWT Required |
| `POST` | `/inventory/purchase-orders/:id/approve` | Approve purchase order | JWT Required |
| `POST` | `/inventory/purchase-orders/:id/receive` | Receive purchase order | JWT Required |

### Suppliers Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/inventory/suppliers` | Get all suppliers | JWT Required |
| `GET` | `/inventory/suppliers/:id` | Get specific supplier | JWT Required |
| `POST` | `/inventory/suppliers` | Create new supplier | JWT Required |
| `PUT` | `/inventory/suppliers/:id` | Update supplier | JWT Required |
| `DELETE` | `/inventory/suppliers/:id` | Delete supplier | JWT Required |
| `GET` | `/inventory/suppliers/:id/products` | Get supplier products | JWT Required |

### Inventory Analytics
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/inventory/analytics/usage` | Get usage analytics | JWT Required |
| `GET` | `/inventory/analytics/costs` | Get cost analytics | JWT Required |
| `GET` | `/inventory/analytics/turnover` | Get turnover analytics | JWT Required |
| `GET` | `/inventory/analytics/expiration` | Get expiration analytics | JWT Required |
| `GET` | `/inventory/reports/summary` | Get inventory summary report | JWT Required |

### Health & Monitoring
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/inventory/health` | Service health check | None |
| `GET` | `/inventory/metrics` | Inventory service metrics | JWT Required |

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
   cd services/inventory-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3017
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=inventory_db
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
   docker build -t healthcare-inventory-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up inventory-service
   ```

### Database Schema

#### Inventory Items Table
```sql
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  unit_of_measure VARCHAR(50) NOT NULL,
  unit_cost DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  supplier_id UUID,
  minimum_stock_level INTEGER DEFAULT 0,
  maximum_stock_level INTEGER,
  reorder_point INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Stock Levels Table
```sql
CREATE TABLE stock_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES inventory_items(id),
  location_id UUID NOT NULL,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  last_counted_at TIMESTAMP,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Purchase Orders Table
```sql
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(12,2),
  ordered_by UUID NOT NULL,
  approved_by UUID,
  received_by UUID,
  ordered_at TIMESTAMP,
  approved_at TIMESTAMP,
  received_at TIMESTAMP,
  expected_delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Suppliers Table
```sql
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  contact_person VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  tax_id VARCHAR(50),
  payment_terms VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Stock Movements Table
```sql
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES inventory_items(id),
  movement_type VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10,2),
  reference_type VARCHAR(50),
  reference_id UUID,
  location_id UUID,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /inventory/health`
- **Response**: Service status, database connectivity, Redis status, Kafka connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Inventory turnover rates
- Stock level accuracy
- Purchase order processing times
- Supplier performance metrics
- Cost optimization analytics

### Logging
- Inventory level changes
- Purchase order activities
- Stock movement events
- Supplier interactions
- Cost tracking activities

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to inventory data
- **Audit Logging**: Complete inventory audit trails
- **Data Encryption**: Encrypted storage of sensitive data
- **Secure Transmission**: TLS encryption for all communications

### Inventory Security
- **Access Logging**: Complete access logging for inventory data
- **Data Integrity**: Inventory data integrity and validation
- **Backup Security**: Secure backup and recovery of inventory data
- **Compliance Monitoring**: Real-time compliance monitoring
- **Cost Protection**: Financial data protection and security

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Inventory Features
- **AI-Powered Forecasting**: Machine learning for demand forecasting
- **Predictive Analytics**: Predictive analytics for inventory optimization
- **Automated Reordering**: AI-powered automated reorder management
- **Smart Warehousing**: IoT-based smart warehouse management
- **Blockchain Tracking**: Blockchain-based supply chain tracking

### Healthcare-Specific Enhancements
- **Regulatory Compliance**: Advanced regulatory compliance management
- **Quality Assurance**: Enhanced quality control and testing
- **Recall Management**: Product recall and safety management
- **Clinical Integration**: Advanced clinical workflow integration
- **Cost Optimization**: Healthcare cost optimization and analytics

### Integration Capabilities
- **EHR Integration**: Enhanced Electronic Health Records integration
- **ERP Integration**: Enterprise Resource Planning integration
- **Supplier Portals**: Supplier self-service portals
- **Mobile Applications**: Mobile inventory management applications
- **API Gateway**: Enhanced API Gateway integration

### Performance & Scalability
- **Inventory Optimization**: Advanced inventory optimization algorithms
- **Caching Strategy**: Intelligent caching for inventory data
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for inventory content
- **Microservice Architecture**: Enhanced microservice communication

### Analytics & Reporting
- **Inventory Analytics**: Comprehensive inventory analytics and reporting
- **Cost Analysis**: Advanced cost analysis and optimization
- **Performance Metrics**: Inventory performance metrics and benchmarking
- **Predictive Analytics**: Predictive analytics for inventory management
- **Business Intelligence**: Inventory-based business intelligence

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

### Inventory Dependencies
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

- **Service Owner**: Inventory Management Team
- **Documentation**: [Inventory Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*
