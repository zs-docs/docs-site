# DiagnosticReport Resource Example

## 🎯 Overview

This example demonstrates a complete DiagnosticReport resource in ZARISH HIS with Bangladesh healthcare context, including laboratory reports, radiology findings, and pathology results.

## 📋 Laboratory Report Example

### Blood Test Results

```json
{
  "resourceType": "DiagnosticReport",
  "id": "diagnosticreport-lab-12345",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-diagnostic-report"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "LABORATORY_REPORT",
        "display": "Laboratory Report"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/diagnostic-report-tags",
        "code": "HEMATOLOGY_REPORT",
        "display": "Hematology Report"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "LAB_REPORT_ID",
            "display": "Laboratory Report Identifier"
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
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/diagnostic-categories",
          "code": "LAB",
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
        "display": "Hemoglobin A1c/Blood Glucose"
      },
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-diagnostic-codes",
        "code": "COMPREHENSIVE_METABOLIC_PANEL",
        "display": "Comprehensive Metabolic Panel"
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
  "result": [
    {
      "reference": {
        "reference": "Observation/observation-lab-11223",
        "display": "HbA1c - 6.8%"
      }
    },
    {
      "reference": {
        "reference": "Observation/observation-lab-11224",
        "display": "Fasting Glucose - 5.2 mmol/L"
      }
    },
    {
      "reference": {
        "reference": "Observation/observation-lab-11225",
        "display": "Total Cholesterol - 5.1 mmol/L"
      }
    },
    {
      "reference": {
        "reference": "Observation/observation-lab-11226",
        "display": "LDL Cholesterol - 3.2 mmol/L"
      }
    },
    {
      "reference": {
        "reference": "Observation/observation-lab-11227",
        "display": "HDL Cholesterol - 1.2 mmol/L"
      }
    },
    {
      "reference": {
        "reference": "Observation/observation-lab-11228",
        "display": "Triglycerides - 1.8 mmol/L"
      }
    }
  ],
  "presentedForm": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3/ActCode",
        "code": "LABR",
        "display": "Laboratory report"
      }
    ]
  },
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
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "VER",
            "display": "verifier"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-55555",
        "display": "Dr. Ayesha Siddiqua"
      }
    }
  ],
  "resultsInterpreter": [
    {
      "reference": {
        "reference": "Practitioner/practitioner-33344",
        "display": "Dr. Kamal Hossain"
      },
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationType",
            "code": "ATND",
            "display": "attender"
          }
        ]
      }
    }
  ],
  "specimen": [
    {
      "reference": {
        "reference": "Specimen/specimen-blood-001",
        "display": "Venous blood - 5 mL"
      }
    }
  ],
  "resultInterpreter": [
    {
      "reference": {
        "reference": "Organization/lab-zarish-hospital",
        "display": "ZARISH Hospital Laboratory"
      }
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/laboratory-test-info",
      "valueString": "COMPREHENSIVE_METABOLIC_PANEL"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/test-performing-lab",
      "valueReference": {
        "reference": "Organization/lab-zarish-hospital",
        "display": "ZARISH Hospital Laboratory"
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-laboratory-standards",
      "valueString": "DGHS_LABORATORY_V3"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/diagnostic-context",
      "valueString": "ROUTINE_HEALTH_SCREENING"
    }
  ]
}
```

## 🩻 Radiology Report Example

### Chest X-Ray Findings

