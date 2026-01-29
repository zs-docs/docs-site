# ZARISH Practitioner Profile

The ZARISH Practitioner Profile is based on FHIR R5 Practitioner resource with Bangladesh-specific extensions for healthcare professionals, including BMDC registration and specialty information.

## 📋 Profile Overview

**Profile ID**: `https://fhir.zs-his.com/r5/StructureDefinition/zarish-practitioner`  
**FHIR Version**: R5  
**Status**: Active  
**Publisher**: ZARISH Health Information System  

### Purpose
This profile defines the practitioner resource structure for ZARISH HIS, incorporating Bangladesh Medical and Dental Council (BMDC) requirements, healthcare professional qualifications, and local healthcare standards.

## 🏗️ Structure Definition

### Differential View
```json
{
  "resourceType": "StructureDefinition",
  "id": "zarish-practitioner",
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-practitioner",
  "name": "ZARISHPractitioner",
  "title": "ZARISH Practitioner Profile",
  "status": "active",
  "fhirVersion": "5.0.0",
  "kind": "resource",
  "abstract": false,
  "type": "Practitioner",
  "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Practitioner",
  "derivation": "constraint",
  "differential": {
    "element": [
      {
        "id": "Practitioner",
        "path": "Practitioner",
        "constraint": [
          {
            "key": "zarish-prac-1",
            "severity": "error",
            "human": "Practitioner must have either BMDC registration or foreign qualification",
            "expression": "identifier.where(system='https://bmdc.org.bd').exists() or qualification.where(extension.where(url='https://fhir.zs-his.com/r5/StructureDefinition/foreign-qualification').exists()).exists()",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-practitioner"
          }
        ]
      },
      {
        "id": "Practitioner.identifier",
        "path": "Practitioner.identifier",
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
        "id": "Practitioner.identifier:bmdcRegistration",
        "path": "Practitioner.identifier",
        "sliceName": "bmdcRegistration",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Identifier"
          }
        ],
        "patternIdentifier": {
          "system": "https://bmdc.org.bd",
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "MD",
                "display": "Medical License number"
              }
            ]
          }
        },
        "constraint": [
          {
            "key": "zarish-prac-2",
            "severity": "error",
            "human": "BMDC registration must follow format: [A-Z]-[0-9]{5}",
            "expression": "value.matches('^[A-Z]-[0-9]{5}$')",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-practitioner"
          }
        ]
      },
      {
        "id": "Practitioner.identifier:practitionerId",
        "path": "Practitioner.identifier",
        "sliceName": "practitionerId",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "Identifier"
          }
        ],
        "patternIdentifier": {
          "system": "https://zs-his.com/practitioner-id",
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "PRN",
                "display": "Provider number"
              }
            ]
          }
        }
      },
      {
        "id": "Practitioner.name",
        "path": "Practitioner.name",
        "min": 1,
        "max": "2",
        "constraint": [
          {
            "key": "zarish-prac-3",
            "severity": "error",
            "human": "Practitioner name must have family and given names",
            "expression": "family.exists() and given.exists()",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-practitioner"
          }
        ]
      },
      {
        "id": "Practitioner.telecom",
        "path": "Practitioner.telecom",
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
        "id": "Practitioner.telecom:mobile",
        "path": "Practitioner.telecom",
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
        }
      },
      {
        "id": "Practitioner.telecom:email",
        "path": "Practitioner.telecom",
        "sliceName": "email",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "ContactPoint"
          }
        ],
        "patternContactPoint": {
          "system": "email",
          "use": "work"
        }
      },
      {
        "id": "Practitioner.gender",
        "path": "Practitioner.gender",
        "min": 1,
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/bangladesh-gender"
        }
      },
      {
        "id": "Practitioner.qualification",
        "path": "Practitioner.qualification",
        "slicing": {
          "discriminator": [
            {
              "type": "value",
              "path": "code.coding[0].system"
            }
          ],
          "rules": "open"
        },
        "min": 1
      },
      {
        "id": "Practitioner.qualification:medical",
        "path": "Practitioner.qualification",
        "sliceName": "medical",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Qualification"
          }
        ],
        "patternQualification": {
          "code": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0360",
                "code": "MBBS",
                "display": "Bachelor of Medicine and Bachelor of Surgery"
              }
            ]
          }
        }
      },
      {
        "id": "Practitioner.qualification:postgraduate",
        "path": "Practitioner.qualification",
        "sliceName": "postgraduate",
        "min": 0,
        "max": "*",
        "type": [
          {
            "code": "Qualification"
          }
        ]
      },
      {
        "id": "Practitioner.extension:bmdcRegistration",
        "path": "Practitioner.extension",
        "sliceName": "bmdcRegistration",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Extension"
          }
        ]
      },
      {
        "id": "Practitioner.extension:foreignQualification",
        "path": "Practitioner.extension",
        "sliceName": "foreignQualification",
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

## 🔧 Extensions

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
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "Extension"
          }
        ]
      },
      {
        "id": "Extension.extension:registrationStatus",
        "path": "Extension.extension",
        "sliceName": "registrationStatus",
        "min": 1,
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

### Foreign Qualification Extension
```json
{
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/foreign-qualification",
  "name": "ForeignQualification",
  "title": "Foreign Qualification",
  "status": "active",
  "kind": "complex-type",
  "abstract": false,
  "context": [
    "Practitioner",
    "Practitioner.qualification"
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
        "fixedUri": "https://fhir.zs-his.com/r5/StructureDefinition/foreign-qualification"
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
        "id": "Extension.extension:country",
        "path": "Extension.extension",
        "sliceName": "country",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "Extension"
          }
        ]
      },
      {
        "id": "Extension.extension:equivalency",
        "path": "Extension.extension",
        "sliceName": "equivalency",
        "min": 1,
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

### BMDC Specialties Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "bmdc-specialties",
  "url": "https://fhir.zs-his.com/r5/ValueSet/bmdc-specialties",
  "name": "BMDCSpecialties",
  "title": "BMDC Specialties",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "https://bmdc.org.bd/specialties",
        "concept": [
          {
            "code": "MED",
            "display": "General Medicine",
            "designation": [
              {
                "language": "bn",
                "value": "সাধারণ চিকিৎসা"
              }
            ]
          },
          {
            "code": "SURG",
            "display": "General Surgery",
            "designation": [
              {
                "language": "bn",
                "value": "সাধারণ সার্জারি"
              }
            ]
          },
          {
            "code": "GYNE",
            "display": "Gynecology & Obstetrics",
            "designation": [
              {
                "language": "bn",
                "value": "স্ত্রীরোগ ও প্রসূত্তিবিদ্যা"
              }
            ]
          },
          {
            "code": "PED",
            "display": "Pediatrics",
            "designation": [
              {
                "language": "bn",
                "value": "শিশু চিকিৎসা"
              }
            ]
          },
          {
            "code": "CARD",
            "display": "Cardiology",
            "designation": [
              {
                "language": "bn",
                "value": "হৃদরোগ বিদ্যা"
              }
            ]
          },
          {
            "code": "NEURO",
            "display": "Neurology",
            "designation": [
              {
                "language": "bn",
                "value": "স্নায়ু রোগ বিদ্যা"
              }
            ]
          },
          {
            "code": "ORTHO",
            "display": "Orthopedic Surgery",
            "designation": [
              {
                "language": "bn",
                "value": "অর্থোপেডিক সার্জারি"
              }
            ]
          },
          {
            "code": "ENT",
            "display": "ENT Surgery",
            "designation": [
              {
                "language": "bn",
                "value": "কান-নাক-গলা সার্জারি"
              }
            ]
          },
          {
            "code": "OPH",
            "display": "Ophthalmology",
            "designation": [
              {
                "language": "bn",
                "value": "চক্ষু বিদ্যা"
              }
            ]
          },
          {
            "code": "DERM",
            "display": "Dermatology",
            "designation": [
              {
                "language": "bn",
                "value": "চর্মরোগ বিদ্যা"
              }
            ]
          },
          {
            "code": "PSYCH",
            "display": "Psychiatry",
            "designation": [
              {
                "language": "bn",
                "value": "মানসিক রোগ বিদ্যা"
              }
            ]
          },
          {
            "code": "ANESTH",
            "display": "Anesthesiology",
            "designation": [
              {
                "language": "bn",
                "value": "অ্যানেসথেসিওলজি"
              }
            ]
          },
          {
            "code": "RAD",
            "display": "Radiology",
            "designation": [
              {
                "language": "bn",
                "value": "রেডিওলজি"
              }
            ]
          },
          {
            "code": "PATH",
            "display": "Pathology",
            "designation": [
              {
                "language": "bn",
                "value": "প্যাথলজি"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Medical Qualifications Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "medical-qualifications",
  "url": "https://fhir.zs-his.com/r5/ValueSet/medical-qualifications",
  "name": "MedicalQualifications",
  "title": "Medical Qualifications",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v2-0360",
        "concept": [
          {
            "code": "MBBS",
            "display": "Bachelor of Medicine and Bachelor of Surgery"
          },
          {
            "code": "MD",
            "display": "Doctor of Medicine"
          },
          {
            "code": "MS",
            "display": "Master of Surgery"
          },
          {
            "code": "FCPS",
            "display": "Fellowship of College of Physicians and Surgeons"
          },
          {
            "code": "FRCS",
            "display": "Fellowship of Royal Colleges of Surgeons"
          },
          {
            "code": "MRCP",
            "display": "Membership of the Royal Colleges of Physicians"
          },
          {
            "code": "DM",
            "display": "Doctor of Medicine (Super Specialty)"
          },
          {
            "code": "MCH",
            "display": "Master of Chirurgiae (Super Specialty)"
          }
        ]
      }
    ]
  }
}
```

## 📝 Example Instances

### Complete Practitioner Example
```json
{
  "resourceType": "Practitioner",
  "id": "practitioner-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-practitioner"
    ],
    "lastUpdated": "2026-01-21T10:30:00+06:00"
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
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "PRN",
            "display": "Provider number"
          }
        ]
      },
      "system": "https://zs-his.com/practitioner-id",
      "value": "PR202600123456"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Ahmed",
      "given": [
        "Sarah",
        "Begum"
      ],
      "prefix": [
        "Dr."
      ],
      "suffix": [
        "FCPS",
        "FRCS"
      ]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801812345678",
      "use": "mobile"
    },
    {
      "system": "phone",
      "value": "+8802123456789",
      "use": "work"
    },
    {
      "system": "email",
      "value": "dr.sarah.ahmed@hospital.com",
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
          "value": "MBBS-2000"
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
        "display": "Dhaka Medical College"
      },
      "period": {
        "start": "1995-01-01",
        "end": "2000-12-31"
      }
    },
    {
      "identifier": [
        {
          "system": "https://bcps.edu.bd/fellowships",
          "value": "FCPS-2008"
        }
      ],
      "code": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0360",
            "code": "FCPS",
            "display": "Fellowship of College of Physicians and Surgeons"
          }
        ]
      },
      "issuer": {
        "display": "Bangladesh College of Physicians and Surgeons"
      },
      "period": {
        "start": "2003-01-01",
        "end": "2008-12-31"
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
          "valueDate": "2001-01-15"
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
        },
        {
          "url": "registrationStatus",
          "valueString": "active"
        }
      ]
    }
  ],
  "active": true
}
```

### Foreign Qualified Practitioner Example
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
            "code": "PRN",
            "display": "Provider number"
          }
        ]
      },
      "system": "https://zs-his.com/practitioner-id",
      "value": "PR202600123457"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Johnson",
      "given": [
        "Robert",
        "James"
      ],
      "prefix": [
        "Dr."
      ]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "+8801712345679",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "dr.robert.johnson@hospital.com",
      "use": "work"
    }
  ],
  "gender": "male",
  "birthDate": "1970-03-15",
  "qualification": [
    {
      "identifier": [
        {
          "system": "https://gmc-uk.org/register",
          "value": "GMC-123456"
        }
      ],
      "code": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0360",
            "code": "MD",
            "display": "Doctor of Medicine"
          }
        ]
      },
      "issuer": {
        "display": "University of London"
      },
      "period": {
        "start": "1988-01-01",
        "end": "1994-12-31"
      },
      "extension": [
        {
          "url": "https://fhir.zs-his.com/r5/StructureDefinition/foreign-qualification",
          "extension": [
            {
              "url": "country",
              "valueString": "United Kingdom"
            },
            {
              "url": "equivalency",
              "valueString": "MBBS equivalent"
            }
          ]
        }
      ]
    }
  ],
  "active": true
}
```

## 🔍 Validation Rules

### Business Rules
1. **zarish-prac-1**: Practitioner must have either BMDC registration or foreign qualification
2. **zarish-prac-2**: BMDC registration must follow format: [A-Z]-[0-9]{5}
3. **zarish-prac-3**: Practitioner name must have family and given names

### Validation Examples
```json
// Valid BMDC Registration
{
  "system": "https://bmdc.org.bd",
  "value": "A-12345"  // Valid format
}

// Invalid BMDC Registration
{
  "system": "https://bmdc.org.bd",
  "value": "A12345"   // Missing hyphen - invalid
}

// Invalid BMDC Registration
{
  "system": "https://bmdc.org.bd",
  "value": "A-123456" // Too many digits - invalid
}
```

## 🔄 Mappings

### BMDC Registration Mapping
```json
{
  "sourceSystem": "BMDC",
  "targetResource": "Practitioner",
  "mappings": {
    "registrationNumber": {
      "target": "identifier[0].value",
      "system": "https://bmdc.org.bd",
      "type": "MD"
    },
    "name": {
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
    "specialty": {
      "target": "extension[0].extension[2].valueCodeableConcept",
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration"
    },
    "registrationDate": {
      "target": "extension[0].extension[1].valueDate",
      "url": "https://fhir.zs-his.com/r5/StructureDefinition/bmdc-registration"
    }
  }
}
```

