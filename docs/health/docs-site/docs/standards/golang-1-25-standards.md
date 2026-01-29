# Golang 1.25.x Development Standards

## 🎯 Overview

This document defines the coding standards, best practices, and conventions for developing Golang microservices in the ZARISH HIS ecosystem. All backend services must adhere to these standards to ensure consistency, maintainability, and performance.

## 📁 Project Structure

### Standard Directory Layout
```
ms-[service-name]/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── domain/                  # Business logic and entities
│   │   ├── entities/            # Domain entities
│   │   ├── repositories/        # Repository interfaces
│   │   └── services/            # Domain services
│   ├── infrastructure/          # External dependencies
│   │   ├── database/            # Database implementations
│   │   ├── messaging/           # Message queue implementations
│   │   └── external/            # External API clients
│   ├── application/            # Use cases and application logic
│   │   ├── commands/            # Command handlers
│   │   ├── queries/             # Query handlers
│   │   └── dto/                 # Data transfer objects
│   └── interfaces/             # HTTP/gRPC handlers
│       ├── http/                # HTTP handlers
│       ├── grpc/                # gRPC handlers
│       └── middleware/          # HTTP middleware
├── pkg/
│   ├── errors/                  # Standard error types
│   ├── logger/                  # Logging utilities
│   ├── metrics/                 # Metrics collection
│   ├── validator/               # Input validation
│   └── utils/                   # Common utilities
├── configs/
│   ├── config.yaml              # Configuration
│   ├── config.dev.yaml          # Development config
│   ├── config.stg.yaml          # Staging config
│   └── config.prd.yaml          # Production config
├── migrations/                  # Database migrations
├── tests/                       # Test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
├── docs/                        # API documentation
├── scripts/                     # Build and deployment scripts
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## 🏗️ Architectural Patterns

### 1. **Clean Architecture**
```go
// Domain Layer
type Patient struct {
    ID        string    `json:"id"`
    MRN       string    `json:"mrn"`
    Name      string    `json:"name"`
    Gender    string    `json:"gender"`
    BirthDate time.Time `json:"birth_date"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type PatientRepository interface {
    Create(ctx context.Context, patient *Patient) error
    GetByID(ctx context.Context, id string) (*Patient, error)
    Update(ctx context.Context, patient *Patient) error
    Delete(ctx context.Context, id string) error
}

// Application Layer
type CreatePatientCommand struct {
    MRN       string    `json:"mrn" validate:"required"`
    Name      string    `json:"name" validate:"required"`
    Gender    string    `json:"gender" validate:"required,oneof=male female other"`
    BirthDate time.Time `json:"birth_date" validate:"required"`
}

type PatientService struct {
    repo PatientRepository
    log *logger.Logger
}

func (s *PatientService) CreatePatient(ctx context.Context, cmd CreatePatientCommand) (*Patient, error) {
    // Business logic here
    patient := &Patient{
        ID:        generateID(),
        MRN:       cmd.MRN,
        Name:      cmd.Name,
        Gender:    cmd.Gender,
        BirthDate: cmd.BirthDate,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }
    
    if err := s.repo.Create(ctx, patient); err != nil {
        s.log.Error("Failed to create patient", "error", err)
        return nil, errors.NewInternalServerError("Failed to create patient")
    }
    
    return patient, nil
}
```

### 2. **Dependency Injection**
```go
// cmd/server/main.go
package main

import (
    "context"
    "log"
    "os"
    
    "github.com/zs-his/ms-patient-registry/internal/application"
    "github.com/zs-his/ms-patient-registry/internal/infrastructure/database"
    "github.com/zs-his/ms-patient-registry/internal/interfaces/http"
    "github.com/zs-his/ms-patient-registry/pkg/config"
    "github.com/zs-his/ms-patient-registry/pkg/logger"
)

func main() {
    // Load configuration
    cfg, err := config.Load()
    if err != nil {
        log.Fatal("Failed to load config:", err)
    }
    
    // Initialize logger
    log := logger.New(cfg.LogLevel)
    
    // Initialize database
    db, err := database.New(cfg.Database)
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    defer db.Close()
    
    // Initialize repositories
    patientRepo := database.NewPatientRepository(db)
    
    // Initialize services
    patientService := application.NewPatientService(patientRepo, log)
    
    // Initialize HTTP server
    server := http.NewServer(cfg.Server, patientService, log)
    
    // Start server
    log.Info("Starting server", "port", cfg.Server.Port)
    if err := server.Start(); err != nil {
        log.Fatal("Failed to start server:", err)
    }
}
```

## 📝 Coding Conventions

### 1. **Naming Standards**

#### Package Names
- Use short, lowercase, single words
- No underscores or mixed caps
- Examples: `patient`, `billing`, `auth`

#### Variable and Function Names
- Use `camelCase` for local variables
- Use `PascalCase` for exported names
- Use `UPPER_SNAKE_CASE` for constants
```go
const (
    MAX_RETRY_COUNT = 3
    DEFAULT_TIMEOUT = 30 * time.Second
)

type PatientService struct {
    repo PatientRepository
    log  *logger.Logger
}

func (s *PatientService) createPatient(ctx context.Context, patient *Patient) error {
    // Implementation
}
```

#### Interface Names
- Use `-er` suffix for interfaces
- Use descriptive names
```go
type PatientCreator interface {
    CreatePatient(ctx context.Context, patient *Patient) error
}

type PatientRepository interface {
    Create(ctx context.Context, patient *Patient) error
    GetByID(ctx context.Context, id string) (*Patient, error)
}
```

### 2. **Error Handling**

#### Standard Error Types
```go
// pkg/errors/errors.go
package errors

import (
    "fmt"
    "net/http"
)

type APIError struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Details string `json:"details,omitempty"`
}

func (e *APIError) Error() string {
    return fmt.Sprintf("API Error %d: %s", e.Code, e.Message)
}

// Predefined errors
var (
    ErrInternalServerError = &APIError{
        Code:    http.StatusInternalServerError,
        Message: "Internal server error",
    }
    ErrNotFound = &APIError{
        Code:    http.StatusNotFound,
        Message: "Resource not found",
    }
    ErrBadRequest = &APIError{
        Code:    http.StatusBadRequest,
        Message: "Bad request",
    }
    ErrUnauthorized = &APIError{
        Code:    http.StatusUnauthorized,
        Message: "Unauthorized",
    }
)

func NewAPIError(code int, message, details string) *APIError {
    return &APIError{
        Code:    code,
        Message: message,
        Details: details,
    }
}
```

#### Error Handling Pattern
```go
func (s *PatientService) GetPatient(ctx context.Context, id string) (*Patient, error) {
    if id == "" {
        return nil, errors.NewAPIError(
            http.StatusBadRequest,
            "Invalid patient ID",
            "Patient ID cannot be empty",
        )
    }
    
    patient, err := s.repo.GetByID(ctx, id)
    if err != nil {
        if errors.Is(err, database.ErrNotFound) {
            return nil, errors.ErrNotFound
        }
        
        s.log.Error("Failed to get patient", "id", id, "error", err)
        return nil, errors.ErrInternalServerError
    }
    
    return patient, nil
}
```

### 3. **Logging Standards**

#### Structured Logging
```go
import (
    "context"
    "go.uber.org/zap"
)

type Logger struct {
    *zap.Logger
}

func NewLogger(level string) *Logger {
    config := zap.NewProductionConfig()
    config.Level = zap.NewAtomicLevelAt(getLogLevel(level))
    
    logger, err := config.Build()
    if err != nil {
        panic(err)
    }
    
    return &Logger{logger}
}

func (l *Logger) Info(msg string, fields ...interface{}) {
    l.Sugar().Infow(msg, fields...)
}

func (l *Logger) Error(msg string, fields ...interface{}) {
    l.Sugar().Errorw(msg, fields...)
}

func (l *Logger) Debug(msg string, fields ...interface{}) {
    l.Sugar().Debugw(msg, fields...)
}

// Usage
log.Info("Patient created successfully", 
    "patient_id", patient.ID, 
    "mrn", patient.MRN,
    "operation", "create_patient")
```

## 🔧 Configuration Management

### 1. **Configuration Structure**
```go
// pkg/config/config.go
package config

import (
    "fmt"
    "os"
    
    "github.com/spf13/viper"
)

type Config struct {
    Server   ServerConfig   `mapstructure:"server"`
    Database DatabaseConfig `mapstructure:"database"`
    Redis    RedisConfig    `mapstructure:"redis"`
    Kafka    KafkaConfig    `mapstructure:"kafka"`
    Log      LogConfig      `mapstructure:"log"`
}

type ServerConfig struct {
    Port         int           `mapstructure:"port" validate:"required,min=1,max=65535"`
    Host         string        `mapstructure:"host" validate:"required"`
    ReadTimeout  time.Duration `mapstructure:"read_timeout"`
    WriteTimeout time.Duration `mapstructure:"write_timeout"`
    IdleTimeout  time.Duration `mapstructure:"idle_timeout"`
}

type DatabaseConfig struct {
    Host         string `mapstructure:"host" validate:"required"`
    Port         int    `mapstructure:"port" validate:"required,min=1,max=65535"`
    Username     string `mapstructure:"username" validate:"required"`
    Password     string `mapstructure:"password" validate:"required"`
    Database     string `mapstructure:"database" validate:"required"`
    SSLMode      string `mapstructure:"ssl_mode"`
    MaxOpenConns int    `mapstructure:"max_open_conns"`
    MaxIdleConns int    `mapstructure:"max_idle_conns"`
}

func Load() (*Config, error) {
    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath("./configs")
    viper.AddConfigPath(".")
    
    // Set environment variable prefix
    viper.SetEnvPrefix("ZARISH")
    viper.AutomaticEnv()
    
    if err := viper.ReadInConfig(); err != nil {
        return nil, fmt.Errorf("failed to read config: %w", err)
    }
    
    var config Config
    if err := viper.Unmarshal(&config); err != nil {
        return nil, fmt.Errorf("failed to unmarshal config: %w", err)
    }
    
    return &config, nil
}
```

### 2. **Environment Variables**
```bash
# .env
ZARISH_SERVER_PORT=8080
ZARISH_SERVER_HOST=0.0.0.0
ZARISH_DATABASE_HOST=localhost
ZARISH_DATABASE_PORT=5432
ZARISH_DATABASE_USERNAME=zarish
ZARISH_DATABASE_PASSWORD=password
ZARISH_DATABASE_NAME=zarish_his
ZARISH_REDIS_HOST=localhost
ZARISH_REDIS_PORT=6379
ZARISH_KAFKA_BROKERS=localhost:9092
ZARISH_LOG_LEVEL=info
```

## 🧪 Testing Standards

### 1. **Unit Testing**
```go
// tests/unit/patient_service_test.go
package unit

import (
    "context"
    "testing"
    "time"
    
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    
    "github.com/zs-his/ms-patient-registry/internal/application"
    "github.com/zs-his/ms-patient-registry/internal/domain"
    "github.com/zs-his/ms-patient-registry/pkg/errors"
)

// Mock repository
type MockPatientRepository struct {
    mock.Mock
}

func (m *MockPatientRepository) Create(ctx context.Context, patient *domain.Patient) error {
    args := m.Called(ctx, patient)
    return args.Error(0)
}

func (m *MockPatientRepository) GetByID(ctx context.Context, id string) (*domain.Patient, error) {
    args := m.Called(ctx, id)
    return args.Get(0).(*domain.Patient), args.Error(1)
}

func TestPatientService_CreatePatient(t *testing.T) {
    // Arrange
    mockRepo := new(MockPatientRepository)
    logger := logger.New("test")
    
    service := application.NewPatientService(mockRepo, logger)
    
    cmd := application.CreatePatientCommand{
        MRN:       "MRN123456789",
        Name:      "John Doe",
        Gender:    "male",
        BirthDate: time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
    }
    
    mockRepo.On("Create", mock.Anything, mock.AnythingOfType("*domain.Patient")).Return(nil)
    
    // Act
    patient, err := service.CreatePatient(context.Background(), cmd)
    
    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, patient)
    assert.Equal(t, cmd.MRN, patient.MRN)
    assert.Equal(t, cmd.Name, patient.Name)
    assert.Equal(t, cmd.Gender, patient.Gender)
    
    mockRepo.AssertExpectations(t)
}
```

### 2. **Integration Testing**
```go
// tests/integration/patient_test.go
package integration

import (
    "context"
    "testing"
    "time"
    
    "github.com/stretchr/testify/suite"
    
    "github.com/zs-his/ms-patient-registry/internal/infrastructure/database"
    "github.com/zs-his/ms-patient-registry/pkg/config"
)

type PatientIntegrationTestSuite struct {
    suite.Suite
    db   *database.DB
    repo *database.PatientRepository
}

func (suite *PatientIntegrationTestSuite) SetupSuite() {
    cfg := &config.DatabaseConfig{
        Host:     "localhost",
        Port:     5432,
        Username: "test",
        Password: "test",
        Database: "test_zarish",
    }
    
    db, err := database.New(cfg)
    suite.Require().NoError(err)
    
    suite.db = db
    suite.repo = database.NewPatientRepository(db)
}

func (suite *PatientIntegrationTestSuite) TearDownSuite() {
    suite.db.Close()
}

func (suite *PatientIntegrationTestSuite) TestCreateAndGetPatient() {
    // Arrange
    patient := &domain.Patient{
        ID:        "test-patient-1",
        MRN:       "MRN123456789",
        Name:      "Test Patient",
        Gender:    "male",
        BirthDate: time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
    }
    
    // Act
    err := suite.repo.Create(context.Background(), patient)
    suite.Require().NoError(err)
    
    retrieved, err := suite.repo.GetByID(context.Background(), patient.ID)
    suite.Require().NoError(err)
    
    // Assert
    suite.Equal(patient.ID, retrieved.ID)
    suite.Equal(patient.MRN, retrieved.MRN)
    suite.Equal(patient.Name, retrieved.Name)
}

func TestPatientIntegrationTestSuite(t *testing.T) {
    suite.Run(t, new(PatientIntegrationTestSuite))
}
```

## 🚀 Performance Guidelines

### 1. **Database Operations**
```go
// Use prepared statements
func (r *PatientRepository) GetByID(ctx context.Context, id string) (*Patient, error) {
    const query = `
        SELECT id, mrn, name, gender, birth_date, created_at, updated_at
        FROM patients
        WHERE id = $1
    `
    
    var patient Patient
    err := r.db.QueryRowContext(ctx, query, id).Scan(
        &patient.ID,
        &patient.MRN,
        &patient.Name,
        &patient.Gender,
        &patient.BirthDate,
        &patient.CreatedAt,
        &patient.UpdatedAt,
    )
    
    if err != nil {
        return nil, err
    }
    
    return &patient, nil
}

// Use transactions for multiple operations
func (r *PatientRepository) CreateWithHistory(ctx context.Context, patient *Patient, history *PatientHistory) error {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil {
        return err
    }
    defer tx.Rollback()
    
    if err := r.createPatientTx(ctx, tx, patient); err != nil {
        return err
    }
    
    if err := r.createHistoryTx(ctx, tx, history); err != nil {
        return err
    }
    
    return tx.Commit()
}
```

### 2. **Caching Strategy**
```go
// pkg/cache/cache.go
package cache

import (
    "context"
    "encoding/json"
    "time"
    
    "github.com/go-redis/redis/v8"
)

type Cache interface {
    Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error
    Get(ctx context.Context, key string, dest interface{}) error
    Delete(ctx context.Context, key string) error
}

type RedisCache struct {
    client *redis.Client
}

func NewRedisCache(client *redis.Client) *RedisCache {
    return &RedisCache{client: client}
}

func (c *RedisCache) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
    data, err := json.Marshal(value)
    if err != nil {
        return err
    }
    
    return c.client.Set(ctx, key, data, ttl).Err()
}

func (c *RedisCache) Get(ctx context.Context, key string, dest interface{}) error {
    data, err := c.client.Get(ctx, key).Result()
    if err != nil {
        return err
    }
    
    return json.Unmarshal([]byte(data), dest)
}

// Usage in repository
func (r *PatientRepository) GetByID(ctx context.Context, id string) (*Patient, error) {
    cacheKey := fmt.Sprintf("patient:%s", id)
    
    // Try cache first
    var patient Patient
    if err := r.cache.Get(ctx, cacheKey, &patient); err == nil {
        return &patient, nil
    }
    
    // Fallback to database
    patient, err := r.getFromDB(ctx, id)
    if err != nil {
        return nil, err
    }
    
    // Update cache
    r.cache.Set(ctx, cacheKey, patient, 5*time.Minute)
    
    return &patient, nil
}
```

## 📊 Monitoring and Metrics

### 1. **Metrics Collection**
```go
// pkg/metrics/metrics.go
package metrics

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
)

var (
    // HTTP metrics
    httpRequestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )
    
    httpRequestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "endpoint"},
    )
    
    // Database metrics
    dbQueriesTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "db_queries_total",
            Help: "Total number of database queries",
        },
        []string{"operation", "table", "status"},
    )
    
    dbQueryDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "db_query_duration_seconds",
            Help:    "Database query duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"operation", "table"},
    )
)

// Middleware for HTTP metrics
func HTTPMetricsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        // Create response writer to capture status code
        rw := &responseWriter{ResponseWriter: w}
        
        next.ServeHTTP(rw, r)
        
        duration := time.Since(start)
        
        httpRequestsTotal.WithLabelValues(
            r.Method,
            r.URL.Path,
            fmt.Sprintf("%d", rw.statusCode),
        ).Inc()
        
        httpRequestDuration.WithLabelValues(
            r.Method,
            r.URL.Path,
        ).Observe(duration.Seconds())
    })
}
```

## 🔐 Security Standards

### 1. **Input Validation**
```go
// pkg/validator/validator.go
package validator

import (
    "fmt"
    "reflect"
    
    "github.com/go-playground/validator/v10"
)

type Validator struct {
    validate *validator.Validate
}

func NewValidator() *Validator {
    v := validator.New()
    
    // Register custom validators
    v.RegisterValidation("mrn", validateMRN)
    v.RegisterValidation("phone", validatePhone)
    
    return &Validator{validate: v}
}

func (v *Validator) ValidateStruct(s interface{}) error {
    if err := v.validate.Struct(s); err != nil {
        return fmt.Errorf("validation failed: %w", err)
    }
    return nil
}

// Custom validators
func validateMRN(fl validator.FieldLevel) bool {
    mrn := fl.Field().String()
    // MRN format: MRN followed by 9 digits
    matched, _ := regexp.MatchString(`^MRN\d{9}$`, mrn)
    return matched
}

func validatePhone(fl validator.FieldLevel) bool {
    phone := fl.Field().String()
    // Basic phone validation
    matched, _ := regexp.MatchString(`^\+?[\d\s\-\(\)]+$`, phone)
    return matched && len(phone) >= 10
}
```

### 2. **Authentication Middleware**
```go
// pkg/auth/middleware.go
package auth

import (
    "context"
    "net/http"
    "strings"
    
    "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
    UserID   string `json:"user_id"`
    Username string `json:"username"`
    Role     string `json:"role"`
    jwt.RegisteredClaims
}

func JWTMiddleware(secretKey string) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            authHeader := r.Header.Get("Authorization")
            if authHeader == "" {
                http.Error(w, "Authorization header required", http.StatusUnauthorized)
                return
            }
            
            tokenString := strings.TrimPrefix(authHeader, "Bearer ")
            
            claims := &Claims{}
            token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
                return []byte(secretKey), nil
            })
            
            if err != nil || !token.Valid {
                http.Error(w, "Invalid token", http.StatusUnauthorized)
                return
            }
            
            ctx := context.WithValue(r.Context(), "user", claims)
            next.ServeHTTP(w, r.WithContext(ctx))
        })
    }
}
```

## 📦 Build and Deployment

### 1. **Dockerfile**
```dockerfile
# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/server/main.go

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy binary
COPY --from=builder /app/main .

# Copy configuration
COPY --from=builder /app/configs ./configs

# Expose port
EXPOSE 8080

# Run binary
CMD ["./main"]
```

### 2. **Makefile**
```makefile
.PHONY: build test run docker-build docker-run clean

# Variables
APP_NAME = ms-patient-registry
VERSION = $(shell git describe --tags --always --dirty)
DOCKER_IMAGE = zarish/$(APP_NAME):$(VERSION)

# Build
build:
  go build -o bin/$(APP_NAME) cmd/server/main.go

# Test
test:
  go test -v ./...

test-coverage:
  go test -v -race -coverprofile=coverage.out ./...
  go tool cover -html=coverage.out -o coverage.html

# Run
run:
  go run cmd/server/main.go

# Docker
docker-build:
  docker build -t $(DOCKER_IMAGE) .

docker-run:
  docker run -p 8080:8080 $(DOCKER_IMAGE)

# Clean
clean:
  rm -rf bin/
  rm -f coverage.out coverage.html

# Lint
lint:
  golangci-lint run

# Format
fmt:
  go fmt ./...

# Tidy
tidy:
  go mod tidy
```

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Backend Team: ZARISH HIS*
