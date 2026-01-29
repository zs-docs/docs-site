#!/usr/bin/env python3
"""
API Specification Validator Script
"""

import sys
import json
import yaml
from pathlib import Path

def validate_yaml_syntax(spec_file):
    """Validate YAML syntax"""
    try:
        with open(spec_file, 'r') as f:
            yaml.safe_load(f)
        return True, "YAML syntax valid"
    except Exception as e:
        return False, f"YAML syntax error: {e}"

def validate_openapi_structure(spec_file):
    """Validate OpenAPI structure"""
    try:
        with open(spec_file, 'r') as f:
            doc = yaml.safe_load(f)
        
        errors = []
        if 'openapi' not in doc:
            errors.append("Missing openapi version")
        if 'info' not in doc:
            errors.append("Missing info section")
        if 'paths' not in doc:
            errors.append("Missing paths section")
        
        if errors:
            return False, "\n".join(f"❌ {error}" for error in errors)
        else:
            return True, "✅ OpenAPI structure valid"
    except Exception as e:
        return False, f"❌ Validation error: {e}"

def validate_openapi_spec(spec_file):
    """Validate with openapi-spec-validator"""
    try:
        from openapi_spec_validator import validate_spec
        with open(spec_file, 'r') as f:
            spec = yaml.safe_load(f)
        validate_spec(spec)
        return True, "✅ OpenAPI specification valid"
    except Exception as e:
        return False, f"❌ OpenAPI validation error: {e}"

def validate_fhir_profile(profile_file):
    """Validate FHIR profile"""
    try:
        with open(profile_file, 'r') as f:
            doc = json.load(f)
        
        errors = []
        if 'resourceType' not in doc or doc['resourceType'] != 'StructureDefinition':
            errors.append("Not a FHIR StructureDefinition")
        if 'url' not in doc:
            errors.append("Missing URL")
        if 'status' not in doc:
            errors.append("Missing status")
        
        if errors:
            return False, "\n".join(f"❌ {error}" for error in errors)
        else:
            return True, "✅ FHIR profile structure valid"
    except Exception as e:
        return False, f"❌ FHIR validation error: {e}"

def main():
    """Main validation function"""
    if len(sys.argv) < 2:
        print("Usage: python validate-api.py <file>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    file_path = Path(file_path)
    
    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        sys.exit(1)
    
    print(f"Validating: {file_path}")
    
    # Determine file type and validate accordingly
    if file_path.suffix == '.yaml' or file_path.suffix == '.yml':
        # YAML API specification
        valid, message = validate_yaml_syntax(file_path)
        print(message)
        
        if valid:
            valid, message = validate_openapi_structure(file_path)
            print(message)
            
            if valid:
                valid, message = validate_openapi_spec(file_path)
                print(message)
    
    elif file_path.suffix == '.json':
        # JSON FHIR profile
        valid, message = validate_fhir_profile(file_path)
        print(message)
    
    else:
        print(f"❌ Unsupported file type: {file_path.suffix}")
        sys.exit(1)

if __name__ == "__main__":
    main()
