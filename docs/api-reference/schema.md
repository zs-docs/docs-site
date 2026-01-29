---
title: 'GraphQL Schema'
sidebar_label: 'Schema'
description: 'Complete ZARISH SPHERE GraphQL schema reference with all types, queries, mutations, and subscriptions'
keywords: [graphql, schema, types, api, zarish sphere]
---

# GraphQL Schema

## Overview

The ZARISH SPHERE GraphQL schema provides a complete type system for healthcare data management. This reference covers all available types, queries, mutations, and subscriptions.

## Core Types

### Scalars

````graphql
scalar ID
scalar String
scalar Int
scalar Float
scalar Boolean
scalar DateTime
scalar Date
scalar Time
scalar JSON
scalar Upload
```text

### Enums

### Gender

```graphql
enum Gender {
  MALE
  FEMALE
  OTHER
  UNKNOWN
}
```text

### EncounterStatus

```graphql
enum EncounterStatus {
  PLANNED
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
  DISCONTINUED
  ENTERED_IN_ERROR
  UNKNOWN
}
```text

### ObservationStatus

```graphql
enum ObservationStatus {
  REGISTERED
  PRELIMINARY
  FINAL
  AMENDED
  CORRECTED
  CANCELLED
  ENTERED_IN_ERROR
  UNKNOWN
}
```text

### MedicationRequestStatus

```graphql
enum MedicationRequestStatus {
  ACTIVE
  ON_HOLD
  CANCELLED
  COMPLETED
  ENTERED_IN_ERROR
  STOPPED
  DRAFT
  UNKNOWN
}
```text

### ProcedureStatus

```graphql
enum ProcedureStatus {
  PREPARATION
  IN_PROGRESS
  NOT_DONE
  ON_HOLD
  STOPPED
  COMPLETED
  ENTERED_IN_ERROR
  UNKNOWN
}
```text

## Input Types

### PaginationInput

```graphql
input PaginationInput {
  first: Int
  last: Int
  after: String
  before: String
}
```text

### DateRangeInput

```graphql
input DateRangeInput {
  start: String!
  end: String!
}
```text

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
```text

### CreatePatientInput

```graphql
input CreatePatientInput {
  firstName: String!
  lastName: String!
  birthDate: String!
  gender: Gender!
  email: String
  phone: String
  address: AddressInput
  emergencyContact: EmergencyContactInput
  primaryCarePhysicianId: ID
  mrn: String
}
```text

### UpdatePatientInput

```graphql
input UpdatePatientInput {
  firstName: String
  lastName: String
  birthDate: String
  gender: Gender
  email: String
  phone: String
  address: AddressInput
  emergencyContact: EmergencyContactInput
  primaryCarePhysicianId: ID
}
```text

### AddressInput

```graphql
input AddressInput {
  street: String
  city: String
  state: String
  postalCode: String
  country: String
}
```text

### EmergencyContactInput

