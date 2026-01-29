# Data Flows

Comprehensive data flow documentation for ZARISH HIS, including real-time streams, batch processing, data transformation, and Bangladesh healthcare system integration patterns.

## 📋 Data Flow Overview

```mermaid
graph TB
    subgraph "Data Sources"
        USER_INPUT[User Input]
        EXTERNAL_SYSTEMS[External Systems]
        IOT_DEVICES[IoT Devices]
        BATCH_IMPORTS[Batch Imports]
        MOBILE_APPS[Mobile Apps]
    end
    
    subgraph "Data Ingestion"
        API_GATEWAY[API Gateway]
        WEBHOOK_RECEIVER[Webhook Receiver]
        FILE_INGESTION[File Ingestion]
        STREAM_PROCESSOR[Stream Processor]
    end
    
    subgraph "Data Processing"
        VALIDATION_ENGINE[Validation Engine]
        TRANSFORMATION_ENGINE[Transformation Engine]
        ENRICHMENT_SERVICE[Enrichment Service]
        ROUTING_ENGINE[Routing Engine]
    end
    
    subgraph "Data Storage"
        HOT_STORAGE[(Hot Storage)]
        COLD_STORAGE[(Cold Storage)]
        DATA_LAKE[(Data Lake)]
        SEARCH_INDEX[(Search Index)]
    end
    
    subgraph "Data Consumers"
        REAL_TIME_APPS[Real-time Apps]
        ANALYTICS[Analytics]
        REPORTING[Reporting]
        ML_MODELS[ML Models]
        EXTERNAL_APIS[External APIs]
    end
    
    USER_INPUT --> API_GATEWAY
    EXTERNAL_SYSTEMS --> WEBHOOK_RECEIVER
    IOT_DEVICES --> STREAM_PROCESSOR
    BATCH_IMPORTS --> FILE_INGESTION
    MOBILE_APPS --> API_GATEWAY
    
    API_GATEWAY --> VALIDATION_ENGINE
    WEBHOOK_RECEIVER --> VALIDATION_ENGINE
    FILE_INGESTION --> TRANSFORMATION_ENGINE
    STREAM_PROCESSOR --> VALIDATION_ENGINE
    
    VALIDATION_ENGINE --> TRANSFORMATION_ENGINE
    TRANSFORMATION_ENGINE --> ENRICHMENT_SERVICE
    ENRICHMENT_SERVICE --> ROUTING_ENGINE
    
    ROUTING_ENGINE --> HOT_STORAGE
    ROUTING_ENGINE --> DATA_LAKE
    ROUTING_ENGINE --> SEARCH_INDEX
    
    HOT_STORAGE --> COLD_STORAGE
    
    HOT_STORAGE --> REAL_TIME_APPS
    DATA_LAKE --> ANALYTICS
    DATA_LAKE --> REPORTING
    DATA_LAKE --> ML_MODELS
    SEARCH_INDEX --> EXTERNAL_APIS
```

## 🔄 Real-Time Data Flows

### Patient Registration Flow

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend App
    participant API as API Gateway
    participant Auth as Auth Service
    participant Patient as Patient Service
    participant Integration as Integration Hub
    participant NID as NID System
    participant Audit as Audit Service
    participant Notification as Notification Service
    participant Database as Database
    
    User->>Frontend: Submit Registration
    Frontend->>API: POST /api/v1/patients
    API->>Auth: Validate Token
    Auth-->>API: Token Valid
    
    API->>Patient: Create Patient Request
    Patient->>Integration: Verify NID
    Integration->>NID: Validate NID
    NID-->>Integration: NID Valid
    Integration-->>Patient: Verification Complete
    
    Patient->>Patient: Validate Patient Data
    Patient->>Database: Save Patient
    Database-->>Patient: Patient Saved
    
    Patient->>Audit: Log Patient Creation
    Patient->>Notification: Send Welcome Notification
    
    Patient-->>API: Patient Created
    API-->>Frontend: Response
    Frontend-->>User: Registration Complete
