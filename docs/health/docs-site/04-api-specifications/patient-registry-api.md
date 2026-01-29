# Patient Registry API Specification

## 🎯 Overview

This document defines the RESTful API for the Patient Registry microservice in ZARISH HIS. The API provides comprehensive patient management capabilities including registration, search, updates, and integration with other healthcare systems.

## 📋 API Information

- **Service**: Patient Registry (MS-001)
- **Base URL**: `https://zs-his.github.io/docs/v1/patient-registry` (Staging)
- **Production URL**: `https://api.zarishsphere.com/v1/patient-registry` (Planned)
- **API Version**: v1
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT)
- **Localization**: Bangladesh Standard Time (GMT+6)
- **Languages**: English, Bengali (বাংলা), Burmese
- **Compliance**: FHIR R5, DGHS, UNHCR Standards

## 🔌 Endpoints

### Patient Management

#### Create Patient
```http
POST /patients
```

**Request Body:**
```json
{
  "individual_unique_id": "BD19900101010112345",
  "mrn": "MRN123456789",
  "first_name": "John",
  "last_name": "Doe",
  "middle_name": "William",
  "date_of_birth": "1990-01-01",
  "age": 35,
  "gender": "male",
  "phone_number": "+8801234567890",
  "email": "john.doe@example.com",
  "origin": "Bangladeshi",
  "nationality": "Bangladeshi",
  "address": {
    "type": "bangladeshi",
    "upazilla": "Ukhiya",
    "union": "Palong Khali",
    "village": "Kutupalong",
    "identity_type": "NID Card",
    "nid_birth_certificate": "1234567890123",
    "geo_code": "BD.4.5.6.7",
    "coordinates": {
      "latitude": 21.2345,
      "longitude": 92.1234
    }
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "relationship": "spouse",
    "phone_number": "+8801234567891",
    "address": "Same as patient"
  },
  "qr_code_data": "QR_CODE_BASE64_STRING",
  "registration_status": "complete",
  "service_specific_ids": {
    "GOPD": "GOPDBD19900101010112345",
    "NCD": "NCDROH19900101010112345"
  }
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "patient-123",
    "individual_unique_id": "BD19900101010112345",
    "mrn": "MRN123456789",
    "first_name": "John",
    "last_name": "Doe",
    "middle_name": "William",
    "date_of_birth": "1990-01-01",
    "age": 35,
    "gender": "male",
    "phone_number": "+8801234567890",
    "email": "john.doe@example.com",
    "origin": "Bangladeshi",
    "nationality": "Bangladeshi",
    "address": {
      "type": "bangladeshi",
      "upazilla": "Ukhiya",
      "union": "Palong Khali",
      "village": "Kutupalong",
      "identity_type": "NID Card",
      "nid_birth_certificate": "1234567890123",
      "geo_code": "BD.4.5.6.7",
      "coordinates": {
        "latitude": 21.2345,
        "longitude": 92.1234
      }
    },
    "emergency_contact": {
      "name": "Jane Doe",
      "relationship": "spouse",
      "phone_number": "+8801234567891",
      "address": "Same as patient"
    },
    "qr_code_data": "QR_CODE_BASE64_STRING",
    "registration_status": "complete",
    "service_specific_ids": {
      "GOPD": "GOPDBD19900101010112345",
      "NCD": "NCDROH19900101010112345"
    },
    "is_active": true,
    "created_at": "2026-01-21T12:00:00+06:00",
    "updated_at": "2026-01-21T12:00:00+06:00"
  },
  "meta": {
    "version": "1.0",
    "timestamp": "2026-01-21T12:00:00+06:00",
    "timezone": "GMT+6"
  }
}
```

#### Get Patient by ID
```http
GET /patients/{id}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "patient-123",
    "mrn": "MRN123456789",
    "first_name": "John",
    "last_name": "Doe",
    "middle_name": "William",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "phone_number": "+1234567890",
    "email": "john.doe@example.com",
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
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "meta": {
    "version": "1.0",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### Get Patient by MRN
```http
GET /patients/mrn/{mrn}
```

**Response (200 OK):** Same as Get Patient by ID

#### Update Patient
```http
PUT /patients/{id}
```

**Request Body:** Same as Create Patient (all fields required)

**Response (200 OK):** Updated patient object

#### Partial Update Patient
```http
PATCH /patients/{id}
```

**Request Body:**
```json
{
  "phone_number": "+1234567890",
  "email": "new.email@example.com"
}
```

**Response (200 OK):** Updated patient object

#### Deactivate Patient
```http
DELETE /patients/{id}
```

**Response (204 No Content):** Patient successfully deactivated

### Search and Query

#### List Patients
```http
GET /patients
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 50, max: 100)
- `search` (string, optional): Search query (searches name, MRN, phone)
- `gender` (string, optional): Filter by gender (male, female, other)
- `is_active` (boolean, optional): Filter by active status
- `date_from` (string, optional): Filter patients created after date
- `date_to` (string, optional): Filter patients created before date
- `sort` (string, optional): Sort field (created_at, updated_at, last_name, first_name)
- `order` (string, optional): Sort order (asc, desc)

