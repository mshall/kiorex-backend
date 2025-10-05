# Document Service

A comprehensive microservice for managing healthcare documents, medical records, and file storage in the Kiorex Healthcare Platform.

## Overview

The Document Service handles all aspects of healthcare document management including medical records, patient files, imaging documents, reports, and administrative documents. It provides secure file storage, version control, access management, and document workflow capabilities.

## Features

### 📄 Document Management
- **Document Storage**: Secure storage and retrieval of healthcare documents
- **Version Control**: Track document versions and changes
- **Document Types**: Support for medical records, reports, images, forms, and administrative documents
- **Metadata Management**: Comprehensive document metadata and tagging system

### 🔒 Security & Access Control
- **Role-based Access**: Granular permissions based on user roles
- **Audit Trail**: Complete audit log of document access and modifications
- **Encryption**: Document encryption at rest and in transit
- **Compliance**: HIPAA and healthcare compliance features

### 🔍 Search & Discovery
- **Full-text Search**: Advanced search capabilities across document content
- **Filtering**: Filter documents by type, date, patient, department, and more
- **Tagging System**: Organize documents with custom tags and categories
- **Smart Recommendations**: AI-powered document recommendations

### 📊 Analytics & Reporting
- **Usage Analytics**: Document access and usage statistics
- **Storage Metrics**: Storage utilization and cost analysis
- **Compliance Reports**: Audit and compliance reporting
- **Performance Metrics**: Document processing and retrieval performance

## Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **File Storage**: AWS S3 / Local Storage
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator & Class-transformer
- **Documentation**: Swagger/OpenAPI
- **Image Processing**: Sharp
- **File Upload**: Multer

## Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- AWS S3 (optional for cloud storage)
- npm or yarn

## Installation

1. **Navigate to the service directory**:
   ```bash
   cd services/document-service
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
   DB_NAME=document_db

   # JWT Configuration
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=15m

   # Service Configuration
   PORT=3014
   NODE_ENV=development

   # File Storage Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=10485760
   ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,gif,txt

   # AWS S3 Configuration (optional)
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   ```

4. **Database Setup**:
   ```bash
   # Create database
   createdb document_db

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

#### `documents`
Core document storage and metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR | Document title |
| description | TEXT | Document description |
| documentType | ENUM | Document type (medical_record, report, image, form, etc.) |
| category | VARCHAR | Document category |
| tags | JSONB | Document tags |
| filePath | VARCHAR | File storage path |
| fileName | VARCHAR | Original file name |
| fileSize | BIGINT | File size in bytes |
| mimeType | VARCHAR | File MIME type |
| checksum | VARCHAR | File checksum for integrity |
| version | INTEGER | Document version number |
| status | ENUM | Document status (draft, active, archived, deleted) |
| patientId | UUID | Reference to patient |
| createdBy | UUID | Document creator |
| updatedBy | UUID | Last updater |
| departmentId | UUID | Department reference |
| isConfidential | BOOLEAN | Confidential document flag |
| accessLevel | ENUM | Access level (public, restricted, confidential, secret) |
| retentionPeriod | INTEGER | Retention period in days |
| expiryDate | DATE | Document expiry date |
| metadata | JSONB | Additional metadata |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `document_versions`
Document version history and change tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| documentId | UUID | Reference to document |
| version | INTEGER | Version number |
| filePath | VARCHAR | Version file path |
| fileName | VARCHAR | Version file name |
| fileSize | BIGINT | Version file size |
| checksum | VARCHAR | Version file checksum |
| changeDescription | TEXT | Description of changes |
| changedBy | UUID | User who made changes |
| changedAt | TIMESTAMP | Change timestamp |
| isActive | BOOLEAN | Active version flag |
| createdAt | TIMESTAMP | Creation timestamp |

#### `document_access_logs`
Audit trail for document access and modifications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| documentId | UUID | Reference to document |
| userId | UUID | User who accessed document |
| action | ENUM | Action performed (view, download, edit, delete, share) |
| ipAddress | VARCHAR | User IP address |
| userAgent | VARCHAR | User agent string |
| accessTime | TIMESTAMP | Access timestamp |
| duration | INTEGER | Access duration in seconds |
| success | BOOLEAN | Access success flag |
| errorMessage | TEXT | Error message if access failed |
| metadata | JSONB | Additional access metadata |
| createdAt | TIMESTAMP | Creation timestamp |

#### `document_permissions`
Document access permissions and sharing.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| documentId | UUID | Reference to document |
| userId | UUID | User with permission |
| role | VARCHAR | User role |
| permission | ENUM | Permission type (read, write, delete, share) |
| grantedBy | UUID | User who granted permission |
| grantedAt | TIMESTAMP | Permission grant timestamp |
| expiresAt | TIMESTAMP | Permission expiry timestamp |
| isActive | BOOLEAN | Active permission flag |
| conditions | JSONB | Permission conditions |
| createdAt | TIMESTAMP | Creation timestamp |

## API Endpoints

### Documents

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/documents` | Create new document | All |
| GET | `/documents` | Get documents with filters | All |
| GET | `/documents/:id` | Get document by ID | All |
| PUT | `/documents/:id` | Update document | All |
| DELETE | `/documents/:id` | Delete document | All |
| POST | `/documents/:id/upload` | Upload document file | All |
| GET | `/documents/:id/download` | Download document | All |
| GET | `/documents/:id/preview` | Preview document | All |
| POST | `/documents/:id/share` | Share document | All |
| GET | `/documents/:id/versions` | Get document versions | All |
| GET | `/documents/:id/access-logs` | Get access logs | Admin |
| GET | `/documents/search` | Search documents | All |
| GET | `/documents/patient/:patientId` | Get patient documents | All |
| GET | `/documents/department/:departmentId` | Get department documents | All |

