---
title: 'PACS Integration'
sidebar_label: 'PACS Integration'
description: 'Comprehensive PACS (Picture Archiving and Communication System) integration for medical imaging and radiology workflows in ZARISH SPHERE'
keywords: [PACS integration, medical imaging, radiology, DICOM, healthcare imaging, zarish sphere]
---

# PACS Integration

## Overview

ZARISH SPHERE PACS Integration provides a comprehensive system for connecting with Picture Archiving and Communication Systems (PACS) to enable seamless medical imaging workflows. Our platform supports DICOM standards, image acquisition, storage, retrieval, and distribution while ensuring regulatory compliance, image quality, and efficient radiology operations across healthcare facilities.

## PACS Integration Architecture

### Integration Framework

````text
PACS Integration Framework
├── DICOM Communication
│   ├── DICOM Services
│   ├── Image Acquisition
│   ├── Modality Worklist
│   └── Image Storage
├── Image Management
│   ├── Image Processing
│   ├── Quality Control
│   ├── Metadata Extraction
│   └── Archive Management
├── Workflow Integration
│   ├── Radiology Information System
│   ├── Order Management
│   ├── Reporting Integration
│   └── Scheduling
├── Security & Compliance
│   ├── HIPAA Compliance
│   ├── Data Encryption
│   ├── Access Control
│   └── Audit Logging
└── Performance Optimization
    ├── Image Compression
    ├── Caching Strategies
    ├── Load Balancing
    └── Monitoring
```javascript

### Supported DICOM Services

| Service     | Description        | Modality       | Integration Type     | Status    |
| ----------- | ------------------ | -------------- | -------------------- | --------- |
| **C-STORE** | Image Storage      | All modalities | Bidirectional        | ✅ Active |
| **C-FIND**  | Image Query        | All modalities | Query/Retrieve       | ✅ Active |
| **C-MOVE**  | Image Retrieval    | All modalities | Query/Retrieve       | ✅ Active |
| **C-GET**   | Image Get          | All modalities | Query/Retrieve       | ✅ Active |
| **MWL**     | Modality Worklist  | CT, MR, X-Ray  | Worklist Management  | ✅ Active |
| **MPPS**    | Procedure Step     | All modalities | Procedure Tracking   | ✅ Active |
| **StgCmt**  | Storage Commitment | All modalities | Storage Verification | ✅ Active |

## DICOM Integration System

### DICOM Service Manager

```javascript
// PACS integration management system
class PACSIntegrationSystem {
  constructor() {
    this.dicomRepository = new DICOMRepository();
    this.imageProcessor = new ImageProcessor();
    this.dicomService = new DICOMService();
    this.workflowEngine = new WorkflowEngine();
    this.securityEngine = new SecurityEngine();
    this.monitoringEngine = new MonitoringEngine();
  }

  // Initialize PACS integration
  async initializePACSIntegration(pacsConfig) {
    const integration = {
      id: generateUUID(),
      name: pacsConfig.name,
      type: 'pacs_integration',
      status: 'initializing',
      configuration: pacsConfig,
      dicomServices: [],
      modalities: [],
      worklistManager: null,
      imageArchive: null,
      security: null,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: pacsConfig.createdBy,
        facility: pacsConfig.facility,
        version: '1.0'
      }
    };

