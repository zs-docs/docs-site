---
title: 'Templates and Forms'
sidebar_label: 'Templates and Forms'
description: 'Comprehensive templates and forms management system for healthcare documentation in ZARISH SOAPHERE'
keywords: [templates, forms, healthcare documentation, clinical forms, zarish sphere]
---

# Templates and Forms

## Overview

ZARISH SPHERE Templates and Forms provides a comprehensive system for creating, managing, and deploying standardized healthcare documentation templates and forms. Our platform ensures consistency, compliance, and efficiency in clinical documentation while supporting various healthcare workflows and regulatory requirements.

## Template Management Architecture

### Template Framework

````text
Template and Forms Framework
├── Template Creation
│   ├── Template Designer
│   ├── Form Builder
│   ├── Field Management
│   └── Validation Rules
├── Content Management
│   ├── Template Library
│   ├── Version Control
│   ├── Approval Workflows
│   └── Publishing System
├── Form Processing
│   ├── Dynamic Forms
│   ├── Data Capture
│   ├── Validation Engine
│   └── Auto-population
├── Integration Hub
│   ├── EHR Integration
│   ├── System Sync
│   ├── Data Mapping
│   └── API Connectivity
└── Compliance & Analytics
    ├── Regulatory Compliance
    ├── Usage Analytics
    ├── Quality Metrics
    └── Audit Trails
```typescript

### Template Categories

| Category             | Description                            | Use Cases                 | Compliance              |
| -------------------- | -------------------------------------- | ------------------------- | ----------------------- |
| **Clinical Forms**   | Patient assessment and treatment forms | Clinical documentation    | HIPAA, Joint Commission |
| **Consent Forms**    | Patient consent and authorization      | Informed consent, privacy | HIPAA, GDPR             |
| **Administrative**   | Administrative and operational forms   | Registration, scheduling  | OSHA, CMS               |
| **Quality & Safety** | Quality improvement and safety forms   | Incident reports, audits  | Joint Commission        |
| **Research**         | Clinical research and study forms      | Clinical trials, studies  | FDA, IRB                |
| **Billing**          | Financial and insurance forms          | Claims, authorizations    | CMS, HIPAA              |

## Template Designer

### Visual Template Builder

```javascript
// Template designer system
class TemplateDesigner {
  constructor() {
    this.templateRepository = new TemplateRepository();
    this.fieldManager = new FieldManager();
    this.validationEngine = new ValidationEngine();
    this.renderEngine = new RenderEngine();
    this.complianceEngine = new ComplianceEngine();
  }

  // Create new template
  async createTemplate(templateData) {
    const template = {
      id: generateUUID(),
      name: templateData.name,
      category: templateData.category,
      description: templateData.description,
      version: '1.0.0',
      status: 'draft',
      sections: [],
      fields: [],
      rules: [],
      integrations: [],
      compliance: null,
      metadata: {
        createdBy: templateData.createdBy,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        tags: templateData.tags || [],
      },
    };

    try {
      // Validate template data
      const validation = await this.validateTemplateData(templateData);
      if (!validation.valid) {
        throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
      }

      // Create template sections
      const sections = await this.createTemplateSections(templateData.sections);
      template.sections = sections;

      // Create template fields
      const fields = await this.createTemplateFields(templateData.fields, sections);
      template.fields = fields;

      // Create validation rules
      const rules = await this.createValidationRules(templateData.rules, fields);
      template.rules = rules;

      // Setup integrations
      const integrations = await this.setupIntegrations(templateData.integrations);
      template.integrations = integrations;

      // Check compliance requirements
      const compliance = await this.checkComplianceRequirements(template);
      template.compliance = compliance;

      // Store template
      const savedTemplate = await this.templateRepository.create(template);

      return savedTemplate;
    } catch (error) {
      template.status = 'failed';
      template.error = error.message;

      const failedTemplate = await this.templateRepository.create(template);
      throw error;
    }
  }

