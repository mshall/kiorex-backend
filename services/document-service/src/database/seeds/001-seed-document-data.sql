-- Seed data for Document Service
-- Migration: 001-seed-document-data.sql

-- Insert sample documents
INSERT INTO documents (id, title, description, document_type, category, tags, file_path, file_name, file_size, mime_type, checksum, patient_id, created_by, department_id, is_confidential, access_level, retention_period, metadata) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'Patient Medical Record - John Doe', 'Complete medical record for patient John Doe including history, examinations, and treatments', 'medical_record', 'patient_records', '["medical", "patient", "history", "examination"]', '/uploads/medical-records/john-doe-medical-record.pdf', 'john-doe-medical-record.pdf', 2048576, 'application/pdf', 'abc123def456', '323e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174001', '523e4567-e89b-12d3-a456-426614174001', true, 'confidential', 2555, '{"patientName": "John Doe", "dateOfBirth": "1980-01-15", "medicalRecordNumber": "MR123456"}'),
('123e4567-e89b-12d3-a456-426614174002', 'Lab Results - Blood Test', 'Complete blood count and chemistry panel results', 'lab_result', 'laboratory', '["lab", "blood", "results", "chemistry"]', '/uploads/lab-results/blood-test-results.pdf', 'blood-test-results.pdf', 1024768, 'application/pdf', 'def456ghi789', '323e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174002', true, 'confidential', 1825, '{"testDate": "2024-01-15", "labTechnician": "Jane Smith", "testType": "CBC"}'),
('123e4567-e89b-12d3-a456-426614174003', 'X-Ray Report - Chest', 'Chest X-ray examination report', 'radiology', 'imaging', '["xray", "chest", "radiology", "imaging"]', '/uploads/radiology/chest-xray-report.pdf', 'chest-xray-report.pdf', 512384, 'application/pdf', 'ghi789jkl012', '323e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174003', '523e4567-e89b-12d3-a456-426614174003', true, 'confidential', 1825, '{"examDate": "2024-01-15", "radiologist": "Dr. Johnson", "examType": "Chest X-ray"}'),
('123e4567-e89b-12d3-a456-426614174004', 'Discharge Summary', 'Patient discharge summary and instructions', 'discharge_summary', 'patient_care', '["discharge", "summary", "instructions", "followup"]', '/uploads/discharge/discharge-summary.pdf', 'discharge-summary.pdf', 768192, 'application/pdf', 'jkl012mno345', '323e4567-e89b-12d3-a456-426614174003', '423e4567-e89b-12d3-a456-426614174004', '523e4567-e89b-12d3-a456-426614174001', true, 'confidential', 2555, '{"dischargeDate": "2024-01-16", "dischargingPhysician": "Dr. Smith", "admissionDate": "2024-01-14"}'),
('123e4567-e89b-12d3-a456-426614174005', 'Insurance Authorization Form', 'Insurance pre-authorization form for procedure', 'insurance', 'administrative', '["insurance", "authorization", "procedure", "billing"]', '/uploads/insurance/authorization-form.pdf', 'authorization-form.pdf', 256000, 'application/pdf', 'mno345pqr678', '323e4567-e89b-12d3-a456-426614174004', '423e4567-e89b-12d3-a456-426614174005', '523e4567-e89b-12d3-a456-426614174004', false, 'restricted', 1095, '{"insuranceProvider": "Blue Cross Blue Shield", "policyNumber": "BC123456789", "authorizationNumber": "AUTH789012"}');

