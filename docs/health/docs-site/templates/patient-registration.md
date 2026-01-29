# Patient Registration Template

## 🎯 Overview

This template provides a standardized format for patient registration in ZARISH HIS,
supporting both Bangladeshi citizens and Rohingya refugees.

## 📋 Template Structure

### Basic Patient Information

```yaml
patient:
  # Personal Information
  personal:
    firstName: ""
    lastName: ""
    dateOfBirth: "YYYY-MM-DD"
    gender: "M|F|O"
    nationality: "BD|ROH|OTH"
    phoneNumber: "+880XXXXXXXXXX"
    email: "optional@example.com"
  
  # Identification (based on nationality)
  identification:
    # For Bangladeshi Citizens
    bangladeshi:
      nationalId: "13-digit NID"
      birthCertificate: "optional"
      passport: "optional"
    
    # For Rohingya Refugees
    refugee:
      progressId: "PROGXXXXXXXXX"
      mrcCard: "MRCXXXXXXXXX"
      familyCountingNumber: "FCN-CAMP-BLOCK-SUBBLOCK-XXX"
  
  # Address Information
  address:
    # For Bangladeshi Addresses
    bangladesh:
      division: "BD.X"
      district: "BD.X.Y"
      upazila: "BD.X.Y.Z"
      union: "BD.X.Y.Z.W"
      village: "village name"
      postCode: "postal code"
    
    # For Refugee Camp Addresses
    refugee_camp:
      campName: "camp name"
      block: "Block A/B/C"
      subBlock: "Sub-Block 1/2/3"
      shelter: "Shelter number"
      coordinates:
        latitude: 0.0000
        longitude: 0.0000
  
  # Emergency Contact
  emergencyContact:
    name: "contact name"
    relationship: "relationship type"
    phoneNumber: "+880XXXXXXXXXX"
    address: "optional address"
```

### Healthcare Information

```yaml
healthcare:
  # Medical History
  medicalHistory:
    chronicConditions: []
    allergies: []
    medications: []
    surgeries: []
    familyHistory: []
  
  # Insurance Information
  insurance:
    hasInsurance: false
    provider: ""
    policyNumber: ""
    coverageType: ""
  
  # Healthcare Preferences
  preferences:
    preferredLanguage: "BN|EN|MY"
    preferredFacility: ""
    emergencyContact: true
    dataSharing: true
```

## 🏥 Usage Examples

### Bangladeshi Citizen Registration

```yaml
patient:
  personal:
    firstName: "Mohammad"
    lastName: "Rahman"
    dateOfBirth: "1990-01-01"
    gender: "M"
    nationality: "BD"
    phoneNumber: "+8801234567890"
    email: "mohammad.rahman@example.com"
  
  identification:
    bangladeshi:
      nationalId: "1234567890123"
      birthCertificate: "BD199012345678"
  
  address:
    bangladesh:
      division: "BD.3"
      district: "BD.3.01"
      upazila: "BD.3.01.01"
      union: "BD.3.01.01.01"
      village: "Dhaka"
      postCode: "1000"
  
  emergencyContact:
    name: "Fatema Begum"
    relationship: "Spouse"
    phoneNumber: "+8801234567891"
  
  healthcare:
    preferences:
      preferredLanguage: "BN"
      preferredFacility: "ZARISH Hospital Dhaka"
      emergencyContact: true
      dataSharing: true
```

### Rohingya Refugee Registration

```yaml
patient:
  personal:
    firstName: "Ayesha"
    lastName: "Begum"
    dateOfBirth: "1985-05-15"
    gender: "F"
    nationality: "ROH"
    phoneNumber: "+8801234567892"
  
  identification:
    refugee:
      progressId: "PROG123456789"
      mrcCard: "MRC987654321"
      familyCountingNumber: "FCN-KTP-BLOCK-A-001"
  
  address:
    refugee_camp:
      campName: "Kutupalong"
      block: "Block A"
      subBlock: "Sub-Block 1"
      shelter: "Shelter 123"
      coordinates:
        latitude: 21.1234
        longitude: 92.1234
  
  emergencyContact:
    name: "Mohammad Hassan"
    relationship: "Brother"
    phoneNumber: "+8801234567893"
  
  healthcare:
    medicalHistory:
      chronicConditions:
        - "Hypertension"
        - "Type 2 Diabetes"
      allergies:
        - "Penicillin"
      medications:
        - "Amlodipine"
        - "Metformin"
    
    preferences:
      preferredLanguage: "MY"
      preferredFacility: "Camp Health Post A"
      emergencyContact: true
      dataSharing: true
```

## ✅ Validation Rules

### Required Fields

- **Personal Information**: firstName, lastName, dateOfBirth, gender, nationality, phoneNumber
- **Identification**: Based on nationality, at least one valid identifier
- **Address**: Complete address structure based on nationality type
- **Emergency Contact**: name, relationship, phoneNumber

### Validation Patterns

```yaml
validation:
  # National ID (Bangladesh)
  nationalId:
    pattern: "^[0-9]{13}$"
    example: "1234567890123"
  
  # Refugee IDs
  refugeeIds:
    progressId:
      pattern: "^PROG[0-9]{9}$"
      example: "PROG123456789"
    
    mrcCard:
      pattern: "^MRC[0-9]{9}$"
      example: "MRC987654321"
    
    fcn:
      pattern: "^FCN-[A-Z]{3}-BLOCK-[A-Z]-[0-9]{3}$"
      example: "FCN-KTP-BLOCK-A-001"
  
  # Phone Number
  phoneNumber:
    pattern: "^\\+880[0-9]{10}$"
    example: "+8801234567890"
  
  # Date of Birth
  dateOfBirth:
    pattern: "^\\d{4}-\\d{2}-\\d{2}$"
    example: "1990-01-01"
```

## 🔧 Integration Notes

### API Integration

```bash
# Register patient via API
curl -X POST "https://api.zarish-his.com/v1/patients" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @patient-template.yaml
```

### FHIR Resource Mapping

```json
{
  "resourceType": "Patient",
  "name": [
    {
      "given": ["{{patient.personal.firstName}}"],
      "family": "{{patient.personal.lastName}}"
    }
  ],
  "birthDate": "{{patient.personal.dateOfBirth}}",
  "gender": "{{patient.personal.gender}}",
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "https://zs-his.github.io/docs/fhir/CodeSystem/identifier-types",
            "code": "{{patient.identification.type}}"
          }
        ]
      },
      "value": "{{patient.identification.value}}"
    }
  ],
  "address": [
    {
      "extension": [
        {
          "url": "https://zs-his.github.io/docs/fhir/StructureDefinition/administrative-boundaries",
          "valueString": "{{patient.address.bangladesh.division}}"
        }
      ]
    }
  ]
}
```

## 📚 Related Resources

- [Patient Registration Standards](../../docs/standards/patient-registration-standards.md)
- [Geographic Boundaries Integration](../../docs/standards/geographic-boundaries-integration.md)
- [Patient API Documentation](../../docs/04-api-specifications/patient-registry-api.md)
- [FHIR Patient Example](../../docs/fhir/examples/patient-example.md)

---

**Template Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: ZARISH HIS Patient Registration Standards
