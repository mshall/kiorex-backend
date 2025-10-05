#!/bin/bash

# Healthcare Platform - Comprehensive Testing Script
# This script tests all services for compilation, health checks, and API validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost"
TIMEOUT=30
MAX_RETRIES=3

# Service configurations
declare -A SERVICES=(
    ["api-gateway"]="3000"
    ["auth-service"]="3001"
    ["user-service"]="3002"
    ["payment-service"]="3004"
    ["appointment-service"]="3005"
    ["clinical-service"]="3006"
    ["notification-service"]="3007"
    ["search-service"]="3008"
    ["video-service"]="3009"
    ["analytics-service"]="3010"
    ["lab-service"]="3011"
    ["pharmacy-service"]="3012"
    ["surgery-service"]="3013"
    ["nurse-service"]="3014"
    ["document-service"]="3015"
    ["admin-service"]="3016"
)

# Test results
declare -A TEST_RESULTS
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test compilation for a service
test_compilation() {
    local service=$1
    local service_dir="services/$service"
    
    log_info "Testing compilation for $service..."
    
    if [ ! -d "$service_dir" ]; then
        log_error "Service directory $service_dir not found"
        return 1
    fi
    
    cd "$service_dir"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies for $service..."
        npm install
    fi
    
    # Test compilation
    if npm run build; then
        log_success "Compilation successful for $service"
        return 0
    else
        log_error "Compilation failed for $service"
        return 1
    fi
}

# Test health check for a service
test_health_check() {
    local service=$1
    local port=$2
    local url="$BASE_URL:$port/health"
    
    log_info "Testing health check for $service on port $port..."
    
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -s -f "$url" > /dev/null 2>&1; then
            log_success "Health check passed for $service"
            return 0
        else
            log_warning "Health check attempt $i failed for $service, retrying..."
            sleep 5
        fi
    done
    
    log_error "Health check failed for $service after $MAX_RETRIES attempts"
    return 1
}

# Test API endpoints for a service
test_api_endpoints() {
    local service=$1
    local port=$2
    local base_url="$BASE_URL:$port"
    
    log_info "Testing API endpoints for $service..."
    
    # Service-specific API tests
    case $service in
        "api-gateway")
            test_api_gateway_endpoints "$base_url"
            ;;
        "auth-service")
            test_auth_service_endpoints "$base_url"
            ;;
        "user-service")
            test_user_service_endpoints "$base_url"
            ;;
        "payment-service")
            test_payment_service_endpoints "$base_url"
            ;;
        "appointment-service")
            test_appointment_service_endpoints "$base_url"
            ;;
        "clinical-service")
            test_clinical_service_endpoints "$base_url"
            ;;
        "notification-service")
            test_notification_service_endpoints "$base_url"
            ;;
        "search-service")
            test_search_service_endpoints "$base_url"
            ;;
        "video-service")
            test_video_service_endpoints "$base_url"
            ;;
        "analytics-service")
            test_analytics_service_endpoints "$base_url"
            ;;
        "lab-service")
            test_lab_service_endpoints "$base_url"
            ;;
        "pharmacy-service")
            test_pharmacy_service_endpoints "$base_url"
            ;;
        "surgery-service")
            test_surgery_service_endpoints "$base_url"
            ;;
        "nurse-service")
            test_nurse_service_endpoints "$base_url"
            ;;
        "document-service")
            test_document_service_endpoints "$base_url"
            ;;
        "admin-service")
            test_admin_service_endpoints "$base_url"
            ;;
        *)
            log_warning "No specific API tests defined for $service"
            ;;
    esac
}

# API Gateway endpoint tests
test_api_gateway_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "API Gateway health endpoint working"
    else
        log_error "API Gateway health endpoint failed"
        return 1
    fi
    
    # Test routing to auth service
    if curl -s -f "$base_url/auth/health" > /dev/null; then
        log_success "API Gateway auth routing working"
    else
        log_warning "API Gateway auth routing failed"
    fi
}

# Auth Service endpoint tests
test_auth_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Auth service health endpoint working"
    else
        log_error "Auth service health endpoint failed"
        return 1
    fi
    
    # Test login endpoint (should return 400 for missing credentials)
    if curl -s -o /dev/null -w "%{http_code}" "$base_url/auth/login" | grep -q "400"; then
        log_success "Auth service login endpoint responding correctly"
    else
        log_warning "Auth service login endpoint not responding as expected"
    fi
}

