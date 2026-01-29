---
title: 'Barcode & RFID'
sidebar_label: 'Barcode & RFID'
description: 'Comprehensive barcode and RFID tracking system for healthcare asset and patient management in ZARISH SPHERE'
keywords:
  [barcode, rfid, healthcare tracking, asset management, patient identification, zarish sphere]
---

# Barcode & RFID

## Overview

ZARISH SPHERE Barcode & RFID provides a comprehensive tracking and identification system for healthcare environments. Our platform enables real-time tracking of patients, assets, medications, and specimens using both barcode and RFID technologies, ensuring accuracy, efficiency, and patient safety while supporting regulatory compliance and operational optimization.

## Tracking Technology Architecture

### Identification Framework

````text
Barcode & RFID Framework
├── Barcode Systems
│   ├── 1D Barcodes
│   ├── 2D QR Codes
│   ├── Barcode Generation
│   └── Barcode Scanning
├── RFID Systems
│   ├── Passive RFID
│   ├── Active RFID
│   ├── RFID Readers
│   └── RFID Tags
├── Integration Layer
│   ├── Device Management
│   ├── Data Processing
│   ├── Real-time Tracking
│   └── Location Services
├── Application Layer
│   ├── Patient Tracking
│   ├── Asset Management
│   ├── Inventory Control
│   └── Workflow Automation
└── Analytics & Reporting
    ├── Movement Analytics
    ├── Utilization Reports
    ├── Compliance Tracking
    └── Performance Metrics
```javascript

### Technology Comparison

| Technology       | Range         | Accuracy  | Cost   | Use Cases                         | Battery |
| ---------------- | ------------- | --------- | ------ | --------------------------------- | ------- |
| **1D Barcode**   | Line of sight | High      | Low    | Medications, specimens            | None    |
| **2D QR Code**   | Line of sight | Very High | Low    | Patient IDs, documents            | None    |
| **Passive RFID** | 1-10 meters   | Medium    | Medium | Assets, equipment                 | None    |
| **Active RFID**  | 100+ meters   | High      | High   | Patient tracking, critical assets | Yes     |

## Barcode Management System

### Barcode Generation and Scanning

```javascript
// Barcode management system
class BarcodeManagementSystem {
  constructor() {
    this.barcodeRepository = new BarcodeRepository();
    this.generator = new BarcodeGenerator();
    this.scanner = new BarcodeScanner();
    this.validator = new BarcodeValidator();
    this.integrationEngine = new IntegrationEngine();
  }

  // Generate barcode for item
  async generateBarcode(itemData) {
    const barcode = {
      id: generateUUID(),
      itemId: itemData.itemId,
      itemType: itemData.itemType, // 'patient', 'medication', 'asset', 'specimen'
      barcodeType: itemData.barcodeType || 'code128',
      data: this.encodeBarcodeData(itemData),
      format: itemData.format || 'linear',
      image: null,
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: itemData.generatedBy,
        facility: itemData.facility,
        department: itemData.department,
      },
      status: 'generated',
    };

