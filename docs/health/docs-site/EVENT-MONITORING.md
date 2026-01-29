# ZARISH HIS Event-Driven Architecture Monitoring Report

Generated: 2026-01-21T05:12:45.408087

## 📊 Service Health Overview

- **Total Services**: 2
- **Services with Events**: 1
- **Services Documented**: 2

## 🔄 Event Flow Patterns

### Patient Lifecycle

- **PatientUpdatedEvent** (from ms-patient-registry)
- **PatientDeactivatedEvent** (from ms-patient-registry)
- **PatientCreatedEvent   = "patient.created"** (from ms-patient-registry)
- **PatientCreatedEvent** (from ms-patient-registry)
- **PatientMergedEvent** (from ms-patient-registry)

## 🏗️ Service Details

### ms-patient-registry

- **Path**: `/home/runner/work/docs/docs/02-microservices/ms-patient-registry`
- **Last Updated**: 2026-01-21T05:12:38.395965
- **Events Published**: PatientUpdatedEvent, PatientDeactivatedEvent, PatientCreatedEvent   = "patient.created", PatientCreatedEvent, PatientMergedEvent

### ms-billing-engine

- **Path**: `/home/runner/work/docs/docs/02-microservices/ms-billing-engine`
- **Last Updated**: 2026-01-21T05:12:38.395965
- **Events Published**: None documented

## 💡 Recommendations

- Consider documenting event publishing patterns for services without events
- Add security/audit events for compliance monitoring
- Consider adding event schema validation
- Implement event replay capabilities for debugging
