# Performance Optimization Guide

## 🎯 Overview

This guide provides comprehensive performance optimization strategies for ZARISH HIS, covering database optimization, caching strategies, API performance, and frontend optimization with Bangladesh healthcare context.

## 🗄️ Database Optimization

### PostgreSQL Performance Tuning

#### Connection Pool Configuration

```sql
-- Optimize connection pool for high concurrency
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '128MB';
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
```

#### Index Optimization Strategy

```sql
-- Patient search optimization
CREATE INDEX CONCURRENTLY idx_patients_search_gin 
ON patients USING GIN (
  first_name gin_trgm_ops,
  last_name gin_trgm_ops,
  email gin_trgm_ops,
  phone_number gin_trgm_ops
);

-- Composite index for common queries
CREATE INDEX idx_patients_nationality_active 
ON patients(nationality, is_active, created_at DESC);

-- Partial index for recent records
CREATE INDEX idx_patients_recent 
ON patients(created_at DESC) WHERE is_active = true;

-- Covering index for range queries
CREATE INDEX idx_patients_dob_range 
ON patients(date_of_birth) WHERE date_of_birth >= '1950-01-01';

-- JSON index for address data
CREATE INDEX idx_patients_address_gin 
ON patients USING GIN (address);
```

#### Query Optimization Examples

```sql
-- Optimized patient search with full-text search
EXPLAIN ANALYZE
SELECT p.id, p.first_name, p.last_name, p.date_of_birth
FROM patients p
WHERE p.is_active = true
  AND (
    p.first_name ILIKE '%rahman%' OR 
    p.last_name ILIKE '%rahman%' OR
    p.email ILIKE '%rahman%'
  )
  AND p.date_of_birth BETWEEN '1950-01-01' AND '2005-12-31'
ORDER BY p.created_at DESC
LIMIT 20;

-- Optimized patient count by administrative area
SELECT 
  a.division_code,
  a.district_code,
  COUNT(*) as patient_count,
  COUNT(CASE WHEN p.date_of_birth >= '2000-01-01' THEN 1 END) as adult_count,
  COUNT(CASE WHEN p.date_of_birth < '2000-01-01' THEN 1 END) as child_count
FROM administrative_areas a
LEFT JOIN patients p ON (
  p.address->>'divisionCode' = a.division_code AND
  p.address->>'districtCode' = a.district_code AND
  p.is_active = true
)
GROUP BY a.division_code, a.district_code
ORDER BY patient_count DESC;
```

### Partitioning Strategy

```sql
-- Partition patients table by year for better performance
CREATE TABLE patients_2026 PARTITION OF patients
(LIKE patients INCLUDING ALL);

CREATE TABLE patients_2025 PARTITION OF patients
(LIKE patients INCLUDING ALL);

-- Create partition function
CREATE OR REPLACE FUNCTION create_patient_partition(year integer)
RETURNS void AS $$
BEGIN
    EXEC format('CREATE TABLE IF NOT EXISTS patients_%I PARTITION OF patients (LIKE patients INCLUDING ALL)', year);
END;
$$ LANGUAGE plpgsql;

-- Trigger to create partitions automatically
CREATE OR REPLACE FUNCTION auto_create_partition()
RETURNS trigger AS $$
BEGIN
    PERFORM create_patient_partition(EXTRACT(YEAR FROM NEW.created_at));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_partition
    BEFORE INSERT ON patients
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_partition();
```

## 🚀 Caching Strategies

### Redis Configuration

```yaml
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
appendonly yes
```

### Multi-Level Caching Architecture

