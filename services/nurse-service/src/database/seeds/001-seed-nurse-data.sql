-- Seed data for Nurse Service
-- Migration: 001-seed-nurse-data.sql

-- Insert sample nurse shifts
INSERT INTO nurse_shifts (id, nurse_id, nurse_name, shift_date, type, status, start_time, end_time, unit, floor, ward, patient_count, notes, supervisor_id, supervisor_name) VALUES
('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', 'Jane Smith', '2024-01-15', 'day', 'completed', '07:00:00', '19:00:00', 'ICU', '3', 'A', 4, 'Regular day shift with 4 ICU patients', '123e4567-e89b-12d3-a456-426614174010', 'Dr. Johnson'),
('123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174003', 'Mike Johnson', '2024-01-15', 'evening', 'in_progress', '19:00:00', '07:00:00', 'ICU', '3', 'A', 3, 'Evening shift taking over from day shift', '123e4567-e89b-12d3-a456-426614174010', 'Dr. Johnson'),
('123e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174005', 'Sarah Wilson', '2024-01-16', 'day', 'scheduled', '07:00:00', '19:00:00', 'Emergency', '1', 'B', 6, 'Emergency department day shift', '123e4567-e89b-12d3-a456-426614174011', 'Dr. Brown'),
('123e4567-e89b-12d3-a456-426614174006', '123e4567-e89b-12d3-a456-426614174007', 'David Lee', '2024-01-16', 'night', 'scheduled', '19:00:00', '07:00:00', 'Surgery', '2', 'C', 2, 'Post-operative care night shift', '123e4567-e89b-12d3-a456-426614174012', 'Dr. Davis'),
('123e4567-e89b-12d3-a456-426614174008', '123e4567-e89b-12d3-a456-426614174009', 'Lisa Garcia', '2024-01-17', 'rotating', 'scheduled', '07:00:00', '19:00:00', 'Pediatrics', '4', 'D', 5, 'Pediatric ward rotating shift', '123e4567-e89b-12d3-a456-426614174013', 'Dr. Miller');

-- Insert sample patient care records
INSERT INTO patient_care (id, patient_id, nurse_id, nurse_name, care_type, status, priority, scheduled_time, description, instructions, requires_follow_up, follow_up_time) VALUES
('223e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174001', 'Jane Smith', 'medication', 'completed', 'high', '2024-01-15 08:00:00', 'Administer morning medications', 'Give patient morning medications as prescribed', true, '2024-01-15 12:00:00'),
('223e4567-e89b-12d3-a456-426614174002', '323e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174001', 'Jane Smith', 'vitals', 'completed', 'medium', '2024-01-15 09:00:00', 'Record vital signs', 'Check temperature, blood pressure, heart rate, and oxygen saturation', false, null),
('223e4567-e89b-12d3-a456-426614174003', '323e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174003', 'Mike Johnson', 'hygiene', 'in_progress', 'medium', '2024-01-15 20:00:00', 'Evening hygiene care', 'Assist with bathing and oral care', false, null),
('223e4567-e89b-12d3-a456-426614174004', '323e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174005', 'Sarah Wilson', 'assessment', 'scheduled', 'high', '2024-01-16 08:30:00', 'Initial patient assessment', 'Complete comprehensive patient assessment', true, '2024-01-16 14:00:00'),
('223e4567-e89b-12d3-a456-426614174005', '323e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174007', 'David Lee', 'emergency', 'scheduled', 'critical', '2024-01-16 22:00:00', 'Emergency response protocol', 'Monitor for post-operative complications', false, null);

