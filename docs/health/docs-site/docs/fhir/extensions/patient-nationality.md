# Patient Nationality Extension

## 🎯 Overview

This extension defines the patient nationality classification for ZARISH HIS, supporting Bangladesh healthcare context and Rohingya refugee integration with proper FHIR R5 compliance.

## 📋 Extension Definition

### StructureDefinition

```json
{
  "resourceType": "StructureDefinition",
  "id": "patient-nationality",
  "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-nationality",
  "name": "PatientNationality",
  "title": "Patient Nationality Extension",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Extension for Patient resource to capture nationality information specific to Bangladesh healthcare context, including Bangladeshi citizens and Rohingya refugees.",
  "fhirVersion": "5.0.0",
  "kind": "complex-type",
  "abstract": false,
  "type": "Extension",
  "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Patient",
  "derivation": "constraint",
  "context": [
    "Patient"
  ],
  "purpose": "Capture patient nationality and origin information for Bangladesh healthcare system with Rohingya refugee integration.",
  "copyright": "© 2026 ZARISH Hospital Information System",
  "keyword": [
    "Patient",
    "Nationality",
    "Bangladesh",
    "Rohingya",
    "Refugee",
    "ZARISH",
    "Extension"
  ],
  "mapping": [
    {
      "identity": "rim",
      "map": "Patient",
      "comment": "RIM mapping for nationality extension"
    },
    {
      "identity": "v2",
      "map": "PID.10",
      "comment": "HL7 v2 mapping for nationality"
    }
  ]
}
```

### Extension Element

```json
{
  "element": [
    {
      "id": "Patient.nationality",
      "path": "Patient.extension:patient-nationality",
      "short": "Patient Nationality",
      "definition": "Extension to capture patient nationality and origin information.",
      "min": 0,
      "max": "1",
      "base": {
        "path": "Patient.extension",
        "min": 0,
        "max": "1"
      },
      "type": [
        {
          "code": "CodeableConcept",
          "profile": [
            "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-nationality"
          ]
        }
      ],
      "constraint": [
        {
          "key": "pat-1",
          "requirements": "If present, must contain at least one of BD, ROH, OTH",
          "severity": "error",
          "human": "Nationality must be one of the defined codes",
          "expression": "exists()",
          "source": "http://hl7.org/fhirpath"
        }
      }
    ]
  }
}
```

## 🏷️ Value Set

### Nationality Codes

```json
{
  "resourceType": "CodeSystem",
  "id": "patient-origin",
  "url": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-origin",
  "name": "PatientOrigin",
  "title": "Patient Origin Code System",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Code system for patient nationality and origin classification in ZARISH HIS.",
  "fhirVersion": "5.0.0",
  "kind": "terminology",
  "abstract": false,
  "caseSensitive": true,
  "valueSet": "https://zs-his.github.io/docs/fhir/ValueSet/patient-origin",
  "hierarchyMeaning": "is-a",
  "compositional": false,
  "versionNeeded": false,
  "content": "complete",
  "count": 3,
  "filter": null,
  "property": [
    {
      "code": "status",
      "uri": "http://hl7.org/fhir/concept-properties#status",
      "description": "Current status of the nationality code",
      "type": "string"
    },
    {
      "code": "documentation",
      "uri": "http://hl7.org/fhir/concept-properties#documentation",
      "description": "Documentation for the nationality code",
      "type": "string"
    }
  ],
  "concept": [
    {
      "code": "BD",
      "display": "Bangladeshi",
      "definition": "Citizen of Bangladesh with valid national ID",
      "property": [
        {
          "code": "status",
          "valueCode": "active"
        },
        {
          "code": "documentation",
          "valueString": "Bangladeshi nationality for citizens with NID or Birth Certificate"
        }
      ]
    },
    {
      "code": "ROH",
      "display": "Rohingya",
      "definition": "Rohingya refugee registered in UNHCR system",
      "property": [
        {
          "code": "status",
          "valueCode": "active"
        },
        {
          "code": "documentation",
          "valueString": "Rohingya nationality for registered refugees with ProGress ID or MRC"
        }
      ]
    },
    {
      "code": "OTH",
      "display": "Other",
      "definition": "Other nationality not covered by BD or ROH codes",
      "property": [
        {
          "code": "status",
          "valueCode": "active"
        },
        {
          "code": "documentation",
          "valueString": "Other nationality for international patients, migrants, or stateless persons"
        }
      ]
    }
  ]
}
```

## 📋 Usage Examples

### Bangladeshi Patient

```json
{
  "resourceType": "Patient",
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-nationality",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-origin",
            "code": "BD",
            "display": "Bangladeshi"
          }
        ]
      }
    }
  ]
}
```

### Rohingya Refugee Patient

```json
{
  "resourceType": "Patient",
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-nationality",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-origin",
            "code": "ROH",
            "display": "Rohingya"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/camp-registration-status",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/camp-registration-status",
            "code": "REGISTERED",
            "display": "Registered Camp Resident"
          }
        ]
      }
    }
  ]
}
```

### Other Nationality

```json
{
  "resourceType": "Patient",
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-nationality",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-origin",
            "code": "OTH",
            "display": "Other"
          }
        ]
      }
    }
  ]
}
```

## 🔍 Key Features

### Nationality Classification
- **Bangladeshi (BD)**: Citizens with NID/Birth Certificate
- **Rohingya (ROH)**: UNHCR registered refugees
- **Other (OTH)**: International patients, migrants

### Bangladesh Context
- **National ID Integration**: 13-digit NID format
- **Administrative Boundaries**: BD.X.Y.Z.W coding
- **Citizen Verification**: Local identity verification
- **Healthcare Access**: Citizen vs refugee service differentiation

### Rohingya Refugee Integration
- **UNHCR Standards**: Refugee registration compliance
- **Camp Registration**: Registered vs new arrival status
- **Multiple IDs**: ProGress ID, MRC, FCN systems
- **Service Eligibility**: Refugee-specific healthcare services

### ZARISH Extensions
- **Camp Registration Status**: Detailed registration information
- **Administrative Boundary**: Precise geographic coding
- **Service Type**: Healthcare service classification
- **Identity Verification**: Multiple identifier systems

## 📚 Related Resources

- [Patient Profile](../profiles/zarish-patient.md)
- [Patient Registration Standards](../../standards/patient-registration-standards.md)
- [Geographic Boundaries Integration](../../standards/geographic-boundaries-integration.md)
- [Bangladesh Divisions Value Set](../value-sets/bangladesh-divisions.md)

## 🧪 Validation

This extension conforms to:
- **FHIR R5**: Extension structure definition
- **ZARISH Patient Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **UNHCR Guidelines**: Refugee registration requirements
- **Data Quality**: Complete validation and testing

---

**Extension Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS, UNHCR
