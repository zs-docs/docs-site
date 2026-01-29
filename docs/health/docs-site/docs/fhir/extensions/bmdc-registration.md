# BMDC Registration Extension

## 🎯 Overview

This extension defines the Bangladesh Medical and Dental Council (BMDC) registration information for healthcare practitioners in ZARISH HIS, supporting Bangladesh healthcare regulatory compliance.

## 📋 Extension Definition

### StructureDefinition

```json
{
  "resourceType": "StructureDefinition",
  "id": "bmdc-registration",
  "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration",
  "name": "BMDCRegistration",
  "title": "BMDC Registration Extension",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Extension for Practitioner and Patient resources to capture Bangladesh Medical and Dental Council (BMDC) registration information for healthcare practitioners in Bangladesh context.",
  "fhirVersion": "5.0.0",
  "kind": "complex-type",
  "abstract": false,
  "type": "Extension",
  "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Practitioner",
  "derivation": "constraint",
  "context": [
    "Practitioner",
    "Patient"
  ],
  "purpose": "Capture BMDC registration information for healthcare practitioners in Bangladesh healthcare system.",
  "copyright": "© 2026 ZARISH Hospital Information System",
  "keyword": [
    "BMDC",
    "Bangladesh",
    "Medical Council",
    "Dental Council",
    "Registration",
    "Practitioner",
    "Patient",
    "ZARISH",
    "Extension"
  ],
  "mapping": [
    {
      "identity": "rim",
      "map": "Practitioner",
      "comment": "RIM mapping for BMDC registration extension"
    }
  ]
}
```

### Extension Element

```json
{
  "element": [
    {
      "id": "Practitioner.bmdcRegistration",
      "path": "Practitioner.extension:bmdc-registration",
      "short": "BMDC Registration",
      "definition": "Extension to capture BMDC registration details for healthcare practitioners.",
      "min": 0,
      "max": "1",
      "base": {
        "path": "Practitioner.extension",
        "min": 0,
        "max": "1"
      },
      "type": [
        {
          "code": "BackboneElement",
          "profile": [
            "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration"
          ]
        }
      ]
    },
    {
      "id": "Patient.bmdcRegistration",
      "path": "Patient.extension:bmdc-registration",
      "short": "Patient BMDC Registration",
      "definition": "Extension to capture BMDC registration details for patients when applicable.",
      "min": 0,
      "max": "1",
      "base": {
        "path": "Patient.extension",
        "min": 0,
        "max": "1"
      },
      "type": [
        {
          "code": "BackboneElement",
          "profile": [
            "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration"
          ]
        }
      ]
    }
  ]
}
```

### BMDC Registration Backbone Elements

```json
{
  "type": "BackboneElement",
  "snapshot": {
    "element": [
      {
        "id": "bmdcNumber",
        "path": "Practitioner.extension:bmdc-registration.extension:bmdcNumber",
        "short": "BMDC Number",
        "definition": "Bangladesh Medical and Dental Council registration number.",
        "min": 0,
        "max": "1",
        "type": "string",
        "constraint": [
          {
            "key": "bmdc-1",
            "requirements": "BMDC number must be in format BMDC followed by 6 digits",
            "severity": "error",
            "human": "Invalid BMDC number format",
            "expression": "matches('BMDC\\\\d{6}')",
            "source": "http://hl7.org/fhirpath"
          }
        }
      ]
      },
      {
        "id": "registrationDate",
        "path": "Practitioner.extension:bmdc-registration.extension:registrationDate",
        "short": "BMDC Registration Date",
        "definition": "Date when BMDC registration was completed.",
        "min": 0,
        "max": "1",
        "type": "date",
        "constraint": [
          {
            "key": "bmdc-2",
            "requirements": "Registration date cannot be in the future",
            "severity": "error",
            "human": "Registration date cannot be future dated",
            "expression": "$this <= today()",
            "source": "http://hl7.org/fhirpath"
          }
        }
      ]
      },
      {
        "id": "registrationStatus",
        "path": "Practitioner.extension:bmdc-registration.extension:registrationStatus",
        "short": "BMDC Registration Status",
        "definition": "Current status of BMDC registration.",
        "min": 0,
        "max": "1",
        "type": "code",
        "binding": {
          "strength": "required",
          "valueSet": "https://zs-his.github.io/docs/fhir/ValueSet/bmdc-registration-status"
        }
      },
      {
        "id": "speciality",
        "path": "Practitioner.extension:bmdc-registration.extension:speciality",
        "short": "BMDC Speciality",
        "definition": "Medical speciality as registered with BMDC.",
        "min": 0,
        "max": "1",
        "type": "CodeableConcept",
        "binding": {
          "strength": "required",
          "valueSet": "https://zs-his.github.io/docs/fhir/ValueSet/bmdc-specialities"
        }
      },
      {
        "id": "validityPeriod",
        "path": "Practitioner.extension:bmdc-registration.extension:validityPeriod",
        "short": "BMDC Validity Period",
        "definition": "Period during which BMDC registration is valid.",
        "min": 0,
        "max": "1",
        "type": "Period",
        "constraint": [
          {
            "key": "bmdc-3",
            "requirements": "Validity period must include start date and cannot be in the past",
            "severity": "error",
            "human": "Invalid validity period",
            "expression": "exists() and start.exists() and start >= today()",
            "source": "http://hl7.org/fhirpath"
          }
        }
      }
    ]
  }
}
```

## 🏷️ Value Sets

### BMDC Registration Status

