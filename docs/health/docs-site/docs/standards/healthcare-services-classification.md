# Healthcare Services Classification & Standards

## 🎯 Overview

This document defines the comprehensive classification of healthcare services within ZARISH HIS, supporting Bangladesh healthcare context, Rohingya refugee integration, and FHIR R5 compliance.

## 🏥 Service Categories

### GROUP A - Community Health Outreach

#### 1. Health Education & RCCE
**Risk Communication and Community Engagement**
- **Purpose**: Community health education and awareness
- **Activities**: Health campaigns, information dissemination
- **Target Groups**: General population, specific risk groups
- **Service Code**: `HE-RCCE`
- **FHIR Resource**: `Communication` + `Procedure`

#### 2. Community Mobilization
**Community Organization and Participation**
- **Purpose**: Engage community in health initiatives
- **Activities**: Community meetings, volunteer coordination
- **Target Groups**: Community leaders, volunteers
- **Service Code**: `CM-MOB`
- **FHIR Resource**: `Group` + `CarePlan`

#### 3. Screening & Triage
**Initial Health Assessment**
- **Purpose**: Early detection and prioritization
- **Activities**: Vital signs screening, symptom assessment
- **Target Groups**: All community members
- **Service Code**: `ST-TRIAGE`
- **FHIR Resource**: `Encounter` + `Observation`

#### 4. Referral Management
**Patient Referral Coordination**
- **Purpose**: Coordinate patient referrals
- **Activities**: Referral tracking, follow-up coordination
- **Target Groups**: Referred patients
- **Service Code**: `RF-MGMT`
- **FHIR Resource**: `ReferralRequest` + `ServiceRequest`

#### 5. Follow-up Tracking
**Post-Visit Monitoring**
- **Purpose**: Monitor patient progress
- **Activities**: Home visits, phone follow-ups
- **Target Groups**: Discharged patients
- **Service Code**: `FU-TRACK`
- **FHIR Resource**: `Encounter` + `CarePlan`

#### 6. Community Based Surveillance
**Disease Monitoring**
- **Purpose**: Track disease patterns
- **Activities**: Active case finding, reporting
- **Target Groups**: Community surveillance
- **Service Code**: `CBS-SURV`
- **FHIR Resource**: `Observation` + `Condition`

#### 7. Contact Tracing
**Exposure Tracking**
- **Purpose**: Track disease exposure
- **Activities**: Contact identification, monitoring
- **Target Groups**: Contacts of confirmed cases
- **Service Code**: `CT-TRACE`
- **FHIR Resource**: `Encounter` + `Location`

#### 8. Outbreak Reporting
**Epidemic Response**
- **Purpose**: Rapid outbreak response
- **Activities**: Case reporting, response coordination
- **Target Groups**: Health authorities
- **Service Code**: `OR-REPORT`
- **FHIR Resource**: `Communication` + `Organization`

#### 9. Emergency Medical Services
**Emergency Response**
- **Purpose**: Emergency medical care
- **Activities**: Ambulance services, emergency treatment
- **Target Groups**: Emergency cases
- **Service Code**: `EMS-EMERG`
- **FHIR Resource**: `Encounter` + `Procedure`

#### 10. Non-Lab Based CVD Risk Assessment
**Cardiovascular Screening**
- **Purpose**: CVD risk evaluation
- **Activities**: Risk factor assessment, counseling
- **Target Groups**: At-risk population
- **Service Code**: `CVD-RISK`
- **FHIR Resource**: `RiskAssessment` + `Observation`

#### 11. HCV Intervention
**Hepatitis C Treatment**
- **Purpose**: Hepatitis C management
- **Activities**: Screening, treatment, follow-up
- **Target Groups**: HCV patients
- **Service Code**: `HCV-TREAT`
- **FHIR Resource**: `Condition` + `MedicationRequest`

### GROUP B - Health Facility Services

#### B-01) Out Patient Department (OPD)

##### 1. General OPD
**Foundations of Primary Care**
- **Purpose**: Primary healthcare services
- **Activities**: Consultations, basic treatment
- **Target Groups**: General population
- **Service Code**: `GOPD-GENERAL`
- **FHIR Resource**: `Encounter` + `Condition`
- **Unique ID**: Optional for general services

