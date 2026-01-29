# API Naming Standards and Conventions

## 🎯 Overview

This document defines the naming standards, URL conventions, and API design patterns for all ZARISH HIS services. Consistent API design ensures predictability, maintainability, and excellent developer experience across the entire ecosystem.

## 🌐 URL Structure Standards

### Base URL Pattern

```
https://api.zarishsphere.com/v1/[service-name]/[resource]
```

**Examples:**
- `https://api.zarishsphere.com/v1/patient-registry/patients`
- `https://api.zarishsphere.com/v1/billing-engine/invoices`
- `https://api.zarishsphere.com/v1/encounter-manager/encounters`

### Gateway URL Pattern

```
https://api.zarishsphere.com/v1/[resource]
```

**Examples:**
- `https://api.zarishsphere.com/v1/health`
- `https://api.zarishsphere.com/v1/auth/login`

### Resource Naming Conventions

#### 1. **Plural Nouns for Collections**

```
✅ Correct:
- /patients
- /encounters
- /medications
- /appointments

❌ Incorrect:
- /patient
- /encounter
- /medication
- /appointment
```

#### 2. **Kebab-Case for Multi-word Resources**

```
✅ Correct:
- /clinical-observations
- /laboratory-results
- /insurance-providers
- /medical-records

❌ Incorrect:
- /clinicalObservations
- /laboratory_results
- /insuranceProviders
- /medicalRecords
```

#### 3. **Nested Resource Relationships**

```
/{parent-resource}/{parent-id}/{child-resource}

Examples:
- /patients/{patient-id}/encounters
- /encounters/{encounter-id}/observations
- /patients/{patient-id}/medications
- /facilities/{facility-id}/departments
```

## 📋 HTTP Method Standards

### CRUD Operations Mapping

| Operation | HTTP Method | URL Pattern | Description |
|-----------|-------------|-------------|-------------|
| Create | POST | /patients | Create new patient |
| Read (List) | GET | /patients | List all patients |
| Read (Single) | GET | /patients/{id} | Get specific patient |
| Update | PUT | /patients/{id} | Update entire patient |
| Partial Update | PATCH | /patients/{id} | Partial update patient |
| Delete | DELETE | /patients/{id} | Delete patient |

### Custom Actions

#### 1. **Resource-Specific Actions**

```
POST /patients/{id}/admit
POST /patients/{id}/discharge
POST /encounters/{id}/complete
POST /medications/{id}/prescribe
```

#### 2. **Collection Actions**

```
POST /patients/bulk-create
POST /encounters/bulk-update
GET /patients/search
GET /medications/interactions
```

## 🏷️ Naming Conventions

### 1. **Query Parameters**

```
✅ Correct:
- ?page=2&limit=50
- ?sort=created_at&order=desc
- ?filter[status]=active
- ?search=john doe
- ?date_from=2024-01-01&date_to=2024-12-31

❌ Incorrect:
- ?pageNumber=2
- ?sortBy=createdAt
- ?status=active
- ?q=john doe
```

#### 2. **Response Fields**

```json
{
  "id": "string",
  "mrn": "string",
  "first_name": "string",
  "last_name": "string",
  "date_of_birth": "2024-01-01",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "is_active": true,
  "phone_number": "string",
  "email_address": "string"
}
```

#### 3. **Error Response Format**

```json
{
  "error": {
    "code": "PATIENT_NOT_FOUND",
    "message": "Patient with ID '12345' not found",
    "details": {
      "field": "id",
      "value": "12345"
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "request_id": "req_123456789"
  }
}
```

## 📊 Response Format Standards

### 1. **Single Resource Response**