    try {
      // Generate barcode image
      const barcodeImage = await this.generator.generateImage(barcode);
      barcode.image = barcodeImage;

      // Validate barcode
      const validation = await this.validator.validate(barcode);
      if (!validation.valid) {
        throw new Error(`Barcode validation failed: ${validation.errors.join(', ')}`);
      }

      // Store barcode record
      const savedBarcode = await this.barcodeRepository.create(barcode);

      // Print barcode label
      if (itemData.printLabel) {
        await this.printBarcodeLabel(savedBarcode, itemData.labelConfig);
      }

      return savedBarcode;
    } catch (error) {
      barcode.status = 'failed';
      barcode.error = error.message;

      const failedBarcode = await this.barcodeRepository.create(barcode);
      throw error;
    }
  }

  // Encode barcode data
  encodeBarcodeData(itemData) {
    const data = {
      id: itemData.itemId,
      type: itemData.itemType,
      timestamp: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      facility: itemData.facilityCode || 'DEFAULT',
      checksum: null,
    };

    // Generate checksum
    data.checksum = this.generateChecksum(data);

    // Encode as string
    return `${data.type}-${data.id}-${data.timestamp}-${data.facility}-${data.checksum}`;
  }

  // Generate checksum
  generateChecksum(data) {
    const dataString = `${data.id}${data.type}${data.timestamp}${data.facility}`;
    let checksum = 0;

    for (let i = 0; i < dataString.length; i++) {
      checksum += dataString.charCodeAt(i) * (i + 1);
    }

    return (checksum % 1000).toString().padStart(3, '0');
  }

  // Scan and process barcode
  async scanBarcode(scanData) {
    const scan = {
      id: generateUUID(),
      barcodeData: scanData.barcodeData,
      scannerId: scanData.scannerId,
      location: scanData.location,
      timestamp: new Date().toISOString(),
      decodedData: null,
      item: null,
      status: 'processing',
    };

    try {
      // Decode barcode data
      const decodedData = await this.decodeBarcode(scan.barcodeData);
      scan.decodedData = decodedData;

      // Validate checksum
      const checksumValid = this.validateChecksum(decodedData);
      if (!checksumValid) {
        throw new Error('Invalid barcode checksum');
      }

      // Get item information
      const item = await this.getItemByBarcode(decodedData);
      scan.item = item;

      // Record scan event
      await this.recordScanEvent(scan);

      // Trigger actions based on item type
      await this.processScanActions(scan);

      scan.status = 'completed';

      const savedScan = await this.barcodeRepository.createScan(scan);
      return savedScan;
    } catch (error) {
      scan.status = 'failed';
      scan.error = error.message;

      const failedScan = await this.barcodeRepository.createScan(scan);
      throw error;
    }
  }

  // Decode barcode data
  async decodeBarcode(barcodeData) {
    const parts = barcodeData.split('-');

    if (parts.length !== 5) {
      throw new Error('Invalid barcode format');
    }

    return {
      type: parts[0],
      id: parts[1],
      timestamp: parts[2],
      facility: parts[3],
      checksum: parts[4],
    };
  }

  // Validate checksum
  validateChecksum(decodedData) {
    const dataString = `${decodedData.id}${decodedData.type}${decodedData.timestamp}${decodedData.facility}`;
    let checksum = 0;

    for (let i = 0; i < dataString.length; i++) {
      checksum += dataString.charCodeAt(i) * (i + 1);
    }

    const calculatedChecksum = (checksum % 1000).toString().padStart(3, '0');
    return calculatedChecksum === decodedData.checksum;
  }

  // Get item by barcode
  async getItemByBarcode(decodedData) {
    switch (decodedData.type) {
      case 'patient':
        return await this.getPatient(decodedData.id);
      case 'medication':
        return await this.getMedication(decodedData.id);
      case 'asset':
        return await this.getAsset(decodedData.id);
      case 'specimen':
        return await this.getSpecimen(decodedData.id);
      default:
        throw new Error(`Unknown item type: ${decodedData.type}`);
    }
  }

  // Process scan actions
  async processScanActions(scan) {
    const actions = await this.getScanActions(scan.item.type, scan.location);

    for (const action of actions) {
      await this.executeScanAction(scan, action);
    }
  }

  // Get scan actions
  async getScanActions(itemType, location) {
    const actions = [];

    switch (itemType) {
      case 'patient':
        actions.push(
          { type: 'update_patient_location', priority: 'high' },
          { type: 'check_appointments', priority: 'medium' },
          { type: 'update_medication_administration', priority: 'high' }
        );
        break;
      case 'medication':
        actions.push(
          { type: 'update_medication_location', priority: 'high' },
          { type: 'check_expiry', priority: 'medium' },
          { type: 'update_inventory', priority: 'medium' }
        );
        break;
      case 'asset':
        actions.push(
          { type: 'update_asset_location', priority: 'high' },
          { type: 'check_maintenance', priority: 'medium' },
          { type: 'update_utilization', priority: 'low' }
        );
        break;
      case 'specimen':
        actions.push(
          { type: 'update_specimen_location', priority: 'high' },
          { type: 'check_temperature', priority: 'high' },
          { type: 'update_chain_of_custody', priority: 'high' }
        );
        break;
    }

    return actions;
  }

  // Execute scan action
  async executeScanAction(scan, action) {
    switch (action.type) {
      case 'update_patient_location':
        await this.updatePatientLocation(scan);
        break;
      case 'update_medication_location':
        await this.updateMedicationLocation(scan);
        break;
      case 'update_asset_location':
        await this.updateAssetLocation(scan);
        break;
      case 'update_specimen_location':
        await this.updateSpecimenLocation(scan);
        break;
      case 'check_appointments':
        await this.checkPatientAppointments(scan);
        break;
      case 'check_expiry':
        await this.checkMedicationExpiry(scan);
        break;
      case 'check_maintenance':
        await this.checkAssetMaintenance(scan);
        break;
      case 'check_temperature':
        await this.checkSpecimenTemperature(scan);
        break;
    }
  }

  // Update patient location
  async updatePatientLocation(scan) {
    const locationUpdate = {
      patientId: scan.item.id,
      location: scan.location,
      timestamp: scan.timestamp,
      source: 'barcode_scan',
      scannerId: scan.scannerId,
    };

    await this.integrationEngine.updatePatientLocation(locationUpdate);
  }

  // Update medication location
  async updateMedicationLocation(scan) {
    const locationUpdate = {
      medicationId: scan.item.id,
      location: scan.location,
      timestamp: scan.timestamp,
      source: 'barcode_scan',
      scannerId: scan.scannerId,
    };

    await this.integrationEngine.updateMedicationLocation(locationUpdate);
  }

  // Check medication expiry
  async checkMedicationExpiry(scan) {
    const medication = scan.item;

    if (medication.expiryDate) {
      const daysToExpiry = this.calculateDaysToExpiry(medication.expiryDate);

      if (daysToExpiry <= 30) {
        await this.sendExpiryAlert(medication, daysToExpiry);
      }
    }
  }

  // Calculate days to expiry
  calculateDaysToExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Send expiry alert
  async sendExpiryAlert(medication, daysToExpiry) {
    const alert = {
      type: 'medication_expiry',
      medicationId: medication.id,
      medicationName: medication.name,
      daysToExpiry: daysToExpiry,
      severity: daysToExpiry <= 7 ? 'critical' : 'warning',
      timestamp: new Date().toISOString(),
    };

    await this.integrationEngine.sendAlert(alert);
  }
}
```javascript

## RFID Tracking System

### Real-time Location Services

```javascript
// RFID tracking system
class RFIDTrackingSystem {
  constructor() {
    this.rfidRepository = new RFIDRepository();
    this.readerManager = new ReaderManager();
    this.tagManager = new TagManager();
    this.locationEngine = new LocationEngine();
    this.analyticsEngine = new AnalyticsEngine();
  }

  // Initialize RFID system
  async initializeRFIDSystem(facilityId) {
    const system = {
      id: generateUUID(),
      facilityId: facilityId,
      readers: [],
      tags: [],
      zones: [],
      status: 'initializing',
      createdAt: new Date().toISOString(),
    };

    try {
      // Load RFID readers
      const readers = await this.loadReaders(facilityId);
      system.readers = readers;

      // Define tracking zones
      const zones = await this.defineTrackingZones(facilityId);
      system.zones = zones;

      // Initialize readers
      for (const reader of readers) {
        await this.initializeReader(reader);
      }

      // Start tracking
      await this.startTracking(system);

      system.status = 'active';
      const savedSystem = await this.rfidRepository.create(system);

      return savedSystem;
    } catch (error) {
      system.status = 'failed';
      system.error = error.message;

      const failedSystem = await this.rfidRepository.create(system);
      throw error;
    }
  }

  // Load RFID readers
  async loadReaders(facilityId) {
    const readers = [
      {
        id: generateUUID(),
        facilityId: facilityId,
        name: 'Entrance Reader',
        location: 'main_entrance',
        type: 'passive',
        range: 5, // meters
        status: 'active',
        coordinates: { x: 0, y: 0, z: 0 },
      },
      {
        id: generateUUID(),
        facilityId: facilityId,
        name: 'Emergency Room Reader',
        location: 'emergency_room',
        type: 'active',
        range: 10, // meters
        status: 'active',
        coordinates: { x: 50, y: 20, z: 0 },
      },
      {
        id: generateUUID(),
        facilityId: facilityId,
        name: 'Pharmacy Reader',
        location: 'pharmacy',
        type: 'passive',
        range: 3, // meters
        status: 'active',
        coordinates: { x: 100, y: 50, z: 0 },
      },
    ];

    return readers;
  }

