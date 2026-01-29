# REST APIs Reference

Complete reference documentation for all ZARISH HIS REST APIs, including endpoints, authentication, request/response formats, and Bangladesh-specific implementations.

## 📋 API Overview

**Base URL**: `https://api.zarishsphere.com/v1`  
**Authentication**: JWT Bearer Token  
**Content-Type**: `application/json`  
**API Version**: v1.0.0  

### API Categories
- **Core APIs**: Patient, Practitioner, Organization, Encounter
- **Clinical APIs**: Observation, Condition, Medication, Procedure, Immunization
- **Ancillary APIs**: Laboratory, Radiology, Pharmacy, Blood Bank
- **Administrative APIs**: Appointment, Billing, Inventory, Bed Management, Queue
- **Infrastructure APIs**: Auth, Notification, Audit, Integration, Report, Workflow

## 🔐 Authentication & Authorization

### Authentication Flow
```bash
# Login Request
POST /api/v1/auth/login
{
    "username": "user@example.com",
    "password": "password123",
    "facility_id": "facility-uuid"
}

# Login Response
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
        "id": "user-uuid",
        "username": "user@example.com",
        "roles": ["doctor", "clinical_staff"]
    }
}
```

### Using the Token
```bash
# Include in Authorization header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access Control
- **Admin**: Full system access
- **Doctor**: Clinical data access for assigned patients
- **Nurse**: Ward and patient care access
- **Pharmacist**: Pharmacy and medication access
- **Lab Technician**: Laboratory test access
- **Billing Staff**: Financial and billing access

## 👥 Core APIs

### Patient Registry API

#### Create Patient
```bash
POST /api/v1/patients
{
    "identifier": [
        {
            "type": "national_id",
            "value": "1234567890123",
            "system": "https://nid.gov.bd"
        }
    ],
    "name": [
        {
            "use": "official",
            "family": "Islam",
            "given": ["Mohammad", "Rahim"],
            "prefix": ["Mr."]
        }
    ],
    "gender": "male",
    "birthDate": "1980-01-15",
    "address": [
        {
            "use": "home",
            "district": "Dhaka",
            "division": "Dhaka",
            "upazila": "Dhanmondi",
            "postalCode": "1209"
        }
    ],
    "telecom": [
        {
            "system": "phone",
            "value": "+8801712345678",
            "use": "mobile"
        }
    ]
}
```

#### Get Patient
```bash
GET /api/v1/patients/{patient_id}

Response:
{
    "id": "patient-uuid",
    "identifier": [
        {
            "type": "national_id",
            "value": "1234567890123",
            "system": "https://nid.gov.bd"
        }
    ],
    "name": [
        {
            "use": "official",
            "family": "Islam",
            "given": ["Mohammad", "Rahim"]
        }
    ],
    "gender": "male",
    "birthDate": "1980-01-15",
    "active": true,
    "created_at": "2026-01-21T10:00:00Z",
    "updated_at": "2026-01-21T10:00:00Z"
}
```

#### Search Patients
```bash
GET /api/v1/patients/search?q=rahim&gender=male&district=dhaka

