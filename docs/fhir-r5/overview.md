---
title: 'FHIR R5 Implementation Guide'
sidebar_label: 'Overview'
description: "Comprehensive guide to ZARISH SPHERE's FHIR R5 implementation, resources, and extensions"
keywords: [fhir, r5, hl7, healthcare interoperability, resources, profiles]
---

# FHIR R5 Implementation Guide

## Overview

ZARISH SPHERE implements **HL7 FHIR R5** (Release 5) as its core healthcare data model, providing standardized interoperability for clinical, administrative, and public health data exchange. Our implementation follows FHIR standards with healthcare-specific extensions optimized for humanitarian and low-resource settings.

## Implementation Architecture

### Core Components

````text
ZARISH SPHERE FHIR Implementation
├── Standard FHIR R5 Resources
│   ├── Clinical Resources (Patient, Observation, Condition)
│   ├── Administrative Resources (Organization, Practitioner)
│   └── Infrastructure Resources (CapabilityStatement, OperationOutcome)
├── ZARISH Extensions
│   ├── Humanitarian Extensions (displacement, emergency response)
│   ├── Low-Resource Optimizations (offline sync, bandwidth optimization)
│   └── Local Adaptations (regional coding systems, local languages)
└── Implementation Guides
    ├── Clinical Workflows
    ├── Public Health Reporting
    └── Emergency Response Protocols
```text

## Supported Resources

### Clinical Resources

| Resource              | Purpose                                      | Key Extensions                                              |
| --------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| **Patient**           | Patient demographics and administrative data | Humanitarian status, preferred language, tribal affiliation |
| **Encounter**         | Patient interactions with healthcare system  | Mobile clinic, emergency response, telehealth               |
| **Condition**         | Health problems, diagnoses, issues           | Acute vs chronic, outbreak-related, displacement impact     |
| **Observation**       | Measurements, observations, assessments      | Vital signs, nutrition status, environmental exposure       |
| **MedicationRequest** | Medication orders and prescriptions          | Essential medicines list, stock availability                |
| **Procedure**         | Healthcare procedures and interventions      | Emergency procedures, field interventions                   |
| **DiagnosticReport**  | Laboratory and imaging results               | Point-of-care tests, field diagnostics                      |
| **Immunization**      | Vaccination records                          | Campaign immunizations, outbreak response                   |
| **CarePlan**          | Healthcare plans and protocols               | Humanitarian care plans, discharge planning                 |

### Administrative Resources

| Resource              | Purpose                                   | Key Extensions                                      |
| --------------------- | ----------------------------------------- | --------------------------------------------------- |
| **Organization**      | Healthcare facilities and organizations   | Facility type, capacity, emergency status           |
| **Practitioner**      | Healthcare providers and staff            | Volunteer status, credentials verification          |
| **Location**          | Physical locations where care is provided | GPS coordinates, mobile facility, temporary shelter |
| **HealthcareService** | Services provided by organizations        | Available services, capacity constraints            |
| **Schedule**          | Time slots for appointments and services  | Mobile clinic schedules, outreach programs          |

### Public Health Resources

| Resource                  | Purpose                            | Key Extensions                               |
| ------------------------- | ---------------------------------- | -------------------------------------------- |
| **MeasureReport**         | Quality and public health measures | Outbreak surveillance, program effectiveness |
| **Bundle**                | Collections of resources           | Data exchange, offline synchronization       |
| **QuestionnaireResponse** | Structured data collection         | Needs assessments, screening tools           |
| **Binary**                | Binary data (images, documents)    | Field photos, scanned documents              |

## ZARISH SPHERE Extensions

### Humanitarian Extensions

### Patient Humanitarian Status

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/patient-humanitarian-status",
  "extension": [
    {
      "url": "displacementStatus",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/displacement-status",
            "code": "idp",
            "display": "Internally Displaced Person"
          }
        ]
      }
    },
    {
      "url": "emergencyContact",
      "valueContactPoint": {
        "system": "phone",
        "value": "+1234567890",
        "use": "mobile"
      }
    }
  ]
}
```text

