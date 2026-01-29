---
title: 'REST Implementation'
sidebar_label: 'REST Implementation'
description: 'Comprehensive guide to FHIR R5 REST API implementation in ZARISH SPHERE'
keywords: [rest, fhir r5, restful api, http, healthcare, zarish sphere]
---

# FHIR R5 REST Implementation

## Overview

ZARISH SPHERE provides a complete FHIR R5 REST API implementation following HL7 FHIR standards with humanitarian and low-resource optimizations. This guide covers RESTful operations, endpoints, authentication, and best practices for healthcare data exchange.

## REST API Architecture

### Base URL Structure

````text
https://api.zarishsphere.com/fhir/r5/
```javascript

### Resource Endpoints

| Resource              | Base Endpoint        | Description                                  |
| --------------------- | -------------------- | -------------------------------------------- |
| **Patient**           | `/Patient`           | Patient demographics and administrative data |
| **Encounter**         | `/Encounter`         | Patient encounters and interactions          |
| **Condition**         | `/Condition`         | Health problems and diagnoses                |
| **Observation**       | `/Observation`       | Measurements and observations                |
| **Medication**        | `/Medication`        | Medication information                       |
| **MedicationRequest** | `/MedicationRequest` | Medication orders                            |
| **Procedure**         | `/Procedure`         | Medical procedures                           |
| **Practitioner**      | `/Practitioner`      | Healthcare providers                         |
| **Organization**      | `/Organization`      | Healthcare organizations                     |
| **Location**          | `/Location`          | Physical locations                           |

## HTTP Methods

### Standard FHIR Operations

| Method     | Operation | Description                  | Example               |
| ---------- | --------- | ---------------------------- | --------------------- |
| **GET**    | Read      | Retrieve a specific resource | `GET /Patient/123`    |
| **POST**   | Create    | Create a new resource        | `POST /Patient`       |
| **PUT**    | Update    | Update an existing resource  | `PUT /Patient/123`    |
| **DELETE** | Delete    | Delete a resource            | `DELETE /Patient/123` |
| **PATCH**  | Patch     | Partial update               | `PATCH /Patient/123`  |

### Custom Operations

| Operation    | Endpoint                       | Description       | Example |
| ------------ | ------------------------------ | ----------------- | ------- |
| **Search**   | `GET /[resource]?{parameters}` | Search resources  |
| **Validate** | `POST /[resource]/$validate`   | Validate resource |
| **Match**    | `POST /Patient/$match`         | Patient matching  |
| **Export**   | `GET /$export`                 | Bulk data export  |
| **Import**   | `POST /`                       | Bulk data import  |

## Authentication

### Bearer Token Authentication

```http
GET /fhir/r5/Patient
Authorization: Bearer {access_token}
Accept: application/fhir+json
```text

### OAuth 2.0 Flow

### 1. Authorization Request

```http
GET /oauth2/authorize?
  response_type=code&
  client_id={client_id}&
  redirect_uri={redirect_uri}&
  scope={scope}&
  state={state}
```text

### 2. Token Exchange

```http
POST /oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code={authorization_code}&
redirect_uri={redirect_uri}&
client_id={client_id}&
client_secret={client_secret}
```text

### 3. Token Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "patient/*.read",
  "refresh_token": "def502ad883c8f6a4d8d9..."
}
```text

## Request/Response Format

### Content Types

| Format     | Content-Type              | Description               |
| ---------- | ------------------------- | ------------------------- |
| **JSON**   | `application/fhir+json`   | Standard FHIR JSON format |
| **XML**    | `application/fhir+xml`    | FHIR XML format           |
| **NDJSON** | `application/fhir+ndjson` | Newline-delimited JSON    |

### Request Headers

```http
POST /fhir/r5/Patient
Content-Type: application/fhir+json
Accept: application/fhir+json
Authorization: Bearer {access_token}
If-Match: W/"12345"
If-None-Match: W/"12345"
Prefer: return=representation
```text

### Response Headers

```http
Content-Type: application/fhir+json
Content-Location: https://api.zarishspace.com/fhir/r5/Patient/123
ETag: W/"12345"
Last-Modified: Mon, 01 Jan 2023 12:00:00 GMT
```text

## Search Operations

### Basic Search

### Simple Parameters

```http
GET /fhir/r5/Patient?family=Smith&given=John&birthDate=1985-06-15
```text

### Modifiers

```http
GET /fhir/r5/Patient?family:contains=mit&gender=male
GET /fhir/r5/Patient?identifier=MRN-2023-001234
GET /fhir/r5/Patient?_sort=-birthDate
GET /fhir/r5/Patient?_count=50&_offset=100
```text

### Advanced Search

### Chaining

```http
GET /fhir/r5/Patient?family=Smith&_has:Encounter:patient.status=completed
GET /fhir/r5/Patient?_include=Patient:organization
GET /fhir/r5/Patient?_revinclude=Patient:practitioner
```text

### Reverse Include

```http
GET /fhir/r5/Encounter?_revinclude=Encounter:patient
GET /fhir/r5/Observation?_revinclude=Observation:subject
```text

### Composite Search

```http
GET /fhir/r5/Patient/$everything
GET /fhir/r5/Encounter/$everything?patient=123
```json

## Resource Operations

### Patient Operations

### Create Patient

```http
POST /fhir/r5/Patient
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Patient",
  "name": [
    {
      "use": "official",
      "family": "Smith",
      "given": ["John", "William"]
    }
  ],
  "gender": "male",
  "birthDate": "1985-06-15",
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MR",
            "display": "Medical Record Number"
          }
        ]
      },
      "system": "https://zarishsphere.com/mrn",
      "value": "MRN-2023-001234"
    }
  ]
}
```text

### Search Patients

```http
GET /fhir/r5/Patient?family=Smith&gender=male
Accept: application/fhir+json
Authorization: Bearer {access_token}
```json

### Update Patient

```http
PUT /fhir/r5/Patient/123
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Patient",
  "id": "123",
  "name": [
    {
      "use": "official",
      "family": "Smith",
      "given": ["John", "William"]
    }
  ],
  "gender": "male",
  "birthDate": "1985-06-15",
  "telecom": [
    {
      "system": "phone",
      "value": "+1-555-123-4567",
      "use": "mobile"
    }
  ]
}
```json

### Observation Operations

### Create Observation

```http
POST /fhir/r5/Observation
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Observation",
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "vital-signs",
          "display": "Vital Signs"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "8302-6",
        "display": "Body height"
      }
    ]
  },
  "subject": {
    "reference": "Patient/123"
  },
  "effectiveDateTime": "2023-12-01T14:30:00Z",
  "valueQuantity": {
    "value": 175,
    "unit": "cm",
    "system": "http://unitsofmeasure.org",
    "code": "cm"
  }
}
```text

### Search Observations

```http
GET /fhir/r5/Observation?patient=Patient/123&category=vital-signs
Accept: application/fhir+json
Authorization: Bearer {access_token}
```json

## Batch Operations

### Transaction Bundle

```http
POST /fhir/r5/
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "urn:uuid:patient-1",
      "resource": {
        "resourceType": "Patient",
        "name": [{"family": "Doe", "given": ["Jane"]}],
        "gender": "female",
        "birthDate": "1990-04-22"
      },
      "request": {
        "method": "POST",
        "url": "Patient"
      }
    },
    {
      "fullUrl": "urn:uuid:encounter-1",
      "resource": {
        "resourceType": "Encounter",
        "status": "planned",
        "subject": {
          "reference": "urn:uuid:patient-1"
        },
        "class": {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": "AMB"
        }
      },
      "request": {
        "method": "POST",
        "url": "Encounter"
      }
    }
  ]
}
```json

### Batch Bundle

```http
POST /fhir/r5/
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Bundle",
  "type": "batch",
  "entry": [
    {
      "request": {
        "method": "GET",
        "url": "Patient/123"
      }
    },
    {
      "request": {
        "method": "GET",
        "url": "Observation?patient=Patient/123"
      }
    }
  ]
}
```json

## Conditional Operations

### Conditional Create

```http
POST /fhir/r5/Patient?identifier=https://zarishsphere.com/mrn|MRN-2023-001234
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Patient",
  "name": [{"family": "Smith", "given": ["John"]}],
  "gender": "male",
  "birthDate": "1985-06-15"
}
```json

### Conditional Update

```http
PUT /fhir/r5/Patient?identifier=https://zarishsphere.com/mrn|MRN-2023-001234
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Patient",
  "name": [{"family": "Smith", "given": ["John", "William"]}],
  "gender": "male",
  "birthDate": "1985-06-15"
}
```sql

### Conditional Delete

```http
DELETE /fhir/r5/Patient?identifier=https://zarishsphere.com/mrn|MRN-2023-001234
Authorization: Bearer {access_token}
```text

## Versioning and History

### Version Control

### ETag Headers

```http
GET /fhir/r5/Patient/123
If-None-Match: W/"12345"
```text

### History Retrieval

```http
GET /fhir/r5/Patient/123/_history
Accept: application/fhir+json
Authorization: Bearer {access_token}
```text

### Specific Version

```http
GET /fhir/r5/Patient/123/_history/1
Accept: application/fhir+json
Authorization: Bearer {access_token}
```json

### Versioning Strategy

```json
{
  "resourceType": "Patient",
  "id": "123",
  "meta": {
    "versionId": "2",
    "lastUpdated": "2023-12-01T10:30:00Z",
    "tag": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
        "code": "SUBJECT_CHANGED",
        "display": "Subject changed"
      }
    ]
  }
}
```text

## Performance Optimization

### Caching Strategy

### ETag Caching

```http
GET /fhir/r5/Patient/123
If-None-Match: W/"12345"
Cache-Control: max-age=300
```text

### Conditional Requests

