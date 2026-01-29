---
title: 'Encounter Resource'
sidebar_label: 'Encounter'
description: 'Comprehensive guide to FHIR R5 Encounter resource implementation in ZARISH SPHERE'
keywords: [encounter, fhir r5, clinical, healthcare, zarish sphere]
---

# FHIR R5 Encounter Resource

## Overview

The Encounter resource represents interactions between patients and healthcare providers in ZARISH SPHERE. This implementation follows FHIR R5 specifications with humanitarian and low-resource optimizations, supporting various healthcare delivery models including mobile clinics, emergency response, and telehealth.

## Resource Structure

### Core Elements

````json
{
  "resourceType": "Encounter",
  "id": "encounter-123",
  "identifier": [
    {
      "use": "official",
      "system": "https://zarishsphere.com/encounter-id",
      "value": "ENC-2023-001234"
    }
  ],
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "Ambulatory"
  },
  "type": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "16265003",
          "display": "General examination"
        }
      ]
    }
  ],
  "subject": {
    "reference": "Patient/patient-123",
    "display": "John Smith"
  },
  "participant": [
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "PPRF",
              "display": "primary performer"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/practitioner-456",
        "display": "Dr. Sarah Johnson"
      }
    }
  ],
  "period": {
    "start": "2023-12-01T09:00:00Z",
    "end": "2023-12-01T09:30:00Z"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "16265003",
          "display": "General examination"
        }
      ]
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/condition-789"
      },
      "use": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "AD",
            "display": "Admission diagnosis"
          }
        ]
      }
    }
  ]
}
```text

## ZARISH SPHERE Extensions

### Humanitarian Extensions

### Emergency Response Context

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/emergency-response",
      "extension": [
        {
          "url": "responseType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/emergency-response-type",
                "code": "outbreak",
                "display": "Disease Outbreak Response"
              }
            ]
          }
        },
        {
          "url": "responsePhase",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/emergency-phase",
                "code": "treatment",
                "display": "Treatment Phase"
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
```text

### Mobile Clinic Information

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/mobile-clinic",
      "extension": [
        {
          "url": "clinicType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/mobile-clinic-type",
                "code": "outreach",
                "display": "Community Outreach"
              }
            ]
          }
        },
        {
          "url": "vehicleId",
          "valueString": "MOBILE-CLINIC-001"
        },
        {
          "url": "locationType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/location-type",
                "code": "village_square",
                "display": "Village Square"
              }
            ]
          }
        }
      ]
    }
  ]
}
```text

### Low-Resource Optimizations

### Limited Resource Context

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/resource-constraints",
      "extension": [
        {
          "url": "equipmentAvailable",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/equipment-availability",
                "code": "basic",
                "display": "Basic Equipment Only"
              }
            ]
          }
        },
        {
          "url": "staffingLevel",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/staffing-level",
                "code": "minimal",
                "display": "Minimal Staffing"
              }
            ]
          }
        },
        {
          "url": "timeConstraints",
          "valueDuration": {
            "value": 15,
            "unit": "min",
            "system": "http://unitsofmeasure.org",
            "code": "min"
          }
        }
      ]
    }
  ]
}
```json

## Encounter Classes

### Standard FHIR Classes

| Class    | Code        | Description          | Use Case              |
| -------- | ----------- | -------------------- | --------------------- |
| **AMB**  | Ambulatory  | Outpatient visit     | Regular clinic visits |
| **IMP**  | Inpatient   | Hospital admission   | Overnight stays       |
| **EMER** | Emergency   | Emergency visit      | Urgent care           |
| **VR**   | Virtual     | Telehealth encounter | Remote consultations  |
| **HH**   | Home Health | Home visit           | House calls           |

### ZARISH SPHERE Custom Classes

| Class       | Code           | Description                 | Use Case           |
| ----------- | -------------- | --------------------------- | ------------------ |
| **MOBILE**  | Mobile Clinic  | Mobile healthcare unit      | Community outreach |
| **FIELD**   | Field Hospital | Temporary medical facility  | Emergency response |
| **SHELTER** | Shelter Clinic | Clinic in emergency shelter | Refugee camp care  |
| **OUTPOST** | Remote Outpost | Remote healthcare post      | Rural healthcare   |

## Search Parameters

### Standard FHIR Parameters

| Parameter    | Type      | Description                | Example               |
| ------------ | --------- | -------------------------- | --------------------- |
| `_id`        | token     | Logical id of the resource | `encounter-123`       |
| `identifier` | token     | Encounter identifiers      | `ENC-2023-001234`     |
| `patient`    | reference | Patient reference          | `Patient/patient-123` |
| `date`       | date      | Encounter date             | `2023-12-01`          |
| `status`     | token     | Encounter status           | `finished`            |
| `class`      | token     | Encounter class            | `AMB`                 |
| `type`       | token     | Encounter type             | `16265003`            |

### ZARISH SPHERE Custom Parameters

| Parameter        | Type  | Description                 | Example             |
| ---------------- | ----- | --------------------------- | ------------------- |
| `mobile-clinic`  | token | Mobile clinic identifier    | `MOBILE-CLINIC-001` |
| `response-type`  | token | Emergency response type     | `outbreak`          |
| `location-type`  | token | Location type               | `village_square`    |
| `resource-level` | token | Resource availability level | `basic`             |

## API Operations

### Create Encounter

```http
POST /fhir/Encounter
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Encounter",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "Ambulatory"
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "participant": [
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "PPRF"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/practitioner-456"
      }
    }
  ],
  "period": {
    "start": "2023-12-01T09:00:00Z"
  }
}
```text

### Search Encounters

