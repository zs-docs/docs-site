# MedicationRequest Resource Example

## 🎯 Overview

This example demonstrates a complete MedicationRequest resource in ZARISH HIS with Bangladesh healthcare context, including local drug formulary, Rohingya camp dispensing, and NCD program medication management.

## 📋 Outpatient Medication Request Example

### General OPD Prescription

```json
{
  "resourceType": "MedicationRequest",
  "id": "medicationrequest-opd-12345",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-medication-request"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "PRESCRIPTION",
        "display": "Prescription Information"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/medication-tags",
        "code": "OPD_PRESCRIPTION",
        "display": "OPD Prescription"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "PRESCRIPTION_ID",
            "display": "Prescription Identifier"
          }
        ]
      },
      "value": "RX202401210001"
    },
    {
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
  "status": "active",
  "intent": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medication-request-intent",
        "code": "order",
        "display": "Order"
      }
    ]
  },
  "category": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
        "code": "community",
        "display": "Community"
      }
    ]
  },
  "priority": "routine",
  "doNotPerform": false,
  "medication": {
    "reference": {
      "reference": "Medication/med-paracetamol-500mg",
      "display": "Paracetamol 500mg Tablet"
    }
  },
  "subject": {
    "reference": "Patient/patient-12345",
    "display": "Mohammad Rahman"
  },
  "encounter": {
    "reference": "Encounter/encounter-gopd-12345",
    "display": "General OPD Visit - 21 Jan 2026"
  },
  "authoredOn": "2026-01-21T09:30:00+06:00",
  "requester": {
    "reference": "Practitioner/practitioner-67890",
    "display": "Dr. Fatema Akter"
  },
  "dosageInstruction": [
    {
      "text": "Take one tablet every 8 hours as needed for pain. Do not exceed 4 tablets in 24 hours.",
      "timing": {
        "repeat": {
          "boundsDuration": {
            "value": 24,
            "unit": {
              "code": "h",
              "system": "http://unitsofmeasure.org",
              "display": "hour"
            }
          },
          "count": 1,
          "frequency": {
            "coding": [
              {
                "system": "https://zs-his.github.io/docs/fhir/CodeSystem/dosing-frequency",
                "code": "EVERY_8_HOURS",
                "display": "Every 8 hours"
              }
            ]
          }
        }
      },
      "asNeededBoolean": true,
      "doseAndRate": {
        "doseQuantity": {
          "value": 1,
          "unit": {
            "code": "{tablet}",
            "system": "http://terminology.hl7.org/CodeSystem/v3/EntityCode",
            "display": "tablet"
          }
        }
      }
    }
  ],
  "dispenseRequest": {
    "quantity": {
      "value": 20,
      "unit": {
        "code": "{tablet}",
        "system": "http://terminology.hl7.org/CodeSystem/v3/EntityCode",
        "display": "tablet"
      }
    },
    "performer": {
      "reference": "Organization/pharmacy-zarish-hospital",
      "display": "ZARISH Hospital Pharmacy"
    },
    "validityPeriod": {
      "start": "2026-01-21T09:30:00+06:00",
      "end": "2026-04-21T09:30:00+06:00"
    }
  },
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/prescription-context",
      "valueString": "ACUTE_PAIN_MANAGEMENT"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-drug-formulary",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-drug-formulary",
            "code": "ESSENTIAL_MEDICINE",
            "display": "Essential Medicine List"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/generic-prescription",
      "valueBoolean": true
    }
  ]
}
```

## 🏥 NCD Program Medication Request Example

### Chronic Disease Management

