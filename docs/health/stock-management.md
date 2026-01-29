---
title: 'Stock Management'
sidebar_label: 'Stock Management'
description: 'Comprehensive stock management and inventory control system for healthcare facilities in ZARISH SPHERE'
keywords: [stock management, inventory control, healthcare supplies, medical stock, zarish sphere]
---

# Stock Management

## Overview

ZARISH SPHERE Stock Management provides a comprehensive inventory control system designed to optimize stock levels, prevent shortages, reduce waste, and ensure availability of critical medical supplies. Our platform supports real-time tracking, automated reordering, demand forecasting, and multi-location inventory management while maintaining regulatory compliance and cost efficiency.

## Stock Management Architecture

### Inventory Control Framework

````text
Stock Management Framework
├── Inventory Tracking
│   ├── Real-time Stock Levels
│   ├── Location Management
│   ├── Batch/lot Tracking
│   └── Expiry Monitoring
├── Demand Forecasting
│   ├── Historical Analysis
│   ├── Seasonal Patterns
│   ├── Predictive Analytics
│   └── Demand Planning
├── Procurement Management
│   ├── Automated Reordering
│   ├── Supplier Management
│   ├── Purchase Orders
│   └── Contract Management
├── Stock Optimization
│   ├── Safety Stock Calculation
│   ├── Economic Order Quantity
│   ├── ABC Analysis
│   └── Turnover Optimization
└── Compliance & Reporting
    ├── Regulatory Compliance
    ├── Audit Trails
    ├── Cost Analysis
    └── Performance Metrics
```javascript

### Stock Classification

| Category           | Description                       | Reorder Point | Safety Stock | Turnover Rate |
| ------------------ | --------------------------------- | ------------- | ------------ | ------------- |
| **Critical Items** | Life-saving medications/equipment | 7 days        | 14 days      | High          |
| **High-Value**     | Expensive medical devices         | 30 days       | 45 days      | Medium        |
| **Fast-Moving**    | Frequently used supplies          | 14 days       | 21 days      | Very High     |
| **Slow-Moving**    | Specialized items                 | 60 days       | 90 days      | Low           |
| **Obsolete**       | Phased-out items                  | N/A           | N/A          | None          |

## Inventory Tracking System

### Real-time Stock Monitoring

```javascript
// Stock management system
class StockManagementSystem {
  constructor() {
    this.inventoryRepository = new InventoryRepository();
    this.forecastingEngine = new ForecastingEngine();
    this.procurementEngine = new ProcurementEngine();
    this.alertEngine = new AlertEngine();
    this.analyticsEngine = new AnalyticsEngine();
  }

  // Initialize stock management
  async initializeStockManagement(facilityId) {
    const stockSystem = {
      id: generateUUID(),
      facilityId: facilityId,
      locations: [],
      items: [],
      thresholds: {},
      forecasts: [],
      alerts: [],
      status: 'initializing',
      createdAt: new Date().toISOString(),
    };

    try {
      // Load inventory locations
      const locations = await this.loadInventoryLocations(facilityId);
      stockSystem.locations = locations;

      // Load inventory items
      const items = await this.loadInventoryItems(facilityId);
      stockSystem.items = items;

      // Calculate stock thresholds
      const thresholds = await this.calculateStockThresholds(items);
      stockSystem.thresholds = thresholds;

      // Initialize demand forecasting
      const forecasts = await this.initializeForecasts(items);
      stockSystem.forecasts = forecasts;

      // Set up monitoring
      await this.setupStockMonitoring(stockSystem);

      stockSystem.status = 'active';
      const savedSystem = await this.inventoryRepository.create(stockSystem);

      return savedSystem;
    } catch (error) {
      stockSystem.status = 'failed';
      stockSystem.error = error.message;

      const failedSystem = await this.inventoryRepository.create(stockSystem);
      throw error;
    }
  }

