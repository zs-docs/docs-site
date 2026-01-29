# ZARISH HIS Architecture

This section provides detailed architectural documentation for the ZARISH Health Information System.

## 🏗️ High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        ESM[esm-core Framework]
        PM[esm-patient-management]
        PC[esm-patient-chart]
        FE[esm-form-engine]
        PH[esm-pharmacy]
        LA[esm-laboratory]
        RA[esm-radiology]
        BI[esm-billing]
        IN[esm-inpatient]
        AD[esm-admin]
        RE[esm-reports]
        EM[esm-emergency]
        SU[esm-surgery]
        MH[esm-maternal-health]
        MO[esm-mobile]
    end
    
    subgraph "API Gateway"
        GW[Kong/APISIX Gateway]
        AUTH[Authentication Service]
        RATE[Rate Limiting]
        LB[Load Balancer]
    end
    
    subgraph "Backend Services"
        subgraph "Core Services"
            PR[ms-patient-registry]
            PRACT[ms-practitioner-registry]
            ORG[ms-organization-registry]
            ENC[ms-encounter-service]
        end
        
        subgraph "Clinical Services"
            OBS[ms-observation-service]
            COND[ms-condition-service]
            MED[ms-medication-service]
            PROC[ms-procedure-service]
            IMM[ms-immunization-service]
            DIAG[ms-diagnostic-service]
        end
        
        subgraph "Ancillary Services"
            LAB[ms-laboratory-service]
            RAD[ms-radiology-service]
            PHARM[ms-pharmacy-service]
            BB[ms-blood-bank-service]
        end
        
        subgraph "Administrative Services"
            APPT[ms-appointment-service]
            BILL[ms-billing-service]
            INV[ms-inventory-service]
            BED[ms-bed-management]
            QUEUE[ms-queue-service]
        end
        
        subgraph "Infrastructure Services"
            AUTH_SVC[ms-auth-service]
            NOTIF[ms-notification-service]
            AUDIT[ms-audit-service]
            INTEG[ms-integration-hub]
            REPORT[ms-report-service]
            WORKFLOW[ms-workflow-engine]
        end
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL)]
        REDIS[(Redis)]
        FHIR[FHIR Server]
        FILES[File Storage]
    end
    
    subgraph "External Systems"
        DGHS[DGHS Systems]
        INSURANCE[Insurance Gateways]
        LABS[External Labs]
        PHARMACIES[External Pharmacies]
    end
    
    %% Frontend to Gateway
    PM --> GW
    PC --> GW
    FE --> GW
    PH --> GW
    LA --> GW
    RA --> GW
    BI --> GW
    IN --> GW
    AD --> GW
    RE --> GW
    EM --> GW
    SU --> GW
    MH --> GW
    MO --> GW
    
    %% Gateway to Services
    GW --> AUTH
    GW --> RATE
    GW --> LB
    
    %% Load Balancer to Services
    LB --> PR
    LB --> PRACT
    LB --> ORG
    LB --> ENC
    LB --> OBS
    LB --> COND
    LB --> MED
    LB --> PROC
    LB --> IMM
    LB --> DIAG
    LB --> LAB
    LB --> RAD
    LB --> PHARM
    LB --> BB
    LB --> APPT
    LB --> BILL
    LB --> INV
    LB --> BED
    LB --> QUEUE
    LB --> AUTH_SVC
    LB --> NOTIF
    LB --> AUDIT
    LB --> INTEG
    LB --> REPORT
    LB --> WORKFLOW
    
    %% Services to Data
    PR --> PG
    PRACT --> PG
    ORG --> PG
    ENC --> PG
    OBS --> PG
    COND --> PG
    MED --> PG
    PROC --> PG
    IMM --> PG
    DIAG --> PG
    LAB --> PG
    RAD --> PG
    PHARM --> PG
    BB --> PG
    APPT --> PG
    BILL --> PG
    INV --> PG
    BED --> PG
    QUEUE --> PG
    AUTH_SVC --> PG
    NOTIF --> PG
    AUDIT --> PG
    INTEG --> PG
    REPORT --> PG
    WORKFLOW --> PG
    
    %% Caching
    AUTH_SVC --> REDIS
    PR --> REDIS
    OBS --> REDIS
    BILL --> REDIS
    
    %% FHIR Integration
    PR --> FHIR
    PRACT --> FHIR
    ENC --> FHIR
    OBS --> FHIR
    COND --> FHIR
    MED --> FHIR
    
    %% File Storage
    LAB --> FILES
    RAD --> FILES
    BILL --> FILES
    
    %% External Integrations
    INTEG --> DGHS
    BILL --> INSURANCE
    LAB --> LABS
    PHARM --> PHARMACIES
```

## 🔄 Data Flow Architecture

### Patient Registration Flow

```mermaid
sequenceDiagram
    participant Patient
    participant Frontend
    participant Gateway
    participant Auth Service
    participant Patient Registry
    participant FHIR Server
    participant Audit Service
    
    Patient->>Frontend: Start Registration
    Frontend->>Gateway: Submit Registration Form
    Gateway->>Auth Service: Validate Token
    Auth Service-->>Gateway: Token Valid
    Gateway->>Patient Registry: Create Patient
    Patient Registry->>FHIR Server: Create FHIR Patient
    FHIR Server-->>Patient Registry: Patient Created
    Patient Registry->>Audit Service: Log Patient Creation
    Patient Registry-->>Gateway: Patient Created
    Gateway-->>Frontend: Registration Success
    Frontend-->>Patient: Confirmation
