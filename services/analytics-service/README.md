# Analytics Service

This service handles analytics and reporting for the healthcare platform.

## Features

- Event tracking
- Metrics collection
- Dashboard management
- Data visualization

## Database Access

To access the analytics service database directly:

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d analytics_db

# Using Docker
docker exec -it healthcare-postgres psql -U postgres -d analytics_db

# Connection string
postgresql://postgres:postgres123@localhost:5432/analytics_db
```

### Database Tables
- `metrics` - Analytics metrics
- `analytics_events` - Event tracking data
- `analytics_dashboards` - Dashboard configurations

### Elasticsearch Access
```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# List analytics indices
curl http://localhost:9200/_cat/indices | grep analytics

# Query analytics data
curl -X GET "localhost:9200/analytics-events/_search?pretty"
```

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
- `ELASTICSEARCH_NODE`: Elasticsearch endpoint
- `PORT`: Service port (default: 3010)

## API Endpoints

- `POST /analytics/events` - Track an event
- `GET /analytics/metrics` - Get metrics
- `POST /analytics/dashboards` - Create a dashboard

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