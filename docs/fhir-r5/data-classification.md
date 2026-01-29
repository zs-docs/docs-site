---
title: 'Data Classification'
sidebar_label: 'Data Classification'
description: 'Comprehensive guide to FHIR R5 data classification and sensitivity handling in ZARISH SPHERE with country-specific requirements'
keywords:
  [
    data classification,
    fhir r5,
    privacy,
    security,
    healthcare,
    zarish sphere,
    bangladesh,
    thailand,
    myanmar,
  ]
---

## FHIR R5 Data Classification

## Overview

ZARISH SPHERE implements comprehensive data classification mechanisms for FHIR R5 resources to ensure proper handling of sensitive healthcare information. This guide covers classification levels, access controls, and compliance requirements for healthcare data protection across Bangladesh, Thailand, and Myanmar.

## Classification Levels

### Data Sensitivity Tiers

| Level                      | Description                      | Data Types                                | Access Requirements   |
| -------------------------- | -------------------------------- | ----------------------------------------- | --------------------- |
| **Level 1 - Public**       | Non-sensitive public information | Public health statistics, anonymized data | Open access           |
| **Level 2 - Internal**     | Internal operational data        | Operational metrics, system logs          | Staff access only     |
| **Level 3 - Confidential** | Patient-identifiable information | Clinical records, personal data           | Role-based access     |
| **Level 4 - Restricted**   | Highly sensitive data            | Mental health, HIV status, genetics       | Special authorization |

## Country-Specific Classification

### Bangladesh Data Classification

### Legal Framework

- **Digital Security Act 2018**: Digital data protection requirements
- **Health Protection Act 2018**: Health information privacy
- **Right to Information Act 2009**: Public access to information
- **Data Protection Bill 2023**: Proposed comprehensive data protection

### Classification Requirements

