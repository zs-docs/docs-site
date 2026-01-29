# Golang Development Standards

## 🎯 Overview

This document defines the Golang development standards for ZARISH HIS microservices,
ensuring consistency, performance, and maintainability across all Go-based services.

## 📋 Version Requirements

### Go Version

- **Current Stable**: Go 1.25.7
- **Minimum Supported**: Go 1.21.x
- **Development Environment**: Go 1.25.7 or later
- **Production Environment**: Go 1.25.7 LTS

### Toolchain

- **Build Tool**: Go 1.25.7 build tools
- **Package Manager**: Go modules (go.mod)
- **Testing**: Go 1.25.7 testing framework
- **Linting**: golangci-lint 1.55+
- **Formatting**: gofmt (built-in)

## 🏗️ Project Structure

### Standard Directory Layout

```
service-name/
├── cmd/
│   └── service-name/
│       └── main.go              # Application entry point
├── internal/
│   ├── config/                  # Internal configuration
│   ├── handler/                 # HTTP handlers
│   ├── service/                 # Business logic
│   ├── repository/              # Data access layer
│   ├── model/                   # Data models
│   └── middleware/              # HTTP middleware
├── pkg/
│   ├── logger/                  # Logging utilities
│   ├── validator/               # Validation utilities
│   ├── response/                # Response utilities
│   └── errors/                  # Error definitions
├── api/
│   └── v1/                     # API versioning
│       ├── handlers/            # Version-specific handlers
│       ├── models/              # Version-specific models
│       └── routes.go             # Route definitions
├── docs/
│   ├── api/                    # API documentation
│   └── deployment/             # Deployment guides
├── scripts/
│   ├── build.sh                # Build scripts
│   ├── deploy.sh               # Deployment scripts
│   └── migrate.sh             # Migration scripts
├── migrations/
│   └── *.sql                   # Database migrations
├── tests/
│   ├── integration/             # Integration tests
│   ├── unit/                   # Unit tests
│   └── e2e/                    # End-to-end tests
├── configs/
│   ├── config.yaml             # Configuration files
│   ├── config.dev.yaml         # Development config
│   └── config.prod.yaml        # Production config
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
└── README.md
```

## 📝 Coding Standards

### Naming Conventions

#### Package Names

```go
// Good
package patientregistry
package appointmentservice
package billingengine

// Bad
package patient_registry
package AppointmentService
package billing-engine
```

#### File Names

```go
// Good
patient_handler.go
appointment_service.go
billing_repository.go

// Bad
PatientHandler.go
appointment-service.go
BillingRepository.go
```

#### Variable Names

```go
// Good
var patientCount int
var appointmentService service.AppointmentService
var billingRepo repository.BillingRepository

// Bad
var patient_count int
var appointmentService service.AppointmentService
var billingRepo repository.BillingRepository
```

#### Function Names

```go
// Good
func CreatePatient(ctx context.Context, patient *model.Patient) error
func GetAppointmentByID(ctx context.Context, id string) (*model.Appointment, error)
func ProcessBilling(ctx context.Context, billing *model.Billing) error

// Bad
func create_patient(ctx context.Context, patient *model.Patient) error
func getAppointmentById(ctx context.Context, id string) (*model.Appointment, error)
func process_billing(ctx context.Context, billing *model.Billing) error
```

#### Struct Names

```go
// Good
type Patient struct {
    ID        string    `json:"id" db:"id"`
    FirstName string    `json:"firstName" db:"first_name"`
    LastName  string    `json:"lastName" db:"last_name"`
    DOB       time.Time `json:"dateOfBirth" db:"date_of_birth"`
}

type PatientService struct {
    repo repository.PatientRepository
    logger logger.Logger
}

// Bad
type patient struct {
    id        string    `json:"id" db:"id"`
    firstName string    `json:"firstName" db:"first_name"`
    lastName  string    `json:"lastName" db:"last_name"`
    dob       time.Time `json:"dateOfBirth" db:"date_of_birth"`
}
```

