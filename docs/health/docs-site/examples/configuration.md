# Configuration Examples

## 🎯 Overview

This section provides configuration examples for ZARISH HIS deployment, including database, API, and security settings.

## 🗄️ Database Configuration

### PostgreSQL Configuration

```yaml
# config/database.yml
database:
  host: "localhost"
  port: 5432
  name: "zarish_his"
  username: "zarish_user"
  password: "${DB_PASSWORD}"
  ssl_mode: "require"
  max_connections: 100
  connection_timeout: 30
  
  # Connection pool settings
  pool:
    min_connections: 10
    max_connections: 50
    acquire_timeout: 30
    idle_timeout: 300
  
  # Migration settings
  migrations:
    auto_migrate: true
    migration_path: "./migrations"
    backup_before_migrate: true
```

### Redis Configuration

```yaml
# config/redis.yml
redis:
  host: "localhost"
  port: 6379
  password: "${REDIS_PASSWORD}"
  database: 0
  
  # Connection settings
  connection_pool:
    max_connections: 20
    min_connections: 5
    timeout: 30
  
  # Cache settings
  cache:
    default_ttl: 3600
    max_memory: "256mb"
    eviction_policy: "allkeys-lru"
```

## 🔌 API Configuration

### API Server Configuration

```yaml
# config/api.yml
api:
  server:
    host: "0.0.0.0"
    port: 8080
    read_timeout: 30
    write_timeout: 30
    max_header_bytes: 1048576
  
  # CORS settings
  cors:
    allowed_origins:
      - "https://zarish-his.com"
      - "https://docs.zarish-his.com"
    allowed_methods:
      - "GET"
      - "POST"
      - "PUT"
      - "DELETE"
    allowed_headers:
      - "Content-Type"
      - "Authorization"
    max_age: 86400
  
  # Rate limiting
  rate_limiting:
    enabled: true
    requests_per_minute: 100
    burst_size: 20
    cleanup_interval: 60
  
  # API versioning
  versioning:
    type: "url"
    current_version: "v1"
    supported_versions:
      - "v1"
      - "v2"
```

### Authentication Configuration

```yaml
# config/auth.yml
authentication:
  # JWT settings
  jwt:
    secret_key: "${JWT_SECRET}"
    expiration_time: 3600
    refresh_token_expiration: 86400
    algorithm: "HS256"
  
  # API key settings
  api_keys:
    enabled: true
    header_name: "X-API-Key"
    query_param: "api_key"
  
  # Session settings
  session:
    store: "redis"
    cookie_name: "zarish_session"
    secure: true
    http_only: true
    max_age: 86400
```

## 🔐 Security Configuration

### Security Settings

```yaml
# config/security.yml
security:
  # Encryption settings
  encryption:
    algorithm: "AES-256-GCM"
    key_rotation_interval: 86400
    key_derivation: "PBKDF2"
  
  # Password policies
  password_policy:
    min_length: 8
    require_uppercase: true
    require_lowercase: true
    require_numbers: true
    require_symbols: true
    max_age_days: 90
    history_count: 5
  
  # Audit logging
  audit:
    enabled: true
    log_level: "INFO"
    retention_days: 365
    sensitive_data_masking: true
  
  # Data protection
  data_protection:
    anonymization_enabled: true
    retention_period_days: 2555
    gdpr_compliance: true
    backup_encryption: true
```

## 📊 Monitoring Configuration

### Logging Configuration

```yaml
# config/logging.yml
logging:
  level: "INFO"
  format: "json"
  
  # Log outputs
  outputs:
    - type: "file"
      path: "/var/log/zarish-his/app.log"
      max_size: "100MB"
      max_files: 10
      rotate: "daily"
    
    - type: "console"
      format: "text"
    
    - type: "syslog"
      facility: "local0"
      tag: "zarish-his"
  
  # Log categories
  categories:
    access:
      level: "INFO"
      include_request_body: false
      include_response_body: false
    
    security:
      level: "WARN"
      include_sensitive_data: false
    
    performance:
      level: "DEBUG"
      include_timing: true
```

### Metrics Configuration

```yaml
# config/metrics.yml
metrics:
  enabled: true
  collection_interval: 60
  
  # Prometheus metrics
  prometheus:
    enabled: true
    port: 9090
    path: "/metrics"
  
  # Application metrics
  application:
    response_time:
      enabled: true
      buckets: [0.1, 0.5, 1.0, 2.0, 5.0]
    
    request_count:
      enabled: true
      labels: ["method", "route", "status"]
    
    error_rate:
      enabled: true
      labels: ["error_type", "service"]
    
    active_connections:
      enabled: true
      
  # Database metrics
  database:
    connection_pool:
      enabled: true
      collection_interval: 30
    
    query_performance:
      enabled: true
      slow_query_threshold: 1000
```