  // Create template sections
  async createTemplateSections(sectionData) {
    const sections = [];

    for (const sectionConfig of sectionData) {
      const section = {
        id: generateUUID(),
        name: sectionConfig.name,
        title: sectionConfig.title,
        description: sectionConfig.description,
        order: sectionConfig.order || 0,
        type: sectionConfig.type || 'standard',
        conditional: sectionConfig.conditional || null,
        fields: [],
        layout: {
          columns: sectionConfig.layout?.columns || 1,
          spacing: sectionConfig.layout?.spacing || 'normal',
          borders: sectionConfig.layout?.borders || true,
        },
        styling: {
          backgroundColor: sectionConfig.styling?.backgroundColor || 'white',
          textColor: sectionConfig.styling?.textColor || 'black',
          fontSize: sectionConfig.styling?.fontSize || 'normal',
          fontWeight: sectionConfig.styling?.fontWeight || 'normal',
        },
      };

      sections.push(section);
    }

    // Sort sections by order
    sections.sort((a, b) => a.order - b.order);

    return sections;
  }

  // Create template fields
  async createTemplateFields(fieldData, sections) {
    const fields = [];

    for (const fieldConfig of fieldData) {
      const field = await this.createTemplateField(fieldConfig, sections);
      fields.push(field);
    }

    return fields;
  }

  // Create individual template field
  async createTemplateField(fieldConfig, sections) {
    const field = {
      id: generateUUID(),
      name: fieldConfig.name,
      label: fieldConfig.label,
      type: fieldConfig.type,
      sectionId: fieldConfig.sectionId,
      order: fieldConfig.order || 0,
      required: fieldConfig.required || false,
      readonly: fieldConfig.readonly || false,
      visible: fieldConfig.visible !== false,
      defaultValue: fieldConfig.defaultValue || null,
      placeholder: fieldConfig.placeholder || '',
      helpText: fieldConfig.helpText || '',
      validation: {
        rules: [],
        messages: {},
      },
      options: fieldConfig.options || [],
      conditional: fieldConfig.conditional || null,
      calculations: fieldConfig.calculations || [],
      integrations: fieldConfig.integrations || [],
      styling: {
        width: fieldConfig.styling?.width || '100%',
        height: fieldConfig.styling?.height || 'auto',
        backgroundColor: fieldConfig.styling?.backgroundColor || 'white',
        borderColor: fieldConfig.styling?.borderColor || '#ccc',
        fontSize: fieldConfig.styling?.fontSize || 'normal',
        fontWeight: fieldConfig.styling?.fontWeight || 'normal',
      },
    };

    // Add field-specific configuration
    switch (field.type) {
      case 'text':
        field.maxLength = fieldConfig.maxLength || 255;
        field.minLength = fieldConfig.minLength || 0;
        field.inputType = fieldConfig.inputType || 'text';
        break;
      case 'number':
        field.min = fieldConfig.min;
        field.max = fieldConfig.max;
        field.step = fieldConfig.step || 1;
        field.decimalPlaces = fieldConfig.decimalPlaces || 0;
        break;
      case 'date':
        field.dateFormat = fieldConfig.dateFormat || 'MM/DD/YYYY';
        field.minDate = fieldConfig.minDate;
        field.maxDate = fieldConfig.maxDate;
        break;
      case 'select':
      case 'radio':
      case 'checkbox':
        field.options = await this.processFieldOptions(fieldConfig.options);
        break;
      case 'file':
        field.acceptedTypes = fieldConfig.acceptedTypes || [];
        field.maxFileSize = fieldConfig.maxFileSize || 10485760; // 10MB
        field.multiple = fieldConfig.multiple || false;
        break;
    }

    // Add validation rules
    if (fieldConfig.validation) {
      field.validation.rules = await this.createFieldValidationRules(fieldConfig.validation);
    }

    return field;
  }

  // Process field options
  async processFieldOptions(options) {
    const processedOptions = [];

    for (const option of options) {
      const processedOption = {
        value: option.value,
        label: option.label,
        description: option.description || '',
        disabled: option.disabled || false,
        selected: option.selected || false,
        group: option.group || null,
        icon: option.icon || null,
        color: option.color || null,
      };

      processedOptions.push(processedOption);
    }

    return processedOptions;
  }

  // Create field validation rules
  async createFieldValidationRules(validationConfig) {
    const rules = [];

    for (const ruleConfig of validationConfig) {
      const rule = {
        type: ruleConfig.type,
        message: ruleConfig.message,
        parameters: ruleConfig.parameters || {},
        condition: ruleConfig.condition || null,
        custom: ruleConfig.custom || null,
      };

      rules.push(rule);
    }

    return rules;
  }

