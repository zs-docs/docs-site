# Observation Resource Example

## 🎯 Overview

This example demonstrates a complete Observation resource in ZARISH HIS with Bangladesh healthcare context, including vital signs, clinical measurements, and Bangladesh-specific observations.

## 📋 Vital Signs Observation Example

### Blood Pressure Measurement

```json
{
  "resourceType": "Observation",
  "id": "observation-bp-12345",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-observation"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "VITAL_SIGNS",
        "display": "Vital Signs"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/observation-tags",
        "code": "BLOOD_PRESSURE",
        "display": "Blood Pressure"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "OBSERVATION_ID",
            "display": "Observation Identifier"
          }
        ]
      },
      "value": "BP202401210001"
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
        "code": "85354-9",
        "display": "Blood pressure panel with all children optional"
      },
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-observation-codes",
        "code": "BLOOD_PRESSURE",
        "display": "Blood Pressure Measurement"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-12345",
    "display": "Mohammad Rahman"
  },
  "encounter": {
    "reference": "Encounter/encounter-gopd-12345",
    "display": "General OPD Visit - 21 Jan 2026"
  },
  "effectiveDateTime": "2026-01-21T09:15:00+06:00",
  "issued": "2026-01-21T09:20:00+06:00",
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "PPRF",
            "display": "primary performer"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-67890",
        "display": "Nurse Amina Begum"
      }
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
          },
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-observation-codes",
            "code": "SYSTOLIC_BP",
            "display": "Systolic Blood Pressure"
          }
        ]
      },
      "valueQuantity": {
        "value": 120,
        "unit": {
          "coding": [
            {
              "system": "http://unitsofmeasure.org",
              "code": "mm[Hg]",
              "display": "mmHg"
            }
          ],
          "system": "http://unitsofmeasure.org",
          "code": "mm[Hg]"
        },
        "interpretation": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3/ObservationInterpretation",
                "code": "H",
                "display": "High"
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
          },
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-observation-codes",
            "code": "DIASTOLIC_BP",
            "display": "Diastolic Blood Pressure"
          }
        ]
      },
      "valueQuantity": {
        "value": 80,
        "unit": {
          "coding": [
            {
              "system": "http://unitsofmeasure.org",
              "code": "mm[Hg]",
              "display": "mmHg"
            }
          ],
          "system": "http://unitsofmeasure.org",
          "code": "mm[Hg]"
        },
        "interpretation": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3/ObservationInterpretation",
                "code": "N",
                "display": "Normal"
              }
            ]
          }
        ]
      }
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/observation-device",
      "valueReference": {
        "reference": "Device/device-bp-monitor-001",
        "display": "Omron BP Monitor HEM-7322T"
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/measurement-method",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/measurement-methods",
            "code": "AUTOMATED",
            "display": "Automated Measurement"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/observation-context",
      "valueString": "ROUTINE_VITAL_SIGNS"
    }
  ]
}
```

## 🏥 Clinical Examination Example

### Physical Examination Findings

```json
{
  "resourceType": "Observation",
  "id": "observation-exam-67890",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-observation"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "CLINICAL_EXAM",
        "display": "Clinical Examination"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/observation-tags",
        "code": "PHYSICAL_EXAM",
        "display": "Physical Examination"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "EXAM_ID",
            "display": "Examination Identifier"
          }
        ]
      },
      "value": "EXAM202401210001"
    }
  ],
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "exam",
          "display": "Physical Examination"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-observation-codes",
        "code": "GENERAL_EXAMINATION",
        "display": "General Physical Examination"
      },
      {
        "system": "http://loinc.org",
        "code": "29300-6",
        "display": "General appearance of patient"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-rohingya-67890",
    "display": "Ayesha Begum"
  },
  "encounter": {
    "reference": "Encounter/encounter-gopd-12345",
    "display": "General OPD Visit - 21 Jan 2026"
  },
  "effectiveDateTime": "2026-01-21T09:30:00+06:00",
  "issued": "2026-01-21T09:35:00+06:00",
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "PPRF",
            "display": "primary performer"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-11111",
        "display": "Dr. Fatema Akter"
      }
    }
  ],
  "component": [
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "29300-5",
            "display": "Appearance of patient"
          }
        ]
      },
      "valueString": "Patient appears well-nourished, alert, and cooperative. No apparent distress."
    },
    {
      "code": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-observation-codes",
            "code": "NUTRITIONAL_STATUS",
            "display": "Nutritional Status"
          }
        ]
      },
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/nutritional-status",
            "code": "WELL_NOURISHED",
            "display": "Well Nourished"
          }
        ]
      }
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "8310-5",
            "display": "Appearance of patient skin"
          }
        ]
      },
      "valueString": "Skin color normal, no rashes, lesions, or abnormalities noted."
    },
    {
      "code": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-observation-codes",
            "code": "HYDRATION_STATUS",
            "display": "Hydration Status"
          }
        ]
      },
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/hydration-status",
            "code": "WELL_HYDRATED",
            "display": "Well Hydrated"
          }
        ]
      }
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/examination-method",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/examination-methods",
            "code": "VISUAL_INSPECTION",
            "display": "Visual Inspection"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/observation-context",
      "valueString": "ROUTINE_HEALTH_CHECK"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bangladesh-clinical-context",
      "valueString": "PRIMARY_CARE_CONTEXT"
    }
  ]
}
```

