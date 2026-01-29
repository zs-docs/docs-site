---
title: 'Observation Resource'
sidebar_label: 'Observation'
description: 'Comprehensive guide to FHIR R5 Observation resource implementation in ZARISH SPHERE'
keywords: [observation, fhir r5, vital signs, measurements, healthcare, zarish sphere]
---

# FHIR R5 Observation Resource

## Overview

The Observation resource represents measurements, observations, and assessments in ZARISH SPHERE. This implementation follows FHIR R5 specifications with humanitarian and low-resource optimizations, supporting various healthcare scenarios including vital signs monitoring, environmental health tracking, and point-of-care testing.

## Resource Structure

### Core Elements

````json
{
  "resourceType": "Observation",
  "id": "observation-123",
  "identifier": [
    {
      "use": "official",
      "system": "https://zarishsphere.com/observation-id",
      "value": "OBS-2023-001234"
    }
  ],
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
    ],
    "text": "Height"
  },
  "subject": {
    "reference": "Patient/patient-123",
    "display": "John Smith"
  },
  "effectiveDateTime": "2023-12-01T14:30:00Z",
  "issued": "2023-12-01T14:35:00Z",
  "valueQuantity": {
    "value": 175,
    "unit": "cm",
    "system": "http://unitsofmeasure.org",
    "code": "cm"
  },
  "interpretation": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          "code": "N",
          "display": "Normal"
        }
      ]
    }
  ],
  "referenceRange": [
    {
      "low": {
        "value": 150,
        "unit": "cm",
        "system": "http://unitsofmeasure.org",
        "code": "cm"
      },
      "high": {
        "value": 200,
        "unit": "cm",
        "system": "http://unitsofmeasure.org",
        "code": "cm"
      },
      "text": "Normal height range for adult male"
    }
  ]
}
```text

## ZARISH SPHERE Extensions

### Environmental Context

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/environmental-context",
      "extension": [
        {
          "url": "temperature",
          "valueQuantity": {
            "value": 35.2,
            "unit": "°C",
            "system": "http://unitsofmeasure.org",
            "code": "Cel"
          }
        },
        {
          "url": "humidity",
          "valueQuantity": {
            "value": 85,
            "unit": "%",
            "system": "http://unitsofmeasure.org",
            "code": "%"
          }
        },
        {
          "url": "locationType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/location-type",
                "code": "tent",
                "display": "Emergency Shelter Tent"
              }
            ]
          }
        },
        {
          "url": "airQuality",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/air-quality",
                "code": "moderate",
                "display": "Moderate Air Quality"
              }
            ]
          }
        }
      ]
    }
  ]
}
```text

### Point-of-Care Testing

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/point-of-care-test",
      "extension": [
        {
          "url": "testDevice",
          "valueReference": {
            "reference": "Device/rapid-test-001",
            "display": "Rapid Diagnostic Test Kit"
          }
        },
        {
          "url": "testType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/point-of-care-test-type",
                "code": "malaria_rdt",
                "display": "Malaria Rapid Diagnostic Test"
              }
            ]
          }
        },
        {
          "url": "testOperator",
          "valueReference": {
            "reference": "Practitioner/health-worker-123",
            "display": "Community Health Worker"
          }
        },
        {
          "url": "testConditions",
          "valueString": "Stored at room temperature, used within expiration date"
        }
      ]
    }
  ]
}
```text

### Low-Resource Optimizations

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/resource-constraints",
      "extension": [
        {
          "url": "equipmentUsed",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/equipment-type",
                "code": "basic_stethoscope",
                "display": "Basic Stethoscope"
              }
            ]
          }
        },
        {
          "url": "powerSource",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/power-source",
                "code": "battery",
                "display": "Battery Powered"
              }
            ]
          }
        },
        {
          "url": "connectivity",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/connectivity",
                "code": "offline",
                "display": "Offline Recording"
              }
            ]
          }
        }
      ]
    }
  ]
}
```json

## Observation Categories

### Standard FHIR Categories

| Category           | Code           | Description             | Examples                                |
| ------------------ | -------------- | ----------------------- | --------------------------------------- |
| **vital-signs**    | Vital Signs    | Patient vital signs     | Blood pressure, heart rate, temperature |
| **laboratory**     | Laboratory     | Lab test results        | Blood chemistry, microbiology           |
| **imaging**        | Imaging        | Imaging studies         | X-rays, ultrasounds, CT scans           |
| **procedure**      | Procedure      | Procedure outcomes      | Surgery results, treatment outcomes     |
| **survey**         | Survey         | Questionnaire responses | Health assessments, screenings          |
| **exam**           | Exam           | Physical examination    | Clinical examination findings           |
| **social-history** | Social History | Social determinants     | Living conditions, lifestyle factors    |
| **therapy**        | Therapy        | Therapy outcomes        | Physical therapy, rehabilitation        |

### ZARISH SPHERE Custom Categories

