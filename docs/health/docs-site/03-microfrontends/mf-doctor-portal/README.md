# Doctor Portal Microfrontend

## 🎯 Overview

The **Doctor Portal** is the primary clinical workspace for physicians and healthcare providers in ZARISH HIS. It provides comprehensive patient management, clinical documentation, and decision support tools.

## 🏗️ Architecture

### Frontend Details
- **Frontend ID**: MF-001
- **Repository**: [zs-his/mf-doctor-portal](https://github.com/zs-his/mf-doctor-portal)
- **Technology Stack**: React 19 + TypeScript, Vite, Tailwind CSS
- **Deployment**: Docker + Kubernetes
- **Port**: 3001

### Core Features
- Patient dashboard and search
- Clinical encounter management
- Electronic health records (EHR)
- Prescription management
- Lab results review
- Clinical decision support
- Telemedicine integration

## 📱 Component Structure

### Directory Layout
```
mf-doctor-portal/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Shared components
│   │   ├── forms/           # Form components
│   │   ├── charts/          # Data visualization
│   │   └── tables/          # Data tables
│   ├── pages/               # Page components
│   │   ├── Dashboard/       # Main dashboard
│   │   ├── Patients/        # Patient management
│   │   ├── Encounters/      # Clinical encounters
│   │   ├── Prescriptions/   # Prescription management
│   │   └── Labs/            # Lab results
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── store/               # State management
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   └── styles/              # CSS/SCSS styles
├── public/                  # Static assets
├── tests/                   # Test files
├── docs/                    # Documentation
└── package.json
```

## 🔌 API Integration

### Service Layer
```typescript
// services/patientService.ts
import { apiClient } from './apiClient';

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email: string;
  isActive: boolean;
}

export class PatientService {
  async getPatients(params: {
    page?: number;
    limit?: number;
    search?: string;
    gender?: string;
  }): Promise<{ data: Patient[]; meta: any }> {
    const response = await apiClient.get('/patients', { params });
    return response.data;
  }

  async getPatientById(id: string): Promise<Patient> {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data.data;
  }

  async createPatient(patient: Partial<Patient>): Promise<Patient> {
    const response = await apiClient.post('/patients', patient);
    return response.data.data;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const response = await apiClient.put(`/patients/${id}`, updates);
    return response.data.data;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const response = await apiClient.get('/patients/search', {
      params: { q: query }
    });
    return response.data.data;
  }
}
```

### API Client Configuration
```typescript
// services/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.zarishsphere.com';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
```

## 🎨 UI Components

### Patient Search Component
```typescript
// components/PatientSearch.tsx
import React, { useState, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { PatientService } from '../services/patientService';

interface PatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
  placeholder?: string;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  onPatientSelect,
  placeholder = "Search patients by name, MRN, or phone..."
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  const searchPatients = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const patients = await PatientService.searchPatients(searchQuery);
      setResults(patients);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    searchPatients(debouncedQuery);
  }, [debouncedQuery, searchPatients]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((patient) => (
            <div
              key={patient.id}
              onClick={() => {
                onPatientSelect(patient);
                setQuery('');
                setResults([]);
              }}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </div>
              <div className="text-sm text-gray-500">
                MRN: {patient.mrn} | {patient.phoneNumber}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
          <div className="text-gray-500">Searching...</div>
        </div>
      )}
    </div>
  );
};
```

### Vital Signs Chart Component
```typescript
// components/VitalSignsChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';

interface VitalSignsChartProps {
  data: {
    timestamps: string[];
    bloodPressure: { systolic: number[]; diastolic: number[] };
    heartRate: number[];
    temperature: number[];
    oxygenSaturation: number[];
  };
}

export const VitalSignsChart: React.FC<VitalSignsChartProps> = ({ data }) => {
  const chartData = {
    labels: data.timestamps,
    datasets: [
      {
        label: 'Systolic BP',
        data: data.bloodPressure.systolic,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Diastolic BP',
        data: data.bloodPressure.diastolic,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Heart Rate',
        data: data.heartRate,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        yAxisID: 'y1',
      },
      {
        label: 'Temperature',
        data: data.temperature,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        yAxisID: 'y1',
      },
      {
        label: 'O2 Saturation',
        data: data.oxygenSaturation,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Blood Pressure (mmHg)',
        },
        min: 50,
        max: 200,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Other Vitals',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
```

## 📱 Page Components

### Dashboard Page
```typescript
// pages/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { PatientSearch } from '../../components/PatientSearch';
import { VitalSignsChart } from '../../components/VitalSignsChart';
import { PatientService } from '../../services/patientService';

export const Dashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [vitalSignsData, setVitalSignsData] = useState(null);

  useEffect(() => {
    loadRecentPatients();
  }, []);

  const loadRecentPatients = async () => {
    try {
      const response = await PatientService.getPatients({ limit: 10 });
      setRecentPatients(response.data);
    } catch (error) {
      console.error('Failed to load recent patients:', error);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    loadVitalSigns(patient.id);
  };

  const loadVitalSigns = async (patientId: string) => {
    try {
      // Load vital signs data
      const response = await apiClient.get(`/patients/${patientId}/vital-signs`);
      setVitalSignsData(response.data);
    } catch (error) {
      console.error('Failed to load vital signs:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your patients and clinical encounters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Search */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Search</h2>
              <PatientSearch onPatientSelect={handlePatientSelect} />
              
              {selectedPatient && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Selected Patient</h3>
                  <p className="text-blue-700">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </p>
                  <p className="text-sm text-blue-600">
                    MRN: {selectedPatient.mrn}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Patient Summary</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">MRN</p>
                      <p className="font-medium">{selectedPatient.mrn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{selectedPatient.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium capitalize">{selectedPatient.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Vital Signs Chart */}
                {vitalSignsData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Vital Signs Trend</h2>
                    <VitalSignsChart data={vitalSignsData} />
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      New Encounter
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Prescribe Medication
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Order Lab Tests
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      View Records
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Selected</h3>
                <p className="text-gray-500">Search for a patient to view their clinical information</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        {!selectedPatient && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MRN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{patient.phoneNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.mrn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Today
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handlePatientSelect(patient)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

## 🎨 Styling and Theming

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        medical: {
          blue: '#0066cc',
          green: '#00a652',
          orange: '#ff6b35',
          red: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## 🧪 Testing

### Component Testing
```typescript
// components/__tests__/PatientSearch.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PatientSearch } from '../PatientSearch';
import { PatientService } from '../../services/patientService';

// Mock the service
jest.mock('../../services/patientService');
const mockPatientService = PatientService as jest.Mocked<typeof PatientService>;

describe('PatientSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input', () => {
    render(<PatientSearch onPatientSelect={jest.fn()} />);
    expect(screen.getByPlaceholderText('Search patients...')).toBeInTheDocument();
  });

  it('should search patients when typing', async () => {
    const mockPatients = [
      { id: '1', firstName: 'John', lastName: 'Doe', mrn: 'MRN123' },
    ];
    
    mockPatientService.searchPatients.mockResolvedValue(mockPatients);

    render(<PatientSearch onPatientSelect={jest.fn()} />);
    
    const input = screen.getByPlaceholderText('Search patients...');
    fireEvent.change(input, { target: { value: 'John' } });

    await waitFor(() => {
      expect(mockPatientService.searchPatients).toHaveBeenCalledWith('John');
    });
  });

  it('should display search results', async () => {
    const mockPatients = [
      { id: '1', firstName: 'John', lastName: 'Doe', mrn: 'MRN123', phoneNumber: '555-1234' },
    ];
    
    mockPatientService.searchPatients.mockResolvedValue(mockPatients);
    const onPatientSelect = jest.fn();

    render(<PatientSearch onPatientSelect={onPatientSelect} />);
    
    const input = screen.getByPlaceholderText('Search patients...');
    fireEvent.change(input, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('MRN: MRN123 | 555-1234')).toBeInTheDocument();
    });
  });
});
```

## 🚀 Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mf-doctor-portal
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mf-doctor-portal
  template:
    metadata:
      labels:
        app: mf-doctor-portal
    spec:
      containers:
      - name: mf-doctor-portal
        image: zarish/mf-doctor-portal:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_URL
          value: "https://api.zarishsphere.com"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Frontend Team: ZARISH HIS*
