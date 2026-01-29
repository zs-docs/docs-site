# Patient Registry Microservice

## 🎯 Overview

The **Patient Registry** microservice is the cornerstone of ZARISH HIS, responsible for managing all patient demographic information, medical record numbers (MRN), and patient identity across the healthcare system.

## 🏗️ Architecture

### Service Details
- **Service ID**: MS-001
- **Repository**: [zs-his/ms-patient-registry](https://github.com/zs-his/ms-patient-registry)
- **Technology Stack**: Golang 1.25.x, PostgreSQL, Redis, Kafka
- **Port**: 8081

### Core Responsibilities
- Patient registration and demographic management
- Medical Record Number (MRN) generation and validation
- Patient identity management and deduplication
- Patient search and retrieval
- Integration with external systems (EMR, HIS)

## 📊 Data Model

### Patient Entity
```go
type Patient struct {
    ID          string    `json:"id" db:"id"`
    MRN         string    `json:"mrn" db:"mrn"`
    FirstName   string    `json:"first_name" db:"first_name"`
    LastName    string    `json:"last_name" db:"last_name"`
    MiddleName  string    `json:"middle_name" db:"middle_name"`
    DateOfBirth time.Time `json:"date_of_birth" db:"date_of_birth"`
    Gender      string    `json:"gender" db:"gender"`
    PhoneNumber string    `json:"phone_number" db:"phone_number"`
    Email       string    `json:"email" db:"email"`
    Address     Address   `json:"address" db:"address"`
    IsActive    bool      `json:"is_active" db:"is_active"`
    CreatedAt   time.Time `json:"created_at" db:"created_at"`
    UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type Address struct {
    StreetAddress string `json:"street_address"`
    City          string `json:"city"`
    State         string `json:"state"`
    PostalCode    string `json:"postal_code"`
    Country       string `json:"country"`
}
```

## 🔌 API Endpoints

### Patient Management
- `POST /patients` - Create new patient
- `GET /patients/{id}` - Get patient by ID
- `GET /patients/mrn/{mrn}` - Get patient by MRN
- `PUT /patients/{id}` - Update patient information
- `PATCH /patients/{id}` - Partial update patient
- `DELETE /patients/{id}` - Deactivate patient

### Search and Query
- `GET /patients/search` - Search patients by name, MRN, phone
- `GET /patients` - List patients with pagination and filtering
- `GET /patients/duplicates` - Find potential duplicate patients

### Integration
- `POST /patients/merge` - Merge duplicate patient records
- `POST /patients/import` - Bulk import patients from external systems

## 🔄 Business Logic

### MRN Generation
```go
func GenerateMRN() string {
    // Format: MRN + 9 digits (e.g., MRN123456789)
    timestamp := time.Now().Unix()
    random := rand.Intn(999999)
    return fmt.Sprintf("MRN%09d", timestamp%1000000000+random)
}
```

### Patient Deduplication
```go
func (s *PatientService) FindDuplicates(patient *Patient) ([]*Patient, error) {
    // Check by name and date of birth
    candidates, err := s.repo.FindByNameAndDOB(
        patient.FirstName, 
        patient.LastName, 
        patient.DateOfBirth,
    )
    if err != nil {
        return nil, err
    }
    
    // Check by phone number
    phoneMatches, err := s.repo.FindByPhone(patient.PhoneNumber)
    if err != nil {
        return nil, err
    }
    
    // Merge and deduplicate results
    return mergeCandidates(candidates, phoneMatches), nil
}
```

## 🗄️ Database Schema

### Patients Table
```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mrn VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);
CREATE INDEX idx_patients_phone ON patients(phone_number);
CREATE INDEX idx_patients_active ON patients(is_active);
```

## 🔗 Integrations

### Event Publishing
```go
// Events published by Patient Registry
const (
    PatientCreatedEvent   = "patient.created"
    PatientUpdatedEvent   = "patient.updated"
    PatientDeactivatedEvent = "patient.deactivated"
    PatientMergedEvent     = "patient.merged"
)

type PatientEvent struct {
    EventType string    `json:"event_type"`
    PatientID string    `json:"patient_id"`
    MRN       string    `json:"mrn"`
    Timestamp time.Time `json:"timestamp"`
    Data      interface{} `json:"data"`
}
```

### External Systems
- **EMR Integration**: Sync patient data with external EMR systems
- **Lab Systems**: Provide patient demographics for lab orders
- **Billing Systems**: Supply patient information for billing
- **Insurance Systems**: Validate patient coverage

## 🧪 Testing Strategy

### Unit Tests
- Repository layer testing
- Service layer business logic
- MRN generation algorithms
- Deduplication algorithms

### Integration Tests
- Database operations
- Event publishing
- External API integrations

### End-to-End Tests
- Complete patient registration flow
- Patient search and retrieval
- Duplicate detection and merging

## 📈 Performance Considerations

### Caching Strategy
- **Patient Cache**: Redis cache for frequently accessed patients
- **Search Cache**: Cache search results for common queries
- **MRN Index**: In-memory index for MRN lookups

### Database Optimization
- **Indexing Strategy**: Optimized indexes for common queries
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized SQL queries for performance

## 🔐 Security

### Data Protection
- **PII Encryption**: Encrypt sensitive patient information
- **Access Control**: Role-based access to patient data
- **Audit Logging**: Complete audit trail for all patient operations

### Compliance
- **HIPAA Compliance**: Ensure patient data privacy
- **Data Retention**: Implement data retention policies
- **Consent Management**: Track patient consent for data usage

## 🚀 Deployment

### Environment Configuration
```yaml
# config.yaml
server:
  port: 8081
  host: "0.0.0.0"

database:
  host: "localhost"
  port: 5432
  username: "zarish"
  password: "${DB_PASSWORD}"
  database: "zarish_patient_registry"
  max_open_conns: 25
  max_idle_conns: 5

redis:
  host: "localhost"
  port: 6379
  db: 0

kafka:
  brokers: ["localhost:9092"]
  topic: "patient-events"

security:
  jwt_secret: "${JWT_SECRET}"
  encryption_key: "${ENCRYPTION_KEY}"
```

### Health Checks
```go
func (s *Server) HealthCheck() map[string]string {
    checks := make(map[string]string)
    
    // Database health
    if err := s.db.Ping(); err != nil {
        checks["database"] = "unhealthy"
    } else {
        checks["database"] = "healthy"
    }
    
    // Redis health
    if _, err := s.redis.Ping().Result(); err != nil {
        checks["redis"] = "unhealthy"
    } else {
        checks["redis"] = "healthy"
    }
    
    // Kafka health
    if _, err := s.kafka.Producer().TestConnection(); err != nil {
        checks["kafka"] = "unhealthy"
    } else {
        checks["kafka"] = "healthy"
    }
    
    return checks
}
```

## 📝 Development Guidelines

### Adding New Features
1. **Domain Layer**: Define business logic in `internal/domain/`
2. **Repository Layer**: Implement data access in `internal/infrastructure/database/`
3. **Application Layer**: Create use cases in `internal/application/`
4. **Interface Layer**: Add HTTP handlers in `internal/interfaces/http/`
5. **Testing**: Add comprehensive tests for all layers

### Code Quality
- **Code Coverage**: Minimum 80% test coverage
- **Linting**: Follow Go linting standards
- **Documentation**: Comprehensive code documentation
- **Error Handling**: Proper error handling and logging

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Service Team: ZARISH HIS*
