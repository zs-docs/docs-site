#!/usr/bin/env python3
"""
ZARISH HIS API Standards Validator
Validates API specifications against naming standards and conventions
"""

import os
import re
import yaml
import json
from typing import Dict, List, Any, Tuple

class APIStandardsValidator:
    """Validates API specifications against ZARISH HIS standards"""
    
    def __init__(self, docs_root: str):
        self.docs_root = docs_root
        self.issues = []
        self.warnings = []
        
        # Load standards from documentation
        self.api_standards = self._load_api_standards()
        self.fhir_standards = self._load_fhir_standards()
    
    def _load_api_standards(self) -> Dict[str, Any]:
        """Load API naming standards from documentation"""
        standards = {
            "base_url_pattern": r"https://api\.zs-his\.com/v[0-9]+/",
            "gateway_url_pattern": r"https://api\.zs-his\.com/v[0-9]+/",
            "service_url_pattern": r"https://api\.zs-his\.com/v[0-9]+/[a-z-]+/",
            "resource_naming": {
                "plural_nouns": True,
                "kebab_case": True
            }
        }
        
        return standards
    
    def _load_fhir_standards(self) -> Dict[str, Any]:
        """Load FHIR R5 naming standards from documentation"""
        standards = {
            "resource_pattern": r"zarish-[a-z]+-[a-z]+-[0-9]+",
            "terminology_url": "https://terminology.zs-his.com",
            "structure_definition_url": "https://fhir.zs-his.com",
            "value_set_url": "https://fhir.zs-his.com"
        }
        
        return standards
    
    def validate_api_specifications(self) -> List[Dict[str, Any]]:
        """Validate all API specification files"""
        api_specs_dir = os.path.join(self.docs_root, "04-api-specifications")
        results = []
        
        if not os.path.exists(api_specs_dir):
            return [{"error": "API specifications directory not found"}]
        
        for file in os.listdir(api_specs_dir):
            if file.endswith(('.yaml', '.yml')):
                file_path = os.path.join(api_specs_dir, file)
                result = self._validate_api_spec_file(file_path)
                result["file"] = file
                results.append(result)
        
        return results
    
    def _validate_api_spec_file(self, file_path: str) -> Dict[str, Any]:
        """Validate a single API specification file"""
        try:
            with open(file_path, 'r') as f:
                spec = yaml.safe_load(f)
            
            result = {
                "valid": True,
                "issues": [],
                "warnings": []
            }
            
            # Validate servers
            if "servers" in spec:
                for server in spec["servers"]:
                    url = server.get("url", "")
                    self._validate_server_url(url, result)
            
            # Validate paths
            if "paths" in spec:
                for path in spec["paths"].keys():
                    self._validate_path(path, result)
            
            # Validate info section
            if "info" in spec:
                self._validate_info_section(spec["info"], result)
            
            return result
            
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "issues": [f"Failed to parse YAML: {str(e)}"]
            }
    
    def _validate_server_url(self, url: str, result: Dict[str, Any]):
        """Validate server URL against standards"""
        # Check HTTPS
        if not url.startswith("https://"):
            result["issues"].append(f"Server URL must use HTTPS: {url}")
        
        # Check base URL pattern
        if not re.match(self.api_standards["base_url_pattern"], url):
            result["issues"].append(f"Server URL doesn't match pattern: {url}")
        
        # Check for staging URLs
        if "staging" in url:
            if not url.startswith("https://staging-api.zarishsphere.com"):
                result["warnings"].append(f"Staging URL should use staging-api.zarishsphere.com: {url}")
    
    def _validate_path(self, path: str, result: Dict[str, Any]):
        """Validate API path against naming conventions"""
        # Check for plural nouns (basic check)
        segments = path.strip('/').split('/')
        
        for segment in segments:
            if segment and not segment.startswith('{'):
                # Check kebab-case
                if not re.match(r'^[a-z]+(-[a-z]+)*$', segment):
                    result["issues"].append(f"Path segment should be kebab-case: {segment}")
                
                # Check for plural (basic heuristic)
                if not segment.endswith('s') and segment not in ['health', 'auth', 'login']:
                    result["warnings"].append(f"Path segment might need to be plural: {segment}")
    
    def _validate_info_section(self, info: Dict[str, Any], result: Dict[str, Any]):
        """Validate API info section"""
        # Check contact email
        if "contact" in info and "email" in info["contact"]:
            email = info["contact"]["email"]
            if not email.endswith("@zs-his.com"):
                result["warnings"].append(f"Contact email should use @zs-his.com domain: {email}")
        
        # Check license
        if "license" in info:
            if "url" in info["license"]:
                license_url = info["license"]["url"]
                if not license_url.startswith("https://"):
                    result["issues"].append(f"License URL must use HTTPS: {license_url}")
    
    def validate_fhir_standards(self) -> List[Dict[str, Any]]:
        """Validate FHIR R5 standards in documentation"""
        results = []
        
        # Check FHIR naming documentation
        fhir_file = os.path.join(self.docs_root, "01-standards/fhir-r5-naming.md")
        if os.path.exists(fhir_file):
            with open(fhir_file, 'r') as f:
                content = f.read()
            
            result = {
                "file": "fhir-r5-naming.md",
                "valid": True,
                "issues": [],
                "warnings": []
            }
            
            # Check for HTTPS URLs
            if "http://fhir.zs-his.com" in content:
                result["issues"].append("FHIR URLs must use HTTPS")
            
            if "http://terminology.zs-his.com" in content:
                result["issues"].append("Terminology URLs must use HTTPS")
            
            # Check resource naming pattern
            resource_pattern = r"zarish-[a-z]+-[a-z]+-[0-9]+"
            if not re.search(resource_pattern, content):
                result["warnings"].append("Resource naming pattern may not be consistent")
            
            results.append(result)
        
        return results
    
    def validate_consistency(self) -> Dict[str, Any]:
        """Validate consistency across all documentation"""
        consistency_issues = []
        
        # Check URL consistency across files
        api_urls = self._extract_all_urls()
        url_patterns = set()
        
        for url in api_urls:
            # Extract base pattern
            if "api.zarishsphere.com" in url:
                pattern = re.sub(r'/[a-z-]+.*', '', url)
                url_patterns.add(pattern)
        
        if len(url_patterns) > 1:
            consistency_issues.append(f"Inconsistent API URL patterns found: {url_patterns}")
        
        return {
            "consistent": len(consistency_issues) == 0,
            "issues": consistency_issues
        }
    
    def _extract_all_urls(self) -> List[str]:
        """Extract all URLs from documentation"""
        urls = []
        
        for root, dirs, files in os.walk(self.docs_root):
            for file in files:
                if file.endswith(('.md', '.yaml', '.yml')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r') as f:
                            content = f.read()
                        
                        # Find URLs
                        url_pattern = r'https?://[^\s\'"<>]+'
                        matches = re.findall(url_pattern, content)
                        urls.extend(matches)
                    except:
                        continue
        
        return urls
    
    def generate_validation_report(self) -> str:
        """Generate comprehensive validation report"""
        report = []
        report.append("# ZARISH HIS API Standards Validation Report")
        report.append(f"Generated: {self._get_timestamp()}")
        report.append("")
        
        # API Specifications Validation
        report.append("## 📋 API Specifications Validation")
        api_results = self.validate_api_specifications()
        
        for result in api_results:
            if "error" in result:
                report.append(f"### ❌ {result.get('file', 'Unknown')}")
                report.append(f"- Error: {result['error']}")
            else:
                status = "✅" if result["valid"] else "❌"
                report.append(f"### {status} {result.get('file', 'Unknown')}")
                
                if result["issues"]:
                    report.append("**Issues:**")
                    for issue in result["issues"]:
                        report.append(f"- ❌ {issue}")
                
                if result["warnings"]:
                    report.append("**Warnings:**")
                    for warning in result["warnings"]:
                        report.append(f"- ⚠️ {warning}")
            report.append("")
        
        # FHIR Standards Validation
        report.append("## 🏥 FHIR R5 Standards Validation")
        fhir_results = self.validate_fhir_standards()
        
        for result in fhir_results:
            status = "✅" if result["valid"] else "❌"
            report.append(f"### {status} {result.get('file', 'Unknown')}")
            
            if result["issues"]:
                report.append("**Issues:**")
                for issue in result["issues"]:
                    report.append(f"- ❌ {issue}")
            
            if result["warnings"]:
                report.append("**Warnings:**")
                for warning in result["warnings"]:
                    report.append(f"- ⚠️ {warning}")
            report.append("")
        
        # Consistency Check
        report.append("## 🔄 Consistency Check")
        consistency = self.validate_consistency()
        
        if consistency["consistent"]:
            report.append("✅ All documentation is consistent")
        else:
            report.append("❌ Consistency issues found:")
            for issue in consistency["issues"]:
                report.append(f"- {issue}")
        
        report.append("")
        report.append("## 📊 Summary")
        
        total_issues = sum(len(r.get("issues", [])) for r in api_results + fhir_results)
        total_warnings = sum(len(r.get("warnings", [])) for r in api_results + fhir_results)
        
        if not consistency["consistent"]:
            total_issues += len(consistency["issues"])
        
        if total_issues == 0 and total_warnings == 0:
            report.append("🎉 All standards are compliant!")
        else:
            report.append(f"- **Total Issues**: {total_issues}")
            report.append(f"- **Total Warnings**: {total_warnings}")
        
        return "\n".join(report)
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()

def main():
    """Main execution function"""
    docs_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    validator = APIStandardsValidator(docs_root)
    
    # Generate and save report
    report = validator.generate_validation_report()
    report_path = os.path.join(docs_root, "API-STANDARDS-VALIDATION.md")
    
    with open(report_path, 'w') as f:
        f.write(report)
    
    print(f"✅ API standards validation report saved to: {report_path}")
    
    # Also save JSON for programmatic access
    api_results = validator.validate_api_specifications()
    fhir_results = validator.validate_fhir_standards()
    consistency = validator.validate_consistency()
    
    json_data = {
        "api_specifications": api_results,
        "fhir_standards": fhir_results,
        "consistency": consistency,
        "generated_at": validator._get_timestamp()
    }
    
    json_path = os.path.join(docs_root, "api-standards-validation.json")
    with open(json_path, 'w') as f:
        json.dump(json_data, f, indent=2)
    
    print(f"✅ Validation data saved to: {json_path}")

if __name__ == "__main__":
    main()
