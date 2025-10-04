-- Seed data for payment service
-- Connect to payment_db
\c payment_db;

-- Seed Payment Methods
INSERT INTO payment_methods (id, "userId", type, "stripePaymentMethodId", last4, brand, "expMonth", "expYear", funding, "isDefault", "isActive", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'credit_card', 'pm_mock_admin_card', '4242', 'visa', 12, 2025, 'credit', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'credit_card', 'pm_mock_doctor_card', '5555', 'mastercard', 10, 2026, 'credit', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'debit_card', 'pm_mock_patient_card', '1234', 'visa', 8, 2024, 'debit', true, true, NOW(), NOW());

-- Seed Payments
INSERT INTO payments (id, "userId", "appointmentId", "providerId", amount, currency, status, "paymentMethod", "stripePaymentIntentId", "stripeChargeId", "transactionId", description, "processedAt", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 150.00, 'USD', 'completed', 'credit_card', 'pi_mock_payment_intent_1', 'ch_mock_charge_1', 'txn_mock_1', 'Consultation fee', NOW(), NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 200.00, 'USD', 'completed', 'credit_card', 'pi_mock_payment_intent_2', 'ch_mock_charge_2', 'txn_mock_2', 'Follow-up appointment', NOW(), NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 75.00, 'USD', 'pending', 'credit_card', 'pi_mock_payment_intent_3', NULL, NULL, 'Lab test fee', NULL, NOW(), NOW());

-- Seed Refunds
INSERT INTO refunds (id, "paymentId", "userId", amount, currency, status, "stripeRefundId", reason, description, "processedAt", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 50.00, 'USD', 'succeeded', 're_mock_refund_1', 'requested_by_customer', 'Partial refund for cancelled service', NOW(), NOW(), NOW());

-- Return to default database
\c postgres;
