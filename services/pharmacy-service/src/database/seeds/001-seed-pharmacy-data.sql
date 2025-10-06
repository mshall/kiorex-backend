-- Seed Medications
INSERT INTO medications (name, generic_name, dosage_form, strength, manufacturer, ndc_code, description, category, is_prescription) VALUES
('Tylenol', 'Acetaminophen', 'Tablet', '500mg', 'Johnson & Johnson', '50580-123-01', 'Pain relief and fever reducer', 'Analgesic', false),
('Advil', 'Ibuprofen', 'Tablet', '200mg', 'Pfizer', '50580-456-02', 'Anti-inflammatory pain reliever', 'NSAID', false),
('Lisinopril', 'Lisinopril', 'Tablet', '10mg', 'Generic Pharma', '12345-678-90', 'ACE inhibitor for blood pressure', 'Antihypertensive', true),
('Metformin', 'Metformin', 'Tablet', '500mg', 'Generic Pharma', '12345-678-91', 'Diabetes medication', 'Antidiabetic', true),
('Atorvastatin', 'Atorvastatin', 'Tablet', '20mg', 'Generic Pharma', '12345-678-92', 'Cholesterol lowering medication', 'Statin', true),
('Omeprazole', 'Omeprazole', 'Capsule', '20mg', 'Generic Pharma', '12345-678-93', 'Proton pump inhibitor for acid reflux', 'PPI', true),
('Amlodipine', 'Amlodipine', 'Tablet', '5mg', 'Generic Pharma', '12345-678-94', 'Calcium channel blocker for blood pressure', 'Antihypertensive', true),
('Levothyroxine', 'Levothyroxine', 'Tablet', '50mcg', 'Generic Pharma', '12345-678-95', 'Thyroid hormone replacement', 'Hormone', true),
('Warfarin', 'Warfarin', 'Tablet', '5mg', 'Generic Pharma', '12345-678-96', 'Anticoagulant blood thinner', 'Anticoagulant', true),
('Furosemide', 'Furosemide', 'Tablet', '40mg', 'Generic Pharma', '12345-678-97', 'Loop diuretic for fluid retention', 'Diuretic', true);

-- Seed Prescriptions
INSERT INTO prescriptions (patient_id, provider_id, medication_id, prescription_number, dosage, frequency, duration, instructions, status, prescribed_at, expires_at, refills_remaining, refills_authorized) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM medications WHERE name = 'Lisinopril'), 'RX-001-2024', '10mg', 'Once daily', '30 days', 'Take with or without food', 'active', '2024-01-15 09:00:00', '2024-02-15 09:00:00', 2, 3),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM medications WHERE name = 'Metformin'), 'RX-002-2024', '500mg', 'Twice daily', '30 days', 'Take with meals', 'active', '2024-01-15 09:00:00', '2024-02-15 09:00:00', 1, 3),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM medications WHERE name = 'Atorvastatin'), 'RX-003-2024', '20mg', 'Once daily', '30 days', 'Take in the evening', 'active', '2024-01-16 10:30:00', '2024-02-16 10:30:00', 3, 3),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM medications WHERE name = 'Omeprazole'), 'RX-004-2024', '20mg', 'Once daily', '30 days', 'Take before breakfast', 'active', '2024-01-16 10:30:00', '2024-02-16 10:30:00', 2, 3),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM medications WHERE name = 'Amlodipine'), 'RX-005-2024', '5mg', 'Once daily', '30 days', 'Take with or without food', 'completed', '2024-01-10 14:00:00', '2024-02-10 14:00:00', 0, 3);

-- Seed Prescription Refills
INSERT INTO prescription_refills (prescription_id, refill_number, dispensed_at, dispensed_by, quantity_dispensed, days_supply, notes) VALUES
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-001-2024'), 1, '2024-01-15 10:00:00', '550e8400-e29b-41d4-a716-446655440010', 30, 30, 'Initial fill'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-002-2024'), 1, '2024-01-15 10:00:00', '550e8400-e29b-41d4-a716-446655440010', 60, 30, 'Initial fill - 2 tablets daily'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-003-2024'), 1, '2024-01-16 11:00:00', '550e8400-e29b-41d4-a716-446655440010', 30, 30, 'Initial fill'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-004-2024'), 1, '2024-01-16 11:00:00', '550e8400-e29b-41d4-a716-446655440010', 30, 30, 'Initial fill'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-005-2024'), 1, '2024-01-10 15:00:00', '550e8400-e29b-41d4-a716-446655440010', 30, 30, 'Initial fill'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-005-2024'), 2, '2024-01-20 15:00:00', '550e8400-e29b-41d4-a716-446655440010', 30, 30, 'First refill'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-005-2024'), 3, '2024-01-30 15:00:00', '550e8400-e29b-41d4-a716-446655440010', 30, 30, 'Second refill');

