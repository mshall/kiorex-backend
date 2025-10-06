-- Seed Consultations
INSERT INTO consultations (appointment_id, patient_id, provider_id, consultation_type, status, start_time, end_time, duration_minutes, chief_complaint, consultation_notes) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'General Consultation', 'completed', '2024-01-15 10:00:00', '2024-01-15 10:30:00', 30, 'Chest pain and shortness of breath', 'Patient presents with acute chest pain. Physical examination reveals normal vital signs. ECG shows no acute changes.'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Follow-up Consultation', 'completed', '2024-01-16 09:00:00', '2024-01-16 09:45:00', 45, 'Diabetes management follow-up', 'Patient reports good blood sugar control. HbA1c improved from 8.2% to 7.1%. Continue current medication regimen.'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Initial Consultation', 'completed', '2024-01-17 14:00:00', '2024-01-17 14:20:00', 20, 'Annual physical examination', 'Routine annual physical. All systems normal. Patient in good health.'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Specialist Consultation', 'in_progress', '2024-01-18 11:00:00', NULL, NULL, 'Cardiology consultation for chest pain', 'Patient referred for cardiology evaluation due to persistent chest pain.'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Emergency Consultation', 'completed', '2024-01-19 16:30:00', '2024-01-19 17:00:00', 30, 'Severe headache and nausea', 'Patient presents with severe headache and nausea. Blood pressure elevated. Started on antihypertensive medication.');

-- Seed Clinical Notes
INSERT INTO clinical_notes (consultation_id, note_type, content, created_by) VALUES
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'Assessment', 'Patient presents with acute chest pain. Pain is sharp, localized to left side, rated 7/10. No radiation to arm or jaw. No shortness of breath at rest.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'Plan', 'Ordered chest X-ray and ECG. Prescribed pain medication. Advised to return if symptoms worsen.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'), 'Assessment', 'Diabetes well controlled. Patient reports good adherence to medication and diet. Blood glucose logs show good control.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'), 'Plan', 'Continue current metformin regimen. Schedule next follow-up in 3 months. Order HbA1c test.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440003'), 'Assessment', 'Annual physical examination completed. All systems normal. Patient reports feeling well.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440003'), 'Plan', 'Continue routine care. Schedule next annual physical in 12 months.', '550e8400-e29b-41d4-a716-446655440002');

-- Seed SOAP Notes
INSERT INTO soap_notes (consultation_id, subjective, objective, assessment, plan, created_by) VALUES
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 
 'Patient reports sharp chest pain on left side, rated 7/10. Pain started 2 hours ago. No radiation to arm or jaw. No shortness of breath at rest. No nausea or vomiting.',
 'Vital signs: BP 120/80, HR 72, RR 16, Temp 98.6°F. Physical exam: Normal heart sounds, clear lungs, no chest wall tenderness. ECG shows normal sinus rhythm.',
 'Chest pain likely musculoskeletal in origin. No signs of acute cardiac event. Patient appears stable.',
 '1. Order chest X-ray to rule out pulmonary causes. 2. Prescribe ibuprofen 400mg TID for pain. 3. Advise patient to return if symptoms worsen. 4. Follow-up in 1 week if pain persists.'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'),
 'Patient reports good blood sugar control. Adherent to metformin 500mg BID. Following diabetic diet. No episodes of hypoglycemia.',
 'Vital signs: BP 118/76, HR 68, RR 14. Physical exam: No diabetic complications noted. HbA1c 7.1% (down from 8.2% 3 months ago).',
 'Type 2 diabetes mellitus, well controlled. Good adherence to treatment plan.',
 '1. Continue metformin 500mg BID. 2. Order HbA1c in 3 months. 3. Continue diabetic diet and exercise. 4. Follow-up in 3 months.'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440003'),
 'Patient reports feeling well. No acute complaints. Here for routine annual physical examination.',
 'Vital signs: BP 110/70, HR 65, RR 12, Temp 98.4°F. Physical exam: All systems normal. No abnormalities detected.',
 'Healthy adult male. No acute issues identified.',
 '1. Continue routine care. 2. Schedule next annual physical in 12 months. 3. Continue current lifestyle habits.');

-- Seed Patient Assessments
INSERT INTO patient_assessments (consultation_id, assessment_type, findings, recommendations, created_by) VALUES
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'Cardiovascular', 'Normal heart sounds, regular rhythm. No murmurs or gallops. Peripheral pulses intact.', 'Continue monitoring. Consider stress test if symptoms persist.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'Respiratory', 'Clear to auscultation bilaterally. No wheezes, rales, or rhonchi. Normal respiratory effort.', 'No respiratory intervention needed at this time.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'), 'Endocrine', 'No signs of diabetic complications. No diabetic retinopathy, nephropathy, or neuropathy.', 'Continue current diabetes management. Monitor for complications.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440003'), 'General', 'Well-appearing adult male in no acute distress. All systems normal on examination.', 'Continue routine health maintenance.', '550e8400-e29b-41d4-a716-446655440002');

