# 🏥 Encounter Templates

## Overview

This section provides comprehensive encounter templates for ZARISH SPHERE, following FHIR R5 standards and healthcare best practices.

## 🏥 Outpatient Encounter

### General Consultation

````json
{
  "resourceType": "Encounter",
  "id": "outpatient-consultation",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Encounter",
      "http://zarishsphere.com/fhir/StructureDefinition/Outpatient-Encounter"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://hospital.zarishsphere.com/encounter",
      "value": "{{encounter.id}}"
    }
  ],
  "status": "finished",
  "class": [
    {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      "code": "AMB",
      "display": "ambulatory"
    }
  ],
  "type": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "11429006",
          "display": "Consultation"
        }
      ],
      "text": "General consultation"
    }
  ],
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
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
        "reference": "Practitioner/{{practitionerId}}",
        "display": "{{practitionerName}}"
      },
      "period": {
        "start": "{{encounter.startTime}}",
        "end": "{{encounter.endTime}}"
      }
    }
  ],
  "period": {
    "start": "{{encounter.startTime}}",
    "end": "{{encounter.endTime}}"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "{{reasonCode}}",
          "display": "{{reasonDisplay}}"
        }
      ],
      "text": "{{reasonText}}"
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/{{conditionId}}",
        "display": "{{conditionDisplay}}"
      },
      "use": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "DD",
            "display": "Diagnosis"
          }
        ]
      },
      "rank": 1
    }
  ],
  "serviceProvider": {
    "reference": "Organization/{{organizationId}}",
    "display": "{{organizationName}}"
  },
  "location": [
    {
      "location": {
        "reference": "Location/{{locationId}}",
        "display": "{{locationName}}"
      }
    }
  ],
  "note": [
    {
      "text": "{{encounter.note}}"
    }
  ]
}
```json

### Specialty Consultation

```json
{
  "resourceType": "Encounter",
  "id": "specialty-consultation",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Encounter",
      "http://zarishsphere.com/fhir/StructureDefinition/Specialty-Encounter"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://hospital.zarishsphere.com/encounter",
      "value": "{{encounter.id}}"
    }
  ],
  "status": "finished",
  "class": [
    {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      "code": "AMB",
      "display": "ambulatory"
    }
  ],
  "type": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "{{specialtyCode}}",
          "display": "{{specialtyDisplay}}"
        }
      ],
      "text": "{{specialtyName}} consultation"
    }
  ],
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
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
        "reference": "Practitioner/{{specialistId}}",
        "display": "{{specialistName}}"
      },
      "period": {
        "start": "{{encounter.startTime}}",
        "end": "{{encounter.endTime}}"
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
        "reference": "Practitioner/{{referrerId}}",
        "display": "{{referrerName}}"
      }
    }
  ],
  "period": {
    "start": "{{encounter.startTime}}",
    "end": "{{encounter.endTime}}"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "{{reasonCode}}",
          "display": "{{reasonDisplay}}"
        }
      ],
      "text": "{{reasonText}}"
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/{{conditionId}}",
        "display": "{{conditionDisplay}}"
      },
      "use": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "DD",
            "display": "Diagnosis"
          }
        ]
      },
      "rank": 1
    }
  ],
  "serviceProvider": {
    "reference": "Organization/{{organizationId}}",
    "display": "{{organizationName}}"
  },
  "hospitalization": {
    "admitSource": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/admit-source",
          "code": "{{admitSourceCode}}",
          "display": "{{admitSourceDisplay}}"
        }
      ]
  },
  "location": [
    {
      "location": {
        "reference": "Location/{{locationId}}",
        "display": "{{locationName}}"
      }
    }
  ]
}
```json

## 🏥 Inpatient Encounter

### Hospital Admission

```json
{
  "resourceType": "Encounter",
  "id": "inpatient-admission",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Encounter",
      "http://zarishsphere.com/fhir/StructureDefinition/Inpatient-Encounter"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://hospital.zarishsphere.com/encounter",
      "value": "{{encounter.id}}"
    },
    {
      "use": "usual",
      "system": "http://hospital.zarishsphere.com/admission",
      "value": "{{admissionNumber}}"
    }
  ],
  "status": "in-progress",
  "class": [
    {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      "code": "IMP",
      "display": "inpatient encounter"
    }
  ],
  "type": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "32485007",
          "display": "Hospital admission"
        }
      ],
      "text": "Hospital admission"
    }
  ],
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
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
        "reference": "Practitioner/{{attendingPhysicianId}}",
        "display": "{{attendingPhysicianName}}"
      },
      "period": {
        "start": "{{encounter.startTime}}"
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
        "reference": "Practitioner/{{referringPhysicianId}}",
        "display": "{{referringPhysicianName}}"
      }
    },
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "ADM",
              "display": "admitter"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/{{admittingPhysicianId}}",
        "display": "{{admittingPhysicianName}}"
      }
    }
  ],
  "period": {
    "start": "{{encounter.admissionDateTime}}",
    "end": "{{encounter.expectedDischargeDateTime}}"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "{{admissionReasonCode}}",
          "display": "{{admissionReasonDisplay}}"
        }
      ],
      "text": "{{admissionReasonText}}"
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/{{primaryDiagnosisId}}",
        "display": "{{primaryDiagnosisDisplay}}"
      },
      "use": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "AD",
            "display": "Admission diagnosis"
          }
        ]
      },
      "rank": 1
    },
    {
      "condition": {
        "reference": "Condition/{{secondaryDiagnosisId}}",
        "display": "{{secondaryDiagnosisDisplay}}"
      },
      "use": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "DD",
            "display": "Diagnosis"
          }
        ]
      },
      "rank": 2
    }
  ],
  "account": [
    {
      "reference": "Account/{{accountId}}",
      "display": "{{accountName}}"
    }
  ],
  "hospitalization": {
    "admitSource": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/admit-source",
          "code": "{{admitSourceCode}}",
          "display": "{{admitSourceDisplay}}"
        }
      ],
    "reAdmission": false,
    "dietPreference": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diet",
            "code": "{{dietCode}}",
            "display": "{{dietDisplay}}"
          }
        ]
      }
    ],
    "specialCourtesy": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3-EncounterSpecialCourtesy",
            "code": "{{specialCourtesyCode}}",
            "display": "{{specialCourtesyDisplay}}"
          }
        ]
      }
    ],
    "dischargeDisposition": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/discharge-disposition",
          "code": "{{dispositionCode}}",
          "display": "{{dispositionDisplay}}"
        }
      ]
    }
  },
  "location": [
    {
      "location": {
        "reference": "Location/{{wardId}}",
        "display": "{{wardName}}"
      },
      "status": "active",
      "period": {
        "start": "{{encounter.admissionDateTime}}"
      }
    }
  ],
  "serviceProvider": {
    "reference": "Organization/{{hospitalId}}",
    "display": "{{hospitalName}}"
  }
}
```json

### Emergency Department Visit

```json
{
  "resourceType": "Encounter",
  "id": "emergency-department-visit",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Encounter",
      "http://zarishsphere.com/fhir/StructureDefinition/Emergency-Encounter"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://hospital.zarishsphere.com/encounter",
      "value": "{{encounter.id}}"
    },
    {
      "use": "temp",
      "system": "http://hospital.zarishsphere.com/er-visit",
      "value": "{{erVisitNumber}}"
    }
  ],
  "status": "finished",
  "class": [
    {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      "code": "EMER",
      "display": "emergency"
    }
  ],
  "type": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "4525004",
          "display": "Emergency department patient visit (procedure)"
        }
      ],
      "text": "Emergency department visit"
    }
  ],
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
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
        "reference": "Practitioner/{{emergencyPhysicianId}}",
        "display": "{{emergencyPhysicianName}}"
      },
      "period": {
        "start": "{{encounter.startTime}}",
        "end": "{{encounter.endTime}}"
      }
    },
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "PART",
              "display": "participation"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/{{nurseId}}",
        "display": "{{nurseName}}"
      },
      "period": {
        "start": "{{encounter.startTime}}",
        "end": "{{encounter.endTime}}"
      }
    }
  ],
  "period": {
    "start": "{{encounter.arrivalTime}}",
    "end": "{{encounter.departureTime}}"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "{{triageCode}}",
          "display": "{{triageDisplay}}"
        }
      ],
      "text": "{{triageText}}"
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/{{conditionId}}",
        "display": "{{conditionDisplay}}"
      },
      "use": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "DD",
            "display": "Diagnosis"
          }
        ]
      },
      "rank": 1
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
  "location": [
    {
      "location": {
        "reference": "Location/{{erLocationId}}",
        "display": "{{erLocationName}}"
      },
      "status": "active",
      "period": {
        "start": "{{encounter.arrivalTime}}"
      }
    }
  ],
  "serviceProvider": {
    "reference": "Organization/{{hospitalId}}",
    "display": "{{hospitalName}}"
  }
}
```json

## 🏥 Virtual Encounter

### Telemedicine Consultation

```json
{
  "resourceType": "Encounter",
  "id": "telemedicine-consultation",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Encounter",
      "http://zarishsphere.com/fhir/StructureDefinition/Virtual-Encounter"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://hospital.zarishsphere.com/encounter",
      "value": "{{encounter.id}}"
    }
  ],
  "status": "finished",
  "class": [
    {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      "code": "VR",
      "display": "virtual"
    }
  ],
  "type": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "439401001",
          "display": "Virtual encounter (procedure)"
        }
      ],
      "text": "Telemedicine consultation"
    }
  ],
  "subject": {
    "reference": "Patient/{{patientId}}",
    "display": "{{patientName}}"
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
        "reference": "Practitioner/{{providerId}}",
        "display": "{{providerName}}"
      },
      "period": {
        "start": "{{encounter.startTime}}",
        "end": "{{encounter.endTime}}"
      }
    }
  ],
  "period": {
    "start": "{{encounter.startTime}}",
    "end": "{{encounter.endTime}}"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "{{reasonCode}}",
          "display": "{{reasonDisplay}}"
        }
      ],
      "text": "{{reasonText}}"
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/{{conditionId}}",
        "display": "{{conditionDisplay}}"
      },
      "use": {
       coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "DD",
            "display": "Diagnosis"
          }
        ]
      },
      "rank": 1
    }
  ],
  "serviceProvider": {
    "reference": "Organization/{{organizationId}}",
    "display": "{{organizationName}}"
  },
  "virtualService": {
    "channelType": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationMode",
          "code": "WRITTEN",
          "display": "written"
        }
      ]
    },
    "modality": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/R5/virtual-service-type",
          "code": "video",
          "display": "Video"
        }
      ]
    }
  },
  "note": [
    {
      "text": "{{encounter.note}}"
    }
  ]
}
```yaml

## 🔧 Implementation Guidelines

### Creating New Encounters

```typescript
interface EncounterTemplate {
  resourceType: 'Encounter';
  id: string;
  meta: {
    profile: string[];
  };
  identifier: Array<{
    use: string;
    system: string;
    value: string;
  }>;
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled' | 'entered-in-error';
  class: Array<{
    system: string;
    code: string;
    display: string;
  }>;
  type: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text?: string;
  }>;
  subject: {
    reference: string;
    display: string;
  };
  participant: Array<{
    type: Array<{
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    }>;
    individual?: {
      reference: string;
      display: string;
    };
    period?: {
      start: string;
      end?: string;
    };
  }>;
  period: {
    start: string;
    end?: string;
  };
  reasonCode?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text?: string;
  }>;
  diagnosis?: Array<{
    condition: {
      reference: string;
      display: string;
    };
    use?: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    rank?: number;
  }>;
  serviceProvider?: {
    reference: string;
    display: string;
  };
  location?: Array<{
    location: {
      reference: string;
      display: string;
    };
    status?: string;
    period?: {
      start: string;
      end?: string;
    };
  }>;
  note?: Array<{
    text: string;
  }>;
}
```javascript

### Validation Rules

```javascript
const encounterValidation = {
  required: [
    'status',
    'class',
    'subject'
  ],

  rules: {
    status: {
      enum: ['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled', 'entered-in-error']
    },
    class: {
      type: 'array',
      minItems: 1
    },
    subject: {
      type: 'object',
      required: ['reference']
    },
    period: {
      type: 'object',
      required: ['start']
    }
  },

  custom: {
    validateClass: (encounter) => {
      const validClasses = ['AMB', 'IMP', 'EMER', 'VR'];
      return encounter.class.some(c => validClasses.includes(c.code));
    },
    validateParticipant: (encounter) => {
      return encounter.participant && encounter.participant.length > 0;
    }
  }
};
```javascript

## 📊 Encounter Analytics

### Encounter Tracking

```javascript
class EncounterAnalytics {
  static trackEncounter(encounter) {
    const event = {
      type: 'encounter_created',
      timestamp: new Date().toISOString(),
      patientId: encounter.subject.reference.split('/')[1],
      class: encounter.class[0].code,
      type: encounter.type?.[0]?.coding?.[0]?.code,
      status: encounter.status,
      duration: this.calculateDuration(encounter.period),
      location: encounter.location?.[0]?.location?.reference?.split('/')[1]
    };

    // Send to analytics service
    this.sendEvent(event);
  }

  static calculateDuration(period) {
    if (!period || !period.start || !period.end) {
      return null;
    }

    const start = new Date(period.start);
    const end = new Date(period.end);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
  }

  static sendEvent(event) {
    // Implementation for sending analytics events
    console.log('Encounter Analytics Event:', event);
  }
}
```text

## 📞 Support

For questions about encounter templates:

- **Email**: clinical-support@zarishsphere.com
- **Documentation**: [FHIR R5 Encounter](../fhir-r5/encounter.md)
- **API Reference**: [Encounter Resource](../api-reference/overview.md)

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
**Module**: Clinical Encounters
**Status**: Production Ready
````
