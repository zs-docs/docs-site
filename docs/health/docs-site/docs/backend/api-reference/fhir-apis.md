# FHIR APIs Reference

Complete reference documentation for all ZARISH HIS FHIR R5 APIs, including resources, operations, and Bangladesh-specific profiles and extensions.

## 📋 FHIR Overview

**FHIR Version**: R5 (Release 5)  
**Base URL**: `https://fhir.zs-his.com/r5`  
**Conformance**: FHIR R5 + Bangladesh National Extensions  
**Authentication**: OAuth 2.0 + SMART on FHIR  

### Supported Resources
- **Core Resources**: Patient, Practitioner, Organization, Encounter
- **Clinical Resources**: Observation, Condition, MedicationRequest, Procedure, Immunization
- **Diagnostic Resources**: DiagnosticReport, ServiceRequest, Specimen
- **Administrative Resources**: Appointment, Account, Coverage
- **Infrastructure Resources**: CapabilityStatement, OperationOutcome, AuditEvent

## 🔐 Authentication

### OAuth 2.0 Flow
```bash
# Authorization Code Flow
GET https://auth.zs-his.com/oauth2/authorize?
    response_type=code&
    client_id=your-client-id&
    redirect_uri=https://your-app.com/callback&
    scope=patient/*.read patient/*.write&
    state=random-state

# Exchange code for token
POST https://auth.zs-his.com/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=authorization-code&
client_id=your-client-id&
client_secret=your-client-secret&
redirect_uri=https://your-app.com/callback
```

### SMART on FHIR Launch
```javascript
// SMART on FHIR App Launch
FHIR.oauth2.authorize({
    clientId: "your-client-id",
    scope: "patient/*.read patient/*.write launch/patient",
    redirectUri: "https://your-app.com/callback",
    iss: "https://fhir.zs-his.com/r5"
});
```

## 👥 Core FHIR Resources

### Patient Resource

#### Bangladesh Patient Profile
```json
{
  "resourceType": "Patient",
  "id": "patient-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient"
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "NNBAN",
            "display": "National Unique Beneficiary Number"
          }
        ]
      },
      "system": "https://nid.gov.bd",
      "value": "1234567890123"
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MR",
            "display": "Medical Record Number"
          }
        ]
      },
      "system": "https://zs-his.com/mrn",
      "value": "MR2026001234"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Islam",
      "given": ["Mohammad", "Rahim"],
      "prefix": ["Mr."]
    },
    {
      "use": "bangla",
      "family": "ইসলাম",
      "given": ["মোহাম্মদ", "রহিম"],
      "prefix": ["জনাব"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801712345678",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "rahim.islam@email.com",
      "use": "home"
    }
  ],
  "gender": "male",
  "birthDate": "1980-01-15",
  "address": [
    {
      "use": "home",
      "type": "postal",
      "line": ["123/1 Dhanmondi Road"],
      "district": "Dhaka",
      "state": "Dhaka Division",
      "postalCode": "1209",
      "country": "Bangladesh",
      "extension": [
        {
          "url": "https://fhir.zs-his.com/r5/StructureDefinition/bangladesh-divisions",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://fhir.zs-his.com/r5/CodeSystem/bangladesh-divisions",
                "code": "30",
                "display": "Dhaka"
              }
            ]
          }
        }
      ]
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
  "extension": [
    {
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/patient-nationality",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://fhir.zs-his.com/r5/CodeSystem/nationality",
            "code": "BD",
            "display": "Bangladeshi"
          }
        ]
      }
    },
    {
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration",
      "extension": [
        {
          "url": "registrationNumber",
          "valueString": "A-12345"
        },
        {
          "url": "registrationDate",
          "valueDate": "2010-01-01"
        }
      ]
    }
  ]
}
```

#### Patient Operations
```bash
# Create Patient
POST https://fhir.zs-his.com/r5/Patient
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "name": [{"family": "Islam", "given": ["Rahim"]}],
  "gender": "male",
  "birthDate": "1980-01-15"
}

# Get Patient
GET https://fhir.zs-his.com/r5/Patient/patient-123

# Search Patients
GET https://fhir.zs-his.com/r5/Patient?family=Islam&given=Rahim&gender=male

# Validate Patient
POST https://fhir.zs-his.com/r5/Patient/$validate
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "name": [{"family": "Islam", "given": ["Rahim"]}],
  "gender": "male"
}
```