**Response (200 OK):**
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
      "phone_number": "+1234567890",
      "is_active": true,
      "created_at": "2024-01-01T12:00:00Z"
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

#### Search Patients
```http
GET /patients/search
```

**Query Parameters:**
- `q` (string, required): Search query
- `fields` (string, optional): Fields to search in (name,mrn,phone,email)
- `limit` (integer, optional): Max results (default: 10, max: 50)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "patient-123",
      "mrn": "MRN123456789",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "+1234567890",
      "email": "john.doe@example.com",
      "relevance_score": 0.95
    }
  ],
  "meta": {
    "query": "John Doe",
    "total_results": 1,
    "search_time": 0.034
  }
}
```

#### Find Duplicate Patients
```http
GET /patients/duplicates
```

**Query Parameters:**
- `first_name` (string, required): First name
- `last_name` (string, required): Last name
- `date_of_birth` (string, required): Date of birth (YYYY-MM-DD)
- `phone_number` (string, optional): Phone number

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "patient-123",
      "mrn": "MRN123456789",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1990-01-01",
      "phone_number": "+1234567890",
      "match_score": 0.95,
      "match_reasons": ["name", "date_of_birth"]
    }
  ],
  "meta": {
    "potential_duplicates": 1,
    "confidence_threshold": 0.8
  }
}
```

### Integration Endpoints

#### Merge Duplicate Patients
```http
POST /patients/merge
```

**Request Body:**
```json
{
  "primary_patient_id": "patient-123",
  "duplicate_patient_ids": ["patient-456", "patient-789"],
  "merge_strategy": "primary_wins"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "merged_patient_id": "patient-123",
    "merged_records": 2,
    "merge_timestamp": "2024-01-01T12:00:00Z"
  },
  "meta": {
    "version": "1.0",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### Import Patients
```http
POST /patients/import
```

**Request Body:**
```json
{
  "patients": [
    {
      "mrn": "MRN123456789",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1990-01-01",
      "gender": "male"
    }
  ],
  "import_options": {
    "validate_only": false,
    "skip_duplicates": true,
    "generate_mrn": false
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "import_id": "import-123",
    "total_records": 100,
    "successful_imports": 95,
    "failed_imports": 5,
    "duplicates_skipped": 3,
    "validation_errors": 2
  },
  "meta": {
    "version": "1.0",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## 📊 Data Models

### Patient Object
```typescript
interface Patient {
  id: string;
  individual_unique_id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string; // YYYY-MM-DD
  age?: number; // Calculated if DOB not provided
  gender: 'male' | 'female' | 'other';
  phone_number?: string; // With country code (+880...)
  email?: string;
  origin: 'Rohingya' | 'Bangladeshi' | 'Others';
  nationality: string;
  address: RohingyaAddress | BangladeshiAddress | GlobalAddress;
  emergency_contact?: EmergencyContact;
  qr_code_data?: string; // Base64 encoded QR code
  registration_status: 'complete' | 'partial' | 'followup_required';
  service_specific_ids?: ServiceSpecificIds;
  is_active: boolean;
  created_at: string; // ISO 8601 datetime with timezone
  updated_at: string; // ISO 8601 datetime with timezone
}

interface RohingyaAddress {
  type: 'rohingya';
  camp_name: string;
  main_block: string;
  sub_block: string;
  fcn?: string; // Family Counting Number
  mrc?: string; // Mouza Registration Card
  token_number?: string; // For new arrivals
  mazi_name?: string;
  progress_id?: string; // Individual Unique ID
  shelter_number?: string;
  general_health_card_number?: string;
  mch_card_number?: string; // If female
  ncd_number?: string; // If NCD patient
  geo_code: string; // Administrative boundary code
  coordinates: Coordinates;
}

interface BangladeshiAddress {
  type: 'bangladeshi';
  upazilla: string;
  union_municipality: string;
  village: string;
  identity_type: 'NID Card' | 'Birth Registration';
  nid_birth_certificate: string; // MANDATORY
  geo_code: string; // Administrative boundary code
  coordinates: Coordinates;
}

interface GlobalAddress {
  type: 'global';
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  geo_code: string;
  coordinates: Coordinates;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ServiceSpecificIds {
  GOPD?: string;
  NCD?: string;
  MHPSS?: string;
  SRH?: string;
  // Add more service types as needed
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone_number: string;
  address: string;
  other_information?: string;
}
```

### Error Response
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    request_id: string;
  };
}
```

## 🔐 Authentication

All API requests must include an authorization header:

```
Authorization: Bearer <jwt_token>
```

The JWT token must contain:
- `user_id`: User identifier
- `role`: User role (doctor, nurse, admin, etc.)
- `permissions`: Array of permissions
- `exp`: Expiration timestamp

## 📋 Status Codes

| Status Code | Description | Usage |
|------------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Patient not found |
| 409 | Conflict | Duplicate MRN or validation error |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected error |

## 🧪 Validation Rules

### Patient Data Validation
```typescript
const validationRules = {
  individual_unique_id: {
    required: true,
    pattern: /^(BD|ROH|OTH)[A-Z0-9]{15,20}$/,
    message: "Individual Unique ID must start with BD/ROH/OTH followed by 15-20 characters"
  },
  mrn: {
    required: true,
    pattern: /^MRN\d{9}$/,
    message: "MRN must be in format MRN followed by 9 digits"
  },
  first_name: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: "First name is required and must contain only letters"
  },
  last_name: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: "Last name is required and must contain only letters"
  },
  date_of_birth: {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: "Date of birth must be in YYYY-MM-DD format"
  },
  age: {
    required: false,
    min: 0,
    max: 150,
    message: "Age must be between 0 and 150"
  },
  gender: {
    required: true,
    enum: ['male', 'female', 'other'],
    message: "Gender must be male, female, or other"
  },
  phone_number: {
    required: true,
    pattern: /^\+880\d{10}$/,
    message: "Phone number must start with +880 followed by 10 digits"
  },
  origin: {
    required: true,
    enum: ['Rohingya', 'Bangladeshi', 'Others'],
    message: "Origin must be Rohingya, Bangladeshi, or Others"
  },
  nationality: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Nationality is required"
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format"
  }
};