  // Create validation rules for template
  async createValidationRules(rulesData, fields) {
    const rules = [];

    for (const ruleConfig of rulesData) {
      const rule = {
        id: generateUUID(),
        name: ruleConfig.name,
        type: ruleConfig.type, // 'field', 'section', 'cross-field', 'custom'
        description: ruleConfig.description,
        conditions: [],
        actions: [],
        active: ruleConfig.active !== false,
      };

      // Process rule conditions
      if (ruleConfig.conditions) {
        for (const conditionConfig of ruleConfig.conditions) {
          const condition = {
            fieldId: conditionConfig.fieldId,
            operator: conditionConfig.operator, // 'equals', 'not_equals', 'greater_than', etc.
            value: conditionConfig.value,
            logicalOperator: conditionConfig.logicalOperator || 'and',
          };

          rule.conditions.push(condition);
        }
      }

      // Process rule actions
      if (ruleConfig.actions) {
        for (const actionConfig of ruleConfig.actions) {
          const action = {
            type: actionConfig.type, // 'show', 'hide', 'require', 'disable', 'calculate'
            targetId: actionConfig.targetId,
            value: actionConfig.value,
            message: actionConfig.message,
          };

          rule.actions.push(action);
        }
      }

      rules.push(rule);
    }

    return rules;
  }

  // Setup integrations
  async setupIntegrations(integrationData) {
    const integrations = [];

    for (const integrationConfig of integrationData) {
      const integration = {
        id: generateUUID(),
        type: integrationConfig.type,
        name: integrationConfig.name,
        description: integrationConfig.description,
        configuration: integrationConfig.configuration || {},
        mappings: integrationConfig.mappings || [],
        active: integrationConfig.active !== false,
      };

      integrations.push(integration);
    }

    return integrations;
  }

  // Check compliance requirements
  async checkComplianceRequirements(template) {
    const compliance = {
      frameworks: [],
      requirements: [],
      gaps: [],
      score: 0,
      status: 'pending',
    };

    // Determine applicable compliance frameworks
    const applicableFrameworks = this.getApplicableFrameworks(template);
    compliance.frameworks = applicableFrameworks;

    // Check each framework
    for (const framework of applicableFrameworks) {
      const frameworkCheck = await this.checkFrameworkCompliance(template, framework);
      compliance.requirements.push(...frameworkCheck.requirements);
      compliance.gaps.push(...frameworkCheck.gaps);
    }

    // Calculate compliance score
    compliance.score = this.calculateComplianceScore(compliance);
    compliance.status = compliance.score >= 80 ? 'compliant' : 'non_compliant';

    return compliance;
  }

  // Get applicable frameworks
  getApplicableFrameworks(template) {
    const frameworks = [];

    // Always include HIPAA for healthcare templates
    frameworks.push('HIPAA');

    // Add framework based on category
    switch (template.category) {
      case 'clinical':
        frameworks.push('Joint_Commission');
        break;
      case 'research':
        frameworks.push('FDA', 'IRB');
        break;
      case 'billing':
        frameworks.push('CMS');
        break;
      case 'consent':
        frameworks.push('GDPR');
        break;
    }

    return frameworks;
  }

  // Check framework compliance
  async checkFrameworkCompliance(template, framework) {
    const check = {
      framework: framework,
      requirements: [],
      gaps: [],
      score: 0,
    };

    const frameworkRequirements = this.getFrameworkRequirements(framework);

    for (const requirement of frameworkRequirements) {
      const requirementCheck = await this.checkRequirement(template, requirement);
      check.requirements.push(requirementCheck);

      if (!requirementCheck.compliant) {
        check.gaps.push({
          requirement: requirement.id,
          description: requirement.description,
          issue: requirementCheck.issue,
          severity: requirement.severity,
        });
      }
    }

    check.score = this.calculateFrameworkScore(check);
    return check;
  }

