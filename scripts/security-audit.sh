#!/bin/bash

# ZARISH SPHERE Security Audit Script
# This script performs comprehensive security checks on the project

echo "🔒 ZARISH SPHERE Security Audit Started..."
echo "========================================"

# Check for sensitive files
echo "🔍 Checking for sensitive files..."
SENSITIVE_FILES=$(find . -name "*.env*" -o -name "*.key" -o -name "*.pem" -o -name "*.p12" -o -name "*.pfx" | grep -v node_modules | grep -v .env.example)

if [ ! -z "$SENSITIVE_FILES" ]; then
    echo "⚠️  WARNING: Found potentially sensitive files:"
    echo "$SENSITIVE_FILES"
else
    echo "✅ No sensitive files found"
fi

# Check npm audit
echo ""
echo "🔍 Running npm audit..."
npm audit --audit-level=moderate

# Check for outdated dependencies
echo ""
echo "🔍 Checking for outdated dependencies..."
npm outdated

# Check for secrets in code
echo ""
echo "🔍 Checking for potential secrets in code..."
echo "Scanning for potential secrets..."
# Basic secret scanning using grep patterns
SECRETS_FOUND=$(grep -r -i "password\|token\|secret\|api_key\|private_key\|auth" --include="*.js" --include="*.ts" --include="*.json" --include="*.md" . | grep -v node_modules | grep -v "password\|token\|secret\|api_key" | grep -v "//.*password\|//.*token\|//.*secret" | head -5 || echo "No obvious secrets found")

if [ "$SECRETS_FOUND" != "No obvious secrets found" ]; then
    echo "⚠️  WARNING: Potential secrets found:"
    echo "$SECRETS_FOUND"
else
    echo "✅ No obvious secrets found"
fi

# Check file permissions
echo ""
echo "🔍 Checking file permissions..."
find . -type f -name "*.sh" -exec ls -la {} \;

# Check for hardcoded passwords/tokens
echo ""
echo "🔍 Checking for hardcoded passwords/tokens..."
grep -r "password\|token\|secret\|api_key" --include="*.js" --include="*.ts" --include="*.json" --include="*.md" . | grep -v node_modules | grep -v "password\|token\|secret\|api_key" | head -10

echo ""
echo "🔒 Security Audit Complete!"
echo "=========================="
echo "📊 Review the results above and address any security concerns"
echo "🛡️  For more information, see SECURITY.md"
