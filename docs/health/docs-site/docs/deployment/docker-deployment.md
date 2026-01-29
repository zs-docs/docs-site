# Docker Deployment Guide

## 🎯 Overview

Comprehensive Docker deployment guide for ZARISH HIS with Bangladesh healthcare context and production-ready configurations.

## 🐳 Docker Architecture

### Multi-Container Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Database Services
  postgres:
    image: postgres:15-alpine
    container_name: zarish-postgres
    environment:
      POSTGRES_DB: zarish_his
      POSTGRES_USER: zarish_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --locale=en_US.UTF-8"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
      - ./scripts/bangladesh-data.sql:/docker-entrypoint-initdb.d/bangladesh-data.sql
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

  redis:
    image: redis:7-alpine
    container_name: zarish-redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
      - ./config/redis.conf:/usr/local/etc/redis/redis.conf
    ports:
      - "6379:6379"
    networks:
      - zarish-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend Services
  patient-registry:
    build:
      context: ./backend/patient-registry
      dockerfile: Dockerfile
    container_name: zarish-patient-registry
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://zarish_user:${POSTGRES_PASSWORD}@postgres:5432/zarish_his
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - DGHS_API_KEY=${DGHS_API_KEY}
      - UNHCR_API_KEY=${UNHCR_API_KEY}
    ports:
      - "8080:8080"
    networks:
      - zarish-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  billing-engine:
    build:
      context: ./backend/billing-engine
      dockerfile: Dockerfile
    container_name: zarish-billing-engine
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://zarish_user:${POSTGRES_PASSWORD}@postgres:5432/zarish_his
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - BKASH_API_KEY=${BKASH_API_KEY}
      - NAGAD_API_KEY=${NAGAD_API_KEY}
    ports:
      - "8081:8081"
    networks:
      - zarish-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Services
  esm-admin:
    build:
      context: ./frontend/esm-admin
      dockerfile: Dockerfile
    container_name: zarish-esm-admin
    environment:
      - REACT_APP_API_URL=http://localhost:3000/api/v1
      - REACT_APP_ENVIRONMENT=production
    ports:
      - "3000:3000"
    networks:
      - zarish-network
    depends_on:
      - patient-registry
      - billing-engine
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # API Gateway
  kong:
    image: kong:3.4
    container_name: zarish-kong
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
      KONG_PG_DATABASE: kong
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: ${KONG_PG_PASSWORD}
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
      KONG_ADMIN_GUI_URL: http://localhost:8002
    ports:
      - "8000:8000"
      - "8001:8001"
      - "8002:8002"
      - "8443:8443"
      - "8444:8444"
    networks:
      - zarish-network
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  # Monitoring Services
  prometheus:
    image: prom/prometheus:latest
    container_name: zarish-prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - zarish-network
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: zarish-grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    ports:
      - "3001:3000"
    networks:
      - zarish-network
    depends_on:
      - prometheus
    restart: unless-stopped

  # Logging Services
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: zarish-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"
    networks:
      - zarish-network
    restart: unless-stopped

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: zarish-kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    networks:
      - zarish-network
    depends_on:
      - elasticsearch
    restart: unless-stopped

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: zarish-logstash
    volumes:
      - ./logging/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
      - ./logging/logstash.yml:/usr/share/logstash/config/logstash.yml
    networks:
      - zarish-network
    depends_on:
      - elasticsearch
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
  elasticsearch_data:

networks:
  zarish-network:
    driver: bridge
```

### Dockerfile for Backend Services

```dockerfile
# backend/patient-registry/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Health check
RUN npm install -g curl

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "dist/index.js"]
```

### Dockerfile for Frontend Services

```dockerfile
# frontend/esm-admin/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check
RUN apk add --no-cache curl

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Configuration Files

### Environment Variables

```bash
# .env
# Database Configuration
POSTGRES_PASSWORD=your_secure_postgres_password
REDIS_PASSWORD=your_secure_redis_password

# Application Configuration
JWT_SECRET=your_jwt_secret_key_here
KONG_PG_PASSWORD=your_kong_pg_password

# External API Keys
DGHS_API_KEY=your_dghs_api_key
UNHCR_API_KEY=your_unhcr_api_key
BKASH_API_KEY=your_bkash_api_key
NAGAD_API_KEY=your_nagad_api_key

# Monitoring Configuration
GRAFANA_PASSWORD=your_grafana_password

# Bangladesh Specific Configuration
TIMEZONE=Asia/Dhaka
LOCALE=bn_BD.UTF-8
CURRENCY=BDT
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    server {
        listen 3000;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle React Router
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api/ {
            proxy_pass http://kong:8000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static assets with caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 🚀 Deployment Scripts

### Production Deployment Script

```bash
#!/bin/bash
# deploy-production.sh

set -e

echo "🚀 Starting ZARISH HIS Production Deployment..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo "❌ .env file not found"
    exit 1
fi

# Create necessary directories
mkdir -p logs
mkdir -p backups
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources
mkdir -p logging

# Pull latest images
echo "📦 Pulling Docker images..."
docker-compose pull

# Build custom images
echo "🔨 Building custom images..."
docker-compose build

# Stop existing services
echo "⏹️ Stopping existing services..."
docker-compose down

# Backup database
echo "💾 Creating database backup..."
docker-compose exec postgres pg_dump -U zarish_user zarish_his > backups/backup-$(date +%Y%m%d-%H%M%S).sql

# Start services
echo "🔄 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Run health checks
echo "🏥 Running health checks..."
./scripts/health-check.sh

# Setup monitoring
echo "📊 Setting up monitoring..."
./scripts/setup-monitoring.sh

