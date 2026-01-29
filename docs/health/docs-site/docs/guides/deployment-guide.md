# ZARISH HIS Infrastructure Documentation

## 🎯 Overview

This document provides comprehensive infrastructure guidelines for deploying, managing, and maintaining the ZARISH HIS platform. It covers containerization, orchestration, monitoring, security, and operational procedures.

## 🏗️ Architecture Overview

### Infrastructure Components
- **Kubernetes Cluster**: Container orchestration platform
- **Container Registry**: Docker image storage and management
- **Load Balancer**: Traffic distribution and SSL termination
- **Database Clusters**: PostgreSQL and Redis clusters
- **Message Queue**: Apache Kafka for event streaming
- **Monitoring Stack**: Prometheus, Grafana, and AlertManager
- **Logging Stack**: ELK (Elasticsearch, Logstash, Kibana)
- **CI/CD Pipeline**: GitHub Actions with ArgoCD

## 🐳 Containerization

### Docker Standards

#### Base Images
```dockerfile
# Backend Services
FROM golang:1.25-alpine AS builder
# Production stage
FROM alpine:latest

# Frontend Applications
FROM node:24-alpine AS builder
# Production stage
FROM nginx:alpine
```

#### Multi-stage Build Example
```dockerfile
# Backend Service Dockerfile
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Copy dependency files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/server/main.go

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
RUN addgroup -g 1001 -S zarish && \
    adduser -u 1001 -S zarish -G zarish

WORKDIR /app

# Copy binary
COPY --from=builder /app/main .

# Copy configuration
COPY --from=builder /app/configs ./configs

# Create non-root user
RUN chown zarish:zarish /app/main /app/configs
USER zarish

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./main"]
```

### Image Registry

#### Registry Structure
```
Registry: registry.zs-his.com/zs-his

Images:
  - zs-his/ms-patient-registry:latest
  - zs-his/ms-billing-engine:latest
  - zs-his/mf-doctor-portal:latest
  - zs-his/mf-patient-app:latest
```

#### Image Tagging Strategy
```bash
# Semantic versioning
registry.zs-his.com/zs-his/ms-patient-registry:1.0.0
registry.zs-his.com/zs-his/ms-patient-registry:1.0.1
registry.zs-his.com/zs-his/ms-patient-registry:1.1.0

# Environment tags
registry.zs-his.com/zs-his/ms-patient-registry:production
registry.zs-his.com/zs-his/ms-patient-registry:staging
registry.zs-his.com/zs-his/ms-patient-registry:development

# Git SHA tags
registry.zs-his.com/zs-his/ms-patient-registry:abc123def
```

## ☸️ Kubernetes Configuration

### Cluster Architecture

#### Cluster Components
```yaml
# cluster.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zs-his
  labels:
    name: zs-his
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: zs-his-config
  namespace: zs-his
data:
  LOG_LEVEL: "info"
  API_BASE_URL: "https://api.zarishsphere.com"
  ENVIRONMENT: "production"
```

#### Service Deployment Example
```yaml
# patient-registry-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patient-registry
  namespace: zs-his
  labels:
    app: patient-registry
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: patient-registry
  template:
    metadata:
      labels:
        app: patient-registry
        version: v1
    spec:
      containers:
      - name: patient-registry
        image: registry.zs-his.com/zs-his/ms-patient-registry:1.0.0
        ports:
        - containerPort: 8081
          name: http
        env:
        - name: DATABASE_HOST
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: host
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8081
          initialDelaySeconds: 5
          periodSeconds: 5
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
              - ALL
      imagePullSecrets:
      - name: registry-secret
---
apiVersion: v1
kind: Service
metadata:
  name: patient-registry
  namespace: zs-his
spec:
  selector:
    app: patient-registry
  ports:
  - port: 80
    targetPort: 8081
    name: http
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: patient-registry
  namespace: zs-his
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - api.zarishsphere.com
    secretName: zs-his-tls
  rules:
  - host: api.zarishsphere.com
    http:
      paths:
      - path: /v1/patient-registry
        pathType: Prefix
        backend:
          service:
            name: patient-registry
            port:
              number: 80
```

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: patient-registry-hpa
  namespace: zs-his
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: patient-registry
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## 🗄️ Database Management

### PostgreSQL Configuration

#### Primary Database Cluster
```yaml
# postgresql.yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres-cluster
  namespace: zs-his
spec:
  instances: 3
  
  postgresql:
    parameters:
      max_connections: "200"
      shared_buffers: "256MB"
      effective_cache_size: "1GB"
      maintenance_work_mem: "64MB"
      checkpoint_completion_target: "0.9"
      wal_buffers: "16MB"
      default_statistics_target: "100"
      random_page_cost: "1.1"
      effective_io_concurrency: "200"
      
  bootstrap:
    initdb:
      database: zarish_his
      owner: zarish
      secret:
        name: postgres-credentials
        
  storage:
    size: 100Gi
    storageClass: fast-ssd
    
  monitoring:
    enabled: true
```

#### Connection Pooling
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
  namespace: zs-his
data:
  max_connections: "100"
  max_idle_connections: "20"
  max_lifetime: "3600"
  idle_timeout: "300"
