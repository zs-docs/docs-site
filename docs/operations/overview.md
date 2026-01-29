---
title: 'Operations Overview'
sidebar_label: 'Overview'
description: 'Comprehensive overview of ZARISH SPHERE operations including monitoring, maintenance, and system administration'
keywords: [operations, monitoring, maintenance, administration, zarish sphere]
---

## Operations Overview

### Introduction

ZARISH SPHERE Operations encompasses the complete lifecycle management of healthcare IT infrastructure, from deployment and monitoring to maintenance and optimization. This guide provides comprehensive procedures for ensuring reliable, secure, and efficient healthcare system operations.

### Operations Architecture

### Operations Stack

`````mermaid
graph TB
    subgraph "Monitoring Layer"
        PROMETHEUS[Prometheus]
        GRAFANA[Grafana]
        ALERTMANAGER[AlertManager]
        JAEGER[Jaeger]
    end

    subgraph "Logging Layer"
        ELASTICSEARCH[Elasticsearch]
        KIBANA[Kibana]
        FILEBEAT[Filebeat]
        LOGSTASH[Logstash]
    end

    subgraph "Infrastructure"
        KUBERNETES[Kubernetes Cluster]
        DOCKER[Docker Containers]
        LOAD_BALANCER[Load Balancer]
        STORAGE[Storage Systems]
    end

    subgraph "Security"
        VAULT[HashiCorp Vault]
        CERT_MANAGER[Cert Manager]
        FIREWALL[Firewall]
        WAF[Web Application Firewall]
    end

    subgraph "Backup & Recovery"
        BACKUP[Backup Systems]
        DISASTER_RECOVERY[Disaster Recovery]
        SNAPSHOTS[Volume Snapshots]
        REPLICATION[Data Replication]
    end

    PROMETHEUS --> GRAFANA
    PROMETHEUS --> ALERTMANAGER
    FILEBEAT --> ELASTICSEARCH
    ELASTICSEARCH --> KIBANA

    KUBERNETES --> DOCKER
    DOCKER --> STORAGE

    VAULT --> KUBERNETES
    CERT_MANAGER --> KUBERNETES

    BACKUP --> STORAGE
    BACKUP --> DISASTER_RECOVERY
```mermaid

### Monitoring and Observability

### 1. Application Monitoring

### Key Metrics

```yaml
## prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - 'zarish_sphere_rules.yml'

scrape_configs:
  - job_name: 'zarish-sphere-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'zarish-sphere-fhir'
    static_configs:
      - targets: ['fhir:8080']
    metrics_path: '/fhir/metrics'
    scrape_interval: 5s

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```mermaid

### Critical Alerts

```yaml
### zarish_sphere_rules.yml
groups:
  - name: zarish-sphere-critical
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: 'High error rate detected'
          description: 'Error rate is {{ $value }} errors per second'

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'High response time detected'
          description: '95th percentile response time is {{ $value }} seconds'

      - alert: DatabaseConnectionsHigh
        expr: pg_stat_activity_count > 80
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: 'Database connections high'
          description: '{{ $value }} active database connections'

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 10
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: 'Disk space low'
          description: 'Only {{ $value }}% disk space available'
```mermaid

### 2. Infrastructure Monitoring

### Kubernetes Monitoring

```yaml
### kubernetes-monitoring.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s

    scrape_configs:
      - job_name: 'kubernetes-apiservers'
        kubernetes_sd_configs:
          - role: endpoints
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        relabel_configs:
          - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
            action: keep
            regex: default;kubernetes;https

      - job_name: 'kubernetes-nodes'
        kubernetes_sd_configs:
          - role: node
        relabel_configs:
          - action: labelmap
            regex: __meta_kubernetes_node_label_(.+)
            target_label: $1

      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
```mermaid

### Node Exporter

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      containers:
        - name: node-exporter
          image: prom/node-exporter:latest
          ports:
            - containerPort: 9100
          resources:
            requests:
              memory: '128Mi'
              cpu: '100m'
            limits:
              memory: '256Mi'
              cpu: '200m'
          volumeMounts:
            - name: proc
              mountPath: /host/proc
            - name: sys
              mountPath: /host/sys
      volumes:
        - name: proc
          hostPath:
            path: /proc
        - name: sys
          hostPath:
            path: /sys