| Category          | Code          | Description            | Examples                                  |
| ----------------- | ------------- | ---------------------- | ----------------------------------------- |
| **environmental** | Environmental | Environmental health   | Air quality, water quality, temperature   |
| **nutrition**     | Nutrition     | Nutritional status     | BMI, malnutrition screening               |
| **public-health** | Public Health | Population health      | Disease surveillance, outbreak monitoring |
| **humanitarian**  | Humanitarian  | Humanitarian response  | Displacement impact, emergency needs      |
| **mobile-clinic** | Mobile Clinic | Mobile health services | Outreach assessments, field diagnostics   |

## Vital Signs Implementation

### Blood Pressure

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
    "reference": "Patient/patient-123"
  },
  "effectiveDateTime": "2023-12-01T14:30:00Z",
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
        "value": 118,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      },
      "interpretation": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
              "code": "N",
              "display": "Normal"
            }
          ]
        }
      ]
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
        "value": 76,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      },
      "interpretation": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
              "code": "N",
              "display": "Normal"
            }
          ]
        }
      ]
    }
  ]
}
```json

### Temperature

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
        "code": "8310-5",
        "display": "Body temperature"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "effectiveDateTime": "2023-12-01T14:30:00Z",
  "valueQuantity": {
    "value": 37.2,
    "unit": "°C",
    "system": "http://unitsofmeasure.org",
    "code": "Cel"
  },
  "interpretation": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          "code": "N",
          "display": "Normal"
        }
      ]
    }
  ],
  "referenceRange": [
    {
      "low": {
        "value": 36.1,
        "unit": "°C",
        "system": "http://unitsofmeasure.org",
        "code": "Cel"
      },
      "high": {
        "value": 37.2,
        "unit": "°C",
        "system": "http://unitsofmeasure.org",
        "code": "Cel"
      },
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
            "code": "normal",
            "display": "Normal Range"
          }
        ]
      }
    }
  ]
}
```json

## Search Parameters

### Standard FHIR Parameters

| Parameter    | Type      | Description                | Example               |
| ------------ | --------- | -------------------------- | --------------------- |
| `_id`        | token     | Logical id of the resource | `observation-123`     |
| `identifier` | token     | Observation identifiers    | `OBS-2023-001234`     |
| `patient`    | reference | Patient reference          | `Patient/patient-123` |
| `date`       | date      | Observation date           | `2023-12-01`          |
| `status`     | token     | Observation status         | `final`               |
| `category`   | token     | Observation category       | `vital-signs`         |
| `code`       | token     | Observation code           | `8302-2`              |

### ZARISH SPHERE Custom Parameters

| Parameter            | Type      | Description               | Example                 |
| -------------------- | --------- | ------------------------- | ----------------------- |
| `environmental-temp` | quantity  | Environmental temperature | `gt35`                  |
| `location-type`      | token     | Location type             | `tent`                  |
| `test-device`        | reference | Point-of-care test device | `Device/rapid-test-001` |
| `air-quality`        | token     | Air quality level         | `moderate`              |

## API Operations

### Create Observation

```http
POST /fhir/Observation
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
          "code": "vital-signs"
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
GET /fhir/Observation?patient=Patient/patient-123&category=vital-signs&date=2023-12-01
Accept: application/fhir+json
Authorization: Bearer {access_token}
```javascript

## Implementation Examples

### Environmental Health Monitoring

```javascript
async function createEnvironmentalObservation(patientId, environmentalData) {
  const observation = {
    resourceType: 'Observation',
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'https://zarishsphere.com/fhir/CodeSystem/observation-category',
            code: 'environmental',
            display: 'Environmental Health',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'https://zarishsphere.com/fhir/CodeSystem/environmental-observations',
          code: 'air_temperature',
          display: 'Air Temperature',
        },
      ],
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    effectiveDateTime: new Date().toISOString(),
    valueQuantity: {
      value: environmentalData.temperature,
      unit: '°C',
      system: 'http://unitsofmeasure.org',
      code: 'Cel',
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/environmental-context',
        extension: [
          {
            url: 'humidity',
            valueQuantity: {
              value: environmentalData.humidity,
              unit: '%',
              system: 'http://unitsofmeasure.org',
              code: '%',
            },
          },
          {
            url: 'locationType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/location-type',
                  code: environmentalData.locationType,
                  display: environmentalData.locationDisplay,
                },
              ],
            },
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Observation', observation);
}
```javascript

### Point-of-Care Rapid Test

