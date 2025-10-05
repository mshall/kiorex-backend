-- Seed data for Surgery Service
-- Migration: 001-seed-surgery-data.sql

-- Insert sample surgery rooms
INSERT INTO surgery_rooms (id, room_number, name, type, status, description, equipment, capabilities, capacity, size, floor, wing, building, hourly_rate) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'OR-1', 'Operating Room 1', 'operating_room', 'available', 'Main operating room with advanced equipment', '["Surgical table", "Anesthesia machine", "Monitor", "Defibrillator", "C-arm"]', '["Laparoscopic surgery", "Open surgery", "Emergency procedures"]', 1, 45.5, '2', 'Surgery', 'Main Hospital', 500.00),
('123e4567-e89b-12d3-a456-426614174001', 'OR-2', 'Operating Room 2', 'operating_room', 'occupied', 'Cardiac surgery suite', '["Heart-lung machine", "Surgical table", "Anesthesia machine", "Monitor", "Defibrillator"]', '["Cardiac surgery", "Open heart surgery", "Bypass surgery"]', 1, 50.0, '2', 'Surgery', 'Main Hospital', 750.00),
('123e4567-e89b-12d3-a456-426614174002', 'OR-3', 'Operating Room 3', 'operating_room', 'available', 'Orthopedic surgery room', '["Surgical table", "C-arm", "Anesthesia machine", "Monitor", "Drill system"]', '["Orthopedic surgery", "Joint replacement", "Fracture repair"]', 1, 42.0, '2', 'Surgery', 'Main Hospital', 450.00),
('123e4567-e89b-12d3-a456-426614174003', 'RR-1', 'Recovery Room 1', 'recovery_room', 'available', 'Post-operative recovery room', '["Patient beds", "Monitor", "Oxygen", "Suction"]', '["Post-operative care", "Recovery monitoring"]', 4, 30.0, '2', 'Surgery', 'Main Hospital', 200.00),
('123e4567-e89b-12d3-a456-426614174004', 'PR-1', 'Prep Room 1', 'prep_room', 'available', 'Pre-operative preparation room', '["Patient beds", "Monitor", "IV equipment"]', '["Pre-operative preparation", "Patient preparation"]', 2, 20.0, '2', 'Surgery', 'Main Hospital', 150.00);

-- Insert sample surgeries
INSERT INTO surgeries (id, patient_id, surgeon_id, procedure_name, type, category, status, scheduled_date, estimated_duration, operating_room, description, anesthesia, cost, insurance_coverage) VALUES
('223e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174001', 'Appendectomy', 'emergency', 'general', 'completed', '2024-01-15 14:00:00', 60, 'OR-1', 'Laparoscopic appendectomy for acute appendicitis', 'General anesthesia', 5000.00, 'Blue Cross Blue Shield'),
('223e4567-e89b-12d3-a456-426614174001', '323e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174002', 'CABG', 'elective', 'cardiac', 'in_progress', '2024-01-15 08:00:00', 240, 'OR-2', 'Coronary artery bypass graft surgery', 'General anesthesia with cardiopulmonary bypass', 25000.00, 'Medicare'),
('223e4567-e89b-12d3-a456-426614174002', '323e4567-e89b-12d3-a456-426614174003', '423e4567-e89b-12d3-a456-426614174003', 'Hip Replacement', 'elective', 'orthopedic', 'scheduled', '2024-01-16 10:00:00', 120, 'OR-3', 'Total hip replacement surgery', 'Spinal anesthesia', 15000.00, 'Aetna'),
('223e4567-e89b-12d3-a456-426614174003', '323e4567-e89b-12d3-a456-426614174004', '423e4567-e89b-12d3-a456-426614174004', 'Cholecystectomy', 'urgent', 'general', 'scheduled', '2024-01-16 16:00:00', 90, 'OR-1', 'Laparoscopic cholecystectomy for gallstones', 'General anesthesia', 8000.00, 'Cigna'),
('223e4567-e89b-12d3-a456-426614174004', '323e4567-e89b-12d3-a456-426614174005', '423e4567-e89b-12d3-a456-426614174005', 'Craniotomy', 'emergency', 'neurosurgery', 'scheduled', '2024-01-17 02:00:00', 180, 'OR-1', 'Emergency craniotomy for subdural hematoma', 'General anesthesia', 35000.00, 'United Healthcare');

-- Insert sample surgery teams
INSERT INTO surgery_teams (id, surgery_id, member_id, member_name, role, specialty, license_number, contact_info, assigned_by, assigned_at, confirmed_at) VALUES
('523e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174001', 'Dr. Smith', 'surgeon', 'General Surgery', 'MD123456', 'dr.smith@hospital.com', '423e4567-e89b-12d3-a456-426614174010', '2024-01-14 10:00:00', '2024-01-14 11:00:00'),
('523e4567-e89b-12d3-a456-426614174001', '223e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174006', 'Dr. Johnson', 'anesthesiologist', 'Anesthesiology', 'MD789012', 'dr.johnson@hospital.com', '423e4567-e89b-12d3-a456-426614174010', '2024-01-14 10:00:00', '2024-01-14 11:30:00'),
('523e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174007', 'Nurse Wilson', 'nurse', 'Operating Room', 'RN345678', 'nurse.wilson@hospital.com', '423e4567-e89b-12d3-a456-426614174010', '2024-01-14 10:00:00', '2024-01-14 12:00:00'),
('523e4567-e89b-12d3-a456-426614174003', '223e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174002', 'Dr. Brown', 'surgeon', 'Cardiac Surgery', 'MD234567', 'dr.brown@hospital.com', '423e4567-e89b-12d3-a456-426614174011', '2024-01-14 08:00:00', '2024-01-14 09:00:00'),
('523e4567-e89b-12d3-a456-426614174004', '223e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174008', 'Dr. Davis', 'anesthesiologist', 'Cardiac Anesthesiology', 'MD890123', 'dr.davis@hospital.com', '423e4567-e89b-12d3-a456-426614174011', '2024-01-14 08:00:00', '2024-01-14 09:30:00'),
('523e4567-e89b-12d3-a456-426614174005', '223e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174003', 'Dr. Miller', 'surgeon', 'Orthopedic Surgery', 'MD345678', 'dr.miller@hospital.com', '423e4567-e89b-12d3-a456-426614174012', '2024-01-15 10:00:00', '2024-01-15 11:00:00'),
('523e4567-e89b-12d3-a456-426614174006', '223e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174009', 'Dr. Garcia', 'anesthesiologist', 'Regional Anesthesia', 'MD901234', 'dr.garcia@hospital.com', '423e4567-e89b-12d3-a456-426614174012', '2024-01-15 10:00:00', '2024-01-15 11:30:00');

