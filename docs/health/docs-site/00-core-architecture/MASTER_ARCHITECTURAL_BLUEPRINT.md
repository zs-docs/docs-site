# ZARISH HIS - Complete Modules & Services List
## Comprehensive Architecture Based on OpenMRS 3.0

---

## 📋 Table of Contents

1. [Organization Structure](#organization-structure)
2. [Frontend Monorepos & Microfrontends](#frontend-monorepos--microfrontends)
3. [Backend Microservices (Golang)](#backend-microservices-golang)
4. [Shared Libraries](#shared-libraries)
5. [Infrastructure Services](#infrastructure-services)
6. [Integration Layer](#integration-layer)
7. [Repository Mapping](#repository-mapping)
8. [Deployment Architecture](#deployment-architecture)

---

## 🏢 Organization Structure

### GitHub Organization: `zs-his`

```
zs-his/
├── Frontend Monorepos (15 repos)
├── Backend Microservices (25+ services)
├── Shared Libraries (8 repos)
├── Infrastructure (6 repos)
└── Documentation & Tools (4 repos)
```

---

## 🎨 Frontend Monorepos & Microfrontends

### 1. `esm-core` - Core Framework & Apps

**Repository**: `github.com/zs-his/esm-core`

**Description**: Core frontend framework and essential apps (like OpenMRS esm-core)

#### Framework Packages (`packages/framework/`)

| Package | NPM Name | Purpose | OpenMRS Equivalent |
|---------|----------|---------|-------------------|
| `esm-framework` | `@zs-his/esm-framework` | Aggregated framework exports | `@openmrs/esm-framework` |
| `esm-api` | `@zs-his/esm-api` | API client & FHIR utilities | `@openmrs/esm-api` |
| `esm-config` | `@zs-his/esm-config` | Configuration system | `@openmrs/esm-config` |
| `esm-state` | `@zs-his/esm-state` | State management (Zustand) | `@openmrs/esm-state` |
| `esm-styleguide` | `@zs-his/esm-styleguide` | UI components (Carbon) | `@openmrs/esm-styleguide` |
| `esm-react-utils` | `@zs-his/esm-react-utils` | React hooks & utilities | `@openmrs/esm-react-utils` |
| `esm-extensions` | `@zs-his/esm-extensions` | Extension system | `@openmrs/esm-extensions` |
| `esm-navigation` | `@zs-his/esm-navigation` | Navigation & breadcrumbs | `@openmrs/esm-navigation` |
| `esm-error-handling` | `@zs-his/esm-error-handling` | Error boundaries | `@openmrs/esm-error-handling` |
| `esm-offline` | `@zs-his/esm-offline` | PWA & offline support | `@openmrs/esm-offline` |
| `esm-translations` | `@zs-his/esm-translations` | i18n utilities | `@openmrs/esm-translations` |
| `esm-routes` | `@zs-his/esm-routes` | Routing utilities | `@openmrs/esm-routes` |
| `esm-globals` | `@zs-his/esm-globals` | Global types & constants | `@openmrs/esm-globals` |
| `esm-feature-flags` | `@zs-his/esm-feature-flags` | Feature toggles | `@openmrs/esm-feature-flags` |
| `esm-expression-evaluator` | `@zs-his/esm-expression-evaluator` | Safe expression eval | `@openmrs/esm-expression-evaluator` |

#### Core Apps (`packages/apps/`)

| App | NPM Name | Purpose | OpenMRS Equivalent |
|-----|----------|---------|-------------------|
| `esm-login-app` | `@zs-his/esm-login-app` | Login & authentication UI | `@openmrs/esm-login-app` |
| `esm-primary-navigation-app` | `@zs-his/esm-primary-navigation-app` | Top navbar | `@openmrs/esm-primary-navigation-app` |
| `esm-home-app` | `@zs-his/esm-home-app` | Landing page/dashboard | `@openmrs/esm-home-app` |
| `esm-offline-tools-app` | `@zs-his/esm-offline-tools-app` | Offline mode UI | `@openmrs/esm-offline-tools-app` |
| `esm-implementer-tools-app` | `@zs-his/esm-implementer-tools-app` | Config editor | `@openmrs/esm-implementer-tools-app` |
| `esm-devtools-app` | `@zs-his/esm-devtools-app` | Developer tools | `@openmrs/esm-devtools-app` |
| `esm-help-menu-app` | `@zs-his/esm-help-menu-app` | Help & documentation | `@openmrs/esm-help-menu-app` |

#### Tooling (`packages/tooling/`)

| Tool | NPM Name | Purpose |
|------|----------|---------|
| `openmrs` | `openmrs` (CLI) | Dev server & build tools |

---

### 2. `esm-patient-management` - Patient Registration & Search

**Repository**: `github.com/zs-his/esm-patient-management`

**Description**: Patient registration, search, lists, appointments, queues

#### Packages (`packages/`)

| Package | NPM Name | Purpose | OpenMRS Equivalent |
|---------|----------|---------|-------------------|
| `esm-patient-search-app` | `@zs-his/esm-patient-search-app` | Patient finder | `@openmrs/esm-patient-search-app` |
| `esm-patient-registration-app` | `@zs-his/esm-patient-registration-app` | New patient enrollment | `@openmrs/esm-patient-registration-app` |
| `esm-patient-list-app` | `@zs-his/esm-patient-list-app` | Patient cohorts/lists | `@openmrs/esm-patient-list-app` |
| `esm-active-visits-app` | `@zs-his/esm-active-visits-app` | Current encounters | `@openmrs/esm-active-visits-app` |
| `esm-appointments-app` | `@zs-his/esm-appointments-app` | Appointment scheduling | `@openmrs/esm-appointments-app` |
| `esm-outpatient-app` | `@zs-his/esm-outpatient-app` | OPD queue management | `@openmrs/esm-outpatient-app` |
| `esm-service-queues-app` | `@zs-his/esm-service-queues-app` | Service queue screens | `@openmrs/esm-service-queues-app` |
| `esm-patient-management-common-lib` | `@zs-his/esm-patient-management-common-lib` | Shared utilities | - |

---

### 3. `esm-patient-chart` - Patient Clinical Dashboard

**Repository**: `github.com/zs-his/esm-patient-chart`

**Description**: Patient dashboard with clinical widgets

#### Core Packages (`packages/`)

| Package | NPM Name | Purpose | OpenMRS Equivalent |
|---------|----------|---------|-------------------|
| `esm-patient-chart-app` | `@zs-his/esm-patient-chart-app` | Main chart container | `@openmrs/esm-patient-chart-app` |
| `esm-patient-banner-app` | `@zs-his/esm-patient-banner-app` | Patient header | `@openmrs/esm-patient-banner-app` |
| `esm-patient-common-lib` | `@zs-his/esm-patient-common-lib` | Shared chart utilities | `@openmrs/esm-patient-common-lib` |

#### Clinical Widgets

| Package | NPM Name | Purpose | OpenMRS Equivalent |
|---------|----------|---------|-------------------|
| `esm-patient-allergies-app` | `@zs-his/esm-patient-allergies-app` | Allergy management | `@openmrs/esm-patient-allergies-app` |
| `esm-patient-vitals-app` | `@zs-his/esm-patient-vitals-app` | Vital signs | `@openmrs/esm-patient-vitals-app` |
| `esm-patient-biometrics-app` | `@zs-his/esm-patient-biometrics-app` | Height, weight, BMI | `@openmrs/esm-patient-biometrics-app` |
| `esm-patient-conditions-app` | `@zs-his/esm-patient-conditions-app` | Diagnoses/problems | `@openmrs/esm-patient-conditions-app` |
| `esm-patient-medications-app` | `@zs-his/esm-patient-medications-app` | Medication history | `@openmrs/esm-patient-medications-app` |
| `esm-patient-immunizations-app` | `@zs-his/esm-patient-immunizations-app` | Vaccination records | `@openmrs/esm-patient-immunizations-app` |
| `esm-patient-test-results-app` | `@zs-his/esm-patient-test-results-app` | Lab/radiology results | `@openmrs/esm-patient-test-results-app` |
| `esm-patient-orders-app` | `@zs-his/esm-patient-orders-app` | Order management | - |
| `esm-patient-notes-app` | `@zs-his/esm-patient-notes-app` | Clinical notes | `@openmrs/esm-patient-notes-app` |
| `esm-patient-attachments-app` | `@zs-his/esm-patient-attachments-app` | Documents/images | `@openmrs/esm-patient-attachments-app` |
| `esm-patient-programs-app` | `@zs-his/esm-patient-programs-app` | Care programs (TB, HIV) | `@openmrs/esm-patient-programs-app` |
| `esm-patient-forms-app` | `@zs-his/esm-patient-forms-app` | Clinical forms widget | `@openmrs/esm-patient-forms-app` |
| `esm-patient-visits-app` | `@zs-his/esm-patient-visits-app` | Visit history | - |
| `esm-generic-patient-widgets-app` | `@zs-his/esm-generic-patient-widgets-app` | Reusable widgets | - |

---

### 4. `esm-form-engine` - Dynamic Forms

**Repository**: `github.com/zs-his/esm-form-engine`

**Description**: React-based form engine for clinical data entry

#### Packages (`packages/`)

| Package | NPM Name | Purpose | OpenMRS Equivalent |
|---------|----------|---------|-------------------|
| `esm-form-engine-lib` | `@zs-his/esm-form-engine-lib` | Core form renderer | `@openmrs/openmrs-form-engine-lib` |
| `esm-form-builder-app` | `@zs-his/esm-form-builder-app` | Visual form builder | Form Builder app |
| `esm-patient-form-entry-app` | `@zs-his/esm-patient-form-entry-app` | Form entry widget | - |

---

### 5. `esm-pharmacy` - Pharmacy Management

**Repository**: `github.com/zs-his/esm-pharmacy`

**Description**: Medication dispensing and pharmacy workflows

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-dispensing-app` | `@zs-his/esm-dispensing-app` | Drug dispensing UI |
| `esm-stock-management-app` | `@zs-his/esm-stock-management-app` | Pharmacy inventory |
| `esm-pharmacy-orders-app` | `@zs-his/esm-pharmacy-orders-app` | Prescription orders |

---

### 6. `esm-laboratory` - Laboratory Management

**Repository**: `github.com/zs-his/esm-laboratory`

**Description**: Lab orders, specimen tracking, and results

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-laboratory-app` | `@zs-his/esm-laboratory-app` | Lab workflow UI |
| `esm-lab-orders-app` | `@zs-his/esm-lab-orders-app` | Lab order entry |
| `esm-lab-results-app` | `@zs-his/esm-lab-results-app` | Result entry & reporting |

---

### 7. `esm-radiology` - Radiology/Imaging

**Repository**: `github.com/zs-his/esm-radiology`

**Description**: Imaging orders and PACS integration

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-radiology-app` | `@zs-his/esm-radiology-app` | Radiology workflow |
| `esm-radiology-orders-app` | `@zs-his/esm-radiology-orders-app` | Imaging orders |
| `esm-radiology-results-app` | `@zs-his/esm-radiology-results-app` | Image results viewer |

---

### 8. `esm-billing` - Financial Management

**Repository**: `github.com/zs-his/esm-billing`

**Description**: Billing, invoicing, and claims

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-billing-app` | `@zs-his/esm-billing-app` | Invoice generation |
| `esm-cashier-app` | `@zs-his/esm-cashier-app` | Payment collection |
| `esm-claims-app` | `@zs-his/esm-claims-app` | Insurance claims |

---

### 9. `esm-inpatient` - Inpatient/Ward Management

**Repository**: `github.com/zs-his/esm-inpatient`

**Description**: IPD admissions, ward management, bed allocation

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-inpatient-app` | `@zs-his/esm-inpatient-app` | Ward management UI |
| `esm-bed-management-app` | `@zs-his/esm-bed-management-app` | Bed allocation |
| `esm-ward-census-app` | `@zs-his/esm-ward-census-app` | Patient census |

---

### 10. `esm-admin` - System Administration

**Repository**: `github.com/zs-his/esm-admin`

**Description**: User management, system config, audit logs

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-admin-app` | `@zs-his/esm-admin-app` | Admin dashboard |
| `esm-user-management-app` | `@zs-his/esm-user-management-app` | User CRUD |
| `esm-facility-management-app` | `@zs-his/esm-facility-management-app` | Facility config |
| `esm-audit-log-app` | `@zs-his/esm-audit-log-app` | Audit viewer |

---

### 11. `esm-reports` - Reporting & Analytics

**Repository**: `github.com/zs-his/esm-reports`

**Description**: Business intelligence and reporting

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-reports-app` | `@zs-his/esm-reports-app` | Report viewer |
| `esm-dashboard-app` | `@zs-his/esm-dashboard-app` | BI dashboards |
| `esm-analytics-app` | `@zs-his/esm-analytics-app` | Data visualization |

---

### 12. `esm-emergency` - Emergency Department

**Repository**: `github.com/zs-his/esm-emergency`

**Description**: ER triage and emergency workflows

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-emergency-app` | `@zs-his/esm-emergency-app` | ER dashboard |
| `esm-triage-app` | `@zs-his/esm-triage-app` | Patient triage |

---

### 13. `esm-surgery` - Operating Theater

**Repository**: `github.com/zs-his/esm-surgery`

**Description**: OT scheduling and surgical procedures

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-surgery-app` | `@zs-his/esm-surgery-app` | OT management |
| `esm-procedure-orders-app` | `@zs-his/esm-procedure-orders-app` | Surgical booking |

---

### 14. `esm-maternal-health` - Mother & Child Health

**Repository**: `github.com/zs-his/esm-maternal-health`

**Description**: ANC, PNC, immunization programs

#### Packages (`packages/`)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| `esm-anc-app` | `@zs-his/esm-anc-app` | Antenatal care |
| `esm-pnc-app` | `@zs-his/esm-pnc-app` | Postnatal care |
| `esm-epi-app` | `@zs-his/esm-epi-app` | Immunization program |

---

### 15. `esm-mobile` - Mobile Applications

**Repository**: `github.com/zs-his/esm-mobile`

**Description**: React Native mobile apps

#### Packages (`packages/`)

| Package | Purpose |
|---------|---------|
| `mobile-clinician-app` | Clinician mobile app |
| `mobile-patient-app` | Patient self-service app |
| `mobile-chw-app` | Community health worker app |

---

## ⚙️ Backend Microservices (Golang)

### Core Domain Services

| Service | Repository | Description | FHIR Resources |
|---------|------------|-------------|----------------|
| `ms-patient-registry` | `github.com/zs-his/ms-patient-registry` | Patient master index | Patient, Person, RelatedPerson |
| `ms-practitioner-registry` | `github.com/zs-his/ms-practitioner-registry` | Healthcare providers | Practitioner, PractitionerRole |
| `ms-organization-registry` | `github.com/zs-his/ms-organization-registry` | Facilities & departments | Organization, Location |
| `ms-encounter-service` | `github.com/zs-his/ms-encounter-service` | Visits & consultations | Encounter, EpisodeOfCare |

### Clinical Services

| Service | Repository | Description | FHIR Resources |
|---------|------------|-------------|----------------|
| `ms-observation-service` | `github.com/zs-his/ms-observation-service` | Vitals & measurements | Observation |
| `ms-condition-service` | `github.com/zs-his/ms-condition-service` | Diagnoses & allergies | Condition, AllergyIntolerance |
| `ms-medication-service` | `github.com/zs-his/ms-medication-service` | Prescriptions | MedicationRequest, MedicationDispense, MedicationStatement |
| `ms-procedure-service` | `github.com/zs-his/ms-procedure-service` | Procedures & surgeries | Procedure, ServiceRequest |
| `ms-immunization-service` | `github.com/zs-his/ms-immunization-service` | Vaccination records | Immunization |
| `ms-diagnostic-service` | `github.com/zs-his/ms-diagnostic-service` | Lab & radiology | DiagnosticReport, ImagingStudy |

### Ancillary Services

| Service | Repository | Description | FHIR Resources |
|---------|------------|-------------|----------------|
| `ms-laboratory-service` | `github.com/zs-his/ms-laboratory-service` | Lab workflow | Specimen, DiagnosticReport |
| `ms-radiology-service` | `github.com/zs-his/ms-radiology-service` | Imaging workflow | ImagingStudy, DiagnosticReport |
| `ms-pharmacy-service` | `github.com/zs-his/ms-pharmacy-service` | Drug inventory | Medication, MedicationKnowledge |
| `ms-blood-bank-service` | `github.com/zs-his/ms-blood-bank-service` | Blood management | BiologicallyDerivedProduct |

### Administrative Services

| Service | Repository | Description | FHIR Resources |
|---------|------------|-------------|----------------|
| `ms-appointment-service` | `github.com/zs-his/ms-appointment-service` | Scheduling | Appointment, Slot, Schedule |
| `ms-billing-service` | `github.com/zs-his/ms-billing-service` | Financial transactions | Claim, Invoice, ChargeItem |
| `ms-inventory-service` | `github.com/zs-his/ms-inventory-service` | Stock management | SupplyDelivery, SupplyRequest |
| `ms-bed-management` | `github.com/zs-his/ms-bed-management` | IPD bed allocation | Location, EpisodeOfCare |
| `ms-queue-service` | `github.com/zs-his/ms-queue-service` | Patient queues | Task, ServiceRequest |

### Infrastructure Services

| Service | Repository | Description |
|---------|------------|-------------|
| `ms-auth-service` | `github.com/zs-his/ms-auth-service` | Authentication & authorization |
| `ms-notification-service` | `github.com/zs-his/ms-notification-service` | SMS, email, push |
| `ms-audit-service` | `github.com/zs-his/ms-audit-service` | Audit logging |
| `ms-integration-hub` | `github.com/zs-his/ms-integration-hub` | HL7 v2, FHIR, external systems |
| `ms-report-service` | `github.com/zs-his/ms-report-service` | Report generation |
| `ms-workflow-engine` | `github.com/zs-his/ms-workflow-engine` | Business process automation |
| `ms-event-bus` | `github.com/zs-his/ms-event-bus` | Event streaming (NATS/Kafka) |

---

## 📚 Shared Libraries

### Frontend Libraries

| Library | Repository | NPM Name | Purpose |
|---------|------------|----------|---------|
| `lib-fhir-utils` | `github.com/zs-his/lib-fhir-utils` | `@zs-his/lib-fhir-utils` | FHIR utilities |
| `lib-ui-components` | `github.com/zs-his/lib-ui-components` | `@zs-his/lib-ui-components` | Reusable UI components |
| `lib-form-validators` | `github.com/zs-his/lib-form-validators` | `@zs-his/lib-form-validators` | Form validation |

### Backend Libraries

| Library | Repository | Package | Purpose |
|---------|------------|---------|---------|
| `lib-go-fhir` | `github.com/zs-his/lib-go-fhir` | Go package | FHIR R5 models |
| `lib-go-common` | `github.com/zs-his/lib-go-common` | Go package | Common utilities |
| `lib-go-auth` | `github.com/zs-his/lib-go-auth` | Go package | Auth middleware |
| `lib-go-events` | `github.com/zs-his/lib-go-events` | Go package | Event handling |
| `lib-go-cache` | `github.com/zs-his/lib-go-cache` | Go package | Caching utilities |

---

## 🏗️ Infrastructure Services

| Service | Repository | Technology | Purpose |
|---------|------------|------------|---------|
| **API Gateway** | `github.com/zs-his/api-gateway` | Kong/APISIX | Routing, auth, rate limiting |
| **Service Mesh** | - | Istio/Linkerd | Service discovery, observability |
| **Event Bus** | - | NATS/Kafka | Event streaming |
| **Cache Layer** | - | Redis Cluster | Distributed caching |
| **Database** | - | PostgreSQL | Primary data store |
| **Object Storage** | - | MinIO/S3 | Documents, images |

---

## 🔗 Integration Layer

| Component | Repository | Purpose |
|-----------|------------|---------|
| `hl7-adapter` | `github.com/zs-his/hl7-adapter` | HL7 v2 message handling |
| `fhir-gateway` | `github.com/zs-his/fhir-gateway` | FHIR API gateway |
| `dghs-connector` | `github.com/zs-his/dghs-connector` | BD DGHS integration |
| `insurance-gateway` | `github.com/zs-his/insurance-gateway` | Insurance provider API |

---

## 📦 Complete Repository Mapping

### Summary Table

| Category | Count | Examples |
|----------|-------|----------|
| **Frontend Monorepos** | 15 | esm-core, esm-patient-chart, esm-patient-management |
| **Frontend Packages** | 80+ | All microfrontends |
| **Backend Microservices** | 25 | ms-patient-registry, ms-appointment-service |
| **Shared Libraries** | 8 | lib-fhir-utils, lib-go-common |
| **Infrastructure** | 6 | api-gateway, event-bus |
| **Tools** | 4 | docs, fhir-ig-publisher |
| **TOTAL REPOSITORIES** | **58+** | - |

---

## 🚀 Deployment Architecture

### Development Environment

```yaml
# docker-compose.dev.yml
services:
  # Frontend (monorepo dev servers)
  frontend:
    - esm-core (port 8080)
    - esm-patient-management (port 8081)
    - esm-patient-chart (port 8082)
  
  # Backend microservices
  microservices:
    - ms-patient-registry (port 9001)
    - ms-appointment-service (port 9002)
    - ms-billing-service (port 9003)
    # ... 25+ services
  
  # Infrastructure
  infrastructure:
    - PostgreSQL (port 5432)
    - Redis (port 6379)
    - NATS (port 4222)
    - MinIO (port 9000)
```

### Production Deployment (Kubernetes)

```
Namespaces:
├── zarish-frontend       # All frontend apps
├── zarish-core-services  # Patient, Practitioner, Org
├── zarish-clinical       # Clinical services
├── zarish-ancillary      # Lab, Radiology, Pharmacy
├── zarish-admin          # Billing, Inventory
└── zarish-infra          # Database, Redis, NATS
```

---

## 📊 Module Dependencies

### Frontend Dependency Graph

```
@zs-his/esm-framework (core)
  ↓
@zs-his/esm-patient-common-lib
  ↓
@zs-his/esm-patient-chart-app
  ↓
├── @zs-his/esm-patient-allergies-app
├── @zs-his/esm-patient-vitals-app
├── @zs-his/esm-patient-medications-app
└── ... (all chart widgets)
```

### Backend Service Dependencies

```
ms-patient-registry (foundational)
  ↓
ms-encounter-service
  ↓
├── ms-observation-service
├── ms-condition-service
├── ms-medication-service
└── ms-procedure-service
```

---

## 🎯 OpenMRS → ZARISH Mapping

| OpenMRS Repository | ZARISH Equivalent | Notes |
|-------------------|-------------------|-------|
| `openmrs-esm-core` | `esm-core` | Core framework |
| `openmrs-esm-patient-chart` | `esm-patient-chart` | Patient dashboard |
| `openmrs-esm-patient-management` | `esm-patient-management` | Registration, search |
| `openmrs-form-engine-lib` | `esm-form-engine-lib` | React form engine |
| `openmrs-esm-dispensing-app` | `esm-dispensing-app` | Pharmacy |
| `openmrs-esm-laboratory-app` | `esm-laboratory-app` | Lab management |
| Backend modules (Java) | `ms-*` services (Golang) | Microservices |

---

## 📝 Package Naming Convention Summary

### Frontend (NPM)

```
@zs-his/esm-{domain}-{feature}-app
```

Examples:
- `@zs-his/esm-patient-allergies-app`
- `@zs-his/esm-patient-registration-app`
- `@zs-his/esm-appointments-app`

### Backend (Go Modules)

```
github.com/zs-his/ms-{domain}-{service}
```

Examples:
- `github.com/zs-his/ms-patient-registry`
- `github.com/zs-his/ms-appointment-service`
- `github.com/zs-his/ms-billing-service`

---

## 🔢 Statistics

### Code Distribution

| Type | Repositories | Packages/Services | Language |
|------|--------------|-------------------|----------|
| **Frontend** | 15 monorepos | 80+ packages | TypeScript/React 19 |
| **Backend** | 25 services | 25 microservices | Golang 1.25.x |
| **Shared Libs** | 8 repos | 8 libraries | TypeScript + Go |
| **Infrastructure** | 6 components | 6 services | Various |
| **TOTAL** | **58+ repos** | **119+ modules** | - |

### Technology Stack Breakdown

```
Frontend: 85% TypeScript, 15% JavaScript
Backend:  100% Golang 1.25.x
FHIR:     100% R5
Database: PostgreSQL 16+
Cache:    Redis 7+
Events:   NATS/Kafka
```

---

## 📋 Quick Reference Cheat Sheet

### Frontend Modules by Function

**Patient Management**:
- `esm-patient-search-app` - Find patients
- `esm-patient-registration-app` - Register new patients
- `esm-patient-list-app` - Patient cohorts
- `esm-active-visits-app` - Current visits

**Clinical Documentation**:
- `esm-patient-vitals-app` - Vital signs
- `esm-patient-conditions-app` - Diagnoses
- `esm-patient-medications-app` - Medication history
- `esm-patient-allergies-app` - Allergies
- `esm-patient-notes-app` - Clinical notes

**Orders & Results**:
- `esm-lab-orders-app` - Lab orders
- `esm-radiology-orders-app` - Imaging orders
- `esm-patient-test-results-app` - Results viewer
- `esm-pharmacy-orders-app` - Prescriptions

**Administrative**:
- `esm-appointments-app` - Scheduling
- `esm-billing-app` - Invoicing
- `esm-bed-management-app` - IPD beds
- `esm-service-queues-app` - Patient queues

### Backend Services by Domain

**Master Data**:
- `ms-patient-registry` - Patients
- `ms-practitioner-registry` - Healthcare providers
- `ms-organization-registry` - Facilities

**Clinical Core**:
- `ms-encounter-service` - Visits
- `ms-observation-service` - Vitals
- `ms-condition-service` - Diagnoses
- `ms-medication-service` - Prescriptions

**Ancillary**:
- `ms-laboratory-service` - Lab workflow
- `ms-radiology-service` - Imaging workflow
- `ms-pharmacy-service` - Drug dispensing

**Administrative**:
- `ms-appointment-service` - Scheduling
- `ms-billing-service` - Financials
- `ms-inventory-service` - Stock

**Infrastructure**:
- `ms-auth-service` - Security
- `ms-notification-service` - Alerts
- `ms-audit-service` - Compliance

---

## 🔄 Migration Path from Existing Structure

If you have existing code, here's how to reorganize:

### Step 1: Create Monorepos

```bash
# Create frontend monorepos
git clone https://github.com/zs-his/esm-core.git
git clone https://github.com/zs-his/esm-patient-management.git
git clone https://github.com/zs-his/esm-patient-chart.git

# Create backend services
git clone https://github.com/zs-his/ms-patient-registry.git
git clone https://github.com/zs-his/ms-appointment-service.git
```

### Step 2: Move Existing Code

```bash
# If you have existing 02-microservices/ms-patient-registry
mv 02-microservices/ms-patient-registry/* ../ms-patient-registry/

# If you have existing 03-microfrontends/mf-patient-chart
# Reorganize into esm-patient-chart monorepo structure
```

### Step 3: Update Documentation

Update your `docs/` repository structure:
```
docs/
├── 02-microservices/
│   ├── ms-patient-registry/      # Link to service repo
│   ├── ms-appointment-service/
│   └── README.md                 # Index of all services
├── 03-microfrontends/
│   ├── esm-core/                 # Link to monorepo
│   ├── esm-patient-chart/
│   └── README.md                 # Index of all apps
```

---

## 📖 Documentation Standards

Each repository must include:

### Frontend Module README Template

```markdown
# @zs-his/esm-patient-allergies-app

## Overview
Patient allergy management for ZARISH HIS

## Features
- View allergy history
- Add new allergies
- Record reactions
- FHIR AllergyIntolerance resource

## Installation
```bash
yarn add @zs-his/esm-patient-allergies-app
```

## Configuration
See [config schema](./src/config-schema.ts)

## Development
```bash
yarn start
```

## FHIR Resources
- AllergyIntolerance (CRUD)

## Dependencies
- @zs-his/esm-framework
- @zs-his/esm-patient-common-lib
```

### Backend Service README Template

```markdown
# ms-patient-registry

## Overview
Patient master index service for ZARISH HIS

## API Endpoints
- `GET /api/v1/patients`
- `POST /api/v1/patients`
- `GET /fhir/Patient`

## FHIR Resources
- Patient (R5)
- Person
- RelatedPerson

## Technology
- Go 1.25.x
- PostgreSQL 16
- gRPC + REST

## Development
```bash
go run cmd/server/main.go
```

## Database Schema
See [migrations](./internal/infrastructure/database/migrations/)
```

---

## 🎯 Implementation Priorities

### Phase 1: Foundation (Month 1-2)
1. ✅ `esm-core` - Framework
2. ✅ `ms-patient-registry` - Patient data
3. ✅ `ms-auth-service` - Security
4. ✅ `esm-login-app` - Authentication UI
5. ✅ `esm-patient-search-app` - Find patients

### Phase 2: Clinical Core (Month 3-4)
6. `ms-encounter-service` - Visits
7. `ms-observation-service` - Vitals
8. `esm-patient-chart` - Clinical dashboard
9. `esm-patient-vitals-app` - Vitals UI
10. `esm-patient-registration-app` - Registration

### Phase 3: Orders & Ancillary (Month 5-6)
11. `ms-laboratory-service` - Lab workflow
12. `ms-pharmacy-service` - Pharmacy
13. `esm-laboratory-app` - Lab UI
14. `esm-dispensing-app` - Pharmacy UI

### Phase 4: Administrative (Month 7-8)
15. `ms-appointment-service` - Scheduling
16. `ms-billing-service` - Financials
17. `esm-appointments-app` - Scheduling UI
18. `esm-billing-app` - Billing UI

---

## 📞 Getting Started

### For Developers

1. **Clone core framework**:
```bash
git clone https://github.com/zs-his/esm-core.git
cd esm-core
yarn && yarn setup
```

2. **Start dev server**:
```bash
yarn run:shell
```

3. **Add a module**:
```bash
yarn start --sources packages/apps/esm-login-app
```

### For Implementers

See [Implementation Guide](https://zs-his.github.io/docs/) for deployment instructions.

---

**Maintained by**: ZARISH HIS Development Team  
**Version**: 1.0.0  
**Last Updated**: January 21, 2026  
**License**: Apache 2.0