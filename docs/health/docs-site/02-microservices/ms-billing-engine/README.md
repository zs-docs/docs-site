# Billing Engine Microservice

## 🎯 Overview

The **Billing Engine** microservice handles all financial operations within ZARISH HIS, including invoice generation, payment processing, insurance claims, and financial reporting.

## 🏗️ Architecture

### Service Details
- **Service ID**: MS-201
- **Repository**: [zs-his/ms-billing-engine](https://github.com/zs-his/ms-billing-engine)
- **Technology Stack**: Golang 1.25.x, PostgreSQL, Redis, Kafka
- **Port**: 8082

### Core Responsibilities
- Invoice generation and management
- Payment processing and reconciliation
- Insurance claim submission and tracking
- Financial reporting and analytics
- Integration with payment gateways
- Tax calculation and compliance

## 📊 Data Model

### Invoice Entity
```go
type Invoice struct {
    ID            string      `json:"id" db:"id"`
    InvoiceNumber string      `json:"invoice_number" db:"invoice_number"`
    PatientID     string      `json:"patient_id" db:"patient_id"`
    EncounterID   string      `json:"encounter_id" db:"encounter_id"`
    Status        string      `json:"status" db:"status"`
    TotalAmount   float64     `json:"total_amount" db:"total_amount"`
    TaxAmount     float64     `json:"tax_amount" db:"tax_amount"`
    DiscountAmount float64    `json:"discount_amount" db:"discount_amount"`
    NetAmount     float64     `json:"net_amount" db:"net_amount"`
    Currency      string      `json:"currency" db:"currency"`
    DueDate       time.Time   `json:"due_date" db:"due_date"`
    CreatedAt     time.Time   `json:"created_at" db:"created_at"
    UpdatedAt     time.Time   `json:"updated_at" db:"updated_at"`
    LineItems     []LineItem  `json:"line_items"`
}

