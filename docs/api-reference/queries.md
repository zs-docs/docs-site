---
title: 'GraphQL Queries'
sidebar_label: 'Queries'
description: 'Complete guide to ZARISH SPHERE GraphQL queries for retrieving and filtering healthcare data'
keywords: [graphql, queries, api, zarish sphere]
---

# GraphQL Queries

## Overview

GraphQL queries in ZARISH SPHERE allow you to retrieve healthcare data with precise control over the fields you need. This guide covers all available queries, filtering options, and optimization techniques.

## Query Structure

All queries follow this basic structure:

````graphql
query {
  queryName(parameters) {
    field1
    field2
    nestedObject {
      nestedField1
      nestedField2
    }
  }
}
```text

## Authentication

Most queries require authentication. Include your token in the request headers:

```http
Authorization: Bearer your-access-token
Content-Type: application/json
```text

## Patient Queries

### Get Patient by ID

```graphql
query GetPatient($id: ID!) {
  patient(id: $id) {
    id
    mrn
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
      country
    }
    emergencyContact {
      name
      relationship
      phone
    }
    primaryCarePhysician {
      id
      firstName
      lastName
      specialty
    }
    createdAt
    updatedAt
  }
}
```text

**Variables:**

```json
{
  "id": "patient-123"
}
```text

**Response:**

```json
{
  "data": {
    "patient": {
      "id": "patient-123",
      "mrn": "MRN-2023-001234",
      "firstName": "John",
      "lastName": "Smith",
      "birthDate": "1985-06-15",
      "gender": "male",
      "email": "john.smith@example.com",
      "phone": "+1-555-123-4567",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "postalCode": "12345",
        "country": "USA"
      },
      "emergencyContact": {
        "name": "Jane Smith",
        "relationship": "Spouse",
        "phone": "+1-555-987-6543"
      },
      "primaryCarePhysician": {
        "id": "practitioner-456",
        "firstName": "Dr. Sarah",
        "lastName": "Johnson",
        "specialty": "Family Medicine"
      },
      "createdAt": "2023-12-01T10:30:00Z",
      "updatedAt": "2023-12-01T10:30:00Z"
    }
  }
}
```text

### Search Patients

```graphql
query SearchPatients($filter: PatientFilter!, $pagination: PaginationInput) {
  patients(filter: $filter, pagination: $pagination) {
    edges {
      node {
        id
        mrn
        firstName
        lastName
        birthDate
        gender
        email
        phone
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```text

**Variables:**

```json
{
  "filter": {
    "name": "Smith",
    "gender": "male",
    "birthDateRange": {
      "start": "1980-01-01",
      "end": "1990-12-31"
    }
  },
  "pagination": {
    "first": 20,
    "after": "cursor-123"
  }
}
```python

### Get Patient with Encounters

```graphql
query GetPatientWithEncounters($id: ID!) {
  patient(id: $id) {
    id
    firstName
    lastName
    birthDate
    gender
    encounters(first: 10) {
      edges {
        node {
          id
          status
          class {
            code
            display
          }
          type {
            coding {
              code
              display
            }
          }
          period {
            start
            end
          }
          reasonCode {
            coding {
              code
              display
            }
          }
        }
      }
    }
  }
}
```python

## Clinical Encounters Queries

### Get Encounter by ID

```graphql
query GetEncounter($id: ID!) {
  encounter(id: $id) {
    id
    status
    class {
      system
      code
      display
    }
    type {
      coding {
        system
        code
        display
      }
    }
    subject {
      id
      firstName
      lastName
      birthDate
    }
    participant {
      type {
        coding {
          code
          display
        }
      }
      individual {
        id
        firstName
        lastName
        role
      }
    }
    period {
      start
      end
    }
    reasonCode {
      coding {
        system
        code
        display
      }
    }
    diagnosis {
      condition {
        id
        code {
          coding {
            code
            display
          }
        }
      }
      use {
        coding {
          code
          display
        }
      }
    }
    serviceProvider {
      id
      name
      type
    }
    createdAt
    updatedAt
  }
}
```python

### Search Encounters

```graphql
query SearchEncounters($filter: EncounterFilter!, $pagination: PaginationInput) {
  encounters(filter: $filter, pagination: $pagination) {
    edges {
      node {
        id
        status
        class {
          display
        }
        subject {
          id
          firstName
          lastName
        }
        period {
          start
          end
        }
        reasonCode {
          coding {
            display
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```text

**Variables:**

```json
{
  "filter": {
    "patientId": "patient-123",
    "status": "completed",
    "dateRange": {
      "start": "2023-11-01",
      "end": "2023-12-01"
    }
  },
  "pagination": {
    "first": 20
  }
}
```python

## Observation Queries

### Get Observation by ID

```graphql
query GetObservation($id: ID!) {
  observation(id: $id) {
    id
    status
    category {
      coding {
        system
        code
        display
      }
    }
    code {
      coding {
        system
        code
        display
      }
    }
    subject {
      id
      firstName
      lastName
    }
    encounter {
      id
      class {
        display
      }
    }
    effectiveDateTime
    issued
    valueQuantity {
      value
      unit
      system
      code
    }
    valueCodeableConcept {
      coding {
        system
        code
        display
      }
    }
    interpretation {
      coding {
        system
        code
        display
      }
    }
    referenceRange {
      low {
        value
        unit
      }
      high {
        value
        unit
      }
      text
    }
    performer {
      id
      firstName
      lastName
      role
    }
    createdAt
    updatedAt
  }
}
```text

### Search Observations

```graphql
query SearchObservations($filter: ObservationFilter!, $pagination: PaginationInput) {
  observations(filter: $filter, pagination: $pagination) {
    edges {
      node {
        id
        status
        category {
          coding {
            display
          }
        }
        code {
          coding {
            display
          }
        }
        subject {
          id
          firstName
          lastName
        }
        effectiveDateTime
        valueQuantity {
          value
          unit
        }
        interpretation {
          coding {
            display
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```text

**Variables:**

```json
{
  "filter": {
    "patientId": "patient-123",
    "category": "vital-signs",
    "dateRange": {
      "start": "2023-12-01",
      "end": "2023-12-01"
    }
  },
  "pagination": {
    "first": 50
  }
}
```text

### Get Patient Vitals

```graphql
query GetPatientVitals($patientId: ID!, $dateRange: DateRangeInput) {
  observations(filter: { patientId: $patientId, category: "vital-signs", dateRange: $dateRange }) {
    edges {
      node {
        id
        code {
          coding {
            code
            display
          }
        }
        effectiveDateTime
        valueQuantity {
          value
          unit
        }
        interpretation {
          coding {
            display
          }
        }
      }
    }
  }
}
```python

## Medication Queries

### Get Medication Request by ID

```graphql
query GetMedicationRequest($id: ID!) {
  medicationRequest(id: $id) {
    id
    status
    intent
    medication {
      code {
        coding {
          system
          code
          display
        }
      }
      form {
        coding {
          system
          code
          display
        }
      }
    }
    subject {
      id
      firstName
      lastName
    }
    encounter {
      id
      class {
        display
      }
    }
    dosageInstruction {
      text
      timing {
        repeat {
          boundsPeriod {
            start
            end
          }
          frequency {
            code {
              coding {
                code
                display
              }
            }
          }
        }
      }
      route {
        coding {
          system
          code
          display
        }
      }
      doseAndRate {
        doseQuantity {
          value
          unit
          system
          code
        }
      }
    }
    dispenseRequest {
      validityPeriod {
        start
        end
      }
      quantity {
        value
        unit
        system
        code
      }
      expectedSupplyDuration {
        value
        unit
        system
        code
      }
    }
    authoredOn
    requester {
      id
      firstName
      lastName
      role
    }
    createdAt
    updatedAt
  }
}
```text

### Search Medication Requests

```graphql
query SearchMedicationRequests($filter: MedicationRequestFilter!, $pagination: PaginationInput) {
  medicationRequests(filter: $filter, pagination: $pagination) {
    edges {
      node {
        id
        status
        intent
        medication {
          code {
            coding {
              display
            }
          }
        }
        subject {
          id
          firstName
          lastName
        }
        authoredOn
        requester {
          id
          firstName
          lastName
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```javascript

## Procedure Queries

### Get Procedure by ID

```graphql
query GetProcedure($id: ID!) {
  procedure(id: $id) {
    id
    status
    code {
      coding {
        system
        code
        display
      }
    }
    subject {
      id
      firstName
      lastName
    }
    encounter {
      id
      class {
        display
      }
    }
    performedPeriod {
      start
      end
    }
    performer {
      actor {
        id
        firstName
        lastName
        role
      }
      function {
        coding {
          code
          display
        }
      }
    }
    bodySite {
      coding {
        system
        code
        display
      }
    }
    outcome {
      code {
        coding {
          system
          code
          display
        }
      }
    }
    complication {
      code {
        coding {
          system
          code
          display
        }
      }
    }
    followUp {
      coding {
        system
        code
        display
      }
    }
    createdAt
    updatedAt
  }
}
```text

### Search Procedures

```graphql
query SearchProcedures($filter: ProcedureFilter!, $pagination: PaginationInput) {
  procedures(filter: $filter, pagination: $pagination) {
    edges {
      node {
        id
        status
        code {
          coding {
            display
          }
        }
        subject {
          id
          firstName
          lastName
        }
        performedPeriod {
          start
          end
        }
        bodySite {
          coding {
            display
          }
        }
        outcome {
          coding {
            display
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```python

## Diagnostic Report Queries

### Get Diagnostic Report by ID

```graphql
query GetDiagnosticReport($id: ID!) {
  diagnosticReport(id: $id) {
    id
    status
    code {
      coding {
        system
        code
        display
      }
    }
    subject {
      id
      firstName
      lastName
    }
    encounter {
      id
      class {
        display
      }
    }
    effectiveDateTime
    issued
    result {
      reference {
        reference
        display
      }
    }
    conclusionCode {
      coding {
        system
        code
        display
      }
    }
    conclusion
    presentedForm {
      contentType
        language
        data
        url
        size
        hash
        title
        creation
      }
    }
    performer {
      id
      firstName
      lastName
      role
    }
    createdAt
    updatedAt
  }
}
```text

### Search Diagnostic Reports

```graphql
query SearchDiagnosticReports($filter: DiagnosticReportFilter!, $pagination: PaginationInput) {
  diagnosticReports(filter: $filter, pagination: $pagination) {
    edges {
      node {
        id
        status
        code {
          coding {
            display
          }
        }
        subject {
          id
          firstName
          lastName
        }
        effectiveDateTime
        conclusion
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```python

## Advanced Queries

### Get Patient Dashboard

```graphql
query GetPatientDashboard($patientId: ID!) {
  patient(id: $patientId) {
    id
    firstName
    lastName
    birthDate
    gender
    age
  }

  encounters(filter: { patientId: $patientId }, first: 5) {
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
        reasonCode {
          coding {
            display
          }
        }
      }
    }
  }

  observations(
    filter: {
      patientId: $patientId
      category: "vital-signs"
      dateRange: { start: "2023-11-01", end: "2023-12-01" }
    }
    first: 10
  ) {
    edges {
      node {
        id
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

  medicationRequests(filter: { patientId: $patientId, status: "active" }, first: 5) {
    edges {
      node {
        id
        medication {
          code {
            coding {
              display
            }
          }
        }
        dosageInstruction {
          text
        }
        authoredOn
      }
    }
  }
}
```python

### Get Clinical Summary

```graphql
query GetClinicalSummary($patientId: ID!, $dateRange: DateRangeInput) {
  patient(id: $patientId) {
    id
    firstName
    lastName
    birthDate
    gender
    age
    primaryCarePhysician {
      id
      firstName
      lastName
      specialty
    }
  }

  encounters(filter: { patientId: $patientId, dateRange: $dateRange }) {
    totalCount
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
        reasonCode {
          coding {
            display
          }
        }
        diagnosis {
          condition {
            code {
              coding {
                display
              }
            }
          }
        }
      }
    }
  }

  observations(filter: { patientId: $patientId, dateRange: $dateRange }) {
    totalCount
    edges {
      node {
        id
        category {
          coding {
            display
          }
        }
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

  procedures(filter: { patientId: $patientId, dateRange: $dateRange }) {
    totalCount
    edges {
      node {
        id
        status
        code {
          coding {
            display
          }
        }
        performedPeriod {
          start
          end
        }
        bodySite {
          coding {
            display
          }
        }
      }
    }
  }
}
```text

## Filtering and Pagination

### Filter Types

### PatientFilter

```graphql
input PatientFilter {
  name: String
  mrn: String
  gender: Gender
  birthDate: String
  birthDateRange: DateRangeInput
  email: String
  phone: String
  addressCity: String
  addressState: String
  addressPostalCode: String
  primaryCarePhysicianId: ID
  createdAt: String
  createdAtRange: DateRangeInput
  updatedAt: String
  updatedAtRange: DateRangeInput
}
```yaml

### EncounterFilter

```graphql
input EncounterFilter {
  patientId: ID
  status: EncounterStatus
  class: String
  type: String
  dateRange: DateRangeInput
  reasonCode: String
  serviceProviderId: ID
  participantId: ID
}
```yaml

### ObservationFilter

```graphql
input ObservationFilter {
  patientId: ID
  encounterId: ID
  category: String
  code: String
  status: ObservationStatus
  dateRange: DateRangeInput
  performerId: ID
}
```text

### Pagination

### PaginationInput

```graphql
input PaginationInput {
  first: Int
  last: Int
  after: String
  before: String
}
```text

### PageInfo

```graphql
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```text

### Date Range Filter

```graphql
input DateRangeInput {
  start: String!
  end: String!
}
```text

## Error Handling

### GraphQL Error Response Format

```json
{
  "errors": [
    {
      "message": "Patient not found",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["patient"],
      "extensions": {
        "code": "NOT_FOUND",
        "details": {
          "id": "patient-999"
        }
      }
    }
  ],
  "data": {
    "patient": null
  }
}
```text

### Common Query Errors

### Validation Errors

```json
{
  "errors": [
    {
      "message": "Invalid filter parameter",
      "path": ["patients"],
      "extensions": {
        "code": "VALIDATION_ERROR",
        "details": {
          "field": "birthDate",
          "reason": "Invalid date format. Use YYYY-MM-DD"
        }
      }
    }
  ]
}
```text

### Permission Errors

```json
{
  "errors": [
    {
      "message": "Insufficient permissions",
      "path": ["patient"],
      "extensions": {
        "code": "FORBIDDEN",
        "details": {
          "required": "patient.read",
          "current": "patient.none"
        }
      }
    }
  ]
}
```sql

## Performance Optimization

### Query Optimization Tips

### 1. Select Only Required Fields

```graphql
## Good - Only select needed fields
query GetPatientBasic($id: ID!) {
  patient(id: $id) {
    id
    firstName
    lastName
    birthDate
  }
}

## Bad - Selecting too many fields
query GetPatientAll($id: ID!) {
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
      country
    }
    emergencyContact {
      name
      relationship
      phone
    }
    # ... many more fields
  }
}
```text

### 2. Use Pagination

```graphql
query GetPatientsPaginated($filter: PatientFilter!) {
  patients(filter: $filter, pagination: { first: 20 }) {
    edges {
      node {
        id
        firstName
        lastName
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```yaml

### 3. Filter at the Server Level

```graphql
## Good - Server-side filtering
query GetActiveEncounters($patientId: ID!) {
  encounters(filter: { patientId: $patientId, status: "in-progress" }) {
    edges {
      node {
        id
        status
        period {
          start
        }
      }
    }
  }
}

## Bad - Client-side filtering
query GetAllEncounters($patientId: ID!) {
  encounters(filter: { patientId: $patientId }) {
    edges {
      node {
        id
        status
        period {
          start
        }
      }
    }
  }
}
```text

### Query Batching

```graphql
query BatchQueries($patientId: ID!) {
  patient(id: $patientId) {
    id
    firstName
    lastName
  }

  encounters(filter: { patientId: $patientId }, first: 5) {
    edges {
      node {
        id
        status
      }
    }
  }

  observations(filter: { patientId: $patientId, category: "vital-signs" }, first: 10) {
    edges {
      node {
        id
        code {
          coding {
            display
          }
        }
        valueQuantity {
          value
          unit
        }
      }
    }
  }
}
```javascript

## Client Implementation Examples

### JavaScript/React

```javascript
import { gql, useQuery } from '@apollo/client';

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
    }
  }
`;

function PatientProfile({ patientId }) {
  const { loading, error, data } = useQuery(GET_PATIENT, {
    variables: { id: patientId },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>
        {data.patient.firstName} {data.patient.lastName}
      </h2>
      <p>DOB: {data.patient.birthDate}</p>
      <p>Gender: {data.patient.gender}</p>
      <p>Email: {data.patient.email}</p>
      <p>Phone: {data.patient.phone}</p>
      <p>
        Address: {data.patient.address.street}, {data.patient.address.city},{' '}
        {data.patient.address.state} {data.patient.address.postalCode}
      </p>
    </div>
  );
}
```javascript

### Python

```python
import requests
import json

class GraphQLClient:
    def __init__(self, url, token):
        self.url = url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def query(self, query, variables=None):
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

## Usage
client = GraphQLClient('https://api.zarishsphere.com/graphql', 'your-token')

query = '''
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
      birthDate
      gender
    }
  }
'''

result = client.query(query, {'id': 'patient-123'})
print(result['patient'])
```javascript

### Java

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class GraphQLClient {
    private final String url;
    private final String token;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GraphQLClient(String url, String token) {
        this.url = url;
        this.token = token;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public GraphQLResponse query(String query, Map<String, Object> variables) throws Exception {
        GraphQLRequest request = new GraphQLRequest(query, variables);
        String requestBody = objectMapper.writeValueAsString(request);

        HttpRequest httpRequest = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Authorization", "Bearer " + token)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = httpClient.send(
            httpRequest,
            HttpResponse.BodyHandlers.ofString()
        );

        return objectMapper.readValue(response.body(), GraphQLResponse.class);
    }
}
```javascript

## Testing

### Unit Testing Queries

```javascript
import { execute, gql } from 'graphql';

const GET_PATIENT = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
      birthDate
      gender
    }
  }
`;

describe('Patient Queries', () => {
  test('should get patient by ID', async () => {
    const variables = { id: 'patient-123' };
    const result = await execute(GET_PATIENT, variables);

    expect(result.data.patient.id).toBe('patient-123');
    expect(result.data.patient.firstName).toBe('John');
    expect(result.data.patient.lastName).toBe('Doe');
    expect(result.data.patient.birthDate).toBe('1985-06-15');
    expect(result.data.patient.gender).toBe('male');
  });

  test('should return null for non-existent patient', async () => {
    const variables = { id: 'patient-999' };
    const result = await execute(GET_PATIENT, variables);

    expect(result.data.patient).toBeNull();
  });
});
```text

This comprehensive GraphQL queries guide provides everything you need to retrieve healthcare data efficiently from ZARISH SPHERE.
````
