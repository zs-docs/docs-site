---
title: 'HL7 v2 Mapping'
sidebar_label: 'HL7 v2 Mapping'
description: 'Comprehensive HL7 v2 message mapping and transformation system for healthcare data interoperability in ZARISH SPHERE'
keywords: [HL7 v2, healthcare messaging, data mapping, interoperability, zarish sphere]
---

# HL7 v2 Mapping

## Overview

ZARISH SPHERE HL7 v2 Mapping provides a comprehensive system for transforming and mapping HL7 v2 messages to modern data formats. Our platform supports bidirectional message conversion, segment parsing, field mapping, and seamless integration with FHIR R5 while maintaining full compatibility with HL7 v2 standards and healthcare messaging protocols.

## HL7 v2 Mapping Architecture

### Mapping Framework

````text
HL7 v2 Mapping Framework
├── Message Processing
│   ├── ADT Messages
│   ├── ORM Messages
│   ├── ORU Messages
│   └── SIU Messages
├── Data Transformation
│   ├── Segment Mapping
│   ├── Field Extraction
│   ├── Data Type Conversion
│   └── Value Set Mapping
├── Integration Layer
│   ├── FHIR Conversion
│   ├── JSON Transformation
│   ├── XML Processing
│   └── Database Integration
├── Validation Engine
│   ├── Message Validation
│   ├── Schema Checking
│   ├── Data Quality
│   └── Error Handling
└── Monitoring & Analytics
    ├── Message Tracking
    ├── Performance Metrics
    ├── Error Analysis
    └── Compliance Reporting
```typescript

### Supported HL7 v2 Message Types

| Message Type | Description                | Segments           | Use Case         | Transformation         |
| ------------ | -------------------------- | ------------------ | ---------------- | ---------------------- |
| **ADT**      | Admit, Discharge, Transfer | MSH, EVN, PID, PV1 | Patient movement | FHIR Patient/Encounter |
| **ORM**      | Order Message              | MSH, PID, ORC, OBR | Test ordering    | FHIR ServiceRequest    |
| **ORU**      | Observation Result         | MSH, PID, OBR, OBX | Lab results      | FHIR Observation       |
| **SIU**      | Scheduling                 | MSH, PID, SCH      | Appointments     | FHIR Appointment       |
| **MDM**      | Medical Document           | MSH, PID, OBX      | Clinical notes   | FHIR DocumentReference |

## HL7 v2 Message Processing System

### ADT Message Handler

```javascript
// HL7 v2 mapping and transformation system
class HL7v2MappingSystem {
  constructor() {
    this.messageRepository = new MessageRepository();
    this.mappingEngine = new MappingEngine();
    this.validationEngine = new ValidationEngine();
    this.transformationEngine = new TransformationEngine();
    this.fhirConverter = new FHIRConverter();
    this.monitoringEngine = new MonitoringEngine();
  }

  // Process HL7 v2 message
  async processHL7v2Message(message, options = {}) {
    const processing = {
      id: generateUUID(),
      messageId: message.id || generateUUID(),
      messageType: this.extractMessageType(message),
      status: 'processing',
      timestamp: new Date().toISOString(),
      originalMessage: message,
      parsedMessage: null,
      transformedData: null,
      fhirResources: [],
      validation: null,
      errors: [],
      warnings: [],
    };

    try {
      // Parse HL7 v2 message
      const parsedMessage = await this.parseHL7v2Message(message);
      processing.parsedMessage = parsedMessage;

      // Validate message structure
      const validation = await this.validateHL7v2Message(parsedMessage);
      processing.validation = validation;

      if (!validation.valid) {
        throw new Error(`Message validation failed: ${validation.errors.join(', ')}`);
      }

      // Transform to internal format
      const transformedData = await this.transformMessage(parsedMessage, options);
      processing.transformedData = transformedData;

      // Convert to FHIR resources
      if (options.convertToFHIR !== false) {
        const fhirResources = await this.convertToFHIR(transformedData, processing.messageType);
        processing.fhirResources = fhirResources;
      }

      processing.status = 'completed';

      const savedProcessing = await this.messageRepository.createProcessing(processing);
      return savedProcessing;
    } catch (error) {
      processing.status = 'failed';
      processing.errors.push({
        type: 'processing_error',
        message: error.message,
        severity: 'error',
      });

      const failedProcessing = await this.messageRepository.createProcessing(processing);
      throw error;
    }
  }

