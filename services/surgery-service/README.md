# Surgery Service

A comprehensive microservice for managing surgical procedures, team coordination, and operating room scheduling in the Kiorex Healthcare Platform.

## Overview

The Surgery Service handles all aspects of surgical operations including procedure scheduling, surgical team management, operating room coordination, and post-operative care tracking. It provides role-based access control for surgeons, nurses, and administrators.

## Features

### 🏥 Surgical Procedure Management
- **Procedure Scheduling**: Create and manage surgical procedures with different types (elective, emergency, urgent)
- **Status Tracking**: Real-time surgery status updates (scheduled, in-progress, completed, cancelled, postponed)
- **Procedure Categories**: Support for cardiac, neurosurgery, orthopedic, general, plastic, urology, gynecology, oncology, pediatric, and trauma surgeries
- **Documentation**: Comprehensive operative notes, complications tracking, and outcome documentation

### 👥 Surgical Team Management
- **Team Assignment**: Assign and manage surgical teams with role-based permissions
- **Team Roles**: Surgeon, assistant surgeon, anesthesiologist, nurse, technician, resident, intern, observer
- **Confirmation System**: Team member confirmation and decline workflow
- **Workload Management**: Track team member availability and workload distribution

### 🏢 Operating Room Management
- **Room Scheduling**: Operating room availability and scheduling system
- **Room Types**: Operating room, recovery room, prep room, holding room
- **Equipment Tracking**: Equipment availability and maintenance scheduling
- **Utilization Analytics**: Room utilization rates and efficiency metrics

### 📊 Analytics & Reporting
- **Surgery Statistics**: Procedure completion rates, duration analysis, and outcome tracking
- **Team Performance**: Team member workload and performance metrics
- **Room Utilization**: Operating room efficiency and utilization reports
- **Cost Analysis**: Surgery cost tracking and financial reporting

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
   cd services/surgery-service
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
   DB_NAME=surgery_db

   # JWT Configuration
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=15m

   # Service Configuration
   PORT=3012
   NODE_ENV=development
   ```

4. **Database Setup**:
   ```bash
   # Create database
   createdb surgery_db

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

