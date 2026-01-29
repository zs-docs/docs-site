---
title: 'API Endpoints Reference'
sidebar_label: 'Endpoints'
description: 'Complete reference for all ZARISH SPHERE API endpoints, methods, and resource operations'
keywords: [api, endpoints, rest, fhir, healthcare, resources]
---

# API Endpoints Reference

## Base URLs

| Environment | Base URL                               | Purpose                     |
| ----------- | -------------------------------------- | --------------------------- |
| Production  | `https://api.zarishsphere.com`         | Live production environment |
| Staging     | `https://api-staging.zarishsphere.com` | Testing and validation      |
| Development | `https://api-dev.zarishsphere.com`     | Development and debugging   |

## API Versioning

All API requests should include the version prefix:

````text
https://api.zarishsphere.com/v1/
```text

Current supported versions:

- **v1** - Current stable version
- **v2** - Beta version (opt-in)

## Authentication Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/fhir+json
Accept: application/fhir+json
X-API-Version: 1.0
```text

## Core Endpoints

### Patient Management

### Create Patient

```http
POST /v1/Patient
```json

**Request Body:**

```json
{
  "resourceType": "Patient",
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MR",
            "display": "Medical Record Number"
          }
        ]
      },
      "value": "MRN-123456789",
      "system": "https://hospital.zarishsphere.com/mrn"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Smith",
      "given": ["John", "Michael"]
    }
  ],
  "gender": "male",
  "birthDate": "1985-06-15",
  "telecom": [
    {
      "system": "phone",
      "value": "+1-555-123-4567",
      "use": "home"
    }
  ]
}
```json

**Response:**

```json
{
  "resourceType": "Patient",
  "id": "patient-12345",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "identifier": [...],
  "name": [...],
  "gender": "male",
  "birthDate": "1985-06-15"
}
```text

### Get Patient

```http
GET /v1/Patient/{id}
```text

**Parameters:**

- `id` (required) - Patient resource ID

**Example:**

```http
GET /v1/Patient/patient-12345
```text

### Search Patients

```http
GET /v1/Patient?family={family}&given={given}&birthdate={birthdate}
```text

**Search Parameters:**

- `family` - Family name (partial match)
- `given` - Given name (partial match)
- `birthdate` - Birth date (eq, gt, lt, ge, le)
- `identifier` - Patient identifier
- `gender` - Gender (male | female | other | unknown)

**Example:**

```http
GET /v1/Patient?family=Smith&given=John&birthdate=1985-06-15
```sql

### Update Patient

```http
PUT /v1/Patient/{id}
```sql

### Delete Patient

```http
DELETE /v1/Patient/{id}
```sql

### Clinical Resources

### Observations

```http
GET /v1/Observation?patient={patient_id}&category={category}
POST /v1/Observation
PUT /v1/Observation/{id}
DELETE /v1/Observation/{id}
```json

**Observation Categories:**

- `vital-signs` - Blood pressure, heart rate, temperature
- `laboratory` - Lab test results
- `imaging` - Radiology results
- `survey` - Questionnaire responses

**Example - Create Vital Signs:**

```json
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
        "code": "85354-9",
        "display": "Blood pressure panel"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-12345"
  },
  "component": [
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "8480-6",
            "display": "Systolic blood pressure"
          }
        ]
      },
      "valueQuantity": {
        "value": 120,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "8462-4",
            "display": "Diastolic blood pressure"
          }
        ]
      },
      "valueQuantity": {
        "value": 80,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    }
  ]
}
```sql

### Conditions

```http
GET /v1/Condition?patient={patient_id}&clinical-status={status}
POST /v1/Condition
PUT /v1/Condition/{id}
DELETE /v1/Condition/{id}
```text

**Clinical Status Values:**

- `active` - Currently active condition
- `recurrence` - Recurring condition
- `relapse` - Relapsed condition
- `remission` - In remission
- `resolved` - Resolved condition

### Medications

```http
GET /v1/MedicationAdministration?patient={patient_id}
GET /v1/MedicationRequest?patient={patient_id}
POST /v1/MedicationRequest
PUT /v1/MedicationRequest/{id}
```text

### Encounters

### Create Encounter

```http
POST /v1/Encounter
```json

**Request Body:**

```json
{
  "resourceType": "Encounter",
  "status": "arrived",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "ambulatory"
  },
  "subject": {
    "reference": "Patient/patient-12345"
  },
  "participant": [
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "ATND",
              "display": "attender"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/practitioner-67890"
      }
    }
  ],
  "period": {
    "start": "2024-01-15T09:00:00Z"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "185345009",
          "display": "Encounter for check up"
        }
      ]
    }
  ]
}
```text