  // Define tracking zones
  async defineTrackingZones(facilityId) {
    const zones = [
      {
        id: generateUUID(),
        facilityId: facilityId,
        name: 'Public Area',
        type: 'public',
        readers: ['main_entrance'],
        coordinates: {
          x: { min: 0, max: 100 },
          y: { min: 0, max: 100 },
          z: { min: 0, max: 10 },
        },
        accessLevel: 'unrestricted',
      },
      {
        id: generateUUID(),
        facilityId: facilityId,
        name: 'Clinical Area',
        type: 'clinical',
        readers: ['emergency_room', 'pharmacy'],
        coordinates: {
          x: { min: 101, max: 300 },
          y: { min: 0, max: 200 },
          z: { min: 0, max: 10 },
        },
        accessLevel: 'restricted',
      },
      {
        id: generateUUID(),
        facilityId: facilityId,
        name: 'Restricted Area',
        type: 'restricted',
        readers: ['pharmacy'],
        coordinates: {
          x: { min: 301, max: 400 },
          y: { min: 0, max: 100 },
          z: { min: 0, max: 10 },
        },
        accessLevel: 'authorized_only',
      },
    ];

    return zones;
  }

  // Initialize reader
  async initializeReader(reader) {
    const readerConfig = {
      id: reader.id,
      name: reader.name,
      location: reader.location,
      type: reader.type,
      range: reader.range,
      coordinates: reader.coordinates,
      status: 'initializing',
      lastHeartbeat: new Date().toISOString(),
    };

    // Connect to reader hardware
    await this.connectToReader(readerConfig);

    // Configure reader settings
    await this.configureReader(readerConfig);

    // Start reader monitoring
    await this.startReaderMonitoring(readerConfig);

    readerConfig.status = 'active';
    return readerConfig;
  }

  // Start tracking
  async startTracking(system) {
    // Start real-time tracking engine
    this.trackingEngine = new TrackingEngine(system);

    // Start location calculation
    this.locationEngine.start(system);

    // Start analytics collection
    this.analyticsEngine.start(system);

    // Set up event handlers
    this.setupEventHandlers(system);
  }

  // Process RFID read event
  async processRFIDRead(readEvent) {
    const event = {
      id: generateUUID(),
      tagId: readEvent.tagId,
      readerId: readEvent.readerId,
      signalStrength: readEvent.signalStrength,
      timestamp: new Date().toISOString(),
      location: null,
      item: null,
      processed: false,
    };

    try {
      // Get item information
      const item = await this.getItemByTag(readEvent.tagId);
      event.item = item;

      // Calculate location
      const location = await this.locationEngine.calculateLocation(readEvent);
      event.location = location;

      // Determine zone
      const zone = await this.determineZone(location);
      event.zone = zone;

      // Check access permissions
      const accessCheck = await this.checkAccessPermissions(item, zone);
      if (!accessCheck.allowed) {
        await this.handleAccessViolation(event, accessCheck);
      }

      // Update item location
      await this.updateItemLocation(item, location);

      // Record tracking event
      await this.recordTrackingEvent(event);

      // Trigger zone-specific actions
      await this.processZoneActions(event, zone);

      event.processed = true;

      const savedEvent = await this.rfidRepository.createEvent(event);
      return savedEvent;
    } catch (error) {
      event.error = error.message;
      event.processed = false;

      const failedEvent = await this.rfidRepository.createEvent(event);
      throw error;
    }
  }