type LineItem struct {
    ID          string  `json:"id" db:"id"`
    InvoiceID   string  `json:"invoice_id" db:"invoice_id"`
    Description string  `json:"description" db:"description"`
    Quantity    int     `json:"quantity" db:"quantity"`
    UnitPrice   float64 `json:"unit_price" db:"unit_price"`
    TotalPrice  float64 `json:"total_price" db:"total_price"`
    ServiceCode string  `json:"service_code" db:"service_code"`
}
```

## 🔌 API Endpoints

### Invoice Management
- `POST /invoices` - Create new invoice
- `GET /invoices/{id}` - Get invoice by ID
- `GET /invoices/number/{number}` - Get invoice by number
- `PUT /invoices/{id}` - Update invoice
- `DELETE /invoices/{id}` - Cancel invoice
- `POST /invoices/{id}/finalize` - Finalize invoice

### Payment Processing
- `POST /payments` - Process payment
- `GET /payments/{id}` - Get payment details
- `POST /invoices/{id}/payments` - Add payment to invoice
- `GET /invoices/{id}/balance` - Get invoice balance

### Insurance Claims
- `POST /insurance-claims` - Submit insurance claim
- `GET /insurance-claims/{id}` - Get claim status
- `POST /insurance-claims/{id}/submit` - Submit claim to payer
- `GET /insurance-claims/payer/{payer-id}` - List claims by payer

### Reporting
- `GET /reports/revenue` - Revenue reports
- `GET /reports/aging` - Accounts aging report
- `GET /reports/payments` - Payment reports
- `GET /reports/insurance` - Insurance claims reports

## 🔄 Business Logic

### Invoice Generation
```go
func (s *BillingService) GenerateInvoice(ctx context.Context, req GenerateInvoiceRequest) (*Invoice, error) {
    // Validate patient and encounter
    patient, err := s.patientService.GetPatient(ctx, req.PatientID)
    if err != nil {
        return nil, err
    }
    
    // Calculate line items
    lineItems, err := s.calculateLineItems(ctx, req.EncounterID)
    if err != nil {
        return nil, err
    }
    
    // Calculate totals
    totalAmount := s.calculateTotal(lineItems)
    taxAmount := s.calculateTax(totalAmount, patient.Address)
    discountAmount := s.calculateDiscount(totalAmount, req.DiscountCode)
    netAmount := totalAmount + taxAmount - discountAmount
    
    // Generate invoice number
    invoiceNumber := s.generateInvoiceNumber()
    
    invoice := &Invoice{
        ID:            generateID(),
        InvoiceNumber: invoiceNumber,
        PatientID:     req.PatientID,
        EncounterID:   req.EncounterID,
        Status:        "draft",
        TotalAmount:   totalAmount,
        TaxAmount:     taxAmount,
        DiscountAmount: discountAmount,
        NetAmount:     netAmount,
        Currency:      "USD",
        DueDate:       time.Now().AddDate(0, 0, 30), // 30 days
        LineItems:     lineItems,
        CreatedAt:     time.Now(),
        UpdatedAt:     time.Now(),
    }
    
    return s.invoiceRepo.Create(ctx, invoice)
}
```

### Payment Processing
```go
func (s *BillingService) ProcessPayment(ctx context.Context, req PaymentRequest) (*Payment, error) {
    // Validate invoice
    invoice, err := s.invoiceRepo.GetByID(ctx, req.InvoiceID)
    if err != nil {
        return nil, err
    }
    
    if invoice.Status != "finalized" {
        return nil, errors.New("Invoice must be finalized before payment")
    }
    
    // Process payment through gateway
    paymentResult, err := s.paymentGateway.ProcessPayment(ctx, PaymentGatewayRequest{
        Amount:        req.Amount,
        Currency:      invoice.Currency,
        PaymentMethod:  req.PaymentMethod,
        Token:         req.Token,
        Description:   fmt.Sprintf("Payment for invoice %s", invoice.InvoiceNumber),
    })
    
    if err != nil {
        return nil, err
    }
    
    // Create payment record
    payment := &Payment{
        ID:          generateID(),
        InvoiceID:   req.InvoiceID,
        Amount:      req.Amount,
        Method:      req.PaymentMethod,
        Status:      paymentResult.Status,
        TransactionID: paymentResult.TransactionID,
        CreatedAt:   time.Now(),
    }
    
    if err := s.paymentRepo.Create(ctx, payment); err != nil {
        return nil, err
    }
    
    // Update invoice balance
    if err := s.updateInvoiceBalance(ctx, req.InvoiceID); err != nil {
        return nil, err
    }
    
    // Publish payment event
    s.eventPublisher.Publish(PaymentProcessedEvent, payment)
    
    return payment, nil
}
```

## 🗄️ Database Schema

### Invoices Table
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID NOT NULL,
    encounter_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'finalized', 'paid', 'cancelled', 'refunded')),
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    due_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_encounter ON invoices(encounter_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
```

### Invoice Line Items Table
```sql
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    description VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    service_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_line_items_invoice ON invoice_line_items(invoice_id);
```

## 🔗 Integrations

### Payment Gateways
```go
type PaymentGateway interface {
    ProcessPayment(ctx context.Context, req PaymentGatewayRequest) (*PaymentGatewayResponse, error)
    RefundPayment(ctx context.Context, transactionID string, amount float64) error
    GetPaymentStatus(ctx context.Context, transactionID string) (string, error)
}

// Stripe implementation
type StripeGateway struct {
    client *stripe.Client
}

func (g *StripeGateway) ProcessPayment(ctx context.Context, req PaymentGatewayRequest) (*PaymentGatewayResponse, error) {
    params := &stripe.ChargeParams{
        Amount:   stripe.Int64(int64(req.Amount * 100)), // Convert to cents
        Currency: stripe.String(req.Currency),
        Source:   &stripe.SourceParams{Token: stripe.String(req.Token)},
        Description: stripe.String(req.Description),
    }
    
    charge, err := g.client.Charges.New(params)
    if err != nil {
        return nil, err
    }
    
    return &PaymentGatewayResponse{
        Status:        "succeeded",
        TransactionID: charge.ID,
        Amount:        float64(charge.Amount) / 100,
    }, nil
}
```

