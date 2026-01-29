---
sidebar_position: 1
---

# 🔌 REST API Reference

## Overview

The ZARISH SPHERE REST API provides comprehensive access to healthcare data and services following FHIR R5 standards. This API enables seamless integration with healthcare systems, EMR platforms, and third-party applications.

## 🚀 Getting Started

### Base URL

````text
Production: https://api.zarishsphere.com/v1
Staging: https://staging-api.zarishsphere.com/v1
Development: https://dev-api.zarishsphere.com/v1
```bash

### Authentication

All API requests require authentication using OAuth 2.0 Bearer tokens:

```bash
curl -X GET "https://api.zarishsphere.com/v1/Patient" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/fhir+json"
```javascript

### Getting Access Tokens

1. **Register your application** in the [Developer Portal](https://dev.zarishsphere.com)
2. **Create OAuth credentials** (client ID and client secret)
3. **Request authorization** using the authorization code flow
4. **Exchange authorization code** for access token

```javascript
// Example: Get access token
const response = await fetch('https://auth.zarishsphere.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    scope: 'patient/Patient.read patient/Observation.read'
  })
});

const { access_token } = await response.json();
```text

## 📋 API Endpoints

### Patient Resources

### Get Patients

```http
GET /Patient
```json

**Parameters:**

- `family` (string): Family name filter
- `given` (string): Given name filter
- `birthdate` (date): Birth date filter (eq, gt, lt, ge, le, sa, eb)
- `gender` (string): Gender filter (male, female, other, unknown)
- `_count` (integer): Number of results per page (default: 20, max: 100)
- `_page` (integer): Page number (default: 1)

**Response:**

```json
{
  "resourceType": "Bundle",
  "id": "bundle-example",
  "type": "searchset",
  "total": 1,
  "link": [
    {
      "relation": "self",
      "url": "https://api.zarishsphere.com/v1/Patient?family=Smith"
    }
  ],
  "entry": [
    {
      "fullUrl": "https://api.zarishsphere.com/v1/Patient/123",
      "resource": {
        "resourceType": "Patient",
        "id": "123",
        "name": [
          {
            "use": "official",
            "family": "Smith",
            "given": ["John"]
          }
        ],
        "gender": "male",
        "birthDate": "1980-01-15"
      }
    }
  ]
}
```text

### Create Patient

```http
POST /Patient
```json

**Request Body:**

```json
{
  "resourceType": "Patient",
  "name": [
    {
      "use": "official",
      "family": "Doe",
      "given": ["Jane"],
      "prefix": ["Dr."]
    }
  ],
  "gender": "female",
  "birthDate": "1990-05-20",
  "telecom": [
    {
      "system": "phone",
      "value": "+1-555-0123",
      "use": "mobile"
    }
  ],
  "address": [
    {
      "use": "home",
      "line": ["123 Main St"],
      "city": "Anytown",
      "state": "CA",
      "postalCode": "12345",
      "country": "USA"
    }
  ]
}
```sql

### Update Patient

```http
PUT /Patient/{id}
```sql

### Delete Patient

```http
DELETE /Patient/{id}
```text

### Observation Resources

### Get Observations

```http
GET /Observation
```bash

**Parameters:**

- `patient` (reference): Patient reference filter
- `code` (token): Observation code filter
- `date` (date): Observation date filter
- `category` (token): Observation category filter
- `_sort` (string): Sort order (date, -date, code, -code)

**Example: Get Vital Signs for Patient**

```bash
curl -X GET "https://api.zarishsphere.com/v1/Observation?patient=123&category=vital-signs&_sort=-date" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```text

### Create Observation

```http
POST /Observation
```json

**Request Body:**

```json
{
  "resourceType": "Observation",
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
    "reference": "Patient/123"
  },
  "effectiveDateTime": "2026-01-27T10:30:00+06:00",
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
        "value": 120,
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
        "value": 80,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    }
  ]
}
```text

### Encounter Resources

### Get Encounters

```http
GET /Encounter
```python

**Parameters:**

- `patient` (reference): Patient reference filter
- `date` (date): Encounter date filter
- `class` (token): Encounter class filter
- `status` (token): Encounter status filter

### Create Encounter

```http
POST /Encounter
```json

**Request Body:**

```json
{
  "resourceType": "Encounter",
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "ambulatory"
  },
  "subject": {
    "reference": "Patient/123"
  },
  "participant": [
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "ATND",
              "display": "attender"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/456"
      }
    }
  ],
  "period": {
    "start": "2026-01-27T09:00:00+06:00",
    "end": "2026-01-27T10:30:00+06:00"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "404684003",
          "display": "Clinical finding"
        }
      ]
    }
  ]
}
```text

## 🔍 Search Operations

### Advanced Search

The API supports FHIR R5 search parameters for complex queries:

### Chain Search

```bash
## Search patients by practitioner name
GET /Patient?general-practitioner.name=Smith