```

### Clinical Encounter Flow

```mermaid
sequenceDiagram
    participant Doctor as Doctor
    participant Frontend as Clinical App
    participant API as API Gateway
    participant Encounter as Encounter Service
    participant Patient as Patient Service
    participant Observation as Observation Service
    participant Condition as Condition Service
    participant Medication as Medication Service
    participant Audit as Audit Service
    participant Notification as Notification Service
    
    Doctor->>Frontend: Start Encounter
    Frontend->>API: POST /api/v1/encounters
    API->>Encounter: Create Encounter
    Encounter->>Patient: Validate Patient
    Patient-->>Encounter: Patient Valid
    
    Encounter->>Audit: Log Encounter Start
    Encounter-->>API: Encounter Created
    
    Doctor->>Frontend: Add Vitals
    Frontend->>API: POST /api/v1/observations
    API->>Observation: Create Observation
    Observation->>Encounter: Validate Encounter
    Encounter-->>Observation: Encounter Valid
    
    Observation->>Audit: Log Observation Creation
    Observation-->>API: Observation Created
    
    Doctor->>Frontend: Add Diagnosis
    Frontend->>API: POST /api/v1/conditions
    API->>Condition: Create Condition
    Condition->>Encounter: Validate Encounter
    Condition->>Patient: Validate Patient
    Condition->>Audit: Log Condition Creation
    Condition-->>API: Condition Created
    
    Doctor->>Frontend: Prescribe Medication
    Frontend->>API: POST /api/v1/medication-requests
    API->>Medication: Create Medication Request
    Medication->>Encounter: Validate Encounter
    Medication->>Patient: Validate Patient
    Medication->>Notification: Send Medication Reminder
    Medication->>Audit: Log Medication Creation
    Medication-->>API: Medication Created
```

### Laboratory Order Flow

```mermaid
sequenceDiagram
    participant Doctor as Doctor
    participant LabTech as Lab Technician
    participant Frontend as Clinical App
    participant API as API Gateway
    participant Lab as Laboratory Service
    participant Patient as Patient Service
    participant Encounter as Encounter Service
    participant ExternalLab as External Lab
    participant Notification as Notification Service
    participant Audit as Audit Service
    
    Doctor->>Frontend: Order Lab Test
    Frontend->>API: POST /api/v1/laboratory/orders
    API->>Lab: Create Lab Order
    Lab->>Patient: Validate Patient
    Lab->>Encounter: Validate Encounter
    Lab->>Audit: Lab Order Created
    Lab->>Notification: Send Order Confirmation
    Lab-->>API: Lab Order Created
    
    LabTech->>Frontend: Process Sample
    Frontend->>API: POST /api/v1/laboratory/specimens
    API->>Lab: Create Specimen
    Lab->>ExternalLab: Send Sample
    ExternalLab-->>Lab: Sample Received
    
    ExternalLab->>Lab: Lab Results
    Lab->>Lab: Process Results
    Lab->>Notification: Send Results Notification
    Lab->>Audit: Log Results Received
    Lab-->>API: Results Processed
```

## 📊 Batch Data Flows

### Daily DGHS Reporting Flow

```mermaid
sequenceDiagram
    participant Scheduler as Scheduler
    participant Report as Report Service
    participant Patient as Patient Service
    participant Encounter as Encounter Service
    participant Observation as Observation Service
    participant Integration as Integration Hub
    participant DGHS as DGHS System
    participant Audit as Audit Service
    
    Scheduler->>Report: Trigger Daily Report
    Report->>Patient: Get Patient Statistics
    Patient-->>Report: Patient Data
    
    Report->>Encounter: Get Encounter Statistics
    Encounter-->>Report: Encounter Data
    
    Report->>Observation: Get Observation Statistics
    Observation-->>Report: Observation Data
    
    Report->>Report: Generate DGHS Report
    Report->>Integration: Submit DGHS Report
    Integration->>DGHS: Send Report Data
    DGHS-->>Integration: Report Accepted
    
    Integration-->>Report: Report Submitted
    Report->>Audit: Log Report Submission