```json
{
  "resourceType": "DiagnosticReport",
  "id": "diagnosticreport-radiology-67890",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-diagnostic-report"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "RADIOLOGY_REPORT",
        "display": "Radiology Report"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/diagnostic-report-tags",
        "code": "CHEST_XRAY",
        "display": "Chest X-Ray"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "RADIOLOGY_REPORT_ID",
            "display": "Radiology Report Identifier"
          }
        ]
      },
      "value": "RAD202401210001"
    }
  ],
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/diagnostic-categories",
          "code": "RAD",
          "display": "Radiology"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "39111-8",
        "display": "Chest X-ray PA and Lateral"
      },
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-diagnostic-codes",
        "code": "CHEST_RADIOGRAPHY_BD",
        "display": "Chest Radiography - Bangladesh Protocol"
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
  "effectiveDateTime": "2026-01-21T10:30:00+06:00",
  "issued": "2026-01-21T14:45:00+06:00",
  "result": [
    {
      "reference": {
        "reference": "Observation/observation-xray-findings-12345",
        "display": "Clear lung fields, no active infiltrates"
      }
    },
    {
      "reference": {
        "reference": "Observation/observation-xray-impression-12345",
        "display": "No acute cardiopulmonary abnormalities"
      }
    }
  ],
  "presentedForm": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3/ActCode",
        "code": "XRAY",
        "display": "X-Ray report"
      }
    ]
  },
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
        "reference": "Practitioner/practitioner-99999",
        "display": "Dr. Rahman Miah"
      }
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "ATND",
            "display": "attender"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-88888",
        "display": "Dr. Salim Ahmed"
      }
    }
  ],
  "resultsInterpreter": [
    {
      "reference": {
        "reference": "Practitioner/practitioner-99999",
        "display": "Dr. Rahman Miah"
      }
    }
  ],
  "specimen": {
    "reference": {
      "reference": "Specimen/specimen-chest-xray-001",
      "display": "Chest X-Ray - PA and Lateral views"
    }
  }
  ],
  "resultInterpreter": [
    {
      "reference": {
        "reference": "Organization/radiology-dept-zarish-hospital",
        "display": "ZARISH Hospital Radiology Department"
      }
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/radiology-procedure-info",
      "valueString": "STANDARD_CHEST_XRAY_PROTOCOL"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/imaging-parameters",
      "valueString": "CHEST_XRAY_STANDARD_PARAMS"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-radiology-standards",
      "valueString": "DGHS_RADIOLOGY_V3"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/diagnostic-context",
      "valueString": "ROUTINE_DIAGNOSTIC_IMAGING"
    }
  ]
}
```

## 🔍 Key Features Demonstrated

### Diagnostic Report Types
- **Laboratory Reports**: Blood tests, metabolic panels, pathology
- **Radiology Reports**: X-rays, CT scans, ultrasounds
- **Pathology Reports**: Tissue analysis, microbiology

### Bangladesh Context
- **Laboratory Standards**: DGHS laboratory guidelines
- **Radiology Protocols**: Bangladesh imaging standards
- **Quality Control**: Local laboratory quality requirements
- **Reference Ranges**: Age and gender-appropriate ranges
- **Accreditation**: Bangladesh medical laboratory standards

### ZARISH Extensions
- **Test Information**: Laboratory methodology and performing lab
- **Imaging Parameters**: Standard radiographic settings
- **Quality Standards**: Local quality control measures
- **Diagnostic Context**: Care setting and purpose
- **Interpretation Support**: Local clinical interpretation guidelines

### Clinical Workflow
- **Multi-disciplinary**: Radiologists, pathologists, technicians
- **Result Integration**: Links to observations and encounters
- **Quality Assurance**: Verification and validation processes
- **Report Generation**: Standardized report formats

## 📚 Related Resources

- [DiagnosticReport Profile](../profiles/zarish-diagnostic-report.md)
- [Diagnostic Codes Value Set](../value-sets/diagnostic-codes.md)
- [Laboratory Service](../../backend/ms-laboratory-service.md)
- [Radiology Service](../../backend/ms-radiology-service.md)
- [Diagnostic Service](../../backend/ms-diagnostic-service.md)

## 🧪 Validation

This example conforms to:
- **FHIR R5**: DiagnosticReport resource structure
- **ZARISH DiagnosticReport Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **DGHS Guidelines**: Laboratory and radiology standards
- **Quality Standards**: Local quality control requirements

---

**Example Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS
