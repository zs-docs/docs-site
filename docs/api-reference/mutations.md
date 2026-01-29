---
title: 'GraphQL Mutations'
sidebar_label: 'Mutations'
description: 'Complete guide to ZARISH SPHERE GraphQL mutations for creating, updating, and deleting healthcare data'
keywords: [graphql, mutations, api, zarish sphere]
---

# GraphQL Mutations

## Overview

GraphQL mutations in ZARISH SPHERE allow you to create, update, and delete healthcare data. This guide covers all available mutations, their schemas, and practical examples for working with healthcare data.

## Mutation Structure

All mutations follow this basic structure:

````graphql
mutation {
  mutationName(input: MutationInput!) {
    id
    # Return fields
  }
}
```text

## Authentication

### Login Mutation

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      email
      firstName
      lastName
      roles
    }
  }
}
```text

**Variables:**

```json
{
  "input": {
    "email": "user@example.com",
    "password": "securePassword123"
  }
}
```text

**Response:**

```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "user-123",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "roles": ["clinician"]
      }
    }
  }
}
```text

## Patient Mutations

### Create Patient

```graphql
mutation CreatePatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
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
    createdAt
    updatedAt
  }
}
```text

**Variables:**

```json
{
  "input": {
    "firstName": "Jane",
    "lastName": "Smith",
    "birthDate": "1985-06-15",
    "gender": "female",
    "email": "jane.smith@example.com",
    "phone": "+1-555-123-4567",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "postalCode": "12345",
      "country": "USA"
    }
  }
}
```sql

### Update Patient

```graphql
mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
  updatePatient(id: $id, input: $input) {
    id
    firstName
    lastName
    email
    phone
    updatedAt
  }
}
```text

**Variables:**

```json
{
  "id": "patient-123",
  "input": {
    "email": "jane.smith.new@example.com",
    "phone": "+1-555-987-6543"
  }
}
```sql

### Delete Patient

```graphql
mutation DeletePatient($id: ID!) {
  deletePatient(id: $id) {
    id
    success
    message
  }
}
```python

## Clinical Encounters Mutations

### Create Encounter

```graphql
mutation CreateEncounter($input: CreateEncounterInput!) {
  createEncounter(input: $input) {
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
    createdAt
    updatedAt
  }
}
```text

**Variables:**

```json
{
  "input": {
    "status": "in-progress",
    "class": {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      "code": "AMB",
      "display": "Ambulatory"
    },
    "subjectId": "patient-123",
    "period": {
      "start": "2023-12-01T10:30:00Z"
    },
    "reasonCode": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "16265003",
          "display": "General examination"
        }
      ]
    }
  }
}
```sql

### Update Encounter

```graphql
mutation UpdateEncounter($id: ID!, $input: UpdateEncounterInput!) {
  updateEncounter(id: $id, input: $input) {
    id
    status
    period {
      start
      end
    }
    updatedAt
  }
}
```python

## Observation Mutations

### Create Observation

