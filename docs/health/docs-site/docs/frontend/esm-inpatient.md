# ESM Inpatient

ESM Inpatient is a comprehensive inpatient management system with 11 applications covering bed management, ward operations, and discharge planning.

## 📦 Package Structure

ESM Inpatient contains 11 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **bed-management** | Bed allocation and tracking | Real-time bed availability |
| **ward-management** | Ward operations | Daily ward activities |
| **admission-discharge** | Patient flow management | Admission and discharge processes |
| **nursing-station** | Nursing documentation | Care plans and documentation |
| **physician-rounds** | Doctor rounds management | Clinical workflow support |
| **medication-administration** | Inpatient medication | Drug administration tracking |
| **vital-signs** | Vitals monitoring | Continuous vitals tracking |
| **clinical-documentation** | Clinical records | Progress notes and documentation |
| **discharge-planning** | Discharge process | Discharge planning and summary |
| **transfer-management** | Patient transfers | Inter-department transfers |
| **inpatient-billing** | Inpatient charges | Room and service charges |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-inpatient
```

### Usage
```typescript
import { BedManagement, WardManagement, NursingStation } from '@zarish/esm-inpatient';

function InpatientDashboard() {
  return (
    <div>
      <BedManagement />
      <WardManagement />
      <NursingStation />
    </div>
  );
}
```

## 🏥 Applications

### Bed Management Application
- **Features**: Real-time bed tracking, allocation, cleaning status
- **FHIR Resources**: Location, Slot, Encounter
- **Key Features**: Bed availability dashboard, transfer scheduling, maintenance tracking

### Ward Management Application
- **Features**: Ward overview, patient census, staff assignment
- **FHIR Resources**: Encounter, Location, PractitionerRole
- **Key Features**: Ward census, staff scheduling, patient tracking

### Nursing Station Application
- **Features**: Care plans, medication administration, documentation
- **FHIR Resources**: CarePlan, MedicationAdministration, Observation
- **Key Features**: Task management, documentation, care coordination

## 🏥 Bangladesh Inpatient Features

### Hospital Standards
- **DGHS Guidelines**: Bangladesh hospital standards
- **Bed Ratios**: Government-mandated bed-to-patient ratios
- **Nursing Standards**: Bangladesh nursing protocols
- **Documentation**: Local documentation requirements

### Cultural Considerations
- **Family Involvement**: Extended family participation in care
- **Language Support**: Bengali language interface
- **Religious Practices**: Prayer times, dietary requirements
- **Local Practices**: Traditional medicine integration

---

*Last updated: 2026-01-21*
