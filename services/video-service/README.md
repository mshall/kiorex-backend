# Video Service

This service handles video conferencing functionality using Twilio Video.

## Features

- Video session management
- Participant management
- Room creation and management
- Recording capabilities

## Database Access

To access the video service database directly:

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d video_db

# Using Docker
docker exec -it healthcare-postgres psql -U postgres -d video_db

# Connection string
postgresql://postgres:postgres123@localhost:5432/video_db
```

### Database Tables
- `video_sessions` - Video session records
- `video_participants` - Session participants
- `video_recordings` - Recording metadata

## Environment Variables

- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `REDIS_PASSWORD`: Redis password
- `KAFKA_BROKERS`: Kafka brokers
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRES_IN`: JWT expiration time
- `TWILIO_ACCOUNT_SID`: Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Twilio Auth Token
- `PORT`: Service port (default: 3009)

## API Endpoints

- `POST /video/sessions` - Create a video session
- `POST /video/sessions/:id/join` - Join a video session

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
