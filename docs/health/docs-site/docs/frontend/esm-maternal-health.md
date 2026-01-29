# ESM Maternal Health

ESM Maternal Health is a comprehensive maternal and child health management system with 9 applications covering antenatal care, delivery, and postnatal care.

## 📦 Package Structure

ESM Maternal Health contains 9 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **antenatal-care** | Antenatal care management | Pregnancy monitoring and care |
| **delivery-management** | Delivery and childbirth | Labor and delivery support |
| **postnatal-care** | Postnatal follow-up | Mother and baby care after birth |
| **family-planning** | Family planning services | Contraception and counseling |
| **high-risk-pregnancy** | High-risk pregnancy management | Complicated pregnancy care |
| **newborn-care** | Newborn care services | Neonatal care and immunization |
| **maternal-health-education** | Patient education | Health education and counseling |
| **nutrition-tracking** | Maternal nutrition | Nutritional monitoring and support |
| **community-outreach** | Community maternal health | Community-based maternal services |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-maternal-health
```

### Usage
```typescript
import { AntenatalCare, DeliveryManagement, PostnatalCare } from '@zarish/esm-maternal-health';

function MaternalHealthDashboard() {
  return (
    <div>
      <AntenatalCare />
      <DeliveryManagement />
      <PostnatalCare />
    </div>
  );
}
```

## 👶 Applications

### Antenatal Care Application
- **Features**: Pregnancy tracking, risk assessment, immunization
- **FHIR Resources**: Encounter, Observation, Condition, Immunization
- **Key Features**: Gestational age calculation, risk scoring, appointment scheduling

### Delivery Management Application
- **Features**: Labor monitoring, delivery documentation, newborn care
- **FHIR Resources**: Procedure, Encounter, Observation
- **Key Features**: Partogram, delivery timeline, newborn assessment

### Postnatal Care Application
- **Features**: Postpartum follow-up, newborn care, family planning
- **FHIR Resources**: Encounter, Observation, CarePlan
- **Key Features**: Postpartum depression screening, breastfeeding support, vaccination

## 🏥 Bangladesh Maternal Health Features

### National Programs
- **DGHS Maternal Health**: Bangladesh maternal health guidelines
- **Safe Motherhood**: National safe motherhood program
- **ANC Standards**: Antenatal care protocols
- **Immunization Schedule**: Bangladesh EPI schedule

### Cultural Context
- **Traditional Practices**: Cultural beliefs and practices
- **Family Involvement**: Extended family participation
- **Community Health**: Community health worker integration
- **Rural Healthcare**: Remote area maternal care

### Quality Indicators
- **Maternal Mortality**: Bangladesh maternal mortality tracking
- **Infant Mortality**: Neonatal and infant mortality reduction
- **Immunization Coverage**: Maternal and child immunization rates
- **Skilled Birth Attendance**: Facility-based delivery promotion

---

*Last updated: 2026-01-21*
