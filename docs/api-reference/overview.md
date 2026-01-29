---
title: 'API Overview'
sidebar_label: 'Overview'
description: 'Comprehensive overview of ZARISH SPHERE APIs including REST, FHIR R5, GraphQL, and real-time interfaces'
keywords: [api, rest, fhir, graphql, websocket, zarish sphere]
---

# API Overview

## Introduction

ZARISH SPHERE provides a comprehensive set of APIs designed for healthcare interoperability and application development. Our API ecosystem supports modern healthcare standards while maintaining backward compatibility and humanitarian-focused optimizations.

## API Architecture

### Multi-Layer API Design

````mermaid
graph TB
    subgraph "Client Applications"
        WEB[Web Apps]
        MOBILE[Mobile Apps]
        DESKTOP[Desktop Apps]
        EHR[EHR Systems]
    end

    subgraph "API Gateway Layer"
        GATEWAY[API Gateway]
        AUTH[Authentication]
        RATE_LIMIT[Rate Limiting]
        MONITORING[API Monitoring]
    end

    subgraph "API Services"
        REST_API[REST API]
        FHIR_API[FHIR R5 API]
        GRAPHQL_API[GraphQL API]
        WEBSOCKET_API[WebSocket API]
        WEBHOOK_API[Webhook API]
    end

    subgraph "Backend Services"
        PATIENT_SVC[Patient Service]
        CLINICAL_SVC[Clinical Service]
        PHARMACY_SVC[Pharmacy Service]
        LAB_SVC[Laboratory Service]
        FINANCIAL_SVC[Financial Service]
    end

    WEB --> GATEWAY
    MOBILE --> GATEWAY
    DESKTOP --> GATEWAY
    EHR --> GATEWAY

    GATEWAY --> AUTH
    GATEWAY --> RATE_LIMIT
    GATEWAY --> MONITORING

    GATEWAY --> REST_API
    GATEWAY --> FHIR_API
    GATEWAY --> GRAPHQL_API
    GATEWAY --> WEBSOCKET_API
    GATEWAY --> WEBHOOK_API

    REST_API --> PATIENT_SVC
    FHIR_API --> PATIENT_SVC
    GRAPHQL_API --> PATIENT_SVC
    WEBSOCKET_API --> PATIENT_SVC
    WEBHOOK_API --> PATIENT_SVC

    REST_API --> CLINICAL_SVC
    FHIR_API --> CLINICAL_SVC
    GRAPHQL_API --> CLINICAL_SVC
```sql

## API Types

### 1. REST API

### Overview

The REST API provides traditional RESTful endpoints for healthcare data management with JSON responses and standard HTTP methods.

### Base URLs

- **Production**: `https://api.zarishsphere.com/v1`
- **Staging**: `https://staging-api.zarishsphere.com/v1`
- **Development**: `https://dev-api.zarishsphere.com/v1`

### Key Features

- RESTful design with proper HTTP verbs
- JSON request/response format
- Standard HTTP status codes
- Pagination support
- Filtering and sorting
- Bulk operations
- Async job processing

### Example Endpoints

```http
## Patient Management
GET    /v1/patients                    # List patients
POST   /v1/patients                    # Create patient
GET    /v1/patients/{id}               # Get patient
PUT    /v1/patients/{id}               # Update patient
DELETE /v1/patients/{id}               # Delete patient

## Clinical Encounters
GET    /v1/encounters                  # List encounters
POST   /v1/encounters                  # Create encounter
GET    /v1/encounters/{id}             # Get encounter
PUT    /v1/encounters/{id}             # Update encounter

## Observations/Vitals
GET    /v1/observations                # List observations
POST   /v1/observations                # Create observation
GET    /v1/observations/{id}           # Get observation
```text

### 2. FHIR R5 API

### Overview

Complete FHIR R5 implementation with custom extensions for humanitarian healthcare scenarios and low-resource environments.

### Base URL

- **Production**: `https://fhir.zarishsphere.com/R5`
- **Staging**: `https://staging-fhir.zarishsphere.com/R5`

### Supported Resources

- **Clinical**: Patient, Practitioner, Encounter, Condition, Observation, Procedure
- **Medication**: Medication, MedicationRequest, MedicationAdministration
- **Diagnostic**: DiagnosticReport, ServiceRequest, Specimen
- **Administrative**: Organization, Location, HealthcareService
- **Custom**: Humanitarian extensions, low-resource optimizations

### Custom Extensions

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/humanitarian-patient",
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
    },
    {
      "url": "arrivalDate",
      "valueDate": "2023-03-15"
    }
  ]
}
```javascript

### Example Operations

```http
## Standard FHIR Operations
GET    /R5/Patient                     # Search patients
POST   /R5/Patient                     # Create patient
GET    /R5/Patient/{id}                # Get patient
PUT    /R5/Patient/{id}                # Update patient

