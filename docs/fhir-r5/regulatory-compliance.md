---
title: 'Regulatory Compliance'
sidebar_label: 'Regulatory Compliance'
description: 'Comprehensive guide to FHIR R5 regulatory compliance in ZARISH SPHERE'
keywords: [regulatory compliance, fhir r5, healthcare regulations, hipaa, gdpr, zarish sphere]
---

# FHIR R5 Regulatory Compliance

## Overview

ZARISH SPHERE's FHIR R5 implementation is designed to meet global healthcare regulatory requirements while maintaining humanitarian healthcare standards. This guide covers compliance frameworks, audit requirements, and implementation strategies for healthcare data protection.

## Regulatory Frameworks

### Healthcare Data Regulations

| Regulation | Region         | Scope                              | Key Requirements                                  |
| ---------- | -------------- | ---------------------------------- | ------------------------------------------------- |
| **HIPAA**  | United States  | Protected Health Information (PHI) | Privacy, security, breach notification            |
| **GDPR**   | European Union | Personal Data                      | Consent, data subject rights, breach notification |
| **PIPEDA** | Canada         | Personal Health Information        | Consent, access, security safeguards              |
| **PDPA**   | Singapore      | Personal Data                      | Consent, purpose limitation, security             |
| **APPI**   | Australia      | Health Information                 | Privacy principles, access, security              |
| **DPA**    | UK             | Personal Data                      | Consent, rights, accountability                   |

### Humanitarian Standards

| Standard            | Organization   | Focus                     | Requirements                      |
| ------------------- | -------------- | ------------------------- | --------------------------------- |
| **Sphere Handbook** | Sphere Project | Humanitarian response     | Minimum standards, accountability |
| **IASC Guidelines** | UN             | Humanitarian coordination | Protection, assistance standards  |
| **WHO Standards**   | WHO            | Healthcare quality        | Service delivery, data quality    |
| **Red Cross Code**  | IFRC           | Data protection           | Privacy, security, ethical use    |

## HIPAA Compliance

### Protected Health Information (PHI)

### PHI Identification

````json
{
  "hipaaCompliance": {
    "phiFields": [
      "Patient.name",
      "Patient.birthDate",
      "Patient.address",
      "Patient.telecom",
      "Patient.identifier",
      "Patient.contact",
      "Encounter.reasonCode",
      "Observation.valueString",
      "MedicationRequest.dosageInstruction"
    ],
    "phiExtensions": [
      "HumanitarianContext.originalLocation",
      "HumanitarianContext.displacementDate",
      "MobileClinicEncounter.procedureLocation"
    ]
  }
}
```javascript

### Privacy Rule Implementation

```javascript
class HIPAAComplianceService {
  constructor() {
    this.phiFields = new Set([
      'name',
      'birthDate',
      'address',
      'telecom',
      'identifier',
      'contact',
      'reasonCode',
      'valueString',
      'dosageInstruction',
    ]);
  }

  // Minimum Necessary Standard
  applyMinimumNecessary(resource, requestPurpose) {
    const allowedFields = this.getAllowedFields(requestPurpose);
    const filteredResource = this.filterResource(resource, allowedFields);

    return {
      ...filteredResource,
      meta: {
        ...resource.meta,
        security: [
          ...(resource.meta?.security || []),
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'HIPAAPrivacy',
            display: 'HIPAA Privacy Rule Applied',
          },
        ],
      },
    };
  }

  getAllowedFields(requestPurpose) {
    const purposeMappings = {
      treatment: ['name', 'birthDate', 'gender', 'identifier', 'telecom'],
      payment: ['name', 'identifier', 'telecom', 'address'],
      healthcare_operations: ['name', 'identifier', 'telecom'],
      public_health: ['name', 'birthDate', 'gender', 'address'],
      research: ['name', 'birthDate', 'gender'], // De-identified
    };

    return purposeMappings[requestPurpose] || [];
  }

  filterResource(resource, allowedFields) {
    const filtered = {};

    Object.keys(resource).forEach((key) => {
      if (allowedFields.includes(key)) {
        filtered[key] = resource[key];
      } else if (key === 'extension') {
        // Filter PHI extensions
        filtered[key] = resource[key]?.filter((ext) => !this.isPHIExtension(ext));
      }
    });

    return filtered;
  }

  isPHIExtension(extension) {
    const phiExtensions = ['originalLocation', 'displacementDate', 'procedureLocation'];

    return phiExtensions.some((phiExt) => extension.url.includes(phiExt));
  }
}
```javascript

### Security Rule Implementation

```javascript
class HIPAASecurityService {
  constructor() {
    this.auditLog = [];
    this.accessLog = [];
  }

