---
title: 'Condition Resource'
sidebar_label: 'Condition'
description: 'Comprehensive guide to FHIR R5 Condition resource implementation in ZARISH SPHERE'
keywords: [condition, fhir r5, diagnosis, health problems, healthcare, zarish sphere]
---

# FHIR R5 Condition Resource

## Overview

The Condition resource represents health problems, diagnoses, and other health issues in ZARISH SPHERE. This implementation follows FHIR R5 specifications with humanitarian and low-resource optimizations, supporting various clinical scenarios including disease surveillance, outbreak monitoring, and chronic disease management.

## Resource Structure

### Core Elements

````json
{
  "resourceType": "Condition",
  "id": "condition-123",
  "identifier": [
    {
      "use": "official",
      "system": "https://zarishsphere.com/condition-id",
      "value": "COND-2023-001234"
    }
  ],
  "clinicalStatus": "active",
  "verificationStatus": "confirmed",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/condition-category",
          "code": "encounter-diagnosis",
          "display": "Encounter Diagnosis"
        }
      ]
    }
  ],
  "severity": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "24484000",
        "display": "Severe"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "195962001",
        "display": "Asthma"
      }
    ],
    "text": "Asthma"
  },
  "subject": {
    "reference": "Patient/patient-123",
    "display": "John Smith"
  },
  "encounter": {
    "reference": "Encounter/encounter-456"
  },
  "onsetDateTime": "2023-12-01T10:30:00Z",
  "recordedDate": "2023-12-01T10:35:00Z",
  "asserter": {
    "reference": "Practitioner/practitioner-789",
    "display": "Dr. Sarah Johnson"
  }
}
```text

## ZARISH SPHERE Extensions

### Humanitarian Extensions

### Outbreak Related

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/outbreak-related",
      "extension": [
        {
          "url": "isOutbreakRelated",
          "valueBoolean": true
        },
        {
          "url": "outbreakType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/outbreak-type",
                "code": "cholera",
                "display": "Cholera Outbreak"
              }
            ]
          }
        },
        {
          "url": "outbreakId",
          "valueString": "OUTBREAK-2023-001"
        },
        {
          "url": "reportingDate",
          "valueDateTime": "2023-12-01T08:00:00Z"
        }
      ]
    }
  ]
}
```text