```typescript
// src/services/cache/CacheService.ts
interface CacheConfig {
  L1: {
    ttl: 300; // 5 minutes
    maxSize: 1000;
  };
  L2: {
    ttl: 3600; // 1 hour
    maxSize: 10000;
  };
  L3: {
    ttl: 86400; // 24 hours
    maxSize: 100000;
  };
}

export class CacheService {
  private redis: Redis;
  private l1Cache: Map<string, any> = new Map();
  private l2Cache: Map<string, any> = new Map();
  
  async get<T>(key: string, level: 'L1' | 'L2' | 'L3'): Promise<T | null> {
    // L1 Cache (in-memory)
    if (level === 'L1') {
      const value = this.l1Cache.get(key);
      if (value !== undefined) {
        return value;
      }
    }
    
    // L2 Cache (Redis with shorter TTL)
    if (level === 'L2') {
      const value = this.l2Cache.get(key);
      if (value !== undefined) {
        return value;
      }
      
      const cached = await this.redis.get(key);
      if (cached) {
        this.l2Cache.set(key, cached);
        return JSON.parse(cached);
      }
    }
    
    // L3 Cache (Redis with longer TTL)
    if (level === 'L3') {
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    }
    
    return null;
  }
  
  async set<T>(key: string, value: T, level: 'L1' | 'L2' | 'L3'): Promise<void> {
    // Set in all cache levels
    this.l1Cache.set(key, value);
    this.l2Cache.set(key, value);
    
    const serialized = JSON.stringify(value);
    await this.redis.setex(key, this.getTTL(level), serialized);
  }
  
  private getTTL(level: 'L1' | 'L2' | 'L3'): number {
    switch (level) {
      case 'L1': return 300; // 5 minutes
      case 'L2': return 3600; // 1 hour
      case 'L3': return 86400; // 24 hours
      default: return 3600;
    }
  }
}
```

### Cache-Aside Pattern

```typescript
// src/services/cache/CacheAsideService.ts
export class CacheAsideService {
  async getPatientWithCache(patientId: string): Promise<Patient | null> {
    const cacheKey = `patient:${patientId}`;
    
    // Try cache first
    let patient = await this.cacheService.get<Patient>(cacheKey, 'L1');
    
    if (patient) {
      return patient;
    }
    
    // Cache miss - fetch from database
    patient = await this.patientRepository.findById(patientId);
    
    if (patient) {
      // Store in L1 cache for fast access
      await this.cacheService.set(cacheKey, patient, 'L1');
      
      // Preload related data in L2 cache
      const relatedData = await this.patientRepository.getRelatedData(patientId);
      await this.cacheService.set(`patient:${patientId}:related`, relatedData, 'L2');
    }
    
    return patient;
  }
}
```

## 🌐 API Performance

### Response Time Optimization

```typescript
// src/middleware/PerformanceMiddleware.ts
import { Request, Response, NextFunction } from 'express';

interface PerformanceMetrics {
  startTime: number;
  dbQueryTime: number;
  cacheHitTime: number;
  totalResponseTime: number;
}

export const performanceMiddleware = () => {
  const metrics = new Map<string, PerformanceMetrics>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const reqMetrics: PerformanceMetrics = {
      startTime,
      dbQueryTime: 0,
      cacheHitTime: 0,
      totalResponseTime: 0
    };
    
    // Store metrics in request object
    req.performance = reqMetrics;
    
    // Override res.end to capture metrics
    const originalEnd = res.end;
    res.end = function(this: Response, ...args: any[]) {
      const endTime = Date.now();
      reqMetrics.totalResponseTime = endTime - startTime;
      
      // Log performance metrics
      console.log(`Request ${req.path}: ${reqMetrics.totalResponseTime}ms`);
      
      // Send metrics to monitoring system
      sendMetricsToMonitoring(req.path, reqMetrics);
      
      return originalEnd.apply(this, args);
    };
    
    next();
  };
};

const sendMetricsToMonitoring = (path: string, metrics: PerformanceMetrics) => {
  // Send to monitoring system
  fetch('/api/v1/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path,
      responseTime: metrics.totalResponseTime,
      dbQueryTime: metrics.dbQueryTime,
      cacheHitTime: metrics.cacheHitTime,
      timestamp: new Date().toISOString(),
    })
  }).catch(console.error);
};
```

### Database Connection Pooling

```typescript
// src/services/DatabaseService.ts
import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export class DatabaseService {
  private pool: Pool;
  
  constructor() {
    this.pool = new Pool(poolConfig);
    
    // Handle pool events
    this.pool.on('connect', (client) => {
      console.log('New database connection established');
    });
    
    this.pool.on('error', (err, client) => {
      console.error('Database connection error:', err);
    });
    
    this.pool.on('remove', (client) => {
      console.log('Database connection removed');
    });
  }
  
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const client = await this.pool.connect();
    
    try {
      const start = Date.now();
      const result = await client.query(sql, params);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query detected (${duration}ms):`, { sql, params });
      }
      
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
```

## 📱 Frontend Optimization

### Code Splitting and Lazy Loading

```typescript
// src/components/LazyPatientManagement.tsx
import React, { Suspense } from 'react';

