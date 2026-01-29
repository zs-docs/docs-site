---
title: 'API Errors'
sidebar_label: 'Errors'
description: 'Comprehensive guide to ZARISH SPHERE API error codes, handling, and troubleshooting'
keywords: [api, errors, error handling, troubleshooting, zarish sphere]
---

# API Errors

## Overview

ZARISH SPHERE APIs use standard HTTP status codes and detailed error responses to help you troubleshoot issues. This guide covers all possible error types, their meanings, and how to handle them effectively.

## Error Response Format

All API errors follow this consistent structure:

````json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "field_name",
      "reason": "Specific reason for the error"
    },
    "requestId": "req-123456",
    "timestamp": "2023-12-01T10:30:00Z"
  }
}
```text

## HTTP Status Codes

### Success Codes

| Status | Meaning    | Description                             |
| ------ | ---------- | --------------------------------------- |
| 200    | OK         | Request successful                      |
| 201    | Created    | Resource created successfully           |
| 202    | Accepted   | Request accepted for processing         |
| 204    | No Content | Request successful, no content returned |

### Client Error Codes

| Status | Meaning              | Description                       |
| ------ | -------------------- | --------------------------------- |
| 400    | Bad Request          | Invalid request parameters        |
| 401    | Unauthorized         | Authentication required or failed |
| 403    | Forbidden            | Insufficient permissions          |
| 404    | Not Found            | Resource not found                |
| 405    | Method Not Allowed   | HTTP method not supported         |
| 409    | Conflict             | Resource conflict                 |
| 422    | Unprocessable Entity | Validation failed                 |
| 429    | Too Many Requests    | Rate limit exceeded               |

### Server Error Codes

| Status | Meaning               | Description                     |
| ------ | --------------------- | ------------------------------- |
| 500    | Internal Server Error | Server error                    |
| 502    | Bad Gateway           | Invalid response from upstream  |
| 503    | Service Unavailable   | Service temporarily unavailable |
| 504    | Gateway Timeout       | Upstream timeout                |

## Error Codes Reference

### Authentication Errors

### `UNAUTHORIZED`

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": {
      "reason": "Missing or invalid API key"
    }
  }
}
```javascript

**Causes:**

- Missing API key
- Invalid API key
- Expired access token
- Invalid token format

**Solution:**

```javascript
// Check API key is present
if (!apiKey) {
  throw new Error('API key is required');
}

// Use correct header
const headers = {
  'X-API-Key': apiKey,
  'Content-Type': 'application/json',
};
```text

### `TOKEN_EXPIRED`

```json
{
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Access token has expired",
    "details": {
      "expiredAt": "2023-12-01T09:30:00Z"
    }
  }
}
```javascript

**Solution:**

```javascript
async function refreshToken() {
  const response = await fetch('/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&client_id=xxx&client_secret=xxx',
  });

  const data = await response.json();
  return data.access_token;
}
```text

### Validation Errors

### `VALIDATION_ERROR`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "birthDate",
      "reason": "Invalid date format. Use YYYY-MM-DD",
      "value": "15/06/1985"
    }
  }
}
```javascript

**Common Validation Errors:**

- Invalid email format
- Invalid date format
- Missing required fields
- Invalid phone number format
- Invalid gender value

**Solution:**

```javascript
function validatePatientData(data) {
  const errors = [];

  if (!data.firstName || data.firstName.trim().length < 1) {
    errors.push({ field: 'firstName', reason: 'First name is required' });
  }

  if (!data.lastName || data.lastName.trim().length < 1) {
    errors.push({ field: 'lastName', reason: 'Last name is required' });
  }

  if (!data.birthDate || !isValidDate(data.birthDate)) {
    errors.push({ field: 'birthDate', reason: 'Invalid date format. Use YYYY-MM-DD' });
  }

  if (!['male', 'female', 'other'].includes(data.gender)) {
    errors.push({ field: 'gender', reason: 'Gender must be male, female, or other' });
  }

  return errors;
}

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
```text

### `INVALID_PARAMETER`

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid parameter value",
    "details": {
      "parameter": "page",
      "reason": "Page number must be a positive integer",
      "value": "abc"
    }
  }
}
```javascript

**Solution:**

```javascript
function validatePaginationParams(params) {
  const errors = [];

  if (params.page && !Number.isInteger(Number(params.page))) {
    errors.push({
      parameter: 'page',
      reason: 'Page number must be a positive integer',
    });
  }

  if (params.perPage && (params.perPage < 1 || params.perPage > 100)) {
    errors.push({
      parameter: 'perPage',
      reason: 'Items per page must be between 1 and 100',
    });
  }

  return errors;
}
```text

### Resource Errors