## Search observations by patient name
GET /Observation?patient.name=John
```text

### Include and Revinclude

```bash
## Include related resources
GET /Patient?_include=Patient:general-practitioner

## Reverse include
GET /Encounter?_revinclude=Provenance:target
```text

### Has Parameter

```bash
## Patients with observations
GET /Patient?_has=Observation:subject

## Encounters with specific conditions
GET /Encounter?_has=Condition:encounter
```json

### Custom Search Parameters

### Healthcare Specific

- `healthcare-service`: Search by healthcare service
- `organization`: Search by organization
- `location`: Search by location
- `specialty`: Search by medical specialty

### Country-Specific

- `country-code`: BD, TH, MM for Bangladesh, Thailand, Myanmar
- `region`: Administrative region within country
- `facility-type`: Hospital, clinic, pharmacy, laboratory

## 📊 Response Formats

### JSON Response Structure

All API responses follow FHIR R5 JSON format:

```json
{
  "resourceType": "ResourceType",
  "id": "resource-id",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2026-01-27T10:30:00+06:00",
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/ResourceType"
    ]
  },
  "implicitRules": "http://hl7.org/fhir/R5",
  "language": "en",
  "text": {
    "status": "generated",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">...</div>"
  }
}
```json

### Bundle Responses

Search operations return Bundle resources:

```json
{
  "resourceType": "Bundle",
  "id": "bundle-id",
  "type": "searchset",
  "total": 100,
  "link": [
    {
      "relation": "self",
      "url": "https://api.zarishsphere.com/v1/Patient?page=1"
    },
    {
      "relation": "next",
      "url": "https://api.zarishsphere.com/v1/Patient?page=2"
    },
    {
      "relation": "last",
      "url": "https://api.zarishsphere.com/v1/Patient?page=5"
    }
  ],
  "entry": [...]
}
```json

## ⚠️ Error Handling

### HTTP Status Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/R5/issue-severity",
            "code": "error",
            "display": "Error"
          }
        ]
      },
      "diagnostics": "Invalid parameter: birthDate must be in YYYY-MM-DD format",
      "location": ["Patient.birthDate"],
      "expression": ["Patient.birthDate"]
    }
  ]
}
```json

### Common Error Scenarios

### Validation Errors

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Patient.name is required"
      },
      "location": ["Patient.name"]
    }
  ]
}
```json

### Authentication Errors

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "security",
      "details": {
        "text": "Invalid or expired access token"
      }
    }
  ]
}
```text

## 🚦 Rate Limiting

### Rate Limits

| Plan | Requests per Hour | Requests per Minute |
|------|-------------------|---------------------|
| Free | 1,000 | 100 |
| Professional | 10,000 | 500 |
| Enterprise | 100,000 | 2,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1643299200
```json

### Handling Rate Limits

When rate limits are exceeded:

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "too-costly",
      "details": {
        "text": "Rate limit exceeded. Try again later."
      }
    }
  ]
}
```text

**Retry-After Header:**

```http
Retry-After: 60
```javascript

## 🔒 Security

### Authentication Methods

### OAuth 2.0 Authorization Code Flow

```javascript
// Step 1: Redirect user to authorization
const authUrl = `https://auth.zarishsphere.com/oauth2/authorize?` +
  `response_type=code&` +
  `client_id=${clientId}&` +
  `redirect_uri=${redirectUri}&` +
  `scope=${encodeURIComponent(scope)}&` +
  `state=${state}`;

