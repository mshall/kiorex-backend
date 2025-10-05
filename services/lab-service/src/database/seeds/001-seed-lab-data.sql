-- Seed Lab Tests
INSERT INTO lab_tests (test_code, test_name, category, description, specimen_type, preparation_instructions, turnaround_hours, reference_ranges) VALUES
('CBC', 'Complete Blood Count', 'Hematology', 'Comprehensive blood cell analysis', 'Whole Blood', 'Fasting not required', 4, '{"WBC": "4.5-11.0 K/uL", "RBC": "4.5-5.9 M/uL", "Hemoglobin": "13.8-17.2 g/dL", "Hematocrit": "41-53%"}'),
('BMP', 'Basic Metabolic Panel', 'Chemistry', 'Basic metabolic function tests', 'Serum', 'Fasting for 8-12 hours', 2, '{"Glucose": "70-100 mg/dL", "BUN": "7-20 mg/dL", "Creatinine": "0.6-1.2 mg/dL"}'),
('LFT', 'Liver Function Tests', 'Chemistry', 'Liver enzyme and function tests', 'Serum', 'Fasting not required', 3, '{"ALT": "7-56 U/L", "AST": "10-40 U/L", "Bilirubin": "0.1-1.2 mg/dL"}'),
('LIPID', 'Lipid Panel', 'Chemistry', 'Cholesterol and lipid analysis', 'Serum', 'Fasting for 12-14 hours', 4, '{"Total Cholesterol": "<200 mg/dL", "LDL": "<100 mg/dL", "HDL": ">40 mg/dL"}'),
('TSH', 'Thyroid Stimulating Hormone', 'Endocrinology', 'Thyroid function test', 'Serum', 'Fasting not required', 6, '{"TSH": "0.4-4.0 mIU/L"}'),
('UA', 'Urinalysis', 'Urine', 'Complete urine analysis', 'Urine', 'Midstream clean catch', 2, '{"pH": "4.5-8.0", "Specific Gravity": "1.005-1.030"}'),
('CULTURE', 'Blood Culture', 'Microbiology', 'Bacterial infection detection', 'Blood', 'Sterile collection required', 72, '{"Growth": "No growth in 5 days"}'),
('COVID', 'COVID-19 PCR', 'Infectious Disease', 'SARS-CoV-2 detection', 'Nasal Swab', 'Proper swab technique required', 24, '{"Result": "Negative/Positive"}');

-- Seed Lab Partners
INSERT INTO lab_partners (name, contact_person, email, phone, address, services, is_active) VALUES
('Central Lab Services', 'Dr. Sarah Johnson', 'sarah.johnson@centrallab.com', '+1-555-0101', '123 Medical Center Dr, Healthcare City', '["Hematology", "Chemistry", "Microbiology"]', true),
('Advanced Diagnostics', 'Dr. Michael Chen', 'michael.chen@advanceddiag.com', '+1-555-0102', '456 Research Blvd, Science Park', '["Molecular Biology", "Genetics", "Specialized Testing"]', true),
('Regional Lab Network', 'Dr. Emily Rodriguez', 'emily.rodriguez@regionallab.com', '+1-555-0103', '789 Healthcare Ave, Medical District', '["Routine Testing", "Emergency Lab", "Point of Care"]', true),
('Specialty Lab Group', 'Dr. David Kim', 'david.kim@specialtylab.com', '+1-555-0104', '321 Innovation Way, Tech Center', '["Toxicology", "Immunology", "Endocrinology"]', true);

-- Seed Lab Orders (sample data)
INSERT INTO lab_orders (patient_id, provider_id, order_number, test_type, priority, status, notes, requested_at, scheduled_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'LAB-001-2024', 'CBC', 'routine', 'completed', 'Routine annual checkup', '2024-01-15 09:00:00', '2024-01-15 10:00:00'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'LAB-002-2024', 'BMP', 'routine', 'completed', 'Diabetes monitoring', '2024-01-15 09:00:00', '2024-01-15 10:00:00'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'LAB-003-2024', 'LFT', 'urgent', 'pending', 'Liver function assessment', '2024-01-16 08:30:00', '2024-01-16 09:30:00'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'LAB-004-2024', 'COVID', 'urgent', 'completed', 'Pre-surgery screening', '2024-01-16 14:00:00', '2024-01-16 15:00:00'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'LAB-005-2024', 'LIPID', 'routine', 'scheduled', 'Cardiovascular risk assessment', '2024-01-17 10:00:00', '2024-01-17 11:00:00');

-- Seed Lab Results (sample data)
INSERT INTO lab_results (lab_order_id, test_name, result_value, result_unit, reference_range, status, interpretation, is_critical, technician_id, verified_by, verified_at) VALUES
((SELECT id FROM lab_orders WHERE order_number = 'LAB-001-2024'), 'WBC', '7.2', 'K/uL', '4.5-11.0 K/uL', 'completed', 'Within normal limits', false, '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 11:30:00'),
((SELECT id FROM lab_orders WHERE order_number = 'LAB-001-2024'), 'Hemoglobin', '14.2', 'g/dL', '13.8-17.2 g/dL', 'completed', 'Within normal limits', false, '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 11:30:00'),
((SELECT id FROM lab_orders WHERE order_number = 'LAB-002-2024'), 'Glucose', '95', 'mg/dL', '70-100 mg/dL', 'completed', 'Within normal limits', false, '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 11:30:00'),
((SELECT id FROM lab_orders WHERE order_number = 'LAB-002-2024'), 'Creatinine', '1.0', 'mg/dL', '0.6-1.2 mg/dL', 'completed', 'Within normal limits', false, '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 11:30:00'),
((SELECT id FROM lab_orders WHERE order_number = 'LAB-004-2024'), 'COVID-19 PCR', 'Negative', 'N/A', 'Negative/Positive', 'completed', 'No SARS-CoV-2 detected', false, '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '2024-01-16 16:00:00');

-- Seed Lab Bookings (sample data)
INSERT INTO lab_bookings (patient_id, lab_order_id, booking_date, booking_time, status, notes) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM lab_orders WHERE order_number = 'LAB-001-2024'), '2024-01-15', '10:00:00', 'completed', 'Routine blood work'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM lab_orders WHERE order_number = 'LAB-002-2024'), '2024-01-15', '10:00:00', 'completed', 'Fasting blood work'),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM lab_orders WHERE order_number = 'LAB-003-2024'), '2024-01-16', '09:30:00', 'scheduled', 'Liver function tests'),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM lab_orders WHERE order_number = 'LAB-004-2024'), '2024-01-16', '15:00:00', 'completed', 'COVID-19 screening'),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM lab_orders WHERE order_number = 'LAB-005-2024'), '2024-01-17', '11:00:00', 'scheduled', 'Fasting lipid panel');
