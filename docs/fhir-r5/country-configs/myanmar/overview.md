---
sidebar_position: 1
sidebar_label: 'Myanmar Configuration'
title: 'Myanmar FHIR R5 Configuration'
description: 'FHIR R5 implementation guide for Myanmar healthcare system with Ministry of Health standards and local adaptations'
keywords: [fhir, myanmar, healthcare, digital health, moh, myanmar healthcare]
---

# Myanmar FHIR R5 Configuration

## Overview

This configuration provides FHIR R5 implementation guidelines specifically tailored for the Myanmar healthcare system, incorporating Ministry of Health (MOH) requirements, local regulatory frameworks, and Myanmar healthcare practices.

## Regulatory Framework

### Ministry of Health (MOH)

- National Health Data Standards (NHDS)
- Hospital Accreditation Standards
- Myanmar Healthcare Information System Standards
- Data Privacy and Security Regulations
- Digital Health Strategy 2021-2030

### Health Data Standards

- Myanmar National Health Database (MNHD)
- Social Security Board (SSB) data standards
- Private Healthcare Association requirements
- Traditional Medicine Integration Standards

## Local Adaptations

### Patient Identification

- Myanmar National Registration Card (NRC)
- Hospital Registration Number
- Social Security Number
- Township Health Department ID
- Foreigner Registration Number

### Healthcare Provider Registry

- Myanmar Medical Council (MMC)
- Nursing and Midwifery Council
- Pharmacy Council
- Dental Council
- Traditional Medicine Council

### Facility Registry

- MOH Hospital Licensing
- Private Hospital Association
- Clinic Registration Standards
- Township Health Center Registration
- Traditional Medicine Clinic Licensing

## Data Standards

### Coding Systems

- **Diagnoses**: ICD-10-MM (Myanmar Modification)
- **Procedures**: ICD-9-CM-MM (Myanmar Modification)
- **Medications**: Myanmar Essential Medicines List (MEML)
- **Laboratory**: LOINC with Myanmar extensions
- **Allergies**: SNOMED CT with Myanmar terms

### Language Support

- Primary: Myanmar (မြန်မာ)
- Secondary: English
- Character encoding: UTF-8
- Date format: DD/MM/YYYY
- Regional language support

## Implementation Profiles

### Patient Profile

