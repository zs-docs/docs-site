# ZARISH Encounter Profile

The ZARISH Encounter Profile is based on FHIR R5 Encounter resource with Bangladesh healthcare encounter standards, including DGHS reporting requirements and local healthcare facility management.

## 📋 Profile Overview

**Profile ID**: `https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter`  
**FHIR Version**: R5  
**Status**: Active  
**Publisher**: ZARISH Health Information System  

### Purpose
This profile defines the encounter resource structure for ZARISH HIS, incorporating Bangladesh healthcare encounter requirements, DGHS reporting standards, and local healthcare facility workflows.

## 🏗️ Structure Definition

### Differential View
```json
{
  "resourceType": "StructureDefinition",
  "id": "zarish-encounter",
  "url": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter",
  "name": "ZARISHEncounter",
  "title": "ZARISH Encounter Profile",
  "status": "active",
  "fhirVersion": "5.0.0",
  "kind": "resource",
  "abstract": false,
  "type": "Encounter",
  "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Encounter",
  "derivation": "constraint",
  "differential": {
    "element": [
      {
        "id": "Encounter",
        "path": "Encounter",
        "constraint": [
          {
            "key": "zarish-enc-1",
            "severity": "error",
            "human": "Encounter must have either patient or subject reference",
            "expression": "subject.exists()",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter"
          },
          {
            "key": "zarish-enc-2",
            "severity": "error",
            "human": "Inpatient encounters must have admission source",
            "expression": "class.coding[0].code='IMP' implies hospitalization.admitSource.exists()",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter"
          }
        ]
      },
      {
        "id": "Encounter.identifier",
        "path": "Encounter.identifier",
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
        "id": "Encounter.identifier:encounterNumber",
        "path": "Encounter.identifier",
        "sliceName": "encounterNumber",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "Identifier"
          }
        ],
        "patternIdentifier": {
          "system": "https://zs-his.com/encounter-number",
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "VN",
                "display": "Visit Number"
              }
            ]
          }
        }
      },
      {
        "id": "Encounter.identifier:dghsNumber",
        "path": "Encounter.identifier",
        "sliceName": "dghsNumber",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "Identifier"
          }
        ],
        "patternIdentifier": {
          "system": "https://dghs.gov.bd/encounter-number",
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "VN",
                "display": "Visit Number"
              }
            ]
          }
        }
      },
      {
        "id": "Encounter.status",
        "path": "Encounter.status",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/encounter-status"
        }
      },
      {
        "id": "Encounter.class",
        "path": "Encounter.class",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/encounter-class"
        }
      },
      {
        "id": "Encounter.type",
        "path": "Encounter.type",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/encounter-types"
        }
      },
      {
        "id": "Encounter.serviceType",
        "path": "Encounter.serviceType",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/service-types"
        }
      },
      {
        "id": "Encounter.priority",
        "path": "Encounter.priority",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/encounter-priority"
        }
      },
      {
        "id": "Encounter.subject",
        "path": "Encounter.subject",
        "type": [
          {
            "code": "Reference",
            "targetProfile": [
              "https://fhir.zs-his.com/r5/StructureDefinition/zarish-patient"
            ]
          }
        ],
        "min": 1
      },
      {
        "id": "Encounter.participant",
        "path": "Encounter.participant",
        "slicing": {
          "discriminator": [
            {
              "type": "value",
              "path": "type.coding[0].code"
            }
          ],
          "rules": "open"
        }
      },
      {
        "id": "Encounter.participant:attending",
        "path": "Encounter.participant",
        "sliceName": "attending",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "BackboneElement"
          }
        ],
        "patternParticipant": {
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
          ]
        }
      },
      {
        "id": "Encounter.participant:referring",
        "path": "Encounter.participant",
        "sliceName": "referring",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "BackboneElement"
          }
        ],
        "patternParticipant": {
          "type": [
            {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                  "code": "REF",
                  "display": "referrer"
                }
              ]
            }
          ]
        }
      },
      {
        "id": "Encounter.period",
        "path": "Encounter.period",
        "min": 1,
        "constraint": [
          {
            "key": "zarish-enc-3",
            "severity": "error",
            "human": "Encounter period start must be before end",
            "expression": "start.exists() and end.exists() implies start <= end",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter"
          }
        ]
      },
      {
        "id": "Encounter.reasonCode",
        "path": "Encounter.reasonCode",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/encounter-reason-codes"
        }
      },
      {
        "id": "Encounter.hospitalization",
        "path": "Encounter.hospitalization",
        "type": [
          {
            "code": "BackboneElement"
          }
        ],
        "constraint": [
          {
            "key": "zarish-enc-4",
            "severity": "error",
            "human": "Inpatient encounters must have hospitalization details",
            "expression": "class.coding[0].code='IMP' implies exists()",
            "source": "https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter"
          }
        ]
      },
      {
        "id": "Encounter.hospitalization.admitSource",
        "path": "Encounter.hospitalization.admitSource",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/admit-source"
        }
      },
      {
        "id": "Encounter.hospitalization.dischargeDisposition",
        "path": "Encounter.hospitalization.dischargeDisposition",
        "binding": {
          "strength": "required",
          "valueSet": "https://fhir.zs-his.com/r5/ValueSet/discharge-disposition"
        }
      },
      {
        "id": "Encounter.location",
        "path": "Encounter.location",
        "min": 1
      },
      {
        "id": "Encounter.location:facility",
        "path": "Encounter.location",
        "sliceName": "facility",
        "min": 1,
        "max": "1",
        "type": [
          {
            "code": "BackboneElement"
          }
        ],
        "patternLocation": {
          "status": "active"
        }
      },
      {
        "id": "Encounter.location:ward",
        "path": "Encounter.location",
        "sliceName": "ward",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "BackboneElement"
          }
        ]
      },
      {
        "id": "Encounter.location:bed",
        "path": "Encounter.location",
        "sliceName": "bed",
        "min": 0,
        "max": "1",
        "type": [
          {
            "code": "BackboneElement"
          }
        ]
      }
    ]
  }
}
```

## 📊 Value Sets

### Encounter Status Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "encounter-status",
  "url": "https://fhir.zs-his.com/r5/ValueSet/encounter-status",
  "name": "EncounterStatus",
  "title": "Encounter Status",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/encounter-status",
        "concept": [
          {
            "code": "planned",
            "display": "Planned",
            "designation": [
              {
                "language": "bn",
                "value": "পরিকল্পিত"
              }
            ]
          },
          {
            "code": "arrived",
            "display": "Arrived",
            "designation": [
              {
                "language": "bn",
                "value": "পৌঁছেছে"
              }
            ]
          },
          {
            "code": "in-progress",
            "display": "In Progress",
            "designation": [
              {
                "language": "bn",
                "value": "চলমান"
              }
            ]
          },
          {
            "code": "onleave",
            "display": "On Leave",
            "designation": [
              {
                "language": "bn",
                "value": "ছুটিতে"
              }
            ]
          },
          {
            "code": "finished",
            "display": "Finished",
            "designation": [
              {
                "language": "bn",
                "value": "শেষ"
              }
            ]
          },
          {
            "code": "cancelled",
            "display": "Cancelled",
            "designation": [
              {
                "language": "bn",
                "value": "বাতিল"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Encounter Class Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "encounter-class",
  "url": "https://fhir.zs-his.com/r5/ValueSet/encounter-class",
  "name": "EncounterClass",
  "title": "Encounter Class",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        "concept": [
          {
            "code": "IMP",
            "display": "Inpatient",
            "designation": [
              {
                "language": "bn",
                "value": "ভর্তিকারী"
              }
            ]
          },
          {
            "code": "AMB",
            "display": "Ambulatory",
            "designation": [
              {
                "language": "bn",
                "value": "বহির্ভূতকারী"
              }
            ]
          },
          {
            "code": "EMER",
            "display": "Emergency",
            "designation": [
              {
                "language": "bn",
                "value": "জরুরি"
              }
            ]
          },
          {
            "code": "VR",
            "display": "Virtual",
            "designation": [
              {
                "language": "bn",
                "value": "ভার্চুয়াল"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Encounter Types Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "encounter-types",
  "url": "https://fhir.zs-his.com/r5/ValueSet/encounter-types",
  "name": "EncounterTypes",
  "title": "Encounter Types",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "https://fhir.zs-his.com/r5/CodeSystem/encounter-types",
        "concept": [
          {
            "code": "CONSULT",
            "display": "Consultation",
            "designation": [
              {
                "language": "bn",
                "value": "পরামর্শ"
              }
            ]
          },
          {
            "code": "ADMISSION",
            "display": "Admission",
            "designation": [
              {
                "language": "bn",
                "value": "ভর্তিকরণ"
              }
            ]
          },
          {
            "code": "FOLLOWUP",
            "display": "Follow-up",
            "designation": [
              {
                "language": "bn",
                "value": "অনুসরণ"
              }
            ]
          },
          {
            "code": "EMERGENCY",
            "display": "Emergency",
            "designation": [
              {
                "language": "bn",
                "value": "জরুরি"
              }
            ]
          },
          {
            "code": "PROCEDURE",
            "display": "Procedure",
            "designation": [
              {
                "language": "bn",
                "value": "পদ্ধতি"
              }
            ]
          },
          {
            "code": "VACCINATION",
            "display": "Vaccination",
            "designation": [
              {
                "language": "bn",
                "value": "টিকা দান"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Admit Source Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "admit-source",
  "url": "https://fhir.zs-his.com/r5/ValueSet/admit-source",
  "name": "AdmitSource",
  "title": "Admit Source",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/admit-source",
        "concept": [
          {
            "code": "hosp-trans",
            "display": "Transferred from other hospital",
            "designation": [
              {
                "language": "bn",
                "value": "অন্য হাসপাতাল থেকে স্থানান্তরিত"
              }
            ]
          },
          {
            "code": "emd",
            "display": "From emergency department",
            "designation": [
              {
                "language": "bn",
                "value": "জরুরি বিভাগ থেকে"
              }
            ]
          },
          {
            "code": "outp",
            "display": "From outpatient department",
            "designation": [
              {
                "language": "bn",
                "value": "বহির্ভূতকারী বিভাগ থেকে"
              }
            ]
          },
          {
            "code": "born",
            "display": "Born in hospital",
            "designation": [
              {
                "language": "bn",
                "value": "হাসপাতালে জন্ম"
              }
            ]
          },
          {
            "code": "gp",
            "display": "General Practitioner referral",
            "designation": [
              {
                "language": "bn",
                "value": "সাধারণ চিকিৎসকের রেফারেল"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Discharge Disposition Value Set
```json
{
  "resourceType": "ValueSet",
  "id": "discharge-disposition",
  "url": "https://fhir.zs-his.com/r5/ValueSet/discharge-disposition",
  "name": "DischargeDisposition",
  "title": "Discharge Disposition",
  "status": "active",
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/discharge-disposition",
        "concept": [
          {
            "code": "home",
            "display": "Home",
            "designation": [
              {
                "language": "bn",
                "value": "বাড়ি"
              }
            ]
          },
          {
            "code": "other-hcf",
            "display": "Other healthcare facility",
            "designation": [
              {
                "language": "bn",
                "value": "অন্য স্বাস্থ্যসেবা প্রতিষ্ঠান"
              }
            ]
          },
          {
            "code": "rehab",
            "display": "Rehabilitation",
            "designation": [
              {
                "language": "bn",
                "value": "পুনর্বাসন"
              }
            ]
          },
          {
            "code": "snf",
            "display": "Skilled nursing facility",
            "designation": [
              {
                "language": "bn",
                "value": "দক্ষ নার্সিং সুবিধা"
              }
            ]
          },
          {
            "code": "exp",
            "display": "Expired",
            "designation": [
              {
                "language": "bn",
                "value": "মৃত্যু"
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

### Complete Inpatient Encounter Example
```json
{
  "resourceType": "Encounter",
  "id": "encounter-123",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter"
    ],
    "lastUpdated": "2026-01-21T10:30:00+06:00"
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "VN",
            "display": "Visit Number"
          }
        ]
      },
      "system": "https://zs-his.com/encounter-number",
      "value": "ENC202600123456"
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "VN",
            "display": "Visit Number"
          }
        ]
      },
      "system": "https://dghs.gov.bd/encounter-number",
      "value": "DGHS202600123456"
    }
  ],
  "status": "in-progress",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "IMP",
    "display": "Inpatient"
  },
  "type": [
    {
      "coding": [
        {
          "system": "https://fhir.zs-his.com/r5/CodeSystem/encounter-types",
          "code": "ADMISSION",
          "display": "Admission"
        }
      ]
    }
  ],
  "serviceType": [
    {
      "coding": [
        {
          "system": "https://fhir.zs-his.com/r5/CodeSystem/service-types",
          "code": "CARD",
          "display": "Cardiology"
        }
      ]
    }
  ],
  "priority": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "code": "R",
        "display": "routine"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123",
    "display": "Mohammad Rahim Islam"
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
        "reference": "Practitioner/practitioner-456",
        "display": "Dr. Sarah Ahmed"
      },
      "period": {
        "start": "2026-01-21T10:00:00+06:00"
      }
    },
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "REF",
              "display": "referrer"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/practitioner-789",
        "display": "Dr. Mohammad Ali"
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
      ],
      "text": "Chest pain, suspected myocardial infarction"
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
    "reAdmission": false,
    "dietPreference": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diet",
            "code": "NPO",
            "display": "Nothing by mouth"
          }
        ]
      }
    ],
    "specialCourtesy": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3-EncounterSpecialCourtesy",
            "code": "VIP",
            "display": "very important person"
          }
        ]
      }
    ],
    "specialArrangement": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3-EncounterSpecialArrangement",
            "code": "WB",
            "display": "wheelchair"
          }
        ]
      }
    ]
  },
  "location": [
    {
      "location": {
        "reference": "Organization/organization-123",
        "display": "ZARISH Medical Center"
      },
      "status": "active",
      "physicalType": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
            "code": "si",
            "display": "Site"
          }
        ]
      }
    },
    {
      "location": {
        "reference": "Location/ward-123",
        "display": "Cardiology Ward - Bed 12"
      },
      "status": "active",
      "physicalType": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
            "code": "wa",
            "display": "Ward"
          }
        ]
      },
      "period": {
        "start": "2026-01-21T10:00:00+06:00"
      }
    },
    {
      "location": {
        "reference": "Location/bed-123",
        "display": "Bed 12"
      },
      "status": "active",
      "physicalType": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
            "code": "bd",
            "display": "Bed"
          }
        ]
      },
      "period": {
        "start": "2026-01-21T10:00:00+06:00"
      }
    }
  ],
  "serviceProvider": {
    "reference": "Organization/organization-123",
    "display": "ZARISH Medical Center"
  }
}
```

### Outpatient Encounter Example
```json
{
  "resourceType": "Encounter",
  "id": "encounter-456",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/r5/StructureDefinition/zarish-encounter"
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "VN",
            "display": "Visit Number"
          }
        ]
      },
      "system": "https://zs-his.com/encounter-number",
      "value": "ENC202600123457"
    }
  ],
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "Ambulatory"
  },
  "type": [
    {
      "coding": [
        {
          "system": "https://fhir.zs-his.com/r5/CodeSystem/encounter-types",
          "code": "CONSULT",
          "display": "Consultation"
        }
      ]
    }
  ],
  "serviceType": [
    {
      "coding": [
        {
          "system": "https://fhir.zs-his.com/r5/CodeSystem/service-types",
          "code": "MED",
          "display": "General Medicine"
        }
      ]
    }
  ],
  "priority": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "code": "R",
        "display": "routine"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-456",
    "display": "Fatema Khan"
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
        "reference": "Practitioner/practitioner-123",
        "display": "Dr. Mohammad Rahman"
      },
      "period": {
        "start": "2026-01-21T14:00:00+06:00",
        "end": "2026-01-21T14:30:00+06:00"
      }
    }
  ],
  "period": {
    "start": "2026-01-21T14:00:00+06:00",
    "end": "2026-01-21T14:30:00+06:00"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "267036007",
          "display": "Chest pain"
        }
      ],
      "text": "Chest pain on exertion"
    }
  ],
  "location": [
    {
      "location": {
        "reference": "Organization/organization-123",
        "display": "ZARISH Medical Center"
      },
      "status": "active",
      "physicalType": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
            "code": "si",
            "display": "Site"
          }
        ]
      }
    },
    {
      "location": {
        "reference": "Location/outpatient-123",
        "display": "Consultation Room 5"
      },
      "status": "active",
      "physicalType": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
            "code": "ro",
            "display": "Room"
          }
        ]
      },
      "period": {
        "start": "2026-01-21T14:00:00+06:00",
        "end": "2026-01-21T14:30:00+06:00"
      }
    }
  ],
  "serviceProvider": {
    "reference": "Organization/organization-123",
    "display": "ZARISH Medical Center"
  }
}
```

## 🔍 Validation Rules

### Business Rules
1. **zarish-enc-1**: Encounter must have either patient or subject reference
2. **zarish-enc-2**: Inpatient encounters must have admission source
3. **zarish-enc-3**: Encounter period start must be before end
4. **zarish-enc-4**: Inpatient encounters must have hospitalization details

### Validation Examples
```json
// Valid Inpatient Encounter
{
  "class": {
    "code": "IMP"
  },
  "hospitalization": {
    "admitSource": {
      "code": "emd"
    }
  }
}

