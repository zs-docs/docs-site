---
title: 'API Services'
sidebar_label: 'Services'
description: 'Comprehensive guide to ZARISH SPHERE API services including microservices architecture and service endpoints'
keywords: [api, services, microservices, architecture, zarish sphere]
---

# API Services

## Overview

ZARISH SPHERE API services are built on a microservices architecture that provides scalable, resilient, and maintainable healthcare data management. Each service handles specific domains and communicates through well-defined APIs.

## Service Architecture

### Core Services

### Patient Service

- **Endpoint**: `https://api.zarishsphere.com/v1/patients`
- **Purpose**: Patient demographic and administrative data management
- **Responsibilities**:
  - Patient registration and profile management
  - Medical record number (MRN) assignment
  - Patient search and filtering
  - Address and contact information
  - Emergency contact management

### Clinical Service

- **Endpoint**: `https://api.zarishsphere.com/v1/clinical`
- **Purpose**: Clinical data and workflow management
- **Responsibilities**:
  - Encounter management
  - Clinical documentation
  - Care plan management
  - Clinical decision support
  - Workflow orchestration

### Observation Service

- **Endpoint**: `https://api.zarishsphere.com/v1/observations`
- **Purpose**: Vital signs, lab results, and clinical measurements
- **Responsibilities**:
  - Vital signs capture and storage
  - Laboratory results management
  - Clinical measurements
  - Trend analysis
  - Abnormal value detection

### Medication Service

- **Endpoint**: `https://api.zarishsphere.com/v1/medications`
- **Purpose**: Medication management and prescription workflows
- **Responsibilities**:
  - Medication order management
  - Prescription processing
  - Drug interaction checking
  - Dosage calculations
  - Medication history

### Procedure Service

- **Endpoint**: `https://api.zarishsphere.com/v1/procedures`
- **Purpose**: Medical procedure management and scheduling
- **Responsibilities**:
  - Procedure scheduling
  - Resource allocation
  - Procedure documentation
  - Outcome tracking
  - Quality metrics

### Diagnostic Service

- **Endpoint**: `https://api.zarishsphere.com/v1/diagnostics`
- **Purpose**: Diagnostic reports and imaging management
- **Responsibilities**:
  - Lab report management
  - Imaging integration
  - Diagnostic result storage
  - Report distribution
  - Quality control

### Supporting Services

### Authentication Service

- **Endpoint**: `https://auth.zarishsphere.com/v1`
- **Purpose**: User authentication and authorization
- **Features**:
  - OAuth 2.0 / OpenID Connect
  - JWT token management
  - Multi-factor authentication
  - Role-based access control
  - Session management

### Notification Service

- **Endpoint**: `https://notifications.zarishsphere.com/v1`
- **Purpose**: Real-time notifications and alerts
- **Features**:
  - Push notifications
  - Email notifications
  - SMS alerts
  - In-app notifications
  - Alert routing and escalation

### Audit Service

- **Endpoint**: `https://audit.zarishsphere.com/v1`
- **Purpose**: Comprehensive audit logging and compliance
- **Features**:
  - Immutable audit trails
  - Compliance reporting
  - Data access logging
  - Security event tracking
  - Regulatory compliance

### Integration Service

- **Endpoint**: `https://integration.zarishsphere.com/v1`
- **Purpose**: External system integration and data exchange
- **Features**:
  - HL7 v2/v3 messaging
  - FHIR interoperability
  - DICOM imaging integration
  - Third-party system connectors
  - Data transformation

## Service Discovery

### Service Registry

All ZARISH SPHERE services register with the central service registry:

````json
{
  "service": "patient-service",
  "version": "1.2.0",
  "instances": [
    {
      "id": "patient-service-1",
      "host": "patient-service-1.internal",
      "port": 8080,
      "status": "healthy",
      "healthCheck": "/health",
      "metadata": {
        "region": "us-west-2",
        "zone": "us-west-2a"
      }
    }
  ],
  "loadBalancer": "round-robin",
  "healthCheckInterval": 30
}
```text

### Health Check Endpoints

Each service provides standardized health check endpoints:

```http
GET /health
```text

**Response:**

```json
{
  "status": "healthy",
  "version": "1.2.0",
  "timestamp": "2023-12-01T10:30:00Z",
  "checks": {
    "database": "healthy",
    "cache": "healthy",
    "external_services": "healthy"
  },
  "uptime": 86400
}
```javascript

## Service Communication

### Inter-Service Communication

Services communicate through REST APIs and message queues:

```javascript
// Service-to-service communication example
class ServiceClient {
  constructor(serviceName, baseURL, authToken) {
    this.serviceName = serviceName;
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  async call(endpoint, method = 'GET', data = null) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
        'X-Service-Name': this.serviceName,
      },
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      throw new ServiceError(`Service call failed: ${response.status}`);
    }

    return response.json();
  }
}

