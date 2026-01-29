# Kubernetes Deployment Guide

## 🎯 Overview

Comprehensive Kubernetes deployment guide for ZARISH HIS with Bangladesh healthcare context and production-ready configurations.

## ☸️ Kubernetes Architecture

### Cluster Overview

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zarish-his
  labels:
    name: zarish-his
    environment: production
    region: bangladesh
---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: zarish-config
  namespace: zarish-his
data:
  TIMEZONE: "Asia/Dhaka"
  LOCALE: "bn_BD.UTF-8"
  CURRENCY: "BDT"
  ENVIRONMENT: "production"
  LOG_LEVEL: "info"
  METRICS_ENABLED: "true"
  TRACING_ENABLED: "true"
---
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: zarish-secrets
  namespace: zarish-his
type: Opaque
data:
  postgres-password: <base64-encoded-password>
  redis-password: <base64-encoded-password>
  jwt-secret: <base64-encoded-jwt-secret>
  dghs-api-key: <base64-encoded-dghs-key>
  unhcr-api-key: <base64-encoded-unhcr-key>
  bkash-api-key: <base64-encoded-bkash-key>
  nagad-api-key: <base64-encoded-nagad-key>
```

### Persistent Storage

```yaml
# k8s/storage/postgres-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: zarish-his
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: fast-ssd
---
# k8s/storage/redis-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: zarish-his
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: fast-ssd
---
# k8s/storage/logs-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: logs-pvc
  namespace: zarish-his
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 50Gi
  storageClassName: standard
```

### Database Deployments

```yaml
# k8s/deployments/postgres.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: zarish-his
  labels:
    app: postgres
    component: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
        component: database
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: zarish_his
        - name: POSTGRES_USER
          value: zarish_user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: postgres-password
        - name: POSTGRES_INITDB_ARGS
          value: "--encoding=UTF-8 --locale=en_US.UTF-8"
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        - name: init-scripts
          mountPath: /docker-entrypoint-initdb.d
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - zarish_user
            - -d
            - zarish_his
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - zarish_user
            - -d
            - zarish_his
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
      - name: init-scripts
        configMap:
          name: postgres-init-scripts
---
# k8s/services/postgres-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: zarish-his
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
```

### Redis Deployment

```yaml
# k8s/deployments/redis.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: zarish-his
  labels:
    app: redis
    component: cache
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
        component: cache
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        command:
        - redis-server
        - --appendonly
        - "yes"
        - --requirepass
        - $(REDIS_PASSWORD)
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: redis-password
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-storage
          mountPath: /data
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - redis-cli
            - --raw
            - incr
            - ping
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - redis-cli
            - --raw
            - incr
            - ping
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: redis-storage
        persistentVolumeClaim:
          claimName: redis-pvc
---
# k8s/services/redis-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: zarish-his
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
  type: ClusterIP
```

### Application Deployments

```yaml
# k8s/deployments/patient-registry.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patient-registry
  namespace: zarish-his
  labels:
    app: patient-registry
    component: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: patient-registry
  template:
    metadata:
      labels:
        app: patient-registry
        component: backend
    spec:
      containers:
      - name: patient-registry
        image: zarish-his/patient-registry:latest
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: zarish-config
              key: ENVIRONMENT
        - name: DATABASE_URL
          value: "postgresql://zarish_user:$(POSTGRES_PASSWORD)@postgres-service:5432/zarish_his"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: postgres-password
        - name: REDIS_URL
          value: "redis://:$(REDIS_PASSWORD)@redis-service:6379"
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: redis-password
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: jwt-secret
        - name: DGHS_API_KEY
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: dghs-api-key
        - name: UNHCR_API_KEY
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: unhcr-api-key
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
# k8s/services/patient-registry-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: patient-registry-service
  namespace: zarish-his
spec:
  selector:
    app: patient-registry
  ports:
  - port: 8080
    targetPort: 8080
  type: ClusterIP
---
# k8s/autoscalers/patient-registry-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: patient-registry-hpa
  namespace: zarish-his
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

### Ingress Configuration

```yaml
# k8s/ingress/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zarish-his-ingress
  namespace: zarish-his
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.zarish-his.com
    - app.zarish-his.com
    secretName: zarish-his-tls
  rules:
  - host: api.zarish-his.com
    http:
      paths:
      - path: /api/v1/patients(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: patient-registry-service
            port:
              number: 8080
      - path: /api/v1/billing(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: billing-engine-service
            port:
              number: 8081
  - host: app.zarish-his.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: esm-admin-service
            port:
              number: 3000
```

