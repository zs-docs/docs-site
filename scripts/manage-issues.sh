#!/bin/bash

# ZARISH SPHERE Issue Management Script
# This script helps manage GitHub Issues and Pull Requests

echo "🎯 ZARISH SPHERE Issue Management"
echo "================================="

# Function to show current status
show_status() {
    echo "📊 Current Repository Status:"
    echo "============================="
    
    # Show branches
    echo "🌿 Branches:"
    git branch -a | wc -l | xargs echo "Total branches:"
    git branch -a
    
    # Show quality score
    echo ""
    echo "📊 Quality Score:"
    if [ -f "quality-report.json" ]; then
        node -e "console.log('Overall Quality Score: ' + JSON.parse(require('fs').readFileSync('quality-report.json', 'utf8')).overallQualityScore + '%')"
    fi
    
    # Show security status
    echo ""
    echo "🔒 Security Status:"
    npm audit --audit-level=moderate --silent || echo "No vulnerabilities found"
}

# Function to create issue templates
create_issue_templates() {
    echo "📋 Creating Issue Templates..."
    
    mkdir -p .github/ISSUE_TEMPLATE
    
    # Bug report template
    cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
EOF

    # Feature request template
    cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
EOF

    # Security issue template
    cat > .github/ISSUE_TEMPLATE/security_issue.md << 'EOF'
---
name: Security Issue
about: Report a security vulnerability
title: '[SECURITY] '
labels: security
assignees: ''
---

**🚨 SECURITY ISSUE - DO NOT POST PUBLIC DETAILS**

For security vulnerabilities, please email us directly at: security@zarishsphere.com

**What type of security issue is this?**
- [ ] Authentication/Authorization
- [ ] Data Exposure
- [ ] Denial of Service
- [ ] Code Injection
- [ ] Cross-Site Scripting (XSS)
- [ ] Cross-Site Request Forgery (CSRF)
- [ ] Other (please specify)

**Severity**
- [ ] Critical - Immediate risk
- [ ] High - Significant impact
- [ ] Medium - Moderate impact  
- [ ] Low - Minimal impact

**Please describe the security issue**
[Provide a detailed description of the security vulnerability]

**Contact Information**
Please provide your contact information so we can follow up with you.

**Thank you for helping keep ZARISH SPHERE secure!** 🛡️
EOF

    echo "✅ Issue templates created"
}

# Function to create PR template
create_pr_template() {
    echo "📋 Creating Pull Request Template..."
    
    cat > .github/pull_request_template.md << 'EOF'
## 🎯 Pull Request Description

### 📝 Summary
Brief description of what this PR accomplishes.

### 🔧 Changes Made
- [ ] Bug fixes
- [ ] New features
- [ ] Documentation updates
- [ ] Security improvements
- [ ] Performance optimizations

### 🧪 Testing
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Quality check passes (100% score)
- [ ] Security audit passes (0 vulnerabilities)
- [ ] Manual testing completed

### 📊 Quality Checks
- **Quality Score**: [ ] 100%
- **Security**: [ ] No vulnerabilities
- **Links**: [ ] All working
- **Images**: [ ] All optimized

### 📋 Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes
- [ ] Security considerations addressed

### 🔗 Related Issues
Closes #(issue number)

### 📸 Screenshots (if applicable)
Add screenshots to help explain your changes.

### 💬 Additional Notes
Any additional information about this PR.
EOF

    echo "✅ PR template created"
}

# Function to show current issues and PRs
show_issues_prs() {
    echo "📋 Current Issues and Pull Requests:"
    echo "===================================="
    
    echo "🔍 To view issues on GitHub:"
    echo "https://github.com/zs-docs/docs-site/issues"
    
    echo ""
    echo "🔍 To view pull requests on GitHub:"
    echo "https://github.com/zs-docs/docs-site/pulls"
    
    echo ""
    echo "📊 Quick Commands:"
    echo "gh issue list" # List issues
    echo "gh pr list"   # List pull requests
}

# Main execution
case "${1:-status}" in
    "status")
        show_status
        ;;
    "templates")
        create_issue_templates
        create_pr_template
        ;;
    "issues")
        show_issues_prs
        ;;
    "all")
        show_status
        create_issue_templates
        create_pr_template
        show_issues_prs
        ;;
    *)
        echo "Usage: $0 {status|templates|issues|all}"
        echo "  status    - Show current repository status"
        echo "  templates - Create issue and PR templates"
        echo "  issues    - Show issues and PRs information"
        echo "  all       - Run all operations"
        ;;
esac

echo ""
echo "🎯 Issue Management Complete!"
echo "============================="