  // Update stock levels
  async updateStockLevels(stockUpdate) {
    const update = {
      id: generateUUID(),
      facilityId: stockUpdate.facilityId,
      itemId: stockUpdate.itemId,
      locationId: stockUpdate.locationId,
      transactionType: stockUpdate.transactionType, // 'in', 'out', 'adjustment'
      quantity: stockUpdate.quantity,
      batchNumber: stockUpdate.batchNumber,
      expiryDate: stockUpdate.expiryDate,
      reason: stockUpdate.reason,
      performedBy: stockUpdate.performedBy,
      timestamp: new Date().toISOString(),
    };

    // Get current stock
    const currentStock = await this.getCurrentStock(
      stockUpdate.facilityId,
      stockUpdate.itemId,
      stockUpdate.locationId
    );

    // Calculate new stock level
    const newStockLevel = this.calculateNewStockLevel(currentStock, update);

    // Validate stock level
    const validation = await this.validateStockLevel(newStockLevel, stockUpdate.itemId);
    if (!validation.valid) {
      throw new Error(`Stock validation failed: ${validation.errors.join(', ')}`);
    }

    // Update inventory
    const updatedStock = await this.updateInventory(currentStock, newStockLevel, update);

    // Check for alerts
    await this.checkStockAlerts(updatedStock);

    // Update forecasts
    await this.updateDemandForecast(updatedStock);

    return updatedStock;
  }

  // Calculate new stock level
  calculateNewStockLevel(currentStock, update) {
    const newLevel = {
      itemId: currentStock.itemId,
      locationId: currentStock.locationId,
      previousQuantity: currentStock.quantity,
      transactionQuantity: update.quantity,
      newQuantity: currentStock.quantity,
      transactionType: update.transactionType,
      timestamp: update.timestamp,
    };

    switch (update.transactionType) {
      case 'in':
        newLevel.newQuantity += update.quantity;
        break;
      case 'out':
        newLevel.newQuantity -= update.quantity;
        break;
      case 'adjustment':
        newLevel.newQuantity = update.quantity;
        break;
      default:
        throw new Error(`Invalid transaction type: ${update.transactionType}`);
    }

    return newLevel;
  }

  // Check stock alerts
  async checkStockAlerts(stock) {
    const alerts = [];

    // Check for low stock
    if (stock.newQuantity <= stock.reorderPoint) {
      const lowStockAlert = await this.createLowStockAlert(stock);
      alerts.push(lowStockAlert);
    }

    // Check for stock out
    if (stock.newQuantity <= 0) {
      const stockOutAlert = await this.createStockOutAlert(stock);
      alerts.push(stockOutAlert);
    }

    // Check for overstock
    if (stock.newQuantity >= stock.maximumLevel) {
      const overstockAlert = await this.createOverstockAlert(stock);
      alerts.push(overstockAlert);
    }

    // Check for expiry
    const expiryAlerts = await this.checkExpiryAlerts(stock);
    alerts.push(...expiryAlerts);

    // Send alerts
    for (const alert of alerts) {
      await this.alertEngine.sendAlert(alert);
    }

    return alerts;
  }

  // Create low stock alert
  async createLowStockAlert(stock) {
    const alert = {
      id: generateUUID(),
      type: 'low_stock',
      severity: 'warning',
      itemId: stock.itemId,
      locationId: stock.locationId,
      currentLevel: stock.newQuantity,
      reorderPoint: stock.reorderPoint,
      safetyStock: stock.safetyStock,
      recommendedAction: 'reorder',
      autoReorder: await this.shouldAutoReorder(stock),
      createdAt: new Date().toISOString(),
    };

    // Calculate recommended order quantity
    alert.recommendedQuantity = await this.calculateReorderQuantity(stock);

    // Find suppliers
    alert.suppliers = await this.getPreferredSuppliers(stock.itemId);

    return alert;
  }

  // Calculate reorder quantity
  async calculateReorderQuantity(stock) {
    const item = await this.getItemDetails(stock.itemId);

    // Economic Order Quantity (EOQ) calculation
    const eoq = this.calculateEOQ(item);

    // Adjust for current demand
    const demand = await this.getCurrentDemand(stock.itemId);
    const leadTime = await this.getAverageLeadTime(stock.itemId);

    // Calculate order quantity
    const orderQuantity = Math.max(eoq, demand * leadTime - stock.newQuantity + stock.safetyStock);

    return Math.round(orderQuantity);
  }

  // Calculate Economic Order Quantity
  calculateEOQ(item) {
    const annualDemand = item.annualDemand || 1000;
    const orderCost = item.orderCost || 50;
    const holdingCost = item.holdingCost || 0.2; // 20% of item value

    // EOQ = sqrt(2 * D * S / H)
    const eoq = Math.sqrt((2 * annualDemand * orderCost) / (item.unitCost * holdingCost));

    return Math.round(eoq);
  }