// Rohingya Address Validation
const rohingyaAddressValidation = {
  camp_name: { required: true, message: "Camp name is required for Rohingya patients" },
  main_block: { required: true, message: "Main block is required" },
  sub_block: { required: true, message: "Sub block is required" },
  fcn: { 
    required: function(patient) {
      return patient.origin === 'Rohingya' && 
             patient.address.registration_status !== 'new_arrival';
    },
    message: "FCN is required for non-registered camp residents"
  },
  mrc: {
    required: function(patient) {
      return patient.origin === 'Rohingya' && 
             patient.address.registration_status === 'registered';
    },
    message: "MRC is required for registered camp residents"
  },
  progress_id: {
    required: function(patient) {
      return patient.origin === 'Rohingya' && 
             patient.address.registration_status !== 'new_arrival';
    },
    message: "ProGress ID is required for Rohingya patients (except new arrivals)"
  }
};

// Bangladeshi Address Validation
const bangladeshiAddressValidation = {
  upazilla: { required: true, message: "Upazilla is required for Bangladeshi patients" },
  union_municipality: { required: true, message: "Union/Municipality is required" },
  village: { required: true, message: "Village is required" },
  identity_type: { 
    required: true, 
    enum: ['NID Card', 'Birth Registration'],
    message: "Identity type must be NID Card or Birth Registration"
  },
  nid_birth_certificate: {
    required: true,
    pattern: /^\d{10,13}$/,
    message: "NID/Birth Certificate number is required and must be 10-13 digits"
  }
};
```

## 📈 Rate Limiting

- **Default Rate Limit**: 1000 requests per hour per IP
- **Authenticated Users**: 5000 requests per hour per user
- **Bulk Operations**: 100 requests per hour
- **Search Operations**: 200 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 🔍 Search Algorithm

The search functionality uses a weighted scoring algorithm:

1. **Exact MRN Match**: Score 1.0
2. **Exact Name Match**: Score 0.9
3. **Partial Name Match**: Score 0.7
4. **Phone Number Match**: Score 0.8
5. **Email Match**: Score 0.6

Search results are sorted by relevance score, then by creation date.

## 🔄 Webhooks

### Patient Events
The Patient Registry publishes events to registered webhooks:

#### Patient Created
```json
{
  "event": "patient.created",
  "data": {
    "patient_id": "patient-123",
    "mrn": "MRN123456789",
    "name": "John Doe",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### Patient Updated
```json
{
  "event": "patient.updated",
  "data": {
    "patient_id": "patient-123",
    "mrn": "MRN123456789",
    "changes": ["phone_number", "email"],
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### Patient Merged
```json
{
  "event": "patient.merged",
  "data": {
    "primary_patient_id": "patient-123",
    "merged_patient_ids": ["patient-456"],
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## 🧪 Testing

### Example Requests

#### Create Patient
```bash
curl -X POST https://api.zarishsphere.com/v1/patient-registry/patients \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mrn": "MRN123456789",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "phone_number": "+1234567890",
    "email": "john.doe@example.com"
  }'
```

#### Search Patients
```bash
curl -X GET "https://api.zarishsphere.com/v1/patient-registry/patients/search?q=John%20Doe&limit=10" \
  -H "Authorization: Bearer <token>"
```

#### Get Patient
```bash
curl -X GET https://api.zarishsphere.com/v1/patient-registry/patients/patient-123 \
  -H "Authorization: Bearer <token>"
```

---

*Last Updated: January 2026*  
*Version: 1.0*  
*API Team: ZARISH HIS*