Response:
{
    "patients": [
        {
            "id": "patient-uuid",
            "name": "Mohammad Rahim Islam",
            "gender": "male",
            "birthDate": "1980-01-15",
            "identifier": "1234567890123"
        }
    ],
    "total": 1,
    "page": 1,
    "per_page": 20
}
```

### Practitioner Registry API

#### Create Practitioner
```bash
POST /api/v1/practitioners
{
    "identifier": [
        {
            "type": "bmdc_registration",
            "value": "A-12345",
            "system": "https://bmdc.org.bd"
        }
    ],
    "name": [
        {
            "use": "official",
            "family": "Ahmed",
            "given": ["Dr.", "Sarah"],
            "prefix": ["Dr."]
        }
    ],
    "gender": "female",
    "qualification": [
        {
            "code": "MBBS",
            "issuer": "Bangladesh Medical College"
        }
    ],
    "specialty": [
        {
            "coding": [
                {
                    "system": "https://bmdc.org.bd/specialties",
                    "code": "CARD",
                    "display": "Cardiology"
                }
            ]
        }
    ]
}
```

### Organization Registry API

#### Create Organization
```bash
POST /api/v1/organizations
{
    "name": "ZARISH Medical Center",
    "type": [
        {
            "coding": [
                {
                    "system": "https://dghs.gov.bd/facility-types",
                    "code": "HOSP",
                    "display": "Hospital"
                }
            ]
        }
    ],
    "address": [
        {
            "use": "work",
            "district": "Dhaka",
            "division": "Dhaka",
            "upazila": "Dhanmondi",
            "postalCode": "1209"
        }
    ],
    "telecom": [
        {
            "system": "phone",
            "value": "+8802123456789",
            "use": "work"
        }
    ]
}
```

### Encounter Service API

#### Create Encounter
```bash
POST /api/v1/encounters
{
    "patient_id": "patient-uuid",
    "practitioner_id": "practitioner-uuid",
    "organization_id": "organization-uuid",
    "class": "inpatient",
    "type": [
        {
            "coding": [
                {
                    "system": "https://dghs.gov.bd/encounter-types",
                    "code": "IMP",
                    "display": "Inpatient Admission"
                }
            ]
        }
    ],
    "period": {
        "start": "2026-01-21T10:00:00Z"
    },
    "reasonCode": [
        {
            "coding": [
                {
                    "system": "http://snomed.info/sct",
                    "code": "22298006",
                    "display": "Myocardial Infarction"
                }
            ]
        }
    ]
}
```

## 🏥 Clinical APIs

### Observation Service API

#### Create Observation
```bash
POST /api/v1/observations
{
    "encounter_id": "encounter-uuid",
    "patient_id": "patient-uuid",
    "practitioner_id": "practitioner-uuid",
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
    },
    "effectiveDateTime": "2026-01-21T10:30:00Z"
}
```

### Condition Service API

#### Create Condition
```bash
POST /api/v1/conditions
{
    "patient_id": "patient-uuid",
    "encounter_id": "encounter-uuid",
    "asserter_id": "practitioner-uuid",
    "code": {
        "coding": [
            {
                "system": "http://snomed.info/sct",
                "code": "22298006",
                "display": "Myocardial Infarction"
            }
        ]
    },
    "category": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                    "code": "encounter-diagnosis",
                    "display": "Encounter Diagnosis"
                }
            ]
        }
    ],
    "verificationStatus": "confirmed",
    "onsetDateTime": "2026-01-21T09:00:00Z"
}
```

### Medication Service API

#### Create Medication Request
```bash
POST /api/v1/medication-requests
{
    "patient_id": "patient-uuid",
    "encounter_id": "encounter-uuid",
    "requester_id": "practitioner-uuid",
    "medicationCodeableConcept": {
        "coding": [
            {
                "system": "https://dgda.gov.bd/drug-codes",
                "code": "PARA001",
                "display": "Paracetamol 500mg"
            }
        ]
    },
    "dosageInstruction": [
        {
            "text": "1 tablet every 8 hours as needed for pain",
            "timing": {
                "repeat": {
                    "frequency": 1,
                    "period": 8,
                    "periodUnit": "h"
                }
            },
            "route": {
                "coding": [
                    {
                        "system": "http://snomed.info/sct",
                        "code": "26643006",
                        "display": "Oral Route"
                    }
                ]
            }
        }
    ]
}
```

## 🧪 Ancillary APIs

### Laboratory Service API

#### Create Lab Order
```bash
POST /api/v1/laboratory/orders
{
    "patient_id": "patient-uuid",
    "encounter_id": "encounter-uuid",
    "requester_id": "practitioner-uuid",
    "specimen": [
        {
            "type": {
                "coding": [
                    {
                        "system": "http://snomed.info/sct",
                        "code": "122555007",
                        "display": "Venous blood specimen"
                    }
                ]
            },
            "collection": {
                "collectedDateTime": "2026-01-21T11:00:00Z"
            }
        }
    ],
    "serviceRequest": [
        {
            "code": {
                "coding": [
                    {
                        "system": "https://dghs.gov.bd/lab-tests",
                        "code": "CBC",
                        "display": "Complete Blood Count"
                    }
                ]
            },
            "quantity": 1
        }
    ]
}
```

#### Add Lab Result
```bash
POST /api/v1/laboratory/results
{
    "order_id": "order-uuid",
    "patient_id": "patient-uuid",
    "performer_id": "lab-tech-uuid",
    "results": [
        {
            "test_code": "WBC",
            "test_name": "White Blood Cell Count",
            "value": 7.5,
            "unit": "x10^9/L",
            "reference_range": "4.0-11.0",
            "status": "final"
        },
        {
            "test_code": "RBC",
            "test_name": "Red Blood Cell Count",
            "value": 4.8,
            "unit": "x10^12/L",
            "reference_range": "4.2-5.4",
            "status": "final"
        }
    ]
}
```

### Radiology Service API

#### Create Radiology Order
```bash
POST /api/v1/radiology/orders
{
    "patient_id": "patient-uuid",
    "encounter_id": "encounter-uuid",
    "requester_id": "practitioner-uuid",
    "procedureCode": {
        "coding": [
            {
                "system": "https://dghs.gov.bd/radiology-procedures",
                "code": "CXR",
                "display": "Chest X-Ray"
            }
        ]
    },
    "reasonCode": [
        {
            "coding": [
                {
                    "system": "http://snomed.info/sct",
                    "code": "267036007",
                    "display": "Chest pain"
                }
            ]
        }
    ],
    "priority": "routine"
}
```

### Pharmacy Service API

#### Create Prescription
```bash
POST /api/v1/pharmacy/prescriptions
{
    "patient_id": "patient-uuid",
    "encounter_id": "encounter-uuid",
    "prescriber_id": "practitioner-uuid",
    "medication": [
        {
            "medication_code": "PARA001",
            "medication_name": "Paracetamol 500mg",
            "dosage": "1 tablet",
            "frequency": "every 8 hours",
            "duration": "7 days",
            "quantity": 21,
            "instructions": "Take with water after meals"
        }
    ],
    "status": "active"
}
```

## 💼 Administrative APIs

### Appointment Service API

#### Create Appointment
```bash
POST /api/v1/appointments
{
    "patient_id": "patient-uuid",
    "practitioner_id": "practitioner-uuid",
    "organization_id": "organization-uuid",
    "serviceType": [
        {
            "coding": [
                {
                    "system": "https://dghs.gov.bd/service-types",
                    "code": "CONSULT",
                    "display": "Consultation"
                }
            ]
        }
    ],
    "start": "2026-01-22T14:00:00Z",
    "end": "2026-01-22T14:30:00Z",
    "status": "booked",
    "description": "Follow-up consultation"
}
```

### Billing Service API

#### Create Invoice
```bash
POST /api/v1/billing/invoices
{
    "patient_id": "patient-uuid",
    "encounter_id": "encounter-uuid",
    "items": [
        {
            "service_code": "CONSULT_FEE",
            "service_name": "Consultation Fee",
            "quantity": 1,
            "unit_price": 500.00,
            "total": 500.00,
            "tax_rate": 0.15,
            "tax_amount": 75.00
        }
    ],
    "total_amount": 575.00,
    "currency": "BDT",
    "payment_status": "pending"
}
```

### Inventory Service API

#### Add Stock Item
```bash
POST /api/v1/inventory/items
{
    "item_code": "MED001",
    "item_name": "Paracetamol 500mg",
    "category": "medicine",
    "manufacturer": "Square Pharmaceuticals",
    "unit": "tablet",
    "current_stock": 1000,
    "minimum_stock": 100,
    "maximum_stock": 5000,
    "expiry_date": "2027-12-31",
    "batch_number": "BATCH123",
    "cost_price": 2.50,
    "selling_price": 5.00
}
```

## 🔧 Infrastructure APIs

### Authentication Service API

#### Refresh Token
```bash
POST /api/v1/auth/refresh
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
}
```

#### Logout
```bash
POST /api/v1/auth/logout
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Notification Service API

