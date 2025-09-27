-- Healthcare Platform Complete Database Setup with Test Data
-- This script creates all tables and populates them with comprehensive test data

-- =====================================================
-- AUTH DATABASE SCHEMA
-- =====================================================

\c auth_db;

-- User Authentication Table
CREATE TABLE IF NOT EXISTS user_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone_number VARCHAR(20) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'patient',
    provider VARCHAR(50) NOT NULL DEFAULT 'local',
    provider_id VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    phone_verification_code VARCHAR(10),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMPTZ,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    permissions TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    lock_reason TEXT,
    locked_until TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login TIMESTAMPTZ,
    last_password_change TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_user_auth_email ON user_auth(email);
CREATE INDEX idx_user_auth_phone ON user_auth(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX idx_user_auth_role ON user_auth(role);
CREATE INDEX idx_user_auth_provider ON user_auth(provider, provider_id);

-- =====================================================
-- USERS DATABASE SCHEMA
-- =====================================================

\c users_db;

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_type VARCHAR(5),
    avatar_url TEXT,
    bio TEXT,
    specialization VARCHAR(255),
    license_number VARCHAR(100),
    years_of_experience INTEGER,
    consultation_fee DECIMAL(10, 2),
    languages TEXT[],
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    insurance_provider VARCHAR(200),
    insurance_policy_number VARCHAR(100),
    allergies TEXT[],
    chronic_conditions TEXT[],
    current_medications TEXT[],
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Addresses Table
CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    street_address VARCHAR(255),
    apartment VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- APPOINTMENTS DATABASE SCHEMA
-- =====================================================

\c appointments_db;

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    appointment_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    reason TEXT,
    symptoms TEXT[],
    notes TEXT,
    video_url TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    rescheduled_from UUID,
    follow_up_required BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Appointment Slots Table
CREATE TABLE IF NOT EXISTS appointment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    appointment_id UUID,
    slot_type VARCHAR(50),
    max_bookings INTEGER DEFAULT 1,
    current_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PAYMENTS DATABASE SCHEMA
-- =====================================================

\c payments_db;

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    appointment_id UUID,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_method_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    description TEXT,
    receipt_url TEXT,
    refunded_amount DECIMAL(10, 2) DEFAULT 0,
    failure_reason TEXT,
    paid_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    payment_id UUID,
    appointment_id UUID,
    amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    due_date DATE,
    paid_date DATE,
    items JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CLINICAL DATABASE SCHEMA
-- =====================================================

\c clinical_db;

-- Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    appointment_id UUID,
    record_type VARCHAR(100) NOT NULL,
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    past_medical_history TEXT,
    family_history TEXT,
    social_history TEXT,
    review_of_systems JSONB,
    physical_examination JSONB,
    vital_signs JSONB,
    assessment TEXT,
    plan TEXT,
    diagnosis_codes TEXT[],
    procedure_codes TEXT[],
    attachments JSONB,
    is_confidential BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    medical_record_id UUID,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    quantity INTEGER,
    refills INTEGER DEFAULT 0,
    instructions TEXT,
    pharmacy_id UUID,
    status VARCHAR(50) DEFAULT 'active',
    prescribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    filled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Lab Results Table
CREATE TABLE IF NOT EXISTS lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    medical_record_id UUID,
    lab_name VARCHAR(255),
    test_name VARCHAR(255) NOT NULL,
    test_code VARCHAR(100),
    result_value TEXT,
    result_unit VARCHAR(50),
    reference_range VARCHAR(100),
    abnormal_flag VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pending',
    ordered_at TIMESTAMPTZ,
    collected_at TIMESTAMPTZ,
    resulted_at TIMESTAMPTZ,
    notes TEXT,
    attachments JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NOTIFICATIONS DATABASE SCHEMA
-- =====================================================

\c notifications_db;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    subject VARCHAR(500),
    content TEXT NOT NULL,
    template_id VARCHAR(100),
    template_data JSONB,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    appointment_reminders BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    news_updates BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INSERT TEST DATA
-- =====================================================

-- Sample Auth Users
\c auth_db;

INSERT INTO user_auth (email, password, phone_number, role, email_verified, phone_verified, mfa_enabled)
VALUES 
('admin@healthcare.com', '$2b$10$YourHashedPasswordHere', '+1234567890', 'super_admin', true, true, true),
('dr.smith@healthcare.com', '$2b$10$YourHashedPasswordHere', '+1234567891', 'doctor', true, true, false),
('dr.johnson@healthcare.com', '$2b$10$YourHashedPasswordHere', '+1234567892', 'doctor', true, true, true),
('nurse.williams@healthcare.com', '$2b$10$YourHashedPasswordHere', '+1234567893', 'nurse', true, true, false),
('john.doe@example.com', '$2b$10$YourHashedPasswordHere', '+1234567894', 'patient', true, false, false),
('jane.smith@example.com', '$2b$10$YourHashedPasswordHere', '+1234567895', 'patient', true, true, true),
('robert.johnson@example.com', '$2b$10$YourHashedPasswordHere', '+1234567896', 'patient', true, false, false),
('maria.garcia@example.com', '$2b$10$YourHashedPasswordHere', '+1234567897', 'patient', true, true, false),
('david.wilson@example.com', '$2b$10$YourHashedPasswordHere', '+1234567898', 'patient', true, false, false),
('sarah.brown@example.com', '$2b$10$YourHashedPasswordHere', '+1234567899', 'patient', true, true, true);

-- Sample User Profiles
\c users_db;

-- Get auth_ids from auth_db (in real scenario, you'd use proper IDs)
INSERT INTO user_profiles (
    auth_id, first_name, last_name, date_of_birth, gender, blood_type,
    specialization, license_number, years_of_experience, consultation_fee
)
VALUES 
(gen_random_uuid(), 'Admin', 'User', '1980-01-01', 'Other', 'O+', NULL, NULL, NULL, NULL),
(gen_random_uuid(), 'John', 'Smith', '1975-05-15', 'Male', 'A+', 'Cardiology', 'MD12345', 20, 250.00),
(gen_random_uuid(), 'Emily', 'Johnson', '1978-08-22', 'Female', 'B+', 'Pediatrics', 'MD67890', 15, 200.00),
(gen_random_uuid(), 'Mary', 'Williams', '1985-03-10', 'Female', 'O-', NULL, 'RN54321', 10, NULL),
(gen_random_uuid(), 'John', 'Doe', '1990-06-20', 'Male', 'AB+', NULL, NULL, NULL, NULL),
(gen_random_uuid(), 'Jane', 'Smith', '1988-12-05', 'Female', 'A-', NULL, NULL, NULL, NULL),
(gen_random_uuid(), 'Robert', 'Johnson', '1995-09-18', 'Male', 'B-', NULL, NULL, NULL, NULL),
(gen_random_uuid(), 'Maria', 'Garcia', '1992-04-25', 'Female', 'O+', NULL, NULL, NULL, NULL),
(gen_random_uuid(), 'David', 'Wilson', '1987-11-30', 'Male', 'A+', NULL, NULL, NULL, NULL),
(gen_random_uuid(), 'Sarah', 'Brown', '1993-07-14', 'Female', 'B+', NULL, NULL, NULL, NULL);

-- Sample Appointments
\c appointments_db;

INSERT INTO appointments (
    patient_id, provider_id, appointment_type, status, scheduled_at,
    duration_minutes, reason, is_virtual
)
VALUES 
(gen_random_uuid(), gen_random_uuid(), 'General Consultation', 'scheduled', CURRENT_TIMESTAMP + INTERVAL '1 day', 30, 'Regular checkup', false),
(gen_random_uuid(), gen_random_uuid(), 'Follow-up', 'scheduled', CURRENT_TIMESTAMP + INTERVAL '2 days', 15, 'Follow-up visit', true),
(gen_random_uuid(), gen_random_uuid(), 'Specialist Consultation', 'scheduled', CURRENT_TIMESTAMP + INTERVAL '3 days', 45, 'Cardiac evaluation', false),
(gen_random_uuid(), gen_random_uuid(), 'Emergency', 'completed', CURRENT_TIMESTAMP - INTERVAL '1 day', 60, 'Chest pain', false),
(gen_random_uuid(), gen_random_uuid(), 'Routine Checkup', 'completed', CURRENT_TIMESTAMP - INTERVAL '2 days', 30, 'Annual physical', false),
(gen_random_uuid(), gen_random_uuid(), 'Vaccination', 'cancelled', CURRENT_TIMESTAMP - INTERVAL '3 days', 15, 'COVID-19 booster', false);

-- Sample Payments
\c payments_db;

INSERT INTO payments (
    user_id, appointment_id, amount, currency, status, payment_method
)
VALUES 
(gen_random_uuid(), gen_random_uuid(), 250.00, 'USD', 'completed', 'card'),
(gen_random_uuid(), gen_random_uuid(), 200.00, 'USD', 'completed', 'card'),
(gen_random_uuid(), gen_random_uuid(), 150.00, 'USD', 'pending', 'insurance'),
(gen_random_uuid(), gen_random_uuid(), 300.00, 'USD', 'completed', 'card'),
(gen_random_uuid(), gen_random_uuid(), 175.00, 'USD', 'failed', 'card'),
(gen_random_uuid(), gen_random_uuid(), 225.00, 'USD', 'refunded', 'card');

-- Sample Medical Records
\c clinical_db;

INSERT INTO medical_records (
    patient_id, provider_id, appointment_id, record_type,
    chief_complaint, assessment, plan
)
VALUES 
(gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'Consultation', 
 'Patient reports chest pain', 'Possible angina', 'Order ECG and blood tests'),
(gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'Follow-up', 
 'Follow-up for hypertension', 'Blood pressure controlled', 'Continue current medication'),
(gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'Emergency', 
 'Severe headache', 'Migraine', 'Prescribed pain medication'),
(gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'Routine', 
 'Annual checkup', 'Overall health good', 'Continue healthy lifestyle'),
(gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'Consultation', 
 'Persistent cough', 'Upper respiratory infection', 'Antibiotics prescribed');

-- Sample Prescriptions
INSERT INTO prescriptions (
    patient_id, provider_id, medication_name, dosage, frequency, duration, quantity
)
VALUES 
(gen_random_uuid(), gen_random_uuid(), 'Amoxicillin', '500mg', 'Twice daily', '7 days', 14),
(gen_random_uuid(), gen_random_uuid(), 'Lisinopril', '10mg', 'Once daily', '30 days', 30),
(gen_random_uuid(), gen_random_uuid(), 'Metformin', '500mg', 'Twice daily', '90 days', 180),
(gen_random_uuid(), gen_random_uuid(), 'Atorvastatin', '20mg', 'Once daily', '30 days', 30),
(gen_random_uuid(), gen_random_uuid(), 'Ibuprofen', '400mg', 'As needed', '10 days', 30);

-- Sample Notifications
\c notifications_db;

INSERT INTO notifications (
    user_id, type, channel, subject, content, status
)
VALUES 
(gen_random_uuid(), 'appointment_reminder', 'email', 'Appointment Tomorrow', 'Your appointment is scheduled for tomorrow at 10:00 AM', 'sent'),
(gen_random_uuid(), 'appointment_reminder', 'sms', 'Appointment Reminder', 'Don''t forget your appointment tomorrow at 10:00 AM', 'sent'),
(gen_random_uuid(), 'lab_results', 'email', 'Lab Results Available', 'Your recent lab results are now available', 'sent'),
(gen_random_uuid(), 'prescription_ready', 'push', 'Prescription Ready', 'Your prescription is ready for pickup', 'pending'),
(gen_random_uuid(), 'payment_receipt', 'email', 'Payment Receipt', 'Thank you for your payment of $250.00', 'sent');

-- Create indexes for better performance
\c appointments_db;
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_provider ON appointments(provider_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

\c payments_db;
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

\c clinical_db;
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_lab_results_patient ON lab_results(patient_id);

\c notifications_db;
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;