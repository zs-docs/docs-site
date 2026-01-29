# Geographic Boundaries Integration Standards

## 🎯 Overview

This document defines the comprehensive geographic administrative boundary integration for ZARISH HIS, supporting Bangladesh administrative divisions, Rohingya camp mapping, and precise geolocation services for healthcare delivery.

## 🗺️ Administrative Boundary System

### Bangladesh Administrative Hierarchy

#### ADM0 - Country Level
- **Code**: `BD`
- **Name**: Bangladesh
- **ISO Code**: `BD`
- **UN Code**: `050`
- **Purpose**: National-level identification

#### ADM1 - Division Level
**8 Administrative Divisions**
- **Barishal** (Code: `BD.1`)
- **Chattogram** (Code: `BD.2`)
- **Dhaka** (Code: `BD.3`)
- **Khulna** (Code: `BD.4`)
- **Mymensingh** (Code: `BD.5`)
- **Rajshahi** (Code: `BD.6`)
- **Rangpur** (Code: `BD.7`)
- **Sylhet** (Code: `BD.8`)

#### ADM2 - District Level
**64 Districts** (Example mapping)
```json
{
  "BD.3.1": "Dhaka",
  "BD.3.2": "Faridpur",
  "BD.3.3": "Gazipur",
  "BD.3.4": "Gopalganj",
  "BD.3.5": "Kishoreganj",
  "BD.3.6": "Madaripur",
  "BD.3.7": "Manikganj",
  "BD.3.8": "Munshiganj",
  "BD.3.9": "Narayanganj",
  "BD.3.10": "Narsingdi",
  "BD.3.11": "Rajbari",
  "BD.3.12": "Shariatpur",
  "BD.3.13": "Tangail"
}
```

