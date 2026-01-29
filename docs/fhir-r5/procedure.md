---
title: 'Procedure Resource'
sidebar_label: 'Procedure'
description: 'Comprehensive guide to FHIR R5 Procedure resource implementation in ZARISH SPHERE'
keywords: [procedure, fhir r5, medical procedures, interventions, healthcare, zarish sphere]
---

# FHIR R5 Procedure Resource

## Overview

The Procedure resource represents actions performed on or for patients in ZARISH SPHERE. This implementation follows FHIR R5 specifications with humanitarian and low-resource optimizations, supporting various medical procedures including surgical interventions, diagnostic procedures, and emergency response procedures.

## Resource Structure

### Core Elements

````json
{
  "resourceType": "Procedure",
  "id": "procedure-123",
  "identifier": [
    {
      "use": "official",
      "system": "https://zarishsphere.com/procedure-id",
      "value": "PROC-2023-001234"
    }
  ],
  "status": "completed",
  "category": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "387713003",
        "display": "Surgical procedure"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "80146002",
        "display": "Appendectomy"
      }
    ],
    "text": "Appendectomy"
  },
  "subject": {
    "reference": "Patient/patient-123",
    "display": "John Smith"
  },
  "encounter": {
    "reference": "Encounter/encounter-456"
  },
  "performedDateTime": "2023-12-01T14:30:00Z",
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "112245001",
            "display": "Primary surgeon"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-789",
        "display": "Dr. Sarah Johnson"
      }
    }
  ],
  "location": {
    "reference": "Location/location-001",
    "display": "Operating Room 1"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "6142004",
          "display": "Acute appendicitis"
        }
      ]
    }
  ],
  "outcome": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "385669000",
        "display": "Successful"
      }
    ]
  }
}
```text

## ZARISH SPHERE Extensions

### Humanitarian Extensions

### Emergency Response Procedure

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/emergency-procedure",
      "extension": [
        {
          "url": "emergencyType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/emergency-procedure-type",
                "code": "trauma",
                "display": "Trauma Emergency"
              }
            ]
          }
        },
        {
          "url": "responseTeam",
          "valueString": "Rapid Response Team A"
        },
        {
          "url": "fieldProcedure",
          "valueBoolean": true
        },
        {
          "url": "equipmentUsed",
          "valueString": "Basic surgical kit, portable anesthesia"
        }
      ]
    }
  ]
}
```text

### Mobile Clinic Procedure

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/mobile-clinic-procedure",
      "extension": [
        {
          "url": "mobileUnit",
          "valueString": "MOBILE-CLINIC-001"
        },
        {
          "url": "procedureLocation",
          "valueString": "Village Square, Northern District"
        },
        {
          "url": "limitedResources",
          "valueBoolean": true
        },
        {
          "url": "followUpRequired",
          "valueBoolean": true
        }
      ]
    }
  ]
}
```text

### Low-Resource Optimizations

### Resource Constraints

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/resource-constraints",
      "extension": [
        {
          "url": "equipmentAvailability",
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
          "url": "sterilizationMethod",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/sterilization-method",
                "code": "autoclave",
                "display": "Autoclave Sterilization"
              }
            ]
          }
        },
        {
          "url": "anesthesiaType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/anesthesia-type",
                "code": "local",
                "display": "Local Anesthesia"
              }
            ]
          }
        }
      ]
    }
  ]
}
```javascript

## Procedure Categories

### Standard FHIR Categories

| Category        | Code      | Description            | Examples                       |
| --------------- | --------- | ---------------------- | ------------------------------ |
| **Surgical**    | 387713003 | Surgical procedures    | Appendectomy, cesarean section |
| **Diagnostic**  | 103693007 | Diagnostic procedures  | Biopsy, endoscopy, imaging     |
| **Therapeutic** | 277132007 | Therapeutic procedures | Chemotherapy, dialysis         |
| **Preventive**  | 410606002 | Preventive procedures  | Vaccination, screening         |
| **Emergency**   | 386053000 | Emergency procedures   | CPR, emergency surgery         |
| **Obstetric**   | 386637004 | Obstetric procedures   | Delivery, prenatal care        |

