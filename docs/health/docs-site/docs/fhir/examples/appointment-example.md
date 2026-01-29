# Appointment Resource Example

## 🎯 Overview

This example demonstrates a complete Appointment resource in ZARISH HIS with Bangladesh healthcare context, including OPD appointments, NCD clinic visits, and Rohingya camp health post scheduling.

## 📋 OPD Appointment Example

### General Outpatient Visit

```json
{
  "resourceType": "Appointment",
  "id": "appointment-opd-12345",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-appointment"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "APPOINTMENT",
        "display": "Appointment Information"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-tags",
        "code": "GOPD_APPOINTMENT",
        "display": "GOPD Appointment"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "APPOINTMENT_ID",
            "display": "Appointment Identifier"
          }
        ]
      },
      "value": "APPT202401210001"
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
  "status": "booked",
  "serviceCategory": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/service-categories",
          "code": "GENERAL_CONSULTATION",
          "display": "General Consultation"
        }
      ]
    }
  ],
  "serviceType": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-types",
          "code": "ROUTINE_CONSULTATION",
          "display": "Routine Consultation"
        }
      ]
    }
  ],
  "specialty": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationType",
          "code": "GP",
          "display": "General Practice"
        }
      ]
    }
  ],
  "appointmentType": "routine",
  "reasonCode": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-reason-codes",
          "code": "ROUTINE_CHECKUP",
          "display": "Routine Check-up"
        }
      ]
    }
  ],
  "priority": 5,
  "description": "Routine general consultation for follow-up visit",
  "minutesDuration": 15,
  "slot": [
    {
      "extension": [
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/slot-availability",
          "valueString": "AVAILABLE"
        }
      ],
      "start": "2026-01-21T09:00:00+06:00",
      "end": "2026-01-21T09:15:00+06:00",
      "freeBusyType": "free"
    }
  ],
  "created": "2026-01-20T10:30:00+06:00",
  "participant": [
    {
      "actor": {
        "reference": "Patient/patient-12345",
        "display": "Mohammad Rahman"
      },
      "status": "accepted",
      "required": "required"
    }
  ],
  "requestedPeriod": {
    "start": "2026-01-21T09:00:00+06:00",
    "end": "2026-01-21T09:15:00+06:00"
  },
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/appointment-unique-id",
      "valueString": "GOPDBD19900101123456789"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/visit-unique-id",
      "valueString": "GOPDBD19900101123456790"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/appointment-context",
      "valueString": "ROUTINE_FOLLOWUP"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-appointment-protocol",
      "valueString": "DGHS_OPD_APPOINTMENT_V2"
    }
  ]
}
```

## 🏥 NCD Clinic Appointment Example

### Chronic Disease Management

```json
{
  "resourceType": "Appointment",
  "id": "appointment-ncd-67890",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-appointment"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "NCD_APPOINTMENT",
        "display": "NCD Clinic Appointment"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-tags",
        "code": "HYPERTENSION_FOLLOWUP",
        "display": "Hypertension Follow-up"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "NCD_APPOINTMENT_ID",
            "display": "NCD Appointment Identifier"
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
  "status": "booked",
  "serviceCategory": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/service-categories",
          "code": "CHRONIC_DISEASE_MANAGEMENT",
          "display": "Chronic Disease Management"
        }
      ]
    }
  ],
  "serviceType": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-types",
          "code": "NCD_FOLLOWUP",
          "display": "NCD Follow-up"
        }
      ]
    }
  ],
  "specialty": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationType",
          "code": "CARD",
          "display": "Cardiology"
        }
      ]
    }
  ],
  "appointmentType": "routine",
  "reasonCode": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-reason-codes",
          "code": "NCD_FOLLOWUP",
          "display": "NCD Follow-up Visit"
        }
      ]
    }
  ],
  "priority": 4,
  "description": "Monthly follow-up for hypertension management including medication review and vital signs monitoring",
  "minutesDuration": 30,
  "slot": [
    {
      "extension": [
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/slot-availability",
          "valueString": "NCD_CLINIC_SLOT"
        }
      ],
      "start": "2026-01-21T10:00:00+06:00",
      "end": "2026-01-21T10:30:00+06:00",
      "freeBusyType": "busy"
    }
  ],
  "created": "2026-01-20T10:15:00+06:00",
  "participant": [
    {
      "actor": {
        "reference": "Patient/patient-12345",
        "display": "Mohammad Rahman"
      },
      "status": "accepted",
      "required": "required"
    }
  ],
  "requestedPeriod": {
    "start": "2026-01-21T10:00:00+06:00",
    "end": "2026-01-21T10:30:00+06:00"
  },
  "supportingInformation": [
    {
      "reference": {
        "reference": "Observation/observation-bp-12345",
        "display": "Blood Pressure - 15 Jan 2026"
      },
      "display": "Previous blood pressure readings"
    },
    {
      "reference": {
        "reference": "MedicationRequest/medicationrequest-ncd-67890",
        "display": "Hypertension Medication - 21 Dec 2025"
      },
      "display": "Current medication regimen"
    }
  ],
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
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/appointment-unique-id",
      "valueString": "NCDROH19850515010112345"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/visit-unique-id",
      "valueString": "NCDROH19850515123456789"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/followup-requirements",
      "valueString": "VITAL_SIGNS_REQUIRED"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bd-ncd-protocol",
      "valueString": "DGHS_NCD_MANAGEMENT_V3"
    }
  ]
}
```

