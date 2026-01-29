---
title: 'Test Ordering'
sidebar_label: 'Test Ordering'
description: 'Comprehensive test ordering and laboratory management system for ZARISH SPHERE'
keywords: [test ordering, laboratory management, diagnostic testing, healthcare, zarish sphere]
---

# Test Ordering

## Overview

ZARISH SPHERE Test Ordering provides a comprehensive diagnostic test management system that streamlines the entire testing workflow from order placement to result delivery. Our system supports multiple test types, automated workflows, real-time tracking, and seamless integration with laboratory information systems while ensuring compliance with healthcare standards and maintaining patient safety.

## Test Ordering Workflow

### Ordering Process Architecture

````text
Test Ordering Workflow
├── Test Request
│   ├── Clinical Indication
│   ├── Test Selection
│   ├── Patient Preparation
│   └── Order Validation
├── Order Processing
│   ├── Insurance Verification
│   ├── Pre-authorization
│   ├── Scheduling
│   └── Sample Collection
├── Laboratory Integration
│   ├── Order Transmission
│   ├── Sample Tracking
│   ├── Result Reception
│   └── Quality Control
├── Result Management
│   ├── Result Validation
│   ├── Critical Value Alerting
│   ├── Report Generation
│   └── Provider Notification
└── Patient Communication
    ├── Result Delivery
    ├── Patient Education
    ├── Follow-up Scheduling
    └── Documentation