### ZARISH SPHERE Custom Categories

| Category          | Code          | Description                     | Examples                                 |
| ----------------- | ------------- | ------------------------------- | ---------------------------------------- |
| **Field Surgery** | field-surgery | Field surgical procedures       | Emergency appendectomy, trauma surgery   |
| **Mobile Clinic** | mobile-clinic | Mobile clinic procedures        | Minor surgeries, wound care              |
| **Traditional**   | traditional   | Traditional medicine procedures | Traditional birth, herbal treatments     |
| **Nutritional**   | nutritional   | Nutritional interventions       | Malnutrition treatment, feeding programs |
| **Mental Health** | mental-health | Mental health procedures        | Counseling, group therapy                |

## Emergency Procedures

### Trauma Response

```json
{
  "resourceType": "Procedure",
  "status": "completed",
  "category": {
    "coding": [
      {
        "system": "https://zarishsphere.com/fhir/CodeSystem/procedure-category",
        "code": "emergency-trauma",
        "display": "Emergency Trauma Procedure"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "80146002",
        "display": "Emergency wound debridement"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "performedDateTime": "2023-12-01T14:30:00Z",
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "224565004",
            "display": "Emergency physician"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/emergency-physician-001",
        "display": "Dr. Michael Chen"
      }
    }
  ],
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/emergency-procedure",
      "extension": [
        {
          "url": "emergencyType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/emergency-procedure-type",
                "code": "trauma",
                "display": "Trauma Emergency"
              }
            ]
          }
        },
        {
          "url": "responseTeam",
          "valueString": "Rapid Response Team A"
        },
        {
          "url": "fieldProcedure",
          "valueBoolean": true
        },
        {
          "url": "equipmentUsed",
          "valueString": "Basic surgical kit, portable anesthesia"
        }
      ]
    }
  ]
}
```javascript

### Outbreak Response Procedures

```json
{
  "resourceType": "Procedure",
  "status": "completed",
  "category": {
    "coding": [
      {
        "system": "https://zarishsphere.com/fhir/CodeSystem/procedure-category",
        "code": "outbreak-response",
        "display": "Outbreak Response Procedure"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "11429006",
        "display": "Vaccination"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "performedDateTime": "2023-12-01T10:30:00Z",
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "41672002",
            "display": "Vaccinator"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/chw-001",
        "display": "Community Health Worker"
      }
    }
  ],
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/outbreak-procedure",
      "extension": [
        {
          "url": "outbreakId",
          "valueString": "OUTBREAK-2023-001"
        },
        {
          "url": "vaccineType",
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
          "url": "campaignId",
          "valueString": "CAMPAIGN-001"
        }
      ]
    }
  ]
}
```typescript

## Search Parameters

### Standard FHIR Parameters

| Parameter    | Type      | Description                | Example                         |
| ------------ | --------- | -------------------------- | ------------------------------- |
| `_id`        | token     | Logical id of the resource | `procedure-123`                 |
| `identifier` | token     | Procedure identifiers      | `PROC-2023-001234`              |
| `patient`    | reference | Patient reference          | `Patient/patient-123`           |
| `category`   | token     | Procedure category         | `387713003`                     |
| `status`     | token     | Procedure status           | `completed`                     |
| `code`       | token     | Procedure code             | `80146002`                      |
| `date`       | date      | Procedure date             | `2023-12-01`                    |
| `performer`  | reference | Performer reference        | `Practitioner/practitioner-789` |

### ZARISH SPHERE Custom Parameters

| Parameter              | Type  | Description                | Example  |
| ---------------------- | ----- | -------------------------- | -------- |
| `emergency-type`       | token | Emergency procedure type   | `trauma` |
| `mobile-clinic`        | token | Mobile clinic procedure    | `true`   |
| `field-procedure`      | token | Field procedure status     | `true`   |
| `resource-constraints` | token | Resource constraints       | `basic`  |
| `outbreak-related`     | token | Outbreak related procedure | `true`   |

## API Operations

### Create Procedure

