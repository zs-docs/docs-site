# gRPC APIs Reference

Complete reference documentation for all ZARISH HIS gRPC services, including service definitions, message types, and Bangladesh-specific implementations.

## 📋 gRPC Overview

**Server Address**: `grpc.zs-his.com:443`  
**Protocol**: gRPC over HTTP/2 with TLS  
**Authentication**: JWT Token in metadata  
**API Version**: v1.0.0  

### Protocol Buffers Version
- **Proto Version**: Protocol Buffers v3
- **Go Version**: v1.21+
- **Generated Code**: Go, Python, JavaScript, Java, C#

## 🔐 Authentication

### Metadata Authentication
```go
ctx := metadata.AppendToOutgoingContext(context.Background(),
    "authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "facility-id", "facility-uuid",
    "user-id", "user-uuid")
```

### Interceptor Setup
```go
func authInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    md, ok := metadata.FromIncomingContext(ctx)
    if !ok {
        return nil, status.Error(codes.Unauthenticated, "missing metadata")
    }
    
    token := md["authorization"]
    if len(token) == 0 {
        return nil, status.Error(codes.Unauthenticated, "missing authorization token")
    }
    
    // Validate token
    claims, err := validateJWT(token[0])
    if err != nil {
        return nil, status.Error(codes.Unauthenticated, "invalid token")
    }
    
    // Add user info to context
    ctx = context.WithValue(ctx, "user", claims)
    return handler(ctx, req)
}
```

## 👥 Core Services

### Patient Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.patient.v1;

import "google/protobuf/timestamp.proto";
import "google/type/date.proto";

service PatientService {
    rpc CreatePatient(CreatePatientRequest) returns (CreatePatientResponse);
    rpc GetPatient(GetPatientRequest) returns (GetPatientResponse);
    rpc UpdatePatient(UpdatePatientRequest) returns (UpdatePatientResponse);
    rpc SearchPatients(SearchPatientsRequest) returns (SearchPatientsResponse);
    rpc ValidatePatient(ValidatePatientRequest) returns (ValidatePatientResponse);
}

message Patient {
    string id = 1;
    repeated Identifier identifiers = 2;
    repeated HumanName names = 3;
    string gender = 4;
    google.type.Date birth_date = 5;
    bool active = 6;
    repeated Address addresses = 7;
    repeated ContactPoint telecom = 8;
    google.protobuf.Timestamp created_at = 9;
    google.protobuf.Timestamp updated_at = 10;
}

message Identifier {
    string type = 1;
    string value = 2;
    string system = 3;
}

message HumanName {
    string use = 1;
    string family = 2;
    repeated string given = 3;
    repeated string prefix = 4;
    repeated string suffix = 5;
}

message Address {
    string use = 1;
    string district = 2;
    string division = 3;
    string upazila = 4;
    string postal_code = 5;
    string line = 6;
}

message ContactPoint {
    string system = 1;
    string value = 2;
    string use = 3;
}

message CreatePatientRequest {
    Patient patient = 1;
}

message CreatePatientResponse {
    Patient patient = 1;
    string message = 2;
}

message GetPatientRequest {
    string id = 1;
}

message GetPatientResponse {
    Patient patient = 1;
}

message SearchPatientsRequest {
    string query = 1;
    string gender = 2;
    string district = 3;
    string division = 4;
    int32 page = 5;
    int32 per_page = 6;
}

message SearchPatientsResponse {
    repeated Patient patients = 1;
    int32 total = 2;
    int32 page = 3;
    int32 per_page = 4;
}

message ValidatePatientRequest {
    string national_id = 1;
    string birth_date = 2;
}

message ValidatePatientResponse {
    bool valid = 1;
    Patient patient = 2;
    repeated string errors = 3;
}
```

#### Client Usage Example
```go
package main

import (
    "context"
    "log"
    
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials"
    pb "github.com/zs-his/proto/patient/v1"
)