```

### Insurance Claims Processing Flow

```mermaid
sequenceDiagram
    participant Scheduler as Scheduler
    participant Billing as Billing Service
    participant Patient as Patient Service
    participant Encounter as Encounter Service
    participant Insurance as Insurance Company
    participant Integration as Integration Hub
    participant Notification as Notification Service
    participant Audit as Audit Service
    
    Scheduler->>Billing: Process Claims
    Billing->>Patient: Get Patient Insurance Info
    Patient-->>Billing: Insurance Data
    
    Billing->>Encounter: Get Encounter Data
    Encounter-->>Billing: Encounter Data
    
    Billing->>Billing: Generate Claims
    Billing->>Integration: Submit Claims
    Integration->>Insurance: Send Claims Data
    Insurance-->>Integration: Claim Response
    
    Integration-->>Billing: Claim Processed
    Billing->>Notification: Send Claim Status
    Billing->>Audit: Log Claim Processing
```

## 🌐 Bangladesh Integration Data Flows

### NID Verification Flow

```mermaid
sequenceDiagram
    participant Patient as Patient
    participant Frontend as Frontend App
    participant API as API Gateway
    participant PatientService as Patient Service
    participant Integration as Integration Hub
    participant NID as NID System
    participant Cache as Redis Cache
    
    Patient->>Frontend: Enter NID
    Frontend->>API: Validate NID
    API->>PatientService: Verify NID
    PatientService->>Cache: Check NID Cache
    alt NID in Cache
        Cache-->>PatientService: Cached NID Data
    else NID not in Cache
        PatientService->>Integration: Verify NID
        Integration->>NID: Validate NID
        NID-->>Integration: NID Data
        Integration-->>PatientService: Verification Result
        PatientService->>Cache: Cache NID Data
    end
    
    PatientService-->>API: Validation Result
    API-->>Frontend: Response
    Frontend-->>Patient: NID Status
```

### BMDC Registration Verification Flow

```mermaid
sequenceDiagram
    participant Practitioner as Practitioner
    participant Frontend as Frontend App
    participant API as API Gateway
    participant PractitionerService as Practitioner Service
    participant Integration as Integration Hub
    participant BMDC as BMDC System
    participant Cache as Redis Cache
    
    Practitioner->>Frontend: Enter BMDC Number
    Frontend->>API: Verify BMDC
    API->>PractitionerService: Check BMDC Registration
    PractitionerService->>Cache: Check BMDC Cache
    alt BMDC in Cache
        Cache-->>PractitionerService: Cached BMDC Data
    else BMDC not in Cache
        PractitionerService->>Integration: Verify BMDC
        Integration->>BMDC: Validate Registration
        BMDC-->>Integration: BMDC Data
        Integration-->>PractitionerService: Verification Result
        PractitionerService->>Cache: Cache BMDC Data
    end
    
    PractitionerService-->>API: Verification Result
    API-->>Frontend: Response
    Frontend-->>Practitioner: BMDC Status
```

### DGHS Disease Reporting Flow

```mermaid
sequenceDiagram
    participant Hospital as Hospital
    participant Frontend as Clinical App
    participant API as API Gateway
    participant DiseaseService as Disease Service
    participant Integration as Integration Hub
    participant DGHS as DGHS System
    participant Audit as Audit Service
    
    Hospital->>Frontend: Report Disease Case
    Frontend->>API: Submit Disease Report
    API->>DiseaseService: Process Disease Report
    DiseaseService->>DiseaseService: Validate Report Data
    DiseaseService->>Integration: Send to DGHS
    Integration->>DGHS: Submit Disease Data
    DGHS-->>Integration: Report Accepted
    Integration-->>DiseaseService: Submission Complete
    DiseaseService->>Audit: Log Disease Report
    DiseaseService-->>API: Report Processed
    API-->>Frontend: Response
    Frontend-->>Hospital: Report Confirmed
