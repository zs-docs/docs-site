# ESM Shared

ESM Shared is a comprehensive utility library providing shared functionality, state management, and integration patterns for all ZARISH HIS frontend applications.

## 📋 Package Overview

**Package Name**: `@zarish/esm-shared`  
**Version**: 1.0.0  
**Repository**: [zs-his/esm-shared](https://github.com/zs-his/esm-shared)  
**Technology Stack**: TypeScript, Zustand, React Query, Axios

### Core Features
- **State Management**: Global state with Zustand
- **API Integration**: React Query for data fetching
- **Authentication**: JWT token management
- **Error Handling**: Global error management
- **Storage Management**: Local storage utilities
- **Bangladesh Context**: Localized utilities and constants
- **Type Safety**: Comprehensive TypeScript definitions

## 🏗️ Architecture

### Library Structure
```
esm-shared/
├── src/
│   ├── store/               # State management
│   │   ├── slices/          # Zustand slices
│   │   ├── hooks/           # Store hooks
│   │   └── middleware/      # Store middleware
│   ├── api/                 # API integration
│   │   ├── client/          # API client
│   │   ├── hooks/           # React Query hooks
│   │   └── types/           # API types
│   ├── auth/                # Authentication
│   │   ├── context/         # Auth context
│   │   ├── hooks/           # Auth hooks
│   │   └── utils/           # Auth utilities
│   ├── utils/               # Utility functions
│   │   ├── storage/         # Storage utilities
│   │   ├── validation/       # Validation utilities
│   │   └── bangladesh/      # Bangladesh-specific utilities
│   ├── types/               # TypeScript types
│   │   ├── api/             # API types
│   │   ├── auth/            # Auth types
│   │   └── common/          # Common types
│   └── constants/            # Constants and enums
├── tests/                  # Test files
└── docs/                   # Documentation
```

## 🗄️ State Management

### Store Configuration
```typescript
// src/store/store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authSlice } from './slices/authSlice';
import { uiSlice } from './slices/uiSlice';
import { apiSlice } from './slices/apiSlice';

export const useAppStore = create(
  devtools(
    persist(
      {
        name: 'zarish-his-store',
        partialize: (state) => ({
          auth: state.auth,
          ui: state.ui,
        }),
      },
      {
        name: 'zarish-his-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)();

export interface AppState extends ReturnType<typeof useAppStore> {
  auth: ReturnType<typeof authSlice>;
  ui: ReturnType<typeof uiSlice>;
  api: ReturnType<typeof apiSlice>;
}
```

### Auth Slice
```typescript
// src/store/slices/authSlice.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthSlice extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = create<AuthSlice>(
  persist(
      (set, get) => ({
        ...initialState,
        ...get(),
        
        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.post('/auth/login', credentials);
            const { user, token } = response.data;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Store token in localStorage
            localStorage.setItem('authToken', token);
          } catch (error) {
            set({
              error: error.message || 'Login failed',
              isLoading: false,
            });
          }
        },
        
        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          
          // Clear token from localStorage
          localStorage.removeItem('authToken');
        },
        
        refreshToken: async () => {
          const token = get().token;
          if (!token) return;
          
          try {
            const response = await apiClient.post('/auth/refresh', {
              refreshToken: token,
            });
            const { token: newToken } = response.data;
            
            set({ token: newToken });
            localStorage.setItem('authToken', newToken);
          } catch (error) {
            // If refresh fails, logout user
            get().logout();
          }
        },
        
        updateUser: (userData) => {
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }));
        },
        
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
```

### UI Slice
```typescript
// src/store/slices/uiSlice.ts
import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark';
  language: 'en' | 'bn';
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: boolean;
}

interface UISlice extends UIState {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setLanguage: (language: 'en' | 'bn') => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

const initialState: UIState = {
  theme: 'light',
  language: 'en',
  sidebarOpen: true,
  notifications: [],
  loading: false,
};

export const uiSlice = create<UISlice>((set, get) => ({
  ...initialState,
  ...get(),
  
  setTheme: (theme) => set({ theme }),
  
  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },
  
  setLanguage: (language) => set({ language }),
  
  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  },
  
  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  setLoading: (loading) => set({ loading }),
}));
```

## 🔌 API Integration

### API Client
```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/api';

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

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
    // Request interceptor
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

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = this.client.post('/auth/refresh', {
      refreshToken: localStorage.getItem('refreshToken'),
    }).then((response) => {
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      this.refreshTokenPromise = null;
      return token;
    });

    return this.refreshTokenPromise;
  }

  private handleAuthError() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  get<T = (url: string, config?: any) => this.client.get<T>(url, config);
  post<T = (url: string, data?: any, config?: any) => this.client.post<T>(url, data, config);
  put<T = (url: string, data?: any, config?: any) => this.client.put<T>(url, data, config);
  delete<T = (url: string, config?: any) => this.client.delete<T>(url, config);
}

export const apiClient = new ApiClient();
```

### React Query Hooks
```typescript
// src/api/hooks/usePatients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { Patient, CreatePatientData, UpdatePatientData } from '../types/api';

export const usePatients = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['patients', params],
    query: () => apiClient.get('/patients', { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    query: () => apiClient.get(`/patients/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePatientData) => apiClient.post('/patients', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Failed to create patient:', error);
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientData }) =>
      apiClient.put(`/patients/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
    onError: (error) => {
      console.error('Failed to update patient:', error);
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/patients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Failed to delete patient:', error);
    },
  });
};
```

## 🔐 Authentication

### Auth Context
```typescript
// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppStore } from '../store/store';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAppStore();

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Auth Hooks
```typescript
// src/auth/hooks/useAuth.ts
import { useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { useAppStore } from '../../store/store';

export const useAuthActions = () => {
  const { login, logout, updateUser } = useAuth();
  const { refreshToken } = useAppStore();

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    await login(credentials);
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleRefreshToken = useCallback(async () => {
    await refreshToken();
  }, [refreshToken]);

  const handleUpdateUser = useCallback((userData: Partial<User>) => {
    updateUser(userData);
  }, [updateUser]);

  return {
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handleUpdateUser,
  };
};

export const useAuthCheck = () => {
  const { isAuthenticated, token } = useAuth();
  
  return {
    isAuthenticated,
    hasToken: !!token,
    isValid: isAuthenticated && !!token,
  };
};
```

## 🛠️ Utility Functions

### Storage Utilities
```typescript
// src/utils/storage.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StorageState {
  preferences: UserPreferences;
  cache: Record<string, any>;
}

interface StorageActions {
  setPreference: (key: string, value: any) => void;
  getPreference: (key: string) => any;
  setCache: (key: string, value: any, ttl?: number) => void;
  getCache: (key: string) => any;
  clearCache: () => void;
}

const initialState: StorageState = {
  preferences: {},
  cache: {},
};

export const useStorageStore = create<StorageState & StorageActions>(
  persist(
      {
        name: 'zarish-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )(
    (set, get) => ({
      ...initialState,
      ...get(),
      
      setPreference: (key, value) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        }));
      },
      
      getPreference: (key) => {
        return get().preferences[key];
      },
      
      setCache: (key, value, ttl) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [key]: {
              value,
              timestamp: Date.now(),
              ttl: ttl || 3600000, // 1 hour default
            },
          },
        }));
      },
      
      getCache: (key) => {
        const cached = get().cache[key];
        if (!cached) return null;
        
        const { value, timestamp, ttl } = cached;
        if (Date.now() - timestamp > ttl) {
          // Cache expired
          delete get().cache[key];
          return null;
        }
        
        return value;
      },
      
      clearCache: () => {
        set({ cache: {} });
      },
    })
  )
);
```

### Validation Utilities
```typescript
// src/utils/validation.ts
import { validators } from './validators';

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, Array<(value: any) => string | null>>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, value] of Object.entries(data)) {
    const fieldRules = rules[field];
    if (!fieldRules) continue;

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        isValid = false;
        break;
      }
    }
  }

  return { isValid, errors };
};