````json
{
  "resourceType": "Patient",
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "MYANMAR_NRC",
            "display": "Myanmar NRC"
          }
        ]
      },
      "value": "12/ABC(N)123456"
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "SSB_ID",
            "display": "Social Security Board ID"
          }
        ]
      },
      "value": "SSB-123456789"
    }
  ],
  "name": [
    {
      "use": "official",
      "text": "အောင်ဆက်မောင်",
      "family": "အောင်ဆက်",
      "given": ["မောင်"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+959123456789",
      "use": "mobile"
    }
  ],
  "address": [
    {
      "use": "home",
      "text": "No. 123, Pyay Road, Kamayut Township, Yangon, Myanmar",
      "city": "Yangon",
      "district": "Kamayut",
      "state": "Yangon Region",
      "postalCode": "11041",
      "country": "MM"
    }
  ]
}
```json

### Encounter Profile

```json
{
  "resourceType": "Encounter",
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "VISIT_ID",
            "display": "Visit ID"
          }
        ]
      },
      "value": "VN-2026-001234"
    }
  ],
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "Ambulatory"
  },
  "type": [
    {
      "coding": [
        {
          "system": "http://terminology.zarishsphere.com/encounter-type",
          "code": "OPD_PUBLIC",
          "display": "OPD - Public Hospital"
        }
      ]
    }
  ],
  "subject": {
    "reference": "Patient/12345"
  },
  "participant": [
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "ATND",
              "display": "Attender"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/67890"
      }
    }
  ],
  "period": {
    "start": "2026-01-26T10:30:00+06:30",
    "end": "2026-01-26T11:15:00+06:30"
  }
}
```text

## Integration Points

### National Systems

- **National Health Data Center (NHDC)**
- **Social Security Board (SSB) Database**
- **Department of Public Health Systems**
- **National Disease Surveillance System**
- **Traditional Medicine Registry**

### Private Systems

- Hospital Information Systems (HIS)
- Laboratory Information Systems (LIS)
- Pharmacy Management Systems
- Insurance Company Systems
- Mobile Health Applications

## Security & Privacy

### Data Protection

- Myanmar Data Protection Regulations
- Health Information Security Standards
- Data localization requirements
- Cross-border data transfer policies

### Authentication

- NRC verification system
- Digital signature requirements
- Multi-factor authentication
- Session management standards

## Testing & Validation

### Test Cases

- Patient registration with Myanmar NRC
- SSB claim submission and processing
- Encounter creation with proper coding
- Medication ordering with MEML codes
- Laboratory result reporting

### Validation Tools

- FHIR R5 validation server
- Myanmar-specific profile validation
- MOH compliance testing
- Interoperability testing with national systems

## Deployment Considerations

### Infrastructure

- Data center requirements (local)
- Network bandwidth considerations
- Myanmar language support
- Regional deployment zones
- Traditional medicine integration

### Support

- Local technical support 24/7
- Myanmar language documentation
- Training programs in Myanmar
- User community forums
- MOH help desk integration

## Compliance Requirements

### MOH Standards

- Hospital Accreditation compliance
- Quality Improvement reporting
- Infection control reporting
- Medical device reporting
- Emergency care standards

### Legal Requirements

- Myanmar Medical Council regulations
- Nursing and Midwifery Council standards
- Pharmacy Council requirements
- Dental Council regulations
- Traditional Medicine Council rules

## Performance Metrics

### System Performance

- < 3 second patient lookup with NRC
- Real-time SSB claim validation
- 99.8% uptime during business hours
- Support for 3,000+ concurrent users

### Quality Metrics

- 100% Myanmar character encoding support
- < 1% data error rate in Myanmar language
- Complete audit trail in Myanmar and English
- Real-time synchronization with national systems

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)

- Myanmar language support implementation
- NRC integration
- Basic SSB connectivity

### Phase 2: Advanced Features (Week 3-4)

- Complete MOH compliance
- Myanmar coding system integration
- National system connectivity

### Phase 3: Optimization (Week 5-6)

- Performance tuning for Myanmar language
- Traditional medicine integration
- Mobile application Myanmar support

## Resources

### Documentation

- [MOH Digital Health Guidelines](https://moh.gov.mm/digital-health)
- [Myanmar National Health Data Standards](https://nhdc.moh.gov.mm)
- [Social Security Board Technical Specifications](https://ssb.gov.mm)
- [FHIR R5 Specification](http://hl7.org/fhir/R5/)

### Support

- Technical Support: fhir-mm at zarishsphere dot com
- Documentation: [ZARISH SPHERE FHIR MM](https://docs.zarishsphere.com/fhir-mm)
- MOH: [Ministry of Health](https://moh.gov.mm)
- NHDC: [National Health Data Center](https://nhdc.moh.gov.mm)

### Training

- MOH Certified Training Programs
- Myanmar Healthcare IT Certification
- FHIR R5 Implementation Workshops
- Hospital Information System Training

## Related Links

- [FHIR R5 Data Classification](../data-classification.md)
- [Regulatory Compliance](../regulatory-compliance.md)
- [Implementation Examples](../example-implementation.md)
- [Patient Resource](../patient.md)
- [Search Operations](../search-operations.md)
- [Bangladesh Configuration](./bangladesh/overview.md)
- [Thailand Configuration](./thailand/overview.md)

---

**Last Updated**: 2026-01-26
**Version**: 1.0.0
**Country**: Myanmar
**Standard**: FHIR R5
**Regulatory Body**: MOH
````
