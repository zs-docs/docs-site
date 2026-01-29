---
title: 'Search Operations'
sidebar_label: 'Search Operations'
description: 'Comprehensive guide to FHIR R5 search operations in ZARISH SPHERE with country-specific optimizations'
keywords:
  [search operations, fhir r5, queries, healthcare, zarish sphere, bangladesh, thailand, myanmar]
---

# FHIR R5 Search Operations

## Overview

ZARISH SPHERE provides comprehensive FHIR R5 search capabilities optimized for healthcare scenarios across Bangladesh, Thailand, and Myanmar. This guide covers basic and advanced search patterns, country-specific parameters, and performance optimization strategies.

## Basic Search Operations

### Simple Search

````http
GET /fhir/Patient?family=Smith
GET /fhir/Observation?subject=Patient/123
GET /fhir/Medication?code=ASPIRIN
GET /fhir/Encounter?patient=Patient/456&status=finished
```http

### Chained Parameters

```http
GET /fhir/Patient?family=Rahman&given=Mohammad&gender=male
GET /fhir/Observation?subject=Patient/123&category=vital-signs&date=ge2026-01-01
GET /fhir/Medication?status=active&form=tablet
```http

## Country-Specific Search Parameters

### Bangladesh Search Parameters

### National ID Search

```http
GET /fhir/Patient?identifier=199012345678901
GET /fhir/Patient?identifier=BANGLADESH_NID|199012345678901
```json

### Health Card Search

```http
GET /fhir/Patient?identifier=HC-123456789
GET /fhir/Patient?identifier=HEALTH_CARD|HC-123456789
```json

### District-Based Search

```http
GET /fhir/Patient?address-district=Dhanmondi
GET /fhir/Patient?address-city=Dhaka
GET /fhir/Patient?address-state=Dhaka%20Division
```json

### Bengali Name Search

```http
GET /fhir/Patient?family:contains=রহিম
GET /fhir/Patient?given:contains=মোহাম্মদ
```json

### Thailand Search Parameters

### Thai National ID Search

```http
GET /fhir/Patient?identifier=1234567890123
GET /fhir/Patient?identifier=THAI_NATIONAL_ID|1234567890123
```json

### Universal Coverage Search

```http
GET /fhir/Patient?identifier=UCS-123456789
GET /fhir/Patient?identifier=UCS_ID|UCS-123456789
```json

### Province-Based Search

```http
GET /fhir/Patient?address-province=กรุงเทพมหานคร
GET /fhir/Patient?address-district=คลองเตย
```json

### Thai Name Search

```http
GET /fhir/Patient?family:contains=ใจดี
GET /fhir/Patient?given:contains=สมชาย
```json

### Myanmar Search Parameters

### NRC Search

```http
GET /fhir/Patient?identifier=12/ABC(N)123456
GET /fhir/Patient?identifier=MYANMAR_NRC|12/ABC(N)123456
```json

### Social Security Search

```http
GET /fhir/Patient?identifier=SSB-123456789
GET /fhir/Patient?identifier=SSB_ID|SSB-123456789
```json

### Region-Based Search

```http
GET /fhir/Patient?address-state=Yangon%20Region
GET /fhir/Patient?address-district=Kamayut
```json

### Myanmar Name Search

```http
GET /fhir/Patient?family:contains=အောင်ဆက်
GET /fhir/Patient?given:contains=မောင်
```json

## Advanced Search Operations

### Date Range Searches

```http
GET /fhir/Encounter?date=ge2026-01-01&date=le2026-01-31
GET /fhir/Observation?date=ge2026-01-26T00:00:00Z&date=le2026-01-26T23:59:59Z
```json

### Numeric Range Searches

```http
GET /fhir/Observation?value-quantity=ge120&value-quantity=le180
GET /fhir/Observation?value-quantity=ap90
```json

### Token-Based Searches

```http
GET /fhir/Condition?code:system=http://hl7.org/fhir/sid/icd-10&code=I10
GET /fhir/Medication?code:system=http://www.nlm.nih.gov/research&code=ASPIRIN
```json

### Reference Searches

```http
GET /fhir/Encounter?subject:Patient/123
GET /fhir/Observation?encounter=Encounter/456
GET /fhir/MedicationRequest?subject:Patient/123&status=active
```json

## Custom Search Parameters

### ZARISH SPHERE Extensions

### Patient Age Search

```http
GET /fhir/Patient?_age=25
GET /fhir/Patient?_age=ge18&age=le65
GET /fhir/Patient?_age=gt65
```json

### Last Updated Search

```http
GET /fhir/Patient?_lastUpdated=ge2026-01-01
GET /fhir/Patient?_lastUpdated=ge2026-01-01T00:00:00Z
```json

### Facility-Based Search

```http
GET /fhir/Patient?_facility=hospital-123
GET /fhir/Patient?_facility=clinic-456
```json

### Insurance Coverage Search

```http
GET /fhir/Patient?_insurance=UCS
GET /fhir/Patient?_insurance=SSB
```json

## Search Result Bundles

### Bundle Structure

```json
{
  "resourceType": "Bundle",
  "id": "bundle-12345",
  "type": "searchset",
  "total": 25,
  "link": [
    {
      "relation": "self",
      "url": "/fhir/Patient?family=Rahman&_count=10&_page=1"
    },
    {
      "relation": "next",
      "url": "/fhir/Patient?family=Rahman&_count=10&_page=2"
    }
  ],
  "entry": [
    {
      "fullUrl": "https://api.zarishsphere.com/fhir/Patient/patient-123",
      "resource": {
        "resourceType": "Patient",
        "id": "patient-123",
        "name": [
          {
            "use": "official",
            "family": "Rahman",
            "given": ["Mohammad"]
          }
        ]
      }
    }
  ]
}
```json

### Pagination

```http
GET /fhir/Patient?family=Rahman&_count=10&_page=1
GET /fhir/Patient?family=Rahman&_count=10&_page=2
GET /fhir/Patient?family=Rahman&_count=10&_sort=_lastUpdated
```json

## Performance Optimization

### Indexing Strategy

- **Patient Name**: Composite index on family + given names
- **National ID**: Country-specific indexed searches
- **Birth Date**: Indexed for age-based queries
- **Address**: Geospatial indexing for location searches
- **Facility**: Indexed for facility-based searches

### Caching Strategy

- **Search Results**: Cache for 5 minutes
- **Frequently Used Queries**: Cache for 15 minutes
- **Country-Specific Rules**: Cache for 30 minutes

### Query Optimization

```http
GET /fhir/Patient?family=Rahman&_sort=_score&_count=20
GET /fhir/Patient?family=Rahman&_sort=given&_count=20
GET /fhir/Patient?family=Rahman&_sort=birthdate&_count=20
```javascript

## Implementation Examples

### JavaScript Client

```javascript
// Search patients by name and country
async function searchPatients(searchParams) {
  const baseUrl = 'https://api.zarishsphere.com/fhir';
  const params = new URLSearchParams(searchParams);

  // Add country-specific parameters
  if (searchParams.country === 'BD') {
    params.append('_include', 'Patient:identifier');
  }

  const response = await fetch(`${baseUrl}/Patient?${params}`);
  const bundle = await response.json();

  return bundle.entry.map((entry) => entry.resource);
}

