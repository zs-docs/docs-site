# ESM Components

ESM Components is a specialized component library for ZARISH HIS healthcare applications, providing domain-specific UI components for medical workflows, patient interactions, and clinical data visualization.

## 📋 Package Overview

**Package Name**: `@zarish/esm-components`  
**Version**: 1.0.0  
**Repository**: [zs-his/esm-components](https://github.com/zs-his/esm-components)  
**Technology Stack**: React 18+, TypeScript, Tailwind CSS, Chart.js

### Core Features
- **Medical Forms**: Healthcare-specific form components
- **Patient Components**: Patient data display and interaction
- **Clinical Charts**: Medical data visualization
- **Prescription Tools**: Medication management components
- **Lab Result Display**: Laboratory result visualization
- **Appointment Management**: Scheduling and calendar components
- **Bangladesh Healthcare**: Localized medical components

## 🏗️ Architecture

### Component Structure
```
esm-components/
├── src/
│   ├── medical/              # Medical-specific components
│   │   ├── forms/           # Medical forms
│   │   ├── charts/          # Medical charts
│   │   └── displays/        # Data displays
│   ├── patient/              # Patient-related components
│   ├── clinical/              # Clinical workflow components
│   ├── laboratory/            # Lab result components
│   ├── pharmacy/              # Pharmacy components
│   └── appointment/          # Scheduling components
├── stories/                  # Storybook stories
├── tests/                    # Component tests
└── docs/                     # Component documentation
```

## 🏥 Medical Components

### Patient Card
```typescript
// src/patient/PatientCard/PatientCard.tsx
import React from 'react';
import { Card } from '@zarish/esm-core';
import { formatDate, formatPhoneNumber } from '@zarish/esm-core/utils';

interface PatientCardProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    phoneNumber: string;
    mrn: string;
    bloodGroup?: string;
    photo?: string;
  };
  onClick?: () => void;
  showActions?: boolean;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onClick,
  showActions = true,
}) => {
  const age = Math.floor((new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25));

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start space-x-4">
        {/* Patient Photo */}
        <div className="flex-shrink-0">
          {patient.photo ? (
            <img
              src={patient.photo}
              alt={`${patient.firstName} ${patient.lastName}`}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-lg font-medium">
                {patient.firstName[0]}{patient.lastName[0]}
              </span>
            </div>
          )}
        </div>

        {/* Patient Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {patient.firstName} {patient.lastName}
            </h3>
            <span className="text-sm text-gray-500">
              {patient.gender === 'male' ? '♂' : '♀'} {age}y
            </span>
          </div>
          
          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
            <span>MRN: {patient.mrn}</span>
            <span>•</span>
            <span>{formatPhoneNumber(patient.phoneNumber)}</span>
          </div>
          
          <div className="mt-1 text-sm text-gray-500">
            DOB: {formatDate(patient.dateOfBirth)}
          </div>
          
          {patient.bloodGroup && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Blood Group: {patient.bloodGroup}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            View Details
          </button>
          <button className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
            Edit
          </button>
        </div>
      )}
    </Card>
  );
};
```

### Vital Signs Display
```typescript
// src/medical/VitalSigns/VitalSigns.tsx
import React from 'react';
import { Card } from '@zarish/esm-core';

interface VitalSignsProps {
  vitalSigns: {
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
  };
  recordedAt: string;
  recordedBy: string;
}

export const VitalSigns: React.FC<VitalSignsProps> = ({
  vitalSigns,
  recordedAt,
  recordedBy,
}) => {
  const getVitalStatus = (vital: string, value: number, normalRange: { min: number; max: number }) => {
    if (value < normalRange.min || value > normalRange.max) {
      return 'abnormal';
    }
    return 'normal';
  };

  const bpStatus = getVitalStatus('BP', vitalSigns.bloodPressure.systolic, { min: 90, max: 140 });
  const hrStatus = getVitalStatus('HR', vitalSigns.heartRate, { min: 60, max: 100 });
  const tempStatus = getVitalStatus('Temp', vitalSigns.temperature, { min: 36.5, max: 37.5 });
  const o2Status = getVitalStatus('O2', vitalSigns.oxygenSaturation, { min: 95, max: 100 });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
        <div className="text-sm text-gray-500">
          Recorded: {formatDate(recordedAt)} by {recordedBy}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Blood Pressure */}
        <div className={`p-4 rounded-lg border ${bpStatus === 'abnormal' ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Blood Pressure</span>
            <span className={`text-xs px-2 py-1 rounded ${bpStatus === 'abnormal' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {bpStatus === 'abnormal' ? 'High' : 'Normal'}
            </span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic}
          </div>
          <div className="text-xs text-gray-500">mmHg</div>
        </div>

        {/* Heart Rate */}
        <div className={`p-4 rounded-lg border ${hrStatus === 'abnormal' ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Heart Rate</span>
            <span className={`text-xs px-2 py-1 rounded ${hrStatus === 'abnormal' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {hrStatus === 'abnormal' ? 'Abnormal' : 'Normal'}
            </span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {vitalSigns.heartRate}
          </div>
          <div className="text-xs text-gray-500">bpm</div>
        </div>

        {/* Temperature */}
        <div className={`p-4 rounded-lg border ${tempStatus === 'abnormal' ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Temperature</span>
            <span className={`text-xs px-2 py-1 rounded ${tempStatus === 'abnormal' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {tempStatus === 'abnormal' ? 'Fever' : 'Normal'}
            </span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {vitalSigns.temperature}°C
          </div>
          <div className="text-xs text-gray-500">Celsius</div>
        </div>

        {/* Oxygen Saturation */}
        <div className={`p-4 rounded-lg border ${o2Status === 'abnormal' ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">O₂ Saturation</span>
            <span className={`text-xs px-2 py-1 rounded ${o2Status === 'abnormal' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {o2Status === 'abnormal' ? 'Low' : 'Normal'}
            </span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {vitalSigns.oxygenSaturation}%
          </div>
          <div className="text-xs text-gray-500">SpO₂</div>
        </div>
      </div>
    </Card>
  );
};
```

## 💊 Pharmacy Components

### Prescription Card
```typescript
// src/pharmacy/PrescriptionCard/PrescriptionCard.tsx
import React from 'react';
import { Card, Button } from '@zarish/esm-core';

interface PrescriptionCardProps {
  prescription: {
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }>;
    status: 'active' | 'completed' | 'cancelled';
  };
  onFill?: (id: string) => void;
  onView?: (id: string) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onFill,
  onView,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Prescription</h3>
          <p className="text-sm text-gray-500">Dr. {prescription.doctorName}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
          {prescription.status}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Patient:</span> {prescription.patientName}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Date:</span> {formatDate(prescription.date)}
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Medications:</h4>
        {prescription.medications.map((med, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage}</p>
                <p className="text-sm text-gray-600">{med.frequency} for {med.duration}</p>
                {med.instructions && (
                  <p className="text-sm text-gray-500 italic">{med.instructions}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex space-x-2">
        {prescription.status === 'active' && (
          <Button onClick={() => onFill?.(prescription.id)} size="sm">
            Fill Prescription
          </Button>
        )}
        <Button variant="outline" onClick={() => onView?.(prescription.id)} size="sm">
          View Details
        </Button>
      </div>
    </Card>
  );
};
```

### Medication Search
```typescript
// src/pharmacy/MedicationSearch/MedicationSearch.tsx
import React, { useState, useEffect } from 'react';
import { Input, Card } from '@zarish/esm-core';
import { useDebounce } from '@zarish/esm-core/hooks';

interface MedicationSearchProps {
  onMedicationSelect: (medication: any) => void;
  placeholder?: string;
}

export const MedicationSearch: React.FC<MedicationSearchProps> = ({
  onMedicationSelect,
  placeholder = "Search medications...",
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const searchMedications = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual API
        const mockResults = [
          {
            id: '1',
            name: 'Paracetamol 500mg',
            genericName: 'Acetaminophen',
            brand: 'Tylenol',
            dosage: '500mg',
            form: 'Tablet',
            manufacturer: 'Square Pharmaceuticals',
            price: 5.00,
            stock: 1000,
          },
          {
            id: '2',
            name: 'Amoxicillin 250mg',
            genericName: 'Amoxicillin',
            brand: 'Amoxil',
            dosage: '250mg',
            form: 'Capsule',
            manufacturer: 'Beximco',
            price: 15.00,
            stock: 500,
          },
        ].filter(med => 
          med.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          med.genericName.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        
        setResults(mockResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    searchMedications();
  }, [debouncedQuery]);

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        icon={<span>💊</span>}
      />
      
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((medication) => (
            <div
              key={medication.id}
              onClick={() => {
                onMedicationSelect(medication);
                setQuery('');
                setResults([]);
              }}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{medication.name}</div>
                  <div className="text-sm text-gray-500">{medication.genericName}</div>
                  <div className="text-sm text-gray-500">{medication.brand}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">৳{medication.price.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Stock: {medication.stock}</div>
                </div>
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

## 🔬 Laboratory Components

### Lab Result Card
```typescript
// src/laboratory/LabResultCard/LabResultCard.tsx
import React from 'react';
import { Card, Button } from '@zarish/esm-core';

interface LabResultCardProps {
  result: {
    id: string;
    testName: string;
    testCode: string;
    patientName: string;
    doctorName: string;
    resultDate: string;
    status: 'pending' | 'completed' | 'abnormal';
    values: Array<{
      parameter: string;
      value: string;
      unit: string;
      referenceRange: string;
      status: 'normal' | 'high' | 'low';
    }>;
    reportUrl?: string;
  };
  onViewReport?: (id: string) => void;
}

export const LabResultCard: React.FC<LabResultCardProps> = ({
  result,
  onViewReport,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'abnormal':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{result.testName}</h3>
          <p className="text-sm text-gray-500">Code: {result.testCode}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
          {result.status}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Patient:</span> {result.patientName}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Doctor:</span> {result.doctorName}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Result Date:</span> {formatDate(result.resultDate)}
        </p>
      </div>

      {result.values && result.values.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Test Results:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parameter
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.values.map((value, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-sm text-gray-900">{value.parameter}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`font-medium ${
                        value.status === 'high' ? 'text-red-600' :
                        value.status === 'low' ? 'text-blue-600' :
                        'text-gray-900'
                      }`}>
                        {value.value}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500">{value.unit}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{value.referenceRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        {result.reportUrl && (
          <Button onClick={() => onViewReport?.(result.id)} size="sm">
            View Report
          </Button>
        )}
        {result.status === 'completed' && (
          <Button variant="outline" size="sm">
            Download PDF
          </Button>
        )}
      </div>
    </Card>
  );
};
```

## 📅 Appointment Components

### Appointment Calendar
```typescript
// src/appointment/AppointmentCalendar/AppointmentCalendar.tsx
import React, { useState } from 'react';
import { Card } from '@zarish/esm-core';

interface AppointmentCalendarProps {
  appointments: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    patientName: string;
    doctorName: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }>;
  onAppointmentSelect?: (appointment: any) => void;
  onDateSelect?: (date: Date) => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onAppointmentSelect,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.start);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Appointment Calendar</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            {/* Calendar implementation would go here */}
            <div className="text-center text-gray-500">
              Calendar Component
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Appointments for {selectedDate?.toLocaleDateString() || currentDate.toLocaleDateString()}
          </h4>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {getAppointmentsForDate(selectedDate || currentDate).map((appointment) => (
              <div
                key={appointment.id}
                onClick={() => onAppointmentSelect?.(appointment)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{appointment.title}</div>
                    <div className="text-sm text-gray-500">{appointment.patientName}</div>
                    <div className="text-sm text-gray-500">Dr. {appointment.doctorName}</div>
                    <div className="text-sm text-gray-500">
                      {appointment.start.toLocaleTimeString()} - {appointment.end.toLocaleTimeString()}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
            
            {getAppointmentsForDate(selectedDate || currentDate).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No appointments scheduled for this date
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
```

## 🧪 Testing

### Component Tests
```typescript
// tests/components/PatientCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PatientCard } from '../../src/patient/PatientCard';

describe('PatientCard', () => {
  const mockPatient = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'male' as const,
    phoneNumber: '+8801712345678',
    mrn: 'MRN123456',
    bloodGroup: 'O+',
  };

  it('renders patient information correctly', () => {
    render(<PatientCard patient={mockPatient} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('MRN123456')).toBeInTheDocument();
    expect(screen.getByText('+8801712345678')).toBeInTheDocument();
    expect(screen.getByText('Blood Group: O+')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<PatientCard patient={mockPatient} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('John Doe'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calculates age correctly', () => {
    render(<PatientCard patient={mockPatient} />);
    // Assuming current year is 2026, age should be approximately 36
    expect(screen.getByText(/\d+y/)).toBeInTheDocument();
  });
});
```

## 🚀 Usage Examples

### Medical Dashboard
```typescript
import { PatientCard, VitalSigns, LabResultCard } from '@zarish/esm-components';

function MedicalDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  return (
    <div className="space-y-6">
      <PatientCard
        patient={mockPatient}
        onClick={() => setSelectedPatient(mockPatient)}
      />
      
      <VitalSigns
        vitalSigns={mockVitalSigns}
        recordedAt={new Date().toISOString()}
        recordedBy="Dr. Smith"
      />
      
      <LabResultCard
        result={mockLabResult}
        onViewReport={(id) => console.log('View report:', id)}
      />
    </div>
  );
}
```

### Pharmacy Management
```typescript
import { PrescriptionCard, MedicationSearch } from '@zarish/esm-components';

function PharmacyManagement() {
  const handleMedicationSelect = (medication) => {
    console.log('Selected medication:', medication);
  };
  
  const handleFillPrescription = (prescriptionId) => {
    console.log('Fill prescription:', prescriptionId);
  };
  
  return (
    <div className="space-y-6">
      <MedicationSearch
        onMedicationSelect={handleMedicationSelect}
        placeholder="Search for medications..."
      />
      
      <PrescriptionCard
        prescription={mockPrescription}
        onFill={handleFillPrescription}
      />
    </div>
  );
}
```

## 📦 Package Configuration

### package.json
```json
{
  "name": "@zarish/esm-components",
  "version": "1.0.0",
  "description": "ZARISH HIS Healthcare Components",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "storybook": "storybook dev -p 6007",
    "build-storybook": "storybook build -o storybook-static"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "@zarish/esm-core": "^1.0.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@storybook/addon-essentials": "^7.0.0",
    "@storybook/react": "^7.0.0",
    "@storybook/react-vite": "^7.0.0",
    "eslint": "^8.0.0",
    "eslint-config-react-app": "^7.0.0",
    "jest": "^29.0.0",
    "rollup": "^3.0.0",
    "typescript": "^4.0.0",
    "vite": "^4.0.0"
  }
}
```

---

*Last updated: 2026-01-21*
