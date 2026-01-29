# Production Deployment

## 🎯 Overview

Comprehensive production deployment guide for ZARISH HIS documentation system with Bangladesh healthcare context and Rohingya refugee integration.

## 🚀 Deployment Architecture

### Production Infrastructure

```mermaid
graph TB
    subgraph "Production Environment"
        A[Load Balancer] --> B[Web Servers]
        B --> C[API Servers]
        C --> D[Database Cluster]
        D --> E[Cache Cluster]
        E --> F[Storage]
    end
    
    subgraph "Monitoring & Logging"
        G[Prometheus]
        H[Grafana]
        I[ELK Stack]
        J[AlertManager]
    end
    
    subgraph "Security"
        K[WAF]
        L[DDoS Protection]
        M[SSL/TLS]
        N[Firewall]
    end
    
    A --> K
    B --> L
    C --> M
    D --> N
```

### Deployment Configuration

```yaml
# production-deployment.yml
version: '3.8'

services:
  # Web Servers
  web-1:
    image: zarish-his/web:1.0.0
    container_name: zarish-web-1
    environment:
      - NODE_ENV=production
      - PORT=3000
      - API_URL=https://api.zarish-his.com/v1
    ports:
      - "3000:3000"
    networks:
      - zarish-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  web-2:
    image: zarish-his/web:1.0.0
    container_name: zarish-web-2
    environment:
      - NODE_ENV=production
      - PORT=3000
      - API_URL=https://api.zarish-his.com/v1
    ports:
      - "3001:3000"
    networks:
      - zarish-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  # API Servers
  api-1:
    image: zarish-his/api:1.0.0
    container_name: zarish-api-1
    environment:
      - NODE_ENV=production
      - PORT=8080
      - DATABASE_URL=postgresql://zarish_user:${DB_PASSWORD}@postgres-primary:5432/zarish_his
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis-cluster:6379
      - JWT_SECRET=${JWT_SECRET}
      - DGHS_API_KEY=${DGHS_API_KEY}
      - UNHCR_API_KEY=${UNHCR_API_KEY}
    ports:
      - "8080:8080"
    networks:
      - zarish-network
    depends_on:
      postgres-primary:
        condition: service_healthy
      redis-cluster:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

  api-2:
    image: zarish-his/api:1.0.0
    container_name: zarish-api-2
    environment:
      - NODE_ENV=production
      - PORT=8080
      - DATABASE_URL=postgresql://zarish_user:${DB_PASSWORD}@postgres-primary:5432/zarish_his
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis-cluster:6379
      - JWT_SECRET=${JWT_SECRET}
      - DGHS_API_KEY=${DGHS_API_KEY}
      - UNHCR_API_KEY=${UNHCR_API_KEY}
    ports:
      - "8081:8080"
    networks:
      - zarish-network
    depends_on:
      postgres-primary:
        condition: service_healthy
      redis-cluster:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

  # Database Cluster
  postgres-primary:
    image: postgres:15-alpine
    container_name: zarish-postgres-primary
    environment:
      POSTGRES_DB: zarish_his
      POSTGRES_USER: zarish_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: ${REPLICATION_PASSWORD}
    volumes:
      - postgres_primary_data:/var/lib/postgresql/data
      - ./config/postgres-primary.conf:/etc/postgresql/postgresql.conf
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    ports:
      - "5432:5432"
    networks:
      - zarish-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U zarish_user -d zarish_his"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
        reservations:
          memory: 2G
          cpus: '1.0'

  postgres-replica:
    image: postgres:15-alpine
    container_name: zarish-postgres-replica
    environment:
      POSTGRES_MASTER_SERVICE: postgres-primary
      POSTGRES_USER: zarish_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: ${REPLICATION_PASSWORD}
      PGUSER: postgres
    volumes:
      - postgres_replica_data:/var/lib/postgresql/data
      - ./config/postgres-replica.conf:/etc/postgresql/postgresql.conf
    ports:
      - "5433:5432"
    networks:
      - zarish-network
    depends_on:
      postgres-primary:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U zarish_user -d zarish_his"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
        reservations:
          memory: 2G
          cpus: '1.0'

  # Redis Cluster
  redis-cluster:
    image: redis:7-alpine
    container_name: zarish-redis-cluster
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD} --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000
    volumes:
      - redis_data:/data
      - ./config/redis.conf:/usr/local/etc/redis/redis.conf
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      - zarish-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  # Load Balancer
  nginx:
    image: nginx:alpine
    container_name: zarish-nginx
    volumes:
      - ./config/nginx.conf:/etc/nginx/nginx.conf
      - ./config/ssl:/etc/nginx/ssl
    ports:
      - "80:80"
      - "443:443"
    networks:
      - zarish-network
    depends_on:
      - web-1
      - web-2
      - api-1
      - api-2
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: zarish-prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    volumes:
      - prometheus_data:/prometheus
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/rules:/etc/prometheus/rules
    ports:
      - "9090:9090"
    networks:
      - zarish-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  grafana:
    image: grafana/grafana:latest
    container_name: zarish-grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_INSTALL_PLUGINS=grafana-piechart-panel,grafana-worldmap-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    ports:
      - "3000:3000"
    networks:
      - zarish-network
    depends_on:
      - prometheus
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'

volumes:
  postgres_primary_data:
  postgres_replica_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  zarish-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## 🔧 Deployment Scripts

### Production Deployment Script

```bash
#!/bin/bash
# scripts/deploy-production.sh