// Search with pagination
async function searchPatientsWithPagination(searchParams, page = 1, count = 20) {
  const params = new URLSearchParams(searchParams);
  params.append('_page', page.toString());
  params.append('_count', count.toString());

  const response = await fetch(`/fhir/Patient?${params}`);
  return await response.json();
}
```javascript

### Python Client

```python
import requests

def search_patients(base_url, search_params):
    """Search patients with country-specific parameters"""
    params = search_params.copy()

    # Add country-specific headers
    headers = {
        'Accept': 'application/fhir+json',
        'X-Country': search_params.get('country', 'BD')
    }

    response = requests.get(f"{base_url}/Patient", params=params, headers=headers)
    return response.json()

def paginated_search(base_url, search_params, page=1, count=20):
    """Paginated search with automatic next page handling"""
    all_results = []
    current_page = page

    while True:
        params = search_params.copy()
        params['_page'] = current_page
        params['_count'] = count

        response = search_patients(base_url, params)
        all_results.extend(response.get('entry', []))

        if len(all_results) >= response.get('total', 0):
            break

        current_page += 1

    return all_results
```javascript

## Testing Search Operations

### Unit Tests

```javascript
describe('Patient Search Operations', () => {
  test('should search by Bangladesh National ID', async () => {
    const response = await searchPatients({
      identifier: 'BANGLADESH_NID|199012345678901',
      country: 'BD',
    });

    expect(response).toHaveLength(1);
    expect(response[0].identifier).toContain(
      expect.objectContaining({
        system: 'http://nid.gov.bd',
        value: '199012345678901',
      })
    );
  });

  test('should search by Thai name', async () => {
    const response = await searchPatients({
      family: 'ใจดี',
      country: 'TH',
    });

    expect(response.length).toBeGreaterThan(0);
  });
});
```json

### Integration Tests

```gherkin
Feature: Patient Search Operations
  Scenario: Search patients by country-specific identifiers
    Given the FHIR server is running
    When searching for patients by Bangladesh National ID
      | identifier | country |
      | 199012345678901 | BD |
    Then the system should return matching patients
    And the response should include the NID identifier

  Scenario: Search patients with pagination
    Given 50 patients exist in the system
    When searching with count=10 and page=1
    Then the system should return 10 patients
    And the bundle should include a next link

  Scenario: Search patients with sorting
    Given patients with different birth dates
    When searching with sort=birthdate
    Then the results should be sorted by birth date
    And the oldest patient should appear first
