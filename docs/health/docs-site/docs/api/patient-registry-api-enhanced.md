# Patient Registry API - Enhanced Documentation

## 🎯 Overview

The Patient Registry API provides comprehensive patient management capabilities for ZARISH HIS, supporting both Bangladeshi citizens and Rohingya refugees with full CRUD operations, advanced search, and Bangladesh healthcare integration.

## 🌐 API Base Information

### Base URL

```
Production: https://api.zarish-his.com/v1
Staging: https://staging-api.zarish-his.com/v1
Development: http://localhost:8080/v1
```

### Authentication

```http
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>
Content-Type: application/json
Accept: application/vnd.zarish-his.v1+json
```

## 📋 API Endpoints

### Patient Management

#### Create Patient

```http
POST /api/v1/patients
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "firstName": "Mohammad",
  "lastName": "Rahman",
  "dateOfBirth": "1990-01-01",
  "gender": "M",
  "nationality": "BD",
  "nationalId": "1234567890123",
  "phoneNumber": "+8801234567890",
  "email": "mohammad.rahman@example.com",
  "address": {
    "type": "bangladesh",
    "divisionCode": "BD.3",
    "districtCode": "BD.3.01",
    "upazilaCode": "BD.3.01.01",
    "unionCode": "BD.3.01.01.01",
    "village": "Dhaka",
    "postalCode": "1000",
    "coordinates": {
      "latitude": 23.8103,
      "longitude": 90.4125
    }
  },
  "emergencyContact": {
    "name": "Fatema Begum",
    "relationship": "Spouse",
    "phoneNumber": "+8801234567891",
    "email": "fatema.begum@example.com"
  },
  "medicalHistory": {
    "chronicConditions": ["Hypertension", "Type 2 Diabetes"],
    "allergies": ["Penicillin"],
    "medications": ["Amlodipine", "Metformin"],
    "surgeries": [{"name": "Appendectomy", "date": "2015-06-15"}],
    "familyHistory": {
      "father": {"hasHypertension": true, "hasDiabetes": false},
      "mother": {"hasHypertension": true, "hasDiabetes": true}
    }
  }
}
```

**Response:**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "Mohammad",
    "lastName": "Rahman",
    "dateOfBirth": "1990-01-01",
    "gender": "M",
    "nationality": "BD",
    "nationalId": "1234567890123",
    "phoneNumber": "+8801234567890",
    "email": "mohammad.rahman@example.com",
    "createdAt": "2026-01-21T10:30:00Z",
    "updatedAt": "2026-01-21T10:30:00Z",
    "identifiers": [
      {
        "type": "NID",
        "value": "1234567890123",
        "issuingAuthority": "Election Commission Bangladesh",
        "issuedDate": "2010-01-01",
        "expiryDate": "2030-01-01",
        "isPrimary": true
      }
    ],
    "address": {
      "type": "bangladesh",
      "divisionCode": "BD.3",
      "districtCode": "BD.3.01",
      "upazilaCode": "BD.3.01.01",
      "unionCode": "BD.3.01.01.01",
      "village": "Dhaka",
      "postalCode": "1000"
    },
    "emergencyContact": {
      "name": "Fatema Begum",
      "relationship": "Spouse",
      "phoneNumber": "+8801234567891"
    }
  },
  "meta": {
    "timestamp": "2026-01-21T10:30:00Z",
    "version": "v1",
    "requestId": "req_123456789"
  }
}
```

#### Create Rohingya Patient

```http
POST /api/v1/patients
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "firstName": "Ayesha",
  "lastName": "Begum",
  "dateOfBirth": "1985-05-15",
  "gender": "F",
  "nationality": "ROH",
  "progressId": "PROG123456789",
  "mrcCard": "MRC987654321",
  "familyCountingNumber": "FCN-KTP-BLOCK-A-001",
  "phoneNumber": "+8801234567892",
  "address": {
    "type": "refugee_camp",
    "campName": "Kutupalong",
    "block": "Block A",
    "subBlock": "Sub-Block 1",
    "shelter": "Shelter 123",
    "coordinates": {
      "latitude": 21.1234,
      "longitude": 92.1234
    }
  },
  "emergencyContact": {
    "name": "Mohammad Hassan",
    "relationship": "Brother",
    "phoneNumber": "+8801234567893"
  },
  "unhcrRegistration": {
    "registrationNumber": "UNHCR-123456",
    "familyCountingNumber": "FCN-KTP-BLOCK-A-001",
    "registrationDate": "2022-01-15",
    "campOfOrigin": "Myanmar"
  }
}
```

#### Advanced Search Patients

```http
GET /api/v1/patients/search
Authorization: Bearer <token>
```

**Query Parameters:**

```
search=rahman&nationality=BD&division=BD.3&district=BD.3.01&ageMin=18&ageMax=65&gender=M&page=1&limit=20&sort=createdAt&order=desc&includeMedicalHistory=true&includeIdentifiers=true
```

**Response:**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Mohammad",
      "lastName": "Rahman",
      "dateOfBirth": "1990-01-01",
      "gender": "M",
      "nationality": "BD",
      "matchScore": 0.95,
      "age": 36,
      "identifiers": [
        {
          "type": "NID",
          "value": "1234567890123"
        }
      ],
      "address": {
        "divisionCode": "BD.3",
        "districtCode": "BD.3.01",
        "upazilaCode": "BD.3.01.01"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "search": {
      "query": "rahman",
      "fields": ["firstName", "lastName"],
      "filters": {
        "nationality": "BD",
        "division": "BD.3",
        "district": "BD.3.01",
        "ageRange": [18, 65],
        "gender": "M"
      }
    },
    "timestamp": "2026-01-21T10:30:00Z",
    "version": "v1",
    "requestId": "req_123456789"
  }
}
```

