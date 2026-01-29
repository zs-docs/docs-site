# Patient Registration Standards & Guidelines

## 🎯 Overview

This document defines the comprehensive patient registration standards for ZARISH HIS, supporting multiple nationalities, languages, and service types with Bangladesh healthcare context and Rohingya refugee integration.

## 🌍 Localization Standards

### Date & Time Configuration
- **Date Format**: "DD MMMM YYYY" (01 January 2026)
- **Time Format**: 12-hour format with AM/PM
- **Time Zone**: GMT +06 (Dhaka/Bangladesh Standard Time)

### Language Support
- **Primary**: English
- **Secondary**: Bengali (বাংলা)
- **Tertiary**: Burmese

## 📋 Patient Registration Process

When a new patient arrives, staff fills out a comprehensive registration form with the following sections:

## 👤 Personal Information Fields

### Required Fields
- **Patient Full Name** - Full legal name
- **Date of Birth** - OR Age (if age provided, system converts to Date of Birth)
- **Gender** - Male/Female/Other
- **Phone Number** - With country code (e.g., +880...) - **MANDATORY**
- **Origin of Patient** - **MANDATORY** (Rohingya/Bangladeshi/Others)

## 🏠 Address Information Section

### Rohingya Nationality Address Fields

**Note**: Based on registration and residency status, field requirements may vary.

#### Registration Categories
1. **Registered Rohingya residents** in KTP and NYP Registered Camps
2. **Non-Registered Rohingya residents** in other than KTP and NYP Registered Camps
3. **New Arrivals** (ongoing) residents in other than KTP and NYP registered camps

#### Address Fields
- **Camp Name**: Dropdown selection - **MANDATORY**
- **Main Block**: Filtered dropdown based on Camp Name
- **Sub Block**: Filtered dropdown based on Main Block
- **FCN (Family Counting Number)**: Only for Non-registered camp residents (excluding new arrivals) - **MANDATORY**
- **MRC (Mouza Registration Card)**: Registered camps residents - **MANDATORY**
- **Token Number**: Only for new arrivals
- **Mazi Name**: Traditional name identifier
- **ProGress ID (Individual Unique ID)**: **MANDATORY** (Not for new arrivals)
- **Shelter Number**: Optional
- **General Health Card Number**: Latest sticker number - Optional
- **MCH Card Number**: If female patient - Optional
- **NCD Number**: If pre-registered NCD patient - Optional

**Dynamic Updates**: Field requirements can be updated during follow-up appointments based on registration status changes.

### Bangladeshi Nationality Address Fields

- **Upazilla**: Auto-filled based on Union/Municipality
- **Union/Municipality Name**: Auto-filled based on Upazilla
- **Village**: Auto-filled based on Union/Municipality/City Corporation
- **Identity Type**: NID Card/Birth Registration
- **NID/Birth Certificate Number**: **MANDATORY**

### Other Nationality Address Fields

- **Global Address Fields**: Standard international address format

## 🌐 Geographic Information

For all cases, administrative boundaries and geolocation should be automatically captured:

- **Administrative Boundaries Geo Code**: ADM0 to ADM4 levels
- **Geolocation**: Latitude and Longitude coordinates
- **Static Reference**: Pre-configured administrative boundary data

**Detailed Implementation**: See [Geographic Boundaries Integration Standards](geographic-boundaries-integration.md) for comprehensive geographic data integration including:
- Bangladesh administrative hierarchy (ADM0-ADM4)
- Rohingya camp mapping and block structure
- Coordinate validation and geocoding services
- GIS integration and spatial analysis
- Data sources and synchronization methods

## 🆘 Emergency Contact Details

- **Full Name**: Emergency contact person's complete name
- **Relationship**: Dropdown selection (Parent/Spouse/Sibling/Friend/Other)
- **Phone Number**: Contact number with country code
- **Address**: Complete address of emergency contact
- **Other Information**: Additional relevant details

## 🆔 Unique ID Number System

### Three Types of Unique IDs

#### 1. Individual Unique ID
**Format**: `[Origin Code][ProGress ID/NID/DOB][Registration DDMMYY][Random Serial]`

**Origin Codes**:
- `BD` - Bangladeshi
- `ROH` - Rohingya
- `OTH` - Others

**Example**: `BD19900101010112345`

#### 2. Service-Specific Unique ID
**Format**: `[Service Code][Origin Code][ProGress ID/NID/DOB][Registration DDMMYY][Random Serial]`

**Service Codes**:
- `GOPD` - General Outpatient Department
- `NCD` - Non-Communicable Diseases
- `MHPSS` - Mental Health and Psychosocial Support
- `SRH` - Sexual and Reproductive Health

**Example**: `NCDROH19900101010112345`

#### 3. Appointment/Visit Unique ID
**Format**: `[Service Code][Origin Code][ProGress ID/NID/DOB][Visit DDMMYY][Visit Count]`

**Example**: `GOPDBD19900101123456789`

### ID Requirements by Service

#### General OPD Services
- Individual Unique ID: **Optional**
- Service-Specific ID: **Optional**
- Appointment/Visit ID: **Auto-generated**