## 🔧 Monitoring and Observability

### Prometheus Monitoring

```yaml
# k8s/monitoring/prometheus.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: zarish-his
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        args:
        - '--config.file=/etc/prometheus/prometheus.yml'
        - '--storage.tsdb.path=/prometheus'
        - '--web.console.libraries=/etc/prometheus/console_libraries'
        - '--web.console.templates=/etc/prometheus/consoles'
        - '--storage.tsdb.retention.time=200h'
        - '--web.enable-lifecycle'
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
        - name: prometheus-storage
          mountPath: /prometheus
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
      - name: prometheus-storage
        persistentVolumeClaim:
          claimName: prometheus-pvc
---
# k8s/monitoring/grafana.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: zarish-his
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        env:
        - name: GF_SECURITY_ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: grafana-password
        - name: GF_USERS_ALLOW_SIGN_UP
          value: "false"
        ports:
        - containerPort: 3000
        volumeMounts:
        - name: grafana-storage
          mountPath: /var/lib/grafana
        - name: grafana-config
          mountPath: /etc/grafana/provisioning
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
      volumes:
      - name: grafana-storage
        persistentVolumeClaim:
          claimName: grafana-pvc
      - name: grafana-config
        configMap:
          name: grafana-config
```

### Logging with ELK Stack

```yaml
# k8s/logging/elasticsearch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elasticsearch
  namespace: zarish-his
spec:
  replicas: 1
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
        env:
        - name: discovery.type
          value: single-node
        - name: xpack.security.enabled
          value: "false"
        - name: ES_JAVA_OPTS
          value: "-Xms512m -Xmx512m"
        ports:
        - containerPort: 9200
        - containerPort: 9300
        volumeMounts:
        - name: elasticsearch-storage
          mountPath: /usr/share/elasticsearch/data
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
      volumes:
      - name: elasticsearch-storage
        persistentVolumeClaim:
          claimName: elasticsearch-pvc
---
# k8s/logging/kibana.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kibana
  namespace: zarish-his
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kibana
  template:
    metadata:
      labels:
        app: kibana
    spec:
      containers:
      - name: kibana
        image: docker.elastic.co/kibana/kibana:8.11.0
        env:
        - name: ELASTICSEARCH_HOSTS
          value: "http://elasticsearch-service:9200"
        ports:
        - containerPort: 5601
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

## 🚀 Deployment Scripts

### Kubernetes Deployment Script

```bash
#!/bin/bash
# scripts/k8s-deploy.sh

set -e

NAMESPACE="zarish-his"
KUBECTL="kubectl"

echo "🚀 Starting ZARISH HIS Kubernetes Deployment..."

# Create namespace
echo "📦 Creating namespace..."
$KUBECTL apply -f k8s/namespace.yaml

# Apply secrets and configmaps
echo "🔧 Applying secrets and configmaps..."
$KUBECTL apply -f k8s/secrets.yaml
$KUBECTL apply -f k8s/configmap.yaml

# Apply storage
echo "💾 Creating persistent storage..."
$KUBECTL apply -f k8s/storage/

# Deploy database
echo "🗄️ Deploying database..."
$KUBECTL apply -f k8s/deployments/postgres.yaml
$KUBECTL apply -f k8s/services/postgres-service.yaml

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
$KUBECTL wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s

# Deploy Redis
echo "🔄 Deploying Redis..."
$KUBECTL apply -f k8s/deployments/redis.yaml
$KUBECTL apply -f k8s/services/redis-service.yaml

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
$KUBECTL wait --for=condition=ready pod -l app=redis -n $NAMESPACE --timeout=300s

# Deploy applications
echo "🏥 Deploying applications..."
$KUBECTL apply -f k8s/deployments/patient-registry.yaml
$KUBECTL apply -f k8s/services/patient-registry-service.yaml
$KUBECTL apply -f k8s/deployments/billing-engine.yaml
$KUBECTL apply -f k8s/services/billing-engine-service.yaml
$KUBECTL apply -f k8s/deployments/esm-admin.yaml
$KUBECTL apply -f k8s/services/esm-admin-service.yaml