## 🏕️ Rohingya Camp Health Post Example

### Camp Health Service

```json
{
  "resourceType": "Appointment",
  "id": "appointment-camp-11223",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-appointment"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "CAMP_HEALTH_POST",
        "display": "Camp Health Post Appointment"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-tags",
        "code": "CAMP_HEALTH_SERVICE",
        "display": "Camp Health Service"
      }
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "CAMP_APPOINTMENT_ID",
            "display": "Camp Appointment Identifier"
          }
        ]
      },
      "value": "CAMP-KTP-202401210001"
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
  "status": "booked",
  "serviceCategory": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/service-categories",
          "code": "CAMP_HEALTH_SERVICE",
          "display": "Camp Health Service"
        }
      ]
    }
  ],
  "serviceType": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-types",
          "code": "CAMP_HEALTH_POST",
          "display": "Camp Health Post"
        }
      ]
    }
  ],
  "specialty": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3/ParticipationType",
          "code": "PH",
          "display": "Public Health"
        }
      ]
    }
  ],
  "appointmentType": "routine",
  "reasonCode": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-reason-codes",
          "code": "ROUTINE_HEALTH_CHECK",
          "display": "Routine Health Check"
        }
      ]
    }
  ],
  "priority": 3,
  "description": "Routine health check for camp residents including growth monitoring, health education, and preventive care",
  "minutesDuration": 20,
  "slot": [
    {
      "extension": [
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/slot-availability",
          "valueString": "CAMP_HEALTH_POST_SLOT"
        }
      ],
      "start": "2026-01-21T14:00:00+06:00",
      "end": "2026-01-21T14:20:00+06:00",
      "freeBusyType": "busy"
    }
  ],
  "created": "2026-01-20T14:15:00+06:00",
  "participant": [
    {
      "actor": {
        "reference": "Patient/patient-rohingya-67890",
        "display": "Ayesha Begum"
      },
      "status": "accepted",
      "required": "required"
    }
  ],
  "requestedPeriod": {
    "start": "2026-01-21T14:00:00+06:00",
    "end": "2026-01-21T14:20:00+06:00"
  },
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/camp-health-service-type",
      "valueString": "ROUTINE_HEALTH_CHECK"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/camp-context",
      "valueString": "KUTPALONG_REGISTERED_CAMP"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/unhcr-standard",
      "valueBoolean": true
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/appointment-unique-id",
      "valueString": "CAMPROH19850521010112345"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/visit-unique-id",
      "valueString": "CAMPROH19850521123456789"
    }
  ]
}
```

## 🔍 Key Features Demonstrated

### Appointment Types
- **OPD Appointments**: General consultations and follow-ups
- **NCD Clinic**: Chronic disease management appointments
- **Camp Health Post**: Refugee camp health services

### Bangladesh Context
- **Appointment Protocols**: DGHS guidelines for scheduling
- **Service Categories**: Comprehensive healthcare service classification
- **Specialist Referrals**: Bangladesh specialist consultation system
- **Priority Systems**: Emergency and routine appointment prioritization

### Rohingya Refugee Context
- **Camp Health Posts**: Regular health check scheduling
- **Family Tracking**: FCN-based appointment management
- **UNHCR Standards**: Refugee health service guidelines
- **Community Health**: Preventive care and health education

### ZARISH Extensions
- **Appointment Unique ID**: Service-specific identifier system
- **Visit Unique ID**: Individual visit tracking
- **Service Type**: Detailed appointment classification
- **Camp Context**: Refugee-specific appointment information
- **Follow-up Requirements**: NCD monitoring and tracking

### Clinical Workflow
- **Multi-disciplinary Teams**: Specialist and general practitioner coordination
- **Supporting Information**: Integration with observations and medications
- **Slot Management**: Time slot availability and booking
- **Priority Scheduling**: Emergency and routine appointment handling

## 📚 Related Resources

- [Appointment Profile](../profiles/zarish-appointment.md)
- [Appointment Types Value Set](../value-sets/appointment-types.md)
- [Appointment Service](../../backend/ms-appointment-service.md)
- [Practitioner Registry](../../backend/ms-practitioner-registry.md)

## 🧪 Validation

This example conforms to:
- **FHIR R5**: Appointment resource structure
- **ZARISH Appointment Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **DGHS Guidelines**: Appointment scheduling protocols
- **UNHCR Standards**: Refugee health service guidelines

---

**Example Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS, UNHCR
