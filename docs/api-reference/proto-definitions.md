---
title: 'Proto Definitions'
sidebar_label: 'Proto Definitions'
description: 'Protocol Buffers definitions for ZARISH SPHERE gRPC services and message types'
keywords: [protobuf, grpc, definitions, api, zarish sphere]
---

# Proto Definitions

## Overview

ZARISH SPHERE uses Protocol Buffers (protobuf) for high-performance gRPC services. This section contains the complete protobuf definitions for all healthcare data types and service interfaces.

## Core Data Types

### patient.proto

````protobuf
syntax = "proto3";

package zarishsphere.patient;

import "google/protobuf/timestamp.proto";
import "google/type/date.proto";

// Patient resource definition
message Patient {
  string id = 1;
  string mrn = 2;
  string first_name = 3;
  string last_name = 4;
  google.type.Date birth_date = 5;
  Gender gender = 6;
  string email = 7;
  string phone = 8;
  Address address = 9;
  EmergencyContact emergency_contact = 10;
  string primary_care_physician_id = 11;
  google.protobuf.Timestamp created_at = 12;
  google.protobuf.Timestamp updated_at = 13;
}

enum Gender {
  GENDER_UNSPECIFIED = 0;
  GENDER_MALE = 1;
  GENDER_FEMALE = 2;
  GENDER_OTHER = 3;
  GENDER_UNKNOWN = 4;
}

message Address {
  string street = 1;
  string city = 2;
  string state = 3;
  string postal_code = 4;
  string country = 5;
}

message EmergencyContact {
  string name = 1;
  string relationship = 2;
  string phone = 3;
  string email = 4;
}

// Request/Response messages
message CreatePatientRequest {
  Patient patient = 1;
}

message CreatePatientResponse {
  Patient patient = 1;
}

message GetPatientRequest {
  string id = 1;
}

message GetPatientResponse {
  Patient patient = 1;
}

message UpdatePatientRequest {
  string id = 1;
  Patient patient = 2;
}

message UpdatePatientResponse {
  Patient patient = 1;
}

message DeletePatientRequest {
  string id = 1;
}

message DeletePatientResponse {
  bool success = 1;
  string message = 2;
}

message SearchPatientsRequest {
  string name = 1;
  Gender gender = 2;
  google.type.Date birth_date = 3;
  string mrn = 4;
  int32 page = 5;
  int32 per_page = 6;
}

message SearchPatientsResponse {
  repeated Patient patients = 1;
  int32 total_count = 2;
  int32 page = 3;
  int32 per_page = 4;
}
```typescript

### clinical.proto

```protobuf
syntax = "proto3";

package zarishsphere.clinical;

import "google/protobuf/timestamp.proto";
import "patient.proto";

// Encounter resource definition
message Encounter {
  string id = 1;
  EncounterStatus status = 2;
  Coding class = 3;
  repeated Coding type = 4;
  Patient subject = 5;
  repeated EncounterParticipant participant = 6;
  Period period = 7;
  repeated Coding reason_code = 8;
  repeated EncounterDiagnosis diagnosis = 9;
  string service_provider_id = 10;
  google.protobuf.Timestamp created_at = 11;
  google.protobuf.Timestamp updated_at = 12;
}

enum EncounterStatus {
  ENCOUNTER_STATUS_UNSPECIFIED = 0;
  ENCOUNTER_STATUS_PLANNED = 1;
  ENCOUNTER_STATUS_IN_PROGRESS = 2;
  ENCOUNTER_STATUS_ON_HOLD = 3;
  ENCOUNTER_STATUS_COMPLETED = 4;
  ENCOUNTER_STATUS_CANCELLED = 5;
  ENCOUNTER_STATUS_DISCONTINUED = 6;
  ENCOUNTER_STATUS_ENTERED_IN_ERROR = 7;
}

message Coding {
  string system = 1;
  string code = 2;
  string display = 3;
}

message EncounterParticipant {
  Coding type = 1;
  Practitioner individual = 2;
  Period period = 3;
}

message Practitioner {
  string id = 1;
  string first_name = 2;
  string last_name = 3;
  string role = 4;
  string specialty = 5;
}

message Period {
  google.protobuf.Timestamp start = 1;
  google.protobuf.Timestamp end = 2;
}

message EncounterDiagnosis {
  Condition condition = 1;
  Coding use = 2;
  int32 rank = 3;
}

message Condition {
  string id = 1;
  Coding code = 2;
  repeated Coding category = 3;
  Coding severity = 4;
}