  // Process automatic reordering
  async processAutoReorder(alert) {
    if (!alert.autoReorder) {
      return null;
    }

    const reorder = {
      id: generateUUID(),
      alertId: alert.id,
      itemId: alert.itemId,
      quantity: alert.recommendedQuantity,
      supplierId: await this.selectBestSupplier(alert.itemId, alert.recommendedQuantity),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Create purchase order
      const purchaseOrder = await this.createPurchaseOrder(reorder);
      reorder.purchaseOrderId = purchaseOrder.id;
      reorder.status = 'ordered';

      // Update stock status
      await this.updateStockStatus(alert.itemId, alert.locationId, 'reordered');

      const savedReorder = await this.inventoryRepository.createReorder(reorder);
      return savedReorder;
    } catch (error) {
      reorder.status = 'failed';
      reorder.error = error.message;

      const failedReorder = await this.inventoryRepository.createReorder(reorder);
      throw error;
    }
  }
}
```typescript

## Demand Forecasting

### Predictive Analytics

```javascript
// Demand forecasting engine
class DemandForecastingEngine {
  constructor() {
    this.forecastRepository = new ForecastRepository();
    this.analyticsEngine = new AnalyticsEngine();
    this.mlEngine = new MLEngine();
    this.dataWarehouse = new DataWarehouse();
  }

  // Generate demand forecast
  async generateDemandForecast(itemId, forecastPeriod) {
    const forecast = {
      id: generateUUID(),
      itemId: itemId,
      period: forecastPeriod,
      methodology: 'hybrid',
      historicalData: [],
      forecastData: [],
      confidence: null,
      accuracy: null,
      generatedAt: new Date().toISOString(),
    };

    try {
      // Collect historical data
      const historicalData = await this.collectHistoricalData(itemId, forecastPeriod);
      forecast.historicalData = historicalData;

      // Analyze patterns
      const patterns = await this.analyzeDemandPatterns(historicalData);

      // Generate multiple forecast models
      const models = await this.generateForecastModels(historicalData, patterns);

      // Combine models (ensemble)
      const combinedForecast = await this.combineForecastModels(models);
      forecast.forecastData = combinedForecast;

      // Calculate confidence intervals
      const confidence = await this.calculateConfidenceIntervals(combinedForecast);
      forecast.confidence = confidence;

      // Validate forecast accuracy
      const accuracy = await this.validateForecastAccuracy(itemId, combinedForecast);
      forecast.accuracy = accuracy;

      // Store forecast
      const savedForecast = await this.forecastRepository.create(forecast);

      return savedForecast;
    } catch (error) {
      forecast.status = 'failed';
      forecast.error = error.message;

      const failedForecast = await this.forecastRepository.create(forecast);
      throw error;
    }
  }

  // Collect historical data
  async collectHistoricalData(itemId, forecastPeriod) {
    const data = {
      daily: [],
      weekly: [],
      monthly: [],
      seasonal: [],
      trends: [],
    };

    // Get daily usage data
    const dailyQuery = `
      SELECT
        DATE(transaction_date) as date,
        SUM(CASE WHEN transaction_type = 'out' THEN quantity ELSE 0 END) as usage,
        SUM(CASE WHEN transaction_type = 'in' THEN quantity ELSE 0 END) as received,
        COUNT(*) as transactions
      FROM inventory_transactions
      WHERE item_id = $1
        AND transaction_date >= $2
      GROUP BY DATE(transaction_date)
      ORDER BY date DESC
    `;

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2); // 2 years of data

    const dailyData = await this.dataWarehouse.query(dailyQuery, [itemId, startDate]);
    data.daily = dailyData;

    // Aggregate to weekly data
    data.weekly = this.aggregateToWeekly(dailyData);

    // Aggregate to monthly data
    data.monthly = this.aggregateToMonthly(dailyData);

    // Analyze seasonal patterns
    data.seasonal = await this.analyzeSeasonalPatterns(dailyData);

    // Identify trends
    data.trends = await this.identifyTrends(dailyData);

