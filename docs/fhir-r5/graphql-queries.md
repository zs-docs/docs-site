---
title: 'GraphQL Queries'
sidebar_label: 'GraphQL Queries'
description: 'Comprehensive guide to FHIR R5 GraphQL queries in ZARISH SPHERE'
keywords: [graphql, fhir r5, queries, healthcare, zarish sphere]
---

# FHIR R5 GraphQL Queries

## Overview

ZARISH SPHERE provides a comprehensive GraphQL API for FHIR R5 resources, enabling flexible and efficient data retrieval with real-time subscriptions. This guide covers query patterns, filtering, pagination, and humanitarian-specific extensions.

## GraphQL Schema Overview

### Core Query Structure

````graphql
query {
  # Patient queries
  patients(first: 50, after: "cursor", filter: PatientFilter): PatientConnection

  # Encounter queries
  encounters(first: 50, after: "cursor", filter: EncounterFilter): EncounterConnection

  # Observation queries
  observations(first: 50, after: "cursor", filter: ObservationFilter): ObservationConnection

  # Custom operations
  matchPatient(input: PatientMatchInput!): PatientMatchResult
  diseaseSurveillance(input: SurveillanceInput!): SurveillanceResult
}
```text

### Subscription Structure

```graphql
subscription {
  # Real-time patient updates
  patientUpdated(patientId: ID!): Patient

  # Disease surveillance alerts
  diseaseAlerts(area: String): DiseaseAlert

  # Emergency response updates
  emergencyUpdates: EmergencyUpdate
}
```text

## Patient Queries

### Basic Patient Query

```graphql
query GetPatient($id: ID!) {
  patient(id: $id) {
    id
    name {
      use
      family
      given
    }
    gender
    birthDate
    identifier {
      system
      value
    }
    extension {
      ... on HumanitarianContext {
        displacementStatus {
          code
          display
        }
        originalLocation
        vulnerablePopulation
      }
    }
  }
}
```text

### Patient List with Filtering

```graphql
query GetPatients($filter: PatientFilter, $first: Int, $after: String) {
  patients(first: $first, after: $after, filter: $filter) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name {
          family
          given
        }
        gender
        birthDate
        extension {
          ... on HumanitarianContext {
            displacementStatus {
              code
              display
            }
            campLocation
          }
        }
      }
    }
    totalCount
  }
}
```text

### Advanced Patient Filtering

```graphql
query SearchPatients($searchTerm: String, $displacementStatus: String, $campLocation: String) {
  patients(
    filter: {
      name: { contains: $searchTerm }
      extension: {
        humanitarianContext: {
          displacementStatus: { code: $displacementStatus }
          campLocation: { equals: $campLocation }
        }
      }
    }
    first: 100
  ) {
    edges {
      node {
        id
        name {
          family
          given
        }
        gender
        birthDate
        extension {
          ... on HumanitarianContext {
            displacementStatus {
              code
              display
            }
            originalLocation
            displacementDate
            vulnerablePopulation
          }
        }
      }
    }
    totalCount
  }
}
```python

## Encounter Queries

### Patient Encounters

```graphql
query GetPatientEncounters($patientId: ID!, $status: String) {
  encounters(
    filter: { patient: { id: { equals: $patientId } }, status: { equals: $status } }
    first: 50
  ) {
    edges {
      node {
        id
        status
        class {
          code
          display
        }
        period {
          start
          end
        }
        location {
          name
        }
        extension {
          ... on MobileClinicEncounter {
            mobileUnit
            procedureLocation
            limitedResources
          }
          ... on EmergencyEncounter {
            emergencyType {
              code
              display
            }
            triageLevel {
              code
              display
            }
          }
        }
      }
    }
  }
}
```text

### Mobile Clinic Encounters

```graphql
query GetMobileClinicEncounters($mobileUnit: String, $date: DateTime) {
  encounters(
    filter: {
      extension: {
        mobileClinicEncounter: {
          mobileUnit: { equals: $mobileUnit }
          procedureLocation: { contains: "Camp" }
        }
      }
      period: { start: { gte: $date }, end: { lte: $date } }
    }
    first: 100
  ) {
    edges {
      node {
        id
        status
        patient {
          name {
            family
            given
          }
          extension {
            ... on HumanitarianContext {
              displacementStatus {
                code
                display
              }
            }
          }
        }
        extension {
          ... on MobileClinicEncounter {
            mobileUnit
            procedureLocation
            servicesProvided {
              code
              display
            }
          }
        }
      }
    }
  }
}
```text

## Observation Queries

### Vital Signs Query

```graphql
query GetPatientVitalSigns($patientId: ID!, $dateRange: DateRangeInput) {
  observations(
    filter: {
      patient: { id: { equals: $patientId } }
      category: { code: { equals: "vital-signs" } }
      effectiveDateTime: {
        gte: $dateRange.start
        lte: $dateRange.end
      }
    }
    first: 100
    orderBy: { field: EFFECTIVE_DATE_TIME, direction: DESC }
  ) {
    edges {
      node {
        id
        status
        code {
          coding {
            system
            code
            display
          }
        }
        effectiveDateTime
        valueQuantity {
          value
          unit
          system
          code
        }
        component {
          code {
            coding {
              system
              code
              display
            }
          }
          valueQuantity {
            value
            unit
          }
        }
        extension {
          ... on ScreeningContext {
            screeningType {
              code
              display
            }
            screeningLocation
          }
        }
      }
    }
  }
}
```text

### Disease Surveillance Observations

```graphql
query GetDiseaseSurveillanceData($diseaseCode: String, $timePeriod: DateRangeInput, $location: String) {
  observations(
    filter: {
      code: { code: { equals: $diseaseCode } }
      effectiveDateTime: {
        gte: $timePeriod.start
        lte: $timePeriod.end
      }
      extension: {
        environmentalContext: {
          geographicArea: { equals: $location }
        }
      }
    }
    first: 1000
  ) {
    edges {
      node {
        id
        status
        effectiveDateTime
        subject {
          id
          name {
            family
            given
          }
          extension {
            ... on HumanitarianContext {
              displacementStatus {
                code
                display
              }
              campLocation
            }
          }
        }
        valueCodeableConcept {
          coding {
            system
            code
            display
          }
        }
        extension {
          ... on EnvironmentalContext {
            environmentalConditions
            pointOfCareTesting
            lowResourceOptimizations
          }
        }
      }
    }
  }
}
```text

## Medication Queries

### Essential Medicines Query

```graphql
query GetEssentialMedicines($medicationType: String, $allocationType: String) {
  medications(
    filter: {
      extension: {
        essentialMedicine: { essentialMedicineType: { code: { equals: $medicationType } } }
      }
    }
    first: 100
  ) {
    edges {
      node {
        id
        code {
          coding {
            system
            code
            display
          }
        }
        form {
          coding {
            code
            display
          }
        }
        amount {
          value
          unit
          system
          code
        }
        ingredient {
          item {
            code {
              coding {
                code
                display
              }
            }
          }
          strength {
            numerator {
              value
              unit
            }
            denominator {
              value
              unit
            }
          }
        }
        extension {
          ... on EssentialMedicine {
            essentialMedicineType {
              code
              display
            }
            supplyChainTracking
            lowResourceOptimizations {
              code
              display
            }
          }
          ... on Allocation {
            allocatedQuantity {
              value
              unit
            }
            destination
            allocationDate
            allocationType {
              code
              display
            }
          }
        }
      }
    }
  }
}
```yaml

### Medication Requests

```graphql
query GetMedicationRequests($patientId: ID!, $status: String) {
  medicationRequests(
    filter: { patient: { id: { equals: $patientId } }, status: { equals: $status } }
    first: 50
  ) {
    edges {
      node {
        id
        status
        intent
        authoredOn
        medicationReference {
          id
          code {
            coding {
              code
              display
            }
          }
          extension {
            ... on EssentialMedicine {
              essentialMedicineType {
                code
                display
              }
            }
          }
        }
        dosageInstruction {
          text
          timing {
            repeat {
              frequency
              period
              periodUnit
            }
          }
          route {
            coding {
              system
              code
              display
            }
          }
        }
        requester {
          reference
          display
        }
        extension {
          ... on EssentialMedicine {
            supplyChainTracking
          }
        }
      }
    }
  }
}
```text

## Custom Operations

### Patient Matching

```graphql
mutation MatchPatient($input: PatientMatchInput!) {
  matchPatient(input: $input) {
    matches {
      id
      name {
        family
        given
      }
      birthDate
      gender
      identifier {
        system
        value
      }
      matchScore
      matchReasons
    }
    totalMatches
    matchThreshold
  }
}
```text

### Disease Surveillance

```graphql
mutation DiseaseSurveillance($input: SurveillanceInput!) {
  diseaseSurveillance(input: $input) {
    diseaseCode {
      system
      code
      display
    }
    timePeriod {
      start
      end
    }
    geographicArea
    caseCount
    alertThreshold
    alertTriggered
    recommendations
    affectedPatients {
      id
      name {
        family
        given
      }
      extension {
        ... on HumanitarianContext {
          displacementStatus {
            code
            display
          }
          campLocation
        }
      }
    }
  }
}
```text

## Real-time Subscriptions

### Patient Updates

```graphql
subscription PatientUpdates($patientId: ID!) {
  patientUpdated(patientId: $patientId) {
    id
    name {
      family
      given
    }
    gender
    birthDate
    extension {
      ... on HumanitarianContext {
        displacementStatus {
          code
          display
        }
        campLocation
      }
    }
    lastUpdated
    updateType
  }
}
```text

### Disease Alerts

```graphql
subscription DiseaseAlerts($area: String, $diseaseCode: String) {
  diseaseAlerts(area: $area, diseaseCode: $diseaseCode) {
    id
    alertType
    severity
    diseaseCode {
      system
      code
      display
    }
    geographicArea
    caseCount
    threshold
    timestamp
    recommendations
    affectedZones {
      zoneId
      zoneName
      caseCount
      riskLevel
    }
  }
}
```text

### Emergency Updates

```graphql
subscription EmergencyUpdates {
  emergencyUpdates {
    id
    emergencyType {
      code
      display
    }
    priority {
      code
      display
    }
    location
    responseTeam
    status
    timestamp
    resources {
      type
      quantity
      status
    }
    patient {
      id
      name {
        family
        given
      }
    }
  }
}
```javascript

## Implementation Examples

### JavaScript Client

```javascript
import { gql, useQuery, useSubscription } from '@apollo/client';

