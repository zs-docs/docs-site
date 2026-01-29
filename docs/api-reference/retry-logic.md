---
title: 'Retry Logic'
sidebar_label: 'Retry Logic'
description: 'Comprehensive guide to implementing robust retry logic and error handling for ZARISH SPHERE API calls'
keywords: [api, retry, error handling, resilience, zarish sphere]
---

# Retry Logic

## Overview

Implementing robust retry logic is essential for building resilient healthcare applications that can handle temporary failures, network issues, and service unavailability. This guide provides comprehensive strategies and implementations for retry logic in ZARISH SPHERE API integrations.

## Retry Strategies

### Exponential Backoff

The most common and effective retry strategy for API calls:

````javascript
class RetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.backoffFactor = options.backoffFactor || 2;
    this.retryableErrors = options.retryableErrors || [
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'EAI_AGAIN',
      'NETWORK_ERROR',
      'TIMEOUT',
      'CONNECTION_ERROR',
    ];
  }

  async executeWithRetry(operation, context = {}) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation();

        // Log successful attempt if we retried
        if (attempt > 0) {
          console.log(`Operation succeeded on attempt ${attempt + 1}`);
        }

        return result;
      } catch (error) {
        lastError = error;

        // Check if we should retry
        if (!this.shouldRetry(error, attempt)) {
          throw error;
        }

        // Calculate delay
        const delay = this.calculateDelay(attempt);

        console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, {
          error: error.message,
          context,
        });

        // Wait before retry
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    throw new RetryExhaustedError(
      `Operation failed after ${this.maxRetries + 1} attempts`,
      lastError
    );
  }

  shouldRetry(error, attempt) {
    // Don't retry if we've exhausted attempts
    if (attempt >= this.maxRetries) {
      return false;
    }

    // Don't retry on client errors (4xx)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return false;
    }

    // Check if error is retryable
    const errorCode = error.code || error.message;
    return this.retryableErrors.some((retryableError) => errorCode.includes(retryableError));
  }

  calculateDelay(attempt) {
    const delay = this.baseDelay * Math.pow(this.backoffFactor, attempt);
    return Math.min(delay, this.maxDelay);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

class RetryExhaustedError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'RetryExhaustedError';
    this.originalError = originalError;
  }
}

// Usage example
const retryManager = new RetryManager({
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 60000,
  backoffFactor: 2,
});

async function createPatient(patientData) {
  return retryManager.executeWithRetry(
    async () => {
      const response = await fetch('https://api.zarishsphere.com/v1/patients', {
        method: 'POST',
        headers: {
          'X-API-Key': 'your-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.response = response;
        throw error;
      }

      return response.json();
    },
    { operation: 'createPatient', patientId: patientData.id }
  );
}
```javascript

### Linear Backoff

Simple linear delay increase between retries:

```javascript
class LinearRetryManager extends RetryManager {
  calculateDelay(attempt) {
    const delay = this.baseDelay * (attempt + 1);
    return Math.min(delay, this.maxDelay);
  }
}
```python

### Fixed Delay

Fixed delay between all retry attempts:

```javascript
class FixedDelayRetryManager extends RetryManager {
  calculateDelay(attempt) {
    return this.baseDelay;
  }
}
```javascript

## Circuit Breaker Pattern

Prevent cascading failures by temporarily stopping retries when a service is consistently failing:

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;

    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new CircuitBreakerOpenError('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.successCount++;

    if (this.state === 'HALF_OPEN') {
      if (this.successCount >= 3) {
        this.reset();
      }
    } else {
      this.failureCount = 0;
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  shouldAttemptReset() {
    return Date.now() - this.lastFailureTime >= this.resetTimeout;
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }
}

class CircuitBreakerOpenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

// Usage
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000,
});

async function getPatient(patientId) {
  return circuitBreaker.execute(async () => {
    const response = await fetch(`https://api.zarishsphere.com/v1/patients/${patientId}`, {
      headers: {
        'X-API-Key': 'your-api-key',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  });
}
```javascript

## HTTP Client with Retry Logic

### Fetch-based Client

```javascript
class ResilientHTTPClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL;
    this.defaultHeaders = options.defaultHeaders || {};
    this.retryManager = new RetryManager(options.retry);
    this.circuitBreaker = new CircuitBreaker(options.circuitBreaker);
  }

  async request(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    return this.circuitBreaker.execute(async () => {
      return this.retryManager.executeWithRetry(
        async () => {
          const response = await fetch(fullUrl, {
            ...options,
            headers: {
              ...this.defaultHeaders,
              ...options.headers,
            },
          });

          if (!response.ok) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
            error.response = response;
            error.status = response.status;
            throw error;
          }

          return response;
        },
        { url, method: options.method }
      );
    });
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// Usage
const apiClient = new ResilientHTTPClient({
  baseURL: 'https://api.zarishsphere.com/v1',
  defaultHeaders: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json',
  },
  retry: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
  },
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeout: 60000,
  },
});

