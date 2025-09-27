-- Appointment Service Seed Data
-- Database: appointments_db

-- Insert appointment types
INSERT INTO appointment_types (id, name, description, duration_minutes, consultation_fee, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'General Consultation', 'General medical consultation', 30, 150.00, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Follow-up Visit', 'Follow-up appointment', 15, 75.00, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Emergency Consultation', 'Emergency medical consultation', 60, 300.00, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Video Consultation', 'Telemedicine video consultation', 30, 120.00, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Annual Checkup', 'Comprehensive annual health checkup', 45, 200.00, true, NOW(), NOW());

-- Insert appointment slots
INSERT INTO appointment_slots (id, provider_id, start_time, end_time, status, max_bookings, current_bookings, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440002', NOW() + INTERVAL '1 day' + INTERVAL '9 hours', NOW() + INTERVAL '1 day' + INTERVAL '9 hours 30 minutes', 'available', 1, 0, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', NOW() + INTERVAL '1 day' + INTERVAL '10 hours', NOW() + INTERVAL '1 day' + INTERVAL '10 hours 30 minutes', 'available', 1, 0, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440002', NOW() + INTERVAL '1 day' + INTERVAL '11 hours', NOW() + INTERVAL '1 day' + INTERVAL '11 hours 30 minutes', 'booked', 1, 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440002', NOW() + INTERVAL '2 days' + INTERVAL '9 hours', NOW() + INTERVAL '2 days' + INTERVAL '9 hours 30 minutes', 'available', 1, 0, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440002', NOW() + INTERVAL '2 days' + INTERVAL '10 hours', NOW() + INTERVAL '2 days' + INTERVAL '10 hours 30 minutes', 'available', 1, 0, NOW(), NOW());

-- Insert appointments
INSERT INTO appointments (id, patient_id, provider_id, slot_id, appointment_type_id, consultation_type, status, start_time, end_time, reason_for_visit, symptoms, chief_complaint, notes, consultation_fee, is_paid, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440001', 'in_person', 'scheduled', NOW() + INTERVAL '1 day' + INTERVAL '11 hours', NOW() + INTERVAL '1 day' + INTERVAL '11 hours 30 minutes', 'Regular checkup', '["fatigue", "headache"]', 'Feeling tired and occasional headaches', 'Patient reports feeling tired for the past week', 150.00, false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440004', 'video', 'scheduled', NOW() + INTERVAL '3 days' + INTERVAL '14 hours', NOW() + INTERVAL '3 days' + INTERVAL '14 hours 30 minutes', 'Follow-up consultation', '[]', 'Follow-up on previous treatment', 'Video consultation for follow-up', 120.00, false, NOW(), NOW());

-- Insert waitlist entries
INSERT INTO waitlists (id, patient_id, provider_id, appointment_type_id, preferred_date, status, priority, notes, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NOW() + INTERVAL '1 week', 'waiting', 1, 'Patient prefers morning appointments', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', NOW() + INTERVAL '2 weeks', 'waiting', 2, 'Annual checkup request', NOW(), NOW());
