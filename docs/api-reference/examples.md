---
title: 'API Examples'
sidebar_label: 'Examples'
description: 'Practical code examples and use cases for ZARISH SPHERE APIs including REST, FHIR, and GraphQL implementations'
keywords: [api, examples, code, tutorials, zarish sphere]
---

# API Examples

## Overview

This section provides practical, real-world examples for working with ZARISH SPHERE APIs. Each example includes complete code implementations, error handling, and best practices for healthcare data management.

## REST API Examples

### Patient Management

### Create a New Patient

````javascript
// Node.js example
const axios = require('axios');

class PatientAPI {
  constructor(apiKey) {
    this.baseURL = 'https://api.zarishsphere.com/v1';
    this.apiKey = apiKey;
  }

  async createPatient(patientData) {
    try {
      const response = await axios.post(`${this.baseURL}/patients`, patientData, {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.status} - ${error.response.data.error.message}`
        );
      }
      throw error;
    }
  }
}

// Usage
const api = new PatientAPI('your-api-key-here');

const newPatient = {
  firstName: 'John',
  lastName: 'Smith',
  birthDate: '1985-06-15',
  gender: 'male',
  email: 'john.smith@example.com',
  phone: '+1-555-123-4567',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    postalCode: '12345',
    country: 'USA',
  },
};

api
  .createPatient(newPatient)
  .then((patient) => {
    console.log('Patient created:', patient);
  })
  .catch((error) => {
    console.error('Error creating patient:', error.message);
  });
```javascript

### Search Patients with Filters

```python
## Python example
import requests
import json

class PatientAPI:
    def __init__(self, api_key):
        self.base_url = 'https://api.zarishsphere.com/v1'
        self.api_key = api_key
        self.headers = {
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        }

    def search_patients(self, **filters):
        """Search patients with various filters"""
        try:
            response = requests.get(
                f"{self.base_url}/patients",
                headers=self.headers,
                params=filters
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if e.response:
                error_data = e.response.json()
                raise Exception(f"API Error: {e.response.status_code} - {error_data.get('error', {}).get('message', 'Unknown error')}")
            raise e

    def get_patient_by_id(self, patient_id):
        """Get a specific patient by ID"""
        try:
            response = requests.get(
                f"{self.base_url}/patients/{patient_id}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if e.response and e.response.status_code == 404:
                raise Exception(f"Patient with ID {patient_id} not found")
            raise e

## Usage
api = PatientAPI('your-api-key-here')

## Search patients by name and gender
patients = api.search_patients(
    name='Smith',
    gender='male',
    birthDate='1985-06-15',
    page=1,
    perPage=20
)
print("Found patients:", patients['data'])

## Get specific patient
patient = api.get_patient_by_id('patient-123')
print("Patient details:", patient)
```javascript

### Batch Operations

```java
// Java example with Spring Boot
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;

@Service
public class PatientService {
    private final RestTemplate restTemplate;
    private final String apiKey;

    @Autowired
    public PatientService(RestTemplate restTemplate, String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    public List<Patient> batchCreatePatients(List<PatientCreateRequest> requests) {
        List<Patient> results = new ArrayList<>();

        for (PatientCreateRequest request : requests) {
            try {
                Patient patient = createPatient(request);
                results.add(patient);
            } catch (Exception e) {
                System.err.println("Failed to create patient: " + e.getMessage());
                // Continue with other patients
            }
        }

        return results;
    }

    public Patient createPatient(PatientCreateRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", apiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<PatientCreateRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Patient> response = restTemplate.post(
            "https://api.zarishsphere.com/v1/patients",
            entity,
            Patient.class
        );

        return response.getBody();
    }
}

// Controller example
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> batchCreatePatients(
            @RequestBody List<PatientCreateRequest> requests) {

        List<Patient> createdPatients = patientService.batchCreatePatients(requests);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", createdPatients.size());
        response.put("patients", createdPatients);

        return ResponseEntity.ok(response);
    }
}
```json

## FHIR R5 API Examples

### Patient Resource Management

### Create a FHIR Patient

```bash
## Create a FHIR Patient with humanitarian extensions
curl -X POST "https://fhir.zarishsphere.com/R5/Patient" \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [
      {
        "use": "official",
        "family": "Smith",
        "given": ["John", "William"]
      }
    ],
    "gender": "male",
    "birthDate": "1985-06-15",
    "identifier": [
      {
        "use": "official",
        "type": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
              "code": "MR",
              "display": "Medical Record Number"
            }
          ]
        },
        "system": "https://zarishsphere.com/mrn",
        "value": "MRN-2023-001234"
      }
    ],
    "extension": [
      {
        "url": "https://zarishsphere.com/fhir/StructureDefinition/humanitarian-patient",
        "extension": [
          {
            "url": "displacementStatus",
            "valueCodeableConcept": {
              "coding": [{
                "system": "https://zarishsphere.com/fhir/CodeSystem/displacement-status",
                "code": "refugee",
                "display": "Refugee"
              }]
            }
          },
          {
            "url": "campLocation",
            "valueString": "Hope Refugee Camp, Zone A"
          },
          {
            "url": "arrivalDate",
            "valueDate": "2023-03-15"
          }
        ]
      }
    ]
  }'
```javascript

### Search FHIR Resources

```javascript
// JavaScript FHIR client
class FHIRClient {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async searchPatients(searchParams) {
    const params = new URLSearchParams(searchParams);

    const response = await fetch(`${this.baseURL}/Patient?${params}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/fhir+json',
      },
    });

