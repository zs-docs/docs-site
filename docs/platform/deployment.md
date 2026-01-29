---
title: 'Deployment Guide'
sidebar_label: 'Deployment'
description: 'Comprehensive deployment guide for ZARISH SPHERE platform including cloud, on-premises, and edge deployment scenarios'
keywords: [deployment, installation, setup, cloud, on-premises, zarish sphere]
---

# Deployment Guide

## Overview

ZARISH SPHERE supports multiple deployment scenarios to meet diverse healthcare infrastructure needs. This guide covers cloud deployment, on-premises installation, edge computing setups, and hybrid configurations.

## Deployment Options

### 1. Cloud Deployment

### Supported Cloud Providers

- **Amazon Web Services (AWS)**
- **Microsoft Azure**
- **Google Cloud Platform (GCP)**
- **DigitalOcean**
- **Any Kubernetes-compatible cloud**

### Prerequisites

- Kubernetes cluster (v1.24+)
- Container registry access
- Domain name for SSL certificates
- Cloud provider account with appropriate permissions

### AWS Deployment

### Infrastructure Setup

````bash
## Create EKS cluster
aws eks create-cluster \
  --name zarish-sphere \
  --version 1.24 \
  --role-arn arn:aws:iam::ACCOUNT:role/EKSClusterRole \
  --resources-vpc-config subnetIds=subnet-12345,subnet-67890

## Configure kubectl
aws eks update-kubeconfig --region us-west-2 --name zarish-sphere

## Create IAM OIDC provider
eksctl utils associate-iam-oidc-provider --cluster zarish-sphere --approve
```text

### Storage Configuration

```yaml
## storage-class.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp3-encrypted
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  encrypted: 'true'
  fsType: ext4
allowVolumeExpansion: true
reclaimPolicy: Retain
```text

### Database Deployment

```yaml
## postgresql.yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres-cluster
spec:
  instances: 3
  primaryUpdateStrategy: unsupervised

  postgresql:
    parameters:
      max_connections: '200'
      shared_buffers: '256MB'
      effective_cache_size: '1GB'

  bootstrap:
    initdb:
      database: zarish_sphere
      owner: zarish_user
      secret:
        name: postgres-credentials

  storage:
    size: 100Gi
    storageClass: gp3-encrypted

  monitoring:
    enabled: true
```text

### Application Deployment

```yaml
## zarish-sphere-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zarish-sphere-api
  labels:
    app: zarish-sphere-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: zarish-sphere-api
  template:
    metadata:
      labels:
        app: zarish-sphere-api
    spec:
      containers:
        - name: api
          image: zarishsphere/api:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: postgres-credentials
                  key: url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: redis-credentials
                  key: url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: secret
          resources:
            requests:
              memory: '512Mi'
              cpu: '250m'
            limits:
              memory: '1Gi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```text

### Load Balancer Configuration

```yaml
## ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zarish-sphere-ingress
  annotations:
    kubernetes.io/ingress.class: 'nginx'
    cert-manager.io/cluster-issuer: 'letsencrypt-prod'
    nginx.ingress.kubernetes.io/ssl-redirect: 'true'
    nginx.ingress.kubernetes.io/proxy-body-size: '50m'
spec:
  tls:
    - hosts:
        - api.zarishsphere.com
      secretName: zarish-sphere-tls
  rules:
    - host: api.zarishsphere.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: zarish-sphere-service
                port:
                  number: 80
```bash

### 2. On-Premises Deployment

### Hardware Requirements

### Minimum Requirements

- **CPU**: 8 cores (Intel Xeon or AMD EPYC)
- **Memory**: 32GB RAM
- **Storage**: 500GB SSD (RAID 1)
- **Network**: 1Gbps Ethernet
- **OS**: Ubuntu 20.04 LTS or RHEL 8

### Recommended Requirements

- **CPU**: 16 cores
- **Memory**: 64GB RAM
- **Storage**: 2TB SSD (RAID 10)
- **Network**: 10Gbps Ethernet
- **OS**: Ubuntu 22.04 LTS

### Installation Steps

### 1. System Preparation