func main() {
    // Create connection
    conn, err := grpc.Dial("grpc.zs-his.com:443",
        grpc.WithTransportCredentials(credentials.NewTLS(nil)),
        grpc.WithBlock())
    if err != nil {
        log.Fatalf("did not connect: %v", err)
    }
    defer conn.Close()
    
    client := pb.NewPatientServiceClient(conn)
    
    // Create patient
    patient := &pb.Patient{
        Names: []*pb.HumanName{
            {
                Use:    "official",
                Family: "Islam",
                Given:  []string{"Mohammad", "Rahim"},
            },
        },
        Gender: "male",
        BirthDate: &pb.Date{
            Year:  1980,
            Month: 1,
            Day:   15,
        },
        Identifiers: []*pb.Identifier{
            {
                Type:   "national_id",
                Value:  "1234567890123",
                System: "https://nid.gov.bd",
            },
        },
    }
    
    resp, err := client.CreatePatient(context.Background(), &pb.CreatePatientRequest{
        Patient: patient,
    })
    if err != nil {
        log.Fatalf("could not create patient: %v", err)
    }
    
    log.Printf("Patient created: %v", resp.Patient.Id)
}
```

### Practitioner Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.practitioner.v1;

service PractitionerService {
    rpc CreatePractitioner(CreatePractitionerRequest) returns (CreatePractitionerResponse);
    rpc GetPractitioner(GetPractitionerRequest) returns (GetPractitionerResponse);
    rpc SearchPractitioners(SearchPractitionersRequest) returns (SearchPractitionersResponse);
    rpc VerifyBMDCRegistration(VerifyBMDCRequest) returns (VerifyBMDCResponse);
}

message Practitioner {
    string id = 1;
    repeated Identifier identifiers = 2;
    repeated HumanName names = 3;
    string gender = 4;
    repeated Qualification qualifications = 5;
    repeated Specialty specialties = 6;
    bool active = 7;
    google.protobuf.Timestamp created_at = 8;
    google.protobuf.Timestamp updated_at = 9;
}

message Qualification {
    string code = 1;
    string issuer = 2;
    google.type.Date start_date = 3;
    google.type.Date end_date = 4;
}

message Specialty {
    Coding coding = 1;
}

message Coding {
    string system = 1;
    string code = 2;
    string display = 3;
}

message VerifyBMDCRequest {
    string bmdc_number = 1;
}

message VerifyBMDCResponse {
    bool valid = 1;
    Practitioner practitioner = 2;
    string registration_date = 3;
    string status = 4;
}
```

## 🏥 Clinical Services

### Observation Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.observation.v1;

service ObservationService {
    rpc CreateObservation(CreateObservationRequest) returns (CreateObservationResponse);
    rpc GetObservation(GetObservationRequest) returns (GetObservationResponse);
    rpc SearchObservations(SearchObservationsRequest) returns (SearchObservationsResponse);
    rpc BatchCreateObservations(BatchCreateObservationsRequest) returns (BatchCreateObservationsResponse);
}

message Observation {
    string id = 1;
    string patient_id = 2;
    string encounter_id = 3;
    string practitioner_id = 4;
    repeated Category categories = 5;
    CodeableConcept code = 6;
    Quantity value_quantity = 7;
    oneof effective {
        google.protobuf.Timestamp effective_date_time = 8;
        google.type.Date effective_date = 9;
    }
    string status = 10;
    google.protobuf.Timestamp created_at = 11;
}

message Category {
    Coding coding = 1;
}

message CodeableConcept {
    repeated Coding coding = 1;
    string text = 2;
}

message Quantity {
    double value = 1;
    string unit = 2;
    string system = 3;
    string code = 4;
}

message BatchCreateObservationsRequest {
    repeated Observation observations = 1;
}