    if (!response.ok) {
      throw new Error(`FHIR API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async createResource(resource) {
    const resourceType = resource.resourceType;

    const response = await fetch(`${this.baseURL}/${resourceType}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/fhir+json',
      },
      body: JSON.stringify(resource),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`FHIR Error: ${error.issue[0].diagnostics}`);
    }

    return await response.json();
  }
}

// Usage
const fhirClient = new FHIRClient('https://fhir.zarishsphere.com/R5', 'your-access-token');

// Search patients by family name
const patients = await fhirClient.searchPatients({
  family: 'Smith',
  gender: 'male',
  _sort: '-_lastUpdated',
});

console.log(
  'Found patients:',
  patients.entry.map((entry) => entry.resource)
);
```javascript

### Bulk Operations

```python
## Python FHIR bulk operations
import requests
import json
import time

class FHIRBulkOperations:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Accept': 'application/fhir+ndjson',
            'Prefer': 'respond-async'
        }

    def bulk_export(self, resource_types=None, output_format='application/fhir+ndjson'):
        """Initiate bulk export of FHIR resources"""
        params = {
            '_outputFormat': output_format
        }

        if resource_types:
            params['_type'] = ','.join(resource_types)

        response = requests.get(
            f'{self.base_url}/$bulk-export',
            headers=self.headers,
            params=params
        )

        if response.status_code == 202:
            content_location = response.headers.get('Content-Location')
            return self.poll_bulk_export_status(content_location)
        else:
            response.raise_for_status()

    def poll_bulk_export_status(self, content_location):
        """Poll bulk export status until completion"""
        while True:
            response = requests.get(content_location, headers=self.headers)

            if response.headers.get('X-Progress') == '100':
                return response.text
            elif response.status_code == 202:
                time.sleep(5)  # Wait 5 seconds before polling again
            else:
                response.raise_for_status()

    def bulk_import(self, ndjson_data):
        """Import FHIR resources from NDJSON data"""
        response = requests.post(
            f'{self.base_url}/',
            headers={
                **self.headers,
                'Content-Type': 'application/fhir+ndjson'
            },
            data=ndjson_data
        )

        response.raise_for_status()
        return response.json()

## Usage
bulk_ops = FHIRBulkOperations('https://fhir.zarishsphere.com/R5', 'your-access-token')

## Export all patients and observations
export_result = bulk_ops.bulk_export(['Patient', 'Observation'])
print("Bulk export completed:", export_result)