async function createPatient(patientData) {
  try {
    const patient = await apiClient.post('/patients', patientData);
    return patient;
  } catch (error) {
    if (error instanceof RetryExhaustedError) {
      console.error('All retry attempts failed:', error.originalError);
    } else if (error instanceof CircuitBreakerOpenError) {
      console.error('Service temporarily unavailable:', error.message);
    } else {
      console.error('Request failed:', error);
    }
    throw error;
  }
}
```javascript

### Axios Client with Retry

```javascript
const axios = require('axios');
const axiosRetry = require('axios-retry');

// Configure axios with retry logic
const apiClient = axios.create({
  baseURL: 'https://api.zarishsphere.com/v1',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json',
  },
});

// Add retry interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Don't retry on 4xx errors
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return Promise.reject(error);
    }

    // Retry configuration
    if (!config.retry) {
      config.retry = 0;
    }

    config.retry += 1;

    const maxRetries = 3;
    const retryDelay = Math.min(1000 * Math.pow(2, config.retry - 1), 30000);

    if (config.retry <= maxRetries) {
      console.log(`Retrying request (${config.retry}/${maxRetries}) in ${retryDelay}ms`);

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

// Usage
async function createPatient(patientData) {
  try {
    const response = await apiClient.post('/patients', patientData);
    return response.data;
  } catch (error) {
    console.error('Failed to create patient:', error.message);
    throw error;
  }
}
```javascript

## Database Retry Logic

### MongoDB Retry

```javascript
const { MongoClient } = require('mongodb');

class MongoDBManager {
  constructor(uri, options = {}) {
    this.uri = uri;
    this.options = options;
    this.retryManager = new RetryManager({
      maxRetries: 5,
      baseDelay: 1000,
      maxDelay: 30000,
      retryableErrors: ['MongoNetworkError', 'MongoTimeoutError', 'MongoServerSelectionError'],
    });
  }

  async connect() {
    return this.retryManager.executeWithRetry(async () => {
      this.client = new MongoClient(this.uri, this.options);
      await this.client.connect();
      this.db = this.client.db('zarish_sphere');
      return this.db;
    });
  }

  async createPatient(patientData) {
    return this.retryManager.executeWithRetry(async () => {
      const result = await this.db.collection('patients').insertOne(patientData);
      return result;
    });
  }

  async getPatient(patientId) {
    return this.retryManager.executeWithRetry(async () => {
      const patient = await this.db.collection('patients').findOne({ _id: patientId });
      return patient;
    });
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}
```javascript

### PostgreSQL Retry

```javascript
const { Pool } = require('pg');

class PostgreSQLManager {
  constructor(config) {
    this.config = config;
    this.retryManager = new RetryManager({
      maxRetries: 5,
      baseDelay: 1000,
      maxDelay: 30000,
      retryableErrors: ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
    });
  }

  async connect() {
    return this.retryManager.executeWithRetry(async () => {
      this.pool = new Pool(this.config);

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();

      return this.pool;
    });
  }

  async query(text, params = []) {
    return this.retryManager.executeWithRetry(async () => {
      const client = await this.pool.connect();
      try {
        const result = await client.query(text, params);
        return result;
      } finally {
        client.release();
      }
    });
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
```javascript

## Message Queue Retry Logic

### RabbitMQ Retry

```javascript
const amqp = require('amqplib');

class RabbitMQManager {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.retryManager = new RetryManager({
      maxRetries: 5,
      baseDelay: 1000,
      maxDelay: 30000,
    });
  }

  async connect() {
    return this.retryManager.executeWithRetry(async () => {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      return this.channel;
    });
  }

  async publish(queue, message, options = {}) {
    return this.retryManager.executeWithRetry(async () => {
      await this.channel.assertQueue(queue, { durable: true });

      const published = this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
        ...options,
      });

      return published;
    });
  }

  async consume(queue, callback) {
    return this.retryManager.executeWithRetry(async () => {
      await this.channel.assertQueue(queue, { durable: true });

      await this.channel.consume(queue, (msg) => {
        try {
          const message = JSON.parse(msg.content.toString());
          callback(message, msg);
        } catch (error) {
          console.error('Error processing message:', error);
          // Reject and requeue the message
          this.channel.nack(msg, false, true);
        }
      });
    });
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
```javascript

## Batch Operations with Retry

### Batch Retry Manager

```javascript
class BatchRetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.batchSize = options.batchSize || 100;
    this.retryManager = new RetryManager(options.retry);
  }

  async processBatch(items, processor) {
    const results = [];
    const errors = [];

    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize);

      try {
        const batchResults = await this.retryManager.executeWithRetry(async () => {
          return processor(batch);
        });

        results.push(...batchResults);
      } catch (error) {
        console.error(`Batch ${Math.floor(i / this.batchSize) + 1} failed:`, error);
        errors.push({
          batchIndex: Math.floor(i / this.batchSize) + 1,
          error,
          items: batch,
        });
      }
    }

    return {
      results,
      errors,
      success: errors.length === 0,
      totalItems: items.length,
      processedItems: results.length,
      failedItems: errors.length,
    };
  }
}