### Code Organization

#### Interface Definitions

```go
// interfaces/patient_repository.go
package interfaces

import (
    "context"
    "github.com/zarish-his/internal/model"
)

type PatientRepository interface {
    Create(ctx context.Context, patient *model.Patient) error
    GetByID(ctx context.Context, id string) (*model.Patient, error)
    Update(ctx context.Context, patient *model.Patient) error
    Delete(ctx context.Context, id string) error
    Search(ctx context.Context, filters *model.PatientSearchFilters) ([]*model.Patient, error)
}
```

#### Service Implementation

```go
// internal/service/patient_service.go
package service

import (
    "context"
    "github.com/zarish-his/internal/interfaces"
    "github.com/zarish-his/internal/model"
    "github.com/zarish-his/pkg/logger"
)

type PatientService struct {
    repo   interfaces.PatientRepository
    logger logger.Logger
}

func NewPatientService(repo interfaces.PatientRepository, logger logger.Logger) *PatientService {
    return &PatientService{
        repo:   repo,
        logger: logger,
    }
}

func (s *PatientService) CreatePatient(ctx context.Context, patient *model.Patient) error {
    // Validate input
    if err := s.validatePatient(patient); err != nil {
        s.logger.Error("Patient validation failed", "error", err)
        return err
    }
    
    // Create patient
    if err := s.repo.Create(ctx, patient); err != nil {
        s.logger.Error("Failed to create patient", "error", err)
        return err
    }
    
    s.logger.Info("Patient created successfully", "patientId", patient.ID)
    return nil
}
```

#### Handler Implementation

```go
// internal/handler/patient_handler.go
package handler

import (
    "encoding/json"
    "net/http"
    
    "github.com/gin-gonic/gin"
    "github.com/zarish-his/internal/model"
    "github.com/zarish-his/internal/service"
    "github.com/zarish-his/pkg/response"
    "github.com/zarish-his/pkg/validator"
)

type PatientHandler struct {
    service service.PatientService
}

func NewPatientHandler(service service.PatientService) *PatientHandler {
    return &PatientHandler{
        service: service,
    }
}

func (h *PatientHandler) CreatePatient(c *gin.Context) {
    var req model.CreatePatientRequest
    
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, http.StatusBadRequest, "Invalid request format", err)
        return
    }
    
    if err := validator.Validate(&req); err != nil {
        response.Error(c, http.StatusBadRequest, "Validation failed", err)
        return
    }
    
    patient := &model.Patient{
        FirstName: req.FirstName,
        LastName:  req.LastName,
        DOB:       req.DOB,
        // ... other fields
    }
    
    if err := h.service.CreatePatient(c.Request.Context(), patient); err != nil {
        response.Error(c, http.StatusInternalServerError, "Failed to create patient", err)
        return
    }
    
    response.Success(c, http.StatusCreated, "Patient created successfully", patient)
}
```

## 🔧 Configuration Management

### Configuration Structure

```go
// internal/config/config.go
package config

import (
    "time"
)

type Config struct {
    Server   ServerConfig   `yaml:"server"`
    Database DatabaseConfig `yaml:"database"`
    Redis    RedisConfig    `yaml:"redis"`
    Logger   LoggerConfig   `yaml:"logger"`
    JWT      JWTConfig      `yaml:"jwt"`
}

type ServerConfig struct {
    Host         string        `yaml:"host"`
    Port         int           `yaml:"port"`
    ReadTimeout  time.Duration `yaml:"readTimeout"`
    WriteTimeout time.Duration `yaml:"writeTimeout"`
}

type DatabaseConfig struct {
    Host         string `yaml:"host"`
    Port         int    `yaml:"port"`
    Name         string `yaml:"name"`
    Username     string `yaml:"username"`
    Password     string `yaml:"password"`
    SSLMode      string `yaml:"sslMode"`
    MaxOpenConns int    `yaml:"maxOpenConns"`
    MaxIdleConns int    `yaml:"maxIdleConns"`
}
```