```javascript

## Monitoring and Analytics

### Search Performance Metrics

- **Query Response Time**: < 500ms for simple searches
- **Complex Query Time**: < 2 seconds for multi-parameter searches
- **Cache Hit Rate**: > 80% for frequently used queries
- **Index Utilization**: Monitor index usage patterns

### Search Analytics

```javascript
// Track search patterns
const searchAnalytics = {
  totalSearches: 0,
  countryBreakdown: {
    BD: 0,
    TH: 0,
    MM: 0,
  },
  popularQueries: {},
  averageResponseTime: 0,
};

function trackSearch(searchParams, responseTime) {
  searchAnalytics.totalSearches++;
  searchAnalytics.averageResponseTime = (searchAnalytics.averageResponseTime + responseTime) / 2;

  const country = searchParams.country || 'BD';
  searchAnalytics.countryBreakdown[country]++;

  const query = JSON.stringify(searchParams);
  searchAnalytics.popularQueries[query] = (searchAnalytics.popularQueries[query] || 0) + 1;
}
```javascript

## Troubleshooting

### Common Issues

**Problem**: Search returns no results
**Solution**:

- Check parameter formatting
- Verify resource exists
- Check indexing status

**Problem**: Slow search performance
**Solution**:

- Add appropriate indexes
- Optimize query parameters
- Implement caching

**Problem**: Invalid search parameters
**Solution**:

- Validate parameters before sending
- Check FHIR specification
- Use proper URL encoding

### Debug Tools

```javascript
// Enable search debugging
const debugParams = {
  _debug: true,
  _format: 'json',
};