-- Insert sample document versions
INSERT INTO document_versions (id, document_id, version, file_path, file_name, file_size, checksum, change_description, changed_by, is_active) VALUES
('223e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 1, '/uploads/medical-records/john-doe-medical-record-v1.pdf', 'john-doe-medical-record-v1.pdf', 2048576, 'abc123def456', 'Initial medical record creation', '423e4567-e89b-12d3-a456-426614174001', false),
('223e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 2, '/uploads/medical-records/john-doe-medical-record-v2.pdf', 'john-doe-medical-record-v2.pdf', 2150400, 'abc123def456v2', 'Updated with new examination results', '423e4567-e89b-12d3-a456-426614174001', true),
('223e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174002', 1, '/uploads/lab-results/blood-test-results.pdf', 'blood-test-results.pdf', 1024768, 'def456ghi789', 'Initial lab results', '423e4567-e89b-12d3-a456-426614174002', true),
('223e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174003', 1, '/uploads/radiology/chest-xray-report.pdf', 'chest-xray-report.pdf', 512384, 'ghi789jkl012', 'Initial radiology report', '423e4567-e89b-12d3-a456-426614174003', true);

-- Insert sample document access logs
INSERT INTO document_access_logs (id, document_id, user_id, action, ip_address, user_agent, access_time, duration, success, metadata) VALUES
('323e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174001', 'view', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-01-15 10:00:00', 30, true, '{"sessionId": "sess123", "referrer": "dashboard"}'),
('323e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174002', 'download', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-01-15 11:00:00', 5, true, '{"sessionId": "sess124", "downloadReason": "patient_care"}'),
('323e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174001', 'view', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-01-15 12:00:00', 45, true, '{"sessionId": "sess123", "referrer": "lab_results"}'),
('323e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174003', '423e4567-e89b-12d3-a456-426614174003', 'view', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2024-01-15 13:00:00', 60, true, '{"sessionId": "sess125", "referrer": "radiology"}'),
('323e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174004', '423e4567-e89b-12d3-a456-426614174004', 'download', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15', '2024-01-15 14:00:00', 8, true, '{"sessionId": "sess126", "downloadReason": "patient_discharge"}');

-- Insert sample document permissions
INSERT INTO document_permissions (id, document_id, user_id, role, permission, granted_by, granted_at, expires_at, is_active, conditions) VALUES
('423e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174001', 'doctor', 'read', '423e4567-e89b-12d3-a456-426614174010', '2024-01-15 09:00:00', '2024-12-31 23:59:59', true, '{"department": "internal_medicine"}'),
('423e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174002', 'nurse', 'read', '423e4567-e89b-12d3-a456-426614174010', '2024-01-15 09:00:00', '2024-12-31 23:59:59', true, '{"department": "internal_medicine"}'),
('423e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174003', 'doctor', 'write', '423e4567-e89b-12d3-a456-426614174010', '2024-01-15 09:00:00', '2024-12-31 23:59:59', true, '{"department": "internal_medicine", "specialty": "cardiology"}'),
('423e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174001', 'doctor', 'read', '423e4567-e89b-12d3-a456-426614174011', '2024-01-15 10:00:00', '2024-12-31 23:59:59', true, '{"department": "laboratory"}'),
('423e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174003', '423e4567-e89b-12d3-a456-426614174003', 'radiologist', 'read', '423e4567-e89b-12d3-a456-426614174012', '2024-01-15 11:00:00', '2024-12-31 23:59:59', true, '{"department": "radiology"}'),
('423e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174004', '423e4567-e89b-12d3-a456-426614174004', 'doctor', 'read', '423e4567-e89b-12d3-a456-426614174010', '2024-01-15 12:00:00', '2024-12-31 23:59:59', true, '{"department": "internal_medicine"}'),
('423e4567-e89b-12d3-a456-426614174006', '123e4567-e89b-12d3-a456-426614174005', '423e4567-e89b-12d3-a456-426614174005', 'admin', 'read', '423e4567-e89b-12d3-a456-426614174010', '2024-01-15 13:00:00', '2024-12-31 23:59:59', true, '{"department": "billing"}');

-- Update documents with version information
UPDATE documents SET 
    version = 2,
    updated_by = '423e4567-e89b-12d3-a456-426614174001',
    updated_at = '2024-01-15 15:00:00'
WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- Add some additional metadata to documents
UPDATE documents SET 
    metadata = jsonb_set(metadata, '{lastAccessed}', '"2024-01-15T14:00:00Z"')
WHERE id = '123e4567-e89b-12d3-a456-426614174000';

UPDATE documents SET 
    metadata = jsonb_set(metadata, '{lastAccessed}', '"2024-01-15T12:00:00Z"')
WHERE id = '123e4567-e89b-12d3-a456-426614174002';

UPDATE documents SET 
    metadata = jsonb_set(metadata, '{lastAccessed}', '"2024-01-15T13:00:00Z"')
WHERE id = '123e4567-e89b-12d3-a456-426614174003';