````json
{
  "country": "Bangladesh",
  "classification": {
    "level_1": {
      "description": "Public Health Information",
      "examples": [
        "Disease surveillance statistics",
        "Public health campaigns",
        "Healthcare facility directory",
        "Anonymized research data"
      ],
      "retention": "7 years",
      "access": "Public"
    },
    "level_2": {
      "description": "Internal Operational Data",
      "examples": [
        "Hospital operational metrics",
        "Staff schedules",
        "Inventory management",
        "System performance data"
      ],
      "retention": "3 years",
      "access": "Healthcare Staff"
    },
    "level_3": {
      "description": "Patient Health Information",
      "examples": [
        "Medical records",
        "Laboratory results",
        "Prescription records",
        "Immunization records"
      ],
      "retention": "10 years",
      "access": "Authorized Healthcare Personnel"
    },
    "level_4": {
      "description": "Highly Sensitive Health Data",
      "examples": [
        "Mental health records",
        "HIV/AIDS status",
        "Genetic information",
        "Reproductive health"
      ],
      "retention": "15 years",
      "access": "Special Authorization Required"
    }
  }
}
```text

### Bangladesh-Specific Data Elements

```json
{
  "data_elements": {
    "national_id": {
      "classification": "Level 3",
      "description": "Bangladesh National ID",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "10 years"
    },
    "health_card_number": {
      "classification": "Level 3",
      "description": "DGHS Health Card Number",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "10 years"
    },
    "bengali_personal_data": {
      "classification": "Level 3",
      "description": "Personal data in Bengali script",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "10 years"
    }
  }
}
```text

### Thailand Data Classification

### Legal Framework

- **Personal Data Protection Act (PDPA) 2019**: Comprehensive data protection
- **Health Information Act 2007**: Health data privacy
- **Medical Council Regulations**: Professional confidentiality
- **Public Health Act 1992**: Public health data management

### Classification Requirements

```json
{
  "country": "Thailand",
  "classification": {
    "level_1": {
      "description": "Public Health Information",
      "examples": [
        "National health statistics",
        "Public health campaigns",
        "Hospital directory",
        "Anonymized research data"
      ],
      "retention": "5 years",
      "access": "Public"
    },
    "level_2": {
      "description": "Internal Operational Data",
      "examples": [
        "Hospital management data",
        "Staff information",
        "Financial records",
        "System logs"
      ],
      "retention": "3 years",
      "access": "Hospital Staff"
    },
    "level_3": {
      "description": "Patient Health Information",
      "examples": ["Medical records", "Laboratory results", "Prescription data", "UCS claims data"],
      "retention": "10 years",
      "access": "Authorized Healthcare Personnel"
    },
    "level_4": {
      "description": "Highly Sensitive Health Data",
      "examples": [
        "Mental health records",
        "HIV/AIDS status",
        "Genetic testing",
        "Substance abuse treatment"
      ],
      "retention": "20 years",
      "access": "Special Authorization Required"
    }
  }
}
```text

### Thailand-Specific Data Elements

```json
{
  "data_elements": {
    "thai_national_id": {
      "classification": "Level 3",
      "description": "Thai National ID (13 digits)",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "10 years"
    },
    "ucs_id": {
      "classification": "Level 3",
      "description": "Universal Coverage Scheme ID",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "10 years"
    },
    "thai_personal_data": {
      "classification": "Level 3",
      "description": "Personal data in Thai script",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "10 years"
    }
  }
}
```text

### Myanmar Data Classification

### Legal Framework

- **Myanmar Data Protection Bill**: Proposed comprehensive data protection
- **Public Health Law 2015**: Health data management
- **Medical Council Law**: Professional confidentiality
- **Electronic Transactions Law 2004**: Digital data protection

### Classification Requirements

```json
{
  "country": "Myanmar",
  "classification": {
    "level_1": {
      "description": "Public Health Information",
      "examples": [
        "National health statistics",
        "Disease surveillance data",
        "Healthcare facility information",
        "Public health campaigns"
      ],
      "retention": "5 years",
      "access": "Public"
    },
    "level_2": {
      "description": "Internal Operational Data",
      "examples": ["Hospital operations", "Staff records", "Inventory data", "System performance"],
      "retention": "3 years",
      "access": "Healthcare Staff"
    },
    "level_3": {
      "description": "Patient Health Information",
      "examples": [
        "Medical records",
        "Laboratory results",
        "Prescription records",
        "SSB claims data"
      ],
      "retention": "8 years",
      "access": "Authorized Healthcare Personnel"
    },
    "level_4": {
      "description": "Highly Sensitive Health Data",
      "examples": [
        "Mental health records",
        "HIV/AIDS status",
        "Genetic information",
        "Traditional medicine records"
      ],
      "retention": "15 years",
      "access": "Special Authorization Required"
    }
  }
}
```text

### Myanmar-Specific Data Elements

```json
{
  "data_elements": {
    "myanmar_nrc": {
      "classification": "Level 3",
      "description": "Myanmar National Registration Card",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "8 years"
    },
    "ssb_id": {
      "classification": "Level 3",
      "description": "Social Security Board ID",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "8 years"
    },
    "myanmar_personal_data": {
      "classification": "Level 3",
      "description": "Personal data in Myanmar script",
      "encryption": "AES-256",
      "access_log": "Required",
      "retention": "8 years"
    }
  }
}
```json

## Implementation Guidelines

### Classification Tags in FHIR Resources

```json
{
  "resourceType": "Patient",
  "meta": {
    "security": [
      {
        "system": "http://terminology.zarishsphere.com/security-classification",
        "code": "LEVEL_3",
        "display": "Confidential"
      },
      {
        "system": "http://terminology.zarishsphere.com/country-classification",
        "code": "BD",
        "display": "Bangladesh"
      }
    ]
  },
  "extension": [
    {
      "url": "http://hl7.org/fhir/R5/StructureDefinition/iso21090-preferred",
      "valueString": "Patient data classified according to Bangladesh regulations"
    }
  ]
}
```javascript

### Access Control Implementation

```javascript
// Country-specific access control
function checkDataAccess(user, resource, country) {
  const classification = resource.meta?.security?.find(
    (tag) => tag.system === 'http://terminology.zarishsphere.com/security-classification'
  );

  const accessRules = {
    BD: {
      LEVEL_1: ['public', 'staff', 'clinician', 'admin'],
      LEVEL_2: ['staff', 'clinician', 'admin'],
      LEVEL_3: ['clinician', 'admin'],
      LEVEL_4: ['admin', 'special_authorization'],
    },
    TH: {
      LEVEL_1: ['public', 'staff', 'clinician', 'admin'],
      LEVEL_2: ['staff', 'clinician', 'admin'],
      LEVEL_3: ['clinician', 'admin'],
      LEVEL_4: ['admin', 'special_authorization'],
    },
    MM: {
      LEVEL_1: ['public', 'staff', 'clinician', 'admin'],
      LEVEL_2: ['staff', 'clinician', 'admin'],
      LEVEL_3: ['clinician', 'admin'],
      LEVEL_4: ['admin', 'special_authorization'],
    },
  };

  const allowedRoles = accessRules[country]?.[classification?.code] || [];
  return allowedRoles.includes(user.role);
}
```javascript

### Data Retention Policies

```javascript
// Country-specific data retention
function getRetentionPolicy(country, classification) {
  const policies = {
    BD: {
      LEVEL_1: 7 * 365, // 7 years
      LEVEL_2: 3 * 365, // 3 years
      LEVEL_3: 10 * 365, // 10 years
      LEVEL_4: 15 * 365, // 15 years
    },
    TH: {
      LEVEL_1: 5 * 365, // 5 years
      LEVEL_2: 3 * 365, // 3 years
      LEVEL_3: 10 * 365, // 10 years
      LEVEL_4: 20 * 365, // 20 years
    },
    MM: {
      LEVEL_1: 5 * 365, // 5 years
      LEVEL_2: 3 * 365, // 3 years
      LEVEL_3: 8 * 365, // 8 years
      LEVEL_4: 15 * 365, // 15 years
    },
  };

  return policies[country]?.[classification] || 5 * 365; // Default 5 years
}
```javascript

## Compliance Requirements

### Bangladesh Compliance

- **Digital Security Act**: Mandatory breach notification within 72 hours
- **Health Protection Act**: Patient consent required for data sharing
- **Data Localization**: Health data must be stored within Bangladesh
- **Audit Requirements**: Complete audit trail for all data access

### Thailand Compliance

- **PDPA**: Explicit consent required for data processing
- **Data Subject Rights**: Right to access, correct, and delete data
- **Cross-Border Transfer**: Requires explicit consent or adequate protection
- **Data Protection Officer**: Mandatory for organizations processing health data

### Myanmar Compliance

- **Data Protection Bill**: Anticipated comprehensive data protection
- **Health Information Privacy**: Professional confidentiality obligations
- **Traditional Medicine**: Special protections for traditional medicine data
- **Data Minimization**: Only collect necessary health information

## Monitoring and Auditing

### Classification Monitoring

```javascript
// Monitor data classification compliance
function monitorDataClassification() {
  return {
    classificationAudit: {
      totalResources: 0,
      byClassification: {
        LEVEL_1: 0,
        LEVEL_2: 0,
        LEVEL_3: 0,
        LEVEL_4: 0,
      },
      byCountry: {
        BD: 0,
        TH: 0,
        MM: 0,
      },
      complianceIssues: [],
      lastAudit: new Date().toISOString(),
    },
  };
}
```javascript

### Access Logging

```javascript
// Log all data access attempts
function logDataAccess(user, resource, action, country) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    user: user.id,
    role: user.role,
    resource: resource.resourceType,
    resourceId: resource.id,
    action: action,
    classification: resource.meta?.security?.find(
      (tag) => tag.system === 'http://terminology.zarishsphere.com/security-classification'
    )?.code,
    country: country,
    ipAddress: user.ipAddress,
    userAgent: user.userAgent,
    success: true,
  };

  // Store in audit log
  storeAuditLog(logEntry);
}
```text

## Best Practices

### Data Classification Best Practices

1. **Default to Restricted**: Classify data at the highest appropriate level
2. **Regular Review**: Review classifications annually or when regulations change
3. **User Training**: Train staff on classification requirements
4. **Automated Classification**: Use AI/ML for automated classification where possible
5. **Clear Documentation**: Maintain clear classification guidelines

### Country-Specific Considerations

1. **Language Support**: Ensure classification works with local languages
2. **Cultural Sensitivity**: Consider cultural factors in data classification
3. **Regulatory Changes**: Stay updated on changing regulations
4. **Cross-Border Data**: Handle cross-border data transfers carefully
5. **Local Standards**: Follow local healthcare data standards

## Related Links

- [Patient Resource](./patient.md)
- [Security Overview](../platform/overview.md)
- [Regulatory Compliance](./regulatory-compliance.md)
- [Country Configurations](./country-configs/)
- [Privacy Controls](../platform/overview.md)

---

**Last Updated**: 2026-01-26
**Version**: 2.0.0
**Section**: Data Classification
**Standard**: FHIR R5
| **Level 2 - Internal** | Internal operational data | System metrics, aggregated data | Internal access |
| **Level 3 - Confidential** | Patient-identifiable information | Patient demographics, clinical data | Role-based access |
| **Level 4 - Restricted** | Highly sensitive data | Mental health, genetic information | Limited access |
| **Level 5 - Critical** | Mission-critical data | Emergency response, outbreak data | Executive access |

### Resource Classification Matrix

| Resource         | Default Level | Exceptions                           | Special Considerations          |
| ---------------- | ------------- | ------------------------------------ | ------------------------------- |
| **Patient**      | Level 3       | Level 4 for mental health            | Enhanced protection for minors  |
| **Encounter**    | Level 3       | Level 4 for emergency encounters     | Time-based access restrictions  |
| **Condition**    | Level 3       | Level 4 for mental health conditions | Diagnosis-specific restrictions |
| **Observation**  | Level 3       | Level 4 for genetic data             | Lab result sensitivity          |
| **Medication**   | Level 2       | Level 3 for controlled substances    | Prescription monitoring         |
| **Procedure**    | Level 3       | Level 4 for sensitive procedures     | Surgical privacy requirements   |
| **Practitioner** | Level 2       | Level 3 for specialists              | Professional confidentiality    |
| **Organization** | Level 2       | Level 3 for healthcare facilities    | Facility access control         |

## Classification Extensions

### Data Sensitivity Extension

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/data-sensitivity",
      "extension": [
        {
          "url": "sensitivityLevel",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/sensitivity-level",
                "code": "confidential",
                "display": "Confidential"
              }
            ]
          }
        },
        {
          "url": "classificationReason",
          "valueString": "Contains patient demographic information"
        },
        {
          "url": "retentionPeriod",
          "valueDuration": {
            "value": 10,
            "unit": "years",
            "system": "http://unitsofmeasure.org",
            "code": "a"
          }
        },
        {
          "url": "accessRestrictions",
          "valueCodeableConcept": [
            {
              "system": "https://zarishsphere.com/fhir/CodeSystem/access-restriction",
              "code": "healthcare-provider",
              "display": "Healthcare Provider Only"
            }
          ]
        }
      ]
    }
  ]
}
```text

