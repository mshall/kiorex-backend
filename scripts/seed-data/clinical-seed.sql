-- Clinical Service Seed Data
-- Database: clinical_db

-- Insert medical records
INSERT INTO medical_records (id, patient_id, provider_id, record_type, title, description, diagnosis, treatment_plan, medications, allergies, vital_signs, notes, is_encrypted, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'consultation', 'Initial Consultation - Headache', 'Patient presented with persistent headaches', 'Tension headache', 'Rest, hydration, over-the-counter pain relief', '["Ibuprofen 400mg twice daily"]', '["Penicillin"]', '{"blood_pressure": "120/80", "heart_rate": 72, "temperature": 98.6}', 'Patient reports headaches for 3 days. No fever or neck stiffness.', false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'follow_up', 'Follow-up Visit - Headache', 'Follow-up on headache treatment', 'Tension headache - improving', 'Continue current treatment, monitor symptoms', '["Ibuprofen 400mg as needed"]', '["Penicillin"]', '{"blood_pressure": "118/78", "heart_rate": 70, "temperature": 98.4}', 'Patient reports improvement in headache frequency and intensity.', false, NOW(), NOW());

-- Insert prescriptions
INSERT INTO prescriptions (id, patient_id, provider_id, medication_name, dosage, frequency, duration_days, instructions, status, refills_remaining, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Ibuprofen', '400mg', 'Twice daily', 7, 'Take with food to avoid stomach upset', 'active', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Acetaminophen', '500mg', 'As needed', 14, 'Take every 6 hours as needed for pain', 'active', 1, NOW(), NOW());

-- Insert lab results
INSERT INTO lab_results (id, patient_id, provider_id, test_name, test_type, result_value, reference_range, units, status, notes, ordered_date, result_date, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Complete Blood Count', 'CBC', 'Normal', 'Normal range', 'N/A', 'completed', 'All values within normal limits', NOW() - INTERVAL '1 week', NOW() - INTERVAL '6 days', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Blood Glucose', 'Chemistry', '95', '70-100', 'mg/dL', 'completed', 'Fasting glucose within normal range', NOW() - INTERVAL '1 week', NOW() - INTERVAL '6 days', NOW(), NOW());

-- Insert clinical notes
INSERT INTO clinical_notes (id, patient_id, provider_id, note_type, subjective, objective, assessment, plan, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'soap', 'Patient reports persistent headaches for 3 days. Describes pain as dull, bilateral, moderate intensity. No fever, neck stiffness, or visual changes.', 'Vital signs stable. No neurological deficits. Head and neck examination normal. No signs of infection.', 'Tension headache likely secondary to stress and poor sleep hygiene.', '1. Ibuprofen 400mg BID with food\n2. Improve sleep hygiene\n3. Stress management techniques\n4. Follow up in 1 week if symptoms persist', NOW(), NOW());

-- Insert vitals
INSERT INTO vitals (id, patient_id, provider_id, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, temperature, weight, height, oxygen_saturation, respiratory_rate, notes, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 120, 80, 72, 98.6, 65.5, 165, 98, 16, 'Vital signs within normal limits', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 118, 78, 70, 98.4, 65.2, 165, 99, 15, 'Follow-up vitals - slight improvement', NOW(), NOW());

-- Insert allergies
INSERT INTO allergies (id, patient_id, allergen, reaction_type, severity, notes, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440003', 'Penicillin', 'Skin rash', 'moderate', 'Patient developed rash after taking penicillin 2 years ago', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440003', 'Shellfish', 'Nausea and vomiting', 'mild', 'Mild gastrointestinal reaction to shellfish', NOW(), NOW());

-- Insert medications
INSERT INTO medications (id, patient_id, medication_name, dosage, frequency, start_date, end_date, is_active, notes, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440003', 'Ibuprofen', '400mg', 'Twice daily', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week', true, 'For headache management', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440003', 'Multivitamin', '1 tablet', 'Once daily', NOW() - INTERVAL '1 month', NULL, true, 'Daily multivitamin supplement', NOW(), NOW());

-- Insert diagnoses
INSERT INTO diagnoses (id, patient_id, provider_id, icd10_code, diagnosis_name, description, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'G44.2', 'Tension-type headache', 'Episodic tension-type headache', 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Z00.00', 'Encounter for general adult medical examination', 'Routine health checkup', 'resolved', NOW(), NOW());