```json
{
  "resourceType": "ValueSet",
  "id": "bmdc-registration-status",
  "url": "https://zs-his.github.io/docs/fhir/ValueSet/bmdc-registration-status",
  "name": "BMDCRegistrationStatus",
  "title": "BMDC Registration Status",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Value set for BMDC registration status in Bangladesh healthcare context.",
  "fhirVersion": "5.0.0",
  "compose": {
    "include": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bmdc-registration-status",
        "concept": [
          {
            "code": "ACTIVE",
            "display": "Active",
            "definition": "BMDC registration is currently active and valid."
          },
          {
            "code": "EXPIRED",
            "display": "Expired",
            "definition": "BMDC registration has expired and needs renewal."
          },
          {
            "code": "SUSPENDED",
            "display": "Suspended",
            "definition": "BMDC registration is temporarily suspended."
          },
          {
            "code": "REVOKED",
            "display": "Revoked",
            "definition": "BMDC registration has been revoked."
          }
        ]
      }
    ]
  }
}
```

### BMDC Specialities

```json
{
  "resourceType": "ValueSet",
  "id": "bmdc-specialities",
  "url": "https://zs-his.github.io/docs/fhir/ValueSet/bmdc-specialities",
  "name": "BMDCSpecialities",
  "title": "BMDC Specialities",
  "status": "active",
  "date": "2026-01-21",
  "publisher": "ZARISH HIS Development Team",
  "description": "Value set for medical specialities recognized by Bangladesh Medical and Dental Council.",
  "fhirVersion": "5.0.0",
  "compose": {
    "include": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/bmdc-specialities",
        "concept": [
          {
            "code": "GENERAL_PRACTICE",
            "display": "General Practice",
            "definition": "General medical practice including family medicine."
          },
          {
            "code": "INTERNAL_MEDICINE",
            "display": "Internal Medicine",
            "definition": "Internal medicine specialities including cardiology, gastroenterology, etc."
          },
          {
            "code": "SURGERY",
            "display": "Surgery",
            "definition": "Surgical specialities including general, orthopedic, neurosurgery."
          },
          {
            "code": "PEDIATRICS",
            "display": "Pediatrics",
            "definition": "Pediatric medicine and surgery."
          },
          {
            "code": "OBSTETRICS_GYNECOLOGY",
            "display": "Obstetrics and Gynecology",
            "definition": "Women's health including pregnancy, childbirth, and gynecology."
          },
          {
            "code": "ANESTHESIOLOGY",
            "display": "Anesthesiology",
            "definition": "Anesthesia and pain management."
          },
          {
            "code": "RADIOLOGY",
            "display": "Radiology",
            "definition": "Diagnostic imaging and interventional radiology."
          },
          {
            "code": "PATHOLOGY",
            "display": "Pathology",
            "definition": "Clinical pathology including anatomical and clinical pathology."
          },
          {
            "code": "PSYCHIATRY",
            "display": "Psychiatry",
            "definition": "Mental health and psychiatric disorders."
          },
          {
            "code": "DERMATOLOGY",
            "display": "Dermatology",
            "definition": "Skin diseases and disorders."
          },
          {
            "code": "OPHTHALMOLOGY",
            "display": "Ophthalmology",
            "definition": "Eye diseases and vision care."
          },
          {
            "code": "OTORHINOLARYNGOLOGY",
            "display": "Otorhinolaryngology",
            "definition": "Ear, nose, and throat disorders."
          },
          {
            "code": "DENTISTRY",
            "display": "Dentistry",
            "definition": "Dental medicine and oral surgery."
          }
        ]
      }
    ]
  }
}
```

## 📋 Usage Examples

### Practitioner with BMDC Registration

```json
{
  "resourceType": "Practitioner",
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration",
      "extension": [
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration",
          "valueString": "BMDC123456"
        },
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration",
          "valueDate": "2020-03-15"
        },
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zs-his.github.io/docs/fhir/ValueSet/bmdc-registration-status",
                "code": "ACTIVE",
                "display": "Active"
              }
            ]
          }
        },
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zs-his.github.io/docs/fhir/ValueSet/bmdc-specialities",
                "code": "INTERNAL_MEDICINE",
                "display": "Internal Medicine"
              }
            ]
          }
        },
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration",
          "valuePeriod": {
            "start": "2020-03-15",
            "end": "2025-03-14"
          }
        }
      ]
    }
  ]
}
```

## 🔍 Key Features

### BMDC Registration
- **Registration Number**: BMDC followed by 6 digits
- **Registration Date**: Date of BMDC registration
- **Registration Status**: Active, Expired, Suspended, Revoked
- **Speciality**: Medical speciality classification
- **Validity Period**: Registration validity timeframe

### Bangladesh Context
- **BMDC Standards**: Bangladesh Medical and Dental Council requirements
- **Practitioner Verification**: Professional credential validation
- **Speciality Classification**: Local medical speciality codes
- **Regulatory Compliance**: DGHS and BMDC guidelines
- **Renewal Process**: Registration renewal and validation

### ZARISH Extensions
- **Practitioner Validation**: BMDC number format validation
- **Registration Tracking**: Status and validity monitoring
- **Specialty Integration**: Local medical speciality codes
- **Professional Credentials**: Complete practitioner profile

## 📚 Related Resources

- [Practitioner Profile](../profiles/zarish-practitioner.md)
- [BMDC Guidelines](https://www.bmdc.gov.bd/)
- [DGHS Standards](https://dghs.gov.bd/)
- [Medical Registration](../../standards/patient-registration-standards.md)

## 🧪 Validation

This extension conforms to:
- **FHIR R5**: Extension structure definition
- **ZARISH Practitioner Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **BMDC Guidelines**: Bangladesh Medical and Dental Council requirements
- **Professional Standards**: Healthcare practitioner regulations

---

**Extension Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS, BMDC
