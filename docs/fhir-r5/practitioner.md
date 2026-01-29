---
title: 'Practitioner Resource'
sidebar_label: 'Practitioner'
description: 'Comprehensive guide to FHIR R5 Practitioner resource implementation in ZARISH SPHERE'
keywords: [practitioner, fhir r5, healthcare providers, clinicians, healthcare, zarish sphere]
---

# FHIR R5 Practitioner Resource

## Overview

The Practitioner resource represents healthcare providers and staff in ZARISH SPHERE. This implementation follows FHIR R5 specifications with humanitarian and low-resource optimizations, supporting various healthcare provider types including clinicians, nurses, community health workers, and volunteers.

## Resource Structure

### Core Elements

````json
{
  "resourceType": "Practitioner",
  "id": "practitioner-123",
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MD",
            "display": "Medical License number"
          }
        ]
      },
      "system": "https://zarishsphere.com/license",
      "value": "MD-2023-001234"
    }
  ],
  "active": true,
  "name": [
    {
      "use": "official",
      "family": "Johnson",
      "given": ["Sarah", "Marie"],
      "prefix": ["Dr."],
      "suffix": ["MD"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+1-555-123-4567",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "sarah.johnson@hospital.org",
      "use": "work"
    }
  ],
  "gender": "female",
  "birthDate": "1975-03-15",
  "address": [
    {
      "use": "home",
      "line": ["123 Medical Center Drive"],
      "city": "Boston",
      "state": "MA",
      "postalCode": "02101",
      "country": "USA"
    }
  ],
  "qualification": [
    {
      "identifier": [
        {
          "system": "https://zarishsphere.com/qualification",
          "value": "QUAL-2023-001"
        }
      ],
      "code": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
            "code": "MD",
            "display": "Doctor of Medicine"
          }
        ],
        "text": "Medical Doctor"
      },
      "issuer": {
        "display": "State Medical Board"
      },
      "period": {
        "start": "2000-06-15"
      }
    }
  ]
}
```text

## ZARISH SPHERE Extensions

### Humanitarian Extensions

### Volunteer Status

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/volunteer-status",
      "extension": [
        {
          "url": "isVolunteer",
          "valueBoolean": true
        },
        {
          "url": "volunteerType",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/volunteer-type",
                "code": "international",
                "display": "International Volunteer"
              }
            ]
          }
        },
        {
          "url": "organization",
          "valueReference": {
            "reference": "Organization/ngo-001",
            "display": "International Medical Corps"
          }
        },
        {
          "url": "deploymentDuration",
          "valueDuration": {
            "value": 6,
            "unit": "months",
            "system": "http://unitsofmeasure.org",
            "code": "mo"
          }
        }
      ]
    }
  ]
}
```text

### Community Health Worker

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/community-health-worker",
      "extension": [
        {
          "url": "isCHW",
          "valueBoolean": true
        },
        {
          "url": "trainingLevel",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/chw-training-level",
                "code": "basic",
                "display": "Basic Training"
              }
            ]
          }
        },
        {
          "url": "communityServed",
          "valueString": "Rural Village Cluster A"
        },
        {
          "url": "supervisor",
          "valueReference": {
            "reference": "Practitioner/supervisor-123",
            "display": "Dr. Michael Chen"
          }
        }
      ]
    }
  ]
}
```text

### Low-Resource Optimizations

### Mobile Practitioner

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/mobile-practitioner",
      "extension": [
        {
          "url": "mobileClinic",
          "valueBoolean": true
        },
        {
          "url": "vehicleId",
          "valueString": "MOBILE-CLINIC-001"
        },
        {
          "url": "serviceArea",
          "valueString": "Northern District Villages"
        },
        {
          "url": "connectivity",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/connectivity-level",
                "code": "limited",
                "display": "Limited Connectivity"
              }
            ]
          }
        }
      ]
    }
  ]
}
```json

## Practitioner Categories

### Standard FHIR Categories

