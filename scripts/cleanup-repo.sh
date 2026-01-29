#!/bin/bash

# ZARISH SPHERE Repository Cleanup Script
# This script cleans up branches, issues, and security problems

echo "🧹 ZARISH SPHERE Repository Cleanup Started"
echo "=========================================="

# Clean up local branches
echo "🌿 Cleaning up local branches..."
git checkout main
git pull origin main

# Remove merged branches
git branch --merged | grep -v "\*" | grep -v "main" | grep -v "gh-pages" | grep -v "production-deploy" | xargs -n 1 git branch -d 2>/dev/null

# Clean up remote branches
echo "🌐 Cleaning up remote branches..."
git remote prune origin

# Remove Dependabot branches that are no longer needed
for branch in $(git branch -r | grep "origin/dependabot" | cut -d'/' -f2-); do
    echo "Removing remote branch: $branch"
    git push origin --delete "$branch" 2>/dev/null || echo "Could not delete $branch"
done

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=moderate

# Fix any security issues if possible
echo "🔧 Attempting to fix security issues..."
npm audit fix 2>/dev/null || echo "Some security issues require manual intervention"

# Run quality check
echo "📊 Running quality check..."
npm run quality:check

# Check for large files
echo "📦 Checking for large files..."
find . -type f -size +5M -not -path "./node_modules/*" -not -path "./.git/*" -exec ls -lh {} \; 2>/dev/null || echo "No large files found"

# Check for sensitive files
echo "🔍 Checking for sensitive files..."
SENSITIVE_FILES=$(find . -name "*.env" -o -name "*.key" -o -name "*.pem" -o -name "*.p12" | grep -v node_modules | grep -v .git)
if [ ! -z "$SENSITIVE_FILES" ]; then
    echo "⚠️  Found sensitive files:"
    echo "$SENSITIVE_FILES"
else
    echo "✅ No sensitive files found"
fi

# Update dependencies
echo "📦 Updating dependencies..."
npm update 2>/dev/null || echo "Dependencies are up to date"

# Clean up node_modules and reinstall
echo "🧹 Cleaning up node_modules..."
rm -rf node_modules package-lock.json
npm install

echo ""
echo "🧹 Repository Cleanup Complete!"
echo "=============================="
echo "📊 Summary:"
echo "- Branches cleaned up"
echo "- Security audit completed"
echo "- Quality check completed"
echo "- Dependencies updated"
echo "- Large files checked"
echo "- Sensitive files checked"
