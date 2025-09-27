# Notification Service

This service handles notifications for the healthcare platform.

## Features

- Email notifications
- SMS notifications
- Push notifications
- In-app notifications
- Notification templates
- Notification preferences

## Database Access

To access the notification service database directly:

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d notifications_db

# Using Docker
docker exec -it healthcare-postgres psql -U postgres -d notifications_db

# Connection string
postgresql://postgres:postgres123@localhost:5432/notifications_db
```

### Database Tables
- `notifications` - Notification records
- `notification_templates` - Email/SMS templates
- `notification_preferences` - User preferences
- `notification_logs` - Delivery logs

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
- `SENDGRID_API_KEY`: SendGrid API key
- `TWILIO_ACCOUNT_SID`: Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Twilio Auth Token
- `TWILIO_PHONE_NUMBER`: Twilio phone number
- `PORT`: Service port (default: 3007)

## API Endpoints

- `POST /notifications` - Send notification
- `GET /notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark as read
- `GET /notifications/templates` - Get templates
- `POST /notifications/templates` - Create template

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