// Request/Response messages
message CreateEncounterRequest {
  Encounter encounter = 1;
}

message CreateEncounterResponse {
  Encounter encounter = 1;
}

message GetEncounterRequest {
  string id = 1;
}

message GetEncounterResponse {
  Encounter encounter = 1;
}

message UpdateEncounterRequest {
  string id = 1;
  Encounter encounter = 2;
}

message UpdateEncounterResponse {
  Encounter encounter = 1;
}

message SearchEncountersRequest {
  string patient_id = 1;
  EncounterStatus status = 2;
  string class = 3;
  google.protobuf.Timestamp start_date = 4;
  google.protobuf.Timestamp end_date = 5;
  int32 page = 6;
  int32 per_page = 7;
}

message SearchEncountersResponse {
  repeated Encounter encounters = 1;
  int32 total_count = 2;
  int32 page = 3;
  int32 per_page = 4;
}
```javascript

### observation.proto

```protobuf
syntax = "proto3";

package zarishsphere.observation;

import "google/protobuf/timestamp.proto";
import "patient.proto";

// Observation resource definition
message Observation {
  string id = 1;
  ObservationStatus status = 2;
  repeated Coding category = 3;
  Coding code = 4;
  Patient subject = 5;
  Encounter encounter = 6;
  oneof effective {
    google.protobuf.Timestamp effective_datetime = 7;
    Period effective_period = 8;
  }
  google.protobuf.Timestamp issued = 9;
  oneof value {
    Quantity value_quantity = 10;
    Coding value_codeable_concept = 11;
  }
  repeated Coding interpretation = 12;
  repeated ObservationReferenceRange reference_range = 13;
  repeated Practitioner performer = 14;
  google.protobuf.Timestamp created_at = 15;
  google.protobuf.Timestamp updated_at = 16;
}

enum ObservationStatus {
  OBSERVATION_STATUS_UNSPECIFIED = 0;
  OBSERVATION_STATUS_REGISTERED = 1;
  OBSERVATION_STATUS_PRELIMINARY = 2;
  OBSERVATION_STATUS_FINAL = 3;
  OBSERVATION_STATUS_AMENDED = 4;
  OBSERVATION_STATUS_CORRECTED = 5;
  OBSERVATION_STATUS_CANCELLED = 6;
  OBSERVATION_STATUS_ENTERED_IN_ERROR = 7;
}

message Quantity {
  double value = 1;
  string unit = 2;
  string system = 3;
  string code = 4;
}

message ObservationReferenceRange {
  Quantity low = 1;
  Quantity high = 2;
  string text = 3;
}

// Request/Response messages
message CreateObservationRequest {
  Observation observation = 1;
}

message CreateObservationResponse {
  Observation observation = 1;
}

message GetObservationRequest {
  string id = 1;
}

message GetObservationResponse {
  Observation observation = 1;
}

message UpdateObservationRequest {
  string id = 1;
  Observation observation = 2;
}

message UpdateObservationResponse {
  Observation observation = 1;
}

message SearchObservationsRequest {
  string patient_id = 1;
  string encounter_id = 2;
  string category = 3;
  string code = 4;
  ObservationStatus status = 5;
  google.protobuf.Timestamp start_date = 6;
  google.protobuf.Timestamp end_date = 7;
  int32 page = 8;
  int32 per_page = 9;
}

message SearchObservationsResponse {
  repeated Observation observations = 1;
  int32 total_count = 2;
  int32 page = 3;
  int32 per_page = 4;
}
```typescript

### medication.proto

```protobuf
syntax = "proto3";

package zarishsphere.medication;

import "google/protobuf/timestamp.proto";
import "patient.proto";

// MedicationRequest resource definition
message MedicationRequest {
  string id = 1;
  MedicationRequestStatus status = 2;
  MedicationRequestIntent intent = 3;
  Medication medication = 4;
  Patient subject = 5;
  Encounter encounter = 6;
  repeated DosageInstruction dosage_instruction = 7;
  MedicationDispenseRequest dispense_request = 8;
  google.protobuf.Timestamp authored_on = 9;
  Practitioner requester = 10;
  google.protobuf.Timestamp created_at = 11;
  google.protobuf.Timestamp updated_at = 12;
}

