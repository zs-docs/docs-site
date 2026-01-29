---
title: 'Custom Operations'
sidebar_label: 'Custom Operations'
description: 'Comprehensive guide to FHIR R5 custom operations in ZARISH SPHERE'
keywords: [custom operations, fhir r5, extensions, healthcare, zarish sphere]
---

# FHIR R5 Custom Operations

## Overview

ZARISH SPHERE extends standard FHIR R5 operations with custom operations specifically designed for humanitarian healthcare scenarios and low-resource environments. These operations provide specialized functionality for disease surveillance, patient matching, mobile clinic workflows, and emergency response scenarios.

## Custom Operations Overview

| Operation                  | Endpoint                         | Description                                 | Use Case                    |
| -------------------------- | -------------------------------- | ------------------------------------------- | --------------------------- |
| **Patient Matching**       | `POST /Patient/$match`           | Advanced patient matching and deduplication | Duplicate patient detection |
| **Disease Surveillance**   | `POST /Condition/$surveillance`  | Disease outbreak monitoring                 | Public health tracking      |
| **Mobile Clinic**          | `POST /Encounter/$mobile-clinic` | Mobile clinic workflow management           | Field operations            |
| **Emergency Response**     | `POST /Procedure/$emergency`     | Emergency procedure tracking                | Disaster response           |
| **Resource Allocation**    | `POST /Medication/$allocate`     | Medication resource allocation              | Supply management           |
| **Vaccination Campaign**   | `POST /Immunization/$campaign`   | Mass vaccination tracking                   | Immunization programs       |
| **Nutritional Assessment** | `POST /Observation/$nutrition`   | Nutritional status assessment               | Malnutrition screening      |
| **Displacement Tracking**  | `POST /Patient/$displacement`    | Population displacement monitoring          | Refugee management          |

## Patient Matching Operation

### Overview

The patient matching operation uses advanced algorithms to identify potential duplicate patients across different systems and data sources.

### Endpoint

````http
POST /fhir/r5/Patient/$match
Content-Type: application/fhir+json
Authorization: Bearer {access_token}
```json

### Request Parameters

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "patient",
      "resource": {
        "resourceType": "Patient",
        "name": [
          {
            "use": "official",
            "family": "Smith",
            "given": ["John", "William"]
          }
        ],
        "birthDate": "1985-06-15",
        "gender": "male",
        "identifier": [
          {
            "use": "official",
            "system": "https://zarishsphere.com/mrn",
            "value": "MRN-2023-001234"
          }
        ]
      }
    },
    {
      "name": "matchThreshold",
      "valueDecimal": 0.85
    },
    {
      "name": "algorithm",
      "valueString": "deterministic"
    },
    {
      "name": "includeInactive",
      "valueBoolean": false
    }
  ]
}
```json

### Response

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "fullUrl": "https://api.zarishsphere.com/fhir/r5/Patient/123",
      "resource": {
        "resourceType": "Patient",
        "id": "123",
        "name": [
          {
            "use": "official",
            "family": "Smith",
            "given": ["John", "William"]
          }
        ],
        "birthDate": "1985-06-15",
        "gender": "male"
      },
      "search": {
        "score": 0.95,
        "mode": "match"
      }
    }
  ]
}
```javascript

### Implementation Example

```javascript
async function matchPatient(patientData, options = {}) {
  const request = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'patient',
        resource: patientData,
      },
      {
        name: 'matchThreshold',
        valueDecimal: options.threshold || 0.85,
      },
      {
        name: 'algorithm',
        valueString: options.algorithm || 'deterministic',
      },
    ],
  };

  const response = await fetch('/fhir/r5/Patient/$match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  return response.json();
}
```text

## Disease Surveillance Operation

### Overview

The disease surveillance operation enables real-time monitoring of disease patterns and outbreak detection in humanitarian settings.

### Endpoint

```http
POST /fhir/r5/Condition/$surveillance
Content-Type: application/fhir+json
Authorization: Bearer {access_token}
```json

### Request Parameters

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "diseaseCode",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "186549000",
            "display": "Cholera due to Vibrio cholerae"
          }
        ]
      }
    },
    {
      "name": "timePeriod",
      "valuePeriod": {
        "start": "2023-12-01T00:00:00Z",
        "end": "2023-12-31T23:59:59Z"
      }
    },
    {
      "name": "geographicArea",
      "valueString": "Northern District"
    },
    {
      "name": "alertThreshold",
      "valueInteger": 10
    },
    {
      "name": "includeDemographics",
      "valueBoolean": true
    }
  ]
}
```json