```javascript

### Test Categories

| Category              | Description                    | Turnaround Time | Priority |
| --------------------- | ------------------------------ | --------------- | -------- |
| **Routine Tests**     | Standard diagnostic procedures | 24-72 hours     | Routine  |
| **Stat Tests**        | Urgent emergency testing       | 1-2 hours       | Stat     |
| **Critical Tests**    | Life-threatening conditions    | 30-60 minutes   | Critical |
| **Specialized Tests** | Complex specialized procedures | 3-7 days        | Routine  |
| **Genetic Tests**     | Molecular and genetic testing  | 1-3 weeks       | Routine  |
| **Point-of-Care**     | Immediate bedside testing      | 5-15 minutes    | Stat     |

## Order Management

### Test Order Creation

```javascript
// Test order management system
class TestOrderManager {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.testCatalog = new TestCatalog();
    this.insuranceEngine = new InsuranceEngine();
    this.labInterface = new LabInterface();
    this.notificationService = new NotificationService();
  }

  // Create new test order
  async createTestOrder(orderData) {
    const order = {
      id: generateUUID(),
      patientId: orderData.patientId,
      providerId: orderData.providerId,
      encounterId: orderData.encounterId,
      tests: [],
      status: 'pending',
      priority: orderData.priority || 'routine',
      clinicalIndication: orderData.clinicalIndication,
      specialInstructions: orderData.specialInstructions,
      insurance: null,
      scheduling: null,
      createdAt: new Date().toISOString(),
    };

    // Validate and process tests
    for (const testRequest of orderData.tests) {
      const test = await this.processTestRequest(testRequest, order);
      order.tests.push(test);
    }

    // Verify insurance coverage
    order.insurance = await this.verifyInsuranceCoverage(order);

    // Validate order
    const validation = await this.validateOrder(order);
    if (!validation.valid) {
      throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
    }

    // Schedule collection if needed
    if (this.requiresScheduling(order.tests)) {
      order.scheduling = await this.scheduleCollection(order);
    }

    // Store order
    const savedOrder = await this.orderRepository.create(order);

    // Send to laboratory
    await this.transmitToLab(savedOrder);

    // Notify stakeholders
    await this.notifyOrderCreated(savedOrder);

    return savedOrder;
  }

  // Process test request
  async processTestRequest(testRequest, order) {
    const test = {
      id: generateUUID(),
      testCode: testRequest.testCode,
      testName: testRequest.testName,
      category: testRequest.category,
      specimen: testRequest.specimen || null,
      preparation: testRequest.preparation || null,
      frequency: testRequest.frequency || 'once',
      status: 'pending',
      results: null,
      createdAt: new Date().toISOString(),
    };

    // Get test details from catalog
    const testDetails = await this.testCatalog.getTest(test.testCode);
    test.details = testDetails;

    // Validate test requirements
    const validation = await this.validateTestRequirements(test, order.patientId);
    if (!validation.valid) {
      throw new Error(`Test validation failed: ${validation.errors.join(', ')}`);
    }

    // Check for duplicate orders
    const duplicateCheck = await this.checkDuplicateOrders(test, order.patientId);
    if (duplicateCheck.isDuplicate) {
      test.status = 'duplicate';
      test.duplicateOf = duplicateCheck.existingOrderId;
    }

    return test;
  }

  // Validate test requirements
  async validateTestRequirements(test, patientId) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
    };

    // Check patient preparation requirements
    if (test.details.preparation) {
      const preparationStatus = await this.checkPatientPreparation(
        patientId,
        test.details.preparation
      );
      if (!preparationStatus.ready) {
        validation.warnings.push(
          `Patient preparation required: ${preparationStatus.requirements.join(', ')}`
        );
      }
    }

    // Check specimen requirements
    if (test.details.specimen) {
      const specimenCheck = await this.checkSpecimenRequirements(test.details.specimen);
      if (!specimenCheck.available) {
        validation.errors.push(
          `Specimen requirements not met: ${specimenCheck.requirements.join(', ')}`
        );
        validation.valid = false;
      }
    }

    // Check contraindications
    const contraindications = await this.checkContraindications(test, patientId);
    if (contraindications.length > 0) {
      validation.warnings.push(`Contraindications identified: ${contraindications.join(', ')}`);
    }

    return validation;
  }

  // Check patient preparation
  async checkPatientPreparation(patientId, preparation) {
    const status = {
      ready: true,
      requirements: [],
      completed: [],
    };

    // Check fasting requirements
    if (preparation.fasting) {
      const lastMealTime = await this.getLastMealTime(patientId);
      const fastingHours = preparation.fasting.hours;
      const hoursSinceLastMeal = (new Date() - new Date(lastMealTime)) / (1000 * 60 * 60);

      if (hoursSinceLastMeal < fastingHours) {
        status.ready = false;
        status.requirements.push(`Fasting required for ${fastingHours} hours`);
      } else {
        status.completed.push('Fasting requirement met');
      }
    }

    // Check medication restrictions
    if (preparation.medicationRestrictions) {
      for (const restriction of preparation.medicationRestrictions) {
        const medicationStatus = await this.checkMedicationRestriction(patientId, restriction);
        if (!medicationStatus.compliant) {
          status.ready = false;
          status.requirements.push(`Medication restriction: ${restriction.name}`);
        } else {
          status.completed.push(`Medication restriction met: ${restriction.name}`);
        }
      }
    }

    // Check timing requirements
    if (preparation.timing) {
      const timingStatus = await this.checkTimingRequirements(preparation.timing);
      if (!timingStatus.optimal) {
        status.requirements.push(`Optimal timing: ${timingStatus.recommendation}`);
      }
    }

    return status;
  }

  // Verify insurance coverage
  async verifyInsuranceCoverage(order) {
    const coverage = {
      verified: false,
      coverage: [],
      authorizations: [],
      patientResponsibility: 0,
      deniedTests: [],
    };

    // Get patient insurance
    const insurance = await this.getPatientInsurance(order.patientId);

    for (const test of order.tests) {
      const testCoverage = await this.checkTestCoverage(test, insurance);

      if (testCoverage.covered) {
        coverage.covered.push({
          testId: test.id,
          coverage: testCoverage.coverage,
          requiresAuth: testCoverage.requiresAuth,
        });

        if (testCoverage.requiresAuth) {
          const auth = await this.requestAuthorization(test, insurance);
          coverage.authorizations.push(auth);
        }
      } else {
        coverage.deniedTests.push({
          testId: test.id,
          reason: testCoverage.denialReason,
        });
      }
    }

    coverage.verified = true;
    coverage.patientResponsibility = this.calculatePatientResponsibility(coverage);

    return coverage;
  }

  // Request pre-authorization
  async requestAuthorization(test, insurance) {
    const authRequest = {
      id: generateUUID(),
      testId: test.id,
      patientId: test.patientId,
      insuranceId: insurance.id,
      clinicalIndication: test.clinicalIndication,
      testDetails: test.details,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Submit to insurance
    const response = await this.insuranceEngine.submitAuthorization(authRequest);

    authRequest.status = response.approved ? 'approved' : 'denied';
    authRequest.approvalNumber = response.approvalNumber;
    authRequest.authPeriod = response.authPeriod;
    authRequest.response = response;

    return authRequest;
  }

  // Schedule specimen collection
  async scheduleCollection(order) {
    const scheduling = {
      scheduled: false,
      appointmentId: null,
      collectionTime: null,
      location: null,
      instructions: [],
    };

    // Determine collection requirements
    const collectionRequirements = await this.getCollectionRequirements(order.tests);

    if (collectionRequirements.requiresAppointment) {
      const appointment = await this.scheduleCollectionAppointment(
        order.patientId,
        collectionRequirements
      );

      scheduling.scheduled = true;
      scheduling.appointmentId = appointment.id;
      scheduling.collectionTime = appointment.time;
      scheduling.location = appointment.location;
      scheduling.instructions = appointment.instructions;
    }

    return scheduling;
  }

  // Transmit order to laboratory
  async transmitToLab(order) {
    const labOrder = {
      orderId: order.id,
      patientId: order.patientId,
      providerId: order.providerId,
      tests: order.tests.map((test) => ({
        testCode: test.testCode,
        testName: test.testName,
        specimen: test.specimen,
        priority: order.priority,
        clinicalInfo: order.clinicalIndication,
      })),
      priority: order.priority,
      specialInstructions: order.specialInstructions,
      insurance: order.insurance,
      scheduling: order.scheduling,
      transmittedAt: new Date().toISOString(),
    };

    // Send to laboratory interface
    const transmission = await this.labInterface.transmitOrder(labOrder);

    // Update order status
    order.status = 'transmitted';
    order.transmissionId = transmission.id;
    order.transmittedAt = transmission.timestamp;

    await this.orderRepository.update(order);

    return transmission;
  }
}
```javascript

## Result Management

### Result Processing and Validation

```javascript
// Result management system
class ResultManager {
  constructor() {
    this.resultRepository = new ResultRepository();
    this.validationEngine = new ValidationEngine();
    this.alertEngine = new AlertEngine();
    this.reportGenerator = new ReportGenerator();
    this.notificationService = new NotificationService();
  }