set -e

echo "🚀 Starting ZARISH HIS Production Deployment..."

# Configuration
ENVIRONMENT="production"
BACKUP_DIR="/backups/$(date +%Y%m%d-%H%M%S)"
LOG_FILE="/var/log/zarish-deployment.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Error handling
error_exit() {
    log "❌ ERROR: $1"
    exit 1
}

# Pre-deployment checks
pre_deployment_checks() {
    log "🔍 Running pre-deployment checks..."
    
    # Check environment variables
    if [ -z "$DB_PASSWORD" ]; then
        error_exit "DB_PASSWORD environment variable not set"
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        error_exit "JWT_SECRET environment variable not set"
    fi
    
    # Check disk space
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 80 ]; then
        error_exit "Disk usage is ${DISK_USAGE}%. Must be below 80%"
    fi
    
    # Check memory
    AVAILABLE_MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    if [ $AVAILABLE_MEMORY -lt 2048 ]; then
        error_exit "Available memory is ${AVAILABLE_MEMORY}MB. Must be at least 2GB"
    fi
    
    # Check network connectivity
    if ! ping -c 1 google.com &> /dev/null; then
        error_exit "Network connectivity check failed"
    fi
    
    log "✅ Pre-deployment checks passed"
}

# Backup current deployment
backup_current_deployment() {
    log "💾 Creating backup of current deployment..."
    
    mkdir -p $BACKUP_DIR
    
    # Backup database
    docker exec zarish-postgres-primary pg_dump -U zarish_user zarish_his > $BACKUP_DIR/database.sql
    
    # Backup configuration files
    cp -r /opt/zarish-his/config $BACKUP_DIR/
    
    # Backup SSL certificates
    cp -r /opt/zarish-his/ssl $BACKUP_DIR/
    
    log "✅ Backup completed: $BACKUP_DIR"
}

# Deploy new version
deploy_new_version() {
    log "📦 Deploying new version..."
    
    # Pull latest images
    log "Pulling Docker images..."
    docker-compose -f production-deployment.yml pull
    
    # Stop existing services
    log "Stopping existing services..."
    docker-compose -f production-deployment.yml down
    
    # Start new services
    log "Starting new services..."
    docker-compose -f production-deployment.yml up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    check_service_health
}