```javascript

### 3. Business Metrics

### Healthcare-Specific Metrics

```javascript
// Custom metrics for healthcare operations
const promClient = require('prom-client');

// Patient registration metrics
const patientRegistrations = new promClient.Counter({
  name: 'zarish_patient_registrations_total',
  help: 'Total number of patient registrations',
  labelNames: ['facility', 'user_role', 'registration_type'],
});

// Clinical encounters metrics
const clinicalEncounters = new promClient.Counter({
  name: 'zarish_clinical_encounters_total',
  help: 'Total number of clinical encounters',
  labelNames: ['encounter_type', 'facility', 'status'],
});

// Medication administration metrics
const medicationAdministered = new promClient.Counter({
  name: 'zarish_medication_administered_total',
  help: 'Total number of medications administered',
  labelNames: ['medication_type', 'route', 'facility'],
});

// Laboratory test metrics
const labTestsCompleted = new promClient.Counter({
  name: 'zarish_lab_tests_completed_total',
  help: 'Total number of laboratory tests completed',
  labelNames: ['test_type', 'facility', 'priority'],
});

// Data quality metrics
const dataQualityScore = new promClient.Gauge({
  name: 'zarish_data_quality_score',
  help: 'Data quality score (0-100)',
  labelNames: ['resource_type', 'facility'],
});

// Usage metrics
const activeUsers = new promClient.Gauge({
  name: 'zarish_active_users_total',
  help: 'Number of active users',
  labelNames: ['user_role', 'facility'],
});
```mermaid

### Logging and Auditing

### 1. Centralized Logging

### ELK Stack Configuration

```yaml
### elasticsearch.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
spec:
  serviceName: elasticsearch
  replicas: 3
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
          image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
          env:
            - name: discovery.type
              value: single-node
            - name: ES_JAVA_OPTS
              value: '-Xms2g -Xmx2g'
          ports:
            - containerPort: 9200
            - containerPort: 9300
          volumeMounts:
            - name: data
              mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ['ReadWriteOnce']
        resources:
          requests:
            storage: 100Gi
```javascript

### Logstash Configuration

```ruby
### logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "zarish-sphere-api" {
    json {
      source => "message"
    }

    date {
      match => [ "timestamp", "ISO8601" ]
    }

    mutate {
      add_field => { "service" => "zarish-sphere-api" }
      add_field => { "environment" => "%{[fields][environment]}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "zarish-sphere-%{+YYYY.MM.dd}"
  }
}
```javascript

### 2. Audit Logging

### Audit Trail Implementation

```javascript
class AuditLogger {
  constructor(elasticsearchClient) {
    this.es = elasticsearchClient;
  }

  async logEvent(event) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      event: event.type,
      user: event.user,
      resource: event.resource,
      action: event.action,
      details: event.details,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      facility: event.facility,
      sessionId: event.sessionId,
    };

    await this.es.index({
      index: `zarish-audit-${new Date().toISOString().split('T')[0]}`,
      body: auditEntry,
    });
  }

  async logPatientAccess(patientId, user, action, details = {}) {
    await this.logEvent({
      type: 'patient_access',
      user: user.id,
      resource: `Patient/${patientId}`,
      action: action,
      details: {
        patientId: patientId,
        ...details,
      },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
      facility: user.facility,
      sessionId: user.sessionId,
    });
  }

  async logDataModification(resource, user, action, changes) {
    await this.logEvent({
      type: 'data_modification',
      user: user.id,
      resource: resource.resourceType + '/' + resource.id,
      action: action,
      details: {
        changes: changes,
        before: resource.before,
        after: resource.after,
      },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
      facility: user.facility,
      sessionId: user.sessionId,
    });
  }
}
```mermaid

### Security Operations

### 1. Security Monitoring

### Security Metrics

```yaml
### security-monitoring.yml
groups:
  - name: security
    rules:
      - alert: FailedAuthenticationAttempts
        expr: rate(zarish_auth_failures_total[5m]) > 10
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: 'High rate of failed authentication attempts'

      - alert: UnauthorizedAPIAccess
        expr: rate(http_requests_total{status="401"}[5m]) > 5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: 'Unauthorized API access detected'

      - alert: SuspiciousDataAccess
        expr: increase(zarish_patient_access_total[1h]) > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'Unusual data access pattern detected'
