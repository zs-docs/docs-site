# Integration Guides

## 🎯 Overview

Comprehensive integration guides for ZARISH HIS with external systems, Bangladesh healthcare infrastructure, and international organizations.

## 🌐 External System Integration

### DGHS Integration

```typescript
// src/integration/DGHSTokenService.ts
export class DGHSTokenService {
  private readonly baseURL = 'https://api.dghs.gov.bd/v1';
  private readonly apiKey: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  
  constructor() {
    this.apiKey = process.env.DGHS_API_KEY!;
    this.clientId = process.env.DGHS_CLIENT_ID!;
    this.clientSecret = process.env.DGHS_CLIENT_SECRET!;
  }
  
  async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseURL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      })
    });
    
    const data = await response.json();
    return data.access_token;
  }
  
  async validateNationalID(nid: string): Promise<NIDValidationResult> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseURL}/citizens/validate-nid`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        national_id: nid,
        verification_type: 'BASIC'
      })
    });
    
    return response.json();
  }
  
  async submitHealthReport(report: HealthReport): Promise<SubmissionResult> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseURL}/reports/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        report_type: report.type,
        patient_data: report.patientData,
        clinical_data: report.clinicalData,
        facility_id: report.facilityId,
        timestamp: new Date().toISOString()
      })
    });
    
    return response.json();
  }
}
```

### BMDC Integration

```typescript
// src/integration/BMDCTokenService.ts
export class BMDCService {
  private readonly baseURL = 'https://api.bmdc.org.bd/v1';
  private readonly apiKey: string;
  
  constructor() {
    this.apiKey = process.env.BMDC_API_KEY!;
  }
  
  async verifyBMDCRegistration(bmdcNumber: string): Promise<BMDCVerificationResult> {
    const response = await fetch(`${this.baseURL}/practitioners/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registration_number: bmdcNumber,
        verification_type: 'ACTIVE_STATUS'
      })
    });
    
    return response.json();
  }
  
  async getPractitionerDetails(bmdcNumber: string): Promise<PractitionerDetails> {
    const response = await fetch(`${this.baseURL}/practitioners/${bmdcNumber}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    return response.json();
  }
  
  async validateSpeciality(specialityCode: string): Promise<boolean> {
    const response = await fetch(`${this.baseURL}/specialities/${specialityCode}/validate`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    const result = await response.json();
    return result.valid;
  }
}
```

### UNHCR Integration

```typescript
// src/integration/UNHCRService.ts
export class UNHCRService {
  private readonly baseURL = 'https://api.unhcr.org/bangladesh/v1';
  private readonly apiKey: string;
  
  constructor() {
    this.apiKey = process.env.UNHCR_API_KEY!;
  }
  
  async validateRefugeeID(idType: 'progress' | 'mrc' | 'fcn', idValue: string): Promise<RefugeeValidationResult> {
    const response = await fetch(`${this.baseURL}/refugees/validate-${idType}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_value: idValue,
        verification_type: 'ACTIVE_STATUS'
      })
    });
    
    return response.json();
  }
  
  async getCampInformation(campCode: string): Promise<CampInformation> {
    const response = await fetch(`${this.baseURL}/camps/${campCode}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    return response.json();
  }
  
  async submitHealthServiceData(serviceData: HealthServiceData): Promise<SubmissionResult> {
    const response = await fetch(`${this.baseURL}/health-services/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        camp_code: serviceData.campCode,
        service_type: serviceData.serviceType,
        patient_count: serviceData.patientCount,
        service_date: serviceData.serviceDate,
        provider_id: serviceData.providerId
      })
    });
    
    return response.json();
  }
}
```

## 💳 Payment Gateway Integration

### bKash Integration

```typescript
// src/payment/BKashService.ts
export class BKashService {
  private readonly baseURL = 'https://checkout.bkash.com/v1.2.0-beta';
  private readonly username: string;
  private readonly password: string;
  private readonly appKey: string;
  private readonly appSecret: string;
  
  constructor() {
    this.username = process.env.BKASH_USERNAME!;
    this.password = process.env.BKASH_PASSWORD!;
    this.appKey = process.env.BKASH_APP_KEY!;
    this.appSecret = process.env.BKASH_APP_SECRET!;
  }
  
  async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseURL}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        app_key: this.appKey,
        app_secret: this.appSecret
      })
    });
    
    const data = await response.json();
    return data.id_token;
  }
  
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseURL}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: paymentRequest.payerReference,
        callbackURL: paymentRequest.callbackURL,
        amount: paymentRequest.amount,
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: paymentRequest.invoiceNumber
      })
    });
    
    return response.json();
  }
  
  async executePayment(paymentID: string): Promise<PaymentExecutionResult> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseURL}/tokenized/checkout/execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        paymentID: paymentID
      })
    });
    
    return response.json();
  }
}
```

### Nagad Integration

```typescript
// src/payment/NagadService.ts
export class NagadService {
  private readonly baseURL = 'https://api.mynagad.com/v2';
  private readonly merchantId: string;
  private readonly merchantNumber: string;
  private readonly privateKey: string;
  
  constructor() {
    this.merchantId = process.env.NAGAD_MERCHANT_ID!;
    this.merchantNumber = process.env.NAGAD_MERCHANT_NUMBER!;
    this.privateKey = process.env.NAGAD_PRIVATE_KEY!;
  }
  
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseURL}/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-ID': this.merchantId
      },
      body: JSON.stringify({
        merchantId: this.merchantId,
        merchantNumber: this.merchantNumber,
        amount: paymentRequest.amount,
        invoiceNumber: paymentRequest.invoiceNumber,
        callbackURL: paymentRequest.callbackURL,
        productDetails: paymentRequest.productDetails
      })
    });
    
    return response.json();
  }
  
  async verifyPayment(paymentID: string): Promise<PaymentVerificationResult> {
    const response = await fetch(`${this.baseURL}/checkout/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-ID': this.merchantId
      },
      body: JSON.stringify({
        paymentID: paymentID
      })
    });
    
    return response.json();
  }
}
```

## 📊 Data Synchronization

### Real-time Data Sync

```typescript
// src/sync/DataSyncService.ts
export class DataSyncService {
  private readonly syncQueue: Queue;
  private readonly eventEmitter: EventEmitter;
  
