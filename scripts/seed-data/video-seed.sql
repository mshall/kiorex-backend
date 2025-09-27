-- Video Service Seed Data
-- Database: video_db

-- Insert video sessions
INSERT INTO video_sessions (id, appointment_id, room_name, room_sid, host_id, status, scheduled_start, scheduled_end, actual_start, actual_end, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440202', 'room_550e8400-e29b-41d4-a716-446655440202', 'RM1234567890abcdef', '550e8400-e29b-41d4-a716-446655440002', 'scheduled', NOW() + INTERVAL '3 days' + INTERVAL '14 hours', NOW() + INTERVAL '3 days' + INTERVAL '14 hours 30 minutes', NULL, NULL, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', NULL, 'room_550e8400-e29b-41d4-a716-446655440002', 'RM0987654321fedcba', '550e8400-e29b-41d4-a716-446655440002', 'completed', NOW() - INTERVAL '1 day' + INTERVAL '10 hours', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 30 minutes', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 5 minutes', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 25 minutes', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', NULL, 'room_550e8400-e29b-41d4-a716-446655440003', 'RMabcdef1234567890', '550e8400-e29b-41d4-a716-446655440002', 'in_progress', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes' + INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes', NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes');

-- Insert video participants
INSERT INTO video_participants (id, session_id, user_id, is_host, joined_at, left_at, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', true, NULL, NULL, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', false, NULL, NULL, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', true, NOW() - INTERVAL '1 day' + INTERVAL '10 hours 5 minutes', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 25 minutes', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', false, NOW() - INTERVAL '1 day' + INTERVAL '10 hours 7 minutes', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 23 minutes', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', true, NOW() - INTERVAL '25 minutes', NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes'),
('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', false, NOW() - INTERVAL '20 minutes', NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '20 minutes');

-- Insert video recordings (if applicable)
INSERT INTO video_recordings (id, session_id, recording_sid, recording_url, duration_seconds, file_size_bytes, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'RE1234567890abcdef', 'https://api.twilio.com/2010-04-01/Accounts/ACxxx/Recordings/RE1234567890abcdef', 1200, 15728640, 'completed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440003', 'RE0987654321fedcba', 'https://api.twilio.com/2010-04-01/Accounts/ACxxx/Recordings/RE0987654321fedcba', 300, 3932160, 'in_progress', NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '25 minutes');
