# Quick Start Guide

This guide helps you get up and running with ZARISH HIS quickly, whether you're a developer, healthcare provider, or system administrator.

## 🚀 For Developers

### Prerequisites
- **Node.js 18+** and **npm** for frontend development
- **Golang 1.25.x** for backend development
- **Docker** and **Docker Compose** for local development
- **Git** for version control

### 1. Setup Development Environment

```bash
# Clone the documentation repository
git clone https://github.com/zs-his/docs.git
cd docs

# Clone individual repositories you want to work on
# Example: Patient Registry microservice
git clone https://github.com/zs-his/ms-patient-registry.git ../ms-patient-registry

# Example: Patient Management frontend
git clone https://github.com/zs-his/esm-patient-management.git ../esm-patient-management
```

### 2. Local Development Setup

#### Backend Services
```bash
# Navigate to microservice
cd ../ms-patient-registry

# Install dependencies
go mod download

# Run database migrations
go run cmd/migrate/main.go up

# Start the service
go run cmd/server/main.go

# Service will be available at http://localhost:8080
```

#### Frontend Applications
```bash
# Navigate to frontend monorepo
cd ../esm-patient-management

# Install dependencies
npm install

# Start development server
npm run dev

# Application will be available at http://localhost:3000
```

### 3. Docker Development (Recommended)

```bash
# Start all services with Docker Compose
docker-compose up -d

# This starts:
# - PostgreSQL database
# - Redis cache
# - API Gateway
# - All microservices
# - Frontend applications

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. API Testing

```bash
# Get authentication token
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Use token to access APIs
curl -X GET http://localhost:8080/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN"

# View API documentation
open http://localhost:8080/docs
```

## 🏥 For Healthcare Providers

### 1. Access the System

1. **Open browser** and navigate to your ZARISH HIS instance
2. **Login** with your credentials
3. **Complete profile** if first-time user

### 2. Patient Registration

1. **Navigate to Patient Management**
2. **Click "New Patient"**
3. **Fill in required information**:
   - Personal details (name, NID, date of birth)
   - Contact information (phone, email)
   - Emergency contact
4. **Save** to generate MRN (Medical Record Number)

### 3. Clinical Workflow

1. **Patient Search**: Find existing patient by MRN or name
2. **Start Encounter**: Create new clinical visit
3. **Add Observations**: Record vitals, symptoms, complaints
4. **Order Tests**: Laboratory, radiology, or other diagnostics
5. **Prescribe Medications**: Add to patient record
6. **Complete Encounter**: Finalize visit and generate summary

### 4. Common Tasks

#### Patient Management
- **Search patients**: Use search bar or advanced filters
- **View history**: Access previous visits and records
- **Update information**: Edit patient demographics
- **Print records**: Generate PDF summaries

#### Clinical Documentation
- **Progress notes**: Add narrative documentation
- **Vitals entry**: Record blood pressure, temperature, etc.
- **Medication management**: Prescribe and track medications
- **Test ordering**: Request laboratory and radiology tests

#### Billing and Administration
- **Service billing**: Generate invoices for services
- **Insurance claims**: Submit to insurance providers
- **Inventory management**: Track supplies and medications
- **Reporting**: Generate clinical and administrative reports

## 🔧 For System Administrators

### 1. System Setup

#### Database Configuration
```bash
# PostgreSQL setup
sudo -u postgres createuser zarish
sudo -u postgres createdb zarish_his
psql -U postgres -d zarish_his -c "ALTER USER zarish PASSWORD 'secure_password';"

# Redis setup
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Application Deployment
```bash
# Deploy with Docker (Recommended)
docker-compose -f docker-compose.prod.yml up -d

# Or manual deployment
# 1. Build applications
./scripts/build-all.sh

# 2. Deploy to servers
./scripts/deploy.sh

# 3. Run database migrations
./scripts/migrate.sh
```

### 2. Configuration

#### Environment Variables
```bash
# Create .env file
cat > .env << EOF
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zarish_his
DB_USER=zarish
DB_PASSWORD=secure_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=24h

# FHIR
FHIR_SERVER_URL=http://localhost:8080/fhir
FHIR_VERSION=R5

# External Integrations
DGHS_API_URL=https://api.dghs.gov.bd
INSURANCE_GATEWAY_URL=https://api.insurance-bd.com
EOF
```

### 3. Monitoring and Maintenance

#### Health Checks
```bash
# Check all services
curl http://localhost:8080/health

# Database connectivity
psql -U zarish -d zarish_his -c "SELECT 1;"

# Redis connectivity
redis-cli ping

# View logs
tail -f /var/log/zarish-his/*.log
```

#### Backup Procedures
```bash
# Database backup
pg_dump -U zarish zarish_his > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz /opt/zarish-his/

# Automated backup (add to crontab)
0 2 * * * /opt/zarish-his/scripts/backup.sh
```

## 📚 Learning Resources

### Documentation
- **Full Documentation**: https://zs-his.github.io/docs/
- **API Reference**: https://zs-his.github.io/docs/docs-generated/
- **FHIR Profiles**: https://zs-his.github.io/docs/fhir/profiles/

### Training Materials
- **Video Tutorials**: Available in internal training portal
- **User Manuals**: Department-specific guides
- **Best Practices**: Clinical workflow optimization

### Support Channels
- **Help Desk**: help@zarish-his.com
- **Technical Support**: support@zarish-his.com
- **Clinical Support**: clinical@zarish-his.com
- **Emergency Support**: emergency@zarish-his.com

## 🔍 Troubleshooting

### Common Issues

#### Login Problems
- **Check credentials**: Verify username and password
- **Clear cache**: Clear browser cache and cookies
- **Check account**: Verify account is active and not locked

#### Performance Issues
- **Check network**: Verify internet connectivity
- **Clear cache**: Clear application cache
- **Restart browser**: Close and reopen browser

#### Data Issues
- **Refresh page**: Reload to get latest data
- **Check permissions**: Verify user has required access
- **Contact admin**: Report data inconsistencies

### Getting Help

1. **Check documentation**: Search relevant guides
2. **Review logs**: Check error messages
3. **Contact support**: Use appropriate support channel
4. **Report issues**: Create GitHub issues for bugs

---

*Need more help? Check our comprehensive [documentation](https://zs-his.github.io/docs/) or contact our support team.*

*Last updated: 2026-01-21*
