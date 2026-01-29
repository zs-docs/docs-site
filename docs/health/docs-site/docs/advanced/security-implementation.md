# Security Implementation Guide

## 🎯 Overview

Comprehensive security implementation for ZARISH HIS with Bangladesh healthcare compliance and Rohingya refugee data protection.

## 🔐 Authentication & Authorization

### JWT Implementation

```typescript
// src/auth/JWTService.ts
export class JWTService {
  private readonly secretKey: string;
  private readonly algorithm = 'HS256';
  
  constructor() {
    this.secretKey = process.env.JWT_SECRET!;
  }
  
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secretKey, {
      algorithm: this.algorithm,
      expiresIn: '1h',
      issuer: 'zarish-his',
      audience: 'zarish-his-api'
    });
  }
  
  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.secretKey, {
      algorithms: [this.algorithm],
      issuer: 'zarish-his',
      audience: 'zarish-his-api'
    }) as JWTPayload;
  }
}
```

### Role-Based Access Control

```typescript
// src/auth/RBACService.ts
export class RBACService {
  private permissions = new Map<string, Set<string>>();
  
  constructor() {
    this.initializePermissions();
  }
  
  private initializePermissions(): void {
    // Admin permissions
    this.permissions.set('ADMIN', new Set([
      'patient:read', 'patient:write', 'patient:delete',
      'billing:read', 'billing:write', 'billing:delete',
      'system:configure', 'system:monitor'
    ]));
    
    // Doctor permissions
    this.permissions.set('DOCTOR', new Set([
      'patient:read', 'medical:write', 'appointment:write'
    ]));
    
    // Nurse permissions
    this.permissions.set('NURSE', new Set([
      'patient:read', 'vitals:write', 'medication:write'
    ]));
  }
  
  hasPermission(role: string, permission: string): boolean {
    return this.permissions.get(role)?.has(permission) || false;
  }
}
```

## 🔒 Data Protection

### Encryption Service

```typescript
// src/security/EncryptionService.ts
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  
  encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('zarish-his'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }
  
  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('zarish-his'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### Data Masking

```typescript
// src/security/DataMaskingService.ts
export class DataMaskingService {
  maskNationalID(nid: string): string {
    if (nid.length < 4) return '****';
    return nid.substring(0, 4) + '****' + nid.substring(nid.length - 4);
  }
  
  maskPhoneNumber(phone: string): string {
    if (phone.length < 4) return '****';
    return phone.substring(0, 3) + '****' + phone.substring(phone.length - 2);
  }
  
  maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    return username.substring(0, 2) + '***@' + domain;
  }
}
```

## 🛡️ Bangladesh Healthcare Compliance

### DGHS Integration

```typescript
// src/integration/DGHSService.ts
export class DGHSService {
  async validateNID(nid: string): Promise<NIDValidationResult> {
    const response = await fetch('/api/dghs/validate-nid', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DGHS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nationalId: nid })
    });
    
    return response.json();
  }
  
  async submitHealthReport(report: HealthReport): Promise<SubmissionResult> {
    const response = await fetch('/api/dghs/submit-report', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DGHS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(report)
    });
    
    return response.json();
  }
}
```

### BMDC Verification

```typescript
// src/integration/BMDCTokenService.ts
export class BMDCService {
  async verifyBMDC(bmdcNumber: string): Promise<BMDCVerificationResult> {
    const response = await fetch('/api/bmdc/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BMDC_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bmdcNumber })
    });
    
    return response.json();
  }
  
  async getBMDCDetails(bmdcNumber: string): Promise<BMDCDetails> {
    const response = await fetch(`/api/bmdc/details/${bmdcNumber}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BMDC_API_KEY}`
      }
    });
    
    return response.json();
  }
}
```

## 🏕️ Rohingya Refugee Data Protection

### UNHCR Compliance

```typescript
// src/integration/UNHCRService.ts
export class UNHCRService {
  async validateRefugeeID(type: 'progress' | 'mrc' | 'fcn', id: string): Promise<ValidationResult> {
    const response = await fetch(`/api/unhcr/validate-${type}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UNHCR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
    
    return response.json();
  }
  
  async getCampInformation(campCode: string): Promise<CampInfo> {
    const response = await fetch(`/api/unhcr/camps/${campCode}`, {
      headers: {
        'Authorization': `Bearer ${process.env.UNHCR_API_KEY}`
      }
    });
    
    return response.json();
  }
}
```

### Refugee Data Protection

```typescript
// src/security/RefugeeDataProtection.ts
export class RefugeeDataProtection {
  private readonly sensitiveFields = ['progressId', 'mrcCard', 'familyCountingNumber'];
  
  protectRefugeeData(data: RefugeeData): RefugeeData {
    const protected = { ...data };
    
    // Encrypt sensitive fields
    this.sensitiveFields.forEach(field => {
      if (protected[field]) {
        protected[field] = this.encrypt(protected[field]);
      }
    });
    
    return protected;
  }
  
  decryptRefugeeData(encryptedData: RefugeeData): RefugeeData {
    const decrypted = { ...encryptedData };
    
    this.sensitiveFields.forEach(field => {
      if (decrypted[field]) {
        decrypted[field] = this.decrypt(decrypted[field]);
      }
    });
    
    return decrypted;
  }
}
```

## 🔍 Security Monitoring

### Security Event Logging

```typescript
// src/security/SecurityLogger.ts
export class SecurityLogger {
  private readonly logFile = 'security-events.log';
  
  logSecurityEvent(event: SecurityEvent): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: event.level,
      type: event.type,
      userId: event.userId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      details: event.details,
      severity: event.severity
    };
    
    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
    
    // Send to SIEM system
    this.sendToSIEM(logEntry);
  }
  
  private sendToSIEM(logEntry: any): void {
    fetch('/api/siem/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SIEM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logEntry)
    }).catch(console.error);
  }
}
```

### Intrusion Detection

```typescript
// src/security/IntrusionDetectionService.ts
export class IntrusionDetectionService {
  private readonly suspiciousPatterns = [
    /\bunion.*select.*\b/i,
    /\bdrop.*table\b/i,
    /\binsert.*into.*sys\b/i,
    /\bxor.*1\s*=\s*1\b/i
  ];
  
  detectSuspiciousActivity(request: Request): boolean {
    const { url, method, body, headers } = request;
    
    // Check SQL injection patterns
    if (body && typeof body === 'string') {
      for (const pattern of this.suspiciousPatterns) {
        if (pattern.test(body)) {
          return true;
        }
      }
    }
    
    // Check for suspicious headers
    if (headers['user-agent']?.includes('sqlmap')) {
      return true;
    }
    
    // Check for unusual request patterns
    if (this.isUnusualRequest(request)) {
      return true;
    }
    
    return false;
  }
  
  private isUnusualRequest(request: Request): boolean {
    const { url, method, headers } = request;
    
    // Check for unusual HTTP methods
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      return true;
    }
    
    // Check for unusual URLs
    if (url.includes('../') || url.includes('%2e%2e')) {
      return true;
    }
    
    return false;
  }
}
```

---

**Guide Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: ZARISH HIS Security Standards
