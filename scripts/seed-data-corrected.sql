-- Corrected seed data for all Kiorex Healthcare Platform databases
-- This script populates all databases with realistic test data using correct column names

-- ==============================================
-- AUTH DATABASE SEED DATA
-- ==============================================
\c auth_db;

-- Insert user authentication data (using correct column names)
INSERT INTO user_auth (id, email, password, role, provider, email_verified, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@healthcare.com', '$2b$10$196rK.WYgl9/hlKeR//H3uw5PcieLfp.fLk6Daz7t9kiPLfQRAutK', 'super_admin', 'local', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'doctor1@healthcare.com', '$2b$10$196rK.WYgl9/hlKeR//H3uw5PcieLfp.fLk6Daz7t9kiPLfQRAutK', 'doctor', 'local', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'patient1@healthcare.com', '$2b$10$196rK.WYgl9/hlKeR//H3uw5PcieLfp.fLk6Daz7t9kiPLfQRAutK', 'patient', 'local', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'nurse1@healthcare.com', '$2b$10$196rK.WYgl9/hlKeR//H3uw5PcieLfp.fLk6Daz7t9kiPLfQRAutK', 'nurse', 'local', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'receptionist1@healthcare.com', '$2b$10$196rK.WYgl9/hlKeR//H3uw5PcieLfp.fLk6Daz7t9kiPLfQRAutK', 'receptionist', 'local', true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert MFA secrets (using correct column names)
INSERT INTO mfa_secrets (id, user_id, secret, type, created_at, updated_at) VALUES
('mfa-001', '550e8400-e29b-41d4-a716-446655440001', 'JBSWY3DPEHPK3PXP', 'totp', NOW(), NOW()),
('mfa-002', '550e8400-e29b-41d4-a716-446655440002', 'JBSWY3DPEHPK3PXP', 'totp', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert login history (using correct column names)
INSERT INTO login_history (id, user_id, ip_address, user_agent, status, created_at) VALUES
('login-001', '550e8400-e29b-41d4-a716-446655440001', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'success', NOW()),
('login-002', '550e8400-e29b-41d4-a716-446655440002', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'success', NOW()),
('login-003', '550e8400-e29b-41d4-a716-446655440003', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)', 'success', NOW())
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- USERS DATABASE SEED DATA
-- ==============================================
\c users_db;

-- Insert user profiles
INSERT INTO users (id, email, first_name, last_name, phone_number, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@healthcare.com', 'Admin', 'User', '+1-555-0001', '1980-01-01', 'other', '123 Admin St, City, State 12345', 'Emergency Contact', '+1-555-0002', 'Admin Insurance', 'ADM001'),
('550e8400-e29b-41d4-a716-446655440002', 'doctor1@healthcare.com', 'Dr. Sarah', 'Johnson', '+1-555-0101', '1975-05-15', 'female', '456 Doctor Ave, City, State 12345', 'Dr. Emergency', '+1-555-0102', 'Doctor Insurance', 'DOC001'),
('550e8400-e29b-41d4-a716-446655440003', 'patient1@healthcare.com', 'John', 'Smith', '+1-555-0201', '1990-03-20', 'male', '789 Patient St, City, State 12345', 'Jane Smith', '+1-555-0202', 'Blue Cross', 'PAT001'),
('550e8400-e29b-41d4-a716-446655440004', 'nurse1@healthcare.com', 'Nurse', 'Williams', '+1-555-0301', '1985-08-10', 'female', '321 Nurse Blvd, City, State 12345', 'Nurse Emergency', '+1-555-0302', 'Nurse Insurance', 'NUR001'),
('550e8400-e29b-41d4-a716-446655440005', 'receptionist1@healthcare.com', 'Receptionist', 'Brown', '+1-555-0401', '1988-12-05', 'female', '654 Reception Rd, City, State 12345', 'Reception Emergency', '+1-555-0402', 'Reception Insurance', 'REC001')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- APPOINTMENT DATABASE SEED DATA
-- ==============================================
\c appointment_db;

-- Insert appointments (using correct column names)
INSERT INTO appointments (id, patient_id, provider_id, consultation_type, status, start_time, end_time, reason_for_visit, symptoms, chief_complaint, vitals, notes, private_notes, video_room_url, video_room_id, consultation_fee, is_paid, payment_id, insurance_claim_id, check_in_time, actual_start_time, actual_end_time, wait_time, follow_up_required, follow_up_appointment_id, previous_appointment_id, recurring_appointment_id, metadata, cancelled_by, cancellation_reason, cancelled_at, rescheduled_to, rescheduled_from, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'in_person', 'scheduled', '2025-10-02 10:00:00', '2025-10-02 11:00:00', 'Regular checkup', 'None', 'Annual physical examination', '{"blood_pressure": "120/80", "heart_rate": 72, "temperature": 98.6}', 'Patient appears healthy, no immediate concerns', 'Internal notes for doctor', NULL, NULL, 150.00, false, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'video', 'scheduled', '2025-10-03 14:00:00', '2025-10-03 15:00:00', 'Follow-up consultation', 'Mild headache', 'Follow-up on previous treatment', '{"blood_pressure": "118/78", "heart_rate": 68}', 'Patient reports improvement, continue current medication', 'Continue current treatment plan', 'https://video.kiorex.com/room123', 'room123', 100.00, false, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, '550e8400-e29b-41d4-a716-446655440101', NULL, '{}', NULL, NULL, NULL, NULL, NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert appointment slots (using correct column names)
INSERT INTO appointment_slots (id, provider_id, start_time, end_time, status, appointment_type, created_at, updated_at) VALUES
('slot-001', '550e8400-e29b-41d4-a716-446655440002', '2025-10-02 09:00:00', '2025-10-02 10:00:00', 'available', 'consultation', NOW(), NOW()),
('slot-002', '550e8400-e29b-41d4-a716-446655440002', '2025-10-02 10:00:00', '2025-10-02 11:00:00', 'booked', 'consultation', NOW(), NOW()),
('slot-003', '550e8400-e29b-41d4-a716-446655440002', '2025-10-02 11:00:00', '2025-10-02 12:00:00', 'available', 'consultation', NOW(), NOW()),
('slot-004', '550e8400-e29b-41d4-a716-446655440002', '2025-10-03 14:00:00', '2025-10-03 15:00:00', 'booked', 'video_consultation', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert waitlist entries (using correct column names)
INSERT INTO waitlists (id, patient_id, provider_id, appointment_type, preferred_date, preferred_time, reason, status, created_at, updated_at) VALUES
('wait-001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'consultation', '2025-10-05', '10:00:00', 'Urgent consultation needed', 'waiting', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- CLINICAL DATABASE SEED DATA
-- ==============================================
\c clinical_db;

-- Insert medical records (using correct column names)
INSERT INTO medical_records (id, patient_id, provider_id, visit_date, chief_complaint, history_of_present_illness, physical_examination, assessment, plan, diagnosis_codes, procedure_codes, follow_up_instructions, created_at, updated_at) VALUES
('mr-001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2025-10-01', 'Annual physical examination', 'Patient presents for routine annual physical examination. No acute complaints.', 'Vital signs stable. Physical examination unremarkable.', 'Healthy adult male, no acute issues identified.', 'Continue current lifestyle. Schedule follow-up in 1 year.', 'Z00.00', '99213', 'Return in 1 year for annual physical', NOW(), NOW()),
('mr-002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2025-10-02', 'Follow-up consultation', 'Patient reports mild headache following previous visit.', 'Blood pressure slightly elevated. No other abnormalities noted.', 'Tension headache, likely stress-related.', 'Prescribed mild pain reliever. Follow up in 2 weeks if symptoms persist.', 'G44.2', '99213', 'Follow up in 2 weeks if headache persists', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert prescriptions (using correct column names)
INSERT INTO prescriptions (id, patient_id, provider_id, medication_name, dosage, frequency, duration, instructions, status, refills_remaining, created_at, updated_at) VALUES
('rx-001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Ibuprofen', '200mg', 'Every 6 hours as needed', '7 days', 'Take with food to avoid stomach upset', 'active', 2, NOW(), NOW()),
('rx-002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Multivitamin', '1 tablet', 'Once daily', '30 days', 'Take with breakfast', 'active', 5, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert lab results (using correct column names)
INSERT INTO lab_results (id, patient_id, provider_id, test_name, test_type, result_value, reference_range, units, status, notes, created_at, updated_at) VALUES
('lab-001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Complete Blood Count', 'CBC', 'Normal', 'Within normal limits', 'N/A', 'completed', 'All values within normal range', NOW(), NOW()),
('lab-002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Blood Glucose', 'Chemistry', '95', '70-100', 'mg/dL', 'completed', 'Normal fasting glucose level', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert clinical notes (using correct column names)
INSERT INTO clinical_notes (id, patient_id, provider_id, note_type, content, is_signed, signed_by, signed_at, created_at, updated_at) VALUES
('note-001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'progress', 'Patient reports feeling well. No new symptoms. Continue current treatment plan.', true, '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW(), NOW()),
('note-002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'assessment', 'Patient shows improvement in symptoms. Medication appears to be effective.', true, '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- NOTIFICATION DATABASE SEED DATA
-- ==============================================
\c notification_db;

-- Insert notifications (using correct column names)
INSERT INTO notifications (id, user_id, type, title, body, data, status, priority, channel, scheduled_for, created_at, updated_at) VALUES
('notif-001', '550e8400-e29b-41d4-a716-446655440003', 'appointment_reminder', 'Appointment Reminder', 'Your appointment with Dr. Johnson is scheduled for tomorrow at 10:00 AM', '{"appointment_id": "550e8400-e29b-41d4-a716-446655440101"}', 'sent', 'normal', 'email', NULL, NOW(), NOW()),
('notif-002', '550e8400-e29b-41d4-a716-446655440003', 'prescription_ready', 'Prescription Ready', 'Your prescription for Ibuprofen is ready for pickup', '{"prescription_id": "rx-001"}', 'pending', 'high', 'sms', NULL, NOW(), NOW()),
('notif-003', '550e8400-e29b-41d4-a716-446655440002', 'new_appointment', 'New Appointment', 'You have a new appointment scheduled with John Smith', '{"appointment_id": "550e8400-e29b-41d4-a716-446655440101"}', 'sent', 'normal', 'in_app', NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert notification preferences (using correct column names)
INSERT INTO notification_preferences (id, user_id, enabled, email, sms, push, in_app, appointment_reminders, prescription_updates, lab_results, emergency_alerts, marketing, created_at, updated_at) VALUES
('pref-001', '550e8400-e29b-41d4-a716-446655440003', true, true, true, true, true, true, true, true, true, false, NOW(), NOW()),
('pref-002', '550e8400-e29b-41d4-a716-446655440002', true, true, false, true, true, true, true, true, true, false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert notification templates (using correct column names)
INSERT INTO notification_templates (id, name, display_name, type, subject, content, html_content, variables, is_active, created_at, updated_at) VALUES
('template-001', 'appointment_reminder', 'Appointment Reminder', 'email', 'Appointment Reminder - {{appointment_date}}', 'Dear {{patient_name}}, your appointment with {{doctor_name}} is scheduled for {{appointment_date}} at {{appointment_time}}.', '<h2>Appointment Reminder</h2><p>Dear {{patient_name}}, your appointment with {{doctor_name}} is scheduled for {{appointment_date}} at {{appointment_time}}.</p>', '[{"name": "patient_name", "type": "string", "required": true}, {"name": "doctor_name", "type": "string", "required": true}, {"name": "appointment_date", "type": "date", "required": true}, {"name": "appointment_time", "type": "time", "required": true}]', true, NOW(), NOW()),
('template-002', 'prescription_ready', 'Prescription Ready', 'sms', 'Prescription Ready', 'Your prescription for {{medication_name}} is ready for pickup at {{pharmacy_name}}.', NULL, '[{"name": "medication_name", "type": "string", "required": true}, {"name": "pharmacy_name", "type": "string", "required": true}]', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- VIDEO DATABASE SEED DATA
-- ==============================================
\c video_db;

-- Insert video sessions (using correct column names)
INSERT INTO video_sessions (id, room_name, room_sid, status, provider_id, patient_id, appointment_id, start_time, end_time, duration, recording_url, created_at, updated_at) VALUES
('vs-001', 'room123', 'RM123456789', 'scheduled', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440102', '2025-10-03 14:00:00', NULL, NULL, NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert video participants (using correct column names)
INSERT INTO video_participants (id, session_id, user_id, participant_sid, status, joined_at, left_at, created_at, updated_at) VALUES
('vp-001', 'vs-001', '550e8400-e29b-41d4-a716-446655440002', 'PA123456789', 'invited', NULL, NULL, NOW(), NOW()),
('vp-002', 'vs-001', '550e8400-e29b-41d4-a716-446655440003', 'PA987654321', 'invited', NULL, NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- ANALYTICS DATABASE SEED DATA
-- ==============================================
\c analytics_db;

-- Insert metrics (using correct column names)
INSERT INTO metrics (id, name, value, unit, category, metadata, created_at, updated_at) VALUES
('metric-001', 'appointments_scheduled', 15, 'count', 'appointments', '{"period": "daily", "date": "2025-10-01"}', NOW(), NOW()),
('metric-002', 'appointments_completed', 12, 'count', 'appointments', '{"period": "daily", "date": "2025-10-01"}', NOW(), NOW()),
('metric-003', 'patient_satisfaction', 4.5, 'rating', 'satisfaction', '{"scale": "1-5", "responses": 25}', NOW(), NOW()),
('metric-004', 'average_wait_time', 8.5, 'minutes', 'efficiency', '{"period": "daily", "date": "2025-10-01"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert analytics events (using correct column names)
INSERT INTO analytics_events (id, user_id, event_type, properties, timestamp, session_id, ip_address, user_agent, created_at) VALUES
('event-001', '550e8400-e29b-41d4-a716-446655440003', 'appointment_scheduled', '{"appointment_id": "550e8400-e29b-41d4-a716-446655440101", "provider_id": "550e8400-e29b-41d4-a716-446655440002"}', NOW(), 'session-001', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)', NOW()),
('event-002', '550e8400-e29b-41d4-a716-446655440002', 'appointment_viewed', '{"appointment_id": "550e8400-e29b-41d4-a716-446655440101", "patient_id": "550e8400-e29b-41d4-a716-446655440003"}', NOW(), 'session-002', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NOW()),
('event-003', '550e8400-e29b-41d4-a716-446655440003', 'prescription_ordered', '{"prescription_id": "rx-001", "medication": "Ibuprofen"}', NOW(), 'session-001', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert analytics dashboards (using correct column names)
INSERT INTO analytics_dashboards (id, name, description, configuration, is_active, user_id, created_at, updated_at) VALUES
('dashboard-001', 'Appointment Analytics', 'Dashboard showing appointment metrics and trends', '{"widgets": ["appointment_count", "completion_rate", "wait_time"], "refresh_interval": 300}', true, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('dashboard-002', 'Patient Satisfaction', 'Dashboard showing patient satisfaction metrics', '{"widgets": ["satisfaction_score", "feedback_summary", "trend_analysis"], "refresh_interval": 600}', true, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- SEARCH DATABASE SEED DATA
-- ==============================================
\c search_db;

-- Insert search index data (using correct column names)
INSERT INTO search_index (entity_type, entity_id, title, content, metadata) VALUES
('appointment', '550e8400-e29b-41d4-a716-446655440101', 'Appointment with Dr. Johnson', 'Regular checkup appointment scheduled for John Smith', '{"patient_name": "John Smith", "doctor_name": "Dr. Sarah Johnson", "date": "2025-10-02", "type": "in_person"}'),
('patient', '550e8400-e29b-41d4-a716-446655440003', 'John Smith', 'Patient profile for John Smith, DOB: 1990-03-20', '{"first_name": "John", "last_name": "Smith", "dob": "1990-03-20", "phone": "+1-555-0201"}'),
('doctor', '550e8400-e29b-41d4-a716-446655440002', 'Dr. Sarah Johnson', 'Doctor profile for Dr. Sarah Johnson, Internal Medicine', '{"first_name": "Sarah", "last_name": "Johnson", "specialty": "Internal Medicine", "phone": "+1-555-0101"}'),
('prescription', '550e8400-e29b-41d4-a716-446655440001', 'Ibuprofen Prescription', 'Prescription for Ibuprofen 200mg for John Smith', '{"medication": "Ibuprofen", "dosage": "200mg", "patient": "John Smith", "doctor": "Dr. Sarah Johnson"}')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- PAYMENT DATABASE SEED DATA
-- ==============================================
\c payment_db;

-- Insert payment data (using correct column names)
INSERT INTO payments (id, patient_id, appointment_id, amount, currency, status, payment_method, description, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440101', 150.00, 'USD', 'completed', 'credit_card', 'Payment for appointment with Dr. Johnson', '{"card_last4": "4242", "card_brand": "visa"}'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440102', 100.00, 'USD', 'pending', 'credit_card', 'Payment for video consultation with Dr. Johnson', '{"card_last4": "4242", "card_brand": "visa"}')
ON CONFLICT (id) DO NOTHING;

-- Return to default database
\c postgres;

-- Display summary
SELECT 'Database seeding completed successfully!' as status;
