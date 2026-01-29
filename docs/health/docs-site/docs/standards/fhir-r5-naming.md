# FHIR R5 Naming Conventions & Standards

## 🎯 Overview

ZARISH HIS adopts **FHIR R5** (Fast Healthcare Interoperability Resources) as the primary standard for healthcare data exchange. This document defines the naming conventions, data structures, and implementation guidelines for FHIR resources within the ZARISH ecosystem.

## 📋 Naming Conventions

### Resource Naming Pattern
All FHIR resources in ZARISH HIS follow this pattern:
```
zarish-[resource-type]-[context]-[identifier]
```

**Examples:**
- `zarish-patient-primary-123456`
- `zarish-encounter-outpatient-789012`
- `zarish-observation-vitals-345678`
- `zarish-medication-request-prescription-901234`

### Element Naming Standards

#### 1. **Canonical Element Names**
Use standard FHIR element names with ZARISH extensions:
```json
{
  "resourceType": "Patient",
  "id": "zarish-patient-primary-123456",
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [
          {
            "system": "https://terminology.zs-his.com/identifier-types",
            "code": "MRN",
            "display": "Medical Record Number"
          }
        ]
      },
      "value": "MRN001234567",
      "assigner": {
        "display": "ZARISH Hospital System"
      }
    }
  ],
  "extension": [
    {
      "url": "https://fhir.zs-his.com/StructureDefinition/patient-preferred-language",
      "valueCode": "en-US"
    }
  ]
}
```

#### 2. **Extension Naming**
ZARISH-specific extensions follow this pattern:
```
https://fhir.zs-his.com/StructureDefinition/[domain]-[purpose]
```

**Examples:**
- `https://fhir.zs-his.com/StructureDefinition/patient-preferred-language`
- `https://fhir.zs-his.com/StructureDefinition/encounter-department-code`
- `https://fhir.zs-his.com/StructureDefinition/observation-device-source`

## 🏥 Core Resource Standards

### Patient Resource
```json
{
  "resourceType": "Patient",
  "id": "zarish-patient-primary-[mrn]",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/StructureDefinition/zarish-patient"
    ]
  },
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [{
          "system": "https://terminology.zs-his.com/identifier-types",
          "code": "MRN",
          "display": "Medical Record Number"
        }]
      },
      "value": "[mrn]",
      "assigner": {
        "display": "ZARISH Hospital System"
      }
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "[family-name]",
      "given": ["[given-name]"],
      "prefix": ["[prefix]"]
    }
  ],
  "gender": "[male|female|other|unknown]",
  "birthDate": "[yyyy-mm-dd]",
  "extension": [
    {
      "url": "https://fhir.zs-his.com/StructureDefinition/patient-preferred-language",
      "valueCode": "[language-code]"
    }
  ]
}
```

### Encounter Resource
```json
{
  "resourceType": "Encounter",
  "id": "zarish-encounter-[type]-[identifier]",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/StructureDefinition/zarish-encounter"
    ]
  },
  "identifier": [{
    "use": "official",
    "value": "[encounter-number]"
  }],
  "status": "[planned|arrived|in-progress|onleave|finished|cancelled]",
  "class": {
    "system": "https://terminology.zs-his.com/encounter-class",
    "code": "[encounter-class-code]"
  },
  "subject": {
    "reference": "Patient/zarish-patient-primary-[mrn]"
  },
  "period": {
    "start": "[start-datetime]",
    "end": "[end-datetime]"
  },
  "serviceProvider": {
    "reference": "Organization/zarish-organization-[facility-id]"
  }
}
```

### Observation Resource
```json
{
  "resourceType": "Observation",
  "id": "zarish-observation-[category]-[identifier]",
  "meta": {
    "profile": [
      "https://fhir.zs-his.com/StructureDefinition/zarish-observation"
    ]
  },
  "status": "[registered|preliminary|final|amended|corrected|cancelled]",
  "category": [
    {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
        "code": "[vital-signs|laboratory|imaging|survey|exam]"
      }]
    }
  ],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "[loinc-code]",
      "display": "[display-name]"
    }]
  },
  "subject": {
    "reference": "Patient/zarish-patient-primary-[mrn]"
  },
  "encounter": {
    "reference": "Encounter/zarish-encounter-[type]-[identifier]"
  },
  "effectiveDateTime": "[datetime]",
  "valueQuantity": {
    "value": [numeric-value],
    "unit": "[unit]",
    "system": "http://unitsofmeasure.org",
    "code": "[ucum-code]"
  }
}
```

## 🏷️ Code Systems and Value Sets

### ZARISH-Specific Code Systems

#### 1. **Identifier Types**
```
System: https://terminology.zs-his.com/identifier-types

Codes:
- MRN: Medical Record Number
- FIN: Financial Account Number
- SSN: Social Security Number
- PASSPORT: Passport Number
- DRIVING_LICENSE: Driver's License Number
```

#### 2. **Encounter Classes**
```
System: https://terminology.zs-his.com/encounter-class

Codes:
- IMP: Inpatient
- AMB: Ambulatory
- OBS: Observation
- EMER: Emergency
- VR: Virtual
- HH: Home Health
```

