# Form Field Types and Technical Specifications

This document provides comprehensive technical specifications for the field types, rendering components, and validation rules used in ZARISH HIS clinical forms.

## 📋 Field Types Overview

### Basic Field Types

| Type | Description | Common Use Cases | Rendering Options |
|------|-------------|------------------|------------------|
| `obs` | Observation field for capturing clinical data | Vitals, symptoms, assessments | radio, select, number, date |
| `encounterDatetime` | Encounter date/time | Visit date/time | date, datetime |
| `encounterProvider` | Healthcare provider | Provider selection | ui-select-extended |
| `encounterLocation` | Facility location | Location selection | ui-select-extended |
| `programEnrollment` | Program enrollment | Patient program registration | ui-select-extended |
| `concept` | Concept reference | Linking to standard concepts | Various |

### Advanced Field Types

| Type | Description | Configuration |
|------|-------------|---------------|
| `obsGroup` | Grouped observations | Nested question sets |
| `toggle` | Toggle switch | Yes/No options |
| `numericConcept` | Numeric values with ranges | Min/max validation |
| `codedObs` | Coded observations | Predefined answer sets |

## 🎨 Rendering Components

### Input Components

#### Radio Buttons
```json
{
  "questionOptions": {
    "rendering": "radio",
    "concept": "concept-uuid",
    "answers": [...]
  }
}
```
**Use Cases**: Binary choices, small option sets (2-5 options)

#### Dropdown Select
```json
{
  "questionOptions": {
    "rendering": "select",
    "concept": "concept-uuid",
    "answers": [...]
  }
}
```
**Use Cases**: Medium-sized option sets (6-15 options)

#### Extended Select
```json
{
  "questionOptions": {
    "rendering": "ui-select-extended"
  }
}
```
**Use Cases**: Provider selection, location selection, large datasets

#### Number Input
```json
{
  "questionOptions": {
    "rendering": "number"
  },
  "validators": [
    {
      "type": "number",
      "min": 0,
      "max": 999
    }
  ]
}
```
**Use Cases**: Vital signs, measurements, counts

#### Date Input
```json
{
  "questionOptions": {
    "rendering": "date"
  },
  "validators": [
    {
      "type": "date",
      "allowFutureDates": false
    }
  ]
}
```
**Use Cases**: Birth dates, visit dates, onset dates

### Specialized Components

#### Autocomplete
```json
{
  "questionOptions": {
    "rendering": "autocomplete",
    "concept": "concept-uuid"
  }
}
```
**Use Cases**: Drug selection, diagnosis coding

#### Multi-Select
```json
{
  "questionOptions": {
    "rendering": "multi-select",
    "concept": "concept-uuid",
    "answers": [...]
  }
}
```
**Use Cases**: Multiple symptoms, comorbidities

## ✅ Validation Rules

### Common Validators

#### Date Validation
```json
{
  "type": "date",
  "allowFutureDates": false,
  "allowPastDates": true,
  "minAge": 0,
  "maxAge": 150
}
```

#### Number Validation
```json
{
  "type": "number",
  "min": 0,
  "max": 300,
  "precision": 2
}
```

#### Required Field Validation
```json
{
  "required": true
}
```

#### Pattern Validation
```json
{
  "type": "pattern",
  "pattern": "^[A-Za-z0-9]{3,10}$",
  "message": "Invalid format"
}
```

### Custom Validators

#### Range Validation
```json
{
  "type": "range",
  "min": 18,
  "max": 65,
  "message": "Age must be between 18 and 65"
}
```

#### Conditional Validation
```json
{
  "type": "conditional",
  "condition": "questionId == 'yes'",
  "required": true
}
```

## 🔧 Question Configuration

### Basic Question Structure
```json
{
  "label": "Question Label",
  "type": "obs",
  "id": "uniqueQuestionId",
  "required": true,
  "questionOptions": {
    "concept": "concept-uuid",
    "rendering": "radio"
  },
  "validators": [...],
  "hide": {
    "when": "otherQuestionId",
    "is": ["value1", "value2"]
  }
}
```