-- Insert sample surgery schedules
INSERT INTO surgery_schedules (id, room_id, surgeon_id, surgery_id, scheduled_date, start_time, end_time, status, notes, created_by) VALUES
('623e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174001', '223e4567-e89b-12d3-a456-426614174000', '2024-01-15 14:00:00', '2024-01-15 14:00:00', '2024-01-15 15:00:00', 'booked', 'Appendectomy procedure', '423e4567-e89b-12d3-a456-426614174010'),
('623e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174001', '2024-01-15 08:00:00', '2024-01-15 08:00:00', '2024-01-15 12:00:00', 'booked', 'CABG procedure', '423e4567-e89b-12d3-a456-426614174011'),
('623e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174003', '223e4567-e89b-12d3-a456-426614174002', '2024-01-16 10:00:00', '2024-01-16 10:00:00', '2024-01-16 12:00:00', 'booked', 'Hip replacement procedure', '423e4567-e89b-12d3-a456-426614174012'),
('623e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174004', '223e4567-e89b-12d3-a456-426614174003', '2024-01-16 16:00:00', '2024-01-16 16:00:00', '2024-01-16 17:30:00', 'booked', 'Cholecystectomy procedure', '423e4567-e89b-12d3-a456-426614174010'),
('623e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174005', '223e4567-e89b-12d3-a456-426614174004', '2024-01-17 02:00:00', '2024-01-17 02:00:00', '2024-01-17 05:00:00', 'booked', 'Emergency craniotomy', '423e4567-e89b-12d3-a456-426614174013');

-- Update completed surgery with actual times and notes
UPDATE surgeries SET 
    actual_start_time = '2024-01-15 14:05:00',
    actual_end_time = '2024-01-15 15:10:00',
    actual_duration = 65,
    operative_notes = 'Laparoscopic appendectomy performed successfully. Appendix was inflamed and removed without complications. Patient tolerated procedure well.',
    postoperative_notes = 'Patient stable in recovery. Pain well controlled. No signs of complications. Discharge planned for tomorrow.',
    team_members = '{"surgeon": "Dr. Smith", "anesthesiologist": "Dr. Johnson", "nurse": "Nurse Wilson"}',
    equipment = '["Laparoscope", "Surgical instruments", "Anesthesia machine", "Monitor"]',
    medications = '["Propofol", "Fentanyl", "Rocuronium", "Morphine"]',
    follow_up_instructions = '["Follow up in 1 week", "Keep incision clean and dry", "Take pain medication as prescribed", "Return if signs of infection"]'
WHERE id = '223e4567-e89b-12d3-a456-426614174000';

-- Update in-progress surgery with start time
UPDATE surgeries SET 
    actual_start_time = '2024-01-15 08:00:00',
    operative_notes = 'CABG procedure in progress. Patient on cardiopulmonary bypass. Three vessels identified for grafting.'
WHERE id = '223e4567-e89b-12d3-a456-426614174001';

-- Add some blocked schedules for maintenance
INSERT INTO surgery_schedules (id, room_id, scheduled_date, start_time, end_time, status, notes, blocked_by, blocked_at, block_reason) VALUES
('623e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', '2024-01-18 00:00:00', '2024-01-18 00:00:00', '2024-01-18 08:00:00', 'blocked', 'Scheduled maintenance', '423e4567-e89b-12d3-a456-426614174010', '2024-01-10 10:00:00', 'Equipment maintenance and cleaning'),
('623e4567-e89b-12d3-a456-426614174006', '123e4567-e89b-12d3-a456-426614174001', '2024-01-19 00:00:00', '2024-01-19 00:00:00', '2024-01-19 12:00:00', 'blocked', 'Scheduled maintenance', '423e4567-e89b-12d3-a456-426614174011', '2024-01-10 10:00:00', 'Heart-lung machine calibration');

-- Update surgery rooms with maintenance schedules
UPDATE surgery_rooms SET 
    maintenance_schedule = '{"lastMaintenance": "2024-01-01T00:00:00Z", "nextMaintenance": "2024-01-18T00:00:00Z", "maintenanceType": "Equipment calibration", "notes": "Regular maintenance schedule"}',
    availability = '{
        "monday": [{"start": "07:00", "end": "19:00", "available": true}],
        "tuesday": [{"start": "07:00", "end": "19:00", "available": true}],
        "wednesday": [{"start": "07:00", "end": "19:00", "available": true}],
        "thursday": [{"start": "07:00", "end": "19:00", "available": true}],
        "friday": [{"start": "07:00", "end": "19:00", "available": true}],
        "saturday": [{"start": "08:00", "end": "16:00", "available": true}],
        "sunday": [{"start": "08:00", "end": "16:00", "available": true}]
    }'
WHERE id = '123e4567-e89b-12d3-a456-426614174000';