| Category          | Description            | Examples                                     |
| ----------------- | ---------------------- | -------------------------------------------- |
| **Physician**     | Medical doctors        | General practitioners, specialists           |
| **Nurse**         | Nursing professionals  | Registered nurses, nurse practitioners       |
| **Pharmacist**    | Pharmacy professionals | Clinical pharmacists, pharmacy technicians   |
| **Therapist**     | Therapy professionals  | Physical therapists, occupational therapists |
| **Technician**    | Technical staff        | Lab technicians, radiology technicians       |
| **Administrator** | Administrative staff   | Hospital administrators, department heads    |

### ZARISH SPHERE Custom Categories

| Category                    | Description                        | Examples                                               |
| --------------------------- | ---------------------------------- | ------------------------------------------------------ |
| **Community Health Worker** | Local health workers               | Village health workers, traditional birth attendants   |
| **Volunteer**               | Volunteer healthcare providers     | International volunteers, local volunteers             |
| **Traditional Healer**      | Traditional medicine practitioners | Herbalists, traditional birth attendants               |
| **Emergency Response**      | Emergency response personnel       | Disaster response teams, emergency medical technicians |
| **Mobile Clinic Staff**     | Mobile healthcare team members     | Mobile clinic doctors, nurses, drivers                 |

## Search Parameters

### Standard FHIR Parameters

| Parameter    | Type   | Description                | Example            |
| ------------ | ------ | -------------------------- | ------------------ |
| `_id`        | token  | Logical id of the resource | `practitioner-123` |
| `identifier` | token  | Practitioner identifiers   | `MD-2023-001234`   |
| `family`     | string | Family name                | `Johnson`          |
| `given`      | string | Given name                 | `Sarah`            |
| `gender`     | token  | Gender                     | `female`           |
| `birthDate`  | date   | Date of birth              | `1975-03-15`       |
| `active`     | token  | Active status              | `true`             |

### ZARISH SPHERE Custom Parameters

| Parameter           | Type  | Description                            | Example      |
| ------------------- | ----- | -------------------------------------- | ------------ |
| `volunteer-status`  | token | Volunteer status                       | `true`       |
| `chw-level`         | token | Community health worker training level | `basic`      |
| `mobile-clinic`     | token | Mobile clinic assignment               | `true`       |
| `organization-type` | token | Organization type                      | `ngo`        |
| `specialty`         | token | Medical specialty                      | `pediatrics` |

## API Operations

### Create Practitioner

```http
POST /fhir/Practitioner
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Practitioner",
  "name": [
    {
      "use": "official",
      "family": "Johnson",
      "given": ["Sarah", "Marie"],
      "prefix": ["Dr."]
    }
  ],
  "gender": "female",
  "birthDate": "1975-03-15",
  "qualification": [
    {
      "code": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
            "code": "MD",
            "display": "Doctor of Medicine"
          }
        ]
      },
      "issuer": {
        "display": "State Medical Board"
      }
    }
  ]
}
```text

### Search Practitioners

```http
GET /fhir/Practitioner?family=Johnson&given=Sarah
Accept: application/fhir+json
Authorization: Bearer {access_token}
```json

### Update Practitioner

```http
PUT /fhir/Practitioner/practitioner-123
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{
  "resourceType": "Practitioner",
  "id": "practitioner-123",
  "name": [
    {
      "use": "official",
      "family": "Johnson",
      "given": ["Sarah", "Marie"],
      "prefix": ["Dr."],
      "suffix": ["MD"]
    }
  ],
  "gender": "female",
  "birthDate": "1975-03-15",
  "telecom": [
    {
      "system": "phone",
      "value": "+1-555-123-4567",
      "use": "mobile"
    }
  ]
}
```javascript

## Implementation Examples

### Community Health Worker Registration