### Response

```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "OperationOutcome",
        "issue": [
          {
            "severity": "warning",
            "code": "business-rule",
            "details": {
              "text": "Disease cases exceed alert threshold"
            }
          }
        ]
      }
    },
    {
      "resource": {
        "resourceType": "Bundle",
        "type": "searchset",
        "entry": [
          {
            "resource": {
              "resourceType": "Condition",
              "code": {
                "coding": [
                  {
                    "system": "http://snomed.info/sct",
                    "code": "186549000",
                    "display": "Cholera due to Vibrio cholerae"
                  }
                ]
              },
              "subject": {
                "reference": "Patient/123"
              },
              "recordedDate": "2023-12-15T10:30:00Z"
            }
          }
        ]
      }
    }
  ]
}
```javascript

### Implementation Example

```javascript
async function diseaseSurveillance(diseaseCode, timePeriod, geographicArea) {
  const request = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'diseaseCode',
        valueCodeableConcept: diseaseCode,
      },
      {
        name: 'timePeriod',
        valuePeriod: timePeriod,
      },
      {
        name: 'geographicArea',
        valueString: geographicArea,
      },
      {
        name: 'alertThreshold',
        valueInteger: 10,
      },
    ],
  };

  const response = await fetch('/fhir/r5/Condition/$surveillance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  return response.json();
}
```text

## Mobile Clinic Operation

### Overview

The mobile clinic operation manages workflows for mobile healthcare units operating in remote or underserved areas.

### Endpoint

```http
POST /fhir/r5/Encounter/$mobile-clinic
Content-Type: application/fhir+json
Authorization: Bearer {access_token}
```json

### Request Parameters

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "mobileUnit",
      "valueString": "MOBILE-CLINIC-001"
    },
    {
      "name": "location",
      "valueString": "Village Square, Northern District"
    },
    {
      "name": "date",
      "valueDate": "2023-12-15"
    },
    {
      "name": "services",
      "valueCodeableConcept": [
        {
          "coding": [
            {
              "system": "https://zarishsphere.com/fhir/CodeSystem/mobile-clinic-services",
              "code": "primary-care",
              "display": "Primary Care"
            },
            {
              "system": "https://zarishsphere.com/fhir/CodeSystem/mobile-clinic-services",
              "code": "vaccination",
              "display": "Vaccination"
            }
          ]
        }
      ],
    {
      "name": "staff",
      "reference": {
        "reference": "Practitioner/456",
        "display": "Dr. Sarah Johnson"
      }
    }
  ]
}
```json

### Response

```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Encounter",
        "id": "mobile-encounter-123",
        "status": "planned",
        "class": {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": "AMB",
          "display": "Ambulatory"
        },
        "extension": [
          {
            "url": "https://zarishsphere.com/fhir/StructureDefinition/mobile-clinic",
            "extension": [
              {
                "url": "mobileUnit",
                "valueString": "MOBILE-CLINIC-001"
              },
              {
                "url": "location",
                "valueString": "Village Square, Northern District"
              }
            ]
          }
        ]
      }
    }
  ]
}
```javascript

### Implementation Example

```javascript
async function createMobileClinicSession(mobileUnit, location, date, services, staff) {
  const request = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'mobileUnit',
        valueString: mobileUnit,
      },
      {
        name: 'location',
        valueString: location,
      },
      {
        name: 'date',
        valueDate: date,
      },
      {
        name: 'services',
        valueCodeableConcept: services,
      },
      {
        name: 'staff',
        reference: staff,
      },
    ],
  };

  const response = await fetch('/fhir/r5/Encounter/$mobile-clinic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  return response.json();
}
```text

## Emergency Response Operation

### Overview

The emergency response operation tracks and manages emergency medical procedures in disaster or crisis situations.

### Endpoint

```http
POST /fhir/r5/Procedure/$emergency
Content-Type: application/fhir+json
Authorization: Bearer {access_token}
```json

### Request Parameters

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "emergencyType",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/emergency-type",
            "code": "trauma",
            "display": "Trauma Emergency"
          }
        ]
      }
    },
    {
      "name": "responseTeam",
      "valueString": "Rapid Response Team A"
    },
    {
      "name": "location",
      "valueString": "Emergency Zone 1"
    },
    {
      "name": "priority",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/emergency-priority",
            "code": "critical",
            "display": "Critical Priority"
          }
        ]
      }
    },
    {
      "name": "resources",
      "valueString": "Basic surgical kit, portable anesthesia, emergency medications"
    }
  ]
}
```json

