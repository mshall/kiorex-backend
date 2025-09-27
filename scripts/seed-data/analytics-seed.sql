-- Analytics Service Seed Data
-- Database: analytics_db

-- Insert metrics
INSERT INTO metrics (id, name, value, metadata, timestamp, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'active_users', 1250, '{"period": "daily", "date": "2024-01-15"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 'appointments_scheduled', 45, '{"period": "daily", "date": "2024-01-15"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', 'appointments_completed', 38, '{"period": "daily", "date": "2024-01-15"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440004', 'no_show_rate', 0.15, '{"period": "daily", "date": "2024-01-15"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440005', 'average_wait_time', 12.5, '{"period": "daily", "date": "2024-01-15", "unit": "minutes"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440006', 'revenue', 15750.00, '{"period": "daily", "date": "2024-01-15", "currency": "USD"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440007', 'patient_satisfaction', 4.6, '{"period": "daily", "date": "2024-01-15", "scale": "1-5"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440008', 'active_users', 1180, '{"period": "daily", "date": "2024-01-14"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440009', 'appointments_scheduled', 52, '{"period": "daily", "date": "2024-01-14"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440010', 'appointments_completed', 48, '{"period": "daily", "date": "2024-01-14"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Insert analytics events
INSERT INTO analytics_events (id, event_type, event_data, user_id, session_id, timestamp, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'user_login', '{"login_method": "email", "device_type": "desktop", "browser": "Chrome"}', '550e8400-e29b-41d4-a716-446655440003', 'session_123', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440102', 'appointment_scheduled', '{"appointment_id": "550e8400-e29b-41d4-a716-446655440201", "provider_id": "550e8400-e29b-41d4-a716-446655440002", "appointment_type": "consultation"}', '550e8400-e29b-41d4-a716-446655440003', 'session_123', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes'),
('550e8400-e29b-41d4-a716-446655440103', 'prescription_created', '{"prescription_id": "550e8400-e29b-41d4-a716-446655440101", "medication": "Ibuprofen", "patient_id": "550e8400-e29b-41d4-a716-446655440003"}', '550e8400-e29b-41d4-a716-446655440002', 'session_456', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440104', 'video_session_started', '{"session_id": "550e8400-e29b-41d4-a716-446655440003", "participants": 2, "duration_planned": 30}', '550e8400-e29b-41d4-a716-446655440002', 'session_456', NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '25 minutes'),
('550e8400-e29b-41d4-a716-446655440105', 'search_performed', '{"query": "headache treatment", "results_count": 5, "search_type": "medical"}', '550e8400-e29b-41d4-a716-446655440003', 'session_123', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes'),
('550e8400-e29b-41d4-a716-446655440106', 'notification_sent', '{"notification_type": "appointment_reminder", "channel": "email", "recipient": "550e8400-e29b-41d4-a716-446655440003"}', '550e8400-e29b-41d4-a716-446655440001', 'session_789', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes');

-- Insert analytics dashboards
INSERT INTO analytics_dashboards (id, name, description, widgets, user_id, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'Admin Dashboard', 'Comprehensive admin analytics dashboard', '[{"type": "metric", "title": "Active Users", "metric": "active_users", "period": "7d"}, {"type": "chart", "title": "Appointments Trend", "chart_type": "line", "data_source": "appointments_daily"}, {"type": "table", "title": "Top Providers", "data_source": "provider_performance"}]', '550e8400-e29b-41d4-a716-446655440001', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', 'Provider Dashboard', 'Provider-specific analytics dashboard', '[{"type": "metric", "title": "My Appointments Today", "metric": "provider_appointments_today"}, {"type": "chart", "title": "Patient Satisfaction", "chart_type": "bar", "data_source": "provider_satisfaction"}, {"type": "metric", "title": "Revenue This Month", "metric": "provider_revenue_monthly"}]', '550e8400-e29b-41d4-a716-446655440002', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440203', 'Patient Dashboard', 'Patient health analytics dashboard', '[{"type": "metric", "title": "Upcoming Appointments", "metric": "patient_upcoming_appointments"}, {"type": "chart", "title": "Health Trends", "chart_type": "line", "data_source": "patient_vitals"}, {"type": "list", "title": "Recent Prescriptions", "data_source": "patient_prescriptions"}]', '550e8400-e29b-41d4-a716-446655440003', true, NOW(), NOW());