enum MedicationRequestStatus {
  MEDICATION_REQUEST_STATUS_UNSPECIFIED = 0;
  MEDICATION_REQUEST_STATUS_ACTIVE = 1;
  MEDICATION_REQUEST_STATUS_ON_HOLD = 2;
  MEDICATION_REQUEST_STATUS_CANCELLED = 3;
  MEDICATION_REQUEST_STATUS_COMPLETED = 4;
  MEDICATION_REQUEST_STATUS_ENTERED_IN_ERROR = 5;
  MEDICATION_REQUEST_STATUS_STOPPED = 6;
  MEDICATION_REQUEST_STATUS_DRAFT = 7;
}

enum MedicationRequestIntent {
  MEDICATION_REQUEST_INTENT_UNSPECIFIED = 0;
  MEDICATION_REQUEST_INTENT_PROPOSAL = 1;
  MEDICATION_REQUEST_INTENT_PLAN = 2;
  MEDICATION_REQUEST_INTENT_ORDER = 3;
  MEDICATION_REQUEST_INTENT_ORIGINAL_ORDER = 4;
  MEDICATION_REQUEST_INTENT_REFLEX_ORDER = 5;
  MEDICATION_REQUEST_INTENT_FILLER_ORDER = 6;
  MEDICATION_REQUEST_INTENT_INSTANCE_ORDER = 7;
  MEDICATION_REQUEST_INTENT_OPTION = 8;
}

message Medication {
  Coding code = 1;
  Coding form = 2;
  Quantity amount = 3;
  string manufacturer = 4;
  MedicationBatch batch = 5;
}

message MedicationBatch {
  string lot_number = 1;
  google.protobuf.Timestamp expiration_date = 2;
}

message DosageInstruction {
  string text = 1;
  Timing timing = 2;
  Coding route = 3;
  DoseAndRate dose_and_rate = 4;
}

message Timing {
  TimingRepeat repeat = 1;
  Coding code = 2;
}

message TimingRepeat {
  Period bounds_period = 1;
  int32 count = 2;
  Frequency frequency = 3;
  double period = 4;
  string period_unit = 5;
}

message Frequency {
  Coding code = 1;
}

message DoseAndRate {
  string type = 1;
  Quantity dose_quantity = 2;
  Quantity rate_quantity = 3;
}

message MedicationDispenseRequest {
  Period validity_period = 1;
  Quantity quantity = 2;
  Quantity expected_supply_duration = 3;
  Practitioner performer = 4;
}

// Request/Response messages
message CreateMedicationRequestRequest {
  MedicationRequest medication_request = 1;
}

message CreateMedicationRequestResponse {
  MedicationRequest medication_request = 1;
}

message GetMedicationRequestRequest {
  string id = 1;
}

message GetMedicationRequestResponse {
  MedicationRequest medication_request = 1;
}

message UpdateMedicationRequestRequest {
  string id = 1;
  MedicationRequest medication_request = 2;
}

message UpdateMedicationRequestResponse {
  MedicationRequest medication_request = 1;
}

message SearchMedicationRequestsRequest {
  string patient_id = 1;
  string encounter_id = 2;
  MedicationRequestStatus status = 3;
  string medication_code = 4;
  google.protobuf.Timestamp start_date = 5;
  google.protobuf.Timestamp end_date = 6;
  int32 page = 7;
  int32 per_page = 8;
}

message SearchMedicationRequestsResponse {
  repeated MedicationRequest medication_requests = 1;
  int32 total_count = 2;
  int32 page = 3;
  int32 per_page = 4;
}
```javascript

## Service Definitions

### patient_service.proto

```protobuf
syntax = "proto3";

package zarishsphere.patient;

import "google/protobuf/empty.proto";

// Patient service definition
service PatientService {
  rpc CreatePatient(CreatePatientRequest) returns (CreatePatientResponse);
  rpc GetPatient(GetPatientRequest) returns (GetPatientResponse);
  rpc UpdatePatient(UpdatePatientRequest) returns (UpdatePatientResponse);
  rpc DeletePatient(DeletePatientRequest) returns (DeletePatientResponse);
  rpc SearchPatients(SearchPatientsRequest) returns (SearchPatientsResponse);
  rpc BatchCreatePatients(BatchCreatePatientsRequest) returns (BatchCreatePatientsResponse);
}

message BatchCreatePatientsRequest {
  repeated Patient patients = 1;
}

message BatchCreatePatientsResponse {
  bool success = 1;
  repeated BatchError errors = 2;
  repeated Patient results = 3;
}

message BatchError {
  int32 index = 1;
  string message = 2;
  string code = 3;
}
```javascript

### clinical_service.proto

```protobuf
syntax = "proto3";

