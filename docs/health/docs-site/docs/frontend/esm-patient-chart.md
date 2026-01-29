# ESM Patient Chart

ESM Patient Chart provides comprehensive clinical visualization and patient summary capabilities with 13+ interactive widgets for clinical decision support.

## 📦 Package Structure

ESM Patient Chart contains 13+ widgets:

| Widget | Description | Purpose |
|--------|-------------|---------|
| **vitals-widget** | Vital signs visualization | Blood pressure, temperature, heart rate |
| **medications-widget** | Current medications | Active prescriptions and history |
| **allergies-widget** | Allergy information | Known allergies and reactions |
| **conditions-widget** | Medical conditions | Active and historical diagnoses |
| **lab-results-widget** | Laboratory results | Test results and trends |
| **imaging-widget** | Radiology images | DICOM viewer and reports |
| **procedures-widget** | Medical procedures | Surgical and diagnostic procedures |
| **immunizations-widget** | Vaccination records | Immunization history |
| **appointments-widget** | Upcoming appointments | Scheduled visits and follow-ups |
| **documents-widget** | Medical documents | Attachments and reports |
| **family-history-widget** | Family medical history | Hereditary conditions |
| **social-history-widget** | Social determinants | Lifestyle and social factors |
| **clinical-notes-widget** | Progress notes | Provider documentation |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-patient-chart
```

### Usage
```typescript
import { PatientChart, VitalsWidget, MedicationsWidget } from '@zarish/esm-patient-chart';

function PatientDashboard({ patientId }: { patientId: string }) {
  return (
    <PatientChart patientId={patientId}>
      <VitalsWidget />
      <MedicationsWidget />
      <AllergiesWidget />
      <ConditionsWidget />
    </PatientChart>
  );
}
```

## 📊 Key Widgets

### Vitals Widget
- **Features**: Real-time vitals, trend analysis, alerts
- **FHIR Resources**: Observation, DeviceMetric
- **Visualizations**: Line charts, gauges, color-coded alerts

### Medications Widget
- **Features**: Active medications, dosing, interactions
- **FHIR Resources**: MedicationRequest, MedicationStatement
- **Features**: Drug interaction alerts, refill reminders

### Lab Results Widget
- **Features**: Test results, trends, abnormal values
- **FHIR Resources**: DiagnosticReport, Observation
- **Visualizations**: Charts, graphs, reference ranges

---

*Last updated: 2026-01-21*