## Import patients from NDJSON file
with open('patients.ndjson', 'r') as f:
    ndjson_data = f.read()

import_result = bulk_ops.bulk_import(ndjson_data)
print("Bulk import result:", import_result)
```javascript

## GraphQL API Examples

### React Integration

```javascript
// React with Apollo Client
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { InMemoryCache } from '@apollo/client';

const GET_PATIENT = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
      birthDate
      gender
      email
      phone
      address {
        street
        city
        state
        postalCode
      }
      encounters(first: 10) {
        edges {
          node {
            id
            status
            class {
              display
            }
            period {
              start
              end
            }
          }
        }
      }
    }
  }
`;

const CREATE_OBSERVATION = gql`
  mutation CreateObservation($input: CreateObservationInput!) {
    createObservation(input: $input) {
      id
      status
      code {
        coding {
          display
        }
      }
      effectiveDateTime
      valueQuantity {
        value
        unit
      }
    }
  }
`;

function PatientProfile({ patientId }) {
  const { loading, error, data } = useQuery(GET_PATIENT, {
    variables: { id: patientId },
  });

  const [createObservation] = useMutation(CREATE_OBSERVATION);

  const handleAddVitalSigns = async (vitalData) => {
    try {
      await createObservation({
        variables: {
          input: {
            status: 'final',
            category: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'vital-signs',
                  display: 'Vital Signs',
                },
              ],
            },
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: vitalData.code,
                  display: vitalData.display,
                },
              ],
            },
            subjectId: patientId,
            effectiveDateTime: new Date().toISOString(),
            valueQuantity: {
              value: vitalData.value,
              unit: vitalData.unit,
            },
          },
        },
      });

      console.log('Vital sign added successfully');
    } catch (error) {
      console.error('Error adding vital sign:', error);
    }
  };

  if (loading) return <div>Loading patient data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="patient-profile">
      <h2>
        {data.patient.firstName} {data.patient.lastName}
      </h2>
      <div className="patient-info">
        <p>
          <strong>DOB:</strong> {data.patient.birthDate}
        </p>
        <p>
          <strong>Gender:</strong> {data.patient.gender}
        </p>
        <p>
          <strong>Email:</strong> {data.patient.email}
        </p>
        <p>
          <strong>Phone:</strong> {data.patient.phone}
        </p>
      </div>

      <div className="encounters">
        <h3>Recent Encounters</h3>
        {data.patient.encounters.edges.map(({ node }) => (
          <div key={node.id} className="encounter">
            <h4>{node.class.display}</h4>
            <p>
              {node.period.start} - {node.period.end || 'Ongoing'}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          handleAddVitalSigns({ code: '8302-2', display: 'Body height', value: 175, unit: 'cm' })
        }
      >
        Add Height
      </button>
    </div>
  );
}

// Apollo Client setup
const client = new ApolloClient({
  uri: 'https://api.zarishsphere.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <PatientProfile patientId="patient-123" />
    </ApolloProvider>
  );
}
```javascript

### Python GraphQL Client