## Custom Operations
POST   /R5/$bulk-export                # Bulk data export
POST   /R5/$validate                   # Resource validation
POST   /R5/$everything                # Get all resources
GET    /R5/$metadata                   # Capability statement
```text

### 3. GraphQL API

### Overview

GraphQL API for flexible data queries with real-time subscriptions and efficient data fetching.

### Endpoint

- **Production**: `https://api.zarishsphere.com/graphql`
- **Development**: `https://dev-api.zarishsphere.com/graphql`

### Key Features

- Single endpoint for all queries
- Real-time subscriptions
- Type-safe schema
- Efficient data loading
- Caching support
- Introspection

### Example Queries

```graphql
## Get patient with encounters
query GetPatientWithEncounters($id: ID!) {
  patient(id: $id) {
    id
    mrn
    firstName
    lastName
    birthDate
    gender
    encounters {
      id
      type
      startTime
      endTime
      status
      observations {
        id
        code
        value
        unit
        recordedAt
      }
    }
  }
}

## Search patients with filters
query SearchPatients($filter: PatientFilter!) {
  patients(filter: $filter) {
    edges {
      node {
        id
        mrn
        firstName
        lastName
        birthDate
        gender
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

## Real-time subscription
subscription PatientUpdates($patientId: ID!) {
  patientUpdates(patientId: $patientId) {
    type
    patient {
      id
      firstName
      lastName
    }
    timestamp
  }
}
```javascript

### 4. WebSocket API

### Overview

Real-time bidirectional communication for live updates, notifications, and collaborative features.

### Connection

- **Production**: `wss://ws.zarishsphere.com/v1`
- **Development**: `ws://dev-ws.zarishsphere.com/v1`

### Supported Events

- **Patient Updates**: Real-time patient data changes
- **Clinical Alerts**: Emergency notifications
- **System Status**: Service health updates
- **Collaboration**: Multi-user editing events

### Example Implementation

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://ws.zarishsphere.com/v1');

// Authenticate
ws.send(
  JSON.stringify({
    type: 'auth',
    token: 'your-jwt-token',
  })
);

// Subscribe to patient updates
ws.send(
  JSON.stringify({
    type: 'subscribe',
    channel: 'patient-updates',
    patientId: 'patient-123',
  })
);

// Handle messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'patient-updated':
      console.log('Patient updated:', data.patient);
      break;
    case 'clinical-alert':
      console.log('Clinical alert:', data.alert);
      break;
    case 'system-status':
      console.log('System status:', data.status);
      break;
  }
};
```text

### 5. Webhook API

### Overview

Webhook notifications for external system integration and event-driven architectures.

### Configuration

```http
POST /v1/webhooks
Content-Type: application/json
Authorization: Bearer {token}

{
  "url": "https://your-system.com/webhook",
  "events": ["patient.created", "encounter.updated", "observation.created"],
  "secret": "your-webhook-secret",
  "active": true
}
```text

### Event Types

- **Patient Events**: `patient.created`, `patient.updated`, `patient.deleted`
- **Clinical Events**: `encounter.created`, `encounter.updated`, `observation.created`
- **System Events**: `user.login`, `system.maintenance`, `backup.completed`

### Webhook Payload

```json
{
  "event": "patient.created",
  "timestamp": "2023-12-01T10:30:00Z",
  "data": {
    "patient": {
      "id": "patient-123",
      "mrn": "MRN-2023-001234",
      "firstName": "John",
      "lastName": "Smith",
      "birthDate": "1985-06-15",
      "gender": "male"
    }
  },
  "signature": "sha256=5d41402abc4b2a76b9719d911017c592"
}
```text

## Authentication

### OAuth 2.0 / JWT

### Authorization Code Flow

```http
## 1. Get authorization code
GET https://auth.zarishsphere.com/oauth2/authorize?
  response_type=code&
  client_id=your-client-id&
  redirect_uri=https://your-app.com/callback&
  scope=patient.read+patient.write&
  state=random-state

## 2. Exchange code for token
POST https://auth.zarishsphere.com/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=authorization-code&
redirect_uri=https://your-app.com/callback&
client_id=your-client-id&
client_secret=your-client-secret

## 3. Use access token
GET https://api.zarishsphere.com/v1/patients
Authorization: Bearer {access-token}
```text

### Client Credentials Flow

```http
POST https://auth.zarishsphere.com/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=your-client-id&
client_secret=your-client-secret&
scope=system/Patient.read
```text

### JWT Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "key-id"
  },
  "payload": {
    "iss": "https://auth.zarishsphere.com",
    "sub": "user-123",
    "aud": "zarishsphere-api",
    "exp": 1701388800,
    "iat": 1701385200,
    "scope": "patient.read patient.write",
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john.doe@hospital.org",
      "roles": ["clinician", "admin"],
      "facility": "hospital-456"
    }
  }
}
```text

## Rate Limiting

### Limits by Plan

