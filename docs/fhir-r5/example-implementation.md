---
title: 'Example Implementation'
sidebar_label: 'Example Implementation'
description: 'Complete FHIR R5 implementation example for humanitarian healthcare scenarios in ZARISH SPHERE'
keywords: [example implementation, fhir r5, humanitarian, healthcare, zarish sphere]
---

# FHIR R5 Example Implementation

## Overview

This comprehensive example demonstrates a complete FHIR R5 implementation for a humanitarian healthcare scenario. We'll walk through a real-world use case of managing displaced populations during a health crisis, showcasing how ZARISH SPHERE extensions and custom operations work together.

## Scenario: Refugee Health Crisis Response

### Context

A refugee camp has been established in response to a regional crisis. The healthcare team needs to:

1. Register displaced individuals
2. Screen for communicable diseases
3. Provide essential medical care
4. Track vaccination campaigns
5. Monitor disease outbreaks
6. Manage medication distribution

### Implementation Architecture

````text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile Clinic │    │   Field Hospital │    │   Central Hub   │
│                 │    │                 │    │                 │
│ - Registration  │◄──►│ - Emergency Care │◄──►│ - Data Sync     │
│ - Screening     │    │ - Stabilization │    │ - Analytics     │
│ - Vaccination   │    │ - Referrals     │    │ - Reporting     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```javascript

## Step 1: Patient Registration

### Mobile Clinic Registration

```javascript
// Register a displaced person at the mobile clinic
async function registerDisplacedPerson(personData) {
  const patient = {
    resourceType: 'Patient',
    name: [
      {
        use: 'official',
        family: personData.familyName,
        given: [personData.givenName],
      },
    ],
    gender: personData.gender,
    birthDate: personData.birthDate,
    identifier: [
      {
        use: 'official',
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'MR',
              display: 'Medical Record Number',
            },
          ],
        },
        system: 'https://zarishsphere.com/refugee-id',
        value: generateRefugeeId(),
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/humanitarian-context',
        extension: [
          {
            url: 'displacementStatus',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/displacement-status',
                  code: 'refugee',
                  display: 'Refugee',
                },
              ],
            },
          },
          {
            url: 'originalLocation',
            valueString: personData.originalLocation,
          },
          {
            url: 'displacementDate',
            valueDateTime: personData.displacementDate,
          },
          {
            url: 'vulnerablePopulation',
            valueBoolean: personData.isVulnerable,
          },
          {
            url: 'campLocation',
            valueString: 'Camp A, Zone 3',
          },
        ],
      },
    ],
  };

  return await createFHIRResource('Patient', patient);
}

// Example usage
const refugeeData = {
  familyName: 'Al-Hassan',
  givenName: 'Mohammed',
  gender: 'male',
  birthDate: '1985-06-15',
  originalLocation: 'Northern Province',
  displacementDate: '2023-12-01T10:30:00Z',
  isVulnerable: true, // Elderly family member
};

