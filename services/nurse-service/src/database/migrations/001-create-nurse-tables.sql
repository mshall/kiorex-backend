-- Create Nurse Service Database Schema
-- Migration: 001-create-nurse-tables.sql

-- Create nurse_shifts table
CREATE TABLE IF NOT EXISTS nurse_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nurse_id UUID NOT NULL,
    nurse_name VARCHAR(255) NOT NULL,
    shift_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('day', 'evening', 'night', 'rotating')),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    actual_start_time TIME,
    actual_end_time TIME,
    unit VARCHAR(100),
    floor VARCHAR(50),
    ward VARCHAR(50),
    patient_count INTEGER,
    notes TEXT,
    handover_notes TEXT,
    assigned_patients JSONB,
    tasks JSONB,
    medications JSONB,
    vitals JSONB,
    incidents JSONB,
    supervisor_id UUID,
    supervisor_name VARCHAR(255),
    break_start_time TIME,
    break_end_time TIME,
    break_duration INTEGER,
    overtime_hours DECIMAL(5,2),
    overtime_reason TEXT,
    cancelled_by UUID,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patient_care table
CREATE TABLE IF NOT EXISTS patient_care (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    nurse_id UUID NOT NULL,
    nurse_name VARCHAR(255) NOT NULL,
    care_type VARCHAR(50) NOT NULL CHECK (care_type IN ('medication', 'vitals', 'hygiene', 'mobility', 'nutrition', 'emotional', 'education', 'assessment', 'procedure', 'emergency')),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'missed')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'critical')),
    scheduled_time TIMESTAMP NOT NULL,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    description TEXT NOT NULL,
    instructions TEXT,
    notes TEXT,
    outcome TEXT,
    medications JSONB,
    vitals JSONB,
    assessments JSONB,
    procedures JSONB,
    education JSONB,
    family_communication JSONB,
    equipment JSONB,
    safety_checks JSONB,
    supervisor_id UUID,
    supervisor_name VARCHAR(255),
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    duration INTEGER,
    requires_follow_up BOOLEAN DEFAULT FALSE,
    follow_up_time TIMESTAMP,
    follow_up_notes TEXT,
    incident_reported BOOLEAN DEFAULT FALSE,
    incident_description TEXT,
    incident_severity VARCHAR(50) CHECK (incident_severity IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nurse_notes table
CREATE TABLE IF NOT EXISTS nurse_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    nurse_id UUID NOT NULL,
    nurse_name VARCHAR(255) NOT NULL,
    note_type VARCHAR(50) NOT NULL CHECK (note_type IN ('assessment', 'care_plan', 'progress', 'medication', 'vitals', 'incident', 'handover', 'education', 'family', 'discharge')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    content TEXT NOT NULL,
    summary TEXT,
    tags JSONB,
    attachments JSONB,
    related_care JSONB,
    vital_signs JSONB,
    medications JSONB,
    assessments JSONB,
    interventions JSONB,
    patient_response JSONB,
    family_communication JSONB,
    safety_concerns JSONB,
    care_plan_updates JSONB,
    requires_follow_up BOOLEAN DEFAULT FALSE,
    follow_up_time TIMESTAMP,
    follow_up_notes TEXT,
    requires_supervisor_review BOOLEAN DEFAULT FALSE,
    supervisor_id UUID,
    supervisor_name VARCHAR(255),
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    review_comments TEXT,
    is_confidential BOOLEAN DEFAULT FALSE,
    is_draft BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nurse_schedules table
CREATE TABLE IF NOT EXISTS nurse_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nurse_id UUID NOT NULL,
    nurse_name VARCHAR(255) NOT NULL,
    schedule_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'scheduled', 'blocked', 'vacation', 'sick_leave', 'training')),
    type VARCHAR(50) NOT NULL DEFAULT 'regular' CHECK (type IN ('regular', 'overtime', 'on_call', 'float', 'preceptor', 'charge')),
    start_time TIME,
    end_time TIME,
    unit VARCHAR(100),
    floor VARCHAR(50),
    ward VARCHAR(50),
    patient_load INTEGER,
    notes TEXT,
    responsibilities JSONB,
    competencies JSONB,
    assignments JSONB,
    breaks JSONB,
    training JSONB,
    meetings JSONB,
    hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2),
    pay_rate DECIMAL(8,2),
    total_pay DECIMAL(8,2),
    supervisor_id UUID,
    supervisor_name VARCHAR(255),
    scheduled_by UUID,
    scheduled_at TIMESTAMP,
    confirmed_by UUID,
    confirmed_at TIMESTAMP,
    declined_by UUID,
    declined_at TIMESTAMP,
    decline_reason TEXT,
    cancelled_by UUID,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    recurring_pattern JSONB,
    exceptions JSONB,
    is_on_call BOOLEAN DEFAULT FALSE,
    is_float BOOLEAN DEFAULT FALSE,
    is_charge BOOLEAN DEFAULT FALSE,
    is_preceptor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nurse_shifts_nurse_id ON nurse_shifts(nurse_id);
CREATE INDEX IF NOT EXISTS idx_nurse_shifts_shift_date ON nurse_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_nurse_shifts_status ON nurse_shifts(status);
CREATE INDEX IF NOT EXISTS idx_nurse_shifts_type ON nurse_shifts(type);

CREATE INDEX IF NOT EXISTS idx_patient_care_patient_id ON patient_care(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_care_nurse_id ON patient_care(nurse_id);
CREATE INDEX IF NOT EXISTS idx_patient_care_care_type ON patient_care(care_type);
CREATE INDEX IF NOT EXISTS idx_patient_care_status ON patient_care(status);
CREATE INDEX IF NOT EXISTS idx_patient_care_scheduled_time ON patient_care(scheduled_time);

CREATE INDEX IF NOT EXISTS idx_nurse_notes_patient_id ON nurse_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_nurse_notes_nurse_id ON nurse_notes(nurse_id);
CREATE INDEX IF NOT EXISTS idx_nurse_notes_note_type ON nurse_notes(note_type);
CREATE INDEX IF NOT EXISTS idx_nurse_notes_priority ON nurse_notes(priority);
CREATE INDEX IF NOT EXISTS idx_nurse_notes_created_at ON nurse_notes(created_at);

CREATE INDEX IF NOT EXISTS idx_nurse_schedules_nurse_id ON nurse_schedules(nurse_id);
CREATE INDEX IF NOT EXISTS idx_nurse_schedules_schedule_date ON nurse_schedules(schedule_date);
CREATE INDEX IF NOT EXISTS idx_nurse_schedules_status ON nurse_schedules(status);
CREATE INDEX IF NOT EXISTS idx_nurse_schedules_type ON nurse_schedules(type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_nurse_shifts_updated_at BEFORE UPDATE ON nurse_shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patient_care_updated_at BEFORE UPDATE ON patient_care FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nurse_notes_updated_at BEFORE UPDATE ON nurse_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nurse_schedules_updated_at BEFORE UPDATE ON nurse_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
