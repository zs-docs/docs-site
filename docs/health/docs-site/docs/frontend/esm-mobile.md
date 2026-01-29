# ESM Mobile

ESM Mobile is a comprehensive mobile application suite with 4 applications providing native and web-based mobile solutions for patients, providers, and administrators.

## 📦 Package Structure

ESM Mobile contains 4 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **patient-app** | Patient mobile app | Patient portal and self-service |
| **provider-app** | Provider mobile app | Clinical mobile access |
| **admin-app** | Admin mobile app | Administrative mobile access |
| **mobile-web** | Mobile web app | Progressive web application |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-mobile
```

### Usage
```typescript
import { PatientApp, ProviderApp, MobileWeb } from '@zarish/esm-mobile';

function MobileSuite() {
  return (
    <div>
      <PatientApp />
      <ProviderApp />
      <MobileWeb />
    </div>
  );
}
```

## 📱 Applications

### Patient Mobile Application
- **Features**: Appointments, results, prescriptions, payments
- **FHIR Resources**: Patient, Appointment, DiagnosticReport, MedicationRequest
- **Key Features**: Appointment booking, test results, medication reminders

### Provider Mobile Application
- **Features**: Patient lookup, schedules, messaging, documentation
- **FHIR Resources**: Practitioner, Encounter, Observation, Communication
- **Key Features**: Secure messaging, patient search, clinical documentation

### Mobile Web Application
- **Features**: Progressive web app, offline support, push notifications
- **Key Features**: Responsive design, offline caching, native-like experience

## 🏥 Bangladesh Mobile Features

### Localization
- **Bangla Language**: Bengali language interface
- **Local Context**: Bangladesh healthcare context
- **Cultural Adaptation**: Culturally appropriate design
- **Accessibility**: Accessibility for diverse users

### Connectivity
- **Offline Support**: Limited internet connectivity support
- **SMS Integration**: SMS-based services
- **USSD Support**: Basic phone compatibility
- **Data Optimization**: Low-bandwidth optimization

### Integration
- **Mobile Banking**: bKash, Nagad, Rocket integration
- **National ID**: Bangladesh ID verification
- **Health Cards**: Digital health card integration
- **Emergency Services**: Emergency contact and services

---

*Last updated: 2026-01-21*
