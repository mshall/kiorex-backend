.PHONY: help install build start stop restart logs clean test migrate seed setup dev prod

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[0;33m
NC=\033[0m # No Color

help: ## Show this help message
	@echo "${GREEN}Healthcare Platform - Available Commands${NC}"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "${YELLOW}%-20s${NC} %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "${GREEN}Installing dependencies...${NC}"
	npm install
	npx lerna bootstrap
	@echo "${GREEN}Dependencies installed successfully!${NC}"

build: ## Build all services
	@echo "${GREEN}Building all services...${NC}"
	docker-compose build
	@echo "${GREEN}Build completed!${NC}"

start: ## Start all services
	@echo "${GREEN}Starting all services...${NC}"
	docker-compose up -d
	@echo "${GREEN}Services started!${NC}"
	@echo "API Gateway: http://localhost:3000"
	@echo "Grafana: http://localhost:3030 (admin/admin123)"
	@echo "Jaeger: http://localhost:16686"
	@echo "MinIO: http://localhost:9001 (minioadmin/minioadmin123)"

stop: ## Stop all services
	@echo "${YELLOW}Stopping all services...${NC}"
	docker-compose down
	@echo "${GREEN}Services stopped!${NC}"

restart: stop start ## Restart all services

logs: ## Show logs for all services
	docker-compose logs -f

logs-service: ## Show logs for specific service (use: make logs-service SERVICE=auth-service)
	docker-compose logs -f $(SERVICE)

clean: ## Clean up containers, volumes, and images
	@echo "${RED}Cleaning up Docker resources...${NC}"
	docker-compose down -v --rmi local
	@echo "${GREEN}Cleanup completed!${NC}"

test: ## Run tests for all services
	@echo "${GREEN}Running tests...${NC}"
	npm run test
	@echo "${GREEN}Tests completed!${NC}"

test-e2e: ## Run end-to-end tests
	@echo "${GREEN}Running E2E tests...${NC}"
	npm run test:e2e
	@echo "${GREEN}E2E tests completed!${NC}"

test-service: ## Test specific service (use: make test-service SERVICE=auth-service)
	@echo "${GREEN}Testing $(SERVICE)...${NC}"
	cd services/$(SERVICE) && npm test

migrate: ## Run database migrations
	@echo "${GREEN}Running database migrations...${NC}"
	docker-compose exec postgres psql -U postgres -f /docker-entrypoint-initdb.d/complete-database-setup.sql
	@echo "${GREEN}Migrations completed!${NC}"

seed: ## Seed databases with test data
	@echo "${GREEN}Seeding databases...${NC}"
	cd services/auth-service && npm run seed:data
	@echo "${GREEN}Seeding completed!${NC}"

setup: ## Complete setup (install, build, start, migrate, seed)
	@echo "${GREEN}Setting up Healthcare Platform...${NC}"
	@make install
	@make build
	@make start
	@sleep 10
	@make migrate
	@make seed
	@echo "${GREEN}Setup completed successfully!${NC}"
	@echo ""
	@echo "${YELLOW}Access the platform:${NC}"
	@echo "API Gateway: http://localhost:3000"
	@echo "Auth Service: http://localhost:3001"
	@echo "Grafana: http://localhost:3030 (admin/admin123)"
	@echo "Jaeger: http://localhost:16686"
	@echo "MinIO: http://localhost:9001 (minioadmin/minioadmin123)"
	@echo ""
	@echo "${YELLOW}Sample credentials:${NC}"
	@echo "Admin: admin@healthcare.com / Admin@123456"
	@echo "Doctor: doctor1@healthcare.com / Doctor@123456"
	@echo "Patient: patient1@example.com / Patient@123456"

dev: ## Start services in development mode
	@echo "${GREEN}Starting development environment...${NC}"
	docker-compose -f docker-compose.yml up -d postgres redis kafka elasticsearch minio
	npm run start:dev

prod: ## Build and start services in production mode
	@echo "${GREEN}Starting production environment...${NC}"
	docker-compose -f docker-compose.prod.yml up -d

status: ## Check status of all services
	@echo "${GREEN}Service Status:${NC}"
	docker-compose ps

health: ## Check health of all services
	@echo "${GREEN}Checking service health...${NC}"
	@curl -s http://localhost:3001/health | jq '.' || echo "Auth Service: Down"
	@curl -s http://localhost:3002/health | jq '.' || echo "User Service: Down"
	@curl -s http://localhost:3003/health | jq '.' || echo "Appointment Service: Down"
	@curl -s http://localhost:3004/health | jq '.' || echo "Payment Service: Down"
	@curl -s http://localhost:3005/health | jq '.' || echo "Clinical Service: Down"
	@curl -s http://localhost:3006/health | jq '.' || echo "Notification Service: Down"
	@curl -s http://localhost:3007/health | jq '.' || echo "Search Service: Down"
	@curl -s http://localhost:3008/health | jq '.' || echo "Video Service: Down"
	@curl -s http://localhost:3009/health | jq '.' || echo "Analytics Service: Down"
	@curl -s http://localhost:3000/health | jq '.' || echo "API Gateway: Down"

backup: ## Backup databases
	@echo "${GREEN}Backing up databases...${NC}"
	@mkdir -p backups
	@docker-compose exec postgres pg_dumpall -U postgres > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "${GREEN}Backup completed!${NC}"

restore: ## Restore databases from backup (use: make restore BACKUP=backup_20240101_120000.sql)
	@echo "${YELLOW}Restoring databases from $(BACKUP)...${NC}"
	@docker-compose exec -T postgres psql -U postgres < backups/$(BACKUP)
	@echo "${GREEN}Restore completed!${NC}"

monitor: ## Open monitoring dashboards
	@echo "${GREEN}Opening monitoring dashboards...${NC}"
	@open http://localhost:3030 || xdg-open http://localhost:3030 || echo "Grafana: http://localhost:3030"
	@open http://localhost:16686 || xdg-open http://localhost:16686 || echo "Jaeger: http://localhost:16686"
	@open http://localhost:9090 || xdg-open http://localhost:9090 || echo "Prometheus: http://localhost:9090"

scale: ## Scale a service (use: make scale SERVICE=auth-service REPLICAS=3)
	@echo "${GREEN}Scaling $(SERVICE) to $(REPLICAS) replicas...${NC}"
	docker-compose up -d --scale $(SERVICE)=$(REPLICAS)
	@echo "${GREEN}Scaling completed!${NC}"