  // Get framework requirements
  getFrameworkRequirements(framework) {
    const requirements = {
      HIPAA: [
        {
          id: 'hipaa_phi',
          description: 'Protected Health Information (PHI) handling',
          severity: 'critical',
          check: 'phi_protection',
        },
        {
          id: 'hipaa_access',
          description: 'Access controls and authentication',
          severity: 'high',
          check: 'access_control',
        },
        {
          id: 'hipaa_audit',
          description: 'Audit trail and logging',
          severity: 'high',
          check: 'audit_trail',
        },
      ],
      Joint_Commission: [
        {
          id: 'jc_documentation',
          description: 'Clinical documentation standards',
          severity: 'high',
          check: 'documentation_standards',
        },
        {
          id: 'jc_patient_safety',
          description: 'Patient safety indicators',
          severity: 'critical',
          check: 'patient_safety',
        },
      ],
      FDA: [
        {
          id: 'fda_informed_consent',
          description: 'Informed consent requirements',
          severity: 'critical',
          check: 'informed_consent',
        },
        {
          id: 'fda_adverse_events',
          description: 'Adverse event reporting',
          severity: 'high',
          check: 'adverse_event_reporting',
        },
      ],
    };

    return requirements[framework] || [];
  }

  // Check individual requirement
  async checkRequirement(template, requirement) {
    const check = {
      requirement: requirement.id,
      compliant: false,
      issue: null,
      evidence: [],
    };

    switch (requirement.check) {
      case 'phi_protection':
        check.compliant = await this.checkPHIProtection(template);
        if (!check.compliant) {
          check.issue = 'Template contains fields that may handle PHI without proper protection';
        }
        break;
      case 'access_control':
        check.compliant = await this.checkAccessControl(template);
        if (!check.compliant) {
          check.issue = 'Template lacks proper access control mechanisms';
        }
        break;
      case 'audit_trail':
        check.compliant = await this.checkAuditTrail(template);
        if (!check.compliant) {
          check.issue = 'Template does not support audit trail functionality';
        }
        break;
      case 'documentation_standards':
        check.compliant = await this.checkDocumentationStandards(template);
        if (!check.compliant) {
          check.issue = 'Template does not meet clinical documentation standards';
        }
        break;
      case 'patient_safety':
        check.compliant = await this.checkPatientSafety(template);
        if (!check.compliant) {
          check.issue = 'Template lacks patient safety features';
        }
        break;
      case 'informed_consent':
        check.compliant = await this.checkInformedConsent(template);
        if (!check.compliant) {
          check.issue = 'Template does not meet informed consent requirements';
        }
        break;
      case 'adverse_event_reporting':
        check.compliant = await this.checkAdverseEventReporting(template);
        if (!check.compliant) {
          check.issue = 'Template does not support adverse event reporting';
        }
        break;
    }

    return check;
  }
}
```javascript

## Form Processing

### Dynamic Form Engine

```javascript
// Dynamic form processing system
class DynamicFormEngine {
  constructor() {
    this.formRepository = new FormRepository();
    this.templateEngine = new TemplateEngine();
    this.validationEngine = new ValidationEngine();
    this.dataProcessor = new DataProcessor();
    this.integrationEngine = new IntegrationEngine();
  }