```

## 🔄 Event-Driven Data Flows

### Patient Event Stream

```mermaid
graph TB
    subgraph "Patient Events"
        PATIENT_CREATED[Patient Created]
        PATIENT_UPDATED[Patient Updated]
        PATIENT_MERGED[Patient Merged]
        PATIENT_DECEASED[Patient Deceased]
    end
    
    subgraph "Event Processing"
        EVENT_BUS[Event Bus - Kafka]
        PATIENT_PROCESSOR[Patient Event Processor]
        NOTIFICATION_PROCESSOR[Notification Processor]
        AUDIT_PROCESSOR[Audit Processor]
        REPORTING_PROCESSOR[Reporting Processor]
    end
    
    subgraph "Event Consumers"
        SEARCH_INDEX[Search Index Update]
        ANALYTICS_DB[Analytics Database]
        NOTIFICATION_SERVICE[Notification Service]
        AUDIT_SERVICE[Audit Service]
        REPORTING_SERVICE[Reporting Service]
    end
    
    PATIENT_CREATED --> EVENT_BUS
    PATIENT_UPDATED --> EVENT_BUS
    PATIENT_MERGED --> EVENT_BUS
    PATIENT_DECEASED --> EVENT_BUS
    
    EVENT_BUS --> PATIENT_PROCESSOR
    EVENT_BUS --> NOTIFICATION_PROCESSOR
    EVENT_BUS --> AUDIT_PROCESSOR
    EVENT_BUS --> REPORTING_PROCESSOR
    
    PATIENT_PROCESSOR --> SEARCH_INDEX
    PATIENT_PROCESSOR --> ANALYTICS_DB
    
    NOTIFICATION_PROCESSOR --> NOTIFICATION_SERVICE
    AUDIT_PROCESSOR --> AUDIT_SERVICE
    REPORTING_PROCESSOR --> REPORTING_SERVICE
```

### Clinical Event Stream

```mermaid
graph TB
    subgraph "Clinical Events"
        ENCOUNTER_STARTED[Encounter Started]
        ENCOUNTER_FINISHED[Encounter Finished]
        OBSERVATION_RECORDED[Observation Recorded]
        CONDITION_DIAGNOSED[Condition Diagnosed]
        MEDICATION_PRESCRIBED[Medication Prescribed]
    end
    
    subgraph "Event Processing"
        CLINICAL_EVENT_BUS[Clinical Event Bus]
        CLINICAL_PROCESSOR[Clinical Event Processor]
        CARE_COORDINATOR[Care Coordinator]
        ALERT_MANAGER[Alert Manager]
    end
    
    subgraph "Event Consumers"
        CLINICAL_DECISION[Clinical Decision Support]
        CARE_PLANNING[Care Planning]
        PATIENT_MONITORING[Patient Monitoring]
        EMERGENCY_ALERTS[Emergency Alerts]
    end
    
    ENCOUNTER_STARTED --> CLINICAL_EVENT_BUS
    ENCOUNTER_FINISHED --> CLINICAL_EVENT_BUS
    OBSERVATION_RECORDED --> CLINICAL_EVENT_BUS
    CONDITION_DIAGNOSED --> CLINICAL_EVENT_BUS
    MEDICATION_PRESCRIBED --> CLINICAL_EVENT_BUS
    
    CLINICAL_EVENT_BUS --> CLINICAL_PROCESSOR
    CLINICAL_EVENT_BUS --> CARE_COORDINATOR
    CLINICAL_EVENT_BUS --> ALERT_MANAGER
    
    CLINICAL_PROCESSOR --> CLINICAL_DECISION
    CARE_COORDINATOR --> CARE_PLANNING
    ALERT_MANAGER --> PATIENT_MONITORING
    ALERT_MANAGER --> EMERGENCY_ALERTS