-- Insert sample nurse notes
INSERT INTO nurse_notes (id, patient_id, nurse_id, nurse_name, note_type, priority, content, summary, tags, requires_follow_up, is_confidential, is_draft, published_at) VALUES
('423e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174001', 'Jane Smith', 'assessment', 'medium', 'Patient appears stable. Vital signs within normal limits. Temperature 98.6°F, BP 120/80, HR 72 bpm, O2 sat 98%. No signs of distress. Patient reports feeling comfortable and pain level 2/10.', 'Stable patient assessment with normal vitals', '["stable", "vitals-normal", "comfortable"]', false, false, false, '2024-01-15 10:00:00'),
('423e4567-e89b-12d3-a456-426614174001', '323e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174001', 'Jane Smith', 'medication', 'high', 'Administered morning medications as prescribed. Patient tolerated well with no adverse reactions. Medications given: Metformin 500mg, Lisinopril 10mg, Atorvastatin 20mg.', 'Medications administered successfully', '["medications", "no-reactions", "tolerated"]', true, false, false, '2024-01-15 08:30:00'),
('423e4567-e89b-12d3-a456-426614174002', '323e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174003', 'Mike Johnson', 'progress', 'medium', 'Patient showing improvement in mobility. Able to sit up independently and perform range of motion exercises. Family visited and patient in good spirits. Continue current care plan.', 'Positive progress noted', '["improvement", "mobility", "family-visit"]', false, false, false, '2024-01-15 21:00:00'),
('423e4567-e89b-12d3-a456-426614174003', '323e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174005', 'Sarah Wilson', 'incident', 'high', 'Minor fall incident occurred during transfer. Patient fell but no injuries sustained. Incident reported to supervisor. Safety measures reviewed and additional assistance provided.', 'Fall incident with no injuries', '["incident", "fall", "no-injury", "safety-review"]', true, false, false, '2024-01-16 09:15:00'),
('423e4567-e89b-12d3-a456-426614174004', '323e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174007', 'David Lee', 'handover', 'medium', 'Night shift handover: Patient stable, all medications given on time. No new concerns. Family informed of patient status. Next shift to continue monitoring vital signs every 4 hours.', 'Stable patient handover', '["handover", "stable", "medications-complete"]', false, false, false, '2024-01-16 07:00:00');

-- Insert sample nurse schedules
INSERT INTO nurse_schedules (id, nurse_id, nurse_name, schedule_date, status, type, start_time, end_time, unit, floor, ward, patient_load, notes, supervisor_id, supervisor_name, scheduled_by, scheduled_at) VALUES
('523e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', 'Jane Smith', '2024-01-15', 'scheduled', 'regular', '07:00:00', '19:00:00', 'ICU', '3', 'A', 4, 'Regular day shift assignment', '123e4567-e89b-12d3-a456-426614174010', 'Dr. Johnson', '123e4567-e89b-12d3-a456-426614174020', '2024-01-10 10:00:00'),
('523e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174003', 'Mike Johnson', '2024-01-15', 'scheduled', 'regular', '19:00:00', '07:00:00', 'ICU', '3', 'A', 3, 'Evening shift assignment', '123e4567-e89b-12d3-a456-426614174010', 'Dr. Johnson', '123e4567-e89b-12d3-a456-426614174020', '2024-01-10 10:00:00'),
('523e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174005', 'Sarah Wilson', '2024-01-16', 'scheduled', 'charge', '07:00:00', '19:00:00', 'Emergency', '1', 'B', 6, 'Charge nurse assignment for emergency department', '123e4567-e89b-12d3-a456-426614174011', 'Dr. Brown', '123e4567-e89b-12d3-a456-426614174021', '2024-01-11 09:00:00'),
('523e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174007', 'David Lee', '2024-01-16', 'scheduled', 'overtime', '19:00:00', '07:00:00', 'Surgery', '2', 'C', 2, 'Overtime assignment for post-operative care', '123e4567-e89b-12d3-a456-426614174012', 'Dr. Davis', '123e4567-e89b-12d3-a456-426614174022', '2024-01-11 14:00:00'),
('523e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174009', 'Lisa Garcia', '2024-01-17', 'scheduled', 'preceptor', '07:00:00', '19:00:00', 'Pediatrics', '4', 'D', 5, 'Preceptor assignment for new nurse training', '123e4567-e89b-12d3-a456-426614174013', 'Dr. Miller', '123e4567-e89b-12d3-a456-426614174023', '2024-01-12 11:00:00');

