# Appointment Service

A comprehensive appointment management microservice for the Kiorex healthcare platform.

## Features

- **Appointment Management**: Create, update, reschedule, and cancel appointments
- **Slot Management**: Dynamic slot creation and availability checking
- **Waitlist Management**: Automatic processing when slots become available
- **Reminder System**: Automated reminders via queue processing
- **Conflict Resolution**: Prevents double-booking and manages scheduling conflicts
- **Video Integration**: Support for telehealth appointments
- **Payment Integration**: Handles consultation fees and refunds
- **Analytics**: No-show tracking, appointment history, provider schedules
- **Real-time Updates**: Kafka events for all major actions
- **Caching**: Redis caching for performance optimization

## API Endpoints

### Appointments
- `POST /appointments` - Create appointment
- `GET /appointments` - List appointments with filters
- `GET /appointments/upcoming` - Get upcoming appointments
- `GET /appointments/history` - Get appointment history
- `GET /appointments/:id` - Get appointment by ID
- `PUT /appointments/:id` - Update appointment
- `POST /appointments/:id/reschedule` - Reschedule appointment
- `POST /appointments/:id/cancel` - Cancel appointment
- `POST /appointments/:id/check-in` - Check in for appointment
- `POST /appointments/:id/start` - Start appointment
- `POST /appointments/:id/complete` - Complete appointment
- `POST /appointments/:id/no-show` - Mark as no-show

### Slots
- `POST /slots` - Create slot
- `POST /slots/bulk` - Create multiple slots
- `GET /slots/available` - Get available slots
- `POST /slots/block` - Block slots
- `PUT /slots/:id/release` - Release slot
- `GET /slots/schedule/:providerId` - Get provider schedule

### Waitlist
- `POST /waitlist` - Join waitlist
- `GET /waitlist` - Get waitlist entries
- `POST /waitlist/:id/offer` - Offer slot to waitlist entry
- `POST /waitlist/:id/accept` - Accept offered slot
- `POST /waitlist/:id/decline` - Decline offered slot

## Environment Variables

See `.env.example` for required environment variables.

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
docker build -t appointment-service .

# Run container
docker run -p 3005:3005 appointment-service
```