# Check service health
check_service_health() {
    log "🏥 Checking service health..."
    
    services=("web-1" "web-2" "api-1" "api-2" "postgres-primary" "redis-cluster" "nginx")
    
    for service in "${services[@]}"; do
        if docker ps --filter "name=$service" --filter "status=running" | grep -q $service; then
            log "✅ $service is running"
        else
            error_exit "$service is not running"
        fi
    done
    
    # Check API endpoints
    endpoints=(
        "http://localhost:3000/health"
        "http://localhost:8080/health"
        "https://zarish-his.com/health"
    )
    
    for endpoint in "${endpoints[@]}"; do
        if curl -f -s $endpoint > /dev/null; then
            log "✅ $endpoint is healthy"
        else
            error_exit "$endpoint is not responding"
        fi
    done
}

# Post-deployment verification
post_deployment_verification() {
    log "🔍 Running post-deployment verification..."
    
    # Test Bangladesh patient registration
    log "Testing Bangladesh patient registration..."
    BANGLADESI_PATIENT_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TEST_TOKEN" \
        -d '{
            "firstName": "Test",
            "lastName": "User",
            "dateOfBirth": "1990-01-01",
            "gender": "M",
            "nationality": "BD",
            "nationalId": "1234567890123",
            "phoneNumber": "+8801234567890"
        }' \
        https://api.zarish-his.com/v1/patients)
    
    if echo "$BANGLADESI_PATIENT_RESPONSE" | grep -q '"id"'; then
        log "✅ Bangladesh patient registration working"
    else
        error_exit "Bangladesh patient registration failed"
    fi
    
    # Test Rohingya patient registration
    log "Testing Rohingya patient registration..."
    ROHINGYA_PATIENT_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TEST_TOKEN" \
        -d '{
            "firstName": "Test",
            "lastName": "Refugee",
            "dateOfBirth": "1985-05-15",
            "gender": "F",
            "nationality": "ROH",
            "progressId": "PROG123456789",
            "mrcCard": "MRC987654321"
        }' \
        https://api.zarish-his.com/v1/patients)
    
    if echo "$ROHINGYA_PATIENT_RESPONSE" | grep -q '"id"'; then
        log "✅ Rohingya patient registration working"
    else
        error_exit "Rohingya patient registration failed"
    fi
    
    # Test DGHS integration
    log "Testing DGHS integration..."
    DGHS_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TEST_TOKEN" \
        -d '{"nationalId": "1234567890123"}' \
        https://api.zarish-his.com/v1/integrations/dghs/validate-nid)
    
    if echo "$DGHS_RESPONSE" | grep -q '"valid"'; then
        log "✅ DGHS integration working"
    else
        error_exit "DGHS integration failed"
    fi
    
    # Test UNHCR integration
    log "Testing UNHCR integration..."
    UNHCR_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TEST_TOKEN" \
        -d '{"progressId": "PROG123456789"}' \
        https://api.zarish-his.com/v1/integrations/unhcr/validate-refugee)
    
    if echo "$UNHCR_RESPONSE" | grep -q '"valid"'; then
        log "✅ UNHCR integration working"
    else
        error_exit "UNHCR integration failed"
    fi
    
    log "✅ Post-deployment verification passed"
}

# Performance verification
performance_verification() {
    log "📊 Running performance verification..."
    
    # Load test
    log "Running load test..."
    k6 run --vus 100 --duration 30s scripts/load-test.js
    
    # Memory usage check
    MEMORY_USAGE=$(docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}" | grep zarish | awk '{sum+=$2} END {print sum}')
    log "Total memory usage: $MEMORY_USAGE"
    
    # CPU usage check
    CPU_USAGE=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}" | grep zarish | awk '{sum+=$2} END {print sum}')
    log "Total CPU usage: $CPU_USAGE"
    
    log "✅ Performance verification completed"
}

