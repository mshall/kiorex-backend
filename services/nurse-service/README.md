# Nurse Service

A comprehensive microservice for managing nurse shifts, patient care, and clinical documentation in the Kiorex Healthcare Platform.

## Overview

The Nurse Service handles all aspects of nursing operations including shift scheduling, patient care management, clinical note-taking, and workload tracking. It provides role-based access control for nurses, supervisors, and administrators.

## Features

### 🏥 Shift Management
- **Shift Scheduling**: Create and manage nurse shifts with different types (day, evening, night, rotating)
- **Shift Tracking**: Real-time shift status updates (scheduled, in-progress, completed, cancelled)
- **Overtime Management**: Automatic overtime calculation and tracking
- **Handover Notes**: Comprehensive shift handover documentation

### 👩‍⚕️ Patient Care Management
- **Care Planning**: Schedule and track patient care activities
- **Care Types**: Support for medication, vitals, hygiene, mobility, nutrition, emotional care, education, assessments, procedures, and emergency care
- **Priority Management**: Care prioritization (low, medium, high, urgent, critical)
- **Outcome Tracking**: Document care outcomes and effectiveness

### 📝 Clinical Documentation
- **Nurse Notes**: Comprehensive clinical note-taking system
- **Note Types**: Assessment, care plan, progress, medication, vitals, incident, handover, education, family, discharge notes
- **Draft System**: Save notes as drafts before publishing
- **Review Workflow**: Supervisor review and approval system
- **Search Functionality**: Full-text search across all notes

### 📊 Analytics & Reporting
- **Workload Statistics**: Nurse workload analysis and reporting
- **Care Statistics**: Patient care completion rates and trends
- **Shift Analytics**: Shift completion rates and overtime analysis
- **Performance Metrics**: Individual and team performance tracking

## Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator & Class-transformer
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

## Installation

1. **Navigate to the service directory**:
   ```bash
   cd services/nurse-service
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
   DB_NAME=nurse_db

   # JWT Configuration
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=15m

   # Service Configuration
   PORT=3013
   NODE_ENV=development
   ```

