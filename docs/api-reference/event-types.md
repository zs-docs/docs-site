---
title: 'API Event Types'
sidebar_label: 'Event Types'
description: 'Complete reference to ZARISH sphere API event types for real-time notifications and data streaming'
keywords: [api, events, notifications, webhooks, real-time, zarish sphere]
---

# API Event Types

## Overview

ZARISH SPHERE API events provide real-time notifications for various healthcare data changes and system events. This comprehensive reference covers all available event types, their payloads, and usage patterns for building event-driven healthcare applications.

## Event Structure

All events follow this standardized structure:

````json
{
  "eventId": "evt_1234567890",
  "eventType": "patient.created",
  "timestamp": "2023-12-01T10:30:00Z",
  "version": "1.0",
  "source": "patient-service",
  "data": {
    // Event-specific data
  },
  "metadata": {
    "organizationId": "org-123",
    "userId": "user-456",
    "correlationId": "req-789"
  }
}
```text

## Patient Events

### patient.created

Triggered when a new patient is created in the system.

**Payload:**

```json
{
  "eventId": "evt_1234567890",
  "eventType": "patient.created",
  "timestamp": "2023-12-01T10:30:00Z",
  "version": "1.0",
  "source": "patient-service",
  "data": {
    "patient": {
      "id": "patient-123",
      "mrn": "MRN-2023-001234",
      "firstName": "John",
      "lastName": "Smith",
      "birthDate": "1985-06-15",
      "gender": "male",
      "email": "john.smith@example.com",
      "createdAt": "2023-12-01T10:30:00Z"
    },
    "createdBy": {
      "id": "user-456",
      "name": "Dr. Sarah Johnson",
      "role": "clinician"
    }
  }
}
```text

### patient.updated

Triggered when patient information is modified.

**Payload:**

```json
{
  "eventId": "evt_1234567891",
  "eventType": "patient.updated",
  "timestamp": "2023-12-01T11:15:00Z",
  "version": "1.0",
  "source": "patient-service",
  "data": {
    "patient": {
      "id": "patient-123",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith.updated@example.com",
      "updatedAt": "2023-12-01T11:15:00Z"
    },
    "updatedFields": ["email", "phone"],
    "previousValues": {
      "email": "john.smith@example.com"
    }
  }
}
```text

## Clinical Events

### encounter.created

Triggered when a new clinical encounter is created.

**Payload:**

```json
{
  "eventId": "evt_1234567893",
  "eventType": "encounter.created",
  "timestamp": "2023-12-01T09:00:00Z",
  "version": "1.0",
  "source": "clinical-service",
  "data": {
    "encounter": {
      "id": "encounter-456",
      "status": "planned",
      "class": {
        "code": "AMB",
        "display": "Ambulatory"
      },
      "subject": {
        "id": "patient-123",
        "firstName": "John",
        "lastName": "Smith"
      },
      "period": {
        "start": "2023-12-01T09:00:00Z"
      }
    }
  }
}
```text

### encounter.status-changed

Triggered when encounter status changes.

**Payload:**

```json
{
  "eventId": "evt_1234567895",
  "eventType": "encounter.status-changed",
  "timestamp": "2023-12-01T10:30:00Z",
  "version": "1.0",
  "source": "clinical-service",
  "data": {
    "encounterId": "encounter-456",
    "oldStatus": "in-progress",
    "newStatus": "completed",
    "statusChangedAt": "2023-12-01T10:30:00Z"
  }
}
```text

## Observation Events

### observation.created

Triggered when a new observation is recorded.

**Payload:**

```json
{
  "eventId": "evt_1234567896",
  "eventType": "observation.created",
  "timestamp": "2023-12-01T14:30:00Z",
  "version": "1.0",
  "source": "observation-service",
  "data": {
    "observation": {
      "id": "obs-789",
      "status": "final",
      "category": "vital-signs",
      "code": {
        "system": "http://loinc.org",
        "code": "8302-2",
        "display": "Body height"
      },
      "subject": {
        "id": "patient-123",
        "firstName": "John",
        "lastName": "Smith"
      },
      "valueQuantity": {
        "value": 175,
        "unit": "cm"
      }
    }
  }
}
```text

### observation.abnormal

Triggered when an observation value is outside normal ranges.

**Payload:**

```json
{
  "eventId": "evt_1234567898",
  "eventType": "observation.abnormal",
  "timestamp": "2023-12-01T15:00:00Z",
  "version": "1.0",
  "source": "observation-service",
  "data": {
    "observationId": "obs-789",
    "value": {
      "value": 220,
      "unit": "cm"
    },
    "normalRange": {
      "low": { "value": 150, "unit": "cm" },
      "high": { "value": 200, "unit": "cm" }
    },
    "severity": "high",
    "alertLevel": "critical"
  }
}
```javascript

## Medication Events

### medication.ordered

Triggered when a medication order is created.

**Payload:**

```json
{
  "eventId": "evt_1234567899",
  "eventType": "medication.ordered",
  "timestamp": "2023-12-01T16:00:00Z",
  "version": "1.0",
  "source": "medication-service",
  "data": {
    "medicationRequest": {
      "id": "med-123",
      "status": "active",
      "medication": {
        "code": {
          "display": "Acetaminophen 325mg Tablet"
        }
      },
      "subject": {
        "id": "patient-123",
        "firstName": "John",
        "lastName": "Smith"
      },
      "dosageInstruction": [
        {
          "text": "Take 1 tablet every 4 hours as needed"
        }
      ]
    }
  }
}
```text

### medication.administered

Triggered when a medication is administered to a patient.

**Payload:**

```json
{
  "eventId": "evt_1234567900",
  "eventType": "medication.administered",
  "timestamp": "2023-12-01T18:00:00Z",
  "version": "1.0",
  "source": "medication-service",
  "data": {
    "medicationRequestId": "med-123",
    "administration": {
      "id": "admin-456",
      "administeredAt": "2023-12-01T18:00:00Z",
      "administeredBy": {
        "name": "Jane Smith",
        "role": "nurse"
      },
      "dose": {
        "value": 1,
        "unit": "tablet"
      }
    }
  }
}
```text

## System Events

### system.maintenance

Triggered when system maintenance is scheduled or performed.

**Payload:**

```json
{
  "eventId": "evt_1234567907",
  "eventType": "system.maintenance",
  "timestamp": "2023-12-01T02:00:00Z",
  "version": "1.0",
  "source": "system-service",
  "data": {
    "maintenance": {
      "type": "scheduled",
      "start": "2023-12-01T02:00:00Z",
      "end": "2023-12-01T04:00:00Z",
      "affectedServices": ["patient-service", "clinical-service"],
      "message": "System maintenance for database upgrades"
    }
  }
}
```text

### system.alert

Triggered for critical system issues requiring immediate attention.

**Payload:**

```json
{
  "eventId": "evt_1234567908",
  "eventType": "system.alert",
  "timestamp": "2023-12-01T15:30:00Z",
  "version": "1.0",
  "source": "system-service",
  "data": {
    "alert": {
      "type": "database_connection_failure",
      "severity": "critical",
      "service": "patient-service",
      "error": "Connection timeout to database",
      "impact": "Patient data access unavailable"
    }
  }
}
```text

## Security Events

### security.breach

Triggered when a security breach is detected.

**Payload:**

```json
{
  "eventId": "evt_123456909",
  "eventType": "security.breach",
  "timestamp": "2023-12-01T22:00:00Z",
  "version": "1.0",
  "source": "security-service",
  "data": {
    "breach": {
      "type": "unauthorized_access",
      "severity": "critical",
      "source": "external",
      "ipAddress": "192.168.1.100"
    },
    "target": {
      "service": "patient-service",
      "resource": "patient-data"
    }
  }
}
```javascript

## Event Filtering

### Basic Filters

```javascript
// Filter by patient ID
const patientFilter = {
  patientId: 'patient-123',
};

