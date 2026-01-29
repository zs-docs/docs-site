#!/bin/bash

# ZARISH SPHERE Issue Cleanup Script
# This script closes automated issues created by broken workflows

echo "🧹 ZARISH SPHERE Issue Cleanup Started"
echo "===================================="

# Close automated issues about broken links
echo "🔍 Looking for broken link issues..."

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "📋 Using GitHub CLI to manage issues..."
    
    # List all open issues
    echo "📊 Current open issues:"
    gh issue list --repo zs-docs/docs-site --state open --limit 20
    
    # Close issues with "Broken links detected" in title
    echo ""
    echo "🔧 Closing broken link issues..."
    gh issue list --repo zs-docs/docs-site --state open --search "Broken links detected" --limit 10 \
        --json number,title \
        --jq '.[] | "#\(.number): \(.title)"' | \
    while read issue; do
        if [[ ! -z "$issue" ]]; then
            issue_number=$(echo "$issue" | cut -d: -f1)
            echo "Closing issue: $issue"
            gh issue close "$issue_number" --repo zs-docs/docs-site \
                --comment "This issue has been automatically closed because the underlying workflow has been fixed. The link checking system has been improved and will no longer create false-positive issues." \
                --reason "completed"
        fi
    done
    
    echo ""
    echo "✅ Issue cleanup completed!"
else
    echo "❌ GitHub CLI not found. Please install it to manage issues automatically:"
    echo "   sudo apt install gh  # For Ubuntu/Debian"
    echo "   brew install gh       # For macOS"
    echo ""
    echo "📋 Manual cleanup required:"
    echo "1. Go to: https://github.com/zs-docs/docs-site/issues"
    echo "2. Close issues with 'Broken links detected' in title"
    echo "3. Add comment: 'Fixed by workflow improvements'"
fi

echo ""
echo "🧹 Issue Cleanup Complete!"
echo "========================"