## 🩺 Laboratory Observation Example

### Laboratory Test Results

```json
{
  "resourceType": "Observation",
  "id": "observation-lab-11223",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-observation"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "LABORATORY",
        "display": "Laboratory Result"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/observation-tags",
        "code": "HEMATOLOGY",
        "display": "Hematology Test"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "LAB_RESULT_ID",
            "display": "Laboratory Result Identifier"
          }
        ]
      },
      "value": "LAB202401210001"
    }
  ],
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
        "code": "718-7",
        "display": "Hemoglobin A1c [Mass/volume] in Blood"
      },
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-observation-codes",
        "code": "HBA1C_TEST",
        "display": "HbA1c Test"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-12345",
    "display": "Mohammad Rahman"
  },
  "encounter": {
    "reference": "Encounter/encounter-gopd-12345",
    "display": "General OPD Visit - 21 Jan 2026"
  },
  "effectiveDateTime": "2026-01-21T08:00:00+06:00",
  "issued": "2026-01-21T16:30:00+06:00",
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "AUTH",
            "display": "author"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-33344",
        "display": "Dr. Kamal Hossain"
      }
    }
  ],
  "valueQuantity": {
    "value": 6.8,
    "unit": {
      "coding": [
        {
          "system": "http://unitsofmeasure.org",
          "code": "%",
          "display": "percent"
        }
      ],
      "system": "http://unitsofmeasure.org",
      "code": "%"
    },
  "interpretation": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3/ObservationInterpretation",
          "code": "N",
          "display": "Normal"
        }
      ]
    }
  ],
  "referenceRange": [
    {
      "low": {
        "value": 4.0,
        "unit": {
          "code": "%",
          "system": "http://unitsofmeasure.org",
          "display": "percent"
        }
      },
      "high": {
        "value": 5.7,
        "unit": {
          "code": "%",
          "system": "http://unitsofmeasure.org",
          "display": "percent"
        }
      },
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
            "code": "normal",
            "display": "Normal Range"
          }
        ]
      },
      "age": {
        "low": {
          "value": 18,
          "unit": {
            "code": "a",
            "system": "http://unitsofmeasure.org",
            "display": "years"
          }
        },
        "high": {
          "value": 80,
          "unit": {
            "code": "a",
            "system": "http://unitsofmeasure.org",
            "display": "years"
          }
        }
      }
    }
  ],
  "bodySite": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "368208006",
          "display": "Blood vessel structure of forearm"
        }
      ]
    }
  ],
  "specimen": {
    "reference": {
      "reference": "Specimen/specimen-blood-001",
      "display": "Venous blood - 5 mL"
    }
  },
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/laboratory-test-info",
      "valueString": "HBA1C_GLYCEMIA_METHOD"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/test-performing-lab",
      "valueReference": {
        "reference": "Organization/lab-zarish-hospital",
        "display": "ZARISH Hospital Laboratory"
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/observation-context",
      "valueString": "DIABETES_MONITORING"
    }
  ]
}
```

## 🔍 Key Features Demonstrated

### Observation Categories
- **Vital Signs**: Blood pressure, temperature, heart rate
- **Physical Examination**: General appearance, nutritional status
- **Laboratory**: Test results with reference ranges
- **Specialized**: Bangladesh-specific clinical observations

### Bangladesh Context
- **Local Coding**: BD-specific observation codes
- **Reference Ranges**: Age and gender-appropriate ranges
- **Laboratory Standards**: Local test methods and units
- **Clinical Context**: Primary care and specialized services

### ZARISH Extensions
- **Device Information**: Medical equipment used
- **Measurement Method**: How observation was obtained
- **Clinical Context**: Care setting and purpose
- **Laboratory Info**: Test methodology and performing lab
- **Bangladesh Context**: Local clinical practices

### Data Quality
- **Interpretation**: Normal, high, low values
- **Reference Ranges**: Age and gender-specific
- **Component Structure**: Complex observations with multiple values
- **Specimen Tracking**: Laboratory sample management

## 📚 Related Resources

- [Observation Profile](../profiles/zarish-observation.md)
- [Observation Codes Value Set](../value-sets/observation-codes.md)
- [Laboratory Service](../../backend/ms-laboratory-service.md)
- [Diagnostic Service](../../backend/ms-diagnostic-service.md)

## 🧪 Validation

This example conforms to:
- **FHIR R5**: Observation resource structure
- **ZARISH Observation Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **Clinical Standards**: WHO and local clinical guidelines

---

**Example Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS
