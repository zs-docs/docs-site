# ZARISH Patient Profile

The ZARISH Patient Profile is based on FHIR R5 Patient resource with Bangladesh-specific extensions and constraints for healthcare data management.

## 📋 Profile Overview

**Profile ID**: `https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient`  
**FHIR Version**: R5  
**Status**: Active  
**Publisher**: ZARISH Health Information System  

### Purpose
This profile defines the patient resource structure for ZARISH HIS, incorporating Bangladesh healthcare requirements including national ID integration, demographic data, and local healthcare standards.

## 🏗️ Structure Definition

### Differential View
```json
{
  "resourceType": "StructureDefinition",
  "id": "zarish-patient",
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient",
  "name": "ZARISHPatient",
  "title": "ZARISH Patient Profile",
  "status": "active",
  "fhirVersion": "5.0.0",
  "kind": "resource",
  "abstract": false,
  "type": "Patient",
  "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Patient",
  "derivation": "constraint",
  "differential": {
    "element": [
      {
        "id": "Patient",
        "path": "Patient",
        "constraint": [
          {
            "key": "zarish-pat-1",
            "severity": "error",
            "human": "Patient must have either a national ID or birth certificate",
            "expression": "identifier.where(system='https://nid.gov.bd').exists() or identifier.where(system='https://bdr.gov.bd').exists()",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient"
          }
        ]
      },
      {
        "id": "Patient.identifier",
        "path": "Patient.identifier",
        "slicing": {
          "discriminator": [
            {
              "type": "value",
              "path": "system"
            }
          ],
          "rules": "open"
        },
        "min": 1
      },
      {
        "id": "Patient.identifier:nationalId",
        "path": "Patient.identifier",
        "sliceName": "nationalId",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Identifier"
          }
        ],
        "patternIdentifier": {
          "system": "https://nid.gov.bd",
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "NNBAN",
                "display": "National Unique Beneficiary Number"
              }
            ]
          }
        },
        "constraint": [
          {
            "key": "zarish-pat-2",
            "severity": "error",
            "human": "National ID must be 10 or 13 digits",
            "expression": "value.matches('^[0-9]{10}$') or value.matches('^[0-9]{13}$')",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient"
          }
        ]
      },
      {
        "id": "Patient.identifier:birthCertificate",
        "path": "Patient.identifier",
        "sliceName": "birthCertificate",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Identifier"
          }
        ],
        "patternIdentifier": {
          "system": "https://bdr.gov.bd",
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "BR",
                "display": "Birth registry number"
              }
            ]
          }
        }
      },
      {
        "id": "Patient.identifier:healthId",
        "path": "Patient.identifier",
        "sliceName": "healthId",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "Identifier"
          }
        ],
        "patternIdentifier": {
          "system": "https://zs-his.com/health-id",
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "MR",
                "display": "Medical Record Number"
              }
            ]
          }
        }
      },
      {
        "id": "Patient.name",
        "path": "Patient.name",
        "slicing": {
          "discriminator": [
            {
              "type": "value",
              "path": "use"
            }
          ],
          "rules": "open"
        },
        "min": 1
      },
      {
        "id": "Patient.name:official",
        "path": "Patient.name",
        "sliceName": "official",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "HumanName"
          }
        ],
        "patternHumanName": {
          "use": "official"
        },
        "constraint": [
          {
            "key": "zarish-pat-3",
            "severity": "error",
            "human": "Official name must have family and given names",
            "expression": "family.exists() and given.exists()",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient"
          }
        ]
      },
      {
        "id": "Patient.name:bangla",
        "path": "Patient.name",
        "sliceName": "bangla",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "HumanName"
          }
        ],
        "patternHumanName": {
          "use": "bangla"
        }
      },
      {
        "id": "Patient.telecom",
        "path": "Patient.telecom",
        "slicing": {
          "discriminator": [
            {
              "type": "value",
              "path": "system"
            }
          ],
          "rules": "open"
        },
        "min": 1
      },
      {
        "id": "Patient.telecom:mobile",
        "path": "Patient.telecom",
        "sliceName": "mobile",
        "min": 1,
        "max": "2",
        "type": [
          {
            "code": "ContactPoint"
          }
        ],
        "patternContactPoint": {
          "system": "phone",
          "use": "mobile"
        },
        "constraint": [
          {
            "key": "zarish-pat-4",
            "severity": "error",
            "human": "Mobile number must be valid Bangladesh number",
            "expression": "value.matches('^(\\+880|0)1[3-9]\\d{8}$')",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient"
          }
        ]
      },
      {
        "id": "Patient.gender",
        "path": "Patient.gender",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/bangladesh-gender"
        }
      },
      {
        "id": "Patient.birthDate",
        "path": "Patient.birthDate",
        "constraint": [
          {
            "key": "zarish-pat-5",
            "severity": "error",
            "human": "Birth date cannot be in future and patient must be at least 0 years old",
            "expression": "$this <= today() and age() >= 0",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient"
          }
        ]
      },
      {
        "id": "Patient.address",
        "path": "Patient.address",
        "slicing": {
          "discriminator": [
            {
              "type": "value",
              "path": "use"
            }
          ],
          "rules": "open"
        },
        "min": 1
      },
      {
        "id": "Patient.address:home",
        "path": "Patient.address",
        "sliceName": "home",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "Address"
          }
        ],
        "patternAddress": {
          "use": "home"
        }
      },
      {
        "id": "Patient.address:home.district",
        "path": "Patient.address.use",
        "sliceName": "home",
        "type": [
          {
            "code": "Address"
          }
        ],
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/bangladesh-districts"
        }
      },
      {
        "id": "Patient.maritalStatus",
        "path": "Patient.maritalStatus",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/bangladesh-marital-status"
        }
      },
      {
        "id": "Patient.extension:patientNationality",
        "path": "Patient.extension",
        "sliceName": "patientNationality",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Extension"
          }
        ],
        "isModifier": false
      },
      {
        "id": "Patient.extension:bmdcRegistration",
        "path": "Patient.extension",
        "sliceName": "bmdcRegistration",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Extension"
          }
        ],
        "isModifier": false
      }
    ]
  }
}
```