# Cleanup old images
cleanup_old_images() {
    log "🧹 Cleaning up old Docker images..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove old versions (keep last 3 versions)
    docker images --format "table {{.Repository}}\t{{.Tag}}" | grep zarish-his | tail -n +4 | awk '{print $1":"$2}' | xargs -r docker rmi
    
    log "✅ Cleanup completed"
}

# Send deployment notification
send_notification() {
    log "📧 Sending deployment notification..."
    
    # Send Slack notification
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"✅ ZARISH HIS Production Deployment Completed Successfully\n\nEnvironment: '$ENVIRONMENT'\nVersion: '$VERSION'\nTime: '$(date)'"}' \
        $SLACK_WEBHOOK_URL
    
    # Send email notification
    echo "ZARISH HIS Production Deployment Completed Successfully

Environment: $ENVIRONMENT
Version: $VERSION
Time: $(date)

Backup Location: $BACKUP_DIR

Services Status:
- Web Servers: Running
- API Servers: Running
- Database: Running
- Cache: Running
- Load Balancer: Running

Verification Results:
- Bangladesh Integration: ✅
- Rohingya Integration: ✅
- DGHS Integration: ✅
- UNHCR Integration: ✅
- Performance: ✅" | mail -s "ZARISH HIS Production Deployment" admin@zarish-his.com
    
    log "✅ Notification sent"
}

