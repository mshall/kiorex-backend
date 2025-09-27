# API Gateway

This service acts as the central entry point for all client requests to the Kiorex Healthcare Platform microservices.

## Features

- **Request Routing**: Routes requests to appropriate microservices
- **Load Balancing**: Distributes load across service instances
- **Circuit Breaker**: Prevents cascading failures
- **Rate Limiting**: Protects against abuse and DoS attacks
- **Authentication**: JWT token validation and user context
- **Caching**: Redis-based response caching
- **Monitoring**: Request/response metrics and health checks
- **Security**: CORS, Helmet, and API key validation

## Architecture

```
Client Request → API Gateway → Microservice
                     ↓
                [Load Balancer]
                     ↓
                [Circuit Breaker]
                     ↓
                [Rate Limiter]
                     ↓
                [Auth Guard]
                     ↓
                [Proxy Service]
```

## API Endpoints

### Health Endpoints
- `GET /health` - Overall health status
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

### Service Proxies
- `ALL /auth/*` → Auth Service (port 3001)
- `ALL /users/*` → User Service (port 3002)
- `ALL /appointments/*` → Appointment Service (port 3005)
- `ALL /payments/*` → Payment Service (port 3004)
- `ALL /clinical/*` → Clinical Service (port 3006)
- `ALL /notifications/*` → Notification Service (port 3007)
- `ALL /search/*` → Search Service (port 3008)
- `ALL /video/*` → Video Service (port 3009)
- `ALL /analytics/*` → Analytics Service (port 3010)

## Configuration

### Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Gateway port (default: 3000)
- `REDIS_HOST`: Redis host for caching
- `REDIS_PORT`: Redis port
- `REDIS_PASSWORD`: Redis password
- `JWT_SECRET`: JWT secret for token validation
- `JWT_EXPIRES_IN`: JWT expiration time
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `VALID_API_KEYS`: Comma-separated list of valid API keys

### Rate Limiting

Different endpoints have different rate limits:

- **Default**: 100 requests per minute
- **Auth Login**: 5 requests per 15 minutes
- **Payments**: 30 requests per minute
- **Search**: 200 requests per minute
- **Video**: 10 requests per minute

### Circuit Breaker

- **Failure Threshold**: 5 consecutive failures
- **Success Threshold**: 3 consecutive successes (half-open state)
- **Timeout Duration**: 60 seconds

## Security Features

### Authentication
- JWT token validation
- User context extraction
- Role-based access control

### Rate Limiting
- Per-user/IP rate limiting
- Different limits per endpoint
- Redis-based tracking

### CORS
- Configurable allowed origins
- Credential support
- Preflight handling

### API Keys
- Optional API key validation
- Configurable valid keys
- Header-based authentication

## Monitoring

### Health Checks
- Service availability monitoring
- Instance health tracking
- Load balancer status

### Metrics
- Request/response times
- Error rates
- Circuit breaker status
- Cache hit/miss ratios

### Logging
- Request/response logging
- Error tracking
- Performance metrics

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Build for production
npm run build
npm run start:prod
```

### Docker

```bash
# Build image
docker build -t api-gateway .

# Run container
docker run -p 3000:3000 api-gateway
```

### Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
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

## Troubleshooting

### Common Issues

1. **Service Unavailable**: Check if target service is running
2. **Rate Limited**: Wait for rate limit window to reset
3. **Circuit Breaker Open**: Service is temporarily unavailable
4. **Authentication Failed**: Check JWT token validity

### Debug Mode

Set `NODE_ENV=development` for detailed logging and error messages.

### Health Check

```bash
# Check gateway health
curl http://localhost:3000/health

# Check specific service
curl http://localhost:3000/health/ready
```

## Performance

### Caching
- GET requests are cached for 60 seconds
- Cacheable endpoints: `/users/profile`, `/appointments/available`, `/search`
- Redis-based distributed caching

### Load Balancing
- Round-robin selection
- Health-based filtering
- Load-aware distribution

### Circuit Breaker
- Prevents cascading failures
- Automatic recovery
- Configurable thresholds