```json
{
  "resourceType": "MedicationRequest",
  "id": "medicationrequest-ncd-67890",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-medication-request"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "NCD_MEDICATION",
        "display": "NCD Program Medication"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/medication-tags",
        "code": "HYPERTENSION_MANAGEMENT",
        "display": "Hypertension Management"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "NCD_PRESCRIPTION_ID",
            "display": "NCD Prescription Identifier"
          }
        ]
      },
      "value": "NCD202401210001"
    },
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "SERVICE_ID",
            "display": "Service Specific ID"
          }
        ]
      },
      "value": "NCDROH19850515010112345"
    }
  ],
  "status": "active",
  "intent": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medication-request-intent",
        "code": "plan",
        "display": "Plan"
      }
    ]
  },
  "category": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
        "code": "discharge",
        "display": "Discharge"
      }
    ]
  },
  "priority": "high",
  "doNotPerform": false,
  "medication": {
    "reference": {
      "reference": "Medication/med-amlodipine-5mg",
      "display": "Amlodipine 5mg Tablet"
    }
  },
  "subject": {
    "reference": "Patient/patient-12345",
    "display": "Mohammad Rahman"
  },
  "encounter": {
    "reference": "Encounter/encounter-ncd-clinic-12345",
    "display": "NCD Clinic Visit - 21 Jan 2026"
  },
  "authoredOn": "2026-01-21T10:15:00+06:00",
  "requester": {
    "reference": "Practitioner/practitioner-11111",
    "display": "Dr. Mohammad Ali"
  },
  "groupIdentifier": {
    "value": "NCD-HYPERTENSION-PROGRAM",
    "display": "NCD Hypertension Management Program"
  },
  "dosageInstruction": [
    {
      "text": "Take one tablet daily in the morning with food. Monitor blood pressure weekly. Report any side effects immediately.",
      "timing": {
        "repeat": {
          "boundsDuration": {
            "value": 30,
            "unit": {
              "code": "d",
              "system": "http://unitsofmeasure.org",
              "display": "day"
            }
          },
          "count": 1,
          "frequency": {
            "coding": [
              {
                "system": "https://zs-his.github.io/docs/fhir/CodeSystem/dosing-frequency",
                "code": "DAILY",
                "display": "Daily"
              }
            ]
          }
        }
      },
      "doseAndRate": {
        "doseQuantity": {
          "value": 5,
          "unit": {
            "code": "mg",
            "system": "http://unitsofmeasure.org",
            "display": "mg"
          }
        }
      }
    }
  ],
  "dispenseRequest": {
    "quantity": {
      "value": 30,
      "unit": {
        "code": "{tablet}",
        "system": "http://terminology.hl7.org/CodeSystem/v3/EntityCode",
        "display": "tablet"
      }
    },
    "performer": {
      "reference": "Organization/pharmacy-zarish-hospital",
      "display": "ZARISH Hospital Pharmacy"
    },
    "validityPeriod": {
      "start": "2026-01-21T10:15:00+06:00",
      "end": "2026-04-21T10:15:00+06:00"
    }
  },
  "substitution": {
    "allowed": true,
    "reason": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3/SubstanceAdminSubstitutionReason",
          "code": "F",
          "display": "Formulary Policy"
        }
      ]
    }
  },
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/ncd-program-info",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/ncd-programs",
            "code": "HYPERTENSION",
            "display": "Hypertension Management Program"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/medication-monitoring",
      "valueString": "BP_MONITORING_REQUIRED"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/followup-schedule",
      "valueString": "MONTHLY_FOLLOWUP"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-essential-medicine",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-drug-formulary",
            "code": "ANTI_HYPERTENSIVE",
            "display": "Anti-hypertensive (Essential)"
          }
        ]
      }
    }
  ]
}
```

## 🏕️ Rohingya Camp Medication Dispensing Example

### Camp Pharmacy Distribution