// Validate search parameters
function validateSearchParams(params) {
  const validParams = ['family', 'given', 'identifier', 'gender', 'birthDate'];
  return Object.keys(params).every((key) => validParams.includes(key));
}
```javascript

## Related Links

- [Patient Resource](./patient.md)
- [Practitioner Resource](./practitioner.md)
- [Encounter Resource](./encounter.md)
- [Observation Resource](./observation.md)
- [Medication Resource](./medication.md)
- [Custom Operations](./custom-operations.md)
- [Country Configurations](./country-configs/)

---

**Last Updated**: 2026-01-26
**Version**: 2.0.0
**Operation**: Search
**Standard**: FHIR R5
GET /fhir/r5/Condition?patient=Patient/456&clinical-status=active

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 1,
  "entry": [
    {
      "resource": {
        "resourceType": "Condition",
        "id": "condition-123",
        "clinicalStatus": "active"
      }
    }
  ]
}
```json

| Parameter      | Type      | Description            | Example                           |
| -------------- | --------- | ---------------------- | --------------------------------- |
| `_id`          | token     | Resource ID            | `Patient/123`                     |
| `_lastUpdated` | date      | Last updated timestamp | `ge2023-12-01`                    |
| `_tag`         | token     | Resource tags          | `security=tag`                    |
| `_profile`     | uri       | Resource profile       | `StructureDefinition/patient`     |
| `_security`    | token     | Security labels        | `security=confidential`           |
| `_text`        | string    | Text search            | `contains:fever`                  |
| `_content`     | string    | Content search         | `contains:diabetes`               |
| `_list`        | reference | List-based search      | `List/123`                        |
| `_has`         | composite | Has relationship       | `Observation:patient:Patient/456` |

## Resource-Specific Search

### Patient Search

```javascript
// Search patients by name and displacement status
async function searchPatients(searchParams) {
  const params = new URLSearchParams();

  if (searchParams.name) {
    params.append('name', searchParams.name);
  }

  if (searchParams.birthDate) {
    params.append('birthDate', searchParams.birthDate);
  }

  if (searchParams.gender) {
    params.append('gender', searchParams.gender);
  }

  // Custom humanitarian parameters
  if (searchParams.displacementStatus) {
    params.append('displacement-status', searchParams.displacementStatus);
  }

  if (searchParams.campLocation) {
    params.append('camp-location', searchParams.campLocation);
  }

  if (searchParams.vulnerablePopulation) {
    params.append('vulnerable-population', searchParams.vulnerablePopulation);
  }

  const response = await fetch(`/fhir/r5/Patient?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  });

  return response.json();
}

