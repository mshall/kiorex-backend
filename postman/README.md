# Kiorex Healthcare API - Postman Collection

This directory contains the complete Postman collection for testing the Kiorex Healthcare Platform microservices.

## Files

- `Kiorex-Healthcare-API.postman_collection.json` - Complete API collection with all endpoints
- `Kiorex-Healthcare-Environment.postman_environment.json` - Environment variables for testing
- `README.md` - This documentation file

## Setup Instructions

### 1. Import Collection and Environment

1. Open Postman
2. Click "Import" button
3. Import both files:
   - `Kiorex-Healthcare-API.postman_collection.json`
   - `Kiorex-Healthcare-Environment.postman_environment.json`

### 2. Select Environment

1. In Postman, select the "Kiorex Healthcare Environment" from the environment dropdown
2. Verify the `baseUrl` is set to `http://localhost:3000`

### 3. Start Services

Make sure all microservices are running:

```bash
# Start all services
npm run start:dev

# Or start individual services
cd services/api-gateway && npm run start:dev &
cd services/auth-service && npm run start:dev &
cd services/user-service && npm run start:dev &
cd services/appointment-service && npm run start:dev &
cd services/clinical-service && npm run start:dev &
cd services/notification-service && npm run start:dev &
cd services/search-service && npm run start:dev &
cd services/video-service && npm run start:dev &
cd services/analytics-service && npm run start:dev &
```

## API Endpoints Overview

### Authentication Service (`/auth/*`)
- **POST** `/auth/login` - User login
- **POST** `/auth/register` - User registration
- **POST** `/auth/refresh` - Refresh access token
- **POST** `/auth/logout` - User logout

### User Service (`/users/*`)
- **GET** `/users/profile` - Get user profile
- **PUT** `/users/profile` - Update user profile
- **GET** `/users` - Get all users (admin only)

### Appointment Service (`/appointments/*`)
- **POST** `/appointments` - Create appointment
- **GET** `/appointments` - Get appointments
- **GET** `/appointments/{id}` - Get appointment by ID
- **PUT** `/appointments/{id}` - Update appointment
- **DELETE** `/appointments/{id}` - Cancel appointment
- **GET** `/appointments/slots` - Get available slots

### Clinical Service (`/clinical/*`)
- **POST** `/clinical/medical-records` - Create medical record
- **GET** `/clinical/medical-records` - Get medical records
- **POST** `/clinical/prescriptions` - Create prescription
- **GET** `/clinical/prescriptions` - Get prescriptions
- **POST** `/clinical/vitals` - Record vitals

### Notification Service (`/notifications/*`)
- **POST** `/notifications/email` - Send email notification
- **POST** `/notifications/sms` - Send SMS notification
- **GET** `/notifications` - Get notifications

### Search Service (`/search/*`)
- **GET** `/search/patients` - Search patients
- **GET** `/search/medical-records` - Search medical records

### Video Service (`/video/*`)
- **POST** `/video/rooms` - Create video room
- **POST** `/video/rooms/join` - Join video room
- **GET** `/video/rooms/{id}` - Get video room

### Analytics Service (`/analytics/*`)
- **GET** `/analytics/dashboard` - Get dashboard stats
- **GET** `/analytics/appointments` - Get appointment analytics
- **GET** `/analytics/patients` - Get patient analytics

## Test Credentials

The collection includes pre-configured test credentials:

### Admin User
- **Email**: `admin@healthcare.com`
- **Password**: `Admin@123456`
- **Role**: `super_admin`

### Doctor User
- **Email**: `doctor1@healthcare.com`
- **Password**: `Doctor@123456`
- **Role**: `doctor`

### Patient User
- **Email**: `patient1@healthcare.com`
- **Password**: `Patient@123456`
- **Role**: `patient`

## Environment Variables

The collection uses the following environment variables:

- `baseUrl` - API Gateway base URL (default: http://localhost:3000)
- `authToken` - JWT access token (auto-populated after login)
- `userId` - Current user ID (auto-populated after login)
- `appointmentId` - Appointment ID for testing
- `patientId` - Patient ID for testing (default: 550e8400-e29b-41d4-a716-446655440003)
- `providerId` - Provider ID for testing (default: 550e8400-e29b-41d4-a716-446655440002)

## Testing Workflow

### 1. Authentication
1. Start with any login request (Admin, Doctor, or Patient)
2. The `authToken` and `userId` will be automatically extracted and stored
3. All subsequent requests will use the stored token

### 2. Basic Flow
1. **Login** → Get authentication token
2. **Get Profile** → Verify user data
3. **Create Appointment** → Schedule a consultation
4. **Create Medical Record** → Document the visit
5. **Create Prescription** → Prescribe medication
6. **Send Notification** → Notify patient

### 3. Advanced Testing
1. **Search** → Test search functionality
2. **Video** → Test video consultation features
3. **Analytics** → View dashboard and reports

## Pre-request Scripts

The collection includes pre-request scripts that automatically:
- Extract `authToken` from login responses
- Extract `userId` from login responses
- Set appropriate headers for authenticated requests

## Rate Limiting

The API Gateway implements rate limiting:
- **Global**: 1000 requests per minute
- **User**: 100 requests per minute per user
- **Login**: 5 requests per 5 minutes per IP

Rate limit headers are included in responses:
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset timestamp

## Error Handling

Common error responses:
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **429** - Too Many Requests (rate limit exceeded)
- **500** - Internal Server Error

## Troubleshooting

### Services Not Responding
1. Check if all services are running: `ps aux | grep "nest start"`
2. Check API Gateway health: `curl http://localhost:3000/health`
3. Check individual service health: `curl http://localhost:3001/health`

### Authentication Issues
1. Verify credentials are correct
2. Check if token is properly extracted
3. Ensure token is not expired

### Database Issues
1. Check PostgreSQL is running: `brew services list | grep postgresql`
2. Verify database connections in service logs
3. Check if seed data is loaded

## Support

For issues or questions:
1. Check the service logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all required services are running and healthy