const patient = await registerDisplacedPerson(refugeeData);
```javascript

### Patient Matching for Duplicate Prevention

```javascript
// Check for potential duplicates before creating new patient
async function checkForDuplicates(patientData) {
  const matchRequest = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'patient',
        resource: {
          resourceType: 'Patient',
          name: [
            {
              family: patientData.familyName,
              given: [patientData.givenName],
            },
          ],
          birthDate: patientData.birthDate,
          gender: patientData.gender,
        },
      },
      {
        name: 'matchThreshold',
        valueDecimal: 0.85,
      },
      {
        name: 'algorithm',
        valueString: 'deterministic',
      },
    ],
  };

  const response = await fetch('/fhir/r5/Patient/$match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(matchRequest),
  });

  const matches = await response.json();
  return matches.entry?.length > 0 ? matches.entry : null;
}
```javascript

## Step 2: Health Screening

### Disease Surveillance Screening

```javascript
// Conduct initial health screening
async function conductHealthScreening(patientId, screeningData) {
  const observations = [];

  // Vital signs
  const vitalSigns = {
    resourceType: "Observation",
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "vital-signs",
            "display": "Vital Signs"
          }
        ]
      }
    ],
    subject: {
      reference: `Patient/${patientId}`
    },
    effectiveDateTime: new Date().toISOString(),
    component: [
      {
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "8310-5",
              "display": "Body temperature"
            }
          ]
        },
        valueQuantity: {
          value: screeningData.temperature,
          unit: "°C",
          system: "http://unitsofmeasure.org",
          code": "Cel"
        }
      },
      {
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "8867-4",
              "display": "Heart rate"
            }
          ]
        },
        valueQuantity: {
          value: screeningData.heartRate,
          unit: "/min",
          system: "http://unitsofmeasure.org",
          code": "/min"
        }
      }
    ],
    extension: [
      {
        url: "https://zarishsphere.com/fhir/StructureDefinition/screening-context",
        extension: [
          {
            url: "screeningType",
            valueCodeableConcept: {
              coding: [
                {
                  system: "https://zarishsphere.com/fhir/CodeSystem/screening-type",
                  code: "initial-entry",
                  "display": "Initial Entry Screening"
                }
              ]
            }
          },
          {
            url: "screeningLocation",
            valueString: "Mobile Clinic Unit A"
          }
        ]
      }
    ]
  };

  observations.push(vitalSigns);

  // Disease-specific screening
  if (screeningData.symptoms?.length > 0) {
    const symptomObservation = {
      resourceType: "Observation",
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "symptom",
              "display": "Symptom"
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "286034007",
            "display": "Patient reported symptoms"
          }
        ]
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: new Date().toISOString(),
      valueString: screeningData.symptoms.join(", ")
    };

    observations.push(symptomObservation);
  }

  // Create observations in batch
  const bundle = {
    resourceType: "Bundle",
    type: "transaction",
    entry: observations.map(obs => ({
      fullUrl: `urn:uuid:${generateUUID()}`,
      resource: obs,
      request: {
        method: "POST",
        url: "Observation"
      }
    }))
  };

  return await executeTransaction(bundle);
}

// Example screening data
const screeningData = {
  temperature: 38.5,
  heartRate: 95,
  symptoms: ["fever", "cough", "fatigue"]
};

const screeningResults = await conductHealthScreening(patient.id, screeningData);
```javascript

### Disease Surveillance Alert

```javascript
// Check for disease outbreak patterns
async function checkDiseaseSurveillance(diseaseCode, timePeriod) {
  const surveillanceRequest = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'diseaseCode',
        valueCodeableConcept: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: diseaseCode,
              display: 'Respiratory infection',
            },
          ],
        },
      },
      {
        name: 'timePeriod',
        valuePeriod: {
          start: timePeriod.start,
          end: timePeriod.end,
        },
      },
      {
        name: 'geographicArea',
        valueString: 'Camp A, Zone 3',
      },
      {
        name: 'alertThreshold',
        valueInteger: 5,
      },
    ],
  };

  const response = await fetch('/fhir/r5/Condition/$surveillance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(surveillanceRequest),
  });

  return await response.json();
}

