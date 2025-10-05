# 📹 Video Service

## Description

The Video Service is a comprehensive video conferencing and telehealth microservice for the Kiorex Healthcare Platform. It handles video consultations, virtual appointments, telemedicine sessions, video recording, and real-time communication between patients and healthcare providers using Twilio Video API integration.

## Use Cases & Features

### Video Conferencing
- **Virtual Consultations**: One-on-one video consultations between patients and providers
- **Group Sessions**: Multi-participant video sessions for care teams
- **Telemedicine**: Complete telemedicine platform with video capabilities
- **Screen Sharing**: Screen sharing for medical records and documentation
- **Recording**: Video session recording for medical records and training

### Telehealth Features
- **Appointment Integration**: Seamless integration with appointment scheduling
- **Provider Availability**: Real-time provider availability and status
- **Patient Onboarding**: Virtual patient onboarding and orientation
- **Follow-up Sessions**: Automated follow-up session scheduling
- **Emergency Consultations**: Emergency video consultation capabilities

### Video Management
- **Session Management**: Complete video session lifecycle management
- **Participant Management**: Participant invitation and management
- **Recording Management**: Video recording storage and retrieval
- **Quality Control**: Video quality monitoring and optimization
- **Bandwidth Management**: Intelligent bandwidth management and optimization

### Healthcare-Specific Features
- **HIPAA Compliance**: HIPAA-compliant video communication
- **Medical Records Integration**: Integration with patient medical records
- **Prescription Integration**: Prescription generation during video sessions
- **Clinical Notes**: Real-time clinical note-taking during sessions
- **Insurance Verification**: Pre-session insurance verification

## API Endpoints

### Video Sessions
- `GET /video/sessions` - Get all video sessions
- `GET /video/sessions/:id` - Get specific video session
- `POST /video/sessions` - Create new video session
- `PUT /video/sessions/:id` - Update video session
- `DELETE /video/sessions/:id` - End video session
- `POST /video/sessions/:id/join` - Join video session

### Session Management
- `POST /video/sessions/:id/invite` - Invite participants to session
- `DELETE /video/sessions/:id/participants/:participantId` - Remove participant
- `GET /video/sessions/:id/participants` - Get session participants
- `POST /video/sessions/:id/start` - Start video session
- `POST /video/sessions/:id/end` - End video session

### Recording Management
- `GET /video/recordings` - Get all video recordings
- `GET /video/recordings/:id` - Get specific recording
- `POST /video/sessions/:id/start-recording` - Start session recording
- `POST /video/sessions/:id/stop-recording` - Stop session recording
- `GET /video/recordings/:id/download` - Download video recording
- `DELETE /video/recordings/:id` - Delete video recording

### Provider Management
- `GET /video/providers` - Get all video-enabled providers
- `GET /video/providers/:id/availability` - Get provider availability
- `POST /video/providers/:id/availability` - Set provider availability
- `GET /video/providers/:id/sessions` - Get provider video sessions
- `POST /video/providers/:id/status` - Update provider status

### Patient Management
- `GET /video/patients/:id/sessions` - Get patient video sessions
- `POST /video/patients/:id/join-session` - Patient join session
- `GET /video/patients/:id/history` - Get patient video history
- `POST /video/patients/:id/feedback` - Submit session feedback

### Telehealth Features
- `POST /video/telehealth/consultation` - Start telehealth consultation
- `GET /video/telehealth/consultations` - Get telehealth consultations
- `POST /video/telehealth/consultations/:id/prescription` - Generate prescription
- `POST /video/telehealth/consultations/:id/notes` - Add clinical notes
- `GET /video/telehealth/consultations/:id/summary` - Get consultation summary

### Quality & Performance
- `GET /video/quality/metrics` - Get video quality metrics
- `GET /video/performance/stats` - Get performance statistics
- `POST /video/quality/optimize` - Optimize video quality
- `GET /video/bandwidth/usage` - Get bandwidth usage statistics

### Health & Monitoring
- `GET /video/health` - Service health check
- `GET /video/metrics` - Video service metrics

## Installation & Setup Guide

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 15+
- Redis 7+
- Twilio Account (for video services)

### Local Development Setup

1. **Navigate to service directory**
   ```bash
   cd services/video-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with required variables:
   ```env
   NODE_ENV=development
   PORT=3009
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_DATABASE=video_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis123
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_API_KEY=your_twilio_api_key
   TWILIO_API_SECRET=your_twilio_api_secret
   TWILIO_VIDEO_SERVICE_SID=your_video_service_sid
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run migration:run
   
   # Seed initial data
   npm run seed:run
   ```

5. **Start the service**
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
   docker build -t healthcare-video-service .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up video-service
   ```

