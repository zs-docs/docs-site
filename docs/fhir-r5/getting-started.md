---
title: 'Getting Started with FHIR R5'
sidebar_label: 'Getting Started'
description: 'Quick start guide for implementing FHIR R5 with ZARISH SPHERE including setup, basic operations, and examples'
keywords: [fhir r5, getting started, quick start, healthcare interoperability, zarish sphere]
---

# Getting Started with FHIR R5

## Introduction

ZARISH SPHERE provides a complete FHIR R5 implementation optimized for healthcare interoperability, with special extensions for humanitarian scenarios and low-resource environments. This guide will help you get started quickly with our FHIR R5 API.

## Prerequisites

### Requirements

- **API Access**: Valid API credentials for ZARISH SPHERE
- **HTTP Client**: curl, Postman, or any HTTP client library
- **JSON Knowledge**: Understanding of JSON data structures
- **FHIR Basics**: Familiarity with FHIR concepts (recommended)

### Authentication

Before making any API calls, you'll need to authenticate:

````http
GET https://fhir.zarishsphere.com/R5/metadata
Authorization: Bearer {your-access-token}
```bash

## Quick Start

### 1. Test Your Connection

First, verify your API access by checking the capability statement:

```bash
curl -X GET "https://fhir.zarishsphere.com/R5/metadata" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/fhir+json"
```json

**Expected Response:**

```json
{
  "resourceType": "CapabilityStatement",
  "status": "active",
  "date": "2023-12-01T10:30:00Z",
  "kind": "instance",
  "fhirVersion": "5.0.0",
  "format": ["application/fhir+json"],
  "rest": [
    {
      "mode": "server",
      "resource": [
        {
          "type": "Patient",
          "interaction": ["read", "create", "update", "delete", "search-type"]
        },
        {
          "type": "Encounter",
          "interaction": ["read", "create", "update", "delete", "search-type"]
        }
      ]
    }
  ]
}
```json

### 2. Create Your First Patient

```bash
curl -X POST "https://fhir.zarishsphere.com/R5/Patient" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/fhir+json" \
  -d '{
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
  }'
```json

**Expected Response:**

```json
{
  "resourceType": "Patient",
  "id": "patient-123",
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
  ],
  "meta": {
    "versionId": "1",
    "lastUpdated": "2023-12-01T10:30:00Z"
  }
}
```bash

### 3. Search for Patients

```bash
curl -X GET "https://fhir.zarishsphere.com/R5/Patient?family=Smith&given=John" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/fhir+json"
```json

### 4. Create an Encounter

```bash
curl -X POST "https://fhir.zarishsphere.com/R5/Encounter" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Encounter",
    "status": "in-progress",
    "class": {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      "code": "AMB",
      "display": "Ambulatory"
    },
    "subject": {
      "reference": "Patient/patient-123"
    },
    "period": {
      "start": "2023-12-01T10:30:00Z"
    },
    "participant": [
      {
        "type": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                "code": "PPRF",
                "display": "Primary Performer"
              }
            ]
          }
        ],
        "individual": {
          "reference": "Practitioner/practitioner-456"
        }
      }
    ]
  }'
```text

## Core Concepts

### Resources

ZARISH SPHERE supports the following core FHIR R5 resources:

### Clinical Resources

- **Patient**: Demographic and administrative information
- **Practitioner**: Healthcare providers
- **Encounter**: Interactions between patients and healthcare providers
- **Condition**: Health problems, diagnoses, and other health issues
- **Observation**: Measurements, observations, and assertions
- **Procedure**: Actions performed on or for a patient

### Medication Resources

- **Medication**: Medications and substances
- **MedicationRequest**: Orders for medications
- **MedicationAdministration**: Administration of medications

### Diagnostic Resources

- **DiagnosticReport**: Diagnostic test results
- **ServiceRequest**: Requests for services
- **Specimen**: Biological specimens

### ZARISH SPHERE Extensions

We provide custom extensions for humanitarian healthcare:

### Humanitarian Patient Extension

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/humanitarian-patient",
  "extension": [
    {
      "url": "displacementStatus",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/displacement-status",
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
```text