##### 2. Maternal Health
**ANC, PNC, Family Planning**
- **Purpose**: Maternal and reproductive health
- **Activities**: Antenatal care, postnatal care, family planning
- **Target Groups**: Women of reproductive age
- **Service Code**: `MH-MATERNAL`
- **FHIR Resource**: `Encounter` + `CarePlan`
- **Unique ID**: Mandatory for chronic services

##### 3. Child Health
**IMCI, Immunization, Growth Monitoring**
- **Purpose**: Child healthcare services
- **Activities**: IMCI, vaccinations, growth monitoring
- **Target Groups**: Children under 5
- **Service Code**: `CH-CHILD`
- **FHIR Resource**: `Immunization` + `Observation`
- **Unique ID**: Optional for general services

##### 4. NCD Corner
**Non-Communicable Disease Management**
- **Purpose**: Chronic disease management
- **Activities**: NCD screening, treatment, follow-up
- **Target Groups**: Chronic disease patients
- **Service Code**: `NCD-CORNER`
- **FHIR Resource**: `Condition` + `CarePlan`
- **Unique ID**: **MANDATORY** for all NCD services

##### 5. Mental Health
**Basic Counseling, Referral**
- **Purpose**: Mental health support
- **Activities**: Counseling, psychological support, referral
- **Target Groups**: Mental health patients
- **Service Code**: `MH-BASIC`
- **FHIR Resource**: `Encounter` + `ServiceRequest`
- **Unique ID**: Mandatory for specialized services

##### 6. Emergency Stabilization and Referral
**Emergency Care**
- **Purpose**: Emergency medical stabilization
- **Activities**: Wound management, fracture stabilization, referral
- **Target Groups**: Emergency cases
- **Service Code**: `ER-STAB`
- **FHIR Resource**: `Encounter` + `Procedure`
- **Unique ID**: Optional for emergency services

#### B-02) In Patient Department (IPD)

##### 1. Medical Ward
**Communicable & NCDs**
- **Purpose**: Inpatient medical care
- **Activities**: Medical treatment, monitoring
- **Target Groups**: Admitted medical patients
- **Service Code**: `IPD-MEDICAL`
- **FHIR Resource**: `Encounter` + `MedicationAdministration`

##### 2. Surgical Ward
**Emergency Surgeries**
- **Purpose**: Surgical interventions
- **Activities**: Emergency surgeries, post-operative care
- **Target Groups**: Surgical patients
- **Service Code**: `IPD-SURGICAL`
- **FHIR Resource**: `Procedure` + `Encounter`

##### 3. Maternity Ward
**CEmONC Services**
- **Purpose**: Comprehensive emergency obstetric care
- **Activities**: Deliveries, CEmONC, postpartum care
- **Target Groups**: Pregnant women, new mothers
- **Service Code**: `IPD-MATERNITY`
- **FHIR Resource**: `Encounter` + `Procedure`

##### 4. Pediatric Ward
**<15 Years**
- **Purpose**: Pediatric inpatient care
- **Activities**: Pediatric treatment, monitoring
- **Target Groups**: Children under 15
- **Service Code**: `IPD-PEDIATRIC`
- **FHIR Resource**: `Encounter` + `Observation`

##### 5. Isolation Ward
**Infectious Diseases**
- **Purpose**: Infectious disease isolation
- **Activities**: Isolation care, infection control
- **Target Groups**: Infectious disease patients
- **Service Code**: `IPD-ISOLATION`
- **FHIR Resource**: `Encounter` + `Location`

##### 6. Emergency Department
**Acute Care**
- **Purpose**: Emergency medical care
- **Activities**: Emergency treatment, stabilization
- **Target Groups**: Emergency patients
- **Service Code**: `ED-ACUTE`
- **FHIR Resource**: `Encounter` + `Procedure`

##### 7. Dispatch and Referral Unit
**Patient Transfer**
- **Purpose**: Patient coordination and transfer
- **Activities**: Patient dispatch, referral coordination
- **Target Groups**: Transferred patients
- **Service Code**: `DR-REFERRAL`
- **FHIR Resource**: `ReferralRequest` + `Encounter`