export const validateField = (
  value: any,
  rules: Array<(value: any) => string | null>
): string | null => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

// Common validation rules
export const commonRules = {
  required: validators.required,
  email: validators.email,
  phone: validators.phone,
  nationalId: validators.nationalId,
  bmdcNumber: validators.bmdcNumber,
  password: validators.password,
  minLength: (min: number) => (value: string) => 
    value.length >= min ? null : `Must be at least ${min} characters`,
  maxLength: (max: number) => (value: string) => 
    value.length <= max ? null : `Must not exceed ${max} characters`,
  pattern: (regex: RegExp, message: string) => (value: string) => 
    regex.test(value) ? null : message,
};
```

## 🇧🇩 Bangladesh Utilities

### Bangladesh Constants
```typescript
// src/constants/bangladesh.ts
export const BANGLADESH_CONSTANTS = {
  // Country codes
  COUNTRY_CODE: 'BD',
  COUNTRY_NAME: 'Bangladesh',
  
  // Phone number patterns
  PHONE_PATTERN: /^(\+880|01)[3-9]\d{8}$/,
  MOBILE_PATTERN: /^01[3-9]\d{8}$/,
  
  // National ID patterns
  NID_10_DIGIT: /^\d{10}$/,
  NID_13_DIGIT: /^\d{13}$/,
  NID_PATTERN: /^\d{10}$|^\d{13}$/,
  
  // BMDC patterns
  BMDC_PATTERN: /^[A-Z]-\d{5}$/,
  
  // Currency
  CURRENCY_CODE: 'BDT',
  CURRENCY_SYMBOL: '৳',
  
  // Divisions
  DIVISIONS: [
    { code: '30', name: 'Dhaka', nameBn: 'ঢাকা' },
    { code: '26', name: 'Chittagong', nameBn: 'চট্টগ্রাম' },
    { code: '35', name: 'Sylhet', nameBn: 'সিলেট' },
    { code: '54', name: 'Rajshahi', nameBn: 'রাজশাহী' },
    { code: '40', name: 'Khulna', nameBn: 'খুলনা' },
    { code: '10', name: 'Barishal', nameBn: 'বরিশাল' },
    { code: '55', name: 'Rangpur', nameBn: 'রংপুর' },
    { code: '60', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
  ],
  
  // Medical institutions
  MEDICAL_INSTITUTIONS: {
    DGHS: 'Directorate General of Health Services',
    DGDA: 'Directorate General of Drug Administration',
    BMDC: 'Bangladesh Medical and Dental Council',
    DGMSDC: 'Directorate General of Medical Stores and Drugs Control',
  },
  
  // Blood groups
  BLOOD_GROUPS: [
    { code: 'A_POS', name: 'A Positive', nameBn: 'এ পজিটিভ' },
    { code: 'A_NEG', name: 'A Negative', nameBn: 'এ নেগেটিভ' },
    { code: 'B_POS', name: 'B Positive', nameBn: 'বি পজিটিভ' },
    { code: 'B_NEG', name: 'B Negative', nameBn: 'বি নেগেটিভ' },
    { code: 'AB_POS', name: 'AB Positive', nameBn: 'এবি পজিটিভ' },
    { code: 'AB_NEG', name: 'AB Negative', nameBn: 'এবি নেগেটিভ' },
    { code: 'O_POS', name: 'O Positive', nameBn: 'ও পজিটিভ' },
    { code: 'O_NEG', name: 'O Negative', nameBn: 'ও নেগেটিভ' },
  ],
};
```

### Localization Utilities
```typescript
// src/utils/localization.ts
import { BANGLADESH_CONSTANTS } from '../constants/bangladesh';

export const formatBanglaDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const banglaMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'আগস্ট',
    'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
  ];
  
  const banglaNumbers = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': 'প', '5': 'ফ',
    '6': '৬', '7': '৭', '8': 'ম', '9': 'য',
  };
  
  const convertToBanglaNumber = (num: number): string => {
    return num.toString().split('').map(digit => banglaNumbers[digit] || digit).join('');
  };
  
  return `${convertToBanglaNumber(day)} ${banglaMonths[month - 1]} ${convertToBanglaNumber(year)}`;
};

