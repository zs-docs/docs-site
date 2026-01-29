# Encounter Resource Example

## 🎯 Overview

This example demonstrates a complete Encounter resource in ZARISH HIS with Bangladesh healthcare context, showing both outpatient and inpatient encounters.

## 📋 Outpatient Encounter Example

### General OPD Visit

```json
{
  "resourceType": "Encounter",
  "id": "encounter-gopd-12345",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-encounter"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "CLINICAL",
        "display": "Clinical Encounter"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/encounter-tags",
        "code": "GOPD",
        "display": "General Outpatient Department"
      }
    ]
  },
  "identifier": [
    {
      "use": "usual",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "VISIT_ID",
            "display": "Visit Identifier"
          }
        ]
      },
      "value": "GOPD202401210001"
    },
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "SERVICE_ID",
            "display": "Service Specific ID"
          }
        ]
      },
      "value": "GOPDBD19900101010112345"
    }
  ],
  "status": "finished",
  "class": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3/ActCode",
        "code": "AMB",
        "display": "Ambulatory"
      }
    ]
  },
  "type": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/encounter-types",
          "code": "GENERAL_CONSULTATION",
          "display": "General Consultation"
        }
      ]
    }
  ],
  "subject": {
    "reference": "Patient/patient-12345",
    "display": "Mohammad Rahman"
  },
  "participant": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationType",
            "code": "PPRF",
            "display": "primary performer"
          }
        ]
      },
      "individual": {
        "reference": "Practitioner/practitioner-67890",
        "display": "Dr. Fatema Akter"
      },
      "period": {
        "start": "2026-01-21T09:00:00+06:00",
        "end": "2026-01-21T09:30:00+06:00"
      }
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationType",
            "code": "PART",
            "display": "participation"
          }
        ]
      },
      "individual": {
        "reference": "Practitioner/practitioner-12345",
        "display": "Nurse Amina Begum"
      },
      "period": {
        "start": "2026-01-21T09:00:00+06:00",
        "end": "2026-01-21T09:30:00+06:00"
      }
    }
  ],
  "period": {
    "start": "2026-01-21T09:00:00+06:00",
    "end": "2026-01-21T09:45:00+06:00"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/encounter-reason-codes",
          "code": "ROUTINE_CHECKUP",
          "display": "Routine Check-up"
        }
      ]
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/condition-12345",
        "display": "Essential Hypertension"
      },
      "use": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/diagnosis-role",
            "code": "WORKING",
            "display": "Working Diagnosis"
          }
        ]
      },
      "rank": 1
    }
  ],
  "serviceProvider": {
    "reference": "Organization/org-zarish-hospital",
    "display": "ZARISH Hospital"
  },
  "location": {
    "reference": "Location/location-gopd-ukhiya",
    "display": "ZARISH Hospital - Ukhiya OPD"
  },
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/encounter-service-type",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/service-types",
            "code": "GOPD",
            "display": "General Outpatient Department"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/appointment-unique-id",
      "valueString": "GOPDBD19900101010112345"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/visit-unique-id",
      "valueString": "GOPDBD19900101123456789"
    }
  ]
}
```

## 🏥 Inpatient Encounter Example

### Hospital Admission

```json
{
  "resourceType": "Encounter",
  "id": "encounter-ipd-67890",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-encounter"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "INPATIENT",
        "display": "Inpatient Encounter"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/encounter-tags",
        "code": "IPD",
        "display": "Inpatient Department"
      }
    ]
  },
  "identifier": [
    {
      "use": "usual",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "ADMISSION_ID",
            "display": "Admission Identifier"
          }
        ]
      },
      "value": "IPD202401210001"
    },
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "BED_ID",
            "display": "Bed Identifier"
          }
        ]
      },
      "value": "WARD-A-BED-123"
    }
  ],
  "status": "in-progress",
  "class": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3/ActCode",
        "code": "IMP",
        "display": "Inpatient"
      }
    ]
  },
  "type": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/encounter-types",
          "code": "EMERGENCY_ADMISSION",
          "display": "Emergency Admission"
        }
      ]
    }
  ],
  "subject": {
    "reference": "Patient/patient-rohingya-67890",
    "display": "Ayesha Begum"
  },
  "participant": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationType",
            "code": "ATND",
            "display": "attender"
          }
        ]
      },
      "individual": {
        "reference": "Practitioner/practitioner-11111",
        "display": "Dr. Mohammad Ali"
      },
      "period": {
        "start": "2026-01-20T22:00:00+06:00",
        "end": "2026-01-21T08:00:00+06:00"
      }
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationType",
            "code": "PPRF",
            "display": "primary performer"
          }
        ]
      },
      "individual": {
        "reference": "Practitioner/practitioner-22222",
        "display": "Dr. Ayesha Siddiqua"
      },
      "period": {
        "start": "2026-01-21T08:00:00+06:00",
        "end": "2026-01-21T16:00:00+06:00"
      }
    }
  ],
  "period": {
    "start": "2026-01-20T22:00:00+06:00",
    "end": "2026-01-25T10:00:00+06:00"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/encounter-reason-codes",
          "code": "EMERGENCY",
          "display": "Emergency Admission"
        }
      ]
    }
  ],
  "hospitalization": {
    "dischargeDisposition": {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/discharge-disposition",
          "code": "HOME",
          "display": "Discharged to Home"
        }
      ]
    },
    "preAdmissionIdentifier": {
      "value": "REF-EMERGENCY-2024-001"
    },
    "admitSource": {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/admit-source",
          "code": "EMERGENCY_DEPT",
          "display": "Emergency Department"
        }
      ]
    },
    "reAdmission": false
  },
  "location": {
    "reference": "Location/location-ipd-ward-a",
    "display": "ZARISH Hospital - Ward A - Bed 123"
  },
  "serviceProvider": {
    "reference": "Organization/org-zarish-hospital",
    "display": "ZARISH Hospital"
  },
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/encounter-service-type",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/service-types",
            "code": "IPD",
            "display": "Inpatient Department"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/ward-information",
      "valueString": "WARD-A-FEMALE"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bed-assignment",
      "valueString": "WARD-A-BED-123"
    }
  ]
}
```

## 🔍 Key Features Demonstrated

### Encounter Types
- **Outpatient**: AMB class, general consultation
- **Inpatient**: IMP class, hospital admission
- **Emergency**: Emergency admission and care

### Bangladesh Context
- **Service Types**: GOPD, IPD classification
- **Healthcare Facilities**: Ward and bed management
- **Practitioner Roles**: Doctors, nurses, specialists
- **Location Management**: Facility and ward tracking

### ZARISH Extensions
- **Service Type**: Detailed service classification
- **Unique IDs**: Appointment and visit identifiers
- **Ward Information**: Ward type and bed assignment
- **Admission Source**: Emergency department referral
- **Discharge Disposition**: Discharge planning

### Clinical Workflow
- **Multi-disciplinary Team**: Multiple practitioners
- **Diagnosis Integration**: Condition references
- **Period Management**: Admission and discharge dates
- **Location Tracking**: Facility and ward information

## 📚 Related Resources

- [Encounter Profile](../profiles/zarish-encounter.md)
- [Encounter Types Value Set](../value-sets/encounter-types.md)
- [Service Types Value Set](../value-sets/service-types.md)
- [Practitioner Registry](../../backend/ms-practitioner-registry.md)
- [Location Management](../../backend/ms-bed-management.md)

## 🧪 Validation

This example conforms to:
- **FHIR R5**: Encounter resource structure
- **ZARISH Encounter Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **Clinical Workflow**: Complete encounter lifecycle

---

**Example Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS
