---
title: 'Specimen Management'
sidebar_label: 'Specimen Management'
description: 'Comprehensive specimen collection, tracking, and management system for healthcare laboratories in ZARISH SPHERE'
keywords: [specimen management, laboratory specimens, sample tracking, healthcare, zarish sphere]
---

# Specimen Management

## Overview

ZARISH SPHERE Specimen Management provides a comprehensive system for managing the entire specimen lifecycle from collection to disposal. Our platform ensures specimen integrity, maintains chain of custody, optimizes laboratory workflows, and provides real-time tracking capabilities while supporting various specimen types and collection methods across healthcare settings.

## Specimen Lifecycle Management

### End-to-End Workflow

````text
Specimen Lifecycle Workflow
├── Collection Phase
│   ├── Order Generation
│   ├── Patient Identification
│   ├── Specimen Collection
│   ├── Labeling & Barcoding
│   └── Initial Documentation
├── Transportation Phase
│   ├── Packaging
│   ├── Temperature Control
│   ├── Logistics Tracking
│   ├── Chain of Custody
│   └── Delivery Confirmation
├── Laboratory Processing
│   ├── Accessioning
│   ├── Quality Control
│   ├── Sample Preparation
│   ├── Testing Allocation
│   └── Storage Management
├── Analysis Phase
│   ├── Test Execution
│   ├── Result Generation
│   ├── Quality Assurance
│   ├── Data Validation
│   └── Review Process
└── Disposition Phase
    ├── Result Reporting
    ├── Sample Retention
    ├── Disposal Management
    ├── Documentation
    └── Archive Completion
```javascript

### Specimen Types and Requirements

| Specimen Type | Collection Method | Temperature | Stability   | Processing Time |
| ------------- | ----------------- | ----------- | ----------- | --------------- |
| **Blood**     | Venipuncture      | 2-8°C       | 24-72 hours | 30 minutes      |
| **Urine**     | Clean Catch       | 2-8°C       | 24 hours    | 15 minutes      |
| **Swab**      | Culture Swab      | Room Temp   | 48 hours    | 10 minutes      |
| **Tissue**    | Biopsy            | Formalin    | 7 days      | 45 minutes      |
| **CSF**       | Lumbar Puncture   | 2-8°C       | 2 hours     | 20 minutes      |
| **Stool**     | Collection Kit    | 2-8°C       | 24 hours    | 15 minutes      |

## Collection Management

### Specimen Collection System

```javascript
// Specimen collection management system
class SpecimenCollectionManager {
  constructor() {
    this.collectionRepository = new CollectionRepository();
    this.patientRepository = new PatientRepository();
    this.barcodeEngine = new BarcodeEngine();
    this.labelPrinter = new LabelPrinter();
    this.validationEngine = new ValidationEngine();
  }

  // Initiate specimen collection
  async initiateCollection(collectionRequest) {
    const collection = {
      id: generateUUID(),
      orderId: collectionRequest.orderId,
      patientId: collectionRequest.patientId,
      specimens: [],
      collectorId: collectionRequest.collectorId,
      collectionTime: null,
      status: 'initiated',
      qualityChecks: [],
      labels: [],
      createdAt: new Date().toISOString(),
    };

    try {
      // Validate patient identification
      const patientValidation = await this.validatePatientIdentification(
        collectionRequest.patientId,
        collectionRequest.identificationMethod
      );

      if (!patientValidation.valid) {
        throw new Error(`Patient identification failed: ${patientValidation.reason}`);
      }

      // Prepare collection kits
      const kits = await this.prepareCollectionKits(collectionRequest.specimens);
      collection.kits = kits;

      // Generate specimen labels
      const labels = await this.generateSpecimenLabels(collectionRequest.specimens);
      collection.labels = labels;

      // Store collection record
      const savedCollection = await this.collectionRepository.create(collection);

      return savedCollection;
    } catch (error) {
      collection.status = 'failed';
      collection.error = error.message;

      const failedCollection = await this.collectionRepository.create(collection);
      throw error;
    }
  }