### Configuration Loading

```go
// cmd/service-name/main.go
package main

import (
    "flag"
    "os"
    
    "github.com/spf13/viper"
    "github.com/zarish-his/internal/config"
    "github.com/zarish-his/pkg/logger"
)

func main() {
    var configPath string
    flag.StringVar(&configPath, "config", "configs/config.yaml", "Path to configuration file")
    flag.Parse()
    
    // Load configuration
    viper.SetConfigFile(configPath)
    viper.AutomaticEnv()
    
    if err := viper.ReadInConfig(); err != nil {
        logger.Fatal("Failed to read configuration", "error", err)
    }
    
    var cfg config.Config
    if err := viper.Unmarshal(&cfg); err != nil {
        logger.Fatal("Failed to unmarshal configuration", "error", err)
    }
    
    // Initialize application
    app := app.New(cfg)
    if err := app.Run(); err != nil {
        logger.Fatal("Failed to start application", "error", err)
    }
}
```

## 🧪 Testing Standards

### Unit Testing

```go
// tests/unit/patient_service_test.go
package unit

import (
    "context"
    "testing"
    
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "github.com/zarish-his/internal/model"
    "github.com/zarish-his/internal/service"
)

func TestPatientService_CreatePatient_Success(t *testing.T) {
    // Arrange
    mockRepo := &MockPatientRepository{}
    mockLogger := &MockLogger{}
    
    service := service.NewPatientService(mockRepo, mockLogger)
    
    patient := &model.Patient{
        FirstName: "John",
        LastName:  "Doe",
        DOB:       time.Date(1990, 1, 1, 0, 0, 0, time.UTC),
    }
    
    mockRepo.On("Create", mock.Anything, patient).Return(nil)
    mockLogger.On("Info", mock.Anything, mock.Anything, mock.Anything).Return()
    
    // Act
    err := service.CreatePatient(context.Background(), patient)
    
    // Assert
    assert.NoError(t, err)
    mockRepo.AssertExpectations(t)
    mockLogger.AssertExpectations(t)
}

func TestPatientService_CreatePatient_ValidationError(t *testing.T) {
    // Arrange
    mockRepo := &MockPatientRepository{}
    mockLogger := &MockLogger{}
    
    service := service.NewPatientService(mockRepo, mockLogger)
    
    patient := &model.Patient{
        FirstName: "", // Invalid: empty first name
        LastName:  "Doe",
        DOB:       time.Date(1990, 1, 1, 0, 0, 0, time.UTC),
    }
    
    // Act
    err := service.CreatePatient(context.Background(), patient)
    
    // Assert
    assert.Error(t, err)
    assert.Contains(t, err.Error(), "first name is required")
}
```

### Integration Testing

```go
// tests/integration/patient_handler_test.go
package integration

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
    
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/suite"
    "github.com/zarish-his/internal/config"
    "github.com/zarish-his/internal/handler"
)

type PatientHandlerTestSuite struct {
    suite.Suite
    handler *handler.PatientHandler
    server  *httptest.Server
}

func (suite *PatientHandlerTestSuite) SetupSuite() {
    cfg := config.Config{
        Database: config.DatabaseConfig{
            Host:     "localhost",
            Port:     5432,
            Name:     "test_zarish_his",
            Username: "test_user",
            Password: "test_password",
        },
    }
    
    suite.handler = handler.NewPatientHandler(cfg)
    suite.server = httptest.NewServer(suite.handler.Routes())
}

func (suite *PatientHandlerTestSuite) TearDownSuite() {
    suite.server.Close()
}

func (suite *PatientHandlerTestSuite) TestCreatePatient_Success() {
    // Arrange
    patient := map[string]interface{}{
        "firstName": "John",
        "lastName":  "Doe",
        "dateOfBirth": "1990-01-01",
        "gender": "M",
    }
    
    body, _ := json.Marshal(patient)
    req := httptest.NewRequest("POST", "/api/v1/patients", bytes.NewBuffer(body))
    req.Header.Set("Content-Type", "application/json")
    
    // Act
    resp := suite.server.TestHTTP(req)
    
    // Assert
    assert.Equal(suite.T(), http.StatusCreated, resp.StatusCode)
    
    var response map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&response)
    assert.Equal(suite.T(), "Patient created successfully", response["message"])
}
```