### Facility Emergency Status

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/facility-emergency-status",
  "extension": [
    {
      "url": "operationalStatus",
      "valueCode": "emergency_response"
    },
    {
      "url": "capacityUtilization",
      "valueDecimal": 0.85
    },
    {
      "url": "emergencyLevel",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/emergency-level",
            "code": "level2",
            "display": "Moderate Emergency"
          }
        ]
      }
    }
  ]
}
```text

### Low-Resource Optimizations

### Offline Sync Extension

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/offline-sync",
  "extension": [
    {
      "url": "syncPriority",
      "valueCode": "high"
    },
    {
      "url": "lastSyncTimestamp",
      "valueInstant": "2024-01-15T10:30:00Z"
    },
    {
      "url": "conflictResolution",
      "valueCode": "client_wins"
    }
  ]
}
```text

### Bandwidth Optimization

```json
{
  "url": "https://zarishsphere.com/fhir/StructureDefinition/bandwidth-optimization",
  "extension": [
    {
      "url": "compressed",
      "valueBoolean": true
    },
    {
      "url": "dataSize",
      "valueInteger": 2048
    },
    {
      "url": "essentialFields",
      "valueString": "id,name,birthDate,gender"
    }
  ]
}
```json

## Implementation Profiles

### Patient Profile

### Base Patient + Humanitarian Extensions

```json
{
  "resourceType": "Patient",
  "meta": {
    "profile": ["https://zarishsphere.com/fhir/StructureDefinition/patient-humanitarian"]
  },
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/patient-humanitarian-status",
      "extension": [
        {
          "url": "displacementStatus",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/displacement-status",
                "code": "refugee",
                "display": "Refugee"
              }
            ]
          }
        },
        {
          "url": "registrationDate",
          "valueDateTime": "2024-01-15T00:00:00Z"
        },
        {
          "url": "campLocation",
          "valueReference": {
            "reference": "Location/camp-abc123"
          }
        }
      ]
    }
  ],
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MR",
            "display": "Medical Record Number"
          }
        ]
      },
      "value": "MRN-2024-001234",
      "system": "https://zarishsphere.org/mrn"
    },
    {
      "type": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/identifier-type",
            "code": "UNHCR",
            "display": "UNHCR Identifier"
          }
        ]
      },
      "value": "UNHCR-2024-001234",
      "system": "https://unhcr.org/id"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Mohammed",
      "given": ["Ahmed", "Hassan"]
    },
    {
      "use": "usual",
      "text": "Ahmed Mohammed"
    }
  ],
  "gender": "male",
  "birthDate": "1990-05-15",
  "communication": [
    {
      "language": {
        "coding": [
          {
            "system": "urn:ietf:bcp:47",
            "code": "ar",
            "display": "Arabic"
          }
        ]
      },
      "preferred": true
    }
  ]
}
```json

### Observation Profile

### Vital Signs with Environmental Context

```json
{
  "resourceType": "Observation",
  "meta": {
    "profile": ["https://zarishsphere.com/fhir/StructureDefinition/vital-signs-environmental"]
  },
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "vital-signs",
          "display": "Vital Signs"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "85354-9",
        "display": "Blood pressure panel"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-12345"
  },
  "effectiveDateTime": "2024-01-15T14:30:00Z",
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/environmental-context",
      "extension": [
        {
          "url": "temperature",
          "valueQuantity": {
            "value": 35.2,
            "unit": "°C",
            "system": "http://unitsofmeasure.org",
            "code": "Cel"
          }
        },
        {
          "url": "humidity",
          "valueQuantity": {
            "value": 85,
            "unit": "%",
            "system": "http://unitsofmeasure.org",
            "code": "%"
          }
        },
        {
          "url": "locationType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/location-type",
                "code": "tent",
                "display": "Emergency Shelter Tent"
              }
            ]
          }
        }
      ]
    }
  ],
  "component": [
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "8480-6",
            "display": "Systolic blood pressure"
          }
        ]
      },
      "valueQuantity": {
        "value": 118,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "8462-4",
            "display": "Diastolic blood pressure"
          }
        ]
      },
      "valueQuantity": {
        "value": 76,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    }
  ]
}
```json

