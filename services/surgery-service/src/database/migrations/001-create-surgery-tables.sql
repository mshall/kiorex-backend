-- Create Surgery Service Database Schema
-- Migration: 001-create-surgery-tables.sql

-- Create surgeries table
CREATE TABLE IF NOT EXISTS surgeries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    surgeon_id UUID NOT NULL,
    appointment_id UUID,
    procedure_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('elective', 'emergency', 'urgent')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('cardiac', 'neurosurgery', 'orthopedic', 'general', 'plastic', 'urology', 'gynecology', 'oncology', 'pediatric', 'trauma')),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
    scheduled_date TIMESTAMP NOT NULL,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    estimated_duration INTEGER,
    actual_duration INTEGER,
    operating_room VARCHAR(100),
    description TEXT,
    preoperative_notes TEXT,
    operative_notes TEXT,
    postoperative_notes TEXT,
    complications TEXT,
    anesthesia TEXT,
    blood_loss TEXT,
    specimens TEXT,
    team_members JSONB,
    equipment JSONB,
    medications JSONB,
    complications_list JSONB,
    follow_up_instructions JSONB,
    cost DECIMAL(10,2),
    insurance_coverage VARCHAR(255),
    prior_authorization VARCHAR(255),
    consent_form VARCHAR(255),
    preoperative_checklist VARCHAR(255),
    postoperative_checklist VARCHAR(255),
    discharge_instructions VARCHAR(255),
    follow_up_date DATE,
    cancelled_by UUID,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    postponed_by UUID,
    postponed_at TIMESTAMP,
    postponement_reason TEXT,
    rescheduled_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create surgery_teams table
CREATE TABLE IF NOT EXISTS surgery_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgery_id UUID NOT NULL,
    member_id UUID NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('surgeon', 'assistant_surgeon', 'anesthesiologist', 'nurse', 'technician', 'resident', 'intern', 'observer')),
    specialty VARCHAR(100),
    license_number VARCHAR(100),
    contact_info VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    assigned_by UUID,
    assigned_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    declined_at TIMESTAMP,
    decline_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create surgery_rooms table
CREATE TABLE IF NOT EXISTS surgery_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('operating_room', 'recovery_room', 'prep_room', 'holding_room')),
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'out_of_order')),
    description TEXT,
    equipment JSONB,
    capabilities JSONB,
    capacity INTEGER,
    size DECIMAL(8,2),
    floor VARCHAR(50),
    wing VARCHAR(50),
    building VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    maintenance_schedule JSONB,
    availability JSONB,
    hourly_rate DECIMAL(10,2),
    restrictions JSONB,
    special_requirements JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create surgery_schedules table
CREATE TABLE IF NOT EXISTS surgery_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    surgeon_id UUID,
    surgery_id UUID,
    scheduled_date TIMESTAMP NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked', 'maintenance')),
    notes TEXT,
    blocked_by UUID,
    blocked_at TIMESTAMP,
    block_reason TEXT,
    unblocked_by UUID,
    unblocked_at TIMESTAMP,
    recurring_pattern JSONB,
    exceptions JSONB,
    cost DECIMAL(10,2),
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surgeries_patient_id ON surgeries(patient_id);
CREATE INDEX IF NOT EXISTS idx_surgeries_surgeon_id ON surgeries(surgeon_id);
CREATE INDEX IF NOT EXISTS idx_surgeries_status ON surgeries(status);
CREATE INDEX IF NOT EXISTS idx_surgeries_scheduled_date ON surgeries(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_surgeries_type ON surgeries(type);
CREATE INDEX IF NOT EXISTS idx_surgeries_category ON surgeries(category);

CREATE INDEX IF NOT EXISTS idx_surgery_teams_surgery_id ON surgery_teams(surgery_id);
CREATE INDEX IF NOT EXISTS idx_surgery_teams_member_id ON surgery_teams(member_id);
CREATE INDEX IF NOT EXISTS idx_surgery_teams_role ON surgery_teams(role);

CREATE INDEX IF NOT EXISTS idx_surgery_rooms_room_number ON surgery_rooms(room_number);
CREATE INDEX IF NOT EXISTS idx_surgery_rooms_status ON surgery_rooms(status);
CREATE INDEX IF NOT EXISTS idx_surgery_rooms_type ON surgery_rooms(type);

CREATE INDEX IF NOT EXISTS idx_surgery_schedules_room_id ON surgery_schedules(room_id);
CREATE INDEX IF NOT EXISTS idx_surgery_schedules_surgeon_id ON surgery_schedules(surgeon_id);
CREATE INDEX IF NOT EXISTS idx_surgery_schedules_scheduled_date ON surgery_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_surgery_schedules_status ON surgery_schedules(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_surgeries_updated_at BEFORE UPDATE ON surgeries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_surgery_teams_updated_at BEFORE UPDATE ON surgery_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_surgery_rooms_updated_at BEFORE UPDATE ON surgery_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_surgery_schedules_updated_at BEFORE UPDATE ON surgery_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