#### 3. **Department Codes**
```
System: https://terminology.zs-his.com/departments

Codes:
- ER: Emergency Room
- ICU: Intensive Care Unit
- CCU: Cardiac Care Unit
- NICU: Neonatal Intensive Care Unit
- PICU: Pediatric Intensive Care Unit
- OR: Operating Room
- LDR: Labor and Delivery Room
- PHARM: Pharmacy
- LAB: Laboratory
- RAD: Radiology
```

### Value Sets

#### 1. **ZARISH Vital Signs**
```
System: https://fhir.zs-his.com/ValueSet/zarish-vital-signs
Includes LOINC codes for:
- 8302-2: Height
- 29163-1: Weight
- 8462-4: Diastolic Blood Pressure
- 8480-6: Systolic Blood Pressure
- 8867-4: Heart Rate
- 9279-1: Respiratory Rate
- 8310-5: Body Temperature
- 8328-7: Body Mass Index
```

#### 2. **ZARISH Laboratory Tests**
```
System: https://fhir.zs-his.com/ValueSet/zarish-lab-tests
Includes LOINC codes for common laboratory tests:
- 2345-7: Glucose
- 30525-0: Hemoglobin A1c
- 5894-1: Complete Blood Count
- 6690-2: Lipid Panel
- 1989-8: Comprehensive Metabolic Panel
```

## 🔧 Implementation Guidelines

### 1. **Resource Creation**
```javascript
// Example: Creating a new patient
const createPatient = (patientData) => {
  const zarishPatient = {
    resourceType: 'Patient',
    id: `zarish-patient-primary-${patientData.mrn}`,
    meta: {
      profile: ['https://fhir.zs-his.com/StructureDefinition/zarish-patient']
    },
    identifier: [{
      use: 'official',
      type: {
        coding: [{
          system: 'https://terminology.zs-his.com/identifier-types',
          code: 'MRN',
          display: 'Medical Record Number'
        }]
      },
      value: patientData.mrn
    }],
    name: [{
      use: 'official',
      family: patientData.lastName,
      given: [patientData.firstName]
    }],
    gender: patientData.gender,
    birthDate: patientData.birthDate
  };
  
  return zarishPatient;
};
```

### 2. **Resource Validation**
```javascript
// Validate ZARISH FHIR resources
const validateZarishResource = (resource) => {
  const validationRules = {
    Patient: validatePatient,
    Encounter: validateEncounter,
    Observation: validateObservation
  };
  
  const validator = validationRules[resource.resourceType];
  if (validator) {
    return validator(resource);
  }
  
  return { valid: false, errors: ['Unknown resource type'] };
};
```

### 3. **Extension Handling**
```javascript
// Handle ZARISH extensions
const processExtensions = (resource) => {
  const zarishExtensions = resource.extension?.filter(
    ext => ext.url.startsWith('https://fhir.zs-his.com/')
  ) || [];
  
  return zarishExtensions.reduce((acc, extension) => {
    const extensionName = extension.url.replace(
      'https://fhir.zs-his.com/StructureDefinition/',
      ''
    );
    acc[extensionName] = extension.value;
    return acc;
  }, {});
};
```

## 📊 Data Quality Standards

### 1. **Required Fields**
- **Patient**: MRN, name, gender, birthDate
- **Encounter**: patient reference, period, class
- **Observation**: code, subject, effectiveDateTime, status

### 2. **Data Format Standards**
- **Dates**: ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)
- **Codes**: Use standard code systems (LOINC, SNOMED CT, ICD-11)
- **Identifiers**: Follow ZARISH identifier patterns
- **References**: Use relative references within ZARISH system

### 3. **Validation Rules**
```json
{
  "validationRules": {
    "Patient": {
      "required": ["identifier", "name", "gender", "birthDate"],
      "identifierPattern": "MRN[0-9]{9}",
      "genderEnum": ["male", "female", "other", "unknown"]
    },
    "Encounter": {
      "required": ["subject", "period", "class"],
      "statusEnum": ["planned", "arrived", "in-progress", "onleave", "finished", "cancelled"]
    },
    "Observation": {
      "required": ["code", "subject", "effectiveDateTime", "status"],
      "valueRequired": true
    }
  }
}
```

## 🔄 Versioning and Migration

### Version Strategy
- **FHIR Version**: R5 (current)
- **ZARISH Profile Version**: Semantic versioning (major.minor.patch)
- **Backward Compatibility**: Maintain compatibility for at least 2 major versions

### Migration Process
1. **Assessment**: Identify breaking changes
2. **Planning**: Create migration roadmap
3. **Implementation**: Update resources and validation
4. **Testing**: Comprehensive validation suite
5. **Deployment**: Gradual rollout with monitoring

## 📚 References and Resources

### Official FHIR Resources
- [FHIR R5 Specification](https://hl7.org/fhir/R5/)
- [FHIR Terminology](http://hl7.org/fhir/terminologies.html)
- [FHIR Implementation Guides](https://hl7.org/fhir/implementation.html)

### ZARISH Resources
- [ZARISH FHIR Profiles](../05-metadata-forms/form-schemas/)
- [ZARISH Code Systems](../05-metadata-forms/value-sets/)
- [ZARISH Value Sets](../05-metadata-forms/value-sets/)

### External Standards
- [LOINC](https://loinc.org/)
- [SNOMED CT](https://www.snomed.org/)
- [ICD-11](https://icd.who.int/)
- [UCUM](https://ucum.org/)

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Data Standards Team: ZARISH HIS*
