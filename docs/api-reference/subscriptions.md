---
title: 'API Subscriptions'
sidebar_label: 'Subscriptions'
description: 'Complete guide to ZARISH SPHERE API subscriptions for real-time data streaming and event notifications'
keywords: [api, subscriptions, webhooks, real-time, events, zarish sphere]
---

# API Subscriptions

## Overview

ZARISH SPHERE API subscriptions enable real-time data streaming and event notifications for healthcare applications. This guide covers WebSocket subscriptions, webhook integrations, and event-driven architectures for building responsive healthcare systems.

## Subscription Types

### WebSocket Subscriptions

Real-time bidirectional communication for live data updates:

````javascript
// WebSocket subscription client
class ZARISHWebSocket {
  constructor(token, baseURL = 'wss://api.zarishsphere.com/v1/ws') {
    this.token = token;
    this.baseURL = baseURL;
    this.ws = null;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    try {
      this.ws = new WebSocket(`${this.baseURL}?token=${this.token}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.authenticate();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      this.handleReconnect();
    }
  }

  authenticate() {
    this.send({
      type: 'auth',
      token: this.token,
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      console.log(`Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(channel, filters = {}, callback) {
    const subscriptionId = this.generateSubscriptionId();

    this.subscriptions.set(subscriptionId, {
      channel,
      filters,
      callback,
    });

    this.send({
      type: 'subscribe',
      subscriptionId,
      channel,
      filters,
    });

    return subscriptionId;
  }

  unsubscribe(subscriptionId) {
    if (this.subscriptions.has(subscriptionId)) {
      this.subscriptions.delete(subscriptionId);
      this.send({
        type: 'unsubscribe',
        subscriptionId,
      });
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  handleMessage(data) {
    const { type, subscriptionId, payload } = data;

    if (type === 'subscription_update' && this.subscriptions.has(subscriptionId)) {
      const subscription = this.subscriptions.get(subscriptionId);
      subscription.callback(payload);
    } else if (type === 'error') {
      console.error('Subscription error:', payload);
    }
  }

  generateSubscriptionId() {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Usage example
const ws = new ZARISHWebSocket('your-access-token');
ws.connect();

// Subscribe to patient updates
const patientSubscription = ws.subscribe(
  'patient-updates',
  { patientId: 'patient-123' },
  (data) => {
    console.log('Patient update:', data);
    updatePatientUI(data);
  }
);

// Subscribe to clinical alerts
const alertSubscription = ws.subscribe(
  'clinical-alerts',
  { severity: ['high', 'critical'] },
  (data) => {
    console.log('Clinical alert:', data);
    showAlertNotification(data);
  }
);
```javascript

### Webhook Subscriptions

HTTP-based event notifications for server-to-server integration:

```javascript
// Webhook subscription manager
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
const webhookManager = new WebhookManager('your-api-key');

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
});

console.log('Created webhook:', patientWebhook);
```javascript

## Available Subscription Channels

### Patient Subscriptions

### patient-updates

Real-time updates to patient demographic and administrative data:

```javascript
// Subscribe to specific patient updates
const subscription = ws.subscribe(
  'patient-updates',
  {
    patientId: 'patient-123',
    fields: ['name', 'contact', 'address'],
  },
  (data) => {
    switch (data.event) {
      case 'patient.created':
        console.log('New patient created:', data.patient);
        break;
      case 'patient.updated':
        console.log('Patient updated:', data.patient);
        break;
      case 'patient.deleted':
        console.log('Patient deleted:', data.patientId);
        break;
    }
  }
);

// Subscribe to organization-wide patient updates
const orgSubscription = ws.subscribe(
  'patient-updates',
  {
    organizationId: 'org-123',
    events: ['created', 'updated'],
  },
  (data) => {
    console.log('Organization patient update:', data);
  }
);
```javascript

### patient-search

Real-time search results as patients are created or updated:

```javascript
// Subscribe to patient search results
const searchSubscription = ws.subscribe(
  'patient-search',
  {
    query: 'Smith',
    filters: {
      gender: 'male',
      birthDateRange: {
        start: '1980-01-01',
        end: '1990-12-31',
      },
    },
  },
  (data) => {
    console.log('Search results:', data.patients);
    updateSearchResults(data.patients);
  }
);
```javascript

### Clinical Subscriptions

### encounter-updates

Real-time encounter status and data updates:

```javascript
// Subscribe to encounter updates for a patient
const encounterSubscription = ws.subscribe(
  'encounter-updates',
  {
    patientId: 'patient-123',
  },
  (data) => {
    switch (data.event) {
      case 'encounter.created':
        console.log('New encounter:', data.encounter);
        addEncounterToList(data.encounter);
        break;
      case 'encounter.updated':
        console.log('Encounter updated:', data.encounter);
        updateEncounterInList(data.encounter);
        break;
      case 'encounter.status-changed':
        console.log('Encounter status changed:', data);
        updateEncounterStatus(data);
        break;
    }
  }
);

// Subscribe to encounter updates for a department
const deptSubscription = ws.subscribe(
  'encounter-updates',
  {
    departmentId: 'dept-456',
    status: ['in-progress', 'completed'],
  },
  (data) => {
    console.log('Department encounter:', data.encounter);
    updateDepartmentDashboard(data);
  }
);
```javascript

### clinical-alerts

Real-time clinical alerts and notifications:

```javascript
// Subscribe to critical clinical alerts
const alertSubscription = ws.subscribe(
  'clinical-alerts',
  {
    severity: ['critical', 'high'],
    organizationId: 'org-123',
  },
  (data) => {
    console.log('Clinical alert:', data.alert);

    // Show immediate notification
    showCriticalAlert(data.alert);

    // Log for audit
    logClinicalAlert(data.alert);
  }
);

// Subscribe to medication alerts
const medAlertSubscription = ws.subscribe(
  'clinical-alerts',
  {
    category: 'medication',
    patientId: 'patient-123',
  },
  (data) => {
    console.log('Medication alert:', data.alert);
    showMedicationAlert(data.alert);
  }
);
```javascript

### Observation Subscriptions

### vital-signs

Real-time vital signs and measurements:

```javascript
// Subscribe to patient vital signs
const vitalsSubscription = ws.subscribe(
  'vital-signs',
  {
    patientId: 'patient-123',
    categories: ['blood-pressure', 'heart-rate', 'temperature', 'oxygen-saturation'],
  },
  (data) => {
    console.log('Vital signs update:', data.observation);

    // Update vital signs chart
    updateVitalSignsChart(data.observation);

    // Check for abnormal values
    if (isAbnormal(data.observation)) {
      triggerAbnormalVitalAlert(data.observation);
    }
  }
);

// Subscribe to ICU monitoring
const icuSubscription = ws.subscribe(
  'vital-signs',
  {
    location: 'icu-1',
    realTime: true,
  },
  (data) => {
    console.log('ICU vital signs:', data.observation);
    updateICUMonitor(data.observation);
  }
);
```javascript

### lab-results

Real-time laboratory results:

```javascript
// Subscribe to lab results for a patient
const labSubscription = ws.subscribe(
  'lab-results',
  {
    patientId: 'patient-123',
    status: ['final', 'corrected'],
  },
  (data) => {
    console.log('Lab result:', data.result);

    // Update patient chart
    updateLabResults(data.result);

    // Notify ordering clinician
    notifyClinician(data.result);
  }
);

// Subscribe to critical lab results
const criticalLabSubscription = ws.subscribe(
  'lab-results',
  {
    priority: 'critical',
    organizationId: 'org-123',
  },
  (data) => {
    console.log('Critical lab result:', data.result);
    showCriticalLabAlert(data.result);
  }
);
```javascript

### Medication Subscriptions

### medication-updates

Real-time medication order and administration updates:

```javascript
// Subscribe to medication updates for a patient
const medSubscription = ws.subscribe(
  'medication-updates',
  {
    patientId: 'patient-123',
  },
  (data) => {
    switch (data.event) {
      case 'medication.ordered':
        console.log('Medication ordered:', data.medication);
        addMedicationToList(data.medication);
        break;
      case 'medication.administered':
        console.log('Medication administered:', data.administration);
        recordAdministration(data.administration);
        break;
      case 'medication.discontinued':
        console.log('Medication discontinued:', data.medication);
        removeMedicationFromList(data.medication);
        break;
    }
  }
);

// Subscribe to drug interaction alerts
const interactionSubscription = ws.subscribe(
  'medication-updates',
  {
    category: 'drug-interactions',
    patientId: 'patient-123',
  },
  (data) => {
    console.log('Drug interaction alert:', data.interaction);
    showDrugInteractionAlert(data.interaction);
  }
);
```javascript

## Event Filtering

### Filter Types

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
  severity: ['low', 'medium', 'high', 'critical'],
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
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
    end: new Date().toISOString(),
  },
  excludeResolved: true,
};

// Filter for specific encounter types
const encounterFilter = {
  patientId: 'patient-123',
  encounterTypes: ['admission', 'emergency', 'consultation'],
  status: ['in-progress', 'completed'],
  providers: ['dr-smith', 'dr-jones'],
};
```javascript

### Dynamic Filters

```javascript
// Update subscription filters
function updateSubscriptionFilters(subscriptionId, newFilters) {
  ws.send({
    type: 'update_filters',
    subscriptionId,
    filters: newFilters,
  });
}

// Example: Add time-based filter
updateSubscriptionFilters(patientSubscription, {
  ...existingFilters,
  timeRange: {
    start: '09:00',
    end: '17:00',
    timezone: 'America/New_York',
  },
});
```typescript

## Webhook Implementation

### Webhook Server

```python
## Flask webhook server
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

    return hmac.compare_digest(expected_signature.encode('utf-8'), signature.encode('utf-8'))

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

    # Log webhook
    print(f"[{timestamp}] {event_type}: {json.dumps(data)}")

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
    # update_local_database(patient_data)

    # Send notification to relevant staff
    # send_notification_to_staff(patient_data)

def handle_patient_updated(patient_data):
    """Handle patient update webhook"""
    patient_id = patient_data.get('id')
    updated_fields = patient_data.get('updatedFields', [])

    print(f"Patient {patient_id} updated. Fields: {updated_fields}")

    # Update local database
    # update_local_database(patient_data)

def handle_patient_deleted(patient_data):
    """Handle patient deletion webhook"""
    patient_id = patient_data.get('id')

    print(f"Patient {patient_id} deleted")

    # Remove from local database
    # remove_from_local_database(patient_id)

if __name__ == '__main__':
    app.run(port=3000, debug=True)
```javascript

### Webhook Retry Logic

```javascript
// Webhook delivery with retry logic
class WebhookDelivery {
  constructor(url, secret, maxRetries = 3) {
    this.url = url;
    this.secret = secret;
    this.maxRetries = maxRetries;
  }

  async deliver(event, data) {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(payloadString);

    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        const response = await fetch(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ZarishSphere-Signature': signature,
            'X-Webhook-Attempt': (attempt + 1).toString(),
          },
          body: payloadString,
        });

        if (response.ok) {
          console.log(`Webhook delivered successfully on attempt ${attempt + 1}`);
          return await response.json();
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        attempt++;
        console.error(`Webhook delivery attempt ${attempt} failed:`, error.message);

        if (attempt < this.maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Exponential backoff, max 30s
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed to deliver webhook after ${this.maxRetries} attempts`);
  }

  generateSignature(payload) {
    return hmac.create('sha256', this.secret).update(payload).digest('hex');
  }
}

// Usage
const webhookDelivery = new WebhookDelivery(
  'https://your-app.com/webhooks/patient-events',
  'your-webhook-secret'
);

// Deliver patient created event
await webhookDelivery.deliver('patient.created', {
  id: 'patient-123',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
});
```javascript

## Error Handling

### WebSocket Error Handling

```javascript
class RobustWebSocket extends ZARISHWebSocket {
  constructor(token, baseURL) {
    super(token, baseURL);
    this.errorHandlers = new Map();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    // Register error handlers
    this.errorHandlers.set('connection_error', this.handleConnectionError);
    this.errorHandlers.set('authentication_error', this.handleAuthenticationError);
    this.errorHandlers.set('subscription_error', this.handleSubscriptionError);
    this.errorHandlers.set('rate_limit_error', this.handleRateLimitError);
  }

  handleError(error) {
    const handler = this.errorHandlers.get(error.type);
    if (handler) {
      handler.call(this, error);
    } else {
      console.error('Unhandled error:', error);
    }
  }

  handleConnectionError(error) {
    console.error('Connection error:', error.message);
    // Attempt reconnection is handled by base class
  }

  handleAuthenticationError(error) {
    console.error('Authentication error:', error.message);
    // Clear token and redirect to login
    this.clearAuthentication();
  }

  handleSubscriptionError(error) {
    console.error('Subscription error:', error.message);
    // Attempt to resubscribe
    this.resubscribeAll();
  }

  handleRateLimitError(error) {
    console.error('Rate limit error:', error.message);
    // Implement backoff strategy
    this.implementBackoff();
  }

  clearAuthentication() {
    // Clear stored token
    localStorage.removeItem('authToken');
    // Redirect to login page
    window.location.href = '/login';
  }

  resubscribeAll() {
    // Resubscribe to all active subscriptions
    for (const [subscriptionId, subscription] of this.subscriptions) {
      setTimeout(() => {
        this.subscribe(subscription.channel, subscription.filters, subscription.callback);
      }, 1000);
    }
  }

  implementBackoff() {
    // Implement exponential backoff for all operations
    this.backoffMultiplier = Math.min((this.backoffMultiplier || 1) * 2, 60);
  }
}
```javascript

## Performance Optimization

### Connection Pooling

```javascript
// WebSocket connection pool for high-volume applications
class WebSocketPool {
  constructor(token, poolSize = 5) {
    this.token = token;
    this.poolSize = poolSize;
    this.connections = [];
    this.available = [];
    this.inUse = new Set();
    this.initializePool();
  }

  initializePool() {
    for (let i = 0; i < this.poolSize; i++) {
      const ws = new RobustWebSocket(this.token);
      ws.connect();
      this.connections.push(ws);
      this.available.push(ws);
    }
  }

  async getConnection() {
    if (this.available.length === 0) {
      // Wait for available connection
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.available.length > 0) {
            clearInterval(checkInterval);
            resolve(this.getAvailableConnection());
          }
        }, 100);
      });
    }

    return this.getAvailableConnection();
  }

  getAvailableConnection() {
    const ws = this.available.pop();
    this.inUse.add(ws);
    return ws;
  }

  releaseConnection(ws) {
    if (this.inUse.has(ws)) {
      this.inUse.delete(ws);
      this.available.push(ws);
    }
  }

  async subscribe(channel, filters, callback) {
    const ws = await this.getConnection();
    const subscriptionId = ws.subscribe(channel, filters, (data) => {
      callback(data);
      this.releaseConnection(ws);
    });

    return subscriptionId;
  }

  closeAll() {
    this.connections.forEach((ws) => ws.disconnect());
    this.connections = [];
    this.available = [];
    this.inUse.clear();
  }
}
```javascript

### Batch Processing

```javascript
// Batch event processing for high-throughput scenarios
class BatchProcessor {
  constructor(batchSize = 100, flushInterval = 1000) {
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.queue = [];
    this.processing = false;
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
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      await this.processBatch(batch);
    } catch (error) {
      console.error('Batch processing error:', error);
      // Re-add failed events to queue
      this.queue.unshift(...batch);
    } finally {
      this.processing = false;
    }
  }

  async processBatch(events) {
    // Process events in parallel
    const promises = events.map((event) => this.processEvent(event));
    await Promise.all(promises);
  }

  async processEvent(event) {
    // Process individual event
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Processing event:', event);
        resolve(event);
      }, Math.random() * 100); // Simulate processing time
    });
  }
}
```text

This comprehensive subscription guide provides everything needed to implement real-time healthcare data streaming and event notifications using ZARISH SPHERE APIs.
````
