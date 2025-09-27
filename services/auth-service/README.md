# Auth Service

This service handles authentication and authorization for the healthcare platform.

## Features

- User authentication (login/logout)
- JWT token management
- Multi-factor authentication (MFA)
- Password reset functionality
- Session management
- Role-based access control
- Login history tracking

## Database Access

To access the auth service database directly:

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d auth_db

# Using Docker
docker exec -it healthcare-postgres psql -U postgres -d auth_db

# Connection string
postgresql://postgres:postgres123@localhost:5432/auth_db
```

### Database Tables
- `user_auth` - User authentication data
- `refresh_tokens` - JWT refresh tokens
- `mfa_secrets` - Multi-factor authentication secrets
- `login_history` - User login history

## Environment Variables

- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `KAFKA_BROKERS` - Kafka broker URLs
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRATION` - JWT expiration time
- `JWT_REFRESH_SECRET` - JWT refresh secret key
- `JWT_REFRESH_EXPIRATION` - JWT refresh expiration time
- `PORT` - Service port (default: 3001)

## API Endpoints

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email address
- `POST /auth/mfa/setup` - Setup MFA
- `POST /auth/mfa/verify` - Verify MFA code

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
docker build -t auth-service .

# Run container
docker run -p 3001:3001 auth-service
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