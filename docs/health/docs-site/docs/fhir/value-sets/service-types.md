# Service Types Value Set

## 🎯 Overview

Value set for healthcare service types used in ZARISH HIS with Bangladesh healthcare context and Rohingya refugee integration.

## 📋 Value Set Definition

```json
{
  "resourceType": "ValueSet",
  "id": "service-types",
  "url": "https://zs-his.github.io/docs/fhir/ValueSet/service-types",
  "name": "ServiceTypes",
  "title": "Service Types",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Value set for healthcare service types used in ZARISH HIS with Bangladesh healthcare context.",
  "compose": {
    "include": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/service-types",
        "concept": [
          {"code": "GOPD", "display": "General Outpatient Department"},
          {"code": "SOPD", "display": "Specialist Outpatient Department"},
          {"code": "IPD", "display": "Inpatient Department"},
          {"code": "EMERGENCY", "display": "Emergency Department"},
          {"code": "DIAGNOSTIC", "display": "Diagnostic Services"},
          {"code": "LABORATORY", "display": "Laboratory Services"},
          {"code": "RADIOLOGY", "display": "Radiology Services"},
          {"code": "PHARMACY", "display": "Pharmacy Services"},
          {"code": "NCD", "display": "Non-Communicable Disease Services"},
          {"code": "MATERNAL", "display": "Maternal Health Services"},
          {"code": "CHILD_HEALTH", "display": "Child Health Services"},
          {"code": "IMMUNIZATION", "display": "Immunization Services"},
          {"code": "CAMP_HEALTH", "display": "Camp Health Services"},
          {"code": "REFUGEE_HEALTH", "display": "Refugee Health Services"},
          {"code": "PUBLIC_HEALTH", "display": "Public Health Services"}
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