  // Process specimen collection
  async processCollection(collectionId, collectionData) {
    const collection = await this.collectionRepository.getCollection(collectionId);

    if (!collection) {
      throw new Error(`Collection not found: ${collectionId}`);
    }

    collection.status = 'in_progress';
    collection.collectionTime = new Date().toISOString();

    for (const specimenData of collectionData.specimens) {
      const specimen = await this.processSpecimenCollection(specimenData, collection);
      collection.specimens.push(specimen);
    }

    // Perform quality checks
    const qualityChecks = await this.performQualityChecks(collection);
    collection.qualityChecks = qualityChecks;

    // Validate collection completeness
    const validation = await this.validateCollectionCompleteness(collection);
    if (!validation.valid) {
      throw new Error(`Collection validation failed: ${validation.errors.join(', ')}`);
    }

    // Update collection status
    collection.status = 'completed';
    collection.completedAt = new Date().toISOString();

    // Trigger transportation
    await this.initiateTransportation(collection);

    const updatedCollection = await this.collectionRepository.update(collection);
    return updatedCollection;
  }

  // Process individual specimen collection
  async processSpecimenCollection(specimenData, collection) {
    const specimen = {
      id: generateUUID(),
      collectionId: collection.id,
      specimenType: specimenData.specimenType,
      containerType: specimenData.containerType,
      volume: specimenData.volume,
      barcode: specimenData.barcode,
      collectedAt: new Date().toISOString(),
      collectorId: collection.collectorId,
      quality: {
        adequate: true,
        issues: [],
        score: null,
      },
      storage: {
        temperature: specimenData.temperature,
        conditions: specimenData.conditions,
        location: null,
      },
      status: 'collected',
    };

    // Validate specimen quality
    const qualityValidation = await this.validateSpecimenQuality(specimen);
    specimen.quality = qualityValidation;

    // Generate barcode if not provided
    if (!specimen.barcode) {
      specimen.barcode = await this.barcodeEngine.generateBarcode(specimen.id);
    }

    // Print specimen label
    const label = await this.printSpecimenLabel(specimen);
    specimen.labelId = label.id;

    return specimen;
  }

  // Validate specimen quality
  async validateSpecimenQuality(specimen) {
    const quality = {
      adequate: true,
      issues: [],
      score: 100,
      recommendations: [],
    };

    // Check volume adequacy
    const volumeCheck = await this.checkVolumeAdequacy(specimen);
    if (!volumeCheck.adequate) {
      quality.adequate = false;
      quality.issues.push(volumeCheck.issue);
      quality.score -= 20;
      quality.recommendations.push(volumeCheck.recommendation);
    }

    // Check specimen integrity
    const integrityCheck = await this.checkSpecimenIntegrity(specimen);
    if (!integrityCheck.intact) {
      quality.adequate = false;
      quality.issues.push(integrityCheck.issue);
      quality.score -= 30;
      quality.recommendations.push(integrityCheck.recommendation);
    }

    // Check container integrity
    const containerCheck = await this.checkContainerIntegrity(specimen);
    if (!containerCheck.intact) {
      quality.adequate = false;
      quality.issues.push(containerCheck.issue);
      quality.score -= 25;
      quality.recommendations.push(containerCheck.recommendation);
    }

    // Check labeling accuracy
    const labelingCheck = await this.checkLabelingAccuracy(specimen);
    if (!labelingCheck.accurate) {
      quality.issues.push(labelingCheck.issue);
      quality.score -= 15;
      quality.recommendations.push(labelingCheck.recommendation);
    }

    // Check temperature requirements
    const temperatureCheck = await this.checkTemperatureRequirements(specimen);
    if (!temperatureCheck.withinRange) {
      quality.issues.push(temperatureCheck.issue);
      quality.score -= 10;
      quality.recommendations.push(temperatureCheck.recommendation);
    }

    return quality;
  }

  // Generate specimen labels
  async generateSpecimenLabels(specimens) {
    const labels = [];

    for (const specimen of specimens) {
      const label = {
        id: generateUUID(),
        specimenId: specimen.id,
        barcode: await this.barcodeEngine.generateBarcode(specimen.id),
        qrCode: await this.barcodeEngine.generateQRCode(specimen.id),
        patientInfo: await this.getPatientLabelInfo(specimen.patientId),
        specimenInfo: {
          type: specimen.specimenType,
          collectionDate: new Date().toISOString(),
          volume: specimen.volume,
          tests: specimen.tests,
        },
        storageInfo: {
          temperature: specimen.temperatureRequirement,
          stability: specimen.stability,
          handling: specimen.handlingInstructions,
        },
        printedAt: null,
        status: 'generated',
      };

      labels.push(label);
    }

    return labels;
  }

