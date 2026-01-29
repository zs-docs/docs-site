#!/usr/bin/env python3
"""
API Documentation Validator
Validates API documentation structure and completeness
"""

import os
import sys
import yaml
import json
from pathlib import Path

def validate_api_docs(api_dir):
    """Validate API documentation structure"""
    print("🔍 Validating API documentation structure...")
    
    issues = []
    
    # Check if API directory exists
    if not os.path.exists(api_dir):
        issues.append(f"API directory not found: {api_dir}")
        return issues
    
    # Find all YAML files
    yaml_files = []
    for root, dirs, files in os.walk(api_dir):
        for file in files:
            if file.endswith(('.yaml', '.yml')):
                yaml_files.append(os.path.join(root, file))
    
    if not yaml_files:
        issues.append("No API specification files found")
        return issues
    
    print(f"📁 Found {len(yaml_files)} API specification files")
    
    for yaml_file in yaml_files:
        file_issues = validate_api_file(yaml_file)
        issues.extend(file_issues)
    
    return issues

def validate_api_file(file_path):
    """Validate a single API specification file"""
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Try to parse as YAML
        try:
            data = yaml.safe_load(content)
        except yaml.YAMLError as e:
            issues.append(f"Invalid YAML in {file_path}: {e}")
            return issues
        
        # Validate OpenAPI structure
        if 'openapi' not in data:
            issues.append(f"Missing 'openapi' version in {file_path}")
        
        if 'info' not in data:
            issues.append(f"Missing 'info' section in {file_path}")
        else:
            info = data['info']
            if 'title' not in info:
                issues.append(f"Missing 'title' in info section of {file_path}")
            if 'version' not in info:
                issues.append(f"Missing 'version' in info section of {file_path}")
        
        if 'paths' not in data:
            issues.append(f"Missing 'paths' section in {file_path}")
        else:
            paths = data['paths']
            if not paths:
                issues.append(f"No paths defined in {file_path}")
            else:
                for path, path_item in paths.items():
                    if not path.startswith('/'):
                        issues.append(f"Path must start with '/': {path} in {file_path}")
                    
                    # Validate path methods
                    for method, operation in path_item.items():
                        if method in ['get', 'post', 'put', 'patch', 'delete']:
                            if 'summary' not in operation:
                                issues.append(f"Missing summary for {method.upper()} {path} in {file_path}")
                            if 'responses' not in operation:
                                issues.append(f"Missing responses for {method.upper()} {path} in {file_path}")
        
        # Check for ZARISH-specific patterns
        if 'servers' in data:
            servers = data['servers']
            for server in servers:
                url = server.get('url', '')
                # Extract path from full URL
                if '://' in url:
                    path = url.split('://', 1)[1].split('/', 1)
                    if len(path) > 1:
                        path = '/' + path[1]
                    else:
                        path = ''
                else:
                    path = url
                
                if not path.startswith('/v'):
                    issues.append(f"Server URL should be versioned: {url} in {file_path}")
    
    except Exception as e:
        issues.append(f"Error reading {file_path}: {e}")
    
    return issues

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python validate_api_docs.py <api_directory>")
        sys.exit(1)
    
    api_dir = sys.argv[1]
    issues = validate_api_docs(api_dir)
    
    if issues:
        print(f"❌ Found {len(issues)} issues:")
        for issue in issues:
            print(f"  • {issue}")
        sys.exit(1)
    else:
        print("✅ API documentation validation passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()