#### ADM3 - Upazilla Level
**495 Upazillas** (Example for Cox's Bazar)
```json
{
  "BD.2.1.1": "Cox's Bazar Sadar",
  "BD.2.1.2": "Chakaria",
  "BD.2.1.3": "Kutubdia",
  "BD.2.1.4": "Ukhiya",
  "BD.2.1.5": "Teknaf",
  "BD.2.1.6": "Ramu",
  "BD.2.1.7": "Pekua",
  "BD.2.1.8": "Moheshkhali"
}
```

#### ADM4 - Union/Municipality Level
**4,571 Unions** (Example for Ukhiya)
```json
{
  "BD.2.1.4.1": "Jaliapalong",
  "BD.2.1.4.2": "Palong Khali",
  "BD.2.1.4.3": "Kutupalong",
  "BD.2.1.4.4": "Rajapalong",
  "BD.2.1.4.5": "Balukhali",
  "BD.2.1.4.6": "Hnila",
  "BD.2.1.4.7": "Ukhiya Sadar"
}
```

## 🏕️ Rohingya Camp Geographic System

### Camp Classification

#### Registered Camps (KTP & NYP)
**Kutupalong Registered Camp**
- **Camp Code**: `CAMP-KTP-001`
- **ADM Code**: `BD.2.1.4.3`
- **Coordinates**: `21.2345°N, 92.1234°E`
- **Blocks**: 8 Main Blocks
- **Sub-blocks**: 32 Sub-blocks
- **Capacity**: 20,000+ refugees

**Nayapara Registered Camp**
- **Camp Code**: `CAMP-NYP-002`
- **ADM Code**: `BD.2.1.4.2`
- **Coordinates**: `21.3456°N, 92.2345°E`
- **Blocks**: 6 Main Blocks
- **Sub-blocks**: 24 Sub-blocks
- **Capacity**: 15,000+ refugees

#### New Arrival Camps
**Jaliapalong Extension**
- **Camp Code**: `CAMP-NEW-003`
- **ADM Code**: `BD.2.1.4.1`
- **Coordinates**: `21.4567°N, 92.3456°E`
- **Status**: Temporary/New Arrival
- **Blocks**: 4 Main Blocks
- **Sub-blocks**: 16 Sub-blocks
- **Capacity**: 8,000+ refugees

### Block Structure System

#### Block Naming Convention
```
{CAMP_CODE}-BLOCK-{BLOCK_NUMBER}
Example: CAMP-KTP-001-BLOCK-01
```

#### Sub-block Naming Convention
```
{BLOCK_CODE}-SUB-{SUB_NUMBER}
Example: CAMP-KTP-001-BLOCK-01-SUB-01
```

#### Geographic Data Structure
```json
{
  "camp_code": "CAMP-KTP-001",
  "camp_name": "Kutupalong Registered Camp",
  "administrative_code": "BD.2.1.4.3",
  "coordinates": {
    "center": {
      "latitude": 21.2345,
      "longitude": 92.1234
    },
    "bounds": {
      "north": 21.2456,
      "south": 21.2234,
      "east": 92.1345,
      "west": 92.1123
    }
  },
  "blocks": [
    {
      "block_code": "CAMP-KTP-001-BLOCK-01",
      "block_name": "Block A",
      "sub_blocks": [
        {
          "sub_block_code": "CAMP-KTP-001-BLOCK-01-SUB-01",
          "sub_block_name": "Sub-block A1",
          "coordinates": {
            "latitude": 21.2356,
            "longitude": 92.1245
          }
        }
      ]
    }
  ]
}
```

## 🌐 Geographic Data Integration

### Data Sources

#### Bangladesh Administrative Boundaries
**Primary Source**: https://data.humdata.org/dataset/cod-ab-bgd
- **Format**: GeoJSON, Shapefile
- **Accuracy**: Administrative level boundaries
- **Update Frequency**: Annual
- **License**: Humanitarian Data Exchange

#### Rohingya Camp Boundaries
**Primary Source**: https://data.humdata.org/dataset/outline-of-camps-sites-of-rohingya-refugees-in-cox-s-bazar-bangladesh
- **Format**: GeoJSON, KML
- **Accuracy**: Camp perimeter boundaries
- **Update Frequency**: Monthly
- **License**: UNHCR/ISCG

### Integration Methods

#### Static Data Integration
```typescript
interface GeographicBoundary {
  adm_level: number; // 0-4
  code: string; // BD.X.Y.Z format
  name: string;
  parent_code?: string;
  geometry: GeoJSON.Polygon;
  properties: {
    population?: number;
    area_km2?: number;
    established_date?: string;
  };
}
```

#### Real-time Geocoding
```typescript
interface GeocodingService {
  // Address to coordinates
  geocode(address: string): Promise<Coordinates>;
  
  // Coordinates to administrative info
  reverseGeocode(lat: number, lng: number): Promise<AdministrativeInfo>;
  
  // Camp location lookup
  findCamp(campCode: string): Promise<CampInfo>;
}

interface AdministrativeInfo {
  adm0: string; // Country
  adm1: string; // Division
  adm2: string; // District
  adm3: string; // Upazilla
  adm4: string; // Union/Municipality
  full_code: string; // BD.X.Y.Z.W format
}
```

## 🔧 Technical Implementation

### Database Schema

#### Administrative Boundaries Table
```sql
CREATE TABLE administrative_boundaries (
  id SERIAL PRIMARY KEY,
  adm_level INTEGER NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  parent_code VARCHAR(20),
  geometry GEOMETRY(POLYGON, 4326),
  properties JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_boundaries_code ON administrative_boundaries(code);
CREATE INDEX idx_admin_boundaries_level ON administrative_boundaries(adm_level);
CREATE INDEX idx_admin_boundaries_parent ON administrative_boundaries(parent_code);
CREATE INDEX idx_admin_boundaries_geom ON administrative_boundaries USING GIST(geometry);
```

#### Camp Boundaries Table
```sql
CREATE TABLE camp_boundaries (
  id SERIAL PRIMARY KEY,
  camp_code VARCHAR(20) UNIQUE NOT NULL,
  camp_name VARCHAR(100) NOT NULL,
  camp_type VARCHAR(20) NOT NULL, -- REGISTERED, NEW_ARRIVAL
  administrative_code VARCHAR(20) REFERENCES administrative_boundaries(code),
  center_lat DECIMAL(10,8) NOT NULL,
  center_lng DECIMAL(11,8) NOT NULL,
  bounds_lat_north DECIMAL(10,8) NOT NULL,
  bounds_lat_south DECIMAL(10,8) NOT NULL,
  bounds_lng_east DECIMAL(11,8) NOT NULL,
  bounds_lng_west DECIMAL(11,8) NOT NULL,
  geometry GEOMETRY(POLYGON, 4326),
  properties JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Integration

#### Geographic Lookup API
```typescript
// GET /api/v1/geographic/administrative/:code
GET /api/v1/geographic/administrative/BD.2.1.4.3
Response: {
  "code": "BD.2.1.4.3",
  "adm0": "Bangladesh",
  "adm1": "Chattogram",
  "adm2": "Cox's Bazar",
  "adm3": "Ukhiya",
  "adm4": "Kutupalong",
  "geometry": {...}
}

// GET /api/v1/geographic/camp/:campCode
GET /api/v1/geographic/camp/CAMP-KTP-001
Response: {
  "camp_code": "CAMP-KTP-001",
  "camp_name": "Kutupalong Registered Camp",
  "administrative_code": "BD.2.1.4.3",
  "blocks": [...],
  "coordinates": {...}
}
```

## 📱 Patient Address Auto-fill

### Address Resolution Logic
```typescript
class AddressResolver {
  async resolvePatientAddress(patient: Patient): Promise<ResolvedAddress> {
    if (patient.origin === 'Bangladeshi') {
      return this.resolveBangladeshiAddress(patient.address);
    } else if (patient.origin === 'Rohingya') {
      return this.resolveRohingyaAddress(patient.address);
    } else {
      return this.resolveGlobalAddress(patient.address);
    }
  }

  private async resolveBangladeshiAddress(address: BangladeshiAddress) {
    // Auto-fill based on administrative hierarchy
    const upazilla = await this.getUpazilla(address.upazilla);
    const union = await this.getUnion(address.union_municipality);
    const village = await this.getVillage(address.village);
    
    return {
      ...address,
      administrative_code: `BD.${upazilla.division_code}.${upazilla.district_code}.${upazilla.code}.${union.code}`,
      coordinates: await this.geocode(`${village.name}, ${union.name}, ${upazilla.name}, Bangladesh`)
    };
  }

  private async resolveRohingyaAddress(address: RohingyaAddress) {
    // Auto-fill based on camp hierarchy
    const camp = await this.getCamp(address.camp_name);
    const block = await this.getBlock(address.main_block);
    const subBlock = await this.getSubBlock(address.sub_block);
    
    return {
      ...address,
      administrative_code: camp.administrative_code,
      coordinates: await this.getCampCoordinates(camp.camp_code, block.block_code, subBlock.sub_block_code)
    };
  }
}
```

## 🗺️ GIS Integration

### Map Services Integration
```typescript
interface MapService {
  // Leaflet/OpenLayers integration
  displayAdministrativeBoundaries(admCode: string): void;
  displayCampBoundaries(campCode: string): void;
  displayPatientLocation(patientId: string): void;
  
  // Service area mapping
  showServiceAreas(serviceType: string): void;
  calculateDistance(from: Coordinates, to: Coordinates): number;
  
  // Emergency response
  showNearestFacilities(location: Coordinates, facilityType: string): Facility[];
}
```

### Spatial Analysis
```typescript
class SpatialAnalysis {
  // Find patients within administrative boundary
  async getPatientsInBoundary(admCode: string): Promise<Patient[]> {
    const boundary = await this.getBoundary(admCode);
    return await this.patientRepository.findByLocation(boundary.geometry);
  }

  // Calculate service coverage
  async calculateServiceCoverage(serviceType: string): Promise<CoverageReport> {
    const facilities = await this.getFacilitiesByType(serviceType);
    const population = await this.getPopulationInServiceArea(facilities);
    
    return {
      service_type: serviceType,
      total_facilities: facilities.length,
      served_population: population,
      coverage_percentage: (population.served / population.total) * 100
    };
  }

  // Camp capacity analysis
  async analyzeCampCapacity(campCode: string): Promise<CampCapacityReport> {
    const camp = await this.getCamp(campCode);
    const currentPopulation = await this.getCampPopulation(campCode);
    
    return {
      camp_code: campCode,
      capacity: camp.properties.capacity,
      current_population: currentPopulation,
      utilization_percentage: (currentPopulation / camp.properties.capacity) * 100,
      available_capacity: camp.properties.capacity - currentPopulation
    };
  }
}
```

## 📊 Data Quality & Validation

### Coordinate Validation
```typescript
interface CoordinateValidator {
  validateCoordinates(lat: number, lng: number): ValidationResult;
  validateBoundary(geometry: GeoJSON.Polygon): ValidationResult;
  validateAdministrativeCode(code: string): ValidationResult;
}

// Bangladesh coordinate bounds validation
const BANGLADESH_BOUNDS = {
  north: 26.634,
  south: 20.744,
  east: 92.673,
  west: 88.013
};
```

### Data Synchronization
```typescript
interface GeographicDataSync {
  // Sync from external sources
  syncAdministrativeBoundaries(): Promise<SyncResult>;
  syncCampBoundaries(): Promise<SyncResult>;
  
  // Update frequency
  scheduleSync(source: string, frequency: 'daily' | 'weekly' | 'monthly'): void;
  
  // Data versioning
  getDataVersion(source: string): Promise<string>;
  rollbackToVersion(version: string): Promise<void>;
}
```

## 🔍 Search & Discovery

### Geographic Search
```typescript
interface GeographicSearch {
  // Search by administrative boundary
  searchByAdministrativeCode(code: string): Promise<GeographicResult[]>;
  
  // Search by camp
  searchByCamp(campName: string): Promise<GeographicResult[]>;
  
  // Search by coordinates
  searchByCoordinates(lat: number, lng: number, radius: number): Promise<GeographicResult[]>;
  
  // Autocomplete for address input
  autoCompleteAddress(query: string): Promise<AddressSuggestion[]>;
}
```

## 📈 Analytics & Reporting

### Geographic Analytics
```typescript
interface GeographicAnalytics {
  // Patient distribution by area
  getPatientDistributionByArea(admLevel: number): Promise<DistributionReport>;
  
  // Service utilization by geography
  getServiceUtilizationByGeography(serviceType: string): Promise<UtilizationReport>;
  
  // Camp population trends
  getCampPopulationTrends(campCode: string, period: string): Promise<TrendReport>;
  
  // Healthcare access analysis
  analyzeHealthcareAccess(): Promise<AccessReport>;
}
```

## 🛡️ Security & Privacy

### Location Data Protection
- **Data Encryption**: All geographic data encrypted at rest
- **Access Control**: Role-based access to location data
- **Audit Logging**: All location queries logged
- **Data Minimization**: Only necessary location data collected
- **Consent Management**: Patient consent for location tracking

### Privacy-Preserving Services
```typescript
interface PrivacyPreservingLocation {
  // Approximate location for privacy
  getApproximateLocation(patientId: string, precision: number): Coordinates;
  
  // Location-based services without exact coordinates
  getServicesByAreaOnly(admCode: string): Service[];
  
  // Emergency location disclosure
  discloseLocationForEmergency(patientId: string, emergencyType: string): Coordinates;
}
```

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Data Sources**: Humanitarian Data Exchange, UNHCR, ISCG  
**Compliance**: FHIR R5, Bangladesh DGHS, UNHCR Standards