#### `surgeries`
Manages surgical procedures and their lifecycle.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patientId | UUID | Reference to patient |
| surgeonId | UUID | Reference to surgeon |
| appointmentId | UUID | Reference to appointment |
| procedureName | VARCHAR | Name of surgical procedure |
| type | ENUM | Surgery type (elective, emergency, urgent) |
| category | ENUM | Surgery category (cardiac, neurosurgery, etc.) |
| status | ENUM | Surgery status (scheduled, in_progress, completed, cancelled, postponed) |
| scheduledDate | TIMESTAMP | Scheduled surgery date and time |
| actualStartTime | TIMESTAMP | Actual surgery start time |
| actualEndTime | TIMESTAMP | Actual surgery end time |
| estimatedDuration | INTEGER | Estimated duration in minutes |
| actualDuration | INTEGER | Actual duration in minutes |
| operatingRoom | VARCHAR | Operating room identifier |
| description | TEXT | Procedure description |
| preoperativeNotes | TEXT | Pre-operative notes |
| operativeNotes | TEXT | Operative notes |
| postoperativeNotes | TEXT | Post-operative notes |
| complications | TEXT | Complications documentation |
| anesthesia | TEXT | Anesthesia details |
| bloodLoss | TEXT | Blood loss documentation |
| specimens | TEXT | Specimens collected |
| teamMembers | JSONB | Surgical team members |
| equipment | JSONB | Equipment used |
| medications | JSONB | Medications administered |
| complicationsList | JSONB | List of complications |
| followUpInstructions | JSONB | Follow-up instructions |
| cost | DECIMAL | Surgery cost |
| insuranceCoverage | VARCHAR | Insurance coverage details |
| priorAuthorization | VARCHAR | Prior authorization number |
| consentForm | VARCHAR | Consent form reference |
| preoperativeChecklist | VARCHAR | Pre-operative checklist |
| postoperativeChecklist | VARCHAR | Post-operative checklist |
| dischargeInstructions | VARCHAR | Discharge instructions |
| followUpDate | DATE | Follow-up appointment date |
| cancelledBy | UUID | User who cancelled surgery |
| cancelledAt | TIMESTAMP | Cancellation timestamp |
| cancellationReason | TEXT | Cancellation reason |
| postponedBy | UUID | User who postponed surgery |
| postponedAt | TIMESTAMP | Postponement timestamp |
| postponementReason | TEXT | Postponement reason |
| rescheduledDate | DATE | Rescheduled date |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `surgery_teams`
Manages surgical team assignments and roles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| surgeryId | UUID | Reference to surgery |
| memberId | UUID | Team member ID |
| memberName | VARCHAR | Team member name |
| role | ENUM | Team member role (surgeon, assistant_surgeon, etc.) |
| specialty | VARCHAR | Member specialty |
| licenseNumber | VARCHAR | License number |
| contactInfo | VARCHAR | Contact information |
| notes | TEXT | Additional notes |
| isActive | BOOLEAN | Active status |
| assignedBy | UUID | User who assigned member |
| assignedAt | TIMESTAMP | Assignment timestamp |
| confirmedAt | TIMESTAMP | Confirmation timestamp |
| declinedAt | TIMESTAMP | Decline timestamp |
| declineReason | TEXT | Decline reason |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `surgery_rooms`
Manages operating rooms and their availability.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| roomNumber | VARCHAR | Room number |
| name | VARCHAR | Room name |
| type | ENUM | Room type (operating_room, recovery_room, etc.) |
| status | ENUM | Room status (available, occupied, maintenance, out_of_order) |
| description | TEXT | Room description |
| equipment | JSONB | Available equipment |
| capabilities | JSONB | Room capabilities |
| capacity | INTEGER | Room capacity |
| size | DECIMAL | Room size in square meters |
| floor | VARCHAR | Floor location |
| wing | VARCHAR | Wing location |
| building | VARCHAR | Building location |
| isActive | BOOLEAN | Active status |
| maintenanceSchedule | JSONB | Maintenance schedule |
| availability | JSONB | Weekly availability schedule |
| hourlyRate | DECIMAL | Hourly room rate |
| restrictions | JSONB | Room restrictions |
| specialRequirements | JSONB | Special requirements |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### `surgery_schedules`
Manages operating room scheduling and availability.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| roomId | UUID | Reference to surgery room |
| surgeonId | UUID | Reference to surgeon |
| surgeryId | UUID | Reference to surgery |
| scheduledDate | TIMESTAMP | Scheduled date and time |
| startTime | TIMESTAMP | Start time |
| endTime | TIMESTAMP | End time |
| status | ENUM | Schedule status (available, booked, blocked, maintenance) |
| notes | TEXT | Schedule notes |
| blockedBy | UUID | User who blocked schedule |
| blockedAt | TIMESTAMP | Block timestamp |
| blockReason | TEXT | Block reason |
| unblockedBy | UUID | User who unblocked schedule |
| unblockedAt | TIMESTAMP | Unblock timestamp |
| recurringPattern | JSONB | Recurring schedule pattern |
| exceptions | JSONB | Schedule exceptions |
| cost | DECIMAL | Schedule cost |
| createdBy | UUID | Creator reference |
| updatedBy | UUID | Updater reference |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

## API Endpoints

### Surgeries

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/surgeries` | Create new surgery | Surgeon, Admin |
| GET | `/surgeries` | Get surgeries with filters | All |
| GET | `/surgeries/:id` | Get surgery by ID | All |
| PUT | `/surgeries/:id` | Update surgery | Surgeon, Admin |
| PUT | `/surgeries/:id/start` | Start surgery | Surgeon, Admin |
| PUT | `/surgeries/:id/complete` | Complete surgery | Surgeon, Admin |
| PUT | `/surgeries/:id/cancel` | Cancel surgery | Surgeon, Admin |
| PUT | `/surgeries/:id/postpone` | Postpone surgery | Surgeon, Admin |
| GET | `/surgeries/patient/:patientId` | Get surgeries by patient | All |
| GET | `/surgeries/surgeon/:surgeonId` | Get surgeries by surgeon | All |
| GET | `/surgeries/scheduled/list` | Get scheduled surgeries | Surgeon, Admin, Nurse |
| GET | `/surgeries/upcoming/list` | Get upcoming surgeries | All |
| GET | `/surgeries/statistics/overview` | Get surgery statistics | Admin, Surgeon |
| GET | `/surgeries/history/patient/:patientId` | Get surgery history for patient | All |

### Surgery Teams

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/surgery-teams` | Create surgery team | Surgeon, Admin |
| GET | `/surgery-teams/surgery/:surgeryId` | Get surgery team | All |
| GET | `/surgery-teams/:id` | Get team member by ID | All |
| PUT | `/surgery-teams/:id` | Update team member | Surgeon, Admin |
| PUT | `/surgery-teams/:id/confirm` | Confirm team member assignment | All |
| PUT | `/surgery-teams/:id/decline` | Decline team member assignment | All |
| DELETE | `/surgery-teams/:id` | Remove team member | Surgeon, Admin |
| GET | `/surgery-teams/role/:role` | Get team members by role | All |
| GET | `/surgery-teams/member/:memberId` | Get team members by member ID | All |
| GET | `/surgery-teams/pending/:memberId` | Get pending confirmations | All |
| GET | `/surgery-teams/statistics/overview` | Get team statistics | Admin, Surgeon |
| GET | `/surgery-teams/workload/:memberId` | Get team member workload | All |
| GET | `/surgery-teams/available/:role` | Get available team members | Surgeon, Admin |

