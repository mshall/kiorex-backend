# 🔍 Search Service

## Description

The Search Service is a comprehensive search and discovery microservice for the Kiorex Healthcare Platform. It provides full-text search capabilities, advanced filtering, faceted search, and intelligent search suggestions for patients, healthcare providers, medical records, appointments, and all healthcare-related content.

## Use Cases & Features

### Full-Text Search
- **Patient Search**: Advanced patient search with multiple criteria
- **Provider Search**: Healthcare provider search and discovery
- **Medical Records Search**: Comprehensive medical records search
- **Appointment Search**: Appointment history and scheduling search
- **Content Search**: General healthcare content and documentation search

### Advanced Search Features
- **Faceted Search**: Multi-dimensional search with filters and facets
- **Fuzzy Search**: Intelligent fuzzy matching for typos and variations
- **Autocomplete**: Real-time search suggestions and autocomplete
- **Search Analytics**: Search behavior analytics and optimization
- **Search Personalization**: Personalized search results based on user preferences

### Healthcare-Specific Search
- **Medical Terminology**: Medical terminology and coding search
- **Drug Search**: Medication and prescription search
- **Symptom Search**: Symptom and condition search
- **Treatment Search**: Treatment and procedure search
- **Insurance Search**: Insurance provider and coverage search

### Search Intelligence
- **Search Ranking**: Intelligent search result ranking
- **Relevance Scoring**: Advanced relevance scoring algorithms
- **Search Suggestions**: Smart search suggestions and recommendations
- **Trending Searches**: Popular and trending search terms
- **Search History**: User search history and preferences

## API Endpoints

### General Search
- `GET /search` - General search across all content
- `GET /search/patients` - Search patients
- `GET /search/providers` - Search healthcare providers
- `GET /search/medical-records` - Search medical records
- `GET /search/appointments` - Search appointments
- `GET /search/medications` - Search medications

### Advanced Search
- `POST /search/advanced` - Advanced search with complex queries
- `GET /search/suggestions` - Get search suggestions
- `GET /search/autocomplete` - Get autocomplete suggestions
- `POST /search/filters` - Apply search filters
- `GET /search/facets` - Get search facets and filters

### Search Analytics
- `GET /search/analytics` - Get search analytics
- `GET /search/trending` - Get trending search terms
- `GET /search/popular` - Get popular search terms
- `GET /search/history/:userId` - Get user search history
- `DELETE /search/history/:userId` - Clear user search history

### Search Configuration
- `GET /search/config` - Get search configuration
- `PUT /search/config` - Update search configuration
- `GET /search/indexes` - Get search indexes
- `POST /search/indexes/rebuild` - Rebuild search indexes
- `GET /search/indexes/status` - Get index status

### Search Performance
- `GET /search/performance` - Get search performance metrics
- `GET /search/optimization` - Get search optimization suggestions
- `POST /search/optimize` - Optimize search performance
- `GET /search/cache` - Get search cache statistics
- `POST /search/cache/clear` - Clear search cache

### Health & Monitoring
- `GET /search/health` - Service health check
- `GET /search/metrics` - Search service metrics

## Installation & Setup Guide

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 15+
- Redis 7+
- Elasticsearch 8+

### Local Development Setup

1. **Navigate to service directory**
   ```bash
   cd services/search-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3008
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=search_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   ELASTICSEARCH_URL=http://localhost:9200
   ELASTICSEARCH_USERNAME=elastic
   ELASTICSEARCH_PASSWORD=elastic
   SEARCH_INDEX_PREFIX=healthcare
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run migration:run
   
   # Seed initial data
   npm run seed:run
   ```

5. **Elasticsearch Setup**
   ```bash
   # Create search indexes
   npm run search:create-indexes
   
   # Index initial data
   npm run search:index-data
   ```

6. **Start the service**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

### Docker Setup

1. **Build Docker image**
   ```bash
   docker build -t healthcare-search-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up search-service
   ```

### Database Schema

#### Search Indexes Table
```sql
CREATE TABLE search_indexes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index_name VARCHAR(100) NOT NULL,
  index_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  document_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Search Queries Table
```sql
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  query_text TEXT NOT NULL,
  filters JSONB,
  results_count INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Search Analytics Table
```sql
CREATE TABLE search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  search_count INTEGER DEFAULT 1,
  last_searched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success_rate DECIMAL(5,2),
  average_response_time INTEGER
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /search/health`
- **Response**: Service status, database connectivity, Redis status, Elasticsearch connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Search query performance and response times
- Search result relevance and accuracy
- Index size and document counts
- Search volume and user engagement
- Elasticsearch cluster health and performance

### Logging
- Search query execution and performance
- Index updates and synchronization
- Search result relevance and user feedback
- Elasticsearch cluster events
- Search optimization and tuning activities

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to search data
- **Audit Logging**: Complete search audit trails
- **Data Encryption**: Encrypted storage of sensitive data
- **Secure Transmission**: TLS encryption for all communications

### Search Security
- **Query Security**: Secure handling of search queries
- **Result Security**: Secure search result delivery
- **Index Security**: Secure search index management
- **Access Logging**: Complete search access logging
- **Data Masking**: Sensitive data masking in search results

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Search Features
- **AI-Powered Search**: Machine learning for intelligent search
- **Natural Language Processing**: NLP for natural language queries
- **Voice Search**: Voice-based search capabilities
- **Image Search**: Medical image search and recognition
- **Semantic Search**: Semantic search with medical ontologies

### Healthcare-Specific Enhancements
- **Medical Ontology**: Integration with medical ontologies and terminologies
- **Clinical Decision Support**: Search-based clinical decision support
- **Drug Interaction Search**: Advanced drug interaction search
- **Symptom Checker**: AI-powered symptom checker and diagnosis
- **Medical Literature Search**: Medical literature and research search

### Search Intelligence
- **Personalization**: Advanced search personalization
- **Recommendations**: Intelligent search recommendations
- **Trend Analysis**: Search trend analysis and insights
- **Predictive Search**: Predictive search capabilities
- **Search Optimization**: Automated search optimization

### Integration Capabilities
- **EHR Integration**: Electronic Health Records integration
- **Clinical Systems**: Integration with clinical systems
- **Medical Databases**: Integration with medical databases
- **Research Platforms**: Integration with research platforms
- **External APIs**: Integration with external healthcare APIs

### Performance & Scalability
- **Search Optimization**: Advanced search performance optimization
- **Caching Strategy**: Intelligent search result caching
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for search
- **Microservice Architecture**: Enhanced microservice communication

### Analytics & Reporting
- **Search Analytics**: Comprehensive search analytics and reporting
- **User Behavior**: User search behavior analysis
- **Performance Metrics**: Advanced search performance metrics
- **Optimization Insights**: Search optimization insights and recommendations
- **Business Intelligence**: Search-based business intelligence

## Dependencies

### Core Dependencies
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common NestJS utilities
- `@nestjs/typeorm` - TypeORM integration
- `@nestjs/jwt` - JWT token handling
- `@nestjs/passport` - Passport.js integration
- `passport-jwt` - JWT strategy for Passport
- `class-validator` - DTO validation
- `class-transformer` - Object transformation

### Search Dependencies
- `@elastic/elasticsearch` - Elasticsearch client
- `elasticsearch` - Elasticsearch client (legacy)
- `fuse.js` - Fuzzy search library
- `lunr` - Full-text search engine

### Database Dependencies
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `redis` - Redis client for caching

### Development Dependencies
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing
- `@types/elasticsearch` - TypeScript types

## Contact & Support

- **Service Owner**: Search Team
- **Documentation**: [Search Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*