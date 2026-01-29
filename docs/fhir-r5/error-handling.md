---
title: 'Error Handling'
sidebar_label: 'Error Handling'
description: 'Comprehensive guide to FHIR R5 error handling and troubleshooting in ZARISH SPHERE'
keywords: [error handling, fhir r5, troubleshooting, operation outcome, healthcare, zarish sphere]
---

# FHIR R5 Error Handling

## Overview

ZARISH SPHERE implements comprehensive FHIR R5 error handling mechanisms to provide clear, actionable feedback when API operations encounter issues. This guide covers error types, response formats, and troubleshooting strategies for healthcare data exchange.

## Error Response Format

### OperationOutcome Resource

All FHIR R5 errors return an `OperationOutcome` resource with detailed error information:

````json
{
  "resourceType": "OperationOutcome",
  "id": "error-123",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/tools/CodeSystem/issue-severity",
            "code": "error",
            "display": "Error"
          }
        ],
        "text": "Invalid resource format"
      },
      "diagnostics": "Patient.birthDate must be in YYYY-MM-DD format",
      "location": ["Patient.birthDate"],
      "expression": ["Patient.birthDate"]
    }
  ]
}
```json

### Error Severity Levels

| Severity        | Description                       | Use Case                        |
| --------------- | --------------------------------- | ------------------------------- |
| **fatal**       | System cannot continue processing | Database connection failure     |
| **error**       | Request cannot be processed       | Invalid data format             |
| **warning**     | Request processed with warnings   | Deprecated field used           |
| **information** | Informational message             | Successful operation with notes |

## Common Error Types

### 1. HTTP Status Codes

| Status Code | Category       | Description           | Common Causes                         |
| ----------- | -------------- | --------------------- | ------------------------------------- |
| **400**     | Client Error   | Bad request           | Invalid JSON, missing required fields |
| **401**     | Authentication | Unauthorized          | Invalid or missing access token       |
| **403**     | Authorization  | Forbidden             | Insufficient permissions              |
| **404**     | Client Error   | Not found             | Resource doesn't exist                |
| **409**     | Client Error   | Conflict              | Resource already exists               |
| **422**     | Client Error   | Unprocessable entity  | Validation failed                     |
| **429**     | Client Error   | Too many requests     | Rate limit exceeded                   |
| **500**     | Server Error   | Internal server error | Unexpected system error               |

### 2. FHIR Error Codes

| Error Code      | Description              | Example                   |
| --------------- | ------------------------ | ------------------------- |
| `invalid`       | Invalid content          | Invalid date format       |
| `structure`     | Structural issue         | Missing required element  |
| `required`      | Required element missing | Patient.name is required  |
| `value`         | Invalid value            | Invalid gender code       |
| `invariant`     | Business rule violation  | Duplicate identifier      |
| `security`      | Security issue           | Invalid access token      |
| `login`         | Authentication required  | User not logged in        |
| `unknown`       | Unknown error            | Unexpected error          |
| `expired`       | Resource expired         | Access token expired      |
| `business-rule` | Business rule violation  | Invalid status transition |

## Resource-Specific Errors

### Patient Resource Errors

### Common Patient Errors

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "required",
      "details": {
        "text": "Patient must have at least one name"
      },
      "location": ["Patient.name"]
    }
  ]
}
```json

### Validation Examples

```javascript
// Invalid birth date
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "value",
      "details": {
        "text": "Birth date cannot be in the future"
      },
      "location": ["Patient.birthDate"]
    }
  ]
}

// Duplicate identifier
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invariant",
      "details": {
        "text": "Patient identifier already exists"
      },
      "location": ["Patient.identifier[0].value"]
    }
  ]
}
```json

### Observation Resource Errors

### Common Observation Errors

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "required",
      "details": {
        "text": "Observation must have a value or component values"
      },
      "location": ["Observation"]
    }
  ]
}
```json

### Medication Resource Errors

### Common Medication Errors

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "required",
      "details": {
        "text": "Medication must have at least one ingredient"
      },
      "location": ["Medication.ingredient"]
    }
  ]
}
```json