```bash
## Update system
sudo apt update && sudo apt upgrade -y

## Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

## Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

## Install Kubernetes
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
```bash

### 2. Network Configuration

```bash
## Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 6443/tcp
sudo ufw enable

## Configure hosts file
sudo echo "127.0.0.1 zarish-sphere.local" >> /etc/hosts
```text

### 3. Storage Setup

```bash
## Create data directories
sudo mkdir -p /opt/zarish-sphere/{data,logs,backups}
sudo chown -R $USER:$USER /opt/zarish-sphere

## Configure LVM for better performance
sudo pvcreate /dev/sdb
sudo vgcreate zarish-vg /dev/sdb
sudo lvcreate -l 100%FREE -n zarish-lv zarish-vg
sudo mkfs.ext4 /dev/zarish-vg/zarish-lv
sudo mount /dev/zarish-vg/zarish-lv /opt/zarish-sphere/data
```yaml

### 4. Docker Compose Configuration

```yaml
## docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: zarish_sphere
      POSTGRES_USER: zarish_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - /opt/zarish-sphere/data/postgres:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - '5432:5432'
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - /opt/zarish-sphere/data/redis:/data
    ports:
      - '6379:6379'
    restart: unless-stopped

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - 'ES_JAVA_OPTS=-Xms1g -Xmx1g'
    volumes:
      - /opt/zarish-sphere/data/elasticsearch:/usr/share/elasticsearch/data
    ports:
      - '9200:9200'
    restart: unless-stopped

  api:
    image: zarishsphere/api:latest
    environment:
      - DATABASE_URL=postgresql://zarish_user:${POSTGRES_PASSWORD}@postgres:5432/zarish_sphere
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - ELASTICSEARCH_URL=http://elasticsearch:9200
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
      - elasticsearch
    ports:
      - '3000:3000'
    volumes:
      - /opt/zarish-sphere/logs:/app/logs
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
```text

### 5. Nginx Configuration

```nginx
## nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:3000;
    }

    server {
        listen 80;
        server_name zarish-sphere.local;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name zarish-sphere.local;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384;

        location / {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            proxy_pass http://api/health;
            access_log off;
        }
    }
}
```yaml

### 3. Edge Deployment

### Use Cases

- Remote field clinics
- Disaster response scenarios
- Mobile health units
- Areas with limited connectivity

### Hardware Requirements

- **CPU**: 4 cores (ARM64 or x86_64)
- **Memory**: 8GB RAM
- **Storage**: 256GB SSD
- **Network**: WiFi/4G/5G connectivity
- **Power**: Battery backup or UPS

### Edge Configuration

### 1. Lightweight Setup

```yaml
## edge-docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: zarish_sphere
      POSTGRES_USER: zarish_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - ./data/redis:/data
    ports:
      - '6379:6379'
    deploy:
      resources:
        limits:
          memory: 256M

  api:
    image: zarishsphere/api:edge-latest
    environment:
      - DATABASE_URL=postgresql://zarish_user:${POSTGRES_PASSWORD}@postgres:5432/zarish_sphere
      - REDIS_URL=redis://redis:6379
      - EDGE_MODE=true
      - SYNC_ENABLED=true
      - SYNC_ENDPOINT=https://sync.zarishsphere.com
    depends_on:
      - postgres
      - redis
    ports:
      - '3000:3000'
    volumes:
      - ./offline-data:/app/offline-data
    deploy:
      resources:
        limits:
          memory: 1G
```text

### 2. Offline Sync Configuration

```javascript
// sync-config.js
module.exports = {
  sync: {
    enabled: true,
    endpoint: 'https://sync.zarishsphere.com',
    interval: 300000, // 5 minutes
    batchSize: 100,
    retryAttempts: 3,
    retryDelay: 5000,

    // Data to sync
    resources: ['Patient', 'Encounter', 'Observation', 'MedicationRequest'],

    // Conflict resolution
    conflictResolution: 'last-write-wins',

    // Compression
    compression: true,
    encryption: true,
  },

  offline: {
    enabled: true,
    storagePath: '/app/offline-data',
    maxStorageSize: '1GB',
    cleanupInterval: 3600000, // 1 hour
  },
};
```text