### GROUP C - Specialized Services

#### 1. Surgery and Orthopedics
**Surgical Interventions**
- **Purpose**: Specialized surgical care
- **Activities**: Surgeries, orthopedic procedures
- **Target Groups**: Surgical patients
- **Service Code**: `SURG-ORTHO`
- **FHIR Resource**: `Procedure` + `Encounter`

#### 2. Rehabilitation Care
**Physical Therapy and Recovery**
- **Purpose**: Rehabilitation services
- **Activities**: Physical therapy, rehabilitation
- **Target Groups**: Rehabilitation patients
- **Service Code**: `REHAB-CARE`
- **FHIR Resource**: `ServiceRequest` + `CarePlan`

### GROUP D - Specific Programs

#### 1. NCD Program
**Chronic Disease Management**
- **Purpose**: Non-communicable disease management
- **Activities**: NCD screening, treatment, follow-up
- **Target Groups**: Chronic disease patients
- **Service Code**: `PROG-NCD`
- **FHIR Resource**: `Condition` + `CarePlan`
- **Unique ID**: **MANDATORY** for all NCD services

#### 2. Maternity Program
**SRH & MNCH & FP**
- **Purpose**: Maternal and child health
- **Activities**: SRH services, MNCH, family planning
- **Target Groups**: Women, children, families
- **Service Code**: `PROG-MATERNITY`
- **FHIR Resource**: `Encounter` + `CarePlan`
- **Unique ID**: Mandatory for specialized services

#### 3. HCB/C Program
**Health and Community Benefits**
- **Purpose**: Community health benefits
- **Activities**: Health benefits distribution
- **Target Groups**: Community members
- **Service Code**: `PROG-HCBC`
- **FHIR Resource**: `Coverage` + `Organization`

#### 4. HIV/AIDS Program
**HIV Prevention and Treatment**
- **Purpose**: HIV services
- **Activities**: HIV testing, treatment, counseling
- **Target Groups**: HIV patients, at-risk groups
- **Service Code**: `PROG-HIV`
- **FHIR Resource**: `Condition` + `MedicationRequest`

#### 5. Dental Program
**Oral Health Services**
- **Purpose**: Dental care
- **Activities**: Dental treatment, oral health education
- **Target Groups**: General population
- **Service Code**: `PROG-DENTAL`
- **FHIR Resource**: `Procedure` + `Encounter`

#### 6. Eye Program
**Vision Care**
- **Purpose**: Eye health services
- **Activities**: Eye examinations, treatment
- **Target Groups**: General population
- **Service Code**: `PROG-EYE`
- **FHIR Resource**: `Encounter` + `Procedure`

#### 7. EPI Program
**Expanded Program on Immunization**
- **Purpose**: Immunization services
- **Activities**: Vaccinations, immunization campaigns
- **Target Groups**: Children, adults
- **Service Code**: `PROG-EPI`
- **FHIR Resource**: `Immunization` + `Patient`

#### 8. Nutrition Program
**Malnutrition Management**
- **Purpose**: Nutrition services
- **Activities**: Nutrition screening, treatment
- **Target Groups**: Malnourished individuals
- **Service Code**: `PROG-NUTRITION`
- **FHIR Resource**: `Observation` + `CarePlan`

#### 9. Emergency Preparedness and Response
**Disaster Readiness**
- **Purpose**: Emergency preparedness
- **Activities**: Disaster planning, response coordination
- **Target Groups**: Community at large
- **Service Code**: `PROG-EMERGENCY`
- **FHIR Resource**: `Organization` + `PlanDefinition`

### GROUP E - Associated Services

#### 1. Laboratory
**Diagnostic Testing**
- **Purpose**: Laboratory diagnostics
- **Activities**: Lab tests, pathology
- **Target Groups**: Referred patients
- **Service Code**: `LAB-DIAG`
- **FHIR Resource**: `DiagnosticReport` + `Specimen`

#### 2. Radiology and Imaging
**Medical Imaging**
- **Purpose**: Diagnostic imaging
- **Activities**: X-rays, ultrasound, CT scans
- **Target Groups**: Referred patients
- **Service Code**: `RAD-IMAGING`
- **FHIR Resource**: `ImagingStudy` + `Observation`

