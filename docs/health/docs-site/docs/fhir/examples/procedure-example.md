# Procedure Resource Example

## 🎯 Overview

This example demonstrates a complete Procedure resource in ZARISH HIS with Bangladesh healthcare context, including surgical procedures, emergency care, and maternal health interventions.

## 📋 Emergency Procedure Example

### Emergency Stabilization

```json
{
  "resourceType": "Procedure",
  "id": "procedure-emergency-12345",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-procedure"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "EMERGENCY_PROCEDURE",
        "display": "Emergency Procedure"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/procedure-tags",
        "code": "EMERGENCY_STABILIZATION",
        "display": "Emergency Stabilization"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "PROCEDURE_ID",
            "display": "Procedure Identifier"
          }
        ]
      },
      "value": "EMERG202401210001"
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
      "value": "EMERGBD19900101010112345"
    }
  ],
  "status": "in-progress",
  "category": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "39481002",
        "display": "Emergency department procedure"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "410462004",
        "display": "Cardiopulmonary resuscitation"
      },
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-procedure-codes",
        "code": "EMERGENCY_STABILIZATION",
        "display": "Emergency Stabilization Protocol"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-12345",
    "display": "Mohammad Rahman"
  },
  "encounter": {
    "reference": "Encounter/encounter-emergency-12345",
    "display": "Emergency Department Visit - 21 Jan 2026"
  },
  "performedDateTime": "2026-01-21T22:15:00+06:00",
  "recorder": {
    "reference": "Practitioner/practitioner-11111",
    "display": "Dr. Mohammad Ali"
  },
  "asserter": {
    "reference": "Practitioner/practitioner-22222",
    "display": "Dr. Ayesha Siddiqua"
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
        "reference": "Practitioner/practitioner-11111",
        "display": "Dr. Mohammad Ali"
      },
      "period": {
        "start": "2026-01-21T22:15:00+06:00",
        "end": "2026-01-21T22:45:00+06:00"
      }
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "ANES",
            "display": "anesthesist"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-33344",
        "display": "Dr. Kamal Hossain"
      },
      "period": {
        "start": "2026-01-21T22:15:00+06:00",
        "end": "2026-01-21T23:30:00+06:00"
      }
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "NURSE",
            "display": "nurse"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-12345",
        "display": "Nurse Amina Begum"
      },
      "period": {
        "start": "2026-01-21T22:15:00+06:00",
        "end": "2026-01-21T23:30:00+06:00"
      }
    }
  ],
  "location": {
    "reference": "Location/location-emergency-dept",
    "display": "ZARISH Hospital - Emergency Department"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "19730007",
          "display": "Cardiac arrest"
        }
      ]
    }
  ],
  "bodySite": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "69633000",
          "display": "Chest wall structure"
        }
      ]
    }
  ],
  "outcome": "successful",
  "report": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/procedure-outcome",
          "code": "EMERGENCY_STABILIZATION_REPORT",
          "display": "Emergency Stabilization Report"
        }
      ]
    }
  ],
  "complication": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "162264004",
          "display": "Hypotension"
        }
      ]
    }
  ],
  "usedReference": [
    {
      "reference": "Device/device-ventilator-001",
      "display": "Portable Ventilator"
    },
    {
      "reference": "Medication/med-adrenaline-1mg",
      "display": "Adrenaline 1mg"
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/emergency-triage-score",
      "valueInteger": 3
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/procedure-urgency",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/procedure-urgency",
            "code": "IMMEDIATE",
            "display": "Immediate"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-emergency-protocol",
      "valueString": "DGHS_EMERGENCY_STABILIZATION_V2"
    }
  ]
}
```

## 🏥 Surgical Procedure Example

### Emergency Surgery

