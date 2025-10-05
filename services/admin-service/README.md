# Admin Service

A comprehensive microservice for healthcare platform administration, user management, system configuration, and administrative operations in the Kiorex Healthcare Platform.

## Overview

The Admin Service handles all administrative functions including user management, role and permission management, system configuration, audit logging, and platform-wide analytics. It provides centralized administration capabilities for the entire healthcare platform.

## Features

### 👥 User Management
- **User Administration**: Create, update, and manage user accounts
- **Role Management**: Define and assign user roles and permissions
- **Access Control**: Granular permission management and access control
- **User Analytics**: User activity tracking and analytics

### 🔧 System Configuration
- **Platform Settings**: System-wide configuration management
- **Service Configuration**: Microservice configuration and settings
- **Feature Flags**: Feature toggle and configuration management
- **Environment Management**: Environment-specific configurations

### 📊 Analytics & Reporting
- **Platform Analytics**: Comprehensive platform usage analytics
- **Performance Metrics**: System performance and health monitoring
- **Audit Reports**: Security and compliance audit reporting
- **Business Intelligence**: Healthcare platform business metrics

### 🔒 Security & Compliance
- **Audit Logging**: Comprehensive audit trail for all administrative actions
- **Security Monitoring**: Security event monitoring and alerting
- **Compliance Management**: HIPAA and healthcare compliance features
- **Data Governance**: Data privacy and governance controls

## Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator & Class-transformer
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: Bcrypt
- **Date Handling**: Moment.js

## Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

## Installation

1. **Navigate to the service directory**:
   ```bash
   cd services/admin-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the service root:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_NAME=admin_db

   # JWT Configuration
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=15m

   # Service Configuration
   PORT=3015
   NODE_ENV=development

   # Admin Configuration
   ADMIN_EMAIL=admin@kiorex.com
   ADMIN_PASSWORD=admin123
   DEFAULT_ROLE=admin
   ```

4. **Database Setup**:
   ```bash
   # Create database
   createdb admin_db

   # Run migrations (if available)
   npm run migration:run

   # Seed data (if available)
   npm run seed:data
   ```

5. **Build and Start**:
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## Database Schema

### Tables

#### `users`
User account management and profiles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR | User email (unique) |
| username | VARCHAR | Username (unique) |
| password | VARCHAR | Hashed password |
| firstName | VARCHAR | User first name |
| lastName | VARCHAR | User last name |
| phone | VARCHAR | Phone number |
| dateOfBirth | DATE | Date of birth |
| address | JSONB | User address information |
| profilePicture | VARCHAR | Profile picture URL |
| isActive | BOOLEAN | Account active status |
| isVerified | BOOLEAN | Email verification status |
| lastLoginAt | TIMESTAMP | Last login timestamp |
| loginAttempts | INTEGER | Failed login attempts |
| lockedUntil | TIMESTAMP | Account lock expiry |
| twoFactorEnabled | BOOLEAN | Two-factor authentication status |
| twoFactorSecret | VARCHAR | Two-factor secret |
| preferences | JSONB | User preferences |
| metadata | JSONB | Additional user metadata |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `roles`
Role definitions and permissions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Role name (unique) |
| description | TEXT | Role description |
| permissions | JSONB | Role permissions array |
| isSystem | BOOLEAN | System role flag |
| isActive | BOOLEAN | Role active status |
| createdBy | UUID | Role creator |
| updatedBy | UUID | Last updater |
| metadata | JSONB | Additional role metadata |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `user_roles`
User role assignments.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Reference to user |
| roleId | UUID | Reference to role |
| assignedBy | UUID | User who assigned role |
| assignedAt | TIMESTAMP | Assignment timestamp |
| expiresAt | TIMESTAMP | Role expiry timestamp |
| isActive | BOOLEAN | Assignment active status |
| conditions | JSONB | Assignment conditions |
| createdAt | TIMESTAMP | Creation timestamp |

#### `permissions`
Permission definitions and management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Permission name (unique) |
| description | TEXT | Permission description |
| resource | VARCHAR | Resource type |
| action | VARCHAR | Action type |
| conditions | JSONB | Permission conditions |
| isSystem | BOOLEAN | System permission flag |
| isActive | BOOLEAN | Permission active status |
| createdBy | UUID | Permission creator |
| metadata | JSONB | Additional permission metadata |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `audit_logs`
Comprehensive audit trail for all administrative actions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | User who performed action |
| action | VARCHAR | Action performed |
| resource | VARCHAR | Resource affected |
| resourceId | UUID | Resource ID |
| details | JSONB | Action details |
| ipAddress | VARCHAR | User IP address |
| userAgent | VARCHAR | User agent string |
| timestamp | TIMESTAMP | Action timestamp |
| success | BOOLEAN | Action success status |
| errorMessage | TEXT | Error message if failed |
| metadata | JSONB | Additional audit metadata |
| createdAt | TIMESTAMP | Creation timestamp |

#### `system_configurations`
System-wide configuration management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| key | VARCHAR | Configuration key (unique) |
| value | TEXT | Configuration value |
| type | ENUM | Value type (string, number, boolean, json) |
| category | VARCHAR | Configuration category |
| description | TEXT | Configuration description |
| isEncrypted | BOOLEAN | Encrypted value flag |
| isSystem | BOOLEAN | System configuration flag |
| isActive | BOOLEAN | Configuration active status |
| updatedBy | UUID | Last updater |
| metadata | JSONB | Additional configuration metadata |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `platform_analytics`
Platform usage and performance analytics.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| metric | VARCHAR | Metric name |
| value | DECIMAL | Metric value |
| unit | VARCHAR | Metric unit |
| category | VARCHAR | Metric category |
| timestamp | TIMESTAMP | Metric timestamp |
| dimensions | JSONB | Metric dimensions |
| tags | JSONB | Metric tags |
| metadata | JSONB | Additional metric metadata |
| createdAt | TIMESTAMP | Creation timestamp |