```python
## Python GraphQL client
import requests
import json
from typing import Dict, Any, List, Optional

class GraphQLClient:
    def __init__(self, url: str, token: str):
        self.url = url
        self.token = token
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def query(self, query: str, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute GraphQL query"""
        payload = {
            'query': query,
            'variables': variables or {}
        }

        response = requests.post(
            self.url,
            headers=self.headers,
            json=payload
        )

        response.raise_for_status()
        data = response.json()

        if 'errors' in data:
            raise Exception(f"GraphQL Error: {data['errors']}")

        return data['data']

    def mutate(self, mutation: str, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute GraphQL mutation"""
        payload = {
            'query': mutation,
            'variables': variables or {}
        }

        response = requests.post(
            self.url,
            headers=self.headers,
            json=payload
        )

        response.raise_for_status()
        data = response.json()

        if 'errors' in data:
            raise Exception(f"GraphQL Error: {data['errors']}")

        return data['data']

## Usage
client = GraphQLClient('https://api.zarishsphere.com/graphql', 'your-access-token')

## Query patient with encounters
query = '''
  query GetPatientWithEncounters($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
      birthDate
      gender
      encounters(first: 5) {
        edges {
          node {
            id
            status
            class {
              display
            }
            period {
              start
              end
            }
          }
        }
      }
    }
  }
'''

result = client.query(query, {'id': 'patient-123'})
print("Patient data:", result['patient'])

## Create new observation
mutation = '''
  mutation CreateObservation($input: CreateObservationInput!) {
    createObservation(input: $input) {
      id
      status
      code {
        coding {
          display
        }
      }
      effectiveDateTime
      valueQuantity {
        value
        unit
      }
    }
  }
  }
'''

variables = {
  'input': {
    'status': 'final',
    'category': {
      'coding': [{
        'system': 'http://terminology.hl7.org/CodeSystem/observation-category',
        'code': 'vital-signs',
        'display': 'Vital Signs'
      }]
    },
    'code': {
      'coding': [{
        'system': 'http://loinc.org',
        'code': '8302-2',
        'display': 'Body height'
      }]
    },
    'subjectId': 'patient-123',
    'effectiveDateTime': '2023-12-01T10:30:00Z',
    'valueQuantity': {
      'value': 175,
      'unit': 'cm'
    }
  }
}

result = client.mutate(mutation, variables)
print("Created observation:", result['createObservation'])
```typescript

## Real-time Examples

### WebSocket Integration

```javascript
// WebSocket client for real-time updates
class ZARISHWebSocket {
  constructor(token) {
    this.token = token;
    this.ws = null;
    this.subscriptions = new Map();
  }

  connect() {
    this.ws = new WebSocket('wss://ws.zarishsphere.com/v1');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.authenticate();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Implement reconnection logic
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  authenticate() {
    this.send({
      type: 'auth',
      token: this.token,
    });
  }

  subscribe(channel, callback) {
    const subscriptionId = Date.now().toString();
    this.subscriptions.set(subscriptionId, callback);

    this.send({
      type: 'subscribe',
      channel: channel,
      subscriptionId: subscriptionId,
    });
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  handleMessage(data) {
    const { type, channel, subscriptionId, payload } = data;

    if (type === 'subscription_update' && this.subscriptions.has(subscriptionId)) {
      const callback = this.subscriptions.get(subscriptionId);
      callback(payload);
    }
  }

  unsubscribe(subscriptionId) {
    this.subscriptions.delete(subscriptionId);

    this.send({
      type: 'unsubscribe',
      subscriptionId: subscriptionId,
    });
  }
}

// Usage
const ws = new ZARISHWebSocket('your-access-token');
ws.connect();

// Subscribe to patient updates
ws.subscribe('patient-updates', (data) => {
  console.log('Patient update:', data);

  // Update UI with new patient data
  updatePatientUI(data.patient);
});

// Subscribe to clinical alerts
ws.subscribe('clinical-alerts', (data) => {
  console.log('Clinical alert:', data);

  // Show alert notification
  showAlert(data.alert);
});
```typescript

### Webhook Integration

```python
## Flask webhook handler for ZARISH SPHERE
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

    return hmac.compare_digest(expected_signature.encode('utf-8'), signature.encode('utf-8')) == 0

@app.route('/webhook', methods=['POST'])
def handle_webhook():
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

    # Handle different event types
    event_type = webhook_data.get('event')

    if event_type == 'patient.created':
        handle_patient_created(webhook_data['data'])
    elif event_type == 'encounter.updated':
        handle_encounter_updated(webhook_data['data'])
    elif event_type == 'observation.created':
        handle_observation_created(webhook_data['data'])

    return jsonify({'status': 'received'}), 200

def handle_patient_created(patient_data):
    """Handle patient creation webhook"""
    print(f"New patient created: {patient_data['firstName']} {patient_data['lastName']}")

    # Update local database
    # update_local_patient_database(patient_data)

    # Send notification to relevant staff
    # send_notification_to_staff(patient_data)

def handle_encounter_updated(encounter_data):
    """Handle encounter update webhook"""
    print(f"Encounter updated: {encounter_data['id']} - Status: {encounter_data['status']}")

    # Update local database
    # update_local_encounter_database(encounter_data)

def handle_observation_created(observation_data):
    """Handle observation creation webhook"""
    print(f"New observation: {observation_data['code']['coding'][0]['display']}")

    # Check for abnormal values
    if is_abnormal_observation(observation_data):
        send_clinician_alert(observation_data)

def is_abnormal_observation(observation):
    """Check if observation value is abnormal"""
    # Implement abnormal value detection logic
    return False

if __name__ == '__main__':
    app.run(port=3000, debug=True)
```typescript

