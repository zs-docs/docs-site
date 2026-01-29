# ZARISH HIS Repository Index

Complete index of all 58+ repositories in the ZARISH HIS ecosystem, organized by category and purpose.

## 📊 Repository Statistics

- **Total Repositories**: 58
- **Frontend Monorepos**: 15
- **Backend Microservices**: 25
- **Shared Libraries**: 8
- **Infrastructure & Tools**: 6
- **Documentation**: 4

---

## 🎨 Frontend Monorepos (15 repositories)

### Core Framework

| Repository | Description | Packages | Status | Link |
| ---------- | ----------- | -------- | ------ | ---- |
| **esm-core** | Core framework and shared components | 15 packages | ✅ Active | [GitHub](https://github.com/zs-his/esm-core) |
| **esm-design-system** | Design system and UI tokens | 8 packages | ✅ Active | [GitHub](https://github.com/zs-his/esm-design-system) |

### Patient Management

| Repository | Description | Packages | Status | Link |
| ---------- | ----------- | -------- | ------ | ---- |
| **esm-patient-management** | Patient registration, search, and management | 7 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-patient-management) |
| **esm-patient-chart** | Clinical chart and patient summary | 13+ widgets | ✅ Active | [GitHub](https://github.com/zs-his/esm-patient-chart) |

### Clinical Applications

| Repository | Description | Packages | Status | Link |
| ---------- | ----------- | -------- | ------ | ---- |
| **esm-form-engine** | Dynamic form builder and renderer | 3 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-form-engine) |
| **esm-clinical-workspace** | Unified clinical workspace | 5 apps | 🟡 Beta | [GitHub](https://github.com/zs-his/esm-clinical-workspace) |
| **esm-prescription** | Electronic prescription management | 4 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-prescription) |

### Departmental Applications

| Repository | Description | Packages | Status | Link |
| ---------- | ----------- | -------- | ------ | ---- |
| **esm-pharmacy** | Pharmacy management and dispensing | 6 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-pharmacy) |
| **esm-laboratory** | Laboratory test ordering and results | 8 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-laboratory) |
| **esm-radiology** | Radiology scheduling and imaging | 7 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-radiology) |
| **esm-billing** | Billing and insurance processing | 9 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-billing) |
| **esm-inpatient** | Inpatient management and bed control | 11 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-inpatient) |
| **esm-emergency** | Emergency department management | 8 apps | 🟡 Beta | [GitHub](https://github.com/zs-his/esm-emergency) |
| **esm-surgery** | Surgical scheduling and OR management | 10 apps | 🟡 Beta | [GitHub](https://github.com/zs-his/esm-surgery) |
| **esm-maternal-health** | Maternal and child health services | 9 apps | 🟡 Beta | [GitHub](https://github.com/zs-his/esm-maternal-health) |

### Administrative Applications

| Repository | Description | Packages | Status | Link |
| ---------- | ----------- | -------- | ------ | ---- |
| **esm-admin** | System administration and configuration | 12 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-admin) |
| **esm-reports** | Reporting and analytics dashboard | 15 apps | ✅ Active | [GitHub](https://github.com/zs-his/esm-reports) |
| **esm-inventory** | Inventory and supply chain management | 7 apps | 🟡 Beta | [GitHub](https://github.com/zs-his/esm-inventory) |

### Mobile Applications

| Repository | Description | Packages | Status | Link |
| ---------- | ----------- | -------- | ------ | ---- |
| **esm-mobile** | Mobile patient and provider apps | 4 apps | 🟡 Beta | [GitHub](https://github.com/zs-his/esm-mobile) |

---

## ⚙️ Backend Microservices (25 services)

### Core Services (4 services)

| Service | Description | FHIR Resources | Status | Link |
| ------- | ----------- | -------------- | ------ | ---- |
| **ms-patient-registry** | Patient demographic and medical record management | Patient, RelatedPerson | ✅ Active | [GitHub](https://github.com/zs-his/ms-patient-registry) |
| **ms-practitioner-registry** | Healthcare provider information and credentials | Practitioner, PractitionerRole | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-practitioner-registry) |
| **ms-organization-registry** | Healthcare organization and facility management | Organization, Location | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-organization-registry) |
| **ms-encounter-service** | Clinical encounter and visit management | Encounter, EpisodeOfCare | ✅ Active | [GitHub](https://github.com/zs-his/ms-encounter-service) |

### Clinical Services (6 services)

| Service | Description | FHIR Resources | Status | Link |
| ------- | ----------- | -------------- | ------ | ---- |
| **ms-observation-service** | Clinical observations and vital signs | Observation, DeviceMetric | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-observation-service) |
| **ms-condition-service** | Medical conditions and diagnoses | Condition, AllergyIntolerance | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-condition-service) |
| **ms-medication-service** | Medication management and prescribing | Medication, MedicationRequest | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-medication-service) |
| **ms-procedure-service** | Medical procedures and interventions | Procedure, ServiceRequest | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-procedure-service) |
| **ms-immunization-service** | Immunization records and scheduling | Immunization, ImmunizationRecommendation | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-immunization-service) |
| **ms-diagnostic-service** | Diagnostic reports and results | DiagnosticReport, Specimen | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-diagnostic-service) |