### 4. Hybrid Deployment

### Architecture

```mermaid
graph TB
    subgraph "Cloud"
        CLOUD_DB[(Cloud Database)]
        CLOUD_API[Cloud API]
        CLOUD_SYNC[Sync Service]
    end

    subgraph "Edge Sites"
        EDGE1[Edge Site 1]
        EDGE2[Edge Site 2]
        EDGE3[Edge Site 3]
    end

    subgraph "Central Office"
        ONPREM[On-Premises Server]
        LOCAL_DB[(Local Database)]
    end

    EDGE1 --> CLOUD_SYNC
    EDGE2 --> CLOUD_SYNC
    EDGE3 --> CLOUD_SYNC

    CLOUD_SYNC --> CLOUD_DB
    CLOUD_SYNC --> CLOUD_API

    ONPREM --> CLOUD_API
    LOCAL_DB --> CLOUD_DB
```text

### Configuration

```yaml
## hybrid-deployment.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: hybrid-config
data:
  config.yaml: |
    deployment:
      mode: hybrid
      primary: cloud
      backup: on-premises

    sync:
      strategy: bidirectional
      conflictResolution: manual
      encryption: true

    failover:
      enabled: true
      automatic: true
      healthCheckInterval: 30

    networking:
      vpn: true
      firewall: true
      loadBalancing: true
```text

## Configuration Management

### Environment Variables

### Required Variables

```bash
## Database Configuration
DATABASE_URL=postgresql://user:pass@host:5432/database
REDIS_URL=redis://:password@host:6379
ELASTICSEARCH_URL=http://host:9200

## Security
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key

## Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

## External Services
FHIR_BASE_URL=https://fhir.zarishsphere.com
NOTIFICATION_SERVICE_URL=https://notifications.zarishsphere.com
```text

### Optional Variables

```bash
## Monitoring
PROMETHEUS_ENABLED=true
METRICS_PORT=9090

## Caching
CACHE_TTL=3600
CACHE_MAX_SIZE=1000

## File Storage
FILE_STORAGE_TYPE=s3
AWS_S3_BUCKET=zarishsphere-files
AWS_REGION=us-west-2

## Email
SMTP_HOST=smtp.zarishsphere.com
SMTP_PORT=587
SMTP_USER=noreply@zarishsphere.com
SMTP_PASS=smtp-password
```text

### Secrets Management

### Kubernetes Secrets

```bash
## Create secrets
kubectl create secret generic postgres-credentials \
  --from-literal=url="postgresql://zarish_user:password@postgres:5432/zarish_sphere"

kubectl create secret generic jwt-secret \
  --from-literal=secret="your-super-secret-jwt-key"

kubectl create secret generic encryption-key \
  --from-literal=key="your-32-character-encryption-key"
```bash

### Docker Swarm Secrets

```bash
## Create secrets in Docker Swarm
echo "your-super-secret-jwt-key" | docker secret create jwt-secret -
echo "your-32-character-encryption-key" | docker secret create encryption-key -
```text

## Monitoring and Logging

### Monitoring Setup

### Prometheus Configuration

```yaml
## prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'zarish-sphere-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```text

### Grafana Dashboards

```json
{
  "dashboard": {
    "title": "ZARISH SPHERE Overview",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      },
      {
        "title": "Active Patients",
        "type": "stat",
        "targets": [
          {
            "expr": "zarish_sphere_active_patients_total"
          }
        ]
      }
    ]
  }
}
```text

### Logging Configuration

### ELK Stack Setup

```yaml
## filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/zarish-sphere/*.log
    fields:
      service: zarish-sphere-api
      environment: production

output.elasticsearch:
  hosts: ['elasticsearch:9200']
  index: 'zarish-sphere-%{+yyyy.MM.dd}'

setup.kibana:
  host: 'kibana:5601'
```text

## Security Configuration

### SSL/TLS Setup

### Let's Encrypt (Cloud)

```bash
## Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

## Create cluster issuer
kubectl create -f cluster-issuer.yaml
```text

### Self-Signed (On-Premises)

```bash
## Generate certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=zarish-sphere.local"
```text

### Network Security