# Rollback function
rollback() {
    log "🔄 Rolling back deployment..."
    
    # Stop current services
    docker-compose -f production-deployment.yml down
    
    # Restore database
    docker exec zarish-postgres-primary psql -U zarish_user -d zarish_his < $BACKUP_DIR/database.sql
    
    # Restore configuration
    cp -r $BACKUP_DIR/config/* /opt/zarish-his/config/
    cp -r $BACKUP_DIR/ssl/* /opt/zarish-his/ssl/
    
    # Start services
    docker-compose -f production-deployment.yml up -d
    
    log "✅ Rollback completed"
}

# Main deployment function
main() {
    log "🚀 Starting ZARISH HIS Production Deployment..."
    
    # Set trap for rollback on error
    trap 'rollback; error_exit "Deployment failed, rollback initiated"' ERR
    
    # Run deployment steps
    pre_deployment_checks
    backup_current_deployment
    deploy_new_version
    post_deployment_verification
    performance_verification
    cleanup_old_images
    send_notification
    
    log "🎉 Production deployment completed successfully!"
}

# Execute main function
main "$@"
```

### Health Check Script

```bash
#!/bin/bash
# scripts/health-check.sh

set -e

echo "🏥 ZARISH HIS Health Check"

# Configuration
API_URL="https://api.zarish-his.com"
WEB_URL="https://zarish-his.com"
TIMEOUT=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Health check function
check_health() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url"); then
        if [ "$response" -eq "$expected_status" ]; then
            echo -e "${GREEN}✅ OK${NC} (HTTP $response)"
            return 0
        else
            echo -e "${RED}❌ FAILED${NC} (HTTP $response, expected $expected_status)"
            return 1
        fi
    else
        echo -e "${RED}❌ FAILED${NC} (Connection error)"
        return 1
    fi
}

# Container health check
check_container() {
    local container_name=$1
    
    echo -n "Checking container $container_name... "
    
    if docker ps --filter "name=$container_name" --filter "status=running" | grep -q $container_name; then
        if docker inspect --format='{{.State.Health.Status}}' $container_name 2>/dev/null | grep -q "healthy"; then
            echo -e "${GREEN}✅ Healthy${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️ Running but not healthy${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Not running${NC}"
        return 1
    fi
}

echo "=================================="
echo "Service Health Checks"
echo "=================================="

# Check web services
check_health "Web Server 1" "$WEB_URL/health"
check_health "Web Server 2" "$WEB_URL/health"

# Check API services
check_health "API Server 1" "$API_URL/health"
check_health "API Server 2" "$API_URL/health"

# Check specific API endpoints
check_health "Patient API" "$API_URL/v1/patients/health"
check_health "FHIR API" "$API_URL/fhir/Patient/\$health"
check_health "DGHS Integration" "$API_URL/v1/integrations/dghs/health"
check_health "UNHCR Integration" "$API_URL/v1/integrations/unhcr/health"

echo ""
echo "=================================="
echo "Container Health Checks"
echo "=================================="

# Check containers
containers=("web-1" "web-2" "api-1" "api-2" "postgres-primary" "postgres-replica" "redis-cluster" "nginx" "prometheus" "grafana")

for container in "${containers[@]}"; do
    check_container $container
done

echo ""
echo "=================================="
echo "System Health Checks"
echo "=================================="

# Check disk space
echo -n "Checking disk space... "
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo -e "${GREEN}✅ OK${NC} (${DISK_USAGE}% used)"
else
    echo -e "${RED}❌ WARNING${NC} (${DISK_USAGE}% used)"
fi

# Check memory
echo -n "Checking memory... "
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -lt 80 ]; then
    echo -e "${GREEN}✅ OK${NC} (${MEMORY_USAGE}% used)"
else
    echo -e "${RED}❌ WARNING${NC} (${MEMORY_USAGE}% used)"
fi

# Check load average
echo -n "Checking load average... "
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
LOAD_NUM=$(echo $LOAD_AVG | awk '{print int($1)}')
if [ $LOAD_NUM -lt 2 ]; then
    echo -e "${GREEN}✅ OK${NC} (Load: $LOAD_AVG)"
else
    echo -e "${YELLOW}⚠️ WARNING${NC} (Load: $LOAD_AVG)"
fi

echo ""
echo "=================================="
echo "Integration Health Checks"
echo "=================================="

# Test Bangladesh integration
echo -n "Testing Bangladesh NID validation... "
if response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"nationalId":"1234567890123"}' "$API_URL/v1/validations/nid" 2>/dev/null); then
    if echo "$response" | grep -q '"valid":true'; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
else
    echo -e "${RED}❌ FAILED${NC}"
fi

# Test Rohingya integration
echo -n "Testing Rohingya ProGress ID validation... "
if response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"progressId":"PROG123456789"}' "$API_URL/v1/validations/progress-id" 2>/dev/null); then
    if echo "$response" | grep -q '"valid":true'; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""
echo "Health check completed at $(date)"
echo "=================================="
```

## 🔒 Security Configuration

### SSL/TLS Configuration

```nginx
# config/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.zarish-his.com;";

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    '$request_time $upstream_response_time';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Load balancer
    upstream web_backend {
        least_conn;
        server web-1:3000 max_fails=3 fail_timeout=30s;
        server web-2:3000 max_fails=3 fail_timeout=30s;
    }

    upstream api_backend {
        least_conn;
        server api-1:8080 max_fails=3 fail_timeout=30s;
        server api-2:8080 max_fails=3 fail_timeout=30s;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name zarish-his.com www.zarish-his.com api.zarish-his.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS main site
    server {
        listen 443 ssl http2;
        server_name zarish-his.com www.zarish-his.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/zarish-his.com.crt;
        ssl_certificate_key /etc/nginx/ssl/zarish-his.com.key;
        ssl_trusted_certificate /etc/nginx/ssl/zarish-his.com.ca-bundle;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security
        limit_req zone=login burst=5 nodelay;

        location / {
            proxy_pass http://web_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }

    # HTTPS API
    server {
        listen 443 ssl http2;
        server_name api.zarish-his.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/api.zarish-his.com.crt;
        ssl_certificate_key /etc/nginx/ssl/api.zarish-his.com.key;
        ssl_trusted_certificate /etc/nginx/ssl/api.zarish-his.com.ca-bundle;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security
        limit_req zone=api burst=20 nodelay;

        location / {
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

**Deployment Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: ZARISH HIS Production Standards