#### Validate Refugee IDs

```http
POST /api/v1/patients/validate-refugee-ids
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "progressId": "PROG123456789",
  "mrcCard": "MRC987654321",
  "familyCountingNumber": "FCN-KTP-BLOCK-A-001"
}
```

**Response:**

```json
{
  "data": {
    "progressId": {
      "valid": true,
      "exists": true,
      "patientId": "550e8400-e29b-41d4-a716-446655440000",
      "details": {
        "name": "Ayesha Begum",
        "camp": "Kutupalong",
        "registrationDate": "2022-01-15"
      }
    },
    "mrcCard": {
      "valid": true,
      "exists": true,
      "patientId": "550e8400-e29b-41d4-a716-446655440000",
      "details": {
        "name": "Ayesha Begum",
        "camp": "Kutupalong",
        "registrationDate": "2022-01-15"
      }
    },
    "familyCountingNumber": {
      "valid": true,
      "exists": true,
      "patientId": "550e8400-e29b-41d4-a716-446655440000",
      "details": {
        "name": "Ayesha Begum",
        "camp": "Kutupalong",
        "block": "Block A",
        "shelter": "Shelter 123"
      }
    }
  },
  "meta": {
    "timestamp": "2026-01-21T10:30:00Z",
    "version": "v1",
    "requestId": "req_123456789"
  }
}
```

### Medical Records

#### Create Medical Record

```http
POST /api/v1/patients/{patientId}/medical-records
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "recordType": "CONSULTATION",
  "encounterId": "enc-123456",
  "practitionerId": "pract-123456",
  "date": "2026-01-21T10:30:00Z",
  "chiefComplaint": "Routine check-up for hypertension management",
  "history": "Patient has been on antihypertensive medication for 2 years",
  "examination": {
    "vitalSigns": {
      "bloodPressure": {
        "systolic": 140,
        "diastolic": 90,
        "unit": "mmHg"
      },
      "heartRate": 72,
      "temperature": 36.5,
      "oxygenSaturation": 98
    },
    "physicalExam": {
      "generalAppearance": "Well-appearing, alert, cooperative",
      "cardiovascular": "Regular rhythm, no murmurs",
      "respiratory": "Clear breath sounds bilaterally",
      "gastrointestinal": "Soft, non-tender abdomen"
    }
  },
  "diagnosis": {
    "primary": {
      "code": "I10",
      "description": "Essential (primary) hypertension",
      "system": "ICD-10"
    },
    "secondary": [
      {
        "code": "E11.9",
        "description": "Type 2 diabetes mellitus with complications",
        "system": "ICD-10"
      }
    ]
  },
  "treatment": {
    "medications": [
      {
        "name": "Amlodipine",
        "dosage": "5mg",
        "frequency": "Once daily",
        "duration": "30 days"
      },
      {
        "name": "Metformin",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "duration": "30 days"
      }
    ],
    "procedures": [],
    "followUp": {
      "date": "2026-02-21",
      "notes": "Review blood pressure and medication effectiveness"
    }
  },
  "notes": "Patient educated on lifestyle modifications and medication adherence"
}
```