## Value Sets and Code Systems

### Displacement Status Code System

```json
{
  "resourceType": "CodeSystem",
  "url": "https://zarishsphere.com/fhir/CodeSystem/displacement-status",
  "name": "DisplacementStatus",
  "title": "Displacement Status Codes",
  "status": "active",
  "content": "complete",
  "concept": [
    {
      "code": "resident",
      "display": "Resident",
      "definition": "Person is resident in the area"
    },
    {
      "code": "idp",
      "display": "Internally Displaced Person",
      "definition": "Person displaced within their own country"
    },
    {
      "code": "refugee",
      "display": "Refugee",
      "definition": "Person forced to flee their country due to persecution"
    },
    {
      "code": "asylum_seeker",
      "display": "Asylum Seeker",
      "definition": "Person seeking international protection"
    },
    {
      "code": "migrant",
      "display": "Migrant",
      "definition": "Person who has moved across an international border"
    },
    {
      "code": "stateless",
      "display": "Stateless Person",
      "definition": "Person not recognized as a citizen by any country"
    }
  ]
}
```json

### Facility Type Value Set

```json
{
  "resourceType": "ValueSet",
  "url": "https://zarishsphere.com/fhir/ValueSet/facility-type",
  "name": "FacilityType",
  "title": "Healthcare Facility Types",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "https://zarishsphere.com/fhir/CodeSystem/facility-type",
        "concept": [
          {
            "code": "hospital",
            "display": "Hospital"
          },
          {
            "code": "health_center",
            "display": "Health Center"
          },
          {
            "code": "mobile_clinic",
            "display": "Mobile Clinic"
          },
          {
            "code": "field_hospital",
            "display": "Field Hospital"
          },
          {
            "code": "emergency_shelter",
            "display": "Emergency Shelter"
          },
          {
            "code": "outpost",
            "display": "Remote Outpost"
          }
        ]
      }
    ]
  }
}
```text

## RESTful API Implementation

### Base URL

```text
https://api.zarishsphere.com/fhir/r5/
```json

### Resource Endpoints

### Patient Operations

```http
## Create patient with humanitarian extensions
POST /fhir/r5/Patient
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "meta": {
    "profile": ["https://zarishsphere.com/fhir/StructureDefinition/patient-humanitarian"]
  },
  "extension": [...]
}
```text

### Search with Humanitarian Context

```http
## Search patients by displacement status
GET /fhir/r5/Patient?displacement-status=idp

## Search observations by environmental conditions
GET /fhir/r5/Observation?environmental-temperature=gt35

## Search facilities by emergency status
GET /fhir/r5/Organization?emergency-status=level2
```json

### Custom Operations

### $matchPatient

```http
POST /fhir/r5/Patient/$matchPatient
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "patient",
      "resource": {
        "resourceType": "Patient",
        "name": [{"family": "Mohammed", "given": ["Ahmed"]}],
        "birthDate": "1990-05-15"
      }
    },
    {
      "name": "matchType",
      "valueCode": "probabilistic"
    }
  ]
}
```text

### $exportHumanitarianData

```http
GET /fhir/r5/$exportHumanitarianData?_type=Patient,Observation&displacementStatus=idp
```json

### $syncOffline

```http
POST /fhir/r5/$syncOffline
Content-Type: application/fhir+json

{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "urn:uuid:1",
      "resource": {
        "resourceType": "Patient",
        "id": "patient-12345"
      },
      "request": {
        "method": "PUT",
        "url": "Patient/patient-12345"
      }
    }
  ]
}
```json

## Interoperability Considerations

### Data Exchange Standards

### HL7 v2 Integration

```json
{
  "resourceType": "MessageHeader",
  "event": {
    "coding": [
      {
        "system": "https://zarishsphere.com/fhir/CodeSystem/hl7v2-events",
        "code": "ADT_A01",
        "display": "Admit Patient"
      }
    ]
  },
  "source": {
    "name": "HL7 v2 Interface",
    "software": "ZARISH SPHERE Gateway",
    "version": "1.0"
  }
}
```json

