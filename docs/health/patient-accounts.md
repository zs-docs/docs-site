---
title: 'Patient Accounts'
sidebar_label: 'Patient Accounts'
description: 'Comprehensive patient financial account management system for ZARISH SPHERE'
keywords: [patient accounts, patient billing, financial management, healthcare, zarish sphere]
---

# Patient Accounts

## Overview

ZARISH SPHERE Patient Accounts provides a comprehensive financial management system for patient accounts, handling everything from initial registration through final payment collection. Our system streamlines patient financial interactions, ensures accurate billing, and provides transparency throughout the financial care journey while supporting various payment methods and financial assistance programs.

## Account Management

### Patient Account Lifecycle

````text
Patient Account Lifecycle
├── Account Creation
│   ├── Patient Registration
│   ├── Insurance Verification
│   ├── Financial Profile Setup
│   └── Payment Method Registration
├── Charge Management
│   ├── Service Charges
│   ├── Insurance Adjustments
│   ├── Patient Responsibility
│   └── Payment Plans
├── Billing Operations
│   ├── Statement Generation
│   ├── Invoice Creation
│   ├── Payment Processing
│   └── Balance Management
├── Collections Management
│   ├── Payment Reminders
│   ├── Collection Strategies
│   ├── Financial Assistance
│   └── Bad Debt Management
└── Reporting & Analytics
    ├── Account Aging
    ├── Revenue Analysis
    ├── Payment Trends
    └── Financial Health Metrics
```javascript

### Account Structure

| Component                | Function                  | Integration         | Key Metrics              |
| ------------------------ | ------------------------- | ------------------- | ------------------------ |
| **Account Setup**        | Patient financial profile | Registration System | Setup completion rate    |
| **Insurance Management** | Coverage verification     | Payer Systems       | Eligibility confirmation |
| **Charge Posting**       | Service cost allocation   | Clinical Systems    | Charge accuracy          |
| **Statement Generation** | Patient billing           | Billing System      | Statement delivery rate  |
| **Payment Processing**   | Revenue collection        | Payment Systems     | Collection rate          |
| **Balance Management**   | Account reconciliation    | Financial System    | Days in A/R              |

## Account Creation and Setup

### Patient Financial Profile

```javascript
// Patient account management system
class PatientAccountManager {
  constructor() {
    this.accountRepository = new AccountRepository();
    this.insuranceService = new InsuranceService();
    this.billingEngine = new BillingEngine();
    this.paymentProcessor = new PaymentProcessor();
    this.notificationService = new NotificationService();
  }

  // Create patient account
  async createPatientAccount(patientData) {
    const account = {
      id: generateUUID(),
      patientId: patientData.patientId,
      accountNumber: this.generateAccountNumber(),
      status: 'active',
      createdAt: new Date().toISOString(),
      profile: {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        dateOfBirth: patientData.dateOfBirth,
        contactInfo: patientData.contactInfo,
        address: patientData.address,
        emergencyContact: patientData.emergencyContact,
      },
      financial: {
        paymentMethods: [],
        insurancePolicies: [],
        financialAssistance: null,
        creditScore: null,
        paymentHistory: [],
      },
      billing: {
        preferredLanguage: patientData.preferredLanguage || 'en',
        statementDelivery: patientData.statementDelivery || 'electronic',
        paymentPlan: null,
        autopay: false,
      },
    };

    // Verify and add insurance policies
    if (patientData.insurancePolicies) {
      account.financial.insurancePolicies = await this.verifyInsurancePolicies(
        patientData.insurancePolicies,
        patientData.patientId
      );
    }

    // Register payment methods
    if (patientData.paymentMethods) {
      account.financial.paymentMethods = await this.registerPaymentMethods(
        patientData.paymentMethods
      );
    }

    // Check for financial assistance eligibility
    account.financial.financialAssistance = await this.assessFinancialAssistance(
      patientData.financialInfo
    );

    // Save account
    const savedAccount = await this.accountRepository.create(account);

    // Send welcome notification
    await this.notificationService.sendWelcomeNotification(savedAccount);

    return savedAccount;
  }