### Diagnostic Resources

### Diagnostic Reports

```http
GET /v1/DiagnosticReport?patient={patient_id}&category={category}
POST /v1/DiagnosticReport
```text

**Categories:**

- `LAB` - Laboratory reports
- `RAD` - Radiology reports
- `PATH` - Pathology reports

### Imaging Studies

```http
GET /v1/ImagingStudy?patient={patient_id}
POST /v1/ImagingStudy
```text

## Administrative Endpoints

### Organizations

```http
GET /v1/Organization/{id}
GET /v1/Organization?type={type}
POST /v1/Organization
PUT /v1/Organization/{id}
```text

**Organization Types:**

- `prov` - Healthcare provider
- `dept` - Hospital department
- `team` - Care team
- `govt` - Government organization

### Practitioners

```http
GET /v1/Practitioner/{id}
GET /v1/Practitioner?name={name}
POST /v1/Practitioner
PUT /v1/Practitioner/{id}
```sql

### Appointments

```http
GET /v1/Appointment?patient={patient_id}&practitioner={practitioner_id}
POST /v1/Appointment
PUT /v1/Appointment/{id}
DELETE /v1/Appointment/{id}
```text

## Pharmacy Endpoints

### Medication Administration

```http
GET /v1/MedicationAdministration?patient={patient_id}&effective-time={time}
POST /v1/MedicationAdministration
```text

### Pharmacy Inventory

```http
GET /v1/Pharmacy/Inventory?medication={medication_code}
POST /v1/Pharmacy/Inventory
PUT /v1/Pharmacy/Inventory/{id}
```json

**Inventory Response:**

```json
{
  "resourceType": "Basic",
  "id": "inventory-12345",
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/inventory",
      "extension": [
        {
          "url": "medication",
          "valueReference": {
            "reference": "Medication/med-123"
          }
        },
        {
          "url": "quantity",
          "valueQuantity": {
            "value": 500,
            "unit": "tablets",
            "system": "http://unitsofmeasure.org"
          }
        },
        {
          "url": "expiryDate",
          "valueDate": "2024-12-31"
        }
      ]
    }
  ]
}
```text

## Laboratory Endpoints

### Test Ordering

```http
GET /v1/ServiceRequest?patient={patient_id}&category={category}
POST /v1/ServiceRequest
```text

**Lab Categories:**

- `laboratory` - Laboratory tests
- `imaging` - Imaging studies
- `procedure` - Clinical procedures

### Specimen Management

```http
GET /v1/Specimen?patient={patient_id}&status={status}
POST /v1/Specimen
PUT /v1/Specimen/{id}
```text

## Billing and Financial

### Account Management

```http
GET /v1/Account?patient={patient_id}&status={status}
POST /v1/Account
PUT /v1/Account/{id}
```text

### Insurance Claims

```http
GET /v1/Coverage?beneficiary={patient_id}
POST /v1/Coverage
PUT /v1/Coverage/{id}
```text

## Public Health and Reporting

### Immunization

```http
GET /v1/Immunization?patient={patient_id}
POST /v1/Immunization
```text

### Public Health Reporting

```http
GET /v1/MeasureReport?measure={measure_id}&period={period}
POST /v1/MeasureReport
```text

## System Operations

### Capability Statement

```http
GET /v1/metadata
```text

Returns the FHIR capability statement describing supported resources, operations, and interactions.

### Batch Operations

```http
POST /v1/
Content-Type: application/fhir+json
```json

**Batch Request:**

```json
{
  "resourceType": "Bundle",
  "type": "batch",
  "entry": [
    {
      "fullUrl": "urn:uuid:1",
      "resource": {
        "resourceType": "Patient",
        "name": [{ "family": "Smith", "given": ["John"] }]
      },
      "request": {
        "method": "POST",
        "url": "Patient"
      }
    },
    {
      "fullUrl": "urn:uuid:2",
      "resource": {
        "resourceType": "Observation",
        "status": "final",
        "code": { "coding": [{ "system": "http://loinc.org", "code": "8302-2" }] },
        "valueQuantity": { "value": 72, "unit": "bpm" }
      },
      "request": {
        "method": "POST",
        "url": "Observation"
      }
    }
  ]
}
```text

### Transaction Operations

```http
POST /v1/
Content-Type: application/fhir+json
```text

Similar to batch but all operations must succeed or fail together.

## Search Operations

### Advanced Search Parameters

### \_include and_revinclude

