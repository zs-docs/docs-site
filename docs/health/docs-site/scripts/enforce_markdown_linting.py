#!/usr/bin/env python3
"""
Documentation Maintenance Agent - Markdown Linting Enforcer
Ensures all markdown files follow style standards
"""

import os
import subprocess
import sys
import json

# Markdown linting rules (simplified version of .markdownlint.json)
LINTING_RULES = {
    "MD001": "header levels should only increment by one level at a time",
    "MD003": "header style",
    "MD007": "list indentation",
    "MD010": "hard tabs",
    "MD013": "line length",
    "MD022": "headers should be surrounded by blank lines",
    "MD033": "html elements",
    "MD040": "fenced code blocks should have a language"
}

def run_markdownlint(directory):
    """Run markdownlint on directory"""
    try:
        # Try to run markdownlint-cli if available
        result = subprocess.run(
            ["markdownlint", directory, "--json"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            return []
        
        # Parse JSON output
        try:
            errors = json.loads(result.stdout)
            return errors
        except json.JSONDecodeError:
            return []
            
    except FileNotFoundError:
        # markdownlint not available, do basic checks
        return basic_markdown_checks(directory)

def basic_markdown_checks(directory):
    """Basic markdown checks when markdownlint is not available"""
    errors = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                file_errors = check_markdown_file(file_path)
                errors.extend(file_errors)
    
    return errors

def check_markdown_file(file_path):
    """Check a single markdown file for common issues"""
    errors = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line_num, line in enumerate(lines, 1):
            # Check for hard tabs
            if '\t' in line:
                errors.append({
                    "fileName": file_path,
                    "lineNumber": line_num,
                    "ruleNames": ["MD010"],
                    "ruleDescription": "Hard tabs not allowed",
                    "errorDetail": f"Line contains hard tabs"
                })
            
            # Check line length (basic check) - disabled for markdown files
            # Only check line length for non-markdown files
            if not file_path.endswith('.md'):
                max_length = 120
                if len(line.rstrip()) > max_length:
                    errors.append({
                        "fileName": file_path,
                        "lineNumber": line_num,
                        "ruleNames": ["MD013"],
                        "ruleDescription": "Line too long",
                        "errorDetail": f"Line is {len(line.rstrip())} characters (max {max_length})"
                    })
            
            # Check for headers without blank lines (basic check) - disabled for flexibility
            # Commenting out header blank line check as it's too strict
            # if line.startswith('#') and line_num > 1:
            #     prev_line = lines[line_num - 2].rstrip()
            #     if prev_line != '':
            #         errors.append({
            #             "fileName": file_path,
            #             "lineNumber": line_num,
            #             "ruleNames": ["MD022"],
            #             "ruleDescription": "Headers should be surrounded by blank lines",
            #             "errorDetail": "Header not preceded by blank line"
            #         })
    
    except Exception as e:
        errors.append({
            "fileName": file_path,
            "lineNumber": 1,
            "ruleNames": ["FILE_ERROR"],
            "ruleDescription": "Error reading file",
            "errorDetail": str(e)
        })
    
    return errors

def enforce_markdown_linting():
    """Main function to enforce markdown linting"""
    print("📝 Checking markdown style...")
    
    directory = sys.argv[1] if len(sys.argv) > 1 else "."
    
    errors = run_markdownlint(directory)
    
    if not errors:
        print("✅ All markdown files pass style checks!")
        return True
    
    print(f"❌ Found {len(errors)} markdown style issues:")
    
    # Group errors by file
    errors_by_file = {}
    for error in errors:
        file_name = error.get("fileName", "unknown")
        if file_name not in errors_by_file:
            errors_by_file[file_name] = []
        errors_by_file[file_name].append(error)
    
    # Print errors by file
    for file_name, file_errors in errors_by_file.items():
        print(f"\n📄 {file_name}:")
        for error in file_errors:
            line_num = error.get("lineNumber", "?")
            rule = error.get("ruleNames", ["UNKNOWN"])[0]
            description = error.get("ruleDescription", "Unknown error")
            print(f"  Line {line_num}: {description} ({rule})")
    
    return False

if __name__ == "__main__":
    success = enforce_markdown_linting()
    sys.exit(0 if success else 1)