-- Update some records with additional data
UPDATE nurse_shifts SET 
    actual_start_time = '07:05:00',
    actual_end_time = '19:10:00',
    handover_notes = 'All patients stable. Medications given on time. No incidents. Next shift to continue monitoring.',
    assigned_patients = '["323e4567-e89b-12d3-a456-426614174001", "323e4567-e89b-12d3-a456-426614174002", "323e4567-e89b-12d3-a456-426614174003", "323e4567-e89b-12d3-a456-426614174004"]',
    tasks = '[{"task": "Morning medications", "completed": true, "completedAt": "2024-01-15T08:30:00Z"}, {"task": "Vital signs", "completed": true, "completedAt": "2024-01-15T09:00:00Z"}, {"task": "Patient assessment", "completed": true, "completedAt": "2024-01-15T10:00:00Z"}]',
    medications = '[{"patientId": "323e4567-e89b-12d3-a456-426614174001", "medication": "Metformin 500mg", "time": "08:00", "given": true, "givenAt": "2024-01-15T08:00:00Z"}]',
    vitals = '[{"patientId": "323e4567-e89b-12d3-a456-426614174001", "temperature": 98.6, "bloodPressure": "120/80", "heartRate": 72, "respiratoryRate": 16, "oxygenSaturation": 98, "recordedAt": "2024-01-15T09:00:00Z"}]',
    overtime_hours = 0.17
WHERE id = '123e4567-e89b-12d3-a456-426614174000';

UPDATE patient_care SET 
    actual_start_time = '2024-01-15 08:05:00',
    actual_end_time = '2024-01-15 08:25:00',
    outcome = 'Medications administered successfully. Patient tolerated well with no adverse reactions.',
    notes = 'Patient cooperative and understanding. No questions or concerns raised.',
    medications = '[{"name": "Metformin", "dosage": "500mg", "route": "oral", "time": "08:00", "given": true, "givenAt": "2024-01-15T08:00:00Z", "notes": "Patient tolerated well"}]',
    duration = 20
WHERE id = '223e4567-e89b-12d3-a456-426614174000';

UPDATE patient_care SET 
    actual_start_time = '2024-01-15 09:05:00',
    actual_end_time = '2024-01-15 09:15:00',
    outcome = 'Vital signs recorded. All values within normal limits.',
    notes = 'Patient comfortable during assessment. No signs of distress.',
    vitals = '{"temperature": 98.6, "bloodPressure": "120/80", "heartRate": 72, "respiratoryRate": 16, "oxygenSaturation": 98, "recordedAt": "2024-01-15T09:00:00Z"}',
    duration = 10
WHERE id = '223e4567-e89b-12d3-a456-426614174002';

UPDATE nurse_notes SET 
    vital_signs = '{"temperature": 98.6, "bloodPressure": "120/80", "heartRate": 72, "respiratoryRate": 16, "oxygenSaturation": 98}',
    medications = '[{"name": "Metformin", "dosage": "500mg", "route": "oral", "time": "08:00", "response": "Well tolerated"}]',
    assessments = '[{"type": "General Assessment", "findings": "Patient stable, no acute distress", "score": 8, "recommendations": "Continue current care plan"}]',
    patient_response = '{"verbal": "Feeling comfortable", "nonVerbal": "Relaxed posture", "emotional": "Calm and cooperative", "physical": "No signs of distress"}'
WHERE id = '423e4567-e89b-12d3-a456-426614174000';

UPDATE nurse_schedules SET 
    responsibilities = '[{"role": "Primary Care Nurse", "description": "Provide direct patient care", "priority": "high"}, {"role": "Medication Administration", "description": "Administer prescribed medications", "priority": "high"}]',
    competencies = '[{"skill": "ICU Care", "level": "advanced", "verified": true, "verifiedBy": "123e4567-e89b-12d3-a456-426614174010", "verifiedAt": "2024-01-01T00:00:00Z"}]',
    assignments = '[{"patientId": "323e4567-e89b-12d3-a456-426614174001", "patientName": "John Doe", "acuity": "high", "specialNeeds": ["diabetes", "hypertension"]}]',
    hours = 12.0,
    pay_rate = 35.00,
    total_pay = 420.00
WHERE id = '523e4567-e89b-12d3-a456-426614174000';
