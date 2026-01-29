# 🏥 FHIR R5 Valuesets Documentation

## Overview

This section provides comprehensive valuesets for ZARISH SPHERE, following FHIR R5 standards and healthcare best practices for Bangladesh, Thailand, and Myanmar.

## 🎯 Core Valuesets

### Administrative Gender

````json
{
  "resourceType": "ValueSet",
  "id": "administrative-gender",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/shareablevalueset"
    ]
  },
  "url": "http://zarishsphere.com/fhir/ValueSet/administrative-gender",
  "version": "1.0.0",
  "name": "AdministrativeGender",
  "title": "Administrative Gender",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "Codes representing administrative gender for patient records",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/administrative-gender",
        "concept": [
          {
            "code": "male",
            "display": "Male",
            "designation": [
              {
                "language": "bn",
                "value": "পুরুষ"
              },
              {
                "language": "th",
                "value": "ชาย"
              },
              {
                "language": "my",
                "value": "ကျား"
              }
            ]
          },
          {
            "code": "female",
            "display": "Female",
            "designation": [
              {
                "language": "bn",
                "value": "নারী"
              },
              {
                "language": "th",
                "value": "หญิง"
              },
              {
                "language": "my",
                "value": "မ"
              }
            ]
          },
          {
            "code": "other",
            "display": "Other",
            "designation": [
              {
                "language": "bn",
                "value": "অন্যান্য"
              },
              {
                "language": "th",
                "value": "อื่นๆ"
              },
              {
                "language": "my",
                "value": "အခြား"
              }
            ]
          },
          {
            "code": "unknown",
            "display": "Unknown",
            "designation": [
              {
                "language": "bn",
                "value": "অজানা"
              },
              {
                "language": "th",
                "value": "ไม่ทราบ"
              },
              {
                "language": "my",
                "value": "မသိရှိ"
              }
            ]
          }
        ]
      }
    ]
  }
}
```json

### Marital Status

```json
{
  "resourceType": "ValueSet",
  "id": "marital-status",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/shareablevalueset"
    ]
  },
  "url": "http://zarishsphere.com/fhir/ValueSet/marital-status",
  "version": "1.0.0",
  "name": "MaritalStatus",
  "title": "Marital Status",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "Codes representing marital status for patient records",
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
        "concept": [
          {
            "code": "A",
            "display": "Annulled",
            "designation": [
              {
                "language": "bn",
                "value": "বাতিল"
              },
              {
                "language": "th",
                "value": "ยกเลิก"
              },
              {
                "language": "my",
                "value": "ဖျက်သိမ်း"
              }
            ]
          },
          {
            "code": "D",
            "display": "Divorced",
            "designation": [
              {
                "language": "bn",
                "value": "বিবাহবিচ্ছেদ"
              },
              {
                "language": "th",
                "value": "หย่า"
              },
              {
                "language": "my",
                "value": "ကွာရှင်ပြတ်"
              }
            ]
          },
          {
            "code": "I",
            "display": "Interlocutory",
            "designation": [
              {
                "language": "bn",
                "value": "অন্তর্বর্তীকালীন"
              },
              {
                "language": "th",
                "value": "ชั่วคราว"
              },
              {
                "language": "my",
                "value": "ယာယီကာလ"
              }
            ]
          },
          {
            "code": "L",
            "display": "Legally Separated",
            "designation": [
              {
                "language": "bn",
                "value": "আইনগতভাবে আলাদা"
              },
              {
                "language": "th",
                "value": "แยกกันตามกฎหมาย"
              },
              {
                "language": "my",
                "value": "ဥပဒေအရ ခွဲခွာ"
              }
            ]
          },
          {
            "code": "M",
            "display": "Married",
            "designation": [
              {
                "language": "bn",
                "value": "বিবাহিত"
              },
              {
                "language": "th",
                "value": "สมรส"
              },
              {
                "language": "my",
                "value": "အိမ်ထောင်ရှိ"
              }
            ]
          },
          {
            "code": "P",
            "display": "Polygamous",
            "designation": [
              {
                "language": "bn",
                "value": "বহুবিবাহ"
              },
              {
                "language": "th",
                "value": "หลายภรรยา"
              },
              {
                "language": "my",
                "value": "ဇနီးမယားများ"
              }
            ]
          },
          {
            "code": "S",
            "display": "Never Married",
            "designation": [
              {
                "language": "bn",
                "value": "অবিবাহিত"
              },
              {
                "language": "th",
                "value": "ไม่เคยสมรส"
              },
              {
                "language": "my",
                "value": "အိမ်ထောင်မရှိ"
              }
            ]
          },
          {
            "code": "T",
            "display": "Domestic partner",
            "designation": [
              {
                "language": "bn",
                "value": "গার্হস্থায়ী সঙ্গী"
              },
              {
                "language": "th",
                "value": "คู่ชีวิต"
              },
              {
                "language": "my",
                "value": "တွဲဖက်ဖော်"
              }
            ]
          },
          {
            "code": "U",
            "display": "Unmarried",
            "designation": [
              {
                "language": "bn",
                "value": "অবিবাহিত"
              },
              {
                "language": "th",
                "value": "โสด"
              },
              {
                "language": "my",
                "value": "အိမ်ထောင်မရှိ"
              }
            ]
          },
          {
            "code": "W",
            "display": "Widowed",
            "designation": [
              {
                "language": "bn",
                "value": "বিধবা/বিপত্নীক"
              },
              {
                "language": "th",
                "value": "ม่าย"
              },
              {
                "language": "my",
                "value": "မုဆိုး/ဖခါ"
              }
            ]
          }
        ]
      }
    ]
  }
}
```json

## 🏥 Country-Specific Valuesets

### Bangladesh Administrative Divisions

```json
{
  "resourceType": "ValueSet",
  "id": "bangladesh-divisions",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/shareablevalueset"
    ]
  },
  "url": "http://zarishsphere.com/fhir/ValueSet/bangladesh-divisions",
  "version": "1.0.0",
  "name": "BangladeshDivisions",
  "title": "Bangladesh Administrative Divisions",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "Administrative divisions of Bangladesh",
  "compose": {
    "include": [
      {
        "system": "http://zarishsphere.com/fhir/CodeSystem/bangladesh-divisions",
        "concept": [
          {
            "code": "BD-01",
            "display": "Barishal",
            "designation": [
              {
                "language": "bn",
                "value": "বরিশাল"
              }
            ]
          },
          {
            "code": "BD-02",
            "display": "Chattogram",
            "designation": [
              {
                "language": "bn",
                "value": "চট্টগ্রাম"
              }
            ]
          },
          {
            "code": "BD-03",
            "display": "Dhaka",
            "designation": [
              {
                "language": "bn",
                "value": "ঢাকা"
              }
            ]
          },
          {
            "code": "BD-04",
            "display": "Khulna",
            "designation": [
              {
                "language": "bn",
                "value": "খুলনা"
              }
            ]
          },
          {
            "code": "BD-05",
            "display": "Mymensingh",
            "designation": [
              {
                "language": "bn",
                "value": "ময়মনসিংহ"
              }
            ]
          },
          {
            "code": "BD-06",
            "display": "Rajshahi",
            "designation": [
              {
                "language": "bn",
                "value": "রাজশাহী"
              }
            ]
          },
          {
            "code": "BD-07",
            "display": "Rangpur",
            "designation": [
              {
                "language": "bn",
                "value": "রংপুর"
              }
            ]
          },
          {
            "code": "BD-08",
            "display": "Sylhet",
            "designation": [
              {
                "language": "bn",
                "value": "সিলেট"
              }
            ]
          }
        ]
      }
    ]
  }
}
```json

### Thailand Provinces

```json
{
  "resourceType": "ValueSet",
  "id": "thailand-provinces",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/shareablevalueset"
    ]
  },
  "url": "http://zarishsphere.com/fhir/ValueSet/thailand-provinces",
  "version": "1.0.0",
  "name": "ThailandProvinces",
  "title": "Thailand Provinces",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "Provinces of Thailand",
  "compose": {
    "include": [
      {
        "system": "http://zarishsphere.com/fhir/CodeSystem/thailand-provinces",
        "concept": [
          {
            "code": "TH-10",
            "display": "Bangkok",
            "designation": [
              {
                "language": "th",
                "value": "กรุงเทพมหานคร"
              }
            ]
          },
          {
            "code": "TH-11",
            "display": "Samut Prakan",
            "designation": [
              {
                "language": "th",
                "value": "สมุทรปราการ"
              }
            ]
          },
          {
            "code": "TH-12",
            "display": "Nonthaburi",
            "designation": [
              {
                "language": "th",
                "value": "นนทบุรี"
              }
            ]
          },
          {
            "code": "TH-13",
            "display": "Pathum Thani",
            "designation": [
              {
                "language": "th",
                "value": "ปทุมธานี"
              }
            ]
          },
          {
            "code": "TH-14",
            "display": "Ayutthaya",
            "designation": [
              {
                "language": "th",
                "value": "พระนครศรีอยุธยา"
              }
            ]
          },
          {
            "code": "TH-15",
            "display": "Ang Thong",
            "designation": [
              {
                "language": "th",
                "value": "อ่างทอง"
              }
            ]
          },
          {
            "code": "TH-16",
            "display": "Lop Buri",
            "designation": [
              {
                "language": "th",
                "value": "ลพบุรี"
              }
            ]
          },
          {
            "code": "TH-17",
            "display": "Sing Buri",
            "designation": [
              {
                "language": "th",
                "value": "สิงห์บุรี"
              }
            ]
          }
        ]
      }
    ]
  }
}
```json

### Myanmar States and Regions

```json
{
  "resourceType": "ValueSet",
  "id": "myanmar-states-regions",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/shareablevalueset"
    ]
  },
  "url": "http://zarishsphere.com/fhir/ValueSet/myanmar-states-regions",
  "version": "1.0.0",
  "name": "MyanmarStatesRegions",
  "title": "Myanmar States and Regions",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "States and regions of Myanmar",
  "compose": {
    "include": [
      {
        "system": "http://zarishsphere.com/fhir/CodeSystem/myanmar-states-regions",
        "concept": [
          {
            "code": "MM-01",
            "display": "Sagaing Region",
            "designation": [
              {
                "language": "my",
                "value": "စစ်ကိုင်တိုင်းဒေသ"
              }
            ]
          },
          {
            "code": "MM-02",
            "display": "Tanintharyi Region",
            "designation": [
              {
                "language": "my",
                "value": "တနင်းသာရီတိုင်းဒေသ"
              }
            ]
          },
          {
            "code": "MM-03",
            "display": "Yangon Region",
            "designation": [
              {
                "language": "my",
                "value": "ရန်ကုန်တိုင်းဒေသ"
              }
            ]
          },
          {
            "code": "MM-04",
            "display": "Ayeyarwady Region",
            "designation": [
              {
                "language": "my",
                "value": "ဧရာဝတီတိုင်းဒေသ"
              }
            ]
          },
          {
            "code": "MM-05",
            "display": "Bago Region",
            "designation": [
              {
                "language": "my",
                "value": "ပဲခူးတိုင်းဒေသ"
              }
            ]
          },
          {
            "code": "MM-06",
            "display": "Magway Region",
            "designation": [
              {
                "language": "my",
                "value": "မကွေးတိုင်းဒေသ"
              }
            ]
          },
          {
            "code": "MM-07",
            "display": "Mandalay Region",
            "designation": [
              {
                "language": "my",
                "value": "မန္တလေးတိုင်းဒေသ"
              }
            ]
          },
          {
            "code": "MM-08",
            "display": "Mon State",
            "designation": [
              {
                "language": "my",
                "value": "မွန်ပြည်နယ်"
              }
            ]
          }
        ]
      }
    ]
  }
}
```javascript

## 🏥 Clinical Valuesets

### Diagnosis Codes (ICD-10)

```json
{
  "resourceType": "ValueSet",
  "id": "diagnosis-codes-icd10",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/shareablevalueset"
    ]
  },
  "url": "http://zarishsphere.com/fhir/ValueSet/diagnosis-codes-icd10",
  "version": "1.0.0",
  "name": "DiagnosisCodesICD10",
  "title": "Diagnosis Codes ICD-10",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "Common diagnosis codes from ICD-10",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/sid/icd-10",
        "concept": [
          {
            "code": "A00.1",
            "display": "Cholera due to Vibrio cholerae 01, biovar eltor"
          },
          {
            "code": "A01.0",
            "display": "Typhoid fever"
          },
          {
            "code": "A02.0",
            "display": "Salmonella enteritis"
          },
          {
            "code": "A03.0",
            "display": "Shigellosis due to Shigella dysenteriae"
          },
          {
            "code": "A04.0",
            "display": "Enteropathogenic Escherichia coli infection"
          },
          {
            "code": "A05.0",
            "display": "Foodborne staphylococcal intoxication"
          },
          {
            "code": "A06.0",
            "display": "Acute amebic dysentery"
          },
          {
            "code": "A07.0",
            "display": "Giardiasis [lambliasis]"
          },
          {
            "code": "A08.0",
            "display": "Rotaviral enteritis"
          },
          {
            "code": "A09.0",
            "display": "Infectious gastroenteritis and colitis, unspecified"
          }
        ]
      }
    ]
  }
}
```json

### Procedure Codes (ICD-9-CM)

```json
{
  "resourceType": "ValueSet",
  "id": "procedure-codes-icd9cm",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/shareablevalueset"
    ]
  },
  "url": "http://zarishsphere.com/fhir/ValueSet/procedure-codes-icd9cm",
  "version": "1.0.0",
  "name": "ProcedureCodesICD9CM",
  "title": "Procedure Codes ICD-9-CM",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "Common procedure codes from ICD-9-CM",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/sid/icd-9-cm",
        "concept": [
          {
            "code": "81.51",
            "display": "Total hip replacement"
          },
          {
            "code": "81.52",
            "display": "Partial hip replacement"
          },
          {
            "code": "81.54",
            "display": "Total knee replacement"
          },
          {
            "code": "81.55",
            "display": "Partial knee replacement"
          },
          {
            "code": "37.0",
            "display": "Cardiac catheterization"
          },
          {
            "code": "37.21",
            "display": "Right heart cardiac catheterization"
          },
          {
            "code": "37.22",
            "display": "Left heart cardiac catheterization"
          },
          {
            "code": "37.23",
            "display": "Combined right and left heart cardiac catheterization"
          },
          {
            "code": "37.26",
            "display": "Coronary angiography using a single catheter"
          },
          {
            "code": "37.27",
            "display": "Coronary angiography using two catheters"
          }
        ]
      }
    ]
  }
}
```json

## 🏥 Laboratory Valuesets

### Laboratory Test Codes (LOINC)

```json
{
  "resourceType": "ValueSet",
  "id": "laboratory-test-codes-loinc",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/R5/StructureDefinition/shareablevalueset"
    ]
  },
  "url": "http://zarishsphere.com/fhir/ValueSet/laboratory-test-codes-loinc",
  "version": "1.0.0",
  "name": "LaboratoryTestCodesLOINC",
  "title": "Laboratory Test Codes LOINC",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "Common laboratory test codes from LOINC",
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "2345-7",
            "display": "Glucose [Mass/volume] in Blood"
          },
          {
            "code": "30525-0",
            "display": "Hemoglobin [Mass/volume] in Blood"
          },
          {
            "code": "6690-2",
            "display": "Leukocytes [#/volume] in Blood by Automated count"
          },
          {
            "code": "718-7",
            "display": "Hematocrit [Volume Fraction] of Blood by Automated count"
          },
          {
            "code": "789-8",
            "display": "Erythrocytes [#/volume] in Blood by Automated count"
          },
          {
            "code": "4544-3",
            "display": "Hematocrit [Volume Fraction] of Blood"
          },
          {
            "code": "777-3",
            "display": "Platelets [#/volume] in Blood by Automated count"
          },
          {
            "code": "1920-8",
            "display": "Urea nitrogen [Mass/volume] in Serum or Plasma"
          },
          {
            "code": "1975-2",
            "display": "Creatinine [Mass/volume] in Serum or Plasma"
          },
          {
            "code": "2823-3",
            "display": "Potassium [Moles/volume] in Serum or Plasma"
          }
        ]
      }
    ]
  }
}
```json

## 🔧 Implementation Guidelines

### Using Valuesets in Resources

```json
{
  "resourceType": "Patient",
  "gender": "male",
  "maritalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
        "code": "M",
        "display": "Married"
      }
    ],
    "text": "Married"
  }
}
```javascript

### Valueset Expansion

```javascript
class ValuesetExpander {
  static async expandValueset(valuesetUrl) {
    try {
      const response = await fetch(`/fhir/ValueSet/${valuesetUrl}/$expand`);
      const valueset = await response.json();
      return valueset.expansion.contains;
    } catch (error) {
      console.error('Error expanding valueset:', error);
      return [];
    }
  }