# User Service endpoint tests
test_user_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "User service health endpoint working"
    else
        log_error "User service health endpoint failed"
        return 1
    fi
}

# Payment Service endpoint tests
test_payment_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Payment service health endpoint working"
    else
        log_error "Payment service health endpoint failed"
        return 1
    fi
}

# Appointment Service endpoint tests
test_appointment_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Appointment service health endpoint working"
    else
        log_error "Appointment service health endpoint failed"
        return 1
    fi
}

# Clinical Service endpoint tests
test_clinical_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Clinical service health endpoint working"
    else
        log_error "Clinical service health endpoint failed"
        return 1
    fi
}

# Notification Service endpoint tests
test_notification_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Notification service health endpoint working"
    else
        log_error "Notification service health endpoint failed"
        return 1
    fi
}

# Search Service endpoint tests
test_search_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Search service health endpoint working"
    else
        log_error "Search service health endpoint failed"
        return 1
    fi
}

# Video Service endpoint tests
test_video_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Video service health endpoint working"
    else
        log_error "Video service health endpoint failed"
        return 1
    fi
}

# Analytics Service endpoint tests
test_analytics_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Analytics service health endpoint working"
    else
        log_error "Analytics service health endpoint failed"
        return 1
    fi
}

# Lab Service endpoint tests
test_lab_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Lab service health endpoint working"
    else
        log_error "Lab service health endpoint failed"
        return 1
    fi
}

# Pharmacy Service endpoint tests
test_pharmacy_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Pharmacy service health endpoint working"
    else
        log_error "Pharmacy service health endpoint failed"
        return 1
    fi
}

# Surgery Service endpoint tests
test_surgery_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Surgery service health endpoint working"
    else
        log_error "Surgery service health endpoint failed"
        return 1
    fi
}

# Nurse Service endpoint tests
test_nurse_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Nurse service health endpoint working"
    else
        log_error "Nurse service health endpoint failed"
        return 1
    fi
}

# Document Service endpoint tests
test_document_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Document service health endpoint working"
    else
        log_error "Document service health endpoint failed"
        return 1
    fi
}

# Admin Service endpoint tests
test_admin_service_endpoints() {
    local base_url=$1
    
    # Test health endpoint
    if curl -s -f "$base_url/health" > /dev/null; then
        log_success "Admin service health endpoint working"
    else
        log_error "Admin service health endpoint failed"
        return 1
    fi
}

# Run all tests for a service
test_service() {
    local service=$1
    local port=$2
    
    log_info "Starting tests for $service..."
    
    # Test compilation
    if test_compilation "$service"; then
        TEST_RESULTS["$service-compilation"]="PASS"
        ((PASSED_TESTS++))
    else
        TEST_RESULTS["$service-compilation"]="FAIL"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Test health check
    if test_health_check "$service" "$port"; then
        TEST_RESULTS["$service-health"]="PASS"
        ((PASSED_TESTS++))
    else
        TEST_RESULTS["$service-health"]="FAIL"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Test API endpoints
    if test_api_endpoints "$service" "$port"; then
        TEST_RESULTS["$service-api"]="PASS"
        ((PASSED_TESTS++))
    else
        TEST_RESULTS["$service-api"]="FAIL"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
}

# Main execution
main() {
    log_info "Starting Healthcare Platform Testing Suite..."
    log_info "Testing ${#SERVICES[@]} services..."
    
    # Change to project root
    cd "$(dirname "$0")/.."
    
    # Test each service
    for service in "${!SERVICES[@]}"; do
        port="${SERVICES[$service]}"
        test_service "$service" "$port"
        echo "----------------------------------------"
    done
    
    # Print summary
    log_info "Testing Summary:"
    log_info "Total Tests: $TOTAL_TESTS"
    log_success "Passed: $PASSED_TESTS"
    if [ $FAILED_TESTS -gt 0 ]; then
        log_error "Failed: $FAILED_TESTS"
    else
        log_success "Failed: $FAILED_TESTS"
    fi
    
    # Print detailed results
    log_info "Detailed Results:"
    for test in "${!TEST_RESULTS[@]}"; do
        result="${TEST_RESULTS[$test]}"
        if [ "$result" = "PASS" ]; then
            log_success "$test: $result"
        else
            log_error "$test: $result"
        fi
    done
    
    # Exit with appropriate code
    if [ $FAILED_TESTS -gt 0 ]; then
        log_error "Some tests failed. Please check the logs above."
        exit 1
    else
        log_success "All tests passed!"
        exit 0
    fi
}

# Run main function
main "$@"
