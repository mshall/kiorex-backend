-- User Service Seed Data
-- Database: users_db

-- Insert sample users
INSERT INTO users (id, email, first_name, last_name, phone, date_of_birth, gender, address, city, state, zip_code, country, role, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@kiorex.com', 'Admin', 'User', '+1234567890', '1980-01-01', 'other', '123 Admin St', 'New York', 'NY', '10001', 'USA', 'admin', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'doctor@kiorex.com', 'Dr. John', 'Smith', '+1234567891', '1975-05-15', 'male', '456 Medical Ave', 'New York', 'NY', '10002', 'USA', 'doctor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'patient@kiorex.com', 'Jane', 'Doe', '+1234567892', '1990-08-20', 'female', '789 Patient St', 'New York', 'NY', '10003', 'USA', 'patient', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'nurse@kiorex.com', 'Sarah', 'Johnson', '+1234567893', '1985-12-10', 'female', '321 Nurse Blvd', 'New York', 'NY', '10004', 'USA', 'nurse', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'receptionist@kiorex.com', 'Mike', 'Wilson', '+1234567894', '1988-03-25', 'male', '654 Reception Rd', 'New York', 'NY', '10005', 'USA', 'receptionist', true, NOW(), NOW());

-- Insert user profiles
INSERT INTO user_profiles (id, user_id, bio, specialization, license_number, years_experience, languages, timezone, avatar_url, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'System Administrator', 'IT Administration', 'ADMIN001', 10, '["English"]', 'America/New_York', 'https://example.com/avatars/admin.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', 'Cardiologist with 15 years of experience', 'Cardiology', 'MD123456', 15, '["English", "Spanish"]', 'America/New_York', 'https://example.com/avatars/doctor.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440003', 'Patient seeking regular healthcare', 'N/A', 'N/A', 0, '["English"]', 'America/New_York', 'https://example.com/avatars/patient.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440004', 'Registered Nurse specializing in emergency care', 'Emergency Nursing', 'RN789012', 8, '["English", "French"]', 'America/New_York', 'https://example.com/avatars/nurse.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440005', 'Front desk receptionist', 'Administration', 'REC001', 5, '["English", "Spanish"]', 'America/New_York', 'https://example.com/avatars/receptionist.jpg', NOW(), NOW());

-- Insert user preferences
INSERT INTO user_preferences (id, user_id, notification_email, notification_sms, notification_push, language, theme, timezone, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440001', true, true, true, 'en', 'light', 'America/New_York', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', true, false, true, 'en', 'dark', 'America/New_York', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440003', true, true, true, 'en', 'light', 'America/New_York', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440004', true, true, false, 'en', 'light', 'America/New_York', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440005', true, false, true, 'en', 'dark', 'America/New_York', NOW(), NOW());