  // Get item by tag
  async getItemByTag(tagId) {
    const tag = await this.tagManager.getTag(tagId);
    if (!tag) {
      throw new Error(`Tag not found: ${tagId}`);
    }

    return await this.getItemById(tag.itemId);
  }

  // Calculate location
  async calculateLocation(readEvent) {
    const reader = await this.readerManager.getReader(readEvent.readerId);

    // Use trilateration if multiple readers detect the tag
    const concurrentReads = await this.getConcurrentReads(readEvent.tagId, readEvent.timestamp);

    if (concurrentReads.length >= 3) {
      return await this.trilaterateLocation(concurrentReads);
    } else {
      // Single reader - estimate location based on signal strength
      return this.estimateLocationFromSignal(readEvent, reader);
    }
  }

  // Trilaterate location
  async trilaterateLocation(reads) {
    // Simplified trilateration algorithm
    // In production, use more sophisticated algorithms

    const locations = reads.map((read) => ({
      x: read.reader.coordinates.x,
      y: read.reader.coordinates.y,
      z: read.reader.coordinates.z,
      distance: this.calculateDistanceFromSignal(read.signalStrength),
    }));

    // Calculate intersection point
    const intersection = this.calculateIntersection(locations);

    return {
      x: intersection.x,
      y: intersection.y,
      z: intersection.z,
      accuracy: intersection.accuracy,
      method: 'trilateration',
    };
  }

  // Calculate distance from signal strength
  calculateDistanceFromSignal(signalStrength) {
    // Simplified distance calculation
    // RSSI to distance conversion
    const referenceRSSI = -50; // Reference signal strength at 1 meter
    const pathLossExponent = 2.5; // Environment-dependent

    const distance = Math.pow(10, (referenceRSSI - signalStrength) / (10 * pathLossExponent));
    return Math.max(0.1, Math.min(distance, 100)); // Clamp between 0.1m and 100m
  }

  // Estimate location from signal
  estimateLocationFromSignal(readEvent, reader) {
    const distance = this.calculateDistanceFromSignal(readEvent.signalStrength);

    // Estimate position within reader's range
    const angle = Math.random() * 2 * Math.PI; // Random angle
    const x = reader.coordinates.x + distance * Math.cos(angle);
    const y = reader.coordinates.y + distance * Math.sin(angle);
    const z = reader.coordinates.z;

    return {
      x: x,
      y: y,
      z: z,
      accuracy: distance * 0.5, // Estimated accuracy
      method: 'signal_estimation',
    };
  }

  // Determine zone
  async determineZone(location) {
    const zones = await this.getZones();

    for (const zone of zones) {
      if (this.isLocationInZone(location, zone)) {
        return zone;
      }
    }

    return null; // Not in any defined zone
  }

  // Check if location is in zone
  isLocationInZone(location, zone) {
    return (
      location.x >= zone.coordinates.x.min &&
      location.x <= zone.coordinates.x.max &&
      location.y >= zone.coordinates.y.min &&
      location.y <= zone.coordinates.y.max &&
      location.z >= zone.coordinates.z.min &&
      location.z <= zone.coordinates.z.max
    );
  }

  // Check access permissions
  async checkAccessPermissions(item, zone) {
    if (!zone) {
      return { allowed: true, reason: 'No zone restrictions' };
    }

    const accessLevel = await this.getItemAccessLevel(item);

    if (accessLevel === 'unrestricted') {
      return { allowed: true, reason: 'Unrestricted access' };
    }

    if (zone.accessLevel === 'unrestricted') {
      return { allowed: true, reason: 'Zone is unrestricted' };
    }

    if (accessLevel === zone.accessLevel) {
      return { allowed: true, reason: 'Access level matches' };
    }

    if (accessLevel === 'authorized_only' && zone.accessLevel === 'restricted') {
      return { allowed: true, reason: 'Authorized access to restricted zone' };
    }

    return {
      allowed: false,
      reason: `Access denied: ${accessLevel} cannot access ${zone.accessLevel} zone`,
    };
  }