-- Seed Pharmacy Inventory
INSERT INTO pharmacy_inventory (medication_id, quantity_on_hand, quantity_reserved, unit_cost, selling_price, supplier, batch_number, expiry_date, location) VALUES
((SELECT id FROM medications WHERE name = 'Tylenol'), 500, 50, 0.25, 0.50, 'Johnson & Johnson', 'TYL2024001', '2025-12-31', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Advil'), 300, 30, 0.30, 0.60, 'Pfizer', 'ADV2024001', '2025-11-30', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Lisinopril'), 200, 20, 0.15, 0.30, 'Generic Pharma', 'LIS2024001', '2025-10-31', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Metformin'), 400, 40, 0.20, 0.40, 'Generic Pharma', 'MET2024001', '2025-09-30', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Atorvastatin'), 150, 15, 0.35, 0.70, 'Generic Pharma', 'ATO2024001', '2025-08-31', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Omeprazole'), 250, 25, 0.25, 0.50, 'Generic Pharma', 'OME2024001', '2025-07-31', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Amlodipine'), 180, 18, 0.18, 0.36, 'Generic Pharma', 'AML2024001', '2025-06-30', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Levothyroxine'), 120, 12, 0.22, 0.44, 'Generic Pharma', 'LEV2024001', '2025-05-31', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Warfarin'), 80, 8, 0.40, 0.80, 'Generic Pharma', 'WAR2024001', '2025-04-30', 'Main Pharmacy'),
((SELECT id FROM medications WHERE name = 'Furosemide'), 100, 10, 0.12, 0.24, 'Generic Pharma', 'FUR2024001', '2025-03-31', 'Main Pharmacy');

-- Seed Medication Allergies
INSERT INTO medication_allergies (patient_id, medication_id, allergy_type, severity, reaction_description, onset_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM medications WHERE name = 'Penicillin'), 'Drug Allergy', 'Severe', 'Hives and difficulty breathing', '2023-06-15'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM medications WHERE name = 'Sulfa'), 'Drug Allergy', 'Moderate', 'Skin rash and itching', '2023-08-20'),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM medications WHERE name = 'Aspirin'), 'Drug Allergy', 'Severe', 'Anaphylactic reaction', '2023-05-10'),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM medications WHERE name = 'Codeine'), 'Drug Allergy', 'Moderate', 'Nausea and vomiting', '2023-07-25');

-- Seed Drug Interactions
INSERT INTO drug_interactions (medication1_id, medication2_id, interaction_type, severity, description, clinical_effect, management) VALUES
((SELECT id FROM medications WHERE name = 'Warfarin'), (SELECT id FROM medications WHERE name = 'Aspirin'), 'Drug-Drug Interaction', 'Severe', 'Increased bleeding risk', 'Increased risk of bleeding and bruising', 'Monitor INR closely, consider alternative pain management'),
((SELECT id FROM medications WHERE name = 'Lisinopril'), (SELECT id FROM medications WHERE name = 'Furosemide'), 'Drug-Drug Interaction', 'Moderate', 'Increased risk of kidney problems', 'Potential for kidney function impairment', 'Monitor kidney function and electrolytes'),
((SELECT id FROM medications WHERE name = 'Metformin'), (SELECT id FROM medications WHERE name = 'Furosemide'), 'Drug-Drug Interaction', 'Moderate', 'Increased risk of lactic acidosis', 'Potential for lactic acidosis', 'Monitor for signs of lactic acidosis'),
((SELECT id FROM medications WHERE name = 'Atorvastatin'), (SELECT id FROM medications WHERE name = 'Warfarin'), 'Drug-Drug Interaction', 'Moderate', 'Increased bleeding risk', 'May increase warfarin effects', 'Monitor INR and bleeding parameters');

-- Seed Prescription History
INSERT INTO prescription_history (prescription_id, action, performed_by, performed_at, notes, metadata) VALUES
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-001-2024'), 'created', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 09:00:00', 'Prescription created', '{"dosage": "10mg", "frequency": "Once daily"}'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-001-2024'), 'dispensed', '550e8400-e29b-41d4-a716-446655440010', '2024-01-15 10:00:00', 'Initial fill dispensed', '{"quantity": 30, "days_supply": 30}'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-002-2024'), 'created', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 09:00:00', 'Prescription created', '{"dosage": "500mg", "frequency": "Twice daily"}'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-002-2024'), 'dispensed', '550e8400-e29b-41d4-a716-446655440010', '2024-01-15 10:00:00', 'Initial fill dispensed', '{"quantity": 60, "days_supply": 30}'),
((SELECT id FROM prescriptions WHERE prescription_number = 'RX-005-2024'), 'completed', '550e8400-e29b-41d4-a716-446655440010', '2024-01-30 15:00:00', 'Prescription completed - all refills used', '{"total_refills": 3, "final_status": "completed"}');