// Usage
const patientService = new ServiceClient(
  'clinical-service',
  'https://patient-service.internal',
  'service-token'
);

const patient = await patientService.call('/patients/patient-123');
```javascript

### Message Queue Integration

Services use message queues for asynchronous communication:

```python
## Python message producer
import pika
import json

class MessageProducer:
    def __init__(self, rabbitmq_url, queue_name):
        self.connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
        self.channel = self.connection.channel()
        self.queue_name = queue_name
        self.channel.queue_declare(queue=queue_name, durable=True)

    def publish_message(self, message, routing_key=None):
        """Publish message to queue"""
        self.channel.basic_publish(
            exchange='',
            routing_key=routing_key or self.queue_name,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
                content_type='application/json'
            )
        )

    def close(self):
        self.connection.close()

## Usage
producer = MessageProducer('amqp://localhost:5672', 'patient-events')

## Publish patient created event
producer.publish_message({
    'event': 'patient.created',
    'patient_id': 'patient-123',
    'timestamp': '2023-12-01T10:30:00Z',
    'data': {
        'first_name': 'John',
        'last_name': 'Smith'
    }
})
```text

## API Gateway

### Gateway Configuration

The API Gateway routes requests to appropriate services:

```yaml
## API Gateway configuration
apiVersion: v1
kind: Gateway
metadata:
  name: zarish-sphere-gateway
