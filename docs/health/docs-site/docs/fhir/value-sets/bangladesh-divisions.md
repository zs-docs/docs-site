# Bangladesh Divisions Value Set

## 🎯 Overview

Value set for Bangladesh administrative divisions (ADM1 level) used in ZARISH HIS for geographic boundaries integration.

## 📋 Value Set Definition

```json
{
  "resourceType": "ValueSet",
  "id": "bangladesh-divisions",
  "url": "https://zs-his.github.io/docs/fhir/ValueSet/bangladesh-divisions",
  "name": "BangladeshDivisions",
  "title": "Bangladesh Divisions",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Value set for Bangladesh administrative divisions (ADM1 level) with BD.X coding system.",
  "compose": {
    "include": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bangladesh-divisions",
        "concept": [
          {"code": "BD.1", "display": "Barishal"},
          {"code": "BD.2", "display": "Chattogram"},
          {"code": "BD.3", "display": "Dhaka"},
          {"code": "BD.4", "display": "Khulna"},
          {"code": "BD.5", "display": "Mymensingh"},
          {"code": "BD.6", "display": "Rajshahi"},
          {"code": "BD.7", "display": "Rangpur"},
          {"code": "BD.8", "display": "Sylhet"}
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
