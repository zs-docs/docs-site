# Form Processing Pipeline and Architecture

This document provides visual representations of the form processing pipeline, data flow, and system architecture for the ZARISH HIS forms system.

## 🔄 Form Processing Pipeline

```mermaid
flowchart TD
    A[Source Repository] --> B[Form Discovery]
    B --> C[Metadata Extraction]
    C --> D[Content Transformation]
    D --> E[Quality Validation]
    E --> F[Directory Organization]
    F --> G[Documentation Generation]
    G --> H[ZARISH HIS Repository]
    
    subgraph "Phase 1: Discovery"
        B
    end
    
    subgraph "Phase 2: Processing"
        C
        D
        E
    end
    
    subgraph "Phase 3: Organization"
        F
        G
    end
    
    style A fill:#e1f5fe
    style H fill:#e8f5e8
```

## 📊 Data Flow Architecture

```mermaid
flowchart LR
    subgraph "Source Systems"
        A1[OpenMRS Forms]
        A2[Concept Dictionary]
        A3[Encounter Types]
    end
    
    subgraph "Processing Layer"
        B1[Form Parser]
        B2[Metadata Extractor]
        B3[Concept Mapper]
        B4[Validator]
    end
    
    subgraph "Storage Layer"
        C1[Forms Registry]
        C2[Metadata Store]
        C3[Value Sets]
        C4[Documentation]
    end
    
    subgraph "Consumer Applications"
        D1[Clinical Apps]
        D2[Reporting]
        D3[Analytics]
        D4[API Services]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    
    B1 --> C1
    B2 --> C2
    B3 --> C3
    B4 --> C4
    
    C1 --> D1
    C2 --> D2
    C3 --> D3
    C4 --> D4
    
    style C1 fill:#fff3e0
    style C2 fill:#fff3e0
    style C3 fill:#fff3e0
    style C4 fill:#fff3e0
```

## 🏗️ Form Structure Hierarchy

```mermaid
graph TD
    A[Form Definition] --> B[Pages]
    B --> C[Sections]
    C --> D[Questions]
    D --> E[Question Options]
    E --> F[Concepts]
    F --> G[Answer Options]
    G --> H[Validators]
    
    subgraph "Form Level"
        A
    end
    
    subgraph "Page Level"
        B
    end
    
    subgraph "Section Level"
        C
    end
    
    subgraph "Question Level"
        D
        E
        F
        G
        H
    end
    
    style A fill:#e3f2fd
    style D fill:#f3e5f5
```

## 📋 Metadata Processing Flow

```mermaid
sequenceDiagram
    participant S as Source Repository
    participant P as Parser
    participant M as Metadata Extractor
    participant V as Validator
    participant T as Transformer
    participant D as Documentation
    
    S->>P: Read Form JSON
    P->>M: Extract Form Metadata
    M->>V: Validate Structure
    V->>T: Transform to Standard Format
    T->>D: Generate Documentation
    
    Note over S,D: Processing Pipeline
    
    M->>M: Extract Concepts
    M->>M: Extract Encounter Types
    M->>M: Categorize Forms
    
    T->>T: Apply Naming Conventions
    T->>T: Generate UUIDs
    T->>T: Create Catalogs
    
    D->>D: Create README
    D->>D: Generate Specifications
    D->>D: Create Diagrams
```

## 🗂️ Directory Structure Flow

```mermaid
flowchart TD
    A[05-metadata-forms/] --> B[forms-registry/]
    A --> C[form-metadata/]
    A --> D[value-sets/]
    A --> E[form-schemas/]
    A --> F[mappings/]
    
    B --> B1[clinical/]
    B1 --> B2[form-001.json]
    B1 --> B3[form-002.json]
    B1 --> B4[...]
    
    C --> C1[forms-catalog.csv]
    C --> C2[encounter-types.csv]
    
    D --> D1[concept-reference-ranges.csv]
    D --> D2[answer-concepts.csv]
    
    E --> E1[field-types-specification.md]
    E --> E2[validation-rules.md]
    
    F --> F1[form-to-encounter.csv]
    F --> F2[concept-mappings.csv]
    
    style A fill:#f1f8e9
    style B fill:#e8f5e8
    style C fill:#e8f5e8
    style D fill:#e8f5e8
    style E fill:#e8f5e8
    style F fill:#e8f5e8
```

## 🔄 Form Lifecycle Management

```mermaid
stateDiagram-v2
    [*] --> Discovery
    Discovery --> Extraction
    Extraction --> Validation
    Validation --> Transformation
    Transformation --> Cataloging
    Cataloging --> Documentation
    Documentation --> Published
    Published --> Active
    Active --> Review
    Review --> Update
    Update --> Validation
    Active --> Deprecated
    Deprecated --> Archived
    Archived --> [*]
    
    note right of Validation
        Quality checks
        Structure validation
        Concept verification
    end note
    
    note right of Transformation
        Naming conventions
        Standardization
        Format conversion
    end note
```

## 📊 Form Categories Distribution

```mermaid
pie title Forms by Clinical Category
    "General Clinical" : 78
    "HIV Care" : 28
    "Maternal & Child Health" : 22
    "Mental Health & Substance Use" : 17
    "Surgical & Procedures" : 12
    "Gender-Based Violence" : 11
    "TB Care" : 9
    "Emergency & Critical Care" : 6
    "Laboratory & Diagnostics" : 6
    "Non-Communicable Diseases" : 6
```

## 🔗 Integration Architecture

```mermaid
graph TB
    subgraph "External Systems"
        A[OpenMRS Server]
        B[Concept Dictionary]
        C[Laboratory System]
        D[Pharmacy System]
    end
    
    subgraph "ZARISH HIS Forms"
        E[Form Engine]
        F[Metadata Store]
        G[Validation Engine]
        H[Rendering Engine]
    end
    
    subgraph "Applications"
        I[Web Application]
        J[Mobile App]
        K[Reporting System]
        L[API Gateway]
    end
    
    A --> E
    B --> F
    C --> E
    D --> E
    
    E --> H
    F --> G
    G --> H
    
    H --> I
    H --> J
    F --> K
    E --> L
    
    style E fill:#fff3e0
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#fff3e0
```

## 📈 Processing Metrics

```mermaid
graph LR
    A[195 Forms] --> B[146 Encounter Types]
    A --> C[16,023 Concepts]
    A --> D[10 Categories]
    
    B --> E[26 HIV Care]
    B --> F[11 MCH]
    B --> G[54 General Clinical]
    
    C --> H[4,794 Main Concepts]
    C --> I[11,229 Answer Options]
    
    style A fill:#e3f2fd
    style C fill:#f3e5f5
    style B fill:#e8f5e8
```

## 🚀 Deployment Pipeline

```mermaid
flowchart TD
    A[Development] --> B[Testing]
    B --> C[Validation]
    C --> D[Documentation]
    D --> E[Build]
    E --> F[Deploy Staging]
    F --> G[UAT]
    G --> H[Deploy Production]
    H --> I[Monitoring]
    I --> J[Maintenance]
    
    subgraph "Quality Gates"
        B
        C
        G
    end
    
    subgraph "Deployment Stages"
        F
        H
    end
    
    subgraph "Operations"
        I
        J
    end
    
    style A fill:#e1f5fe
    style H fill:#e8f5e8
```

---

*These diagrams provide a comprehensive view of the ZARISH HIS forms system architecture and processing workflows. They are updated as the system evolves.*
