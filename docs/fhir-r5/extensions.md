# 🔌 ZARISH SPHERE FHIR R5 Extensions

## 📋 Overview

ZARISH SPHERE extends the standard FHIR R5 specification with custom extensions to support specialized healthcare workflows and data requirements specific to our platform. These extensions maintain interoperability while providing additional functionality for healthcare providers.

## 🏗️ Extension Architecture

### Extension Structure

All ZARISH SPHERE extensions follow the FHIR extension structure:

````json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/[extension-name]",
  "value[x]: "[value-type]",
  "extension": [
    {
      "url": "sub-extension-url",
      "value[x]": "sub-value"
    }
  ]
}
```text

### Naming Convention

- **Base URL**: `https://zarishsphere.com/fhir/StructureDefinition/`
- **Prefix**: `zs-` (Zarish Sphere)
- **Format**: `zs-[domain]-[purpose]`

## 🏥 Patient Extensions

### Patient Preferences Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-patient-preferences`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-patient-preferences",
  "extension": [
    {
      "url": "language",
      "valueString": "en"
    },
    {
      "url": "communicationMethod",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/communication-method",
            "code": "phone",
            "display": "Phone Call"
          }
        ]
      }
    },
    {
      "url": "appointmentReminders",
      "valueBoolean": true
    }
  ]
}
```text

### Emergency Contact Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-emergency-contact`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-emergency-contact",
  "extension": [
    {
      "url": "relationship",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/relationship",
            "code": "spouse",
            "display": "Spouse"
          }
        ]
      }
    },
    {
      "url": "priority",
      "valueCode": "primary"
    },
    {
      "url": "contact",
      "valueReference": {
        "reference": "RelatedPerson/emergency-contact-1"
      }
    }
  ]
}
```text

## 📋 Clinical Extensions

### Clinical Notes Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-clinical-notes`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-clinical-notes",
  "extension": [
    {
      "url": "noteType",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/note-type",
            "code": "progress",
            "display": "Progress Note"
          }
        ]
      }
    },
    {
      "url": "author",
      "valueReference": {
        "reference": "Practitioner/doctor-1"
      }
    },
    {
      "url": "timestamp",
      "valueDateTime": "2024-01-15T10:30:00Z"
    },
    {
      "url": "content",
      "valueString": "Patient reports improvement in symptoms..."
    }
  ]
}
```text

### Medication Adherence Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-medication-adherence`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-medication-adherence",
  "extension": [
    {
      "url": "adherenceLevel",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/adherence-level",
            "code": "high",
            "display": "High Adherence (>90%)"
          }
        ]
      }
    },
    {
      "url": "lastDose",
      "valueDateTime": "2024-01-15T08:00:00Z"
    },
    {
      "url": "missedDoses",
      "valueInteger": 2
    },
    {
      "url": "monitoringPeriod",
      "valuePeriod": {
        "start": "2024-01-01",
        "end": "2024-01-15"
      }
    }
  ]
}
```text

## 🔬 Diagnostic Extensions

### Lab Results Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-lab-results`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-lab-results",
  "extension": [
    {
      "url": "specimenType",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/specimen-type",
            "code": "blood",
            "display": "Blood Sample"
          }
        ]
      }
    },
    {
      "url": "collectionMethod",
      "valueString": "Venipuncture"
    },
    {
      "url": "processingTime",
      "valueDuration": {
        "value": 2,
        "unit": "h",
        "system": "http://unitsofmeasure.org",
        "code": "h"
      }
    },
    {
      "url": "qualityControl",
      "valueBoolean": true
    }
  ]
}
```text

### Imaging Study Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-imaging-study`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-imaging-study",
  "extension": [
    {
      "url": "modality",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/imaging-modality",
            "code": "CT",
            "display": "Computed Tomography"
          }
        ]
      }
    },
    {
      "url": "contrastAgent",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/contrast-agent",
            "code": "iodinated",
            "display": "Iodinated Contrast"
          }
        ]
      }
    },
    {
      "url": "radiationDose",
      "valueQuantity": {
        "value": 120,
        "unit": "mSv",
        "system": "http://unitsofmeasure.org",
        "code": "mSv"
      }
    }
  ]
}
```text

## 💰 Financial Extensions

### Insurance Coverage Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-insurance-coverage`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-insurance-coverage",
  "extension": [
    {
      "url": "policyNumber",
      "valueString": "POL-123456789"
    },
    {
      "url": "coverageType",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/coverage-type",
            "code": "comprehensive",
            "display": "Comprehensive Coverage"
          }
        ]
      }
    },
    {
      "url": "deductible",
      "valueMoney": {
        "value": 1000,
        "currency": "USD"
      }
    },
    {
      "url": "copayment",
      "valueMoney": {
        "value": 25,
        "currency": "USD"
      }
    }
  ]
}
```text

### Billing Codes Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-billing-codes`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-billing-codes",
  "extension": [
    {
      "url": "cptCode",
      "valueString": "99213"
    },
    {
      "url": "icd10Code",
      "valueString": "Z00.00"
    },
    {
      "url": "modifier",
      "valueString": "25"
    },
    {
      "url": "billingUnits",
      "valueQuantity": {
        "value": 1,
        "unit": "service",
        "system": "http://terminology.zarishsphere.com/billing-unit",
        "code": "service"
      }
    }
  ]
}
```text

## 🏢 Organizational Extensions

### Facility Information Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-facility-info`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-facility-info",
  "extension": [
    {
      "url": "facilityType",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/facility-type",
            "code": "hospital",
            "display": "Hospital"
          }
        ]
      }
    },
    {
      "url": "bedCount",
      "valueInteger": 250
    },
    {
      "url": "specialties",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/specialty",
            "code": "cardiology",
            "display": "Cardiology"
          }
        ]
      }
    },
    {
      "url": "accreditation",
      "valueString": "JCI Accredited"
    }
  ]
}
```text

### Department Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-department`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-department",
  "extension": [
    {
      "url": "departmentType",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/department-type",
            "code": "emergency",
            "display": "Emergency Department"
          }
        ]
      }
    },
    {
      "url": "headOfDepartment",
      "valueReference": {
        "reference": "Practitioner/department-head-1"
      }
    },
    {
      "url": "operatingHours",
      "valueTiming": {
        "repeat": {
          "boundsPeriod": {
            "start": "00:00",
            "end": "23:59"
          },
          "frequency": 1,
          "period": 1,
          "periodUnit": "d"
        }
      }
    }
  ]
}
```text

## 🔧 Technical Extensions

### Audit Trail Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-audit-trail`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-audit-trail",
  "extension": [
    {
      "url": "action",
      "valueCode": "create"
    },
    {
      "url": "timestamp",
      "valueDateTime": "2024-01-15T10:30:00Z"
    },
    {
      "url": "user",
      "valueReference": {
        "reference": "Practitioner/user-1"
      }
    },
    {
      "url": "source",
      "valueString": "ZARISH SPHERE EHR"
    },
    {
      "url": "reason",
      "valueString": "Patient registration"
    }
  ]
}
```text

### Data Quality Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-data-quality`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-data-quality",
  "extension": [
    {
      "url": "completeness",
      "valueDecimal": 0.95
    },
    {
      "url": "accuracy",
      "valueDecimal": 0.98
    },
    {
      "url": "timeliness",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/timeliness",
            "code": "real-time",
            "display": "Real-time"
          }
        ]
      }
    },
    {
      "url": "validationStatus",
      "valueCode": "validated"
    }
  ]
}
```text

## 📊 Analytics Extensions

### Usage Statistics Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-usage-stats`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-usage-stats",
  "extension": [
    {
      "url": "viewCount",
      "valueInteger": 150
    },
    {
      "url": "lastAccessed",
      "valueDateTime": "2024-01-15T09:45:00Z"
    },
    {
      "url": "accessFrequency",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/frequency",
            "code": "daily",
            "display": "Daily"
          }
        ]
      }
    }
  ]
}
```text

### Performance Metrics Extension

**URL**: `https://zarishsphere.com/fhir/StructureDefinition/zs-performance-metrics`

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-performance-metrics",
  "extension": [
    {
      "url": "responseTime",
      "valueQuantity": {
        "value": 250,
        "unit": "ms",
        "system": "http://unitsofmeasure.org",
        "code": "ms"
      }
    },
    {
      "url": "throughput",
      "valueQuantity": {
        "value": 1000,
        "unit": "req/min",
        "system": "http://terminology.zarishsphere.com/throughput-unit",
        "code": "req/min"
      }
    },
    {
      "url": "errorRate",
      "valueDecimal": 0.001
    }
  ]
}
```json

## 🔍 Implementation Guidelines

### Using Extensions in Resources

```json
{
  "resourceType": "Patient",
  "id": "patient-1",
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/zs-patient-preferences",
      "extension": [
        {
          "url": "language",
          "valueString": "en"
        },
        {
          "url": "appointmentReminders",
          "valueBoolean": true
        }
      ]
    }
  ]
}
```json

### Validation Rules

1. **Required Fields**: All extensions have required sub-extensions
2. **Data Types**: Strict type validation for all values
3. **Value Sets**: Use defined value sets for coded elements
4. **Business Rules**: Additional business logic validation

### Error Handling

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "structure",
      "details": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/error-codes",
            "code": "EXT-001",
            "display": "Invalid extension value"
          }
        ]
      },
      "location": ["Patient.extension[0].extension[0].valueString"],
      "expression": [
        "Patient.extension.where(url='zs-patient-preferences').extension.where(url='language').valueString"
      ]
    }
  ]
}
```text

