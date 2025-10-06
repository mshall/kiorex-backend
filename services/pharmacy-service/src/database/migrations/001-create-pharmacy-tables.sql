-- Medications Table
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  generic_name VARCHAR(200),
  dosage_form VARCHAR(100) NOT NULL,
  strength VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(200),
  ndc_code VARCHAR(20) UNIQUE,
  description TEXT,
  category VARCHAR(100),
  is_prescription BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  medication_id UUID REFERENCES medications(id),
  prescription_number VARCHAR(50) UNIQUE NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100),
  instructions TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  prescribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  refills_remaining INTEGER DEFAULT 0,
  refills_authorized INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescription Refills Table
CREATE TABLE prescription_refills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  refill_number INTEGER NOT NULL,
  dispensed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dispensed_by UUID NOT NULL,
  quantity_dispensed INTEGER NOT NULL,
  days_supply INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE pharmacy_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medications(id),
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  unit_cost DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  supplier VARCHAR(200),
  batch_number VARCHAR(100),
  expiry_date DATE,
  location VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication Allergies Table
CREATE TABLE medication_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  medication_id UUID REFERENCES medications(id),
  allergy_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  reaction_description TEXT,
  onset_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drug Interactions Table
CREATE TABLE drug_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication1_id UUID REFERENCES medications(id),
  medication2_id UUID REFERENCES medications(id),
  interaction_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  description TEXT,
  clinical_effect TEXT,
  management TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescription History Table
CREATE TABLE prescription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  performed_by UUID NOT NULL,
  performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX idx_medications_name ON medications(name);
CREATE INDEX idx_medications_generic_name ON medications(generic_name);
CREATE INDEX idx_medications_ndc_code ON medications(ndc_code);
CREATE INDEX idx_medications_category ON medications(category);
CREATE INDEX idx_medications_is_active ON medications(is_active);

CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_provider_id ON prescriptions(provider_id);
CREATE INDEX idx_prescriptions_medication_id ON prescriptions(medication_id);
CREATE INDEX idx_prescriptions_prescription_number ON prescriptions(prescription_number);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_prescribed_at ON prescriptions(prescribed_at);

CREATE INDEX idx_prescription_refills_prescription_id ON prescription_refills(prescription_id);
CREATE INDEX idx_prescription_refills_dispensed_at ON prescription_refills(dispensed_at);

CREATE INDEX idx_pharmacy_inventory_medication_id ON pharmacy_inventory(medication_id);
CREATE INDEX idx_pharmacy_inventory_is_active ON pharmacy_inventory(is_active);
CREATE INDEX idx_pharmacy_inventory_expiry_date ON pharmacy_inventory(expiry_date);

CREATE INDEX idx_medication_allergies_patient_id ON medication_allergies(patient_id);
CREATE INDEX idx_medication_allergies_medication_id ON medication_allergies(medication_id);
CREATE INDEX idx_medication_allergies_is_active ON medication_allergies(is_active);

CREATE INDEX idx_drug_interactions_medication1_id ON drug_interactions(medication1_id);
CREATE INDEX idx_drug_interactions_medication2_id ON drug_interactions(medication2_id);
CREATE INDEX idx_drug_interactions_is_active ON drug_interactions(is_active);

CREATE INDEX idx_prescription_history_prescription_id ON prescription_history(prescription_id);
CREATE INDEX idx_prescription_history_performed_at ON prescription_history(performed_at);
