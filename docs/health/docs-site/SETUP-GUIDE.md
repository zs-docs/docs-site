# ZARISH HIS Documentation Setup Guide

## 🚀 Quick Start

This guide helps you get started with ZARISH HIS documentation and API specifications.

### Prerequisites

- Git installed
- Node.js 16+ (for local development)
- Basic understanding of REST APIs

### 1. Clone Repository

```bash
git clone https://github.com/zs-his/docs.git
cd docs
```

### 2. Local Development Setup

#### API Mock Server (Optional)

```bash
# Install Prism for API mocking
npm install -g @stoplight/prism-cli

# Start mock servers
prism mock 04-api-specifications/gateway-api.yaml &

```bash
# Install MkDocs for local preview
pip install mkdocs mkdocs-material

# Serve documentation locally
mkdocs serve
```

### 3. Repository Structure

```
docs/
├── 00-core-architecture/          # System architecture
├── 01-standards/                  # Development standards
├── 02-microservices/             # Service documentation
├── 03-microfrontends/            # Frontend documentation
├── 04-api-specifications/        # OpenAPI specs
├── 05-metadata-forms/            # FHIR resources
├── 06-infrastructure/            # Deployment guides
├── 07-regulatory-compliance/     # Compliance docs
├── scripts/                      # Automation scripts
└── .github/workflows/           # CI/CD workflows
```

### 4. Contributing

#### Adding New Documentation

1. Navigate to appropriate directory
2. Create or edit markdown files
3. Follow naming conventions (`kebab-case`)
4. Commit changes - validation runs automatically

#### API Specification Updates

1. Edit YAML files in `04-api-specifications/`
2. Validate with Spectral (runs in CI)
3. Test with Prism locally

### 5. Automation Features

- **Link Validation**: Automatically checks for broken links
- **Markdown Linting**: Ensures consistent formatting
- **API Validation**: Validates OpenAPI specifications
- **Documentation Generation**: Creates interactive API docs

### 6. URLs and Access

- **GitHub Repository**: https://github.com/zs-his/docs
- **Interactive API Docs**: https://zs-his.github.io/docs/docs-generated/
- **Main Documentation**: https://zs-his.github.io/docs/

### 7. Troubleshooting

#### Common Issues

- **Build Failures**: Check markdown syntax and links
- **API Validation Errors**: Verify OpenAPI syntax
- **Missing Files**: Ensure directory structure is maintained

#### Getting Help

1. Check GitHub Issues
2. Review existing documentation
3. Run validation scripts locally

---

_For detailed API documentation, see [04-api-specifications/MOCK-SERVER-SETUP.md](./04-api-specifications/MOCK-SERVER-SETUP.md)_