export const formatBanglaCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: BANGLADESH_CONSTANTS.CURRENCY_CODE,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

export const formatBanglaPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('880')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('01')) {
    return `+880${cleaned.substring(1)}`;
  }
  
  return phone;
};
```

## 📝 TypeScript Types

### API Types
```typescript
// src/types/api/patient.ts
export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  bloodGroup?: string;
  allergies: string[];
  medications: Medication[];
  conditions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  streetAddress: string;
  city: string;
  district: string;
  division: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  nationalId?: string;
  bloodGroup?: string;
}

export interface UpdatePatientData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: Partial<Address>;
  emergencyContact?: Partial<EmergencyContact>;
  bloodGroup?: string;
}

export interface PatientSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
  district?: string;
  division?: string;
  bloodGroup?: string;
}
```

### Auth Types
```typescript
// src/types/auth.ts
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  department?: string;
  facility?: {
    id: string;
    name: string;
    type: string;
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  facilityId?: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserPreferences {
  language: 'en' | 'bn';
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSave: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  autoHide?: boolean;
}
```

## 🧪 Testing

### Store Tests
```typescript
// tests/store/authSlice.test.ts
import { act, renderHook } from '@testing-library/react';
import { useAppStore } from '../../src/store/store';

describe('authSlice', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.auth.user).toBeNull();
    expect(result.current.auth.token).toBeNull();
    expect(result.current.auth.isAuthenticated).toBe(false);
    expect(result.current.auth.isLoading).toBe(false);
    expect(result.current.auth.error).toBeNull();
  });

  it('should handle login success', async () => {
    const { result } = renderHook(() => useAppStore());
    const mockUser = { id: '1', username: 'test', email: 'test@example.com' };
    const mockToken = 'mock-token';
    
    // Mock API call
    jest.spy(apiClient, 'post').mockResolvedValue({
      data: { user: mockUser, token: mockToken },
    });

    await act(async () => {
      await result.current.auth.login({ username: 'test', password: 'password' });
    });

    expect(result.current.auth.user).toEqual(mockUser);
    expect(result.current.auth.token).toBe(mockToken);
    expect(result.current.auth.isAuthenticated).toBe(true);
    expect(result.current.auth.isLoading).toBe(false);
    expect(result.current.auth.error).toBeNull();
  });

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAppStore());
    
    // Mock API call
    jest.spy(apiClient, 'post').mockRejectedValue(new Error('Invalid credentials'));

    await act(async () => {
      await result.current.auth.login({ username: 'test', password: 'wrong' });
    });

    expect(result.current.auth.user).toBeNull();
    expect(result.current.auth.token).toBeNull();
    expect(result.current.auth.isAuthenticated).toBe(false);
    expect(result.current.auth.isLoading).toBe(false);
    expect(result.current.auth.error).toBe('Invalid credentials');
  });
});
```

## 📦 Package Configuration

### package.json
```json
{
  "name": "@zarish/esm-shared",
  "version": "1.0.0",
  "description": "ZARISH HIS Shared Utilities and State Management",
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
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "zustand": "^4.0.0",
    "@tanstack/react-query": "^4.0.0",
    "axios": "^1.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "eslint": "^8.0.0",
    "eslint-config-react-app": "^7.0.0",
    "jest": "^29.0.0",
    "rollup": "^3.0.0",
    "typescript": "^4.0.0"
  }
}
```

---

*Last updated: 2026-01-21*