// Check for respiratory infections in the last 7 days
const surveillanceResult = await checkDiseaseSurveillance('186549000', {
  start: '2023-12-08T00:00:00Z',
  end: '2023-12-15T23:59:59Z',
});
```javascript

## Step 3: Vaccination Campaign

### Mass Vaccination Implementation

```javascript
// Create vaccination campaign
async function createVaccinationCampaign() {
  const campaignRequest = {
    resourceType: "Parameters",
    parameter: [
      {
        name: "campaignId",
        valueString: "CHOLERA-CAMP-2023-001"
      },
      {
        name: "vaccineType",
        valueCodeableConcept: {
          coding: [
            {
              system: "https://zarishsphere.com/fhir/CodeSystem/vaccine-type",
              code: "cholera",
              "display": "Cholera Vaccine"
            }
          ]
        }
      },
      {
        name: "targetPopulation",
        valueString: "Camp A residents > 1 year"
      },
      {
        name: "startDate",
        valueDate: "2023-12-16"
      },
      {
        name: "endDate",
        valueDate: "2023-12-23"
      },
      {
        name: "coverageGoal",
        valueDecimal: 0.80
      }
    ]
  };

  const response = await fetch('/fhir/r5/Immunization/$campaign', {
    method: 'POST',
    {
      'Content-Type': 'application/fhir+json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(campaignRequest)
  });

  return await response.json();
}

// Administer vaccine to patient
async function administerVaccine(patientId, vaccineData) {
  const immunization = {
    resourceType: "Immunization",
    status: "completed",
    vaccineCode: {
      coding: [
        {
          system: "https://zarishsphere.com/fhir/CodeSystem/vaccine-type",
          code: vaccineData.vaccineType,
          display: vaccineData.vaccineDisplay
        }
      ]
    },
    patient: {
      reference: `Patient/${patientId}`
    },
    occurrenceDateTime: new Date().toISOString(),
    performer: [
      {
        function: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              code: "VRF",
              "display": "Verifier"
            }
          ]
        },
        actor: {
          reference: `Practitioner/${vaccineData.administratorId}`,
          display: vaccineData.administratorName
        }
      }
    ],
    extension: [
      {
        url: "https://zarishsphere.com/fhir/StructureDefinition/vaccination-campaign",
        extension: [
          {
            url: "campaignId",
            valueString: "CHOLERA-CAMP-2023-001"
          },
          {
            url: "campaignStatus",
            valueCodeableConcept: {
              coding: [
                {
                  system: "https://zarishsphere.com/fhir/CodeSystem/campaign-status",
                  code: "active",
                  "display": "Active"
                }
              ]
            }
          }
        ]
      }
    ]
  };

  return await createFHIRResource('Immunization', immunization);
}
```javascript

## Step 4: Emergency Response

### Emergency Medical Procedure

```javascript
// Handle emergency medical procedure
async function handleEmergencyProcedure(patientId, emergencyData) {
  const emergencyRequest = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'emergencyType',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://zarishsphere.com/fhir/CodeSystem/emergency-type',
              code: emergencyData.type,
              display: emergencyData.typeDisplay,
            },
          ],
        },
      },
      {
        name: 'responseTeam',
        valueString: emergencyData.responseTeam,
      },
      {
        name: 'location',
        valueString: emergencyData.location,
      },
      {
        name: 'priority',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://zarishsphere.com/fhir/CodeSystem/emergency-priority',
              code: emergencyData.priority,
              display: emergencyData.priorityDisplay,
            },
          ],
        },
      },
    ],
  };

  const response = await fetch('/fhir/r5/Procedure/$emergency', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(emergencyRequest),
  });

  const emergencyProcedure = await response.json();

  // Create encounter for the emergency
  const encounter = {
    resourceType: 'Encounter',
    status: 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'EMER',
      display: 'Emergency',
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    period: {
      start: new Date().toISOString(),
    },
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/emergency-encounter',
        extension: [
          {
            url: 'emergencyType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/emergency-type',
                  code: emergencyData.type,
                  display: emergencyData.typeDisplay,
                },
              ],
            },
          },
          {
            url: 'triageLevel',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/triage-level',
                  code: 'red',
                  display: 'Immediate',
                },
              ],
            },
          },
        ],
      },
    ],
  };

  await createFHIRResource('Encounter', encounter);
  return emergencyProcedure;
}

// Example emergency call
const emergencyData = {
  type: 'trauma',
  typeDisplay: 'Trauma Emergency',
  responseTeam: 'Rapid Response Team A',
  location: 'Camp A, Zone 3, Medical Tent 2',
  priority: 'critical',
  priorityDisplay: 'Critical Priority',
};

const emergencyResponse = await handleEmergencyProcedure(patient.id, emergencyData);
```javascript

## Step 5: Medication Management

### Essential Medicines Allocation

```javascript
// Allocate essential medicines to mobile clinic
async function allocateEssentialMedicines(medicationId, quantity, destination) {
  const allocationRequest = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'medication',
        reference: {
          reference: `Medication/${medicationId}`,
        },
      },
      {
        name: 'quantity',
        valueQuantity: {
          value: quantity,
          unit: 'tablets',
          system: 'http://unitsofmeasure.org',
          code: '{tbl}',
        },
      },
      {
        name: 'destination',
        valueString: destination,
      },
      {
        name: 'allocationType',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://zarishsphere.com/fhir/CodeSystem/allocation-type',
              code: 'emergency',
              display: 'Emergency Allocation',
            },
          ],
        },
      },
      {
        name: 'priority',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://zarishsphere.com/fhir/CodeSystem/allocation-priority',
              code: 'high',
              display: 'High Priority',
            },
          ],
        },
      },
    ],
  };

  const response = await fetch('/fhir/r5/Medication/$allocate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(allocationRequest),
  });

  return await response.json();
}