### Response

```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Procedure",
        "id": "emergency-procedure-123",
        "status": "in-progress",
        "extension": [
          {
            "url": "https://zarishsphere.com/fhir/StructureDefinition/emergency-procedure",
            "extension": [
              {
                "url": "emergencyType",
                "valueCodeableConcept": {
                  "coding": [
                    {
                      "system": "https://zarishsphere.com/fhir/CodeSystem/emergency-type",
                      "code": "trauma",
                      "display": "Trauma Emergency"
                    }
                  ]
                }
              },
              {
                "url": "responseTeam",
                "valueString": "Rapid Response Team A"
              }
            ]
          }
        ]
      }
    }
  ]
}
```javascript

### Implementation Example

```javascript
async function createEmergencyProcedure(emergencyType, responseTeam, location, priority) {
  const request = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'emergencyType',
        valueCodeableConcept: emergencyType,
      },
      {
        name: 'responseTeam',
        valueString: responseTeam,
      },
      {
        name: 'location',
        valueString: location,
      },
      {
        name: 'priority',
        valueCodeableConcept: priority,
      },
    ],
  };

  const response = await fetch('/fhir/r5/Procedure/$emergency', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  return response.json();
}
```text

## Resource Allocation Operation

### Overview

The resource allocation operation manages the distribution and allocation of medical resources, particularly essential medicines in low-resource settings.

### Endpoint

```http
POST /fhir/r5/Medication/$allocate
Content-Type: application/fhir+json
Authorization: Bearer {access_token}
```json

### Request Parameters

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "medication",
      "reference": {
        "reference": "Medication/123",
        "display": "Acetaminophen 325mg Tablet"
      }
    },
    {
      "name": "quantity",
      "valueQuantity": {
        "value": 1000,
        "unit": "tablets",
        "system": "http://unitsofmeasure.org",
        "code": "{tbl}"
      }
    },
    {
      "name": "destination",
      "valueString": "Mobile Clinic Unit A"
    },
    {
      "name": "allocationType",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/allocation-type",
            "code": "emergency",
            "display": "Emergency Allocation"
          }
        ]
      }
    },
    {
      "name": "priority",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/allocation-priority",
            "code": "high",
            "display": "High Priority"
          }
        ]
      }
    }
  ]
}
```json

### Response

```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Medication",
        "id": "123",
        "extension": [
          {
            "url": "https://zarishsphere.com/fhir/StructureDefinition/allocation",
            "extension": [
              {
                "url": "allocatedQuantity",
                "valueQuantity": {
                  "value": 1000,
                  "unit": "tablets",
                  "system": "http://unitsofmeasure.org",
                  "code": "{tbl}"
                }
              },
              {
                "url": "destination",
                "valueString": "Mobile Clinic Unit A"
              },
              {
                "url": "allocationDate",
                "valueDateTime": "2023-12-15T10:30:00Z"
              }
            ]
          }
        ]
      }
    }
  ]
}
```javascript

### Implementation Example

```javascript
async function allocateMedication(medicationId, quantity, destination, allocationType, priority) {
  const request = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'medication',
        reference: {
          reference: `Medication/${medicationId}`,
        },
      },
      {
        name: 'quantity',
        valueQuantity: quantity,
      },
      {
        name: 'destination',
        valueString: destination,
      },
      {
        name: 'allocationType',
        valueCodeableConcept: allocationType,
      },
      {
        name: 'priority',
        valueCodeableConcept: priority,
      },
    ],
  };

  const response = await fetch('/fhir/r5/Medication/$allocate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  return response.json();
}
```text

## Vaccination Campaign Operation

### Overview

The vaccination campaign operation manages mass immunization programs and tracks vaccination coverage in humanitarian settings.

### Endpoint

```http
POST /fhir/r5/Immunization/$campaign
Content-Type: application/fhir+json
Authorization: Bearer {access_token}
```json

### Request Parameters

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "campaignId",
      "valueString": "CAMPAIGN-2023-001"
    },
    {
      "name": "vaccineType",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/vaccine-type",
            "code": "cholera",
            "display": "Cholera Vaccine"
          }
        ]
      }
    },
    {
      "name": "targetPopulation",
      "valueString": "Northern District residents > 1 year"
    },
    {
      "name": "startDate",
      "valueDate": "2023-12-15"
    },
    {
      "name": "endDate",
      "valueDate": "2023-12-31"
    },
    {
      "name": "coverageGoal",
      "valueDecimal": 0.8
    }
  ]
}
```json