### Humanitarian Context Extension

```json
{
  "extension": [
    {
      "url": "https://zarishsphere.com/fhir/StructureDefinition/humanitarian-context",
      "extension": [
        {
          "url": "displacementStatus",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "https://zarishsphere.com/fhir/CodeSystem/displacement-status",
                "code": "refugee",
                "display": "Refugee"
              }
            ]
          }
        },
        {
          "url": "vulnerablePopulation",
          "valueBoolean": true
        },
        {
          "url": "emergencyContext",
          "valueBoolean": true
        },
        {
          "url": "enhancedProtection",
          "valueBoolean": true
        }
      ]
    }
  ]
}
```text

## Access Control Implementation

### Role-Based Access Control (RBAC)

### Role Definitions

```json
{
  "roles": [
    {
      "name": "clinical-practitioner",
      "description": "Healthcare providers with direct patient access",
      "permissions": [
        "patient.read",
        "patient.write",
        "encounter.read",
        "encounter.write",
        "observation.read",
        "observation.write"
      ],
      "dataAccess": ["level-3", "level-4"]
    },
    {
      "name": "public-health-official",
      "description": "Public health officials with aggregated data access",
      "permissions": [
        "patient.read.anonymized",
        "condition.read.aggregated",
        "observation.read.anonymized"
      ],
      "dataAccess": ["level-1", "level-2"]
    },
    {
      "name": "emergency-response",
      "description": "Emergency response team with critical access",
      "permissions": [
        "patient.read",
        "patient.write",
        "encounter.read",
        "encounter.write",
        "condition.read",
        "condition.write",
        "observation.read",
        "observation.write",
        "procedure.read",
        "procedure.write"
      ],
      "dataAccess": ["level-3", "level-4", "level-5"]
    }
  ]
}
```text