  // Print specimen label
  async printSpecimenLabel(specimen) {
    const label = {
      id: generateUUID(),
      specimenId: specimen.id,
      template: 'standard_specimen_label',
      content: await this.generateLabelContent(specimen),
      printedAt: new Date().toISOString(),
      printerId: await this.getAvailablePrinter(),
      status: 'printed',
    };

    // Send to printer
    const printResult = await this.labelPrinter.print(label);
    label.printResult = printResult;

    return label;
  }

  // Generate label content
  async generateLabelContent(specimen) {
    const content = {
      header: {
        facilityName: await this.getFacilityName(),
        logo: await this.getFacilityLogo(),
        emergencyContact: await this.getEmergencyContact(),
      },
      patient: {
        name: await this.getPatientName(specimen.patientId),
        id: specimen.patientId,
        dob: await this.getPatientDOB(specimen.patientId),
        mrn: await this.getPatientMRN(specimen.patientId),
      },
      specimen: {
        id: specimen.id,
        barcode: specimen.barcode,
        type: specimen.specimenType,
        collectedAt: specimen.collectedAt,
        volume: specimen.volume,
        tests: specimen.tests,
      },
      requirements: {
        temperature: specimen.storage.temperature,
        stability: specimen.stability,
        handling: specimen.handlingInstructions,
      },
      warnings: await this.getSpecimenWarnings(specimen),
    };

    return content;
  }
}
```javascript

## Transportation and Logistics

### Specimen Tracking System

```javascript
// Specimen transportation management
class SpecimenTransportManager {
  constructor() {
    this.transportRepository = new TransportRepository();
    this.trackingEngine = new TrackingEngine();
    this.temperatureMonitor = new TemperatureMonitor();
    this.logisticsEngine = new LogisticsEngine();
    this.notificationService = new NotificationService();
  }

  // Initiate specimen transportation
  async initiateTransportation(collection) {
    const transport = {
      id: generateUUID(),
      collectionId: collection.id,
      specimens: collection.specimens,
      origin: await this.getOriginLocation(collection),
      destination: await this.getDestinationLocation(collection),
      carrier: null,
      trackingNumber: await this.generateTrackingNumber(),
      status: 'pending',
      checkpoints: [],
      temperatureLogs: [],
      estimatedArrival: null,
      actualArrival: null,
      createdAt: new Date().toISOString(),
    };

    try {
      // Select optimal carrier
      const carrier = await this.selectOptimalCarrier(transport);
      transport.carrier = carrier;

      // Calculate estimated arrival
      transport.estimatedArrival = await this.calculateEstimatedArrival(transport);

      // Package specimens
      const packaging = await this.packageSpecimens(transport);
      transport.packaging = packaging;

      // Initialize temperature monitoring
      const temperatureMonitoring = await this.initializeTemperatureMonitoring(transport);
      transport.temperatureMonitoring = temperatureMonitoring;

      // Create chain of custody record
      const chainOfCustody = await this.createChainOfCustody(transport);
      transport.chainOfCustody = chainOfCustody;

      // Store transport record
      const savedTransport = await this.transportRepository.create(transport);

      // Notify stakeholders
      await this.notifyTransportInitiated(savedTransport);

      return savedTransport;
    } catch (error) {
      transport.status = 'failed';
      transport.error = error.message;

      const failedTransport = await this.transportRepository.create(transport);
      throw error;
    }
  }