## Error Handling Examples

### Comprehensive Error Handler

```javascript
class APIErrorHandler {
  static handle(error, context = {}) {
    console.error('API Error:', error);

    // Log error details
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
    };

    // Send to logging service
    this.logError(errorDetails);

    // Determine error type and handle accordingly
    if (error.response) {
      return this.handleHTTPError(error);
    } else if (error.code === 'ECONNREFUSED') {
      return this.handleConnectionError(error);
    } else {
      return this.handleGenericError(error);
    }
  }

  static handleHTTPError(error) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          type: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: data?.error?.details || 'No details available',
        };

      case 401:
        return {
          type: 'AUTHENTICATION_ERROR',
          message: 'Authentication required',
          details: 'Please check your API credentials',
        };

      case 403:
        return {
          type: 'PERMISSION_ERROR',
          message: 'Insufficient permissions',
          details: 'You do not have permission to perform this action',
        };

      case 404:
        return {
          type: 'NOT_FOUND_ERROR',
          message: 'Resource not found',
          details: 'The requested resource could not be found',
        };

      case 429:
        return {
          type: 'RATE_LIMIT_ERROR',
          message: 'Rate limit exceeded',
          details: 'Please wait before making more requests',
        };

      case 500:
        return {
          type: 'SERVER_ERROR',
          message: 'Internal server error',
          details: 'An unexpected error occurred on the server',
        };

      default:
        return {
          type: 'UNKNOWN_ERROR',
          message: `HTTP ${status} error`,
          details: data?.error?.message || 'Unknown error occurred',
        };
    }
  }

  static handleConnectionError(error) {
    return {
      type: 'CONNECTION_ERROR',
      message: 'Connection failed',
      details: 'Unable to connect to the API server',
    };
  }

  static handleGenericError(error) {
    return {
      type: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      details: error.message,
    };
  }

  static logError(errorDetails) {
    // Send to logging service
    console.error('Error logged:', JSON.stringify(errorDetails, null, 2));
  }
}

// Usage example
try {
  const patient = await api.createPatient(patientData);
  console.log('Patient created:', patient);
} catch (error) {
  const errorResponse = APIErrorHandler.handle(error, {
    operation: 'createPatient',
    patientId: patientData.id,
  });

  console.error('Error:', errorResponse);

  // Show user-friendly error message
  showUserError(errorResponse.message);
}
```javascript

## Testing Examples

### Unit Testing

```javascript
// Jest test examples for API testing
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('Patient API', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock.onAny().reply(200, {});
  });

  afterEach(() => {
    mock.reset();
  });

  describe('createPatient', () => {
    it('should create a patient successfully', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1985-06-15',
        gender: 'male',
      };

      mock.onPost('/v1/patients').reply(201, {
        id: 'patient-123',
        ...patientData,
        createdAt: '2023-12-01T10:30:00Z',
      });

      const api = new PatientAPI('test-api-key');
      const result = await api.createPatient(patientData);

      expect(result.id).toBe('patient-123');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        firstName: '', // Invalid: empty string
        lastName: 'Doe',
        birthDate: '1985-06-15',
        gender: 'male',
      };

      mock.onPost('/v1/patients').reply(400, {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request parameters',
          details: {
            field: 'firstName',
            reason: 'First name is required',
          },
        },
      });

      const api = new PatientAPI('test-api-key');

      await expect(api.createPatient(invalidData)).rejects.toThrow(
        'API Error: 400 - Invalid request parameters'
      );
    });

    it('should handle network errors', async () => {
      mock.onPost('/v1/patients').networkError();

      const api = new PatientAPI('test-api-key');

      await expect(api.createPatient({})).rejects.toThrow('Connection failed');
    });
  });
});
```javascript

