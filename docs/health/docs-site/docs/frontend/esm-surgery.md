# ESM Surgery

ESM Surgery is a comprehensive surgical management system with 10 applications covering OR scheduling, surgical documentation, and perioperative care.

## 📦 Package Structure

ESM Surgery contains 10 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **or-scheduling** | Operating room scheduling | Surgery booking and resource allocation |
| **pre-operative** | Pre-operative assessment | Surgical clearance and preparation |
| **intra-operative** | Intra-op documentation | Real-time surgical documentation |
| **post-operative** | Post-operative care | Recovery monitoring and complications |
| **anesthesia** | Anesthesia management | Anesthesia records and monitoring |
| **surgical-instruments** | Instrument tracking | Surgical instrument management |
| **implant-tracking** | Implant management | Medical device tracking |
| **surgical-reporting** | Operative reports | Surgical documentation and reporting |
| **quality-metrics** | Surgical quality | Outcome tracking and quality metrics |
| **surgical-billing** | Surgical charges | Procedure billing and coding |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-surgery
```

### Usage
```typescript
import { ORScheduling, PreOperative, IntraOperative } from '@zarish/esm-surgery';

function SurgeryDashboard() {
  return (
    <div>
      <ORScheduling />
      <PreOperative />
      <IntraOperative />
    </div>
  );
}
```

## 🔪 Applications

### OR Scheduling Application
- **Features**: Surgery scheduling, resource allocation, conflict resolution
- **FHIR Resources**: ServiceRequest, Appointment, Schedule
- **Key Features**: Block scheduling, case prioritization, resource optimization

### Pre-operative Application
- **Features**: Surgical clearance, risk assessment, patient preparation
- **FHIR Resources**: Procedure, Condition, Observation
- **Key Features**: ASA scoring, risk assessment, preparation checklists

### Intra-operative Application
- **Features**: Real-time documentation, team communication, time tracking
- **FHIR Resources**: Procedure, Observation, Device
- **Key Features: Surgical timeout, time stamps, team roles documentation

## 🏥 Bangladesh Surgery Features

### Surgical Standards
- **DGHS Surgical Protocols**: Bangladesh surgical guidelines
- **Resource Optimization**: Cost-effective surgical care
- **Training Programs**: Surgical residency and training
- **Quality Assurance**: Surgical safety programs

### Local Context
- **Common Procedures**: High-volume surgeries in Bangladesh
- **Resource Constraints**: Equipment and supply limitations
- **Training Needs**: Surgical skill development
- **Quality Metrics**: Bangladesh-specific outcome tracking

---

*Last updated: 2026-01-21*
