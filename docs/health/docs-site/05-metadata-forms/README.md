# ZARISH HIS Clinical Forms Documentation

This directory contains the comprehensive documentation and metadata for all clinical forms used within the ZARISH HIS system. The forms have been systematically curated and migrated from the KenyaHIS OpenMRS content repository.

## 📁 Directory Structure

```
05-metadata-forms/
├── forms-registry/
│   └── clinical/              # All clinical form definitions (JSON)
├── form-metadata/              # Form catalogs and metadata
│   ├── forms-catalog.csv      # Master catalog of all forms
│   └── encounter-types.csv    # Encounter type definitions
├── value-sets/                # Reference data and value sets
│   ├── concept-reference-ranges.csv
│   └── answer-concepts.csv
├── form-schemas/              # Technical specifications
└── mappings/                  # Cross-reference mappings
```

## 📊 Forms Overview

### Summary Statistics
- **Total Forms**: 195 clinical forms
- **Total Encounter Types**: 146 unique encounter types
- **Total Concepts**: 16,023 answer concepts
- **Form Categories**: 10 clinical categories

### Forms by Category

| Category | Form Count | Description |
|----------|------------|-------------|
| General Clinical | 78 | General purpose clinical encounters |
| HIV Care | 28 | HIV treatment and management forms |
| Maternal & Child Health | 22 | ANC, PNC, delivery, and child health |
| Mental Health & Substance Use | 17 | Mental health, psychiatry, and substance abuse |
| Surgical & Procedures | 12 | Surgical procedures and safety checklists |
| Gender-Based Violence | 11 | GBV screening, treatment, and support |
| TB Care | 9 | Tuberculosis screening and treatment |
| Emergency & Critical Care | 6 | Emergency, admissions, and critical care |
| Laboratory & Diagnostics | 6 | Laboratory orders and diagnostic screening |
| Non-Communicable Diseases | 6 | NCD screening and management |

## 🔍 Form Metadata

### Master Forms Catalog
The `form-metadata/forms-catalog.csv` file contains comprehensive metadata for all forms:

- **Form ID**: Unique ZARISH identifier (form-001 to form-195)
- **Form Name**: Human-readable form name
- **Form UUID**: Technical unique identifier
- **Encounter Type**: Associated encounter type
- **Category**: Clinical category classification
- **Status**: Active/Inactive based on published and retired flags
- **Source File**: Filename in kebab-case format
- **Description**: Form description and purpose

### Encounter Types
The `form-metadata/encounter-types.csv` file defines all encounter types used across the forms system, including:
- Encounter type names and generated UUIDs
- Associated form categories
- Form count per encounter type

## 📋 Value Sets and Reference Data

### Concept Reference Ranges
Copied from the source repository, contains reference ranges for clinical concepts.

### Answer Concepts
Extracted from all form questions, containing:
- **16,023 total concepts** across all forms
- **4,794 main question concepts**
- **11,229 answer option concepts**

## 🏗️ Form Architecture