spec:
  routes:
    - path: /v1/patients/*
      service: patient-service
      methods: [GET, POST, PUT, DELETE]
      auth: required

    - path: /v1/clinical/*
      service: clinical-service
      methods: [GET, POST, PUT, DELETE]
      auth: required

    - path: /v1/observations/*
      service: observation-service
      methods: [GET, POST, PUT, DELETE]
      auth: required

    - path: /v1/medications/*
      service: medication-service
      methods: [GET, POST, PUT, DELETE]
      auth: required

    - path: /v1/procedures/*
      service: procedure-service
      methods: [GET, POST, PUT, DELETE]
      auth: required

    - path: /v1/diagnostics/*
      service: diagnostic-service
      methods: [GET, POST, PUT, DELETE]
      auth: required

    - path: /v1/auth/*
      service: authentication-service
      methods: [POST, GET]
      auth: optional

    - path: /v1/notifications/*
      service: notification-service
      methods: [GET, POST]
      auth: required

    - path: /v1/audit/*
      service: audit-service
      methods: [GET, POST]
      auth: required

    - path: /v1/integration/*
      service: integration-service
      methods: [GET, POST, PUT, DELETE]
      auth: required
```text

### Request Flow

```text
Client Request → API Gateway → Authentication → Routing → Service → Response
```javascript

1. **Client Request**: HTTP request to API Gateway
2. **Authentication**: Gateway validates JWT token
3. **Routing**: Request routed to appropriate service
4. **Service Processing**: Service processes request
5. **Response**: Response sent back through gateway

## Service Monitoring

### Metrics Collection

Each service exposes metrics for monitoring:

```javascript
// Prometheus metrics example
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

// Middleware to collect metrics
function metricsMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);

    httpRequestTotal.labels(req.method, req.route?.path || req.path, res.statusCode).inc();
  });

  next();
}

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```javascript

### Distributed Tracing

Services implement distributed tracing for request tracking:

```javascript
// Jaeger tracing example
const { initTracer } = require('jaeger-client');

const tracer = initTracer({
  serviceName: 'patient-service',
  reporter: {
    agentHost: 'jaeger-agent',
    agentPort: 6831,
  },
});

function tracedOperation(operationName, handler) {
  return (req, res, next) => {
    const span = tracer.startSpan(operationName, {
      tags: {
        'http.method': req.method,
        'http.url': req.url,
        'service.name': 'patient-service',
      },
    });

    // Add trace context to headers for downstream services
    tracer.inject(span, 'http_headers', req.headers);

    const originalEnd = res.end;
    res.end = function (...args) {
      span.setTag('http.status_code', res.statusCode);
      span.finish();
      originalEnd.apply(this, args);
    };

    handler(req, res, next);
  };
}

// Usage
app.get(
  '/patients/:id',
  tracedOperation('get-patient', async (req, res) => {
    const patient = await getPatientById(req.params.id);
    res.json(patient);
  })
);
```text

## Service Configuration

### Environment Variables

Each service uses standardized environment variables:

```bash
## Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/zarish_sphere
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

## Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_POOL_SIZE=10

## Service Configuration
SERVICE_NAME=patient-service
SERVICE_VERSION=1.2.0
SERVICE_PORT=8080

## Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=3600

## External Services
AUTH_SERVICE_URL=https://auth.zarishsphere.com/v1
NOTIFICATION_SERVICE_URL=https://notifications.zarishsphere.com/v1

## Monitoring
METRICS_PORT=9090
HEALTH_CHECK_INTERVAL=30

## Logging
LOG_LEVEL=info
LOG_FORMAT=json
```javascript

### Configuration Management

Services use centralized configuration:

```javascript
// Configuration loader
class ConfigManager {
  constructor() {
    this.config = {};
    this.loadConfig();
  }

  loadConfig() {
    // Load from environment variables
    this.config = {
      database: {
        url: process.env.DATABASE_URL,
        poolSize: parseInt(process.env.DATABASE_POOL_SIZE) || 10,
        timeout: parseInt(process.env.DATABASE_TIMEOUT) || 30000,
      },
      redis: {
        url: process.env.REDIS_URL,
        poolSize: parseInt(process.env.REDIS_POOL_SIZE) || 5,
      },
      service: {
        name: process.env.SERVICE_NAME,
        version: process.env.SERVICE_VERSION,
        port: parseInt(process.env.SERVICE_PORT) || 8080,
      },
      auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN) || 3600,
      },
      monitoring: {
        metricsPort: parseInt(process.env.METRICS_PORT) || 9090,
        healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30,
      },
    };

    // Validate required configuration
    this.validateConfig();
  }

  validateConfig() {
    const required = ['DATABASE_URL', 'REDIS_URL', 'SERVICE_NAME', 'JWT_SECRET'];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  get(key) {
    return this.config[key];
  }
}

// Usage
const config = new ConfigManager();
const dbConfig = config.get('database');
```bash

## Service Deployment

### Container Configuration

Services are deployed as containers with standardized configuration:

```dockerfile
## Patient Service Dockerfile
FROM node:18-alpine

WORKDIR /app

## Copy package files
COPY package*.json ./

## Install dependencies
RUN npm ci --only=production

## Copy source code
COPY src/ ./src/

## Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

## Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

## Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node src/health-check.js

EXPOSE 8080

CMD ["node", "src/server.js"]
```text

### Kubernetes Deployment

```yaml
## Kubernetes deployment for patient service
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patient-service
  labels:
    app: patient-service
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
          image: zarish-sphere/patient-service:1.2.0
          ports:
            - containerPort: 8080
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-secret
                  key: url
            - name: REDIS_URL
              valueFrom:
                configMapKeyRef:
                  name: redis-config
                  key: url
            - name: SERVICE_NAME
              value: 'patient-service'
            - name: SERVICE_VERSION
              value: '1.2.0'
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: secret
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
---
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
      targetPort: 8080
  type: ClusterIP
```javascript

## Service Security

### Service-to-Service Authentication

Services authenticate with each other using mTLS:

```javascript
// mTLS configuration
const https = require('https');
const fs = require('fs');

const httpsAgent = new https.Agent({
  cert: fs.readFileSync('/etc/ssl/certs/service.crt'),
  key: fs.readFileSync('/etc/ssl/private/service.key'),
  ca: fs.readFileSync('/etc/ssl/certs/ca.crt'),
  rejectUnauthorized: true,
});

// Service client with mTLS
class SecureServiceClient {
  constructor(serviceURL, certPath, keyPath, caPath) {
    this.serviceURL = serviceURL;
    this.agent = new https.Agent({
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
      ca: fs.readFileSync(caPath),
      rejectUnauthorized: true,
    });
  }

  async call(endpoint, options = {}) {
    const response = await fetch(`${this.serviceURL}${endpoint}`, {
      ...options,
      agent: this.agent,
      headers: {
        ...options.headers,
        'X-Service-Auth': 'service-to-service',
      },
    });

    return response.json();
  }
}
```javascript

### API Rate Limiting

Services implement rate limiting to prevent abuse:

```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: {
      error: 'RATE_LIMIT_EXCEEDED',
      message,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

// Different limits for different endpoints
const strictLimit = createRateLimit(15 * 60 * 1000, 100, 'Too many requests from this IP');
const moderateLimit = createRateLimit(15 * 60 * 1000, 1000, 'Too many requests');
const lenientLimit = createRateLimit(15 * 60 * 1000, 5000, 'Too many requests');

app.use('/api/v1/patients', strictLimit);
app.use('/api/v1/observations', moderateLimit);
app.use('/api/v1/health', lenientLimit);
```text
````