### `NOT_FOUND`

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": {
      "resource": "Patient",
      "id": "patient-999"
    }
  }
}
```javascript

**Causes:**

- Invalid resource ID
- Resource was deleted
- Wrong endpoint URL

**Solution:**

```javascript
async function getPatient(id) {
  try {
    const response = await fetch(`/api/v1/patients/${id}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    if (response.status === 404) {
      throw new Error(`Patient with ID ${id} not found`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
}
```text

### `RESOURCE_CONFLICT`

```json
{
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "Resource conflict",
    "details": {
      "field": "mrn",
      "reason": "Medical record number already exists",
      "value": "MRN-2023-001234"
    }
  }
}
```javascript

**Solution:**

```javascript
async function createPatientWithRetry(patientData, maxRetries = 3) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch('/api/v1/patients', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (response.status === 409) {
        const error = await response.json();
        if (error.error.details.field === 'mrn') {
          // Generate new MRN and retry
          patientData.mrn = generateNewMRN();
          retryCount++;
          continue;
        }
      }

      return await response.json();
    } catch (error) {
      if (retryCount === maxRetries - 1) throw error;
      retryCount++;
    }
  }
}
```text

### Permission Errors

### `FORBIDDEN`

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions",
    "details": {
      "required": "patient.write",
      "current": "patient.read"
    }
  }
}
```javascript

**Solution:**

```javascript
async function checkPermissions(requiredPermission) {
  const response = await fetch('/api/v1/auth/permissions', {
    headers: {
      'X-API-Key': apiKey,
    },
  });

  const permissions = await response.json();

  if (!permissions.includes(requiredPermission)) {
    throw new Error(`Insufficient permissions. Required: ${requiredPermission}`);
  }

  return true;
}
```text

### Rate Limiting Errors

### `RATE_LIMIT_EXCEEDED`

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 1000,
      "resetTime": "2023-12-01T10:31:00Z",
      "retryAfter": 60
    }
  }
}
```javascript

**Solution:**

```javascript
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  async makeRequest(url, options = {}) {
    const key = options.apiKey || 'default';
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 1000;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const requestTimes = this.requests.get(key);

    // Remove old requests outside the window
    const validRequests = requestTimes.filter((time) => now - time < windowMs);
    this.requests.set(key, validRequests);

    if (validRequests.length >= maxRequests) {
      const oldestRequest = Math.min(...validRequests);
      const waitTime = windowMs - (now - oldestRequest);

      console.log(`Rate limit hit. Waiting ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    // Add current request
    this.requests.get(key).push(now);

    // Make the actual request
    return fetch(url, options);
  }
}
```text

### Server Errors

### `INTERNAL_ERROR`

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "details": {
      "requestId": "req-123456"
    }
  }
}
```javascript

**Solution:**

```javascript
async function makeRequestWithRetry(url, options = {}, maxRetries = 3) {
  let retryCount = 0;
  let lastError;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, options);

      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      retryCount++;

      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Request failed, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```javascript

## Error Handling Best Practices

### 1. Centralized Error Handler

```javascript
class APIError extends Error {
  constructor(message, code, details, requestId) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

class APIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.zarishsphere.com/v1';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new APIError(
          errorData.error.message,
          errorData.error.code,
          errorData.error.details,
          errorData.error.requestId
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError('Network error occurred', 'NETWORK_ERROR', {
        originalError: error.message,
      });
    }
  }
}
```javascript

### 2. Error Recovery Strategies

```javascript
class ResilientAPIClient extends APIClient {
  async requestWithRetry(endpoint, options = {}, maxRetries = 3) {
    let retryCount = 0;
    let lastError;

    while (retryCount < maxRetries) {
      try {
        return await this.request(endpoint, options);
      } catch (error) {
        lastError = error;

        // Don't retry on client errors
        if (error.code && error.code >= 400 && error.code < 500) {
          throw error;
        }

        retryCount++;

        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  async requestWithCircuitBreaker(endpoint, options = {}) {
    const circuitBreaker = this.getCircuitBreaker(endpoint);

    if (circuitBreaker.isOpen()) {
      throw new APIError('Circuit breaker is open', 'CIRCUIT_BREAKER_OPEN', { endpoint });
    }

    try {
      const result = await this.request(endpoint, options);
      circuitBreaker.recordSuccess();
      return result;
    } catch (error) {
      circuitBreaker.recordFailure();
      throw error;
    }
  }

  getCircuitBreaker(endpoint) {
    if (!this.circuitBreakers) {
      this.circuitBreakers = new Map();
    }

    if (!this.circuitBreakers.has(endpoint)) {
      this.circuitBreakers.set(endpoint, new CircuitBreaker());
    }

    return this.circuitBreakers.get(endpoint);
  }
}

class CircuitBreaker {
  constructor() {
    this.failureCount = 0;
    this.failureThreshold = 5;
    this.recoveryTimeout = 60000;
    this.lastFailureTime = null;
    this.state = 'CLOSED';
  }

  isOpen() {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
```javascript