message BatchCreateObservationsResponse {
    repeated Observation observations = 1;
    repeated string errors = 2;
}
```

#### Streaming Vital Signs
```protobuf
service VitalSignsService {
    rpc StreamVitalSigns(StreamVitalSignsRequest) returns (stream VitalSignsUpdate);
    rpc SubscribePatientVitals(SubscribePatientVitalsRequest) returns (stream VitalSignsUpdate);
}

message StreamVitalSignsRequest {
    string patient_id = 1;
    string device_id = 2;
}

message VitalSignsUpdate {
    string patient_id = 1;
    string device_id = 2;
    Observation heart_rate = 3;
    Observation blood_pressure = 4;
    Observation oxygen_saturation = 5;
    Observation temperature = 6;
    google.protobuf.Timestamp timestamp = 7;
}
```

### Medication Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.medication.v1;

service MedicationService {
    rpc CreateMedicationRequest(CreateMedicationRequest) returns (CreateMedicationRequestResponse);
    rpc GetMedicationRequest(GetMedicationRequestRequest) returns (GetMedicationRequestResponse);
    rpc UpdateMedicationRequest(UpdateMedicationRequest) returns (UpdateMedicationRequestResponse);
    rpc CheckDrugInteractions(CheckDrugInteractionsRequest) returns (CheckDrugInteractionsResponse);
}

message MedicationRequest {
    string id = 1;
    string patient_id = 2;
    string encounter_id = 3;
    string requester_id = 4;
    CodeableConcept medication = 5;
    repeated DosageInstruction dosage_instruction = 6;
    string status = 7;
    google.protobuf.Timestamp created_at = 8;
}

message DosageInstruction {
    string text = 1;
    Timing timing = 2;
    CodeableConcept route = 3;
    Quantity dose_and_rate = 4;
}

message Timing {
    Repeat repeat = 1;
    string code = 2;
}

message Repeat {
    int32 frequency = 1;
    int32 period = 2;
    string period_unit = 3;
}

message CheckDrugInteractionsRequest {
    repeated string medication_codes = 1;
    string patient_id = 2;
}

message CheckDrugInteractionsResponse {
    repeated DrugInteraction interactions = 1;
    bool safe = 2;
}

message DrugInteraction {
    string medication_1 = 1;
    string medication_2 = 2;
    string severity = 3;
    string description = 4;
}
```

## 🧪 Ancillary Services

### Laboratory Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.laboratory.v1;

service LaboratoryService {
    rpc CreateLabOrder(CreateLabOrderRequest) returns (CreateLabOrderResponse);
    rpc AddLabResult(AddLabResultRequest) returns (AddLabResultResponse);
    rpc GetLabOrder(GetLabOrderRequest) returns (GetLabOrderResponse);
    rpc SubscribeLabUpdates(SubscribeLabUpdatesRequest) returns (stream LabUpdate);
}

message LabOrder {
    string id = 1;
    string patient_id = 2;
    string encounter_id = 3;
    string requester_id = 4;
    repeated Specimen specimens = 5;
    repeated ServiceRequest service_requests = 6;
    string status = 7;
    google.protobuf.Timestamp created_at = 8;
}

message Specimen {
    string id = 1;
    CodeableConcept type = 2;
    Collection collection = 3;
}

message Collection {
    google.protobuf.Timestamp collected_date_time = 1;
    string collector_id = 2;
    string method = 3;
}

message ServiceRequest {
    string id = 1;
    CodeableConcept code = 2;
    int32 quantity = 3;
    string status = 4;
}

message LabResult {
    string id = 1;
    string order_id = 2;
    string patient_id = 3;
    string performer_id = 4;
    repeated TestResult results = 5;
    google.protobuf.Timestamp reported_at = 6;
}

message TestResult {
    string test_code = 1;
    string test_name = 2;
    double value = 3;
    string unit = 4;
    string reference_range = 5;
    string status = 6;
    string abnormal_flag = 7;
}

