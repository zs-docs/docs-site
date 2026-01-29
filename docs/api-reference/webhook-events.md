---
title: 'Webhook Events'
sidebar_label: 'Webhook Events'
description: 'Complete guide to ZARISH sphere webhook events for server-to-server integrations and real-time notifications'
keywords: [webhooks, events, notifications, integrations, api, zarish sphere]
---

# Webhook Events

## Overview

ZARISH SPHERE webhook events enable server-to-server communication for real-time notifications when healthcare data changes occur. This guide covers webhook configuration, event types, security, and implementation patterns for building reliable healthcare integrations.

## Webhook Configuration

### Creating Webhooks

````javascript
// Webhook configuration manager
class WebhookManager {
  constructor(apiKey, baseURL = 'https://api.zarishsphere.com/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.webhooks = new Map();
  }

  async createWebhook(config) {
    const response = await fetch(`${this.baseURL}/webhooks`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to create webhook: ${response.statusText}`);
    }

    const webhook = await response.json();
    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  async listWebhooks() {
    const response = await fetch(`${this.baseURL}/webhooks`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    return response.json();
  }

  async updateWebhook(webhookId, updates) {
    const response = await fetch(`${this.baseURL}/webhooks/${webhookId}`, {
      method: 'PUT',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update webhook: ${response.statusText}`);
    }

    const webhook = await response.json();
    this.webhooks.set(webhookId, webhook);
    return webhook;
  }

  async deleteWebhook(webhookId) {
    const response = await fetch(`${this.baseURL}/webhooks/${webhookId}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete webhook: ${response.statusText}`);
    }

    this.webhooks.delete(webhookId);
  }

  async testWebhook(webhookId) {
    const response = await fetch(`${this.baseURL}/webhooks/${webhookId}/test`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    return response.json();
  }
}

// Usage example
const webhookManager = new WebhookManager('your-api-key-here');

// Create webhook for patient events
const patientWebhook = await webhookManager.createWebhook({
  name: 'Patient Events Webhook',
  url: 'https://your-app.com/webhooks/patient-events',
  events: ['patient.created', 'patient.updated', 'patient.deleted'],
  secret: 'webhook-secret-key',
  active: true,
  filters: {
    organizationId: 'org-123',
  },
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000,
  },
});

console.log('Created webhook:', patientWebhook);
```text

### Webhook Configuration Structure

```json
{
  "id": "webhook-123",
  "name": "Patient Events Webhook",
  "url": "https://your-app.com/webhooks/patient-events",
  "events": ["patient.created", "patient.updated", "patient.deleted"],
  "secret": "webhook-secret-key",
  "active": true,
  "filters": {
    "organizationId": "org-123",
    "patientIds": ["patient-123", "patient-456"],
    "severity": ["high", "critical"]
  },
  "retryConfig": {
    "maxRetries": 3,
    "retryDelay": 1000,
    "timeout": 30000,
    "backoffStrategy": "exponential"
  },
  "headers": {
    "X-Custom-Header": "custom-value"
  },
  "createdAt": "2023-12-01T10:30:00Z",
  "updatedAt": "2023-12-01T10:30:00Z"
}
```text

## Event Types

### Patient Events

### patient.created

Triggered when a new patient is created in the system.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-123",
  "eventType": "patient.created",
  "timestamp": "2023-12-01T10:30:00Z",
  "version": "1.0",
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
  },
  "signature": "sha256=abc123...",
  "id": "evt_1234567890"
}
```text

### patient.updated