#### 3. Pharmacy and Medical Dispensing
**Medication Management**
- **Purpose**: Medication dispensing
- **Activities**: Prescription fulfillment, counseling
- **Target Groups**: Patients with prescriptions
- **Service Code**: `PHARM-DISP`
- **FHIR Resource**: `MedicationRequest` + `MedicationDispense`

#### 4. Dispatch and Referral Unit
**Patient Coordination**
- **Purpose**: Patient transfer coordination
- **Activities**: Patient dispatch, referral tracking
- **Target Groups**: Transferred patients
- **Service Code**: `DR-REFERRAL`
- **FHIR Resource**: `ReferralRequest` + `Encounter`

## 🆔 Unique ID Requirements by Service

### Services Requiring All Three IDs (MANDATORY)
- **NCD Program**: All three IDs mandatory
- **MHPSS Services**: All three IDs mandatory
- **SRH Services**: All three IDs mandatory

### Services Requiring Partial IDs
- **Maternity Program**: Individual + Service IDs mandatory
- **Chronic Disease Management**: Individual + Service IDs mandatory
- **Specialized Programs**: Service-specific ID mandatory

### Services with Optional IDs
- **General OPD**: Random appointment/visit ID generated
- **Emergency Services**: Individual ID optional
- **Community Outreach**: Service-specific ID optional

## 📊 Service Integration

### Cross-Service Data Flow
1. **Patient Registration**: Individual Unique ID generated
2. **Service Enrollment**: Service-Specific ID created
3. **Appointment Booking**: Visit Unique ID generated
4. **Service Delivery**: All IDs tracked and linked
5. **Follow-up Care**: IDs used for continuity

### Data Sharing Standards
- **FHIR R5 Resources**: Standardized data exchange
- **Bangladesh Context**: Local terminology and codes
- **Privacy Standards**: Patient data protection
- **Interoperability**: Cross-system compatibility

## 🗺️ Geographic Integration

### Administrative Boundaries
- **ADM0**: Country level (Bangladesh)
- **ADM1**: Division level
- **ADM2**: District level
- **ADM3**: Upazilla level
- **ADM4**: Union/Municipality level

### Rohingya Camp Mapping
- **Camp Boundaries**: GIS-mapped camp areas
- **Block Systems**: Hierarchical block organization
- **Shelter Locations**: Precise shelter coordinates
- **Service Points**: Healthcare facility locations

## 🔧 Technical Implementation

### Service Code Standards
```typescript
interface ServiceCode {
  category: 'A' | 'B' | 'C' | 'D' | 'E';
  subcategory: string;
  service: string;
  code: string;
  fhir_resources: string[];
  unique_id_required: 'all' | 'partial' | 'optional';
}

// Example Service Code
const ncdService: ServiceCode = {
  category: 'D',
  subcategory: 'NCD',
  service: 'NCD Program',
  code: 'PROG-NCD',
  fhir_resources: ['Condition', 'CarePlan', 'MedicationRequest'],
  unique_id_required: 'all'
};
```

### Integration APIs
```typescript
// Service Registration API
POST /services/register
{
  "service_code": "PROG-NCD",
  "patient_id": "patient-123",
  "individual_unique_id": "BD19900101010112345",
  "service_specific_id": "NCDROH19900101010112345",
  "appointment_id": "NCDROH19900101123456789"
}

// Service Tracking API
GET /services/{service_id}/patients
{
  "service_code": "PROG-NCD",
  "total_patients": 1250,
  "active_patients": 890,
  "new_registrations": 45
}
```

## 📈 Quality Metrics

### Service Utilization Metrics
- **Patient Volume**: Service-wise patient counts
- **Follow-up Rates**: Appointment adherence
- **Referral Completion**: Referral outcome tracking
- **Quality Indicators**: Service quality metrics

### Performance Monitoring
- **Wait Times**: Service delivery timeframes
- **Staff Productivity**: Service provider efficiency
- **Resource Utilization**: Facility and equipment usage
- **Patient Satisfaction**: Service quality feedback

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: FHIR R5, Bangladesh DGHS, UNHCR Standards