package zarishsphere.clinical;

import "google/protobuf/empty.proto";

// Clinical service definition
service ClinicalService {
  rpc CreateEncounter(CreateEncounterRequest) returns (CreateEncounterResponse);
  rpc GetEncounter(GetEncounterRequest) returns (GetEncounterResponse);
  rpc UpdateEncounter(UpdateEncounterRequest) returns (UpdateEncounterResponse);
  rpc DeleteEncounter(DeleteEncounterRequest) returns (DeleteEncounterResponse);
  rpc SearchEncounters(SearchEncountersRequest) returns (SearchEncountersResponse);
  rpc BatchCreateEncounters(BatchCreateEncountersRequest) returns (BatchCreateEncountersResponse);
}

message DeleteEncounterRequest {
  string id = 1;
}

message DeleteEncounterResponse {
  bool success = 1;
  string message = 2;
}

message BatchCreateEncountersRequest {
  repeated Encounter encounters = 1;
}

message BatchCreateEncountersResponse {
  bool success = 1;
  repeated BatchError errors = 2;
  repeated Encounter results = 3;
}
```javascript

### observation_service.proto

```protobuf
syntax = "proto3";

package zarishsphere.observation;

import "google/protobuf/empty.proto";

// Observation service definition
service ObservationService {
  rpc CreateObservation(CreateObservationRequest) returns (CreateObservationResponse);
  rpc GetObservation(GetObservationRequest) returns (GetObservationResponse);
  rpc UpdateObservation(UpdateObservationRequest) returns (UpdateObservationResponse);
  rpc DeleteObservation(DeleteObservationRequest) returns (DeleteObservationResponse);
  rpc SearchObservations(SearchObservationsRequest) returns (SearchObservationsResponse);
  rpc BatchCreateObservations(BatchCreateObservationsRequest) returns (BatchCreateObservationsResponse);
  rpc StreamObservations(StreamObservationsRequest) returns (stream Observation);
}

message DeleteObservationRequest {
  string id = 1;
}

message DeleteObservationResponse {
  bool success = 1;
  string message = 2;
}

message BatchCreateObservationsRequest {
  repeated Observation observations = 1;
}

message BatchCreateObservationsResponse {
  bool success = 1;
  repeated BatchError errors = 2;
  repeated Observation results = 3;
}

message StreamObservationsRequest {
  string patient_id = 1;
  repeated string categories = 2;
  google.protobuf.Timestamp start_time = 3;
}
```javascript

## Common Types

### common.proto

```protobuf
syntax = "proto3";

package zarishsphere.common;

import "google/protobuf/timestamp.proto";

// Common error types
message Error {
  string code = 1;
  string message = 2;
  map<string, string> details = 3;
}

// Pagination types
message PageRequest {
  int32 page = 1;
  int32 per_page = 2;
  string sort_by = 3;
  bool sort_desc = 4;
}

message PageResponse {
  int32 total_count = 1;
  int32 page = 2;
  int32 per_page = 3;
  int32 total_pages = 4;
  bool has_next = 5;
  bool has_previous = 6;
}

// Audit information
message AuditInfo {
  string created_by = 1;
  string updated_by = 2;
  google.protobuf.Timestamp created_at = 3;
  google.protobuf.Timestamp updated_at = 4;
}

// Health check
message HealthCheckResponse {
  bool healthy = 1;
  string status = 2;
  google.protobuf.Timestamp timestamp = 3;
  map<string, string> checks = 4;
}

// Configuration
message Configuration {
  map<string, string> settings = 1;
  google.protobuf.Timestamp last_updated = 2;
  string version = 3;
}
```typescript

## Streaming Types

### streaming.proto

```protobuf
syntax = "proto3";

package zarishsphere.streaming;

import "patient.proto";
import "clinical.proto";
import "observation.proto";
import "medication.proto";

// Streaming service for real-time updates
service StreamingService {
  rpc StreamPatientUpdates(StreamPatientUpdatesRequest) returns (stream PatientUpdate);
  rpc StreamObservations(StreamObservationsRequest) returns (stream Observation);
  rpc StreamEncounterUpdates(StreamEncounterUpdatesRequest) returns (stream EncounterUpdate);
  rpc StreamMedicationUpdates(StreamMedicationUpdatesRequest) returns (stream MedicationUpdate);
}

message StreamPatientUpdatesRequest {
  string patient_id = 1;
  repeated string fields = 2;
}