  // Access Control
  async enforceAccessControl(user, resource, action) {
    // Verify user authorization
    const isAuthorized = await this.verifyAuthorization(user, action);
    if (!isAuthorized) {
      throw new Error('Unauthorized access attempt');
    }

    // Log access
    this.logAccess(user, resource, action);

    // Apply security controls
    return this.applySecurityControls(resource);
  }

  async verifyAuthorization(user, action) {
    const requiredPermissions = this.getRequiredPermissions(action);
    return user.permissions.some((perm) => requiredPermissions.includes(perm));
  }

  getRequiredPermissions(action) {
    const permissions = {
      read: ['patient.read', 'phi.read'],
      create: ['patient.create', 'phi.create'],
      update: ['patient.update', 'phi.update'],
      delete: ['patient.delete', 'phi.delete'],
    };

    return permissions[action] || [];
  }

  logAccess(user, resource, action) {
    const accessEntry = {
      timestamp: new Date().toISOString(),
      userId: user.id,
      userRole: user.role,
      resourceType: resource.resourceType,
      resourceId: resource.id,
      action: action,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    };

    this.accessLog.push(accessEntry);
    this.storeAccessLog(accessEntry);
  }

  async storeAccessLog(entry) {
    // Store in secure audit database
    await this.auditDatabase.insert(entry);

    // Check for suspicious patterns
    await this.detectSuspiciousActivity(entry);
  }

  async detectSuspiciousActivity(entry) {
    // Check for unusual access patterns
    const recentAccess = await this.getRecentAccess(entry.userId, '1h');

    if (recentAccess.length > 100) {
      await this.triggerSecurityAlert('excessive_access', entry);
    }

    // Check for access from unusual locations
    const unusualLocations = await this.detectUnusualLocations(entry);
    if (unusualLocations.length > 0) {
      await this.triggerSecurityAlert('unusual_location', entry);
    }
  }
}
```typescript

### Business Associate Agreements

```javascript
class BAAService {
  constructor() {
    this.partners = new Map();
    this.agreements = new Map();
  }

  // Create Business Associate Agreement
  createBAA(partnerId, agreementData) {
    const baa = {
      id: generateUUID(),
      partnerId: partnerId,
      agreementType: agreementData.agreementType,
      dataTypes: agreementData.dataTypes,
      permittedUses: agreementData.permittedUses,
      securityMeasures: agreementData.securityMeasures,
      breachNotification: agreementData.breachNotification,
      terminationClause: agreementData.terminationClause,
      effectiveDate: new Date().toISOString(),
      status: 'active',
      auditRequirements: {
        accessLogging: true,
        securityMonitoring: true,
        breachReporting: true,
        annualAssessment: true,
      },
    };

    this.agreements.set(baa.id, baa);
    return baa;
  }

  // Validate BAA compliance
  async validateCompliance(partnerId, dataAccess) {
    const agreement = this.getAgreementByPartner(partnerId);

    if (!agreement) {
      throw new Error('No valid BAA found for partner');
    }

    // Check permitted uses
    const isPermittedUse = agreement.permittedUses.includes(dataAccess.purpose);
    if (!isPermittedUse) {
      throw new Error('Data access purpose not permitted by BAA');
    }

    // Check data types
    const isPermittedDataType = agreement.dataTypes.includes(dataAccess.dataType);
    if (!isPermittedDataType) {
      throw new Error('Data type not permitted by BAA');
    }

    // Log access for audit
    await this.logBAAAccess(agreement.id, dataAccess);

    return true;
  }

  async logBAAAccess(baaId, dataAccess) {
    const logEntry = {
      baaId: baaId,
      timestamp: new Date().toISOString(),
      partnerId: dataAccess.partnerId,
      dataType: dataAccess.dataType,
      purpose: dataAccess.purpose,
      recordsAccessed: dataAccess.recordCount,
      ipAddress: dataAccess.ipAddress,
    };

    await this.baaAuditDatabase.insert(logEntry);
  }
}
```javascript

## GDPR Compliance

### Data Subject Rights

### Right to Access

```javascript
class GDPRDataSubjectService {
  constructor() {
    this.subjectRequests = new Map();
    this.dataProcessor = new DataProcessor();
  }