```

## 📈 Data Transformation Flows

### FHIR Data Transformation

```mermaid
graph LR
    subgraph "Source Data"
        INTERNAL_DB[(Internal Database)]
        HL7_MESSAGES[HL7 Messages]
        DICOM_FILES[DICOM Files]
        CSV_IMPORTS[CSV Imports]
    end
    
    subgraph "Transformation Engine"
        DATA_PARSER[Data Parser]
        FHIR_MAPPER[FHIR Mapper]
        VALIDATOR[FHIR Validator]
        ENRICHER[Data Enricher]
    end
    
    subgraph "FHIR Resources"
        PATIENT_FHIR[Patient FHIR]
        ENCOUNTER_FHIR[Encounter FHIR]
        OBSERVATION_FHIR[Observation FHIR]
        DIAGNOSTIC_FHIR[DiagnosticReport FHIR]
    end
    
    subgraph "FHIR Store"
        FHIR_SERVER[FHIR Server]
        FHIR_CACHE[(FHIR Cache)]
        SEARCH_INDEX[(Search Index)]
    end
    
    INTERNAL_DB --> DATA_PARSER
    HL7_MESSAGES --> DATA_PARSER
    DICOM_FILES --> DATA_PARSER
    CSV_IMPORTS --> DATA_PARSER
    
    DATA_PARSER --> FHIR_MAPPER
    FHIR_MAPPER --> VALIDATOR
    VALIDATOR --> ENRICHER
    
    ENRICHER --> PATIENT_FHIR
    ENRICHER --> ENCOUNTER_FHIR
    ENRICHER --> OBSERVATION_FHIR
    ENRICHER --> DIAGNOSTIC_FHIR
    
    PATIENT_FHIR --> FHIR_SERVER
    ENCOUNTER_FHIR --> FHIR_SERVER
    OBSERVATION_FHIR --> FHIR_SERVER
    DIAGNOSTIC_FHIR --> FHIR_SERVER
    
    FHIR_SERVER --> FHIR_CACHE
    FHIR_SERVER --> SEARCH_INDEX
```

### Bangladesh Standards Transformation

```mermaid
graph LR
    subgraph "Bangladesh Standards"
        DGHS_FORMAT[DGHS Format]
        DGDA_FORMAT[DGDA Format]
        BMDC_FORMAT[BMDC Format]
        NID_FORMAT[NID Format]
    end
    
    subgraph "Transformation Layer"
        STANDARD_PARSER[Standard Parser]
        FIELD_MAPPER[Field Mapper]
        CODE_TRANSLATOR[Code Translator]
        FORMAT_CONVERTER[Format Converter]
    end
    
    subgraph "Internal Format"
        ZARISH_STANDARD[ZARISH Standard]
        FHIR_R5[FHIR R5]
        HL7_V2[HL7 v2]
        JSON_SCHEMA[JSON Schema]
    end
    
    DGHS_FORMAT --> STANDARD_PARSER
    DGDA_FORMAT --> STANDARD_PARSER
    BMDC_FORMAT --> STANDARD_PARSER
    NID_FORMAT --> STANDARD_PARSER
    
    STANDARD_PARSER --> FIELD_MAPPER
    FIELD_MAPPER --> CODE_TRANSLATOR
    CODE_TRANSLATOR --> FORMAT_CONVERTER
    
    FORMAT_CONVERTER --> ZARISH_STANDARD
    FORMAT_CONVERTER --> FHIR_R5
    FORMAT_CONVERTER --> HL7_V2
    FORMAT_CONVERTER --> JSON_SCHEMA
