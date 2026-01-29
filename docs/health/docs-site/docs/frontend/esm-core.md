# ESM Core Framework

ESM Core is the foundational framework for all ZARISH HIS frontend applications. It provides a comprehensive set of tools, components, and utilities to accelerate development while maintaining consistency across all applications.

## 🎯 Overview

ESM Core serves as the **single source of truth** for frontend development in ZARISH HIS, providing:

- **Component Library**: Reusable UI components following Material Design
- **State Management**: Redux Toolkit configuration for predictable state
- **Routing**: Centralized routing with authentication guards
- **API Integration**: Standardized API client with error handling
- **FHIR Integration**: FHIR R5 utilities and data models
- **Theme System**: Consistent theming across all applications
- **Internationalization**: Multi-language support with Bangladesh localization

## 📦 Package Structure

ESM Core consists of 15 packages organized by functionality:

### Core Packages (5 packages)

| Package | Description | Purpose |
|----------|-------------|---------|
| **@zarish/core** | Main framework entry point | Core utilities and configuration |
| **@zarish/components** | UI component library | Reusable React components |
| **@zarish/theme** | Theme system | Material Design theming |
| **@zarish/router** | Routing system | React Router with auth guards |
| **@zarish/store** | State management | Redux Toolkit setup |

### Data Packages (4 packages)

| Package | Description | Purpose |
|----------|-------------|---------|
| **@zarish/api** | API client | HTTP client with interceptors |
| **@zarish/fhir** | FHIR utilities | FHIR R5 data models and helpers |
| **@zarish/forms** | Form utilities | Form validation and submission |
| **@zarish/cache** | Caching system | Local storage and caching |

### Utility Packages (6 packages)

| Package | Description | Purpose |
|----------|-------------|---------|
| **@zarish/utils** | General utilities | Common helper functions |
| **@zarish/hooks** | Custom hooks | React hooks for common patterns |
| **@zarish/constants** | Constants | Application constants and enums |
| **@zarish/types** | TypeScript types | Shared type definitions |
| **@zarish/i18n** | Internationalization | Translation and localization |
| **@zarish/validation** | Validation | Data validation utilities |

## 🚀 Quick Start

### Installation

```bash
# Install ESM Core in your application
npm install @zarish/core @zarish/components @zarish/theme

# Install additional packages as needed
npm install @zarish/api @zarish/fhir @zarish/forms
```

### Basic Setup

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@zarish/theme';
import { ApiProvider } from '@zarish/api';
import { I18nProvider } from '@zarish/i18n';

import App from './App';
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ApiProvider>
            <I18nProvider>
              <App />
            </I18nProvider>
          </ApiProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

### Using Components

```typescript
// src/components/PatientForm.tsx
import React from 'react';
import { 
  ZarishCard, 
  ZarishTextField, 
  ZarishButton, 
  ZarishDatePicker 
} from '@zarish/components';
import { Patient } from '@zarish/fhir';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (patient: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ 
  patient, 
  onSubmit 
}) => {
  const [formData, setFormData] = React.useState<Partial<Patient>>(
    patient || {}
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData as Patient);
  };

  return (
    <ZarishCard title="Patient Information">
      <form onSubmit={handleSubmit}>
        <ZarishTextField
          label="First Name"
          value={formData.name?.[0]?.given?.[0] || ''}
          onChange={(value) => setFormData({
            ...formData,
            name: [{ given: [value] }]
          })}
          required
        />
        
        <ZarishTextField
          label="Last Name"
          value={formData.name?.[0]?.family || ''}
          onChange={(value) => setFormData({
            ...formData,
            name: [{ 
              given: formData.name?.[0]?.given || [],
              family: value 
            }]
          })}
          required
        />
        
        <ZarishDatePicker
          label="Date of Birth"
          value={formData.birthDate}
          onChange={(value) => setFormData({
            ...formData,
            birthDate: value
          })}
        />
        
        <ZarishButton 
          type="submit" 
          variant="contained"
          color="primary"
        >
          Save Patient
        </ZarishButton>
      </form>
    </ZarishCard>
  );
};

export default PatientForm;
```

## 🎨 Component Library

### Available Components

#### Form Components
- **ZarishTextField**: Text input with validation
- **ZarishDatePicker**: Date picker with Bangladesh calendar
- **ZarishSelect**: Dropdown with search
- **ZarishCheckbox**: Checkbox with label
- **ZarishRadioGroup**: Radio button group
- **ZarishSwitch**: Toggle switch

#### Layout Components
- **ZarishCard**: Material card with header
- **ZarishGrid**: Responsive grid system
- **ZarishContainer**: Container with max-width
- **ZarishStack**: Flexbox stack layout

#### Navigation Components
- **ZarishAppBar**: Application header
- **ZarishDrawer**: Side navigation drawer
- **ZarishTabs**: Tab navigation
- **ZarishBreadcrumb**: Breadcrumb navigation

#### Data Display Components
- **ZarishTable**: Data table with sorting/filtering
- **ZarishList**: List with virtualization
- **ZarishChip**: Small status indicators
- **ZarishAvatar**: User avatar with initials

