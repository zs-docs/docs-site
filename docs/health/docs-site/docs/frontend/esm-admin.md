# ESM Admin

ESM Admin is a comprehensive system administration and configuration platform with 12 applications covering user management, system configuration, and administrative workflows.

## 📦 Package Structure

ESM Admin contains 12 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **user-management** | User administration | User accounts and permissions |
| **role-management** | Role and permission management | RBAC and access control |
| **system-configuration** | System settings | Application configuration |
| **facility-management** | Facility administration | Hospital and clinic setup |
| **department-management** | Department configuration | Department and service setup |
| **audit-logs** | Audit and compliance | System activity monitoring |
| **backup-restore** | Data backup and recovery | System data management |
| **system-monitoring** | Performance monitoring | Health and performance tracking |
| **integration-management** | System integrations | Third-party system connections |
| **reporting-admin** | Administrative reports | System and operational reports |
| **security-admin** | Security management | Security policies and monitoring |
| **maintenance** | System maintenance | Updates and maintenance tasks |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-admin
```

### Usage
```typescript
import { UserManagement, SystemConfiguration, FacilityManagement } from '@zarish/esm-admin';

function AdminDashboard() {
  return (
    <div>
      <UserManagement />
      <SystemConfiguration />
      <FacilityManagement />
    </div>
  );
}
```

## ⚙️ Applications

### User Management Application
- **Features**: User creation, profile management, password policies
- **FHIR Resources**: Practitioner, Person, RelatedPerson
- **Key Features**: Multi-factor authentication, user lifecycle management

### Role Management Application
- **Features**: Role creation, permission assignment, access control
- **Key Features**: Role-based access control (RBAC), permission inheritance
- **Security Features**: Principle of least privilege, audit trails

### System Configuration Application
- **Features**: Application settings, feature flags, system parameters
- **Key Features**: Environment-specific configs, dynamic configuration
- **Management**: Version control, rollback capabilities

## 🏥 Bangladesh Admin Features

### Regulatory Compliance
- **DGHS Requirements**: Bangladesh health system requirements
- **Data Privacy**: Bangladesh data protection regulations
- **Audit Standards**: Local audit and compliance requirements
- **Reporting**: Government-mandated reporting

### Localization
- **Bangla Language**: Bengali language support
- **Local Standards**: Bangladesh healthcare standards
- **Time Zones**: Bangladesh Standard Time (BST)
- **Currency**: BDT currency support

### Integration
- **Government Systems**: DGHS integration
- **Local Partnerships**: Bangladesh healthcare partners
- **Payment Systems**: Local payment gateway integration
- **Identity Systems**: National ID integration

---

*Last updated: 2026-01-21*
