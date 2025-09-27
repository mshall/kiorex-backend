# User Service

This service handles user management for the healthcare platform.

## Features

- User profile management
- User registration and onboarding
- Profile picture uploads
- User preferences
- User search and filtering
- Role management
- User activity tracking

## Database Access

To access the user service database directly:

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d users_db

# Using Docker
docker exec -it healthcare-postgres psql -U postgres -d users_db

# Connection string
postgresql://postgres:postgres123@localhost:5432/users_db
```

### Database Tables
- `users` - User profiles and information
- `user_profiles` - Extended user profile data
- `user_preferences` - User settings and preferences
- `user_roles` - User role assignments
- `user_activities` - User activity logs

## Environment Variables

- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `KAFKA_BROKERS` - Kafka broker URLs
- `MINIO_ENDPOINT` - MinIO endpoint for file storage
- `MINIO_PORT` - MinIO port
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key
- `PORT` - Service port (default: 3002)

## API Endpoints

- `POST /users` - Create user
- `GET /users` - List users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/upload-avatar` - Upload profile picture
- `GET /users/search` - Search users
- `PUT /users/:id/preferences` - Update user preferences

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
docker build -t user-service .

# Run container
docker run -p 3002:3002 user-service
```

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