### Practitioner Resource

#### Bangladesh Practitioner Profile
```json
{
  "resourceType": "Practitioner",
  "id": "practitioner-456",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-practitioner"
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MD",
            "display": "Medical License number"
          }
        ]
      },
      "system": "https://bmdc.org.bd",
      "value": "A-12345"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Ahmed",
      "given": ["Sarah"],
      "prefix": ["Dr."]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801812345678",
      "use": "work"
    }
  ],
  "gender": "female",
  "birthDate": "1975-05-20",
  "qualification": [
    {
      "identifier": [
        {
          "system": "https://bmdc.org.bd/qualifications",
          "value": "MBBS-2005"
        }
      ],
      "code": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0360",
            "code": "MBBS",
            "display": "Bachelor of Medicine and Bachelor of Surgery"
          }
        ]
      },
      "issuer": {
        "display": "Bangladesh Medical College"
      }
    }
  ],
  "extension": [
    {
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration",
      "extension": [
        {
          "url": "registrationNumber",
          "valueString": "A-12345"
        },
        {
          "url": "registrationDate",
          "valueDate": "2010-01-01"
        },
        {
          "url": "specialty",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://bmdc.org.bd/specialties",
                "code": "CARD",
                "display": "Cardiology"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Encounter Resource

#### Bangladesh Encounter Profile
```json
{
  "resourceType": "Encounter",
  "id": "encounter-789",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter"
    ]
  },
  "identifier": [
    {
      "system": "https://zs-his.com/encounter",
      "value": "ENC20260012345"
    }
  ],
  "status": "in-progress",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "IMP",
    "display": "inpatient encounter"
  },
  "type": [
    {
      "coding": [
        {
          "system": "https://fhir.zs-his.com/r5/CodeSystem/encounter-types",
          "code": "EMERGENCY",
          "display": "Emergency Admission"
        }
      ]
    }
  ],
  "subject": {
    "reference": "Patient/patient-123"
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
        "reference": "Practitioner/practitioner-456"
      }
    }
  ],
  "period": {
    "start": "2026-01-21T10:00:00+06:00"
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
  ],
  "hospitalization": {
    "admitSource": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/admit-source",
          "code": "emd",
          "display": "From emergency department"
        }
      ]
    },
    "dischargeDisposition": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/discharge-disposition",
          "code": "home",
          "display": "Home"
        }
      ]
    }
  },
  "location": [
    {
      "location": {
        "reference": "Location/ward-123"
      },
      "status": "active"
    }
  ]
}
```

## 🏥 Clinical FHIR Resources

### Observation Resource

#### Vital Signs Observation
```json
{
  "resourceType": "Observation",
  "id": "obs-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-observation"
    ]
  },
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
        "code": "8480-6",
        "display": "Systolic blood pressure"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "encounter": {
    "reference": "Encounter/encounter-789"
  },
  "effectiveDateTime": "2026-01-21T10:30:00+06:00",
  "performer": [
    {
      "reference": "Practitioner/practitioner-456"
    }
  ],
  "valueQuantity": {
    "value": 120,
    "unit": "mmHg",
    "system": "http://unitsofmeasure.org",
    "code": "mm[Hg]"
  },
  "interpretation": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          "code": "N",
          "display": "Normal"
        }
      ]
    }
  ]
}
```

#### Laboratory Observation
```json
{
  "resourceType": "Observation",
  "id": "lab-obs-456",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-laboratory-observation"
    ]
  },
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "laboratory",
          "display": "Laboratory"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/lab-tests",
        "code": "WBC",
        "display": "White Blood Cell Count"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "effectiveDateTime": "2026-01-21T11:00:00+06:00",
  "performer": [
    {
      "reference": "Practitioner/lab-tech-789"
    }
  ],
  "valueQuantity": {
    "value": 7.5,
    "unit": "x10^9/L",
    "system": "http://unitsofmeasure.org",
    "code": "10*9/L"
  },
  "referenceRange": [
    {
      "low": {
        "value": 4.0,
        "unit": "x10^9/L"
      },
      "high": {
        "value": 11.0,
        "unit": "x10^9/L"
      },
      "text": "4.0-11.0 x10^9/L"
    }
  ],
  "specimen": {
    "reference": "Specimen/specimen-123"
  }
}
```

### MedicationRequest Resource

#### Bangladesh Medication Request
```json
{
  "resourceType": "MedicationRequest",
  "id": "med-req-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-medication-request"
    ]
  },
  "status": "active",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [
      {
        "system": "https://dgda.gov.bd/drug-codes",
        "code": "PARA001",
        "display": "Paracetamol 500mg Tablet"
      }
    ],
    "text": "Paracetamol 500mg"
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "encounter": {
    "reference": "Encounter/encounter-789"
  },
  "authoredOn": "2026-01-21T10:00:00+06:00",
  "requester": {
    "reference": "Practitioner/practitioner-456"
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
      },
      "doseAndRate": [
        {
          "doseQuantity": {
            "value": 1,
            "unit": "tablet",
            "system": "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
            "code": "TAB"
          }
        }
      ]
    }
  ],
  "dispenseRequest": {
    "quantity": {
      "value": 21,
      "unit": "tablet",
      "system": "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
      "code": "TAB"
    },
    "expectedSupplyDuration": {
      "value": 7,
      "unit": "days",
      "system": "http://unitsofmeasure.org",
      "code": "d"
    }
  }
}
```

## 🧪 Diagnostic FHIR Resources

### DiagnosticReport Resource

#### Laboratory Report
```json
{
  "resourceType": "DiagnosticReport",
  "id": "lab-report-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-diagnostic-report"
    ]
  },
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v2-0074",
          "code": "LAB",
          "display": "Laboratory"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/lab-panels",
        "code": "CBC",
        "display": "Complete Blood Count"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "encounter": {
    "reference": "Encounter/encounter-789"
  },
  "effectiveDateTime": "2026-01-21T11:00:00+06:00",
  "issued": "2026-01-21T14:30:00+06:00",
  "performer": [
    {
      "reference": "Practitioner/lab-tech-789"
    }
  ],
  "result": [
    {
      "reference": "Observation/lab-obs-456"
    },
    {
      "reference": "Observation/lab-obs-457"
    }
  ],
  "conclusion": "Complete Blood Count results are within normal ranges.",
  "conclusionCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "17621005",
          "display": "Normal"
        }
      ]
    }
  ]
}
```

### ServiceRequest Resource

#### Laboratory Service Request
```json
{
  "resourceType": "ServiceRequest",
  "id": "service-req-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-service-request"
    ]
  },
  "status": "completed",
  "intent": "order",
  "category": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "394580004",
          "display": "Clinical laboratory procedure"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/lab-tests",
        "code": "CBC",
        "display": "Complete Blood Count"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "encounter": {
    "reference": "Encounter/encounter-789"
  },
  "authoredOn": "2026-01-21T10:00:00+06:00",
  "requester": {
    "reference": "Practitioner/practitioner-456"
  },
  "specimen": [
    {
      "reference": "Specimen/specimen-123"
    }
  ]
}
```

## 💼 Administrative FHIR Resources

### Appointment Resource

#### Bangladesh Appointment
```json
{
  "resourceType": "Appointment",
  "id": "appointment-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-appointment"
    ]
  },
  "status": "booked",
  "serviceCategory": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/service-category",
          "code": "17",
          "display": "General Practice"
        }
      ]
    }
  ],
  "serviceType": [
    {
      "coding": [
        {
          "system": "https://fhir.zs-his.com/r5/CodeSystem/appointment-types",
          "code": "CONSULT",
          "display": "Consultation"
        }
      ]
    }
  ],
  "specialty": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "394807007",
          "display": "Cardiology"
        }
      ]
    }
  ],
  "appointmentType": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v2-0276",
        "code": "ROUTINE",
        "display": "Routine appointment"
      }
    ]
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
  ],
  "priority": 5,
  "description": "Follow-up consultation for cardiac evaluation",
  "start": "2026-01-22T14:00:00+06:00",
  "end": "2026-01-22T14:30:00+06:00",
  "minutesDuration": 30,
  "slot": [
    {
      "reference": "Slot/slot-123"
    }
  ],
  "created": "2026-01-21T10:00:00+06:00",
  "participant": [
    {
      "actor": {
        "reference": "Patient/patient-123"
      },
      "status": "accepted"
    },
    {
      "actor": {
        "reference": "Practitioner/practitioner-456"
      },
      "status": "accepted"
    }
  ]
}
```

## 🔧 FHIR Operations

### Custom Operations

#### Validate National ID
```bash
POST https://fhir.zs-his.com/r5/Patient/$validate-national-id
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "nationalId",
      "valueString": "1234567890123"
    }
  ]
}