### Displacement Impact

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/displacement-impact",
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
          "url": "displacementDate",
          "valueDate": "2023-03-15"
        },
        {
          "url": "accessToCare",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/access-to-care",
                "code": "limited",
                "display": "Limited Access to Care"
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

### Resource Constraints

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/resource-constraints",
      "extension": [
        {
          "url": "diagnosticCapability",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/diagnostic-capability",
                "code": "basic",
                "display": "Basic Diagnostic Capability"
              }
            ]
          }
        },
        {
          "url": "treatmentAvailability",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/treatment-availability",
                "code": "limited",
                "display": "Limited Treatment Options"
              }
            ]
          }
        },
        {
          "url": "followUpRequired",
          "valueBoolean": true
        }
      ]
    }
  ]
}
```json

## Condition Categories

### Standard FHIR Categories

| Category                | Code                | Description               | Examples                            |
| ----------------------- | ------------------- | ------------------------- | ----------------------------------- |
| **Problem List Item**   | problem-list-item   | Problems in problem list  | Chronic conditions, health concerns |
| **Encounter Diagnosis** | encounter-diagnosis | Diagnosis from encounter  | Acute conditions, visit diagnoses   |
| **Health Concern**      | health-concern      | Health concerns           | Risk factors, preventive care       |
| **Symptom**             | symptom             | Patient-reported symptoms | Pain, fatigue, nausea               |
| **Finding**             | finding             | Clinical findings         | Lab results, physical exam findings |

### ZARISH SPHERE Custom Categories

| Category          | Code          | Description               | Examples                           |
| ----------------- | ------------- | ------------------------- | ---------------------------------- |
| **Public Health** | public-health | Public health concerns    | Notifiable diseases, outbreaks     |
| **Environmental** | environmental | Environmental health      | Heat stroke, water-borne diseases  |
| **Nutritional**   | nutritional   | Nutritional conditions    | Malnutrition, vitamin deficiencies |
| **Mental Health** | mental-health | Mental health conditions  | Depression, anxiety, PTSD          |
| **Injury**        | injury        | Injury-related conditions | Trauma, fractures, burns           |

## Disease Surveillance

### Notifiable Conditions

```json
{
  "resourceType": "Condition",
  "clinicalStatus": "active",
  "verificationStatus": "confirmed",
  "category": [
    {
      "coding": [
        {
          "system": "https://zarishsphere.com/fhir/CodeSystem/condition-category",
          "code": "notifiable",
          "display": "Notifiable Disease"
        }
      ]
    }
  ],
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
    "reference": "Patient/patient-123"
  },
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/notifiable-disease",
      "extension": [
        {
          "url": "isNotifiable",
          "valueBoolean": true
        },
        {
          "url": "reportingRequired",
          "valueBoolean": true
        },
        {
          "url": "reportingAuthority",
          "valueReference": {
            "reference": "Organization/health-ministry",
            "display": "Ministry of Health"
          }
        },
        {
          "url": "reportingDeadline",
          "valueDuration": {
            "value": 24,
            "unit": "hours",
            "system": "http://unitsofmeasure.org",
            "code": "h"
          }
        }
      ]
    }
  ]
}
```json

### Outbreak Monitoring

```json
{
  "resourceType": "Condition",
  "clinicalStatus": "active",
  "verificationStatus": "confirmed",
  "category": [
    {
      "coding": [
        {
          "system": "https://zarishsphere.com/fhir/CodeSystem/condition-category",
          "code": "outbreak",
          "display": "Outbreak Related"
        }
      ]
    }
  ],
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
    "reference": "Patient/patient-123"
  },
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/outbreak-monitoring",
      "extension": [
        {
          "url": "outbreakId",
          "valueString": "OUTBREAK-2023-001"
        },
        {
          "url": "clusterId",
          "valueString": "CLUSTER-001"
        },
        {
          "url": "caseNumber",
          "valueInteger": 15
        },
        {
          "url": "investigationStatus",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/investigation-status",
                "code": "in_progress",
                "display": "Investigation In Progress"
              }
            ]
          }
        }
      ]
    }
  ]
}
```json

## Search Parameters

### Standard FHIR Parameters

| Parameter             | Type      | Description                | Example               |
| --------------------- | --------- | -------------------------- | --------------------- |
| `_id`                 | token     | Logical id of the resource | `condition-123`       |
| `identifier`          | token     | Condition identifiers      | `COND-2023-001234`    |
| `patient`             | reference | Patient reference          | `Patient/patient-123` |
| `category`            | token     | Condition category         | `encounter-diagnosis` |
| `clinical-status`     | token     | Clinical status            | `active`              |
| `verification-status` | token     | Verification status        | `confirmed`           |
| `code`                | token     | Condition code             | `195962001`           |
| `onset-date`          | date      | Onset date                 | `2023-12-01`          |

### ZARISH SPHERE Custom Parameters

| Parameter              | Type  | Description               | Example       |
| ---------------------- | ----- | ------------------------- | ------------- |
| `outbreak-related`     | token | Outbreak related status   | `true`        |
| `displacement-status`  | token | Displacement status       | `refugee`     |
| `notifiable`           | token | Notifiable disease status | `true`        |
| `resource-constraints` | token | Resource constraints      | `limited`     |
| `environmental-factor` | token | Environmental factor      | `heat-stroke` |

## API Operations

### Create Condition

```http
POST /fhir/Condition
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Condition",
  "clinicalStatus": "active",
  "verificationStatus": "confirmed",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/condition-category",
          "code": "encounter-diagnosis",
          "display": "Encounter Diagnosis"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "195962001",
        "display": "Asthma"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "encounter": {
    "reference": "Encounter/encounter-456"
  },
  "onsetDateTime": "2023-12-01T10:30:00Z"
}
```text

### Search Conditions

```http
GET /fhir/Condition?patient=Patient/patient-123&clinical-status=active
Accept: application/fhir+json
Authorization: Bearer {access_token}
```json

### Update Condition

```http
PUT /fhir/Condition/condition-123
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Condition",
  "id": "condition-123",
  "clinicalStatus": "resolved",
  "verificationStatus": "confirmed",
  "abatementDateTime": "2023-12-15T14:30:00Z"
}
```javascript

## Implementation Examples

### Disease Surveillance Reporting

```javascript
async function reportNotifiableCondition(conditionData) {
  const condition = {
    resourceType: 'Condition',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: [
      {
        coding: [
          {
            system: 'https://zarishsphere.com/fhir/CodeSystem/condition-category',
            code: 'notifiable',
            display: 'Notifiable Disease',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: conditionData.diseaseCode,
          display: conditionData.diseaseDisplay,
        },
      ],
    },
    subject: {
      reference: `Patient/${conditionData.patientId}`,
    },
    onsetDateTime: conditionData.onsetDate,
    recordedDate: new Date().toISOString(),
    asserter: {
      reference: `Practitioner/${conditionData.asserterId}`,
      display: conditionData.asserterName,
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/notifiable-disease',
        extension: [
          {
            url: 'isNotifiable',
            valueBoolean: true,
          },
          {
            url: 'reportingRequired',
            valueBoolean: true,
          },
          {
            url: 'reportingAuthority',
            valueReference: {
              reference: 'Organization/health-ministry',
              display: 'Ministry of Health',
            },
          },
          {
            url: 'reportingDeadline',
            valueDuration: {
              value: 24,
              unit: 'hours',
              system: 'http://unitsofmeasure.org',
              code: 'h',
            },
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Condition', condition);
}
```javascript

### Outbreak Case Registration

```javascript
async function registerOutbreakCase(caseData) {
  const condition = {
    resourceType: 'Condition',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: [
      {
        coding: [
          {
            system: 'https://zarishsphere.com/fhir/CodeSystem/condition-category',
            code: 'outbreak',
            display: 'Outbreak Related',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: caseData.diseaseCode,
          display: caseData.diseaseDisplay,
        },
      ],
    },
    subject: {
      reference: `Patient/${caseData.patientId}`,
    },
    onsetDateTime: caseData.onsetDate,
    recordedDate: new Date().toISOString(),
    asserter: {
      reference: `Practitioner/${caseData.asserterId}`,
      display: caseData.asserterName,
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/outbreak-monitoring',
        extension: [
          {
            url: 'outbreakId',
            valueString: caseData.outbreakId,
          },
          {
            url: 'clusterId',
            valueString: caseData.clusterId,
          },
          {
            url: 'caseNumber',
            valueInteger: caseData.caseNumber,
          },
          {
            url: 'investigationStatus',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/investigation-status',
                  code: 'in_progress',
                  display: 'Investigation In Progress',
                },
              ],
            },
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Condition', condition);
}
```javascript

### Displacement Impact Assessment

```javascript
async function createDisplacementImpactCondition(conditionData) {
  const condition = {
    resourceType: 'Condition',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-category',
            code: 'health-concern',
            display: 'Health Concern',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'https://zarishsphere.com/fhir/CodeSystem/displacement-health-issues',
          code: conditionData.conditionCode,
          display: conditionData.conditionDisplay,
        },
      ],
    },
    subject: {
      reference: `Patient/${conditionData.patientId}`,
    },
    onsetDateTime: conditionData.onsetDate,
    recordedDate: new Date().toISOString(),
    asserter: {
      reference: `Practitioner/${conditionData.asserterId}`,
      display: conditionData.asserterName,
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/displacement-impact',
        extension: [
          {
            url: 'displacementStatus',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/displacement-status',
                  code: conditionData.displacementStatus,
                  display: conditionData.displacementDisplay,
                },
              ],
            },
          },
          {
            url: 'campLocation',
            valueString: conditionData.campLocation,
          },
          {
            url: 'displacementDate',
            valueDate: conditionData.displacementDate,
          },
          {
            url: 'accessToCare',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/access-to-care',
                  code: conditionData.accessToCare,
                  display: conditionData.accessToCareDisplay,
                },
              ],
            },
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Condition', condition);
}
```javascript

### Resource Constraint Documentation

```javascript
async function createResourceConstraintCondition(conditionData) {
  const condition = {
    resourceType: 'Condition',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-category',
            code: 'problem-list-item',
            display: 'Problem List Item',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: conditionData.conditionCode,
          display: conditionData.conditionDisplay,
        },
      ],
    },
    subject: {
      reference: `Patient/${conditionData.patientId}`,
    },
    onsetDateTime: conditionData.onsetDate,
    recordedDate: new Date().toISOString(),
    asserter: {
      reference: `Practitioner/${conditionData.asserterId}`,
      display: conditionData.asserterName,
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/resource-constraints',
        extension: [
          {
            url: 'diagnosticCapability',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/diagnostic-capability',
                  code: conditionData.diagnosticCapability,
                  display: conditionData.diagnosticCapabilityDisplay,
                },
              ],
            },
          },
          {
            url: 'treatmentAvailability',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/treatment-availability',
                  code: conditionData.treatmentAvailability,
                  display: conditionData.treatmentAvailabilityDisplay,
                },
              ],
            },
          },
          {
            url: 'followUpRequired',
            valueBoolean: conditionData.followUpRequired,
          },
          {
            url: 'referralNeeded',
            valueBoolean: conditionData.referralNeeded,
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Condition', condition);
}
```javascript

## Validation Rules

### Required Fields

- Subject (patient reference) is required
- Clinical status must be specified
- Verification status must be specified
- At least one category must be specified
- Code must be specified

### Business Rules

### Clinical Status Validation

```javascript
function validateClinicalStatus(condition) {
  const validStatuses = ['active', 'recurrence', 'relapse', 'inactive', 'resolved', 'remission'];

  if (!validStatuses.includes(condition.clinicalStatus)) {
    throw new Error(`Invalid clinical status: ${condition.clinicalStatus}`);
  }

  // Check for invalid status transitions
  if (condition.abatementDateTime && condition.clinicalStatus !== 'resolved') {
    throw new Error('Abatement date can only be set for resolved conditions');
  }
}
```javascript

### Verification Status Validation

```javascript
function validateVerificationStatus(condition) {
  const validStatuses = [
    'unconfirmed',
    'provisional',
    'differential',
    'confirmed',
    'refuted',
    'entered-in-error',
  ];

  if (!validStatuses.includes(condition.verificationStatus)) {
    throw new Error(`Invalid verification status: ${condition.verificationStatus}`);
  }
}
```javascript

### Outbreak Extension Validation

```javascript
function validateOutbreakExtension(condition) {
  const outbreakExtension = condition.extension?.find(
    (ext) => ext.url === 'https://zarishsphere.com/fhir/StructureDefinition/outbreak-related'
  );

  if (outbreakExtension) {
    const isOutbreakRelated = outbreakExtension.extension?.find(
      (ext) => ext.url === 'isOutbreakRelated'
    );

    if (isOutbreakRelated && !isOutbreakRelated.valueBoolean) {
      throw new Error('Outbreak related flag must be true if outbreak extension is present');
    }

    const outbreakType = outbreakExtension.extension?.find((ext) => ext.url === 'outbreakType');

    if (isOutbreakRelated && !outbreakType) {
      throw new Error('Outbreak related conditions must specify outbreak type');
    }
  }
}
```json

## Error Handling

### Common Errors

| Error                    | Description                               | Resolution                                |
| ------------------------ | ----------------------------------------- | ----------------------------------------- |
| `INVALID_PATIENT`        | Patient reference not found               | Verify patient exists and is active       |
| `INVALID_CODE`           | Condition code not recognized             | Use standard SNOMED codes or custom codes |
| `INVALID_STATUS`         | Clinical or verification status not valid | Use standard FHIR status codes            |
| `MISSING_REQUIRED_FIELD` | Required field is missing                 | Ensure all required fields are provided   |

### Error Response Example

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Condition must have at least one category"
      },
      "location": ["Condition.category"]
    }
  ]
}
```javascript

## Performance Optimization

### Caching Strategy

- Active conditions cached for 24 hours
- Disease surveillance data cached for real-time access
- Search results cached based on query complexity
- Outbreak monitoring data cached for real-time access

### Batch Operations

```javascript
async function batchCreateConditions(conditions) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'batch',
    entry: conditions.map((condition) => ({
      fullUrl: `urn:uuid:${generateUUID()}`,
      resource: condition,
      request: {
        method: 'POST',
        url: 'Condition',
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

This comprehensive Condition resource guide ensures proper implementation across all healthcare condition scenarios while maintaining humanitarian focus and low-resource optimization.
````
