#!/usr/bin/env python3
"""
Documentation Maintenance Agent - Link Validator
Checks for broken internal links in all markdown files
"""

import os
import re
import sys
from pathlib import Path

def extract_links_from_file(file_path):
    """Extract all relative links from a markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find markdown links: [text](link)
        link_pattern = r'\[([^\]]*)\]\(([^)]+)\)'
        matches = re.findall(link_pattern, content)
        
        links = []
        for text, link in matches:
            # Skip external links (http://, https://, mailto:, etc.)
            if not link.startswith(('http://', 'https://', 'mailto:', '#', 'ftp://')):
                links.append((text, link))
        
        return links
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def resolve_link_path(base_file, link):
    """Resolve relative link to absolute path"""
    base_dir = os.path.dirname(base_file)
    resolved_path = os.path.normpath(os.path.join(base_dir, link))
    
    # Handle anchor links (file.md#section)
    if '#' in resolved_path:
        file_path, anchor = resolved_path.split('#', 1)
        return file_path, anchor
    else:
        return resolved_path, None

def check_file_exists(file_path):
    """Check if a file or directory exists"""
    return os.path.exists(file_path)

def check_anchor_exists(file_path, anchor):
    """Check if an anchor exists in a markdown file"""
    if not os.path.isfile(file_path):
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert anchor to match markdown header format
        # Headers become #header-name-with-dashes
        anchor_search = anchor.lower().replace(' ', '-')
        
        # Look for headers matching the anchor
        header_pattern = rf'^#+\s+.*{re.escape(anchor_search)}.*$'
        return bool(re.search(header_pattern, content, re.MULTILINE))
    except Exception:
        return False

def validate_links(root_dir):
    """Validate all internal links in markdown files"""
    print("🔍 Checking internal links...")
    
    broken_links = []
    total_links = 0
    
    # Find all markdown files
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                links = extract_links_from_file(file_path)
                
                for text, link in links:
                    total_links += 1
                    resolved_path, anchor = resolve_link_path(file_path, link)
                    
                    # Check if file exists
                    if not check_file_exists(resolved_path):
                        broken_links.append({
                            'file': file_path,
                            'link': link,
                            'type': 'file_not_found',
                            'text': text
                        })
                    # Check if anchor exists (if specified)
                    elif anchor and not check_anchor_exists(resolved_path, anchor):
                        broken_links.append({
                            'file': file_path,
                            'link': link,
                            'type': 'anchor_not_found',
                            'text': text
                        })
    
    # Report results
    print(f"📊 Checked {total_links} links")
    
    if broken_links:
        print(f"❌ Found {len(broken_links)} broken links:")
        for link in broken_links:
            error_type = "File not found" if link['type'] == 'file_not_found' else "Anchor not found"
            print(f"  • {link['file']}: {link['link']} ({error_type})")
        return False
    else:
        print("✅ All links are valid!")
        return True

if __name__ == "__main__":
    root_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    success = validate_links(root_dir)
    sys.exit(0 if success else 1)
