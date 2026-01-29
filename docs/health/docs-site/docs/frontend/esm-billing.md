# ESM Billing

ESM Billing is a comprehensive billing and financial management system with 9 applications covering service billing, insurance processing, and financial reporting.

## 📦 Package Structure

ESM Billing contains 9 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **service-billing** | Service charge billing | Hospital service pricing and billing |
| **insurance-processing** | Insurance claims processing | Third-party payer management |
| **patient-billing** | Patient billing | Patient invoices and payments |
| **revenue-cycle** | Revenue cycle management | End-to-end revenue tracking |
| **pricing** | Service pricing | Price master and contracts |
| **payment-processing** | Payment processing | Multiple payment methods |
| **financial-reporting** | Financial reports | Revenue and cost analysis |
| **audit-compliance** | Audit and compliance | Regulatory compliance tracking |
| **analytics** | Billing analytics | Revenue optimization insights |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-billing
```

### Usage
```typescript
import { ServiceBilling, InsuranceProcessing, PatientBilling } from '@zarish/esm-billing';

function BillingDashboard() {
  return (
    <div>
      <ServiceBilling />
      <InsuranceProcessing />
      <PatientBilling />
    </div>
  );
}
```

## 💰 Applications

### Service Billing Application
- **Features**: Service charge calculation, package pricing, discounts
- **FHIR Resources**: Account, Invoice, ChargeItem
- **Key Features**: Dynamic pricing, promotional offers, corporate pricing

### Insurance Processing Application
- **Features**: Claim submission, eligibility verification, payment posting
- **FHIR Resources**: Coverage, Claim, ExplanationOfBenefit
- **Key Features**: EDI integration, claim scrubbing, denial management

### Patient Billing Application
- **Features**: Invoice generation, payment processing, statements
- **FHIR Resources**: Account, Invoice, PaymentNotice
- **Key Features**: Multiple payment methods, payment plans, online payments

## 🏥 Bangladesh Billing Features

### Insurance Integration
- **Local Insurance**: Bangladesh insurance companies
- **Government Schemes**: National health insurance programs
- **Corporate Billing**: Employer-sponsored health plans
- **Cashless Facilities**: Direct billing arrangements

### Regulatory Compliance
- **DGHS Pricing**: Government-mandated service prices
- **Tax Compliance**: VAT and tax regulations
- **Medical Billing Codes**: Bangladesh-specific coding
- **Audit Requirements**: Local audit standards

### Payment Methods
- **Digital Payments**: Mobile banking, bKash, Nagad
- **Bank Transfers**: Traditional banking methods
- **Credit Cards**: Local and international cards
- **Cash Payments**: Traditional cash handling

---

*Last updated: 2026-01-21*