    try {
      // Validate PACS configuration
      const validation = await this.validatePACSConfig(pacsConfig);
      if (!validation.valid) {
        throw new Error(`PACS validation failed: ${validation.errors.join(', ')}`);
      }

      // Initialize DICOM services
      const dicomServices = await this.initializeDICOMServices(pacsConfig);
      integration.dicomServices = dicomServices;

      // Configure modalities
      const modalities = await this.configureModalities(pacsConfig.modalities);
      integration.modalities = modalities;

      // Set up worklist manager
      const worklistManager = await this.setupWorklistManager(pacsConfig);
      integration.worklistManager = worklistManager;

      // Configure image archive
      const imageArchive = await this.configureImageArchive(pacsConfig);
      integration.imageArchive = imageArchive;

      // Set up security
      const security = await this.setupSecurity(pacsConfig.security);
      integration.security = security;

      // Test DICOM connectivity
      const connectivityTest = await this.testDICOMConnectivity(integration);
      if (!connectivityTest.success) {
        throw new Error(`DICOM connectivity test failed: ${connectivityTest.error}`);
      }

      integration.status = 'active';

      const savedIntegration = await this.dicomRepository.createIntegration(integration);
      return savedIntegration;

    } catch (error) {
      integration.status = 'failed';
      integration.error = error.message;

      const failedIntegration = await this.dicomRepository.createIntegration(integration);
      throw error;
    }
  }

  // Initialize DICOM services
  async initializeDICOMServices(config) {
    const services = [];

    // C-STORE Service (Image Storage)
    const cstoreService = {
      id: generateUUID(),
      name: 'C-STORE',
      type: 'storage',
      port: config.dicomPort || 104,
      enabled: true,
      configuration: {
        maxFileSize: config.maxFileSize || '2GB',
        supportedTransferSyntaxes: [
          '1.2.840.10008.1.2', // Implicit VR Little Endian
          '1.2.840.10008.1.2.1', // Explicit VR Little Endian
          '1.2.840.10008.1.2.2', // Explicit VR Big Endian
          '1.2.840.10008.1.2.5', // JPEG Baseline
          '1.2.840.10008.1.2.4.50', // JPEG Baseline
          '1.2.840.10008.1.2.4.70', // JPEG Lossless
          '1.2.840.10008.1.2.4.80', // JPEG-LS Lossless
          '1.2.840.10008.1.2.4.81', // JPEG-LS Near Lossless
          '1.2.840.10008.1.2.4.90', // JPEG 2000 Lossless
          '1.2.840.10008.1.2.4.91', // JPEG 2000
          '1.2.840.10008.1.2.4.92', // JPEG 2000 Multi-component
          '1.2.840.10008.1.2.4.93', // JPEG 2000 Multi-component Lossless
          '1.2.840.10008.1.2.4.94', // JPIP Referenced
          '1.2.840.10008.1.2.4.95', // JPIP Referenced Lossless
          '1.2.840.10008.1.2.4.100', // MPEG2 Main Profile
          '1.2.840.10008.1.2.4.101', // MPEG2 Main Profile / High Level
          '1.2.840.10008.1.2.4.102', // MPEG-4 AVC/H.264
          '1.2.840.10008.1.2.4.103', // MPEG-4 AVC/H.264 BD
          '1.2.840.10008.1.2.4.104', // MPEG-4 AVC/H.264 HP
          '1.2.840.10008.1.2.4.105', // MPEG-4 AVC/H.264 HP 2D
          '1.2.840.10008.1.2.4.106', // MPEG-4 AVC/H.264 HP 3D
          '1.2.840.10008.1.2.4.107', // MPEG-4 AVC/H.264 HP Stereoscopic
          '1.2.840.10008.1.2.4.108', // MPEG-4 AVC/H.264 BD Stereoscopic
          '1.2.840.10008.1.2.4.109', // HEVC/H.265
          '1.2.840.10008.1.2.4.110', // HEVC/H.265 Main Profile
          '1.2.840.10008.1.2.4.111', // HEVC/H.265 Main 10 Profile
          '1.2.840.10008.1.2.4.112', // RLE Lossless
          '1.2.840.10008.1.2.5.3.0' // RLE Lossless
        ],
        compressionSettings: {
          jpegQuality: config.jpegQuality || 85,
          jpeg2000CompressionRatio: config.jpeg2000CompressionRatio || 10,
          enableLosslessCompression: config.enableLosslessCompression !== false
        }
      }
    };

    services.push(cstoreService);

    // C-FIND Service (Query)
    const cfindService = {
      id: generateUUID(),
      name: 'C-FIND',
      type: 'query',
      port: config.dicomPort || 104,
      enabled: true,
      configuration: {
        maxQueryResults: config.maxQueryResults || 1000,
        queryTimeout: config.queryTimeout || 30000,
        supportedQueryLevels: ['PATIENT', 'STUDY', 'SERIES', 'IMAGE']
      }
    };

    services.push(cfindService);

    // C-MOVE Service (Retrieve)
    const cmoveService = {
      id: generateUUID(),
      name: 'C-MOVE',
      type: 'retrieve',
      port: config.dicomPort || 104,
      enabled: true,
      configuration: {
        maxConcurrentMoves: config.maxConcurrentMoves || 10,
        moveTimeout: config.moveTimeout || 60000,
        destinationAETitle: config.destinationAETitle || 'ZARISH_SPHERE'
      }
    };

    services.push(cmoveService);

    // MWL Service (Modality Worklist)
    if (config.enableWorklist) {
      const mwlService = {
        id: generateUUID(),
        name: 'MWL',
        type: 'worklist',
        port: config.worklistPort || 104,
        enabled: true,
        configuration: {
          worklistUpdateInterval: config.worklistUpdateInterval || 30000,
          autoRefreshWorklist: config.autoRefreshWorklist !== false,
          worklistRetention: config.worklistRetention || 86400000 // 24 hours
        }
      };

      services.push(mwlService);
    }

    return services;
  }

  // Process incoming DICOM image
  async processDICOMImage(imageData, metadata) {
    const processing = {
      id: generateUUID(),
      status: 'processing',
      imageData: imageData,
      metadata: metadata,
      processedImage: null,
      qualityCheck: null,
      storageInfo: null,
      workflowUpdate: null,
      errors: [],
      warnings: []
    };

    try {
      // Validate DICOM image
      const validation = await this.validateDICOMImage(imageData, metadata);
      if (!validation.valid) {
        throw new Error(`DICOM validation failed: ${validation.errors.join(', ')}`);
      }

      // Extract DICOM metadata
      const extractedMetadata = await this.extractDICOMMetadata(imageData);
      processing.metadata = { ...processing.metadata, ...extractedMetadata };

      // Perform quality control
      const qualityCheck = await this.performImageQualityControl(imageData);
      processing.qualityCheck = qualityCheck;

      if (!qualityCheck.passed) {
        processing.warnings.push(...qualityCheck.warnings);
      }

      // Process image (compression, enhancement, etc.)
      const processedImage = await this.processImageData(imageData, processing.metadata);
      processing.processedImage = processedImage;

      // Store image
      const storageInfo = await this.storeImage(processedImage, processing.metadata);
      processing.storageInfo = storageInfo;

      // Update workflow
      const workflowUpdate = await this.updateImagingWorkflow(processing.metadata, storageInfo);
      processing.workflowUpdate = workflowUpdate;

      processing.status = 'completed';

      const savedProcessing = await this.dicomRepository.createProcessing(processing);
      return savedProcessing;

    } catch (error) {
      processing.status = 'failed';
      processing.errors.push({
        type: 'processing_error',
        message: error.message,
        severity: 'error'
      });

      const failedProcessing = await this.dicomRepository.createProcessing(processing);
      throw error;
    }
  }

  // Validate DICOM image
  async validateDICOMImage(imageData, metadata) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      checkedFields: []
    };

    try {
      // Check DICOM file format
      if (!imageData || imageData.length < 132) {
        validation.valid = false;
        validation.errors.push('Invalid DICOM file format');
        return validation;
      }

      // Check DICOM prefix
      const dicomPrefix = imageData.toString('ascii', 128, 132);
      if (dicomPrefix !== 'DICM') {
        validation.warnings.push('DICOM prefix not found - may be implicit VR format');
      }

      // Check required DICOM tags
      const requiredTags = [
        '00080008', // Image Type
        '00080016', // SOP Class UID
        '00080018', // SOP Instance UID
        '00080020', // Study Date
        '00080030', // Study Time
        '00080050', // Accession Number
        '00080060', // Modality
        '00081090', // Manufacturer's Model Name
        '00100010', // Patient's Name
        '00100020', // Patient ID
        '00100030', // Patient's Birth Date
        '00100040', // Patient's Sex
        '0020000D', // Study Instance UID
        '0020000E', // Series Instance UID
        '00200010', // Series Number
        '00200013', // Instance Number
        '00280010', // Rows
        '00280011', // Columns
        '00280100', // Bits Allocated
        '00280101, // Bits Stored
        '00280102', // High Bit
        '00280103', // Pixel Representation
        '00280002', // Samples per Pixel
        '00280004', // Photometric Interpretation
        '7FE00010'  // Pixel Data
      ];

      for (const tag of requiredTags) {
        validation.checkedFields.push(tag);

        if (!metadata[tag]) {
          validation.warnings.push(`Required DICOM tag not found: ${tag}`);
        }
      }

      // Validate image dimensions
      if (metadata['00280010'] && metadata['00280011']) {
        const rows = parseInt(metadata['00280010'].value);
        const columns = parseInt(metadata['00280011'].value);

        if (rows <= 0 || columns <= 0) {
          validation.valid = false;
          validation.errors.push('Invalid image dimensions');
        }
      }

      // Validate pixel data
      if (!metadata['7FE00010']) {
        validation.valid = false;
        validation.errors.push('Pixel data not found');
      }

    } catch (error) {
      validation.valid = false;
      validation.errors.push(`DICOM validation error: ${error.message}`);
    }

    return validation;
  }

  // Extract DICOM metadata
  async extractDICOMMetadata(imageData) {
    const metadata = {};

    try {
      // Parse DICOM file structure
      const dicomParser = new DICOMParser(imageData);

      // Extract key metadata fields
      const metadataFields = {
        '00080008': 'ImageType',
        '00080016': 'SOPClassUID',
        '00080018': 'SOPInstanceUID',
        '00080020': 'StudyDate',
        '00080030': 'StudyTime',
        '00080050': 'AccessionNumber',
        '00080060': 'Modality',
        '00081090': 'ManufacturerModelName',
        '00100010': 'PatientName',
        '00100020': 'PatientID',
        '00100030': 'PatientBirthDate',
        '00100040': 'PatientSex',
        '0020000D': 'StudyInstanceUID',
        '0020000E': 'SeriesInstanceUID',
        '00200010': 'SeriesNumber',
        '00200013': 'InstanceNumber',
        '00280010': 'Rows',
        '00280011': 'Columns',
        '00280100': 'BitsAllocated',
        '00280101': 'BitsStored',
        '00280102': 'HighBit',
        '00280103': 'PixelRepresentation',
        '00280002': 'SamplesPerPixel',
        '00280004': 'PhotometricInterpretation'
      };

      for (const [tag, fieldName] of Object.entries(metadataFields)) {
        const tagData = dicomParser.getTag(tag);
        if (tagData) {
          metadata[fieldName] = {
            tag: tag,
            value: tagData.value,
            vr: tagData.vr,
            length: tagData.length
          };
        }
      }

      // Extract additional clinical metadata
      metadata.ClinicalInfo = await this.extractClinicalMetadata(dicomParser);

    } catch (error) {
      throw new Error(`Metadata extraction failed: ${error.message}`);
    }

    return metadata;
  }

  // Extract clinical metadata
  async extractClinicalMetadata(dicomParser) {
    const clinicalInfo = {};

    try {
      // Study information
      clinicalInfo.StudyDescription = dicomParser.getTag('00081030')?.value;
      clinicalInfo.StudyDate = dicomParser.getTag('00080020')?.value;
      clinicalInfo.StudyTime = dicomParser.getTag('00080030')?.value;
      clinicalInfo.StudyID = dicomParser.getTag('00200010')?.value;

      // Series information
      clinicalInfo.SeriesDescription = dicomParser.getTag('0008103E')?.value;
      clinicalInfo.SeriesNumber = dicomParser.getTag('00200011')?.value;
      clinicalInfo.SeriesDate = dicomParser.getTag('00081021')?.value;
      clinicalInfo.SeriesTime = dicomParser.getTag('00081031')?.value;

      // Equipment information
      clinicalInfo.Manufacturer = dicomParser.getTag('00080070')?.value;
      clinicalInfo.ManufacturerModelName = dicomParser.getTag('00081090')?.value;
      clinicalInfo.SoftwareVersions = dicomParser.getTag('00181020')?.value;
      clinicalInfo.DeviceSerialNumber = dicomParser.getTag('00181000')?.value;

      // Image information
      clinicalInfo.ImageType = dicomParser.getTag('00080008')?.value;
      clinicalInfo.InstanceNumber = dicomParser.getTag('00200013')?.value;
      clinicalInfo.ImagePosition = dicomParser.getTag('00200032')?.value;
      clinicalInfo.ImageOrientation = dicomParser.getTag('00200037')?.value;
      clinicalInfo.SliceThickness = dicomParser.getTag('00180050')?.value;
      clinicalInfo.PixelSpacing = dicomParser.getTag('00280030')?.value;

      // Acquisition information
      clinicalInfo.AcquisitionDate = dicomParser.getTag('00080022')?.value;
      clinicalInfo.AcquisitionTime = dicomParser.getTag('00080032')?.value;
      clinicalInfo.AcquisitionNumber = dicomParser.getTag('00200012')?.value;
      clinicalInfo.ContrastBolusAgent = dicomParser.getTag('00180010')?.value;
      clinicalInfo.ScanOptions = dicomParser.getTag('00180022')?.value;

    } catch (error) {
      console.warn(`Clinical metadata extraction warning: ${error.message}`);
    }

    return clinicalInfo;
  }

  // Perform image quality control
  async performImageQualityControl(imageData) {
    const qualityCheck = {
      passed: true,
      warnings: [],
      metrics: {
        fileSize: imageData.length,
        imageQuality: 'unknown',
        compressionRatio: 1,
        artifacts: [],
        signalToNoise: null
      }
    };

    try {
      // Check file size
      if (imageData.length > 100 * 1024 * 1024) { // 100MB
        qualityCheck.warnings.push('Large image file size may affect performance');
      }

      // Check for common artifacts
      const artifacts = await this.detectImageArtifacts(imageData);
      qualityCheck.metrics.artifacts = artifacts;

      if (artifacts.length > 0) {
        qualityCheck.warnings.push(`Image artifacts detected: ${artifacts.join(', ')}`);
      }

      // Calculate signal-to-noise ratio (simplified)
      const snr = await this.calculateSignalToNoiseRatio(imageData);
      qualityCheck.metrics.signalToNoise = snr;

      if (snr < 20) {
        qualityCheck.warnings.push('Low signal-to-noise ratio detected');
      }

      // Determine overall quality
      if (qualityCheck.warnings.length > 3) {
        qualityCheck.metrics.imageQuality = 'poor';
      } else if (qualityCheck.warnings.length > 0) {
        qualityCheck.metrics.imageQuality = 'fair';
      } else {
        qualityCheck.metrics.imageQuality = 'good';
      }

    } catch (error) {
      qualityCheck.passed = false;
      qualityCheck.warnings.push(`Quality control error: ${error.message}`);
    }

    return qualityCheck;
  }

  // Detect image artifacts
  async detectImageArtifacts(imageData) {
    const artifacts = [];

    try {
      // This is a simplified artifact detection
      // In a real implementation, this would use image processing algorithms

      // Check for motion artifacts (simplified check)
      const motionScore = await this.detectMotionArtifacts(imageData);
      if (motionScore > 0.7) {
        artifacts.push('motion_artifacts');
      }

      // Check for noise artifacts
      const noiseScore = await this.detectNoiseArtifacts(imageData);
      if (noiseScore > 0.8) {
        artifacts.push('noise_artifacts');
      }

      // Check for compression artifacts
      const compressionScore = await this.detectCompressionArtifacts(imageData);
      if (compressionScore > 0.6) {
        artifacts.push('compression_artifacts');
      }

    } catch (error) {
      console.warn(`Artifact detection error: ${error.message}`);
    }

    return artifacts;
  }

  // Process image data
  async processImageData(imageData, metadata) {
    const processedImage = {
      originalData: imageData,
      processedData: null,
      compression: null,
      enhancement: null,
      thumbnails: []
    };

    try {
      // Apply image compression if needed
      const compressedImage = await this.applyImageCompression(imageData, metadata);
      processedImage.compression = compressedImage;

      // Apply image enhancement if needed
      const enhancedImage = await this.applyImageEnhancement(compressedImage.data, metadata);
      processedImage.enhancement = enhancedImage;

      // Generate thumbnails
      const thumbnails = await this.generateThumbnails(enhancedImage.data);
      processedImage.thumbnails = thumbnails;

      processedImage.processedData = enhancedImage.data;

    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }

    return processedImage;
  }

  // Apply image compression
  async applyImageCompression(imageData, metadata) {
    const compression = {
      originalSize: imageData.length,
      compressedSize: imageData.length,
      compressionRatio: 1,
      method: 'none',
      quality: 'lossless'
    };

    try {
      // Determine compression strategy based on modality and image type
      const modality = metadata.Modality?.value;
      const imageType = metadata.ImageType?.value;

      if (modality === 'CT' || modality === 'MR') {
        // Use lossless compression for diagnostic images
        const losslessCompressed = await this.compressLossless(imageData);
        compression.compressedSize = losslessCompressed.length;
        compression.compressionRatio = imageData.length / losslessCompressed.length;
        compression.method = 'lossless_jpeg';
        compression.data = losslessCompressed;
      } else if (modality === 'XA' || modality === 'RF') {
        // Use lossy compression for non-diagnostic images
        const lossyCompressed = await this.compressLossy(imageData, 0.85);
        compression.compressedSize = lossyCompressed.length;
        compression.compressionRatio = imageData.length / lossyCompressed.length;
        compression.method = 'lossy_jpeg';
        compression.quality = 'lossy_85';
        compression.data = lossyCompressed;
      } else {
        // No compression for other modalities
        compression.data = imageData;
      }

    } catch (error) {
      console.warn(`Compression failed, using original data: ${error.message}`);
      compression.data = imageData;
    }

    return compression;
  }

  // Store image
  async storeImage(processedImage, metadata) {
    const storage = {
      imageId: generateUUID(),
      storageLocation: null,
      storageType: 'archive',
      storedAt: new Date().toISOString(),
      size: processedImage.processedData.length,
      metadata: metadata,
      thumbnails: processedImage.thumbnails,
      accessControl: {
        readAccess: ['radiologists', 'referring_physicians', 'patient'],
        writeAccess: ['radiologists', 'technicians'],
        deleteAccess: ['system_administrators']
      }
    };

    try {
      // Store main image
      const imageLocation = await this.storeImageArchive(processedImage.processedData, metadata);
      storage.storageLocation = imageLocation;

      // Store thumbnails
      for (const thumbnail of processedImage.thumbnails) {
        await this.storeThumbnail(thumbnail, storage.imageId);
      }

      // Update image index
      await this.updateImageIndex(storage);

    } catch (error) {
      throw new Error(`Image storage failed: ${error.message}`);
    }

    return storage;
  }

  // Update imaging workflow
  async updateImagingWorkflow(metadata, storageInfo) {
    const workflowUpdate = {
      studyInstanceUID: metadata.StudyInstanceUID?.value,
      seriesInstanceUID: metadata.SeriesInstanceUID?.value,
      sopInstanceUID: metadata.SOPInstanceUID?.value,
      accessionNumber: metadata.AccessionNumber?.value,
      patientId: metadata.PatientID?.value,
      status: 'image_available',
      timestamp: new Date().toISOString(),
      imageId: storageInfo.imageId,
      storageLocation: storageInfo.storageLocation,
      notifications: []
    };

    try {
      // Update RIS (Radiology Information System)
      const risUpdate = await this.updateRIS(workflowUpdate);
      workflowUpdate.risUpdate = risUpdate;

      // Update EMR/EHR
      const emrUpdate = await this.updateEMR(workflowUpdate);
      workflowUpdate.emrUpdate = emrUpdate;

      // Send notifications
      const notifications = await this.sendWorkflowNotifications(workflowUpdate);
      workflowUpdate.notifications = notifications;

    } catch (error) {
      console.warn(`Workflow update warning: ${error.message}`);
    }

    return workflowUpdate;
  }

  // Query DICOM images
  async queryDICOMImages(queryParameters) {
    const query = {
      id: generateUUID(),
      queryType: queryParameters.queryType || 'STUDY',
      parameters: queryParameters,
      results: [],
      status: 'executing',
      timestamp: new Date().toISOString(),
      errors: [],
      warnings: []
    };

    try {
      // Validate query parameters
      const validation = await this.validateQueryParameters(queryParameters);
      if (!validation.valid) {
        throw new Error(`Query validation failed: ${validation.errors.join(', ')}`);
      }

      // Execute DICOM C-FIND
      const findResults = await this.executeDICOMFind(queryParameters);
      query.results = findResults;

      // Process results
      const processedResults = await this.processQueryResults(findResults);
      query.results = processedResults;

      query.status = 'completed';

      const savedQuery = await this.dicomRepository.createQuery(query);
      return savedQuery;

    } catch (error) {
      query.status = 'failed';
      query.errors.push({
        type: 'query_error',
        message: error.message,
        severity: 'error'
      });

      const failedQuery = await this.dicomRepository.createQuery(query);
      throw error;
    }
  }

  // Retrieve DICOM images
  async retrieveDICOMImages(retrieveParameters) {
    const retrieval = {
      id: generateUUID(),
      retrieveParameters: retrieveParameters,
      status: 'initializing',
      images: [],
      progress: 0,
      totalImages: 0,
      errors: [],
      timestamp: new Date().toISOString()
    };

    try {
      // Validate retrieve parameters
      const validation = await this.validateRetrieveParameters(retrieveParameters);
      if (!validation.valid) {
        throw new Error(`Retrieve validation failed: ${validation.errors.join(', ')}`);
      }

      // Get list of images to retrieve
      const imageList = await this.getImageListForRetrieve(retrieveParameters);
      retrieval.totalImages = imageList.length;

      // Retrieve images
      const retrievedImages = [];
      for (let i = 0; i < imageList.length; i++) {
        const imageInfo = imageList[i];

        try {
          const image = await this.retrieveSingleImage(imageInfo);
          retrievedImages.push(image);

          retrieval.progress = Math.round(((i + 1) / imageList.length) * 100);

        } catch (error) {
          retrieval.errors.push({
            imageId: imageInfo.sopInstanceUID,
            error: error.message,
            severity: 'error'
          });
        }
      }

      retrieval.images = retrievedImages;
      retrieval.status = 'completed';

      const savedRetrieval = await this.dicomRepository.createRetrieval(retrieval);
      return savedRetrieval;

    } catch (error) {
      retrieval.status = 'failed';
      retrieval.errors.push({
        type: 'retrieval_error',
        message: error.message,
        severity: 'error'
      });

      const failedRetrieval = await this.dicomRepository.createRetrieval(retrieval);
      throw error;
    }
  }

  // Generate imaging analytics
  async generateImagingAnalytics(timeRange) {
    const analytics = {
      timeRange: timeRange,
      generatedAt: new Date().toISOString(),
      metrics: {
        totalStudies: 0,
        totalSeries: 0,
        totalImages: 0,
        totalStorageUsed: 0,
        averageImagesPerStudy: 0,
        averageStudySize: 0,
        modalityDistribution: {},
        dailyVolume: [],
        storageGrowth: []
      },
      quality: {
        averageImageQuality: 0,
        qualityIssues: [],
        compressionEfficiency: 0
      },
      performance: {
        averageQueryTime: 0,
        averageRetrieveTime: 0,
        systemUptime: 0,
        errorRate: 0
      }
    };

    try {
      // Get imaging data
      const imagingData = await this.getImagingData(timeRange);

      // Calculate basic metrics
      analytics.metrics.totalStudies = imagingData.studies.length;
      analytics.metrics.totalSeries = imagingData.series.length;
      analytics.metrics.totalImages = imagingData.images.length;
      analytics.metrics.totalStorageUsed = imagingData.totalStorageUsed;

      if (analytics.metrics.totalStudies > 0) {
        analytics.metrics.averageImagesPerStudy = Math.round(
          analytics.metrics.totalImages / analytics.metrics.totalStudies
        );
        analytics.metrics.averageStudySize = Math.round(
          analytics.metrics.totalStorageUsed / analytics.metrics.totalStudies
        );
      }

      // Calculate modality distribution
      analytics.metrics.modalityDistribution = this.calculateModalityDistribution(imagingData);

      // Calculate daily volume
      analytics.metrics.dailyVolume = this.calculateDailyVolume(imagingData, timeRange);

      // Calculate storage growth
      analytics.metrics.storageGrowth = this.calculateStorageGrowth(imagingData, timeRange);

      // Calculate quality metrics
      analytics.quality = await this.calculateQualityMetrics(imagingData);

      // Calculate performance metrics
      analytics.performance = await this.calculatePerformanceMetrics(timeRange);

    } catch (error) {
      analytics.error = error.message;
    }

    return analytics;
  }

  // Calculate modality distribution
  calculateModalityDistribution(imagingData) {
    const distribution = {};

    for (const study of imagingData.studies) {
      const modality = study.modality;
      if (!distribution[modality]) {
        distribution[modality] = {
          count: 0,
          size: 0,
          percentage: 0
        };
      }
      distribution[modality].count++;
      distribution[modality].size += study.size || 0;
    }

    // Calculate percentages
    const totalStudies = imagingData.studies.length;
    for (const modality of Object.keys(distribution)) {
      distribution[modality].percentage = Math.round(
        (distribution[modality].count / totalStudies) * 100
      );
    }

    return distribution;
  }

  // Calculate daily volume
  calculateDailyVolume(imagingData, timeRange) {
    const dailyVolume = [];
    const startDate = new Date(timeRange.start);
    const endDate = new Date(timeRange.end);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayData = imagingData.studies.filter(study =>
        study.studyDate === dateStr
      );

      dailyVolume.push({
        date: dateStr,
        studies: dayData.length,
        images: dayData.reduce((sum, study) => sum + (study.imageCount || 0), 0),
        size: dayData.reduce((sum, study) => sum + (study.size || 0), 0)
      });
    }

    return dailyVolume;
  }

  // Calculate storage growth
  calculateStorageGrowth(imagingData, timeRange) {
    const growth = [];
    const monthlyData = {};

    // Group data by month
    for (const study of imagingData.studies) {
      const month = study.studyDate.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, size: 0 };
      }
      monthlyData[month].count++;
      monthlyData[month].size += study.size || 0;
    }

    // Calculate cumulative growth
    let cumulativeSize = 0;
    const months = Object.keys(monthlyData).sort();

    for (const month of months) {
      cumulativeSize += monthlyData[month].size;
      growth.push({
        month: month,
        monthlySize: monthlyData[month].size,
        cumulativeSize: cumulativeSize,
        monthlyStudies: monthlyData[month].count
      });
    }

    return growth;
  }
}
```text

This comprehensive PACS integration system provides healthcare organizations with powerful tools for managing medical imaging workflows while ensuring DICOM compliance, image quality, and seamless integration with radiology information systems.
````
