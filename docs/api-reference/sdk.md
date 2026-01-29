# 🔌 ZARISH SPHERE SDK

## 📋 Overview

The ZARISH SPHERE SDK provides comprehensive client libraries for seamless integration with our healthcare platform APIs. This section covers the official SDKs available for different programming languages and platforms.

## 🚀 Available SDKs

### JavaScript/TypeScript SDK

````bash
npm install @zarishsphere/sdk
```javascript

```typescript
import { ZarishSphereClient } from '@zarishsphere/sdk';

const client = new ZarishSphereClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.zarishsphere.com',
  version: 'v1',
});

// Example: Get patient information
const patient = await client.patients.get('patient-id');
```text

### Python SDK

```bash
pip install zarishsphere-sdk
```javascript

```python
from zarishsphere import ZarishSphereClient

client = ZarishSphereClient(
    api_key='your-api-key',
    base_url='https://api.zarishsphere.com',
    version='v1'
)

## Example: Get patient information
patient = client.patients.get('patient-id')
```text

### Java SDK

```xml
<dependency>
    <groupId>com.zarishsphere</groupId>
    <artifactId>zarishsphere-sdk</artifactId>
    <version>2.0.0</version>
</dependency>
```javascript

```java
import com.zarishsphere.client.ZarishSphereClient;
import com.zarishsphere.model.Patient;

ZarishSphereClient client = new ZarishSphereClient.Builder()
    .apiKey("your-api-key")
    .baseUrl("https://api.zarishsphere.com")
    .version("v1")
    .build();

// Example: Get patient information
Patient patient = client.patients().get("patient-id");
```javascript

## 🔧 SDK Features

### 🔐 Authentication

- Automatic token management
- API key authentication
- OAuth 2.0 support
- JWT token handling

### 📡 API Clients

- Patient management
- Clinical workflows
- FHIR R5 resources
- Analytics and reporting
- Webhook management

### 🔄 Data Handling

- Automatic serialization/deserialization
- Type safety (TypeScript)
- Error handling and retry logic
- Request/response validation

### 📊 Advanced Features

- Caching mechanisms
- Rate limiting
- Bulk operations
- Real-time updates (WebSocket)

## 📚 SDK Documentation

### Quick Start Guides

1. [JavaScript/TypeScript Quick Start](#javascript-typescript-quick-start)
2. [Python Quick Start](#python-quick-start)
3. [Java Quick Start](#java-quick-start)
4. [Other Languages](#other-languages)

### JavaScript/TypeScript Quick Start

```typescript
// Installation
npm install @zarishsphere/sdk

// Basic usage
import { ZarishSphereClient } from '@zarishsphere/sdk';

// Initialize client
const client = new ZarishSphereClient({
  apiKey: process.env.ZARISHSPHERE_API_KEY,
  environment: 'production' // or 'development'
});

// Get all patients
const patients = await client.patients.list({
  limit: 50,
  offset: 0
});

// Create new patient
const newPatient = await client.patients.create({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  contactInfo: {
    email: 'john.doe@example.com',
    phone: '+1234567890'
  }
});

// Handle errors
try {
  const result = await client.patients.get('patient-id');
  console.log('Patient:', result);
} catch (error) {
  if (error instanceof ZarishSphereError) {
    console.error('API Error:', error.message);
    console.error('Error Code:', error.code);
  }
}
```javascript

### Python Quick Start

```python
## Installation
pip install zarishsphere-sdk

## Basic usage
from zarishsphere import ZarishSphereClient
from zarishsphere.exceptions import ZarishSphereError

## Initialize client
client = ZarishSphereClient(
    api_key=os.environ.get('ZARISHSPHERE_API_KEY'),
    environment='production'  # or 'development'
)

## Get all patients
patients = client.patients.list(
    limit=50,
    offset=0
)

## Create new patient
new_patient = client.patients.create({
    'first_name': 'John',
    'last_name': 'Doe',
    'date_of_birth': '1990-01-01',
    'gender': 'male',
    'contact_info': {
        'email': 'john.doe@example.com',
        'phone': '+1234567890'
    }
})

## Handle errors
try:
    result = client.patients.get('patient-id')
    print('Patient:', result)
except ZarishSphereError as e:
    print('API Error:', str(e))
    print('Error Code:', e.code)
```javascript

### Java Quick Start

```java
// Maven dependency
<dependency>
    <groupId>com.zarishsphere</groupId>
    <artifactId>zarishsphere-sdk</artifactId>
    <version>2.0.0</version>
</dependency>

// Basic usage
import com.zarishsphere.client.ZarishSphereClient;
import com.zarishsphere.model.Patient;
import com.zarishsphere.exceptions.ZarishSphereException;

// Initialize client
ZarishSphereClient client = new ZarishSphereClient.Builder()
    .apiKey(System.getenv("ZARISHSPHERE_API_KEY"))
    .environment(Environment.PRODUCTION)
    .build();

// Get all patients
List<Patient> patients = client.patients().list(
    ListOptions.builder()
        .limit(50)
        .offset(0)
        .build()
);

// Create new patient
Patient newPatient = client.patients().create(
    Patient.builder()
        .firstName("John")
        .lastName("Doe")
        .dateOfBirth(LocalDate.of(1990, 1, 1))
        .gender(Gender.MALE)
        .contactInfo(ContactInfo.builder()
            .email("john.doe@example.com")
            .phone("+1234567890")
            .build())
        .build()
);

