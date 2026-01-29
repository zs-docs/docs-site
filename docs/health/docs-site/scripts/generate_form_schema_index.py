#!/usr/bin/env python3
"""
Documentation Maintenance Agent - Form Schema Index Generator
Automatically updates the form index in README.md
"""

import os
import json
import re
from pathlib import Path

def get_form_schemas(forms_dir):
    """Get all form schema files and their metadata"""
    forms = []
    
    if not os.path.exists(forms_dir):
        return forms
    
    for file in os.listdir(forms_dir):
        if file.endswith('.json'):
            file_path = os.path.join(forms_dir, file)
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    form_data = json.load(f)
                
                forms.append({
                    'filename': file,
                    'name': form_data.get('name', 'Unknown Form'),
                    'description': form_data.get('description', 'No description'),
                    'uuid': form_data.get('uuid', 'No UUID'),
                    'encounter': form_data.get('encounter', 'No encounter type')
                })
            except Exception as e:
                print(f"Error reading {file}: {e}")
                forms.append({
                    'filename': file,
                    'name': file.replace('.json', '').replace('-', ' ').title(),
                    'description': 'Error reading form data',
                    'uuid': 'N/A',
                    'encounter': 'N/A'
                })
    
    return sorted(forms, key=lambda x: x['name'])

def generate_form_table(forms):
    """Generate markdown table for forms"""
    if not forms:
        return "No form schemas found."
    
    table_lines = [
        "| Form Name | Description | Encounter Type | File |",
        "|-----------|-------------|----------------|------|"
    ]
    
    for form in forms:
        # Escape markdown special characters
        name = form['name'].replace('|', '\\|')
        description = form['description'].replace('|', '\\|')
        encounter = form['encounter'].replace('|', '\\|')
        
        table_lines.append(f"| {name} | {description} | {encounter} | [{form['filename']}](forms-registry/clinical/{form['filename']}) |")
    
    return '\n'.join(table_lines)

def update_readme(readme_path, form_table):
    """Update README.md with new form table"""
    if not os.path.exists(readme_path):
        print(f"README.md not found at {readme_path}")
        return False
    
    try:
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for form index markers
        start_marker = "<!-- FORM_INDEX_START -->"
        end_marker = "<!-- FORM_INDEX_END -->"
        
        if start_marker in content and end_marker in content:
            # Replace content between markers
            start_index = content.find(start_marker) + len(start_marker)
            end_index = content.find(end_marker)
            
            new_content = (
                content[:start_index] + 
                "\n" + form_table + "\n" + 
                content[end_index:]
            )
            
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ Updated form index in {readme_path}")
            return True
        else:
            # Add markers and table at end of file
            markers_and_table = f"\n{start_marker}\n{form_table}\n{end_marker}\n"
            
            with open(readme_path, 'a', encoding='utf-8') as f:
                f.write(markers_and_table)
            
            print(f"✅ Added form index to {readme_path}")
            return True
            
    except Exception as e:
        print(f"Error updating README.md: {e}")
        return False

def generate_form_schema_index():
    """Main function to generate form schema index"""
    print("📋 Generating form schema index...")
    
    # Paths
    docs_root = "."
    forms_dir = os.path.join(docs_root, "05-metadata-forms", "forms-registry", "clinical")
    readme_path = os.path.join(docs_root, "05-metadata-forms", "README.md")
    
    # Get form schemas
    forms = get_form_schemas(forms_dir)
    print(f"📁 Found {len(forms)} form schemas")
    
    # Generate table
    form_table = generate_form_table(forms)
    
    # Update README
    success = update_readme(readme_path, form_table)
    
    if success:
        print("✅ Form schema index updated successfully!")
        return True
    else:
        print("❌ Failed to update form schema index")
        return False

if __name__ == "__main__":
    import sys
    docs_root = sys.argv[1] if len(sys.argv) > 1 else "."
    os.chdir(docs_root)
    success = generate_form_schema_index()
    sys.exit(0 if success else 1)