// Invalid Inpatient Encounter - Missing Admit Source
{
  "class": {
    "code": "IMP"
  },
  "hospitalization": {}
}

// Invalid Period
{
  "period": {
    "start": "2026-01-21T15:00:00+06:00",
    "end": "2026-01-21T14:00:00+06:00"
  }
}
```

## 🔄 Mappings

### DGHS Encounter Reporting
```json
{
  "sourceSystem": "DGHS",
  "targetResource": "Encounter",
  "mappings": {
    "encounterNumber": {
      "target": "identifier[1].value",
      "system": "https://dghs.gov.bd/encounter-number"
    },
    "patientId": {
      "target": "subject.reference"
    },
    "facilityId": {
      "target": "serviceProvider.reference"
    },
    "encounterDate": {
      "target": "period.start"
    },
    "encounterType": {
      "target": "type[0].coding[0].code",
      "mapping": {
        "1": "CONSULT",
        "2": "ADMISSION",
        "3": "EMERGENCY",
        "4": "PROCEDURE"
      }
    },
    "dischargeDate": {
      "target": "period.end"
    },
    "dischargeDisposition": {
      "target": "hospitalization.dischargeDisposition.coding[0].code"
    }
  }
}
```

## 🧪 Testing

### Test Cases
```json
{
  "testSuite": "ZARISH Encounter Profile Tests",
  "testCases": [
    {
      "name": "Valid inpatient encounter",
      "input": {
        "resourceType": "Encounter",
        "status": "in-progress",
        "class": {
          "code": "IMP"
        },
        "subject": {
          "reference": "Patient/patient-123"
        },
        "period": {
          "start": "2026-01-21T10:00:00+06:00"
        },
        "hospitalization": {
          "admitSource": {
            "code": "emd"
          }
        }
      },
      "expected": "valid"
    },
    {
      "name": "Invalid inpatient without hospitalization",
      "input": {
        "resourceType": "Encounter",
        "status": "in-progress",
        "class": {
          "code": "IMP"
        },
        "subject": {
          "reference": "Patient/patient-123"
        },
        "period": {
          "start": "2026-01-21T10:00:00+06:00"
        }
      },
      "expected": "invalid",
      "errors": ["zarish-enc-4"]
    },
    {
      "name": "Invalid period - end before start",
      "input": {
        "resourceType": "Encounter",
        "status": "in-progress",
        "class": {
          "code": "AMB"
        },
        "subject": {
          "reference": "Patient/patient-123"
        },
        "period": {
          "start": "2026-01-21T15:00:00+06:00",
          "end": "2026-01-21T14:00:00+06:00"
        }
      },
      "expected": "invalid",
      "errors": ["zarish-enc-3"]
    }
  ]
}
```

---

*Last updated: 2026-01-21*