```graphql
input EmergencyContactInput {
  name: String
  relationship: String
  phone: String
  email: String
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

### CreateEncounterInput

```graphql
input CreateEncounterInput {
  status: EncounterStatus!
  class: CodingInput!
  type: CodingInput
  subjectId: ID!
  participant: [EncounterParticipantInput!]
  period: PeriodInput
  reasonCode: CodingInput
  serviceProviderId: ID
}
```yaml

### UpdateEncounterInput

```graphql
input UpdateEncounterInput {
  status: EncounterStatus
  class: CodingInput
  type: CodingInput
  participant: [EncounterParticipantInput!]
  period: PeriodInput
  reasonCode: CodingInput
  serviceProviderId: ID
}
```text

### EncounterParticipantInput

```graphql
input EncounterParticipantInput {
  type: CodingInput!
  individualId: ID!
  period: PeriodInput
}
```text

### PeriodInput

```graphql
input PeriodInput {
  start: String
  end: String
}
```text

### CodingInput

```graphql
input CodingInput {
  system: String
  code: String
  display: String
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
```yaml

### CreateObservationInput

```graphql
input CreateObservationInput {
  status: ObservationStatus!
  category: CodingInput!
  code: CodingInput!
  subjectId: ID!
  encounterId: ID
  effectiveDateTime: String
  effectivePeriod: PeriodInput
  valueQuantity: QuantityInput
  valueCodeableConcept: CodingInput
  interpretation: CodingInput
  performerId: ID
}
```yaml

### UpdateObservationInput

```graphql
input UpdateObservationInput {
  status: ObservationStatus
  category: CodingInput
  code: CodingInput
  effectiveDateTime: String
  effectivePeriod: PeriodInput
  valueQuantity: QuantityInput
  valueCodeableConcept: CodingInput
  interpretation: CodingInput
  performerId: ID
}
```text

### QuantityInput

```graphql
input QuantityInput {
  value: Float!
  unit: String
  system: String
  code: String
}
```yaml

### MedicationRequestFilter

```graphql
input MedicationRequestFilter {
  patientId: ID
  encounterId: ID
  status: MedicationRequestStatus
  medicationCode: String
  dateRange: DateRangeInput
  requesterId: ID
}
```yaml

### CreateMedicationRequestInput

```graphql
input CreateMedicationRequestInput {
  status: MedicationRequestStatus!
  intent: MedicationRequestIntent!
  medicationCode: CodingInput!
  subjectId: ID!
  encounterId: ID
  dosageInstruction: [DosageInstructionInput!]
  dispenseRequest: MedicationDispenseRequestInput
  authoredOn: String
  requesterId: ID
}
```yaml

### UpdateMedicationRequestInput

```graphql
input UpdateMedicationRequestInput {
  status: MedicationRequestStatus
  intent: MedicationRequestIntent
  medicationCode: CodingInput
  dosageInstruction: [DosageInstructionInput!]
  dispenseRequest: MedicationDispenseRequestInput
  requesterId: ID
}
```text

### MedicationRequestIntent

```graphql
enum MedicationRequestIntent {
  PROPOSAL
  PLAN
  ORDER
  ORIGINAL_ORDER
  REFLEX_ORDER
  FILLER_ORDER
  INSTANCE_ORDER
  OPTION
}
```text

### DosageInstructionInput

```graphql
input DosageInstructionInput {
  text: String
  timing: TimingInput
  route: CodingInput
  doseAndRate: DoseAndRateInput
}
```text

### TimingInput

```graphql
input TimingInput {
  repeat: TimingRepeatInput
  code: CodingInput
}
```text

### TimingRepeatInput

```graphql
input TimingRepeatInput {
  boundsPeriod: PeriodInput
  count: Int
  frequency: FrequencyInput
  period: Float
  periodUnit: String
}
```text

### FrequencyInput

```graphql
input FrequencyInput {
  code: CodingInput
}
```text

### DoseAndRateInput

```graphql
input DoseAndRateInput {
  type: String
  doseQuantity: QuantityInput
  rateQuantity: QuantityInput
}
```text

### MedicationDispenseRequestInput

```graphql
input MedicationDispenseRequestInput {
  validityPeriod: PeriodInput
  quantity: QuantityInput
  expectedSupplyDuration: QuantityInput
  performerId: ID
}
```yaml

### ProcedureFilter

```graphql
input ProcedureFilter {
  patientId: ID
  encounterId: ID
  status: ProcedureStatus
  code: String
  dateRange: DateRangeInput
  performerId: ID
}
```yaml

### CreateProcedureInput

```graphql
input CreateProcedureInput {
  status: ProcedureStatus!
  code: CodingInput!
  subjectId: ID!
  encounterId: ID
  performedPeriod: PeriodInput
  performer: [ProcedurePerformerInput!]
  bodySite: [CodingInput!]
  outcome: CodingInput
  complication: [CodingInput!]
  followUp: [CodingInput!]
}
```yaml

### UpdateProcedureInput

```graphql
input UpdateProcedureInput {
  status: ProcedureStatus
  code: CodingInput
  performedPeriod: PeriodInput
  performer: [ProcedurePerformerInput!]
  bodySite: [CodingInput!]
  outcome: CodingInput
  complication: [CodingInput!]
  followUp: [CodingInput!]
}
```javascript

### ProcedurePerformerInput

```graphql
input ProcedurePerformerInput {
  actorId: ID!
  function: CodingInput
  period: PeriodInput
}
```yaml

### DiagnosticReportFilter

```graphql
input DiagnosticReportFilter {
  patientId: ID
  encounterId: ID
  status: DiagnosticReportStatus
  code: String
  dateRange: DateRangeInput
  performerId: ID
}
```yaml

### CreateDiagnosticReportInput

```graphql
input CreateDiagnosticReportInput {
  status: DiagnosticReportStatus!
  code: CodingInput!
  subjectId: ID!
  encounterId: ID
  effectiveDateTime: String
  result: [ReferenceInput!]
  conclusionCode: [CodingInput!]
  conclusion: String
  performerId: ID
}
```yaml

### UpdateDiagnosticReportInput

```graphql
input UpdateDiagnosticReportInput {
  status: DiagnosticReportStatus
  code: CodingInput
  effectiveDateTime: String
  result: [ReferenceInput!]
  conclusionCode: [CodingInput!]
  conclusion: String
  performerId: ID
}
```text

### DiagnosticReportStatus

```graphql
enum DiagnosticReportStatus {
  REGISTERED
  PARTIAL
  PRELIMINARY
  FINAL
  AMENDED
  CORRECTED
  APPENDED
  CANCELLED
  ENTERED_IN_ERROR
  UNKNOWN
}
```text

### ReferenceInput

```graphql
input ReferenceInput {
  reference: String!
  display: String
}
```text

## Object Types

### Patient

```graphql
type Patient {
  id: ID!
  mrn: String
  firstName: String!
  lastName: String!
  birthDate: String!
  gender: Gender!
  age: Int
  email: String
  phone: String
  address: Address
  emergencyContact: EmergencyContact
  primaryCarePhysician: Practitioner
  createdAt: DateTime!
  updatedAt: DateTime!
}
```text

### Address

```graphql
type Address {
  street: String
  city: String
  state: String
  postalCode: String
  country: String
}
```text

### EmergencyContact

```graphql
type EmergencyContact {
  name: String
  relationship: String
  phone: String
  email: String
}
```text

### Practitioner

```graphql
type Practitioner {
  id: ID!
  firstName: String!
  lastName: String!
  role: String!
  specialty: String
  email: String
  phone: String
  active: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```yaml

### Encounter

```graphql
type Encounter {
  id: ID!
  status: EncounterStatus!
  class: Coding!
  type: Coding
  subject: Patient!
  participant: [EncounterParticipant!]!
  period: Period
  reasonCode: [Coding!]
  diagnosis: [EncounterDiagnosis!]
  serviceProvider: Organization
  createdAt: DateTime!
  updatedAt: DateTime!
}
```text

### EncounterParticipant

```graphql
type EncounterParticipant {
  type: Coding!
  individual: Practitioner!
  period: Period
}
```text

### EncounterDiagnosis

```graphql
type EncounterDiagnosis {
  condition: Condition!
  use: Coding!
  rank: Int
}
```text

### Condition

```graphql
type Condition {
  id: ID!
  code: Coding!
  category: [Coding!]
  severity: Coding
  subject: Patient!
  onsetDateTime: String
  recordedDate: String
  asserter: Practitioner
  createdAt: DateTime!
  updatedAt: DateTime!
}
```text

### Organization

```graphql
type Organization {
  id: ID!
  name: String!
  type: String!
  active: Boolean!
  address: Address
  phone: String
  email: String
  createdAt: DateTime!
  updatedAt: DateTime!
}
```yaml

### Observation

```graphql
type Observation {
  id: ID!
  status: ObservationStatus!
  category: [Coding!]
  code: Coding!
  subject: Patient!
  encounter: Encounter
  effectiveDateTime: String
  effectivePeriod: Period
  issued: String
  valueQuantity: Quantity
  valueCodeableConcept: Coding
  interpretation: [Coding!]
  referenceRange: [ObservationReferenceRange!]
  performer: [Practitioner!]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```text

### ObservationReferenceRange

```graphql
type ObservationReferenceRange {
  low: Quantity
  high: Quantity
  text: String
}
```text

### Quantity

```graphql
type Quantity {
  value: Float!
  unit: String
  system: String
  code: String
}
```yaml

### MedicationRequest

```graphql
type MedicationRequest {
  id: ID!
  status: MedicationRequestStatus!
  intent: MedicationRequestIntent!
  medication: Medication!
  subject: Patient!
  encounter: Encounter
  dosageInstruction: [DosageInstruction!]
  dispenseRequest: MedicationDispenseRequest
  authoredOn: String
  requester: Practitioner
  createdAt: DateTime!
  updatedAt: DateTime!
}
```text

### Medication

```graphql
type Medication {
  code: Coding!
  form: Coding
  amount: Quantity
  manufacturer: String
  batch: MedicationBatch
}
```text

### MedicationBatch

```graphql
type MedicationBatch {
  lotNumber: String
  expirationDate: String
}
```text

### DosageInstruction

```graphql
type DosageInstruction {
  text: String
  timing: Timing
  route: Coding
  doseAndRate: DoseAndRate
}
```text

### Timing

```graphql
type Timing {
  repeat: TimingRepeat
  code: Coding
}
```text

### TimingRepeat

```graphql
type TimingRepeat {
  boundsPeriod: Period
  count: Int
  frequency: Frequency
  period: Float
  periodUnit: String
}
```text

### Frequency

```graphql
type Frequency {
  code: Coding
}
```text

### DoseAndRate

```graphql
type DoseAndRate {
  type: String
  doseQuantity: Quantity
  rateQuantity: Quantity
}
```text

### MedicationDispenseRequest

```graphql
type MedicationDispenseRequest {
  validityPeriod: Period
  quantity: Quantity
  expectedSupplyDuration: Quantity
  performer: Practitioner
}
```yaml

### Procedure

```graphql
type Procedure {
  id: ID!
  status: ProcedureStatus!
  code: Coding!
  subject: Patient!
  encounter: Encounter
  performedPeriod: Period
  performer: [ProcedurePerformer!]
  bodySite: [Coding!]
  outcome: Coding
  complication: [Coding!]
  followUp: [Coding!]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```typescript

### ProcedurePerformer

```graphql
type ProcedurePerformer {
  actor: Practitioner!
  function: Coding
  period: Period
}
```yaml

### DiagnosticReport

```graphql
type DiagnosticReport {
  id: ID!
  status: DiagnosticReportStatus!
  code: Coding!
  subject: Patient!
  encounter: Encounter
  effectiveDateTime: String
  issued: String
  result: [Reference!]
  conclusionCode: [Coding!]
  conclusion: String
  presentedForm: [Attachment!]
  performer: [Practitioner!]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```text

### Reference

```graphql
type Reference {
  reference: String!
  display: String
}
```text

### Attachment

```graphql
type Attachment {
  contentType: String!
  language: String
  data: String
  url: String
  size: Int
  hash: String
  title: String
  creation: String
}
```text

### Coding

```graphql
type Coding {
  system: String
  code: String
  display: String
}
```text

### Period

```graphql
type Period {
  start: String
  end: String
}
```text

## Connection Types

### PatientConnection

```graphql
type PatientConnection {
  edges: [PatientEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```text

### PatientEdge

```graphql
type PatientEdge {
  node: Patient!
  cursor: String!
}
```text

### EncounterConnection

```graphql
type EncounterConnection {
  edges: [EncounterEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```text

### EncounterEdge

```graphql
type EncounterEdge {
  node: Encounter!
  cursor: String!
}
```text

### ObservationConnection

```graphql
type ObservationConnection {
  edges: [ObservationEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```text

### ObservationEdge

```graphql
type ObservationEdge {
  node: Observation!
  cursor: String!
}
```text

### MedicationRequestConnection

```graphql
type MedicationRequestConnection {
  edges: [MedicationRequestEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```text

### MedicationRequestEdge

```graphql
type MedicationRequestEdge {
  node: MedicationRequest!
  cursor: String!
}
```text

### ProcedureConnection

```graphql
type ProcedureConnection {
  edges: [ProcedureEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```text

### ProcedureEdge

```graphql
type ProcedureEdge {
  node: Procedure!
  cursor: String!
}
```text

### DiagnosticReportConnection

```graphql
type DiagnosticReportConnection {
  edges: [DiagnosticReportEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```text

### DiagnosticReportEdge

```graphql
type DiagnosticReportEdge {
  node: DiagnosticReport!
  cursor: String!
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

## Query Root

```graphql
type Query {
  # Patient queries
  patient(id: ID!): Patient
  patients(filter: PatientFilter, pagination: PaginationInput): PatientConnection!

  # Encounter queries
  encounter(id: ID!): Encounter
  encounters(filter: EncounterFilter, pagination: PaginationInput): EncounterConnection!

  # Observation queries
  observation(id: ID!): Observation
  observations(filter: ObservationFilter, pagination: PaginationInput): ObservationConnection!

  # MedicationRequest queries
  medicationRequest(id: ID!): MedicationRequest
  medicationRequests(
    filter: MedicationRequestFilter
    pagination: PaginationInput
  ): MedicationRequestConnection!

  # Procedure queries
  procedure(id: ID!): Procedure
  procedures(filter: ProcedureFilter, pagination: PaginationInput): ProcedureConnection!

  # DiagnosticReport queries
  diagnosticReport(id: ID!): DiagnosticReport
  diagnosticReports(
    filter: DiagnosticReportFilter
    pagination: PaginationInput
  ): DiagnosticReportConnection!

  # Practitioner queries
  practitioner(id: ID!): Practitioner
  practitioners(pagination: PaginationInput): PractitionerConnection!

  # Organization queries
  organization(id: ID!): Organization
  organizations(pagination: PaginationInput): OrganizationConnection!

  # Health queries
  health: Health!
}
```text

### PractitionerConnection

```graphql
type PractitionerConnection {
  edges: [PractitionerEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```text

### PractitionerEdge

```graphql
type PractitionerEdge {
  node: Practitioner!
  cursor: String!
}
```text

### OrganizationConnection

```graphql
type OrganizationConnection {
  edges: [OrganizationEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```text

### OrganizationEdge

```graphql
type OrganizationEdge {
  node: Organization!
  cursor: String!
}
```yaml

### Health

```graphql
type Health {
  status: String!
  version: String!
  timestamp: String!
}
```text

## Mutation Root

```graphql
type Mutation {
  # Patient mutations
  createPatient(input: CreatePatientInput!): Patient!
  updatePatient(id: ID!, input: UpdatePatientInput!): Patient!
  deletePatient(id: ID!): DeleteResponse!

  # Encounter mutations
  createEncounter(input: CreateEncounterInput!): Encounter!
  updateEncounter(id: ID!, input: UpdateEncounterInput!): Encounter!
  deleteEncounter(id: ID!): DeleteResponse!

  # Observation mutations
  createObservation(input: CreateObservationInput!): Observation!
  updateObservation(id: ID!, input: UpdateObservationInput!): Observation!
  deleteObservation(id: ID!): DeleteResponse!

  # MedicationRequest mutations
  createMedicationRequest(input: CreateMedicationRequestInput!): MedicationRequest!
  updateMedicationRequest(id: ID!, input: UpdateMedicationRequestInput!): MedicationRequest!
  deleteMedicationRequest(id: ID!): DeleteResponse!

  # Procedure mutations
  createProcedure(input: CreateProcedureInput!): Procedure!
  updateProcedure(id: ID!, input: UpdateProcedureInput!): Procedure!
  deleteProcedure(id: ID!): DeleteResponse!

  # DiagnosticReport mutations
  createDiagnosticReport(input: CreateDiagnosticReportInput!): DiagnosticReport!
  updateDiagnosticReport(id: ID!, input: UpdateDiagnosticReportInput!): DiagnosticReport!
  deleteDiagnosticReport(id: ID!): DeleteResponse!

  # Batch operations
  batchCreatePatients(input: [CreatePatientInput!]!): BatchCreatePatientsResponse!
  batchCreateEncounters(input: [CreateEncounterInput!]!): BatchCreateEncountersResponse!
  batchCreateObservations(input: [CreateObservationInput!]!): BatchCreateObservationsResponse!
}
```text

### DeleteResponse

```graphql
type DeleteResponse {
  id: ID!
  success: Boolean!
  message: String
}
```text

### BatchCreatePatientsResponse

```graphql
type BatchCreatePatientsResponse {
  success: Boolean!
  errors: [BatchError!]
  results: [Patient!]
}
```text

### BatchCreateEncountersResponse

```graphql
type BatchCreateEncountersResponse {
  success: Boolean!
  errors: [BatchError!]
  results: [Encounter!]
}
```text

### BatchCreateObservationsResponse

```graphql
type BatchCreateObservationsResponse {
  success: Boolean!
  errors: [BatchError!]
  results: [Observation!]
}
```text

### BatchError

```graphql
type BatchError {
  index: Int!
  message: String!
  code: String!
}
```text

## Subscription Root

```graphql
type Subscription {
  # Patient subscriptions
  patientUpdates(patientId: ID!): PatientSubscription!
  patientCreated: PatientSubscription!
  patientUpdated: PatientSubscription!
  patientDeleted: PatientSubscription!

  # Encounter subscriptions
  encounterUpdates(patientId: ID!): EncounterSubscription!
  encounterCreated: EncounterSubscription!
  encounterUpdated: EncounterSubscription!
  encounterDeleted: EncounterSubscription!

  # Observation subscriptions
  observationUpdates(patientId: ID!): ObservationSubscription!
  observationCreated: ObservationSubscription!
  observationUpdated: ObservationSubscription!
  observationDeleted: ObservationSubscription!

  # System subscriptions
  systemStatus: SystemStatusSubscription!
}
```text

### PatientSubscription

```graphql
type PatientSubscription {
  type: SubscriptionType!
  patient: Patient
  timestamp: DateTime!
}
```text

### EncounterSubscription

```graphql
type EncounterSubscription {
  type: SubscriptionType!
  encounter: Encounter
  timestamp: DateTime!
}
```text

### ObservationSubscription

```graphql
type ObservationSubscription {
  type: SubscriptionType!
  observation: Observation
  timestamp: DateTime!
}
```yaml

### SystemStatusSubscription

```graphql
type SystemStatusSubscription {
  status: String!
  message: String
  timestamp: DateTime!
}
```text

### SubscriptionType

```graphql
enum SubscriptionType {
  CREATED
  UPDATED
  DELETED
}
```text

## Directives

### Auth Directive

```graphql
directive @auth(requires: [String!]!) on FIELD_DEFINITION
```text

### Validation Directive

```graphql
directive @validate(rules: [ValidationRule!]!) on INPUT_FIELD_DEFINITION
```text

### ValidationRule

```graphql
input ValidationRule {
  type: String!
  pattern: String
  min: Int
  max: Int
  required: Boolean
}
```text

## Schema Extensions

### Humanitarian Extensions

```graphql
extend type Patient {
  displacementStatus: String
  campLocation: String
  arrivalDate: String
  humanitarianNeeds: [String!]
}
```text

### Low-Resource Extensions

```graphql
extend type Patient {
  offlineSync: Boolean
  minimalDataMode: Boolean
  bandwidthOptimized: Boolean
}
```text

This comprehensive schema reference provides the complete type system for ZARISH SPHERE's GraphQL API, enabling type-safe development and powerful healthcare data management.
````
