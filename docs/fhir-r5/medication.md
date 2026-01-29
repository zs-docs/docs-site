---
title: 'Medication Resource'
sidebar_label: 'Medication'
description: 'Comprehensive guide to FHIR R5 Medication resources implementation in ZARISH SPHERE'
keywords: [medication, fhir r5, pharmaceutical, prescriptions, healthcare, zarish sphere]
---

# FHIR R5 Medication Resources

## Overview

ZARISH SPHERE implements comprehensive FHIR R5 Medication resources for pharmaceutical management in healthcare settings. This implementation follows FHIR R5 specifications with humanitarian and low-resource optimizations, supporting various medication management scenarios including essential medicines tracking, supply chain management, and prescription workflows.

## Medication Resource Structure

### Core Elements

````json
{
  "resourceType": "Medication",
  "id": "medication-123",
  "identifier": [
    {
      "use": "official",
      "system": "https://zarishsphere.com/medication-id",
      "value": "MED-2023-001234"
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "387517004",
        "display": "Acetaminophen 325mg oral tablet"
      }
    ],
    "text": "Acetaminophen 325mg Tablet"
  },
  "status": "active",
  "manufacturer": {
    "display": "PharmaCorp International"
  },
  "form": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "385055003",
        "display": "Tablet"
      }
    ]
  },
  "amount": {
    "value": 100,
    "unit": "tablets",
    "system": "http://unitsofmeasure.org",
    "code": "{tbl}"
  },
  "ingredient": [
    {
      "itemCodeableConcept": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "387517004",
            "display": "Acetaminophen"
          }
        ]
      },
      "strength": {
        "numerator": {
          "value": 325,
          "unit": "mg",
          "system": "http://unitsofmeasure.org",
          "code": "mg"
        },
        "denominator": {
          "value": 1,
          "unit": "tablet",
          "system": "http://unitsofmeasure.org",
          "code": "{tbl}"
        }
      }
    }
  ],
  "batch": [
    {
      "lotNumber": "BATCH-2023-001",
      "expirationDate": "2025-12-31"
    }
  ]
}
```javascript

## MedicationRequest Resource

### Core Elements

```json
{
  "resourceType": "MedicationRequest",
  "id": "medication-request-123",
  "identifier": [
    {
      "use": "official",
      "system": "https://zarishsphere.com/medication-request-id",
      "value": "RX-2023-001234"
    }
  ],
  "status": "active",
  "intent": "order",
  "medicationReference": {
    "reference": "Medication/medication-123",
    "display": "Acetaminophen 325mg Tablet"
  },
  "subject": {
    "reference": "Patient/patient-123",
    "display": "John Smith"
  },
  "encounter": {
    "reference": "Encounter/encounter-456"
  },
  "authoredOn": "2023-12-01T10:30:00Z",
  "requester": {
    "reference": "Practitioner/practitioner-789",
    "display": "Dr. Sarah Johnson"
  },
  "dosageInstruction": [
    {
      "text": "Take 1 tablet every 4 hours as needed for pain",
      "timing": {
        "repeat": {
          "frequency": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation",
                "code": "QID",
                "display": "QID"
              }
            ]
          },
          "period": {
            "start": "2023-12-01T10:30:00Z",
            "end": "2023-12-08-01T10:30:00Z"
          }
        }
      },
      "route": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "26643006",
            "display": "Oral"
          }
        ]
      },
      "doseAndRate": {
        "doseQuantity": {
          "value": 1,
          "unit": "tablet",
          "system": "http://unitsofmeasure.org",
          "code": "{tbl}"
        }
      }
    }
  ],
  "dispenseRequest": {
    "validityPeriod": {
      "start": "2023-12-01T10:30:00Z",
      "end": "2023-12-08-01T10:30:00Z"
    },
    "quantity": {
      "value": 30,
      "unit": "tablets",
      "system": "http://unitsofmeasure.org",
      "code": "{tbl}"
    },
    "expectedSupplyDuration": {
      "value": 30,
      "unit": "days",
      "system": "http://unitsofmeasure.org",
      "code": "d"
    },
    "performer": {
      "reference": "Organization/pharmacy-001",
      "display": "Main Pharmacy"
    }
  }
}
```text

## ZARISH SPHERE Extensions

### Essential Medicines List

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/essential-medicines",
      "extension": [
        {
          "url": "isEssential",
          "valueBoolean": true
        },
        {
          "url": "listCategory",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/essential-medicines-list",
                "code": "core",
                "display": "Core Essential Medicines"
              }
            ]
          }
        },
        {
          "url": "whoListNumber",
          "valueString": "6.1.1"
        },
        {
          "url": "alternativeAvailable",
          "valueBoolean": false
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
      "url": "https://zarishphere.com/fhir/StructureDefinition/low-resource-medication",
      "extension": [
        {
          "url": "storageRequirements",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/storage-requirements",
                "code": "basic",
                "display": "Basic Storage Required"
              }
            ]
          }
        },
        {
          "url": "shelfLife",
          "valueDuration": {
            "value": 24,
            "unit": "months",
            "system": "http://unitsofmeasure.org",
            "code": "mo"
          }
        },
        {
          "url": "temperatureSensitivity",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/temperature-sensitivity",
                "code": "room_temperature",
                "display": "Room Temperature Stable"
              }
            ]
          }
        }
      ]
    }
  ]
}
```text

