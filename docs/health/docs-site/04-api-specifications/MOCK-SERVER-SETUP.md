# ZARISH HIS API Mock Server Setup Guide

This guide demonstrates how to run ZARISH HIS APIs locally using Stoplight Prism for development and testing.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Git repository cloned locally

### Step 1: Install Prism
```bash
npm install -g @stoplight/prism-cli
```

### Step 2: Start Mock Server
```bash
# Clone the repository
git clone https://github.com/zs-his/docs.git
cd docs

# Start Gateway API mock server
prism mock 04-api-specifications/gateway-api.yaml

# In another terminal, start Patient Registry API mock server
prism mock 04-api-specifications/patient-registry-api.yaml -p 4010
```

### Step 3: Test the APIs
Gateway API will be available at: http://localhost:4010
Patient Registry API will be available at: http://localhost:4010

## 📋 Available Endpoints

### Gateway API (http://localhost:4010)
- `GET /health` - Health check
- Additional endpoints as defined in gateway-api.yaml

### Patient Registry API (http://localhost:4010)
- `GET /patient-registry/patients` - List patients
- `POST /patient-registry/patients` - Create patient
- `GET /patient-registry/patients/{id}` - Get specific patient
- Additional FHIR R5 compliant endpoints

## 🔧 Advanced Configuration

### Custom Responses
Prism can return custom responses based on examples in your OpenAPI files:

```yaml
# In your API YAML file
paths:
  /patient-registry/patients:
    get:
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              examples:
                # Example response that Prism will return
                value:
                  resourceType: "Bundle"
                  id: "example-bundle"
                  type: "searchset"
                  total: 1
                  entry:
                    - resource:
                        resourceType: "Patient"
                        id: "example-patient-001"
                        name:
                          - use: "official"
                            family: "Zarish"
                            given: "Test"
```

### Dynamic Responses with JavaScript
For more complex mocking, create a `__mocks__` directory:

```javascript
// __mocks__/patient-registry/patients/get.js
module.exports = {
  // Custom logic for generating patient data
  request: {
    method: 'GET',
    url: 'http://localhost:4010/patient-registry/patients'
  },
  response: {
    status: 200,
    headers: {
      'Content-Type': 'application/fhir+json'
    },
    body: {
      resourceType: 'Bundle',
      type: 'searchset',
      total: 2,
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: 'patient-001',
            name: [{ use: 'official', family: 'Zarish', given: 'Ahmed' }],
            gender: 'male',
            birthDate: '1990-01-01'
          }
        },
        {
          resource: {
            resourceType: 'Patient',
            id: 'patient-002', 
            name: [{ use: 'official', family: 'Fatema', given: 'Begum' }],
            gender: 'female',
            birthDate: '1985-05-15'
          }
        }
      ]
    }
  }
};
```

## 🧪 Development Workflow

### 1. API Development
- Modify OpenAPI YAML files in `04-api-specifications/`
- Test changes locally with Prism
- Commit changes to trigger validation

### 2. Frontend Integration
```javascript
// Example frontend integration
const API_BASE_URL = 'http://localhost:4010';

async function fetchPatients() {
  const response = await fetch(`${API_BASE_URL}/patient-registry/patients`);
  const bundle = await response.json();
  return bundle.entry.map(entry => entry.resource);
}
```

### 3. Validation
```bash
# Run Spectral validation locally
npm install -g @stoplight/spectral-cli
spectral lint 04-api-specifications/gateway-api.yaml
spectral lint 04-api-specifications/patient-registry-api.yaml
```

## 🌐 Deployment Options

### Local Development
- Prism for mocking (recommended)
- Docker Compose for multi-service setup

### Staging
- GitHub Pages provides interactive documentation
- APIs can be tested against zs-his.github.io/docs

### Production
- Planned: api.zarishsphere.com
- Requires domain acquisition and hosting setup

## 📞 Support

For issues with mock servers or API specifications:
1. Check the [GitHub Issues](https://github.com/zs-his/docs/issues)
2. Review [API Validation](../API-STANDARDS-VALIDATION.md)
3. Consult [FHIR R5 Standards](../01-standards/fhir-r5-naming.md)

## 🔗 Related Resources

- [ZARISH HIS Architecture](../00-core-architecture/)
- [FHIR R5 Implementation Guide](../05-metadata-forms/README-zarish-adaptation.md)
- [API Standards](../01-standards/api-naming-standards.md)