  // Parse HL7 v2 message
  async parseHL7v2Message(rawMessage) {
    const parsed = {
      messageType: null,
      version: null,
      segments: [],
      fields: {},
      metadata: {
        encoding: 'UTF-8',
        separators: {
          field: '|',
          component: '^',
          subcomponent: '&',
          repetition: '~',
          escape: '\\',
        },
      },
    };

    try {
      // Split message into segments
      const lines = rawMessage.split('\r');

      for (const line of lines) {
        if (line.trim() === '') continue;

        const segment = {
          type: line.substring(0, 3),
          fields: line.substring(3).split('|'),
          raw: line,
        };

        parsed.segments.push(segment);

        // Parse MSH segment for metadata
        if (segment.type === 'MSH') {
          parsed.version = segment.fields[11] || '2.5.1';
          parsed.messageType = {
            trigger: segment.fields[8]?.substring(0, 3),
            structure: segment.fields[8]?.substring(3, 6),
          };
        }
      }

      // Extract fields by segment type
      for (const segment of parsed.segments) {
        if (!parsed.fields[segment.type]) {
          parsed.fields[segment.type] = [];
        }
        parsed.fields[segment.type].push(segment.fields);
      }
    } catch (error) {
      throw new Error(`Failed to parse HL7 v2 message: ${error.message}`);
    }

    return parsed;
  }