```javascript
async function createCommunityHealthWorker(chwData) {
  const practitioner = {
    resourceType: 'Practitioner',
    name: [
      {
        use: 'official',
        family: chwData.lastName,
        given: [chwData.firstName],
        prefix: chwData.prefix,
      },
    ],
    gender: chwData.gender,
    birthDate: chwData.birthDate,
    telecom: [
      {
        system: 'phone',
        value: chwData.phone,
        use: 'mobile',
      },
    ],
    qualification: [
      {
        code: {
          coding: [
            {
              system: 'https://zarishsphere.com/fhir/CodeSystem/chw-qualification',
              code: chwData.qualification,
              display: chwData.qualificationDisplay,
            },
          ],
        },
        period: {
          start: chwData.trainingDate,
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/community-health-worker',
        extension: [
          {
            url: 'isCHW',
            valueBoolean: true,
          },
          {
            url: 'trainingLevel',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/chw-training-level',
                  code: chwData.trainingLevel,
                  display: chwData.trainingLevelDisplay,
                },
              ],
            },
          },
          {
            url: 'communityServed',
            valueString: chwData.community,
          },
          {
            url: 'supervisor',
            valueReference: {
              reference: `Practitioner/${chwData.supervisorId}`,
              display: chwData.supervisorName,
            },
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Practitioner', practitioner);
}
```javascript

### Volunteer Practitioner Registration

```javascript
async function createVolunteerPractitioner(volunteerData) {
  const practitioner = {
    resourceType: 'Practitioner',
    name: [
      {
        use: 'official',
        family: volunteerData.lastName,
        given: [volunteerData.firstName],
        prefix: volunteerData.prefix,
      },
    ],
    gender: volunteerData.gender,
    birthDate: volunteerData.birthDate,
    telecom: [
      {
        system: 'email',
        value: volunteerData.email,
        use: 'work',
      },
    ],
    qualification: [
      {
        code: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
              code: volunteerData.qualification,
              display: volunteerData.qualificationDisplay,
            },
          ],
        },
        issuer: {
          display: volunteerData.issuingAuthority,
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/volunteer-status',
        extension: [
          {
            url: 'isVolunteer',
            valueBoolean: true,
          },
          {
            url: 'volunteerType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/volunteer-type',
                  code: volunteerData.volunteerType,
                  display: volunteerData.volunteerTypeDisplay,
                },
              ],
            },
          },
          {
            url: 'organization',
            valueReference: {
              reference: `Organization/${volunteerData.organizationId}`,
              display: volunteerData.organizationName,
            },
          },
          {
            url: 'deploymentDuration',
            valueDuration: {
              value: volunteerData.durationMonths,
              unit: 'months',
              system: 'http://unitsofmeasure.org',
              code: 'mo',
            },
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Practitioner', practitioner);
}
```javascript

### Mobile Clinic Practitioner

```javascript
async function createMobileClinicPractitioner(practitionerData) {
  const practitioner = {
    resourceType: 'Practitioner',
    name: [
      {
        use: 'official',
        family: practitionerData.lastName,
        given: [practitionerData.firstName],
        prefix: practitionerData.prefix,
      },
    ],
    gender: practitionerData.gender,
    telecom: [
      {
        system: 'phone',
        value: practitionerData.phone,
        use: 'mobile',
      },
    ],
    qualification: [
      {
        code: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
              code: practitionerData.qualification,
              display: practitionerData.qualificationDisplay,
            },
          ],
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/mobile-practitioner',
        extension: [
          {
            url: 'mobileClinic',
            valueBoolean: true,
          },
          {
            url: 'vehicleId',
            valueString: practitionerData.vehicleId,
          },
          {
            url: 'serviceArea',
            valueString: practitionerData.serviceArea,
          },
          {
            url: 'connectivity',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/connectivity-level',
                  code: practitionerData.connectivity,
                  display: practitionerData.connectivityDisplay,
                },
              ],
            },
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Practitioner', practitioner);
}
```javascript

## Validation Rules

### Required Fields

- At least one name is required
- Gender must be specified
- Birth date is required for adult practitioners
- At least one qualification is required for clinical practitioners

### Business Rules

### Name Validation

```javascript
function validatePractitionerName(practitioner) {
  if (!practitioner.name || practitioner.name.length === 0) {
    throw new Error('Practitioner must have at least one name');
  }

  const officialName = practitioner.name.find((n) => n.use === 'official');
  if (officialName && !officialName.family) {
    throw new Error('Official name must include family name');
  }

  if ((officialName && !officialName.given) || officialName.given.length === 0) {
    throw new Error('Official name must include at least one given name');
  }
}
```javascript