  // Track specimen during transportation
  async trackTransportation(transportId, trackingData) {
    const transport = await this.transportRepository.getTransport(transportId);

    if (!transport) {
      throw new Error(`Transport not found: ${transportId}`);
    }

    const checkpoint = {
      id: generateUUID(),
      transportId: transportId,
      timestamp: new Date().toISOString(),
      location: trackingData.location,
      status: trackingData.status,
      temperature: trackingData.temperature,
      humidity: trackingData.humidity,
      handler: trackingData.handler,
      notes: trackingData.notes,
      signature: trackingData.signature,
    };

    // Validate checkpoint data
    const validation = await this.validateCheckpoint(checkpoint);
    if (!validation.valid) {
      throw new Error(`Checkpoint validation failed: ${validation.errors.join(', ')}`);
    }

    // Add checkpoint to transport
    transport.checkpoints.push(checkpoint);

    // Check for temperature excursions
    if (checkpoint.temperature) {
      const temperatureCheck = await this.checkTemperatureExcursion(
        checkpoint.temperature,
        transport.specimens
      );

      if (temperatureCheck.excursion) {
        await this.handleTemperatureExcursion(transport, checkpoint, temperatureCheck);
      }
    }

    // Update transport status
    transport.status = this.determineTransportStatus(transport);

    // Check for delays
    const delayCheck = await this.checkForDelays(transport);
    if (delayCheck.delayed) {
      await this.handleTransportDelay(transport, delayCheck);
    }

    // Update estimated arrival if needed
    const arrivalUpdate = await this.updateEstimatedArrival(transport, checkpoint);
    if (arrivalUpdate.updated) {
      transport.estimatedArrival = arrivalUpdate.newArrival;
      await this.notifyArrivalUpdate(transport);
    }

    const updatedTransport = await this.transportRepository.update(transport);
    return updatedTransport;
  }

  // Handle temperature excursion
  async handleTemperatureExcursion(transport, checkpoint, excursion) {
    const alert = {
      id: generateUUID(),
      transportId: transport.id,
      type: 'temperature_excursion',
      severity: excursion.severity,
      checkpointId: checkpoint.id,
      temperature: checkpoint.temperature,
      expectedRange: excursion.expectedRange,
      duration: excursion.duration,
      impact: excursion.impact,
      actions: [],
      createdAt: new Date().toISOString(),
    };

    // Determine required actions
    if (excursion.severity === 'critical') {
      alert.actions.push('immediate_return');
      alert.actions.push('specimen_rejection');
      alert.actions.push('patient_notification');
    } else if (excursion.severity === 'major') {
      alert.actions.push('expedited_delivery');
      alert.actions.push('quality_review');
      alert.actions.push('documentation');
    } else {
      alert.actions.push('monitor_closely');
      alert.actions.push('document_incident');
    }

    // Execute actions
    for (const action of alert.actions) {
      await this.executeTemperatureAction(transport, alert, action);
    }

    // Notify stakeholders
    await this.notifyTemperatureExcursion(transport, alert);

    // Log incident
    await this.logTemperatureIncident(transport, alert);

    return alert;
  }

  // Complete transportation
  async completeTransportation(transportId, completionData) {
    const transport = await this.transportRepository.getTransport(transportId);

    if (!transport) {
      throw new Error(`Transport not found: ${transportId}`);
    }

    transport.status = 'delivered';
    transport.actualArrival = new Date().toISOString();
    transport.receivedBy = completionData.receivedBy;
    transport.receivedAt = completionData.receivedAt;
    transport.condition = completionData.condition;

    // Perform final quality check
    const finalCheck = await this.performFinalQualityCheck(transport);
    transport.finalQualityCheck = finalCheck;

    // Update chain of custody
    await this.updateChainOfCustody(transport, completionData);

    // Generate transportation report
    const report = await this.generateTransportReport(transport);
    transport.report = report;

    // Notify completion
    await this.notifyTransportCompleted(transport);

    const updatedTransport = await this.transportRepository.update(transport);
    return updatedTransport;
  }