// Usage
const batchRetryManager = new BatchRetryManager({
  maxRetries: 3,
  batchSize: 50,
  retry: {
    baseDelay: 1000,
    maxDelay: 30000,
  },
});

async function createPatients(patients) {
  return batchRetryManager.processBatch(patients, async (batch) => {
    const promises = batch.map((patient) => apiClient.post('/patients', patient));

    return Promise.all(promises);
  });
}
```javascript

## Monitoring and Metrics

### Retry Metrics Collector

```javascript
class RetryMetrics {
  constructor() {
    this.metrics = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      retryAttempts: 0,
      circuitBreakerOpens: 0,
      averageRetryDelay: 0,
    };
  }

  recordOperationStart() {
    this.metrics.totalOperations++;
  }

  recordOperationSuccess() {
    this.metrics.successfulOperations++;
  }

  recordOperationFailure() {
    this.metrics.failedOperations++;
  }

  recordRetryAttempt(delay) {
    this.metrics.retryAttempts++;
    this.updateAverageRetryDelay(delay);
  }

  recordCircuitBreakerOpen() {
    this.metrics.circuitBreakerOpens++;
  }

  updateAverageRetryDelay(delay) {
    const totalDelay = this.metrics.averageRetryDelay * (this.metrics.retryAttempts - 1) + delay;
    this.metrics.averageRetryDelay = totalDelay / this.metrics.retryAttempts;
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate:
        this.metrics.totalOperations > 0
          ? (this.metrics.successfulOperations / this.metrics.totalOperations) * 100
          : 0,
      failureRate:
        this.metrics.totalOperations > 0
          ? (this.metrics.failedOperations / this.metrics.totalOperations) * 100
          : 0,
    };
  }

  reset() {
    this.metrics = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      retryAttempts: 0,
      circuitBreakerOpens: 0,
      averageRetryDelay: 0,
    };
  }
}

// Enhanced Retry Manager with Metrics
class MetricsRetryManager extends RetryManager {
  constructor(options = {}) {
    super(options);
    this.metrics = new RetryMetrics();
  }

  async executeWithRetry(operation, context = {}) {
    this.metrics.recordOperationStart();

    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation();

        if (attempt > 0) {
          console.log(`Operation succeeded on attempt ${attempt + 1}`);
        }

        this.metrics.recordOperationSuccess();
        return result;
      } catch (error) {
        lastError = error;

        if (!this.shouldRetry(error, attempt)) {
          this.metrics.recordOperationFailure();
          throw error;
        }

        const delay = this.calculateDelay(attempt);
        this.metrics.recordRetryAttempt(delay);

        console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, {
          error: error.message,
          context,
        });

        await this.sleep(delay);
      }
    }

    this.metrics.recordOperationFailure();
    throw new RetryExhaustedError(
      `Operation failed after ${this.maxRetries + 1} attempts`,
      lastError
    );
  }
}
```text

This comprehensive retry logic guide provides robust error handling strategies for building resilient healthcare applications with ZARISH SPHERE APIs.
````