### Document Versions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/document-versions/:id` | Get document version | All |
| POST | `/document-versions/:id/restore` | Restore document version | All |
| DELETE | `/document-versions/:id` | Delete document version | All |

### Document Permissions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/document-permissions` | Grant document permission | Admin |
| GET | `/document-permissions/document/:documentId` | Get document permissions | Admin |
| PUT | `/document-permissions/:id` | Update document permission | Admin |
| DELETE | `/document-permissions/:id` | Revoke document permission | Admin |

### Document Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/usage` | Get usage analytics | Admin |
| GET | `/analytics/storage` | Get storage analytics | Admin |
| GET | `/analytics/access-patterns` | Get access pattern analytics | Admin |
| GET | `/analytics/compliance` | Get compliance reports | Admin |

## Sample Data

### Sample Document
```json
{
  "title": "Patient Medical Record - John Doe",
  "description": "Complete medical record for patient John Doe including history, examinations, and treatments",
  "documentType": "medical_record",
  "category": "patient_records",
  "tags": ["medical", "patient", "history", "examination"],
  "patientId": "123e4567-e89b-12d3-a456-426614174001",
  "createdBy": "123e4567-e89b-12d3-a456-426614174002",
  "departmentId": "123e4567-e89b-12d3-a456-426614174003",
  "isConfidential": true,
  "accessLevel": "confidential",
  "retentionPeriod": 2555,
  "metadata": {
    "patientName": "John Doe",
    "dateOfBirth": "1980-01-15",
    "medicalRecordNumber": "MR123456"
  }
}
```

### Sample Document Version
```json
{
  "documentId": "123e4567-e89b-12d3-a456-426614174004",
  "version": 2,
  "changeDescription": "Updated patient history with new examination results",
  "changedBy": "123e4567-e89b-12d3-a456-426614174002",
  "isActive": true
}
```

### Sample Document Permission
```json
{
  "documentId": "123e4567-e89b-12d3-a456-426614174004",
  "userId": "123e4567-e89b-12d3-a456-426614174005",
  "role": "doctor",
  "permission": "read",
  "grantedBy": "123e4567-e89b-12d3-a456-426614174006",
  "expiresAt": "2024-12-31T23:59:59Z",
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
npm run migration:generate -- --name=CreateDocumentTables

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
npm run seed:documents
npm run seed:permissions
npm run seed:access-logs
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
docker build -t document-service .

# Run container
docker run -p 3014:3014 document-service
```

### Environment Variables
```env
NODE_ENV=production
PORT=3014
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=document_db
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=10485760
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## Monitoring

### Health Check
```bash
curl http://localhost:3014/health
```

### Metrics
- Document upload/download rates
- Storage utilization
- Access pattern analytics
- Compliance metrics

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Document encryption
- Audit logging
- Input validation and sanitization
- File type validation
- Size limits

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