    return data;
  }

  // Analyze demand patterns
  async analyzeDemandPatterns(historicalData) {
    const patterns = {
      seasonality: null,
      trend: null,
      cyclical: null,
      irregular: null,
      volatility: null,
    };

    // Seasonal decomposition
    patterns.seasonality = await this.seasonalDecomposition(historicalData.daily);

    // Trend analysis
    patterns.trend = await this.trendAnalysis(historicalData.daily);

    // Cyclical patterns
    patterns.cyclical = await this.cyclicalAnalysis(historicalData.weekly);

    // Irregular components
    patterns.irregular = await this.irregularAnalysis(historicalData.daily);

    // Volatility analysis
    patterns.volatility = await this.volatilityAnalysis(historicalData.daily);

    return patterns;
  }

  // Generate forecast models
  async generateForecastModels(historicalData, patterns) {
    const models = [];

    // Time series model (ARIMA)
    const arimaModel = await this.createARIMAModel(historicalData.daily);
    models.push({
      name: 'arima',
      forecast: arimaModel.forecast,
      accuracy: arimaModel.accuracy,
      parameters: arimaModel.parameters,
    });

    // Machine learning model
    const mlModel = await this.createMLModel(historicalData, patterns);
    models.push({
      name: 'machine_learning',
      forecast: mlModel.forecast,
      accuracy: mlModel.accuracy,
      features: mlModel.features,
    });

    // Moving average model
    const maModel = await this.createMovingAverageModel(historicalData.daily);
    models.push({
      name: 'moving_average',
      forecast: maModel.forecast,
      accuracy: maModel.accuracy,
      period: maModel.period,
    });

    // Exponential smoothing model
    const esModel = await this.createExponentialSmoothingModel(historicalData.daily);
    models.push({
      name: 'exponential_smoothing',
      forecast: esModel.forecast,
      accuracy: esModel.accuracy,
      alpha: esModel.alpha,
    });

    return models;
  }

  // Create ARIMA model
  async createARIMAModel(data) {
    const model = {
      name: 'arima',
      parameters: {
        p: 1, // AR order
        d: 1, // Differencing order
        q: 1, // MA order
      },
      forecast: [],
      accuracy: null,
    };

    // Fit ARIMA model
    const fittedModel = await this.mlEngine.fitARIMA(data, model.parameters);

    // Generate forecast
    const forecastPeriod = 30; // 30 days forecast
    model.forecast = await fittedModel.forecast(forecastPeriod);

    // Calculate accuracy
    model.accuracy = await this.calculateModelAccuracy(data, model.forecast);

    return model;
  }

  // Create machine learning model
  async createMLModel(historicalData, patterns) {
    const model = {
      name: 'machine_learning',
      features: [],
      forecast: [],
      accuracy: null,
    };

    // Prepare features
    const features = await this.prepareMLFeatures(historicalData, patterns);
    model.features = features;

    // Train model
    const trainedModel = await this.mlEngine.trainRegressionModel(features);

    // Generate forecast
    const forecastFeatures = await this.prepareForecastFeatures(features);
    model.forecast = await trainedModel.predict(forecastFeatures);

    // Calculate accuracy
    model.accuracy = await this.calculateModelAccuracy(
      historicalData.daily.map((d) => d.usage),
      model.forecast
    );

    return model;
  }

  // Combine forecast models
  async combineForecastModels(models) {
    const combinedForecast = {
      method: 'weighted_ensemble',
      weights: {},
      forecast: [],
      confidence: null,
    };

    // Calculate weights based on accuracy
    const totalAccuracy = models.reduce((sum, model) => sum + model.accuracy, 0);

    for (const model of models) {
      combinedForecast.weights[model.name] = model.accuracy / totalAccuracy;
    }

    // Combine forecasts
    const forecastLength = Math.max(...models.map((m) => m.forecast.length));

    for (let i = 0; i < forecastLength; i++) {
      let combinedValue = 0;
      let confidence = 0;

      for (const model of models) {
        if (i < model.forecast.length) {
          combinedValue += model.forecast[i] * combinedForecast.weights[model.name];
          confidence += model.accuracy * combinedForecast.weights[model.name];
        }
      }

      combinedForecast.forecast.push({
        period: i + 1,
        value: Math.round(combinedValue),
        confidence: confidence,
      });
    }

    return combinedForecast;
  }

  // Calculate confidence intervals
  async calculateConfidenceIntervals(forecast) {
    const confidenceIntervals = [];

    for (const point of forecast.forecast) {
      const interval = {
        period: point.period,
        value: point.value,
        confidence: point.confidence,
        lowerBound: Math.round(point.value * 0.8), // 80% confidence interval
        upperBound: Math.round(point.value * 1.2),
        standardError: this.calculateStandardError(point.value, point.confidence),
      };

      confidenceIntervals.push(interval);
    }

    return confidenceIntervals;
  }
}
```javascript

## Procurement Management

### Automated Reordering System

```javascript
// Procurement management system
class ProcurementManagementSystem {
  constructor() {
    this.procurementRepository = new ProcurementRepository();
    this.supplierRepository = new SupplierRepository();
    this.contractRepository = new ContractRepository();
    this.workflowEngine = new WorkflowEngine();
    this.notificationService = new NotificationService();
  }