4. **Database Setup**:
   ```bash
   # Create database
   createdb nurse_db

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

#### `nurse_shifts`
Manages nurse shift scheduling and tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| nurseId | UUID | Reference to nurse |
| nurseName | VARCHAR | Nurse name |
| shiftDate | DATE | Shift date |
| type | ENUM | Shift type (day, evening, night, rotating) |
| status | ENUM | Shift status (scheduled, in_progress, completed, cancelled, no_show) |
| startTime | TIME | Scheduled start time |
| endTime | TIME | Scheduled end time |
| actualStartTime | TIME | Actual start time |
| actualEndTime | TIME | Actual end time |
| unit | VARCHAR | Hospital unit |
| floor | VARCHAR | Hospital floor |
| ward | VARCHAR | Hospital ward |
| patientCount | INTEGER | Number of assigned patients |
| notes | TEXT | Shift notes |
| handoverNotes | TEXT | Handover documentation |
| assignedPatients | JSONB | Array of patient IDs |
| tasks | JSONB | Shift tasks and completion status |
| medications | JSONB | Medication administration records |
| vitals | JSONB | Vital signs recorded during shift |
| incidents | JSONB | Incident reports |
| supervisorId | UUID | Supervisor reference |
| supervisorName | VARCHAR | Supervisor name |
| breakStartTime | TIME | Break start time |
| breakEndTime | TIME | Break end time |
| breakDuration | INTEGER | Break duration in minutes |
| overtimeHours | DECIMAL | Overtime hours |
| overtimeReason | TEXT | Overtime justification |
| cancelledBy | UUID | User who cancelled shift |
| cancelledAt | TIMESTAMP | Cancellation timestamp |
| cancellationReason | TEXT | Cancellation reason |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `patient_care`
Tracks patient care activities and outcomes.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patientId | UUID | Reference to patient |
| nurseId | UUID | Reference to nurse |
| nurseName | VARCHAR | Nurse name |
| careType | ENUM | Type of care (medication, vitals, hygiene, etc.) |
| status | ENUM | Care status (scheduled, in_progress, completed, cancelled, missed) |
| priority | ENUM | Care priority (low, medium, high, urgent, critical) |
| scheduledTime | TIMESTAMP | Scheduled care time |
| actualStartTime | TIMESTAMP | Actual start time |
| actualEndTime | TIMESTAMP | Actual end time |
| description | TEXT | Care description |
| instructions | TEXT | Care instructions |
| notes | TEXT | Care notes |
| outcome | TEXT | Care outcome |
| medications | JSONB | Medication administration details |
| vitals | JSONB | Vital signs recorded |
| assessments | JSONB | Assessment findings |
| procedures | JSONB | Procedures performed |
| education | JSONB | Patient education provided |
| familyCommunication | JSONB | Family communication details |
| equipment | JSONB | Equipment used |
| safetyChecks | JSONB | Safety checks performed |
| supervisorId | UUID | Supervisor reference |
| supervisorName | VARCHAR | Supervisor name |
| reviewedBy | UUID | Reviewer reference |
| reviewedAt | TIMESTAMP | Review timestamp |
| reviewNotes | TEXT | Review comments |
| duration | INTEGER | Care duration in minutes |
| requiresFollowUp | BOOLEAN | Follow-up required flag |
| followUpTime | TIMESTAMP | Follow-up scheduled time |
| followUpNotes | TEXT | Follow-up notes |
| incidentReported | BOOLEAN | Incident reported flag |
| incidentDescription | TEXT | Incident description |
| incidentSeverity | ENUM | Incident severity level |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `nurse_notes`
Clinical documentation and note-taking system.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patientId | UUID | Reference to patient |
| nurseId | UUID | Reference to nurse |
| nurseName | VARCHAR | Nurse name |
| noteType | ENUM | Note type (assessment, care_plan, progress, etc.) |
| priority | ENUM | Note priority (low, medium, high, urgent) |
| content | TEXT | Note content |
| summary | TEXT | Note summary |
| tags | JSONB | Note tags |
| attachments | JSONB | File attachments |
| relatedCare | JSONB | Related care activities |
| vitalSigns | JSONB | Vital signs recorded |
| medications | JSONB | Medications documented |
| assessments | JSONB | Assessment findings |
| interventions | JSONB | Interventions performed |
| patientResponse | JSONB | Patient response to care |
| familyCommunication | JSONB | Family communication details |
| safetyConcerns | JSONB | Safety concerns identified |
| carePlanUpdates | JSONB | Care plan modifications |
| requiresFollowUp | BOOLEAN | Follow-up required flag |
| followUpTime | TIMESTAMP | Follow-up scheduled time |
| followUpNotes | TEXT | Follow-up notes |
| requiresSupervisorReview | BOOLEAN | Supervisor review required |
| supervisorId | UUID | Supervisor reference |
| supervisorName | VARCHAR | Supervisor name |
| reviewedBy | UUID | Reviewer reference |
| reviewedAt | TIMESTAMP | Review timestamp |
| reviewComments | TEXT | Review comments |
| isConfidential | BOOLEAN | Confidential note flag |
| isDraft | BOOLEAN | Draft status |
| publishedAt | TIMESTAMP | Publication timestamp |
| metadata | JSONB | Additional metadata |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `nurse_schedules`
Advanced scheduling and availability management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| nurseId | UUID | Reference to nurse |
| nurseName | VARCHAR | Nurse name |
| scheduleDate | DATE | Schedule date |
| status | ENUM | Schedule status (available, scheduled, blocked, vacation, sick_leave, training) |
| type | ENUM | Schedule type (regular, overtime, on_call, float, preceptor, charge) |
| startTime | TIME | Start time |
| endTime | TIME | End time |
| unit | VARCHAR | Hospital unit |
| floor | VARCHAR | Hospital floor |
| ward | VARCHAR | Hospital ward |
| patientLoad | INTEGER | Expected patient load |
| notes | TEXT | Schedule notes |
| responsibilities | JSONB | Role responsibilities |
| competencies | JSONB | Required competencies |
| assignments | JSONB | Patient assignments |
| breaks | JSONB | Break schedules |
| training | JSONB | Training activities |
| meetings | JSONB | Scheduled meetings |
| hours | DECIMAL | Total hours |
| overtimeHours | DECIMAL | Overtime hours |
| payRate | DECIMAL | Hourly pay rate |
| totalPay | DECIMAL | Total pay for shift |
| supervisorId | UUID | Supervisor reference |
| supervisorName | VARCHAR | Supervisor name |
| scheduledBy | UUID | Scheduler reference |
| scheduledAt | TIMESTAMP | Scheduling timestamp |
| confirmedBy | UUID | Confirmation reference |
| confirmedAt | TIMESTAMP | Confirmation timestamp |
| declinedBy | UUID | Decline reference |
| declinedAt | TIMESTAMP | Decline timestamp |
| declineReason | TEXT | Decline reason |
| cancelledBy | UUID | Cancellation reference |
| cancelledAt | TIMESTAMP | Cancellation timestamp |
| cancellationReason | TEXT | Cancellation reason |
| recurringPattern | JSONB | Recurring schedule pattern |
| exceptions | JSONB | Schedule exceptions |
| isOnCall | BOOLEAN | On-call status |
| isFloat | BOOLEAN | Float nurse status |
| isCharge | BOOLEAN | Charge nurse status |
| isPreceptor | BOOLEAN | Preceptor status |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

## API Endpoints

### Nurse Shifts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/nurse-shifts` | Create new nurse shift | Admin, Supervisor |
| GET | `/nurse-shifts` | Get nurse shifts with filters | All |
| GET | `/nurse-shifts/:id` | Get nurse shift by ID | All |
| PUT | `/nurse-shifts/:id` | Update nurse shift | Nurse, Supervisor, Admin |
| PUT | `/nurse-shifts/:id/start` | Start nurse shift | Nurse, Admin |
| PUT | `/nurse-shifts/:id/end` | End nurse shift | Nurse, Admin |
| PUT | `/nurse-shifts/:id/cancel` | Cancel nurse shift | Nurse, Supervisor, Admin |
| GET | `/nurse-shifts/nurse/:nurseId` | Get shifts by nurse | All |
| GET | `/nurse-shifts/unit/:unit` | Get shifts by unit | All |
| GET | `/nurse-shifts/current/shifts` | Get current active shifts | All |
| GET | `/nurse-shifts/upcoming/shifts` | Get upcoming shifts | All |
| GET | `/nurse-shifts/statistics/overview` | Get shift statistics | Admin, Supervisor |
| GET | `/nurse-shifts/workload/:nurseId` | Get nurse workload | All |