```json
{
  "data": {
    "id": "patient-123",
    "mrn": "MRN123456789",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "phone_number": "+1234567890",
    "email_address": "john.doe@example.com",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "meta": {
    "version": "1.0",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### 2. **Collection Response**

```json
{
  "data": [
    {
      "id": "patient-123",
      "mrn": "MRN123456789",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1990-01-01",
      "gender": "male",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "patient-456",
      "mrn": "MRN456789012",
      "first_name": "Jane",
      "last_name": "Smith",
      "date_of_birth": "1985-05-15",
      "gender": "female",
      "created_at": "2024-01-02T00:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    },
    "filters": {
      "gender": "male",
      "is_active": true
    },
    "sort": {
      "field": "created_at",
      "order": "desc"
    }
  }
}
```

### 3. **Paginated Response Headers**

```
X-Total-Count: 150
X-Page: 1
X-Per-Page: 50
X-Total-Pages: 3
X-Has-Next: true
X-Has-Prev: false
```

## 🔍 Search and Filtering Standards

### 1. **Basic Filtering**

```
GET /patients?gender=male&is_active=true
GET /encounters?status=completed&date_from=2024-01-01
GET /medications?category=antibiotic&is_available=true
```

### 2. **Advanced Filtering**

```
GET /patients?filter[first_name]=john&filter[last_name]=doe
GET /encounters?filter[status]=in_progress&filter[department]=emergency
GET /medications?filter[category]=antibiotic&filter[form]=tablet
```

### 3. **Search Endpoint**

```
GET /patients/search?q=john doe&fields=name,mrn
GET /encounters/search?q=emergency&fields=type,department
GET /medications/search?q=aspirin&fields=name,description
```

### 4. **Date Range Filtering**

```
GET /encounters?date_from=2024-01-01&date_to=2024-12-31
GET /patients?created_at_from=2024-01-01&created_at_to=2024-01-31
GET /appointments?appointment_date_from=2024-01-01&appointment_date_to=2024-01-31
```

## 📝 Sorting Standards

### 1. **Basic Sorting**

```
GET /patients?sort=created_at
GET /patients?sort=created_at&order=desc
GET /patients?sort=last_name&order=asc
```

### 2. **Multi-field Sorting**

```
GET /patients?sort=last_name,first_name&order=asc,asc
GET /encounters?sort=date,status&order=desc,asc
```

### 3. **Sortable Fields**

Each resource should document its sortable fields:

```
Patients sortable fields:
- first_name
- last_name
- date_of_birth
- created_at
- updated_at

Encounters sortable fields:
- date
- status
- department
- created_at
```

## 🔐 Authentication and Authorization

### 1. **Authentication Headers**

```
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>
X-Request-ID: <unique_request_id>
```

### 2. **Rate Limiting Headers**

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### 3. **CORS Headers**

```
Access-Control-Allow-Origin: https://app.zs-his.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type, X-Request-ID
Access-Control-Max-Age: 86400
```

## 📋 Status Code Standards

### Success Codes

| Code | Usage | Example |
|------|--------|---------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 202 | Accepted | Async operation accepted |

### Client Error Codes

| Code | Usage | Example |
|------|--------|---------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |

### Server Error Codes

| Code | Usage | Example |
|------|--------|---------|
| 500 | Internal Server Error | Unexpected error |
| 502 | Bad Gateway | Upstream service error |
| 503 | Service Unavailable | Service temporarily down |
| 504 | Gateway Timeout | Upstream timeout |

## 🏗️ API Versioning

### 1. **URL Versioning**

```
https://api.zarishsphere.com/v1/patients
https://api.zarishsphere.com/v2/patients
```

### 2. **Header Versioning**

```
Accept: application/vnd.zarish.v1+json
Accept: application/vnd.zarish.v2+json
```

### 3. **Version Support Policy**

- Support at least 2 previous major versions
- Provide migration guides between versions
- Deprecate old versions with 6-month notice

## 📚 Resource Examples

### 1. **Patient Resource**

```json
{
  "id": "patient-123",
  "mrn": "MRN123456789",
  "first_name": "John",
  "last_name": "Doe",
  "middle_name": "William",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "phone_number": "+1234567890",
  "email_address": "john.doe@example.com",
  "address": {
    "street_address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "postal_code": "12345",
    "country": "US"
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "relationship": "spouse",
    "phone_number": "+1234567891"
  },
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 2. **Encounter Resource**

```json
{
  "id": "encounter-456",
  "patient_id": "patient-123",
  "type": "outpatient",
  "status": "in-progress",
  "department": "emergency",
  "room": "ER-001",
  "attending_physician": {
    "id": "physician-789",
    "name": "Dr. Smith",
    "specialty": "emergency medicine"
  },
  "start_date": "2024-01-01T10:00:00Z",
  "end_date": null,
  "chief_complaint": "Chest pain",
  "diagnoses": [
    {
      "code": "R07.9",
      "description": "Chest pain, unspecified",
      "system": "ICD-10"
    }
  ],
  "vital_signs": [
    {
      "type": "blood_pressure",
      "value": "120/80",
      "unit": "mmHg",
      "recorded_at": "2024-01-01T10:05:00Z"
    }
  ],
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:05:00Z"
}
```

### 3. **Medication Resource**

```json
{
  "id": "medication-789",
  "name": "Aspirin",
  "generic_name": "Acetylsalicylic acid",
  "category": "analgesic",
  "form": "tablet",
  "strength": "325 mg",
  "route": "oral",
  "manufacturer": "Generic Pharma",
  "ndc_code": "12345-678-90",
  "is_available": true,
  "requires_prescription": true,
  "contraindications": [
    "Active bleeding",
    "Aspirin allergy",
    "Pregnancy (third trimester)"
  ],
  "side_effects": [
    "Stomach upset",
    "Bleeding",
    "Allergic reaction"
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 🧪 API Documentation Standards

### 1. **OpenAPI 3.0 Specification**

```yaml
openapi: 3.0.3
info:
  title: ZARISH HIS Patient Registry API
  description: API for managing patient records in ZARISH HIS
  version: 1.0.0
  contact:
    name: ZARISH HIS API Team
    email: api@zs-his.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.zarishsphere.com/v1
    description: Production server
  - url: https://staging-api.zarishsphere.com/v1
    description: Staging server

paths:
  /patients:
    get:
      summary: List patients
      description: Retrieve a paginated list of patients
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedPatients'
```

### 2. **Example Documentation**

```markdown
# Patient Registry API

## Base URL
```

https://api.zarishsphere.com/v1/patient-registry

```

## Authentication
All API requests must include an authorization header:
```

Authorization: Bearer <your-jwt-token>

```

## Endpoints

### List Patients
Retrieve a paginated list of patients.

**Endpoint:** `GET /patients`

**Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 50)
- `gender` (string, optional): Filter by gender
- `is_active` (boolean, optional): Filter by active status

**Response:**
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "total_pages": 3
    }
  }
}
```

```

## 🔧 Implementation Guidelines

### 1. **Error Handling**
```go
type APIError struct {
    Code    string      `json:"code"`
    Message string      `json:"message"`
    Details interface{} `json:"details,omitempty"`
}

func (e *APIError) Error() string {
    return fmt.Sprintf("API Error: %s - %s", e.Code, e.Message)
}

// Standard error responses
var (
    ErrNotFound = &APIError{
        Code:    "NOT_FOUND",
        Message: "Resource not found",
    }
    ErrValidation = &APIError{
        Code:    "VALIDATION_ERROR",
        Message: "Input validation failed",
    }
)
```

### 2. **Middleware Pattern**

```go
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        // Log request
        log.Info("API request",
            "method", r.Method,
            "path", r.URL.Path,
            "remote_addr", r.RemoteAddr,
        )
        
        // Call next handler
        next.ServeHTTP(w, r)
        
        // Log response
        log.Info("API response",
            "method", r.Method,
            "path", r.URL.Path,
            "duration", time.Since(start),
        )
    })
}
```

---

_Last Updated: January 2026_  
_Version: 1.0_  
_API Team: ZARISH HIS_