```graphql
mutation CreateObservation($input: CreateObservationInput!) {
  createObservation(input: $input) {
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
    valueQuantity {
      value
      unit
      system
      code
    }
    interpretation {
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

**Variables:**

```json
{
  "input": {
    "status": "final",
    "category": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "vital-signs",
          "display": "Vital Signs"
        }
      ]
    },
    "code": {
      "coding": [
        {
          "system": "http://loinc.org",
          "code": "8302-2",
          "display": "Body height"
        }
      ]
    },
    "subjectId": "patient-123",
    "effectiveDateTime": "2023-12-01T10:30:00Z",
    "valueQuantity": {
      "value": 175,
      "unit": "cm",
      "system": "http://unitsofmeasure.org",
      "code": "cm"
    }
  }
}
```python

## Medication Mutations

### Create Medication Request

```graphql
mutation CreateMedicationRequest($input: CreateMedicationRequestInput!) {
  createMedicationRequest(input: $input) {
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
                system
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
    authoredOn
    createdAt
    updatedAt
  }
}
```javascript

**Variables:**

```json
{
  "input": {
    "status": "active",
    "intent": "order",
    "medicationCode": {
      "coding": [
        {
          "system": "http://www.nlm.nih.gov/research",
          "code": "311965",
          "display": "Acetaminophen 325mg Tablet"
        }
      ]
    },
    "subjectId": "patient-123",
    "dosageInstruction": {
      "text": "Take 1 tablet every 4 hours as needed for pain",
      "timing": {
        "repeat": {
          "boundsPeriod": {
            "start": "2023-12-01T10:30:00Z",
            "end": "2023-12-08T10:30:00Z"
          },
          "frequency": {
            "code": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation",
                  "code": "QID",
                  "display": "QID"
                }
              ]
            }
          }
        }
      },
      "route": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "26643006",
            "display": "Oral"
          }
        ]
      },
      "doseAndRate": {
        "doseQuantity": {
          "value": 1,
          "unit": "tablet",
          "system": "http://unitsofmeasure.org",
          "code": "tablet"
        }
      }
    },
    "authoredOn": "2023-12-01T10:30:00Z"
  }
}
```python

## Procedure Mutations

### Create Procedure

```graphql
mutation CreateProcedure($input: CreateProcedureInput!) {
  createProcedure(input: $input) {
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
    createdAt
    updatedAt
  }
}
```text

**Variables:**

```json
{
  "input": {
    "status": "completed",
    "code": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "80146002",
          "display": "Appendectomy"
        }
      ]
    },
    "subjectId": "patient-123",
    "performedPeriod": {
      "start": "2023-12-01T08:00:00Z",
      "end": "2023-12-01T10:30:00Z"
    },
    "performer": {
      "actorId": "practitioner-456"
    },
    "bodySite": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "81840007",
          "display": "Appendix structure"
        }
      ]
    }
  }
}
```python

## Diagnostic Report Mutations

### Create Diagnostic Report

```graphql
mutation CreateDiagnosticReport($input: CreateDiagnosticReportInput!) {
  createDiagnosticReport(input: $input) {
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
    createdAt
    updatedAt
  }
}
```text

**Variables:**

```json
{
  "input": {
    "status": "final",
    "code": {
      "coding": [
        {
          "system": "http://loinc.org",
          "code": "718-7",
          "display": "Complete blood count (CBC) panel"
        }
      ]
    },
    "subjectId": "patient-123",
    "effectiveDateTime": "2023-12-01T12:00:00Z",
    "result": [
      {
        "reference": "Observation/obs-123",
        "display": "White Blood Cell Count"
      },
      {
        "reference": "Observation/obs-124",
        "display": "Hemoglobin"
      }
    ],
    "conclusionCode": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "281647001",
          "display": "Laboratory test normal"
        }
      ]
    }
  }
}
```text

## Batch Operations

### Batch Create Patients

```graphql
mutation BatchCreatePatients($input: [CreatePatientInput!]!) {
  batchCreatePatients(input: $input) {
    success
    errors {
      index
      message
      code
    }
    results {
      id
      mrn
      firstName
      lastName
    }
  }
}
```text

**Variables:**

```json
{
  "input": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "birthDate": "1985-06-15",
      "gender": "male"
    },
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "birthDate": "1990-03-22",
      "gender": "female"
    }
  ]
}
```text

**Response:**

```json
{
  "data": {
    "batchCreatePatients": {
      "success": true,
      "errors": [],
      "results": [
        {
          "id": "patient-123",
          "mrn": "MRN-2023-001234",
          "firstName": "John",
          "lastName": "Doe"
        },
        {
          "id": "patient-124",
          "mrn": "MRN-2023-001235",
          "firstName": "Jane",
          "lastName": "Smith"
        }
      ]
    }
  }
}
```text

## Error Handling

### GraphQL Error Response Format

```json
{
  "errors": [
    {
      "message": "Validation failed",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createPatient"],
      "extensions": {
        "code": "VALIDATION_ERROR",
        "details": {
          "field": "birthDate",
          "reason": "Invalid date format"
        }
      }
    }
  ],
  "data": null
}
```text

### Common Mutation Errors

### Validation Errors

```graphql
mutation CreatePatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
    id
    firstName
    lastName
  }
}
```text

**Variables:**

```json
{
  "input": {
    "firstName": "",
    "lastName": "",
    "birthDate": "invalid-date"
  }
}
```text

**Error Response:**

```json
{
  "errors": [
    {
      "message": "Validation failed",
      "path": ["createPatient"],
      "extensions": {
        "code": "VALIDATION_ERROR",
        "details": {
          "firstName": "First name is required",
          "lastName": "Last name is required",
          "birthDate": "Invalid date format. Use YYYY-MM-DD"
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
      "path": ["createPatient"],
      "extensions": {
        "code": "FORBIDDEN",
        "details": {
          "required": "patient.write",
          "current": "patient.read"
        }
      }
    }
  ]
}
```javascript

## Client Implementation Examples

### JavaScript/React

```javascript
import { gql, useMutation } from '@apollo/client';

const CREATE_PATIENT = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      id
      mrn
      firstName
      lastName
      birthDate
      gender
      email
      phone
      createdAt
      updatedAt
    }
  }
`;

function PatientForm() {
  const [createPatient, { loading, error, data }] = useMutation(CREATE_PATIENT);

  const handleSubmit = async (formData) => {
    try {
      await createPatient({
        variables: {
          input: formData,
        },
      });

      console.log('Patient created:', data.createPatient);
    } catch (err) {
      console.error('Error creating patient:', err);
    }
  };

  // Form implementation...
}
```javascript

### Python

