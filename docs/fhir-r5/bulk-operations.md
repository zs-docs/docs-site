---
title: 'Bulk Operations'
sidebar_label: 'Bulk Operations'
description: 'Comprehensive guide to FHIR R5 bulk operations for large-scale data management in ZARISH SPHERE'
keywords: [bulk operations, fhir r5, data export, import, large-scale]
---

# FHIR R5 Bulk Operations

## Overview

ZARISH SPHERE supports FHIR R5 bulk operations for efficient large-scale data management, enabling healthcare organizations to export, import, and synchronize patient data across systems.

## Supported Bulk Operations

### 1. Bulk Data Export

### System-Level Export

````http
GET /fhir/$export
Accept: application/fhir+ndjson
Prefer: respond-async
```text

### Group-Level Export

```http
GET /fhir/Group/{id}/$export
Accept: application/fhir+ndjson
Prefer: respond-async
```text

### Patient-Level Export

```http
GET /fhir/Patient/{id}/$export
Accept: application/fhir+ndjson
Prefer: respond-async
```javascript

### 2. Export Parameters

| Parameter       | Description                                | Required | Example                            |
| --------------- | ------------------------------------------ | -------- | ---------------------------------- |
| `_outputFormat` | Output format                              | No       | `application/fhir+ndjson`          |
| `_since`        | Export resources modified since this time  | No       | `2023-01-01T00:00:00Z`             |
| `_type`         | Resource types to include                  | No       | `Patient,Observation,Condition`    |
| `_typeFilter`   | Filters for resource types                 | No       | `Observation?category=vital-signs` |
| `patient`       | Patient reference for patient-level export | Yes      | `12345`                            |

### 3. Export Response

### Initial Response

```json
{
  "resourceType": "OperationOutcome",
  "id": "export-request-123",
  "issue": [
    {
      "severity": "information",
      "code": "informational",
      "details": {
        "text": "Bulk export request accepted"
      }
    }
  ]
}
```text

### Status Check

```http
GET /fhir/$bulk-export-status/{jobId}
```text

### Completed Export

```json
{
  "transactionTime": "2023-12-01T10:30:00Z",
  "request": "https://api.zarishsphere.com/fhir/$export",
  "requiresAccessToken": true,
  "output": [
    {
      "type": "Patient",
      "url": "https://storage.zarishsphere.com/exports/Patient.ndjson"
    },
    {
      "type": "Observation",
      "url": "https://storage.zarishsphere.com/exports/Observation.ndjson"
    }
  ],
  "error": []
}
```json

## Bulk Data Import

### 1. Import Process

### Prepare Import File

```json
{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "urn:uuid:patient-1",
      "resource": {
        "resourceType": "Patient",
        "id": "patient-1",
        "name": [{ "family": "Smith", "given": ["John"] }],
        "birthDate": "1985-06-15"
      },
      "request": {
        "method": "POST",
        "url": "Patient"
      }
    }
  ]
}
```text

### Execute Import

```http
POST /fhir/
Content-Type: application/fhir+json
Authorization: Bearer {access_token}

{bundle_data}
```json

### 2. Import Response

```json
{
  "resourceType": "Bundle",
  "type": "transaction-response",
  "entry": [
    {
      "response": {
        "status": "201 Created",
        "location": "Patient/12345/_history/1",
        "lastModified": "2023-12-01T10:30:00Z"
      }
    }
  ]
}
```text

## Performance Considerations

### 1. Export Limits

| Resource Type     | Max Records per File | Recommended Chunk Size |
| ----------------- | -------------------- | ---------------------- |
| Patient           | 100,000              | 10,000                 |
| Observation       | 1,000,000            | 50,000                 |
| Condition         | 500,000              | 25,000                 |
| MedicationRequest | 750,000              | 35,000                 |

### 2. Best Practices

### Large Dataset Exports

- Use `_since` parameter for incremental exports
- Export by resource type to manage file sizes
- Schedule exports during off-peak hours
- Monitor storage quotas

### Import Optimization

- Validate data before import
- Use transaction bundles for consistency
- Process in batches for large datasets
- Implement retry logic for failed imports

## Security and Compliance

### 1. Access Control

### Required Permissions

```json
{
  "permissions": ["bulk-export/read", "bulk-import/write"],
  "scope": "system/Patient.read"
}
```javascript

### 2. Data Privacy

### PHI Protection

- Encrypt export files at rest
- Use secure transfer protocols (HTTPS)
- Implement access logging
- Apply retention policies

### Audit Trail

```json
{
  "event": "bulk-export",
  "user": "admin@hospital.org",
  "timestamp": "2023-12-01T10:30:00Z",
  "resources": ["Patient", "Observation"],
  "recordCount": 50000
}
```json

## Error Handling

### 1. Common Export Errors

| Error Code            | Description                     | Resolution                   |
| --------------------- | ------------------------------- | ---------------------------- |
| `EXCEEDED_SIZE_LIMIT` | Export exceeds size limits      | Use filters or chunk by date |
| `INVALID_TYPE`        | Invalid resource type specified | Verify resource type names   |
| `ACCESS_DENIED`       | Insufficient permissions        | Check user permissions       |
| `TIMEOUT`             | Export operation timed out      | Reduce scope or retry later  |

### 2. Import Error Management

### Validation Errors

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
```javascript

## Integration Examples

### 1. Python Export Script

```python
import requests
import json
import time

def bulk_export(base_url, access_token, resource_types):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/fhir+ndjson',
        'Prefer': 'respond-async'
    }

    params = {
        '_type': ','.join(resource_types),
        '_outputFormat': 'application/fhir+ndjson'
    }

    response = requests.get(
        f'{base_url}/fhir/$export',
        headers=headers,
        params=params
    )

    if response.status_code == 202:
        job_url = response.headers['Content-Location']
        return monitor_export(job_url, headers)

    return response.json()

def monitor_export(job_url, headers):
    while True:
        response = requests.get(job_url, headers=headers)
        status = response.json()

        if status.get('transactionTime'):
            return status

        time.sleep(30)
```javascript

### 2. JavaScript Import

```javascript
async function bulkImport(baseUrl, accessToken, bundleData) {
  const response = await fetch(`${baseUrl}/fhir/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/fhir+json',
    },
    body: JSON.stringify(bundleData),
  });

  return response.json();
}
```text

## Monitoring and Metrics

### 1. Export Metrics

```json
{
  "exportId": "export-123",
  "startTime": "2023-12-01T10:00:00Z",
  "endTime": "2023-12-01T10:30:00Z",
  "totalRecords": 50000,
  "fileCount": 5,
  "totalSize": "250MB",
  "status": "completed"
}
```text

### 2. Performance Indicators

- Export duration by resource type
- File size distribution
- Error rates by resource type
- Storage utilization

This comprehensive bulk operations guide enables efficient large-scale data management while maintaining security and compliance standards.
````