## 🔍 Error Handling

### Error Types

```go
// pkg/errors/errors.go
package errors

import (
    "fmt"
    "net/http"
)

type AppError struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Details string `json:"details,omitempty"`
}

func (e *AppError) Error() string {
    return fmt.Sprintf("Code: %d, Message: %s, Details: %s", e.Code, e.Message, e.Details)
}

func NewAppError(code int, message, details string) *AppError {
    return &AppError{
        Code:    code,
        Message: message,
        Details: details,
    }
}

// Common error types
var (
    ErrInvalidInput     = NewAppError(http.StatusBadRequest, "Invalid input", "")
    ErrNotFound        = NewAppError(http.StatusNotFound, "Resource not found", "")
    ErrUnauthorized    = NewAppError(http.StatusUnauthorized, "Unauthorized", "")
    ErrInternalServer  = NewAppError(http.StatusInternalServerError, "Internal server error", "")
    ErrDatabaseError  = NewAppError(http.StatusInternalServerError, "Database error", "")
)
```

### Error Handling in Services

```go
func (s *PatientService) GetPatientByID(ctx context.Context, id string) (*model.Patient, error) {
    if id == "" {
        s.logger.Error("Empty patient ID provided")
        return nil, errors.ErrInvalidInput
    }
    
    patient, err := s.repo.GetByID(ctx, id)
    if err != nil {
        s.logger.Error("Failed to get patient", "error", err, "patientId", id)
        
        if errors.Is(err, repository.ErrNotFound) {
            return nil, errors.ErrNotFound
        }
        
        return nil, errors.ErrDatabaseError
    }
    
    return patient, nil
}
```

## 📊 Logging Standards

### Logger Interface

```go
// pkg/logger/logger.go
package logger

import (
    "context"
)

type Logger interface {
    Debug(msg string, fields ...interface{})
    Info(msg string, fields ...interface{})
    Warn(msg string, fields ...interface{})
    Error(msg string, fields ...interface{})
    Fatal(msg string, fields ...interface{})
    
    WithField(key string, value interface{}) Logger
    WithFields(fields map[string]interface{}) Logger
    WithContext(ctx context.Context) Logger
}
```

### Structured Logging

```go
// Usage in services
func (s *PatientService) CreatePatient(ctx context.Context, patient *model.Patient) error {
    s.logger.Info("Creating new patient",
        "patientId", patient.ID,
        "firstName", patient.FirstName,
        "lastName", patient.LastName,
        "nationality", patient.Nationality,
    )
    
    if err := s.repo.Create(ctx, patient); err != nil {
        s.logger.Error("Failed to create patient",
            "error", err,
            "patientId", patient.ID,
        )
        return err
    }
    
    s.logger.Info("Patient created successfully",
        "patientId", patient.ID,
        "timestamp", time.Now(),
    )
    
    return nil
}
```

## 🚀 Performance Standards

### Database Connection Pooling

```go
// internal/repository/database.go
package repository

import (
    "database/sql"
    "time"
    
    _ "github.com/lib/pq"
)

func NewDatabase(cfg config.DatabaseConfig) (*sql.DB, error) {
    dsn := fmt.Sprintf(
        "host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
        cfg.Host, cfg.Port, cfg.Username, cfg.Password, cfg.Name, cfg.SSLMode,
    )
    
    db, err := sql.Open("postgres", dsn)
    if err != nil {
        return nil, err
    }
    
    // Configure connection pool
    db.SetMaxOpenConns(cfg.MaxOpenConns)
    db.SetMaxIdleConns(cfg.MaxIdleConns)
    db.SetConnMaxLifetime(time.Hour)
    
    return db, nil
}
```