### Database Schema

#### Video Sessions Table
```sql
CREATE TABLE video_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_sid VARCHAR(100) UNIQUE NOT NULL,
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  appointment_id UUID,
  status VARCHAR(20) NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  quality_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Video Recordings Table
```sql
CREATE TABLE video_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES video_sessions(id),
  recording_sid VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  download_url VARCHAR(500),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Video Participants Table
```sql
CREATE TABLE video_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES video_sessions(id),
  user_id UUID NOT NULL,
  participant_sid VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  joined_at TIMESTAMP,
  left_at TIMESTAMP,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Health Checks

### Health Endpoint
- **URL**: `GET /video/health`
- **Response**: Service status, database connectivity, Redis status, Twilio connectivity
- **Monitoring**: Prometheus metrics available at `/metrics`

### Key Metrics
- Video session success rates
- Average session duration
- Video quality metrics
- Bandwidth usage and optimization
- Recording storage and retrieval

### Logging
- Video session creation and management
- Participant join/leave events
- Recording start/stop events
- Quality metrics and performance
- Telehealth consultation activities

## Security Considerations

### Data Protection
- **HIPAA Compliance**: Protected health information (PHI) security
- **Access Control**: Role-based access to video data
- **Audit Logging**: Complete video session audit trails
- **Data Encryption**: Encrypted storage of sensitive data
- **Secure Transmission**: TLS encryption for all communications

### Video Security
- **Session Security**: Secure video session management
- **Recording Security**: Secure video recording storage
- **Access Control**: Secure access to video recordings
- **Privacy Protection**: Patient privacy in video sessions
- **Compliance Monitoring**: Real-time compliance monitoring

### API Security
- **Authentication**: JWT token validation for all endpoints
- **Authorization**: Role-based endpoint access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper CORS configuration for web clients

## Future Enhancement Opportunities

### Advanced Video Features
- **AI-Powered Analysis**: AI analysis of video sessions for quality improvement
- **Real-Time Translation**: Real-time language translation for international patients
- **Accessibility Features**: Enhanced accessibility features for patients with disabilities
- **Mobile Optimization**: Advanced mobile video capabilities
- **VR/AR Integration**: Virtual and augmented reality integration

### Telehealth Enhancements
- **Remote Monitoring**: Integration with remote patient monitoring devices
- **Digital Therapeutics**: Integration with digital therapeutics platforms
- **Clinical Decision Support**: Real-time clinical decision support during video sessions
- **Prescription Integration**: Advanced prescription management during sessions
- **Care Coordination**: Enhanced care team coordination and communication

### Healthcare-Specific Features
- **Medical Device Integration**: Integration with medical devices during video sessions
- **Clinical Workflow**: Integration with clinical workflows and protocols
- **Insurance Integration**: Real-time insurance verification and authorization
- **Quality Assurance**: Automated quality assurance for video sessions
- **Compliance Reporting**: Automated compliance reporting and monitoring

### Integration Capabilities
- **EHR Integration**: Electronic Health Records integration
- **Practice Management**: Practice management system integration
- **Third-Party Systems**: Integration with external healthcare systems
- **API Gateway**: Enhanced API Gateway integration
- **Microservice Communication**: Improved service-to-service communication

### Performance & Scalability
- **Video Optimization**: Advanced video quality optimization
- **Bandwidth Management**: Intelligent bandwidth management
- **Load Balancing**: Horizontal scaling and load balancing
- **CDN Integration**: Content delivery network for video content
- **Caching Strategy**: Advanced caching for video data

### Analytics & Reporting
- **Video Analytics**: Comprehensive video session analytics
- **Quality Metrics**: Advanced video quality metrics and reporting
- **Usage Analytics**: Video service usage analytics and insights
- **Performance Monitoring**: Real-time performance monitoring
- **Business Intelligence**: Video-based business intelligence

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

### Video Dependencies
- `twilio` - Twilio video service
- `@twilio/video` - Twilio Video SDK
- `socket.io` - Real-time communication
- `@nestjs/websockets` - WebSocket support

### Database Dependencies
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `redis` - Redis client for caching

### Development Dependencies
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing
- `@types/socket.io` - TypeScript types

## Contact & Support

- **Service Owner**: Video Team
- **Documentation**: [Video Service Docs](./docs/)
- **API Documentation**: Available via Swagger at `/api/docs`
- **Monitoring**: Grafana dashboards available
- **Support**: Contact DevOps team for issues

---

*This service is part of the Kiorex Healthcare Platform microservices architecture.*