  // Process procurement request
  async processProcurementRequest(request) {
    const procurement = {
      id: generateUUID(),
      requestId: request.id,
      items: [],
      suppliers: [],
      totalCost: 0,
      status: 'processing',
      workflow: null,
      createdAt: new Date().toISOString(),
    };

    try {
      // Validate request
      const validation = await this.validateProcurementRequest(request);
      if (!validation.valid) {
        throw new Error(`Request validation failed: ${validation.errors.join(', ')}`);
      }

      // Process each item
      for (const itemRequest of request.items) {
        const procuredItem = await this.processItemProcurement(itemRequest);
        procurement.items.push(procuredItem);
        procurement.totalCost += procuredItem.totalCost;
      }

      // Select suppliers
      const suppliers = await this.selectSuppliers(procurement.items);
      procurement.suppliers = suppliers;

      // Create procurement workflow
      const workflow = await this.createProcurementWorkflow(procurement);
      procurement.workflow = workflow;

      // Start approval process
      await this.startApprovalProcess(procurement);

      const savedProcurement = await this.procurementRepository.create(procurement);
      return savedProcurement;
    } catch (error) {
      procurement.status = 'failed';
      procurement.error = error.message;

      const failedProcurement = await this.procurementRepository.create(procurement);
      throw error;
    }
  }

  // Process item procurement
  async processItemProcurement(itemRequest) {
    const item = {
      id: generateUUID(),
      itemId: itemRequest.itemId,
      quantity: itemRequest.quantity,
      unitPrice: 0,
      totalPrice: 0,
      supplierId: null,
      deliveryDate: null,
      contractId: null,
      status: 'pending',
    };

    // Get item details
    const itemDetails = await this.getItemDetails(itemRequest.itemId);

    // Get current market prices
    const marketPrices = await this.getMarketPrices(itemRequest.itemId);

    // Calculate estimated cost
    item.unitPrice = this.getAveragePrice(marketPrices);
    item.totalPrice = item.quantity * item.unitPrice;

    // Check for existing contracts
    const contracts = await this.getActiveContracts(itemRequest.itemId);
    if (contracts.length > 0) {
      const bestContract = await this.selectBestContract(contracts, itemRequest.quantity);
      item.contractId = bestContract.id;
      item.unitPrice = bestContract.unitPrice;
      item.totalPrice = item.quantity * bestContract.unitPrice;
      item.supplierId = bestContract.supplierId;
    }

    return item;
  }

  // Select suppliers
  async selectSuppliers(items) {
    const suppliers = [];

    for (const item of items) {
      if (item.supplierId) {
        // Already has supplier from contract
        continue;
      }

      // Get potential suppliers
      const potentialSuppliers = await this.getPotentialSuppliers(item.itemId);

      // Evaluate suppliers
      const evaluatedSuppliers = await this.evaluateSuppliers(potentialSuppliers, item);

      // Select best supplier
      const bestSupplier = this.selectBestSupplier(evaluatedSuppliers);
      item.supplierId = bestSupplier.id;
      item.unitPrice = bestSupplier.quotedPrice;
      item.totalPrice = item.quantity * bestSupplier.quotedPrice;

      suppliers.push(bestSupplier);
    }

    return suppliers;
  }

  // Evaluate suppliers
  async evaluateSuppliers(suppliers, item) {
    const evaluatedSuppliers = [];

    for (const supplier of suppliers) {
      const evaluation = {
        supplierId: supplier.id,
        supplierName: supplier.name,
        quotedPrice: await this.getSupplierQuote(supplier.id, item.itemId, item.quantity),
        quality: supplier.qualityScore,
        reliability: supplier.reliabilityScore,
        deliveryTime: await this.getDeliveryTime(supplier.id, item.itemId),
        totalScore: 0,
      };

      // Calculate total score
      evaluation.totalScore = this.calculateSupplierScore(evaluation);

      evaluatedSuppliers.push(evaluation);
    }

    // Sort by total score (highest first)
    evaluatedSuppliers.sort((a, b) => b.totalScore - a.totalScore);

    return evaluatedSuppliers;
  }