  // Process laboratory results
  async processResults(labResults) {
    const processing = {
      orderId: labResults.orderId,
      results: [],
      criticalValues: [],
      validationErrors: [],
      processedAt: new Date().toISOString(),
    };

    for (const labResult of labResults.results) {
      const result = await this.processIndividualResult(labResult);
      processing.results.push(result);

      // Check for critical values
      if (result.isCritical) {
        processing.criticalValues.push(result);
      }

      // Check for validation errors
      if (result.validationErrors.length > 0) {
        processing.validationErrors.push(...result.validationErrors);
      }
    }

    // Handle critical values
    if (processing.criticalValues.length > 0) {
      await this.handleCriticalValues(processing.criticalValues);
    }

    // Generate reports
    await this.generateReports(processing);

    // Notify providers
    await this.notifyProviders(processing);

    return processing;
  }

  // Process individual result
  async processIndividualResult(labResult) {
    const result = {
      testId: labResult.testId,
      testName: labResult.testName,
      value: labResult.value,
      unit: labResult.unit,
      referenceRange: labResult.referenceRange,
      status: labResult.status,
      interpretation: null,
      isCritical: false,
      validationErrors: [],
      receivedAt: new Date().toISOString(),
    };

    // Validate result
    const validation = await this.validateResult(result);
    result.validationErrors = validation.errors;

    // Interpret result
    result.interpretation = await this.interpretResult(result);

    // Check for critical values
    result.isCritical = await this.isCriticalValue(result);

    return result;
  }