### Attribute-Based Access Control (ABAC)

### Access Rules

```json
{
  "accessRules": [
    {
      "name": "patient-data-access",
      "conditions": [
        {
          "attribute": "user.role",
          "operator": "equals",
          "value": "clinical-practitioner"
        },
        {
          "attribute": "patient.location",
          "operator": "equals",
          "value": "user.assignedFacility"
        }
      ],
      "action": "allow",
      "effect": "allow"
    },
    {
      "name": "mental-health-restriction",
      "conditions": [
        {
          "attribute": "resource.sensitivityLevel",
          "operator": "equals",
          "value": "level-4"
        },
        {
          "attribute": "user.hasMentalHealthTraining",
          "operator": "equals",
          "value": true
        }
      ],
      "action": "allow",
      "effect": "allow"
    },
    {
      "name": "emergency-override",
      "conditions": [
        {
          "attribute": "context.emergency",
          "operator": "equals",
          "value": true
        },
        {
          "attribute": "user.emergencyTraining",
          "operator": "equals",
          "value": true
        }
      ],
      "action": "allow",
      "effect": "allow"
    }
  ]
}
```json

## Data Masking and Anonymization

### Masking Strategies

### Field-Level Masking

```json
{
  "resourceType": "Patient",
  "name": [
    {
      "use": "official",
      "family": "Smith",
      "given": ["John"],
      "_masked": {
        "extension": [
          {
            "url": "https://zarishsphere.com/fhir/StructureDefinition/masking",
            "extension": [
              {
                "url": "maskingType",
                "valueCodeableConcept": {
                  "coding": [
                    {
                      "system": "https://zarishsphere.com/fhir/CodeSystem/masking-type",
                      "code": "partial",
                      "display": "Partial Masking"
                    }
                  ]
                }
              },
              {
                "url": "maskedFields",
                "valueString": "given"
              }
            ]
          }
        ]
      }
    }
  ]
}
```json