### Ancillary Services (4 services)

| Service | Description | FHIR Resources | Status | Link |
| ------- | ----------- | -------------- | ------ | ---- |
| **ms-laboratory-service** | Laboratory test management | Observation, DiagnosticReport | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-laboratory-service) |
| **ms-radiology-service** | Radiology imaging and reports | ImagingStudy, DiagnosticReport | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-radiology-service) |
| **ms-pharmacy-service** | Pharmacy operations and dispensing | Medication, MedicationDispense | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-pharmacy-service) |
| **ms-blood-bank-service** | Blood bank and donation management | BiologicallyDerivedProduct | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-blood-bank-service) |

### Administrative Services (5 services)

| Service | Description | FHIR Resources | Status | Link |
| ------- | ----------- | -------------- | ------ | ---- |
| **ms-appointment-service** | Appointment scheduling and management | Appointment, Schedule | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-appointment-service) |
| **ms-billing-service** | Billing and financial transactions | Account, Invoice, Claim | ✅ Active | [GitHub](https://github.com/zs-his/ms-billing-service) |
| **ms-inventory-service** | Inventory and supply chain management | SupplyDelivery, InventoryItem | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-inventory-service) |
| **ms-bed-management** | Hospital bed allocation and management | Location, Slot | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-bed-management) |
| **ms-queue-service** | Patient queue and flow management | List, Task | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-queue-service) |

### Infrastructure Services (6 services)