  static async validateCode(system, code, valuesetUrl) {
    try {
      const response = await fetch(`/fhir/ValueSet/${valuesetUrl}/$validate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/fhir+json',
        },
        body: JSON.stringify({
          resourceType: 'Parameters',
          parameter: [
            {
              name: 'system',
              valueUri: system
            },
            {
              name: 'code',
              valueCode: code
            }
          ]
        })
      });

      const result = await response.json();
      return result.parameter.find(p => p.name === 'result').valueBoolean;
    } catch (error) {
      console.error('Error validating code:', error);
      return false;
    }
  }
}
```javascript

### Valueset Lookup

```javascript
class ValuesetLookup {
  static async lookupCode(system, code) {
    try {
      const response = await fetch(`/fhir/CodeSystem/$lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/fhir+json',
        },
        body: JSON.stringify({
          resourceType: 'Parameters',
          parameter: [
            {
              name: 'system',
              valueUri: system
            },
            {
              name: 'code',
              valueCode: code
            }
          ]
        })
      });

      const result = await response.json();
      return result.parameter;
    } catch (error) {
      console.error('Error looking up code:', error);
      return null;
    }
  }
}
```json

## 📊 Valueset Management

### Creating Custom Valuesets

```json
{
  "resourceType": "ValueSet",
  "id": "custom-hospital-departments",
  "url": "http://hospital.zarishsphere.com/fhir/ValueSet/departments",
  "version": "1.0.0",
  "name": "HospitalDepartments",
  "title": "Hospital Departments",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE Hospital",
  "description": "Hospital department classifications",
  "compose": {
    "include": [
      {
        "system": "http://hospital.zarishsphere.com/fhir/CodeSystem/departments",
        "concept": [
          {
            "code": "ER",
            "display": "Emergency Room"
          },
          {
            "code": "ICU",
            "display": "Intensive Care Unit"
          },
          {
            "code": "OPD",
            "display": "Outpatient Department"
          },
          {
            "code": "IPD",
            "display": "Inpatient Department"
          }
        ]
      }
    ]
  }
}
```json

### Valueset Versioning

```json
{
  "resourceType": "ValueSet",
  "id": "administrative-gender",
  "url": "http://zarishsphere.com/fhir/ValueSet/administrative-gender",
  "version": "2.0.0",
  "name": "AdministrativeGender",
  "title": "Administrative Gender",
  "status": "active",
  "experimental": false,
  "date": "2026-01-27",
  "publisher": "ZARISH SPHERE",
  "description": "Codes representing administrative gender for patient records",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/administrative-gender"
      }
    ]
  }
}
```text

## 📞 Support

For questions about valuesets:

- **Email**: fhir-support@zarishsphere.com
- **Documentation**: [FHIR R5 Overview](../fhir-r5/overview.md)
- **API Reference**: [Terminology Service](../api-reference/overview.md)

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
**Module**: FHIR R5 Valuesets
**Status**: Production Ready
````
