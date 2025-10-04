# Kiorex Healthcare Platform - Postman Collection

## 📋 Overview

This Postman collection provides comprehensive API testing for the Kiorex Healthcare Platform microservices. The collection includes all endpoints with proper JWT authentication, pre-configured test data, and automated token management.

## 🚀 Quick Setup

### 1. Import Collection and Environment
1. Open Postman
2. Click **Import** button
3. Import both files:
   - `Kiorex-Healthcare-API.postman_collection.json`
   - `Kiorex-Healthcare-Environment.postman_environment.json`
4. Select **"Kiorex Healthcare Environment"** from the environment dropdown

### 2. Start Services
```bash
# Start all services
npm run start:dev

# Or start infrastructure first, then services
npm run start:infrastructure
npm run start:dev
```

### 3. Test Authentication
1. Run **"Admin Login"** request from the Authentication Service folder
2. The token will be automatically saved to the environment
3. All subsequent requests will use the saved token

## 🔐 Test Credentials

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `admin@healthcare.com` | `Admin@123456` | Full system access |
| **Doctor** | `doctor1@healthcare.com` | `Doctor@123456` | Medical staff access |
| **Patient** | `patient1@healthcare.com` | `Patient@123456` | Patient access |

## 📁 Collection Structure

### 🔐 Authentication Service
- **Admin Login** - Login with admin credentials (auto-saves token)
- **Doctor Login** - Login with doctor credentials
- **Patient Login** - Login with patient credentials
- **Register User** - Register new user
- **Get Profile** - Get current user profile
- **Refresh Token** - Refresh access token

### 👥 User Service
- **Get User Profile** - Get user profile information
- **Update User Profile** - Update user profile

### 📅 Appointment Service
- **Get Appointments** - Get all appointments for current user
- **Create Appointment** - Create new appointment
- **Get Available Slots** - Get available appointment slots

### 🏥 Clinical Service
- **Get Medical Records** - Get medical records for patient
- **Create Medical Record** - Create new medical record
- **Get Prescriptions** - Get prescriptions for patient
- **Create Prescription** - Create new prescription

### 🔔 Notification Service
- **Get Notifications** - Get notifications for current user
- **Create Notification** - Create new notification
- **Get Notification Preferences** - Get notification preferences
- **Update Notification Preferences** - Update notification preferences

### 🔍 Search Service
- **Search Providers** - Search for healthcare providers
- **Search Appointments** - Search for available appointments
- **Search Clinical Records** - Search clinical records
- **Get Autocomplete Suggestions** - Get autocomplete suggestions

### 📹 Video Service
- **Create Video Session** - Create new video session
- **Join Video Session** - Join existing video session
- **Get Video Sessions** - Get video sessions for current user

### 📊 Analytics Service
- **Track Event** - Track analytics event
- **Get Metrics** - Get analytics metrics (admin/doctor only)
- **Create Dashboard** - Create analytics dashboard (admin/doctor only)

### 🏥 Health Checks
- **API Gateway Health** - Check API Gateway health
- **Auth Service Health** - Check Auth Service health
- **All Services Health** - Check health of all services

## 🔧 Features

### ✅ Automatic Token Management
- Login requests automatically save JWT tokens
- All authenticated requests use saved tokens
- No manual token copying required

### ✅ Pre-configured Test Data
- Sample user IDs, appointment IDs, and other test data
- Realistic request bodies with proper data types
- Environment variables for easy customization

### ✅ Role-based Testing
- Different login options for admin, doctor, and patient roles
- Role-specific endpoints and permissions
- Easy switching between user types

### ✅ Comprehensive Coverage
- All microservice endpoints included
- Health check endpoints for monitoring
- Error handling examples

## 🧪 Testing Workflow

### 1. Authentication Flow
```
1. Run "Admin Login" → Token saved automatically
2. Run "Get Profile" → Verify authentication works
3. Run other authenticated requests → All use saved token
```

### 2. Complete User Journey
```
1. Admin Login
2. Create Appointment
3. Create Medical Record
4. Create Prescription
5. Send Notification
6. Track Analytics Event
```

### 3. Service Integration Testing
```
1. Health Checks → Verify all services are running
2. Cross-service requests → Test service communication
3. Error scenarios → Test error handling
```

## 🔍 Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `baseUrl` | API Gateway URL | `http://localhost:3000` |
| `authToken` | JWT token (auto-populated) | `eyJhbGciOiJIUzI1NiIs...` |
| `userId` | Current user ID (auto-populated) | `550e8400-e29b-41d4-a716-446655440001` |
| `patientId` | Test patient ID | `550e8400-e29b-41d4-a716-446655440003` |
| `providerId` | Test provider ID | `550e8400-e29b-41d4-a716-446655440002` |
| `adminEmail` | Admin email | `admin@healthcare.com` |
| `adminPassword` | Admin password | `Admin@123456` |

## 🚨 Troubleshooting

### Common Issues

**1. 401 Unauthorized Errors**
- Ensure you've run a login request first
- Check that the token is saved in environment variables
- Verify JWT_SECRET is consistent across all services

**2. 404 Not Found Errors**
- Ensure all services are running (`npm run start:dev`)
- Check service ports in environment variables
- Verify API Gateway is routing correctly

**3. 500 Internal Server Errors**
- Check service logs for detailed error messages
- Ensure databases are running and accessible
- Verify environment variables are set correctly

**4. Connection Refused**
- Start infrastructure services: `npm run start:infrastructure`
- Check if ports are available and not in use
- Verify Docker containers are running

### Debug Steps
1. Run health check requests first
2. Check individual service health endpoints
3. Verify environment variables are set
4. Check service logs for errors
5. Ensure all dependencies are installed

## 📊 Service Status

| Service | Port | Status | Health Check |
|---------|------|--------|--------------|
| API Gateway | 3000 | ✅ Running | `/health` |
| Auth Service | 3001 | ✅ Running | `/health` |
| User Service | 3002 | ✅ Running | `/health` |
| Appointment Service | 3003 | ✅ Running | `/health` |
| Clinical Service | 3004 | ✅ Running | `/health` |
| Notification Service | 3006 | ✅ Running | `/health` |
| Search Service | 3007 | ✅ Running | `/health` |
| Video Service | 3008 | ✅ Running | `/health` |
| Analytics Service | 3009 | ✅ Running | `/health` |

## 🔗 Online Collection

**Collection**: [Kiorex Healthcare Platform API Collection](https://www.postman.com/kiorex-healthcare/workspace/kiorex-healthcare-platform/collection/kiorex-healthcare-api-collection)

## 📝 Notes

- All requests include proper JWT authentication headers
- Test data is pre-configured for immediate testing
- Environment variables are automatically managed
- Collection is updated with latest service endpoints
- Includes comprehensive error handling examples

## 🆘 Support

For issues or questions:
1. Check service logs for detailed error messages
2. Verify all services are running and healthy
3. Ensure environment variables are correctly set
4. Review the main README.md for setup instructions