// Handle errors
try {
    Patient result = client.patients().get("patient-id");
    System.out.println("Patient: " + result);
} catch (ZarishSphereException e) {
    System.err.println("API Error: " + e.getMessage());
    System.err.println("Error Code: " + e.getCode());
}
```text

## 🌐 Other Languages

### Go SDK

```bash
go get github.com/zarishsphere/go-sdk
```text

### Ruby SDK

```bash
gem install zarishsphere-sdk
```text

### PHP SDK

```bash
composer require zarishsphere/sdk
```text

### C#/.NET SDK

```bash
dotnet add package ZarishSphere.SDK
```text

## 🔧 Configuration

### Environment Variables

```bash
## Required
ZARISHSPHERE_API_KEY=your_api_key_here

## Optional
ZARISHSPHERE_BASE_URL=https://api.zarishsphere.com
ZARISHSPHERE_VERSION=v1
ZARISHSPHERE_TIMEOUT=30000
ZARISHSPHERE_RETRY_ATTEMPTS=3
```javascript

### Client Configuration Options

| Option          | Type   | Default                        | Description                                 |
| --------------- | ------ | ------------------------------ | ------------------------------------------- |
| `apiKey`        | string | -                              | Your API key (required)                     |
| `baseUrl`       | string | `https://api.zarishsphere.com` | API base URL                                |
| `version`       | string | `v1`                           | API version                                 |
| `timeout`       | number | `30000`                        | Request timeout in ms                       |
| `retryAttempts` | number | `3`                            | Number of retry attempts                    |
| `environment`   | string | `production`                   | Environment (`production` or `development`) |

## 📖 Examples

### Working with Patients

```typescript
// JavaScript/TypeScript
const patients = await client.patients.list({
  search: 'John',
  limit: 10,
});

const patient = await client.patients.create({
  firstName: 'Jane',
  lastName: 'Smith',
  dateOfBirth: '1985-05-15',
  gender: 'female',
});

await client.patients.update(patient.id, {
  phone: '+1234567890',
});

await client.patients.delete(patient.id);
```javascript

### Working with FHIR Resources

```typescript
// Create FHIR Patient resource
const fhirPatient = await client.fhir.create('Patient', {
  resourceType: 'Patient',
  name: [
    {
      given: ['John'],
      family: 'Doe',
    },
  ],
  birthDate: '1990-01-01',
  gender: 'male',
});

// Search FHIR resources
const searchResults = await client.fhir.search('Patient', {
  name: 'John',
  birthdate: '1990-01-01',
});
```javascript

### Webhooks

```typescript
// Create webhook
const webhook = await client.webhooks.create({
  url: 'https://your-app.com/webhook',
  events: ['patient.created', 'patient.updated'],
  secret: 'your-webhook-secret',
});

// List webhooks
const webhooks = await client.webhooks.list();

// Delete webhook
await client.webhooks.delete(webhook.id);
```text

## 🚨 Error Handling

### Error Types

```typescript
// API errors
try {
  await client.patients.get('invalid-id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Patient not found');
  } else if (error instanceof ValidationError) {
    console.log('Invalid data:', error.details);
  } else if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded');
  }
}

// Network errors
try {
  await client.patients.get('patient-id');
} catch (error) {
  if (error instanceof NetworkError) {
    console.log('Network issue:', error.message);
  }
}
```javascript

## 📚 Advanced Usage

### Custom Headers

```typescript
const client = new ZarishSphereClient({
  apiKey: 'your-api-key',
  customHeaders: {
    'X-Custom-Header': 'custom-value',
    'X-Request-ID': generateRequestId(),
  },
});
```javascript

### Request Interceptors

```typescript
client.addRequestInterceptor((config) => {
  console.log('Making request:', config.method, config.url);
  return config;
});

client.addResponseInterceptor((response) => {
  console.log('Response status:', response.status);
  return response;
});
```javascript

### Caching

```typescript
const client = new ZarishSphereClient({
  apiKey: 'your-api-key',
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    maxSize: 1000,
  },
});
```bash

## 🔗 Links

- [API Reference](./overview.md)
- [Authentication Guide](./authentication.md)
- [Error Handling](./errors.md)
- [Webhook Documentation](./webhook-events.md)
- [FHIR R5 Support](../fhir-r5/overview.md)

### Other Languages

While we currently have official SDKs for JavaScript/TypeScript, Python, and Java, you can use our REST API with any programming language that supports HTTP requests.

### cURL Example

```bash
curl -X GET "https://api.zarishsphere.com/v1/patients" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```text

### Ruby Example

```ruby
require 'net/http'
require 'json'

uri = URI('https://api.zarishsphere.com/v1/patients')
http = Net::HTTP.new(uri)
request = Net::HTTP::Get.new(uri)
request['Authorization'] = "Bearer #{ENV['ZARISHSPHERE_API_KEY']}"
request['Content-Type'] = 'application/json'

response = http.request(request)
patients = JSON.parse(response.body)
```text

### PHP Example

```php
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.zarishsphere.com/v1/patients');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . getenv('ZARISHSPHERE_API_KEY'),
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$patients = json_decode($response, true);
curl_close($ch);
?>
```text

For community-maintained SDKs in other languages, check our GitHub organization or contribute to the community!

## 🆘 Support

- 📧 **Email**: [sdk-support@zarishsphere.com](mailto:sdk-support@zarishsphere.com)
- 📖 **Documentation**: [docs.zarishsphere.com](https://docs.zarishsphere.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/zarishsphere/sdk/issues)

---

**🏥 Built for healthcare developers by ZARISH SPHERE**
````