const LazyPatientList = React.lazy(() => import('./PatientList'));
const LazyPatientDetails = React.lazy(() => import('./PatientDetails'));
const LazyPatientForm = React.lazy(() => import('./PatientForm'));

export const PatientManagement: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading patient list...</div>}>
        <LazyPatientList />
      </Suspense>
      
      <Suspense fallback={<div>Loading patient details...</div>}>
        <LazyPatientDetails />
      </Suspense>
      
      <Suspense fallback={<div>Loading patient form...</div>}>
        <LazyPatientForm />
      </Suspense>
    </div>
  );
};
```

### Virtual Scrolling

```typescript
// src/components/VirtualizedPatientList.tsx
import React, { useMemo, useCallback } from 'react';

interface VirtualizedListProps {
  items: Patient[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: Patient, index: number) => React.ReactNode;
}

export const VirtualizedPatientList: React.FC<VirtualizedListProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length
    );
    
    return items.slice(startIndex, endIndex);
  }, [items, scrollTop, itemHeight, containerHeight]);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Image Optimization

```typescript
// src/components/OptimizedImage.tsx
import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);
  
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  return (
    <div className={`relative ${className || ''}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};
```

## 📊 Monitoring and Analytics

### Performance Metrics Collection

```typescript
// src/services/MetricsService.ts
interface PerformanceMetrics {
  apiResponseTime: number;
  dbQueryTime: number;
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
}

export class MetricsService {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000;
  
  collectMetrics(metric: Partial<PerformanceMetrics>): void {
    const fullMetric: PerformanceMetrics = {
      ...metric,
      timestamp: new Date().toISOString(),
    };
    
    this.metrics.push(fullMetric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }
  
  getAverageResponseTime(): number {
    const responseTimes = this.metrics.map(m => m.apiResponseTime);
    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }
  
  getCacheHitRate(): number {
    const recentMetrics = this.metrics.slice(-100);
    const cacheHits = recentMetrics.filter(m => m.cacheHitTime > 0).length;
    return cacheHits / recentMetrics.length;
  }
  
  generateReport(): PerformanceReport {
    const avgResponseTime = this.getAverageResponseTime();
    const cacheHitRate = this.getCacheHitRate();
    const errorRate = this.calculateErrorRate();
    
    return {
      averageResponseTime,
      cacheHitRate,
      errorRate,
      totalRequests: this.metrics.length,
      timestamp: new Date().toISOString(),
    };
  }
  
  private calculateErrorRate(): number {
    const recentMetrics = this.metrics.slice(-100);
    const errors = recentMetrics.filter(m => m.errorRate > 0).length;
    return errors / recentMetrics.length;
  }
}
```

### Real-time Performance Dashboard

```typescript
// src/components/PerformanceDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { MetricsService } from '@/services/MetricsService';

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceReport | null>(null);
  const [isRealTime, setIsRealTime] = useState(true);
  
  useEffect(() => {
    const metricsService = new MetricsService();
    
    const updateMetrics = () => {
      const report = metricsService.generateReport();
      setMetrics(report);
    };
    
    // Update metrics every 5 seconds in real-time mode
    const interval = isRealTime ? setInterval(updateMetrics, 5000) : null;
    
    return () => {
      clearInterval(interval);
    };
  }, [isRealTime]);
  
