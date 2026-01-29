# Appointment Types Value Set

## 🎯 Overview

Value set for appointment types used in ZARISH HIS with Bangladesh healthcare context and Rohingya refugee integration.

## 📋 Value Set Definition

```json
{
  "resourceType": "ValueSet",
  "id": "appointment-types",
  "url": "https://zs-his.github.io/docs/fhir/ValueSet/appointment-types",
  "name": "AppointmentTypes",
  "title": "Appointment Types",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Value set for appointment types used in ZARISH HIS with Bangladesh healthcare context.",
  "compose": {
    "include": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/appointment-types",
        "concept": [
          {"code": "ROUTINE_CONSULTATION", "display": "Routine Consultation"},
          {"code": "FOLLOWUP_CONSULTATION", "display": "Follow-up Consultation"},
          {"code": "EMERGENCY_CONSULTATION", "display": "Emergency Consultation"},
          {"code": "SPECIALIST_CONSULTATION", "display": "Specialist Consultation"},
          {"code": "NCD_FOLLOWUP", "display": "NCD Follow-up"},
          {"code": "MATERNAL_CHECKUP", "display": "Maternal Check-up"},
          {"code": "CHILD_HEALTH_CHECKUP", "display": "Child Health Check-up"},
          {"code": "IMMUNIZATION", "display": "Immunization Appointment"},
          {"code": "CAMP_HEALTH_POST", "display": "Camp Health Post"},
          {"code": "CAMP_ROUTINE_CHECK", "display": "Camp Routine Check"},
          {"code": "CAMP_EMERGENCY", "display": "Camp Emergency"},
          {"code": "CAMP_MATERNAL", "display": "Camp Maternal Care"},
          {"code": "CAMP_CHILD_HEALTH", "display": "Camp Child Health"},
          {"code": "CAMP_IMMUNIZATION", "display": "Camp Immunization"},
          {"code": "CAMP_NUTRITION", "display": "Camp Nutrition Program"},
          {"code": "CAMP_MENTAL_HEALTH", "display": "Camp Mental Health"},
          {"code": "CAMP_HEALTH_EDUCATION", "display": "Camp Health Education"},
          {"code": "CAMP_SCREENING", "display": "Camp Health Screening"}
        ]
      }
    ]
  }
}
```

---

**Value Set Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5