#### Feedback Components
- **ZarishButton**: Material button with variants
- **ZarishAlert**: Alert messages
- **ZarishDialog**: Modal dialogs
- **ZarishSnackbar**: Toast notifications
- **ZarishProgress**: Progress indicators

## 🔧 API Integration

### API Client Configuration

```typescript
// src/api/config.ts
import { createApiClient } from '@zarish/api';

export const apiClient = createApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  retryAttempts: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/fhir+json'
  }
});

// Add authentication interceptor
apiClient.addRequestInterceptor((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling interceptor
apiClient.addResponseInterceptor(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Using API Client

```typescript
// src/services/patientService.ts
import { apiClient } from '../api/config';
import { Patient, PatientSearchParams } from '@zarish/fhir';

export class PatientService {
  static async getPatients(params?: PatientSearchParams): Promise<Patient[]> {
    const response = await apiClient.get('/api/patients', { params });
    return response.data;
  }

  static async getPatient(id: string): Promise<Patient> {
    const response = await apiClient.get(`/api/patients/${id}`);
    return response.data;
  }

  static async createPatient(patient: Patient): Promise<Patient> {
    const response = await apiClient.post('/api/patients', patient);
    return response.data;
  }

  static async updatePatient(id: string, patient: Patient): Promise<Patient> {
    const response = await apiClient.put(`/api/patients/${id}`, patient);
    return response.data;
  }
}
```

## 🏥 FHIR Integration

### FHIR Data Models

```typescript
// src/types/fhir.ts
import { Patient, Encounter, Observation } from '@zarish/fhir';

// Type-safe FHIR usage
const patient: Patient = {
  resourceType: 'Patient',
  name: [{
    given: ['John'],
    family: 'Doe'
  }],
  gender: 'male',
  birthDate: '1990-01-01',
  identifier: [{
    type: {
      coding: [{
        system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
        code: 'MR',
        display: 'Medical Record Number'
      }]
    },
    value: 'MRN123456789'
  }]
};
```

### FHIR Utilities

```typescript
import { fhirUtils } from '@zarish/fhir';

// Format patient name
const displayName = fhirUtils.formatPatientName(patient.name);

// Calculate age from birth date
const age = fhirUtils.calculateAge(patient.birthDate);

// Validate FHIR resource
const isValid = fhirUtils.validateResource(patient, 'Patient');

// Extract observations by code
const vitals = fhirUtils.filterObservationsByCode(
  observations, 
  'http://loinc.org', 
  'vital-signs'
);
```

## 🎨 Theming

### Theme Configuration

```typescript
// src/theme/index.ts
import { createZarishTheme } from '@zarish/theme';

export const zarishTheme = createZarishTheme({
  palette: {
    primary: {
      main: '#1976d2', // ZARISH blue
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#00acc1', // Cyan accent
      light: '#33b5e5',
      dark: '#00838f'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none'
        }
      }
    }
  }
});
```

## 🌍 Internationalization

### Bangladesh Localization

```typescript
// src/i18n/bn-BD.json
{
  "common": {
    "save": "সংরক্ষণ",
    "cancel": "বাতিল",
    "edit": "সম্পাদনা",
    "delete": "মুছে ফেলা",
    "search": "অনুসন্ধান",
    "patient": "রোগী",
    "doctor": "ডাক্তার",
    "appointment": "অ্যাপয়েন্টমেন্ট"
  },
  "patient": {
    "registration": "রোগী নিবন্ধন",
    "search": "রোগী অনুসন্ধান",
    "demographics": "জনসংখ্যা",
    "medicalHistory": "চিকিৎসা ইতিহাস"
  }
}
```

## 🧪 Testing

### Component Testing

```typescript
// src/components/__tests__/PatientForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PatientForm } from '../PatientForm';
import { store } from '../../store';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('PatientForm', () => {
  test('renders patient form fields', () => {
    renderWithProvider(<PatientForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
  });

  test('submits form with correct data', () => {
    const mockOnSubmit = jest.fn();
    renderWithProvider(<PatientForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' }
    });
    fireEvent.click(screen.getByText('Save Patient'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: [{ given: ['John'], family: 'Doe' }]
    });
  });
});
```

## 📚 Best Practices

### Component Development
1. **Use TypeScript** for type safety
2. **Follow Material Design** guidelines
3. **Make components accessible** with ARIA labels
4. **Write tests** for all components
5. **Document props** with JSDoc

### State Management
1. **Use Redux Toolkit** for global state
2. **Keep state normalized** for better performance
3. **Use selectors** for derived data
4. **Handle async actions** with createAsyncThunk

### Performance
1. **Use React.memo** for expensive components
2. **Implement virtual scrolling** for large lists
3. **Lazy load routes** with React.lazy
4. **Optimize bundle size** with tree shaking

## 🔗 Related Resources

- **Component Storybook**: https://storybook.zarish-his.com
- **API Documentation**: https://api.zarish-his.com/docs
- **Design System**: https://design.zarish-his.com
- **FHIR Implementation Guide**: https://zs-his.github.io/docs/fhir-ig/

---

*Last updated: 2026-01-21*
