-- scripts/optimize-db.sql

-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_appointments_patient_status 
ON appointments(patient_id, status) 
WHERE status IN ('scheduled', 'confirmed');

CREATE INDEX CONCURRENTLY idx_appointments_provider_date 
ON appointments(provider_id, start_time) 
WHERE status != 'cancelled';

CREATE INDEX CONCURRENTLY idx_payments_user_created 
ON payments(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_medical_records_patient_date 
ON medical_records(patient_id, encounter_date DESC);

-- Partitioning for large tables
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE audit_logs_2024_02 PARTITION OF audit_logs
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Vacuum and analyze
VACUUM ANALYZE appointments;
VACUUM ANALYZE payments;
VACUUM ANALYZE medical_records;

-- Connection pooling configuration
ALTER SYSTEM SET max_connections = 500;
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
ALTER SYSTEM SET random_page_cost = 1.1;