```

## 🔍 Data Quality Flows

### Data Validation Pipeline

```mermaid
graph TB
    subgraph "Data Input"
        RAW_DATA[Raw Data]
        EXTERNAL_API[External API]
        USER_INPUT[User Input]
    end
    
    subgraph "Validation Stages"
        SCHEMA_VALIDATION[Schema Validation]
        BUSINESS_RULES[Business Rules]
        DATA_PROFILING[Data Profiling]
        DUPLICATE_DETECTION[Duplicate Detection]
    end
    
    subgraph "Quality Processing"
        DATA_CLEANING[Data Cleaning]
        DATA_ENRICHMENT[Data Enrichment]
        ERROR_HANDLING[Error Handling]
        APPROVAL_WORKFLOW[Approval Workflow]
    end
    
    subgraph "Data Output"
        CLEAN_DATA[Clean Data]
        ERROR_LOGS[Error Logs]
        QUALITY_REPORTS[Quality Reports]
        APPROVED_DATA[Approved Data]
    end
    
    RAW_DATA --> SCHEMA_VALIDATION
    EXTERNAL_API --> SCHEMA_VALIDATION
    USER_INPUT --> SCHEMA_VALIDATION
    
    SCHEMA_VALIDATION --> BUSINESS_RULES
    BUSINESS_RULES --> DATA_PROFILING
    DATA_PROFILING --> DUPLICATE_DETECTION
    
    DUPLICATE_DETECTION --> DATA_CLEANING
    DUPLICATE_DETECTION --> ERROR_HANDLING
    
    DATA_CLEANING --> DATA_ENRICHMENT
    DATA_ENRICHMENT --> APPROVAL_WORKFLOW
    
    DATA_CLEANING --> CLEAN_DATA
    ERROR_HANDLING --> ERROR_LOGS
    DATA_PROFILING --> QUALITY_REPORTS
    APPROVAL_WORKFLOW --> APPROVED_DATA
```

## 📊 Analytics Data Flows

### Real-Time Analytics Pipeline

```mermaid
graph TB
    subgraph "Data Sources"
        CLINICAL_EVENTS[Clinical Events]
        PATIENT_EVENTS[Patient Events]
        BILLING_EVENTS[Billing Events]
        OPERATIONAL_EVENTS[Operational Events]
    end
    
    subgraph "Stream Processing"
        KAFKA[Apache Kafka]
        STREAM_PROCESSOR[Stream Processor]
        WINDOWING[Time Windowing]
        AGGREGATION[Real-time Aggregation]
    end
    
    subgraph "Analytics Storage"
        TIMESERIES_DB[(Time Series DB)]
        ANALYTICS_CACHE[(Analytics Cache)]
        REAL_TIME_DASHBOARD[Real-time Dashboard]
    end
    
    subgraph "Analytics Consumers"
        KPI_CALCULATOR[KPI Calculator]
        ALERT_ENGINE[Alert Engine]
        ML_FEATURES[ML Features]
    end
    
    CLINICAL_EVENTS --> KAFKA
    PATIENT_EVENTS --> KAFKA
    BILLING_EVENTS --> KAFKA
    OPERATIONAL_EVENTS --> KAFKA
    
    KAFKA --> STREAM_PROCESSOR
    STREAM_PROCESSOR --> WINDOWING
    WINDOWING --> AGGREGATION
    
    AGGREGATION --> TIMESERIES_DB
    AGGREGATION --> ANALYTICS_CACHE
    AGGREGATION --> REAL_TIME_DASHBOARD
    
    TIMESERIES_DB --> KPI_CALCULATOR
    ANALYTICS_CACHE --> ALERT_ENGINE
    REAL_TIME_DASHBOARD --> ML_FEATURES
