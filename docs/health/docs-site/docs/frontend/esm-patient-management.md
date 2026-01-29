# ESM Patient Management

ESM Patient Management is a comprehensive frontend monorepo for all patient-related workflows in ZARISH HIS, including registration, search, visits, and appointments.

## 📦 Package Structure

ESM Patient Management contains 7 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **patient-registration** | New patient registration | Demographics and medical history |
| **patient-search** | Advanced patient search | Find existing patients |
| **patient-list** | Patient list management | Browse and filter patients |
| **active-visits** | Current patient visits | Manage ongoing encounters |
| **appointments** | Appointment scheduling | Book and manage appointments |
| **outpatient** | Outpatient workflow | OPD patient management |
| **service-queues** | Queue management | Patient flow and queuing |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-patient-management
```

### Usage
```typescript
import { PatientRegistration, PatientSearch } from '@zarish/esm-patient-management';

function App() {
  return (
    <div>
      <PatientRegistration />
      <PatientSearch />
    </div>
  );
}
```

## 📱 Applications

### Patient Registration
- **Features**: Demographics, medical history, insurance info
- **FHIR Resources**: Patient, RelatedPerson
- **Key Components**: RegistrationForm, MedicalHistory, InsuranceInfo

### Patient Search
- **Features**: Advanced search, filters, duplicate detection
- **FHIR Resources**: Patient
- **Key Components**: SearchForm, PatientCard, SearchResults

### Active Visits
- **Features**: Current encounters, status tracking
- **FHIR Resources**: Encounter
- **Key Components**: VisitList, VisitStatus, EncounterDetails

---

*Last updated: 2026-01-21*