### Caching Strategy

```go
// internal/repository/patient_repository.go
package repository

import (
    "context"
    "encoding/json"
    "time"
    
    "github.com/go-redis/redis/v8"
)

type PatientRepository struct {
    db    *sql.DB
    redis *redis.Client
    ttl   time.Duration
}

func (r *PatientRepository) GetByID(ctx context.Context, id string) (*model.Patient, error) {
    // Try cache first
    cacheKey := fmt.Sprintf("patient:%s", id)
    cached, err := r.redis.Get(ctx, cacheKey).Result()
    if err == nil {
        var patient model.Patient
        if err := json.Unmarshal([]byte(cached), &patient); err == nil {
            return &patient, nil
        }
    }
    
    // Cache miss - query database
    patient, err := r.getFromDB(ctx, id)
    if err != nil {
        return nil, err
    }
    
    // Update cache
    patientJSON, _ := json.Marshal(patient)
    r.redis.Set(ctx, cacheKey, patientJSON, r.ttl)
    
    return patient, nil
}
```

## 🔒 Security Standards

### Input Validation

```go
// pkg/validator/patient_validator.go
package validator

import (
    "regexp"
    "errors"
    
    "github.com/zarish-his/internal/model"
)

func ValidatePatient(patient *model.Patient) error {
    if patient.FirstName == "" {
        return errors.New("first name is required")
    }
    
    if len(patient.FirstName) < 2 || len(patient.FirstName) > 50 {
        return errors.New("first name must be between 2 and 50 characters")
    }
    
    // Validate Bangladeshi National ID
    if patient.Nationality == "BD" && patient.NationalID != "" {
        nidPattern := regexp.MustCompile(`^\d{13}$`)
        if !nidPattern.MatchString(patient.NationalID) {
            return errors.New("invalid Bangladeshi National ID format")
        }
    }
    
    // Validate Rohingya IDs
    if patient.Nationality == "ROH" {
        if patient.ProgressID != "" {
            progressPattern := regexp.MustCompile(`^PROG\d{9}$`)
            if !progressPattern.MatchString(patient.ProgressID) {
                return errors.New("invalid ProGress ID format")
            }
        }
    }
    
    return nil
}
```

### Security Headers

```go
// internal/middleware/security.go
package middleware

import (
    "net/http"
    "time"
    
    "github.com/gin-gonic/gin"
)

func SecurityHeaders() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Header("X-Frame-Options", "DENY")
        c.Header("X-Content-Type-Options", "nosniff")
        c.Header("X-XSS-Protection", "1; mode=block")
        c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        c.Header("Content-Security-Policy", "default-src 'self'")
        c.Next()
    }
}

func RateLimit() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Implement rate limiting logic
        c.Next()
    }
}
```

## 📋 Build and Deployment

### Docker Configuration

```dockerfile
# Dockerfile
FROM golang:1.25.7-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/service-name

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/configs ./configs

EXPOSE 8080
CMD ["./main"]
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patient-registry
spec:
  replicas: 3
  selector:
    matchLabels:
      app: patient-registry
  template:
    metadata:
      labels:
        app: patient-registry
    spec:
      containers:
      - name: patient-registry
        image: zarish-his/patient-registry:latest
        ports:
        - containerPort: 8080
        env:
        - name: CONFIG_PATH
          value: "/app/configs/config.prod.yaml"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

**Standards Version**: 1.0  
**Last Updated**: January 2026  
**Go Version**: 1.25.7  
**Compliance**: ZARISH HIS Development Standards