// Prescribe medication to patient
async function prescribeMedication(patientId, medicationData) {
  const medicationRequest = {
    resourceType: 'MedicationRequest',
    status: 'active',
    intent: 'order',
    medicationReference: {
      reference: `Medication/${medicationData.medicationId}`,
      display: medicationData.medicationName,
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    authoredOn: new Date().toISOString(),
    requester: {
      reference: `Practitioner/${medicationData.practitionerId}`,
      display: medicationData.practitionerName,
    },
    dosageInstruction: [
      {
        text: medicationData.dosageText,
        timing: {
          repeat: {
            frequency: medicationData.frequency,
            period: medicationData.period,
            periodUnit: medicationData.periodUnit,
          },
        },
        route: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: medicationData.routeCode,
              display: medicationData.routeDisplay,
            },
          ],
        },
      },
    ],
    extension: [
      {
        url: 'https://zarishsphere.com/fhir/StructureDefinition/essential-medicine',
        extension: [
          {
            url: 'essentialMedicineType',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://zarishsphere.com/fhir/CodeSystem/essential-medicine-type',
                  code: 'who-essential',
                  display: 'WHO Essential Medicine',
                },
              ],
            },
          },
          {
            url: 'supplyChainTracking',
            valueString: medicationData.batchNumber,
          },
        ],
      },
    ],
  };

  return await createFHIRResource('MedicationRequest', medicationRequest);
}
```javascript

## Step 6: Data Analytics and Reporting

### Generate Health Statistics

```javascript
// Generate comprehensive health statistics
async function generateHealthStatistics(timePeriod, location) {
  const statistics = {
    patientDemographics: await getPatientDemographics(location),
    diseasePrevalence: await getDiseasePrevalence(timePeriod, location),
    vaccinationCoverage: await getVaccinationCoverage(timePeriod, location),
    medicationUtilization: await getMedicationUtilization(timePeriod, location),
    emergencyResponse: await getEmergencyResponseMetrics(timePeriod, location),
  };

  return statistics;
}

async function getPatientDemographics(location) {
  const patients = await searchFHIRResources('Patient', {
    'extension:location': location,
  });

  const demographics = {
    totalPatients: patients.entry?.length || 0,
    ageDistribution: {},
    genderDistribution: {},
    displacementStatus: {},
    vulnerablePopulation: 0,
  };

  patients.entry?.forEach((patient) => {
    const resource = patient.resource;

    // Age distribution
    const age = calculateAge(resource.birthDate);
    const ageGroup = getAgeGroup(age);
    demographics.ageDistribution[ageGroup] = (demographics.ageDistribution[ageGroup] || 0) + 1;

    // Gender distribution
    demographics.genderDistribution[resource.gender] =
      (demographics.genderDistribution[resource.gender] || 0) + 1;

    // Displacement status
    const displacementExt = resource.extension?.find((ext) =>
      ext.url.includes('displacement-status')
    );
    if (displacementExt) {
      const status = displacementExt.extension[0].valueCodeableConcept.coding[0].code;
      demographics.displacementStatus[status] = (demographics.displacementStatus[status] || 0) + 1;
    }

    // Vulnerable population
    const vulnerableExt = resource.extension?.find((ext) =>
      ext.extension?.some((subExt) => subExt.url === 'vulnerablePopulation' && subExt.valueBoolean)
    );
    if (vulnerableExt) {
      demographics.vulnerablePopulation++;
    }
  });

  return demographics;
}