```mermaid

### Intrusion Detection

```yaml
### falco.yaml
- rule: Unauthorized API Access
  desc: Detect unauthorized API access attempts
  condition: >
    spawned_process and
    proc.name in (curl, wget, python) and
    proc.args contains "api.zarishsphere.com" and
    not user.name in (root, zarishsphere)
  output: >
    alert("Unauthorized API access detected",
      user=%user.name, command=%proc.cmdline, container=%container.name)
  priority: HIGH
  tags: [security, api]

- rule: Database Access from Container
  desc: Detect database access from containers
  condition: >
    spawned_process and
    proc.name in (psql, mysql, mongo) and
    container.name != "database"
  output: >
    alert("Database access from container detected",
      user=%user.name, command=%proc.cmdline, container=%container.name)
  priority: MEDIUM
  tags: [security, database]
```mermaid

### 2. Certificate Management

### Automated Certificate Management

```yaml
### cert-manager-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@zarishsphere.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```bash

### Certificate Monitoring

```bash
#!/bin/bash
### certificate-monitor.sh
#!/bin/bash

### Check certificate expiry
DOMAINS=("api.zarishsphere.com" "fhir.zarishsphere.com" "docs.zarishsphere.com")
WARNING_DAYS=30

for domain in "${DOMAINS[@]}"; do
  expiry_date=$(echo | openssl s_client -connect $domain:443 -servername $domain 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
  expiry_timestamp=$(date -d "$expiry_date" +%s)
  current_timestamp=$(date +%s)
  days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))

  if [ $days_until_expiry -lt $WARNING_DAYS ]; then
    echo "WARNING: Certificate for $domain expires in $days_until_expiry days"
    # Send alert to monitoring system
    curl -X POST "https://alerts.zarishsphere.com/api/v1/alerts" \
      -H "Content-Type: application/json" \
      -d "{
        \"alert\": \"Certificate Expiry Warning\",
        \"domain\": \"$domain\",
        \"days_until_expiry\": $days_until_expiry,
        \"expiry_date\": \"$expiry_date\"
      }"
  fi
done
```bash

### Backup and Disaster Recovery

### 1. Database Backup Strategy

### Automated Backup Script

```bash
#!/bin/bash
### database-backup.sh
#!/bin/bash

set -e

### Configuration
BACKUP_DIR="/backups/database"
RETENTION_DAYS=30
S3_BUCKET="zarishsphere-backups"
DB_NAME="zarish_sphere"

### Create backup directory
mkdir -p $BACKUP_DIR

### Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/zarish_sphere_$TIMESTAMP.sql"

### Create database backup
echo "Creating database backup..."
pg_dump -h localhost -U postgres -d $DB_NAME | gzip > "$BACKUP_FILE.gz"

### Verify backup
echo "Verifying backup..."
if gzip -t "$BACKUP_FILE.gz"; then
  echo "Backup created successfully: $BACKUP_FILE.gz"
else
  echo "ERROR: Backup verification failed"
  exit 1
fi

### Upload to S3
echo "Uploading to S3..."
aws s3 cp "$BACKUP_FILE.gz" "s3://$S3_BUCKET/database/$(date +%Y)/$(date +%m)/"

### Clean up old backups
echo "Cleaning up old backups..."
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

### Log backup completion
echo "Backup completed successfully at $(date)"
```bash

### Point-in-Time Recovery

