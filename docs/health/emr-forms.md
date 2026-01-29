# 📝 EMR Form Templates

## Overview

This section provides comprehensive EMR form templates for ZARISH SPHERE, following FHIR R5 standards and healthcare best practices.

## 🏥 Patient Registration Form

### Basic Patient Information

````json
{
  "resourceType": "Patient",
  "id": "patient-registration-form",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Patient",
      "http://zarishsphere.com/fhir/StructureDefinition/Patient-Registration"
    ]
  },
  "extension": [
    {
      "url": "http://zarishsphere.com/fhir/StructureDefinition/patient-registration-source",
      "valueString": "web-form"
    },
    {
      "url": "http://zarishsphere.com/fhir/StructureDefinition/patient-registration-date",
      "valueDateTime": "2026-01-27T10:30:00+06:00"
    }
  ],
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MR",
            "display": "Medical Record Number"
          }
        ]
      },
      "system": "http://hospital.zarishsphere.com/mrn",
      "value": "{{patient.mrn}}",
      "period": {
        "start": "{{registration.date}}"
      }
    },
    {
      "use": "secondary",
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "NN",
            "display": "National Unique Individual ID"
          }
        ]
      },
      "system": "http://nid.gov.bd",
      "value": "{{patient.nationalId}}"
    }
  ],
  "active": true,
  "name": [
    {
      "use": "official",
      "family": "{{patient.lastName}}",
      "given": ["{{patient.firstName}}", "{{patient.middleName}}"],
      "prefix": ["{{patient.prefix}}"],
      "suffix": ["{{patient.suffix}}"]
    },
    {
      "use": "usual",
      "family": "{{patient.lastName}}",
      "given": ["{{patient.firstName}}"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "{{patient.phone}}",
      "use": "mobile",
      "rank": 1
    },
    {
      "system": "email",
      "value": "{{patient.email}}",
      "use": "home"
    },
    {
      "system": "phone",
      "value": "{{patient.emergencyPhone}}",
      "use": "emergency",
      "rank": 2
    }
  ],
  "gender": "{{patient.gender}}",
  "birthDate": "{{patient.birthDate}}",
  "address": [
    {
      "use": "home",
      "type": "both",
      "text": "{{patient.address.full}}",
      "line": ["{{patient.address.line1}}", "{{patient.address.line2}}"],
      "city": "{{patient.address.city}}",
      "district": "{{patient.address.district}}",
      "state": "{{patient.address.division}}",
      "postalCode": "{{patient.address.postalCode}}",
      "country": "{{patient.address.country}}"
    }
  ],
  "maritalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
        "code": "{{patient.maritalStatus}}",
        "display": "{{patient.maritalStatusDisplay}}"
      }
    ]
  },
  "multipleBirthBoolean": {{patient.multipleBirth}},
  "communication": [
    {
      "language": {
        "coding": [
          {
            "system": "urn:ietf:bcp:47",
            "code": "{{patient.language}}",
            "display": "{{patient.languageDisplay}}"
          }
        ],
        "text": "{{patient.languageDisplay}}"
      },
      "preferred": true
    }
  ],
  "contact": [
    {
      "relationship": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
              "code": "{{emergencyContact.relationship}}",
              "display": "{{emergencyContact.relationshipDisplay}}"
            }
          ]
        }
      ],
      "name": {
        "family": "{{emergencyContact.lastName}}",
        "given": ["{{emergencyContact.firstName}}"]
      },
      "telecom": [
        {
          "system": "phone",
          "value": "{{emergencyContact.phone}}",
          "use": "mobile"
        }
      ]
    }
  ]
}
```javascript

### Form Validation Rules

```javascript
const patientRegistrationValidation = {
  // Required fields
  required: [
    'firstName',
    'lastName',
    'birthDate',
    'gender',
    'phone',
    'address.city',
    'address.country'
  ],

  // Field validation
  rules: {
    firstName: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    lastName: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    birthDate: {
      maxDate: new Date(),
      minAge: 0,
      maxAge: 120
    },
    phone: {
      pattern: /^[+]?[\d\s-()]+$/,
      minLength: 10,
      maxLength: 20
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 100
    },
    nationalId: {
      pattern: /^\d{10}|\d{13}|\d{17}$/,
      required: false
    }
  },

  // Custom validation
  custom: {
    validateAge: (birthDate) => {
      const age = calculateAge(birthDate);
      return age >= 0 && age <= 120;
    },
    validatePhone: (phone) => {
      return phone.replace(/\D/g, '').length >= 10;
    }
  }
};
```json

## 🩺 Clinical Encounter Form

### Encounter Information

```json
{
  "resourceType": "Encounter",
  "id": "encounter-form",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/Encounter",
      "http://zarishsphere.com/fhir/StructureDefinition/Clinical-Encounter"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://hospital.zarishsphere.com/encounter",
      "value": "{{encounter.id}}"
    }
  ],
  "status": "{{encounter.status}}",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "{{encounter.class}}",
    "display": "{{encounter.classDisplay}}"
  },
  "subject": {
    "reference": "Patient/{{encounter.patientId}}",
    "display": "{{encounter.patientName}}"
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
        "reference": "Practitioner/{{encounter.practitionerId}}",
        "display": "{{encounter.practitionerName}}"
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
          "code": "{{encounter.reasonCode}}",
          "display": "{{encounter.reasonDisplay}}"
        }
      ],
      "text": "{{encounter.reasonText}}"
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/{{encounter.diagnosisId}}",
        "display": "{{encounter.diagnosisDisplay}}"
      },
      "use": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "{{encounter.diagnosisRole}}",
            "display": "{{encounter.diagnosisRoleDisplay}}"
          }
        ]
      },
      "rank": {{encounter.diagnosisRank}}
    }
  ],
  "serviceProvider": {
    "reference": "Organization/{{encounter.organizationId}}",
    "display": "{{encounter.organizationName}}"
  }
}
```json

## 💊 Prescription Form

### Medication Prescription

```json
{
  "resourceType": "MedicationRequest",
  "id": "prescription-form",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/MedicationRequest",
      "http://zarishsphere.com/fhir/StructureDefinition/Prescription"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://hospital.zarishsphere.com/prescription",
      "value": "{{prescription.id}}"
    }
  ],
  "status": "{{prescription.status}}",
  "intent": "order",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
          "code": "{{prescription.category}}",
          "display": "{{prescription.categoryDisplay}}"
        }
      ]
    }
  ],
  "priority": "{{prescription.priority}}",
  "medication": {
    "concept": {
      "coding": [
        {
          "system": "http://www.whocc.no/atc",
          "code": "{{prescription.atcCode}}",
          "display": "{{prescription.medicationName}}"
        }
      ],
      "text": "{{prescription.medicationName}}"
    }
  },
  "subject": {
    "reference": "Patient/{{prescription.patientId}}",
    "display": "{{prescription.patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{prescription.encounterId}}",
    "display": "{{prescription.encounterDisplay}}"
  },
  "authoredOn": "{{prescription.date}}",
  "requester": {
    "reference": "Practitioner/{{prescription.practitionerId}}",
    "display": "{{prescription.practitionerName}}"
  },
  "dosageInstruction": [
    {
      "sequence": 1,
      "text": "{{prescription.doseText}}",
      "timing": {
        "code": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation",
              "code": "{{prescription.timingCode}}",
              "display": "{{prescription.timingDisplay}}"
            }
          ]
        },
        "repeat": {
          "boundsDuration": {
            "value": {{prescription.durationValue}},
            "unit": "{{prescription.durationUnit}}",
            "system": "http://unitsofmeasure.org",
            "code": "{{prescription.durationCode}}"
          },
          "frequency": {
            "repeat": {
              "boundsPeriod": {
                "start": "{{prescription.startDate}}",
                "end": "{{prescription.endDate}}"
              }
            }
          }
        }
      },
      "route": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration",
            "code": "{{prescription.routeCode}}",
            "display": "{{prescription.routeDisplay}}"
          }
        ]
      },
      "doseAndRate": [
        {
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/dose-rate-type",
                "code": "ordered",
                "display": "Ordered"
              }
            ]
          },
          "doseQuantity": {
            "value": {{prescription.doseValue}},
            "unit": "{{prescription.doseUnit}}",
            "system": "http://unitsofmeasure.org",
            "code": "{{prescription.doseCode}}"
          }
        }
      ]
    }
  ],
  "dispenseRequest": {
    "validityPeriod": {
      "start": "{{prescription.validFrom}}",
      "end": "{{prescription.validTo}}"
    },
    "quantity": {
      "value": {{prescription.quantity}},
      "unit": "{{prescription.quantityUnit}}",
      "system": "http://unitsofmeasure.org",
      "code": "{{prescription.quantityCode}}"
    },
    "expectedSupplyDuration": {
      "value": {{prescription.supplyDuration}},
      "unit": "{{prescription.supplyUnit}}",
      "system": "http://unitsofmeasure.org",
      "code": "{{prescription.supplyCode}}"
    }
  },
  "substitution": {
    "allowed": {{prescription.substitutionAllowed}},
    "reason": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-SubstanceAdminSubstitution",
          "code": "{{prescription.substitutionReason}}",
          "display": "{{prescription.substitutionDisplay}}"
        }
      ]
    }
  }
}
```json

## 🧪 Laboratory Order Form

### Lab Test Order

```json
{
  "resourceType": "ServiceRequest",
  "id": "lab-order-form",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/ServiceRequest",
      "http://zarishsphere.com/fhir/StructureDefinition/Laboratory-Order"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://hospital.zarishsphere.com/lab-order",
      "value": "{{labOrder.id}}"
    }
  ],
  "status": "{{labOrder.status}}",
  "intent": "order",
  "category": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "394914008",
          "display": "Radiology"
        },
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
        "system": "http://loinc.org",
        "code": "{{labOrder.loincCode}}",
        "display": "{{labOrder.testName}}"
      }
    ],
    "text": "{{labOrder.testName}}"
  },
  "subject": {
    "reference": "Patient/{{labOrder.patientId}}",
    "display": "{{labOrder.patientName}}"
  },
  "encounter": {
    "reference": "Encounter/{{labOrder.encounterId}}",
    "display": "{{labOrder.encounterDisplay}}"
  },
  "authoredOn": "{{labOrder.date}}",
  "requester": {
    "reference": "Practitioner/{{labOrder.practitionerId}}",
    "display": "{{labOrder.practitionerName}}"
  },
  "performer": [
    {
      "reference": "Organization/{{labOrder.labId}}",
      "display": "{{labOrder.labName}}"
    }
  ],
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "{{labOrder.reasonCode}}",
          "display": "{{labOrder.reasonDisplay}}"
        }
      ],
      "text": "{{labOrder.reasonText}}"
    }
  ],
  "specimen": [
    {
      "reference": "Specimen/{{labOrder.specimenId}}",
      "display": "{{labOrder.specimenType}}"
    }
  ],
  "note": [
    {
      "text": "{{labOrder.instructions}}"
    }
  ]
}
```text

## 📋 Form Implementation Guidelines

### Frontend Implementation

```typescript
interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: Option[];
  placeholder?: string;
  helpText?: string;
}

interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

interface Option {
  value: string;
  label: string;
  code?: string;
  system?: string;
}
```javascript

### Backend Validation

```javascript
class FormValidator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(data) {
    const errors = [];

    // Check required fields
    this.schema.required.forEach(field => {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    });

    // Check field rules
    Object.keys(this.schema.rules).forEach(field => {
      if (data[field]) {
        const rules = this.schema.rules[field];
        const value = data[field];

        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be no more than ${rules.maxLength} characters`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
    });

    // Check custom validation
    Object.keys(this.schema.custom).forEach(field => {
      if (data[field]) {
        const customRule = this.schema.custom[field];
        if (!customRule(data[field])) {
          errors.push(`${field} validation failed`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```typescript

## 🔧 Integration Examples

### React Form Component

```typescript
import React, { useState } from 'react';
import { FormValidator } from './FormValidator';

interface PatientFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState<string[]>([]);

  const validator = new FormValidator(patientRegistrationValidation);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validator.validate(formData);

    if (validation.isValid) {
      onSubmit(formData);
    } else {
      setErrors(validation.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields implementation */}
      {errors.map((error, index) => (
        <div key={index} className="error">{error}</div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
```javascript

## 📊 Form Analytics

### Usage Tracking

```javascript
class FormAnalytics {
  static trackFormSubmission(formName, data, success) {
    const event = {
      formName,
      timestamp: new Date().toISOString(),
      success,
      fieldCount: Object.keys(data).length,
      userAgent: navigator.userAgent
    };

    // Send to analytics service
    this.sendEvent('form_submission', event);
  }

  static trackFieldInteraction(formName, fieldName, action) {
    const event = {
      formName,
      fieldName,
      action,
      timestamp: new Date().toISOString()
    };

    this.sendEvent('field_interaction', event);
  }

  static sendEvent(eventType, data) {
    // Implementation for sending analytics events
    console.log(`Analytics Event: ${eventType}`, data);
  }
}
```text

---

## 📞 Support

For questions about EMR form templates:

- **Email**: <emr-support@zarishsphere.com>
- **Documentation**: [EMR Module Overview](../emr/overview.md)
- **API Reference**: [Patient Resource](../../fhir-r5/patient.md)

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
**Module**: EMR Forms
**Status**: Production Ready
````
