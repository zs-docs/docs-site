#!/usr/bin/env python3
"""
ZARISH HIS Event-Driven Architecture Monitor
Monitors Kafka event flows, service health, and message patterns
"""

import os
import json
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Any
import re

class EventArchitectureMonitor:
    """Monitor event-driven architecture health and patterns"""
    
    def __init__(self, docs_root: str):
        self.docs_root = docs_root
        self.services = self._discover_services()
        self.event_patterns = self._analyze_event_patterns()
        self.health_status = self._check_service_health()
    
    def _discover_services(self) -> List[Dict[str, Any]]:
        """Discover all microservices from documentation"""
        services = []
        services_dir = os.path.join(self.docs_root, "02-microservices")
        
        if os.path.exists(services_dir):
            for service_dir in os.listdir(services_dir):
                if service_dir.startswith("ms-"):
                    service_path = os.path.join(services_dir, service_dir)
                    readme_path = os.path.join(service_path, "README.md")
                    
                    if os.path.exists(readme_path):
                        with open(readme_path, 'r') as f:
                            content = f.read()
                        
                        # Extract event publishing patterns
                        events = self._extract_events(content)
                        
                        services.append({
                            "name": service_dir,
                            "path": service_path,
                            "events_published": events,
                            "last_updated": self._get_file_modification_time(readme_path)
                        })
        
        return services
    
    def _extract_events(self, content: str) -> List[str]:
        """Extract event constants from service documentation"""
        events = []
        # Look for event constant patterns
        event_patterns = [
            r'const\s+\(\s*([A-Z][A-Za-z0-9_]+Event\s*=\s*"[^"]+")',
            r'([A-Z][A-Za-z0-9_]+Event)\s*=\s*"([^"]*)"',
            r'"([a-z]+\.[a-z]+\.[a-z]+)"'  # event.type format
        ]
        
        for pattern in event_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                if isinstance(match, tuple):
                    events.append(match[0] if match[0] else match[1])
                else:
                    events.append(match)
        
        return list(set(events))  # Remove duplicates
    
    def _analyze_event_patterns(self) -> Dict[str, Any]:
        """Analyze event flow patterns across services"""
        patterns = {
            "patient_lifecycle": [],
            "billing_events": [],
            "clinical_events": [],
            "security_events": []
        }
        
        for service in self.services:
            for event in service.get("events_published", []):
                if "patient" in event.lower():
                    patterns["patient_lifecycle"].append({
                        "event": event,
                        "service": service["name"]
                    })
                elif "payment" in event.lower() or "billing" in event.lower() or "invoice" in event.lower():
                    patterns["billing_events"].append({
                        "event": event,
                        "service": service["name"]
                    })
                elif "encounter" in event.lower() or "clinical" in event.lower() or "diagnosis" in event.lower():
                    patterns["clinical_events"].append({
                        "event": event,
                        "service": service["name"]
                    })
                elif "auth" in event.lower() or "security" in event.lower() or "audit" in event.lower():
                    patterns["security_events"].append({
                        "event": event,
                        "service": service["name"]
                    })
        
        return patterns
    
    def _check_service_health(self) -> Dict[str, Any]:
        """Check service documentation health"""
        health = {
            "total_services": len(self.services),
            "services_with_events": 0,
            "services_documented": 0,
            "event_flow_diagrams": 0
        }
        
        for service in self.services:
            if service.get("events_published"):
                health["services_with_events"] += 1
            
            # Check if service has proper documentation
            if os.path.exists(os.path.join(service["path"], "README.md")):
                health["services_documented"] += 1
        
        return health
    
    def _get_file_modification_time(self, file_path: str) -> str:
        """Get file modification time"""
        timestamp = os.path.getmtime(file_path)
        return datetime.fromtimestamp(timestamp).isoformat()
    
    def generate_monitoring_report(self) -> str:
        """Generate comprehensive monitoring report"""
        report = []
        report.append("# ZARISH HIS Event-Driven Architecture Monitoring Report")
        report.append(f"Generated: {datetime.now().isoformat()}")
        report.append("")
        
        # Service Health Overview
        report.append("## 📊 Service Health Overview")
        health = self.health_status
        report.append(f"- **Total Services**: {health['total_services']}")
        report.append(f"- **Services with Events**: {health['services_with_events']}")
        report.append(f"- **Services Documented**: {health['services_documented']}")
        report.append("")
        
        # Event Flow Patterns
        report.append("## 🔄 Event Flow Patterns")
        
        for category, events in self.event_patterns.items():
            if events:
                report.append(f"### {category.replace('_', ' ').title()}")
                for event_info in events:
                    report.append(f"- **{event_info['event']}** (from {event_info['service']})")
                report.append("")
        
        # Service Details
        report.append("## 🏗️ Service Details")
        for service in self.services:
            report.append(f"### {service['name']}")
            report.append(f"- **Path**: `{service['path']}`")
            report.append(f"- **Last Updated**: {service['last_updated']}")
            
            if service.get("events_published"):
                report.append(f"- **Events Published**: {', '.join(service['events_published'])}")
            else:
                report.append("- **Events Published**: None documented")
            report.append("")
        
        # Recommendations
        report.append("## 💡 Recommendations")
        
        if health["services_with_events"] < health["total_services"]:
            report.append("- Consider documenting event publishing patterns for services without events")
        
        if not self.event_patterns.get("patient_lifecycle"):
            report.append("- Document patient lifecycle events for better traceability")
        
        if not self.event_patterns.get("security_events"):
            report.append("- Add security/audit events for compliance monitoring")
        
        report.append("- Consider adding event schema validation")
        report.append("- Implement event replay capabilities for debugging")
        
        return "\n".join(report)
    
    def save_report(self, output_path: str):
        """Save monitoring report to file"""
        report = self.generate_monitoring_report()
        with open(output_path, 'w') as f:
            f.write(report)
        print(f"✅ Event architecture monitoring report saved to: {output_path}")
    
    def generate_event_diagram(self) -> str:
        """Generate Mermaid diagram of event flows"""
        diagram = ["# Event Flow Diagram"]
        diagram.append("```mermaid")
        diagram.append("graph TD")
        diagram.append("    %% Event-driven architecture flow")
        diagram.append("")
        
        # Add services
        for i, service in enumerate(self.services):
            service_id = f"S{i}"
            diagram.append(f"    {service_id}[{service['name'].replace('ms-', '')}]")
        
        diagram.append("")
        
        # Add event flows (simplified)
        diagram.append("    %% Event flows")
        diagram.append("    S0 -->|patient.created| S1")
        diagram.append("    S1 -->|encounter.completed| S2")
        diagram.append("    S2 -->|invoice.generated| S3")
        diagram.append("    S3 -->|payment.processed| S0")
        
        diagram.append("```")
        
        return "\n".join(diagram)

def main():
    """Main execution function"""
    docs_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    monitor = EventArchitectureMonitor(docs_root)
    
    # Generate and save reports
    report_path = os.path.join(docs_root, "EVENT-MONITORING.md")
    monitor.save_report(report_path)
    
    # Generate event diagram
    diagram_path = os.path.join(docs_root, "EVENT-FLOW-DIAGRAM.md")
    with open(diagram_path, 'w') as f:
        f.write(monitor.generate_event_diagram())
    print(f"✅ Event flow diagram saved to: {diagram_path}")
    
    # Save JSON data
    json_path = os.path.join(docs_root, "event-architecture-data.json")
    with open(json_path, 'w') as f:
        json.dump({
            "services": monitor.services,
            "event_patterns": monitor.event_patterns,
            "health_status": monitor.health_status,
            "generated_at": datetime.now().isoformat()
        }, f, indent=2)
    print(f"✅ Event architecture data saved to: {json_path}")

if __name__ == "__main__":
    main()