  constructor() {
    this.syncQueue = new Queue('data-sync', {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });
    
    this.eventEmitter = new EventEmitter();
    this.setupEventHandlers();
  }
  
  async syncPatientData(patientId: string): Promise<SyncResult> {
    const syncJob = await this.syncQueue.add('sync-patient', {
      patientId,
      timestamp: new Date().toISOString()
    });
    
    return new Promise((resolve, reject) => {
      syncJob.on('completed', (result) => resolve(result));
      syncJob.on('failed', (err) => reject(err));
    });
  }
  
  async syncBillingData(invoiceId: string): Promise<SyncResult> {
    const syncJob = await this.syncQueue.add('sync-billing', {
      invoiceId,
      timestamp: new Date().toISOString()
    });
    
    return new Promise((resolve, reject) => {
      syncJob.on('completed', (result) => resolve(result));
      syncJob.on('failed', (err) => reject(err));
    });
  }
  
  private setupEventHandlers(): void {
    this.eventEmitter.on('patient-updated', (patientId: string) => {
      this.syncPatientData(patientId);
    });
    
    this.eventEmitter.on('invoice-created', (invoiceId: string) => {
      this.syncBillingData(invoiceId);
    });
  }
}
```

### Batch Data Processing

```typescript
// src/batch/BatchProcessingService.ts
export class BatchProcessingService {
  private readonly batchSize = 1000;
  private readonly maxRetries = 3;
  
  async processBatch<T>(items: T[], processor: (item: T) => Promise<void>): Promise<BatchResult> {
    const results: BatchResult = {
      total: items.length,
      processed: 0,
      failed: 0,
      errors: []
    };
    
    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize);
      
      const batchResults = await this.processBatchWithRetry(batch, processor);
      
      results.processed += batchResults.processed;
      results.failed += batchResults.failed;
      results.errors.push(...batchResults.errors);
      
