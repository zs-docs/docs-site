import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Platform',
      items: [
        {
          type: 'doc',
          id: 'platform/overview',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'platform/architecture',
          label: 'Architecture',
        },
        {
          type: 'doc',
          id: 'platform/authentication',
          label: 'Authentication',
        },
        {
          type: 'doc',
          id: 'platform/deployment',
          label: 'Deployment',
        },
      ],
    },
    {
      type: 'category',
      label: 'Health Modules',
      items: [
        {
          type: 'doc',
          id: 'health/overview',
          label: 'Overview',
        },
        {
          type: 'category',
          label: 'EMR',
          items: [
            {
              type: 'doc',
              id: 'health/emr/overview',
              label: 'EMR Overview',
            },
            'health/patient-management',
            'health/clinical-workflows',
            'health/clinical-notes',
            'health/consent-management',
            'health/audit-and-compliance',
          ],
        },
        {
          type: 'category',
          label: 'Pharmacy',
          items: [
            {
              type: 'doc',
              id: 'health/pharmacy/overview',
              label: 'Pharmacy Overview',
            },
            'health/inventory-management',
            'health/dispensing-workflows',
            'health/drug-interactions',
            'health/supplier-integration',
            'health/stock-management',
          ],
        },
        {
          type: 'category',
          label: 'Laboratory',
          items: [
            {
              type: 'doc',
              id: 'health/laboratory/overview',
              label: 'Laboratory Overview',
            },
            'health/test-ordering',
            'health/specimen-management',
            'health/result-reporting',
            'health/quality-control',
            'health/lims-integration',
          ],
        },
        {
          type: 'category',
          label: 'Billing',
          items: [
            {
              type: 'doc',
              id: 'health/billing/overview',
              label: 'Billing Overview',
            },
            'health/patient-accounts',
            'health/insurance-claims',
            'health/financial-reporting',
          ],
        },
        {
          type: 'category',
          label: 'Interoperability',
          items: [
            {
              type: 'doc',
              id: 'health/interoperability/overview',
              label: 'Interoperability Overview',
            },
            'health/hl7v2-mapping',
            'health/fhir-r5-compliance',
            'health/integration-patterns',
            'health/integration-guide',
          ],
        },
        'health/analytics',
        'health/templates-and-forms',
        'health/pacs-integration',
        'health/public-health',
        'health/barcode-rfid',
        'health/compliance',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'doc',
          id: 'api-reference/overview',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'api-reference/authentication',
          label: 'Authentication',
        },
        {
          type: 'doc',
          id: 'api-reference/endpoints',
          label: 'Endpoints',
        },
        {
          type: 'doc',
          id: 'api-reference/rest-api',
          label: 'REST API',
        },
        'api-reference/errors',
        'api-reference/event-types',
        'api-reference/examples',
        'api-reference/getting-started',
        'api-reference/mutations',
        'api-reference/proto-definitions',
        'api-reference/queries',
        'api-reference/retry-logic',
        'api-reference/schema',
        'api-reference/services',
        'api-reference/subscriptions',
      ],
    },
    {
      type: 'category',
      label: 'FHIR R5',
      items: [
        {
          type: 'doc',
          id: 'fhir-r5/overview',
          label: 'Overview',
        },
        {
          type: 'category',
          label: 'Resources',
          items: [
            'fhir-r5/patient',
            'fhir-r5/practitioner',
            'fhir-r5/observation',
            'fhir-r5/encounter',
            'fhir-r5/medication',
            'fhir-r5/condition',
            'fhir-r5/procedure',
          ],
        },
        {
          type: 'category',
          label: 'Operations',
          items: [
            'fhir-r5/search-operations',
            'fhir-r5/custom-operations',
            'fhir-r5/bulk-operations',
          ],
        },
        {
          type: 'category',
          label: 'Country Configurations',
          items: [
            {
              type: 'doc',
              id: 'fhir-r5/country-configs/bangladesh/overview',
              label: 'Bangladesh',
            },
            {
              type: 'doc',
              id: 'fhir-r5/country-configs/thailand/overview',
              label: 'Thailand',
            },
            {
              type: 'doc',
              id: 'fhir-r5/country-configs/myanmar/overview',
              label: 'Myanmar',
            },
          ],
        },
        'fhir-r5/rest-implementation',
        'fhir-r5/graphql-queries',
        'fhir-r5/error-handling',
        'fhir-r5/data-classification',
        'fhir-r5/regulatory-compliance',
        'fhir-r5/example-implementation',
        'fhir-r5/extensions',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        {
          type: 'doc',
          id: 'operations/overview',
          label: 'Overview',
        },
      ],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: [
        {
          type: 'doc',
          id: 'contributing/how-to-contribute',
          label: 'How to Contribute',
        },
        'contributing/code-of-conduct',
        'contributing/documentation-guide',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      items: [
        {
          type: 'doc',
          id: 'tools/code-checker',
          label: 'Code Checker',
        },
        {
          type: 'doc',
          id: 'tools/todo-tracker',
          label: 'TODO Tracker',
        },
        {
          type: 'doc',
          id: 'tools/auto-checker',
          label: 'Auto Checker',
        },
        {
          type: 'doc',
          id: 'tools/file-cleanup',
          label: 'File Cleanup',
        },
        {
          type: 'doc',
          id: 'tools/emr-forms',
          label: 'EMR/EHR Forms',
        },
      ],
    },
    {
      type: 'category',
      label: 'About',
      items: ['intro', 'heirarcy'],
    },
  ],
};

export default sidebars;