## ZARISH SPHERE Custom Errors

### Humanitarian Extensions

### Displacement Status Errors

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "business-rule",
      "details": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/error-codes",
            "code": "invalid-displacement-status",
            "display": "Invalid displacement status for patient type"
          }
        ],
        "text": "Displaced patients must have camp location specified"
      },
      "location": ["Patient.extension[0].extension[1]"]
    }
  ]
}
```json

### Resource Constraint Errors

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "warning",
      "code": "business-rule",
      "details": {
        "coding": [
          {
            "system": "https://zarishsphere.com/fhir/CodeSystem/error-codes",
            "code": "resource-constraint-warning",
            "display": "Resource constraint detected"
          }
        ],
        "text": "Procedure requires advanced equipment not available in current setting"
      },
      "location": ["Procedure.extension[0]"]
    }
  ]
}
```javascript

## Error Handling Best Practices

### 1. Client-Side Error Handling

### JavaScript/TypeScript

```javascript
async function createPatient(patientData) {
  try {
    const response = await fetch('/fhir/Patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      handleFhirError(errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

function handleFhirError(operationOutcome) {
  for (const issue of operationOutcome.issue) {
    switch (issue.severity) {
      case 'error':
        console.error(`Error: ${issue.details?.text || issue.code}`);
        break;
      case 'warning':
        console.warn(`Warning: ${issue.details?.text || issue.code}`);
        break;
      case 'information':
        console.info(`Info: ${issue.details?.text || issue.code}`);
        break;
    }
  }
}
```javascript

### Python

```python
import requests
from fhir.resources.operationoutcome import OperationOutcome

def create_patient(patient_data, access_token):
    headers = {
        'Content-Type': 'application/fhir+json',
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.post(
        '/fhir/Patient',
        json=patient_data,
        headers=headers
    )

    if response.status_code >= 400:
        error_data = response.json()
        handle_fhir_error(error_data)
        return None

    return response.json()

def handle_fhir_error(operation_outcome):
    for issue in operation_outcome.get('issue', []):
        severity = issue.get('severity', 'unknown')
        details = issue.get('details', {}).get('text', issue.get('code', 'Unknown error'))

        if severity == 'error':
            print(f"Error: {details}")
        elif severity == 'warning':
            print(f"Warning: {details}")
        elif severity == 'information':
            print(f"Info: {details}")
```javascript

### 2. Retry Logic Implementation

### Exponential Backoff

```javascript
class FHIRClient {
  constructor(baseURL, accessToken) {
    this.baseURL = baseURL;
    this.accessToken = accessToken;
    this.maxRetries = 3;
    this.baseDelay = 1000;
  }

  async makeRequest(url, options = {}) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/fhir+json',
            Authorization: `Bearer ${this.accessToken}`,
            ...options.headers,
          },
        });

        if (response.ok) {
          return response.json();
        }

        const errorData = await response.json();

        // Don't retry on client errors (4xx)
        if (response.status < 500) {
          throw new FHIRError(errorData);
        }

        lastError = new FHIRError(errorData);

        if (attempt < this.maxRetries) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      } catch (error) {
        lastError = error;

        if (attempt < this.maxRetries) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

class FHIRError extends Error {
  constructor(operationOutcome) {
    super(operationOutcome.issue?.[0]?.details?.text || 'FHIR Error');
    this.operationOutcome = operationOutcome;
  }
}
```javascript

### 3. Validation Before Request

### Pre-Request Validation

```javascript
function validatePatient(patient) {
  const errors = [];

  // Required fields
  if (!patient.name || patient.name.length === 0) {
    errors.push('Patient must have at least one name');
  }

  if (!patient.gender) {
    errors.push('Patient gender is required');
  }

  if (!patient.birthDate) {
    errors.push('Patient birth date is required');
  }

  // Format validation
  if (patient.birthDate && !isValidDate(patient.birthDate)) {
    errors.push('Birth date must be in YYYY-MM-DD format');
  }

  if (patient.gender && !['male', 'female', 'other', 'unknown'].includes(patient.gender)) {
    errors.push('Gender must be one of: male, female, other, unknown');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

class ValidationError extends Error {
  constructor(errors) {
    super(`Validation failed: ${errors.join(', ')}`);
    this.errors = errors;
  }
}
```json

