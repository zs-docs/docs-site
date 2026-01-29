# Getting Started with ZARISH HIS

Welcome to the ZARISH Health Information System documentation! This guide will help you understand the system architecture and get started quickly.

## 🎯 Overview

ZARISH HIS is a **modular, FHIR R5-compliant** Health Information System designed specifically for Bangladesh healthcare context. It consists of:

- **58+ repositories** across frontend, backend, and infrastructure
- **80+ frontend packages** in 15 monorepos
- **25 microservices** handling clinical, administrative, and infrastructure functions
- **200+ clinical forms** following FHIR standards
- **Complete Bangladesh contextualization** with local terminology and regulations

## 🏗️ System Architecture

The ZARISH HIS follows a **microservices architecture** with:

### Frontend Layer
- **esm-core**: Core framework and shared components
- **Domain-specific monorepos**: Patient management, clinical charts, forms engine, etc.
- **Mobile-first responsive design** with progressive web app capabilities

### Backend Layer
- **API Gateway**: Centralized routing, authentication, and rate limiting
- **Core Services**: Patient, practitioner, organization, encounter management
- **Clinical Services**: Observations, conditions, medications, procedures
- **Ancillary Services**: Laboratory, radiology, pharmacy, blood bank
- **Administrative Services**: Appointments, billing, inventory, bed management
- **Infrastructure Services**: Auth, notifications, audit, integration, reporting

### Data Layer
- **PostgreSQL**: Primary clinical data storage
- **Redis**: Caching and session management
- **FHIR R5**: Standardized healthcare data exchange
- **Bangladesh Extensions**: Local terminology and regulations

## 🚀 Quick Start

### For Developers

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zs-his/docs.git
   cd docs
   ```

2. **Set up local development**:
   ```bash
   # Install dependencies
   pip install mkdocs-material
   
   # Start local server
   mkdocs serve
   ```

3. **Explore the documentation**:
   - Visit `http://127.0.0.1:8000`
   - Browse frontend monorepos in the [Frontend section](../frontend/)
   - Review microservices in the [Backend section](../backend/)

### For Healthcare Providers

1. **Review clinical workflows** in the [Guides section](../guides/)
2. **Understand FHIR profiles** in the [FHIR section](../fhir/)
3. **Check compliance documentation** in the [Compliance section](../compliance/)

### For System Administrators

1. **Review deployment guide** in [Infrastructure](../guides/deployment-guide.md)
2. **Check security requirements** in [Compliance](../compliance/)
3. **Review monitoring setup** in [Architecture](../architecture/)

## 📚 Next Steps

- **Frontend Developers**: Start with [Frontend Overview](../frontend/overview.md)
- **Backend Developers**: Start with [Backend Overview](../backend/overview.md)
- **Clinical Implementers**: Start with [FHIR Overview](../fhir/overview.md)
- **System Administrators**: Start with [Deployment Guide](../guides/deployment-guide.md)

## 🔗 Key Resources

- **Repository Index**: [REPOSITORY-INDEX.md](../../REPOSITORY-INDEX.md)
- **Dependency Graph**: [DEPENDENCY-GRAPH.md](../../DEPENDENCY-GRAPH.md)
- **Project Progress**: [Progress](../project/progress.md)
- **Contribution Guidelines**: [Contribution](../project/contribution.md)

## 📞 Support

- **GitHub Issues**: [Report issues](https://github.com/zs-his/docs/issues)
- **Documentation**: [Full documentation](https://zs-his.github.io/docs/)
- **API Documentation**: [Interactive API docs](https://zs-his.github.io/docs/docs-generated/)

---

*Last updated: 2026-01-21*