// Example usage
const patients = await searchPatients({
  name: 'Smith',
  displacementStatus: 'refugee',
  campLocation: 'Camp A',
  vulnerablePopulation: 'true',
});
```json

### Advanced Patient Search

```javascript
// Complex patient search with multiple criteria
async function advancedPatientSearch(criteria) {
  const searchRequest = {
    resourceType: 'Bundle',
    type: 'searchset',
    entry: [],
  };

  // Build search parameters
  const params = new URLSearchParams();

  // Basic demographics
  if (criteria.name) {
    params.append('name', criteria.name);
  }

  if (criteria.family) {
    params.append('family', criteria.family);
  }

  if (criteria.given) {
    params.append('given', criteria.given);
  }

  // Date ranges
  if (criteria.birthDateRange) {
    params.append('birth-date', `ge${criteria.birthDateRange.start}`);
    params.append('birth-date', `le${criteria.birthDateRange.end}`);
  }

  // Humanitarian context
  if (criteria.displacementStatus) {
    params.append('displacement-status', criteria.displacementStatus);
  }

  if (criteria.originalLocation) {
    params.append('original-location', criteria.originalLocation);
  }

  if (criteria.displacementDateRange) {
    params.append('displacement-date', `ge${criteria.displacementDateRange.start}`);
    params.append('displacement-date', `le${criteria.displacementDateRange.end}`);
  }

  // Geographic search
  if (criteria.geographicArea) {
    params.append('geographic-area', criteria.geographicArea);
  }

  // Vulnerable populations
  if (criteria.vulnerableTypes) {
    criteria.vulnerableTypes.forEach((type) => {
      params.append('vulnerable-type', type);
    });
  }

  // Add sorting and pagination
  if (criteria.sortBy) {
    params.append('_sort', criteria.sortBy);
  }

  if (criteria.count) {
    params.append('_count', criteria.count);
  }

  if (criteria.page) {
    params.append('_page', criteria.page);
  }

  const response = await fetch(`/fhir/r5/Patient?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  });

  return response.json();
}
```javascript

### Observation Search

```javascript
// Search observations with clinical and humanitarian context
async function searchObservations(searchParams) {
  const params = new URLSearchParams();

  // Patient context
  if (searchParams.patientId) {
    params.append('subject', `Patient/${searchParams.patientId}`);
  }

  // Clinical parameters
  if (searchParams.category) {
    params.append('category', searchParams.category);
  }

  if (searchParams.code) {
    params.append('code', searchParams.code);
  }

  if (searchParams.valueQuantity) {
    params.append('value-quantity', searchParams.valueQuantity);
  }

  // Date ranges
  if (searchParams.dateRange) {
    params.append('date', `ge${searchParams.dateRange.start}`);
    params.append('date', `le${searchParams.dateRange.end}`);
  }

  // Screening context
  if (searchParams.screeningType) {
    params.append('screening-type', searchParams.screeningType);
  }

  if (searchParams.screeningLocation) {
    params.append('screening-location', searchParams.screeningLocation);
  }

  // Environmental context
  if (searchParams.environmentalConditions) {
    params.append('environmental-conditions', searchParams.environmentalConditions);
  }

  // Point of care testing
  if (searchParams.pointOfCareTesting) {
    params.append('point-of-care-testing', searchParams.pointOfCareTesting);
  }

  // Low resource optimizations
  if (searchParams.lowResourceOptimizations) {
    params.append('low-resource-optimizations', searchParams.lowResourceOptimizations);
  }

  const response = await fetch(`/fhir/r5/Observation?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  });

  return response.json();
}
```javascript

## Custom Search Parameters

### Humanitarian Context Parameters

```javascript
// Custom search parameter definitions
const humanitarianSearchParameters = [
  {
    name: 'displacement-status',
    type: 'token',
    description: 'Search by displacement status',
    resource: 'Patient',
    xpath:
      "f:extension[@url='https://zarishsphere.com/fhir/StructureDefinition/humanitarian-context']/f:extension[@url='displacementStatus']/f:valueCodeableConcept",
  },
  {
    name: 'camp-location',
    type: 'string',
    description: 'Search by camp location',
    resource: 'Patient',
    xpath:
      "f:extension[@url='https://zarishsphere.com/fhir/StructureDefinition/humanitarian-context']/f:extension[@url='campLocation']/f:valueString",
  },
  {
    name: 'original-location',
    type: 'string',
    description: 'Search by original location',
    resource: 'Patient',
    xpath:
      "f:extension[@url='https://zarishsphere.com/fhir/StructureDefinition/humanitarian-context']/f:extension[@url='originalLocation']/f:valueString",
  },
  {
    name: 'vulnerable-population',
    type: 'token',
    description: 'Search vulnerable populations',
    resource: 'Patient',
    xpath:
      "f:extension[@url='https://zarishsphere.com/fhir/StructureDefinition/humanitarian-context']/f:extension[@url='vulnerablePopulation']/f:valueBoolean",
  },
  {
    name: 'mobile-unit',
    type: 'string',
    description: 'Search by mobile clinic unit',
    resource: 'Encounter',
    xpath:
      "f:extension[@url='https://zarishsphere.com/fhir/StructureDefinition/mobile-clinic']/f:extension[@url='mobileUnit']/f:valueString",
  },
  {
    name: 'emergency-type',
    type: 'token',
    description: 'Search by emergency type',
    resource: 'Procedure',
    xpath:
      "f:extension[@url='https://zarishsphere.com/fhir/StructureDefinition/emergency-procedure']/f:extension[@url='emergencyType']/f:valueCodeableConcept",
  },
];
```javascript

### Implementing Custom Parameters

```javascript
class CustomSearchService {
  constructor() {
    this.customParameters = new Map();
    this.initializeCustomParameters();
  }