## 🏥 Healthcare-Specific Configuration

### Patient Data Configuration

```yaml
# config/patient-data.yml
patient_data:
  # National ID validation
  national_id:
    bangladesh:
      pattern: "^[0-9]{13}$"
      checksum_validation: true
      format_validation: true
    
    # Rohingya refugee IDs
    refugee_ids:
      progress_id:
        pattern: "^PROG[0-9]{9}$"
        validation_service: "unhcr"
      
      mrc_card:
        pattern: "^MRC[0-9]{9}$"
        validation_service: "unhcr"
      
      fcn:
        pattern: "^FCN-[A-Z]{3}-BLOCK-[A-Z]-[0-9]{3}$"
        validation_service: "camp_management"
  
  # Address validation
  address:
    bangladesh:
      divisions:
        - "BD.1"  # Barishal
        - "BD.2"  # Chattogram
        - "BD.3"  # Dhaka
        - "BD.4"  # Khulna
        - "BD.5"  # Mymensingh
        - "BD.6"  # Rajshahi
        - "BD.7"  # Rangpur
        - "BD.8"  # Sylhet
      
      validation:
        require_complete_hierarchy: true
        validate_postal_code: true
        geocoding_enabled: true
    
    refugee_camps:
      supported_camps:
        - "Kutupalong"
        - "Nayapara"
        - "Teknaf"
        - "Ukhiya"
      
      validation:
        require_block_structure: true
        validate_shelter_number: true
        coordinate_validation: true
```

### Medical Records Configuration

```yaml
# config/medical-records.yml
medical_records:
  # FHIR configuration
  fhir:
    version: "R5"
    server_url: "https://fhir.zarish-his.com"
    validation:
      strict_mode: true
      custom_extensions: true
    
    # Bangladesh-specific extensions
    extensions:
      - "patient-nationality"
      - "bmdc-registration"
      - "administrative-boundaries"
      - "camp-information"
  
  # Clinical data validation
  validation:
    vital_signs:
      blood_pressure:
        systolic:
          min: 60
          max: 250
          unit: "mmHg"
        
        diastolic:
          min: 40
          max: 150
          unit: "mmHg"
      
      temperature:
        min: 35.0
        max: 42.0
        unit: "Celsius"
      
      heart_rate:
        min: 40
        max: 200
        unit: "bpm"
  
  # Medication management
  medications:
    formulary:
      bangladesh_essential_medicines: true
      custom_drug_codes: true
      dosage_validation: true
    
    interactions:
      check_drug_interactions: true
      allergy_checking: true
      contraindication_validation: true
```

## 🔧 Development Configuration

### Development Environment

```yaml
# config/development.yml
development:
  # Debug settings
  debug:
    enabled: true
    verbose_logging: true
    stack_traces: true
    profiling: false
  
  # Hot reload
  hot_reload:
    enabled: true
    watch_directories:
      - "./src"
      - "./config"
      - "./templates"
    exclude_patterns:
      - "*.log"
      - "*.tmp"
      - "node_modules/*"
  
  # Testing configuration
  testing:
    test_database: "zarish_his_test"
    mock_external_services: true
    test_data_fixtures: true
    coverage_threshold: 80
  
  # Development tools
  tools:
    api_documentation:
      auto_generate: true
      swagger_ui: true
      redoc: true
    
    database_admin:
      enabled: true
      port: 8081
      path: "/admin"
```

### Production Environment

```yaml
# config/production.yml
production:
  # Performance optimization
  performance:
    caching:
      enabled: true
      redis_cache: true
      memory_cache: true
      cache_ttl: 3600
    
    compression:
      enabled: true
      gzip_level: 6
      min_size: 1024
    
    connection_pooling:
      enabled: true
      max_connections: 100
      timeout: 30
  
  # Security hardening
  security:
    ssl_only: true
    hsts_enabled: true
    csrf_protection: true
    rate_limiting: true
    
    headers:
      x_frame_options: "DENY"
      x_content_type_options: "nosniff"
      x_xss_protection: "1; mode=block"
      strict_transport_security: "max-age=31536000; includeSubDomains"
  
  # Backup and recovery
  backup:
    automated: true
    schedule: "0 2 * * *"
    retention_days: 30
    encryption: true
    offsite_storage: true
```

---

**Configuration Examples Version**: 1.0  
**Last Updated**: January 2026  
**Environment**: Development & Production  
**Compliance**: ZARISH HIS Configuration Standards