```javascript
async function createRapidTestObservation(patientId, testData) {
  const observation = {
    resourceType: 'Observation',
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'https://zarishsphere.com/fhir/CodeSystem/observation-category',
            code: 'point-of-care',
            display: 'Point of Care Testing',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'https://zarishsphere.com/fhir/CodeSystem/rapid-tests',
          code: testData.testType,
          display: testData.testDisplay,
        },
      ],
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    effectiveDateTime: new Date().toISOString(),
    valueCodeableConcept: {
      coding: [
        {
          system: 'https://zarishsphere.com/fhir/CodeSystem/test-results',
          code: testData.result,
          display: testData.resultDisplay,
        },
      ],
    },
    interpretation: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
            code: testData.interpretation,
            display: testData.interpretationDisplay,
          },
        ],
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/point-of-care-test',
        extension: [
          {
            url: 'testDevice',
            valueReference: {
              reference: `Device/${testData.deviceId}`,
            },
          },
          {
            url: 'testOperator',
            valueReference: {
              reference: `Practitioner/${testData.operatorId}`,
            },
          },
          {
            url: 'testConditions',
            valueString: testData.conditions,
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Observation', observation);
}
```javascript

### Nutritional Assessment

```javascript
async function createNutritionalObservation(patientId, nutritionData) {
  const observation = {
    resourceType: 'Observation',
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'https://zarishsphere.com/fhir/CodeSystem/observation-category',
            code: 'nutrition',
            display: 'Nutritional Assessment',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '39156-5',
          display: 'Body mass index (BMI) [Ratio]',
        },
      ],
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    effectiveDateTime: new Date().toISOString(),
    valueQuantity: {
      value: nutritionData.bmi,
      unit: 'kg/m2',
      system: 'http://unitsofmeasure.org',
      code: 'kg/m2',
    },
    interpretation: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
            code: nutritionData.interpretation,
            display: nutritionData.interpretationDisplay,
          },
        ],
      },
    ],
    referenceRange: [
      {
        low: {
          value: 18.5,
          unit: 'kg/m2',
          system: 'http://unitsofmeasure.org',
          code: 'kg/m2',
        },
        high: {
          value: 24.9,
          unit: 'kg/m2',
          system: 'http://unitsofmeasure.org',
          code: 'kg/m2',
        },
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/referencerange-meaning',
              code: 'normal',
              display: 'Normal Range',
            },
          ],
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/nutritional-context',
        extension: [
          {
            url: 'height',
            valueQuantity: {
              value: nutritionData.height,
              unit: 'cm',
              system: 'http://unitsofmeasure.org',
              code: 'cm',
            },
          },
          {
            url: 'weight',
            valueQuantity: {
              value: nutritionData.weight,
              unit: 'kg',
              system: 'http://unitsofmeasure.org',
              code: 'kg',
            },
          },
          {
            url: 'assessmentMethod',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/nutrition-assessment-method',
                  code: nutritionData.method,
                  display: nutritionData.methodDisplay,
                },
              ],
            },
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Observation', observation);
}
```javascript

## Validation Rules

### Required Fields

- Subject (patient reference) is required
- Code must be specified
- Status must be specified
- Effective date/time is required
- Value must be specified (valueQuantity, valueCodeableConcept, or valueString)

### Business Rules

### Value Validation

```javascript
function validateObservationValue(observation) {
  const hasValue =
    observation.valueQuantity ||
    observation.valueCodeableConcept ||
    observation.valueString ||
    observation.valueBoolean ||
    observation.valueInteger ||
    observation.valueRange ||
    observation.valueRatio ||
    observation.valueSampledData ||
    observation.valueTime ||
    observation.valueDateTime ||
    observation.valuePeriod ||
    observation.component;

  if (!hasValue) {
    throw new Error('Observation must have a value or component values');
  }
}
```javascript

### Reference Range Validation

```javascript
function validateReferenceRange(observation) {
  if (observation.referenceRange) {
    for (const range of observation.referenceRange) {
      if (range.low && range.high && range.low.value >= range.high.value) {
        throw new Error('Reference range low value must be less than high value');
      }

      if (range.low && range.low.value < 0) {
        throw new Error('Reference range low value must be non-negative');
      }
    }
  }
}
```json

## Error Handling

### Common Errors

| Error                    | Description                     | Resolution                               |
| ------------------------ | ------------------------------- | ---------------------------------------- |
| `INVALID_PATIENT`        | Patient reference not found     | Verify patient exists and is active      |
| `INVALID_CODE`           | Observation code not recognized | Use standard LOINC codes or custom codes |
| `INVALID_VALUE`          | Value format not valid          | Check value type and units               |
| `MISSING_REQUIRED_FIELD` | Required field is missing       | Ensure all required fields are provided  |

### Error Response Example

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Observation must have a value or component values"
      },
      "location": ["Observation"]
    }
  ]
}
```javascript

## Performance Optimization

### Caching Strategy

- Recent observations cached for 24 hours
- Vital signs cached for 1 hour
- Environmental observations cached for 30 minutes
- Search results cached based on query complexity

### Batch Operations

```javascript
async function batchCreateObservations(observations) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'batch',
    entry: observations.map((observation) => ({
      fullUrl: `urn:uuid:${generateUUID()}`,
      resource: observation,
      request: {
        method: 'POST',
        url: 'Observation',
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

This comprehensive Observation resource guide ensures proper implementation across all healthcare measurement scenarios while maintaining humanitarian focus and low-resource optimization.
````