  // Verify insurance policies
  async verifyInsurancePolicies(policies, patientId) {
    const verifiedPolicies = [];

    for (const policy of policies) {
      try {
        const verification = await this.insuranceService.verifyEligibility({
          patientId: patientId,
          policyNumber: policy.policyNumber,
          payerId: policy.payerId,
          groupId: policy.groupId,
          subscriberInfo: policy.subscriberInfo,
        });

        verifiedPolicies.push({
          ...policy,
          verification: verification,
          status: verification.eligible ? 'active' : 'inactive',
          verifiedAt: new Date().toISOString(),
        });
      } catch (error) {
        verifiedPolicies.push({
          ...policy,
          status: 'verification_failed',
          error: error.message,
          verifiedAt: new Date().toISOString(),
        });
      }
    }

    return verifiedPolicies;
  }

  // Register payment methods
  async registerPaymentMethods(paymentMethods) {
    const registeredMethods = [];

    for (const method of paymentMethods) {
      try {
        const registration = await this.paymentProcessor.registerPaymentMethod({
          type: method.type,
          token: await this.tokenizePaymentMethod(method),
          isDefault: method.isDefault || false,
          billingAddress: method.billingAddress,
        });

        registeredMethods.push({
          id: registration.methodId,
          type: method.type,
          lastFour: method.lastFour,
          expiryDate: method.expiryDate,
          isDefault: method.isDefault || false,
          status: 'active',
          registeredAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Failed to register payment method: ${error.message}`);
      }
    }

    return registeredMethods;
  }

  // Assess financial assistance eligibility
  async assessFinancialAssistance(financialInfo) {
    const assessment = {
      eligible: false,
      programs: [],
      requiredDocuments: [],
      applicationStatus: 'not_applied',
    };

    // Check income eligibility
    if (financialInfo.annualIncome) {
      const federalPovertyLevel = await this.getFederalPovertyLevel(financialInfo.householdSize);
      const incomeRatio = financialInfo.annualIncome / federalPovertyLevel;

      if (incomeRatio <= 2.0) {
        assessment.eligible = true;
        assessment.programs.push('sliding_scale');
      }

      if (incomeRatio <= 1.5) {
        assessment.programs.push('charity_care');
      }
    }

    // Check for special programs
    if (financialInfo.specialCircumstances) {
      assessment.programs.push(
        ...(await this.checkSpecialPrograms(financialInfo.specialCircumstances))
      );
    }

    // Generate required documents list
    assessment.requiredDocuments = this.generateRequiredDocuments(assessment.programs);

    return assessment;
  }
}
```javascript

### Account Updates and Maintenance

```javascript
// Account maintenance and updates
class AccountMaintenance {
  constructor() {
    this.accountRepository = new AccountRepository();
    this.auditLogger = new AuditLogger();
    this.validationEngine = new ValidationEngine();
  }

  // Update patient profile
  async updatePatientProfile(accountId, profileUpdates, userId) {
    const account = await this.accountRepository.getAccount(accountId);
    const originalProfile = JSON.parse(JSON.stringify(account.profile));

    try {
      // Validate updates
      const validation = await this.validationEngine.validateProfileUpdates(profileUpdates);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Apply updates
      Object.assign(account.profile, profileUpdates);
      account.updatedAt = new Date().toISOString();
      account.updatedBy = userId;

      // Save updated account
      const updatedAccount = await this.accountRepository.update(account);

      // Log changes
      await this.auditLogger.logProfileUpdate({
        accountId: accountId,
        userId: userId,
        originalProfile: originalProfile,
        updatedProfile: account.profile,
        timestamp: new Date().toISOString(),
      });

      return updatedAccount;
    } catch (error) {
      await this.auditLogger.logError({
        accountId: accountId,
        userId: userId,
        operation: 'profile_update',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  // Add insurance policy
  async addInsurancePolicy(accountId, policyData, userId) {
    const account = await this.accountRepository.getAccount(accountId);

    try {
      // Verify new policy
      const verification = await this.insuranceService.verifyEligibility({
        patientId: account.patientId,
        ...policyData,
      });

      const newPolicy = {
        id: generateUUID(),
        ...policyData,
        verification: verification,
        status: verification.eligible ? 'active' : 'inactive',
        addedAt: new Date().toISOString(),
        addedBy: userId,
      };

      // Add to account
      account.financial.insurancePolicies.push(newPolicy);
      account.updatedAt = new Date().toISOString();
      account.updatedBy = userId;

      // Save updated account
      const updatedAccount = await this.accountRepository.update(account);

      // Log addition
      await this.auditLogger.logInsuranceAddition({
        accountId: accountId,
        policyId: newPolicy.id,
        userId: userId,
        verification: verification,
        timestamp: new Date().toISOString(),
      });

      return updatedAccount;
    } catch (error) {
      await this.auditLogger.logError({
        accountId: accountId,
        userId: userId,
        operation: 'add_insurance',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  // Update payment method
  async updatePaymentMethod(accountId, methodId, updates, userId) {
    const account = await this.accountRepository.getAccount(accountId);
    const methodIndex = account.financial.paymentMethods.findIndex((m) => m.id === methodId);

    if (methodIndex === -1) {
      throw new Error(`Payment method not found: ${methodId}`);
    }

    try {
      const originalMethod = JSON.parse(
        JSON.stringify(account.financial.paymentMethods[methodIndex])
      );

      // Apply updates
      Object.assign(account.financial.paymentMethods[methodIndex], updates);
      account.financial.paymentMethods[methodIndex].updatedAt = new Date().toISOString();
      account.financial.paymentMethods[methodIndex].updatedBy = userId;

      account.updatedAt = new Date().toISOString();
      account.updatedBy = userId;

      // Save updated account
      const updatedAccount = await this.accountRepository.update(account);

      // Log changes
      await this.auditLogger.logPaymentMethodUpdate({
        accountId: accountId,
        methodId: methodId,
        userId: userId,
        originalMethod: originalMethod,
        updatedMethod: account.financial.paymentMethods[methodIndex],
        timestamp: new Date().toISOString(),
      });

      return updatedAccount;
    } catch (error) {
      await this.auditLogger.logError({
        accountId: accountId,
        methodId: methodId,
        userId: userId,
        operation: 'update_payment_method',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
}
```javascript

## Charge Management

### Service Charge Processing

```javascript
// Charge management system
class ChargeManager {
  constructor() {
    this.chargeRepository = new ChargeRepository();
    this.pricingEngine = new PricingEngine();
    this.insuranceEngine = new InsuranceEngine();
    this.billingEngine = new BillingEngine();
  }

  // Create charge from service
  async createCharge(serviceData) {
    const charge = {
      id: generateUUID(),
      patientId: serviceData.patientId,
      encounterId: serviceData.encounterId,
      serviceId: serviceData.serviceId,
      serviceDate: serviceData.serviceDate,
      serviceType: serviceData.serviceType,
      description: serviceData.description,
      quantity: serviceData.quantity || 1,
      unitPrice: await this.pricingEngine.getUnitPrice(serviceData),
      totalPrice: 0,
      adjustments: [],
      patientResponsibility: 0,
      insuranceResponsibility: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Calculate total price
    charge.totalPrice = charge.unitPrice * charge.quantity;

    // Apply insurance adjustments
    const insuranceAdjustments = await this.insuranceEngine.calculateAdjustments(charge);
    charge.adjustments.push(...insuranceAdjustments);

    // Calculate responsibilities
    const responsibilities = await this.calculateResponsibilities(charge);
    charge.patientResponsibility = responsibilities.patient;
    charge.insuranceResponsibility = responsibilities.insurance;

    // Save charge
    const savedCharge = await this.chargeRepository.create(charge);

    return savedCharge;
  }

  // Calculate financial responsibilities
  async calculateResponsibilities(charge) {
    const responsibilities = {
      patient: 0,
      insurance: 0,
      adjustments: [],
    };

    // Get patient insurance coverage
    const coverage = await this.insuranceEngine.getCoverage(charge.patientId, charge.serviceDate);

    if (coverage && coverage.length > 0) {
      // Apply primary insurance
      const primaryCoverage = coverage.find((c) => c.priority === 1);
      if (primaryCoverage) {
        const primaryPayment = await this.calculateInsurancePayment(charge, primaryCoverage);
        responsibilities.insurance += primaryPayment.amount;
        responsibilities.adjustments.push(primaryPayment.adjustment);
      }

      // Apply secondary insurance if needed
      const remainingBalance = charge.totalPrice - responsibilities.insurance;
      if (remainingBalance > 0) {
        const secondaryCoverage = coverage.find((c) => c.priority === 2);
        if (secondaryCoverage) {
          const secondaryPayment = await this.calculateInsurancePayment(
            { ...charge, totalPrice: remainingBalance },
            secondaryCoverage
          );
          responsibilities.insurance += secondaryPayment.amount;
          responsibilities.adjustments.push(secondaryPayment.adjustment);
        }
      }
    }

    // Calculate patient responsibility
    responsibilities.patient = charge.totalPrice - responsibilities.insurance;

    return responsibilities;
  }

  // Calculate insurance payment
  async calculateInsurancePayment(charge, coverage) {
    const payment = {
      amount: 0,
      adjustment: {
        type: 'insurance_adjustment',
        amount: 0,
        reason: '',
      },
    };

    // Apply coverage rules
    if (coverage.coinsurance) {
      payment.amount = charge.totalPrice * (1 - coverage.coinsurance);
      payment.adjustment.amount = charge.totalPrice * coverage.coinsurance;
      payment.adjustment.reason = `Coinsurance ${coverage.coinsurance * 100}%`;
    } else if (coverage.copay) {
      payment.amount = Math.max(0, charge.totalPrice - coverage.copay);
      payment.adjustment.amount = coverage.copay;
      payment.adjustment.reason = 'Copayment';
    } else {
      payment.amount = charge.totalPrice;
    }

    // Apply deductible
    if (coverage.deductible && coverage.deductibleRemaining > 0) {
      const deductibleAmount = Math.min(payment.amount, coverage.deductibleRemaining);
      payment.amount -= deductibleAmount;
      payment.adjustment.amount += deductibleAmount;
      payment.adjustment.reason += ' + Deductible';
    }

    return payment;
  }

  // Post charges to patient account
  async postChargesToAccount(patientId, charges) {
    const account = await this.accountRepository.getAccountByPatientId(patientId);

    // Add charges to account
    for (const charge of charges) {
      account.charges.push({
        ...charge,
        postedAt: new Date().toISOString(),
        status: 'posted',
      });
    }

    // Update account balance
    account.currentBalance = await this.calculateAccountBalance(account);
    account.lastUpdated = new Date().toISOString();

    // Save updated account
    const updatedAccount = await this.accountRepository.update(account);

    return updatedAccount;
  }

  // Calculate account balance
  async calculateAccountBalance(account) {
    let totalCharges = 0;
    let totalPayments = 0;

    // Sum charges
    for (const charge of account.charges) {
      totalCharges += charge.patientResponsibility;
    }

    // Sum payments
    for (const payment of account.payments) {
      totalPayments += payment.amount;
    }

    return totalCharges - totalPayments;
  }
}
```javascript

## Billing and Statements

### Statement Generation

```javascript
// Statement generation system
class StatementGenerator {
  constructor() {
    this.statementRepository = new StatementRepository();
    this.templateEngine = new TemplateEngine();
    this.deliveryService = new DeliveryService();
    this.billingEngine = new BillingEngine();
  }

  // Generate monthly statements
  async generateMonthlyStatements(cutoffDate) {
    const accounts = await this.getAccountsWithActivity(cutoffDate);
    const statements = [];

    for (const account of accounts) {
      try {
        const statement = await this.generateStatement(account, cutoffDate);
        statements.push(statement);
      } catch (error) {
        console.error(`Failed to generate statement for account ${account.id}: ${error.message}`);
      }
    }

    return statements;
  }

  // Generate individual statement
  async generateStatement(account, cutoffDate) {
    const statement = {
      id: generateUUID(),
      accountId: account.id,
      patientId: account.patientId,
      statementNumber: this.generateStatementNumber(),
      period: {
        startDate: cutoffDate,
        endDate: new Date(cutoffDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      charges: await this.getChargesForPeriod(account.id, cutoffDate),
      payments: await this.getPaymentsForPeriod(account.id, cutoffDate),
      previousBalance: await this.getPreviousBalance(account.id, cutoffDate),
      generatedAt: new Date().toISOString(),
      status: 'generated',
    };

    // Calculate totals
    statement.totalCharges = statement.charges.reduce((sum, charge) => sum + charge.amount, 0);
    statement.totalPayments = statement.payments.reduce((sum, payment) => sum + payment.amount, 0);
    statement.currentBalance =
      statement.previousBalance + statement.totalCharges - statement.totalPayments;
    statement.dueDate = this.calculateDueDate(statement.generatedAt);

    // Format statement content
    statement.content = await this.formatStatementContent(statement, account);

    // Save statement
    const savedStatement = await this.statementRepository.create(statement);

    return savedStatement;
  }

  // Format statement content
  async formatStatementContent(statement, account) {
    const templateData = {
      patient: account.profile,
      account: account,
      statement: statement,
      charges: statement.charges,
      payments: statement.payments,
      summary: {
        previousBalance: statement.previousBalance,
        totalCharges: statement.totalCharges,
        totalPayments: statement.totalPayments,
        currentBalance: statement.currentBalance,
        dueDate: statement.dueDate,
      },
    };

    // Generate HTML statement
    const htmlContent = await this.templateEngine.render('statement_html', templateData);

    // Generate PDF statement
    const pdfContent = await this.templateEngine.renderPDF('statement_pdf', templateData);

    return {
      html: htmlContent,
      pdf: pdfContent,
      text: await this.templateEngine.render('statement_text', templateData),
    };
  }

  // Deliver statement
  async deliverStatement(statementId) {
    const statement = await this.statementRepository.getStatement(statementId);
    const account = await this.accountRepository.getAccount(statement.accountId);

    try {
      // Deliver based on patient preference
      if (account.billing.statementDelivery === 'electronic') {
        await this.deliverElectronicStatement(statement, account);
      } else if (account.billing.statementDelivery === 'paper') {
        await this.deliverPaperStatement(statement, account);
      } else {
        // Deliver both
        await this.deliverElectronicStatement(statement, account);
        await this.deliverPaperStatement(statement, account);
      }

      // Update statement status
      statement.status = 'delivered';
      statement.deliveredAt = new Date().toISOString();

      await this.statementRepository.update(statement);

      return statement;
    } catch (error) {
      statement.status = 'delivery_failed';
      statement.error = error.message;
      await this.statementRepository.update(statement);
      throw error;
    }
  }

  // Deliver electronic statement
  async deliverElectronicStatement(statement, account) {
    const emailContent = {
      to: account.profile.contactInfo.email,
      subject: `Your Medical Statement - ${statement.statementNumber}`,
      html: statement.content.html,
      attachments: [
        {
          filename: `statement_${statement.statementNumber}.pdf`,
          content: statement.content.pdf,
        },
      ],
    };

    await this.deliveryService.sendEmail(emailContent);
  }

  // Deliver paper statement
  async deliverPaperStatement(statement, account) {
    const printJob = {
      statementId: statement.id,
      recipient: {
        name: `${account.profile.firstName} ${account.profile.lastName}`,
        address: account.profile.address,
      },
      content: statement.content.pdf,
      priority: 'standard',
    };

    await this.deliveryService.sendMail(printJob);
  }
}
```javascript

## Payment Processing

### Payment Management

```javascript
// Payment processing system
class PaymentProcessor {
  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.gateway = new PaymentGateway();
    this.reconciliationEngine = new ReconciliationEngine();
    this.notificationService = new NotificationService();
  }

  // Process payment
  async processPayment(paymentData) {
    const payment = {
      id: generateUUID(),
      accountId: paymentData.accountId,
      patientId: paymentData.patientId,
      amount: paymentData.amount,
      method: paymentData.method,
      methodId: paymentData.methodId,
      reference: paymentData.reference,
      description: paymentData.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Validate payment
      await this.validatePayment(payment);

      // Process through payment gateway
      const gatewayResult = await this.gateway.processPayment({
        amount: payment.amount,
        method: payment.method,
        methodId: payment.methodId,
        reference: payment.reference,
      });

      // Update payment with gateway result
      payment.gatewayTransactionId = gatewayResult.transactionId;
      payment.gatewayStatus = gatewayResult.status;

      if (gatewayResult.success) {
        payment.status = 'completed';
        payment.completedAt = new Date().toISOString();
        payment.gatewayFee = gatewayResult.fee;
        payment.netAmount = payment.amount - payment.gatewayFee;

        // Update account balance
        await this.updateAccountBalance(payment.accountId, payment.amount);

        // Send confirmation
        await this.sendPaymentConfirmation(payment);
      } else {
        payment.status = 'failed';
        payment.error = gatewayResult.error;
        payment.failedAt = new Date().toISOString();
      }

      // Save payment
      const savedPayment = await this.paymentRepository.create(payment);

      return savedPayment;
    } catch (error) {
      payment.status = 'error';
      payment.error = error.message;
      payment.errorAt = new Date().toISOString();

      const savedPayment = await this.paymentRepository.create(payment);
      throw error;
    }
  }

  // Process recurring payment
  async processRecurringPayment(paymentPlanId) {
    const paymentPlan = await this.getPaymentPlan(paymentPlanId);

    if (!paymentPlan.isActive) {
      throw new Error(`Payment plan is not active: ${paymentPlanId}`);
    }

    const paymentData = {
      accountId: paymentPlan.accountId,
      patientId: paymentPlan.patientId,
      amount: paymentPlan.installmentAmount,
      method: paymentPlan.paymentMethod,
      methodId: paymentPlan.methodId,
      reference: `Payment Plan ${paymentPlanId}`,
      description: `Installment payment for plan ${paymentPlanId}`,
    };

    const payment = await this.processPayment(paymentData);

    if (payment.status === 'completed') {
      // Update payment plan
      paymentPlan.installmentsPaid++;
      paymentPlan.amountPaid += payment.amount;
      paymentPlan.lastPaymentDate = payment.completedAt;

      if (paymentPlan.installmentsPaid >= paymentPlan.totalInstallments) {
        paymentPlan.isActive = false;
        paymentPlan.completedAt = new Date().toISOString();
      }

      await this.updatePaymentPlan(paymentPlan);
    }

    return payment;
  }

  // Refund payment
  async processRefund(paymentId, refundAmount, reason) {
    const payment = await this.paymentRepository.getPayment(paymentId);

    if (payment.status !== 'completed') {
      throw new Error(`Cannot refund payment with status: ${payment.status}`);
    }

    if (refundAmount > payment.amount) {
      throw new Error(`Refund amount cannot exceed payment amount`);
    }

    const refund = {
      id: generateUUID(),
      originalPaymentId: paymentId,
      amount: refundAmount,
      reason: reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Process refund through gateway
      const gatewayResult = await this.gateway.processRefund({
        transactionId: payment.gatewayTransactionId,
        amount: refundAmount,
        reason: reason,
      });

      if (gatewayResult.success) {
        refund.status = 'completed';
        refund.completedAt = new Date().toISOString();
        refund.gatewayTransactionId = gatewayResult.transactionId;

        // Update account balance (add back refund amount)
        await this.updateAccountBalance(payment.accountId, -refundAmount);

        // Send refund confirmation
        await this.sendRefundConfirmation(refund, payment);
      } else {
        refund.status = 'failed';
        refund.error = gatewayResult.error;
      }

      // Save refund
      const savedRefund = await this.paymentRepository.createRefund(refund);

      return savedRefund;
    } catch (error) {
      refund.status = 'error';
      refund.error = error.message;
      await this.paymentRepository.createRefund(refund);
      throw error;
    }
  }

  // Daily reconciliation
  async performDailyReconciliation(date) {
    const payments = await this.getPaymentsByDate(date);
    const gatewayTransactions = await this.gateway.getTransactionsByDate(date);

    const reconciliation = {
      date: date,
      payments: payments,
      gatewayTransactions: gatewayTransactions,
      matched: [],
      unmatched: [],
      discrepancies: [],
    };

    // Match payments with gateway transactions
    for (const payment of payments) {
      const match = gatewayTransactions.find(
        (gt) => gt.transactionId === payment.gatewayTransactionId
      );

      if (match) {
        reconciliation.matched.push({
          payment: payment,
          gatewayTransaction: match,
          status: 'matched',
        });
      } else {
        reconciliation.unmatched.push({
          payment: payment,
          status: 'unmatched',
        });
      }
    }

    // Check for gateway transactions without matching payments
    for (const gatewayTransaction of gatewayTransactions) {
      const match = payments.find(
        (p) => p.gatewayTransactionId === gatewayTransaction.transactionId
      );

      if (!match) {
        reconciliation.discrepancies.push({
          gatewayTransaction: gatewayTransaction,
          type: 'unmatched_gateway_transaction',
        });
      }
    }

    // Generate reconciliation report
    await this.generateReconciliationReport(reconciliation);

    return reconciliation;
  }
}
```javascript

## Collections Management

### Collections Strategy

```javascript
// Collections management system
class CollectionsManager {
  constructor() {
    this.collectionsRepository = new CollectionsRepository();
    this.strategyEngine = new StrategyEngine();
    this.communicationService = new CommunicationService();
    this.workflowEngine = new WorkflowEngine();
  }

  // Identify accounts for collections
  async identifyCollectionsAccounts() {
    const overdueAccounts = await this.getOverdueAccounts();
    const collectionsAccounts = [];

    for (const account of overdueAccounts) {
      const assessment = await this.assessCollectionsRisk(account);

      if (assessment.requiresAction) {
        collectionsAccounts.push({
          accountId: account.id,
          riskLevel: assessment.riskLevel,
          recommendedAction: assessment.recommendedAction,
          daysOverdue: assessment.daysOverdue,
          balance: account.currentBalance,
        });
      }
    }

    return collectionsAccounts;
  }

  // Assess collections risk
  async assessCollectionsRisk(account) {
    const assessment = {
      requiresAction: false,
      riskLevel: 'low',
      recommendedAction: null,
      daysOverdue: 0,
      factors: [],
    };

    // Calculate days overdue
    const oldestCharge = await this.getOldestUnpaidCharge(account.id);
    if (oldestCharge) {
      assessment.daysOverdue = Math.floor(
        (new Date() - new Date(oldestCharge.dueDate)) / (1000 * 60 * 60 * 24)
      );
    }

    // Assess payment history
    const paymentHistory = await this.getPaymentHistory(account.id);
    const paymentScore = this.calculatePaymentScore(paymentHistory);
    assessment.factors.push({
      factor: 'payment_history',
      score: paymentScore,
      impact: paymentScore < 0.7 ? 'negative' : 'positive',
    });

    // Assess account age
    const accountAge = await this.getAccountAge(account.id);
    assessment.factors.push({
      factor: 'account_age',
      value: accountAge,
      impact: accountAge > 365 ? 'negative' : 'positive',
    });

    // Assess balance amount
    assessment.factors.push({
      factor: 'balance_amount',
      value: account.currentBalance,
      impact: account.currentBalance > 1000 ? 'negative' : 'positive',
    });

    // Determine risk level and action
    if (assessment.daysOverdue > 90) {
      assessment.riskLevel = 'high';
      assessment.requiresAction = true;
      assessment.recommendedAction = 'escalate_collections';
    } else if (assessment.daysOverdue > 60) {
      assessment.riskLevel = 'medium';
      assessment.requiresAction = true;
      assessment.recommendedAction = 'intensive_followup';
    } else if (assessment.daysOverdue > 30) {
      assessment.riskLevel = 'low';
      assessment.requiresAction = true;
      assessment.recommendedAction = 'standard_reminder';
    }

    return assessment;
  }

  // Execute collections strategy
  async executeCollectionsStrategy(accountId, strategy) {
    const account = await this.accountRepository.getAccount(accountId);

    switch (strategy) {
      case 'standard_reminder':
        await this.sendStandardReminder(account);
        break;
      case 'intensive_followup':
        await this.initiateIntensiveFollowup(account);
        break;
      case 'escalate_collections':
        await this.escalateToCollections(account);
        break;
      default:
        throw new Error(`Unknown collections strategy: ${strategy}`);
    }

    // Log action
    await this.logCollectionsAction(accountId, strategy);
  }

  // Send standard reminder
  async sendStandardReminder(account) {
    const reminder = {
      type: 'payment_reminder',
      priority: 'normal',
      channels: ['email', 'sms'],
      content: {
        subject: 'Payment Reminder',
        message: `This is a reminder that you have an outstanding balance of $${account.currentBalance.toFixed(2)}.`,
        dueDate: await this.getEarliestDueDate(account.id),
      },
    };

    await this.communicationService.sendMessage(account.profile.contactInfo, reminder);
  }

  // Initiate intensive followup
  async initiateIntensiveFollowup(account) {
    const followupPlan = {
      accountId: account.id,
      steps: [
        { day: 0, action: 'phone_call', priority: 'high' },
        { day: 3, action: 'email_reminder', priority: 'high' },
        { day: 7, action: 'payment_plan_offer', priority: 'medium' },
        { day: 14, action: 'final_notice', priority: 'high' },
      ],
      status: 'active',
      startedAt: new Date().toISOString(),
    };

    await this.collectionsRepository.createFollowupPlan(followupPlan);

    // Execute first step immediately
    await this.executeFollowupStep(account.id, followupPlan.steps[0]);
  }

  // Execute followup step
  async executeFollowupStep(accountId, step) {
    const account = await this.accountRepository.getAccount(accountId);

    switch (step.action) {
      case 'phone_call':
        await this.schedulePhoneCall(account);
        break;
      case 'email_reminder':
        await this.sendUrgentEmailReminder(account);
        break;
      case 'payment_plan_offer':
        await this.offerPaymentPlan(account);
        break;
      case 'final_notice':
        await this.sendFinalNotice(account);
        break;
    }
  }

  // Escalate to collections
  async escalateToCollections(account) {
    const escalation = {
      accountId: account.id,
      escalatedAt: new Date().toISOString(),
      reason: 'over_90_days',
      balance: account.currentBalance,
      collectionsAgency: await this.selectCollectionsAgency(account),
      status: 'pending_transfer',
    };

    await this.collectionsRepository.createEscalation(escalation);

    // Transfer to collections agency
    await this.transferToCollectionsAgency(escalation);
  }
}
```text

This comprehensive patient accounts management system provides healthcare organizations with powerful tools for managing patient financial interactions, from account creation through collections, ensuring efficient revenue cycle management and positive patient financial experiences.
````
