# Patient App Microfrontend

## 🎯 Overview

The **Patient App** is the mobile-first patient portal for ZARISH HIS, enabling patients to manage their healthcare information, schedule appointments, view test results, and communicate with healthcare providers.

## 🏗️ Architecture

### Frontend Details
- **Frontend ID**: MF-003
- **Repository**: [zs-his/mf-patient-app](https://github.com/zs-his/mf-patient-app)
- **Technology Stack**: React Native + TypeScript, Expo
- **Deployment**: App Store, Google Play Store
- **Target Platforms**: iOS, Android

### Core Features
- Patient profile management
- Appointment scheduling and management
- Lab results viewing
- Medication management
- Secure messaging with providers
- Telemedicine video calls
- Health record access
- Payment processing
- Health education resources

## 📱 Component Structure

### Directory Layout
```
mf-patient-app/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Shared components
│   │   ├── forms/           # Form components
│   │   ├── charts/          # Data visualization
│   │   └── lists/           # List components
│   ├── screens/             # Screen components
│   │   ├── Auth/            # Authentication screens
│   │   ├── Dashboard/       # Main dashboard
│   │   ├── Profile/         # Patient profile
│   │   ├── Appointments/    # Appointment management
│   │   ├── Results/         # Lab results
│   │   ├── Medications/     # Medication management
│   │   └── Messages/        # Secure messaging
│   ├── navigation/          # Navigation configuration
│   ├── services/            # API services
│   ├── store/               # State management
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   └── assets/              # Static assets
├── __tests__/               # Test files
├── android/                 # Android-specific code
├── ios/                     # iOS-specific code
├── app.json                 # Expo configuration
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
  address: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  allergies: string[];
  medications: Medication[];
  conditions: string[];
}

export class PatientService {
  async getPatientProfile(): Promise<Patient> {
    const response = await apiClient.get('/patients/me');
    return response.data.data;
  }

  async updateProfile(updates: Partial<Patient>): Promise<Patient> {
    const response = await apiClient.put('/patients/me', updates);
    return response.data.data;
  }

  async uploadProfilePhoto(imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('photo', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const response = await apiClient.post('/patients/me/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.photoUrl;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/patients/me/change-password', {
      currentPassword,
      newPassword,
    });
  }
}
```

### API Client Configuration
```typescript
// services/apiClient.ts
import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zarishsphere.com';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
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
      async (error) => {
        if (error.response?.status === 401) {
          // Clear stored token and redirect to login
          await AsyncStorage.removeItem('authToken');
          // Navigate to login screen (handled by navigation service)
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
```

## 📱 Screen Components

### Dashboard Screen
```typescript
// screens/Dashboard/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PatientService } from '../../services/patientService';
import { AppointmentService } from '../../services/appointmentService';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DashboardScreen: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [patientData, appointmentsData, resultsData] = await Promise.all([
        PatientService.getPatientProfile(),
        AppointmentService.getUpcomingAppointments(),
        LabResultsService.getRecentResults(),
      ]);

      setPatient(patientData);
      setUpcomingAppointments(appointmentsData);
      setRecentResults(resultsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Avatar
            source={{ uri: patient?.photoUrl }}
            name={`${patient?.firstName} ${patient?.lastName}`}
            size={60}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>
              Welcome back, {patient?.firstName}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Your health at your fingertips
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#3b82f6' }]}>
              <Text style={styles.actionIconText}>📅</Text>
            </View>
            <Text style={styles.actionText}>Book Appointment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#10b981' }]}>
              <Text style={styles.actionIconText}>💊</Text>
            </View>
            <Text style={styles.actionText}>Medications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#f59e0b' }]}>
              <Text style={styles.actionIconText}>🔬</Text>
            </View>
            <Text style={styles.actionText}>Lab Results</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.actionIconText}>💬</Text>
            </View>
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.slice(0, 2).map((appointment) => (
            <Card key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentDate}>
                  {formatDate(appointment.dateTime)}
                </Text>
                <Text style={[styles.appointmentStatus, appointment.status]}>
                  {appointment.status}
                </Text>
              </View>
              <Text style={styles.appointmentType}>{appointment.type}</Text>
              <Text style={styles.appointmentProvider}>
                Dr. {appointment.provider.name}
              </Text>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            <TouchableOpacity style={styles.emptyStateButton}>
              <Text style={styles.emptyStateButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </Card>
        )}
      </View>

      {/* Recent Lab Results */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Lab Results</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentResults.length > 0 ? (
          recentResults.slice(0, 2).map((result) => (
            <Card key={result.id} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultName}>{result.testName}</Text>
                <Text style={[styles.resultStatus, result.status]}>
                  {result.status}
                </Text>
              </View>
              <Text style={styles.resultDate}>
                {formatDate(result.resultDate)}
              </Text>
              {result.status === 'completed' && (
                <TouchableOpacity style={styles.viewResultButton}>
                  <Text style={styles.viewResultButtonText}>View Result</Text>
                </TouchableOpacity>
              )}
            </Card>
          ))
        ) : (
          <Card style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent lab results</Text>
          </Card>
        )}
      </View>

      {/* Health Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Tips</Text>
        <Card style={styles.healthTipCard}>
          <Text style={styles.healthTipTitle}>Stay Hydrated</Text>
          <Text style={styles.healthTipText}>
            Drinking 8 glasses of water daily helps maintain overall health and supports bodily functions.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 15,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
  },
  appointmentCard: {
    marginBottom: 10,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  appointmentStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    textTransform: 'capitalize',
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  appointmentProvider: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultCard: {
    marginBottom: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  resultStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    textTransform: 'capitalize',
  },
  resultDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  viewResultButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  viewResultButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 15,
  },
  emptyStateButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  healthTipCard: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  healthTipText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};
```

## 🎨 UI Components

### Custom Button Component
```typescript
// components/common/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.buttonPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.buttonGhost);
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonSmall);
        break;
      case 'medium':
        baseStyle.push(styles.buttonMedium);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge);
        break;
    }
    
    // State styles
    if (disabled) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.textPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.textSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.textOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.textGhost);
        break;
    }
    
    switch (size) {
      case 'small':
        baseStyle.push(styles.textSmall);
        break;
      case 'medium':
        baseStyle.push(styles.textMedium);
        break;
      case 'large':
        baseStyle.push(styles.textLarge);
        break;
    }
    
    if (disabled) {
      baseStyle.push(styles.textDisabled);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  buttonSecondary: {
    backgroundColor: '#6b7280',
    borderColor: '#6b7280',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: '#3b82f6',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  buttonMedium: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  buttonLarge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  buttonDisabled: {
    backgroundColor: '#e5e7eb',
    borderColor: '#e5e7eb',
  },
  text: {
    fontWeight: '500',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#ffffff',
  },
  textOutline: {
    color: '#3b82f6',
  },
  textGhost: {
    color: '#3b82f6',
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
  textDisabled: {
    color: '#9ca3af',
  },
});
```

## 🧪 Testing

### Component Testing
```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={jest.fn()} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={jest.fn()} loading={true} />
    );
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should be disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled={true} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
```

## 🚀 Deployment

### Expo Configuration
```json
{
  "expo": {
    "name": "ZARISH Patient App",
    "slug": "zarish-patient-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "platforms": {
      "ios": {
        "bundleIdentifier": "com.zarish.patientapp",
        "buildNumber": "1.0.0",
        "supportsTablet": true
      },
      "android": {
        "package": "com.zarish.patientapp",
        "versionCode": 1,
        "adaptiveIcon": {
          "foregroundImage": "./assets/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        }
      }
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

### Build Scripts
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "submit": "eas submit",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
```

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Mobile Team: ZARISH HIS*
