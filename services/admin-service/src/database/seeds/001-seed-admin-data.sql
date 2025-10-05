-- Seed data for Admin Service
-- Migration: 001-seed-admin-data.sql

-- Insert sample users
INSERT INTO users (id, email, username, password, first_name, last_name, phone, is_active, is_verified, preferences, metadata) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'admin@kiorex.com', 'admin', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'System', 'Administrator', '+1234567890', true, true, '{"language": "en", "timezone": "UTC", "notifications": true}', '{"department": "IT", "employeeId": "EMP001"}'),
('123e4567-e89b-12d3-a456-426614174001', 'doctor@kiorex.com', 'doctor1', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'John', 'Smith', '+1234567891', true, true, '{"language": "en", "timezone": "EST", "notifications": true}', '{"department": "Internal Medicine", "employeeId": "EMP002", "licenseNumber": "MD123456"}'),
('123e4567-e89b-12d3-a456-426614174002', 'nurse@kiorex.com', 'nurse1', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'Jane', 'Wilson', '+1234567892', true, true, '{"language": "en", "timezone": "EST", "notifications": true}', '{"department": "ICU", "employeeId": "EMP003", "licenseNumber": "RN789012"}'),
('123e4567-e89b-12d3-a456-426614174003', 'patient@kiorex.com', 'patient1', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'Bob', 'Johnson', '+1234567893', true, true, '{"language": "en", "timezone": "EST", "notifications": false}', '{"patientId": "PAT001", "dateOfBirth": "1980-01-15"}');

-- Insert sample roles
INSERT INTO roles (id, name, description, permissions, is_system, is_active, created_by) VALUES
('223e4567-e89b-12d3-a456-426614174000', 'admin', 'System administrator with full access', '["users.create", "users.read", "users.update", "users.delete", "roles.create", "roles.read", "roles.update", "roles.delete", "system.configure", "audit.view"]', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('223e4567-e89b-12d3-a456-426614174001', 'doctor', 'Medical doctor with patient care access', '["patients.read", "patients.update", "medical_records.read", "medical_records.create", "medical_records.update", "appointments.read", "appointments.create", "appointments.update"]', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('223e4567-e89b-12d3-a456-426614174002', 'nurse', 'Nursing staff with patient care access', '["patients.read", "medical_records.read", "appointments.read", "nurse_notes.create", "nurse_notes.read", "nurse_notes.update"]', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('223e4567-e89b-12d3-a456-426614174003', 'patient', 'Patient with limited access to own records', '["own_records.read", "appointments.read", "appointments.create"]', true, true, '123e4567-e89b-12d3-a456-426614174000');

-- Insert sample permissions
INSERT INTO permissions (id, name, description, resource, action, is_system, is_active, created_by) VALUES
('323e4567-e89b-12d3-a456-426614174000', 'users.create', 'Create new users', 'users', 'create', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('323e4567-e89b-12d3-a456-426614174001', 'users.read', 'Read user information', 'users', 'read', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('323e4567-e89b-12d3-a456-426614174002', 'users.update', 'Update user information', 'users', 'update', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('323e4567-e89b-12d3-a456-426614174003', 'users.delete', 'Delete users', 'users', 'delete', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('323e4567-e89b-12d3-a456-426614174004', 'patients.read', 'Read patient information', 'patients', 'read', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('323e4567-e89b-12d3-a456-426614174005', 'medical_records.read', 'Read medical records', 'medical_records', 'read', true, true, '123e4567-e89b-12d3-a456-426614174000');

-- Insert sample user roles
INSERT INTO user_roles (id, user_id, role_id, assigned_by, assigned_at, is_active) VALUES
('423e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '2024-01-01 00:00:00', true),
('423e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174001', '223e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '2024-01-01 00:00:00', true),
('423e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', '2024-01-01 00:00:00', true),
('423e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174003', '223e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', '2024-01-01 00:00:00', true);

-- Insert sample system configurations
INSERT INTO system_configurations (id, key, value, type, category, description, is_system, is_active, updated_by) VALUES
('523e4567-e89b-12d3-a456-426614174000', 'platform.name', 'Kiorex Healthcare Platform', 'string', 'general', 'Platform display name', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('523e4567-e89b-12d3-a456-426614174001', 'platform.version', '1.0.0', 'string', 'general', 'Platform version', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('523e4567-e89b-12d3-a456-426614174002', 'security.session_timeout', '3600', 'number', 'security', 'Session timeout in seconds', true, true, '123e4567-e89b-12d3-a456-426614174000'),
('523e4567-e89b-12d3-a456-426614174003', 'features.telemedicine_enabled', 'true', 'boolean', 'features', 'Enable telemedicine features', false, true, '123e4567-e89b-12d3-a456-426614174000'),
('523e4567-e89b-12d3-a456-426614174004', 'notifications.email_enabled', 'true', 'boolean', 'notifications', 'Enable email notifications', false, true, '123e4567-e89b-12d3-a456-426614174000');

-- Insert sample audit logs
INSERT INTO audit_logs (id, user_id, action, resource, resource_id, details, ip_address, user_agent, timestamp, success, metadata) VALUES
('623e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'login', 'auth', null, '{"method": "password"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-01-15 09:00:00', true, '{"sessionId": "sess123"}'),
('623e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174001', 'create', 'patient', '323e4567-e89b-12d3-a456-426614174001', '{"patientName": "John Doe", "patientId": "PAT001"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-01-15 10:00:00', true, '{"sessionId": "sess124"}'),
('623e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174002', 'update', 'medical_record', '423e4567-e89b-12d3-a456-426614174001', '{"recordId": "MR001", "changes": ["vital_signs", "medications"]}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2024-01-15 11:00:00', true, '{"sessionId": "sess125"}');

-- Insert sample platform analytics
INSERT INTO platform_analytics (id, metric, value, unit, category, timestamp, dimensions, tags, metadata) VALUES
('723e4567-e89b-12d3-a456-426614174000', 'active_users', 150, 'count', 'users', '2024-01-15 12:00:00', '{"timeframe": "daily"}', '["platform", "users"]', '{"source": "system"}'),
('723e4567-e89b-12d3-a456-426614174001', 'total_patients', 1250, 'count', 'patients', '2024-01-15 12:00:00', '{"timeframe": "total"}', '["platform", "patients"]', '{"source": "system"}'),
('723e4567-e89b-12d3-a456-426614174002', 'appointments_today', 45, 'count', 'appointments', '2024-01-15 12:00:00', '{"timeframe": "daily"}', '["platform", "appointments"]', '{"source": "system"}'),
('723e4567-e89b-12d3-a456-426614174003', 'system_uptime', 99.9, 'percentage', 'performance', '2024-01-15 12:00:00', '{"timeframe": "monthly"}', '["platform", "performance"]', '{"source": "monitoring"}');