### Surgery Rooms

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/surgery-rooms` | Create new surgery room | Admin |
| GET | `/surgery-rooms` | Get surgery rooms with filters | All |
| GET | `/surgery-rooms/search` | Search surgery rooms | All |
| GET | `/surgery-rooms/:id` | Get surgery room by ID | All |
| GET | `/surgery-rooms/number/:roomNumber` | Get surgery room by number | All |
| PUT | `/surgery-rooms/:id` | Update surgery room | Admin |
| DELETE | `/surgery-rooms/:id` | Delete surgery room | Admin |
| GET | `/surgery-rooms/available/rooms` | Get available surgery rooms | All |
| GET | `/surgery-rooms/type/:type` | Get surgery rooms by type | All |
| GET | `/surgery-rooms/status/:status` | Get surgery rooms by status | All |
| PUT | `/surgery-rooms/:id/status` | Update room status | Admin, Nurse |
| GET | `/surgery-rooms/statistics/overview` | Get room statistics | Admin, Nurse |
| GET | `/surgery-rooms/maintenance/needed` | Get rooms needing maintenance | Admin, Nurse |
| GET | `/surgery-rooms/out-of-order/list` | Get rooms out of order | Admin, Nurse |
| GET | `/surgery-rooms/utilization/:roomId` | Get room utilization | Admin, Nurse |

## Sample Data

### Sample Surgery
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174001",
  "surgeonId": "123e4567-e89b-12d3-a456-426614174002",
  "procedureName": "Appendectomy",
  "type": "emergency",
  "category": "general",
  "scheduledDate": "2024-01-15T14:00:00Z",
  "estimatedDuration": 60,
  "operatingRoom": "OR-1",
  "description": "Laparoscopic appendectomy for acute appendicitis",
  "anesthesia": "General anesthesia",
  "cost": 5000.00,
  "insuranceCoverage": "Blue Cross Blue Shield"
}
```

### Sample Surgery Team
```json
{
  "surgeryId": "123e4567-e89b-12d3-a456-426614174003",
  "teamMembers": [
    {
      "memberId": "123e4567-e89b-12d3-a456-426614174002",
      "memberName": "Dr. Smith",
      "role": "surgeon",
      "specialty": "General Surgery",
      "licenseNumber": "MD123456"
    },
    {
      "memberId": "123e4567-e89b-12d3-a456-426614174004",
      "memberName": "Dr. Johnson",
      "role": "anesthesiologist",
      "specialty": "Anesthesiology",
      "licenseNumber": "MD789012"
    }
  ]
}
```

### Sample Surgery Room
```json
{
  "roomNumber": "OR-1",
  "name": "Operating Room 1",
  "type": "operating_room",
  "description": "Main operating room with advanced equipment",
  "equipment": ["Surgical table", "Anesthesia machine", "Monitor", "Defibrillator"],
  "capabilities": ["Laparoscopic surgery", "Open surgery", "Emergency procedures"],
  "capacity": 1,
  "size": 45.5,
  "floor": "2",
  "wing": "Surgery",
  "building": "Main Hospital",
  "hourlyRate": 500.00
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
npm run migration:generate -- --name=CreateSurgeryTables

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
npm run seed:surgeries
npm run seed:teams
npm run seed:rooms
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
docker build -t surgery-service .

# Run container
docker run -p 3012:3012 surgery-service
```

### Environment Variables
```env
NODE_ENV=production
PORT=3012
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=surgery_db
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
```

## Monitoring

### Health Check
```bash
curl http://localhost:3012/health
```

### Metrics
- Surgery completion rates
- Team performance metrics
- Room utilization rates
- Cost analysis

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