| Plan         | Requests/Minute | Requests/Hour | Burst Limit |
| ------------ | --------------- | ------------- | ----------- |
| Free         | 100             | 10,000        | 200         |
| Basic        | 1,000           | 100,000       | 2,000       |
| Professional | 10,000          | 1,000,000     | 20,000      |
| Enterprise   | Unlimited       | Unlimited     | Unlimited   |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1701388800
X-RateLimit-Retry-After: 60
```text

### Rate Limit Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "resetTime": "2023-12-01T10:30:00Z",
      "retryAfter": 60
    }
  }
}
```text

## Error Handling

### Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "birthDate",
      "reason": "Invalid date format. Use YYYY-MM-DD."
    },
    "requestId": "req-123456",
    "timestamp": "2023-12-01T10:30:00Z"
  }
}
```bash

### Common Error Codes

| Code                  | HTTP Status | Description                     |
| --------------------- | ----------- | ------------------------------- |
| `VALIDATION_ERROR`    | 400         | Request validation failed       |
| `UNAUTHORIZED`        | 401         | Authentication required         |
| `FORBIDDEN`           | 403         | Insufficient permissions        |
| `NOT_FOUND`           | 404         | Resource not found              |
| `CONFLICT`            | 409         | Resource conflict               |
| `RATE_LIMIT_EXCEEDED` | 429         | Rate limit exceeded             |
| `INTERNAL_ERROR`      | 500         | Internal server error           |
| `SERVICE_UNAVAILABLE` | 503         | Service temporarily unavailable |

## SDKs and Libraries

### Official SDKs

### JavaScript/TypeScript

```bash
npm install @zarishsphere/api-client
```javascript

```javascript
import { ZarishSphereAPI } from '@zarishsphere/api-client';

const api = new ZarishSphereAPI({
  baseURL: 'https://api.zarishsphere.com/v1',
  token: 'your-jwt-token',
});

// Create patient
const patient = await api.patients.create({
  firstName: 'John',
  lastName: 'Smith',
  birthDate: '1985-06-15',
  gender: 'male',
});

// Search patients
const patients = await api.patients.search({
  name: 'Smith',
  birthDate: '1985-06-15',
});
```text

### Python

```bash
pip install zarishsphere-python
```javascript

```python
from zarishsphere import ZarishSphereAPI

api = ZarishSphereAPI(
    base_url='https://api.zarishsphere.com/v1',
    token='your-jwt-token'
)

## Create patient
patient = api.patients.create({
    'firstName': 'John',
    'lastName': 'Smith',
    'birthDate': '1985-06-15',
    'gender': 'male'
})

## Search patients
patients = api.patients.search(
    name='Smith',
    birth_date='1985-06-15'
)
```text

### Java

```xml
<dependency>
    <groupId>com.zarishsphere</groupId>
    <artifactId>api-client</artifactId>
    <version>1.0.0</version>
</dependency>
```text

```java
ZarishSphereAPI api = new ZarishSphereAPI.Builder()
    .baseURL("https://api.zarishsphere.com/v1")
    .token("your-jwt-token")
    .build();

// Create patient
Patient patient = api.patients().create(Patient.builder()
    .firstName("John")
    .lastName("Smith")
    .birthDate("1985-06-15")
    .gender("male")
    .build());

// Search patients
List<Patient> patients = api.patients().search(
    PatientSearchFilter.builder()
        .name("Smith")
        .birthDate("1985-06-15")
        .build()
);
```javascript

## Testing and Development

### Sandbox Environment

- **URL**: `https://sandbox-api.zarishsphere.com`
- **Features**: Full API functionality with test data
- **Rate Limits**: Generous limits for development
- **Data**: Reset daily at 00:00 UTC

### Testing Tools

### Postman Collection

```json
{
  "info": {
    "name": "ZARISH SPHERE API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://sandbox-api.zarishsphere.com/v1"
    },
    {
      "key": "token",
      "value": "your-sandbox-token"
    }
  ]
}
```text

### OpenAPI Specification

- **URL**: `https://api.zarishsphere.com/openapi.json`
- **Format**: OpenAPI 3.0
- **Tools**: Swagger UI, Redoc, API documentation

## Best Practices

### 1. Authentication

- Use short-lived access tokens (1 hour)
- Implement token refresh mechanism
- Store tokens securely
- Use HTTPS for all API calls

### 2. Error Handling

- Check HTTP status codes
- Parse error responses
- Implement exponential backoff for retries
- Handle rate limits gracefully

### 3. Performance

- Use pagination for large datasets
- Cache frequently accessed data
- Use compression for large payloads
- Implement request batching

### 4. Security

- Validate all input data
- Use parameterized queries
- Implement request signing
- Monitor for suspicious activity

## Monitoring and Analytics

### API Metrics

- Request count and rate
- Response time distribution
- Error rate by endpoint
- Authentication success rate
- Rate limit violations

### Usage Analytics

- Top endpoints by usage
- Geographic distribution
- Client application tracking
- Feature adoption metrics

This comprehensive API overview provides everything needed to integrate with ZARISH SPHERE's powerful healthcare data platform.
````