Triggered when patient information is modified.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-123",
  "eventType": "patient.updated",
  "timestamp": "2023-12-01T11:15:00Z",
  "version": "1.0",
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
      "email": "john.smith@example.com",
      "phone": "+1-555-123-4567"
    },
    "updatedBy": {
      "id": "user-456",
      "name": "Dr. Sarah Johnson",
      "role": "clinician"
    }
  },
  "signature": "sha256=def456...",
  "id": "evt_1234567891"
}
```text

### patient.deleted

Triggered when a patient record is deleted or archived.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-123",
  "eventType": "patient.deleted",
  "timestamp": "2023-12-01T12:00:00Z",
  "version": "1.0",
  "data": {
    "patientId": "patient-123",
    "mrn": "MRN-2023-001234",
    "deletedAt": "2023-12-01T12:00:00Z",
    "reason": "Patient request",
    "deletedBy": {
      "id": "user-456",
      "name": "Dr. Sarah Johnson",
      "role": "clinician"
    }
  },
  "signature": "sha256=ghi789...",
  "id": "evt_1234567892"
}
```text

### Clinical Events

### encounter.created

Triggered when a new clinical encounter is created.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-456",
  "eventType": "encounter.created",
  "timestamp": "2023-12-01T09:00:00Z",
  "version": "1.0",
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
      },
      "createdAt": "2023-12-01T09:00:00Z"
    },
    "createdBy": {
      "id": "user-456",
      "name": "Dr. Sarah Johnson",
      "role": "clinician"
    }
  },
  "signature": "sha256=jkl012...",
  "id": "evt_1234567893"
}
```text

### encounter.status-changed

Triggered when encounter status changes.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-456",
  "eventType": "encounter.status-changed",
  "timestamp": "2023-12-01T10:30:00Z",
  "version": "1.0",
  "data": {
    "encounterId": "encounter-456",
    "oldStatus": "in-progress",
    "newStatus": "completed",
    "statusChangedAt": "2023-12-01T10:30:00Z",
    "changedBy": {
      "id": "user-456",
      "name": "Dr. Sarah Johnson",
      "role": "clinician"
    }
  },
  "signature": "sha256=mno345...",
  "id": "evt_1234567895"
}
```text

### Observation Events

### observation.created

Triggered when a new observation is recorded.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-789",
  "eventType": "observation.created",
  "timestamp": "2023-12-01T14:30:00Z",
  "version": "1.0",
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
      "effectiveDateTime": "2023-12-01T14:30:00Z",
      "valueQuantity": {
        "value": 175,
        "unit": "cm"
      },
      "createdAt": "2023-12-01T14:30:00Z"
    },
    "createdBy": {
      "id": "user-456",
      "name": "Dr. Sarah Johnson",
      "role": "clinician"
    }
  },
  "signature": "sha256=pqr678...",
  "id": "evt_1234567896"
}
```text

### observation.abnormal

Triggered when an observation value is outside normal ranges.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-789",
  "eventType": "observation.abnormal",
  "timestamp": "2023-12-01T15:00:00Z",
  "version": "1.0",
  "data": {
    "observationId": "obs-789",
    "observationType": "vital-signs",
    "code": {
      "system": "http://loinc.org",
      "code": "8302-2",
      "display": "Body height"
    },
    "value": {
      "value": 220,
      "unit": "cm"
    },
    "normalRange": {
      "low": { "value": 150, "unit": "cm" },
      "high": { "value": 200, "unit": "cm" }
    },
    "severity": "high",
    "alertLevel": "critical",
    "triggeredBy": "system",
    "createdAt": "2023-12-01T15:00:00Z"
  },
  "signature": "sha256=stu901...",
  "id": "evt_1234567898"
}
```javascript

### Medication Events

### medication.ordered