message LabUpdate {
    string order_id = 1;
    string status = 2;
    LabResult result = 3;
    google.protobuf.Timestamp timestamp = 4;
}
```

### Radiology Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.radiology.v1;

service RadiologyService {
    rpc CreateRadiologyOrder(CreateRadiologyOrderRequest) returns (CreateRadiologyOrderResponse);
    rpc UploadDicomImage(UploadDicomImageRequest) returns (UploadDicomImageResponse);
    rpc GetRadiologyReport(GetRadiologyReportRequest) returns (GetRadiologyReportResponse);
    rpc StreamDicomImages(StreamDicomImagesRequest) returns (stream DicomImageChunk);
}

message RadiologyOrder {
    string id = 1;
    string patient_id = 2;
    string encounter_id = 3;
    string requester_id = 4;
    CodeableConcept procedure_code = 5;
    repeated CodeableConcept reason_code = 6;
    string priority = 7;
    string status = 8;
    google.protobuf.Timestamp created_at = 9;
}

message DicomImage {
    string id = 1;
    string order_id = 2;
    string patient_id = 3;
    string study_instance_uid = 4;
    string series_instance_uid = 5;
    string sop_instance_uid = 6;
    bytes image_data = 7;
    map<string, string> metadata = 8;
}

message UploadDicomImageRequest {
    string order_id = 1;
    DicomImage image = 2;
}

message StreamDicomImagesRequest {
    string study_instance_uid = 1;
    string series_instance_uid = 2;
}

message DicomImageChunk {
    bytes data = 1;
    int32 chunk_number = 2;
    bool is_last = 3;
}
```

## 💼 Administrative Services

### Billing Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.billing.v1;

service BillingService {
    rpc CreateInvoice(CreateInvoiceRequest) returns (CreateInvoiceResponse);
    rpc ProcessPayment(ProcessPaymentRequest) returns (ProcessPaymentResponse);
    rpc GetInvoice(GetInvoiceRequest) returns (GetInvoiceResponse);
    rpc CalculateInsuranceClaim(CalculateInsuranceClaimRequest) returns (CalculateInsuranceClaimResponse);
}

message Invoice {
    string id = 1;
    string patient_id = 2;
    string encounter_id = 3;
    repeated InvoiceItem items = 4;
    double total_amount = 5;
    string currency = 6;
    string payment_status = 7;
    google.protobuf.Timestamp created_at = 8;
}

message InvoiceItem {
    string service_code = 1;
    string service_name = 2;
    int32 quantity = 3;
    double unit_price = 4;
    double total = 5;
    double tax_rate = 6;
    double tax_amount = 7;
}

message Payment {
    string id = 1;
    string invoice_id = 2;
    double amount = 3;
    string method = 4;
    string transaction_id = 5;
    string status = 6;
    google.protobuf.Timestamp processed_at = 7;
}

message InsuranceClaim {
    string id = 1;
    string invoice_id = 2;
    string insurance_provider = 3;
    double claim_amount = 4;
    double approved_amount = 5;
    string status = 6;
    google.protobuf.Timestamp submitted_at = 7;
}
```

## 🔧 Infrastructure Services

### Notification Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.notification.v1;

service NotificationService {
    rpc SendNotification(SendNotificationRequest) returns (SendNotificationResponse);
    rpc SubscribeNotifications(SubscribeNotificationsRequest) returns (stream Notification);
    rpc GetNotificationHistory(GetNotificationHistoryRequest) returns (GetNotificationHistoryResponse);
}

message Notification {
    string id = 1;
    string recipient_id = 2;
    string type = 3;
    repeated string channels = 4;
    string subject = 5;
    string message = 6;
    string status = 7;
    google.protobuf.Timestamp created_at = 8;
    google.protobuf.Timestamp sent_at = 9;
}

message SendNotificationRequest {
    string recipient_id = 1;
    string type = 2;
    repeated string channels = 3;
    string subject = 4;
    string message = 5;
    google.protobuf.Timestamp scheduled_for = 6;
}

message SubscribeNotificationsRequest {
    string user_id = 1;
    repeated string notification_types = 2;
}
```

