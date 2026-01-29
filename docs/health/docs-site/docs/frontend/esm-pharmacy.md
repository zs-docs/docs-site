# ESM Pharmacy

ESM Pharmacy is a comprehensive pharmacy management system with 6 applications covering dispensing, inventory, prescriptions, and clinical pharmacy services.

## 📦 Package Structure

ESM Pharmacy contains 6 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **dispensing** | Medication dispensing | Prescription processing and dispensing |
| **inventory** | Pharmacy inventory | Stock management and tracking |
| **prescription** | Prescription management | Electronic prescribing |
| **clinical-pharmacy** | Clinical pharmacy services | Drug therapy monitoring |
| **procurement** | Drug procurement | Purchase order management |
| **reporting** | Pharmacy reports | Analytics and compliance reports |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-pharmacy
```

### Usage
```typescript
import { DispensingApp, InventoryApp } from '@zarish/esm-pharmacy';

function PharmacyDashboard() {
  return (
    <div>
      <DispensingApp />
      <InventoryApp />
    </div>
  );
}
```

## 💊 Applications

### Dispensing Application
- **Features**: Prescription validation, drug selection, patient counseling
- **FHIR Resources**: MedicationDispense, MedicationRequest
- **Key Features**: Barcode scanning, dosage calculations, drug interactions

### Inventory Application
- **Features**: Stock tracking, expiry monitoring, reorder points
- **FHIR Resources**: InventoryItem, SupplyDelivery
- **Key Features**: Batch tracking, cold chain monitoring, cost analysis

### Prescription Application
- **Features**: Electronic prescribing, drug selection, dosage calculations
- **FHIR Resources**: MedicationRequest, MedicationStatement
- **Key Features**: Clinical decision support, formulary integration, e-prescribing

## 🏥 Bangladesh Pharmacy Features

### Drug Registration
- **DGHS Integration**: Bangladesh drug regulatory database
- **Local Formulary**: Bangladesh essential medicines list
- **Pricing**: Government-mandated drug pricing
- **Regulations**: Bangladesh Pharmacy Act compliance

### Clinical Pharmacy
- **Therapeutic Drug Monitoring**: Blood level tracking
- **Drug Information**: Bangladesh-specific drug information
- **Adverse Drug Reactions**: Pharmacovigilance reporting
- **Medication Therapy Management**: Patient counseling

---

*Last updated: 2026-01-21*