### Form Structure
Each form follows the OpenMRS ampathforms structure:
```json
{
  "name": "Form Name",
  "description": "Form description",
  "uuid": "unique-identifier",
  "encounter": "Encounter Type Name",
  "pages": [
    {
      "label": "Page Label",
      "sections": [
        {
          "label": "Section Label",
          "questions": [
            {
              "label": "Question Label",
              "type": "question-type",
              "questionOptions": {
                "concept": "concept-uuid",
                "rendering": "ui-component"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Naming Conventions
- **Form Files**: kebab-case format (e.g., `anc-enrollment-form.json`)
- **Form IDs**: Sequential format (form-001, form-002, etc.)
- **Categories**: Standardized clinical categories
- **UUIDs**: Preserved from source system

## 🚀 Usage Guidelines

### For Developers
1. **Form Integration**: Use the forms catalog to identify appropriate forms for your module
2. **Concept Mapping**: Reference the answer-concepts.csv for concept UUIDs
3. **Encounter Types**: Use encounter-types.csv for encounter type definitions

### For Clinical Staff
1. **Form Selection**: Browse forms by category in the forms catalog
2. **Form Understanding**: Review form descriptions and associated encounter types
3. **Training**: Use the categorized structure to understand form workflows

### For System Administrators
1. **Form Management**: Track form status and versions through the catalog
2. **Quality Assurance**: Monitor active vs inactive forms
3. **Reporting**: Use the structured data for form usage analytics

## 🔄 Migration Process

The forms were migrated from the KenyaHIS OpenMRS content repository through the following process:

1. **Discovery**: All JSON forms were identified in the source repository
2. **Transformation**: Files were renamed to kebab-case format
3. **Extraction**: Metadata and concepts were extracted and cataloged
4. **Organization**: Forms were categorized and placed in the hierarchical structure
5. **Documentation**: Comprehensive documentation and catalogs were created

## 📝 Contribution Guidelines

### Adding New Forms
1. Place new form JSON files in `forms-registry/clinical/`
2. Follow kebab-case naming convention
3. Update the forms catalog with new form metadata
4. Extract and add any new concepts to the answer-concepts.csv
5. Update encounter types if new encounter types are introduced

### Modifying Existing Forms
1. Update form JSON files as needed
2. Increment version numbers in form definitions
3. Update corresponding metadata in the forms catalog
4. Document changes in form descriptions

## 🔗 Related Documentation

- [ZARISH HIS Core Architecture](../00-core-architecture/)
- [Clinical Standards and Guidelines](../01-standards/)
- [API Specifications](../04-api-specifications/)

## 📞 Support

For questions or support regarding the forms documentation:
- **Technical Issues**: Contact the ZARISH HIS development team
- **Clinical Questions**: Consult with clinical governance team
- **Documentation Issues**: Submit issues through the project repository

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Maintainer: ZARISH HIS Documentation Team*

## 📋 Available Forms

The forms registry contains clinical form definitions. Currently, this directory contains:
- **Form metadata** and catalogs in `form-metadata/`
- **Value sets** and reference data in `value-sets/`
- **Technical specifications** in `form-schemas/`

For detailed form information, please refer to the metadata catalogs and value sets.

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Maintainer: ZARISH HIS Documentation Team*


<!-- FORM_INDEX_START -->
| Form Name | Description | Encounter Type | File |
|-----------|-------------|----------------|------|
|  MAT Psycho-social Intake & Follow-up Form | Intake& Follow up | MAT Psychosocial intake and followup | [mat-psycho-social-intake-follow-up-form.json](forms-registry/clinical/mat-psycho-social-intake-follow-up-form.json) |
|  SARI Surveillance Form | A form used to capture  SARI Cases | SARI Surveillance | [sari-surveillance-form.json](forms-registry/clinical/sari-surveillance-form.json) |
| AEFI Investigation Form | Form to capture Adverse Events Following Immunization | AEFI Investigation | [aefi-investigation-form.json](forms-registry/clinical/aefi-investigation-form.json) |
| ANC Follow Up form | A form to collect ANC follow up data. | MCH Mother Consultation | [anc-follow-up-form.json](forms-registry/clinical/anc-follow-up-form.json) |
| ART Fast Track | ART Fast Track | ART Refill | [art-fast-track.json](forms-registry/clinical/art-fast-track.json) |
| ART Preparation | ART Preparation | ART Preparation | [art-preparation.json](forms-registry/clinical/art-preparation.json) |
| Adverse Drug Reaction Reporting Form | Adverse Drug Reaction Reporting Form | Adverse Drug Reaction | [adverse-drug-reaction-form.json](forms-registry/clinical/adverse-drug-reaction-form.json) |
| Alcohol Abuse Screening Tool(AUDIT) | Alcohol Abuse Screening Tool(AUDIT) | KP Alcohol screening | [alcohol-abuse-screening-tool-audit.json](forms-registry/clinical/alcohol-abuse-screening-tool-audit.json) |
| Alcohol and Drug Abuse Screening(CAGE-AID/CRAFFT) | Alcohol and Drug Abuse Screening(CAGE-AID/CRAFFT) | Alcohol and Drug Abuse Screening | [alcohol-and-drug-abuse-screening-cage-aid-crafft.json](forms-registry/clinical/alcohol-and-drug-abuse-screening-cage-aid-crafft.json) |
| Antenatal Care (ANC) Discontinuation | ANC Services Discontinuation | MCH Mother Discontinuation | [anc-discontinuation-form.json](forms-registry/clinical/anc-discontinuation-form.json) |
| Antenatal Care (ANC) Enrollment Form | ANC Mother Enrollment Encounter | MCH Mother Enrollment | [anc-enrollment-form.json](forms-registry/clinical/anc-enrollment-form.json) |
| Audiology Clinic Form | ENT Speciality Clinic Form | Audiology | [audiology-clinical-consultation-form.json](forms-registry/clinical/audiology-clinical-consultation-form.json) |
| Baseline questionaire form | Vdot baseline Questionaire Form | Vdot baseline | [vdot-baseline-questionnaire.json](forms-registry/clinical/vdot-baseline-questionnaire.json) |
| Body Disposal Form | Create a body disposal request for a mortuary | Morgue | [body-disposal-form.json](forms-registry/clinical/body-disposal-form.json) |
| CCC Defaulter Tracing | CCC Defaulter Tracing | CCC Defaulter Tracing | [ccc-defaulter-tracing.json](forms-registry/clinical/ccc-defaulter-tracing.json) |
| COVID-19 Assessment form | POC Cancer Screening Form | COVID-19 Assessment Encounter | [covid19-assessment.json](forms-registry/clinical/covid19-assessment.json) |
| CPM Discontinuation Form | Community Pharmacy Model Discontinuation  Form | CPM Discontinuation Encounter | [communitypharmacydiscontinuation.json](forms-registry/clinical/communitypharmacydiscontinuation.json) |
| CPM Enrollment Form | Community Pharmacy Model Enrollment form | CPM Enrollment Encounter | [communitypharmacyenrollment.json](forms-registry/clinical/communitypharmacyenrollment.json) |
| CPM Initial Form | Community Pharmacy Model Initial form | CPM Enrollment Encounter | [communitypharmacyinitial.json](forms-registry/clinical/communitypharmacyinitial.json) |
| CPM Referral Form | Community Pharmacy Model Referral form | CPM Referral Encounter | [communitypharmacyreferral.json](forms-registry/clinical/communitypharmacyreferral.json) |
| CWC Enrolment Form | MCH-CS Enrollment form | CWC Enrollment | [mch-child-enrolment.json](forms-registry/clinical/mch-child-enrolment.json) |
| Cancer Screening and Early diagnosis | Form Cancer Screening and early diagnosis | Oncology screening | [cancer-screening-and-early-diagnosis.json](forms-registry/clinical/cancer-screening-and-early-diagnosis.json) |
| Cardex Nursing Plan | Cardex Nursing Plan Form | Nursing Cardex | [cardex-nursing-plan.json](forms-registry/clinical/cardex-nursing-plan.json) |
| Cardiology  Clinical Form | A form used to capture cardiology clinical Cases | Consultation | [cardiology-clinical-form.json](forms-registry/clinical/cardiology-clinical-form.json) |
| Cervical Cancer Assessment Form | Cervical Cancer Assessment Form | Cervical cancer screening | [cervical-cancer-assessment.json](forms-registry/clinical/cervical-cancer-assessment.json) |
| Cervical Cancer Screening Form | Cervical Cancer Screening Form | Cervical cancer screening | [cervical-cancer-screening.json](forms-registry/clinical/cervical-cancer-screening.json) |
| Child HEI outcomes | Child HEI outcomes | MCH Child HEI Exit | [child-hei-outcomes.json](forms-registry/clinical/child-hei-outcomes.json) |
| Child Welfare Clinic Form | Child welfare clinic form | CWC Consultation | [cwc-follow-up.json](forms-registry/clinical/cwc-follow-up.json) |
| Child Welfare Services Discontinuation | Child Welfare Services Discontinuation | MCH Child Discontinuation | [child-welfare-services-discontinuation.json](forms-registry/clinical/child-welfare-services-discontinuation.json) |
| Clinical Encounter | Clinical Encounter | Consultation | [clinical-encounter.json](forms-registry/clinical/clinical-encounter.json) |
| Community Pharmacy Screening Form | ROC Screening Tool Community Pharmacy Form | CPM Screening Encounter | [communitypharmacyscreeningform.json](forms-registry/clinical/communitypharmacyscreeningform.json) |
| Cross Border Referral  | Cross border referral | Cross Border Referral | [cross-border-referral.json](forms-registry/clinical/cross-border-referral.json) |
| Cross Border Screening | Cross Border Screening | Cross Border Screening | [cross-border-screening.json](forms-registry/clinical/cross-border-screening.json) |
| Delivery | Delivery | MCH Mother Consultation | [delivery.json](forms-registry/clinical/delivery.json) |
| Dental Clinical Form | A form used to capture dental clinical Cases | Consultation | [dental-clinical-form.json](forms-registry/clinical/dental-clinical-form.json) |
| Depression Screening PHQ-9 | Depression Screening PHQ-9 | KP Depression screening | [depression-screening-phq-9.json](forms-registry/clinical/depression-screening-phq-9.json) |
| Dermatology Clinical Form | A form used to capture dermatology clinical Cases | Dermatology Clinic | [dermatology-clinical-encounter.json](forms-registry/clinical/dermatology-clinical-encounter.json) |
| Diabetic Clinical Encounter | A form for collecting diabetic information | Diabetic Clinic | [diabetic-clinical-encounter-form.json](forms-registry/clinical/diabetic-clinical-encounter-form.json) |
| Discharge | Discharge | MCH Mother Consultation | [discharge.json](forms-registry/clinical/discharge.json) |
| Doctor's Note Form | Doctor's Note Form | Doctor's Note | [doctor-s-note.json](forms-registry/clinical/doctor-s-note.json) |
| Ear, Nose, and Throat (ENT) | Form for updating Ear, Nose, and Throat (ENT) diagnosis | Consultation | [ear-nose-throat-ent.json](forms-registry/clinical/ear-nose-throat-ent.json) |
| Enhanced Adherence Screening | Enhanced Adherence Screening | Enhanced Adherence Screening | [enhanced-adherence-screening.json](forms-registry/clinical/enhanced-adherence-screening.json) |
| Family History | Family History | Registration | [family-history.json](forms-registry/clinical/family-history.json) |
| Family Planning | Family Planning Form | Family Planning | [family-planning-form.json](forms-registry/clinical/family-planning-form.json) |
| Family Planning Discontinuation | Family Planning Services Discontinuation | FP Discontinuation | [family-planning-discontinuation.json](forms-registry/clinical/family-planning-discontinuation.json) |
| Family Planning Enrollment Form | Family Planning Enrollment Encounter | Family Planning | [family-planning-enrollment.json](forms-registry/clinical/family-planning-enrollment.json) |
| Fertility Clinic Form | A form used to capture fertility Cases | Consultation | [fertility-clinic-form.json](forms-registry/clinical/fertility-clinic-form.json) |
| Fluid Intake and Output Form | A form for collecting fluid intake and output data | Fluid Intake and Output | [fluid-intake-output.json](forms-registry/clinical/fluid-intake-output.json) |
| GOPC Clinical Consultation Form | GOPC Speciality Clinic Form | GOPC | [gopc-clinical-consultation-form.json](forms-registry/clinical/gopc-clinical-consultation-form.json) |
| Gastroenterology Clinic Visit | Gastroenterology Clinic Visit Form | Consultation | [gastroenterology-clinic-visit.json](forms-registry/clinical/gastroenterology-clinic-visit.json) |
| Generalized Anxiety Disorder Assessment | Generalized Anxiety Disorder Assessment | Generalized Anxiety Disorder Assessment | [generalized-anxiety-disorder.json](forms-registry/clinical/generalized-anxiety-disorder.json) |
| HIV Discontinuation | HIV Discontinuation | HIV Discontinuation | [hiv-discontinuation.json](forms-registry/clinical/hiv-discontinuation.json) |
| HIV Enrollment | HIV Enrollment | HIV Enrollment | [hiv-enrollment.json](forms-registry/clinical/hiv-enrollment.json) |
| HIV Green Card | HIV Green Card | HIV Consultation | [hiv-green-card.json](forms-registry/clinical/hiv-green-card.json) |
| HIV Initial Form | Form filled after enrolling the patient into HIV program | HIV Enrollment | [hiv-initial-form.json](forms-registry/clinical/hiv-initial-form.json) |
| HIV Self Test Form | HIV Self Test Form | HIV self testing | [hiv-self-test.json](forms-registry/clinical/hiv-self-test.json) |
| HTS Client Referral Form | HTS Client Referral Form | HTS | [hts-client-referral.json](forms-registry/clinical/hts-client-referral.json) |
| HTS Client Tracing Form | HTS Client Tracing Form | HTS | [hts-client-tracing.json](forms-registry/clinical/hts-client-tracing.json) |
| HTS Eligibility Screening Form | Form used to screen clients prior to HIV testing | HTS | [hts-eligibility-screening.json](forms-registry/clinical/hts-eligibility-screening.json) |
| HTS Initial Form | Form for HTS testing services | HTS | [hts-initial.json](forms-registry/clinical/hts-initial.json) |
| HTS Linkage Form | HTS Linkage Form | HTS | [hts-linkage.json](forms-registry/clinical/hts-linkage.json) |
| HTS Retest Form | Form for HTS testing services | HTS | [hts-retest.json](forms-registry/clinical/hts-retest.json) |
| High IIT Intervention Form | A form for collecting the interventions offered to a case by a case manager. | High IIT Intervention | [high-iit-intervention-form.json](forms-registry/clinical/high-iit-intervention-form.json) |
| Home Visit  Checklist Form | A form used to capture home visit details | Home Visit Checklist | [home-visit-checklist-form.json](forms-registry/clinical/home-visit-checklist-form.json) |
| ILI Surveillance Form | A form used to capture ILI  Cases | ILI Surveillance | [ili-surveillnce-form.json](forms-registry/clinical/ili-surveillnce-form.json) |
| IPD Procedure Form | IPD Procedure Form | IPD Procedure | [ipd-procedure-form.json](forms-registry/clinical/ipd-procedure-form.json) |
| In-Patient Admission Form | Create an admission request to an inpatient ward | Transfer Request | [in-patient-admission.json](forms-registry/clinical/in-patient-admission.json) |
| In-Patient Admission Request | Create an admission request to an inpatient ward | Transfer Request | [in-patient-admission-request-form.json](forms-registry/clinical/in-patient-admission-request-form.json) |
| Infectious Disease Clinic Form | Infectious Disease Speciality Clinic Form | Infectious Disease | [infectious-disease-clinic.json](forms-registry/clinical/infectious-disease-clinic.json) |
| Initial Nursing Cardex | Nursing Cardex Form Initial | Nursing Cardex | [initial-nursing-cardex.json](forms-registry/clinical/initial-nursing-cardex.json) |
| Inpatient Discharge Form | A form for collecting patient's discharge information | IPD Discharge | [inpatient-discharge-form.json](forms-registry/clinical/inpatient-discharge-form.json) |
| KVP Client Discontinuation | KP Discontinuation | KP Discontinuation | [kvp-client-discontinuation.json](forms-registry/clinical/kvp-client-discontinuation.json) |
| KVP Clinical Encounter form | KVP Clinical Encounter form | KP Clinic Visit form | [kvp-clinical-encounter.json](forms-registry/clinical/kvp-clinical-encounter.json) |
| KVP Clinical Enrollment | KVP Clinical Enrollment | KP Enrollment | [kvp-clinical-enrollment.json](forms-registry/clinical/kvp-clinical-enrollment.json) |
| KVP Contact Form | Contact form | KP Contact | [kvp-contact.json](forms-registry/clinical/kvp-contact.json) |
| KVP Diagnosis | Form for updating diagnosis | KP Diagnosis | [kvp-diagnosis.json](forms-registry/clinical/kvp-diagnosis.json) |
| KVP HIV Treatment Verification | KP HIV Treatment Verification | KP kpTreatmentVerification | [kvp-hiv-treatment-verification.json](forms-registry/clinical/kvp-hiv-treatment-verification.json) |
| KVP Initial Form | Initial form for Key and Vulnerable Population (KVP) patients | KP Contact | [kvp-initial.json](forms-registry/clinical/kvp-initial.json) |
| KVP Peer Educator Outreach Calendar | KVP Peer Educator Outreach Calendar | KP Peer Calendar | [peer-calendar.json](forms-registry/clinical/peer-calendar.json) |
| KVP Peer Tracking Form | Peer Tracking Form | KP Tracing | [peer-tracking.json](forms-registry/clinical/peer-tracking.json) |
| Laboratory Test Orders | Lab order entry form | Lab Order | [lab-order.json](forms-registry/clinical/lab-order.json) |
| Laboratory Test Results | Lab results form | Lab Results | [lab-result.json](forms-registry/clinical/lab-result.json) |
| Leprosy Followup Form | TB Leprosy Speciality Clinic Form | Leprosy Followup | [tb-leprosy-follow-up-visit-form.json](forms-registry/clinical/tb-leprosy-follow-up-visit-form.json) |
| Leprosy Initial Clinic Form | TB Leprosy Speciality Clinic Form | Leprosy Initial | [tb-leprosy-clinic-form.json](forms-registry/clinical/tb-leprosy-clinic-form.json) |
| Leprosy Postoperative Follow-up Form | Operation Assessment Form | Leprosy Postoperative | [postoperative-followup-rcs-form.json](forms-registry/clinical/postoperative-followup-rcs-form.json) |
| MAT Cessation Form | A form used to assess eligibility for dose reduction  | MAT Cessation Encounter | [mat-cessation-form.json](forms-registry/clinical/mat-cessation-form.json) |
| MAT Clinical Eligibility Assessment & Referral Form | A form used to collect data on eligibility | MAT Clinical eligibility assessment | [mat-clinical-eligibility-assessment-referral-form.json](forms-registry/clinical/mat-clinical-eligibility-assessment-referral-form.json) |
| MAT Clinical Encounter Form | mat clinical form | MAT Clinical Encounter | [mat-clinical-encounter-form.json](forms-registry/clinical/mat-clinical-encounter-form.json) |
| MAT Discontinuation Form | A form used to discontinue MAT therapy voluntarily | MAT Discontinuation Encounter | [mat-discontinuation-form.json](forms-registry/clinical/mat-discontinuation-form.json) |
| MAT Initial Registration Form | Initial Registration Form | MAT Initial registration Encounter | [mat-initial-registration-form.json](forms-registry/clinical/mat-initial-registration-form.json) |
| MAT Patient Treatment Form | MAT Patient Treatment Form | MAT Treatment Encounter | [mat-patient-treatment-form.json](forms-registry/clinical/mat-patient-treatment-form.json) |
| MAT Psychiatric Intake and Follow up Form | A form used by MAT psychiatrist | MAT Psychiatric intake and followup | [mat-psychiatric-intake-and-follow-up-form.json](forms-registry/clinical/mat-psychiatric-intake-and-follow-up-form.json) |
| MAT Psychosocial Follow Up Form | MAT Psychosocial Follow Up Form | MAT Psychosocial intake and followup | [mat-psychosocial-follow-up-form.json](forms-registry/clinical/mat-psychosocial-follow-up-form.json) |
| MAT Transit/Referral Form | This is the transit Clients Mat Referral Form | MAT Transit/Referral Encounter | [mat-transit-referral-form.json](forms-registry/clinical/mat-transit-referral-form.json) |
| MCH Antenatal Visit | MCH Antenatal Visit | MCH Mother Consultation | [mch-antenatal-form.json](forms-registry/clinical/mch-antenatal-form.json) |
| MCH Postnatal Visit | MCH Postnatal Visit | MCH Mother Consultation | [mch-postnatal-visit.json](forms-registry/clinical/mch-postnatal-visit.json) |
| MCH-MS Discontinuation | MCH-MS Discontinuation | MCH Mother Discontinuation | [mch-ms-discontinuation.json](forms-registry/clinical/mch-ms-discontinuation.json) |
| MCH-MS Enrollment | MCH-MS Enrollment | MCH Mother Enrollment | [mch-ms-enrollment.json](forms-registry/clinical/mch-ms-enrollment.json) |
| MOPC Clinical Consultation Form | MOPC Speciality Clinic Form | MOPC | [mopc-clinical-consultation-form.json](forms-registry/clinical/mopc-clinical-consultation-form.json) |
| Maternity Inpatient Form | A form used to capture Maternity Inpatient data | MCH Mother Consultation | [maternity-inpatient-form.json](forms-registry/clinical/maternity-inpatient-form.json) |
| Maxillofacial Clinical Consultation Form | Maxillofacial Speciality Clinic Form | MAXILLOFACIAL | [maxillofacial-clinical-form.json](forms-registry/clinical/maxillofacial-clinical-form.json) |
| Mortality Admission Form | A form to collect mortality records | Morgue Admission | [mortality-admission.json](forms-registry/clinical/mortality-admission.json) |
| Mortuary Discharge Form |  A form for collecting mortuary transfer details. | Mortuary Discharge | [mortuary-discharge-form.json](forms-registry/clinical/mortuary-discharge-form.json) |
| NCD Discontinuation | NCD Discontinuation | NCD Discontinuation | [ncd-discontinuation-form.json](forms-registry/clinical/ncd-discontinuation-form.json) |
| NCD Follow Up | NCD Follow UP updates | NCD Followup | [ncd-follow-up.json](forms-registry/clinical/ncd-follow-up.json) |
| NCD Initial Form | A form to record NCD data | NCD Initial | [ncd-initial-form.json](forms-registry/clinical/ncd-initial-form.json) |
| Neurology Clinical Form | Neurological Clinical Encounter Form | Neurology clinic | [neurological-clinical-encounter-form.json](forms-registry/clinical/neurological-clinical-encounter-form.json) |
| Newborn unit admission Form | A form for collecting newborn admission details | New born admission | [newborn-admission-form.json](forms-registry/clinical/newborn-admission-form.json) |
| Nursing Care Plan | A form to collect services offered by nurse at the Inpatient wards. | No encounter type | [nursing-care-plan.json](forms-registry/clinical/nursing-care-plan.json) |
| Nutrition Enrollment Form | Nutritional Enrollment Encounter | Nutrition Clinic | [nutrition-enrollment-form.json](forms-registry/clinical/nutrition-enrollment-form.json) |
| Nutrition Form | Nutrition Form | Nutrition | [nutrition-form.json](forms-registry/clinical/nutrition-form.json) |
| Nutrition Services Discontinuation | Nutrition Services Discontinuation | Nutrition Discontinuation | [nutrition-discontinuation-form.json](forms-registry/clinical/nutrition-discontinuation-form.json) |
| OTZ Activity Form | OTZ Activity Form | OTZ Activity | [otz-activity.json](forms-registry/clinical/otz-activity.json) |
| OTZ Discontinuation Form | OTZ Discontinuation Form | OTZ Discontinuation | [otz-discontinuation.json](forms-registry/clinical/otz-discontinuation.json) |
| OTZ Enrollment Form | OTZ Enrollment Form | OTZ Enrollment | [otz-enrollment.json](forms-registry/clinical/otz-enrollment.json) |
| OVC Discontinuation Form | OVC Discontinuation Form | OVC Discontinuation | [ovc-discontinuation.json](forms-registry/clinical/ovc-discontinuation.json) |
| OVC Enrollment Form | OVC Enrollment Form | OVC Enrollment | [ovc-enrollment.json](forms-registry/clinical/ovc-enrollment.json) |
| Occupational Therapy Clinic Form | Form for updating Occupational Therapy diagnosis | Consultation | [occupational-therapy-clinic-form.json](forms-registry/clinical/occupational-therapy-clinic-form.json) |
| Oncology Clinical Consultation Form | Oncology Clinical Encounter | ONCOLOGY | [oncology-clinical-consultation-form.json](forms-registry/clinical/oncology-clinical-consultation-form.json) |
| Ophthamology Clinical Form | A form used to capture ophthamology clinical Cases | Consultation | [ophthamology-clinical-form.json](forms-registry/clinical/ophthamology-clinical-form.json) |
| Opioid Overdose Encounter | Opioid Overdose Encounter | KP HCW Overdose reporting | [opioid-overdose-encounter.json](forms-registry/clinical/opioid-overdose-encounter.json) |
| Orthopaedic Clinic Visit | Orthopaedic Clinic Visit Form | Consultation | [orthopaedic-clinic-visit-form.json](forms-registry/clinical/orthopaedic-clinic-visit-form.json) |
| PEP FOLLOWUP Form | PEP follow up encounter | Violence PEP Follow up Encounter | [pep-follow-up-encounter.json](forms-registry/clinical/pep-follow-up-encounter.json) |
| PEP MANAGEMENT FORM FOR NON-OCCUPATIONAL EXPOSURE | PEP MANAGEMENT FOR NON-OCCUPATIONAL EXPOSURE | PEP Management Non OCN Encounter | [pep-management-non-ocn-form.json](forms-registry/clinical/pep-management-non-ocn-form.json) |
| PEP MANAGEMENT FORM FOR OCCUPATIONAL EXPOSURE | PEP Form Management for OCN | PEP Management OCN Encounter | [pep-management-ocn-form.json](forms-registry/clinical/pep-management-ocn-form.json) |
| PEP MANAGEMENT FORM FOR SURVIVORS | PEP Management for Survivors | PEP Management Survivor Encounter | [pep-management-survivor-encounter.json](forms-registry/clinical/pep-management-survivor-encounter.json) |
| PLHIV Link Facility Documentation Tracking form | A form collecting data for KVP clients receiving ART status in a separate facility other than the DICE.  | PLHIV Link Facility Documentation Tracking | [plhiv-link-facility-documentation-tracking-form.json](forms-registry/clinical/plhiv-link-facility-documentation-tracking-form.json) |
| POPC Clinical Form | A form used to capture pediatric clinical Cases | POPC | [popc-clinical-consultation-form.json](forms-registry/clinical/popc-clinical-consultation-form.json) |
| Partograph Form | A form for collecting the labor progress at the maternity | MCH Partograph | [partograph-form.json](forms-registry/clinical/partograph-form.json) |
| Peadiatric Disclosure Checklist Form | A form for documenting the disclosure process of a pediatrics. | No encounter type | [peaditric-disclosure-form.json](forms-registry/clinical/peaditric-disclosure-form.json) |
| Peer Overdose Reporting Tool | Peer Overdose Reporting Tool | KP Peer Overdose reporting | [peer-overdose-reporting-tool.json](forms-registry/clinical/peer-overdose-reporting-tool.json) |
| Physical and Emotional Violence Form | Physical and Emotional violence | Violence Physical and Emotional Abuse | [gbv-physical-and-emotional-violence.json](forms-registry/clinical/gbv-physical-and-emotional-violence.json) |
| Physiotherapy Clinic Form | A form used to capture Physiotherapy  Cases | Consultation | [physiotherapy-clinic-form.json](forms-registry/clinical/physiotherapy-clinic-form.json) |
| Post Delivery 48 hours Form | A form used to capture Post Delivery 48 hours data | MCH Mother Consultation | [post-delivery-form.json](forms-registry/clinical/post-delivery-form.json) |
| Post Procedure Form | Post Procedure Form | Post Operation | [post-procedure-notes-form.json](forms-registry/clinical/post-procedure-notes-form.json) |
| Post-Mortem Form | A form for used to in the examination of a body after death. | Post-Mortem | [post-mortem-clinical-encounter.json](forms-registry/clinical/post-mortem-clinical-encounter.json) |
| Postnatal Care (PNC) Discontinuation | PNC Services Discontinuation | MCH Mother Discontinuation | [pnc-discontinuation-form.json](forms-registry/clinical/pnc-discontinuation-form.json) |
| Postnatal Care (PNC) Enrollment Form | PNC Mother Enrollment Encounter | MCH Mother Enrollment | [pnc-enrollment-form.json](forms-registry/clinical/pnc-enrollment-form.json) |
| Postnatal Newborn Examination Form | A form to record the examination services offered postnatally at the maternity | MCH Mother Consultation | [postnatal-examination-form.json](forms-registry/clinical/postnatal-examination-form.json) |
| PrEP Behavior Risk Assessment in the last six months | PrEP Behavior Risk Assessment in the last six months | PrEP Behavior Risk Assessment | [prep-behavior-risk-assessment-last-six-months.json](forms-registry/clinical/prep-behavior-risk-assessment-last-six-months.json) |
| PrEP Client Discontinuation | PrEP Client Discontinuation | PrEP Client Discontinuation | [prep-client-discontinuation.json](forms-registry/clinical/prep-client-discontinuation.json) |
| PrEP Enrollment | PrEP Initial Enrollment Form | PrEP Enrollment | [prep-initial-enrollment.json](forms-registry/clinical/prep-initial-enrollment.json) |
| PrEP Follow Up | PrEP Follow Up | PrEP Consultation | [prep-follow-up.json](forms-registry/clinical/prep-follow-up.json) |
| PrEP INITIATION | PrEP INITIATION | PrEP Enrollment | [prep-initiation.json](forms-registry/clinical/prep-initiation.json) |
| PrEP Initial Form | PrEP Initial Form | PrEP Initial | [prep-initial.json](forms-registry/clinical/prep-initial.json) |
| PrEP Monthly Refill Form | PrEP Monthly Refill Form | PrEP Monthly refill | [prep-monthly-refill.json](forms-registry/clinical/prep-monthly-refill.json) |
| PrEP Treatment Verification | PrEP Treatment Verification | KP PrEP Treatment Verification | [prep-treatment-verification.json](forms-registry/clinical/prep-treatment-verification.json) |
| Pre- Conception Care Form | A form used to capture Pre- Conception Care data | Pre-Conception Care | [pre-conception-care-form.json](forms-registry/clinical/pre-conception-care-form.json) |
| Pre-Conception Care Discontinuation | Pre-Conception Discontinuation | Pre-Conception Care | [pre-conception-care-discontinuation-form.json](forms-registry/clinical/pre-conception-care-discontinuation-form.json) |
| Pre-Conception Care Enrollment Form | Pre-Conception Care Enrollment Encounter | Pre-Conception Care | [pre-conception-care-enrollment-form.json](forms-registry/clinical/pre-conception-care-enrollment-form.json) |
| PreOperative Checklist Form | PreOperative Checklist  Form | Pre-Operation Checklist | [pre-operative-checklist.json](forms-registry/clinical/pre-operative-checklist.json) |
| Preventive Services | Preventive Services | MCH Mother Consultation | [preventive-services.json](forms-registry/clinical/preventive-services.json) |
| Progress Note | Progress Note | Consultation | [progress-note.json](forms-registry/clinical/progress-note.json) |
| Psychiatric Clinic Form | A form to collect psychiatric clinical services. | PSYCHIATRIC | [psychiatric-clinic-form.json](forms-registry/clinical/psychiatric-clinic-form.json) |
| Referral | Referral | KP Referral | [referral.json](forms-registry/clinical/referral.json) |
| Renal Clinical Form | A form used to capture renal clinical Cases | Consultation | [renal-clinical-form.json](forms-registry/clinical/renal-clinical-form.json) |
| SOPC Clinical Consultation Form | Surgical Clinical Encounter | SOPC | [sopc-clinical-consultation-form.json](forms-registry/clinical/sopc-clinical-consultation-form.json) |
| STI Treatment | STI Treatment | KP STI Detailed treatment | [sti-treatment.json](forms-registry/clinical/sti-treatment.json) |
| Sexual Violence Post Rape Care Form (MOH 363 part A) | Sexual Violence POST RAPE CARE Form (MOH 363 part A) | Sexual violence Post Rape Care 363A | [prc-form-part-a.json](forms-registry/clinical/prc-form-part-a.json) |
| Sexual Violence Pyschological Assessment(MOH 363 part B) | Sexual Violence Pyschological Assessment(MOH 363 part B) | Sexual violence PRC Psychological Assessment 363B | [prc-form-part-b.json](forms-registry/clinical/prc-form-part-b.json) |
| Speech and Language Therapy Assessment Form | Speech and Language Speciality Clinic Form | Speech and Language | [speech-language-therapy-clinic-adult-form.json](forms-registry/clinical/speech-language-therapy-clinic-adult-form.json) |
| Surgical Safety Checklist (Sign In) | A form used to capture Surgical Safety Checklist Sign In | SOPC | [surgical-safety-checklist-sign-in-form.json](forms-registry/clinical/surgical-safety-checklist-sign-in-form.json) |
| Surgical Safety Checklist (Sign Out) | A form used to capture Surgical Safety Checklist Sign Out | SOPC | [surgical-safety-checklist-sign-out-form.json](forms-registry/clinical/surgical-safety-checklist-sign-out-form.json) |
| Surgical Safety Checklist (Time Out) | A form used to capture Surgical Safety Checklist Time Out | SOPC | [surgical-safety-checklist-time-out-form.json](forms-registry/clinical/surgical-safety-checklist-time-out-form.json) |
| TB Discontinuation | TB Discontinuation | TB Discontinuation | [tb-discontinuation.json](forms-registry/clinical/tb-discontinuation.json) |
| TB Enrollment | TB Enrollment | TB Enrollment | [tb-enrollment.json](forms-registry/clinical/tb-enrollment.json) |
| TB FollowUp | TB FollowUp | TB FollowUp | [tb-followup.json](forms-registry/clinical/tb-followup.json) |
| TB Initial | TB Initial Form | TB Enrollment | [tb-initial.json](forms-registry/clinical/tb-initial.json) |
| TB Screening | TB Screening | TB Screening | [tb-screening.json](forms-registry/clinical/tb-screening.json) |
| TPT FollowUp | TPT FollowUp | IPT FollowUp | [tpt-followup.json](forms-registry/clinical/tpt-followup.json) |
| TPT Initial | TPT Initial Form | IPT Initiation | [tpt-initial.json](forms-registry/clinical/tpt-initial.json) |
| TPT Initiation | TPT Initiation | IPT Initiation | [tpt-initiation.json](forms-registry/clinical/tpt-initiation.json) |
| TPT Outcome | TPT Outcome | IPT Outcome | [tpt-discontinuation-form.json](forms-registry/clinical/tpt-discontinuation-form.json) |
| Telehealth Consultation | Telehealth Consultation Form | Consultation | [telehealth-consultation-form.json](forms-registry/clinical/telehealth-consultation-form.json) |
| Triage | Triage | Triage | [triage.json](forms-registry/clinical/triage.json) |
| Urology Clinical Form | Urology Clinical Encounter Form | Urology clinic | [urology-clinical-encounter-form.json](forms-registry/clinical/urology-clinical-encounter-form.json) |
| VMMC Circumcision Procedure Form | VMMC Circumcision Procedure Form | VMMC Procedure | [vmmc-circumcision-procedure.json](forms-registry/clinical/vmmc-circumcision-procedure.json) |
| VMMC Client Follow-Up Form | VMMC Client Follow-Up Form | VMMC Client Follow up | [vmmc-client-follow-up.json](forms-registry/clinical/vmmc-client-follow-up.json) |
| VMMC Discontinuation Form | VMMC Discontinuation Form | VMMC Discontinuation | [vmmc-discontinuation.json](forms-registry/clinical/vmmc-discontinuation.json) |
| VMMC Enrollment Form | VMMC Enrollment Form | VMMC Enrollment | [vmmc-enrollment.json](forms-registry/clinical/vmmc-enrollment.json) |
| VMMC Immediate Post-Operation Assessment Form | VMMC Immediate Post-Operation Assessment Form | VMMC Immediate Post-Operation Assessment | [vmmc-immediate-post-operation-assessment.json](forms-registry/clinical/vmmc-immediate-post-operation-assessment.json) |
| VMMC Initial Form | VMMC Initial Form | VMMC Enrollment | [vmmc-initial.json](forms-registry/clinical/vmmc-initial.json) |
| VMMC Medical History and Physical Examination Form | VMMC Medical History and Physical Examination Form | VMMC Medical History and Examination | [vmmc-medical-history-and-physical-examination.json](forms-registry/clinical/vmmc-medical-history-and-physical-examination.json) |
| Vdot Discontinuation form | Vdot Discontinuation Form | Vdot Discontinuation | [vdot-discontinuation.json](forms-registry/clinical/vdot-discontinuation.json) |
| Vdot Enrollment form | Vdot Enrollment Form | Vdot Enrollment | [vdot-enrollment.json](forms-registry/clinical/vdot-enrollment.json) |
| Violence Community Linkage Form | Violence Community Linkage Form | Violence Community Linkage Encounter | [gbv-community-linkage-form.json](forms-registry/clinical/gbv-community-linkage-form.json) |
| Violence Consent Form | Violence  Consent Form | Violence Consent Encounter | [gbv-consent-form.json](forms-registry/clinical/gbv-consent-form.json) |
| Violence Discontinuation Form | Violence Discontinuation | Violence Discontinuation Encounter | [gbv-discontinuation-form.json](forms-registry/clinical/gbv-discontinuation-form.json) |
| Violence Enrollment Form | Violence Enrollment Form | Violence Enrollment Encounter | [gbv-enrollment-form.json](forms-registry/clinical/gbv-enrollment-form.json) |
| Violence Initial Form | Violence Initial Form | Violence Enrollment Encounter | [gbv-initial.json](forms-registry/clinical/gbv-initial.json) |
| Violence Legal Form | Legal Encounter Form | Violence Legal Encounter | [gbv-legal-encounter-form.json](forms-registry/clinical/gbv-legal-encounter-form.json) |
| Violence Perpetrator Details | Violence Perpetrator Details | Violence Perpetrator Details Encounter | [gbv-perpetrator-details-forms.json](forms-registry/clinical/gbv-perpetrator-details-forms.json) |
| Violence Reporting Form | Violence Reporting Form | KP Violence screening | [violence-reporting.json](forms-registry/clinical/violence-reporting.json) |
| Violence Screening | Violence Screening | Violence Screening Encounter | [violence-screening.json](forms-registry/clinical/violence-screening.json) |
| Violence Trauma Counselling | Violence Trauma Counselling Encounter form | Violence Trauma Counselling Encounter | [gbv-trauma-counselling-encounter-form.json](forms-registry/clinical/gbv-trauma-counselling-encounter-form.json) |
<!-- FORM_INDEX_END -->