### Audit Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.audit.v1;

service AuditService {
    rpc LogAuditEvent(LogAuditEventRequest) returns (LogAuditEventResponse);
    rpc SearchAuditLogs(SearchAuditLogsRequest) returns (SearchAuditLogsResponse);
    rpc StreamAuditLogs(StreamAuditLogsRequest) returns (stream AuditEvent);
}

message AuditEvent {
    string id = 1;
    string user_id = 2;
    string action = 3;
    string resource_type = 4;
    string resource_id = 5;
    string ip_address = 6;
    string user_agent = 7;
    map<string, string> details = 8;
    google.protobuf.Timestamp timestamp = 9;
}

message LogAuditEventRequest {
    string action = 1;
    string resource_type = 2;
    string resource_id = 3;
    map<string, string> details = 4;
}

message StreamAuditLogsRequest {
    string user_id = 1;
    string resource_type = 2;
    google.protobuf.Timestamp from_time = 3;
}
```

## 🇧🇩 Bangladesh-Specific Services

### DGHS Integration Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.dghs.v1;

service DGHSIntegrationService {
    rpc SubmitDiseaseReport(SubmitDiseaseReportRequest) returns (SubmitDiseaseReportResponse);
    rpc GetFacilityStatistics(GetFacilityStatisticsRequest) returns (GetFacilityStatisticsResponse);
    rpc SyncPatientData(SyncPatientDataRequest) returns (SyncPatientDataResponse);
}

message DiseaseReport {
    string facility_id = 1;
    string disease_code = 2;
    string disease_name = 3;
    int32 cases = 4;
    int32 deaths = 5;
    DateRange reporting_period = 6;
    google.protobuf.Timestamp submitted_at = 7;
}

message DateRange {
    google.type.Date start = 1;
    google.type.Date end = 2;
}

message FacilityStatistics {
    string facility_id = 1;
    google.type.Date date = 2;
    int32 outpatient_visits = 3;
    int32 admissions = 4;
    int32 discharges = 5;
    int32 deaths = 6;
    int32 births = 7;
}
```

### BMDC Verification Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.bmdc.v1;

service BMDCVerificationService {
    rpc VerifyPractitioner(VerifyPractitionerRequest) returns (VerifyPractitionerResponse);
    rpc GetPractitionerDetails(GetPractitionerDetailsRequest) returns (GetPractitionerDetailsResponse);
    rpc CheckLicenseStatus(CheckLicenseStatusRequest) returns (CheckLicenseStatusResponse);
}

message BMDCRegistration {
    string registration_number = 1;
    string practitioner_name = 2;
    string date_of_birth = 3;
    string gender = 4;
    string medical_college = 5;
    string year_of_graduation = 6;
    string specialty = 7;
    string registration_date = 8;
    string status = 9;
    google.protobuf.Timestamp last_verified = 10;
}
```

## 📊 Performance and Monitoring

### Health Check Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.health.v1;

service HealthCheckService {
    rpc CheckHealth(CheckHealthRequest) returns (CheckHealthResponse);
    rpc WatchHealth(WatchHealthRequest) returns (stream HealthUpdate);
}

message HealthCheckResponse {
    string service_name = 1;
    string status = 2;
    map<string, string> details = 3;
    google.protobuf.Timestamp timestamp = 4;
}

message HealthUpdate {
    string service_name = 1;
    string status = 2;
    google.protobuf.Timestamp timestamp = 3;
}
```

### Metrics Service