## Future Enhancement Opportunities

### Advanced Surgical Features
- **AI-Powered Surgical Planning**: Machine learning for optimal surgical planning and outcome prediction
- **Robotic Surgery Integration**: Integration with robotic surgery systems and automation
- **3D Surgical Visualization**: 3D modeling and visualization for complex procedures
- **Virtual Reality Training**: VR-based surgical training and simulation
- **Augmented Reality Guidance**: AR-assisted surgical procedures and real-time guidance

### Healthcare-Specific Enhancements
- **Clinical Decision Support**: AI-powered clinical decision support for surgical procedures
- **Risk Assessment**: Advanced patient risk assessment and stratification
- **Outcome Prediction**: Predictive analytics for surgical outcomes and complications
- **Quality Metrics**: Advanced surgical quality metrics and benchmarking
- **Evidence-Based Protocols**: Integration with evidence-based surgical protocols

### Integration Capabilities
- **EHR Integration**: Enhanced Electronic Health Records integration
- **PACS Integration**: Picture Archiving and Communication System integration
- **LIS Integration**: Laboratory Information System integration
- **Anesthesia Integration**: Anesthesia management system integration
- **External Systems**: Integration with external surgical systems and devices

### Performance & Scalability
- **Surgical Optimization**: Advanced surgical workflow optimization
- **Resource Management**: Intelligent resource allocation and scheduling
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for surgical content
- **Microservice Architecture**: Enhanced microservice communication

### Analytics & Reporting
- **Surgical Analytics**: Comprehensive surgical analytics and reporting
- **Performance Metrics**: Advanced surgical performance metrics
- **Cost Analysis**: Surgical cost analysis and optimization
- **Quality Reporting**: Surgical quality reporting and benchmarking
- **Business Intelligence**: Surgical-based business intelligence

### Compliance & Governance
- **Regulatory Compliance**: Automated compliance with surgical regulations
- **Audit Support**: Comprehensive audit support and documentation
- **Data Governance**: Comprehensive data governance and stewardship
- **Privacy Controls**: Enhanced privacy controls and consent management
- **Compliance Monitoring**: Real-time compliance monitoring and alerting

### Patient Experience
- **Patient Portal**: Enhanced patient portal for surgical information
- **Pre-Surgical Education**: Interactive pre-surgical education and preparation
- **Post-Surgical Care**: Automated post-surgical care and monitoring
- **Recovery Tracking**: Patient recovery tracking and analytics
- **Communication**: Enhanced patient-provider communication

### Surgical Team Management
- **Team Optimization**: AI-powered surgical team optimization
- **Skill Assessment**: Surgical skill assessment and development
- **Training Programs**: Comprehensive surgical training programs
- **Performance Analytics**: Team performance analytics and improvement
- **Collaboration Tools**: Advanced collaboration tools for surgical teams

### Technology Integration
- **IoT Integration**: Internet of Things integration for surgical devices
- **Wearable Technology**: Integration with wearable health devices
- **Mobile Applications**: Advanced mobile applications for surgical management
- **Cloud Computing**: Cloud-based surgical data management
- **Blockchain**: Blockchain for surgical data integrity and security

### Research & Development
- **Clinical Trials**: Integration with clinical trial management
- **Research Analytics**: Surgical research analytics and insights
- **Data Mining**: Advanced data mining for surgical research
- **Collaboration**: Research collaboration tools and platforms
- **Publication**: Automated research publication and sharing

### Emergency & Crisis Management
- **Emergency Protocols**: Automated emergency surgical protocols
- **Crisis Management**: Crisis management and response systems
- **Disaster Preparedness**: Disaster preparedness and response
- **Resource Allocation**: Emergency resource allocation and management
- **Communication**: Emergency communication and alerting systems

### International & Global Features
- **Multi-Language Support**: Comprehensive internationalization
- **Cultural Adaptation**: Cultural adaptation for global healthcare
- **Regulatory Compliance**: Multi-country regulatory compliance
- **Currency Support**: Multi-currency support for global operations
- **Time Zone Management**: Advanced time zone management for global teams

### Sustainability & Environmental
- **Green Surgery**: Environmentally sustainable surgical practices
- **Waste Management**: Surgical waste management and optimization
- **Energy Efficiency**: Energy-efficient surgical operations
- **Carbon Footprint**: Carbon footprint tracking and reduction
- **Sustainable Materials**: Sustainable surgical materials and supplies

## Support

For support and questions, please contact the development team or create an issue in the repository.