  // Validate HL7 v2 message
  async validateHL7v2Message(parsedMessage) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      checkedSegments: [],
      missingRequired: [],
    };

    try {
      // Check for MSH segment
      const mshSegments = parsedMessage.fields['MSH'];
      if (!mshSegments || mshSegments.length === 0) {
        validation.valid = false;
        validation.errors.push({
          segment: 'MSH',
          message: 'MSH segment is required',
          severity: 'error',
        });
        return validation;
      }

      const msh = mshSegments[0];
      validation.checkedSegments.push('MSH');

      // Validate MSH fields
      if (!msh[8]) {
        validation.valid = false;
        validation.errors.push({
          segment: 'MSH',
          field: 'MSH.8',
          message: 'Message type field is required',
          severity: 'error',
        });
      }

      if (!msh[9]) {
        validation.valid = false;
        validation.errors.push({
          segment: 'MSH',
          field: 'MSH.9',
          message: 'Message control ID is required',
          severity: 'error',
        });
      }

      // Validate message type specific segments
      const messageType = parsedMessage.messageType;
      if (messageType) {
        const typeValidation = await this.validateMessageType(parsedMessage, messageType);
        validation.checkedSegments.push(...typeValidation.checkedSegments);

        if (!typeValidation.valid) {
          validation.valid = false;
          validation.errors.push(...typeValidation.errors);
        }
        validation.warnings.push(...typeValidation.warnings);
      }
    } catch (error) {
      validation.valid = false;
      validation.errors.push({
        segment: 'system',
        message: `Validation error: ${error.message}`,
        severity: 'error',
      });
    }

    return validation;
  }

  // Validate message type specific requirements
  async validateMessageType(parsedMessage, messageType) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      checkedSegments: [],
    };

    switch (messageType.trigger) {
      case 'ADT':
        const adtValidation = await this.validateADTMessage(parsedMessage);
        validation.valid = adtValidation.valid;
        validation.errors.push(...adtValidation.errors);
        validation.warnings.push(...adtValidation.warnings);
        validation.checkedSegments.push(...adtValidation.checkedSegments);
        break;

      case 'ORM':
        const ormValidation = await this.validateORMMessage(parsedMessage);
        validation.valid = ormValidation.valid;
        validation.errors.push(...ormValidation.errors);
        validation.warnings.push(...ormValidation.warnings);
        validation.checkedSegments.push(...ormValidation.checkedSegments);
        break;

      case 'ORU':
        const oruValidation = await this.validateORUMessage(parsedMessage);
        validation.valid = oruValidation.valid;
        validation.errors.push(...oruValidation.errors);
        validation.warnings.push(...oruValidation.warnings);
        validation.checkedSegments.push(...oruValidation.checkedSegments);
        break;

      default:
        validation.warnings.push({
          message: `No specific validation for message type: ${messageType.trigger}`,
          severity: 'warning',
        });
    }

    return validation;
  }

  // Validate ADT message
  async validateADTMessage(parsedMessage) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      checkedSegments: [],
    };

    // Check for PID segment (required for ADT)
    const pidSegments = parsedMessage.fields['PID'];
    if (!pidSegments || pidSegments.length === 0) {
      validation.valid = false;
      validation.errors.push({
        segment: 'PID',
        message: 'PID segment is required for ADT messages',
        severity: 'error',
      });
      return validation;
    }

    validation.checkedSegments.push('PID');
    const pid = pidSegments[0];

    // Validate PID fields
    if (!pid[4]) {
      validation.errors.push({
        segment: 'PID',
        field: 'PID.5',
        message: 'Patient name is required',
        severity: 'error',
      });
    }

    if (!pid[3]) {
      validation.warnings.push({
        segment: 'PID',
        field: 'PID.4',
        message: 'Patient identifier is recommended',
        severity: 'warning',
      });
    }

    // Check for PV1 segment (recommended for ADT)
    const pv1Segments = parsedMessage.fields['PV1'];
    if (pv1Segments && pv1Segments.length > 0) {
      validation.checkedSegments.push('PV1');
    } else {
      validation.warnings.push({
        segment: 'PV1',
        message: 'PV1 segment is recommended for ADT messages',
        severity: 'warning',
      });
    }

    return validation;
  }

  // Transform message to internal format
  async transformMessage(parsedMessage, options = {}) {
    const transformation = {
      messageType: parsedMessage.messageType,
      patient: null,
      encounter: null,
      orders: [],
      observations: [],
      appointments: [],
      metadata: {
        timestamp: new Date().toISOString(),
        version: parsedMessage.version,
        controlId: this.extractControlId(parsedMessage),
      },
    };

    try {
      // Transform based on message type
      switch (parsedMessage.messageType.trigger) {
        case 'ADT':
          const adtTransform = await this.transformADTMessage(parsedMessage);
          transformation.patient = adtTransform.patient;
          transformation.encounter = adtTransform.encounter;
          break;

        case 'ORM':
          const ormTransform = await this.transformORMMessage(parsedMessage);
          transformation.patient = ormTransform.patient;
          transformation.orders = ormTransform.orders;
          break;

        case 'ORU':
          const oruTransform = await this.transformORUMessage(parsedMessage);
          transformation.patient = oruTransform.patient;
          transformation.observations = oruTransform.observations;
          break;

        case 'SIU':
          const siuTransform = await this.transformSIUMessage(parsedMessage);
          transformation.patient = siuTransform.patient;
          transformation.appointments = siuTransform.appointments;
          break;
      }
    } catch (error) {
      throw new Error(`Message transformation failed: ${error.message}`);
    }

    return transformation;
  }

  // Transform ADT message
  async transformADTMessage(parsedMessage) {
    const transform = {
      patient: null,
      encounter: null,
    };

    // Transform PID segment to patient
    const pidSegments = parsedMessage.fields['PID'];
    if (pidSegments && pidSegments.length > 0) {
      const pid = pidSegments[0];
      transform.patient = {
        identifiers: this.parseIdentifiers(pid[3]),
        name: this.parsePatientName(pid[5]),
        birthDate: this.parseDate(pid[7]),
        gender: this.parseGender(pid[8]),
        address: this.parseAddress(pid[11]),
        phone: this.parsePhoneNumber(pid[13]),
        ethnicity: pid[22],
        race: pid[10],
      };
    }

    // Transform PV1 segment to encounter
    const pv1Segments = parsedMessage.fields['PV1'];
    if (pv1Segments && pv1Segments.length > 0) {
      const pv1 = pv1Segments[0];
      transform.encounter = {
        patientClass: pv1[2],
        location: this.parseLocation(pv1[3]),
        admittingDoctor: this.parseProvider(pv1[17]),
        service: pv1[10],
        dischargeDisposition: pv1[37],
      };
    }

    // Transform EVN segment for event information
    const evnSegments = parsedMessage.fields['EVN'];
    if (evnSegments && evnSegments.length > 0) {
      const evn = evnSegments[0];
      if (transform.encounter) {
        transform.encounter.eventType = evn[1];
        transform.encounter.eventTimestamp = this.parseDateTime(evn[2]);
        transform.encounter.recordedTimestamp = this.parseDateTime(evn[6]);
      }
    }

    return transform;
  }

  // Transform ORM message
  async transformORMMessage(parsedMessage) {
    const transform = {
      patient: null,
      orders: [],
    };

    // Transform patient information
    const pidSegments = parsedMessage.fields['PID'];
    if (pidSegments && pidSegments.length > 0) {
      const pid = pidSegments[0];
      transform.patient = {
        identifiers: this.parseIdentifiers(pid[3]),
        name: this.parsePatientName(pid[5]),
        birthDate: this.parseDate(pid[7]),
        gender: this.parseGender(pid[8]),
      };
    }

    // Transform ORC segments for orders
    const orcSegments = parsedMessage.fields['ORC'];
    const obrSegments = parsedMessage.fields['OBR'];

    if (orcSegments && obrSegments) {
      for (let i = 0; i < Math.min(orcSegments.length, obrSegments.length); i++) {
        const orc = orcSegments[i];
        const obr = obrSegments[i];

        const order = {
          controlId: orc[2],
          placerOrderNumber: orc[1],
          status: orc[5],
          timing: this.parseTiming(obr[7]),
          priority: obr[5],
          service: this.parseService(obr[4]),
          orderingProvider: this.parseProvider(obr[16]),
          clinicalInfo: obr[13],
        };

        transform.orders.push(order);
      }
    }

    return transform;
  }

  // Transform ORU message
  async transformORUMessage(parsedMessage) {
    const transform = {
      patient: null,
      observations: [],
    };

    // Transform patient information
    const pidSegments = parsedMessage.fields['PID'];
    if (pidSegments && pidSegments.length > 0) {
      const pid = pidSegments[0];
      transform.patient = {
        identifiers: this.parseIdentifiers(pid[3]),
        name: this.parsePatientName(pid[5]),
        birthDate: this.parseDate(pid[7]),
        gender: this.parseGender(pid[8]),
      };
    }

    // Transform OBR and OBX segments for observations
    const obrSegments = parsedMessage.fields['OBR'];
    const obxSegments = parsedMessage.fields['OBX'];

    if (obrSegments) {
      for (const obr of obrSegments) {
        const observationGroup = {
          controlId: obr[2],
          placerOrderNumber: obr[3],
          fillerOrderNumber: obr[4],
          universalServiceId: this.parseService(obr[4]),
          observationDateTime: this.parseDateTime(obr[7]),
          resultStatus: obr[25],
          observations: [],
        };

        // Find corresponding OBX segments
        if (obxSegments) {
          for (const obx of obxSegments) {
            if (obx[1] && parseInt(obx[1]) === obxSegments.indexOf(obx) + 1) {
              const observation = {
                setId: obx[1],
                value: this.parseObservationValue(obx[5], obx[2]),
                units: obx[6],
                referenceRange: obx[7],
                abnormalFlag: obx[8],
                probability: obx[9],
                natureOfAbnormalTest: obx[10],
                observationResultStatus: obx[11],
                effectiveDateTime: this.parseDateTime(obx[14]),
              };

              observationGroup.observations.push(observation);
            }
          }
        }

        transform.observations.push(observationGroup);
      }
    }

    return transform;
  }

  // Convert to FHIR resources
  async convertToFHIR(transformedData, messageType) {
    const fhirResources = [];

    try {
      // Convert patient to FHIR Patient resource
      if (transformedData.patient) {
        const patientResource = await this.convertPatientToFHIR(transformedData.patient);
        fhirResources.push(patientResource);
      }

      // Convert encounter to FHIR Encounter resource
      if (transformedData.encounter) {
        const encounterResource = await this.convertEncounterToFHIR(transformedData.encounter);
        fhirResources.push(encounterResource);
      }

      // Convert orders to FHIR ServiceRequest resources
      for (const order of transformedData.orders) {
        const serviceRequestResource = await this.convertOrderToFHIR(order);
        fhirResources.push(serviceRequestResource);
      }

      // Convert observations to FHIR Observation resources
      for (const observationGroup of transformedData.observations) {
        for (const observation of observationGroup.observations) {
          const observationResource = await this.convertObservationToFHIR(
            observation,
            observationGroup
          );
          fhirResources.push(observationResource);
        }
      }

      // Convert appointments to FHIR Appointment resources
      for (const appointment of transformedData.appointments) {
        const appointmentResource = await this.convertAppointmentToFHIR(appointment);
        fhirResources.push(appointmentResource);
      }
    } catch (error) {
      throw new Error(`FHIR conversion failed: ${error.message}`);
    }

    return fhirResources;
  }

  // Convert patient to FHIR Patient
  async convertPatientToFHIR(patient) {
    const fhirPatient = {
      resourceType: 'Patient',
      id: generateUUID(),
      identifier: patient.identifiers || [],
      name: patient.name ? [patient.name] : [],
      birthDate: patient.birthDate,
      gender: this.mapGenderToFHIR(patient.gender),
    };

    if (patient.address) {
      fhirPatient.address = [patient.address];
    }

    if (patient.phone) {
      fhirPatient.telecom = [
        {
          system: 'phone',
          value: patient.phone,
          use: 'home',
        },
      ];
    }

    return fhirPatient;
  }

  // Helper methods for parsing HL7 v2 fields
  parseIdentifiers(identifierField) {
    if (!identifierField) return [];

    const identifiers = [];
    const identifierParts = identifierField.split('~');

    for (const part of identifierParts) {
      const components = part.split('^');
      if (components.length >= 2) {
        identifiers.push({
          type: components[0],
          value: components[1],
          system: components[3],
        });
      }
    }

    return identifiers;
  }

  parsePatientName(nameField) {
    if (!nameField) return null;

    const components = nameField.split('^');
    return {
      family: components[0],
      given: components[1] ? [components[1]] : [],
      middle: components[2],
      prefix: components[3],
      suffix: components[4],
    };
  }

  parseDate(dateField) {
    if (!dateField) return null;

    // HL7 v2 date format: YYYYMMDD
    if (dateField.length === 8) {
      const year = dateField.substring(0, 4);
      const month = dateField.substring(4, 6);
      const day = dateField.substring(6, 8);
      return `${year}-${month}-${day}`;
    }

    return dateField;
  }

  parseDateTime(dateTimeField) {
    if (!dateTimeField) return null;

    // HL7 v2 datetime format: YYYYMMDDHHMMSS
    if (dateTimeField.length >= 14) {
      const year = dateTimeField.substring(0, 4);
      const month = dateTimeField.substring(4, 6);
      const day = dateTimeField.substring(6, 8);
      const hour = dateTimeField.substring(8, 10);
      const minute = dateTimeField.substring(10, 12);
      const second = dateTimeField.substring(12, 14);
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    return this.parseDate(dateTimeField);
  }

  parseGender(genderField) {
    if (!genderField) return 'unknown';

    switch (genderField.toUpperCase()) {
      case 'M':
        return 'male';
      case 'F':
        return 'female';
      case 'O':
        return 'other';
      case 'U':
        return 'unknown';
      default:
        return 'unknown';
    }
  }

  mapGenderToFHIR(gender) {
    return gender || 'unknown';
  }

  parseAddress(addressField) {
    if (!addressField) return null;

    const components = addressField.split('^');
    return {
      line: components[0] ? [components[0]] : [],
      city: components[2],
      state: components[3],
      postalCode: components[4],
      country: components[5],
    };
  }

  parsePhoneNumber(phoneField) {
    if (!phoneField) return null;

    const components = phoneField.split('^');
    return components[0];
  }

  parseLocation(locationField) {
    if (!locationField) return null;

    const components = locationField.split('^');
    return {
      pointOfCare: components[0],
      room: components[1],
      bed: components[2],
      facility: components[3],
      locationStatus: components[4],
    };
  }

  parseProvider(providerField) {
    if (!providerField) return null;

    const components = providerField.split('^');
    return {
      identifier: components[0],
      name: components[2],
      role: components[6],
    };
  }

  parseService(serviceField) {
    if (!serviceField) return null;

    const components = serviceField.split('^');
    return {
      identifier: components[0],
      text: components[1],
      nameOfCodingSystem: components[2],
    };
  }

  parseTiming(timingField) {
    if (!timingField) return null;

    // Parse HL7 v2 timing specifications
    return {
      code: timingField,
      text: timingField,
    };
  }

  parseObservationValue(valueField, typeField) {
    if (!valueField) return null;

    // Parse based on observation type
    const type = typeField || 'ST';

    switch (type) {
      case 'NM': // Numeric
        return parseFloat(valueField);
      case 'ST': // String
        return valueField;
      case 'DT': // Date
        return this.parseDate(valueField);
      case 'TM': // Time
        return valueField;
      default:
        return valueField;
    }
  }

  extractControlId(parsedMessage) {
    const mshSegments = parsedMessage.fields['MSH'];
    if (mshSegments && mshSegments.length > 0) {
      return mshSegments[0][9]; // MSH.10 - Message Control ID
    }
    return null;
  }

  extractMessageType(rawMessage) {
    const mshMatch = rawMessage.match(/MSH\|.*\|.*\|.*\|.*\|.*\|.*\|(.*)\|/);
    if (mshMatch) {
      return mshMatch[1];
    }
    return 'UNKNOWN';
  }
}
```text

This comprehensive HL7 v2 mapping system provides healthcare organizations with powerful tools for transforming legacy HL7 v2 messages to modern data formats while ensuring data integrity, maintaining compliance, and enabling seamless integration with contemporary healthcare systems.
````