  // Handle data subject access request
  async handleAccessRequest(subjectId, request) {
    const accessRequest = {
      id: generateUUID(),
      subjectId: subjectId,
      requestType: 'access',
      requestDate: new Date().toISOString(),
      status: 'processing',
      identityVerified: false,
      dataCategories: request.dataCategories,
      timePeriod: request.timePeriod,
      format: request.format || 'json',
    };

    this.subjectRequests.set(accessRequest.id, accessRequest);

    try {
      // Verify subject identity
      await this.verifyIdentity(subjectId, request.identityProof);
      accessRequest.identityVerified = true;

      // Collect subject data
      const subjectData = await this.collectSubjectData(subjectId, accessRequest);

      // Apply data minimization
      const minimizedData = this.applyDataMinimization(subjectData, accessRequest);

      // Format response
      const formattedData = this.formatDataResponse(minimizedData, accessRequest.format);

      accessRequest.status = 'completed';
      accessRequest.completionDate = new Date().toISOString();
      accessRequest.dataProvided = formattedData;

      return formattedData;
    } catch (error) {
      accessRequest.status = 'failed';
      accessRequest.error = error.message;
      throw error;
    }
  }

  async collectSubjectData(subjectId, request) {
    const data = {
      personalData: await this.getPersonalData(subjectId),
      healthData: await this.getHealthData(subjectId, request.timePeriod),
      usageData: await this.getUsageData(subjectId, request.timePeriod),
      consentData: await this.getConsentData(subjectId),
    };

    return data;
  }

  async getPersonalData(subjectId) {
    const patient = await this.getPatient(subjectId);

    return {
      name: patient.name,
      birthDate: patient.birthDate,
      gender: patient.gender,
      address: patient.address,
      telecom: patient.telecom,
      identifier: patient.identifier,
    };
  }

  async getHealthData(subjectId, timePeriod) {
    const observations = await this.getObservations(subjectId, timePeriod);
    const conditions = await this.getConditions(subjectId, timePeriod);
    const medications = await this.getMedications(subjectId, timePeriod);
    const procedures = await this.getProcedures(subjectId, timePeriod);

    return {
      observations,
      conditions,
      medications,
      procedures,
    };
  }

  applyDataMinimization(data, request) {
    const minimized = {};

    // Only return requested data categories
    if (request.dataCategories.includes('personal')) {
      minimized.personalData = data.personalData;
    }

    if (request.dataCategories.includes('health')) {
      minimized.healthData = data.healthData;
    }

    // Apply time period filtering
    if (request.timePeriod) {
      minimized.healthData = this.filterByTimePeriod(minimized.healthData, request.timePeriod);
    }

    return minimized;
  }
}
```javascript

### Right to Erasure (Right to be Forgotten)

```javascript
class GDPRRightToErasureService {
  constructor() {
    this.erasureRequests = new Map();
    this.dataRetentionPolicy = new DataRetentionPolicy();
  }

  // Handle erasure request
  async handleErasureRequest(subjectId, request) {
    const erasureRequest = {
      id: generateUUID(),
      subjectId: subjectId,
      requestDate: new Date().toISOString(),
      status: 'processing',
      identityVerified: false,
      erasureScope: request.erasureScope,
      justification: request.justification,
      thirdPartyNotifications: [],
    };

    this.erasureRequests.set(erasureRequest.id, erasureRequest);

    try {
      // Verify subject identity
      await this.verifyIdentity(subjectId, request.identityProof);
      erasureRequest.identityVerified = true;

      // Check for legal holds
      const legalHolds = await this.checkLegalHolds(subjectId);
      if (legalHolds.length > 0) {
        throw new Error('Cannot erase data due to legal holds');
      }

      // Check retention requirements
      const retentionPeriods = await this.checkRetentionRequirements(subjectId);
      if (retentionPeriods.length > 0) {
        throw new Error('Cannot erase data due to retention requirements');
      }

      // Perform erasure
      await this.performErasure(subjectId, erasureRequest.erasureScope);

      // Notify third parties
      await this.notifyThirdParties(subjectId, erasureRequest);

      erasureRequest.status = 'completed';
      erasureRequest.completionDate = new Date().toISOString();

      return erasureRequest;
    } catch (error) {
      erasureRequest.status = 'failed';
      erasureRequest.error = error.message;
      throw error;
    }
  }