-- Seed Consultation Diagnoses
INSERT INTO consultation_diagnoses (consultation_id, diagnosis_code, diagnosis_name, diagnosis_type, status, notes, created_by) VALUES
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'R06.02', 'Shortness of breath', 'Primary', 'active', 'Acute onset, likely musculoskeletal', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'R50.9', 'Fever, unspecified', 'Secondary', 'active', 'Low-grade fever noted', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'), 'E11.9', 'Type 2 diabetes mellitus without complications', 'Primary', 'active', 'Well controlled on metformin', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440003'), 'Z00.00', 'Encounter for general adult medical examination without abnormal findings', 'Primary', 'active', 'Routine annual physical', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440005'), 'I10', 'Essential hypertension', 'Primary', 'active', 'Newly diagnosed hypertension', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440005'), 'R51', 'Headache', 'Secondary', 'active', 'Severe headache, likely related to hypertension', '550e8400-e29b-41d4-a716-446655440002');

-- Seed Treatment Plans
INSERT INTO treatment_plans (consultation_id, plan_name, description, goals, interventions, follow_up_instructions, created_by) VALUES
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'Chest Pain Management', 'Management of acute chest pain', 'Relieve pain and identify cause', '1. Pain medication (ibuprofen). 2. Chest X-ray. 3. ECG monitoring. 4. Rest and observation.', 'Return if symptoms worsen. Follow-up in 1 week if pain persists.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'), 'Diabetes Management', 'Ongoing diabetes care and monitoring', 'Maintain good blood sugar control', '1. Continue metformin. 2. Diabetic diet. 3. Regular exercise. 4. Blood glucose monitoring.', 'Follow-up in 3 months. Check HbA1c. Continue current regimen.', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440005'), 'Hypertension Management', 'Newly diagnosed hypertension treatment', 'Control blood pressure and prevent complications', '1. Start lisinopril 10mg daily. 2. Low sodium diet. 3. Regular exercise. 4. Blood pressure monitoring.', 'Follow-up in 2 weeks. Monitor blood pressure daily. Return if severe headache occurs.', '550e8400-e29b-41d4-a716-446655440002');

-- Seed Follow-up Recommendations
INSERT INTO follow_up_recommendations (consultation_id, follow_up_type, recommended_date, urgency, instructions, status, created_by) VALUES
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'Follow-up Visit', '2024-01-22', 'Routine', 'Return if chest pain worsens or new symptoms develop', 'pending', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'), 'Diabetes Follow-up', '2024-04-16', 'Routine', '3-month diabetes follow-up with HbA1c check', 'pending', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440003'), 'Annual Physical', '2025-01-17', 'Routine', 'Next annual physical examination', 'pending', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440005'), 'Hypertension Follow-up', '2024-02-02', 'Urgent', '2-week follow-up for blood pressure control', 'pending', '550e8400-e29b-41d4-a716-446655440002');

-- Seed Consultation Vital Signs
INSERT INTO consultation_vital_signs (consultation_id, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, weight, height, bmi, recorded_by) VALUES
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 98.6, 120, 80, 72, 16, 98.5, 70.5, 175.0, 23.0, '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'), 98.4, 118, 76, 68, 14, 99.0, 75.2, 180.0, 23.2, '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440003'), 98.4, 110, 70, 65, 12, 99.2, 80.0, 185.0, 23.4, '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440005'), 98.8, 160, 95, 85, 18, 97.5, 85.0, 180.0, 26.2, '550e8400-e29b-41d4-a716-446655440002');

-- Seed Consultation Prescriptions
INSERT INTO consultation_prescriptions (consultation_id, medication_name, dosage, frequency, duration, instructions, status, created_by) VALUES
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440001'), 'Ibuprofen', '400mg', 'Three times daily', '7 days', 'Take with food to reduce stomach irritation', 'active', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440002'), 'Metformin', '500mg', 'Twice daily', 'Ongoing', 'Take with meals to reduce gastrointestinal side effects', 'active', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440005'), 'Lisinopril', '10mg', 'Once daily', 'Ongoing', 'Take at the same time each day. Monitor blood pressure regularly', 'active', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM consultations WHERE appointment_id = '550e8400-e29b-41d4-a716-446655440005'), 'Acetaminophen', '500mg', 'As needed', '7 days', 'Take for headache as needed, maximum 4 times per day', 'active', '550e8400-e29b-41d4-a716-446655440002');