## 🧪 Testing

### Test Cases
```json
{
  "testSuite": "ZARISH Practitioner Profile Tests",
  "testCases": [
    {
      "name": "Valid BMDC registered practitioner",
      "input": {
        "resourceType": "Practitioner",
        "identifier": [
          {
            "system": "https://bmdc.org.bd",
            "value": "A-12345"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Ahmed",
            "given": ["Sarah"]
          }
        ],
        "gender": "female",
        "qualification": [
          {
            "code": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0360",
                  "code": "MBBS"
                }
              ]
            }
          }
        ]
      },
      "expected": "valid"
    },
    {
      "name": "Invalid BMDC registration format",
      "input": {
        "resourceType": "Practitioner",
        "identifier": [
          {
            "system": "https://bmdc.org.bd",
            "value": "A12345"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Ahmed",
            "given": ["Sarah"]
          }
        ],
        "gender": "female"
      },
      "expected": "invalid",
      "errors": ["zarish-prac-2"]
    },
    {
      "name": "Practitioner without qualification",
      "input": {
        "resourceType": "Practitioner",
        "identifier": [
          {
            "system": "https://zs-his.com/practitioner-id",
            "value": "PR202600123458"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Khan",
            "given": ["Ali"]
          }
        ],
        "gender": "male"
      },
      "expected": "invalid",
      "errors": ["zarish-prac-1"]
    }
  ]
}
```

---

*Last updated: 2026-01-21*
