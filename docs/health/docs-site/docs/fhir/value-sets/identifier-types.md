# Identifier Types Value Set

## 🎯 Overview

Value set for identifier types used in ZARISH HIS with Bangladesh healthcare context and Rohingya refugee integration.

## 📋 Value Set Definition

```json
{
  "resourceType": "ValueSet",
  "id": "identifier-types",
  "url": "https://zs-his.github.io/docs/fhir/ValueSet/identifier-types",
  "name": "IdentifierTypes",
  "title": "Identifier Types",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Value set for identifier types used in ZARISH HIS with Bangladesh healthcare context.",
  "compose": {
    "include": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
        "concept": [
          {"code": "NID", "display": "National ID"},
          {"code": "BIRTH_CERT", "display": "Birth Certificate"},
          {"code": "PASSPORT", "display": "Passport"},
          {"code": "PROGRESS_ID", "display": "ProGress ID"},
          {"code": "MRC", "display": "MRC Card"},
          {"code": "FCN", "display": "Family Counting Number"},
          {"code": "BMDC", "display": "BMDC Registration"},
          {"code": "SERVICE_ID", "display": "Service Specific ID"},
          {"code": "VISIT_ID", "display": "Visit Specific ID"},
          {"code": "APPOINTMENT_ID", "display": "Appointment ID"},
          {"code": "PRESCRIPTION_ID", "display": "Prescription ID"},
          {"code": "LAB_REPORT_ID", "display": "Laboratory Report ID"},
          {"code": "RADIOLOGY_REPORT_ID", "display": "Radiology Report ID"},
          {"code": "PROCEDURE_ID", "display": "Procedure ID"},
          {"code": "DELIVERY_ID", "display": "Delivery ID"},
          {"code": "CAMP_APPOINTMENT_ID", "display": "Camp Appointment ID"},
          {"code": "NCD_APPOINTMENT_ID", "display": "NCD Appointment ID"},
          {"code": "SURGERY_ID", "display": "Surgery ID"},
          {"code": "EMERGENCY_ID", "display": "Emergency ID"}
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