```

### Clinical Encounter Flow

```mermaid
sequenceDiagram
    participant Doctor
    participant Frontend
    participant Gateway
    participant Encounter Service
    participant Observation Service
    participant Patient Registry
    participant FHIR Server
    
    Doctor->>Frontend: Start Encounter
    Frontend->>Gateway: Create Encounter
    Gateway->>Encounter Service: New Encounter
    Encounter Service->>Patient Registry: Get Patient Info
    Patient Registry-->>Encounter Service: Patient Data
    Encounter Service->>FHIR Server: Create FHIR Encounter
    FHIR Server-->>Encounter Service: Encounter Created
    
    Doctor->>Frontend: Add Vitals
    Frontend->>Gateway: Submit Observations
    Gateway->>Observation Service: Create Observations
    Observation Service->>FHIR Server: Create FHIR Observations
    FHIR Server-->>Observation Service: Observations Created
    Observation Service-->>Gateway: Success
    Gateway-->>Frontend: Observations Saved
```

## 🏛️ Service Dependencies

### Core Service Dependencies

```mermaid
graph LR
    subgraph "Core Services"
        PR[Patient Registry]
        PRACT[Practitioner Registry]
        ORG[Organization Registry]
        ENC[Encounter Service]
    end
    
    subgraph "Dependencies"
        AUTH[Auth Service]
        AUDIT[Audit Service]
        FHIR[FHIR Server]
        REDIS[(Redis Cache)]
    end
    
    PR --> AUTH
    PR --> AUDIT
    PR --> FHIR
    PR --> REDIS
    
    PRACT --> AUTH
    PRACT --> AUDIT
    PRACT --> FHIR
    
    ORG --> AUTH
    ORG --> AUDIT
    ORG --> FHIR
    
    ENC --> PR
    ENC --> PRACT
    ENC --> ORG
    ENC --> AUTH
    ENC --> AUDIT
    ENC --> FHIR
```

## 🔧 Technology Stack

### Frontend Technologies
- **React 19+**: Modern UI framework
- **TypeScript**: Type-safe development
- **Material-UI**: Component library
- **Redux Toolkit**: State management
- **React Query**: Data fetching
- **Vite**: Build tool

### Backend Technologies
- **Golang 1.25.x**: Primary backend language
- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions
- **Docker**: Containerization
- **Kubernetes**: Orchestration

### Integration Technologies
- **FHIR R5**: Healthcare data standard
- **HL7 v2**: Legacy system integration
- **REST APIs**: External integrations
- **gRPC**: Internal service communication
- **Apache Kafka**: Event streaming

## 🌐 Deployment Architecture

### Production Environment

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[NGINX/HAProxy]
    end
    
    subgraph "Application Layer"
        subgraph "Kubernetes Cluster"
            POD1[Pod 1]
            POD2[Pod 2]
            POD3[Pod 3]
        end
    end
    
    subgraph "Data Layer"
        DB_MASTER[(PostgreSQL Master)]
        DB_SLAVE[(PostgreSQL Slave)]
        REDIS_CLUSTER[(Redis Cluster)]
    end
    
    subgraph "Monitoring"
        PROM[Prometheus]
        GRAF[Grafana]
        LOG[ELK Stack]
    end
    
    LB --> POD1
    LB --> POD2
    LB --> POD3
    
    POD1 --> DB_MASTER
    POD2 --> DB_MASTER
    POD3 --> DB_MASTER
    
    DB_MASTER --> DB_SLAVE
    
    POD1 --> REDIS_CLUSTER
    POD2 --> REDIS_CLUSTER
    POD3 --> REDIS_CLUSTER
    
    POD1 --> PROM
    POD2 --> PROM
    POD3 --> PROM
    PROM --> GRAF
    
    POD1 --> LOG
    POD2 --> LOG
    POD3 --> LOG
```

## 🔒 Security Architecture

### Authentication & Authorization

```mermaid
graph TB
    subgraph "Authentication Flow"
        USER[User]
        FRONTEND[Frontend App]
        AUTH_SVC[Auth Service]
        JWT[JWT Token]
        SERVICES[Backend Services]
    end
    
    USER --> FRONTEND
    FRONTEND --> AUTH_SVC
    AUTH_SVC --> JWT
    JWT --> FRONTEND
    FRONTEND --> SERVICES
    SERVICES --> JWT
```

### Security Layers

1. **Network Security**
   - TLS/SSL encryption
   - Firewall rules
   - DDoS protection

2. **Application Security**
   - JWT authentication
   - RBAC authorization
   - Input validation
   - SQL injection prevention

3. **Data Security**
   - Encryption at rest
   - Encryption in transit
   - Data masking
   - Audit logging

4. **Compliance Security**
   - HIPAA compliance
   - Data privacy
   - Audit trails
   - Access controls

---

*For more detailed architecture information, see:*
- [Service Dependencies](service-dependencies.md)
- [Data Flows](data-flows.md)
- [Deployment Architecture](deployment-architecture.md)
- [Frontend Dependencies](frontend-dependencies.md)

*Last updated: 2026-01-21*