### 3. Logging and Monitoring

```javascript
class ErrorLogger {
  static log(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      code: error.code,
      details: error.details,
      requestId: error.requestId,
      context: context,
      stack: error.stack,
    };

    // Send to logging service
    this.sendToLoggingService(logEntry);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', logEntry);
    }
  }

  static sendToLoggingService(logEntry) {
    // Implementation depends on your logging service
    // Could be Sentry, Loggly, Datadog, etc.
    fetch('/api/v1/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry),
    }).catch(console.error);
  }
}

// Usage
try {
  const patient = await apiClient.request('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
} catch (error) {
  ErrorLogger.log(error, {
    endpoint: '/patients',
    method: 'POST',
    patientData: patientData,
  });

  // Handle error appropriately
  handleAPIError(error);
}
```javascript

## Troubleshooting Guide

### Common Issues and Solutions

### 1. Authentication Failures

**Problem:** Getting 401 Unauthorized errors
**Solution:**

- Verify API key is correct
- Check API key hasn't expired
- Ensure API key is sent in correct header
- Verify you're using HTTPS

### 2. Rate Limiting

**Problem:** Getting 429 Too Many Requests
**Solution:**

- Implement exponential backoff
- Check rate limit headers
- Consider upgrading your plan
- Optimize API calls

### 3. Validation Errors

**Problem:** Getting 400 Bad Request
**Solution:**

- Validate data before sending
- Check required fields
- Verify data formats
- Use API documentation

### 4. Resource Not Found

**Problem:** Getting 404 Not Found
**Solution:**

- Verify resource ID
- Check endpoint URL
- Ensure resource exists
- Check permissions

### 5. Server Errors

**Problem:** Getting 500 Internal Server Error
**Solution:**

- Implement retry logic
- Check status page
- Contact support
- Monitor request ID

### Debugging Tools

### 1. Request Debugging

```javascript
function debugRequest(url, options) {
  console.log('Request URL:', url);
  console.log('Request Options:', options);
  console.log('Request Headers:', options.headers);

  if (options.body) {
    console.log('Request Body:', options.body);
  }
}

function debugResponse(response) {
  console.log('Response Status:', response.status);
  console.log('Response Headers:', response.headers);

  // Clone response to avoid consuming it
  response
    .clone()
    .json()
    .then((data) => {
      console.log('Response Body:', data);
    });
}
```javascript

### 2. Error Analysis

```javascript
function analyzeError(error) {
  console.log('Error Analysis:');
  console.log('- Message:', error.message);
  console.log('- Code:', error.code);
  console.log('- Details:', error.details);
  console.log('- Request ID:', error.requestId);

  if (error.details) {
    console.log('- Field:', error.details.field);
    console.log('- Reason:', error.details.reason);
    console.log('- Value:', error.details.value);
  }

  // Suggest solutions based on error code
  const suggestions = getSuggestions(error.code);
  console.log('- Suggestions:', suggestions);
}

function getSuggestions(errorCode) {
  const suggestions = {
    UNAUTHORIZED: ['Check your API key', 'Verify the API key format', 'Ensure you are using HTTPS'],
    VALIDATION_ERROR: ['Validate input data', 'Check required fields', 'Verify data formats'],
    RATE_LIMIT_EXCEEDED: [
      'Implement backoff strategy',
      'Check rate limit headers',
      'Consider upgrading plan',
    ],
    NOT_FOUND: ['Verify resource ID', 'Check endpoint URL', 'Ensure resource exists'],
  };

  return suggestions[errorCode] || ['Contact support'];
}
```text

## Support Resources

### Getting Help

1. **Check Documentation**: Review the API documentation for the specific endpoint
2. **Use the Error Code**: Look up the error code in this guide
3. **Check Status Page**: Verify service status at [status.zarishsphere.com](https://status.zarishsphere.com)
4. **Contact Support**: Email api-support at zarishsphere dot com with the request ID

### Reporting Bugs

When reporting bugs, include:

- Request ID from error response
- Full error details
- Request and response data
- Steps to reproduce
- Expected vs actual behavior

### Community Support

- **GitHub Discussions**: [github.com/zarishsphere/docs-site/discussions](https://github.com/zarishsphere/docs-site/discussions)
- **Developer Forum**: [forum.zarishsphere.com](https://forum.zarishsphere.com)
- **Stack Overflow**: Use tag `zarish-sphere-api`

This comprehensive error handling guide will help you build robust integrations with ZARISH SPHERE APIs.
````