  initializeCustomParameters() {
    // Register custom search parameters
    humanitarianSearchParameters.forEach((param) => {
      this.customParameters.set(param.name, param);
    });
  }

  // Build search query with custom parameters
  buildSearchQuery(resourceType, searchParams) {
    const params = new URLSearchParams();

    // Add standard parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (this.isStandardParameter(key)) {
        params.append(key, value);
      }
    });

    // Add custom parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (this.customParameters.has(key)) {
        const param = this.customParameters.get(key);
        this.addCustomParameter(params, param, value);
      }
    });

    return `/fhir/r5/${resourceType}?${params}`;
  }

  addCustomParameter(params, param, value) {
    switch (param.type) {
      case 'token':
        if (typeof value === 'object') {
          if (value.system) {
            params.append(param.name, `${value.system}|${value.code}`);
          } else {
            params.append(param.name, value.code);
          }
        } else {
          params.append(param.name, value);
        }
        break;

      case 'string':
        params.append(param.name, value);
        break;

      case 'date':
        if (typeof value === 'object') {
          if (value.start) {
            params.append(param.name, `ge${value.start}`);
          }
          if (value.end) {
            params.append(param.name, `le${value.end}`);
          }
        } else {
          params.append(param.name, value);
        }
        break;

      case 'reference':
        params.append(param.name, value);
        break;

      case 'quantity':
        if (typeof value === 'object') {
          const quantityStr = this.buildQuantityString(value);
          params.append(param.name, quantityStr);
        }
        break;
    }
  }

  buildQuantityString(quantity) {
    let str = '';

    if (quantity.prefix) {
      str += quantity.prefix;
    }

    if (quantity.value) {
      str += quantity.value;
    }

    if (quantity.system) {
      str += `|${quantity.system}`;
    }

    if (quantity.code) {
      str += `|${quantity.code}`;
    }

    return str;
  }

  isStandardParameter(parameter) {
    const standardParams = [
      '_id',
      '_lastUpdated',
      '_tag',
      '_profile',
      '_security',
      '_text',
      '_content',
      '_list',
      '_has',
      '_sort',
      '_count',
      '_include',
      '_revinclude',
      '_total',
      '_summary',
      '_format',
    ];

    return standardParams.includes(parameter);
  }
}
```javascript

## Advanced Search Patterns

### Chained Search

```javascript
// Search patients with specific conditions
async function searchPatientsWithConditions(conditionCode) {
  const params = new URLSearchParams();

  // Chain search: Find patients who have the specified condition
  params.append('_has:Condition:patient:code', conditionCode);

  const response = await fetch(`/fhir/r5/Patient?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  });

  return response.json();
}

// Search observations for patients in specific camps
async function searchCampObservations(campLocation, observationCode) {
  const params = new URLSearchParams();

  // Chain search: Find observations for patients in specific camp
  params.append('_has:Patient:subject:camp-location', campLocation);
  params.append('code', observationCode);

  const response = await fetch(`/fhir/r5/Observation?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  });

  return response.json();
}
```javascript

### Reverse Chained Search

```javascript
// Find all resources related to a patient
async function searchPatientRelatedResources(patientId) {
  const params = new URLSearchParams();

  // Include related resources
  params.append('_include', 'Encounter:patient');
  params.append('_include', 'Observation:subject');
  params.append('_include', 'Condition:subject');
  params.append('_include', 'MedicationRequest:subject');
  params.append('_include', 'Procedure:subject');
  params.append('_include', 'Immunization:patient');

  // Reverse include
  params.append('_revinclude', 'CareTeam:subject');
  params.append('_revinclude', 'Goal:subject');

  const response = await fetch(`/fhir/r5/Patient/${patientId}?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  });

  return response.json();
}
```javascript

### Composite Search

```javascript
// Search with composite parameters
async function compositeSearch() {
  const params = new URLSearchParams();

  // Composite: Search for blood pressure observations
  params.append('code-value-quantity', 'http://loinc.org|55284-4$gt120');

  // Composite: Search for specific medication with dosage
  params.append('medication-code', 'http://www.nlm.nih.gov/research/umls/rxnorm|313782');
  params.append('dose-quantity', 'gt5');

  const response = await fetch(`/fhir/r5/Observation?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  });

  return response.json();
}
```javascript

## Performance Optimization

### Search Indexing Strategy

```javascript
class SearchOptimizationService {
  constructor() {
    this.indexes = new Map();
    this.cache = new Map();
    this.initializeIndexes();
  }