### Integration Testing

```python
## Pytest integration tests
import pytest
import requests
import json

class TestPatientAPI:
    def __init__(self):
        self.base_url = 'https://api.zarishsphere.com/v1'
        self.api_key = 'test-api-key'
        self.headers = {
            'X-API-Key': self.api_key,
            'Content-Type': 'application/json'
        }

    def create_patient(self, patient_data):
        return requests.post(
            f'{self.base_url}/patients',
            headers=self.headers,
            json=patient_data
        )

    def get_patient(self, patient_id):
        return requests.get(
            f'{self.base_url}/patients/{patient_id}',
            headers=self.headers
        )

    def delete_patient(self, patient_id):
        return requests.delete(
            f'{self.base_url}/patients/{patient_id}',
            headers=self.headers
        )

@pytest.fixture
def api():
    return TestPatientAPI()

@pytest.fixture
def sample_patient():
    return {
        'firstName': 'Test',
        'lastName': 'Patient',
        'birthDate': '1990-01-01',
        'gender': 'female',
        'email': 'test@example.com',
        'phone': '+1-555-123-4567'
    }

def test_create_patient(api, sample_patient):
    """Test creating a new patient"""
    response = api.create_patient(sample_patient)

    assert response.status_code == 201
    data = response.json()

    assert data['firstName'] == sample_patient['firstName']
    assert data['lastName'] == sample_patient['lastName']
    assert data['birthDate'] == sample_patient['birthDate']
    assert data['gender'] == sample_patient['gender']
    assert 'id' in data
    assert 'createdAt' in data

def test_get_patient(api, sample_patient):
    """Test retrieving a patient"""
    # First create a patient
    create_response = api.create_patient(sample_patient)
    patient_id = create_response.json()['id']

    # Then retrieve it
    response = api.get_patient(patient_id)

    assert response.status_code == 200
    data = response.json()

    assert data['id'] == patient_id
    assert data['firstName'] == sample_patient['firstName']
    assert data['lastName'] == sample_patient['lastName']

def test_update_patient(api, sample_patient):
    """Test updating a patient"""
    # First create a patient
    create_response = api.create_patient(sample_patient)
    patient_id = create_response.json()['id']

    # Update the patient
    updated_data = {
        'email': 'updated@example.com',
        'phone': '+1-555-987-6543'
    }

    response = requests.patch(
        f'{api.base_url}/patients/{patient_id}',
        headers={**api.headers, 'Content-Type': 'application/json'},
        json=updated_data
    )

    assert response.status_code == 200
    data = response.json()

    assert data['email'] == updated_data['email']
    assert data['phone'] == updated_data['phone']

def test_delete_patient(api, sample_patient):
    """Test deleting a patient"""
    # First create a patient
    create_response = api.create_patient(sample_patient)
    patient_id = create_response.json()['id']

    # Then delete it
    response = api.delete_patient(patient_id)

    assert response.status_code == 200
    data = response.json()

    assert data['success'] is True
    assert data['id'] == patient_id

def test_patient_not_found(api):
    """Test retrieving non-existent patient"""
    response = api.get_patient('non-existent-id')

    assert response.status_code == 404
    data = response.json()

    assert 'error' in data
    assert data['error']['code'] == 'NOT_FOUND'

if __name__ == '__main__':
    pytest.main([__file__])
```text

These examples provide comprehensive implementations for working with ZARISH SPHERE APIs across different programming languages and use cases, from basic CRUD operations to real-time integrations and testing.
````
