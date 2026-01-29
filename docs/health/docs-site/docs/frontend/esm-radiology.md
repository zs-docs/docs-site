# ESM Radiology

ESM Radiology is a comprehensive radiology management system with 7 applications covering imaging scheduling, DICOM management, and radiology reporting.

## 📦 Package Structure

ESM Radiology contains 7 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **imaging-scheduling** | Radiology scheduling | Appointment and resource booking |
| **dicom-viewer** | DICOM image viewer | Medical image display and manipulation |
| **reporting** | Radiology reporting | Report generation and signing |
| **worklist** | Radiology worklist | Study management and prioritization |
| **quality-assurance** | QA and accreditation | Quality control and compliance |
| **radiation-safety** | Radiation dose tracking | Patient and staff dose monitoring |
| **analytics** | Radiology analytics | Performance metrics and utilization |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-radiology
```

### Usage
```typescript
import { ImagingScheduling, DicomViewer, RadiologyReporting } from '@zarish/esm-radiology';

function RadiologyDashboard() {
  return (
    <div>
      <ImagingScheduling />
      <DicomViewer />
      <RadiologyReporting />
    </div>
  );
}
```

## 📷 Applications

### Imaging Scheduling Application
- **Features**: Modality scheduling, resource allocation, patient preparation
- **FHIR Resources**: ImagingStudy, ServiceRequest, Appointment
- **Key Features**: Modality-specific scheduling, contrast preparation, protocol selection

### DICOM Viewer Application
- **Features**: Image display, manipulation, measurements, annotations
- **FHIR Resources**: ImagingStudy, Media
- **Key Features**: Multi-planar reconstruction, window/level, measurements, annotations

### Reporting Application
- **Features**: Structured reporting, voice recognition, report signing
- **FHIR Resources**: DiagnosticReport, Observation
- **Key Features**: Templates, speech-to-text, peer review, critical findings

## 🏥 Bangladesh Radiology Features

### Equipment Standards
- **Bangladesh Standards**: Local equipment specifications and maintenance
- **Resource Optimization**: Cost-effective imaging strategies
- **Public Health**: Population screening programs
- **Tele-radiology**: Remote reading and consultation

### Clinical Protocols
- **Tropical Diseases**: Imaging patterns for local diseases
- **Trauma Imaging**: Bangladesh-specific injury patterns
- **Women's Health**: Mammography and obstetric imaging
- **Pediatric Imaging**: Age-appropriate protocols

---

*Last updated: 2026-01-21*