async function getDiseasePrevalence(timePeriod, location) {
  const conditions = await searchFHIRResources('Condition', {
    'recorded-date': `ge${timePeriod.start}`,
    'subject:Patient.extension:location': location,
  });

  const prevalence = {};

  conditions.entry?.forEach((condition) => {
    const resource = condition.resource;
    const code = resource.code?.coding[0]?.code;
    const display = resource.code?.coding[0]?.display;

    if (code) {
      prevalence[code] = {
        display: display || 'Unknown',
        count: (prevalence[code]?.count || 0) + 1,
        severity: {},
      };

      // Count by severity
      const severity = resource.severity?.coding[0]?.code || 'unknown';
      prevalence[code].severity[severity] = (prevalence[code].severity[severity] || 0) + 1;
    }
  });

  return prevalence;
}
```javascript

## Complete Workflow Integration

### End-to-End Patient Journey

```javascript
// Complete patient journey from registration to follow-up
async function completePatientJourney(personData) {
  try {
    // Step 1: Check for duplicates
    const duplicates = await checkForDuplicates(personData);
    if (duplicates) {
      console.log('Potential duplicate found:', duplicates);
      return { status: 'duplicate', matches: duplicates };
    }

    // Step 2: Register patient
    const patient = await registerDisplacedPerson(personData);
    console.log('Patient registered:', patient.id);

    // Step 3: Conduct health screening
    const screeningData = {
      temperature: 37.2,
      heartRate: 78,
      symptoms: [],
    };
    const screeningResults = await conductHealthScreening(patient.id, screeningData);
    console.log('Screening completed:', screeningResults.entry?.length, 'observations');

    // Step 4: Check for disease surveillance alerts
    const surveillanceResult = await checkDiseaseSurveillance('186549000', {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    });

    if (
      surveillanceResult.entry?.some(
        (entry) =>
          entry.resource?.resourceType === 'OperationOutcome' &&
          entry.resource?.issue?.some((issue) => issue.severity === 'warning')
      )
    ) {
      console.log('Disease surveillance alert detected');
      // Trigger outbreak response protocol
    }

    // Step 5: Administer routine vaccination
    const vaccineData = {
      vaccineType: 'cholera',
      vaccineDisplay: 'Cholera Vaccine',
      administratorId: 'practitioner-001',
      administratorName: 'Dr. Sarah Johnson',
    };
    await administerVaccine(patient.id, vaccineData);
    console.log('Vaccination administered');

    // Step 6: Schedule follow-up
    const followUpEncounter = {
      resourceType: 'Encounter',
      status: 'planned',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'Ambulatory',
      },
      subject: {
        reference: `Patient/${patient.id}`,
      },
      period: {
        start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      extension: [
        {
          url: 'https://zarishsphere.com/fhir/StructureDefinition/mobile-clinic',
          extension: [
            {
              url: 'mobileUnit',
              valueString: 'MOBILE-CLINIC-001',
            },
            {
              url: 'followUpType',
              valueCodeableConcept: {
                coding: [
                  {
                    system: 'https://zarishsphere.com/fhir/CodeSystem/follow-up-type',
                    code: 'routine',
                    display: 'Routine Follow-up',
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    await createFHIRResource('Encounter', followUpEncounter);
    console.log('Follow-up scheduled');

    return {
      status: 'success',
      patientId: patient.id,
      screeningResults: screeningResults.entry?.length,
      vaccinationAdministered: true,
      followUpScheduled: true,
    };
  } catch (error) {
    console.error('Error in patient journey:', error);
    return {
      status: 'error',
      error: error.message,
    };
  }
}

// Execute the complete workflow
const refugeeData = {
  familyName: 'Al-Hassan',
  givenName: 'Mohammed',
  gender: 'male',
  birthDate: '1985-06-15',
  originalLocation: 'Northern Province',
  displacementDate: '2023-12-01T10:30:00Z',
  isVulnerable: true,
};

const journeyResult = await completePatientJourney(refugeeData);
console.log('Patient journey result:', journeyResult);
```javascript

## Performance Monitoring

### Real-time Dashboard

```javascript
// Real-time monitoring dashboard
async function updateDashboard() {
  const dashboard = {
    overview: await getCampOverview(),
    alerts: await getActiveAlerts(),
    resources: await getResourceStatus(),
    trends: await getHealthTrends(),
  };

  // Update UI components
  updateUIComponents(dashboard);

  // Send critical alerts
  dashboard.alerts
    .filter((alert) => alert.severity === 'critical')
    .forEach((alert) => sendCriticalAlert(alert));
}

async function getCampOverview() {
  const [totalPatients, activeEncounters, pendingVaccinations, emergencyCases] = await Promise.all([
    countResources('Patient'),
    countResources('Encounter', { status: 'in-progress' }),
    countResources('Immunization', { status: 'not-done' }),
    countResources('Procedure', { 'extension:emergency-type': 'trauma' }),
  ]);

  return {
    totalPatients,
    activeEncounters,
    pendingVaccinations,
    emergencyCases,
    lastUpdated: new Date().toISOString(),
  };
}
```text

This comprehensive example demonstrates how ZARISH SPHERE's FHIR R5 implementation supports complex humanitarian healthcare scenarios with real-world workflows, custom operations, and specialized extensions for displaced populations and emergency response situations.
````
