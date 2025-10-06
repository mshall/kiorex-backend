-- Consultations Table
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  consultation_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  chief_complaint TEXT,
  consultation_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinical Notes Table
CREATE TABLE clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  note_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SOAP Notes Table
CREATE TABLE soap_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Assessments Table
CREATE TABLE patient_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL,
  findings TEXT,
  recommendations TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultation Diagnoses Table
CREATE TABLE consultation_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  diagnosis_code VARCHAR(20) NOT NULL,
  diagnosis_name VARCHAR(200) NOT NULL,
  diagnosis_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treatment Plans Table
CREATE TABLE treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  plan_name VARCHAR(200) NOT NULL,
  description TEXT,
  goals TEXT,
  interventions TEXT,
  follow_up_instructions TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follow-up Recommendations Table
CREATE TABLE follow_up_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  follow_up_type VARCHAR(50) NOT NULL,
  recommended_date DATE,
  urgency VARCHAR(20) NOT NULL,
  instructions TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vital Signs Table (for consultation-specific vital signs)
CREATE TABLE consultation_vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  temperature DECIMAL(4,1),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  oxygen_saturation DECIMAL(4,1),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  bmi DECIMAL(4,1),
  recorded_by UUID NOT NULL,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Consultation Prescriptions Table
CREATE TABLE consultation_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  medication_name VARCHAR(200) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100),
  instructions TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_consultations_appointment_id ON consultations(appointment_id);
CREATE INDEX idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX idx_consultations_provider_id ON consultations(provider_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_start_time ON consultations(start_time);
CREATE INDEX idx_consultations_consultation_type ON consultations(consultation_type);

CREATE INDEX idx_clinical_notes_consultation_id ON clinical_notes(consultation_id);
CREATE INDEX idx_clinical_notes_note_type ON clinical_notes(note_type);
CREATE INDEX idx_clinical_notes_created_at ON clinical_notes(created_at);

CREATE INDEX idx_soap_notes_consultation_id ON soap_notes(consultation_id);
CREATE INDEX idx_soap_notes_created_at ON soap_notes(created_at);

CREATE INDEX idx_patient_assessments_consultation_id ON patient_assessments(consultation_id);
CREATE INDEX idx_patient_assessments_assessment_type ON patient_assessments(assessment_type);

CREATE INDEX idx_consultation_diagnoses_consultation_id ON consultation_diagnoses(consultation_id);
CREATE INDEX idx_consultation_diagnoses_diagnosis_code ON consultation_diagnoses(diagnosis_code);
CREATE INDEX idx_consultation_diagnoses_status ON consultation_diagnoses(status);

CREATE INDEX idx_treatment_plans_consultation_id ON treatment_plans(consultation_id);
CREATE INDEX idx_treatment_plans_created_at ON treatment_plans(created_at);

CREATE INDEX idx_follow_up_recommendations_consultation_id ON follow_up_recommendations(consultation_id);
CREATE INDEX idx_follow_up_recommendations_status ON follow_up_recommendations(status);
CREATE INDEX idx_follow_up_recommendations_recommended_date ON follow_up_recommendations(recommended_date);

CREATE INDEX idx_consultation_vital_signs_consultation_id ON consultation_vital_signs(consultation_id);
CREATE INDEX idx_consultation_vital_signs_recorded_at ON consultation_vital_signs(recorded_at);

CREATE INDEX idx_consultation_prescriptions_consultation_id ON consultation_prescriptions(consultation_id);
CREATE INDEX idx_consultation_prescriptions_status ON consultation_prescriptions(status);
