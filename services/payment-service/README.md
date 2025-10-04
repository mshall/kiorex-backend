# Payment Service

Payment processing service for the Kiorex Healthcare Platform.

## Features

- **Payment Processing**: Create and process payments using Stripe
- **Payment Methods**: Manage saved payment methods
- **Refunds**: Process refunds for completed payments
- **Multi-currency Support**: Support for various currencies
- **JWT Authentication**: Secure API endpoints
- **Audit Trail**: Complete payment history and tracking

## API Endpoints

### Payments
- `POST /payments` - Create a new payment
- `POST /payments/:id/confirm` - Confirm a payment
- `GET /payments` - Get user's payments
- `GET /payments/:id` - Get specific payment
- `GET /payments/appointment/:appointmentId` - Get payments for appointment

### Refunds
- `POST /payments/refunds` - Create a refund
- `GET /payments/refunds` - Get user's refunds
- `GET /payments/refunds/:paymentId` - Get refunds for payment

### Payment Methods
- `POST /payments/payment-methods` - Add payment method
- `GET /payments/payment-methods` - Get user's payment methods
- `PUT /payments/payment-methods/:id/default` - Set default payment method
- `DELETE /payments/payment-methods/:id` - Delete payment method

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=payments_db

# JWT Configuration
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

# Service Configuration
PORT=3004
NODE_ENV=development

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

## Database Access

**Connection Details:**
- **Host**: localhost
- **Port**: 5432
- **Database**: payments_db
- **Username**: postgres
- **Password**: postgres123

**Connection String:**
```
postgresql://postgres:postgres123@localhost:5432/payments_db
```

## Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Build for production
npm run build
npm run start:prod
```

## Testing

```bash
# Run tests
npm test

# Run e2e tests
npm run test:e2e
```