  // Generate transport report
  async generateTransportReport(transport) {
    const report = {
      transportId: transport.id,
      summary: {
        origin: transport.origin,
        destination: transport.destination,
        carrier: transport.carrier,
        duration: this.calculateDuration(transport),
        distance: transport.distance,
        status: transport.status,
      },
      specimens: {
        total: transport.specimens.length,
        types: this.categorizeSpecimens(transport.specimens),
        condition: transport.condition,
      },
      checkpoints: {
        total: transport.checkpoints.length,
        onTime: this.countOnTimeCheckpoints(transport),
        delays: this.identifyDelays(transport),
      },
      temperature: {
        logs: transport.temperatureLogs,
        excursions: this.identifyTemperatureExcursions(transport),
        compliance: this.calculateTemperatureCompliance(transport),
      },
      quality: {
        initialCondition: transport.initialCondition,
        finalCondition: transport.condition,
        incidents: transport.incidents,
        recommendations: this.generateRecommendations(transport),
      },
      chainOfCustody: transport.chainOfCustody,
      generatedAt: new Date().toISOString(),
    };

    return report;
  }
}
```javascript

## Laboratory Processing

### Specimen Accessioning and Processing

```javascript
// Laboratory processing system
class LaboratoryProcessingManager {
  constructor() {
    this.processingRepository = new ProcessingRepository();
    this.accessionEngine = new AccessionEngine();
    this.qualityControl = new QualityControl();
    this.storageManager = new StorageManager();
    this.workflowEngine = new WorkflowEngine();
  }

  // Accession specimens
  async accessionSpecimens(transport) {
    const accession = {
      id: generateUUID(),
      transportId: transport.id,
      specimens: [],
      accessionNumber: await this.generateAccessionNumber(),
      accessionedBy: null,
      accessionedAt: null,
      qualityChecks: [],
      storage: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Verify transport completion
      const verification = await this.verifyTransportCompletion(transport);
      if (!verification.verified) {
        throw new Error(`Transport verification failed: ${verification.issues.join(', ')}`);
      }

      // Process each specimen
      for (const specimen of transport.specimens) {
        const accessionedSpecimen = await this.processSpecimenAccession(specimen, accession);
        accession.specimens.push(accessionedSpecimen);
      }

      // Perform quality control checks
      const qualityChecks = await this.performAccessionQualityChecks(accession);
      accession.qualityChecks = qualityChecks;

      // Assign storage locations
      const storage = await this.assignStorageLocations(accession.specimens);
      accession.storage = storage;

      // Update specimen status
      await this.updateSpecimenStatus(accession.specimens, 'accessioned');

      // Complete accession
      accession.status = 'completed';
      accession.accessionedAt = new Date().toISOString();

      const savedAccession = await this.processingRepository.createAccession(accession);
      return savedAccession;
    } catch (error) {
      accession.status = 'failed';
      accession.error = error.message;

      const failedAccession = await this.processingRepository.createAccession(accession);
      throw error;
    }
  }

  // Process individual specimen accession
  async processSpecimenAccession(specimen, accession) {
    const accessionedSpecimen = {
      id: specimen.id,
      accessionId: accession.id,
      accessionNumber: accession.accessionNumber,
      laboratoryId: await this.getLaboratoryId(),
      receivedCondition: await this.assessReceivedCondition(specimen),
      volume: await this.measureVolume(specimen),
      quality: {
        acceptable: true,
        issues: [],
        score: 100,
      },
      storage: {
        location: null,
        temperature: null,
        conditions: null,
      },
      tests: await this.determineRequiredTests(specimen),
      priority: await this.determinePriority(specimen),
      status: 'accessioned',
      accessionedAt: new Date().toISOString(),
    };

    // Verify specimen identity
    const identityVerification = await this.verifySpecimenIdentity(specimen);
    if (!identityVerification.verified) {
      accessionedSpecimen.quality.acceptable = false;
      accessionedSpecimen.quality.issues.push('Identity verification failed');
      accessionedSpecimen.quality.score -= 50;
    }

    // Check specimen adequacy
    const adequacyCheck = await this.checkSpecimenAdequacy(specimen);
    if (!adequacyCheck.adequate) {
      accessionedSpecimen.quality.acceptable = false;
      accessionedSpecimen.quality.issues.push(adequacyCheck.reason);
      accessionedSpecimen.quality.score -= 30;
    }

    // Perform visual inspection
    const visualInspection = await this.performVisualInspection(specimen);
    accessionedSpecimen.visualInspection = visualInspection;

    if (visualInspection.defects.length > 0) {
      accessionedSpecimen.quality.score -= visualInspection.defects.length * 5;
    }

    return accessionedSpecimen;
  }

