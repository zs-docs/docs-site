# Diagnostic Categories Value Set

## 🎯 Overview

Value set for diagnostic categories used in ZARISH HIS with Bangladesh healthcare context and local laboratory standards.

## 📋 Value Set Definition

```json
{
  "resourceType": "ValueSet",
  "id": "diagnostic-categories",
  "url": "https://zs-his.github.io/docs/fhir/ValueSet/diagnostic-categories",
  "name": "DiagnosticCategories",
  "title": "Diagnostic Categories",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Value set for diagnostic categories used in ZARISH HIS with Bangladesh healthcare context.",
  "compose": {
    "include": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/diagnostic-categories",
        "concept": [
          {"code": "LAB", "display": "Laboratory"},
          {"code": "RAD", "display": "Radiology"},
          {"code": "PATH", "display": "Pathology"},
          {"code": "MICRO", "display": "Microbiology"},
          {"code": "HEMATOLOGY", "display": "Hematology"},
          {"code": "BIOCHEMISTRY", "display": "Biochemistry"},
          {"code": "IMMUNOLOGY", "display": "Immunology"},
          {"code": "MOLECULAR", "display": "Molecular Diagnostics"},
          {"code": "HISTOPATHOLOGY", "display": "Histopathology"},
          {"code": "CYTOPATHOLOGY", "display": "Cytopathology"},
          {"code": "XRAY", "display": "X-Ray"},
          {"code": "CT", "display": "CT Scan"},
          {"code": "MRI", "display": "MRI"},
          {"code": "ULTRASOUND", "display": "Ultrasound"},
          {"code": "MAMMOGRAPHY", "display": "Mammography"},
          {"code": "FLUOROSCOPY", "display": "Fluoroscopy"},
          {"code": "NUCLEAR_MEDICINE", "display": "Nuclear Medicine"},
          {"code": "INTERVENTIONAL_RADIOLOGY", "display": "Interventional Radiology"}
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