### Low-Resource Optimization Extension

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/low-resource-optimization",
  "extension": [
    {
      "url": "offlineSync",
      "valueBoolean": true
    },
    {
      "url": "minimalDataMode",
      "valueBoolean": true
    },
    {
      "url": "bandwidthOptimized",
      "valueBoolean": true
    }
  ]
}
```text

## Common Operations

### Search Operations

### Basic Search

```bash
## Search by family name
GET /R5/Patient?family=Smith

## Search by birth date
GET /R5/Patient?birthDate=1985-06-15

## Search by gender
GET /R5/Patient?gender=male

## Multiple criteria
GET /R5/Patient?family=Smith&birthDate=1985-06-15&gender=male
```text

### Advanced Search

```bash
## Search with modifiers
GET /R5/Patient?family:contains=mit

## Search by identifier
GET /R5/Patient?identifier=MRN-2023-001234

## Search with chaining
GET /R5/Patient?family=Smith&_has:Encounter:patient.status=in-progress

## Search with include
GET /R5/Patient?family=Smith&_include=Patient:encounter
```bash

### Read Operations

### Get Resource by ID

```bash
curl -X GET "https://fhir.zarishsphere.com/R5/Patient/patient-123" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/fhir+json"
```bash

### Conditional Read

```bash
curl -X GET "https://fhir.zarishsphere.com/R5/Patient?identifier=MRN-2023-001234" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/fhir+json" \
  -H "If-None-Match: W/\"12345\""
```json

### Create Operations

### Create Resource

```bash
curl -X POST "https://fhir.zarishsphere.com/R5/Observation" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/fhir+json" \
  -d '{
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
          "code": "8302-2",
          "display": "Body height"
        }
      ]
    },
    "subject": {
      "reference": "Patient/patient-123"
    },
    "effectiveDateTime": "2023-12-01T10:30:00Z",
    "valueQuantity": {
      "value": 175,
      "unit": "cm",
      "system": "http://unitsofmeasure.org",
      "code": "cm"
    }
  }'
```json

### Update Operations

### Update Resource

```bash
curl -X PUT "https://fhir.zarishsphere.com/R5/Patient/patient-123" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "id": "patient-123",
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
  }'
```json

### Conditional Update

```bash
curl -X PUT "https://fhir.zarishsphere.com/R5/Patient?identifier=MRN-2023-001234" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [
      {
        "use": "official",
        "family": "Smith",
        "given": ["John", "William"]
      }
    ],
    "gender": "male",
    "birthDate": "1985-06-15"
  }'
```bash

### Delete Operations

### Delete Resource

```bash
curl -X DELETE "https://fhir.zarishsphere.com/R5/Patient/patient-123" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```bash

### Conditional Delete

```bash
curl -X DELETE "https://fhir.zarishsphere.com/R5/Patient?identifier=MRN-2023-001234" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```json

## Batch Operations

### Transaction Bundle

```bash
curl -X POST "https://fhir.zarishsphere.com/R5" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Bundle",
    "type": "transaction",
    "entry": [
      {
        "fullUrl": "urn:uuid:patient-1",
        "resource": {
          "resourceType": "Patient",
          "name": [
            {
              "family": "Doe",
              "given": ["Jane"]
            }
          ],
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
  }'
```bash

## Bulk Operations

### Bulk Export

```bash
curl -X GET "https://fhir.zarishsphere.com/R5/$export" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/fhir+ndjson" \
  -H "Prefer: respond-async"
```bash

### Bulk Import

```bash
curl -X POST "https://fhir.zarishsphere.com/R5" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/fhir+ndjson" \
  --data-binary @patients.ndjson
```json

## Error Handling

### Common Error Responses

### Validation Error (400)

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

### Not Found (404)

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-found",
      "details": {
        "text": "Resource not found"
      }
    }
  ]
}
```json

### Unauthorized (401)

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "security",
      "details": {
        "text": "Authentication required"
      }
    }
  ]
}
```javascript

## SDK Examples

### JavaScript/TypeScript

```javascript
import { ZarishSphereFHIR } from '@zarishsphere/fhir-client';

const fhir = new ZarishSphereFHIR({
  baseURL: 'https://fhir.zarishsphere.com/R5',
  token: 'your-access-token',
});

// Create patient
const patient = await fhir.create('Patient', {
  name: [{ family: 'Smith', given: ['John'] }],
  gender: 'male',
  birthDate: '1985-06-15',
});