```json
{
  "resourceType": "MedicationRequest",
  "id": "medicationrequest-camp-11223",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-medication-request"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "CAMP_DISPENSING",
        "display": "Camp Medication Dispensing"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/medication-tags",
        "code": "CAMP_DISTRIBUTION",
        "display": "Camp Distribution"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "CAMP_DISPENSE_ID",
            "display": "Camp Dispense Identifier"
          }
        ]
      },
      "value": "CAMP-KTP-001-202401210001"
    },
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "FCN",
            "display": "Family Counting Number"
          }
        ]
      },
      "value": "FCN-KTP-BLOCK-A-001"
    }
  ],
  "status": "completed",
  "intent": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medication-request-intent",
        "code": "original-order",
        "display": "Original Order"
      }
    ]
  },
  "category": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
        "code": "supply",
        "display": "Supply"
      }
    ]
  },
  "priority": "routine",
  "doNotPerform": false,
  "medication": {
    "reference": {
      "reference": "Medication/med-oral-rehydration-salts",
      "display": "Oral Rehydration Salts"
    }
  },
  "subject": {
    "reference": "Patient/patient-rohingya-67890",
    "display": "Ayesha Begum"
  },
  "encounter": {
    "reference": "Encounter/encounter-health-post-12345",
    "display": "Health Post Visit - 21 Jan 2026"
  },
  "authoredOn": "2026-01-21T14:00:00+06:00",
  "requester": {
    "reference": "Practitioner/practitioner-22222",
    "display": "Camp Health Worker"
  },
  "groupIdentifier": {
    "value": "CAMP-KTP-HEALTH_POST-DISTRIBUTION",
    "display": "Kutupalong Camp Health Post Distribution"
  },
  "dosageInstruction": [
    {
      "text": "One sachet to be mixed with 1 liter of clean water. Give to child over 4 hours until diarrhea stops. Seek medical attention if no improvement after 24 hours.",
      "timing": {
        "repeat": {
          "boundsDuration": {
            "value": 1,
            "unit": {
              "code": "d",
              "system": "http://unitsofmeasure.org",
              "display": "day"
            }
          },
          "count": 1,
          "frequency": {
            "coding": [
              {
                "system": "https://zs-his.github.io/docs/fhir/CodeSystem/dosing-frequency",
                "code": "EVERY_4_HOURS",
                "display": "Every 4 hours"
              }
            ]
          }
        }
      },
      "asNeededBoolean": true,
      "doseAndRate": {
        "doseQuantity": {
          "value": 1,
          "unit": {
            "code": "{sachet}",
            "system": "http://terminology.hl7.org/CodeSystem/v3/EntityCode",
            "display": "sachet"
          }
        }
      }
    }
  ],
  "dispenseRequest": {
    "quantity": {
      "value": 10,
      "unit": {
        "code": "{sachet}",
        "system": "http://terminology.hl7.org/CodeSystem/v3/EntityCode",
        "display": "sachet"
      }
    },
    "performer": {
      "reference": "Organization/health-post-camp-ktp",
      "display": "Kutupalong Health Post"
    },
    "validityPeriod": {
      "start": "2026-01-21T14:00:00+06:00",
      "end": "2026-02-21T14:00:00+06:00"
    }
  },
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/camp-distribution-info",
      "valueString": "HEALTH_POST_ORS_DISTRIBUTION"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/unhcr-standard",
      "valueBoolean": true
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/emergency-medication",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/emergency-medication-types",
            "code": "ORS_TREATMENT",
            "display": "ORS Treatment Kit"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/camp-context",
      "valueString": "ROUTINE_CAMP_DISTRIBUTION"
    }
  ]
}
```

## 🔍 Key Features Demonstrated

### Medication Request Types
- **OPD Prescription**: General outpatient medication orders
- **NCD Management**: Chronic disease long-term medication
- **Camp Distribution**: Refugee camp medication dispensing

### Bangladesh Context
- **Drug Formulary**: Essential Medicine List integration
- **Generic Substitution**: Formulary policy compliance
- **Prescription Standards**: DGHS and DGDA guidelines
- **Pharmacy Integration**: Local dispensing practices

### Rohingya Refugee Context
- **Camp Distribution**: Health post medication distribution
- **Emergency Medication**: ORS and emergency treatment kits
- **Family Tracking**: FCN-based medication distribution
- **UNHCR Standards**: Refugee medication guidelines

### ZARISH Extensions
- **Prescription Context**: Clinical care setting
- **NCD Program Info**: Chronic disease management
- **Medication Monitoring**: Follow-up requirements
- **Camp Distribution**: Refugee-specific dispensing
- **Emergency Medication**: Emergency treatment protocols

### Clinical Workflow
- **Dosage Instructions**: Clear administration guidelines
- **Timing and Frequency**: Precise dosing schedules
- **Dispense Requests**: Pharmacy integration
- **Substitution Policies**: Generic medication rules
- **Monitoring Requirements**: Follow-up and tracking

## 📚 Related Resources

- [MedicationRequest Profile](../profiles/zarish-medication-request.md)
- [Bangladesh Drug Formulary](../value-sets/bd-drug-formulary.md)
- [Medication Administration](../value-sets/medication-administration.md)
- [Pharmacy Service](../../backend/ms-pharmacy-service.md)
- [NCD Program](../../standards/healthcare-services-classification.md)

## 🧪 Validation

This example conforms to:
- **FHIR R5**: MedicationRequest resource structure
- **ZARISH MedicationRequest Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **DGHS Guidelines**: Prescription and dispensing standards
- **UNHCR Standards**: Refugee medication distribution

---

**Example Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS, UNHCR