```http
GET /v1/Observation?patient=patient-12345&_include=Observation:subject
GET /v1/Patient=patient-12345&_revinclude=Observation:subject
```text

### \_has and_has:target

```http
GET /v1/Patient?_has:Observation:subject:code=85354-9
```text

### Chained Parameters

```http
GET /v1/Observation?subject:Patient.name=Smith
GET /v1/Encounter?subject:Patient.birthdate=1985-06-15
```text

## Custom Operations

### $everything

```http
GET /v1/Patient/{id}/$everything
```text

Returns all resources related to the specified patient.

### $validate

```http
POST /v1/Patient/$validate
```text

Validates a resource without creating it.

### $match

```http
POST /v1/Patient/$match
```text

Finds matching patient records for deduplication.

### $export

```http
GET /v1/Patient/$export?_type=Patient,Observation,Condition
```javascript

Bulk data export operation.

## Error Responses

### Standard Error Format

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-found",
      "details": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/error-details",
            "code": "PATIENT_NOT_FOUND",
            "display": "Patient not found"
          }
        ]
      },
      "diagnostics": "Patient with ID 'patient-12345' not found",
      "location": ["Patient.patient-12345"]
    }
  ]
}
```sql

### Common HTTP Status Codes

| Status | Meaning               | Use Case                       |
| ------ | --------------------- | ------------------------------ |
| 200    | OK                    | Successful GET/PUT             |
| 201    | Created               | Successful POST                |
| 204    | No Content            | Successful DELETE              |
| 400    | Bad Request           | Invalid request format         |
| 401    | Unauthorized          | Missing/invalid authentication |
| 403    | Forbidden             | Insufficient permissions       |
| 404    | Not Found             | Resource not found             |
| 409    | Conflict              | Resource version conflict      |
| 422    | Unprocessable Entity  | Validation failure             |
| 429    | Too Many Requests     | Rate limit exceeded            |
| 500    | Internal Server Error | Server error                   |

## Rate Limiting

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706238800
X-RateLimit-Retry-After: 60
```text

### Rate Limits by Plan

| Plan         | Requests/Hour | Burst Limit |
| ------------ | ------------- | ----------- |
| Free         | 1,000         | 100         |
| Professional | 10,000        | 1,000       |
| Enterprise   | 100,000       | 10,000      |

## Pagination

### Standard Pagination

```http
GET /v1/Patient?_count=50&_page=2
```text

### Pagination Response Headers

```http
Link: <https://api.zarishsphere.com/v1/Patient?_count=50&_page=1>; rel="first",
      <https://api.zarishsphere.com/v1/Patient?_count=50&_page=1>; rel="prev",
      <https://api.zarishsphere.com/v1/Patient?_count=50&_page=3>; rel="next",
      <https://api.zarishsphere.com/v1/Patient?_count=50&_page=10>; rel="last"
```javascript

## SDK and Client Libraries

### Official SDKs

- **JavaScript/TypeScript**: `@zarishsphere/api-client`
- **Python**: `zarishsphere-python`
- **Java**: `com.zarishsphere:api-client`
- **C#**: `ZarishSphere.Api.Client`
- **Ruby**: `zarishsphere-ruby`

### Quick Start Examples

### JavaScript

```javascript
import { ZSApiClient } from '@zarishsphere/api-client';

const client = new ZSApiClient({
  baseURL: 'https://api.zarishsphere.com/v1',
  accessToken: 'your-access-token',
});

const patient = await client.patient.read('patient-12345');
const observations = await client.observation.search({
  patient: 'patient-12345',
  category: 'vital-signs',
});
```javascript

### Python

```python
from zarishsphere import ZSApiClient

client = ZSApiClient(
    base_url='https://api.zarishsphere.com/v1',
    access_token='your-access-token'
)

patient = client.patient.read('patient-12345')
observations = client.observation.search(
    patient='patient-12345',
    category='vital-signs'
)
```text

## Testing and Development

### Test Environment

- **URL**: `https://api-staging.zarishsphere.com`
- **Test Data**: Sandbox with synthetic patient data
- **No Real PHI**: Safe for development and testing

### Mock Server

```bash
docker run -p 8080:8080 zarishsphere/mock-api
```text

Provides a local mock server for development testing.

## Support

- [API Documentation](./overview.md)
- [Authentication Guide](./authentication.md)
- [Error Codes](./errors.md)
- [SDK Documentation](./sdk.md)
- [Community Forum](https://github.com/zs-docs/docs-site/discussions)
- [API Status](https://status.zarishsphere.com)
````