  initializeIndexes() {
    // Define search indexes for optimal performance
    this.indexes.set('Patient', [
      'name',
      'family',
      'given',
      'birthDate',
      'gender',
      'displacement-status',
      'camp-location',
      'original-location',
      'vulnerable-population',
      'geographic-area',
    ]);

    this.indexes.set('Observation', [
      'subject',
      'code',
      'category',
      'date',
      'value-quantity',
      'screening-type',
      'screening-location',
      'environmental-conditions',
      'point-of-care-testing',
      'low-resource-optimizations',
    ]);

    this.indexes.set('Encounter', [
      'patient',
      'status',
      'class',
      'date',
      'location',
      'mobile-unit',
      'procedure-location',
      'emergency-type',
    ]);
  }

  // Optimize search query
  optimizeSearchQuery(resourceType, searchParams) {
    const optimizedParams = { ...searchParams };
    const indexes = this.indexes.get(resourceType) || [];

    // Reorder parameters based on index selectivity
    const orderedParams = this.orderParametersBySelectivity(Object.keys(optimizedParams), indexes);

    // Add query hints
    optimizedParams._hint = this.generateQueryHints(resourceType, orderedParams);

    return optimizedParams;
  }

  orderParametersBySelectivity(parameters, indexes) {
    // Order by index selectivity (most selective first)
    const selectivityOrder = [
      '_id',
      'identifier',
      'birthDate',
      'name',
      'family',
      'given',
      'displacement-status',
      'camp-location',
      'code',
      'category',
      'status',
      'class',
      'date',
    ];

    return parameters.sort((a, b) => {
      const aIndex = selectivityOrder.indexOf(a);
      const bIndex = selectivityOrder.indexOf(b);

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });
  }

  generateQueryHints(resourceType, parameters) {
    const hints = [];

    // Add index hints
    const indexes = this.indexes.get(resourceType) || [];
    parameters.forEach((param) => {
      if (indexes.includes(param)) {
        hints.push(`INDEX(${param})`);
      }
    });

    // Add performance hints
    if (parameters.includes('date') || parameters.includes('_lastUpdated')) {
      hints.push('DATE_RANGE_OPTIMIZATION');
    }

    if (parameters.includes('name') || parameters.includes('family')) {
      hints.push('NAME_SEARCH_OPTIMIZATION');
    }

    return hints.join(',');
  }
}
```javascript

### Search Caching

```javascript
class SearchCacheService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.maxCacheSize = 1000;
  }

  // Generate cache key
  generateCacheKey(resourceType, searchParams) {
    const sortedParams = Object.keys(searchParams)
      .sort()
      .map((key) => `${key}:${searchParams[key]}`)
      .join('|');

    return `${resourceType}:${sortedParams}`;
  }

  // Get cached results
  getCachedResults(resourceType, searchParams) {
    const cacheKey = this.generateCacheKey(resourceType, searchParams);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.results;
    }

    return null;
  }

  // Cache search results
  cacheResults(resourceType, searchParams, results) {
    const cacheKey = this.generateCacheKey(resourceType, searchParams);

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(cacheKey, {
      results: results,
      timestamp: Date.now(),
    });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }
}
```javascript

## Search Analytics

### Search Performance Monitoring

```javascript
class SearchAnalyticsService {
  constructor() {
    this.searchMetrics = new Map();
    this.performanceThresholds = {
      responseTime: 2000, // 2 seconds
      resultCount: 1000, // 1000 results
      errorRate: 0.05, // 5% error rate
    };
  }

