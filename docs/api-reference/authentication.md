---
title: 'Authentication & Authorization'
sidebar_label: 'Authentication'
description: 'Complete guide to ZARISH SPHERE authentication flows, OAuth 2.0 implementation, and API security'
keywords: [authentication, authorization, oauth, jwt, api security, healthcare]
---

# Authentication & Authorization

## Overview

ZARISH SPHERE implements enterprise-grade authentication following healthcare security standards including OAuth 2.0, OpenID Connect, and FHIR authorization frameworks.

## Authentication Methods

### 1. OAuth 2.0 with PKCE

**Recommended for web and mobile applications**

````http
POST /oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE_RECEIVED&
redirect_uri=https://your-app.com/callback&
client_id=YOUR_CLIENT_ID&
code_verifier=CODE_VERIFIER
```text

**Response:**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def50200e3b4...",
  "scope": "patient/*.read observation/*.read"
}
```text

### 2. JWT Bearer Tokens

**For service-to-service authentication**

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwaXouemFyaXNoc3BoZXJlLmNvbSIsInN1YiI6InNlcnZpY2UtYWNjb3VudCIsImF1ZCI6WyJhcGk6enNfaGlzIl0sImV4cCI6MTcwNjI0MjQwMCwiaWF0IjoxNzA2MjM4ODAwLCJzY29wZSI6WyJwYXRpZW50Ki5yZWFkIl19
```text

### 3. Client Credentials Grant

**For backend services and integrations**

```http
POST /oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=SERVICE_CLIENT_ID&
client_secret=SERVICE_CLIENT_SECRET&
scope=system/*.read system/*.write
```text

## Token Structure

### JWT Claims

```json
{
  "iss": "https://api.zarishsphere.com",
  "sub": "user-12345",
  "aud": ["api:zs_his"],
  "exp": 1706242400,
  "iat": 1706238800,
  "jti": "token-unique-id",
  "scope": "patient/*.read observation/*.read",
  "practitioner_id": "practitioner-67890",
  "organization_id": "org-abc123",
  "launch_context": {
    "patient_id": "patient-11111",
    "encounter_id": "encounter-22222"
  }
}
```text

## Scopes and Permissions

### FHIR Scopes

| Scope                  | Description               | Example Resources               |
| ---------------------- | ------------------------- | ------------------------------- |
| `patient/*.read`       | Read all patient data     | Patient, Observation, Condition |
| `patient/*.write`      | Write all patient data    | All resources                   |
| `observation.read`     | Read observations only    | Observation                     |
| `patient/Patient.read` | Read patient demographics | Patient                         |
| `system/*.read`        | System-level read access  | All resources                   |
| `system/*.write`       | System-level write access | All resources                   |

### Healthcare-Specific Scopes

| Scope              | Purpose                  | Use Case           |
| ------------------ | ------------------------ | ------------------ |
| `launch/patient`   | Patient context launch   | EHR integration    |
| `launch/encounter` | Encounter context launch | Clinical workflows |
| `online_access`    | Refresh token capability | Mobile apps        |
| `offline_access`   | Long-term access         | Background sync    |

## API Key Authentication

### For System Integrations

```http
X-API-Key: zs_api_live_abc123def456...
X-API-Secret: zs_secret_xyz789uvw012...
```bash

**Generate API Keys:**

```bash
curl -X POST https://api.zarishsphere.com/v1/api-keys \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "EHR Integration",
    "scopes": ["patient/*.read", "observation.write"],
    "expires_at": "2024-12-31T23:59:59Z"
  }'
```text

## Smart on FHIR Integration

### Authorization Flow

1. **Discovery Endpoint**

```http
GET /.well-known/smart-configuration
```text

1. **Authorization Request**

```http
GET https://auth.zarishsphere.com/oauth2/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  scope=launch/patient patient/*.read&
  redirect_uri=https://app.com/callback&
  state=xyz123&
  aud=https://api.zarishsphere.com/fhir
```text

1. **Token Exchange**

```http
POST https://auth.zarishsphere.com/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
redirect_uri=https://app.com/callback&
client_id=YOUR_CLIENT_ID
```javascript

## Security Best Practices

### 1. Token Management

- Use short-lived access tokens (1 hour)
- Implement refresh token rotation
- Store tokens securely (httpOnly cookies, secure storage)

### 2. PKCE Implementation

```javascript
// Code Verifier Generation
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
```text

### 3. Rate Limiting

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706238800
```text

## Error Handling

### Authentication Errors

| Error                | Description                | Resolution                    |
| -------------------- | -------------------------- | ----------------------------- |
| `invalid_client`     | Invalid client credentials | Check client_id/client_secret |
| `invalid_grant`      | Invalid authorization code | Request new authorization     |
| `expired_token`      | Access token expired       | Use refresh token             |
| `insufficient_scope` | Token lacks required scope | Request additional scopes     |

### Response Format

```json
{
  "error": "invalid_token",
  "error_description": "The access token expired",
  "error_uri": "https://docs.zarishsphere.com/api/authentication#errors"
}
```text

## Session Management

### Refresh Token Flow

```http
POST /oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=REFRESH_TOKEN&
client_id=YOUR_CLIENT_ID
```text

### Token Revocation

```http
POST /oauth2/revoke
Content-Type: application/x-www-form-urlencoded

token=ACCESS_OR_REFRESH_TOKEN&
client_id=YOUR_CLIENT_ID
```typescript

## Integration Examples

### JavaScript/TypeScript

```typescript
class ZSAuth {
  private clientId: string;
  private redirectUri: string;

  async authenticate(): Promise<string> {
    const codeVerifier = this.generateCodeVerifier();
    const authUrl = `https://auth.zarishsphere.com/oauth2/authorize?${new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: 'patient/*.read',
      redirect_uri: this.redirectUri,
      code_challenge: await this.generateCodeChallenge(codeVerifier),
      code_challenge_method: 'S256',
    })}`;

    window.location.href = authUrl;
    return codeVerifier;
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch('https://auth.zarishsphere.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        code_verifier: codeVerifier,
      }),
    });

    return response.json();
  }
}
```javascript

### Python

```python
import requests
from authlib.integrations.requests_client import OAuth2Session

class ZSAuthClient:
    def __init__(self, client_id, client_secret, redirect_uri):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.token_url = "https://auth.zarishsphere.com/oauth2/token"
        self.auth_url = "https://auth.zarishsphere.com/oauth2/authorize"

    def get_authorization_url(self, scope="patient/*.read"):
        oauth = OAuth2Session(
            self.client_id,
            redirect_uri=self.redirect_uri,
            scope=scope
        )
        authorization_url, state = oauth.authorization_url(
            self.auth_url,
            code_challenge_method="S256"
        )
        return authorization_url, state

    def fetch_token(self, authorization_response, code_verifier):
        oauth = OAuth2Session(
            self.client_id,
            redirect_uri=self.redirect_uri
        )
        return oauth.fetch_token(
            self.token_url,
            authorization_response=authorization_response,
            code_verifier=code_verifier,
            client_secret=self.client_secret
        )
```text

## Testing Authentication

### Test Environment

- **Auth URL**: `https://auth-staging.zarishsphere.com/oauth2/authorize`
- **Token URL**: `https://auth-staging.zarishsphere.com/oauth2/token`
- **Test Client ID**: `test_client_zs_his`
- **Test Scopes**: `patient/*.read observation.read`

### Postman Collection

```json
{
  "info": {
    "name": "ZARISH SPHERE Auth",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "oauth2",
    "oauth2": [
      {
        "key": "accessTokenUrl",
        "value": "https://auth.zarishsphere.com/oauth2/token",
        "type": "string"
      },
      {
        "key": "authUrl",
        "value": "https://auth.zarishsphere.com/oauth2/authorize",
        "type": "string"
      }
    ]
  }
}
```text

## Compliance and Standards

### Healthcare Compliance

- **HIPAA Compliant**: All authentication flows meet HIPAA security requirements
- **FHIR R4/R5**: Compatible with FHIR authorization frameworks
- **OAuth 2.0**: RFC 6749 compliant implementation
- **OpenID Connect**: Standard identity layer on OAuth 2.0

### Audit Logging

All authentication events are logged with:

- Timestamp
- User/Service ID
- Client application
- IP address
- Authentication method
- Success/failure status

## Support and Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure redirect URI is registered
2. **Token Expiration**: Implement refresh token logic
3. **Scope Mismatch**: Verify requested scopes match client permissions
4. **PKCE Issues**: Use proper code verifier/challenge generation

### Support Resources

- [Authentication API Reference](./rest-api.md)
- [Error Codes Guide](./errors.md)
- [Community Support](https://github.com/zs-docs/docs-site/discussions)
- [Security Issues](mailto:security@zarishsphere.com)
````