## API Endpoints

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users` | Create new user | Admin |
| GET | `/users` | Get users with filters | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| PUT | `/users/:id/activate` | Activate user account | Admin |
| PUT | `/users/:id/deactivate` | Deactivate user account | Admin |
| PUT | `/users/:id/reset-password` | Reset user password | Admin |
| GET | `/users/:id/activity` | Get user activity | Admin |
| GET | `/users/statistics` | Get user statistics | Admin |

### Role Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/roles` | Create new role | Admin |
| GET | `/roles` | Get roles with filters | Admin |
| GET | `/roles/:id` | Get role by ID | Admin |
| PUT | `/roles/:id` | Update role | Admin |
| DELETE | `/roles/:id` | Delete role | Admin |
| POST | `/roles/:id/permissions` | Assign permissions to role | Admin |
| DELETE | `/roles/:id/permissions/:permissionId` | Remove permission from role | Admin |

### Permission Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/permissions` | Create new permission | Admin |
| GET | `/permissions` | Get permissions with filters | Admin |
| GET | `/permissions/:id` | Get permission by ID | Admin |
| PUT | `/permissions/:id` | Update permission | Admin |
| DELETE | `/permissions/:id` | Delete permission | Admin |

### User Role Assignment

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user-roles` | Assign role to user | Admin |
| GET | `/user-roles/user/:userId` | Get user roles | Admin |
| GET | `/user-roles/role/:roleId` | Get role users | Admin |
| PUT | `/user-roles/:id` | Update user role assignment | Admin |
| DELETE | `/user-roles/:id` | Remove user role assignment | Admin |

### System Configuration

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/configurations` | Create system configuration | Admin |
| GET | `/configurations` | Get configurations with filters | Admin |
| GET | `/configurations/:key` | Get configuration by key | Admin |
| PUT | `/configurations/:key` | Update configuration | Admin |
| DELETE | `/configurations/:key` | Delete configuration | Admin |
| GET | `/configurations/category/:category` | Get configurations by category | Admin |

### Audit & Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/audit-logs` | Get audit logs with filters | Admin |
| GET | `/audit-logs/user/:userId` | Get user audit logs | Admin |
| GET | `/audit-logs/resource/:resource` | Get resource audit logs | Admin |
| GET | `/analytics/platform` | Get platform analytics | Admin |
| GET | `/analytics/users` | Get user analytics | Admin |
| GET | `/analytics/performance` | Get performance analytics | Admin |
| GET | `/analytics/security` | Get security analytics | Admin |

## Sample Data

### Sample User
```json
{
  "email": "admin@kiorex.com",
  "username": "admin",
  "firstName": "System",
  "lastName": "Administrator",
  "phone": "+1234567890",
  "dateOfBirth": "1980-01-01",
  "address": {
    "street": "123 Healthcare St",
    "city": "Medical City",
    "state": "MC",
    "zipCode": "12345",
    "country": "USA"
  },
  "isActive": true,
  "isVerified": true,
  "twoFactorEnabled": false,
  "preferences": {
    "language": "en",
    "timezone": "UTC",
    "notifications": true
  }
}
```

### Sample Role
```json
{
  "name": "admin",
  "description": "System administrator with full access",
  "permissions": [
    "users.create",
    "users.read",
    "users.update",
    "users.delete",
    "roles.create",
    "roles.read",
    "roles.update",
    "roles.delete",
    "system.configure"
  ],
  "isSystem": true,
  "isActive": true
}
```

### Sample Permission
```json
{
  "name": "users.create",
  "description": "Create new users",
  "resource": "users",
  "action": "create",
  "conditions": {
    "department": ["admin", "hr"]
  },
  "isSystem": true,
  "isActive": true
}
```

### Sample System Configuration
```json
{
  "key": "platform.name",
  "value": "Kiorex Healthcare Platform",
  "type": "string",
  "category": "general",
  "description": "Platform display name",
  "isEncrypted": false,
  "isSystem": true,
  "isActive": true
}
```

## Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Building
npm run build              # Build for production
npm run start:prod         # Start production build

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- --name=CreateAdminTables

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Seeding Data

```bash
# Seed initial data
npm run seed:data

# Seed specific data
npm run seed:users
npm run seed:roles
npm run seed:permissions
npm run seed:configurations
```

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Load Testing
```bash
npm run test:load
```

## Deployment

### Docker
```bash
# Build image
docker build -t admin-service .

# Run container
docker run -p 3015:3015 admin-service
```

### Environment Variables
```env
NODE_ENV=production
PORT=3015
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=admin_db
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
ADMIN_EMAIL=admin@kiorex.com
ADMIN_PASSWORD=secure-admin-password
```

## Monitoring

### Health Check
```bash
curl http://localhost:3015/health
```

### Metrics
- User activity metrics
- System performance metrics
- Security event metrics
- Platform usage analytics

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Comprehensive audit logging
- Password hashing with bcrypt
- Account lockout protection
- Two-factor authentication support
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