### Anonymization Rules

```json
{
  "anonymizationRules": [
    {
      "resourceType": "Patient",
      "fields": [
        {
          "path": "identifier",
          "action": "remove"
        },
        {
          "path": "telecom",
          "action": "hash"
        },
        {
          "path": "address",
          "action": "generalize"
        },
        {
          "path": "birthDate",
          "action": "ageRange"
        }
      ]
    },
    {
      "resourceType": "Observation",
      "fields": [
        {
          "path": "subject.reference",
          "action": "replace",
          "replacement": "Patient/ANONYMIZED"
        },
        {
          "path": "valueQuantity.value",
          "action": "round",
          "precision": 1
        }
      ]
    }
  ]
}
```text

## Compliance Requirements

### HIPAA Compliance

### Protected Health Information (PHI)

```json
{
  "hipaaCompliance": {
    "phiFields": [
      "Patient.name",
      "Patient.birthDate",
      "Patient.address",
      "Patient.telecom",
      "Patient.identifier"
    ],
    "minimumNecessary": {
      "treatment": true,
      "payment": true,
      "healthcareOperations": true
    },
    "auditRequirements": {
      "accessLogging": true,
      "authentication": true,
      "authorization": true,
      "integrityControls": true
    }
  }
}
```text

### Business Associate Agreements

