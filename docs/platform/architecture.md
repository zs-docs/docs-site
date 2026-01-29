---
title: 'Architecture'
sidebar_label: 'Architecture'
description: 'Detailed technical architecture of ZARISH SPHERE platform including microservices, data flow, and system design'
keywords: [architecture, microservices, system design, technical, zarish sphere]
---

# Platform Architecture

## Overview

ZARISH SPHERE employs a modern, scalable microservices architecture designed for healthcare environments ranging from cloud deployments to remote field clinics. Our architecture prioritizes reliability, security, and interoperability while maintaining flexibility for diverse deployment scenarios.

## System Architecture

### High-Level Architecture

````mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Application]
        MOBILE[Mobile Apps]
        DESKTOP[Desktop Apps]
        API_CLIENT[API Clients]
    end

    subgraph "API Gateway Layer"
        GATEWAY[API Gateway]
        AUTH[Authentication Service]
        RATE_LIMIT[Rate Limiting]
        LOAD_BALANCER[Load Balancer]
    end

    subgraph "Service Layer"
        PATIENT_SVC[Patient Service]
        CLINICAL_SVC[Clinical Service]
        PHARMACY_SVC[Pharmacy Service]
        LAB_SVC[Laboratory Service]
        FINANCIAL_SVC[Financial Service]
        FHIR_SVC[FHIR Service]
        NOTIFICATION_SVC[Notification Service]
    end

    subgraph "Data Layer"
        POSTGRES[(PostgreSQL)]
        ELASTICSEARCH[(Elasticsearch)]
        REDIS[(Redis)]
        FILE_STORAGE[(File Storage)]
    end

    subgraph "Infrastructure"
        KUBERNETES[Kubernetes]
        MONITORING[Monitoring]
        LOGGING[Logging]
        BACKUP[Backup Systems]
    end

    WEB --> GATEWAY
    MOBILE --> GATEWAY
    DESKTOP --> GATEWAY
    API_CLIENT --> GATEWAY

    GATEWAY --> AUTH
    GATEWAY --> RATE_LIMIT
    GATEWAY --> LOAD_BALANCER

    LOAD_BALANCER --> PATIENT_SVC
    LOAD_BALANCER --> CLINICAL_SVC
    LOAD_BALANCER --> PHARMACY_SVC
    LOAD_BALANCER --> LAB_SVC
    LOAD_BALANCER --> FINANCIAL_SVC
    LOAD_BALANCER --> FHIR_SVC
    LOAD_BALANCER --> NOTIFICATION_SVC

    PATIENT_SVC --> POSTGRES
    CLINICAL_SVC --> POSTGRES
    PHARMACY_SVC --> POSTGRES
    LAB_SVC --> POSTGRES
    FINANCIAL_SVC --> POSTGRES

    FHIR_SVC --> ELASTICSEARCH
    PATIENT_SVC --> REDIS
    CLINICAL_SVC --> REDIS

    PATIENT_SVC --> FILE_STORAGE
    LAB_SVC --> FILE_STORAGE

    PATIENT_SVC --> MONITORING
    CLINICAL_SVC --> MONITORING
    PHARMACY_SVC --> MONITORING