echo "✅ Deployment completed successfully!"
echo "🌐 Access the application at: http://localhost:3000"
echo "📈 Grafana dashboard at: http://localhost:3001"
echo "🔍 Kibana logs at: http://localhost:5601"
```

### Health Check Script

```bash
#!/bin/bash
# scripts/health-check.sh

set -e

SERVICES=("postgres" "redis" "patient-registry" "billing-engine" "esm-admin" "kong")

echo "🏥 Running health checks..."

for service in "${SERVICES[@]}"; do
    echo "Checking $service..."
    
    if docker-compose ps $service | grep -q "Up (healthy)"; then
        echo "✅ $service is healthy"
    else
        echo "❌ $service is not healthy"
        docker-compose logs $service
        exit 1
    fi
done

echo "🔍 Running API health checks..."

# Check patient registry API
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Patient Registry API is healthy"
else
    echo "❌ Patient Registry API is not healthy"
    exit 1
fi

# Check billing engine API
if curl -f http://localhost:8081/health > /dev/null 2>&1; then
    echo "✅ Billing Engine API is healthy"
else
    echo "❌ Billing Engine API is not healthy"
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not healthy"
    exit 1
fi

echo "✅ All services are healthy!"
```

### Monitoring Setup Script

```bash
#!/bin/bash
# scripts/setup-monitoring.sh

set -e

echo "📊 Setting up monitoring..."

# Create Prometheus configuration
cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'patient-registry'
    static_configs:
      - targets: ['patient-registry:8080']
    metrics_path: '/metrics'

  - job_name: 'billing-engine'
    static_configs:
      - targets: ['billing-engine:8081']
    metrics_path: '/metrics'

  - job_name: 'kong'
    static_configs:
      - targets: ['kong:8001']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
EOF

# Create Grafana datasource
cat > monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

# Restart monitoring services
docker-compose restart prometheus grafana

echo "✅ Monitoring setup completed!"
```

## 🔄 Bangladesh-Specific Configuration

### Bangladesh Data Initialization

```sql
-- scripts/bangladesh-data.sql
-- Initialize Bangladesh administrative data

-- Divisions
INSERT INTO administrative_divisions (code, name, name_bn, country_code) VALUES
('BD.1', 'Barishal', 'বরিশাল', 'BD'),
('BD.2', 'Chattogram', 'চট্টগ্রাম', 'BD'),
('BD.3', 'Dhaka', 'ঢাকা', 'BD'),
('BD.4', 'Khulna', 'খুলনা', 'BD'),
('BD.5', 'Mymensingh', 'ময়মনসিংহ', 'BD'),
('BD.6', 'Rajshahi', 'রাজশাহী', 'BD'),
('BD.7', 'Rangpur', 'রংপুর', 'BD'),
('BD.8', 'Sylhet', 'সিলেট', 'BD');

-- Districts (sample)
INSERT INTO administrative_districts (code, name, name_bn, division_code) VALUES
('BD.3.01', 'Dhaka', 'ঢাকা', 'BD.3'),
('BD.3.02', 'Faridpur', 'ফরিদপুর', 'BD.3'),
('BD.3.03', 'Gazipur', 'গাজীপুর', 'BD.3'),
('BD.3.04', 'Gopalganj', 'গোপালগঞ্জ', 'BD.3'),
('BD.3.05', 'Kishoreganj', 'কিশোরগঞ্জ', 'BD.3');

-- Rohingya Camps
INSERT INTO rohingya_camps (code, name, name_my, district_code, coordinates) VALUES
('KTP', 'Kutupalong', 'ကုတ်ပုလုံ', 'BD.3.01', 'POINT(21.1234 92.1234)'),
('NPT', 'Nayapara', 'နယ်ပါရ', 'BD.3.01', 'POINT(21.2345 92.2345)'),
('BDR', 'Balukhali', 'ဘာလုခါလီ', 'BD.3.01', 'POINT(21.3456 92.3456)');
```

### Timezone Configuration

```bash
# scripts/setup-timezone.sh
#!/bin/bash

echo "🕐 Setting up Bangladesh timezone..."

# Set system timezone
sudo timedatectl set-timezone Asia/Dhaka

# Update Docker containers with Bangladesh timezone
docker-compose exec postgres pg_ctl reload
docker-compose exec redis-cli CONFIG SET timezone "Asia/Dhaka"

echo "✅ Timezone setup completed!"
```

### Currency Configuration

```javascript
// config/currency.js
module.exports = {
  defaultCurrency: 'BDT',
  exchangeRates: {
    'BDT': 1.0,
    'USD': 0.0091,
    'EUR': 0.0085,
    'GBP': 0.0074
  },
  formatting: {
    locale: 'bn-BD',
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
};
```

## 📊 Monitoring and Logging

### Prometheus Metrics Configuration

```javascript
// backend/patient-registry/src/metrics.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const patientRegistrations = new prometheus.Counter({
  name: 'patient_registrations_total',
  help: 'Total number of patient registrations',
  labelNames: ['nationality', 'registration_type']
});

const databaseConnections = new prometheus.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
});

const cacheHitRate = new prometheus.Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate percentage'
});

module.exports = {
  httpRequestDuration,
  patientRegistrations,
  databaseConnections,
  cacheHitRate
};
```

### Logstash Configuration

```conf
# logging/logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "patient-registry" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
    
    date {
      match => [ "timestamp", "ISO8601" ]
    }
    
    mutate {
      add_field => { "service" => "patient-registry" }
    }
  }
  
  if [fields][service] == "billing-engine" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
    
    date {
      match => [ "timestamp", "ISO8601" ]
    }
    
    mutate {
      add_field => { "service" => "billing-engine" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "zarish-his-logs-%{+YYYY.MM.dd}"
  }
}
```

---

**Guide Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: ZARISH HIS Deployment Standards
