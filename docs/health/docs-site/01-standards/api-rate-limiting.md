# API Rate Limiting and Security Patterns

## Overview
This document defines API rate limiting strategies and security patterns implemented across ZARISH HIS microservices to ensure fair usage, prevent abuse, and maintain system stability.

## Rate Limiting Strategy

### 1. **Tier-Based Rate Limiting**
Different rate limits based on user roles and API endpoints:

```yaml
rate_limits:
  unauthenticated:
    requests_per_minute: 10
    requests_per_hour: 100
  
  authenticated_users:
    requests_per_minute: 60
    requests_per_hour: 1000
  
  premium_users:
    requests_per_minute: 120
    requests_per_hour: 5000
  
  internal_services:
    requests_per_minute: 1000
    requests_per_hour: 100000
```

### 2. **Endpoint-Specific Limits**
Critical endpoints have stricter limits:

```yaml
endpoint_limits:
  authentication:
    login: "5 requests per minute"
    password_reset: "3 requests per hour"
    token_refresh: "10 requests per minute"
  
  patient_data:
    search: "30 requests per minute"
    create: "20 requests per minute"
    update: "40 requests per minute"
  
  billing:
    invoice_generation: "10 requests per minute"
    payment_processing: "5 requests per minute"
```

## Implementation Patterns

### 1. **Golang Rate Limiting Middleware**
```go
// Rate limiting middleware implementation
package middleware

import (
    "context"
    "net/http"
    "time"
    "golang.org/x/time/rate"
)

type RateLimiter struct {
    limiters map[string]*rate.Limiter
    mu       sync.RWMutex
}

func NewRateLimiter() *RateLimiter {
    return &RateLimiter{
        limiters: make(map[string]*rate.Limiter),
    }
}

func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Get client identifier (IP, user ID, or API key)
        clientID := rl.getClientID(r)
        
        // Get or create limiter for this client
        limiter := rl.getLimiter(clientID)
        
        // Check rate limit
        if !limiter.Allow() {
            http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}

func (rl *RateLimiter) getClientID(r *http.Request) string {
    // Priority: User ID > API Key > IP Address
    if userID := r.Header.Get("X-User-ID"); userID != "" {
        return "user:" + userID
    }
    
    if apiKey := r.Header.Get("X-API-Key"); apiKey != "" {
        return "api:" + apiKey
    }
    
    return "ip:" + getIP(r)
}
```

### 2. **Redis-Based Distributed Rate Limiting**
For microservices architecture, use Redis for distributed rate limiting:

```go
package ratelimit

import (
    "context"
    "github.com/go-redis/redis/v8"
    "time"
)

type RedisRateLimiter struct {
    client *redis.Client
}

func (r *RedisRateLimiter) Allow(ctx context.Context, key string, limit int, window time.Duration) (bool, error) {
    current, err := r.client.Incr(ctx, key).Result()
    if err != nil {
        return false, err
    }
    
    if current == 1 {
        // Set expiration on first request
        r.client.Expire(ctx, key, window)
    }
    
    return current <= int64(limit), nil
}
```

## Security Headers

### 1. **Standard Security Headers**
All API responses must include these security headers:

```go
func SecurityHeadersMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("X-Content-Type-Options", "nosniff")
        w.Header().Set("X-Frame-Options", "DENY")
        w.Header().Set("X-XSS-Protection", "1; mode=block")
        w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        w.Header().Set("Content-Security-Policy", "default-src 'self'")
        w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
        
        next.ServeHTTP(w, r)
    })
}
```

### 2. **API Rate Limit Headers**
Inform clients about their rate limit status:

```go
func RateLimitHeaders(limiter *rate.Limiter) http.Header {
    headers := make(http.Header)
    
    // Add rate limit information
    headers.Set("X-RateLimit-Limit", "60")
    headers.Set("X-RateLimit-Remaining", "45")
    headers.Set("X-RateLimit-Reset", "1640995200")
    
    return headers
}
```

## Circuit Breaker Pattern