### Supply Chain Tracking

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/supply-chain",
      "extension": [
        {
          "url": "stockLevel",
          "valueQuantity": {
            "value": 500,
            "unit": "tablets",
            "system": "http://unitsofmeasure.org",
            "code": "{tbl}"
          }
        },
        {
          "url": "reorderLevel",
          "valueQuantity": {
            "value": 100,
            "unit": "tablets",
            "system": "http://unitsofquality.org",
            "code": "{tbl}"
          }
        },
        {
          "url": "lastInventoryDate",
          "valueDateTime": "2023-12-01T08:00:00Z"
        },
        {
          "url": "supplier",
          "valueReference": {
            "reference": "Organization/supplier-001",
            "display": "PharmaCorp International"
          }
        },
        {
          "url": "batchTracking",
          "valueBoolean": true
        }
      ]
    }
  ]
}
```json

## Medication Categories

### Standard FHIR Categories

| Category            | Description             | Examples                           |
| ------------------- | ----------------------- | ---------------------------------- |
| **Analgesics**      | Pain management         | Acetaminophen, ibuprofen, morphine |
| **Antibiotics**     | Infection treatment     | Amoxicillin, ciprofloxacin         |
| **Antimalarials**   | Malaria treatment       | Artemisinin, chloroquine           |
| **Vaccines**        | Immunization            | Measles, polio, COVID-19           |
| **Chronic Disease** | Long-term conditions    | Hypertension, diabetes             |
| **Emergency**       | Emergency care          | Epinephrine, atropine              |
| **Supplements**     | Nutritional supplements | Iron, vitamin A                    |

### ZARISH SPHERE Custom Categories

| Category                | Description                  | Examples                         |
| ----------------------- | ---------------------------- | -------------------------------- |
| **Essential Medicines** | WHO essential medicines list | Core, complementary, specialized |
| **Mobile Clinic**       | Mobile clinic specific       | Portable, field-ready            |
| **Emergency Response**  | Emergency response kits      | Trauma, outbreak response        |
| **Pediatric**           | Child-specific medications   | Age-appropriate formulations     |
| **Maternal Health**     | Maternal health              | Prenatal, postpartum care        |
| **Mental Health**       | Mental health                | Antidepressants, antipsychotics  |

## Essential Medicines Implementation

### WHO Essential Medicines List

```json
{
  "resourceType": "Medication",
  "code": {
    "coding": [
      {
        "system": "https://zarishsphere.com/fhir/CodeSystem/essential-medicines",
        "code": "WHO-6.1.1",
        "display": "Acetaminophen"
      }
    ]
  },
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/essential-medicines",
      "extension": [
        {
          "url": "isEssential",
          "valueBoolean": true
        },
        {
          "url": "listCategory",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/essential-medicines-list",
                "code": "core",
                "display": "Core Essential Medicines"
              }
            ]
          }
        },
        {
          "url": "whoListNumber",
          "valueString": "6.1.1"
        },
        {
          "url": "therapeuticClass",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/therapeutic-class",
                "code": "analgesic",
                "display": "Analgesic"
              }
            ]
          }
        }
      ]
    }
  ]
}
```text

### Alternative Medications

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/alternative-medications",
      "extension": [
        {
          "url": "hasAlternative",
          "valueBoolean": true
        },
        {
          "url": "alternativeMedication",
          "valueReference": {
            "reference": "Medication/alternative-001",
            "display": "Ibuprofen 400mg Tablet"
          }
        },
        {
          "url": "alternativeReason",
          "valueString": "Stock unavailable"
        },
        {
          "url": "equivalence",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/medication-equivalence",
                "code": "partial",
                "display": "Partial therapeutic equivalence"
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

| Parameter      | Type   | Description                | Example           |
| -------------- | ------ | -------------------------- | ----------------- |
| `_id`          | token  | Logical id of the resource | `medication-123`  |
| `identifier`   | token  | Medication identifiers     | `MED-2023-001234` |
| `code`         | token  | Medication code            | `387517004`       |
| `status`       | token  | Medication status          | `active`          |
| `form`         | token  | Dosage form                | `tablet`          |
| `manufacturer` | string | Manufacturer name          | `PharmaCorp`      |

### ZARISH SPHERE Custom Parameters

| Parameter                 | Type     | Description                       | Example        |
| ------------------------- | -------- | --------------------------------- | -------------- |
| `essential-medicine`      | token    | Essential medicine status         | `true`         |
| `stock-level`             | quantity | Current stock level               | `gt100`        |
| `list-category`           | token    | Essential medicines list category | `core`         |
| `temperature-sensitivity` | token    | Storage temperature requirement   | `refrigerated` |
| `mobile-clinic`           | token    | Mobile clinic suitability         | `true`         |

## API Operations

### Create Medication

```http
POST /fhir/Medication
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Medication",
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "387517004",
        "display": "Acetaminophen 325mg oral tablet"
      }
    ]
  },
  "status": "active",
  "form": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "385055003",
        "display": "Tablet"
      }
    ]
  },
  "ingredient": [
    {
      "itemCodeableConcept": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "387517004",
            "display": "Acetaminophen"
          }
        ]
      },
      "strength": {
        "numerator": {
          "value": 325,
          "unit": "mg",
          "system": "http://unitsofmeasure.org",
          "code": "mg"
        },
        "denominator": {
          "value": 1,
          "unit": "tablet",
          "system": "http://unitsofmeasure.org",
          "code": "{tbl}"
        }
      }
    }
  ]
}
```javascript

### Create MedicationRequest

```http
POST /fhir/MedicationRequest
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "MedicationRequest",
  "status": "active",
  "intent": "order",
  "medicationReference": {
    "reference": "Medication/medication-123"
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "dosageInstruction": [
    {
      "text": "Take 1 tablet every 4 hours as needed for pain",
      "timing": {
        "repeat": {
          "frequency": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation",
                "code": "QID",
                "display": "QID"
              }
            ]
          }
        }
      },
      "route": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "26643006",
            "display": "Oral"
          }
        ]
      },
      "doseAndRate": {
        "doseQuantity": {
          "value": 1,
          "unit": "tablet",
          "system": "http://unitsofmeasure.org",
          "code": "{tbl}"
        }
      }
    }
  ]
}
```javascript

## Implementation Examples

### Essential Medicines Management

```javascript
async function createEssentialMedication(medicationData) {
  const medication = {
    resourceType: 'Medication',
    code: {
      coding: [
        {
          system: 'https://zarishsphere.com/fhir/CodeSystem/essential-medicines',
          code: medicationData.whoCode,
          display: medicationData.displayName,
        },
      ],
    },
    status: 'active',
    form: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: medicationData.formCode,
          display: medicationData.formDisplay,
        },
      ],
    },
    ingredient: [
      {
        itemCodeableConcept: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: medicationData.ingredientCode,
              display: medicationData.ingredientDisplay,
            },
          ],
        },
        strength: {
          numerator: {
            value: medicationData.strengthValue,
            unit: medicationData.strengthUnit,
            system: 'http://unitsofmeasure.org',
            code: medicationData.strengthUnitCode,
          },
          denominator: {
            value: 1,
            unit: medicationData.denominatorUnit,
            system: 'http://unitsofmeasure.org',
            code: medicationData.denominatorUnitCode,
          },
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/essential-medicines',
        extension: [
          {
            url: 'isEssential',
            valueBoolean: true,
          },
          {
            url: 'listCategory',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/essential-medicines-list',
                  code: medicationData.listCategory,
                  display: medicationData.listCategoryDisplay,
                },
              ],
            },
          },
          {
            url: 'whoListNumber',
            valueString: medicationData.whoListNumber,
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Medication', medication);
}
```javascript

### Mobile Clinic Medication Management

```javascript
async function createMobileClinicMedication(medicationData) {
  const medication = {
    resourceType: 'Medication',
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: medicationData.code,
          display: medicationData.display,
        },
      ],
    },
    status: 'active',
    form: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: medicationData.formCode,
          display: medicationData.formDisplay,
        },
      ],
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/mobile-clinic',
        extension: [
          {
            url: 'portable',
            valueBoolean: true,
          },
          {
            url: 'temperatureStable',
            valueBoolean: true,
          },
          {
            url: 'minimalStorage',
            valueBoolean: true,
          },
          {
            url: 'fieldReady',
            valueBoolean: true,
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Medication', medication);
}
```javascript

### Supply Chain Tracking

```javascript
async function updateMedicationStock(medicationId, stockData) {
  const medication = await getFHIRResource('Medication', medicationId);

  const supplyChainExtension = {
    url: 'https://zarishsphere.com/fhir/StructureDefinition/supply-chain',
    extension: [
      {
        url: 'stockLevel',
        valueQuantity: {
          value: stockData.currentStock,
          unit: stockData.unit,
          system: 'http://unitsofmeasure.org',
          code: stockData.unitCode,
        },
      },
      {
        url: 'lastInventoryDate',
        valueDateTime: new Date().toISOString(),
      },
    ],
  };

  medication.extension = medication.extension || [];
  medication.extension.push(supplyChainExtension);

  return await updateFHIRResource('Medication', medicationId, medication);
}
```javascript

### Emergency Response Medication

```javascript
async function createEmergencyMedication(medicationData) {
  const medication = {
    resourceType: "Medication",
    code: {
      coding: [{
        system: "https://zarishsphere.com/fhir/CodeSystem/emergency-medications",
        code: medicationData.emergencyCode,
        display: medicationData.displayName
      }]
    },
    status: "active",
    form: {
      coding: [{
        system: "http://snomed.info/sct",
        code: medicationData.formCode,
        display: medicationData.formDisplay
      }]
    },
    extension: [
      {
        url: "https://zarishsphere.com/fhir/StructureDefinition/emergency-response",
        extension: [
          {
            "url: "emergencyKit",
            valueBoolean: true
          },
          {
            "url": "responseType",
            valueCodeableConcept: {
              coding: [{
                system: "https://zarishsphere.com/fhir/CodeSystem/emergency-response-type",
                code: medicationData.responseType,
                display: medicationData.responseTypeDisplay
              }]
            }
          },
          {
            "url": "shelfLifeExtended",
            valueBoolean: medicationData.shelfLifeExtended
          }
        ]
      }
    ]
  };

  return await createFHIRResource('Medication', medication);
}
```javascript

## Validation Rules

### Required Fields

- Code must be specified
- Status must be specified
- At least one ingredient must be specified
- Form must be specified for solid medications

### Business Rules

### Ingredient Validation

```javascript
function validateMedicationIngredients(medication) {
  if (!medication.ingredient || medication.ingredient.length === 0) {
    throw new Error('Medication must have at least one ingredient');
  }

  for (const ingredient of medication.ingredient) {
    if (!ingredient.itemCodeableConcept || !ingredient.strength) {
      throw new Error('Each ingredient must have code and strength');
    }

    if (ingredient.strength.numerator && ingredient.strength.denominator) {
      if (ingredient.strength.numerator.value <= 0) {
        throw new Error('Ingredient strength numerator must be positive');
      }

      if (ingredient.strength.denominator.value <= 0) {
        throw new Error('Ingredient strength denominator must be positive');
      }
    }
  }
}
```javascript

### Essential Medicines Validation

```javascript
function validateEssentialMedication(medication) {
  const essentialExtension = medication.extension?.find(
    (ext) => ext.url === 'https://zarishsphere.com/fhir/StructureDefinition/essential-medicines'
  );

  if (essentialExtension) {
    const isEssential = essentialExtension.extension?.find((ext) => ext.url === 'isEssential');

    if (isEssential && !isEssential.valueBoolean) {
      throw new Error('Essential medication must have isEssential=true');
    }

    const listCategory = essentialExtension.extension?.find((ext) => ext.url === 'listCategory');

    if (listCategory && !listCategory.valueCodeableConcept) {
      throw new Error('Essential medication must have valid list category');
    }
  }
}
```json

## Error Handling

### Common Errors

| Error                    | Description                    | Resolution                                |
| ------------------------ | ------------------------------ | ----------------------------------------- |
| `INVALID_CODE`           | Medication code not recognized | Use standard SNOMED codes or custom codes |
| `INVALID_INGREDIENT`     | Ingredient format not valid    | Check ingredient structure and strength   |
| `MISSING_REQUIRED_FIELD` | Required field is missing      | Ensure all required fields are provided   |
| `STOCK_LEVEL_LOW`        | Stock below reorder level      | Trigger reorder process                   |

### Error Response Example

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Medication must have at least one ingredient with valid strength"
      },
      "location": ["Medication.ingredient"]
    }
  ]
}
```javascript

## Performance Optimization

### Caching Strategy

- Essential medicines cached for 24 hours
- Stock levels cached for real-time access
- Search results cached based on query complexity

### Batch Operations

```javascript
async function batchCreateMedications(medications) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'batch',
    entry: medications.map((medication) => ({
      fullUrl: `urn:uuid:${generateUUID()}`,
      resource: medication,
      request: {
        method: 'POST',
        url: 'Medication',
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

This comprehensive medication resource guide ensures proper implementation across all pharmaceutical management scenarios while maintaining humanitarian focus and low-resource optimization.
````