Response:
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "valid",
      "valueBoolean": true
    },
    {
      "name": "citizenInfo",
      "resource": {
        "resourceType": "Patient",
        "name": [{"family": "Islam", "given": ["Rahim"]}],
        "birthDate": "1980-01-15",
        "gender": "male"
      }
    }
  ]
}
```

#### Verify BMDC Registration
```bash
POST https://fhir.zs-his.com/r5/Practitioner/$verify-bmdc
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "bmdcNumber",
      "valueString": "A-12345"
    }
  ]
}

Response:
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "valid",
      "valueBoolean": true
    },
    {
      "name": "practitioner",
      "resource": {
        "resourceType": "Practitioner",
        "name": [{"family": "Ahmed", "given": ["Sarah"]}],
        "qualification": [{
          "code": {
            "coding": [{
              "system": "http://terminology.hl7.org/CodeSystem/v2-0360",
              "code": "MBBS"
            }]
          }
        }]
      }
    }
  ]
}
```

#### Submit DGHS Report
```bash
POST https://fhir.zs-his.com/r5/MeasureReport/$submit-dghs
Content-Type: application/fhir+json

{
  "resourceType": "MeasureReport",
  "measure": "https://fhir.zs-his.com/r5/Measure/dghs-disease-reporting",
  "period": {
    "start": "2026-01-15",
    "end": "2026-01-21"
  },
  "group": [
    {
      "code": {
        "coding": [
          {
            "system": "https://dghs.gov.bd/diseases",
            "code": "A01",
            "display": "Cholera"
          }
        ]
      },
      "population": [
        {
          "code": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                "code": "initial-population"
              }
            ]
          },
          "count": 5
        }
      ]
    }
  ]
}
```

## 🇧🇩 Bangladesh FHIR Extensions

### Patient Nationality Extension
```json
{
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/patient-nationality",
  "valueCodeableConcept": {
    "coding": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/nationality",
        "code": "BD",
        "display": "Bangladeshi"
      }
    ]
  }
}
```

### BMDC Registration Extension
```json
{
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration",
  "extension": [
    {
      "url": "registrationNumber",
      "valueString": "A-12345"
    },
    {
      "url": "registrationDate",
      "valueDate": "2010-01-01"
    },
    {
      "url": "specialty",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://bmdc.org.bd/specialties",
            "code": "CARD",
            "display": "Cardiology"
          }
        ]
      }
    }
  ]
}
```

### Bangladesh Divisions Extension
```json
{
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/bangladesh-divisions",
  "valueCodeableConcept": {
    "coding": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/bangladesh-divisions",
        "code": "30",
        "display": "Dhaka"
      }
    ]
  }
}
```

## 📊 FHIR Value Sets

### Blood Groups Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "blood-groups",
  "url": "https://fhir.zs-his.com/r5/ValueSet/blood-groups",
  "name": "Blood Groups",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/blood-groups",
        "concept": [
          {
            "code": "A_POS",
            "display": "A Positive"
          },
          {
            "code": "A_NEG",
            "display": "A Negative"
          },
          {
            "code": "B_POS",
            "display": "B Positive"
          },
          {
            "code": "B_NEG",
            "display": "B Negative"
          },
          {
            "code": "AB_POS",
            "display": "AB Positive"
          },
          {
            "code": "AB_NEG",
            "display": "AB Negative"
          },
          {
            "code": "O_POS",
            "display": "O Positive"
          },
          {
            "code": "O_NEG",
            "display": "O Negative"
          }
        ]
      }
    ]
  }
}
```