```python
import graphene
from graphene import Mutation, String, ID, DateTime, List, Field
from .types import PatientType, CreatePatientInput, UpdatePatientInput

class CreatePatient(Mutation):
    class Arguments:
        input = CreatePatientInput(required=True)

    patient = Field(PatientType)

    def mutate(self, info, input):
        # Validate input
        if not input.get('firstName'):
            raise Exception('First name is required')

        # Create patient logic here
        patient = create_patient_in_database(input)

        return patient
```sql

### Java

```java
@GraphQLMutation
public class PatientMutation {

    @GraphQLField
    public Patient createPatient(@GraphQLArgument CreatePatientInput input) {
        // Validate input
        if (input.getFirstName() == null || input.getFirstName().isEmpty()) {
            throw new GraphQLException("First name is required");
        }

        // Create patient
        Patient patient = patientService.createPatient(input);

        return patient;
    }

    @GraphQLField
    public Patient updatePatient(
        @GraphQLArgument String id,
        @GraphQLArgument UpdatePatientInput input
    ) {
        // Update patient logic
        return patientService.updatePatient(id, input);
    }

    @GraphQLField
    public boolean deletePatient(@GraphQLArgument String id) {
        // Delete patient logic
        return patientService.deletePatient(id);
    }
}
```javascript

## Best Practices

### 1. Input Validation

```javascript
const validatePatientInput = (input) => {
  const errors = [];

  if (!input.firstName || input.firstName.trim().length < 1) {
    errors.push('First name is required');
  }

  if (!input.lastName || input.lastName.trim().length < 1) {
    errors.push('Last name is required');
  }

  if (!input.birthDate || !isValidDate(input.birthDate)) {
    errors.push('Invalid birth date format. Use YYYY-MM-DD');
  }

  if (!['male', 'female', 'other'].includes(input.gender)) {
    errors.push('Gender must be male, female, or other');
  }

  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }

  return true;
};
```javascript

### 2. Error Handling

```javascript
const handleGraphQLResponse = (response) => {
  if (response.errors && response.errors.length > 0) {
    const error = response.errors[0];
    console.error('GraphQL Error:', error.message);

    if (error.extensions) {
      console.error('Error Code:', error.extensions.code);
      console.error('Error Details:', error.extensions.details);
    }

    throw new Error(error.message);
  }

  return response.data;
};
```javascript

### 3. Batch Operations

```javascript
const batchCreatePatients = async (patients) => {
  const mutation = `
    mutation BatchCreatePatients($input: [CreatePatientInput!]!) {
      batchCreatePatients(input: $input) {
        success
        errors {
          index
          message
          code
        }
        results {
          id
          mrn
          firstName
          lastName
        }
      }
    }
  `;

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { input: patients },
      }),
    });

    const result = await response.json();
    return handleGraphQLResponse(result);
  } catch (error) {
    console.error('Batch create failed:', error);
    throw error;
  }
};
```javascript

## Testing

### Unit Testing Mutations

```javascript
import { execute, gql } from 'graphql';

const CREATE_PATIENT = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      id
      firstName
      lastName
      birthDate
      gender
    }
  }
`;

describe('Patient Mutations', () => {
  test('should create a patient', async () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1985-06-15',
      gender: 'male',
    };

    const result = await execute(CREATE_PATIENT, { input });

    expect(result.data.createPatient.firstName).toBe('John');
    expect(result.data.createPatient.lastName).toBe('Doe');
    expect(result.data.createPatient.birthDate).toBe('1985-06-15');
    expect(result.data.createPatient.gender).toBe('male');
    expect(result.data.createPatient.id).toBeDefined();
  });

  test('should validate required fields', async () => {
    const input = {
      firstName: '',
      lastName: 'Doe',
      birthDate: '1985-06-15',
      gender: 'male',
    };

    const result = await execute(CREATE_PATIENT, { input });

    expect(result.errors).toBeDefined();
    expect(result.errors[0].message).toContain('Validation failed');
  });
});
```javascript

### Integration Testing

```javascript
describe('Patient API Integration', () => {
  test('should create patient via GraphQL API', async () => {
    const mutation = `
      mutation CreatePatient($input: CreatePatientInput!) {
        createPatient(input: $input) {
          id
          firstName
          lastName
          birthDate
          gender
          email
        }
      }
    `;

    const input = {
      firstName: 'Integration',
      lastName: 'Test',
      birthDate: '1990-01-01',
      gender: 'female',
      email: 'integration@test.com',
    };

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { input },
      }),
    });

    const result = await response.json();

    expect(response.ok).toBe(true);
    expect(result.data.createPatient.firstName).toBe('Integration');
    expect(result.data.createPatient.email).toBe('integration@test.com');
  });
});
```text

This comprehensive GraphQL mutations guide provides everything you need to work with ZARISH SPHERE's GraphQL API for healthcare data management.
````
