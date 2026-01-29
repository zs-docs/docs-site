#!/usr/bin/env python3
"""
Documentation Maintenance Agent - Directory Structure Verifier
Ensures repository follows the established directory structure
"""

import os
import sys
from pathlib import Path

# Expected directory structure
EXPECTED_STRUCTURE = {
    "00-core-architecture": {
        "description": "Core system architecture documentation",
        "required_files": []
    },
    "01-standards": {
        "description": "Coding standards and conventions",
        "required_files": []
    },
    "02-microservices": {
        "description": "Microservices documentation",
        "required_files": []
    },
    "03-microfrontends": {
        "description": "Microfrontends documentation", 
        "required_files": []
    },
    "04-api-specifications": {
        "description": "API specifications and documentation",
        "required_files": []
    },
    "05-metadata-forms": {
        "description": "Clinical forms and metadata",
        "required_files": ["README.md"],
        "subdirs": {
            "forms-registry": {
                "required_files": [],
                "subdirs": {
                    "clinical": {
                        "required_files": []
                    }
                }
            },
            "form-metadata": {
                "required_files": []
            },
            "value-sets": {
                "required_files": []
            },
            "form-schemas": {
                "required_files": []
            },
            "mappings": {
                "required_files": []
            }
        }
    },
    "06-infrastructure": {
        "description": "Infrastructure documentation",
        "required_files": []
    },
    "07-regulatory-compliance": {
        "description": "Regulatory compliance documentation",
        "required_files": []
    }
}

def check_directory_structure(root_dir):
    """Check if directory structure matches expected structure"""
    print("🏗️  Verifying directory structure...")
    
    issues = []
    
    for expected_dir, config in EXPECTED_STRUCTURE.items():
        expected_path = os.path.join(root_dir, expected_dir)
        
        if not os.path.exists(expected_path):
            issues.append(f"Missing required directory: {expected_dir}")
            continue
        
        # Check required files
        for required_file in config.get("required_files", []):
            file_path = os.path.join(expected_path, required_file)
            if not os.path.exists(file_path):
                issues.append(f"Missing required file: {expected_dir}/{required_file}")
        
        # Check subdirectories
        for subdir_name, subdir_config in config.get("subdirs", {}).items():
            subdir_path = os.path.join(expected_path, subdir_name)
            if not os.path.exists(subdir_path):
                issues.append(f"Missing required subdirectory: {expected_dir}/{subdir_name}")
                continue
            
            # Check subdirectory files
            for required_file in subdir_config.get("required_files", []):
                file_path = os.path.join(subdir_path, required_file)
                if not os.path.exists(file_path):
                    issues.append(f"Missing required file: {expected_dir}/{subdir_name}/{required_file}")
            
            # Check nested subdirectories
            for nested_name, nested_config in subdir_config.get("subdirs", {}).items():
                nested_path = os.path.join(subdir_path, nested_name)
                if not os.path.exists(nested_path):
                    issues.append(f"Missing required subdirectory: {expected_dir}/{subdir_name}/{nested_name}")
    
    # Allow specific root-level files
    allowed_root_files = {
        'mkdocs.yml', 'CODEOWNERS', 'README.md', 'TODO.md', 'SETUP-GUIDE.md',
        'LICENSE', '.gitignore', '.markdownlint.json', '.spectral.yml',
        'COMPLIANCE-METRICS.md', 'EVENT-MONITORING.md', 'API-STANDARDS-VALIDATION.md',
        'EVENT-FLOW-DIAGRAM.md', 'AUTOMATION-SETUP-COMPLETE.md',
        'compliance-metrics.json', 'event-architecture-data.json', 'api-standards-validation.json'
    }

    # Check for unexpected top-level directories
    existing_dirs = [d for d in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, d))]
    expected_dirs = set(EXPECTED_STRUCTURE.keys())
    # Allow scripts and tools directories and hidden directories
    unexpected_dirs = [d for d in existing_dirs if d not in expected_dirs and not d.startswith('.') and d not in ['scripts', 'tools']]

    for unexpected_dir in unexpected_dirs:
        issues.append(f"Unexpected directory found: {unexpected_dir}")

    # Check for unexpected top-level files
    existing_files = [f for f in os.listdir(root_dir) if os.path.isfile(os.path.join(root_dir, f))]
    unexpected_files = [f for f in existing_files if f not in allowed_root_files and not f.startswith('.')]

    for unexpected_file in unexpected_files:
        issues.append(f"Unexpected file found at root: {unexpected_file}")
    
    return issues

def check_file_types(root_dir):
    """Check that files are in correct directories"""
    print("📁 Verifying file locations...")
    
    issues = []
    
    for root, dirs, files in os.walk(root_dir):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, root_dir)
            
            # Check file type locations
            if file.endswith('.json'):
                # JSON files should be in forms-registry, except .markdownlint.json, .spectral.yml, and monitoring files
                allowed_json_files = ['.markdownlint.json', 'compliance-metrics.json', 'event-architecture-data.json', 'api-standards-validation.json', 'ui-components-catalog.json', 'package.json', 'ig.json']
                # Allow ZARISH FHIR IG files in 05-metadata-forms
                zarish_ig_files = ['ig-zarish-his.json', 'StructureDefinition-zarish-', 'ValueSet-zarish-', 'CodeSystem-zarish-', 'Extension-', 'patient-zarish.json', 'observation-vitals.json']
                
                if 'forms-registry' in relative_path:
                    # Allow all JSON files in forms-registry
                    pass
                elif '05-metadata-forms' not in relative_path and not any(file.endswith(allowed) for allowed in allowed_json_files):
                    issues.append(f"JSON file in unexpected location: {relative_path}")
                elif '05-metadata-forms' in relative_path and not any(file.endswith(allowed) for allowed in allowed_json_files) and not any(pattern in file for pattern in zarish_ig_files):
                    issues.append(f"Unexpected JSON file in 05-metadata-forms: {relative_path}")
            
            elif file.endswith('.yml') or file.endswith('.yaml'):
                # YAML files should be in api-specifications, except .spectral.yml and mkdocs.yml
                if 'api-specifications' not in relative_path and not file.endswith(('.spectral.yml', 'mkdocs.yml')):
                    issues.append(f"YAML file in unexpected location: {relative_path}")
            
            elif file.endswith('.md'):
                # Markdown files are generally okay anywhere
                pass
    
    return issues

def verify_directory_structure():
    """Main verification function"""
    root_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    
    print(f"🔍 Checking directory structure in: {root_dir}")
    
    # Check structure
    structure_issues = check_directory_structure(root_dir)
    
    # Check file types
    file_type_issues = check_file_types(root_dir)
    
    all_issues = structure_issues + file_type_issues
    
    if all_issues:
        print(f"❌ Found {len(all_issues)} issues:")
        for issue in all_issues:
            print(f"  • {issue}")
        return False
    else:
        print("✅ Directory structure is correct!")
        return True

if __name__ == "__main__":
    success = verify_directory_structure()
    sys.exit(0 if success else 1)