### Religions Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "religions",
  "url": "https://fhir.zs-his.com/r5/ValueSet/religions",
  "name": "Religions",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/religions",
        "concept": [
          {
            "code": "ISLAM",
            "display": "Islam"
          },
          {
            "code": "HINDU",
            "display": "Hinduism"
          },
          {
            "code": "BUDDHIST",
            "display": "Buddhism"
          },
          {
            "code": "CHRISTIAN",
            "display": "Christianity"
          },
          {
            "code": "OTHER",
            "display": "Other"
          }
        ]
      }
    ]
  }
}
```

## 🔍 Search Parameters

### Custom Search Parameters

#### National ID Search
```bash
GET https://fhir.zs-his.com/r5/Patient?national-id=1234567890123
```

#### BMDC Registration Search
```bash
GET https://fhir.zs-his.com/r5/Practitioner?bmdc-registration=A-12345
```

#### District Search
```bash
GET https://fhir.zs-his.com/r5/Patient?district=Dhaka
```

#### Division Search
```bash
GET https://fhir.zs-his.com/r5/Patient?division=Dhaka
```

## 🚀 Client Libraries

### HAPI FHIR Java Client
```java
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.TokenClientParam;

public class ZARISHFHIRClient {
    private static final String FHIR_BASE_URL = "https://fhir.zs-his.com/r5";
    private static final FhirContext ctx = FhirContext.forR5();
    