### Appointments

#### Create Appointment

```http
POST /api/v1/appointments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "serviceType": "GOPD",
  "appointmentType": "ROUTINE_CONSULTATION",
  "practitionerId": "pract-123456",
  "scheduledDateTime": "2026-01-21T09:00:00+06:00",
  "duration": 15,
  "reason": "Routine follow-up for hypertension management",
  "status": "SCHEDULED",
  "priority": "ROUTINE",
  "location": {
    "facilityId": "facility-123456",
    "room": "Consultation Room 1",
    "equipment": ["BP Monitor", "Stethoscope", "Oxygen Saturation Monitor"]
  },
  "notes": "Patient to bring current medication list and blood pressure readings"
}
```

#### Get Appointments

```http
GET /api/v1/appointments?patientId={patientId}&startDate=2026-01-01&endDate=2026-01-31&status=SCHEDULED
Authorization: Bearer <token>
```

**Response:**

```json
{
  "data": [
    {
      "id": "apt-123456",
      "patientId": "550e8400-e29b-41d4-a716-446655440000",
      "serviceType": "GOPD",
      "appointmentType": "ROUTINE_CONSULTATION",
      "practitionerId": "pract-123456",
      "practitioner": {
        "id": "pract-123456",
        "name": "Dr. Fatema Akter",
        "speciality": "Internal Medicine",
        "bmdcNumber": "BMDC123456"
      },
      "scheduledDateTime": "2026-01-21T09:00:00+06:00",
      "duration": 15,
      "status": "SCHEDULED",
      "priority": "ROUTINE",
      "location": {
        "facilityId": "facility-123456",
        "room": "Consultation Room 1"
      },
      "createdAt": "2026-01-20T15:30:00Z",
      "updatedAt": "2026-01-20T15:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "timestamp": "2026-01-21T10:30:00Z",
    "version": "v1",
    "requestId": "req_123456789"
  }
}
```

## 🔍 Data Models

### Patient Model

```typescript
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'O';
  nationality: 'BD' | 'ROH' | 'OTH';
  nationalId?: string;
  progressId?: string;
  mrcCard?: string;
  familyCountingNumber?: string;
  phoneNumber: string;
  email?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory;
  identifiers: PatientIdentifier[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface Address {
  type: 'bangladesh' | 'refugee_camp' | 'other';
  divisionCode?: string;
  districtCode?: string;
  upazilaCode?: string;
  unionCode?: string;
  village?: string;
  postalCode?: string;
  coordinates?: Coordinates;
  campName?: string;
  block?: string;
  subBlock?: string;
  shelter?: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: Address;
}

interface MedicalHistory {
  chronicConditions: string[];
  allergies: string[];
  medications: string[];
  surgeries: Surgery[];
  familyHistory: FamilyHistory;
}

interface PatientIdentifier {
  type: 'NID' | 'PROGRESS_ID' | 'MRC' | 'FCN' | 'PASSPORT' | 'BIRTH_CERT';
  value: string;
  issuingAuthority: string;
  issuedDate: string;
  expiryDate?: string;
  isPrimary: boolean;
}
```

### Appointment Model