```http
GET /fhir/Encounter?patient=Patient/patient-123&date=2023-12-01
Accept: application/fhir+json
Authorization: Bearer {access_token}
```json

### Update Encounter Status

```http
PUT /fhir/Encounter/encounter-123
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Encounter",
  "id": "encounter-123",
  "status": "finished",
  "period": {
    "start": "2023-12-01T09:00:00Z",
    "end": "2023-12-01T09:30:00Z"
  }
}
```javascript

## Implementation Examples

### Mobile Clinic Workflow

```javascript
async function createMobileClinicEncounter(patientId, clinicData) {
  const encounter = {
    resourceType: 'Encounter',
    class: {
      system: 'https://zarishsphere.com/fhir/CodeSystem/encounter-class',
      code: 'MOBILE',
      display: 'Mobile Clinic',
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/mobile-clinic',
        extension: [
          {
            url: 'clinicType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/mobile-clinic-type',
                  code: 'outreach',
                  display: 'Community Outreach',
                },
              ],
            },
          },
          {
            url: 'vehicleId',
            valueString: clinicData.vehicleId,
          },
          {
            url: 'locationType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/location-type',
                  code: clinicData.locationType,
                  display: clinicData.locationDisplay,
                },
              ],
            },
          },
        ],
      },
    ],
    period: {
      start: new Date().toISOString(),
    },
  };

  return await createFHIRResource('Encounter', encounter);
}
```javascript

### Emergency Response Encounter

```javascript
async function createEmergencyEncounter(patientId, emergencyData) {
  const encounter = {
    resourceType: 'Encounter',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'EMER',
      display: 'Emergency',
    },
    status: 'in-progress',
    subject: {
      reference: `Patient/${patientId}`,
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/emergency-response',
        extension: [
          {
            url: 'responseType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/emergency-response-type',
                  code: emergencyData.responseType,
                  display: emergencyData.responseDisplay,
                },
              ],
            },
          },
          {
            url: 'responsePhase',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/emergency-phase',
                  code: 'triage',
                  display: 'Triage Phase',
                },
              ],
            },
          },
          {
            url: 'responseTeam',
            valueString: emergencyData.teamId,
          },
        ],
      },
    ],
    period: {
      start: new Date().toISOString(),
    },
  };

  return await createFHIRResource('Encounter', encounter);
}
```javascript

### Telehealth Encounter

```javascript
async function createTelehealthEncounter(patientId, practitionerId, platformData) {
  const encounter = {
    resourceType: 'Encounter',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'VR',
      display: 'Virtual',
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    participant: [
      {
        type: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                code: 'PPRF',
              },
            ],
          },
        ],
        individual: {
          reference: `Practitioner/${practitionerId}`,
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/telehealth-details',
        extension: [
          {
            url: 'platform',
            valueString: platformData.platform,
          },
          {
            url: 'sessionUrl',
            valueUri: platformData.sessionUrl,
          },
          {
            url: 'connectionQuality',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/connection-quality',
                  code: platformData.quality,
                  display: platformData.qualityDisplay,
                },
              ],
            },
          },
        ],
      },
    ],
    period: {
      start: new Date().toISOString(),
    },
  };

  return await createFHIRResource('Encounter', encounter);
}
```javascript

## Validation Rules

### Required Fields

- Subject (patient reference) is required
- Class must be specified
- At least one participant must be specified
- Period start time is required

### Business Rules

### Encounter Status Flow

```javascript
function validateEncounterStatusTransition(currentStatus, newStatus) {
  const validTransitions = {
    planned: ['arrived', 'cancelled', 'in-progress'],
    arrived: ['in-progress', 'cancelled'],
    'in-progress': ['onhold', 'finished', 'cancelled'],
    onhold: ['in-progress', 'cancelled'],
    finished: [],
    cancelled: [],
  };

  const allowedStatuses = validTransitions[currentStatus] || [];

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
  }
}
```javascript

### Participant Validation

```javascript
function validateEncounterParticipants(encounter) {
  if (!encounter.participant || encounter.participant.length === 0) {
    throw new Error('Encounter must have at least one participant');
  }

  const primaryPerformers = encounter.participant.filter((p) =>
    p.type.some((t) => t.coding.some((c) => c.code === 'PPRF'))
  );

  if (primaryPerformers.length === 0) {
    throw new Error('Encounter must have at least one primary performer');
  }
}
```json

## Error Handling

### Common Errors

| Error                       | Description                         | Resolution                                  |
| --------------------------- | ----------------------------------- | ------------------------------------------- |
| `INVALID_PATIENT`           | Patient reference not found         | Verify patient exists and is active         |
| `INVALID_PARTICIPANT`       | Practitioner not found              | Verify practitioner exists and is available |
| `TIME_CONFLICT`             | Time conflict with other encounters | Check practitioner availability             |
| `INVALID_STATUS_TRANSITION` | Invalid status change               | Follow proper status flow                   |

### Error Response Example

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-found",
      "details": {
        "text": "Patient with ID patient-123 not found"
      },
      "location": ["Encounter.subject.reference"]
    }
  ]
}
```javascript

## Performance Optimization

### Caching Strategy

- Active encounters cached for real-time access
- Completed encounters cached for 7 days
- Search results cached based on query complexity

### Batch Operations

```javascript
async function batchCreateEncounters(encounters) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'batch',
    entry: encounters.map((encounter) => ({
      fullUrl: `urn:uuid:${generateUUID()}`,
      resource: encounter,
      request: {
        method: 'POST',
        url: 'Encounter',
      },
    })),
  };

  return await fetch('/fhir/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bundle),
  });
}
```text

This comprehensive Encounter resource guide ensures proper implementation across all healthcare delivery models while maintaining humanitarian focus and low-resource optimization.
````