// Step 2: Exchange code for token
const tokenResponse = await fetch('https://auth.zarishsphere.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  })
});
```javascript

### Client Credentials Flow

```javascript
const tokenResponse = await fetch('https://auth.zarishsphere.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'system/Patient.read system/Observation.read'
  })
});
```text

### Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| `patient/Patient.read` | Read patient data | Access patient information |
| `patient/Observation.read` | Read observations | Access vital signs and lab results |
| `patient/Encounter.read` | Read encounters | Access visit information |
| `system/*` | System-level access | Full system access (admin only) |

### JWT Token Structure

```json
{
  "iss": "https://auth.zarishsphere.com",
  "sub": "client-id",
  "aud": "https://api.zarishsphere.com",
  "exp": 1643299200,
  "iat": 1643295600,
  "scope": "patient/Patient.read patient/Observation.read",
  "client_id": "your-client-id"
}
```text

## 🌍 Internationalization

### Country-Specific Endpoints

### Bangladesh

```bash
## Bangladesh-specific patient data
GET /Patient?country-code=BD&region=dhaka
```text

### Thailand

```bash
## Thailand-specific patient data
GET /Patient?country-code=TH&region=bangkok
```text

### Myanmar

```bash
## Myanmar-specific patient data
GET /Patient?country-code=MM&region=yangon
```text

### Language Support

### Accept-Language Header

```http
Accept-Language: bn-BD,en-US;q=0.9
```json

### Localized Responses

```json
{
  "resourceType": "Patient",
  "name": [
    {
      "family": "আহমেদ",
      "given": ["রহিম"],
      "extension": [
        {
          "url": "http://hl7.org/fhir/R5/StructureDefinition/humanname-own-name",
          "valueString": "Rahim Ahmed"
        }
      ]
    }
  ]
}
```text

## 🧪 Testing

### Sandbox Environment

For testing purposes, use the sandbox environment:

```bash
## Sandbox base URL
https://sandbox-api.zarishsphere.com/v1

## Test credentials
Client ID: test-client-id
Client Secret: test-client-secret
```json

### Sample Test Data

### Test Patient

```json
{
  "resourceType": "Patient",
  "id": "test-patient-001",
  "name": [
    {
      "use": "official",
      "family": "TestPatient",
      "given": ["John"]
    }
  ],
  "gender": "male",
  "birthDate": "1990-01-01"
}
```bash

### Postman Collection

Download our [Postman Collection](https://api.zarishsphere.com/postman-collection) for easy testing:

1. Import the collection into Postman
2. Set environment variables:
   - `base_url`: <https://sandbox-api.zarishsphere.com/v1>
   - `access_token`: Your sandbox access token
3. Run requests from the collection

## 📚 SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @zarishsphere/api-client
```javascript

```typescript
import { ZarishSphereAPI } from '@zarishsphere/api-client';

const api = new ZarishSphereAPI({
  baseURL: 'https://api.zarishsphere.com/v1',
  accessToken: 'your-access-token'
});

// Get patients
const patients = await api.patient.search({
  family: 'Smith',
  _count: 10
});

// Create observation
const observation = await api.observation.create({
  resourceType: 'Observation',
  status: 'final',
  code: {
    coding: [{
      system: 'http://loinc.org',
      code: '85354-9'
    }]
  },
  subject: {
    reference: 'Patient/123'
  }
});
```text

### Python

```bash
pip install zarishsphere-python
```javascript

```python
from zarishsphere import ZarishSphereAPI

api = ZarishSphereAPI(
    base_url='https://api.zarishsphere.com/v1',
    access_token='your-access-token'
)

## Get patients
patients = api.patient.search(family='Smith', _count=10)

## Create observation
observation = api.observation.create({
    'resourceType': 'Observation',
    'status': 'final',
    'code': {
        'coding': [{
            'system': 'http://loinc.org',
            'code': '85354-9'
        }]
    },
    'subject': {
        'reference': 'Patient/123'
    }
})
```text

### Java

```xml
<dependency>
    <groupId>com.zarishsphere</groupId>
    <artifactId>api-client</artifactId>
    <version>1.0.0</version>
</dependency>
```javascript

```java
import com.zarishsphere.api.ZarishSphereAPI;
import com.zarishsphere.api.model.Patient;

ZarishSphereAPI api = new ZarishSphereAPI.Builder()
    .baseURL("https://api.zarishsphere.com/v1")
    .accessToken("your-access-token")
    .build();

// Get patients
List<Patient> patients = api.patient()
    .search()
    .family("Smith")
    .count(10)
    .execute();
```sql

## 📞 Support

### API Support

- **Documentation**: [https://docs.zarishsphere.com/api](https://docs.zarishsphere.com/api)
- **Status Page**: [https://status.zarishsphere.com](https://status.zarishsphere.com)
- **Support Email**: <api-support@zarishsphere.com>
- **GitHub Issues**: [https://github.com/zs-docs/docs-site/issues](https://github.com/zs-docs/docs-site/issues)

### Community

- **Developer Forum**: [https://community.zarishsphere.com](https://community.zarishsphere.com)
- **Slack Channel**: #api-development
- **Stack Overflow**: Tag questions with `zarishsphere-api`

### Updates and Changes

- **API Changelog**: [https://docs.zarishsphere.com/api/changelog](https://docs.zarishsphere.com/api/changelog)
- **Deprecation Policy**: 6 months notice for breaking changes
- **Version Support**: Current version and one previous version

---

## 📋 Quick Reference

### Common Endpoints

| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| Patient | ✅ | ✅ | ✅ | ✅ |
| Observation | ✅ | ✅ | ✅ | ✅ |
| Encounter | ✅ | ✅ | ✅ | ✅ |
| Practitioner | ✅ | ✅ | ✅ | ✅ |
| Organization | ✅ | ✅ | ✅ | ✅ |
| Location | ✅ | ✅ | ✅ | ✅ |

### Authentication Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/fhir+json
Accept: application/fhir+json
```text

### Search Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `_id` | token | Resource ID |
| `_lastUpdated` | date | Last updated date |
| `_tag` | token | Resource tags |
| `_profile` | uri | Profile reference |
| `_security` | token | Security labels |
| `_text` | string | Text search |
| `_content` | string | Full text search |

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
**API Version**: v1
**Base URL**: <https://api.zarishsphere.com/v1>
````