// Search patients
const patients = await fhir.search('Patient', {
  family: 'Smith',
  gender: 'male',
});

// Get patient by ID
const patientById = await fhir.read('Patient', 'patient-123');
```javascript

### Python

```python
from fhir.resources.patient import Patient
from fhir.resources.humanname import HumanName
from zarishsphere.fhir_client import ZarishSphereFHIR

fhir = ZarishSphereFHIR(
    base_url='https://fhir.zarishsphere.com/R5',
    token='your-access-token'
)

## Create patient
patient = Patient()
patient.name = [HumanName()]
patient.name[0].family = 'Smith'
patient.name[0].given = ['John']
patient.gender = 'male'
patient.birthDate = '1985-06-15'

created_patient = fhir.create(patient)

## Search patients
patients = fhir.search(
    resource_type='Patient',
    params={'family': 'Smith', 'gender': 'male'}
)
```javascript

## Testing

### Unit Testing

```javascript
// Using Jest for testing
const { ZarishSphereFHIR } = require('@zarishsphere/fhir-client');

describe('FHIR Patient Operations', () => {
  let fhir;

  beforeEach(() => {
    fhir = new ZarishSphereFHIR({
      baseURL: 'https://sandbox-fhir.zarishsphere.com/R5',
      token: 'test-token',
    });
  });

  test('should create a patient', async () => {
    const patientData = {
      name: [{ family: 'Test', given: ['Patient'] }],
      gender: 'female',
      birthDate: '1990-01-01',
    };

    const patient = await fhir.create('Patient', patientData);

    expect(patient.resourceType).toBe('Patient');
    expect(patient.name[0].family).toBe('Test');
    expect(patient.gender).toBe('female');
  });

  test('should search patients by name', async () => {
    const patients = await fhir.search('Patient', {
      family: 'Test',
    });

    expect(patients.resourceType).toBe('Bundle');
    expect(patients.entry).toBeDefined();
  });
});
```json

### Integration Testing

```bash
## Test script for API endpoints
#!/bin/bash

BASE_URL="https://sandbox-fhir.zarishsphere.com/R5"
TOKEN="test-token"

echo "Testing FHIR API..."

## Test capability statement
echo "Testing capability statement..."
curl -s -X GET "$BASE_URL/metadata" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/fhir+json" | jq .

## Test patient creation
echo "Creating test patient..."
PATIENT_ID=$(curl -s -X POST "$BASE_URL/Patient" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "Test", "given": ["Patient"]}],
    "gender": "female",
    "birthDate": "1990-01-01"
  }' | jq -r '.id')

echo "Created patient: $PATIENT_ID"

## Test patient read
echo "Reading patient..."
curl -s -X GET "$BASE_URL/Patient/$PATIENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/fhir+json" | jq .

## Test patient search
echo "Searching patients..."
curl -s -X GET "$BASE_URL/Patient?family=Test" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/fhir+json" | jq .

echo "FHIR API tests completed!"
```text

## Best Practices

### 1. Performance

- Use conditional reads with `If-None-Match` headers
- Implement pagination for large result sets
- Use search parameters efficiently
- Cache frequently accessed resources

### 2. Security

- Always use HTTPS
- Validate all input data
- Implement proper authentication
- Use rate limiting

### 3. Error Handling

- Check HTTP status codes
- Parse OperationOutcome responses
- Implement retry logic with exponential backoff
- Log errors appropriately

### 4. Data Quality

- Validate FHIR resources before sending
- Use proper terminology systems
- Follow FHIR data modeling best practices
- Implement data validation rules

## Next Steps

Now that you have a basic understanding of ZARISH SPHERE's FHIR R5 implementation:

1. **Explore Resources**: Learn about all supported FHIR resources
2. **Advanced Search**: Master FHIR search parameters and modifiers
3. **Bulk Operations**: Implement bulk data import/export
4. **Custom Extensions**: Use ZARISH SPHERE's humanitarian extensions
5. **Integration**: Integrate with your existing healthcare systems

For more detailed information, refer to our comprehensive FHIR R5 documentation and API reference.

This getting started guide provides the foundation for working with ZARISH SPHERE's FHIR R5 implementation. Happy coding!
````