  // Track search performance
  trackSearch(resourceType, searchParams, responseTime, resultCount, error = null) {
    const metric = {
      timestamp: Date.now(),
      resourceType: resourceType,
      searchParams: searchParams,
      responseTime: responseTime,
      resultCount: resultCount,
      error: error,
    };

    // Store metric
    const key = `${resourceType}:${JSON.stringify(searchParams)}`;
    if (!this.searchMetrics.has(key)) {
      this.searchMetrics.set(key, []);
    }

    this.searchMetrics.get(key).push(metric);

    // Check performance thresholds
    this.checkPerformanceThresholds(metric);

    // Update analytics
    this.updateAnalytics(resourceType, metric);
  }

  checkPerformanceThresholds(metric) {
    // Check response time
    if (metric.responseTime > this.performanceThresholds.responseTime) {
      this.triggerPerformanceAlert('slow_response', metric);
    }

    // Check result count
    if (metric.resultCount > this.performanceThresholds.resultCount) {
      this.triggerPerformanceAlert('large_result_set', metric);
    }

    // Check error
    if (metric.error) {
      this.triggerPerformanceAlert('search_error', metric);
    }
  }

  triggerPerformanceAlert(alertType, metric) {
    const alert = {
      type: alertType,
      timestamp: Date.now(),
      metric: metric,
      severity: this.getAlertSeverity(alertType, metric),
    };

    // Send alert to monitoring system
    this.sendAlert(alert);
  }

  getAlertSeverity(alertType, metric) {
    switch (alertType) {
      case 'slow_response':
        return metric.responseTime > 5000 ? 'high' : 'medium';
      case 'large_result_set':
        return metric.resultCount > 5000 ? 'high' : 'medium';
      case 'search_error':
        return 'high';
      default:
        return 'medium';
    }
  }

  // Generate search analytics report
  generateAnalyticsReport(timeRange) {
    const report = {
      timeRange: timeRange,
      totalSearches: 0,
      averageResponseTime: 0,
      errorRate: 0,
      popularSearches: [],
      slowSearches: [],
      resourceTypeStats: {},
    };

    // Process metrics
    for (const [key, metrics] of this.searchMetrics.entries()) {
      const timeFilteredMetrics = metrics.filter(
        (m) => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );

      if (timeFilteredMetrics.length === 0) continue;

      // Calculate statistics
      const avgResponseTime =
        timeFilteredMetrics.reduce((sum, m) => sum + m.responseTime, 0) /
        timeFilteredMetrics.length;
      const errorCount = timeFilteredMetrics.filter((m) => m.error).length;
      const errorRate = errorCount / timeFilteredMetrics.length;

      // Update report
      report.totalSearches += timeFilteredMetrics.length;
      report.averageResponseTime += avgResponseTime * timeFilteredMetrics.length;
      report.errorRate += errorRate * timeFilteredMetrics.length;

      // Track popular searches
      if (timeFilteredMetrics.length > 10) {
        report.popularSearches.push({
          searchParams: key,
          count: timeFilteredMetrics.length,
          avgResponseTime: avgResponseTime,
        });
      }

      // Track slow searches
      if (avgResponseTime > this.performanceThresholds.responseTime) {
        report.slowSearches.push({
          searchParams: key,
          avgResponseTime: avgResponseTime,
          count: timeFilteredMetrics.length,
        });
      }
    }

    // Calculate averages
    if (report.totalSearches > 0) {
      report.averageResponseTime /= report.totalSearches;
      report.errorRate /= report.totalSearches;
    }

    return report;
  }
}
```json

This comprehensive search operations guide enables efficient and optimized data retrieval for humanitarian healthcare scenarios with advanced filtering, custom parameters, and performance monitoring capabilities.
````