```http
POST /fhir/Procedure
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Procedure",
  "status": "completed",
  "category": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "387713003",
        "display": "Surgical procedure"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "80146002",
        "display": "Appendectomy"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "performedDateTime": "2023-12-01T14:30:00Z",
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "112245001",
            "display": "Primary surgeon"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-789"
      }
    }
  ]
}
```text

### Search Procedures

```http
GET /fhir/Procedure?patient=Patient/patient-123&status=completed
Accept: application/fhir+json
Authorization: Bearer {access_token}
```json

### Update Procedure

```http
PUT /fhir/Procedure/procedure-123
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Procedure",
  "id": "procedure-123",
  "status": "completed",
  "outcome": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "385669000",
        "display": "Successful"
      }
    ]
  }
}
```javascript

## Implementation Examples

### Emergency Trauma Procedure

```javascript
async function createEmergencyTraumaProcedure(procedureData) {
  const procedure = {
    resourceType: 'Procedure',
    status: 'in-progress',
    category: {
      coding: [
        {
          system: 'https://zarishsphere.com/fhir/CodeSystem/procedure-category',
          code: 'emergency-trauma',
          display: 'Emergency Trauma Procedure',
        },
      ],
    },
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: procedureData.procedureCode,
          display: procedureData.procedureDisplay,
        },
      ],
    },
    subject: {
      reference: `Patient/${procedureData.patientId}`,
    },
    performedDateTime: new Date().toISOString(),
    performer: [
      {
        function: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '224565004',
              display: 'Emergency physician',
            },
          ],
        },
        actor: {
          reference: `Practitioner/${procedureData.performerId}`,
          display: procedureData.performerName,
        },
      },
    ],
    location: {
      reference: `Location/${procedureData.locationId}`,
      display: procedureData.locationName,
    },
    reasonCode: [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: procedureData.reasonCode,
            display: procedureData.reasonDisplay,
          },
        ],
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/emergency-procedure',
        extension: [
          {
            url: 'emergencyType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/emergency-procedure-type',
                  code: procedureData.emergencyType,
                  display: procedureData.emergencyTypeDisplay,
                },
              ],
            },
          },
          {
            url: 'responseTeam',
            valueString: procedureData.responseTeam,
          },
          {
            url: 'fieldProcedure',
            valueBoolean: procedureData.fieldProcedure,
          },
          {
            url: 'equipmentUsed',
            valueString: procedureData.equipmentUsed,
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Procedure', procedure);
}
```javascript

### Mobile Clinic Procedure

```javascript
async function createMobileClinicProcedure(procedureData) {
  const procedure = {
    resourceType: 'Procedure',
    status: 'completed',
    category: {
      coding: [
        {
          system: 'https://zarishsphere.com/fhir/CodeSystem/procedure-category',
          code: 'mobile-clinic',
          display: 'Mobile Clinic Procedure',
        },
      ],
    },
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: procedureData.procedureCode,
          display: procedureData.procedureDisplay,
        },
      ],
    },
    subject: {
      reference: `Patient/${procedureData.patientId}`,
    },
    performedDateTime: procedureData.performedDate,
    performer: [
      {
        function: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '116154003',
              display: 'General practitioner',
            },
          ],
        },
        actor: {
          reference: `Practitioner/${procedureData.performerId}`,
          display: procedureData.performerName,
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/mobile-clinic-procedure',
        extension: [
          {
            url: 'mobileUnit',
            valueString: procedureData.mobileUnit,
          },
          {
            url: 'procedureLocation',
            valueString: procedureData.procedureLocation,
          },
          {
            url: 'limitedResources',
            valueBoolean: true,
          },
          {
            url: 'followUpRequired',
            valueBoolean: procedureData.followUpRequired,
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Procedure', procedure);
}
```javascript

### Outbreak Response Procedure