### Qualification Validation

```javascript
function validatePractitionerQualifications(practitioner) {
  const hasQualification = practitioner.qualification && practitioner.qualification.length > 0;
  const isClinicalPractitioner = practitioner.extension?.some(
    (ext) => ext.url === 'https://zarishsphere.com/fhir/StructureDefinition/clinical-practitioner'
  );

  if (isClinicalPractitioner && !hasQualification) {
    throw new Error('Clinical practitioners must have at least one qualification');
  }

  for (const qualification of practitioner.qualification || []) {
    if (!qualification.code) {
      throw new Error('Each qualification must have a code');
    }
  }
}
```javascript

### Volunteer Status Validation

```javascript
function validateVolunteerStatus(practitioner) {
  const volunteerExtension = practitioner.extension?.find(
    (ext) => ext.url === 'https://zarishsphere.com/fhir/StructureDefinition/volunteer-status'
  );

  if (volunteerExtension) {
    const isVolunteer = volunteerExtension.extension?.find((ext) => ext.url === 'isVolunteer');

    if (isVolunteer && !isVolunteer.valueBoolean) {
      throw new Error('Volunteer status must be true if volunteer extension is present');
    }

    const organization = volunteerExtension.extension?.find((ext) => ext.url === 'organization');

    if (isVolunteer && !organization) {
      throw new Error('Volunteer practitioners must have an associated organization');
    }
  }
}
```json

## Error Handling

### Common Errors

| Error                    | Description                        | Resolution                                                   |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------ |
| `INVALID_NAME`           | Practitioner name format not valid | Check name structure and required fields                     |
| `INVALID_QUALIFICATION`  | Qualification format not valid     | Ensure qualification has code and issuer                     |
| `MISSING_REQUIRED_FIELD` | Required field is missing          | Ensure all required fields are provided                      |
| `DUPLICATE_LICENSE`      | License number already exists      | Use different license number or update existing practitioner |

### Error Response Example

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Practitioner must have at least one name with family name"
      },
      "location": ["Practitioner.name"]
    }
  ]
}
```javascript

## Performance Optimization

### Caching Strategy

- Active practitioners cached for 24 hours
- Practitioner search results cached for 1 hour
- Qualification data cached for 7 days
- Mobile clinic assignments cached for real-time access

### Batch Operations

```javascript
async function batchCreatePractitioners(practitioners) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'batch',
    entry: practitioners.map((practitioner) => ({
      fullUrl: `urn:uuid:${generateUUID()}`,
      resource: practitioner,
      request: {
        method: 'POST',
        url: 'Practitioner',
      },
    })),
  };

  return await fetch('/fhir/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bundle),
  });
}
```javascript

## Integration Examples

### HR System Integration

```javascript
async function syncFromHRSystem(hrData) {
  const practitioner = {
    resourceType: 'Practitioner',
    identifier: [
      {
        use: 'official',
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'MD',
            },
          ],
        },
        system: 'https://zarishsphere.com/license',
        value: hrData.licenseNumber,
      },
    ],
    name: [
      {
        use: 'official',
        family: hrData.lastName,
        given: [hrData.firstName],
        prefix: [hrData.title],
      },
    ],
    gender: hrData.gender.toLowerCase(),
    birthDate: hrData.birthDate,
    telecom: [
      {
        system: 'email',
        value: hrData.email,
        use: 'work',
      },
      {
        system: 'phone',
        value: hrData.phone,
        use: 'mobile',
      },
    ],
    qualification: hrData.qualifications.map((qual) => ({
      code: {
        coding: [
          {
            system: qual.system,
            code: qual.code,
            display: qual.display,
          },
        ],
      },
      issuer: {
        display: qual.issuer,
      },
      period: {
        start: qual.issueDate,
      },
    })),
  };

  return await createFHIRResource('Practitioner', practitioner);
}
```text

This comprehensive Practitioner resource guide ensures proper implementation across all healthcare provider scenarios while maintaining humanitarian focus and low-resource optimization.
````