```

### Batch Analytics Pipeline

```mermaid
graph TB
    subgraph "Data Sources"
        TRANSACTIONAL_DB[(Transactional DB)]
        EVENT_LOGS[Event Logs]
        EXTERNAL_DATA[External Data]
    end
    
    subgraph "ETL Process"
        DATA_EXTRACTION[Data Extraction]
        DATA_TRANSFORMATION[Data Transformation]
        DATA_LOADING[Data Loading]
        DATA_VALIDATION[Data Validation]
    end
    
    subgraph "Data Warehouse"
        DIMENSION_TABLES[(Dimension Tables)]
        FACT_TABLES[(Fact Tables)]
        AGGREGATED_TABLES[(Aggregated Tables)]
    end
    
    subgraph "Analytics Layer"
        OLAP_ENGINE[OLAP Engine]
        REPORTING_ENGINE[Reporting Engine]
        ML_PIPELINE[ML Pipeline]
    end
    
    subgraph "Analytics Output"
        BUSINESS_REPORTS[Business Reports]
        DASHBOARDS[Dashboards]
        ML_MODELS[ML Models]
    end
    
    TRANSACTIONAL_DB --> DATA_EXTRACTION
    EVENT_LOGS --> DATA_EXTRACTION
    EXTERNAL_DATA --> DATA_EXTRACTION
    
    DATA_EXTRACTION --> DATA_TRANSFORMATION
    DATA_TRANSFORMATION --> DATA_LOADING
    DATA_LOADING --> DATA_VALIDATION
    
    DATA_VALIDATION --> DIMENSION_TABLES
    DATA_VALIDATION --> FACT_TABLES
    FACT_TABLES --> AGGREGATED_TABLES
    
    DIMENSION_TABLES --> OLAP_ENGINE
    FACT_TABLES --> OLAP_ENGINE
    AGGREGATED_TABLES --> REPORTING_ENGINE
    
    OLAP_ENGINE --> BUSINESS_REPORTS
    REPORTING_ENGINE --> DASHBOARDS
    AGGREGATED_TABLES --> ML_PIPELINE
    ML_PIPELINE --> ML_MODELS
```

## 🔒 Security Data Flows

### Data Encryption Flow

```mermaid
graph TB
    subgraph "Data Input"
        SENSITIVE_DATA[Sensitive Data]
        PERSONAL_INFO[Personal Information]
        HEALTH_DATA[Health Data]
    end
    
    subgraph "Encryption Process"
        DATA_CLASSIFICATION[Data Classification]
        ENCRYPTION_ENGINE[Encryption Engine]
        KEY_MANAGEMENT[Key Management]
        ACCESS_CONTROL[Access Control]
    end
    
    subgraph "Storage"
        ENCRYPTED_DB[(Encrypted Database)]
        ENCRYPTED_FILES[(Encrypted Files)]
        SECURE_CACHE[(Secure Cache)]
    end
    
    subgraph "Data Access"
        AUTHENTICATION[Authentication]
        AUTHORIZATION[Authorization]
        DECRYPTION_ENGINE[Decryption Engine]
        AUDIT_LOGGING[Audit Logging]
    end
    
    SENSITIVE_DATA --> DATA_CLASSIFICATION
    PERSONAL_INFO --> DATA_CLASSIFICATION
    HEALTH_DATA --> DATA_CLASSIFICATION
    
    DATA_CLASSIFICATION --> ENCRYPTION_ENGINE
    ENCRYPTION_ENGINE --> KEY_MANAGEMENT
    KEY_MANAGEMENT --> ACCESS_CONTROL
    
    ENCRYPTION_ENGINE --> ENCRYPTED_DB
    ENCRYPTION_ENGINE --> ENCRYPTED_FILES
    ENCRYPTION_ENGINE --> SECURE_CACHE
    
    ACCESS_CONTROL --> AUTHENTICATION
    AUTHENTICATION --> AUTHORIZATION
    AUTHORIZATION --> DECRYPTION_ENGINE
    DECRYPTION_ENGINE --> AUDIT_LOGGING
```

---

_Last updated: 2026-01-21_
