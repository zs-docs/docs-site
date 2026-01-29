---
title: 'API Getting Started'
sidebar_label: 'Getting Started'
description: 'Quick start guide for ZARISH SPHERE APIs including authentication, first requests, and basic integration'
keywords: [api, getting started, authentication, quick start, zarish sphere]
---

# API Getting Started

## Introduction

ZARISH SPHERE APIs provide comprehensive access to healthcare data management capabilities. This guide will help you get started quickly with authentication, making your first API calls, and understanding the basic concepts.

## Prerequisites

### Requirements

- **API Credentials**: Valid API key from ZARISH SPHERE
- **HTTP Client**: curl, Postman, or any HTTP client library
- **JSON Knowledge**: Understanding of JSON data structures
- **HTTPS**: All API calls require HTTPS

### API Access

1. Sign up at [ZARISH SPHERE Developer Portal](https://developers.zarishsphere.com)
2. Create an application to get your API credentials
3. Choose your subscription plan (Free tier available for development)

## Authentication

### API Key Authentication

The simplest way to authenticate is using your API key:

````http
GET https://api.zarishsphere.com/v1/patients
X-API-Key: your-api-key-here
Content-Type: application/json
```bash

### OAuth 2.0 / JWT

For production applications, use OAuth 2.0:

### 1. Get Access Token

```bash
curl -X POST "https://auth.zarishsphere.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
```text

**Response:**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "patient.read patient.write"
}
```text

### 2. Use Access Token

```http
GET https://api.zarishsphere.com/v1/patients
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```bash

## Your First API Call

### Test Your Connection

First, verify your API access:

```bash
curl -X GET "https://api.zarishsphere.com/v1/health" \
  -H "X-API-Key: your-api-key-here"
```text

**Expected Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2023-12-01T10:30:00Z"
}
```bash

### Create Your First Patient

```bash
curl -X POST "https://api.zarishsphere.com/v1/patients" \
  -H "X-API-Key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "birthDate": "1985-06-15",
    "gender": "male",
    "email": "john.smith@example.com",
    "phone": "+1-555-123-4567"
  }'
```text

**Expected Response:**

```json
{
  "id": "patient-123",
  "mrn": "MRN-2023-001234",
  "firstName": "John",
  "lastName": "Smith",
  "birthDate": "1985-06-15",
  "gender": "male",
  "email": "john.smith@example.com",
  "phone": "+1-555-123-4567",
  "createdAt": "2023-12-01T10:30:00Z",
  "updatedAt": "2023-12-01T10:30:00Z"
}
```bash

### Search for Patients

```bash
curl -X GET "https://api.zarishsphere.com/v1/patients?name=Smith&gender=male" \
  -H "X-API-Key: your-api-key-here"
```sql

## API Endpoints Overview

### Base URLs

- **Production**: `https://api.zarishsphere.com/v1`
- **Staging**: `https://staging-api.zarishsphere.com/v1`
- **Development**: `https://dev-api.zarishsphere.com/v1`

### Core Endpoints

### Patient Management

```http
GET    /v1/patients                    # List patients
POST   /v1/patients                    # Create patient
GET    /v1/patients/{id}               # Get patient
PUT    /v1/patients/{id}               # Update patient
DELETE /v1/patients/{id}               # Delete patient
```sql

### Clinical Encounters

```http
GET    /v1/encounters                  # List encounters
POST   /v1/encounters                  # Create encounter
GET    /v1/encounters/{id}             # Get encounter
PUT    /v1/encounters/{id}             # Update encounter
```sql

### Observations/Vitals

```http
GET    /v1/observations                # List observations
POST   /v1/observations                # Create observation
GET    /v1/observations/{id}           # Get observation
PUT    /v1/observations/{id}           # Update observation
```text

## Request and Response Format

### Request Headers

All API requests should include:

```http
Content-Type: application/json
X-API-Key: your-api-key-here
## or
Authorization: Bearer your-access-token
```text

### Response Format

All responses follow this structure:

### Success Response

```json
{
  "data": {
    // Your requested data
  },
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 20
  }
}
```text

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "birthDate",
      "reason": "Invalid date format"
    }
  }
}
```text

## Pagination

For list endpoints, use pagination:

```http
GET /v1/patients?page=1&perPage=20
```text

**Response:**

```json
{
  "data": [
    // Array of patient objects
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "perPage": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```text

## Filtering and Sorting

### Filtering

```http
GET /v1/patients?name=Smith&gender=male&birthDate=1985-06-15
```text

### Sorting

```http
GET /v1/patients?sort=lastName&order=asc
GET /v1/patients?sort=createdAt&order=desc
```javascript

## Error Handling

### Common HTTP Status Codes

| Status | Meaning               | Description                   |
| ------ | --------------------- | ----------------------------- |
| 200    | OK                    | Request successful            |
| 201    | Created               | Resource created successfully |
| 400    | Bad Request           | Invalid request parameters    |
| 401    | Unauthorized          | Authentication required       |
| 403    | Forbidden             | Insufficient permissions      |
| 404    | Not Found             | Resource not found            |
| 429    | Too Many Requests     | Rate limit exceeded           |
| 500    | Internal Server Error | Server error                  |

### Handling Errors

Always check the HTTP status code and parse the error response:

```javascript
try {
  const response = await fetch('/api/v1/patients', {
    headers: {
      'X-API-Key': 'your-api-key',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error.message);
    return;
  }

  const data = await response.json();
  console.log('Patients:', data.data);
} catch (error) {
  console.error('Network Error:', error.message);
}
```text

## Rate Limiting

### Rate Limits

| Plan         | Requests/Minute | Requests/Hour |
| ------------ | --------------- | ------------- |
| Free         | 100             | 10,000        |
| Basic        | 1,000           | 100,000       |
| Professional | 10,000          | 1,000,000     |
| Enterprise   | Unlimited       | Unlimited     |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1701388800
```javascript

### Handling Rate Limits

```javascript
async function makeRequest(url, options = {}) {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const waitTime = resetTime ? resetTime * 1000 - Date.now() : 60000;

      console.log(`Rate limit hit. Waiting ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      retryCount++;
      continue;
    }

    return response;
  }

  throw new Error('Max retries exceeded due to rate limiting');
}
```javascript

## SDK Examples

### JavaScript/Node.js

```javascript
const ZarishSphereAPI = require('@zarishsphere/api-client');