| Service | Description | Purpose | Status | Link |
| --- | --- | --- | --- | --- |
| **ms-auth-service** | Authentication and authorization | Security, JWT tokens | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-auth-service) |
| **ms-notification-service** | Notifications and alerts | Communication | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-notification-service) |
| **ms-audit-service** | Audit logging and compliance | Security, compliance | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-audit-service) |
| **ms-integration-hub** | External system integration | Interoperability | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-integration-hub) |
| **ms-report-service** | Report generation and analytics | Business intelligence | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-report-service) |
| **ms-workflow-engine** | Workflow orchestration | Process automation | 🟡 In Progress | [GitHub](https://github.com/zs-his/ms-workflow-engine) |

---

## 📚 Shared Libraries (8 repositories)

### Frontend Libraries

| Library | Description | Purpose | Status | Link |
| --- | --- | --- | --- | --- |
| **lib-fhir-utils** | FHIR utilities and helpers | Frontend FHIR operations | ✅ Active | [GitHub](https://github.com/zs-his/lib-fhir-utils) |
| **lib-ui-components** | Reusable UI components | Component library | ✅ Active | [GitHub](https://github.com/zs-his/lib-ui-components) |
| **lib-form-validators** | Form validation utilities | Form validation | ✅ Active | [GitHub](https://github.com/zs-his/lib-form-validators) |

### Backend Libraries

| Library | Description | Purpose | Status | Link |
| --- | --- | --- | --- | --- |
| **lib-go-fhir** | Go FHIR utilities | Backend FHIR operations | ✅ Active | [GitHub](https://github.com/zs-his/lib-go-fhir) |
| **lib-go-common** | Common Go utilities | Shared backend functionality | ✅ Active | [GitHub](https://github.com/zs-his/lib-go-common) |
| **lib-go-auth** | Authentication library | Security and auth | ✅ Active | [GitHub](https://github.com/zs-his/lib-go-auth) |
| **lib-go-events** | Event streaming utilities | Kafka integration | ✅ Active | [GitHub](https://github.com/zs-his/lib-go-events) |
| **lib-go-cache** | Caching utilities | Redis integration | ✅ Active | [GitHub](https://github.com/zs-his/lib-go-cache) |

---

## 🏗️ Infrastructure & Tools (6 repositories)

### Infrastructure

| Repository | Description | Purpose | Status | Link |
| --- | --- | --- | --- | --- |
| **api-gateway** | API gateway and load balancer | Traffic management | ✅ Active | [GitHub](https://github.com/zs-his/api-gateway) |
| **fhir-gateway** | FHIR-specific gateway | FHIR routing | 🟡 In Progress | [GitHub](https://github.com/zs-his/fhir-gateway) |
| **hl7-adapter** | HL7 v2 integration | Legacy system support | 🟡 In Progress | [GitHub](https://github.com/zs-his/hl7-adapter) |
| **dghs-connector** | DGHS system integration | Government systems | 🟡 In Progress | [GitHub](https://github.com/zs-his/dghs-connector) |
| **insurance-gateway** | Insurance company integration | Claims processing | 🟡 In Progress | [GitHub](https://github.com/zs-his/insurance-gateway) |

### Tools

| Repository | Description | Purpose | Status | Link |
| --- | --- | --- | --- | --- |
| **fhir-ig-publisher** | FHIR Implementation Guide publisher | Documentation generation | ✅ Active | [GitHub](https://github.com/zs-his/fhir-ig-publisher) |

---

## 📖 Documentation (4 repositories)

| Repository | Description | Purpose | Status | Link |
| --- | --- | --- | --- | --- |
| **docs** | Main documentation repository | Complete system documentation | ✅ Active | [GitHub](https://github.com/zs-his/docs) |
| **clinical-guidelines** | Clinical practice guidelines | Medical protocols | 🟡 In Progress | [GitHub](https://github.com/zs-his/clinical-guidelines) |
| **training-materials** | Training and onboarding materials | User education | 🟡 In Progress | [GitHub](https://github.com/zs-his/training-materials) |
| **api-examples** | API usage examples | Developer resources | 🟡 In Progress | [GitHub](https://github.com/zs-his/api-examples) |

---

## 📈 Development Status Legend

- ✅ **Active**: Fully developed and in production
- 🟡 **In Progress**: Under development, beta testing
- 🔴 **Planned**: Planned for future development
- ⚪ **Deprecated**: No longer maintained

---

## 🔗 Quick Links

### Development Resources

- **GitHub Organization**: https://github.com/zs-his
- **Documentation**: https://zs-his.github.io/docs/
- **API Documentation**: https://zs-his.github.io/docs/docs-generated/
- **FHIR Implementation Guide**: https://zs-his.github.io/docs/fhir-ig/

### Project Management

- **Project Board**: https://github.com/orgs/zs-his/projects
- **Issue Tracking**: https://github.com/zs-his/docs/issues
- **Release Notes**: https://github.com/zs-his/docs/releases

---

_Last updated: 2026-01-21_  
_Repository count: 58_