```json
{
  "resourceType": "Procedure",
  "id": "procedure-surgery-67890",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-procedure"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "SURGICAL_PROCEDURE",
        "display": "Surgical Procedure"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/procedure-tags",
        "code": "EMERGENCY_SURGERY",
        "display": "Emergency Surgery"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "SURGERY_ID",
            "display": "Surgery Identifier"
          }
        ]
      },
      "value": "SURG202401210001"
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
      "value": "SURGBD19900101010112345"
    }
  ],
  "status": "completed",
  "category": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "396485001",
        "display": "General surgical procedure"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "80146002",
        "display": "Appendectomy"
      },
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-procedure-codes",
        "code": "EMERGENCY_APPENDECTOMY",
        "display": "Emergency Appendectomy"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-12345",
    "display": "Mohammad Rahman"
  },
  "encounter": {
    "reference": "Encounter/encounter-ipd-67890",
    "display": "Inpatient Admission - Surgery"
  },
  "performedDateTime": "2026-01-21T23:30:00+06:00",
  "recorder": {
    "reference": "Practitioner/practitioner-44444",
    "display": "Dr. Ahmed Hassan"
  },
  "asserter": {
    "reference": "Practitioner/practitioner-55555",
    "display": "Dr. Fatema Akter"
  },
  "performer": [
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "PPRF",
            "display": "primary surgeon"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-44444",
        "display": "Dr. Ahmed Hassan"
      },
      "period": {
        "start": "2026-01-21T23:30:00+06:00",
        "end": "2026-01-22T01:30:00+06:00"
      }
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "ANES",
            "display": "anesthesist"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-66666",
        "display": "Dr. Kamal Hossain"
      },
      "period": {
        "start": "2026-01-21T23:30:00+06:00",
        "end": "2026-01-22T02:00:00+06:00"
      }
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "NURSE",
            "display": "scrub nurse"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-77777",
        "display": "Nurse Salma Begum"
      },
      "period": {
        "start": "2026-01-21T23:30:00+06:00",
        "end": "2026-01-22T02:00:00+06:00"
      }
    }
  ],
  "location": {
    "reference": "Location/location-or-theater-1",
    "display": "ZARISH Hospital - Operating Theater 1"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "357009",
          "display": "Acute appendicitis"
        }
      ]
    }
  ],
  "bodySite": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "91760002",
          "display": "Appendix structure"
        }
      ]
    }
  ],
  "outcome": "successful",
  "report": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/procedure-outcome",
          "code": "SURGERY_REPORT",
          "display": "Surgical Procedure Report"
        }
      ]
    }
  ],
  "complication": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "28589001",
          "display": "Postoperative infection"
        }
      ]
    }
  ],
  "usedReference": [
    {
      "reference": "Device/device-anesthesia-machine-001",
      "display": "Anesthesia Machine"
    },
    {
      "reference": "Device/device-surgical-instruments-001",
      "display": "Surgical Instrument Set"
    },
    {
      "reference": "Medication/med-propofol-2mg",
      "display": "Propofol 2mg"
    },
    {
      "reference": "Supply/supply-sutures-001",
      "display": "Surgical Sutures"
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/surgical-priority",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/surgical-priority",
            "code": "EMERGENCY",
            "display": "Emergency Priority"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/anesthesia-type",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/anesthesia-types",
            "code": "GENERAL_ANESTHESIA",
            "display": "General Anesthesia"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-surgical-protocol",
      "valueString": "DGHS_EMERGENCY_SURGERY_V3"
    }
  ]
}
```

## 🤱 Maternal Health Procedure Example

### Normal Delivery