```http
GET /fhir/r5/Patient/123
If-Modified-Since: Mon, 01 Jan 2023 12:00:00 GMT
```text

### Pagination

### Offset Pagination

```http
GET /fhir/r5/Patient?_count=50&_offset=100
```text

### Page Bundle

```http
GET /fhir/r5/Patient?_page=2
```text

### Search Optimization

### Search Result Caching

```http
GET /fhir/r5/Patient?family=Smith&_sort=birthDate
Cache-Control: max-age=600
```json

## Error Handling

### HTTP Status Codes

| Status  | Description           | FHIR Error Code |
| ------- | --------------------- | --------------- |
| **400** | Bad Request           | `invalid`       |
| **401** | Unauthorized          | `security`      |
| **403** | Forbidden             | `security`      |
| **404** | Not Found             | `not-found`     |
| **409** | Conflict              | `conflict`      |
| **422** | Unprocessable Entity  | `invalid`       |
| **429** | Too Many Requests     | `too-costly`    |
| **500** | Internal Server Error | `exception`     |

### OperationOutcome Examples

### Validation Error

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Invalid birthDate format"
      },
      "location": ["Patient.birthDate"],
      "expression": ["Patient.birthDate"]
    }
  ]
}
```json

### Business Rule Violation

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invariant",
      "details": {
        "text": "Patient identifier already exists"
      },
      "location": ["Patient.identifier[0].value"]
    }
  ]
}
```text

## Security Considerations

### HTTPS Required

All API requests must use HTTPS:

```http
GET https://api.zarishsphere.com/fhir/r5/Patient
```text

### Access Control

### Scope-Based Access

```json
{
  "scope": ["patient/*.read", "patient/*.write", "observation.read", "medication.read"]
}
```text

### Rate Limiting

```http
GET /fhir/r5/Patient
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-Rate-Limit-Reset: 60
```javascript

### Data Privacy

### PHI Protection

- All requests must include proper authentication
- Audit logging for all data access
- Data encryption in transit and at rest
- HIPAA and GDPR compliance

## Implementation Examples

### JavaScript/TypeScript

```javascript
class ZARISphereFHIR {
  constructor(baseURL, accessToken) {
    this.baseURL = baseURL;
    this.accessToken = accessToken;
  }

  async createPatient(patientData) {
    const response = await fetch(`${this.baseURL}/Patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new FHIRError(errorData);
    }

    return response.json();
  }

  async searchPatients(params) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/Patient?${queryString}`, {
      headers: {
        Accept: 'application/fhir+json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.json();
  }

  async getPatient(id) {
    const response = await fetch(`${this.baseURL}/Patient/${id}`, {
      headers: {
        Accept: 'application/fhir+json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.json();
  }
}

class FHIRError extends Error {
  constructor(operationOutcome) {
    super(operationOutcome.issue?.[0]?.details?.text || 'FHIR Error');
    this.operationOutcome = operationOutcome;
  }
}
```javascript

### Python

```python
import requests
from fhir.resources.patient import Patient
from fhir.resources.observation import Observation

class ZARISphereFHIR:
    def __init__(self, base_url, access_token):
        self.base_url = base_url
        self.access_token = access_token
        self.headers = {
            'Content-Type': 'application/fhir+json',
            'Authorization': f'Bearer {access_token}'
        }

    def create_patient(self, patient_data):
        response = requests.post(
            f'{self.base_url}/Patient',
            json=patient_data,
            headers=self.headers
        )

        if response.status_code >= 400:
            error_data = response.json()
            raise FHIRError(error_data)

        return response.json()

    def search_patients(self, **params):
        response = requests.get(
            f'{self.base_url}/Patient',
            params=params,
            headers=self.headers
        )
        return response.json()

    def get_patient(self, patient_id):
        response = requests.get(
            f'{self.base_url}/Patient/{patient_id}',
            headers=self.headers
        )
        return response.json()

class FHIRError(Exception):
    def __init__(self, operation_outcome):
        self.operation_outcome = operation_outcome
        self.message = operation_outcome.issue[0].details.text if operation_outcome.issue else 'FHIR Error'

    def __str__(self):
        return self.message
```json

### cURL Examples

### Create Patient

```bash
curl -X POST "https://api.zarishsphere.com/fhir/r5/Patient" \
  -H "Content-Type: application/fhir+json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "resourceType": "Patient",
    "name": [
      {
        "use": "official",
        "family": "Smith",
        "given": ["John"]
      }
    ],
    "gender": "male",
    "birthDate": "1985-06-15"
  }'
```bash

### Search Patients

```bash
curl -X GET "https://api.zarishsphere.com/fhir/r5/Patient?family=Smith&gender=male" \
  -H "Accept: application/fhir+json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```bash

### Get Patient

```bash
curl -X GET "https://api.zarishsphere.com/fhir/r5/Patient/123" \
  -H "Accept: application/fhir+json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```text

This comprehensive REST implementation guide ensures proper FHIR R5 integration with robust error handling, security, and performance optimization for healthcare applications.
````