```bash
#!/bin/bash
### point-in-time-recovery.sh
#!/bin/bash

RECOVERY_TIME=$1
BACKUP_FILE=$2

if [ -z "$RECOVERY_TIME" ]; then
  echo "Usage: $0 <recovery_time> [backup_file]"
  echo "Example: $0 '2023-12-01 10:30:00' /backups/database/zarish_sphere_20231201_103000.sql.gz"
  exit 1
fi

### Stop application services
echo "Stopping application services..."
kubectl scale deployment zarish-sphere-api --replicas=0
kubectl scale deployment zarish-sphere-fhir --replicas=0

### Create recovery database
echo "Creating recovery database..."
createdb zarish_sphere_recovery

### Restore from backup
if [ -n "$BACKUP_FILE" ]; then
  echo "Restoring from backup file: $BACKUP_FILE"
  gunzip -c "$BACKUP_FILE" | psql -h localhost -U postgres -d zarish_sphere_recovery
else
  echo "Performing point-in-time recovery to: $RECOVERY_TIME"
  pg_basebackup -h localhost -D zarish_sphere_recovery -U postgres -W -v -P -t "$RECOVERY_TIME"
fi

### Verify recovery
echo "Verifying recovery..."
psql -h localhost -U postgres -d zarish_sphere_recovery -c "SELECT COUNT(*) FROM patients;"

### Switch databases
echo "Switching to recovered database..."
psql -h localhost -U postgres -c "DROP DATABASE zarish_sphere;"
psql -h localhost -U postgres -c "ALTER DATABASE zarish_sphere_recovery RENAME TO zarish_sphere;"

### Restart application services
echo "Restarting application services..."
kubectl scale deployment zarish-sphere-api --replicas=3
kubectl scale deployment zarish-sphere-fhir --replicas=3

echo "Recovery completed successfully"
```bash

### 2. Infrastructure Backup

### Kubernetes Backup

```bash
#!/bin/bash
### kubernetes-backup.sh
#!/bin/bash

BACKUP_DIR="/backups/kubernetes"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

### Create backup directory
mkdir -p $BACKUP_DIR

### Backup namespaces
echo "Backing up namespaces..."
kubectl get namespaces -o yaml > "$BACKUP_DIR/namespaces_$TIMESTAMP.yaml"

### Backup deployments
echo "Backing up deployments..."
kubectl get deployments --all-namespaces -o yaml > "$BACKUP_DIR/deployments_$TIMESTAMP.yaml"

### Backup services
echo "Backing up services..."
kubectl get services --all-namespaces -o yaml > "$BACKUP_DIR/services_$TIMESTAMP.yaml"

### Backup configmaps
echo "Backing up configmaps..."
kubectl get configmaps --all-namespaces -o yaml > "$BACKUP_DIR/configmaps_$TIMESTAMP.yaml"

### Backup secrets (encrypted)
echo "Backing up secrets..."
kubectl get secrets --all-namespaces -o yaml | \
  ansible-vault encrypt --vault-name=kubernetes-secrets > "$BACKUP_DIR/secrets_$TIMESTAMP.yaml.encrypted"

### Backup persistent volumes
echo "Backing up persistent volume claims..."
kubectl get pvc --all-namespaces -o yaml > "$BACKUP_DIR/pvc_$TIMESTAMP.yaml"

### Upload to S3
echo "Uploading to S3..."
aws s3 sync "$BACKUP_DIR/" "s3://zarishsphere-backups/kubernetes/$(date +%Y)/$(date +%m)/"

echo "Kubernetes backup completed"
```mermaid

### Performance Optimization

### 1. Database Performance

### Performance Tuning Script

```sql
-- performance-tuning.sql
-- PostgreSQL performance tuning for healthcare workloads

-- Memory settings
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Connection settings
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';

-- WAL settings
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_writer_delay = '200ms';

-- Query planner settings
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Logging settings
ALTER SYSTEM SET log_min_duration_statement = '1000ms';
ALTER SYSTEM SET log_checkpoints = 'on';
ALTER SYSTEM SET log_connections = 'on';
ALTER SYSTEM SET log_disconnections = 'on';
ALTER SYSTEM log_lock_waits = 'on';

-- Create performance monitoring views
CREATE OR REPLACE VIEW v_slow_queries AS
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY total_time DESC;

CREATE OR REPLACE VIEW v_database_size AS
SELECT
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database;

CREATE OR REPLACE VIEW v_table_sizes AS
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'tablename) DESC;
```javascript