// Define GraphQL queries
const GET_PATIENTS_QUERY = gql`
  query GetPatients($filter: PatientFilter, $first: Int, $after: String) {
    patients(first: $first, after: $after, filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          name {
            family
            given
          }
          gender
          birthDate
          extension {
            ... on HumanitarianContext {
              displacementStatus {
                code
                display
              }
              campLocation
              vulnerablePopulation
            }
          }
        }
      }
      totalCount
    }
  }
`;

const DISEASE_ALERTS_SUBSCRIPTION = gql`
  subscription DiseaseAlerts($area: String, $diseaseCode: String) {
    diseaseAlerts(area: $area, diseaseCode: $diseaseCode) {
      id
      alertType
      severity
      diseaseCode {
        system
        code
        display
      }
      geographicArea
      caseCount
      threshold
      timestamp
      recommendations
    }
  }
`;

// React component using GraphQL
function PatientList() {
  const [filter, setFilter] = useState({
    extension: {
      humanitarianContext: {
        displacementStatus: { code: 'refugee' },
      },
    },
  });

  const { loading, error, data, fetchMore } = useQuery(GET_PATIENTS_QUERY, {
    variables: {
      filter,
      first: 20,
    },
  });

  const { data: alertData } = useSubscription(DISEASE_ALERTS_SUBSCRIPTION, {
    variables: {
      area: 'Camp A',
      diseaseCode: '186549000',
    },
  });

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Displaced Patients</h2>

      {/* Disease Alerts */}
      {alertData?.diseaseAlerts && (
        <div className="alert">
          <h3>Disease Alert</h3>
          <p>{alertData.diseaseAlerts.diseaseCode.display}</p>
          <p>Cases: {alertData.diseaseAlerts.caseCount}</p>
          <p>Area: {alertData.diseaseAlerts.geographicArea}</p>
        </div>
      )}

      {/* Patient List */}
      <ul>
        {data.patients.edges.map(({ node }) => (
          <li key={node.id}>
            <h4>
              {node.name.family}, {node.name.given.join(' ')}
            </h4>
            <p>Gender: {node.gender}</p>
            <p>Birth Date: {node.birthDate}</p>
            {node.extension?.displacementStatus && (
              <p>Status: {node.extension.displacementStatus.display}</p>
            )}
            {node.extension?.campLocation && <p>Location: {node.extension.campLocation}</p>}
          </li>
        ))}
      </ul>

      {/* Load More */}
      {data.patients.pageInfo.hasNextPage && (
        <button
          onClick={() =>
            fetchMore({
              variables: {
                after: data.patients.pageInfo.endCursor,
              },
            })
          }
        >
          Load More
        </button>
      )}
    </div>
  );
}
```javascript

### Python Client

```python
import requests
import json

