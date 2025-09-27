# Search Service

This service handles search functionality using Elasticsearch.

## Features

- Full-text search
- Faceted search
- Search suggestions
- Search analytics

## Database Access

To access the search service database directly:

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d search_db

# Using Docker
docker exec -it healthcare-postgres psql -U postgres -d search_db

# Connection string
postgresql://postgres:postgres123@localhost:5432/search_db
```

### Database Tables
- `search_queries` - Search query logs
- `search_analytics` - Search analytics data
- `search_indexes` - Index metadata

### Elasticsearch Access
```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# List indices
curl http://localhost:9200/_cat/indices

# Search documents
curl -X GET "localhost:9200/healthcare/_search?pretty"
```

## Environment Variables

- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name
- `ELASTICSEARCH_NODE`: Elasticsearch endpoint
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `REDIS_PASSWORD`: Redis password
- `KAFKA_BROKERS`: Kafka brokers
- `PORT`: Service port (default: 3008)

## API Endpoints

- `POST /search` - Perform search
- `GET /search/suggestions` - Get search suggestions
- `POST /search/index` - Index documents

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