  const responseTimeData = metrics ? {
    labels: metrics.timestamp ? [new Date(metrics.timestamp)] : [],
    datasets: [{
      label: 'API Response Time (ms)',
      data: metrics.timestamp ? [metrics.averageResponseTime] : [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
    }]
  } : {};
  
  const cacheData = metrics ? {
    labels: ['Cache Hit Rate', 'Error Rate'],
    datasets: [{
      label: 'Performance Metrics',
      data: [metrics.cacheHitRate * 100, metrics.errorRate * 100],
      backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
      borderColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
      borderWidth: 1,
    }]
  } : {};
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Performance Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Response Time Trends
            </h3>
            <Line data={responseTimeData} options={{ responsive: true }} />
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900 mb-2">
              Cache Performance
            </h3>
            <Bar data={cacheData} options={{ responsive: true }} />
          </div>
        </div>
        
        {metrics && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Current Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.averageResponseTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(metrics.cacheHitRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Cache Hit Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {(metrics.errorRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Error Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.totalRequests}
                </div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

## 🔧 Bangladesh-Specific Optimizations

### Bengali Text Processing

```typescript
// src/utils/bengaliTextProcessing.ts
export class BengaliTextProcessor {
  static normalizeBengali(text: string): string {
    // Normalize Bengali text for better search and storage
    return text
      .replace(/[\u09CD\u09CE\u200D\u200F]/g, '') // Remove diacritics for search
      .replace(/\s+/g, ' ') // Normalize whitespace
      .toLowerCase();
  }
  
  static searchBengali(text: string, query: string): boolean {
    const normalizedText = this.normalizeBengali(text);
    const normalizedQuery = this.normalizeBengali(query);
    
    return normalizedText.includes(normalizedQuery);
  }
  
  static formatBengaliNumber(number: number): string {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    const numberStr = number.toString();
    let result = '';
    
    for (const digit of numberStr) {
      const digitIndex = englishDigits.indexOf(digit);
      if (digitIndex !== -1) {
        result += bengaliDigits[digitIndex];
      }
    }
    
    return result;
  }
}
```

### Geographic Data Optimization

```typescript
// src/services/GeographicService.ts
interface AdministrativeArea {
  divisionCode: string;
  districtCode: string;
  upazilaCode: string;
  unionCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export class GeographicService {
  private static administrativeAreas: Map<string, AdministrativeArea> = new Map();
  private static coordinateCache: Map<string, number[]> = new Map();
  
  static async loadAdministrativeAreas(): Promise<void> {
    const response = await fetch('/api/v1/administrative-areas');
    const areas = await response.json();
    
    areas.forEach((area: AdministrativeArea) => {
      const key = `${area.divisionCode}-${area.districtCode}-${area.upazilaCode}-${area.unionCode}`;
      this.administrativeAreas.set(key, area);
    });
  }
  
  static getAdministrativeArea(divisionCode: string, districtCode: string, upazilaCode: string, unionCode: string): AdministrativeArea | null {
    const key = `${divisionCode}-${districtCode}-${upazilaCode}-${unionCode}`;
    return this.administrativeAreas.get(key) || null;
  }
  
  static async validateCoordinates(latitude: number, longitude: number, divisionCode: string, districtCode: string): Promise<boolean> {
    const area = this.getAdministrativeArea(divisionCode, districtCode, '', '');
    
    if (!area) return true;
    
    // Check if coordinates are within reasonable bounds
    const distance = this.calculateDistance(
      { latitude: area.coordinates.latitude, longitude: area.coordinates.longitude },
      { latitude, longitude }
    );
    
    return distance < 50; // Within 50km
  }
  
  private static calculateDistance(point1: {latitude: number, longitude: number}, point2: {latitude: number, longitude: number}): number {
    const R = 63710; // Earth's radius in km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat) * Math.cos(point1.latitude * Math.PI / 180) * Math.cos(dLon);
    const c = Math.sin(point1.latitude * Math.PI / 180) * Math.sin(dLon);
    const d = Math.sin(dLat) * Math.cos(point1.latitude * Math.PI / 180) * Math.sin(dLon);
    const a2 = Math.sin(point2.latitude * Math.PI / 180) * Math.cos(point2.longitude * Math.PI / 180);
    const c2 = Math.sin(point2.latitude * Math.PI / 180) * Math.sin(point2.longitude * Math.PI / 180);
    
    const a3 = a - a2;
    const b3 = c - c2;
    const c3 = 2 * Math.atan2(Math.sqrt(a3 * a3 + b3 * b3));
    
    return R * c3;
  }
}
```

---

**Guide Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: ZARISH HIS Performance Standards
