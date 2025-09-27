#!/bin/bash

# Master script to seed all databases with sample data
# This script will run all individual seed files for each service

echo "🌱 Starting database seeding process..."

# Database connection details
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="postgres123"

# Function to run SQL file
run_sql_file() {
    local db_name=$1
    local sql_file=$2
    
    echo "📊 Seeding $db_name database..."
    
    if [ -f "$sql_file" ]; then
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $db_name -f "$sql_file"
        if [ $? -eq 0 ]; then
            echo "✅ Successfully seeded $db_name"
        else
            echo "❌ Failed to seed $db_name"
            exit 1
        fi
    else
        echo "⚠️  SQL file not found: $sql_file"
    fi
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEED_DATA_DIR="$SCRIPT_DIR/seed-data"

echo "📁 Seed data directory: $SEED_DATA_DIR"

# Seed each database
run_sql_file "auth_db" "$SEED_DATA_DIR/auth-seed.sql"
run_sql_file "users_db" "$SEED_DATA_DIR/users-seed.sql"
run_sql_file "appointments_db" "$SEED_DATA_DIR/appointments-seed.sql"
run_sql_file "clinical_db" "$SEED_DATA_DIR/clinical-seed.sql"
run_sql_file "notifications_db" "$SEED_DATA_DIR/notifications-seed.sql"
run_sql_file "search_db" "$SEED_DATA_DIR/search-seed.sql"
run_sql_file "video_db" "$SEED_DATA_DIR/video-seed.sql"
run_sql_file "analytics_db" "$SEED_DATA_DIR/analytics-seed.sql"

echo "🎉 Database seeding completed successfully!"
echo ""
echo "📋 Summary of seeded data:"
echo "   • Auth Service: Users, MFA secrets, login history"
echo "   • User Service: User profiles, preferences, roles"
echo "   • Appointment Service: Appointments, slots, waitlists"
echo "   • Clinical Service: Medical records, prescriptions, lab results"
echo "   • Notification Service: Templates, preferences, notifications"
echo "   • Search Service: Search queries, analytics, indexes"
echo "   • Video Service: Video sessions, participants, recordings"
echo "   • Analytics Service: Metrics, events, dashboards"
echo ""
echo "🔗 You can now test the APIs using the Postman collection!"
