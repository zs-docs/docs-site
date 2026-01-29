#!/bin/bash

# ZARISH SPHERE Repository Health Check
# This script checks the overall health of the repository

echo "🏥 ZARISH SPHERE Repository Health Check"
echo "======================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📂 Current branch: $CURRENT_BRANCH"

# Check if working directory is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  Working directory is not clean"
    git status --short
else
    echo "✅ Working directory is clean"
fi

# Check if up to date with remote
echo ""
echo "🔄 Checking remote status..."
git fetch --dry-run 2>/dev/null
if [ $? -eq 0 ]; then
    BEHIND=$(git rev-list --count HEAD..origin/$CURRENT_BRANCH 2>/dev/null)
    AHEAD=$(git rev-list --count origin/$CURRENT_BRANCH..HEAD 2>/dev/null)
    
    if [ "$BEHIND" -gt 0 ]; then
        echo "⚠️  Behind remote by $BEHIND commits"
    elif [ "$AHEAD" -gt 0 ]; then
        echo "⚠️  Ahead of remote by $AHEAD commits"
    else
        echo "✅ Up to date with remote"
    fi
else
    echo "⚠️  Could not check remote status"
fi

# Check branch status
echo ""
echo "🌿 Branch status:"
git branch -a

# Check for large files
echo ""
echo "📦 Checking for large files (>10MB)..."
find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*" -exec ls -lh {} \;

# Check for sensitive files
echo ""
echo "🔒 Checking for sensitive files..."
SENSITIVE_FILES=$(find . -name "*.env" -o -name "*.key" -o -name "*.pem" -o -name "*.p12" | grep -v node_modules | grep -v .git)
if [ ! -z "$SENSITIVE_FILES" ]; then
    echo "⚠️  Found sensitive files:"
    echo "$SENSITIVE_FILES"
else
    echo "✅ No sensitive files found"
fi

# Run quality check
echo ""
echo "📊 Running quality check..."
if [ -f "scripts/auto-checker.js" ]; then
    node scripts/auto-checker.js
else
    echo "⚠️  Quality checker not found"
fi

# Check dependencies
echo ""
echo "📋 Checking dependencies..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    npm audit --audit-level=moderate --silent
else
    echo "⚠️  package.json not found"
fi

echo ""
echo "🏥 Repository Health Check Complete!"
echo "=================================="
echo "📊 Review the results above for any issues"