const api = new ZarishSphereAPI({
  baseURL: 'https://api.zarishsphere.com/v1',
  apiKey: 'your-api-key',
});

// Create patient
const patient = await api.patients.create({
  firstName: 'John',
  lastName: 'Smith',
  birthDate: '1985-06-15',
  gender: 'male',
});

// Search patients
const patients = await api.patients.search({
  name: 'Smith',
  gender: 'male',
});
```javascript

### Python

```python
from zarishsphere import ZarishSphereAPI

api = ZarishSphereAPI(
    base_url='https://api.zarishsphere.com/v1',
    api_key='your-api-key'
)

## Create patient
patient = api.patients.create({
    'firstName': 'John',
    'lastName': 'Smith',
    'birthDate': '1985-06-15',
    'gender': 'male'
})

## Search patients
patients = api.patients.search(
    name='Smith',
    gender='male'
)
```javascript

### PHP

```php
use ZarishSphere\API;

$api = new ZarishSphereAPI([
    'base_url' => 'https://api.zarishsphere.com/v1',
    'api_key' => 'your-api-key'
]);

// Create patient
$patient = $api->patients()->create([
    'firstName' => 'John',
    'lastName' => 'Smith',
    'birthDate' => '1985-06-15',
    'gender' => 'male'
]);

// Search patients
$patients = $api->patients()->search([
    'name' => 'Smith',
    'gender' => 'male'
]);
```bash

## Testing Your Integration

### Using curl

```bash
## Test authentication
curl -X GET "https://api.zarishsphere.com/v1/health" \
  -H "X-API-Key: your-api-key"

## Test patient creation
curl -X POST "https://api.zarishsphere.com/v1/patients" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Patient",
    "birthDate": "1990-01-01",
    "gender": "female"
  }'
```javascript

### Using Postman

1. Import our Postman collection: [ZARISH SPHERE API Collection](https://api.zarishsphere.com/postman-collection)
2. Set your API key in the environment variables
3. Start testing endpoints

### Unit Testing

```javascript
// Using Jest for testing
const ZarishSphereAPI = require('@zarishsphere/api-client');

describe('ZARISH SPHERE API', () => {
  let api;

  beforeEach(() => {
    api = new ZarishSphereAPI({
      baseURL: 'https://staging-api.zarishsphere.com/v1',
      apiKey: 'test-api-key',
    });
  });

  test('should create a patient', async () => {
    const patientData = {
      firstName: 'Test',
      lastName: 'Patient',
      birthDate: '1990-01-01',
      gender: 'female',
    };

    const patient = await api.patients.create(patientData);

    expect(patient.firstName).toBe('Test');
    expect(patient.lastName).toBe('Patient');
    expect(patient.id).toBeDefined();
  });

  test('should search patients', async () => {
    const patients = await api.patients.search({
      name: 'Test',
    });

    expect(Array.isArray(patients.data)).toBe(true);
  });
});
```text

## Best Practices

### 1. Security

- Never expose your API key in client-side code
- Use HTTPS for all API calls
- Validate all input data
- Implement proper error handling

### 2. Performance

- Use pagination for large datasets
- Cache frequently accessed data
- Implement retry logic with exponential backoff
- Use compression for large payloads

### 3. Error Handling

- Always check HTTP status codes
- Parse error responses properly
- Implement graceful degradation
- Log errors for debugging

### 4. Rate Limiting

- Respect rate limits
- Implement backoff strategies
- Use appropriate retry logic
- Monitor your usage

## Next Steps

Now that you have the basics:

1. **Explore the API Reference**: Learn about all available endpoints
2. **Try the FHIR API**: Work with healthcare data standards
3. **Implement Webhooks**: Receive real-time notifications
4. **Use GraphQL**: Build flexible queries
5. **Read the Best Practices**: Learn production-ready patterns

## Support

- **Documentation**: [docs.zarishsphere.com](https://docs.zarishsphere.com)
- **API Reference**: [api.zarishsphere.com/docs](https://api.zarishsphere.com/docs)
- **Support Email**: api-support at zarishsphere dot com
- **Status Page**: [status.zarishsphere.com](https://status.zarishsphere.com)

Happy coding with ZARISH SPHERE APIs!
````