## 📚 Extension Registry

### Complete Extension List

| Extension                 | Domain         | Status | Version |
| ------------------------- | -------------- | ------ | ------- |
| `zs-patient-preferences`  | Patient        | Active | 1.0     |
| `zs-emergency-contact`    | Patient        | Active | 1.0     |
| `zs-clinical-notes`       | Clinical       | Active | 1.0     |
| `zs-medication-adherence` | Clinical       | Active | 1.0     |
| `zs-lab-results`          | Diagnostic     | Active | 1.0     |
| `zs-imaging-study`        | Diagnostic     | Active | 1.0     |
| `zs-insurance-coverage`   | Financial      | Active | 1.0     |
| `zs-billing-codes`        | Financial      | Active | 1.0     |
| `zs-facility-info`        | Organizational | Active | 1.0     |
| `zs-department`           | Organizational | Active | 1.0     |
| `zs-audit-trail`          | Technical      | Active | 1.0     |
| `zs-data-quality`         | Technical      | Active | 1.0     |
| `zs-usage-stats`          | Analytics      | Active | 1.0     |
| `zs-performance-metrics`  | Analytics      | Active | 1.0     |

## 🔗 Related Resources

- [FHIR R5 Overview](./overview.md)
- [FHIR R5 Implementation](./rest-implementation.md)
- [API Reference](../api-reference/overview.md)
- [Data Standards](../health/overview.md)

## 🆘 Support

- 📧 **Email**: [fhir-support@zarishsphere.com](mailto:fhir-support@zarishsphere.com)
- 📖 **Documentation**: [docs.zarishsphere.com](https://docs.zarishsphere.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/zarishsphere/fhir-extensions/issues)

---

**🏥 Extending healthcare data standards with ZARISH SPHERE**
````
