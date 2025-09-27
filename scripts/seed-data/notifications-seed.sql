-- Notification Service Seed Data
-- Database: notifications_db

-- Insert notification templates
INSERT INTO notification_templates (id, name, type, subject, content, variables, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Appointment Confirmation', 'email', 'Appointment Confirmed - {{appointment_date}}', 'Dear {{patient_name}},\n\nYour appointment with Dr. {{doctor_name}} has been confirmed for {{appointment_date}} at {{appointment_time}}.\n\nPlease arrive 15 minutes early.\n\nBest regards,\nKiorex Healthcare Team', '["patient_name", "doctor_name", "appointment_date", "appointment_time"]', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Appointment Reminder', 'sms', 'Reminder: Appointment tomorrow at {{appointment_time}}', 'Hi {{patient_name}}, this is a reminder that you have an appointment with Dr. {{doctor_name}} tomorrow at {{appointment_time}}. Please arrive 15 minutes early.', '["patient_name", "doctor_name", "appointment_time"]', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Prescription Ready', 'push', 'Prescription Ready for Pickup', 'Your prescription for {{medication_name}} is ready for pickup at {{pharmacy_name}}.', '["medication_name", "pharmacy_name"]', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Lab Results Available', 'email', 'Lab Results Available', 'Dear {{patient_name}},\n\nYour lab results from {{test_date}} are now available in your patient portal.\n\nPlease log in to view your results.\n\nBest regards,\nKiorex Healthcare Team', '["patient_name", "test_date"]', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Payment Due', 'email', 'Payment Due for Services', 'Dear {{patient_name}},\n\nYou have a payment of ${{amount}} due for services rendered on {{service_date}}.\n\nPlease log in to your account to make payment.\n\nBest regards,\nKiorex Healthcare Team', '["patient_name", "amount", "service_date"]', true, NOW(), NOW());

-- Insert notification preferences
INSERT INTO notification_preferences (id, user_id, notification_type, email_enabled, sms_enabled, push_enabled, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'appointment_reminder', true, true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', 'appointment_reminder', true, false, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440003', 'appointment_reminder', true, true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440003', 'lab_results', true, false, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440003', 'prescription_ready', false, true, true, NOW(), NOW());

-- Insert sample notifications
INSERT INTO notifications (id, user_id, type, title, message, data, status, sent_at, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440003', 'appointment_confirmation', 'Appointment Confirmed', 'Your appointment with Dr. Smith has been confirmed for tomorrow at 11:00 AM', '{"appointment_id": "550e8400-e29b-41d4-a716-446655440201", "doctor_name": "Dr. Smith", "appointment_time": "11:00 AM"}', 'sent', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440003', 'appointment_reminder', 'Appointment Reminder', 'Reminder: You have an appointment tomorrow at 11:00 AM', '{"appointment_id": "550e8400-e29b-41d4-a716-446655440201", "appointment_time": "11:00 AM"}', 'sent', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440003', 'lab_results', 'Lab Results Available', 'Your lab results are now available in your patient portal', '{"lab_result_id": "550e8400-e29b-41d4-a716-446655440201"}', 'pending', NULL, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes'),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440003', 'prescription_ready', 'Prescription Ready', 'Your prescription for Ibuprofen is ready for pickup', '{"prescription_id": "550e8400-e29b-41d4-a716-446655440101", "medication_name": "Ibuprofen"}', 'sent', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes');

-- Insert notification logs
INSERT INTO notification_logs (id, notification_id, channel, status, error_message, sent_at, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440201', 'email', 'delivered', NULL, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440201', 'sms', 'delivered', NULL, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440202', 'email', 'delivered', NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440204', 'push', 'delivered', NULL, NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes');