  async performErasure(subjectId, erasureScope) {
    const erasureOperations = {
      personal_data: () => this.erasePersonalData(subjectId),
      health_data: () => this.eraseHealthData(subjectId),
      usage_data: () => this.eraseUsageData(subjectId),
      all_data: () => this.eraseAllData(subjectId),
    };

    const operation = erasureOperations[erasureScope];
    if (operation) {
      await operation();
    }
  }

  async erasePersonalData(subjectId) {
    // Anonymize personal data while preserving health records
    const patient = await this.getPatient(subjectId);

    const anonymizedPatient = {
      ...patient,
      name: [{ family: 'ANONYMIZED', given: ['ANONYMIZED'] }],
      birthDate: '1900-01-01',
      address: [],
      telecom: [],
      identifier: patient.identifier.map((id) => ({
        ...id,
        value: 'ANONYMIZED',
      })),
    };

    await this.updatePatient(subjectId, anonymizedPatient);
  }

  async eraseHealthData(subjectId) {
    // Delete health records if retention period has expired
    const resources = ['Observation', 'Condition', 'MedicationRequest', 'Procedure'];

    for (const resourceType of resources) {
      await this.deleteResources(resourceType, subjectId);
    }
  }

  async notifyThirdParties(subjectId, erasureRequest) {
    const thirdParties = await this.getThirdPartyProcessors(subjectId);

    for (const thirdParty of thirdParties) {
      const notification = {
        subjectId: subjectId,
        erasureRequestId: erasureRequest.id,
        erasureScope: erasureRequest.erasureScope,
        notificationDate: new Date().toISOString(),
        responseRequired: true,
      };

      await this.sendErasureNotification(thirdParty, notification);
      erasureRequest.thirdPartyNotifications.push({
        thirdPartyId: thirdParty.id,
        notificationSent: true,
        responseReceived: false,
      });
    }
  }
}
```javascript

### Data Protection Impact Assessment (DPIA)

```javascript
class DPIAService {
  constructor() {
    this.assessments = new Map();
    this.riskMatrix = new RiskMatrix();
  }

  // Conduct DPIA
  async conductDPIA(assessmentData) {
    const assessment = {
      id: generateUUID(),
      projectName: assessmentData.projectName,
      projectDescription: assessmentData.projectDescription,
      dataController: assessmentData.dataController,
      dataProcessor: assessmentData.dataProcessor,
      dataTypes: assessmentData.dataTypes,
      processingPurposes: assessmentData.processingPurposes,
      dataSubjects: assessmentData.dataSubjects,
      assessmentDate: new Date().toISOString(),
      status: 'in_progress',
      risks: [],
      mitigations: [],
      recommendations: [],
    };

    this.assessments.set(assessment.id, assessment);

    try {
      // Identify risks
      assessment.risks = await this.identifyRisks(assessment);

      // Assess risk levels
      assessment.riskLevel = await this.assessRiskLevel(assessment.risks);

      // Recommend mitigations
      assessment.mitigations = await this.recommendMitigations(assessment.risks);

      // Generate recommendations
      assessment.recommendations = await this.generateRecommendations(assessment);

      assessment.status = 'completed';
      assessment.completionDate = new Date().toISOString();

      return assessment;
    } catch (error) {
      assessment.status = 'failed';
      assessment.error = error.message;
      throw error;
    }
  }

  async identifyRisks(assessment) {
    const risks = [];

    // Privacy risks
    if (assessment.dataTypes.includes('health_data')) {
      risks.push({
        type: 'privacy',
        description: 'Unauthorized access to sensitive health data',
        likelihood: 'medium',
        impact: 'high',
        riskScore: 75,
      });
    }

    // Data transfer risks
    if (assessment.dataProcessor?.international) {
      risks.push({
        type: 'data_transfer',
        description: 'Cross-border data transfer without adequate safeguards',
        likelihood: 'medium',
        impact: 'medium',
        riskScore: 50,
      });
    }

    // Purpose limitation risks
    if (assessment.processingPurposes.length > 3) {
      risks.push({
        type: 'purpose_limitation',
        description: 'Multiple processing purposes without clear consent',
        likelihood: 'high',
        impact: 'medium',
        riskScore: 65,
      });
    }

    return risks;
  }

