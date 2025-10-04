-- Connect to notification_db and seed data
\c notification_db;

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Seed Notifications
INSERT INTO notifications (id, "userId", type, title, body, data, status, "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440003', 'appointment', 'Appointment Reminder', 'Your appointment is tomorrow at 10 AM.', '{"appointmentId": "some-uuid"}', 'sent', NOW(), NOW()),
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440003', 'reminder', 'Prescription Ready', 'Your prescription is ready for pickup.', '{"prescriptionId": "some-uuid"}', 'sent', NOW(), NOW()),
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440002', 'system', 'Lab Results Available', 'Your lab results are now available.', '{"labResultId": "some-uuid"}', 'sent', NOW(), NOW());

-- Seed NotificationPreferences
INSERT INTO notification_preferences (id, "userId", enabled, email, sms, push, "inApp", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440003', TRUE, TRUE, FALSE, TRUE, TRUE, NOW(), NOW()),
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440002', TRUE, TRUE, TRUE, TRUE, TRUE, NOW(), NOW()),
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', TRUE, TRUE, FALSE, TRUE, TRUE, NOW(), NOW());

-- Seed NotificationTemplates
INSERT INTO notification_templates (id, name, "displayName", type, subject, content, "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'appointment_reminder_email', 'Appointment Reminder Email', 'email', 'Your Upcoming Appointment', 'Dear {{name}}, your appointment is scheduled for {{date}} at {{time}}.', NOW(), NOW()),
(uuid_generate_v4(), 'prescription_ready_sms', 'Prescription Ready SMS', 'sms', 'Prescription Ready', 'Your prescription is ready for pickup at {{pharmacy}}.', NOW(), NOW()),
(uuid_generate_v4(), 'lab_results_push', 'Lab Results Push Notification', 'push', 'Lab Results Available', 'Your {{testName}} results are now available in your patient portal.', NOW(), NOW());

-- Seed NotificationLogs
INSERT INTO notification_logs (id, "notificationId", "userId", channel, type, "createdAt") VALUES
(uuid_generate_v4(), (SELECT id FROM notifications WHERE type = 'appointment' LIMIT 1), '550e8400-e29b-41d4-a716-446655440003', 'email', 'sent', NOW()),
(uuid_generate_v4(), (SELECT id FROM notifications WHERE type = 'reminder' LIMIT 1), '550e8400-e29b-41d4-a716-446655440003', 'sms', 'sent', NOW()),
(uuid_generate_v4(), (SELECT id FROM notifications WHERE type = 'system' LIMIT 1), '550e8400-e29b-41d4-a716-446655440002', 'push', 'sent', NOW());

-- Connect back to postgres database
\c postgres;
SELECT 'Notification database seeding completed successfully!' AS status;