```json
{
  "businessAssociateAgreements": [
    {
      "baaType": "covered-entity",
      "partner": "Cloud Service Provider",
      "dataTypes": ["electronic-phi", "electronic-phi-transmission"],
      "safeguards": [
        "encryption-at-rest",
        "encryption-in-transit",
        "access-controls",
        "audit-logging"
      ]
    }
  ]
}
```text

### GDPR Compliance

### Data Subject Rights

```json
{
  "gdprCompliance": {
    "dataSubjectRights": [
      {
        "right": "access",
        "description": "Right to access personal data",
        "implementation": "patient-portal"
      },
      {
        "right": "rectification",
        "description": "Right to correct inaccurate data",
        "implementation": "data-correction-workflow"
      },
      {
        "right": "erasure",
        "description": "Right to be forgotten",
        "implementation": "data-deletion-process"
      },
      {
        "right": "portability",
        "description": "Right to data portability",
        "implementation": "data-export-api"
      }
    ]
  }
}
```javascript

## Implementation Examples

### Classification Service

```javascript
class DataClassificationService {
  constructor() {
    this.classificationRules = this.loadClassificationRules();
    this.accessControl = new AccessControlService();
  }

  classifyResource(resource, context) {
    const classification = {
      resourceType: resource.resourceType,
      sensitivityLevel: this.determineSensitivityLevel(resource),
      humanitarianContext: this.assessHumanitarianContext(resource),
      accessRestrictions: this.determineAccessRestrictions(resource, context),
      retentionPeriod: this.calculateRetentionPeriod(resource),
      auditRequired: this.requiresAudit(resource),
    };

    return classification;
  }

  determineSensitivityLevel(resource) {
    // Base sensitivity by resource type
    const baseLevel = this.getBaseSensitivityLevel(resource.resourceType);

    // Check for sensitive content
    if (this.containsSensitiveContent(resource)) {
      return Math.min(baseLevel + 1, 5);
    }

    // Check humanitarian context
    if (this.isHumanitarianContext(resource)) {
      return Math.min(baseLevel + 1, 5);
    }

    return baseLevel;
  }

  containsSensitiveContent(resource) {
    const sensitiveKeywords = [
      'mental health',
      'psychiatric',
      'genetic',
      'hiv',
      'aids',
      'substance abuse',
      'domestic violence',
      'child abuse',
    ];

    const resourceText = JSON.stringify(resource).toLowerCase();
    return sensitiveKeywords.some((keyword) => resourceText.includes(keyword));
  }

  assessHumanitarianContext(resource) {
    const humanitarianExtensions = resource.extension?.filter((ext) =>
      ext.url.includes('humanitarian-context')
    );

    return humanitarianExtensions?.length > 0;
  }

  requiresAudit(resource) {
    const classification = this.classifyResource(resource);
    return classification.sensitivityLevel >= 3;
  }
}
```javascript

### Access Control Service

```javascript
class AccessControlService {
  constructor() {
    this.userRoles = new Map();
    this.accessRules = this.loadAccessRules();
  }

  async checkAccess(user, resource, action) {
    const classification = await this.classifyResource(resource);
    const userRole = await this.getUserRole(user);

    // Check role-based access
    if (!this.hasRolePermission(userRole, action, classification)) {
      return {
        allowed: false,
        reason: 'Insufficient role permissions',
      };
    }

    // Check attribute-based access
    const abacResult = this.evaluateABACRules(user, resource, action, classification);
    if (!abacResult.allowed) {
      return abacResult;
    }

    // Check time-based restrictions
    const timeRestriction = this.checkTimeRestrictions(user, resource);
    if (!timeRestriction.allowed) {
      return timeRestriction;
    }

    return { allowed: true };
  }

  hasRolePermission(role, action, classification) {
    const rolePermissions = this.rolePermissions.get(role) || [];
    const requiredPermissions = this.getRequiredPermissions(action, classification);

    return requiredPermissions.every((perm) => rolePermissions.includes(perm));
  }

  evaluateABACRules(user, resource, action, classification) {
    for (const rule of this.accessRules) {
      if (this.evaluateRule(rule, user, resource, action, classification)) {
        return { allowed: true };
      }
    }

    return { allowed: false, reason: 'No access rule matched' };
  }

  evaluateRule(rule, user, resource, action, classification) {
    return rule.conditions.every((condition) => {
      return this.evaluateCondition(condition, user, resource, action, classification);
    });
  }

  evaluateCondition(condition, user, resource, action, classification) {
    switch (condition.attribute) {
      case 'user.role':
        return this.compareValues(user.role, condition.operator, condition.value);
      case 'resource.sensitivityLevel':
        return this.compareValues(
          classification.sensitivityLevel,
          condition.operator,
          condition.value
        );
      case 'context.emergency':
        return this.compareValues(user.context?.emergency, condition.operator, condition.value);
      default:
        return false;
    }
  }
}
```javascript