### Patient Care

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/patient-care` | Create new patient care | Nurse, Admin |
| GET | `/patient-care` | Get patient care with filters | All |
| GET | `/patient-care/:id` | Get patient care by ID | All |
| PUT | `/patient-care/:id` | Update patient care | Nurse, Supervisor, Admin |
| PUT | `/patient-care/:id/start` | Start patient care | Nurse, Admin |
| PUT | `/patient-care/:id/complete` | Complete patient care | Nurse, Admin |
| PUT | `/patient-care/:id/cancel` | Cancel patient care | Nurse, Supervisor, Admin |
| GET | `/patient-care/patient/:patientId` | Get care by patient | All |
| GET | `/patient-care/nurse/:nurseId` | Get care by nurse | All |
| GET | `/patient-care/pending/care` | Get pending care | All |
| GET | `/patient-care/overdue/care` | Get overdue care | All |
| GET | `/patient-care/statistics/overview` | Get care statistics | Admin, Supervisor |
| GET | `/patient-care/workload/:nurseId` | Get nurse care workload | All |

### Nurse Notes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/nurse-notes` | Create new nurse notes | Nurse, Admin |
| GET | `/nurse-notes` | Get nurse notes with filters | All |
| GET | `/nurse-notes/search` | Search nurse notes | All |
| GET | `/nurse-notes/:id` | Get nurse notes by ID | All |
| PUT | `/nurse-notes/:id` | Update nurse notes | Nurse, Supervisor, Admin |
| PUT | `/nurse-notes/:id/publish` | Publish draft notes | Nurse, Admin |
| PUT | `/nurse-notes/:id/review` | Review nurse notes | Supervisor, Admin |
| DELETE | `/nurse-notes/:id` | Delete nurse notes | Nurse, Supervisor, Admin |
| GET | `/nurse-notes/patient/:patientId` | Get notes by patient | All |
| GET | `/nurse-notes/nurse/:nurseId` | Get notes by nurse | All |
| GET | `/nurse-notes/drafts/:nurseId` | Get draft notes by nurse | All |
| GET | `/nurse-notes/pending/review` | Get notes requiring review | Supervisor, Admin |
| GET | `/nurse-notes/pending/follow-up` | Get notes requiring follow-up | All |
| GET | `/nurse-notes/statistics/overview` | Get notes statistics | Admin, Supervisor |

## Sample Data

### Sample Nurse Shift
```json
{
  "nurseId": "123e4567-e89b-12d3-a456-426614174000",
  "nurseName": "Jane Smith",
  "shiftDate": "2024-01-15",
  "type": "day",
  "startTime": "07:00:00",
  "endTime": "19:00:00",
  "unit": "ICU",
  "floor": "3",
  "ward": "A",
  "patientCount": 4,
  "notes": "Regular day shift with 4 ICU patients",
  "supervisorId": "123e4567-e89b-12d3-a456-426614174001",
  "supervisorName": "Dr. Johnson"
}
```

### Sample Patient Care
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174002",
  "nurseId": "123e4567-e89b-12d3-a456-426614174000",
  "nurseName": "Jane Smith",
  "careType": "medication",
  "priority": "high",
  "scheduledTime": "2024-01-15T08:00:00Z",
  "description": "Administer morning medications",
  "instructions": "Give patient morning medications as prescribed",
  "requiresFollowUp": true,
  "followUpTime": "2024-01-15T12:00:00Z"
}
```

### Sample Nurse Notes
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174002",
  "nurseId": "123e4567-e89b-12d3-a456-426614174000",
  "nurseName": "Jane Smith",
  "noteType": "assessment",
  "priority": "medium",
  "content": "Patient appears stable. Vital signs within normal limits. No signs of distress. Patient reports feeling comfortable.",
  "summary": "Stable patient assessment",
  "tags": ["stable", "vitals-normal", "comfortable"],
  "requiresFollowUp": false,
  "isConfidential": false,
  "isDraft": false
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
npm run migration:generate -- --name=CreateNurseTables

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
npm run seed:shifts
npm run seed:care
npm run seed:notes
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
docker build -t nurse-service .

# Run container
docker run -p 3013:3013 nurse-service
```

### Environment Variables
```env
NODE_ENV=production
PORT=3013
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=nurse_db
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
```

## Monitoring

### Health Check
```bash
curl http://localhost:3013/health
```

### Metrics
- Shift completion rates
- Care delivery metrics
- Note documentation rates
- Workload distribution

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

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