Triggered when a medication order is created.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-321",
  "eventType": "medication.ordered",
  "timestamp": "2023-12-01T16:00:00Z",
  "version": "1.0",
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
          "text": "Take 1 tablet every 4 hours as needed for pain"
        }
      ],
      "authoredOn": "2023-12-01T16:00:00Z",
      "requester": {
        "id": "practitioner-456",
        "name": "Dr. Sarah Johnson",
        "role": "clinician"
      },
      "createdAt": "2023-12-01T16:00:00Z"
    },
    "pharmacy": {
      "id": "pharmacy-789",
      "name": "Main Pharmacy",
      "location": "Building A, Floor 1"
    },
    "prescriber": {
      "id": "practitioner-456",
      "name": "Dr. Sarah Johnson",
      "role": "clinician"
    }
  },
  "signature": "sha256=vwx234...",
  "id": "evt_1234567899"
}
```text

### medication.administered

Triggered when a medication is administered to a patient.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-321",
  "eventType": "medication.administered",
  "timestamp": "2023-12-01T18:00:00Z",
  "version": "1.0",
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
    },
    "patient": {
      "id": "patient-123",
      "firstName": "John",
      "lastName": "Smith"
    },
    "location": {
      "id": "location-123",
      "name": "Room 123",
      "department": "Emergency"
    }
  },
  "signature": "sha256=yza567...",
  "id": "evt_1234567900"
}
```text

### System Events

### system.maintenance

Triggered when system maintenance is scheduled or performed.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-999",
  "eventType": "system.maintenance",
  "timestamp": "2023-12-01T02:00:00Z",
  "version": "1.0",
  "data": {
    "maintenance": {
      "type": "scheduled",
      "start": "2023-12-01T02:00:00Z",
      "end": "2023-12-01T04:00:00Z",
      "affectedServices": ["patient-service", "clinical-service", "observation-service"],
      "message": "System maintenance for database upgrades",
      "severity": "medium"
    }
  },
  "signature": "sha256=bcd890...",
  "id": "evt_1234567907"
}
```text

### system.alert

Triggered for critical system issues requiring immediate attention.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-999",
  "eventType": "system.alert",
  "timestamp": "2023-12-01T15:30:00Z",
  "version": "1.0",
  "data": {
    "alert": {
      "type": "database_connection_failure",
      "severity": "critical",
      "service": "patient-service",
      "error": "Connection timeout to database",
      "impact": "Patient data access unavailable"
    },
    "resolution": {
      "status": "investigating",
      "estimatedResolution": "2023-12-01T16:00:00Z",
      "assignedTo": "devops-team"
    }
  },
  "signature": "sha256=efg123...",
  "id": "evt_1234567908"
}
```text

### Security Events

### security.breach

Triggered when a security breach is detected.

**Webhook Payload:**

```json
{
  "webhookId": "webhook-999",
  "eventType": "security.breach",
  "timestamp": "2023-12-01T22:00:00Z",
  "version": "1.0",
  "data": {
    "breach": {
      "type": "unauthorized_access",
      "severity": "critical",
      "source": "external",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0"
    },
    "target": {
      "service": "patient-service",
      "resource": "patient-data"
    },
    "details": {
      "attemptedEndpoint": "/api/v1/patients",
      "httpMethod": "GET",
      "requestId": "req-806"
    }
  },
  "signature": "sha256=hij456...",
  "id": "evt_123456909"
}
```typescript

## Webhook Security

### Signature Verification

All webhook requests include a cryptographic signature for security verification:

```python
## Flask webhook server with signature verification
from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)
WEBHOOK_SECRET = 'your-webhook-secret'

def verify_webhook_signature(payload, signature):
    """Verify webhook signature"""
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(
        expected_signature.encode('utf-8'),
        signature.encode('utf-8')
    ) == 0

@app.route('/webhooks/patient-events', methods=['POST'])
def handle_patient_events():
    # Get signature from header
    signature = request.headers.get('X-ZarishSphere-Signature')

    # Get raw request body
    payload = request.get_data()

    # Verify signature
    if not verify_webhook_signature(payload, signature):
        return jsonify({'error': 'Invalid signature'}), 401

    # Parse webhook data
    try:
        webhook_data = json.loads(payload)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON'}), 400

    # Process webhook event
    event_type = webhook_data.get('event')
    timestamp = webhook_data.get('timestamp')
    data = webhook_data.get('data')

    # Handle different event types
    if event_type == 'patient.created':
        handle_patient_created(data)
    elif event_type == 'patient.updated':
        handle_patient_updated(data)
    elif event_type == 'patient.deleted':
        handle_patient_deleted(data)

    return jsonify({'status': 'received'}), 200

def handle_patient_created(patient_data):
    """Handle patient creation webhook"""
    patient_id = patient_data.get('id')
    first_name = patient_data.get('firstName')
    last_name = patient_data.get('lastName')

    print(f"New patient created: {first_name} {last_name} (ID: {patient_id})")

    # Update local database
    update_local_database(patient_data)

    # Send notification to relevant staff
    send_notification_to_staff(patient_data)
```javascript