      // Add delay between batches to prevent overwhelming the system
      await this.delay(1000);
    }
    
    return results;
  }
  
  private async processBatchWithRetry<T>(batch: T[], processor: (item: T) => Promise<void>): Promise<BatchResult> {
    const results: BatchResult = {
      total: batch.length,
      processed: 0,
      failed: 0,
      errors: []
    };
    
    for (const item of batch) {
      let retries = 0;
      
      while (retries < this.maxRetries) {
        try {
          await processor(item);
          results.processed++;
          break;
        } catch (error) {
          retries++;
          
          if (retries >= this.maxRetries) {
            results.failed++;
            results.errors.push({
              item,
              error: error.message
            });
          } else {
            // Exponential backoff
            await this.delay(Math.pow(2, retries) * 1000);
          }
        }
      }
    }
    
    return results;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## 🔧 API Gateway Configuration

### Kong API Gateway

```yaml
# kong.yml
_format_version: "3.0"
_transform: true

services:
  - name: patient-registry-api
    url: http://patient-registry:8080
    plugins:
      - name: rate-limiting
        config:
          minute: 1000
          hour: 10000
          fault_tolerant: true
      - name: request-size-limiting
        config:
          allowed_payload_size: 10
      - name: request-transformer
        config:
          add:
            headers:
              - "X-Request-ID:$(uuid)"
              - "X-Timestamp:$(timestamp)"

  - name: billing-engine-api
    url: http://billing-engine:8080
    plugins:
      - name: rate-limiting
        config:
          minute: 500
          hour: 5000
      - name: request-size-limiting
        config:
          allowed_payload_size: 5

routes:
  - name: patient-registry-route
    service: patient-registry-api
    paths:
      - /api/v1/patients
      - /api/v1/appointments
    methods:
      - GET
      - POST
      - PUT
      - DELETE

  - name: billing-engine-route
    service: billing-engine-api
    paths:
      - /api/v1/billing
      - /api/v1/invoices
    methods:
      - GET
      - POST
      - PUT
      - DELETE

consumers:
  - username: admin-user
    custom_id: admin-001
    plugins:
      - name: key-auth
        config:
          key: admin-api-key-12345
      - name: acl
        config:
          groups:
            - admin
            - full-access

  - username: doctor-user
    custom_id: doctor-001
    plugins:
      - name: key-auth
        config:
          key: doctor-api-key-67890
      - name: acl
        config:
          groups:
            - doctor
            - medical-access

plugins:
  - name: prometheus
    config:
      per_consumer: true
  - name: zipkin
    config:
      http_endpoint: http://zipkin:9411/api/v2/spans
      sample_ratio: 0.1
```

### Nginx Configuration

```nginx
# nginx.conf
upstream patient_registry {
    server patient-registry-1:8080;
    server patient-registry-2:8080;
    server patient-registry-3:8080;
}

upstream billing_engine {
    server billing-engine-1:8080;
    server billing-engine-2:8080;
}

server {
    listen 80;
    server_name api.zarish-his.com;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    # Patient registry API
    location /api/v1/patients {
        proxy_pass http://patient_registry;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Billing engine API
    location /api/v1/billing {
        proxy_pass http://billing_engine;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## 📱 Mobile App Integration

### React Native Integration

```typescript
// src/mobile/ZarishHISClient.ts
export class ZarishHISClient {
  private readonly baseURL: string;
  private readonly apiKey: string;
  
  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }
  
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify(credentials)
    });
    
    return response.json();
  }
  
  async getPatients(filters: PatientFilters): Promise<Patient[]> {
    const token = await this.getStoredToken();
    
    const response = await fetch(`${this.baseURL}/patients`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filters)
    });
    
    return response.json();
  }
  
  async createPatient(patientData: PatientData): Promise<Patient> {
    const token = await this.getStoredToken();
    
    const response = await fetch(`${this.baseURL}/patients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });
    
    return response.json();
  }
  
  private async getStoredToken(): Promise<string> {
    // Implement secure token storage for mobile
    return await SecureStorage.getItem('auth_token');
  }
}
```

---

**Guide Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: ZARISH HIS Integration Standards