  // Generate form from template
  async generateForm(templateId, context) {
    const form = {
      id: generateUUID(),
      templateId: templateId,
      context: context,
      sections: [],
      fields: [],
      data: {},
      status: 'generated',
      rendered: null,
      createdAt: new Date().toISOString(),
    };

    try {
      // Get template
      const template = await this.templateEngine.getTemplate(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      // Process template sections
      form.sections = await this.processTemplateSections(template.sections, context);

      // Process template fields
      form.fields = await this.processTemplateFields(template.fields, context);

      // Initialize form data
      form.data = await this.initializeFormData(form.fields, context);

      // Apply conditional logic
      await this.applyConditionalLogic(form);

      // Render form
      form.rendered = await this.renderForm(form);

      form.status = 'ready';

      const savedForm = await this.formRepository.create(form);
      return savedForm;
    } catch (error) {
      form.status = 'failed';
      form.error = error.message;

      const failedForm = await this.formRepository.create(form);
      throw error;
    }
  }

  // Process template sections
  async processTemplateSections(sections, context) {
    const processedSections = [];

    for (const section of sections) {
      const processedSection = {
        ...section,
        visible: await this.evaluateSectionCondition(section, context),
      };

      processedSections.push(processedSection);
    }

    return processedSections;
  }

  // Process template fields
  async processTemplateFields(fields, context) {
    const processedFields = [];

    for (const field of fields) {
      const processedField = {
        ...field,
        visible: await this.evaluateFieldCondition(field, context),
        readonly: await this.evaluateFieldReadonly(field, context),
        value: await this.getInitialFieldValue(field, context),
        options: await this.processFieldOptions(field, context),
      };

      processedFields.push(processedField);
    }

    return processedFields;
  }

  // Evaluate section condition
  async evaluateSectionCondition(section, context) {
    if (!section.conditional) {
      return true;
    }

    return await this.evaluateCondition(section.conditional, context);
  }

  // Evaluate field condition
  async evaluateFieldCondition(field, context) {
    if (!field.conditional) {
      return true;
    }

    return await this.evaluateCondition(field.conditional, context);
  }

  // Evaluate condition
  async evaluateCondition(conditional, context) {
    try {
      // Parse condition expression
      const expression = this.parseConditionExpression(conditional.expression);

      // Evaluate expression with context
      const result = await this.evaluateExpression(expression, context);

      return result;
    } catch (error) {
      console.error(`Error evaluating condition: ${error.message}`);
      return true; // Default to visible if condition fails
    }
  }

  // Parse condition expression
  parseConditionExpression(expression) {
    // Simple expression parser for conditions like "field1 == 'value'"
    const operators = ['==', '!=', '>', '<', '>=', '<=', 'contains', 'in', 'not in'];

    for (const operator of operators) {
      if (expression.includes(operator)) {
        const parts = expression.split(operator);
        return {
          left: parts[0].trim(),
          operator: operator,
          right: parts[1].trim(),
        };
      }
    }

    return {
      left: expression,
      operator: 'exists',
      right: null,
    };
  }

  // Evaluate expression
  async evaluateExpression(expression, context) {
    const leftValue = this.getExpressionValue(expression.left, context);
    const rightValue = expression.right ? this.getExpressionValue(expression.right, context) : null;

    switch (expression.operator) {
      case '==':
        return leftValue == rightValue;
      case '!=':
        return leftValue != rightValue;
      case '>':
        return leftValue > rightValue;
      case '<':
        return leftValue < rightValue;
      case '>=':
        return leftValue >= rightValue;
      case '<=':
        return leftValue <= rightValue;
      case 'contains':
        return String(leftValue).includes(String(rightValue));
      case 'in':
        return Array.isArray(rightValue) && rightValue.includes(leftValue);
      case 'not in':
        return Array.isArray(rightValue) && !rightValue.includes(leftValue);
      case 'exists':
        return leftValue !== null && leftValue !== undefined && leftValue !== '';
      default:
        return true;
    }
  }

  // Get expression value
  getExpressionValue(path, context) {
    // Simple path resolution (e.g., "patient.age", "form.field1")
    const parts = path.split('.');
    let value = context;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return null;
      }
    }