    public static void main(String[] args) {
        IGenericClient client = ctx.newRestfulGenericClient(FHIR_BASE_URL);
        
        // Search patients by national ID
        Bundle bundle = client.search()
            .forResource(Patient.class)
            .where(Patient.IDENTIFIER.exactly().systemAndCode("https://nid.gov.bd", "1234567890123"))
            .execute();
        
        for (BundleEntryComponent entry : bundle.getEntry()) {
            Patient patient = (Patient) entry.getResource();
            System.out.println("Patient: " + patient.getNameFirstRep().getNameAsSingleString());
        }
    }
}
```

### Python FHIR Client
```python
from fhir.resources.patient import Patient
from fhir.resources.observation import Observation
from fhir.client import FHIRClient

client = FHIRClient(
    base_url="https://fhir.zs-his.com/r5",
    auth_token="your-oauth-token"
)

# Create patient
patient = Patient(
    name=[{"family": "Islam", "given": ["Rahim"]}],
    gender="male",
    birthDate="1980-01-15"
)

created_patient = client.create_resource(patient)
print(f"Created patient: {created_patient.id}")

# Search observations
observations = client.search(
    resource_type="Observation",
    params={
        "patient": created_patient.id,
        "category": "vital-signs"
    }
)

for obs in observations:
    print(f"Observation: {obs.code.coding[0].display}")
```

### JavaScript FHIR Client
```javascript
import { Client } from '@fhir/fhir.js';

const client = Client({
    baseUrl: 'https://fhir.zs-his.com/r5',
    auth: {
        bearer: 'your-oauth-token'
    }
});

// Create patient
const patient = {
    resourceType: 'Patient',
    name: [{ family: 'Islam', given: ['Rahim'] }],
    gender: 'male',
    birthDate: '1980-01-15'
};

client.create(patient)
    .then(response => {
        console.log('Created patient:', response.data.id);
        
        // Search observations
        return client.search({
            resourceType: 'Observation',
            params: {
                patient: response.data.id,
                category: 'vital-signs'
            }
        });
    })
    .then(response => {
        response.data.entry.forEach(entry => {
            console.log('Observation:', entry.resource.code.coding[0].display);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

---

*Last updated: 2026-01-21*
