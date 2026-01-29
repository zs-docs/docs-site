# ESM Laboratory

ESM Laboratory is a comprehensive laboratory management system with 8 applications covering test ordering, result entry, quality control, and reporting.

## 📦 Package Structure

ESM Laboratory contains 8 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **test-ordering** | Laboratory test ordering | Test request and specimen tracking |
| **result-entry** | Test result entry | Manual and automated result capture |
| **quality-control** | Quality control management | QC samples and calibration |
| **reporting** | Lab report generation | Patient and provider reports |
| **specimen-tracking** | Specimen management | Collection, transport, storage |
| **equipment** | Lab equipment management | Instrument integration and maintenance |
| **analytics** | Laboratory analytics | Performance metrics and trends |
| **microbiology** | Microbiology module | Culture and sensitivity testing |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-laboratory
```

### Usage
```typescript
import { TestOrdering, ResultEntry, LabReporting } from '@zarish/esm-laboratory';

function LaboratoryDashboard() {
  return (
    <div>
      <TestOrdering />
      <ResultEntry />
      <LabReporting />
    </div>
  );
}
```

## 🔬 Applications

### Test Ordering Application
- **Features**: Test selection, specimen requirements, scheduling
- **FHIR Resources**: ServiceRequest, Specimen
- **Key Features**: Clinical decision support, test panels, urgent orders

### Result Entry Application
- **Features**: Manual entry, instrument integration, validation
- **FHIR Resources**: Observation, DiagnosticReport
- **Key Features**: Auto-validation, reference ranges, critical values

### Quality Control Application
- **Features**: QC samples, calibration tracking, trend analysis
- **Key Features**: Levey-Jennings charts, Westgard rules, proficiency testing

## 🏥 Bangladesh Laboratory Features

### DGHS Integration
- **National Lab Network**: Bangladesh laboratory reporting system
- **Notifiable Diseases**: DGHS mandatory reporting
- **Standard Tests**: Bangladesh national laboratory standards
- **Quality Assurance**: National quality control program

### Local Context
- **Tropical Diseases**: Malaria, dengue, chikungunya testing
- **Regional Pathologies**: Bangladesh-specific disease patterns
- **Resource Constraints**: Cost-effective testing strategies
- **Public Health**: Disease surveillance and outbreak detection

---

*Last updated: 2026-01-21*