    return value;
  }

  // Get initial field value
  async getInitialFieldValue(field, context) {
    // Check for default value
    if (field.defaultValue !== null) {
      return field.defaultValue;
    }

    // Check for auto-population from context
    if (field.integrations && field.integrations.length > 0) {
      for (const integration of field.integrations) {
        const value = await this.getIntegrationValue(integration, context);
        if (value !== null) {
          return value;
        }
      }
    }

    return null;
  }

  // Get integration value
  async getIntegrationValue(integration, context) {
    switch (integration.type) {
      case 'ehr':
        return await this.getEHRValue(integration, context);
      case 'api':
        return await this.getAPIValue(integration, context);
      case 'database':
        return await this.getDatabaseValue(integration, context);
      default:
        return null;
    }
  }

  // Get EHR value
  async getEHRValue(integration, context) {
    // Simulate EHR integration
    if (integration.source === 'patient' && context.patient) {
      return context.patient[integration.field];
    }
    return null;
  }

  // Apply conditional logic
  async applyConditionalLogic(form) {
    // Apply field-level conditional logic
    for (const field of form.fields) {
      if (field.conditional) {
        field.visible = await this.evaluateFieldCondition(field, form.context);
      }
    }

    // Apply section-level conditional logic
    for (const section of form.sections) {
      if (section.conditional) {
        section.visible = await this.evaluateSectionCondition(section, form.context);
      }
    }

    // Apply template-level rules
    if (form.template.rules) {
      await this.applyTemplateRules(form);
    }
  }

  // Apply template rules
  async applyTemplateRules(form) {
    for (const rule of form.template.rules) {
      if (!rule.active) continue;

      // Evaluate rule conditions
      let conditionsMet = true;
      for (const condition of rule.conditions) {
        const conditionMet = await this.evaluateCondition(condition, form.context);
        if (condition.logicalOperator === 'or') {
          conditionsMet = conditionsMet || conditionMet;
        } else {
          conditionsMet = conditionsMet && conditionMet;
        }
      }

      // Apply rule actions if conditions are met
      if (conditionsMet) {
        await this.applyRuleActions(form, rule);
      }
    }
  }

  // Apply rule actions
  async applyRuleActions(form, rule) {
    for (const action of rule.actions) {
      switch (action.type) {
        case 'show':
          await this.showField(form, action.targetId);
          break;
        case 'hide':
          await this.hideField(form, action.targetId);
          break;
        case 'require':
          await this.requireField(form, action.targetId);
          break;
        case 'disable':
          await this.disableField(form, action.targetId);
          break;
        case 'calculate':
          await this.calculateField(form, action.targetId, action.value);
          break;
      }
    }
  }

  // Show field
  async showField(form, fieldId) {
    const field = form.fields.find((f) => f.id === fieldId);
    if (field) {
      field.visible = true;
    }
  }

  // Hide field
  async hideField(form, fieldId) {
    const field = form.fields.find((f) => f.id === fieldId);
    if (field) {
      field.visible = false;
    }
  }

  // Require field
  async requireField(form, fieldId) {
    const field = form.fields.find((f) => f.id === fieldId);
    if (field) {
      field.required = true;
    }
  }

  // Disable field
  async disableField(form, fieldId) {
    const field = form.fields.find((f) => f.id === fieldId);
    if (field) {
      field.readonly = true;
    }
  }

  // Calculate field
  async calculateField(form, fieldId, calculation) {
    const field = form.fields.find((f) => f.id === fieldId);
    if (field) {
      const result = await this.evaluateCalculation(calculation, form);
      field.value = result;
    }
  }

  // Evaluate calculation
  async evaluateCalculation(calculation, form) {
    // Simple calculation evaluator
    // This is a simplified implementation
    try {
      // Replace field references with actual values
      let expression = calculation;

      for (const field of form.fields) {
        const fieldRegex = new RegExp(`\\b${field.name}\\b`, 'g');
        expression = expression.replace(fieldRegex, field.value || 0);
      }

      // Evaluate the expression
      // Note: In production, use a safe expression evaluator
      return eval(expression);
    } catch (error) {
      console.error(`Calculation error: ${error.message}`);
      return null;
    }
  }

  // Render form
  async renderForm(form) {
    const rendered = {
      id: form.id,
      title: form.context.title || 'Untitled Form',
      sections: [],
      metadata: {
        renderedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    };

    // Render sections
    for (const section of form.sections) {
      if (!section.visible) continue;

      const renderedSection = {
        id: section.id,
        name: section.name,
        title: section.title,
        description: section.description,
        fields: [],
        layout: section.layout,
        styling: section.styling,
      };

      // Render fields in section
      for (const field of form.fields) {
        if (!field.visible || field.sectionId !== section.id) continue;

        const renderedField = await this.renderField(field);
        renderedSection.fields.push(renderedField);
      }

      rendered.sections.push(renderedSection);
    }

    return rendered;
  }

  // Render field
  async renderField(field) {
    const renderedField = {
      id: field.id,
      name: field.name,
      label: field.label,
      type: field.type,
      value: field.value,
      placeholder: field.placeholder,
      helpText: field.helpText,
      required: field.required,
      readonly: field.readonly,
      options: field.options,
      validation: field.validation,
      styling: field.styling,
    };

    return renderedField;
  }
}
```text

This comprehensive templates and forms system provides healthcare organizations with powerful tools for creating standardized, compliant, and efficient documentation while ensuring regulatory compliance and improving clinical workflow efficiency.
````