## Troubleshooting Guide

### 1. Common Issues and Solutions

### Authentication Issues

**Problem**: 401 Unauthorized errors

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "security",
      "details": {
        "text": "Invalid or expired access token"
      }
    }
  ]
}
```json

**Solution**:

- Check access token validity
- Refresh token if expired
- Verify token scope includes required permissions

### Validation Issues

**Problem**: 422 Unprocessable Entity

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "text": "Invalid birthDate format"
      },
      "location": ["Patient.birthDate"]
    }
  ]
}
```json

**Solution**:

- Validate date format (YYYY-MM-DD)
- Check for future dates
- Ensure required fields are present

### Resource Conflicts

**Problem**: 409 Conflict

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invariant",
      "details": {
        "text": "Resource already exists"
      }
    }
  ]
}
```javascript

**Solution**:

- Use PUT instead of POST for updates
- Check for existing resources before creation
- Use conditional operations

### 2. Debugging Tools

### Request/Response Logging

```javascript
function debugRequest(url, options) {
  console.log('Request URL:', url);
  console.log('Request Headers:', options.headers);
  if (options.body) {
    console.log('Request Body:', JSON.parse(options.body));
  }
}

function debugResponse(response) {
  console.log('Response Status:', response.status);
  console.log('Response Headers:', response.headers);
  response.json().then((data) => {
    console.log('Response Body:', data);
  });
}
```javascript

### Error Analysis

```javascript
function analyzeError(error) {
  if (error instanceof FHIRError) {
    const issue = error.operationOutcome.issue[0];
    console.log('Error Code:', issue.code);
    console.log('Error Severity:', issue.severity);
    console.log('Error Details:', issue.details?.text);
    console.log('Error Location:', issue.location);
    console.log('Error Expression:', issue.expression);
  } else {
    console.log('Network Error:', error.message);
  }
}
```javascript

## Monitoring and Alerting

### 1. Error Metrics

```javascript
class ErrorMonitor {
  constructor() {
    this.errorCounts = new Map();
    this.errorCountsByType = new Map();
    this.errorCountsByResource = new Map();
  }

  recordError(error, resourceType) {
    // Count total errors
    const total = this.errorCounts.get('total') || 0;
    this.errorCounts.set('total', total + 1);

    // Count by error type
    const errorType = error.code || 'unknown';
    const typeCount = this.errorCountsByType.get(errorType) || 0;
    this.errorCountsByType.set(errorType, typeCount + 1);

    // Count by resource type
    const resourceCount = this.errorCountsByResource.get(resourceType) || 0;
    this.errorCountsByResource.set(resourceType, resourceCount + 1);

    // Alert on high error rates
    if (total > 100) {
      this.sendAlert('High error rate detected');
    }
  }

  sendAlert(message) {
    console.error('ALERT:', message);
    // Send to monitoring system
  }
}
```javascript

### 2. Performance Monitoring

```javascript
class PerformanceMonitor {
  constructor() {
    this.requestTimes = [];
    this.slowRequests = [];
  }

  recordRequest(url, duration, success) {
    this.requestTimes.push({
      url,
      duration,
      success,
      timestamp: new Date(),
    });

    if (duration > 5000) {
      // 5 seconds
      this.slowRequests.push({
        url,
        duration,
        timestamp: new Date(),
      });
    }
  }

  getMetrics() {
    const avgTime =
      this.requestTimes.reduce((sum, req) => sum + req.duration, 0) / this.requestTimes.length;
    const errorRate =
      this.requestTimes.filter((req) => !req.success).length / this.requestTimes.length;

    return {
      averageResponseTime: avgTime,
      errorRate: errorRate,
      slowRequestCount: this.slowRequests.length,
      totalRequests: this.requestTimes.length,
    };
  }
}
```text

This comprehensive error handling guide ensures robust FHIR R5 integration with proper error detection, reporting, and recovery mechanisms for healthcare applications.
````