### Response

```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Immunization",
        "id": "campaign-immunization-123",
        "extension": [
          {
            "url": "https://zarishsphere.com/fhir/StructureDefinition/vaccination-campaign",
            "extension": [
              {
                "url": "campaignId",
                "valueString": "CAMPAIGN-2023-001"
              },
              {
                "url": "campaignStatus",
                "valueCodeableConcept": {
                  "coding": [
                    {
                      "system": "https://zarishsphere.com/fhir/CodeSystem/campaign-status",
                      "code": "active",
                      "display": "Active"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```javascript

### Implementation Example

```javascript
async function createVaccinationCampaign(
  campaignId,
  vaccineType,
  targetPopulation,
  startDate,
  endDate,
  coverageGoal
) {
  const request = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'campaignId',
        valueString: campaignId,
      },
      {
        name: 'vaccineType',
        valueCodeableConcept: vaccineType,
      },
      {
        name: 'targetPopulation',
        valueString: targetPopulation,
      },
      {
        name: 'startDate',
        valueDate: startDate,
      },
      {
        name: 'endDate',
        valueDate: endDate,
      },
      {
        name: 'coverageGoal',
        valueDecimal: coverageGoal,
      },
    ],
  };

  const response = await fetch('/fhir/r5/Immunization/$campaign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  return response.json();
}
```json

## Error Handling for Custom Operations

### Common Error Types

| Error                        | Description                   | Resolution                                  |
| ---------------------------- | ----------------------------- | ------------------------------------------- |
| `INVALID_PARAMETER`          | Invalid parameter value       | Check parameter format and values           |
| `MISSING_REQUIRED_PARAMETER` | Required parameter missing    | Ensure all required parameters are provided |
| `OPERATION_NOT_SUPPORTED`    | Operation not available       | Verify operation exists and is enabled      |
| `INSUFFICIENT_PERMISSIONS`   | User lacks permissions        | Check user roles and permissions            |
| `RESOURCE_NOT_FOUND`         | Referenced resource not found | Verify resource exists and is accessible    |

### Error Response Example

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Invalid matchThreshold value. Must be between 0.0 and 1.0"
      },
      "location": ["Parameters.parameter[1].valueDecimal"]
    }
  ]
}
```text

## Performance Considerations

### Optimization Strategies

1. **Caching Results**: Cache frequently accessed operation results
2. **Batch Processing**: Process multiple requests in batches where possible
3. **Asynchronous Processing**: Use async processing for long-running operations
4. **Resource Limits**: Implement appropriate resource limits and timeouts

### Monitoring Metrics

- Operation execution time
- Success/failure rates by operation type
- Resource utilization during operations
- User satisfaction and feedback

## Security Considerations

### Access Control

- Role-based access control for custom operations
- Audit logging for all operation executions
- Rate limiting for resource-intensive operations

### Data Privacy

- Ensure PHI protection in all operations
- Implement proper data masking where needed
- Comply with healthcare data regulations

This comprehensive custom operations guide enables advanced healthcare workflows specifically designed for humanitarian and low-resource healthcare scenarios.
````
