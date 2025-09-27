-- Search Service Seed Data
-- Database: search_db

-- Insert search queries (for analytics)
INSERT INTO search_queries (id, user_id, query, results_count, search_type, filters, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'headache treatment', 5, 'medical', '{"category": "symptoms", "specialty": "neurology"}', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'cardiology appointments', 3, 'appointments', '{"specialty": "cardiology", "date_range": "next_week"}', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Dr. Smith', 1, 'providers', '{"specialty": "general_practice"}', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'lab results', 8, 'medical_records', '{"patient_id": "550e8400-e29b-41d4-a716-446655440003"}', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'prescription refill', 2, 'prescriptions', '{"status": "active"}', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes');

-- Insert search analytics
INSERT INTO search_analytics (id, search_term, search_count, unique_users, avg_results, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'headache', 15, 8, 4.2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440102', 'appointment', 25, 12, 3.8, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440103', 'Dr. Smith', 8, 5, 1.0, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440104', 'lab results', 12, 6, 6.5, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440105', 'prescription', 18, 9, 2.3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Insert search indexes metadata
INSERT INTO search_indexes (id, index_name, document_type, document_count, last_updated, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'healthcare-appointments', 'appointment', 150, NOW() - INTERVAL '1 hour', 'active', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440202', 'healthcare-providers', 'provider', 25, NOW() - INTERVAL '2 hours', 'active', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440203', 'healthcare-patients', 'patient', 500, NOW() - INTERVAL '30 minutes', 'active', NOW() - INTERVAL '1 day', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440204', 'healthcare-medical-records', 'medical_record', 1200, NOW() - INTERVAL '45 minutes', 'active', NOW() - INTERVAL '1 day', NOW() - INTERVAL '45 minutes'),
('550e8400-e29b-41d4-a716-446655440205', 'healthcare-prescriptions', 'prescription', 800, NOW() - INTERVAL '1 hour 15 minutes', 'active', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour 15 minutes');
