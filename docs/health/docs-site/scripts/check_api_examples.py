#!/usr/bin/env python3
"""
API Examples Checker
Checks if API documentation includes proper examples
"""

import os
import sys
import yaml
import json
from pathlib import Path

def check_api_examples(api_dir):
    """Check API documentation for examples"""
    print("📋 Checking API examples and documentation...")
    
    issues = []
    
    # Find all YAML files
    yaml_files = []
    for root, dirs, files in os.walk(api_dir):
        for file in files:
            if file.endswith(('.yaml', '.yml')):
                yaml_files.append(os.path.join(root, file))
    
    if not yaml_files:
        return ["No API specification files found"]
    
    for yaml_file in yaml_files:
        file_issues = check_examples_in_file(yaml_file)
        issues.extend(file_issues)
    
    return issues

def check_examples_in_file(file_path):
    """Check examples in a single API file"""
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        if 'paths' not in data:
            return issues
        
        paths = data['paths']
        for path, path_item in paths.items():
            for method, operation in path_item.items():
                if method in ['get', 'post', 'put', 'patch']:
                    # Check for request examples
                    if method in ['post', 'put', 'patch']:
                        if 'requestBody' in operation:
                            request_body = operation['requestBody']
                            if 'content' in request_body:
                                content = request_body['content']
                                if 'application/json' in content:
                                    json_content = content['application/json']
                                    if 'example' not in json_content and 'examples' not in json_content:
                                        issues.append(f"Missing request example for {method.upper()} {path} in {file_path}")
                    
                    # Check for response examples
                    responses = operation.get('responses', {})
                    for status_code, response in responses.items():
                        if status_code.startswith('2'):  # Success responses
                            if 'content' in response:
                                content = response['content']
                                if 'application/json' in content:
                                    json_content = content['application/json']
                                    if 'example' not in json_content and 'examples' not in json_content:
                                        issues.append(f"Missing response example for {method.upper()} {path} ({status_code}) in {file_path}")
    
    except Exception as e:
        issues.append(f"Error checking examples in {file_path}: {e}")
    
    return issues

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python check_api_examples.py <api_directory>")
        sys.exit(1)
    
    api_dir = sys.argv[1]
    issues = check_api_examples(api_dir)
    
    if issues:
        print(f"❌ Found {len(issues)} missing examples:")
        for issue in issues:
            print(f"  • {issue}")
        sys.exit(1)
    else:
        print("✅ API examples check passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()