### IP Whitelisting

Configure allowed IP addresses for webhook endpoints:

```javascript
// IP whitelist middleware
const ipWhitelist = ['192.168.1.100', '10.0.0.1', '203.0.113.0'];

function ipWhitelistMiddleware(req, res, next) {
  const clientIP = req.ip;

  if (!ipWhitelist.includes(clientIP)) {
    return res.status(403).json({
      error: 'IP address not whitelisted',
    });
  }

  next();
}

// Apply middleware
app.use('/webhooks/*', ipWhitelistMiddleware);
```javascript

### Rate Limiting

Implement rate limiting to prevent webhook abuse:

```javascript
const rateLimit = require('express-rate-limit');

const webhookRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/webhooks/*', webhookRateLimit);
```javascript

## Webhook Server Implementation

### Express.js Server

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

class WebhookServer {
  constructor(port = 3000, secret = 'your-webhook-secret') {
    this.app = express();
    this.port = port;
    this.secret = secret;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(this.signatureMiddleware);
  }

  signatureMiddleware(req, res, next) {
    const signature = req.headers['x-zarish-sphere-signature'];
    const payload = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).json({
        error: 'Invalid signature',
      });
    }

    req.webhookId = req.headers['x-webhook-id'];
    req.eventType = req.body.eventType;
    req.timestamp = req.body.timestamp;
    req.data = req.body.data;

    next();
  }

  setupRoutes() {
    this.app.post('/webhooks/patient-events', this.handlePatientEvents);
    this.app.post('/webhooks/clinical-events', this.handleClinicalEvents);
    this.app.post('/webhooks/observation-events', this.handleObservationEvents);
    this.app.post('/webhooks/medication-events', this.handleMedicationEvents);
    this.app.post('/webhooks/system-events', this.handleSystemEvents);
    this.app.post('/webhooks/security-events', this.handleSecurityEvents);

    // Health check endpoint
    this.app.get('/webhooks/health', this.handleHealthCheck);
  }

  handlePatientEvents(req, res) {
    const { eventType, data, timestamp } = req;

    console.log(`[${timestamp}] ${eventType}:`, data);

    // Process patient events
    switch (eventType) {
      case 'patient.created':
        this.handlePatientCreated(data);
        break;
      case 'patient.updated':
        this.handlePatientUpdated(data);
        break;
      case 'patient.deleted':
        this.handlePatientDeleted(data);
        break;
      default:
        console.log(`Unknown event type: ${eventType}`);
    }

    res.json({ status: 'received' });
  }

  handlePatientCreated(patientData) {
    const patientId = patientData.id;
    const firstName = patientData.firstName;
    const lastName = patientData.lastName;

    console.log(`New patient created: ${firstName} ${lastName} (ID: ${patientId})`);

    // Update local database
    this.updatePatientDatabase(patientData);

    // Send notification to relevant staff
    this.sendStaffNotification(patientData);
  }

  handlePatientUpdated(patientData) {
    const patientId = patientData.id;
    const updatedFields = patientData.updatedFields;

    console.log(`Patient ${patientId} updated. Fields: ${updatedFields.join(', ')}`);

    // Update local database
    this.updatePatientDatabase(patientData);
  }

  handlePatientDeleted(patientData) {
    const patientId = patientData.patientId;

    console.log(`Patient ${patientId} deleted`);

    // Remove from local database
    this.removePatientFromDatabase(patientId);
  }

  updatePatientDatabase(patientData) {
    // Update local database with patient data
    // Implementation depends on your database system
  }

  removePatientFromDatabase(patientId) {
    // Remove patient from local database
    // Implementation depends on your database system
  }

  sendStaffNotification(patientData) {
    // Send notification to relevant staff members
    // Implementation depends on your notification system
  }

  // Similar methods for other event types...

  handleHealthCheck(req, res) {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      webhooks: this.getWebhookCount(),
    });
  }

  getWebhookCount() {
    // Return count of active webhooks
    return this.webhooks.size;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Webhook server running on port ${this.port}`);
    });
  }
}

// Usage
const webhookServer = new WebhookServer(3000, 'your-webhook-secret');
webhookServer.start();
```typescript

### Python Flask Server

```python
from flask import Flask, request, jsonify
import hmac
import hashlib
import json
from datetime import datetime

app = Flask(__name__)
WEBHOOK_SECRET = 'your-webhook-secret'

def verify_webhook_signature(payload, signature):
    """Verify webhook signature"""
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(
        expected_signature.encode('utf-8'),
        signature.encode('utf-8')
    ) == 0

@app.route('/webhooks/patient-events', methods=['POST'])
def handle_patient_events():
    # Get signature from header
    signature = request.headers.get('X-ZarishSphere-Signature')

    # Get raw request body
    payload = request.get_data()

    # Verify signature
    if not verify_webhook_signature(payload, signature):
        return jsonify({'error': 'Invalid signature'}), 401

    # Parse webhook data
    try:
        webhook_data = json.loads(payload)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON'}), 400

    # Process webhook event
    event_type = webhook_data.get('event')
    timestamp = webhook_data.get('timestamp')
    data = webhook_data.get('data')

    # Handle different event types
    if event_type == 'patient.created':
        handle_patient_created(data)
    elif event_type == 'patient.updated':
        handle_patient_updated(data)
    elif event_type == 'patient.deleted':
        handle_patient_deleted(data)

    return jsonify({'status': 'received'}), 200

def handle_patient_created(patient_data):
    """Handle patient creation webhook"""
    patient_id = patient_data.get('id')
    first_name = patient_data.get('firstName')
    last_name = patient_data.get('lastName')

    print(f"[{timestamp}] New patient created: {first_name} {last_name} (ID: {patient_id})")

    # Update local database
    update_local_database(patient_data)

    # Send notification to relevant staff
    send_notification_to_staff(patient_data)

def handle_patient_updated(patient_data):
    """Handle patient update webhook"""
    patient_id = patient_data.get('id')
    updated_fields = patient_data.get('updatedFields', [])

    print(f"[{timestamp}] Patient {patient_id} updated. Fields: {', '.join(updated_fields)}")

    # Update local database
    update_local_database(patient_data)

def handle_patient_deleted(patient_data):
    """Handle patient deletion webhook"""
    patient_id = patient_data.get('patientId')

    print(f"[{timestamp}] Patient {patient_id} deleted")

    # Remove from local database
    remove_from_local_database(patient_id)

def update_local_database(patient_data):
    """Update local database with patient data"""
    # Implementation depends on your database system
    pass

def remove_from_local_database(patient_id):
    """Remove patient from local database"""
    # Implementation depends on your database system
    pass

def send_notification_to_staff(patient_data):
    """Send notification to relevant staff members"""
    # Implementation depends on your notification system
    pass

if __name__ == '__main__':
    app.run(port=3000, debug=True)
```javascript

## Webhook Testing

### Testing Webhook Delivery

```javascript
// Webhook testing utility
class WebhookTester {
  constructor(url, secret) {
    this.url = url;
    this.secret = secret;
  }

  async testWebhook(event, data) {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(payloadString);

    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ZarishSphere-Signature': signature,
        'X-Webhook-Attempt': '1',
      },
      body: payloadString,
    });

    return response;
  }

  generateSignature(payload) {
    return crypto.createHmac('sha256', this.secret).update(payload).digest('hex');
  }

  async testPatientCreatedWebhook() {
    const patientData = {
      id: 'patient-123',
      firstName: 'John',
      lastName: 'Smith',
      birthDate: '1985-06-15',
      gender: 'male',
      email: 'john.smith@example.com',
    };

    return this.testWebhook('patient.created', patientData);
  }

  async testPatientUpdatedWebhook() {
    const patientData = {
      id: 'patient-123',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith.updated@example.com',
      updatedFields: ['email'],
    };

    return this.testWebhook('patient.updated', patientData);
  }

  async testPatientDeletedWebhook() {
    const patientData = {
      patientId: 'patient-123',
    };

    return this.testWebhook('patient.deleted', patientData);
  }
}

// Usage
const webhookTester = new WebhookTester(
  'https://your-app.com/webhooks/patient-events',
  'your-webhook-secret'
);

// Test patient events
await webhookTester.testPatientCreatedWebhook();
await webhookTester.testPatientUpdatedWebhook();
await webhookTester.testPatientDeletedWebhook();
```javascript

### Batch Testing

```javascript
// Batch webhook testing
class BatchWebhookTester {
  constructor(url, secret) {
    this.url = url;
    this.secret = secret;
  }

  async testBatchEvents(events) {
    const promises = events.map((event) => this.testWebhook(event.event, event.data));

    const results = await Promise.allSettled(promises);

    const success = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;

    return {
      total: events.length,
      success,
      failed,
      successRate: (success / events.length) * 100,
    };
  }
}

// Usage
const batchTester = new BatchWebhookTester(
  'https://your-app.com/webhooks/patient-events',
  'your-webhook-secret'
);

const testEvents = [
  {
    event: 'patient.created',
    data: { id: 'patient-123', firstName: 'John', lastName: 'Smith' },
  },
  {
    event: 'patient.updated',
    data: { id: 'patient-123', email: 'john.smith.updated@example.com' },
  },
  {
    event: 'patient.deleted',
    data: { patientId: 'patient-123' },
  },
];

const results = await batchTester.testBatchEvents(testEvents);
console.log(`Batch test results: ${JSON.stringify(results, null, 2)}`);
```text

## Error Handling

### Webhook Error Response Format

```json
{
  "error": {
    "code": "WEBHOOK_DELIVERY_FAILED",
    "message": "Failed to deliver webhook",
    "details": {
      "webhookId": "webhook-123",
      "url": "https://your-app.com/webhooks/patient-events",
      "httpStatus": 500,
      "error": "Connection timeout"
    }
  }
}
```javascript

### Error Handling Strategies

```javascript
class RobustWebhookClient {
  constructor(baseURL, secret) {
    this.baseURL = baseURL;
    this.secret = secret;
    this.retryManager = new RetryManager({
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 30000,
    });
  }

  async deliverWebhook(webhookId, event, data) {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(payloadString);

    return this.retryManager.executeWithRetry(async () => {
      const response = await fetch(`${this.baseURL}/webhooks/${webhookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ZarishSphere-Signature': signature,
          'X-Webhook-Id': this.generateWebhookId(),
        },
        body: payloadString,
      });

      if (!response.ok) {
        throw new Error(`Webhook delivery failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    });
  }

  generateSignature(payload) {
    return crypto.createHmac('sha256', this.secret).update(payload).digest('hex');
  }

  generateWebhookId() {
    return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```text

This comprehensive webhook events guide provides everything needed to build reliable webhook integrations for ZARISH SPHERE healthcare applications.
````
