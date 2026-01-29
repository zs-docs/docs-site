# Observation Codes Value Set

## 🎯 Overview

Value set for observation codes used in ZARISH HIS with Bangladesh healthcare context and local clinical practices.

## 📋 Value Set Definition

```json
{
  "resourceType": "ValueSet",
  "id": "observation-codes",
  "url": "https://zs-his.github.io/docs/fhir/ValueSet/observation-codes",
  "name": "ObservationCodes",
  "title": "Observation Codes",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Value set for observation codes used in ZARISH HIS with Bangladesh healthcare context.",
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "concept": [
          {"code": "8480-6", "display": "Systolic blood pressure"},
          {"code": "8462-4", "display": "Diastolic blood pressure"},
          {"code": "8310-5", "display": "Body temperature"},
          {"code": "8867-4", "display": "Heart rate"},
          {"code": "9279-1", "display": "Respiratory rate"},
          {"code": "39156-5", "display": "Body mass index (BMI)"},
          {"code": "8302-2", "display": "Body height"},
          {"code": "29463-7", "display": "Body weight"},
          {"code": "30525-0", "display": "Oxygen saturation"},
          {"code": "2345-7", "display": "Glucose"}
        ]
      },
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/zarish-observation-codes",
        "concept": [
          {"code": "BD_VITAL_BP", "display": "Blood Pressure - Bangladesh Protocol"},
          {"code": "BD_VITAL_TEMP", "display": "Body Temperature - Bangladesh Protocol"},
          {"code": "BD_VITAL_HR", "display": "Heart Rate - Bangladesh Protocol"},
          {"code": "BD_VITAL_RR", "display": "Respiratory Rate - Bangladesh Protocol"},
          {"code": "BD_VITAL_SPO2", "display": "Oxygen Saturation - Bangladesh Protocol"},
          {"code": "BD_VITAL_BMI", "display": "Body Mass Index - Bangladesh Protocol"},
          {"code": "BD_LAB_HBA1C", "display": "HbA1c - Bangladesh Laboratory"},
          {"code": "BD_LAB_LIPID", "display": "Lipid Profile - Bangladesh Laboratory"},
          {"code": "BD_LAB_CBC", "display": "Complete Blood Count - Bangladesh Laboratory"},
          {"code": "BD_LAB_RFT", "display": "Renal Function Test - Bangladesh Laboratory"},
          {"code": "BD_LAB_LFT", "display": "Liver Function Test - Bangladesh Laboratory"}
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