```json
{
  "resourceType": "Procedure",
  "id": "procedure-delivery-11223",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-procedure"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "MATERNAL_HEALTH",
        "display": "Maternal Health Procedure"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/procedure-tags",
        "code": "NORMAL_DELIVERY",
        "display": "Normal Delivery"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "DELIVERY_ID",
            "display": "Delivery Identifier"
          }
        ]
      },
      "value": "DEL202401210001"
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
      "value": "SRHBD19900101010112345"
    }
  ],
  "status": "completed",
  "category": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "386613000",
        "display": "Obstetric procedure"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "48778002",
        "display": "Normal vaginal delivery"
      },
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bd-procedure-codes",
        "code": "NORMAL_DELIVERY_PROTOCOL",
        "display": "Normal Delivery Protocol"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-rohingya-67890",
    "display": "Ayesha Begum"
  },
  "encounter": {
    "reference": "Encounter/encounter-maternity-ward-12345",
    "display": "Maternity Ward Admission - 21 Jan 2026"
  },
  "performedDateTime": "2026-01-21T15:30:00+06:00",
  "recorder": {
    "reference": "Practitioner/practitioner-88888",
    "display": "Dr. Ayesha Khatun"
  },
  "asserter": {
    "reference": "Practitioner/practitioner-99999",
    "display": "Senior Midwife"
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
        "reference": "Practitioner/practitioner-88888",
        "display": "Dr. Ayesha Khatun"
      },
      "period": {
        "start": "2026-01-21T15:30:00+06:00",
        "end": "2026-01-21T17:45:00+06:00"
      }
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "NURSE",
            "display": "nurse"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-77777",
        "display": "Nurse Salma Begum"
      },
      "period": {
        "start": "2026-01-21T15:30:00+06:00",
        "end": "2026-01-21T17:45:00+06:00"
      }
    },
    {
      "function": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationFunction",
            "code": "ANES",
            "display": "anesthesist"
          }
        ]
      },
      "actor": {
        "reference": "Practitioner/practitioner-66666",
        "display": "Dr. Kamal Hossain"
      },
      "period": {
        "start": "2026-01-21T15:30:00+06:00",
        "end": "2026-01-21T16:30:00+06:00"
      }
    }
  ],
  "location": {
    "reference": "Location/location-delivery-room-1",
    "display": "ZARISH Hospital - Delivery Room 1"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "308200009",
          "display": "Full term normal pregnancy"
        }
      ]
    }
  ],
  "bodySite": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "70762002",
          "display": "Pelvic cavity structure"
        }
      ]
    }
  ],
  "outcome": "successful",
  "report": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/procedure-outcome",
          "code": "DELIVERY_REPORT",
          "display": "Delivery Report"
        }
      ]
    }
  ],
  "usedReference": [
    {
      "reference": "Device/device-fetal-monitor-001",
      "display": "Fetal Heart Monitor"
    },
    {
      "reference": "Device/device-delivery-bed-001",
      "display": "Delivery Bed"
    },
    {
      "reference": "Supply/supply-delivery-kit-001",
      "display": "Delivery Kit"
    },
    {
      "reference": "Medication/med-oxytocin-10iu",
      "display": "Oxytocin 10 IU"
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/birth-outcome",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/birth-outcomes",
            "code": "LIVE_BIRTH",
            "display": "Live Birth"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/maternal-care-context",
      "valueString": "CEMONC_PROTOCOL"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-maternal-protocol",
      "valueString": "DGHS_NORMAL_DELIVERY_V2"
    }
  ]
}
```

## 🔍 Key Features Demonstrated

### Procedure Types
- **Emergency Procedures**: Stabilization, emergency surgery, triage
- **Surgical Procedures**: Emergency and elective surgeries
- **Maternal Health**: Normal delivery, CEmONC services
- **Diagnostic Procedures**: Imaging, endoscopy, biopsies

### Bangladesh Context
- **Surgical Protocols**: DGHS emergency surgery guidelines
- **Maternal Health**: CEmONC (Comprehensive Emergency Obstetric Care)
- **Anesthesia Standards**: Local anesthesia protocols
- **Emergency Triage**: Bangladesh emergency care standards
- **Specialist Training**: Local medical training requirements

### Rohingya Refugee Context
- **Emergency Obstetrics**: Camp-based emergency deliveries
- **Surgical Prioritization**: Emergency vs elective procedures
- **Maternal Health**: Refugee-specific maternal care protocols
- **UNHCR Standards**: Emergency obstetric care guidelines

### ZARISH Extensions
- **Procedure Priority**: Emergency classification system
- **Surgical Priority**: Urgency and complexity scoring
- **Anesthesia Type**: Anesthesia method classification
- **Maternal Care Context**: CEmONC protocol information
- **Birth Outcomes**: Detailed birth outcome tracking
- **Bangladesh Protocol**: Local clinical guideline integration

### Clinical Workflow
- **Multi-disciplinary Team**: Surgeons, anesthesiologists, nurses
- **Pre-operative Assessment**: Patient evaluation and preparation
- **Intra-operative Documentation**: Real-time procedure recording
- **Post-operative Care**: Recovery and follow-up planning

## 📚 Related Resources

- [Procedure Profile](../profiles/zarish-procedure.md)
- [Procedure Codes Value Set](../value-sets/procedure-codes.md)
- [Surgery Service](../../backend/ms-surgery-service.md)
- [Maternal Health Service](../../backend/ms-maternal-health-service.md)
- [Emergency Service](../../backend/ms-emergency-service.md)

## 🧪 Validation

This example conforms to:
- **FHIR R5**: Procedure resource structure
- **ZARISH Procedure Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **DGHS Guidelines**: Emergency and surgical protocols
- **WHO Standards**: Emergency obstetric care guidelines

---

**Example Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS
