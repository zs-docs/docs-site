---
title: 'Patient Resource'
sidebar_label: 'Patient'
description: 'Comprehensive guide to FHIR R5 Patient resource implementation in ZARISH SPHERE with country-specific profiles'
keywords: [patient, fhir r5, demographics, healthcare, zarish sphere, bangladesh, thailand, myanmar]
---

# FHIR R5 Patient Resource

## Overview

The Patient resource is central to healthcare data management in ZARISH SPHERE, representing individuals receiving care across all healthcare settings. This implementation follows FHIR R5 specifications with country-specific optimizations for Bangladesh, Thailand, and Myanmar.

## Resource Structure

### Core Elements

````json
{
  "resourceType": "Patient",
  "id": "patient-12345",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Patient",
      "http://zarishsphere.com/fhir/StructureDefinition/Patient-BD",
      "http://zarishsphere.com/fhir/StructureDefinition/Patient-TH",
      "http://zarishsphere.com/fhir/StructureDefinition/Patient-MM"
    ],
    "lastUpdated": "2026-01-26T10:30:00+06:00"
  },
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MR",
            "display": "Medical Record Number"
          }
        ]
      },
      "system": "http://hospital.zarishsphere.com/mrn",
      "value": "MRN-2026-001234",
      "period": {
        "start": "2026-01-01"
      }
    }
  ],
  "active": true,
  "name": [
    {
      "use": "official",
      "family": "Rahman",
      "given": ["Mohammad", "Karim"],
      "prefix": ["Mr"],
      "suffix": ["Jr"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801712345678",
      "use": "mobile",
      "rank": 1
    },
    {
      "system": "email",
      "value": "patient@example.com",
      "use": "home"
    }
  ],
  "gender": "male",
  "birthDate": "1985-06-15",
  "address": [
    {
      "use": "home",
      "type": "both",
      "text": "123, Dhanmondi Road, Dhanmondi, Dhaka 1205",
      "line": ["123", "Dhanmondi Road"],
      "city": "Dhaka",
      "district": "Dhanmondi",
      "state": "Dhaka Division",
      "postalCode": "1205",
      "country": "BD"
    }
  ],
  "maritalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
        "code": "M",
        "display": "Married"
      }
    ]
  },
  "multipleBirthBoolean": false,
  "communication": [
    {
      "language": {
        "coding": [
          {
            "system": "urn:ietf:bcp:47",
            "code": "bn",
            "display": "Bengali"
          }
        ],
        "text": "Bengali"
      },
      "preferred": true
    }
  ]
}
```text

## Country-Specific Profiles

### Bangladesh Patient Profile

### National ID Integration

```json
{
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "BANGLADESH_NID",
            "display": "Bangladesh National ID"
          }
        ]
      },
      "system": "http://nid.gov.bd",
      "value": "199012345678901",
      "period": {
        "start": "2010-01-01"
      }
    },
    {
      "use": "secondary",
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "HEALTH_CARD",
            "display": "Health Card Number"
          }
        ]
      },
      "system": "http://dghs.gov.bd/health-card",
      "value": "HC-123456789"
    }
  ]
}
```text

### Bengali Language Support

```json
{
  "name": [
    {
      "use": "official",
      "text": "মোহাম্মদ রহিম",
      "family": "মোহাম্মদ",
      "given": ["রহিম"],
      "_family": {
        "extension": [
          {
            "url": "http://hl7.org/fhir/R5/StructureDefinition/humanname-own-name",
            "valueString": "মোহাম্মদ"
          }
        ]
      }
    }
  ],
  "communication": [
    {
      "language": {
        "coding": [
          {
            "system": "urn:ietf:bcp:47",
            "code": "bn",
            "display": "Bengali"
          }
        ]
      },
      "preferred": true
    }
  ]
}
```text

### Thailand Patient Profile

### Thai National ID

```json
{
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "THAI_NATIONAL_ID",
            "display": "Thai National ID"
          }
        ]
      },
      "system": "http://pid.moph.go.th",
      "value": "1234567890123",
      "period": {
        "start": "2005-01-01"
      }
    },
    {
      "use": "secondary",
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "UCS_ID",
            "display": "Universal Coverage Scheme ID"
          }
        ]
      },
      "system": "http://uc.nhso.go.th",
      "value": "UCS-123456789"
    }
  ]
}
```text

### Thai Language Support

```json
{
  "name": [
    {
      "use": "official",
      "text": "สมชาย ใจดี",
      "family": "ใจดี",
      "given": ["สมชาย"]
    }
  ],
  "address": [
    {
      "use": "home",
      "text": "123 ถนนสุขุมวิทย์ แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร 10110",
      "line": ["123", "ถนนสุขุมวิทย์"],
      "city": "กรุงเทพมหานคร",
      "district": "คลองเตย",
      "state": "กรุงเทพมหานคร",
      "postalCode": "10110",
      "country": "TH"
    }
  ]
}
```text

### Myanmar Patient Profile

### Myanmar National Registration Card

```json
{
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "MYANMAR_NRC",
            "display": "Myanmar NRC"
          }
        ]
      },
      "system": "http://nrc.gov.mm",
      "value": "12/ABC(N)123456",
      "period": {
        "start": "2010-01-01"
      }
    },
    {
      "use": "secondary",
      "type": {
        "coding": [
          {
            "system": "http://terminology.zarishsphere.com/identifier-type",
            "code": "SSB_ID",
            "display": "Social Security Board ID"
          }
        ]
      },
      "system": "http://ssb.gov.mm",
      "value": "SSB-123456789"
    }
  ]
}
```text

### Myanmar Language Support

```json
{
  "name": [
    {
      "use": "official",
      "text": "အောင်ဆက်မောင်",
      "family": "အောင်ဆက်",
      "given": ["မောင်"]
    }
  ],
  "address": [
    {
      "use": "home",
      "text": "No. 123, Pyay Road, Kamayut Township, Yangon, Myanmar",
      "line": ["No. 123", "Pyay Road"],
      "city": "Yangon",
      "district": "Kamayut",
      "state": "Yangon Region",
      "postalCode": "11041",
      "country": "MM"
    }
  ]
}
```text

## Implementation Guidelines

### Required Elements

All Patient resources in ZARISH SPHERE must include:

1. **At least one identifier** - MRN or national ID
2. **At least one name** - Official name required
3. **Gender** - Male, Female, Other, or Unknown
4. **Active status** - Boolean indicating if patient is active

### Recommended Elements

1. **Birth date** - For age calculation and clinical decision support
2. **Address** - For location-based services and reporting
3. **Telecom** - For communication and appointment reminders
4. **Communication** - Language preferences for care delivery

### Extensions

### Human Name Extensions

```json
{
  "name": [
    {
      "use": "official",
      "family": "Rahman",
      "given": ["Mohammad"],
      "_family": {
        "extension": [
          {
            "url": "http://hl7.org/fhir/R5/StructureDefinition/humanname-own-name",
            "valueString": "রহিম"
          },
          {
            "url": "http://hl7.org/fhir/R5/StructureDefinition/humanname-fathers-name",
            "valueString": "আব্দুর রহিম"
          }
        ]
      }
    }
  ]
}
```text

### Patient Citizenship

```json
{
  "extension": [
    {
      "url": "http://hl7.org/fhir/R5/StructureDefinition/patient-citizenship",
      "extension": [
        {
          "url": "code",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "urn:iso:std:iso:3166",
                "code": "BD",
                "display": "Bangladesh"
              }
            ]
          }
        }
      ]
    }
  ]
}
```json

## API Operations

### Create Patient

```http
POST /Patient
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "name": [{
    "use": "official",
    "family": "Rahman",
    "given": ["Mohammad"]
  }],
  "gender": "male",
  "birthDate": "1985-06-15"
}
```text

### Search Patients

```http
GET /Patient?family=Rahman&given=Mohammad&gender=male
GET /Patient?identifier=MRN-2026-001234
GET /Patient?birth-date=1985-06-15
```json

### Update Patient

```http
PUT /Patient/patient-12345
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "id": "patient-12345",
  "name": [{
    "use": "official",
    "family": "Rahman",
    "given": ["Mohammad", "Karim"]
  }],
  "gender": "male",
  "birthDate": "1985-06-15"
}
```json

## Validation Rules

### Business Rules

1. **National ID Format Validation**
   - Bangladesh: 10 or 13 digits
   - Thailand: 13 digits
   - Myanmar: Format: XX/XXX(N)XXXXXX

2. **Name Validation**
   - At least one given name required
   - Family name required for official records
   - Special characters limited to hyphens and apostrophes

3. **Birth Date Validation**
   - Must be in valid date format
   - Cannot be in the future
   - Age must be reasonable (0-150 years)

### Technical Validation

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "diagnostics": "Invalid national ID format for Bangladesh"
    }
  ]
}
```javascript

## Integration Examples

### EMR Integration

```javascript
// Create patient from EMR registration
const patient = {
  resourceType: 'Patient',
  identifier: [
    {
      use: 'official',
      system: 'http://hospital.zarishsphere.com/mrn',
      value: emrData.mrn,
    },
  ],
  name: [
    {
      use: 'official',
      family: emrData.lastName,
      given: emrData.firstName,
    },
  ],
  gender: emrData.gender.toLowerCase(),
  birthDate: emrData.birthDate,
};

// Validate against country-specific profile
const validation = await validateFHIRResource(patient, 'Patient-BD');
```javascript

### Mobile App Integration

```javascript
// Patient lookup by national ID
const searchParams = new URLSearchParams({
  identifier: `BANGLADESH_NID|${nationalId}`,
  _format: 'json',
});

const response = await fetch(`/fhir/Patient?${searchParams}`);
const bundle = await response.json();

if (bundle.entry && bundle.entry.length > 0) {
  const patient = bundle.entry[0].resource;
  return patient;
} else {
  // Create new patient if not found
  return await createNewPatient(mobileData);
}
```text

## Testing Scenarios

### Test Case 1: Patient Registration

```gherkin
Feature: Patient Registration
  Scenario: Register new patient with Bangladesh National ID
    Given a new patient registration form
    When the patient provides valid Bangladesh National ID
    Then the system should create a Patient resource
    And the patient should be searchable by NID
    And the MRN should be automatically generated

  Scenario: Register patient with invalid NID
    Given a new patient registration form
    When the patient provides invalid Bangladesh National ID
    Then the system should return validation error
    And the registration should fail
```text

### Test Case 2: Patient Search

```gherkin
Feature: Patient Search Operations
  Scenario: Search patients by country-specific identifiers
    Given the FHIR server is running
    When searching for patients by Bangladesh National ID
      | identifier | country |
      | 199012345678901 | BD |
    Then the system should return matching patients
    And the response should include the NID identifier

  Scenario: Search patients with pagination
    Given 50 patients exist in the system
    When searching with count=10 and page=1
    Then the system should return 10 patients
    And the bundle should include a next link

  Scenario: Search patients with sorting
    Given patients with different birth dates
    When searching with sort=birthdate
    Then the results should be sorted by birth date
    And the oldest patient should appear first
```text

## Performance Considerations

### Indexing Strategy

- **MRN**: Unique index for fast lookup
- **National ID**: Indexed with country prefix
- **Name**: Composite index on family + given names
- **Birth Date**: Indexed for age-based queries
- **Address**: Geospatial indexing for location queries

### Caching Strategy

- **Patient lookup**: Cache frequently accessed patients
- **Search results**: Cache search results for 5 minutes
- **Validation rules**: Cache country-specific validation rules

## Security Considerations

### Data Protection

- **Encryption**: All PHI encrypted at rest and in transit
- **Access Control**: Role-based access to patient data
- **Audit Trail**: Complete audit trail for all patient operations
- **Data Retention**: Configurable retention policies per country

### Privacy Controls

- **Consent Management**: Patient consent for data sharing
- **Data Minimization**: Only collect necessary patient information
- **Right to Access**: Patient access to their health data
- **Right to Erasure**: Patient data deletion upon request

## Troubleshooting

### Common Issues

**Problem**: Patient creation fails with validation error
**Solution**: Check national ID format and required fields

**Problem**: Search returns no results
**Solution**: Verify search parameters and indexing

**Problem**: Duplicate patient records
**Solution**: Implement patient matching algorithms

### Support Resources

- Technical Support: fhir-support at zarishsphere dot com
- Documentation: [ZARISH SPHERE FHIR Patient](https://docs.zarishsphere.com/fhir-patient)
- FHIR R5 Specification: [FHIR Patient](http://hl7.org/fhir/R5/patient.html)

## Related Links

- [Practitioner Resource](./practitioner.md)
- [Encounter Resource](./encounter.md)
- [Observation Resource](./observation.md)
- [Medication Resource](./medication.md)
- [Country Configurations](./country-configs/)

---

**Last Updated**: 2026-01-26
**Version**: 2.0.0
**Resource**: Patient
**Standard**: FHIR R5
````
