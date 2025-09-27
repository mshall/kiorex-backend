# Clinical Service

A comprehensive clinical management microservice for the Kiorex healthcare platform.

## Features

- **Medical Records Management**: Complete EHR with encryption and audit trails
- **Prescription System**: E-prescribing with drug interaction checking
- **Lab Results**: Order tracking and result management
- **Clinical Notes**: SOAP notes and encounter documentation
- **Diagnosis Management**: ICD-10 coding and problem lists
- **FHIR Compliance**: Healthcare data interoperability
- **Security**: Field-level encryption for PHI/PII
- **Audit Logging**: Complete access tracking for HIPAA compliance
- **Drug Safety**: Interaction checking and controlled substance monitoring
- **Patient Summary**: Comprehensive health overview and history

## API Endpoints

### Medical Records
- `POST /medical-records` - Create medical record
- `GET /medical-records/:id` - Get medical record by ID
- `GET /medical-records/patient/:patientId` - Get patient medical records
- `PUT /medical-records/:id` - Update medical record
- `GET /medical-records/patient/:patientId/summary` - Get patient summary
- `GET /medical-records/patient/:patientId/export-fhir` - Export to FHIR format

### Prescriptions
- `POST /prescriptions` - Create prescription
- `POST /prescriptions/:id/refill` - Refill prescription
- `POST /prescriptions/:id/cancel` - Cancel prescription
- `GET /prescriptions/patient/:patientId` - Get patient prescriptions
- `POST /prescriptions/check-interactions` - Check drug interactions
- `GET /prescriptions/reports/controlled-substances` - Get controlled substance report

### Lab Results
- `POST /lab-results` - Create lab result
- `GET /lab-results/:id` - Get lab result by ID
- `GET /lab-results/patient/:patientId` - Get patient lab results
- `PUT /lab-results/:id` - Update lab result
- `POST /lab-results/:id/interpret` - Add interpretation

### Clinical Notes
- `POST /clinical-notes` - Create clinical note
- `GET /clinical-notes/:id` - Get clinical note by ID
- `GET /clinical-notes/patient/:patientId` - Get patient clinical notes
- `PUT /clinical-notes/:id` - Update clinical note

## Database Access

To access the clinical service database directly:

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d clinical_db

# Using Docker
docker exec -it healthcare-postgres psql -U postgres -d clinical_db

# Connection string
postgresql://postgres:postgres123@localhost:5432/clinical_db
```

### Database Tables
- `medical_records` - Patient medical records
- `prescriptions` - Prescription data
- `lab_results` - Laboratory test results
- `clinical_notes` - Clinical documentation
- `vitals` - Vital signs measurements
- `allergies` - Patient allergy information
- `medications` - Medication history
- `diagnoses` - Diagnosis records
- `procedures` - Medical procedures
- `immunizations` - Vaccination records

## Environment Variables

- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `KAFKA_BROKER` - Kafka broker URL
- `JWT_SECRET` - JWT secret key
- `ENCRYPTION_KEY` - Encryption key for PHI data

## Running the Service

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Build and start in production
npm run build
npm run start:prod
```

## Docker

```bash
# Build image
docker build -t clinical-service .

# Run container
docker run -p 3006:3006 clinical-service
```

## Security Features

- **Field-level encryption** for sensitive PHI data
- **Access control** based on user roles and patient relationships
- **Audit logging** for all data access and modifications
- **HIPAA compliance** with proper data handling
- **Drug interaction checking** for prescription safety
- **Controlled substance monitoring** and reporting

## API Testing

### Postman Collection
Import the comprehensive API collection to test all endpoints:
- **Collection**: [Kiorex Healthcare Platform API Collection](https://www.postman.com/kiorex-healthcare/workspace/kiorex-healthcare-platform/collection/kiorex-healthcare-api-collection)
- **Environment**: Use the provided environment variables for easy testing
- **Pre-configured**: All requests are pre-filled with sample data

### Quick Start
1. Import the Postman collection
2. Set up environment variables (baseUrl, authToken, etc.)
3. Run the "Login" request to get authentication token
4. Test other endpoints with the authenticated token