### Data Masking Service

```javascript
class DataMaskingService {
  constructor() {
    this.maskingRules = this.loadMaskingRules();
  }

  maskResource(resource, userRole, context) {
    const classification = this.classifyResource(resource);
    const maskingLevel = this.determineMaskingLevel(userRole, classification);

    if (maskingLevel === 'none') {
      return resource;
    }

    return this.applyMasking(resource, maskingLevel);
  }

  applyMasking(resource, maskingLevel) {
    const maskedResource = JSON.parse(JSON.stringify(resource));

    for (const rule of this.maskingRules) {
      if (rule.level <= maskingLevel) {
        this.applyMaskingRule(maskedResource, rule);
      }
    }

    return maskedResource;
  }

  applyMaskingRule(resource, rule) {
    const path = rule.path.split('.');
    let current = resource;

    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        return;
      }
      current = current[path[i]];
    }

    const field = path[path.length - 1];
    if (current[field]) {
      current[field] = this.applyFieldMasking(current[field], rule.action);
    }
  }

  applyFieldMasking(value, action) {
    switch (action) {
      case 'remove':
        return undefined;
      case 'hash':
        return this.hashValue(value);
      case 'generalize':
        return this.generalizeValue(value);
      case 'ageRange':
        return this.calculateAgeRange(value);
      case 'round':
        return this.roundValue(value, rule.precision);
      default:
        return value;
    }
  }

  hashValue(value) {
    return `HASH_${this.createHash(value)}`;
  }

  generalizeValue(value) {
    if (typeof value === 'string') {
      return value.substring(0, 3) + '***';
    }
    return value;
  }

  calculateAgeRange(birthDate) {
    const age = this.calculateAge(birthDate);
    return `${Math.floor(age / 10) * 10}-${Math.floor(age / 10) * 10 + 9} years`;
  }

  roundValue(value, precision = 1) {
    return Number(value.toFixed(precision));
  }
}
```javascript

## Monitoring and Auditing

### Access Logging

```javascript
class AccessAuditService {
  constructor() {
    this.auditLog = [];
    this.complianceMonitor = new ComplianceMonitor();
  }

  async logAccess(user, resource, action, result) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      userId: user.id,
      userRole: user.role,
      resourceType: resource.resourceType,
      resourceId: resource.id,
      action: action,
      result: result,
      sensitivityLevel: result.classification?.sensitivityLevel,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
      location: user.location,
    };

    this.auditLog.push(auditEntry);

    // Check for compliance violations
    await this.complianceMonitor.checkCompliance(auditEntry);

    // Store audit log
    await this.storeAuditEntry(auditEntry);
  }

  async storeAuditEntry(auditEntry) {
    // Store in secure audit database
    await this.auditDatabase.insert(auditEntry);

    // Send to SIEM system if critical
    if (auditEntry.sensitivityLevel >= 4 || !auditEntry.result.allowed) {
      await this.sendToSIEM(auditEntry);
    }
  }
}
```text

This comprehensive data classification guide ensures proper handling of sensitive healthcare information while maintaining compliance with healthcare regulations and humanitarian data protection requirements.
````