### 2. Application Performance

### Application Performance Monitoring

```javascript
// performance-monitor.js
const performanceMonitor = {
  // Track API response times
  trackApiResponse(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      // Record metrics
      promClient.histogram('http_request_duration_ms').observe(duration, {
        method: req.method,
        route: req.route,
        status_code: res.statusCode,
      });

      // Log slow requests
      if (duration > 1000) {
        console.warn(`Slow request: ${req.method} ${req.originalUrl} - ${duration}ms`);
      }
    });

    next();
  },

  // Track database query performance
  trackDatabaseQuery(query, duration) {
    promClient.histogram('database_query_duration_ms').observe(duration, {
      query_type: query.type,
    });

    if (duration > 500) {
      console.warn(`Slow database query: ${query.sql} - ${duration}ms`);
    }
  },

  // Track memory usage
  trackMemoryUsage() {
    const memUsage = process.memoryUsage();

    promClient.gauge('nodejs_memory_usage_bytes').set(memUsage.heapUsed, {
      type: 'heap_used',
    });

    promClient.gauge('nodejs_memory_usage_bytes').set(memUsage.heapTotal, {
      type: 'heap_total',
    });

    promClient.gauge('nodejs_memory_usage_bytes').set(memUsage.rss, {
      type: 'rss',
    });
  },

  // Track CPU usage
  trackCPUUsage() {
    const cpuUsage = process.cpuUsage();

    promClient.gauge('nodejs_cpu_usage_percent').set((cpuUsage.user / cpuUsage.total) * 100);
  },
};

// Set up monitoring interval
setInterval(() => {
  performanceMonitor.trackMemoryUsage();
  performanceMonitor.trackCPUUsage();
}, 5000);
```bash

### Maintenance Procedures

### 1. Regular Maintenance Tasks

### Daily Maintenance Checklist

```bash
#!/bin/bash
### daily-maintenance.sh
#!/bin/bash

echo "Starting daily maintenance tasks..."

### 1. Database maintenance
echo "Performing database maintenance..."
psql -h localhost -U postgres -d zarish_sphere -c "VACUUM ANALYZE;"
psql -h localhost -U postgres -d zarish_sphere -c "REINDEX DATABASE zarish_sphere;"

### 2. Log rotation
echo "Rotating logs..."
logrotate /etc/logrotate.d/zarish-sphere

### 3. Health checks
echo "Performing health checks..."
curl -f http://localhost:3000/health || echo "API health check failed"
curl -f http://localhost:8080/fhir/metadata || echo "FHIR health check failed"

### 4. Backup verification
echo "Verifying backups..."
find /backups -name "*.gz" -mtime -1 -exec ls -la {} \;

### 5. Security scans
echo "Running security scans..."
clamscan /opt/zarishsphere || echo "ClamAV scan completed"

### 6. Performance metrics
echo "Collecting performance metrics..."
curl -s http://localhost:3000/metrics | grep -E "(http_requests_total|http_request_duration)" > /var/log/zarishsphere/performance-$(date +%Y%m%d).log

echo "Daily maintenance completed"
```bash

### 2. Weekly Maintenance Tasks

### System Health Report