message PatientUpdate {
  string event_type = 1;
  Patient patient = 2;
  google.protobuf.Timestamp timestamp = 3;
}

message StreamEncounterUpdatesRequest {
  string patient_id = 1;
  repeated EncounterStatus status = 2;
}

message EncounterUpdate {
  string event_type = 1;
  Encounter encounter = 2;
  google.protobuf.Timestamp timestamp = 3;
}

message StreamMedicationUpdatesRequest {
  string patient_id = 1;
  repeated MedicationRequestStatus status = 2;
}

message MedicationUpdate {
  string event_type = 1;
  MedicationRequest medication_request = 2;
  google.protobuf.Timestamp timestamp = 3;
}
```typescript

## Authentication Types

### auth.proto

```protobuf
syntax = "proto3";

package zarishsphere.auth;

import "google/protobuf/timestamp.proto";

// Authentication service
service AuthService {
  rpc Authenticate(AuthenticateRequest) returns (AuthenticateResponse);
  rpc RefreshToken(RefreshTokenRequest) returns (RefreshTokenResponse);
  rpc ValidateToken(ValidateTokenRequest) returns (ValidateTokenResponse);
  rpc Logout(LogoutRequest) returns (LogoutResponse);
}

message AuthenticateRequest {
  string username = 1;
  string password = 2;
  string client_id = 3;
  string client_secret = 4;
}

message AuthenticateResponse {
  string access_token = 1;
  string refresh_token = 2;
  string token_type = 3;
  int32 expires_in = 4;
  google.protobuf.Timestamp issued_at = 5;
  repeated string scopes = 6;
}

message RefreshTokenRequest {
  string refresh_token = 1;
  string client_id = 2;
  string client_secret = 3;
}

message RefreshTokenResponse {
  string access_token = 1;
  string refresh_token = 2;
  int32 expires_in = 3;
}

message ValidateTokenRequest {
  string access_token = 1;
}

message ValidateTokenResponse {
  bool valid = 1;
  string user_id = 2;
  repeated string scopes = 3;
  google.protobuf.Timestamp expires_at = 4;
}

message LogoutRequest {
  string access_token = 1;
  string refresh_token = 2;
}

message LogoutResponse {
  bool success = 1;
  string message = 2;
}
```text

## Usage Examples

### Client Generation

```bash
## Generate Python client
python -m grpc_tools.protoc \
  --python_out=. \
  --grpc_python_out=. \
  --proto_path=. \
  patient.proto clinical.proto observation.proto

## Generate Go client
protoc --go_out=. --go-grpc_out=. \
  --proto_path=. \
  patient.proto clinical.proto observation.proto

## Generate Java client
protoc --java_out=. --grpc-java_out=. \
  --proto_path=. \
  patient.proto clinical.proto observation.proto
```javascript

### Python Client Example

```python
import grpc
from generated import patient_pb2, patient_pb2_grpc

## Create gRPC channel
channel = grpc.insecure_channel('localhost:50051')

## Create client stub
client = patient_pb2_grpc.PatientServiceStub(channel)

## Create patient request
request = patient_pb2.CreatePatientRequest(
    patient=patient_pb2.Patient(
        first_name="John",
        last_name="Smith",
        birth_date=patient_pb2.Date(year=1985, month=6, day=15),
        gender=patient_pb2.Gender.GENDER_MALE,
        email="john.smith@example.com"
    )
)

## Make RPC call
response = client.CreatePatient(request)
print(f"Created patient: {response.patient.id}")
```javascript

### Go Client Example

```go
package main

import (
    "context"
    "log"
    "google.golang.org/grpc"
    pb "path/to/generated/patient"
)

func main() {
    // Create gRPC connection
    conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
    if err != nil {
        log.Fatalf("Failed to connect: %v", err)
    }
    defer conn.Close()

    // Create client
    client := pb.NewPatientServiceClient(conn)

    // Create patient request
    req := &pb.CreatePatientRequest{
        Patient: &pb.Patient{
            FirstName: "John",
            LastName:  "Smith",
            Gender:    pb.Gender_GENDER_MALE,
            Email:     "john.smith@example.com",
        },
    }

    // Make RPC call
    resp, err := client.CreatePatient(context.Background(), req)
    if err != nil {
        log.Fatalf("Failed to create patient: %v", err)
    }

    log.Printf("Created patient: %s", resp.Patient.Id)
}
```text

This comprehensive protobuf reference provides the complete type system for ZARISH SPHERE's gRPC services, enabling type-safe, high-performance healthcare data management.
````