class ZARISphereGraphQLClient:
    def __init__(self, base_url, access_token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

    def query_patients(self, filter_params=None, first=20, after=None):
        """Query patients with optional filtering"""
        query = """
        query GetPatients($filter: PatientFilter, $first: Int, $after: String) {
          patients(first: $first, after: $after, filter: $filter) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              cursor
              node {
                id
                name {
                  family
                  given
                }
                gender
                birthDate
                extension {
                  ... on HumanitarianContext {
                    displacementStatus {
                      code
                      display
                    }
                    campLocation
                    vulnerablePopulation
                  }
                }
              }
            }
            totalCount
          }
        }
        """

        variables = {
            'filter': filter_params,
            'first': first,
            'after': after
        }

        response = requests.post(
            f'{self.base_url}/graphql',
            json={'query': query, 'variables': variables},
            headers=self.headers
        )

        return response.json()

    def get_disease_surveillance(self, disease_code, time_period, geographic_area):
        """Get disease surveillance data"""
        query = """
        query GetDiseaseSurveillance($diseaseCode: String, $timePeriod: DateRangeInput, $location: String) {
          observations(
            filter: {
              code: { code: { equals: $diseaseCode } }
              effectiveDateTime: {
                gte: $timePeriod.start
                lte: $timePeriod.end
              }
              extension: {
                environmentalContext: {
                  geographicArea: { equals: $location }
                }
              }
            }
            first: 1000
          ) {
            edges {
              node {
                id
                status
                effectiveDateTime
                subject {
                  id
                  name {
                    family
                    given
                  }
                  extension {
                    ... on HumanitarianContext {
                      displacementStatus {
                        code
                        display
                      }
                      campLocation
                    }
                  }
                }
                valueCodeableConcept {
                  coding {
                    system
                    code
                    display
                  }
                }
              }
            }
          }
        }
        """

        variables = {
            'diseaseCode': disease_code,
            'timePeriod': time_period,
            'location': geographic_area
        }

        response = requests.post(
            f'{self.base_url}/graphql',
            json={'query': query, 'variables': variables},
            headers=self.headers
        )

        return response.json()

## Usage example
client = ZARISphereGraphQLClient(
    'https://api.zarishsphere.com',
    'your-access-token'
)

## Get refugee patients
refugee_filter = {
    'extension': {
        'humanitarianContext': {
            'displacementStatus': {'code': 'refugee'}
        }
    }
}

patients = client.query_patients(refugee_filter)
print(f"Found {patients['data']['patients']['totalCount']} refugee patients")

## Get disease surveillance for cholera
surveillance_data = client.get_disease_surveillance(
    disease_code='186549000',
    time_period={
        'start': '2023-12-01T00:00:00Z',
        'end': '2023-12-31T23:59:59Z'
    },
    geographic_area='Camp A'
)

print(f"Found {len(surveillance_data['data']['observations']['edges'])} cholera cases")
```text

This comprehensive GraphQL guide enables flexible and efficient data retrieval for humanitarian healthcare scenarios with real-time updates and advanced filtering capabilities.
````