  async assessRiskLevel(risks) {
    const totalRiskScore = risks.reduce((sum, risk) => sum + risk.riskScore, 0);
    const averageRiskScore = totalRiskScore / risks.length;

    if (averageRiskScore >= 80) {
      return 'high';
    } else if (averageRiskScore >= 50) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  async recommendMitigations(risks) {
    const mitigations = [];

    risks.forEach((risk) => {
      switch (risk.type) {
        case 'privacy':
          mitigations.push({
            riskId: risk.type,
            mitigation: 'Implement end-to-end encryption and access controls',
            implementation: 'technical',
            timeline: '3 months',
            priority: 'high',
          });
          break;

        case 'data_transfer':
          mitigations.push({
            riskId: risk.type,
            mitigation: 'Use Standard Contractual Clauses for international transfers',
            implementation: 'legal',
            timeline: '1 month',
            priority: 'medium',
          });
          break;

        case 'purpose_limitation':
          mitigations.push({
            riskId: risk.type,
            mitigation: 'Implement granular consent management system',
            implementation: 'technical',
            timeline: '2 months',
            priority: 'high',
          });
          break;
      }
    });

    return mitigations;
  }
}
```javascript

## Humanitarian Compliance

### Sphere Standards Implementation

```javascript
class SphereComplianceService {
  constructor() {
    this.standards = new Map();
    this.audits = new Map();
  }

  // Implement Sphere standards
  async implementSphereStandards(projectData) {
    const compliance = {
      projectId: projectData.projectId,
      projectName: projectData.projectName,
      assessmentDate: new Date().toISOString(),
      standards: {
        water_sanitation: await this.assessWaterSanitation(projectData),
        food_security: await this.assessFoodSecurity(projectData),
        shelter: await this.assessShelter(projectData),
        healthcare: await this.assessHealthcare(projectData),
        protection: await this.assessProtection(projectData),
      },
      overallCompliance: 0,
      recommendations: [],
    };

    // Calculate overall compliance
    const complianceScores = Object.values(compliance.standards);
    compliance.overallCompliance =
      complianceScores.reduce((a, b) => a + b.score, 0) / complianceScores.length;

    // Generate recommendations
    compliance.recommendations = await this.generateSphereRecommendations(compliance);

    return compliance;
  }

  async assessHealthcare(projectData) {
    const assessment = {
      score: 0,
      criteria: {
        health_service_accessibility: {
          score: 0,
          requirements: [
            'Health services available within 30 minutes',
            'Services available 24/7 for emergencies',
            'Transportation available for referrals',
          ],
          evidence: [],
        },
        health_service_quality: {
          score: 0,
          requirements: [
            'Qualified healthcare personnel',
            'Essential medicines available',
            'Medical equipment functional',
            'Infection prevention measures in place',
          ],
          evidence: [],
        },
        data_management: {
          score: 0,
          requirements: [
            'Confidential patient records',
            'Health information system functional',
            'Data protection measures in place',
            'Regular data quality assessments',
          ],
          evidence: [],
        },
      },
    };

    // Evaluate each criterion
    for (const [criterion, details] of Object.entries(assessment.criteria)) {
      details.score = await this.evaluateCriterion(criterion, details, projectData);
    }

    // Calculate overall score
    const scores = Object.values(assessment.criteria).map((c) => c.score);
    assessment.score = scores.reduce((a, b) => a + b, 0) / scores.length;

    return assessment;
  }

  async evaluateCriterion(criterion, details, projectData) {
    let score = 0;
    const evidence = [];

    for (const requirement of details.requirements) {
      const isMet = await this.checkRequirement(requirement, projectData);
      if (isMet) {
        score += 25; // Each requirement worth 25 points
        evidence.push(requirement);
      }
    }

    details.evidence = evidence;
    return score;
  }