### Insurance Integration
```go
type InsurancePayer interface {
    SubmitClaim(ctx context.Context, claim *InsuranceClaim) (*ClaimSubmission, error)
    CheckClaimStatus(ctx context.Context, claimID string) (*ClaimStatus, error)
    ValidateCoverage(ctx context.Context, patientID, serviceCode string) (*CoverageInfo, error)
}

// Example: Blue Cross Blue Shield integration
type BCPayer struct {
    client *http.Client
    apiKey string
    baseURL string
}

func (p *BCPayer) SubmitClaim(ctx context.Context, claim *InsuranceClaim) (*ClaimSubmission, error) {
    // Convert claim to BC format
    bcClaim := p.convertToBCFormat(claim)
    
    // Submit to BC API
    resp, err := p.submitToBCAPI(ctx, bcClaim)
    if err != nil {
        return nil, err
    }
    
    return &ClaimSubmission{
        ClaimID:      resp.ClaimID,
        Status:       "submitted",
        SubmittedAt:  time.Now(),
        TrackingNumber: resp.TrackingNumber,
    }, nil
}
```

## 🧪 Testing Strategy

### Unit Tests
- Invoice calculation logic
- Tax calculation algorithms
- Payment processing logic
- Insurance claim formatting

### Integration Tests
- Payment gateway integration
- Insurance payer integration
- Database operations
- Event publishing

### End-to-End Tests
- Complete billing workflow
- Payment processing flow
- Insurance claim submission

## 📈 Performance Considerations

### Caching Strategy
- **Invoice Cache**: Cache frequently accessed invoices
- **Rate Cache**: Cache tax rates and discount rules
- **Payer Cache**: Cache insurance payer information

### Database Optimization
- **Indexing**: Optimized indexes for invoice queries
- **Partitioning**: Partition invoices by date
- **Connection Pooling**: Efficient database connections

## 🔐 Security

### Payment Security
- **PCI Compliance**: Ensure payment card data security
- **Tokenization**: Use payment tokens instead of raw card data
- **Encryption**: Encrypt sensitive financial data

### Audit Trail
- **Financial Logging**: Complete audit trail for all financial operations
- **Access Control**: Role-based access to financial data
- **Compliance**: SOX and financial compliance requirements

## 🚀 Deployment

### Environment Configuration
```yaml
# config.yaml
server:
  port: 8082
  host: "0.0.0.0"

database:
  host: "localhost"
  port: 5432
  username: "zarish"
  password: "${DB_PASSWORD}"
  database: "zarish_billing"

payment_gateways:
  stripe:
    api_key: "${STRIPE_API_KEY}"
    webhook_secret: "${STRIPE_WEBHOOK_SECRET}"
  
  paypal:
    client_id: "${PAYPAL_CLIENT_ID}"
    client_secret: "${PAYPAL_CLIENT_SECRET}"
    mode: "sandbox"

insurance:
  blue_cross:
    api_key: "${BC_API_KEY}"
    endpoint: "https://api.bluecross.com"
  
  aetna:
    api_key: "${AETNA_API_KEY}"
    endpoint: "https://api.aetna.com"
```

## 📝 Development Guidelines

### Adding New Payment Methods
1. Implement `PaymentGateway` interface
2. Add configuration options
3. Create migration scripts
4. Add comprehensive tests
5. Update documentation

### Adding New Insurance Payers
1. Implement `InsurancePayer` interface
2. Create claim format converters
3. Add payer-specific validation
4. Test integration thoroughly
5. Update payer documentation

---

*Last Updated: January 2026*  
*Version: 1.0*  
*Billing Team: ZARISH HIS*
