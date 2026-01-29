#!/usr/bin/env python3
"""
FHIR Resource Validation Tool for ZARISH HIS

This script validates FHIR resources against ZARISH HIS profiles and extensions,
ensuring compliance with Bangladesh healthcare context and standards.

Usage:
    python validate-fhir-resources.py --file <path-to-fhir-resource>
    python validate-fhir-resources.py --directory <path-to-fhir-resources>
    python validate-fhir-resources.py --help
"""

import json
import sys
import os
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class FHIRValidator:
    """FHIR Resource Validator for ZARISH HIS"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        
        # ZARISH HIS specific validation rules
        self.zarish_profiles = {
            "Patient": {
                "required_extensions": [
                    "patient-nationality"
                ],
                "required_fields": ["name", "gender", "birthDate"],
                "nationality_codes": ["BD", "ROH", "OTH"]
            },
            "Practitioner": {
                "required_extensions": [
                    "bmdc-registration"
                ],
                "required_fields": ["name", "qualification"],
                "bmdc_pattern": r"^BMDC\d{6}$"
            },
            "Encounter": {
                "required_extensions": [
                    "service-type"
                ],
                "required_fields": ["status", "class", "subject"],
                "service_types": ["GOPD", "SOPD", "IPD", "EMERGENCY", "NCD", "MATERNAL"]
            },
            "Observation": {
                "required_fields": ["status", "code", "subject"],
                "value_types": ["Quantity", "CodeableConcept", "string", "boolean", "integer"],
                "code_systems": ["http://loinc.org", "https://zs-his.github.io/docs/fhir/CodeSystem/zarish-observation-codes"]
            },
            "MedicationRequest": {
                "required_fields": ["status", "intent", "medication", "subject"],
                "intent_codes": ["order", "plan", "proposal"],
                "category_codes": ["inpatient", "outpatient", "community", "discharge"]
            },
            "Procedure": {
                "required_fields": ["status", "code", "subject"],
                "status_codes": ["preparation", "in-progress", "not-done", "on-hold", "stopped", "completed", "entered-in-error", "unknown"],
                "category_codes": ["http://snomed.info/sct"]
            },
            "Appointment": {
                "required_fields": ["status", "participant"],
                "status_codes": ["proposed", "pending", "booked", "arrived", "fulfilled", "cancelled", "noshow", "entered-in-error", "checked-in", "waitlist"],
                "participant_required": True
            },
            "DiagnosticReport": {
                "required_fields": ["status", "code", "subject"],
                "status_codes": ["registered", "partial", "preliminary", "final", "amended", "corrected", "appended", "cancelled", "entered-in-error", "unknown"],
                "category_codes": ["LAB", "RAD", "PATH", "MICRO"]
            }
        }
    
    def validate_resource(self, resource: Dict[str, Any]) -> bool:
        """Validate a single FHIR resource"""
        resource_type = resource.get("resourceType")
        
        if not resource_type:
            self.errors.append("Missing resourceType")
            return False
        
        if resource_type not in self.zarish_profiles:
            self.warnings.append(f"Unknown resource type: {resource_type}")
            return True
        
        profile = self.zarish_profiles[resource_type]
        
        # Validate required fields
        self._validate_required_fields(resource, profile, resource_type)
        
        # Validate extensions based on resource type
        self._validate_extensions(resource, profile, resource_type)
        
        # Resource-specific validations
        if resource_type == "Patient":
            self._validate_patient(resource)
        elif resource_type == "Practitioner":
            self._validate_practitioner(resource)
        elif resource_type == "Encounter":
            self._validate_encounter(resource)
        elif resource_type == "Observation":
            self._validate_observation(resource)
        elif resource_type == "MedicationRequest":
            self._validate_medication_request(resource)
        elif resource_type == "Procedure":
            self._validate_procedure(resource)
        elif resource_type == "Appointment":
            self._validate_appointment(resource)
        elif resource_type == "DiagnosticReport":
            self._validate_diagnostic_report(resource)
        
        return len(self.errors) == 0
    
    def _validate_required_fields(self, resource: Dict[str, Any], profile: Dict[str, Any], resource_type: str):
        """Validate required fields for a resource"""
        required_fields = profile.get("required_fields", [])
        
        for field in required_fields:
            if field not in resource:
                self.errors.append(f"{resource_type}: Missing required field '{field}'")
    
    def _validate_extensions(self, resource: Dict[str, Any], profile: Dict[str, Any], resource_type: str):
        """Validate required extensions for a resource"""
        required_extensions = profile.get("required_extensions", [])
        extensions = resource.get("extension", [])
        
        extension_urls = [ext.get("url", "") for ext in extensions]
        
        for required_ext in required_extensions:
            if not any(required_ext in url for url in extension_urls):
                self.errors.append(f"{resource_type}: Missing required extension '{required_ext}'")
    
    def _validate_patient(self, resource: Dict[str, Any]):
        """Validate Patient resource with ZARISH extensions"""
        profile = self.zarish_profiles["Patient"]
        
        # Validate nationality extension
        extensions = resource.get("extension", [])
        nationality_ext = None
        
        for ext in extensions:
            if "patient-nationality" in ext.get("url", ""):
                nationality_ext = ext
                break
        
        if not nationality_ext:
            self.errors.append("Patient: Missing patient-nationality extension")
            return
        
        nationality_value = nationality_ext.get("valueCodeableConcept", {})
        nationality_coding = nationality_value.get("coding", [])
        
        if not nationality_coding:
            self.errors.append("Patient: Invalid nationality extension format")
            return
        
        nationality_code = nationality_coding[0].get("code")
        if nationality_code not in profile["nationality_codes"]:
            self.errors.append(f"Patient: Invalid nationality code '{nationality_code}'")
        
        # Validate identifiers based on nationality
        identifiers = resource.get("identifier", [])
        
        if nationality_code == "BD":
            self._validate_bangladeshi_identifiers(identifiers)
        elif nationality_code == "ROH":
            self._validate_rohingya_identifiers(identifiers)
        
        # Validate address based on nationality
        addresses = resource.get("address", [])
        if addresses:
            if nationality_code == "BD":
                self._validate_bangladeshi_address(addresses[0])
            elif nationality_code == "ROH":
                self._validate_rohingya_address(addresses[0])
    
    def _validate_bangladeshi_identifiers(self, identifiers: List[Dict[str, Any]]):
        """Validate Bangladeshi patient identifiers"""
        has_nid = False
        
        for identifier in identifiers:
            identifier_type = identifier.get("type", {})
            coding = identifier_type.get("coding", [])
            
            if coding and coding[0].get("code") == "NID":
                nid_value = identifier.get("value", "")
                if not re.match(r"^\d{13}$", nid_value):
                    self.errors.append(f"Patient: Invalid NID format '{nid_value}' (must be 13 digits)")
                has_nid = True
        
        if not has_nid:
            self.warnings.append("Patient: Bangladeshi citizen should have NID identifier")
    
    def _validate_rohingya_identifiers(self, identifiers: List[Dict[str, Any]]):
        """Validate Rohingya refugee identifiers"""
        has_progress_id = False
        has_mrc = False
        has_fcn = False
        
        for identifier in identifiers:
            identifier_type = identifier.get("type", {})
            coding = identifier_type.get("coding", [])
            
            if coding:
                code = coding[0].get("code")
                value = identifier.get("value", "")
                
                if code == "PROGRESS_ID":
                    if not re.match(r"^PROG\d{9}$", value):
                        self.errors.append(f"Patient: Invalid ProGress ID format '{value}'")
                    has_progress_id = True
                elif code == "MRC":
                    if not re.match(r"^MRC\d{9}$", value):
                        self.errors.append(f"Patient: Invalid MRC format '{value}'")
                    has_mrc = True
                elif code == "FCN":
                    if not re.match(r"^FCN-[A-Z]{3}-BLOCK-[A-Z]-\d{3}$", value):
                        self.errors.append(f"Patient: Invalid FCN format '{value}'")
                    has_fcn = True
        
        if not (has_progress_id or has_mrc or has_fcn):
            self.warnings.append("Patient: Rohingya refugee should have at least one refugee identifier")
    
    def _validate_bangladeshi_address(self, address: Dict[str, Any]):
        """Validate Bangladeshi address format"""
        extensions = address.get("extension", [])
        
        has_admin_boundary = False
        for ext in extensions:
            if "administrative-boundaries" in ext.get("url", ""):
                boundary_value = ext.get("valueString", "")
                if not re.match(r"^BD\.\d+(\.\d+(\.\d+(\.\d+)?)?)?$", boundary_value):
                    self.errors.append(f"Address: Invalid administrative boundary format '{boundary_value}'")
                has_admin_boundary = True
        
        if not has_admin_boundary:
            self.warnings.append("Address: Bangladeshi address should include administrative boundaries")
    
    def _validate_rohingya_address(self, address: Dict[str, Any]):
        """Validate Rohingya camp address format"""
        extensions = address.get("extension", [])
        
        has_camp_info = False
        for ext in extensions:
            if "camp-information" in ext.get("url", ""):
                has_camp_info = True
        
        if not has_camp_info:
            self.warnings.append("Address: Rohingya refugee address should include camp information")
    
    def _validate_practitioner(self, resource: Dict[str, Any]):
        """Validate Practitioner resource with BMDC registration"""
        profile = self.zarish_profiles["Practitioner"]
        
        # Validate BMDC registration extension
        extensions = resource.get("extension", [])
        bmdc_ext = None
        
        for ext in extensions:
            if "bmdc-registration" in ext.get("url", ""):
                bmdc_ext = ext
                break
        
        if not bmdc_ext:
            self.errors.append("Practitioner: Missing bmdc-registration extension")
            return
        
        # Extract BMDC number from extension
        bmdc_extensions = bmdc_ext.get("extension", [])
        bmdc_number = None
        
        for ext in bmdc_extensions:
            if ext.get("url") == "bmdcNumber":
                bmdc_number = ext.get("valueString")
                break
        
        if not bmdc_number:
            self.errors.append("Practitioner: Missing BMDC number in extension")
            return
        
        if not re.match(profile["bmdc_pattern"], bmdc_number):
            self.errors.append(f"Practitioner: Invalid BMDC number format '{bmdc_number}'")
    
    def _validate_encounter(self, resource: Dict[str, Any]):
        """Validate Encounter resource"""
        profile = self.zarish_profiles["Encounter"]
        
        # Validate service type extension
        extensions = resource.get("extension", [])
        service_type_ext = None
        
        for ext in extensions:
            if "service-type" in ext.get("url", ""):
                service_type_ext = ext
                break
        
        if not service_type_ext:
            self.errors.append("Encounter: Missing service-type extension")
            return
        
        service_type_value = service_type_ext.get("valueCodeableConcept", {})
        service_type_coding = service_type_value.get("coding", [])
        
        if service_type_coding:
            service_type_code = service_type_coding[0].get("code")
            if service_type_code not in profile["service_types"]:
                self.errors.append(f"Encounter: Invalid service type '{service_type_code}'")
    
    def _validate_observation(self, resource: Dict[str, Any]):
        """Validate Observation resource"""
        profile = self.zarish_profiles["Observation"]
        
        # Validate code system
        code = resource.get("code", {})
        coding = code.get("coding", [])
        
        if coding:
            code_system = coding[0].get("system", "")
            if code_system not in profile["code_systems"]:
                self.warnings.append(f"Observation: Unknown code system '{code_system}'")
        
        # Validate value type
        if "valueQuantity" in resource:
            value = resource["valueQuantity"]
            if not isinstance(value, dict) or "value" not in value or "unit" not in value:
                self.errors.append("Observation: Invalid valueQuantity structure")
        elif "valueCodeableConcept" in resource:
            value = resource["valueCodeableConcept"]
            if not isinstance(value, dict) or "coding" not in value:
                self.errors.append("Observation: Invalid valueCodeableConcept structure")
    
    def _validate_medication_request(self, resource: Dict[str, Any]):
        """Validate MedicationRequest resource"""
        profile = self.zarish_profiles["MedicationRequest"]
        
        # Validate intent
        intent = resource.get("intent", {})
        if isinstance(intent, dict):
            intent_coding = intent.get("coding", [])
            if intent_coding:
                intent_code = intent_coding[0].get("code")
                if intent_code not in profile["intent_codes"]:
                    self.errors.append(f"MedicationRequest: Invalid intent code '{intent_code}'")
        
        # Validate category
        category = resource.get("category", {})
        if isinstance(category, dict):
            category_coding = category.get("coding", [])
            if category_coding:
                category_code = category_coding[0].get("code")
                if category_code not in profile["category_codes"]:
                    self.warnings.append(f"MedicationRequest: Unknown category code '{category_code}'")
    
    def _validate_procedure(self, resource: Dict[str, Any]):
        """Validate Procedure resource"""
        profile = self.zarish_profiles["Procedure"]
        
        # Validate status
        status = resource.get("status")
        if status not in profile["status_codes"]:
            self.errors.append(f"Procedure: Invalid status '{status}'")
        
        # Validate code system
        code = resource.get("code", {})
        coding = code.get("coding", [])
        
        if coding:
            code_system = coding[0].get("system", "")
            if code_system not in profile["category_codes"]:
                self.warnings.append(f"Procedure: Unknown code system '{code_system}'")
    
    def _validate_appointment(self, resource: Dict[str, Any]):
        """Validate Appointment resource"""
        profile = self.zarish_profiles["Appointment"]
        
        # Validate status
        status = resource.get("status")
        if status not in profile["status_codes"]:
            self.errors.append(f"Appointment: Invalid status '{status}'")
        
        # Validate participants
        participants = resource.get("participant", [])
        if not participants:
            self.errors.append("Appointment: Missing participants")
        else:
            # Check if at least one participant is required
            has_required = False
            for participant in participants:
                if participant.get("status") == "accepted":
                    has_required = True
                    break
            
            if not has_required:
                self.warnings.append("Appointment: No accepted participants found")
    
    def _validate_diagnostic_report(self, resource: Dict[str, Any]):
        """Validate DiagnosticReport resource"""
        profile = self.zarish_profiles["DiagnosticReport"]
        
        # Validate status
        status = resource.get("status")
        if status not in profile["status_codes"]:
            self.errors.append(f"DiagnosticReport: Invalid status '{status}'")
        
        # Validate category
        category = resource.get("category", [])
        if category:
            category_coding = category[0].get("coding", [])
            if category_coding:
                category_code = category_coding[0].get("code")
                if category_code not in profile["category_codes"]:
                    self.warnings.append(f"DiagnosticReport: Unknown category code '{category_code}'")
    
    def get_validation_report(self) -> str:
        """Generate validation report"""
        report = []
        
        if self.errors:
            report.append("❌ ERRORS:")
            for error in self.errors:
                report.append(f"  - {error}")
        
        if self.warnings:
            report.append("⚠️  WARNINGS:")
            for warning in self.warnings:
                report.append(f"  - {warning}")
        
        if not self.errors and not self.warnings:
            report.append("✅ Validation passed successfully!")
        
        return "\n".join(report)

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Validate FHIR resources for ZARISH HIS")
    parser.add_argument("--file", help="Path to FHIR resource file")
    parser.add_argument("--directory", help="Path to directory containing FHIR resources")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    validator = FHIRValidator()
    
    if args.file:
        # Validate single file
        if not os.path.exists(args.file):
            logger.error(f"File not found: {args.file}")
            sys.exit(1)
        
        try:
            with open(args.file, 'r', encoding='utf-8') as f:
                resource = json.load(f)
            
            success = validator.validate_resource(resource)
            print(validator.get_validation_report())
            
            sys.exit(0 if success else 1)
            
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in {args.file}: {e}")
            sys.exit(1)
        except Exception as e:
            logger.error(f"Error processing {args.file}: {e}")
            sys.exit(1)
    
    elif args.directory:
        # Validate directory
        if not os.path.exists(args.directory):
            logger.error(f"Directory not found: {args.directory}")
            sys.exit(1)
        
        total_files = 0
        passed_files = 0
        
        for file_path in Path(args.directory).rglob("*.json"):
            total_files += 1
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    resource = json.load(f)
                
                success = validator.validate_resource(resource)
                
                if success:
                    passed_files += 1
                    logger.info(f"✅ {file_path.name}")
                else:
                    logger.error(f"❌ {file_path.name}")
                    print(f"\nValidation errors in {file_path.name}:")
                    print(validator.get_validation_report())
                    print("-" * 50)
                
            except json.JSONDecodeError as e:
                logger.error(f"❌ {file_path.name}: Invalid JSON - {e}")
            except Exception as e:
                logger.error(f"❌ {file_path.name}: {e}")
        
        print(f"\n📊 Summary:")
        print(f"  Total files: {total_files}")
        print(f"  Passed: {passed_files}")
        print(f"  Failed: {total_files - passed_files}")
        print(f"  Success rate: {(passed_files/total_files)*100:.1f}%")
        
        sys.exit(0 if passed_files == total_files else 1)
    
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