  // Validate result
  async validateResult(result) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
    };

    // Check value format
    if (result.value === null || result.value === undefined) {
      validation.errors.push('Result value is missing');
      validation.valid = false;
    }

    // Check unit consistency
    if (result.unit && !this.isValidUnit(result.unit)) {
      validation.errors.push(`Invalid unit: ${result.unit}`);
      validation.valid = false;
    }

    // Check reference range
    if (result.referenceRange) {
      const rangeValidation = await this.validateReferenceRange(
        result.value,
        result.referenceRange
      );
      if (!rangeValidation.valid) {
        validation.warnings.push('Result outside reference range');
      }
    }

    // Check for delta changes
    const deltaCheck = await this.checkDeltaChange(result);
    if (deltaCheck.significant) {
      validation.warnings.push(`Significant delta change: ${deltaCheck.description}`);
    }

    return validation;
  }

  // Interpret result
  async interpretResult(result) {
    const interpretation = {
      category: null,
      severity: null,
      description: null,
      recommendations: [],
    };

    // Categorize result
    if (result.referenceRange) {
      interpretation.category = this.categorizeResult(result);
    }

    // Determine severity
    interpretation.severity = this.determineSeverity(result);

    // Generate description
    interpretation.description = this.generateInterpretationDescription(result);

    // Generate recommendations
    interpretation.recommendations = await this.generateRecommendations(result);

    return interpretation;
  }

  // Check for critical values
  async isCriticalValue(result) {
    const criticalCriteria = await this.getCriticalCriteria(result.testName);

    for (const criterion of criticalCriteria) {
      if (this.meetsCriticalCriterion(result, criterion)) {
        return true;
      }
    }

    return false;
  }

  // Handle critical values
  async handleCriticalValues(criticalResults) {
    for (const result of criticalResults) {
      // Create critical alert
      const alert = await this.createCriticalAlert(result);

      // Notify ordering provider
      await this.notifyCriticalResult(result);

      // Log critical value
      await this.logCriticalValue(result);

      // Update patient record
      await this.updatePatientRecord(result);
    }
  }

  // Create critical alert
  async createCriticalAlert(result) {
    const alert = {
      id: generateUUID(),
      type: 'critical_lab_result',
      patientId: result.patientId,
      testId: result.testId,
      result: result,
      status: 'active',
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null,
      createdAt: new Date().toISOString(),
    };

    // Store alert
    const savedAlert = await this.alertRepository.create(alert);

    // Send immediate notifications
    await this.sendCriticalNotifications(savedAlert);

    return savedAlert;
  }

  // Generate result reports
  async generateReports(processing) {
    const reports = [];

    // Generate comprehensive report
    const comprehensiveReport = await this.reportGenerator.generateComprehensiveReport(processing);
    reports.push(comprehensiveReport);

    // Generate individual test reports
    for (const result of processing.results) {
      const testReport = await this.reportGenerator.generateTestReport(result);
      reports.push(testReport);
    }

    // Generate summary report
    const summaryReport = await this.reportGenerator.generateSummaryReport(processing);
    reports.push(summaryReport);

    return reports;
  }

  // Notify providers
  async notifyProviders(processing) {
    // Get ordering provider
    const orderingProvider = await this.getOrderingProvider(processing.orderId);

    // Get primary care provider
    const primaryCareProvider = await this.getPrimaryCareProvider(processing.patientId);

    const notifications = [];

    // Notify ordering provider
    notifications.push({
      recipient: orderingProvider,
      type: 'lab_results',
      priority: processing.criticalValues.length > 0 ? 'urgent' : 'routine',
      content: processing,
      deliveryMethods: ['email', 'portal'],
    });

    // Notify primary care provider if different
    if (primaryCareProvider.id !== orderingProvider.id) {
      notifications.push({
        recipient: primaryCareProvider,
        type: 'lab_results',
        priority: processing.criticalValues.length > 0 ? 'urgent' : 'routine',
        content: processing,
        deliveryMethods: ['email', 'portal'],
      });
    }

    // Send notifications
    for (const notification of notifications) {
      await this.notificationService.send(notification);
    }
  }
}
```javascript

## Integration Capabilities

### Laboratory System Integration

```javascript
// Laboratory integration system
class LaboratoryIntegration {
  constructor() {
    this.labSystems = new Map();
    this.messageProcessor = new MessageProcessor();
    this.resultProcessor = new ResultProcessor();
    this.errorHandler = new ErrorHandler();
  }

  // Register laboratory system
  registerLabSystem(labConfig) {
    const labSystem = {
      id: labConfig.id,
      name: labConfig.name,
      type: labConfig.type,
      connection: this.createConnection(labConfig),
      messageFormat: labConfig.messageFormat,
      capabilities: labConfig.capabilities,
      status: 'active',
    };

    this.labSystems.set(labConfig.id, labSystem);
    return labSystem;
  }

  // Create connection to lab system
  createConnection(config) {
    switch (config.type) {
      case 'hl7':
        return new HL7Connection(config);
      case 'fhir':
        return new FHIRConnection(config);
      case 'api':
        return new APIConnection(config);
      case 'file':
        return new FileConnection(config);
      default:
        throw new Error(`Unsupported lab system type: ${config.type}`);
    }
  }

