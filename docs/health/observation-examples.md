# 🔬 Observation Examples

## Overview

This section provides comprehensive observation examples for ZARISH SPHERE, following FHIR R5 standards and healthcare best practices.

## 📊 Vital Signs Observation

### Blood Pressure

````json
{
  "resourceType": "Observation",
  "id": "blood-pressure-example",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/vitalsigns",
      "http://hl7.org/fhir/R5/StructureDefinition/bp"
    ]
  },
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
    ],
    "text": "Blood pressure panel"
  },
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{encounterId}}",
    "display": "{{encounterDisplay}}"
  },
  "effectiveDateTime": "{{observation.dateTime}}",
  "performer": [
    {
      "reference": "Practitioner/{{practitionerId}}",
      "display": "{{practitionerName}}"
    }
  ],
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
        "value": {{systolicValue}},
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
        "value": {{diastolicValue}},
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    }
  ],
  "note": [
    {
      "text": "{{observation.note}}"
    }
  ]
}
```json

### Heart Rate

```json
{
  "resourceType": "Observation",
  "id": "heart-rate-example",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/vitalsigns",
      "http://hl7.org/fhir/R5/StructureDefinition/heartrate"
    ]
  },
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
        "code": "8867-4",
        "display": "Heart rate"
      }
    ],
    "text": "Heart rate"
  },
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{encounterId}}",
    "display": "{{encounterDisplay}}"
  },
  "effectiveDateTime": "{{observation.dateTime}}",
  "performer": [
    {
      "reference": "Practitioner/{{practitionerId}}",
      "display": "{{practitionerName}}"
    }
  ],
  "valueQuantity": {
    "value": {{heartRateValue}},
    "unit": "/min",
    "system": "http://unitsofmeasure.org",
    "code": "/min"
  },
  "method": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "43789002",
        "display": "Palpation"
      }
    ]
  },
  "bodySite": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "80891009",
        "display": "Heart structure"
      }
    ]
  }
}
```json

### Temperature

```json
{
  "resourceType": "Observation",
  "id": "temperature-example",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/vitalsigns",
      "http://hl7.org/fhir/R5/StructureDefinition/bodytemp"
    ]
  },
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
    ],
    "text": "Body temperature"
  },
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{encounterId}}",
    "display": "{{encounterDisplay}}"
  },
  "effectiveDateTime": "{{observation.dateTime}}",
  "performer": [
    {
      "reference": "Practitioner/{{practitionerId}}",
      "display": "{{practitionerName}}"
    }
  ],
  "valueQuantity": {
    "value": {{temperatureValue}},
    "unit": "°C",
    "system": "http://unitsofmeasure.org",
    "code": "Cel"
  },
  "method": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "43789002",
        "display": "Palpation"
      }
    ]
  },
  "bodySite": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "81745001",
        "display": "Oral cavity structure"
      }
    ]
  }
}
```json

## 🧪 Laboratory Observations

### Complete Blood Count (CBC)

```json
{
  "resourceType": "Observation",
  "id": "cbc-example",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Observation"
    ]
  },
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "laboratory",
          "display": "Laboratory"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "58410-2",
        "display": "Complete blood count (CBC) panel - Blood"
      }
    ],
    "text": "Complete blood count (CBC) panel"
  },
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{encounterId}}",
    "display": "{{encounterDisplay}}"
  },
  "effectiveDateTime": "{{observation.dateTime}}",
  "issued": "{{observation.issuedDateTime}}",
  "performer": [
    {
      "reference": "Practitioner/{{practitionerId}}",
      "display": "{{practitionerName}}"
    }
  ],
  "specimen": [
    {
      "reference": "Specimen/{{specimenId}}",
      "display": "{{specimenType}}"
    }
  ],
  "component": [
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "6690-2",
            "display": "Leukocytes [#/volume] in Blood by Automated count"
          }
        ]
      },
      "valueQuantity": {
        "value": {{wbcValue}},
        "unit": "10^3/μL",
        "system": "http://unitsofmeasure.org",
        "code": "10*3/uL"
      },
      "referenceRange": [
        {
          "low": {
            "value": 4.0,
            "unit": "10^3/μL",
            "system": "http://unitsofmeasure.org",
            "code": "10*3/uL"
          },
          "high": {
            "value": 11.0,
            "unit": "10^3/μL",
            "system": "http://unitsofmeasure.org",
            "code": "10*3/uL"
          }
        }
      ]
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "789-8",
            "display": "Erythrocytes [#/volume] in Blood by Automated count"
          }
        ]
      },
      "valueQuantity": {
        "value": {{rbcValue}},
        "unit": "10^6/μL",
        "system": "http://unitsofmeasure.org",
        "code": "10*6/uL"
      },
      "referenceRange": [
        {
          "low": {
            "value": 4.2,
            "unit": "10^6/μL",
            "system": "http://unitsofmeasure.org",
            "code": "10*6/uL"
          },
          "high": {
            "value": 5.4,
            "unit": "10^6/μL",
            "system": "http://unitsofmeasure.org",
            "code": "10*6/uL"
          }
        }
      ]
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "718-7",
            "display": "Hematocrit [Volume Fraction] of Blood by Automated count"
          }
        ]
      },
      "valueQuantity": {
        "value": {{hematocritValue}},
        "unit": "%",
        "system": "http://unitsofmeasure.org",
        "code": "%"
      },
      "referenceRange": [
        {
          "low": {
            "value": 40.0,
            "unit": "%",
            "system": "http://unitsofmeasure.org",
            "code": "%"
          },
          "high": {
            "value": 50.0,
            "unit": "%",
            "system": "http://unitsofmeasure.org",
            "code": "%"
          }
        }
      ]
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "30525-0",
            "display": "Hemoglobin [Mass/volume] in Blood"
          }
        ]
      },
      "valueQuantity": {
        "value": {{hemoglobinValue}},
        "unit": "g/dL",
        "system": "http://unitsofmeasure.org",
        "code": "g/dL"
      },
      "referenceRange": [
        {
          "low": {
            "value": 12.0,
            "unit": "g/dL",
            "system": "http://unitsofmeasure.org",
            "code": "g/dL"
          },
          "high": {
            "value": 16.0,
            "unit": "g/dL",
            "system": "http://unitsofmeasure.org",
            "code": "g/dL"
          }
        }
      ]
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "777-3",
            "display": "Platelets [#/volume] in Blood by Automated count"
          }
        ]
      },
      "valueQuantity": {
        "value": {{plateletsValue}},
        "unit": "10^3/μL",
        "system": "http://unitsofmeasure.org",
        "code": "10*3/uL"
      },
      "referenceRange": [
        {
          "low": {
            "value": 150.0,
            "unit": "10^3/μL",
            "system": "http://unitsofmeasure.org",
            "code": "10*3/uL"
          },
          "high": {
            "value": 450.0,
            "unit": "10^3/μL",
            "system": "http://unitsofmeasure.org",
            "code": "10*3/uL"
          }
        }
      ]
    }
  ]
}
```json

### Blood Chemistry

```json
{
  "resourceType": "Observation",
  "id": "blood-chemistry-example",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Observation"
    ]
  },
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "laboratory",
          "display": "Laboratory"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "24323-8",
        "display": "Comprehensive metabolic 2000 panel - Serum or Plasma"
      }
    ],
    "text": "Comprehensive metabolic panel"
  },
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{encounterId}}",
    "display": "{{encounterDisplay}}"
  },
  "effectiveDateTime": "{{observation.dateTime}}",
  "issued": "{{observation.issuedDateTime}}",
  "performer": [
    {
      "reference": "Practitioner/{{practitionerId}}",
      "display": "{{practitionerName}}"
    }
  ],
  "specimen": [
    {
      "reference": "Specimen/{{specimenId}}",
      "display": "{{specimenType}}"
    }
  ],
  "component": [
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "1920-8",
            "display": "Urea nitrogen [Mass/volume] in Serum or Plasma"
          }
        ]
      },
      "valueQuantity": {
        "value": {{bunValue}},
        "unit": "mg/dL",
        "system": "http://unitsofmeasure.org",
        "code": "mg/dL"
      },
      "referenceRange": [
        {
          "low": {
            "value": 7.0,
            "unit": "mg/dL",
            "system": "http://unitsofmeasure.org",
            "code": "mg/dL"
          },
          "high": {
            "value": 20.0,
            "unit": "mg/dL",
            "system": "http://unitsofmeasure.org",
            "code": "mg/dL"
          }
        }
      ]
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "1975-2",
            "display": "Creatinine [Mass/volume] in Serum or Plasma"
          }
        ]
      },
      "valueQuantity": {
        "value": {{creatinineValue}},
        "unit": "mg/dL",
        "system": "http://unitsofmeasure.org",
        "code": "mg/dL"
      },
      "referenceRange": [
        {
          "low": {
            "value": 0.6,
            "unit": "mg/dL",
            "system": "http://unitsofmeasure.org",
            "code": "mg/dL"
          },
          "high": {
            "value": 1.3,
            "unit": "mg/dL",
            "system": "http://unitsofmeasure.org",
            "code": "mg/dL"
          }
        }
      ]
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "2823-3",
            "display": "Potassium [Moles/volume] in Serum or Plasma"
          }
        ]
      },
      "valueQuantity": {
        "value": {{potassiumValue}},
        "unit": "mmol/L",
        "system": "http://unitsofmeasure.org",
        "code": "mmol/L"
      },
      "referenceRange": [
        {
          "low": {
            "value": 3.5,
            "unit": "mmol/L",
            "system": "http://unitsofmeasure.org",
            "code": "mmol/L"
          },
          "high": {
            "value": 5.3,
            "unit": "mmol/L",
            "system": "http://unitsofmeasure.org",
            "code": "mmol/L"
          }
        }
      ]
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "2345-7",
            "display": "Glucose [Mass/volume] in Blood"
          }
        ]
      },
      "valueQuantity": {
        "value": {{glucoseValue}},
        "unit": "mg/dL",
        "system": "http://unitsofmeasure.org",
        "code": "mg/dL"
      },
      "referenceRange": [
        {
          "low": {
            "value": 70.0,
            "unit": "mg/dL",
            "system": "http://unitsofmeasure.org",
            "code": "mg/dL"
          },
          "high": {
            "value": 100.0,
            "unit": "mg/dL",
            "system": "http://unitsofmeasure.org",
            "code": "mg/dL"
          }
        }
      ]
    }
  ]
}
```json

## 🩺 Clinical Observations

### Pain Assessment

```json
{
  "resourceType": "Observation",
  "id": "pain-assessment-example",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Observation"
    ]
  },
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "exam",
          "display": "Exam"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "22253000",
        "display": "Pain finding"
      }
    ],
    "text": "Pain assessment"
  },
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{encounterId}}",
    "display": "{{encounterDisplay}}"
  },
  "effectiveDateTime": "{{observation.dateTime}}",
  "performer": [
    {
      "reference": "Practitioner/{{practitionerId}}",
      "display": "{{practitionerName}}"
    }
  ],
  "valueQuantity": {
    "value": {{painScaleValue}},
    "unit": "{score}",
    "system": "http://unitsofmeasure.org",
    "code": "{score}"
  },
  "method": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "272391004",
        "display": "Numeric pain scale assessment"
      }
    ]
  },
  "bodySite": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "{{bodySiteCode}}",
          "display": "{{bodySiteDisplay}}"
        }
      ]
    }
  ],
  "note": [
    {
      "text": "{{painAssessment.note}}"
    }
  ]
}
```json

### Mental Status Assessment

```json
{
  "resourceType": "Observation",
  "id": "mental-status-example",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Observation"
    ]
  },
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "survey",
          "display": "Survey"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "69247-9",
        "display": "Mini mental state examination [MMSE]"
      }
    ],
    "text": "Mini mental state examination"
  },
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{encounterId}}",
    "display": "{{encounterDisplay}}"
  },
  "effectiveDateTime": "{{observation.dateTime}}",
  "performer": [
    {
      "reference": "Practitioner/{{practitionerId}}",
      "display": "{{practitionerName}}"
    }
  ],
  "valueQuantity": {
    "value": {{mmseScore}},
    "unit": "{score}",
    "system": "http://unitsofmeasure.org",
    "code": "{score}"
  },
  "interpretation": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          "code": "{{interpretationCode}}",
          "display": "{{interpretationDisplay}}"
        }
      ]
    }
  ],
  "note": [
    {
      "text": "{{mentalStatus.note}}"
    }
  ]
}
```yaml

## 🔧 Implementation Guidelines

### Creating New Observations

```typescript
interface ObservationTemplate {
  resourceType: 'Observation';
  id: string;
  meta: {
    profile: string[];
  };
  status: 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled';
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text?: string;
  };
  subject: {
    reference: string;
    display: string;
  };
  encounter?: {
    reference: string;
    display: string;
  };
  effectiveDateTime?: string;
  effectivePeriod?: {
    start: string;
    end: string;
  };
  performer?: Array<{
    reference: string;
    display: string;
  }>;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  valueCodeableConcept?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  valueString?: string;
  component?: Array<any>;
  referenceRange?: Array<any>;
  interpretation?: Array<any>;
  note?: Array<{
    text: string;
  }>;
}
```javascript

### Validation Rules

```javascript
const observationValidation = {
  required: [
    'status',
    'category',
    'code',
    'subject'
  ],

  rules: {
    status: {
      enum: ['preliminary', 'final', 'amended', 'corrected', 'cancelled']
    },
    category: {
      type: 'array',
      minItems: 1
    },
    code: {
      type: 'object',
      required: ['coding']
    },
    subject: {
      type: 'object',
      required: ['reference']
    },
    effectiveDateTime: {
      type: 'string',
      format: 'date-time'
    }
  },

  custom: {
    validateValue: (observation) => {
      return observation.valueQuantity ||
             observation.valueCodeableConcept ||
             observation.valueString;
    },
    validateReference: (observation) => {
      return observation.subject.reference.startsWith('Patient/');
    }
  }
};
```javascript

## 📊 Observation Analytics

### Observation Tracking

```javascript
class ObservationAnalytics {
  static trackObservation(observation) {
    const event = {
      type: 'observation_created',
      timestamp: new Date().toISOString(),
      patientId: observation.subject.reference.split('/')[1],
      category: observation.category[0].coding[0].code,
      code: observation.code.coding[0].code,
      status: observation.status,
      performer: observation.performer?.[0]?.reference.split('/')[1]
    };

    // Send to analytics service
    this.sendEvent(event);
  }

  static sendEvent(event) {
    // Implementation for sending analytics events
    console.log('Observation Analytics Event:', event);
  }
}
```text

## 📞 Support

For questions about observation examples:

- **Email**: clinical-support@zarishsphere.com
- **Documentation**: [FHIR R5 Observation](../fhir-r5/observation.md)
- **API Reference**: [Observation Resource](../api-reference/overview.md)

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
**Module**: Clinical Observations
**Status**: Production Ready
````