// Filter by organization
const orgFilter = {
  organizationId: 'org-123',
};

// Filter by date range
const dateFilter = {
  dateRange: {
    start: '2023-12-01T00:00:00Z',
    end: '2023-12-31T23:59:59Z',
  },
};

// Filter by severity
const severityFilter = {
  severity: ['high', 'critical'],
};
```javascript

### Advanced Filters

```javascript
// Complex filter for clinical events
const clinicalFilter = {
  organizationId: 'org-123',
  departments: ['emergency', 'icu'],
  severity: ['high', 'critical'],
  categories: ['medication', 'vital-signs', 'lab-results'],
  dateRange: {
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
};
```javascript

## Event Processing

### Event Handlers

```javascript
class EventHandler {
  constructor() {
    this.handlers = new Map();
  }

  register(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType).push(handler);
  }

  async process(event) {
    const handlers = this.handlers.get(event.eventType) || [];

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error processing event ${event.eventId}:`, error);
      }
    }
  }
}

// Usage
const eventHandler = new EventHandler();

// Register handlers for different event types
eventHandler.register('patient.created', async (event) => {
  console.log('New patient created:', event.data.patient);
  await updatePatientDatabase(event.data.patient);
});

eventHandler.register('observation.abnormal', async (event) => {
  console.log('Abnormal observation detected:', event.data);
  await sendAlertNotification(event.data);
});
```javascript

### Event Batching

```javascript
class EventBatcher {
  constructor(batchSize = 100, flushInterval = 1000) {
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.queue = [];
    this.setupFlushInterval();
  }

  addEvent(event) {
    this.queue.push(event);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  setupFlushInterval() {
    setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  async flush() {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);

    try {
      await this.processBatch(batch);
    } catch (error) {
      console.error('Batch processing error:', error);
      this.queue.unshift(...batch);
    }
  }

  async processBatch(events) {
    // Process events in parallel
    const promises = events.map((event) => this.processEvent(event));
    await Promise.all(promises);
  }
}
```text

This comprehensive event types reference provides everything needed to build event-driven healthcare applications with ZARISH SPHERE APIs.
````