```typescript
interface Appointment {
  id: string;
  patientId: string;
  serviceType: 'GOPD' | 'SOPD' | 'IPD' | 'EMERGENCY' | 'NCD' | 'MATERNAL' | 'CAMP_HEALTH';
  appointmentType: 'ROUTINE_CONSULTATION' | 'FOLLOWUP_CONSULTATION' | 'EMERGENCY_CONSULTATION' | 'SPECIALIST_CONSULTATION';
  practitionerId: string;
  scheduledDateTime: string;
  duration: number;
  reason: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  location: Location;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Location {
  facilityId: string;
  room?: string;
  equipment?: string[];
}
```

## 🔒 Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "PATIENT_VALIDATION_ERROR",
    "message": "Patient validation failed",
    "details": {
      "field": "nationalId",
      "issue": "INVALID_FORMAT",
      "expected": "13-digit format",
      "actual": "123456789012"
    },
    "meta": {
      "requestId": "req_123456789",
      "timestamp": "2026-01-21T10:30:00Z",
      "version": "v1"
    }
  }
}
```

### Error Codes

- `PATIENT_NOT_FOUND`: Patient with specified ID not found
- `PATIENT_VALIDATION_ERROR`: Patient data validation failed
- `INVALID_NID_FORMAT`: Invalid Bangladeshi National ID format
- `INVALID_PROGRESS_ID_FORMAT`: Invalid ProGress ID format
- `INVALID_MRC_FORMAT`: Invalid MRC card format
- `INVALID_FCN_FORMAT`: Invalid Family Counting Number format
- `DUPLICATE_PATIENT`: Patient already exists
- `APPOINTMENT_CONFLICT`: Appointment time slot conflict
- `APPOINTMENT_NOT_AVAILABLE`: Appointment slot not available
- `PRACTITIONER_NOT_AVAILABLE`: Practitioner not available for appointment
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded
- `UNAUTHORIZED`: Authentication required or failed
- `FORBIDDEN`: Insufficient permissions
- `INTERNAL_SERVER_ERROR`: Unexpected server error

## 📊 Rate Limiting

### Rate Limits

- **Standard Requests**: 1000 requests per hour
- **Search Requests**: 500 requests per hour
- **Bulk Operations**: 100 requests per hour
- **File Upload**: 50 requests per hour

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642781400
```

## 🔄 Webhooks

### Patient Events

```http
POST /api/v1/webhooks/patient-events
Authorization: Bearer <webhook_secret>
Content-Type: application/json
```

**Event Payload:**

```json
{
  "eventType": "PATIENT_CREATED",
  "timestamp": "2026-01-21T10:30:00Z",
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "patient": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Mohammad",
      "lastName": "Rahman"
    },
    "changes": {
      "field": "status",
      "oldValue": "INACTIVE",
      "newValue": "ACTIVE"
    }
  },
  "signature": "sha256=abc123...",
  "source": "patient-registry-api"
}
```

### Event Types

- `PATIENT_CREATED`: New patient registered
- `PATIENT_UPDATED`: Patient information updated
- `PATIENT_DELETED`: Patient record deleted
- `APPOINTMENT_CREATED`: New appointment scheduled
- `APPOINTMENT_UPDATED`: Appointment details changed
- `APPOINTMENT_CANCELLED`: Appointment cancelled
- `MEDICAL_RECORD_CREATED`: New medical record added
- `IDENTIFIER_ADDED`: New patient identifier added

## 🧪 Testing

### Test Environment

```http
POST /api/v1/patients
Authorization: Bearer <test_token>
Content-Type: application/json
X-Test-Mode: true
```

### Mock Data

```json
{
  "firstName": "Test",
  "lastName": "Patient",
  "dateOfBirth": "1990-01-01",
  "gender": "M",
  "nationality": "BD",
  "nationalId": "1234567890123",
  "phoneNumber": "+8801234567890",
  "email": "test@zarish-his.com"
}
```

---

**API Version**: v1.0  
**Last Updated**: January 2026  
**Base URL**: https://api.zarish-his.com/v1  
**Compliance**: ZARISH HIS API Standards
