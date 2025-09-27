-- Auth Service Seed Data
-- Database: auth_db

-- Insert sample users for authentication
INSERT INTO user_auth (id, email, password_hash, is_verified, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@kiorex.com', '$2b$10$rQZ8K9LmN3pQ4rS5tU6vWe7xY8zA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'doctor@kiorex.com', '$2b$10$rQZ8K9LmN3pQ4rS5tU6vWe7xY8zA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'patient@kiorex.com', '$2b$10$rQZ8K9LmN3pQ4rS5tU6vWe7xY8zA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'nurse@kiorex.com', '$2b$10$rQZ8K9LmN3pQ4rS5tU6vWe7xY8zA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW', true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'receptionist@kiorex.com', '$2b$10$rQZ8K9LmN3pQ4rS5tU6vWe7xY8zA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW', true, true, NOW(), NOW());

-- Insert MFA secrets for some users
INSERT INTO mfa_secrets (id, user_id, secret, backup_codes, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'JBSWY3DPEHPK3PXP', '["123456", "789012", "345678", "901234", "567890"]', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', 'JBSWY3DPEHPK3PXP', '["234567", "890123", "456789", "012345", "678901"]', true, NOW(), NOW());

-- Insert sample login history
INSERT INTO login_history (id, user_id, ip_address, user_agent, login_time, logout_time, is_successful, failure_reason) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440001', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', true, NULL),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL '2 hours', NULL, true, NULL),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440003', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', NOW() - INTERVAL '30 minutes', NULL, true, NULL);