# Wait for applications to be ready
echo "⏳ Waiting for applications to be ready..."
$KUBECTL wait --for=condition=ready pod -l component=backend -n $NAMESPACE --timeout=300s
$KUBECTL wait --for=condition=ready pod -l component=frontend -n $NAMESPACE --timeout=300s

# Apply autoscalers
echo "📈 Applying autoscalers..."
$KUBECTL apply -f k8s/autoscalers/

# Apply ingress
echo "🌐 Applying ingress..."
$KUBECTL apply -f k8s/ingress/

# Deploy monitoring
echo "📊 Deploying monitoring..."
$KUBECTL apply -f k8s/monitoring/

# Deploy logging
echo "📝 Deploying logging..."
$KUBECTL apply -f k8s/logging/

echo "✅ Deployment completed successfully!"
echo "🌐 Access the application at: https://app.zarish-his.com"
echo "📈 Grafana dashboard at: https://app.zarish-his.com/grafana"
echo "🔍 Kibana logs at: https://app.zarish-his.com/kibana"
```

### Health Check Script

```bash
#!/bin/bash
# scripts/k8s-health-check.sh

set -e

NAMESPACE="zarish-his"
KUBECTL="kubectl"

echo "🏥 Running Kubernetes health checks..."

# Check pod status
echo "📋 Checking pod status..."
$KUBECTL get pods -n $NAMESPACE

# Check service status
echo "🔌 Checking service status..."
$KUBECTL get services -n $NAMESPACE

# Check ingress status
echo "🌐 Checking ingress status..."
$KUBECTL get ingress -n $NAMESPACE

# Check resource usage
echo "📊 Checking resource usage..."
$KUBECTL top pods -n $NAMESPACE

# Check logs for errors
echo "📝 Checking for errors..."
$KUBECTL logs -n $NAMESPACE -l component=backend --tail=50 | grep -i error || echo "No errors found"

echo "✅ Health check completed!"
```

## 🔄 Bangladesh-Specific Configurations

### Bangladesh Timezone Configuration

```yaml
# k8s/configmaps/bangladesh-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: bangladesh-config
  namespace: zarish-his
data:
  timezone: "Asia/Dhaka"
  locale: "bn_BD.UTF-8"
  currency: "BDT"
  date_format: "DD-MM-YYYY"
  time_format: "HH:mm:ss"
  number_format: "bn-BD"
  emergency_numbers: "999,16263,10655"
  health_hotline: "10655"
  covid_hotline: "16263"
```

### Administrative Data Initialization

```yaml
# k8s/jobs/init-bangladesh-data.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: init-bangladesh-data
  namespace: zarish-his
spec:
  template:
    spec:
      containers:
      - name: init-data
        image: zarish-his/data-init:latest
        env:
        - name: DATABASE_URL
          value: "postgresql://zarish_user:$(POSTGRES_PASSWORD)@postgres-service:5432/zarish_his"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zarish-secrets
              key: postgres-password
        command: ["node", "scripts/init-bangladesh-data.js"]
        volumeMounts:
        - name: data-scripts
          mountPath: /app/scripts
      volumes:
      - name: data-scripts
        configMap:
          name: bangladesh-data-scripts
      restartPolicy: OnFailure
```

### Rohingya Camp Data Configuration

```yaml
# k8s/configmaps/rohingya-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: rohingya-config
  namespace: zarish-his
data:
  camps.json: |
    {
      "camps": [
        {
          "code": "KTP",
          "name": "Kutupalong",
          "name_my": "ကုတ်ပုလုံ",
          "district": "Cox's Bazar",
          "coordinates": {"lat": 21.1234, "lng": 92.1234},
          "population": 600000,
          "blocks": [
            {"code": "A", "name": "Block A", "name_my": "တိုံးအေ"},
            {"code": "B", "name": "Block B", "name_my": "တိုံးဘီ"}
          ]
        }
      ]
    }
  health_services.json: |
    {
      "services": [
        {
          "type": "OPD",
          "name": "Outpatient Department",
          "name_bn": "বহির্বিভাগ",
          "name_my": "ပြင်ပဌာန"
        },
        {
          "type": "IPD",
          "name": "Inpatient Department",
          "name_bn": "অন্তর্বিভাগ",
          "name_my": "အတွင်းဌာန"
        }
      ]
    }
```

---

**Guide Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: ZARISH HIS Kubernetes Standards