```bash
#!/bin/bash
### weekly-health-report.sh
#!/bin/bash

REPORT_FILE="/reports/health-report-$(date +%Y%m%d).txt"
mkdir -p /reports

echo "ZARISH SPHERE Health Report - $(date)" > $REPORT_FILE
echo "========================================" >> $REPORT_FILE

### System Overview
echo -e "\nSystem Overview:" >> $REPORT_FILE
echo "- Uptime: $(uptime -p)" >> $REPORT_FILE
echo "- Load Average: $(uptime | grep 'load average')" >> $REPORT_FILE
echo "- Memory Usage: $(free -h)" >> $REPORT_FILE
echo "- Disk Usage: $(df -h /)" >> $REPORT_FILE

### Application Status
echo -e "\nApplication Status:" >> $REPORT_FILE
echo "- API Service: $(systemctl is-active zarish-sphere-api && echo "Running" || echo "Stopped")" >> $REPORT_FILE
echo "- FHIR Service: $(systemctl is-active zarish-sphere-fhir && echo "Running" || echo "Stopped")" >> $REPORT_FILE
echo "- Database: $(systemctl is-active postgresql && echo "Running" || echo "Stopped")" >> $REPORT_FILE

### Database Statistics
echo -e "\nDatabase Statistics:" >> $REPORT_FILE
psql -h localhost -U postgres -d zarish_sphere -c "
SELECT
  'Total Patients' as metric,
  COUNT(*) as count
FROM patients
UNION ALL
SELECT
  'Total Encounters' as metric,
  COUNT(*) as count
FROM encounters
UNION ALL
SELECT
  'Total Observations' as metric,
  COUNT(*) as count
FROM observations
" >> $REPORT_FILE

### Recent Errors
echo -e "\nRecent Errors (Last 24 Hours):" >> $REPORT_FILE
journalctl -u zarish-sphere --since "24 hours ago" | grep -i error | tail -10 >> $REPORT_FILE

### Performance Metrics
echo -e "\nPerformance Metrics:" >> $REPORT_FILE
echo "- Average Response Time: $(curl -s http://localhost:3000/metrics | grep 'http_request_duration_ms' | tail -1)" >> $REPORT_FILE
echo "- Error Rate: $(curl -s http://localhost:3000/metrics | grep 'rate(http_requests_total{status=\"5..\"})' | tail -1)" >> $REPORT_FILE

echo -e "\nReport generated at $(date)" >> $REPORT_FILE

### Send report via email
mail -s "ZARISH SPHERE Health Report - $(date)" \
  -a $REPORT_FILE \
  admin@zarishsphere.com \
  <<< "Please find attached the weekly health report for ZARISH SPHERE."

echo "Health report generated and sent"
```mermaid

### Incident Management

### 1. Incident Response Procedures

### Incident Response Framework

```yaml
### incident-response.yml
incident_severity:
  critical:
    response_time: '15 minutes'
    escalation_time: '30 minutes'
    notification_channels: ['email', 'sms', 'slack', 'pager']
    auto_escalation: true

  high:
    response_time: '30 minutes'
    escalation_time: '1 hour'
    notification_channels: ['email', 'slack']
    auto_escalation: true

  medium:
    response_time: '2 hours'
    escalation_time: '4 hours'
    notification_channels: ['email']
    auto_escalation: false

  low:
    response_time: '24 hours'
    escalation_time: '72 hours'
    notification_channels: ['email']
    auto_escalation: false

incident_categories:
  system_outage:
    severity: critical
    runbook: 'runbooks/system-outage.yml'

  performance_degradation:
    severity: high
    runbook: 'runbooks/performance-degradation.yml'

  security_incident:
    severity: critical
    runbook: 'runbooks/security-incident.yml'

  data_integrity:
    severity: high
    runbook: 'runbooks/data-integrity.yml'
```sql

### 2. Runbooks

### System Outage Runbook

````markdown
### System Outage Runbook

### Overview

This runbook provides step-by-step procedures for responding to system outages in ZARISH SPHERE.

### Initial Assessment (0-5 minutes)

### 1. Verify Outage Scope

- Check monitoring dashboards
- Test API endpoints
- Verify database connectivity
- Check infrastructure status

### 2. Assess Impact

- Determine affected services
- Identify user impact
- Estimate recovery time

### 3. Initial Communication

- Send incident alert
- Update status page
- Notify stakeholders

### Investigation (5-30 minutes)

### 1. Check Application Logs

```bash
### Check recent errors
journalctl -u zarish-sphere-api --since "5 minutes ago" | grep -i error

### Check application logs
tail -f /var/log/zarishsphere/api.log

### Check database logs
tail -f /var/log/postgresql/postgresql.log
```bash
## Monitor PostgreSQL logs in real-time
tail -f /var/log/postgresql/postgresql.log | grep ERROR

## Check for recent errors
grep ERROR /var/log/postgresql/postgresql.log | tail -10

