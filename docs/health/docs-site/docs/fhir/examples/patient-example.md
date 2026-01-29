# Patient Resource Example

## 🎯 Overview

This example demonstrates a complete Patient resource in ZARISH HIS with Bangladesh healthcare context and Rohingya refugee integration.

## 📋 Complete Patient Example

### Bangladeshi Patient

```json
{
  "resourceType": "Patient",
  "id": "patient-12345",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-patient"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "PATIENT",
        "display": "Patient Information"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-tags",
        "code": "BD-NATIONAL",
        "display": "Bangladeshi National"
      }
    ]
  },
  "identifier": [
    {
      "use": "usual",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "MRN",
            "display": "Medical Record Number"
          }
        ]
      },
      "value": "MRN202401210001"
    },
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "NID",
            "display": "National ID"
          }
        ]
      },
      "value": "1234567890123",
      "period": {
        "start": "1990-01-01"
      }
    },
    {
      "use": "secondary",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "PASSPORT",
            "display": "Passport Number"
          }
        ]
      },
      "value": "A12345678"
    }
  ],
  "active": true,
  "name": [
    {
      "use": "official",
      "text": "Mohammad Rahman",
      "family": "Rahman",
      "given": [
        "Mohammad"
      ],
      "prefix": [
        "Mr"
      ]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801712345678",
      "use": "home",
      "rank": 1
    },
    {
      "system": "phone",
      "value": "+8801812345679",
      "use": "mobile",
      "rank": 2
    },
    {
      "system": "email",
      "value": "mohammad.rahman@email.com",
      "use": "home"
    }
  ],
  "gender": "male",
  "birthDate": "1990-01-01",
  "address": [
    {
      "use": "home",
      "type": "postal",
      "text": "House 123, Road 45, Palong Khali Union, Ukhiya Upazilla, Cox's Bazar District, Chattogram Division, Bangladesh",
      "line": [
        "House 123, Road 45"
      ],
      "city": "Ukhiya",
      "district": "Cox's Bazar",
      "state": "Chattogram",
      "postalCode": "4700",
      "country": "Bangladesh",
      "extension": [
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-nationality",
          "valueString": "Bangladeshi"
        },
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/administrative-boundary",
          "valueString": "BD.2.1.4.2"
        }
      ]
    }
  ],
  "maritalStatus": "married",
  "multipleBirth": false,
  "communication": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/languages",
          "code": "bn",
          "display": "Bengali"
        }
      ],
      "preferred": true
    },
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/languages",
          "code": "en",
          "display": "English"
        }
      ]
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-origin",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-origin",
            "code": "BD",
            "display": "Bangladeshi"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/bmdc-registration",
      "valueString": "BMDC123456"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/individual-unique-id",
      "valueString": "BD19900101010112345"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/qr-code-data",
      "valueBase64Binary": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

### Rohingya Refugee Patient

```json
{
  "resourceType": "Patient",
  "id": "patient-rohingya-67890",
  "meta": {
    "profile": [
      "https://zs-his.github.io/docs/fhir/StructureDefinition/zarish-patient"
    ],
    "security": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/security-labels",
        "code": "REFUGEE",
        "display": "Refugee Information"
      }
    ],
    "tag": [
      {
        "system": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-tags",
        "code": "ROHINGYA",
        "display": "Rohingya Refugee"
      }
    ]
  },
  "identifier": [
    {
      "use": "usual",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "MRN",
            "display": "Medical Record Number"
          }
        ]
      },
      "value": "MRN202401210002"
    },
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "PROGRESS_ID",
            "display": "ProGress ID"
          }
        ]
      },
      "value": "KTP-2024-001234567"
    },
    {
      "use": "secondary",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "MRC",
            "display": "Mouza Registration Card"
          }
        ]
      },
      "value": "MRC-UTK-001-234567"
    },
    {
      "use": "secondary",
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "FCN",
            "display": "Family Counting Number"
          }
        ]
      },
      "value": "FCN-KTP-BLOCK-A-001"
    }
  ],
  "active": true,
  "name": [
    {
      "use": "official",
      "text": "Ayesha Begum",
      "family": "Begum",
      "given": [
        "Ayesha"
      ],
      "prefix": [
        "Ms"
      ]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801712345679",
      "use": "home",
      "rank": 1
    }
  ],
  "gender": "female",
  "birthDate": "1985-05-15",
  "address": [
    {
      "use": "home",
      "type": "postal",
      "text": "Block A, Sub-block 1, Shelter 123, Kutupalong Registered Camp, Ukhiya, Cox's Bazar, Bangladesh",
      "line": [
        "Block A, Sub-block 1, Shelter 123"
      ],
      "city": "Kutupalong",
      "district": "Cox's Bazar",
      "state": "Chattogram",
      "postalCode": "4700",
      "country": "Bangladesh",
      "extension": [
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-origin",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-origin",
                "code": "ROH",
                "display": "Rohingya"
              }
            ]
          }
        },
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/camp-information",
          "valueString": "CAMP-KTP-001-BLOCK-A-SUB-1"
        },
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/administrative-boundary",
          "valueString": "BD.2.1.4.3"
        }
      ]
    }
  ],
  "maritalStatus": "married",
  "multipleBirth": true,
  "communication": [
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/languages",
          "code": "bn",
          "display": "Bengali"
        }
      ],
      "preferred": true
    },
    {
      "coding": [
        {
          "system": "https://zs-his.github.io/docs/fhir/CodeSystem/languages",
          "code": "my",
          "display": "Burmese"
        }
      ]
    }
  ],
  "extension": [
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/patient-origin",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/patient-origin",
            "code": "ROH",
            "display": "Rohingya"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/camp-registration-status",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/camp-registration-status",
            "code": "REGISTERED",
            "display": "Registered Camp Resident"
          }
        ]
      }
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/individual-unique-id",
      "valueString": "ROH19850515010112345"
    },
    {
      "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/qr-code-data",
      "valueBase64Binary": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

## 🔍 Key Features Demonstrated

### Bangladesh Context
- **National ID**: 13-digit NID number
- **Administrative Boundaries**: BD.2.1.4.2 format
- **BMDC Registration**: Medical council registration
- **Language Support**: Bengali (বাংলা) and English

### Rohingya Refugee Context
- **Camp Structure**: Block and sub-block organization
- **Multiple IDs**: ProGress ID, MRC, FCN
- **Registration Status**: Registered vs New Arrival
- **Language Support**: Bengali (বাংলা), Burmese, and English

### ZARISH Extensions
- **Patient Origin**: BD/ROH/OTH classification
- **Individual Unique ID**: Three-part identifier system
- **QR Code Data**: Base64 encoded patient information
- **Administrative Boundary**: Precise geographic coding
- **Camp Information**: Detailed camp structure data

### Security & Privacy
- **Security Labels**: PATIENT, REFUGEE classifications
- **Meta Tags**: Nationality and origin tracking
- **Access Control**: Role-based data access

## 📚 Related Resources

- [Patient Profile](../profiles/zarish-patient.md)
- [Bangladesh Divisions Value Set](../value-sets/bangladesh-divisions.md)
- [Patient Nationality Extension](../extensions/patient-nationality.md)
- [Identifier Types Value Set](../value-sets/identifier-types.md)
- [Patient Registration Standards](../../standards/patient-registration-standards.md)

## 🧪 Validation

This example conforms to:
- **FHIR R5**: Patient resource structure
- **ZARISH Patient Profile**: Bangladesh-specific extensions
- **Bangladesh Core**: National healthcare standards
- **UNHCR Standards**: Refugee registration requirements

---

**Example Version**: 1.0  
**Last Updated**: January 2026  
**FHIR Version**: R5  
**Compliance**: ZARISH HIS, Bangladesh DGHS, UNHCR