```text

## Microservices Architecture

### Core Services

### 1. Patient Service

**Responsibilities:**

- Patient registration and demographic management
- Medical record number assignment
- Patient identification and deduplication
- Patient relationship management

**Technology Stack:**

- Runtime: Node.js with TypeScript
- Database: PostgreSQL
- Cache: Redis
- API: REST + GraphQL

**Key Features:**

- Offline-first design for field deployments
- Biometric identification support
- Advanced duplicate detection algorithms
- GDPR/HIPAA compliance built-in

### 2. Clinical Service

**Responsibilities:**

- Clinical workflow management
- Treatment protocols and pathways
- Clinical decision support
- Medical documentation

**Technology Stack:**

- Runtime: Java Spring Boot
- Database: PostgreSQL
- Rules Engine: Drools
- Search: Elasticsearch

**Key Features:**

- Real-time clinical decision support
- Customizable treatment pathways
- Integration with clinical guidelines
- Audit trail for all clinical actions

### 3. Pharmacy Service

**Responsibilities:**

- Medication inventory management
- Prescription processing
- Drug interaction checking
- Dispensing workflows

**Technology Stack:**

- Runtime: Python Django
- Database: PostgreSQL
- Cache: Redis
- Integration: HL7, FHIR

**Key Features:**

- Real-time inventory tracking
- Automated drug interaction checking
- Barcode/RFID integration
- Controlled substance tracking

### 4. Laboratory Service

**Responsibilities:**

- Test order management
- Results processing
- Quality control
- Equipment integration

**Technology Stack:**

- Runtime: .NET Core
- Database: PostgreSQL
- Integration: HL7, LIS systems
- Analytics: Apache Spark

**Key Features:**

- Automated result interpretation
- Quality control dashboards
- Integration with lab equipment
- Statistical process control

### 5. Financial Service

**Responsibilities:**

- Billing and invoicing
- Insurance claims processing
- Payment management
- Financial reporting

**Technology Stack:**

- Runtime: Node.js with TypeScript
- Database: PostgreSQL
- Integration: Payment gateways
- Analytics: Power BI

**Key Features:**

- Multi-currency support
- Insurance claim automation
- Real-time financial reporting
- Revenue cycle management

### 6. FHIR Service

**Responsibilities:**

- FHIR R5 resource management
- Interoperability layer
- Data transformation
- External system integration

**Technology Stack:**

- Runtime: Java Spring Boot
- Database: Elasticsearch + PostgreSQL
- Standards: FHIR R5, HL7 v2/v3
- API: RESTful FHIR endpoints

**Key Features:**

- Complete FHIR R5 implementation
- Custom extensions for humanitarian use
- Bulk data operations
- Subscription notifications

## Data Architecture

### Database Design

### Primary Database: PostgreSQL

**Configuration:**

- Version: PostgreSQL 14+
- Replication: Streaming replication
- Partitioning: Time-based and hash partitioning
- Backup: Point-in-time recovery

**Schema Design:**

```sql
-- Patient Schema
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mrn VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    gender VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinical Encounters
CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    encounter_type VARCHAR(50),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Observations/Vitals
CREATE TABLE observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    encounter_id UUID REFERENCES encounters(id),
    observation_code VARCHAR(50),
    value_numeric NUMERIC,
    value_text TEXT,
    unit VARCHAR(20),
    recorded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```text

### Search Engine: Elasticsearch

**Configuration:**

- Version: Elasticsearch 8.x
- Cluster: Multi-node with fault tolerance
- Indexing: Real-time data synchronization
- Analytics: Aggregations and dashboards

**Index Mappings:**

```json
{
  "patients": {
    "mappings": {
      "properties": {
        "mrn": { "type": "keyword" },
        "name": {
          "type": "text",
          "fields": {
            "keyword": { "type": "keyword" },
            "suggest": { "type": "completion" }
          }
        },
        "birth_date": { "type": "date" },
        "gender": { "type": "keyword" },
        "location": { "type": "geo_point" },
        "tags": { "type": "keyword" }
      }
    }
  }
}
```javascript

### Cache Layer: Redis

**Configuration:**

- Version: Redis 7.x
- Mode: Cluster mode for high availability
- Persistence: RDB + AOF
- Use cases: Session data, frequent queries, rate limiting

**Cache Strategy:**

```javascript
// Patient demographic cache (24 hours)
const patientCache = {
  key: `patient:${patientId}`,
  ttl: 86400, // 24 hours
  data: patientDemographics,
};

// Clinical decision support cache (1 hour)
const cdsCache = {
  key: `cds:${protocol}:${patientAge}:${gender}`,
  ttl: 3600, // 1 hour
  data: treatmentRecommendations,
};

// Session cache (30 minutes)
const sessionCache = {
  key: `session:${sessionId}`,
  ttl: 1800, // 30 minutes
  data: userSession,
};
```text

## Security Architecture

### Multi-Layer Security

### 1. Network Security

**Implementation:**

- TLS 1.3 encryption for all communications
- VPN support for remote access
- Web Application Firewall (WAF)
- DDoS protection and rate limiting
- Network segmentation

**Configuration:**

```yaml
## NGINX Security Configuration
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
}
```javascript

### 2. Application Security

**Implementation:**

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure coding practices

**Code Example:**

```javascript
// Input validation middleware
const Joi = require('joi');

const patientSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  birthDate: Joi.date().max('now').required(),
  gender: Joi.string().valid('male', 'female', 'other', 'unknown').required(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional(),
});