#### Specialized Services (NCD, MHPSS, SRH)
- Individual Unique ID: **MANDATORY**
- Service-Specific ID: **MANDATORY**
- Appointment/Visit ID: **MANDATORY**

### QR Code Generation

When all required fields are completed:

1. **QR Code Generation**: Automatic QR code creation
2. **QR Code Content**:
   - All patient fields
   - Text strings for manual search
   - Description with Name, Address, Service Name
3. **QR Code Usage**:
   - Printed and attached to patient health record
   - Saved in patient profile
   - Used for all follow-up visits
   - Scanned at triage and consultations

### Duplication Prevention

- **Chronic Services**: Unique ID validation mandatory to prevent duplicate registration
- **General Services**: Records linked to individual Unique ID but registration allowed
- **Complete Patient Profile**: All records consolidated under individual Unique ID

## 🏥 Service Types Classification

### GROUP A - Community Health Outreach
1. **Health Education & RCCE** - Risk Communication and Community Engagement
2. **Community Mobilization** - Community organization and participation
3. **Screening & Triage** - Initial health assessment
4. **Referral Management** - Patient referral coordination
5. **Follow-up Tracking** - Post-visit monitoring
6. **Community Based Surveillance** - Disease monitoring
7. **Contact Tracing** - Exposure tracking
8. **Outbreak Reporting** - Epidemic response
9. **Emergency Medical Services** - Emergency response
10. **Non-Lab Based CVD Risk Assessment** - Cardiovascular screening
11. **HCV Intervention** - Hepatitis C treatment

### GROUP B - Health Facility Services

#### B-01) Out Patient Department (OPD)
1. **General OPD** - Foundations of primary care
2. **Maternal Health** - ANC, PNC, Family Planning
3. **Child Health** - IMCI, Immunization, Growth Monitoring
4. **NCD Corner** - Non-communicable disease management
5. **Mental Health** - Basic counseling, referral
6. **Emergency Stabilization and Referral** - Wound management, fracture stabilization

#### B-02) In Patient Department (IPD)
1. **Medical Ward** - Communicable & NCDs
2. **Surgical Ward** - Emergency surgeries
3. **Maternity Ward** - CEmONC services
4. **Pediatric Ward** - <15 years
5. **Isolation Ward** - Infectious diseases
6. **Emergency Department** - Acute care
7. **Dispatch and Referral Unit** - Patient transfer

### GROUP C - Specialized Services
1. **Surgery and Orthopedics** - Surgical interventions
2. **Rehabilitation Care** - Physical therapy and recovery

### GROUP D - Specific Programs
1. **NCD Program** - Chronic disease management
2. **Maternity Program** - SRH & MNCH & FP
3. **HCB/C Program** - Health and Community Benefits
4. **HIV/AIDS Program** - HIV prevention and treatment
5. **Dental Program** - Oral health services
6. **Eye Program** - Vision care
7. **EPI Program** - Expanded Program on Immunization
8. **Nutrition Program** - Malnutrition management
9. **Emergency Preparedness and Response** - Disaster readiness

### GROUP E - Associated Services
1. **Laboratory** - Diagnostic testing
2. **Radiology and Imaging** - Medical imaging
3. **Pharmacy and Medical Dispensing** - Medication management
4. **Dispatch and Referral Unit** - Patient coordination

## 🗺️ Geographic Data Integration

### Administrative Boundaries
1. **ADM1–ADM4 Bundles**: Generated once data source confirmed
2. **Camp/Block/Sub-block Locations**: Rohingya camp specific data

### Data Sources
- **Bangladesh Administrative Boundaries**: https://data.humdata.org/dataset/cod-ab-bgd
- **Rohingya Camp Sites**: https://data.humdata.org/dataset/outline-of-camps-sites-of-rohingya-refugees-in-cox-s-bazar-bangladesh

### Implementation Notes
- Geographic data should be integrated into address auto-fill functionality
- Camp boundaries should be mapped for accurate location services
- Administrative codes should follow Bangladesh standards

## 🔧 Technical Implementation

### System Requirements
- **Multi-language Support**: English, Bengali, Burmese
- **Date/Time Handling**: Bangladesh Standard Time (GMT+6)
- **QR Code Generation**: Automatic ID-based QR creation
- **Address Validation**: Geographic boundary verification
- **Duplicate Prevention**: ID-based registration checks

### Data Validation Rules
- Phone numbers must include country code
- Age to DOB conversion algorithm
- Geographic coordinate validation
- Unique ID format validation
- Required field enforcement based on nationality

### Integration Points
- **FHIR R5**: Patient resource compliance
- **Bangladesh Health Standards**: DGHS/DGDA compliance
- **UNHCR Standards**: Refugee registration compliance
- **WHO Standards**: Healthcare data standards

## 📊 Reporting & Analytics

### Registration Metrics
- New registrations by nationality
- Camp-wise patient distribution
- Service utilization patterns
- Duplicate registration prevention metrics

### Quality Assurance
- Data completeness checks
- Geographic accuracy validation
- Unique ID consistency verification
- Follow-up appointment tracking

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: FHIR R5, Bangladesh DGHS, UNHCR Standards