#### Send Notification
```bash
POST /api/v1/notifications/send
{
    "recipient_id": "user-uuid",
    "type": "appointment_reminder",
    "channel": ["sms", "email"],
    "subject": "Appointment Reminder",
    "message": "You have an appointment tomorrow at 2:00 PM",
    "scheduled_for": "2026-01-21T18:00:00Z"
}
```

### Audit Service API

#### Get Audit Logs
```bash
GET /api/v1/audit/logs?user_id={id}&action={action}&date_from={date}&date_to={date}

Response:
{
    "logs": [
        {
            "id": "audit-uuid",
            "user_id": "user-uuid",
            "action": "patient_create",
            "resource_type": "Patient",
            "resource_id": "patient-uuid",
            "ip_address": "192.168.1.100",
            "user_agent": "Mozilla/5.0...",
            "timestamp": "2026-01-21T10:00:00Z",
            "details": {
                "patient_name": "Mohammad Rahim Islam"
            }
        }
    ],
    "total": 1,
    "page": 1
}
```

## 📊 Response Formats

### Success Response
```json
{
    "success": true,
    "data": {
        // Response data
    },
    "message": "Operation completed successfully",
    "timestamp": "2026-01-21T10:00:00Z"
}
```

### Error Response
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "birthDate",
                "message": "Birth date is required"
            }
        ]
    },
    "timestamp": "2026-01-21T10:00:00Z"
}
```

### Pagination Response
```json
{
    "data": [
        // Array of items
    ],
    "pagination": {
        "total": 100,
        "page": 1,
        "per_page": 20,
        "total_pages": 5,
        "has_next": true,
        "has_prev": false
    }
}
```

## 🇧🇩 Bangladesh-Specific Features

### National ID Validation
```bash
POST /api/v1/validate/national-id
{
    "national_id": "1234567890123"
}