### Firewall Rules

```bash
## UFW configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```text

### VPN Configuration

```bash
## WireGuard setup
sudo apt install wireguard

## Generate keys
wg genkey | sudo tee /etc/wireguard/private.key
sudo chmod 600 /etc/wireguard/private.key
sudo cat /etc/wireguard/private.key | wg pubkey | sudo tee /etc/wireguard/public.key
```bash

## Backup and Recovery

### Automated Backups

### Database Backups

```bash
#!/bin/bash
## backup.sh
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

## PostgreSQL backup
pg_dump -h localhost -U zarish_user zarish_sphere | gzip > $BACKUP_DIR/postgres_$DATE.sql.gz

## Redis backup
redis-cli --rdb $BACKUP_DIR/redis_$DATE.rdb

## Upload to cloud storage
aws s3 sync $BACKUP_DIR s3://zarishsphere-backups/$(date +%Y%m%d)/

## Cleanup old backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete
```bash

### Application Data Backups

```bash
#!/bin/bash
## app-backup.sh
BACKUP_DIR="/backups/app"
DATE=$(date +%Y%m%d_%H%M%S)

## Backup application data
tar -czf $BACKUP_DIR/app-data_$DATE.tar.gz /opt/zarish-sphere/data

## Backup configuration
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /opt/zarish-sphere/config

## Upload to cloud
aws s3 cp $BACKUP_DIR/app-data_$DATE.tar.gz s3://zarishsphere-backups/app/
aws s3 cp $BACKUP_DIR/config_$DATE.tar.gz s3://zarishsphere-backups/config/
```bash

### Disaster Recovery

### Recovery Procedures

```bash
#!/bin/bash
## recovery.sh
BACKUP_DATE=$1

## Restore database
gunzip -c /backups/postgres_$BACKUP_DATE.sql.gz | psql -h localhost -U zarish_user zarish_sphere

## Restore Redis
redis-cli FLUSHALL
redis-cli --rdb /backups/redis_$BACKUP_DATE.rdb

## Restore application data
tar -xzf /backups/app-data_$BACKUP_DATE.tar.gz -C /

## Restart services
docker-compose restart
```text

## Performance Optimization

### Database Optimization

### PostgreSQL Tuning

```sql
-- postgresql.conf optimizations
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```text

### Connection Pooling

```yaml
## pgpool.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pgpool
spec:
  replicas: 2
  selector:
    matchLabels:
      app: pgpool
  template:
    spec:
      containers:
        - name: pgpool
          image: bitnami/pgpool:4
          env:
            - name: PGPOOL_BACKEND_NODES
              value: 'postgres:5432'
            - name: PGPOOL_NUM_INIT_CHILDREN
              value: '32'
            - name: PGPOOL_MAX_POOL
              value: '50'
```javascript

### Application Optimization

### Caching Strategy

```javascript
// cache-config.js
const cache = require('memory-cache');

module.exports = {
  // Patient data cache (24 hours)
  patient: {
    ttl: 86400000,
    max: 1000,
  },

  // Clinical protocols cache (1 hour)
  protocols: {
    ttl: 3600000,
    max: 500,
  },

  // Drug interactions cache (6 hours)
  drugInteractions: {
    ttl: 21600000,
    max: 200,
  },
};
```sql

## Troubleshooting

### Common Issues

### Database Connection Issues

```bash
## Check database connectivity
docker exec -it postgres psql -U zarish_user -d zarish_sphere -c "SELECT 1;"

## Check connection pool
docker exec -it pgpool psql -h pgpool -U postgres -c "SHOW pool_status;"
```sql

### Performance Issues

```bash
## Check resource usage
docker stats

## Check database performance
docker exec -it postgres psql -U zarish_user -d zarish_sphere -c "
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;"
```bash

### Network Issues

```bash
## Check connectivity
curl -I https://api.zarishsphere.com/health

## Check DNS resolution
nslookup api.zarishsphere.com

## Check SSL certificates
openssl s_client -connect api.zarishsphere.com:443
```text

This comprehensive deployment guide provides everything needed to successfully deploy ZARISH SPHERE in any environment, from cloud to edge deployments.
````