  // Calculate supplier score
  calculateSupplierScore(evaluation) {
    const weights = {
      price: 0.3,
      quality: 0.25,
      reliability: 0.25,
      delivery: 0.2,
    };

    // Normalize scores (0-100 scale)
    const priceScore = this.normalizePriceScore(evaluation.quotedPrice);
    const qualityScore = evaluation.quality * 100;
    const reliabilityScore = evaluation.reliability * 100;
    const deliveryScore = this.normalizeDeliveryScore(evaluation.deliveryTime);

    // Calculate weighted score
    const totalScore =
      priceScore * weights.price +
      qualityScore * weights.quality +
      reliabilityScore * weights.reliability +
      deliveryScore * weights.delivery;

    return Math.round(totalScore);
  }

  // Create procurement workflow
  async createProcurementWorkflow(procurement) {
    const workflow = {
      id: generateUUID(),
      procurementId: procurement.id,
      type: 'procurement_approval',
      steps: [],
      currentStep: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Define approval steps based on total cost
    const steps = this.defineApprovalSteps(procurement.totalCost);
    workflow.steps = steps;

    return workflow;
  }

  // Define approval steps
  defineApprovalSteps(totalCost) {
    const steps = [];

    if (totalCost < 1000) {
      // Low value - manager approval only
      steps.push({
        name: 'manager_approval',
        role: 'department_manager',
        required: true,
        status: 'pending',
      });
    } else if (totalCost < 10000) {
      // Medium value - manager + director
      steps.push({
        name: 'manager_approval',
        role: 'department_manager',
        required: true,
        status: 'pending',
      });
      steps.push({
        name: 'director_approval',
        role: 'department_director',
        required: true,
        status: 'pending',
      });
    } else {
      // High value - full approval chain
      steps.push({
        name: 'manager_approval',
        role: 'department_manager',
        required: true,
        status: 'pending',
      });
      steps.push({
        name: 'director_approval',
        role: 'department_director',
        required: true,
        status: 'pending',
      });
      steps.push({
        name: 'finance_approval',
        role: 'finance_director',
        required: true,
        status: 'pending',
      });
    }

    return steps;
  }

  // Process approval step
  async processApprovalStep(workflowId, stepName, approvalData) {
    const workflow = await this.procurementRepository.getWorkflow(workflowId);

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const step = workflow.steps.find((s) => s.name === stepName);
    if (!step) {
      throw new Error(`Step not found: ${stepName}`);
    }

    step.status = approvalData.approved ? 'approved' : 'rejected';
    step.approvedBy = approvalData.userId;
    step.approvedAt = new Date().toISOString();
    step.comments = approvalData.comments;

    // Check if workflow is complete
    if (step.status === 'rejected') {
      workflow.status = 'rejected';
    } else {
      const nextStepIndex = workflow.steps.findIndex((s) => s.name === stepName) + 1;

      if (nextStepIndex < workflow.steps.length) {
        workflow.currentStep = nextStepIndex;
        await this.notifyNextApprover(workflow, workflow.steps[nextStepIndex]);
      } else {
        workflow.status = 'approved';
        await this.completeProcurement(workflow.procurementId);
      }
    }

    const updatedWorkflow = await this.procurementRepository.updateWorkflow(workflow);
    return updatedWorkflow;
  }

  // Complete procurement
  async completeProcurement(procurementId) {
    const procurement = await this.procurementRepository.getProcurement(procurementId);

    procurement.status = 'approved';
    procurement.completedAt = new Date().toISOString();

    // Generate purchase orders
    const purchaseOrders = await this.generatePurchaseOrders(procurement);
    procurement.purchaseOrders = purchaseOrders;

    // Notify suppliers
    for (const po of purchaseOrders) {
      await this.notifySupplier(po);
    }

    const updatedProcurement = await this.procurementRepository.update(procurement);
    return updatedProcurement;
  }
}
```text

This comprehensive stock management system provides healthcare organizations with powerful tools for optimizing inventory levels, preventing stockouts, reducing waste, and ensuring availability of critical medical supplies while maintaining cost efficiency and regulatory compliance.
````