Response:
{
    "valid": true,
    "citizen_info": {
        "name": "Mohammad Rahim Islam",
        "date_of_birth": "1980-01-15",
        "gender": "male",
        "district": "Dhaka"
    }
}
```

### BMDC Verification
```bash
POST /api/v1/verify/bmdc-registration
{
    "bmdc_number": "A-12345"
}

Response:
{
    "valid": true,
    "practitioner_info": {
        "name": "Dr. Sarah Ahmed",
        "registration_date": "2010-01-01",
        "specialty": "Cardiology",
        "status": "active"
    }
}
```

### DGHS Disease Reporting
```bash
POST /api/v1/dghs/disease-reporting
{
    "facility_id": "facility-uuid",
    "disease_code": "A01",
    "disease_name": "Cholera",
    "cases": 5,
    "deaths": 0,
    "reporting_period": {
        "start": "2026-01-15",
        "end": "2026-01-21"
    }
}
```

## 🔍 Search and Filtering

### Common Query Parameters
- `q`: Search query string
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)
- `sort`: Sort field
- `order`: Sort order (asc, desc)
- `fields`: Comma-separated fields to return
- `include`: Include related resources
- `exclude`: Exclude specific fields

### Date Range Filtering
```bash
GET /api/v1/patients?created_at_from=2026-01-01&created_at_to=2026-01-31
```

### Geographic Filtering
```bash
GET /api/v1/patients?district=dhaka&division=dhaka&upazila=dhanmondi
```

## 🚀 Rate Limiting

### Rate Limits by User Role
- **Admin**: 1000 requests per hour
- **Doctor**: 500 requests per hour
- **Nurse**: 300 requests per hour
- **Other**: 100 requests per hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 499
X-RateLimit-Reset: 1642780800
```

## 📚 SDK Examples

### JavaScript/TypeScript
```typescript
import { ZARISHAPI } from '@zarish/api-client';

const api = new ZARISHAPI({
    baseURL: 'https://api.zarishsphere.com/v1',
    apiKey: 'your-api-key'
});

// Create patient
const patient = await api.patients.create({
    name: { family: 'Islam', given: ['Rahim'] },
    gender: 'male',
    birthDate: '1980-01-15'
});
```

### Python
```python
from zarish_api import ZARISHClient

client = ZARISHClient(
    base_url='https://api.zarishsphere.com/v1',
    api_key='your-api-key'
)

# Create patient
patient = client.patients.create({
    'name': {'family': 'Islam', 'given': ['Rahim']},
    'gender': 'male',
    'birthDate': '1980-01-15'
})
```

### Go
```go
package main

import (
    "github.com/zs-his/api-client-go"
)

func main() {
    client := zarish.NewClient("https://api.zarishsphere.com/v1", "your-api-key")
    
    patient := &zarish.Patient{
        Name: []zarish.HumanName{
            {Family: "Islam", Given: []string{"Rahim"}},
        },
        Gender: "male",
        BirthDate: "1980-01-15",
    }
    
    result, err := client.Patients.Create(patient)
}
```

---

*Last updated: 2026-01-21*
