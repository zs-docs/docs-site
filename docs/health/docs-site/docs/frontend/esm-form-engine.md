# ESM Form Engine

ESM Form Engine is a powerful dynamic form builder and renderer system that enables healthcare providers to create, manage, and deploy clinical forms without coding.

## 📦 Package Structure

ESM Form Engine contains 3 applications:

| Package | Description | Purpose |
|---------|-------------|---------|
| **form-builder** | Visual form designer | Drag-and-drop form creation |
| **form-renderer** | Form display engine | Runtime form rendering |
| **form-validator** | Validation engine | Clinical and business rules |

## 🚀 Quick Start

### Installation
```bash
npm install @zarish/esm-form-engine
```

### Usage
```typescript
import { FormRenderer, FormBuilder } from '@zarish/esm-form-engine';

// Render a form
const PatientRegistrationForm = () => {
  const formDefinition = {
    fields: [
      {
        type: 'text',
        name: 'firstName',
        label: 'First Name',
        required: true,
        validation: {
          pattern: '[a-zA-Z]+',
          message: 'Please enter a valid name'
        }
      }
    ]
  };

  return (
    <FormRenderer 
      definition={formDefinition}
      onSubmit={(data) => console.log(data)}
    />
  );
};
```

## 🎨 Form Builder Features

### Drag-and-Drop Interface
- **Field Types**: Text, number, date, select, checkbox, radio, file
- **Layout Options**: Grid, flexbox, custom layouts
- **Conditional Logic**: Show/hide fields based on conditions
- **Validation Rules**: Required, pattern, length, custom validators

### Clinical Field Types
- **FHIR Integration**: Auto-mapping to FHIR resources
- **Medical Fields**: Blood pressure, BMI, pain scale
- **Bangladesh Context**: NID, birth certificate, local formats
- **Clinical Calculations**: BMI, GFR, pregnancy due date

## 📋 Form Renderer Features

### Dynamic Rendering
- **Responsive Design**: Mobile-first, adaptive layouts
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Multi-language support
- **Theme Support**: Material Design, custom themes

### Data Integration
- **FHIR Mapping**: Automatic FHIR resource generation
- **Validation**: Real-time validation with feedback
- **Auto-save**: Draft saving and recovery
- **Offline Support**: Progressive web app capabilities

## 🔧 Form Validation

### Built-in Validators
```typescript
const validators = {
  required: (value) => value && value.trim() !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^01[3-9]\d{8}$/.test(value), // Bangladesh format
  nid: (value) => /^\d{10}$|^\d{13}$/.test(value), // Bangladesh NID
  birthDate: (value) => {
    const date = new Date(value);
    const today = new Date();
    return date < today && date > new Date('1900-01-01');
  }
};
```

### Clinical Validation
```typescript
const clinicalValidators = {
  bloodPressure: (systolic, diastolic) => {
    if (systolic < diastolic) {
      return 'Systolic must be greater than diastolic';
    }
    if (systolic > 180 || diastolic > 120) {
      return 'Critical blood pressure detected';
    }
    return null;
  },
  
  bmi: (weight, height) => {
    const bmi = weight / (height * height);
    if (bmi < 18.5) return 'Underweight';
    if (bmi > 30) return 'Obese';
    return null;
  }
};
```

## 🏥 FHIR Integration

### Auto-Mapping
```typescript
// Form definition with FHIR mapping
const patientForm = {
  fields: [
    {
      name: 'firstName',
      fhirPath: 'Patient.name[0].given[0]',
      type: 'text',
      label: 'First Name'
    },
    {
      name: 'lastName',
      fhirPath: 'Patient.name[0].family',
      type: 'text',
      label: 'Last Name'
    },
    {
      name: 'birthDate',
      fhirPath: 'Patient.birthDate',
      type: 'date',
      label: 'Date of Birth'
    }
  ]
};

// Automatically generates FHIR Patient resource
const fhirResource = formRenderer.toFHIR(patientForm, formData);
```

## 📊 Form Templates

### Pre-built Templates
- **Patient Registration**: Demographics and medical history
- **Vital Signs**: Blood pressure, temperature, heart rate
- **Clinical Assessment**: Symptoms, examination findings
- **Medication Prescription**: Drug selection, dosing, instructions
- **Laboratory Orders**: Test selection, clinical information
- **Discharge Summary**: Hospital course, follow-up plans

### Bangladesh-Specific Templates
- **DGHS Forms**: Government-mandated reporting
- **Birth Registration**: Bangladesh birth certificate format
- **Death Registration**: Bangladesh death certificate format
- **Insurance Forms**: Local insurance company requirements

## 🎯 Use Cases

### Clinical Workflows
1. **Patient Registration**: Capture demographics and medical history
2. **Clinical Assessment**: Record symptoms and examination findings
3. **Test Ordering**: Laboratory and radiology request forms
4. **Medication Management**: Prescription and administration records
5. **Discharge Planning**: Summary and follow-up instructions

### Administrative Workflows
1. **Insurance Claims**: Pre-authorization and claim forms
2. **Quality Reporting**: Clinical quality measures
3. **Regulatory Compliance**: DGHS and other regulatory forms
4. **Research Studies**: Clinical trial data collection

## 🔗 Related Resources

- **Form Templates**: [Form Library](../forms/templates.md)
- **FHIR Integration**: [FHIR Guide](../fhir/)
- **Clinical Guidelines**: [Clinical Protocols](../guides/clinical.md)
- **API Documentation**: [Form API](../api-reference/forms.md)

---

*Last updated: 2026-01-21*