  async checkRequirement(requirement, projectData) {
    // Implementation would check actual project data against requirements
    // This is a simplified example
    const requirementChecks = {
      'Health services available within 30 minutes': () => {
        return projectData.healthServices?.accessibility?.responseTime <= 30;
      },
      'Qualified healthcare personnel': () => {
        return projectData.staff?.healthcare?.qualified > 0;
      },
      'Confidential patient records': () => {
        return projectData.dataManagement?.confidentiality === true;
      },
    };

    const checkFunction = requirementChecks[requirement];
    return checkFunction ? checkFunction() : false;
  }
}
```javascript

## Audit and Monitoring

### Compliance Audit Framework

```javascript
class ComplianceAuditService {
  constructor() {
    this.auditSchedule = new Map();
    this.auditReports = new Map();
    this.complianceMetrics = new Map();
  }

  // Schedule compliance audit
  async scheduleAudit(auditData) {
    const audit = {
      id: generateUUID(),
      type: auditData.type,
      scope: auditData.scope,
      scheduledDate: auditData.scheduledDate,
      status: 'scheduled',
      auditor: auditData.auditor,
      framework: auditData.framework,
      checklist: await this.generateChecklist(auditData.framework, auditData.scope),
    };

    this.auditSchedule.set(audit.id, audit);
    return audit;
  }

  // Generate audit checklist
  async generateChecklist(framework, scope) {
    const checklists = {
      hipaa: {
        privacy_rule: [
          'Minimum necessary standard implemented',
          'Authorization controls in place',
          'Patient access requests processed',
          'Business associate agreements current',
        ],
        security_rule: [
          'Access controls implemented',
          'Audit logging functional',
          'Encryption at rest and in transit',
          'Security incident procedures in place',
        ],
        breach_notification: [
          'Breach detection procedures',
          'Notification timelines met',
          'Documentation maintained',
        ],
      },
      gdpr: {
        lawfulness: [
          'Lawful basis identified',
          'Consent obtained where required',
          'Purpose limitation applied',
        ],
        data_subject_rights: [
          'Access requests processed',
          'Erasure requests handled',
          'Rectification requests processed',
        ],
        security: [
          'Technical security measures',
          'Organizational security measures',
          'Data protection impact assessment',
        ],
      },
    };

    return checklists[framework]?.[scope] || [];
  }

  // Conduct audit
  async conductAudit(auditId) {
    const audit = this.auditSchedule.get(auditId);
    if (!audit) {
      throw new Error('Audit not found');
    }

    audit.status = 'in_progress';
    audit.actualStartDate = new Date().toISOString();

    try {
      const results = await this.executeAuditChecklist(audit.checklist);

      const report = {
        auditId: auditId,
        framework: audit.framework,
        scope: audit.scope,
        auditor: audit.auditor,
        auditDate: new Date().toISOString(),
        results: results,
        overallScore: this.calculateOverallScore(results),
        findings: this.identifyFindings(results),
        recommendations: this.generateRecommendations(results),
        status: 'completed',
      };

      this.auditReports.set(auditId, report);
      audit.status = 'completed';
      audit.completionDate = new Date().toISOString();

      return report;
    } catch (error) {
      audit.status = 'failed';
      audit.error = error.message;
      throw error;
    }
  }

  async executeAuditChecklist(checklist) {
    const results = {};

    for (const [category, items] of Object.entries(checklist)) {
      results[category] = {};

      for (const item of items) {
        const result = await this.evaluateAuditItem(item);
        results[category][item] = result;
      }
    }

    return results;
  }

  async evaluateAuditItem(item) {
    // Implementation would evaluate each audit item
    // This is a simplified example
    const itemEvaluations = {
      'Minimum necessary standard implemented': {
        compliant: true,
        evidence: 'Data access controls reviewed',
        score: 100,
      },
      'Authorization controls in place': {
        compliant: true,
        evidence: 'Role-based access control implemented',
        score: 100,
      },
      'Lawful basis identified': {
        compliant: true,
        evidence: 'Data processing register maintained',
        score: 100,
      },
    };

    return (
      itemEvaluations[item] || {
        compliant: false,
        evidence: 'Not assessed',
        score: 0,
      }
    );
  }

  calculateOverallScore(results) {
    let totalScore = 0;
    let totalItems = 0;

    for (const category of Object.values(results)) {
      for (const item of Object.values(category)) {
        totalScore += item.score;
        totalItems++;
      }
    }

    return totalItems > 0 ? totalScore / totalItems : 0;
  }
}
```text

This comprehensive regulatory compliance guide ensures ZARISH SPHERE's FHIR R5 implementation meets global healthcare regulations while maintaining humanitarian healthcare standards and data protection requirements.
````