  // Handle access violation
  async handleAccessViolation(event, accessCheck) {
    const violation = {
      id: generateUUID(),
      eventId: event.id,
      itemId: event.item.id,
      itemType: event.item.type,
      zoneId: event.zone.id,
      zoneName: event.zone.name,
      violationType: 'unauthorized_access',
      reason: accessCheck.reason,
      timestamp: event.timestamp,
      location: event.location,
      severity: 'high',
    };

    // Record violation
    await this.recordAccessViolation(violation);

    // Send alert
    await this.sendAccessViolationAlert(violation);

    // Log security event
    await this.logSecurityEvent(violation);
  }

  // Process zone actions
  async processZoneActions(event, zone) {
    const actions = await this.getZoneActions(zone.type, event.item.type);

    for (const action of actions) {
      await this.executeZoneAction(event, zone, action);
    }
  }

  // Get zone actions
  async getZoneActions(zoneType, itemType) {
    const actions = [];

    switch (zoneType) {
      case 'restricted':
        if (itemType === 'patient') {
          actions.push(
            { type: 'log_patient_entry', priority: 'high' },
            { type: 'notify_clinical_staff', priority: 'medium' }
          );
        }
        if (itemType === 'asset') {
          actions.push(
            { type: 'log_asset_usage', priority: 'medium' },
            { type: 'update_utilization', priority: 'low' }
          );
        }
        break;
      case 'clinical':
        if (itemType === 'patient') {
          actions.push(
            { type: 'update_patient_status', priority: 'high' },
            { type: 'check_vitals_monitoring', priority: 'medium' }
          );
        }
        break;
    }

    return actions;
  }

  // Execute zone action
  async executeZoneAction(event, zone, action) {
    switch (action.type) {
      case 'log_patient_entry':
        await this.logPatientEntry(event, zone);
        break;
      case 'notify_clinical_staff':
        await this.notifyClinicalStaff(event, zone);
        break;
      case 'log_asset_usage':
        await this.logAssetUsage(event, zone);
        break;
      case 'update_utilization':
        await this.updateAssetUtilization(event, zone);
        break;
      case 'update_patient_status':
        await this.updatePatientStatus(event, zone);
        break;
      case 'check_vitals_monitoring':
        await this.checkVitalsMonitoring(event);
        break;
    }
  }

  // Generate tracking analytics
  async generateTrackingAnalytics(timeRange) {
    const analytics = {
      timeRange: timeRange,
      movementPatterns: await this.analyzeMovementPatterns(timeRange),
      zoneUtilization: await this.analyzeZoneUtilization(timeRange),
      itemTracking: await this.analyzeItemTracking(timeRange),
      securityEvents: await this.analyzeSecurityEvents(timeRange),
      generatedAt: new Date().toISOString(),
    };

    return analytics;
  }

  // Analyze movement patterns
  async analyzeMovementPatterns(timeRange) {
    const patterns = {
      totalMovements: 0,
      averageMovementTime: 0,
      peakMovementHours: [],
      commonPaths: [],
      zoneTransitions: {},
    };

    // Get movement data
    const movements = await this.getMovements(timeRange);
    patterns.totalMovements = movements.length;

    // Analyze peak hours
    const hourlyMovements = this.groupMovementsByHour(movements);
    patterns.peakMovementHours = this.findPeakHours(hourlyMovements);

    // Analyze common paths
    patterns.commonPaths = this.findCommonPaths(movements);

    // Analyze zone transitions
    patterns.zoneTransitions = this.analyzeZoneTransitions(movements);

    return patterns;
  }
}
```text

This comprehensive barcode and RFID system provides healthcare organizations with powerful tools for real-time tracking, inventory management, patient safety, and operational efficiency while ensuring regulatory compliance and security.
````