```javascript
async function createOutbreakResponseProcedure(procedureData) {
  const procedure = {
    resourceType: 'Procedure',
    status: 'completed',
    category: {
      coding: [
        {
          system: 'https://zarishsphere.com/fhir/CodeSystem/procedure-category',
          code: 'outbreak-response',
          display: 'Outbreak Response Procedure',
        },
      ],
    },
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: procedureData.procedureCode,
          display: procedureData.procedureDisplay,
        },
      ],
    },
    subject: {
      reference: `Patient/${procedureData.patientId}`,
    },
    performedDateTime: procedureData.performedDate,
    performer: [
      {
        function: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '41672002',
              display: 'Vaccinator',
            },
          ],
        },
        actor: {
          reference: `Practitioner/${procedureData.performerId}`,
          display: procedureData.performerName,
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/outbreak-procedure',
        extension: [
          {
            url: 'outbreakId',
            valueString: procedureData.outbreakId,
          },
          {
            url: 'vaccineType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/vaccine-type',
                  code: procedureData.vaccineType,
                  display: procedureData.vaccineTypeDisplay,
                },
              ],
            },
          },
          {
            url: 'campaignId',
            valueString: procedureData.campaignId,
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Procedure', procedure);
}
```javascript

## Validation Rules

### Required Fields

- Subject (patient reference) is required
- Status must be specified
- At least one category must be specified
- Code must be specified
- Performed date/time is required for completed procedures

### Business Rules

### Status Validation

```javascript
function validateProcedureStatus(procedure) {
  const validStatuses = [
    'preparation',
    'in-progress',
    'not-done',
    'on-hold',
    'stopped',
    'completed',
    'entered-in-error',
    'unknown',
  ];

  if (!validStatuses.includes(procedure.status)) {
    throw new Error(`Invalid procedure status: ${procedure.status}`);
  }

  // Check for invalid status combinations
  if (procedure.status === 'completed' && !procedure.performedDateTime) {
    throw new Error('Completed procedures must have performed date/time');
  }
}
```javascript

### Performer Validation

```javascript
function validateProcedurePerformers(procedure) {
  if (!procedure.performer || procedure.performer.length === 0) {
    throw new Error('Procedure must have at least one performer');
  }

  for (const performer of procedure.performer) {
    if (!performer.actor || !performer.actor.reference) {
      throw new Error('Each performer must have an actor reference');
    }
  }
}
```javascript

### Emergency Procedure Validation

```javascript
function validateEmergencyProcedure(procedure) {
  const emergencyExtension = procedure.extension?.find(
    (ext) => ext.url === 'https://zarishsphere.com/fhir/StructureDefinition/emergency-procedure'
  );

  if (emergencyExtension) {
    const emergencyType = emergencyExtension.extension?.find((ext) => ext.url === 'emergencyType');

    if (!emergencyType) {
      throw new Error('Emergency procedures must specify emergency type');
    }

    const responseTeam = emergencyExtension.extension?.find((ext) => ext.url === 'responseTeam');

    if (!responseTeam) {
      throw new Error('Emergency procedures must specify response team');
    }
  }
}
```json

## Error Handling

### Common Errors

| Error                    | Description                   | Resolution                                |
| ------------------------ | ----------------------------- | ----------------------------------------- |
| `INVALID_PATIENT`        | Patient reference not found   | Verify patient exists and is active       |
| `INVALID_CODE`           | Procedure code not recognized | Use standard SNOMED codes or custom codes |
| `INVALID_STATUS`         | Procedure status not valid    | Use standard FHIR status codes            |
| `MISSING_PERFORMER`      | No performer specified        | Ensure at least one performer is provided |
| `MISSING_REQUIRED_FIELD` | Required field is missing     | Ensure all required fields are provided   |

### Error Response Example

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Procedure must have at least one performer"
      },
      "location": ["Procedure.performer"]
    }
  ]
}
```javascript

## Performance Optimization

### Caching Strategy

- Completed procedures cached for 24 hours
- Emergency procedures cached for real-time access
- Search results cached based on query complexity
- Mobile clinic procedures cached for field access

### Batch Operations

```javascript
async function batchCreateProcedures(procedures) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'batch',
    entry: procedures.map((procedure) => ({
      fullUrl: `urn:uuid:${generateUUID()}`,
      resource: procedure,
      request: {
        method: 'POST',
        url: 'Procedure',
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

This comprehensive Procedure resource guide ensures proper implementation across all medical procedure scenarios while maintaining humanitarian focus and low-resource optimization.
````