## 🔧 Extensions

### Patient Nationality Extension
```json
{
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/patient-nationality",
  "name": "PatientNationality",
  "title": "Patient Nationality",
  "status": "active",
  "kind": "complex-type",
  "abstract": false,
  "context": [
    "Patient"
  ],
  "type": "Extension",
  "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Extension",
  "derivation": "constraint",
  "differential": {
    "element": [
      {
        "id": "Extension",
        "path": "Extension",
        "min": 0,
        "max": "1"
      },
      {
        "id": "Extension.url",
        "path": "Extension.url",
        "fixedUri": "https://fhir.zs-his.com/r5/StructureDefinition/patient-nationality"
      },
      {
        "id": "Extension.value[x]",
        "path": "Extension.value[x]",
        "type": [
          {
            "code": "CodeableConcept"
          }
        ],
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/nationality"
        }
      }
    ]
  }
}
```

### BMDC Registration Extension
```json
{
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration",
  "name": "BMDCRegistration",
  "title": "BMDC Registration",
  "status": "active",
  "kind": "complex-type",
  "abstract": false,
  "context": [
    "Patient",
    "Practitioner"
  ],
  "type": "Extension",
  "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Extension",
  "derivation": "constraint",
  "differential": {
    "element": [
      {
        "id": "Extension",
        "path": "Extension",
        "min": 0,
        "max": "1"
      },
      {
        "id": "Extension.url",
        "path": "Extension.url",
        "fixedUri": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration"
      },
      {
        "id": "Extension.extension",
        "path": "Extension.extension",
        "slicing": {
          "discriminator": [
            {
              "type": "value",
              "path": "url"
            }
          ],
          "rules": "open"
        }
      },
      {
        "id": "Extension.extension:registrationNumber",
        "path": "Extension.extension",
        "sliceName": "registrationNumber",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "Extension"
          }
        ]
      },
      {
        "id": "Extension.extension:registrationDate",
        "path": "Extension.extension",
        "sliceName": "registrationDate",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "Extension"
          }
        ]
      },
      {
        "id": "Extension.extension:specialty",
        "path": "Extension.extension",
        "sliceName": "specialty",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Extension"
          }
        ]
      }
    ]
  }
}
```