// SQL injection prevention
const getPatientById = async (id) => {
  const query = 'SELECT * FROM patients WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
```javascript

### 3. Data Security

**Implementation:**

- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Data masking for sensitive fields
- Access logging and audit trails
- Data classification and labeling

**Encryption Example:**

```javascript
const crypto = require('crypto');

class DataEncryption {
  constructor(key) {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(key, 'hex');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```text

## Integration Architecture

### Healthcare Standards Support

### 1. FHIR R5 Implementation

**Resources Supported:**

- Patient, Practitioner, Organization
- Encounter, Condition, Observation
- MedicationRequest, MedicationAdministration
- DiagnosticReport, ServiceRequest
- Bundle, OperationOutcome

**Custom Extensions:**

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/humanitarian-extension",
  "extension": [
    {
      "url": "displacementStatus",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/displacement",
            "code": "refugee",
            "display": "Refugee"
          }
        ]
      }
    },
    {
      "url": "campLocation",
      "valueString": "Hope Refugee Camp, Zone A"
    }
  ]
}
```javascript

### 2. HL7 v2 Integration

**Messages Supported:**

- ADT (Admission, Discharge, Transfer)
- ORM (Order messages)
- ORU (Observation results)
- SIU (Scheduling)

**Message Processing:**

```javascript
const hl7 = require('hl7-standard');

class HL7Processor {
  parseMessage(message) {
    const parsed = hl7.parse(message);
    return {
      messageType: parsed.MSH.9,
      patientId: parsed.PID.3,
      patientName: `${parsed.PID.5} ${parsed.PID.5}`,
      timestamp: parsed.MSH.7
    };
  }

  createADTMessage(event, patient) {
    const message = hl7.create({
      MSH: {
        '9.1': 'ADT',
        '9.2': event,
        '10': moment().format('YYYYMMDDHHMMSS')
      },
      PID: {
        '3.1': patient.mrn,
        '5.1': patient.lastName,
        '5.2': patient.firstName,
        '7': patient.birthDate,
        '8': patient.gender
      }
    });

    return message.toString();
  }
}
```text

## Performance Architecture

### Scalability Design

### 1. Horizontal Scaling

**Implementation:**

- Container orchestration with Kubernetes
- Auto-scaling based on CPU/memory metrics
- Database read replicas
- Load balancing across multiple instances

**Kubernetes Configuration:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patient-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: patient-service
  template:
    metadata:
      labels:
        app: patient-service
    spec:
      containers:
        - name: patient-service
          image: zarishsphere/patient-service:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: patient-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: patient-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```javascript

### 2. Caching Strategy

**Multi-Level Caching:**

- Application-level cache (Redis)
- Database query cache
- CDN for static assets
- Browser caching headers

**Cache Implementation:**

```javascript
class CacheManager {
  constructor(redisClient) {
    this.redis = redisClient;
    this.localCache = new Map();
  }

  async get(key) {
    // Check local cache first
    if (this.localCache.has(key)) {
      return this.localCache.get(key);
    }

    // Check Redis cache
    const value = await this.redis.get(key);
    if (value) {
      const data = JSON.parse(value);
      // Store in local cache for faster access
      this.localCache.set(key, data);
      return data;
    }

    return null;
  }

  async set(key, value, ttl = 3600) {
    // Set in both caches
    this.localCache.set(key, value);
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern) {
    // Clear matching keys from both caches
    for (const key of this.localCache.keys()) {
      if (key.match(pattern)) {
        this.localCache.delete(key);
      }
    }

    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```javascript

## Monitoring and Observability

### Monitoring Stack

### 1. Application Monitoring

**Tools:**

- Prometheus for metrics collection
- Grafana for visualization
- AlertManager for alerting
- Jaeger for distributed tracing

**Key Metrics:**

```javascript
// Custom metrics for patient service
const promClient = require('prom-client');

const patientRegistrations = new promClient.Counter({
  name: 'patient_registrations_total',
  help: 'Total number of patient registrations',
  labelNames: ['facility', 'user_role'],
});

const patientQueryDuration = new promClient.Histogram({
  name: 'patient_query_duration_seconds',
  help: 'Duration of patient queries',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

const activePatients = new promClient.Gauge({
  name: 'active_patients_total',
  help: 'Number of active patients',
});

// Usage in application
app.post('/api/patients', async (req, res) => {
  const end = patientQueryDuration.startTimer();

  try {
    const patient = await createPatient(req.body);
    patientRegistrations.inc({
      facility: req.user.facility,
      user_role: req.user.role,
    });
    activePatients.inc();

    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    end();
  }
});
```bash

### 2. Infrastructure Monitoring

**Components:**

- Node Exporter for system metrics
- cAdvisor for container metrics
- Elasticsearch for log aggregation
- Kibana for log visualization

**Dashboard Examples:**

- System performance (CPU, memory, disk)
- Application performance (response time, error rate)
- Business metrics (patient registrations, clinical encounters)
- Security metrics (authentication attempts, failed logins)

## Deployment Architecture

### Container Strategy

### 1. Docker Configuration

**Multi-stage builds for optimization:**

```dockerfile
## Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

## Production stage
FROM node:18-alpine AS production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000
CMD ["node", "dist/server.js"]
```text

### 2. Kubernetes Deployment

**Service Configuration:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: patient-service
spec:
  selector:
    app: patient-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: patient-service-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: '100'
spec:
  tls:
    - hosts:
        - api.zarishsphere.com
      secretName: api-tls
  rules:
    - host: api.zarishsphere.com
      http:
        paths:
          - path: /api/patients
            pathType: Prefix
            backend:
              service:
                name: patient-service
                port:
                  number: 80
```bash

## Disaster Recovery

### Backup Strategy

### 1. Database Backups

**Automated Backup Configuration:**

```bash
#!/bin/bash
## PostgreSQL backup script
BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="zarish_sphere"

## Create backup
pg_dump -h localhost -U postgres -d $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

## Retention policy (keep 30 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

## Upload to cloud storage
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://zarishsphere-backups/database/
```bash

### 2. Application State Backups

**Redis Backup:**

```bash
#!/bin/bash
## Redis backup script
REDIS_CLI="redis-cli -h localhost -p 6379"
BACKUP_DIR="/backups/redis"
DATE=$(date +%Y%m%d_%H%M%S)

## Create snapshot
$REDIS_CLI BGSAVE
sleep 5

## Copy RDB file
cp /var/lib/redis/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

## Upload to cloud storage
aws s3 cp $BACKUP_DIR/redis_$DATE.rdb s3://zarishsphere-backups/redis/
```text

This comprehensive architecture documentation provides the technical foundation for understanding ZARISH SPHERE's scalable, secure, and resilient platform design.
````