### DICOM Integration

```json
{
  "resourceType": "ImagingStudy",
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/dicom-metadata",
      "extension": [
        {
          "url": "studyInstanceUID",
          "valueString": "1.2.840.113619.2.55.3.604688237.761.1243134237.589"
        },
        {
          "url": "modality",
          "valueCode": "XR"
        }
      ]
    }
  ]
}
```json

### Terminology Services

### Local Code Systems

```json
{
  "resourceType": "CodeSystem",
  "url": "https://zarishsphere.org/fhir/CodeSystem/local-diagnoses",
  "name": "LocalDiagnoses",
  "title": "Local Diagnosis Codes",
  "status": "active",
  "concept": [
    {
      "code": "MALARIA_01",
      "display": "Uncomplicated Malaria",
      "definition": "Malaria without severe complications"
    },
    {
      "code": "CHOLERA_02",
      "display": "Severe Dehydration due to Cholera",
      "definition": "Cholera with severe dehydration requiring IV fluids"
    }
  ]
}
```json

### ConceptMap to International Standards

```json
{
  "resourceType": "ConceptMap",
  "url": "https://zarishsphere.org/fhir/ConceptMap/local-to-icd10",
  "name": "LocalToICD10",
  "title": "Local Diagnosis Codes to ICD-10 Mapping",
  "status": "active",
  "sourceUri": "https://zarishsphere.org/fhir/CodeSystem/local-diagnoses",
  "targetUri": "http://hl7.org/fhir/sid/icd-10",
  "group": [
    {
      "source": "https://zarishsphere.org/fhir/CodeSystem/local-diagnoses",
      "target": "http://hl7.org/fhir/sid/icd-10",
      "element": [
        {
          "code": "MALARIA_01",
          "target": [
            {
              "code": "B54",
              "equivalence": "equivalent"
            }
          ]
        }
      ]
    }
  ]
}
```bash

## Testing and Validation

### Test Resources

- **Test Server**: `https://test-api.zarishsphere.com/fhir/r5/`
- **Sample Data**: Synthetic humanitarian scenarios
- **Validation Tools**: FHIR validator with ZARISH extensions

### Validation Examples

```bash
## Validate patient resource
curl -X POST https://test-api.zarishsphere.com/fhir/r5/Patient/$validate \
  -H "Content-Type: application/fhir+json" \
  -d @patient-example.json

## Test custom operation
curl -X POST https://test-api.zarishsphere.com/fhir/r5/Patient/$matchPatient \
  -H "Content-Type: application/fhir+json" \
  -d @match-request.json
```text

## Implementation Support

### Documentation

- [FHIR R5 Specification](https://hl7.org/fhir/R5/)
- [ZARISH Extensions Guide](./extensions.md)
- [Clinical Implementation Guide](../health/clinical-workflows.md)
- [Public Health Implementation](../health/public-health.md)

### Tools and Resources

- **FHIR Server**: Open-source HAPI FHIR with ZARISH extensions
- **SDK**: Client libraries for major programming languages
- **Testing Suite**: Automated testing for conformance
- **Migration Tools**: Data migration from legacy systems

### Community Support

- [FHIR Implementation Forum](https://github.com/zs-docs/docs-site/discussions)
- [Technical Support](mailto:fhir-support@zarishsphere.com)
- [Training Materials](https://training.zarishsphere.com/fhir)
- [Implementation Partners](https://partners.zarishsphere.com)

## Compliance and Standards

### Standards Compliance

- **FHIR R5**: Full compliance with HL7 FHIR Release 5
- **IHE Profiles**: Support for relevant IHE integration profiles
- **WHO Standards**: Alignment with WHO digital health guidelines
- **UN OCHA**: Humanitarian data exchange standards

### Data Governance

- **Privacy**: HIPAA and GDPR compliance
- **Security**: End-to-end encryption and audit logging
- **Consent**: Patient consent management
- **Data Sharing**: Controlled data sharing agreements

This FHIR R5 implementation provides a robust foundation for healthcare data exchange in humanitarian and low-resource settings, ensuring interoperability while addressing the unique challenges of these environments.
````