## 📊 Value Sets

### Bangladesh Gender Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "bangladesh-gender",
  "url": "https://fhir.zs-his.com/r5/ValueSet/bangladesh-gender",
  "name": "BangladeshGender",
  "title": "Bangladesh Gender",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/administrative-gender",
        "concept": [
          {
            "code": "male",
            "display": "Male",
            "designation": [
              {
                "language": "bn",
                "value": "পুরুষ"
              }
            ]
          },
          {
            "code": "female",
            "display": "Female",
            "designation": [
              {
                "language": "bn",
                "value": "নারী"
              }
            ]
          },
          {
            "code": "other",
            "display": "Other",
            "designation": [
              {
                "language": "bn",
                "value": "অন্যান্য"
              }
            ]
          },
          {
            "code": "unknown",
            "display": "Unknown",
            "designation": [
              {
                "language": "bn",
                "value": "অজানা"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Bangladesh Districts Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "bangladesh-districts",
  "url": "https://fhir.zs-his.com/r5/ValueSet/bangladesh-districts",
  "name": "BangladeshDistricts",
  "title": "Bangladesh Districts",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/bangladesh-districts",
        "concept": [
          {
            "code": "30",
            "display": "Dhaka",
            "designation": [
              {
                "language": "bn",
                "value": "ঢাকা"
              }
            ]
          },
          {
            "code": "26",
            "display": "Chittagong",
            "designation": [
              {
                "language": "bn",
                "value": "চট্টগ্রাম"
              }
            ]
          },
          {
            "code": "35",
            "display": "Sylhet",
            "designation": [
              {
                "language": "bn",
                "value": "সিলেট"
              }
            ]
          },
          {
            "code": "54",
            "display": "Rajshahi",
            "designation": [
              {
                "language": "bn",
                "value": "রাজশাহী"
              }
            ]
          },
          {
            "code": "40",
            "display": "Khulna",
            "designation": [
              {
                "language": "bn",
                "value": "খুলনা"
              }
            ]
          },
          {
            "code": "10",
            "display": "Barishal",
            "designation": [
              {
                "language": "bn",
                "value": "বরিশাল"
              }
            ]
          },
          {
            "code": "55",
            "display": "Rangpur",
            "designation": [
              {
                "language": "bn",
                "value": "রংপুর"
              }
            ]
          },
          {
            "code": "60",
            "display": "Mymensingh",
            "designation": [
              {
                "language": "bn",
                "value": "ময়মনসিংহ"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 📝 Example Instances

### Complete Patient Example
```json
{
  "resourceType": "Patient",
  "id": "patient-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient"
    ],
    "lastUpdated": "2026-01-21T10:30:00+06:00"
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
            "code": "BR",
            "display": "Birth registry number"
          }
        ]
      },
      "system": "https://bdr.gov.bd",
      "value": "BR1980011500123"
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
      "system": "https://zs-his.com/health-id",
      "value": "HID202600123456"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Islam",
      "given": [
        "Mohammad",
        "Rahim"
      ],
      "prefix": [
        "Mr."
      ]
    },
    {
      "use": "bangla",
      "family": "ইসলাম",
      "given": [
        "মোহাম্মদ",
        "রহিম"
      ],
      "prefix": [
        "জনাব"
      ]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801712345678",
      "use": "mobile"
    },
    {
      "system": "phone",
      "value": "+8801912345678",
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
      "line": [
        "123/1 Dhanmondi Road",
        "Flat 4A, House 123"
      ],
      "city": "Dhaka",
      "district": "Dhaka",
      "state": "Dhaka Division",
      "postalCode": "1209",
      "country": "Bangladesh"
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
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/blood-group",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "https://fhir.zs-his.com/r5/CodeSystem/blood-groups",
            "code": "O_POS",
            "display": "O Positive"
          }
        ]
      }
    }
  ],
  "active": true
}
```

### Minimal Patient Example
```json
{
  "resourceType": "Patient",
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
            "code": "MR",
            "display": "Medical Record Number"
          }
        ]
      },
      "system": "https://zs-his.com/health-id",
      "value": "HID202600123457"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Khan",
      "given": [
        "Fatema"
      ]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801812345679",
      "use": "mobile"
    }
  ],
  "gender": "female",
  "birthDate": "1990-05-20",
  "address": [
    {
      "use": "home",
      "district": "Dhaka",
      "postalCode": "1209"
    }
  ],
  "active": true
}
```

## 🔍 Validation Rules

### Business Rules
1. **zarish-pat-1**: Patient must have either a national ID or birth certificate
2. **zarish-pat-2**: National ID must be 10 or 13 digits
3. **zarish-pat-3**: Official name must have family and given names
4. **zarish-pat-4**: Mobile number must be valid Bangladesh number
5. **zarish-pat-5**: Birth date cannot be in future and patient must be at least 0 years old

### Validation Examples
```json
// Valid National ID
{
  "system": "https://nid.gov.bd",
  "value": "1234567890123"  // 13 digits - valid
}

// Invalid National ID
{
  "system": "https://nid.gov.bd",
  "value": "1234567890"     // 10 digits - valid
}

// Invalid National ID
{
  "system": "https://nid.gov.bd",
  "value": "123456789012"   // 12 digits - invalid
}

// Valid Mobile Number
{
  "system": "phone",
  "value": "+8801712345678"  // Valid Bangladesh format
}

// Invalid Mobile Number
{
  "system": "phone",
  "value": "01712345678"     // Missing country code - invalid
}
```

## 🔄 Mappings

### Bangladesh National ID Mapping
```json
{
  "sourceSystem": "NID",
  "targetResource": "Patient",
  "mappings": {
    "nationalId": {
      "target": "identifier[0].value",
      "system": "https://nid.gov.bd",
      "type": "NNBAN"
    },
    "nameBangla": {
      "target": "name[1]",
      "use": "bangla"
    },
    "nameEnglish": {
      "target": "name[0]",
      "use": "official"
    },
    "dateOfBirth": {
      "target": "birthDate"
    },
    "gender": {
      "target": "gender",
      "mapping": {
        "1": "male",
        "2": "female",
        "3": "other"
      }
    },
    "presentAddress": {
      "target": "address[0]",
      "use": "home"
    }
  }
}
```

### BMDC Registration Mapping
```json
{
  "sourceSystem": "BMDC",
  "targetResource": "Patient",
  "mappings": {
    "registrationNumber": {
      "target": "extension[1].extension[0].valueString",
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration"
    },
    "registrationDate": {
      "target": "extension[1].extension[1].valueDate",
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration"
    },
    "specialty": {
      "target": "extension[1].extension[2].valueCodeableConcept",
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration"
    }
  }
}
```

## 🧪 Testing

### Test Cases
```json
{
  "testSuite": "ZARISH Patient Profile Tests",
  "testCases": [
    {
      "name": "Valid patient with NID",
      "input": {
        "resourceType": "Patient",
        "identifier": [
          {
            "system": "https://nid.gov.bd",
            "value": "1234567890123"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Islam",
            "given": ["Rahim"]
          }
        ],
        "gender": "male",
        "birthDate": "1980-01-15"
      },
      "expected": "valid"
    },
    {
      "name": "Invalid patient without identifier",
      "input": {
        "resourceType": "Patient",
        "name": [
          {
            "use": "official",
            "family": "Islam",
            "given": ["Rahim"]
          }
        ],
        "gender": "male",
        "birthDate": "1980-01-15"
      },
      "expected": "invalid",
      "errors": ["zarish-pat-1"]
    },
    {
      "name": "Invalid NID format",
      "input": {
        "resourceType": "Patient",
        "identifier": [
          {
            "system": "https://nid.gov.bd",
            "value": "123456789012"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Islam",
            "given": ["Rahim"]
          }
        ],
        "gender": "male",
        "birthDate": "1980-01-15"
      },
      "expected": "invalid",
      "errors": ["zarish-pat-2"]
    }
  ]
}
```

---

*Last updated: 2026-01-21*