```

### Redis Configuration

#### Redis Cluster
```yaml
apiVersion: redis.redis.opstreelabs.io/v1beta1
kind: RedisCluster
metadata:
  name: redis-cluster
  namespace: zs-his
spec:
  size: 3
  redisExporter:
    enabled: true
  storage:
    type: persistent-claim
    size: 10Gi
  securityContext:
    runAsUser: 999
    runAsGroup: 999
    fsGroup: 999
```

## 📊 Monitoring and Observability

### Prometheus Configuration

#### Prometheus Server
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    rule_files:
      - "/etc/prometheus/rules/*.yml"
    
    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: true
          - action: labelmap
            regex: __meta_kubernetes_pod_label_(.+)
            replacement: $1
          - source_labels: [__address__]
            target_label: instance
            replacement: 'kubernetes-pods'
```

#### Service Monitors
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: patient-registry-metrics
  namespace: zs-his
  labels:
    app: patient-registry
spec:
  selector:
    matchLabels:
      app: patient-registry
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics
```

### Grafana Dashboards

#### Dashboard Configuration
```json
{
  "dashboard": {
    "title": "ZARISH HIS Patient Registry",
    "tags": ["zs-his", "patient-registry"],
    "timezone": "browser",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{job=\"patient-registry\"}[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ],
        "gridPos": {
          "h": 8,
          "w": 12
        }
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job=\"patient-registry\"}[5m]))",
            "legendFormat": "95th percentile"
          }
        ],
        "gridPos": {
          "h": 8,
          "w": 12
        }
      }
    ]
  }
}
```

## 📝 Logging Strategy

### Log Aggregation

#### Fluentd Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: zs-his
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type kubernetes_metadata
      </parse>
    </source>
    
    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>
    
    <match kubernetes.var.log.containers.**zs-his**>
      @type elasticsearch
      host elasticsearch.logging.svc.cluster.local
      port 9200
      index_name zs-his-logs
      type_name _doc
      include_tag_key true
      tag_key @log_name
    </match>
```

### Log Levels
```yaml
# logging-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: logging-config
  namespace: zs-his
data:
  LOG_LEVEL: "info"
  LOG_FORMAT: "json"
  LOG_OUTPUT: "stdout"
  
  # Service-specific log levels
  PATIENT_REGISTRY_LOG_LEVEL: "info"
  BILLING_ENGINE_LOG_LEVEL: "warn"
  DOCTOR_PORTAL_LOG_LEVEL: "error"
```

## 🔐 Security Configuration

### Network Policies

#### Default Deny All
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: zs-his
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

#### Allow Internal Traffic
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-internal-traffic
  namespace: zs-his
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: zs-his
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: zs-his
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 443
    - protocol: TCP
      port: 80
```

### RBAC Configuration

#### Service Accounts
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: patient-registry
  namespace: zs-his
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: zs-his
  name: patient-registry-role
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: patient-registry-binding
  namespace: zs-his
subjects:
- kind: ServiceAccount
  name: patient-registry
  namespace: zs-his
roleRef:
  kind: Role
  name: patient-registry-role
  apiGroup: rbac.authorization.k8s.io
```

### Secrets Management

#### External Secrets Operator
```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: zs-his
spec:
  provider:
    vault:
      server: "https://vault.zs-his.com"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "zs-his"
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.25'
    
    - name: Run tests
      run: go test -v ./...
    
    - name: Run security scan
      run: |
        go list -json -m all | xargs -L 1 gosec ./...

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: zs-his/patient-registry
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    
    - name: Deploy to Kubernetes
      run: |
        aws eks update-kubeconfig --name zs-his-cluster
        kubectl set image deployment/patient-registry \
          patient-registry=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
          -n zs-his
        kubectl rollout status deployment/patient-registry -n zs-his
```

## 🔄 Disaster Recovery

### Backup Strategy

#### Database Backups
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: zs-his
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: postgres-backup
            image: postgres:13
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB \
                | gzip > /backup/backup-$(date +%Y%m%d-%H%M%S).sql.gz
            env:
            - name: POSTGRES_HOST
              valueFrom:
                secretKeyRef:
                  name: postgres-credentials
                  key: host
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: postgres-credentials
                  key: username
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-credentials
                  key: password
            - name: POSTGRES_DB
              value: zarish_his
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
```

### Recovery Procedures

#### Database Recovery
```bash
# Restore from backup
kubectl exec -it postgres-0 -n zs-his -- bash

# Create recovery database
createdb zarish_his_recovery

# Restore from backup
gunzip -c /backup/backup-20240101-020000.sql.gz | psql zarish_his_recovery

# Verify data
psql zarish_his_recovery -c "\dt"

# Switch to recovery database if needed
```

## 📈 Performance Optimization

### Resource Limits and Requests
```yaml
# resource-quotas.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: zs-his-quota
  namespace: zs-his
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    persistentvolumeclaims: "10"
    services: "20"
    secrets: "20"
    configmaps: "20"
```

### Horizontal Pod Autoscaling
```yaml
# hpa-config.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: patient-registry-hpa
  namespace: zs-his
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: patient-registry
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
```

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Infrastructure Team: ZARISH HIS*