#### Service Definition
```protobuf
syntax = "proto3";

package zarish.metrics.v1;

service MetricsService {
    rpc GetServiceMetrics(GetServiceMetricsRequest) returns (GetServiceMetricsResponse);
    rpc StreamMetrics(StreamMetricsRequest) returns (stream MetricUpdate);
}

message ServiceMetrics {
    string service_name = 1;
    int64 request_count = 2;
    double average_response_time = 3;
    double success_rate = 4;
    double error_rate = 5;
    int32 active_connections = 6;
    google.protobuf.Timestamp timestamp = 7;
}

message MetricUpdate {
    string metric_name = 1;
    double value = 2;
    map<string, string> labels = 3;
    google.protobuf.Timestamp timestamp = 4;
}
```

## 🚀 Client Libraries

### Go Client
```go
package main

import (
    "context"
    "log"
    
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials"
    pb "github.com/zs-his/proto/patient/v1"
)

func main() {
    // Create connection with TLS
    conn, err := grpc.Dial("grpc.zs-his.com:443",
        grpc.WithTransportCredentials(credentials.NewTLS(nil)),
        grpc.WithBlock())
    if err != nil {
        log.Fatalf("did not connect: %v", err)
    }
    defer conn.Close()
    
    // Create clients
    patientClient := pb.NewPatientServiceClient(conn)
    labClient := pb.NewLaboratoryServiceClient(conn)
    
    // Use services
    patient, err := patientClient.GetPatient(context.Background(), &pb.GetPatientRequest{
        Id: "patient-uuid",
    })
    
    if err != nil {
        log.Fatalf("could not get patient: %v", err)
    }
    
    log.Printf("Patient: %v", patient.Patient.Names[0].Family)
}
```

### Python Client
```python
import grpc
from grpc import ssl_channel_credentials
from zarish.proto.patient.v1 import patient_service_pb2, patient_service_pb2_grpc

def main():
    # Create secure channel
    credentials = ssl_channel_credentials()
    channel = grpc.secure_channel('grpc.zs-his.com:443', credentials)
    
    # Create stub
    stub = patient_service_pb2_grpc.PatientServiceStub(channel)
    
    # Create patient
    patient = patient_service_pb2.Patient(
        names=[
            patient_service_pb2.HumanName(
                use="official",
                family="Islam",
                given=["Mohammad", "Rahim"]
            )
        ],
        gender="male"
    )
    
    request = patient_service_pb2.CreatePatientRequest(patient=patient)
    response = stub.CreatePatient(request)
    
    print(f"Created patient: {response.patient.id}")

if __name__ == '__main__':
    main()
```

### JavaScript Client
```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto file
const packageDefinition = protoLoader.loadSync('patient.proto');
const patientProto = grpc.loadPackageDefinition(packageDefinition).zarish.patient.v1;

// Create client
const client = new patientProto.PatientService(
    'grpc.zs-his.com:443',
    grpc.credentials.createSsl()
);

// Create patient
const patient = {
    names: [{
        use: 'official',
        family: 'Islam',
        given: ['Mohammad', 'Rahim']
    }],
    gender: 'male'
};

client.createPatient({ patient: patient }, (error, response) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Created patient:', response.patient.id);
});
```

## 🔧 Configuration

### Server Configuration
```yaml
server:
  port: 50051
  host: 0.0.0.0
  tls:
    enabled: true
    cert_file: /path/to/cert.pem
    key_file: /path/to/key.pem

auth:
  jwt_secret: "your-secret-key"
  token_expiry: 3600

database:
  host: localhost
  port: 5432
  name: zarish_his
  user: postgres
  password: password

logging:
  level: info
  format: json
  output: stdout

metrics:
  enabled: true
  port: 9090
  path: /metrics
```

### Client Configuration
```go
type Config struct {
    ServerAddress string `yaml:"server_address"`
    TLSCertFile   string `yaml:"tls_cert_file"`
    APIKey        string `yaml:"api_key"`
    Timeout       time.Duration `yaml:"timeout"`
    RetryCount    int           `yaml:"retry_count"`
}
```

---

*Last updated: 2026-01-21*