### Answer Options Configuration
```json
{
  "questionOptions": {
    "answers": [
      {
        "concept": "answer-concept-uuid",
        "label": "Answer Label",
        "order": 1
      }
    ]
  }
}
```

### Conditional Display
```json
{
  "hide": {
    "when": "previousQuestionId",
    "is": ["no", "not-applicable"]
  },
  "show": {
    "when": "riskAssessment",
    "is": ["high", "moderate"]
  }
}
```

## 📊 Data Types and Concepts

### Concept Data Types

| Data Type | Description | Example Concepts |
|-----------|-------------|------------------|
| `Boolean` | True/False values | Yes/No, Present/Absent |
| `Coded` | Predefined answer sets | Gender, Marital Status |
| `Numeric` | Numbers with precision | Weight, Height, BP |
| `Date` | Calendar dates | Birth Date, Visit Date |
| `Datetime` | Date and time | Admission Time |
| `Text` | Free text | Comments, Notes |
| `Complex` | Complex data types | Images, Documents |

### Concept Classes

| Class | Purpose | Examples |
|-------|---------|----------|
| `Diagnosis` | Diagnosis concepts | HIV, TB, Malaria |
| `Symptom` | Patient-reported symptoms | Cough, Fever, Pain |
| `Finding` | Clinical findings | Tachycardia, Pallor |
| `Procedure` | Medical procedures | Circumcision, Surgery |
| `Drug` | Medication concepts | ARV drugs, Antibiotics |
| `Lab Test` | Laboratory tests | CD4, Viral Load |

## 🏗️ Form Structure Patterns

### Standard Clinical Form Structure
```json
{
  "pages": [
    {
      "label": "Visit Details",
      "sections": [
        {
          "label": "Encounter Details",
          "questions": [
            // Date, Provider, Location
          ]
        }
      ]
    },
    {
      "label": "Clinical Assessment",
      "sections": [
        {
          "label": "History",
          "questions": [
            // Clinical history questions
          ]
        },
        {
          "label": "Examination",
          "questions": [
            // Physical examination
          ]
        }
      ]
    }
  ]
}
```

### Enrollment Form Pattern
```json
{
  "meta": {
    "programs": {
      "uuid": "program-uuid",
      "isEnrollment": true,
      "discontinuationDateQuestionId": "discontinuationDate"
    }
  }
}
```

### Follow-up Form Pattern
```json
{
  "referencedForms": [
    "enrollment-form-uuid"
  ],
  "processors": [
    "FollowUpFormProcessor"
  ]
}
```

## 🎯 Best Practices

### Question Design
1. **Clear Labels**: Use simple, unambiguous question labels
2. **Logical Flow**: Group related questions in sections
3. **Appropriate Types**: Choose the most suitable field type
4. **Validation**: Implement proper validation rules
5. **Conditional Logic**: Use conditional display to reduce clutter

### Performance Optimization
1. **Lazy Loading**: Load large answer sets on demand
2. **Caching**: Cache frequently used concept data
3. **Minimal Validation**: Validate only what's necessary
4. **Efficient Rendering**: Use appropriate UI components

### Accessibility
1. **Screen Reader Support**: Ensure all questions are accessible
2. **Keyboard Navigation**: Enable full keyboard navigation
3. **High Contrast**: Ensure sufficient color contrast
4. **Clear Instructions**: Provide clear help text

## 🔄 Integration Points

### OpenMRS Integration
- **Concept Dictionary**: Uses OpenMRS concept dictionary
- **Encounter Types**: Integrates with OpenMRS encounter types
- **Program Management**: Supports OpenMRS program workflows

### External Systems
- **Lab Systems**: HL7 integration for lab results
- **Pharmacy Systems**: Drug database integration
- **Imaging Systems**: DICOM integration for medical images

## 📝 Development Guidelines

### Adding New Field Types
1. Define the field type specification
2. Create rendering component
3. Implement validation logic
4. Add documentation and examples
5. Test with various data scenarios

### Custom Validators
1. Extend the validator framework
2. Follow naming conventions
3. Provide clear error messages
4. Include unit tests
5. Document use cases

---

*This document is continuously updated as new field types and features are added to the ZARISH HIS forms system.*