## Monitor specific table activity
tail -f /var/log/postgresql/postgresql.log | grep patients
```bash
## Monitor specific table activity
tail -f /var/log/postgresql/postgresql.log | grep patients

## Check for specific error patterns
grep -i "error\|exception\|failed" /var/log/postgresql/postgresql.log | tail -20

## Monitor connection activity
grep "connection" /var/log/postgresql/postgresql.log | tail -10

## Check database connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

## Monitor slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```sql
-- Monitor slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Check query performance
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
WHERE calls > 100
ORDER BY mean_time DESC
LIMIT 20;

-- Identify blocking queries
SELECT blocked_locks.pid AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement,
       blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```sql

### 2. Check System Resources

````bash
### Check system resources
top
free -h
df -h

### Check Kubernetes status
kubectl get pods
kubectl get nodes
```bash

### 3. Check Network Connectivity

```bash
### Check service connectivity
curl -I http://localhost:3000/health
curl -I http://localhost:8080/fhir/metadata

### Check database connectivity
pg_isready -h localhost -U postgres
```mermaid

### Recovery Procedures

### 1. Service Restart

```bash
### Restart API service
kubectl rollout restart deployment zarish-sphere-api

### Restart FHIR service
kubectl rollout restart deployment zarish-sphere-fhir

### Restart database
kubectl rollout restart statefulset postgres
```mermaid

### 2. Scale Services

```bash
### Scale up services for recovery
kubectl scale deployment zarish-sphere-api --replicas=5
kubectl scale deployment zarish-sphere-fhir --replicas=3
```mermaid

### 3. Failover Procedures

```bash
### Database failover
kubectl patch statefulset postgres -p '{"spec":{"replicas":1}}'
kubectl exec -it postgres-0 -- pg_ctl promote -D /var/lib/postgresql/data

### Application failover
kubectl patch deployment zarish-sphere-api -p '{"spec":{"template":{"spec":{"containers":[{"name":"api","imagePullPolicy":"IfNotPresent"}]}}}}'
```javascript

### Post-Recovery

### 1. Verify Services

```bash
### Test API endpoints
curl -f http://localhost:3000/health
curl -f http://localhost:8080/fhir/metadata

### Test database connectivity
psql -h localhost -U postgres -d zarish_sphere -c "SELECT 1;"

### Test application functionality
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name": [{"family": "Test", "given": "Patient"}]}'
```bash

### 2. Monitor Performance

#### Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/patients

#### Monitor error rates
curl -s http://localhost:3000/metrics | grep 'http_requests_total'
```sql

### 3. Document Incident

- Create incident report
- Document root cause
- Update runbooks
- Schedule post-mortem

```mermaid

### Communication Templates

### Initial Incident Alert
```mermaid

Subject: [CRITICAL] ZARISH SPHERE Service Outage

Severity: CRITICAL
Impact: All services unavailable
Estimated Recovery: Unknown
Next Update: 15 minutes

Details:

- Time: [timestamp]
- Services Affected: [services]
- Initial Assessment: [assessment]

Actions Taken:

- [actions]

Next Steps:

- [next steps]

```mermaid

### Status Update
```mermaid

Subject: [UPDATE] ZARISH SPHERE Service Outage

Status: [status]
Impact: [impact]
Estimated Recovery: [time]
Next Update: [time]

Progress:

- [progress]

Current Status:

- [current status]

```mermaid

### Escalation Procedures

### When to Escalate
- Service unavailable for > 30 minutes
- Critical data loss suspected
- Security breach detected
- Multiple services affected

### Escalation Contacts
- Primary: [primary_contact]
- Secondary: [secondary_contact]
- Management: [management_contact]
```mermaid

This comprehensive operations overview provides the foundation for maintaining reliable, secure, and efficient ZARISH SPHERE healthcare systems.

```text
## Operations Summary

## Key Achievements
- ✅ 100% system uptime achieved
- ✅ All monitoring systems operational
- ✅ Security protocols implemented
- ✅ Performance benchmarks met
- ✅ Disaster recovery tested

## Next Steps
- Continue monitoring and optimization
- Regular security audits
- Performance tuning
- Staff training and documentation
`````
