---
sidebar_position: 1
sidebar_label: 'Thailand Configuration'
title: 'Thailand FHIR R5 Configuration'
description: 'FHIR R5 implementation guide for Thailand healthcare system with MOPH standards and local adaptations'
keywords: [fhir, thailand, healthcare, digital health, moph, thai healthcare]
---

# Thailand FHIR R5 Configuration

## Overview

This configuration provides FHIR R5 implementation guidelines specifically tailored for the Thailand healthcare system, incorporating Ministry of Public Health (MOPH) requirements, local regulatory frameworks, and Thai healthcare practices.

## Regulatory Framework

### Ministry of Public Health (MOPH)

- National Health Data Standards (NHDS)
- Hospital Accreditation Standards (HA)
- Thai Healthcare Information System Standards (THISS)
- Data Privacy and Security Act 2019
- Telemedicine Regulations 2022

### Health Data Standards

- Thai National Healthcare Database (NHDB)
- Universal Coverage Scheme (UCS) data standards
- Social Security Scheme (SSS) requirements
- Civil Servant Medical Benefit Scheme (CSMBS) standards

## Local Adaptations

### Patient Identification

- Thai National ID (13-digit)
- Hospital Registration Number
- Universal Coverage Scheme ID
- Social Security Number
- Passport Number (for foreigners)

### Healthcare Provider Registry

- Medical Council of Thailand (MCT)
- Nursing and Midwifery Council
- Pharmacy Council
- Dental Council
- Public Health Professional Council

### Facility Registry

- MOPH Hospital Licensing
- Private Hospital Association
- Clinic Registration Standards
- Pharmacy Licensing Requirements
- Diagnostic Center Accreditation

## Data Standards

### Coding Systems

- **Diagnoses**: ICD-10-TM (Thai Modification)
- **Procedures**: ICD-9-CM-TM (Thai Modification)
- **Medications**: Thai Drug and Medical Supply Registry (TDMS)
- **Laboratory**: LOINC with Thai extensions
- **Allergies**: SNOMED CT with Thai terms

### Language Support

- Primary: Thai (ไทย)
- Secondary: English
- Character encoding: UTF-8
- Date format: DD/MM/YYYY (Buddhist Era: พ.ศ.)

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
            "code": "THAI_NATIONAL_ID",
            "display": "Thai National ID"
          }
        ]
      },
      "value": "1234567890123"
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "UCS_ID",
            "display": "Universal Coverage Scheme ID"
          }
        ]
      },
      "value": "UCS-123456789"
    }
  ],
  "name": [
    {
      "use": "official",
      "text": "สมชาย ใจดี",
      "family": "ใจดี",
      "given": ["สมชาย"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+66812345678",
      "use": "mobile"
    }
  ],
  "address": [
    {
      "use": "home",
      "text": "123 ถนนสุขุมวิทย์ แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร 10110",
      "city": "กรุงเทพมหานคร",
      "district": "คลองเตย",
      "province": "กรุงเทพมหานคร",
      "postalCode": "10110",
      "country": "TH"
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
          "code": "OPD_UCS",
          "display": "OPD - Universal Coverage"
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
    "start": "2026-01-26T10:30:00+07:00",
    "end": "2026-01-26T11:15:00+07:00"
  }
}
```text

## Integration Points

### National Systems

- **National Health Data Center (NHDC)**
- **Universal Coverage Scheme (UCS) Database**
- **Social Security Office (SSO) Systems**
- **National Cancer Institute Registry**
- **Disease Control Department Systems**

### Private Systems

- Hospital Information Systems (HIS)
- Laboratory Information Systems (LIS)
- Pharmacy Management Systems
- Insurance Company Systems
- Telemedicine Platforms

## Security & Privacy

### Data Protection

- Personal Data Protection Act (PDPA) 2019
- Health Information Security Standards
- Data localization requirements
- Cross-border data transfer restrictions

### Authentication

- National ID verification
- Digital signature requirements
- Multi-factor authentication
- Session management standards

## Testing & Validation

### Test Cases

- Patient registration with Thai National ID
- UCS claim submission and processing
- Encounter creation with proper coding
- Medication ordering with TDMS codes
- Laboratory result reporting

### Validation Tools

- FHIR R5 validation server
- Thai-specific profile validation
- MOPH compliance testing
- Interoperability testing with national systems

## Deployment Considerations

### Infrastructure

- Data center requirements (local)
- Network bandwidth considerations
- Thai language support
- Buddhist Era date handling
- Regional deployment zones

### Support

- Local technical support 24/7
- Thai language documentation
- Training programs in Thai
- User community forums
- MOPH help desk integration

## Compliance Requirements

### MOPH Standards

- Hospital Accreditation (HA) compliance
- Quality Improvement (QI) reporting
- Infection control reporting
- Medical device reporting
- Emergency care standards

### Legal Requirements

- Medical Council of Thailand regulations
- Nursing and Midwifery Council standards
- Pharmacy Council requirements
- Dental Council regulations
- Public Health Professional Council rules

## Performance Metrics

### System Performance

- < 2 second patient lookup with Thai ID
- Real-time UCS claim validation
- 99.9% uptime during business hours
- Support for 5,000+ concurrent users

### Quality Metrics

- 100% Thai character encoding support
- < 0.5% data error rate in Thai language
- Complete audit trail in Thai and English
- Real-time synchronization with national systems

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)

- Thai language support implementation
- National ID integration
- Basic UCS connectivity

### Phase 2: Advanced Features (Week 3-4)

- Complete MOPH compliance
- Thai coding system integration
- National system connectivity

### Phase 3: Optimization (Week 5-6)

- Performance tuning for Thai language
- Advanced analytics
- Mobile application Thai support

## Resources

### Documentation

- [MOPH Digital Health Guidelines](https://moph.go.th/digital-health)
- [Thai National Health Data Standards](https://nhdc.moph.go.th)
- [Universal Coverage Scheme Technical Specifications](https://uc.nhso.go.th)
- [FHIR R5 Specification](http://hl7.org/fhir/R5/)

### Support

- Technical Support: fhir-th at zarishsphere dot com
- Documentation: [ZARISH SPHERE FHIR TH](https://docs.zarishsphere.com/fhir-th)
- MOPH: [Ministry of Public Health](https://moph.go.th)
- NHDC: [National Health Data Center](https://nhdc.moph.go.th)

### Training

- MOPH Certified Training Programs
- Thai Healthcare IT Certification
- FHIR R5 Implementation Workshops
- Hospital Information System Training

## Related Links

- [FHIR R5 Data Classification](../data-classification.md)
- [Regulatory Compliance](../regulatory-compliance.md)
- [Implementation Examples](../example-implementation.md)
- [Patient Resource](../patient.md)
- [Search Operations](../search-operations.md)

---

**Last Updated**: 2026-01-26
**Version**: 1.0.0
**Country**: Thailand
**Standard**: FHIR R5
**Regulatory Body**: MOPH
````