  // Process specimens for testing
  async processForTesting(accessionedSpecimens) {
    const processing = {
      id: generateUUID(),
      specimens: accessionedSpecimens,
      workflow: await this.createTestingWorkflow(accessionedSpecimens),
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      completedAt: null,
      results: [],
    };

    try {
      // Execute testing workflow
      for (const step of processing.workflow.steps) {
        const stepResult = await this.executeWorkflowStep(step, processing.specimens);
        processing.results.push(stepResult);
      }

      // Perform final quality control
      const finalQC = await this.performFinalQualityControl(processing);
      processing.finalQC = finalQC;

      // Update specimen status
      await this.updateSpecimenStatus(processing.specimens, 'processed');

      processing.status = 'completed';
      processing.completedAt = new Date().toISOString();

      const savedProcessing = await this.processingRepository.createProcessing(processing);
      return savedProcessing;
    } catch (error) {
      processing.status = 'failed';
      processing.error = error.message;

      const failedProcessing = await this.processingRepository.createProcessing(processing);
      throw error;
    }
  }

  // Create testing workflow
  async createTestingWorkflow(specimens) {
    const workflow = {
      id: generateUUID(),
      specimenCount: specimens.length,
      steps: [],
      estimatedDuration: 0,
      priority: this.determineWorkflowPriority(specimens),
    };

    // Determine required processing steps
    const requiredSteps = await this.determineRequiredSteps(specimens);

    for (const stepConfig of requiredSteps) {
      const step = {
        id: generateUUID(),
        name: stepConfig.name,
        type: stepConfig.type,
        sequence: stepConfig.sequence,
        duration: stepConfig.duration,
        requirements: stepConfig.requirements,
        equipment: await this.getRequiredEquipment(stepConfig),
        personnel: await this.getRequiredPersonnel(stepConfig),
        status: 'pending',
        startedAt: null,
        completedAt: null,
        results: null,
      };

      workflow.steps.push(step);
      workflow.estimatedDuration += step.duration;
    }

    // Sort steps by sequence
    workflow.steps.sort((a, b) => a.sequence - b.sequence);

    return workflow;
  }

  // Execute workflow step
  async executeWorkflowStep(step, specimens) {
    step.status = 'in_progress';
    step.startedAt = new Date().toISOString();

    const stepResult = {
      stepId: step.id,
      stepName: step.name,
      specimens: [],
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      completedAt: null,
      issues: [],
      quality: null,
    };

    try {
      // Prepare specimens for step
      const preparedSpecimens = await this.prepareSpecimensForStep(specimens, step);

      // Execute step processing
      for (const specimen of preparedSpecimens) {
        const specimenResult = await this.processSpecimenStep(specimen, step);
        stepResult.specimens.push(specimenResult);
      }

      // Perform quality control
      const qualityControl = await this.performStepQualityControl(stepResult);
      stepResult.quality = qualityControl;

      // Check for issues
      const issues = await this.identifyStepIssues(stepResult);
      stepResult.issues = issues;

      stepResult.status = 'completed';
      stepResult.completedAt = new Date().toISOString();
      step.status = 'completed';
      step.completedAt = new Date().toISOString();
    } catch (error) {
      stepResult.status = 'failed';
      stepResult.error = error.message;
      step.status = 'failed';
      step.error = error.message;
    }

    return stepResult;
  }

  // Manage specimen storage
  async manageSpecimenStorage(specimens) {
    const storage = {
      id: generateUUID(),
      specimens: specimens,
      locations: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    for (const specimen of specimens) {
      const location = await this.assignStorageLocation(specimen);
      storage.locations.push(location);

      // Update specimen storage info
      specimen.storage = {
        locationId: location.id,
        temperature: location.temperature,
        conditions: location.conditions,
        storedAt: new Date().toISOString(),
      };

      // Store specimen
      await this.storeSpecimen(specimen, location);
    }

    const savedStorage = await this.processingRepository.createStorage(storage);
    return savedStorage;
  }
}
```text

This comprehensive specimen management system provides healthcare organizations with powerful tools for managing the entire specimen lifecycle, ensuring specimen integrity, maintaining chain of custody, and optimizing laboratory workflows while supporting regulatory compliance and patient safety.
````