  // Transmit order to laboratory
  async transmitOrder(labSystemId, order) {
    const labSystem = this.labSystems.get(labSystemId);
    if (!labSystem) {
      throw new Error(`Laboratory system not found: ${labSystemId}`);
    }

    try {
      // Format message for lab system
      const message = await this.formatOrderMessage(order, labSystem);

      // Transmit message
      const transmission = await labSystem.connection.send(message);

      // Log transmission
      await this.logTransmission(labSystemId, order.id, transmission);

      return transmission;
    } catch (error) {
      await this.handleTransmissionError(labSystemId, order.id, error);
      throw error;
    }
  }

  // Format order message
  async formatOrderMessage(order, labSystem) {
    switch (labSystem.messageFormat) {
      case 'hl7_v2':
        return await this.formatHL7Order(order);
      case 'fhir':
        return await this.formatFHIROrder(order);
      case 'json':
        return await this.formatJSONOrder(order);
      case 'xml':
        return await this.formatXMLOrder(order);
      default:
        throw new Error(`Unsupported message format: ${labSystem.messageFormat}`);
    }
  }

  // Format HL7 order message
  async formatHL7Order(order) {
    const message = {
      messageType: 'ORM^O01',
      timestamp: new Date().toISOString(),
      msh: {
        sendingApplication: 'ZARISH_SPHERE',
        sendingFacility: order.facility,
        receivingApplication: 'LAB_SYSTEM',
        receivingFacility: 'LABORATORY',
        timestamp: new Date().toISOString(),
        messageType: 'ORM',
        triggerEvent: 'O01',
        messageControlId: generateUUID(),
      },
      pid: {
        patientId: order.patientId,
        patientName: order.patientName,
        dateOfBirth: order.dateOfBirth,
        gender: order.gender,
        address: order.address,
      },
      pv1: {
        patientClass: 'O',
        patientLocation: order.location,
        attendingDoctor: order.providerId,
      },
      orc: {
        orderControl: 'NW',
        placerOrderNumber: order.id,
        fillerOrderNumber: null,
        orderStatus: 'IP',
      },
      obr: [],
    };

    // Add test segments
    for (const test of order.tests) {
      message.obr.push({
        placerOrderNumber: order.id,
        fillerOrderNumber: null,
        universalServiceId: test.testCode,
        priority: order.priority,
        requestedDateTime: order.requestedDateTime,
        observationDateTime: null,
        collectorId: null,
        specimenActionCode: null,
        specimenSource: test.specimen,
        orderingProvider: order.providerId,
        clinicalInfo: order.clinicalIndication,
      });
    }

    return message;
  }

  // Process incoming results
  async processResults(labSystemId, message) {
    const labSystem = this.labSystems.get(labSystemId);
    if (!labSystem) {
      throw new Error(`Laboratory system not found: ${labSystemId}`);
    }

    try {
      // Parse message
      const parsedMessage = await this.parseResultMessage(message, labSystem);

      // Validate message
      const validation = await this.validateResultMessage(parsedMessage);
      if (!validation.valid) {
        throw new Error(`Invalid result message: ${validation.errors.join(', ')}`);
      }

      // Process results
      const processedResults = await this.resultProcessor.process(parsedMessage);

      // Acknowledge receipt
      await this.acknowledgeResults(labSystemId, parsedMessage);

      return processedResults;
    } catch (error) {
      await this.handleResultError(labSystemId, message, error);
      throw error;
    }
  }

  // Parse result message
  async parseResultMessage(message, labSystem) {
    switch (labSystem.messageFormat) {
      case 'hl7_v2':
        return await this.parseHL7Result(message);
      case 'fhir':
        return await this.parseFHIRResult(message);
      case 'json':
        return await this.parseJSONResult(message);
      case 'xml':
        return await this.parseXMLResult(message);
      default:
        throw new Error(`Unsupported message format: ${labSystem.messageFormat}`);
    }
  }
}
```text

This comprehensive test ordering system provides healthcare organizations with powerful tools for managing diagnostic testing workflows, ensuring accurate order placement, seamless laboratory integration, and timely result delivery while maintaining patient safety and regulatory compliance.
````