### 1. **Implementation for Service Resilience**
```go
package circuitbreaker

import (
    "errors"
    "sync"
    "time"
)

type CircuitBreaker struct {
    maxFailures   int
    resetTimeout  time.Duration
    failures      int
    lastFailTime  time.Time
    state         State
    mu            sync.RWMutex
}

type State int

const (
    StateClosed State = iota
    StateOpen
    StateHalfOpen
)

func (cb *CircuitBreaker) Call(fn func() error) error {
    cb.mu.Lock()
    defer cb.mu.Unlock()
    
    if cb.state == StateOpen {
        if time.Since(cb.lastFailTime) > cb.resetTimeout {
            cb.state = StateHalfOpen
        } else {
            return errors.New("circuit breaker is open")
        }
    }
    
    err := fn()
    if err != nil {
        cb.failures++
        cb.lastFailTime = time.Now()
        
        if cb.failures >= cb.maxFailures {
            cb.state = StateOpen
        }
        return err
    }
    
    // Success - reset failures
    cb.failures = 0
    cb.state = StateClosed
    return nil
}
```

## Monitoring and Alerting

### 1. **Rate Limit Metrics**
Track rate limiting activities:

```go
type RateLimitMetrics struct {
    RequestsBlocked    int64
    RequestsAllowed    int64
    TopBlockedClients  map[string]int
    mu                sync.RWMutex
}

func (m *RateLimitMetrics) RecordBlocked(clientID string) {
    atomic.AddInt64(&m.RequestsBlocked, 1)
    
    m.mu.Lock()
    m.TopBlockedClients[clientID]++
    m.mu.Unlock()
}
```

### 2. **Alerting Thresholds**
Set up alerts for unusual patterns:

```yaml
alerts:
  high_rate_limit_blocks:
    threshold: "100 blocks per minute"
    severity: "warning"
    
  distributed_attack:
    threshold: "1000 blocks per minute from multiple IPs"
    severity: "critical"
    
  service_abuse:
    threshold: "single client exceeding limits 10x normal rate"
    severity: "high"
```

## Configuration Examples

### 1. **API Gateway Configuration**
```yaml
api_gateway:
  rate_limiting:
    enabled: true
    default_limit: 60
    default_window: "1m"
    
  limits_by_endpoint:
    "/api/v1/auth/login":
      limit: 5
      window: "1m"
      
    "/api/v1/patients":
      limit: 30
      window: "1m"
      
    "/api/v1/billing/invoices":
      limit: 10
      window: "1m"
```

### 2. **Service-Specific Configuration**
```yaml
patient_registry_service:
  rate_limiting:
    enabled: true
    redis_url: "redis://localhost:6379"
    
    limits:
      search:
        limit: 30
        window: "1m"
        
      create:
        limit: 20
        window: "1m"
        
      update:
        limit: 40
        window: "1m"
```

## Best Practices

### 1. **Implementation Guidelines**
- Use distributed rate limiting for microservices
- Implement exponential backoff for clients
- Provide clear error messages with retry-after headers
- Monitor and adjust limits based on usage patterns

### 2. **Security Considerations**
- Rate limit by user ID, not just IP
- Implement progressive rate limiting
- Use CAPTCHAs for suspicious patterns
- Log rate limit violations for security analysis

### 3. **Performance Optimization**
- Use in-memory rate limiting for high-frequency endpoints
- Implement sliding window algorithms for accuracy
- Cache rate limit status for frequent requests
- Use efficient data structures (hash maps, counters)

## Testing

### 1. **Rate Limiting Tests**
```go
func TestRateLimiting(t *testing.T) {
    limiter := NewRateLimiter()
    
    // Make requests up to limit
    for i := 0; i < 60; i++ {
        req := httptest.NewRequest("GET", "/", nil)
        w := httptest.NewRecorder()
        
        limiter.Middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            w.WriteHeader(http.StatusOK)
        })).ServeHTTP(w, req)
        
        assert.Equal(t, http.StatusOK, w.Code)
    }
    
    // Next request should be rate limited
    req := httptest.NewRequest("GET", "/", nil)
    w := httptest.NewRecorder()
    
    limiter.Middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
    })).ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusTooManyRequests, w.Code)
}
```

---

*Last Updated: January 19, 2026*
*Next Review: February 19, 2026*
