#!/bin/bash

# 🏥 ZARISH SPHERE - Git Push Script
# Adds, commits, and pushes all changes to the main branch

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "🚀 ZARISH SPHERE Git Push Script"
echo "=================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository. Please run this script from the root of the repository."
    exit 1
fi

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    print_warning "No changes to commit. Repository is up to date."
    exit 0
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "You're on branch '$CURRENT_BRANCH'. Switching to main branch..."
    git checkout main
    print_success "Switched to main branch"
fi

# Pull latest changes from remote
echo ""
echo "📥 Pulling latest changes from remote..."
git pull origin main

if [ $? -eq 0 ]; then
    print_success "Latest changes pulled successfully"
else
    print_error "Failed to pull latest changes"
    exit 1
fi

# 1. Add all files
echo ""
echo "📦 Adding files to staging area..."
git add .

# Show what files were added
ADDED_FILES=$(git diff --cached --name-only)
if [ -n "$ADDED_FILES" ]; then
    print_success "Files added to staging area:"
    echo "$ADDED_FILES" | sed 's/^/   - /'
else
    print_warning "No files to add"
fi

# 2. Check for staged changes
STAGED_FILES=$(git diff --cached --name-only)
if [ -z "$STAGED_FILES" ]; then
    print_warning "No staged changes to commit."
    exit 0
fi

# 3. Commit with a meaningful message
echo ""
echo "📝 Committing changes..."

# Generate commit message based on changes
COMMIT_MSG=""

# Check for different types of changes
if echo "$STAGED_FILES" | grep -q "package.json\|package-lock.json"; then
    COMMIT_MSG="chore: update dependencies"
elif echo "$STAGED_FILES" | grep -q "docusaurus.config.ts"; then
    COMMIT_MSG="feat: update docusaurus configuration"
elif echo "$STAGED_FILES" | grep -q "src/css/"; then
    COMMIT_MSG="style: update custom CSS styling"
elif echo "$STAGED_FILES" | grep -q "docs/"; then
    COMMIT_MSG="docs: update documentation content"
elif echo "$STAGED_FILES" | grep -q ".github/workflows/"; then
    COMMIT_MSG="ci: update GitHub workflows"
else
    COMMIT_MSG="chore: update project files"
fi

# Add timestamp to commit message
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="$COMMIT_MSG ($TIMESTAMP)"

# Commit changes
git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    print_success "Changes committed successfully"
    print_info "Commit message: $COMMIT_MSG"
else
    print_error "Failed to commit changes"
    exit 1
fi

# 4. Push to remote
echo ""
echo "⬆️  Pushing to remote repository..."
git push origin main

if [ $? -eq 0 ]; then
    print_success "Successfully pushed to GitHub!"
else
    print_error "Failed to push to GitHub"
    exit 1
fi

# Show commit details
echo ""
echo "📊 Push Summary:"
echo "=============="
print_info "Repository: $(git config --get remote.origin.url)"
print_info "Branch: main"
print_info "Commit: $(git rev-parse --short HEAD)"
print_info "Files pushed: $(echo "$STAGED_FILES" | wc -l)"

# Show recent commits
echo ""
echo "📋 Recent commits:"
git log --oneline -5

# Success message
echo ""
echo "🎉 Push completed successfully!"
echo "============================="
echo ""
print_info "Your changes are now available at:"
print_info "📖 Documentation: https://docs.zarishsphere.com"
print_info "🌐 Repository: https://github.com/zs-docs/docs-site"
print_info "🚀 GitHub Pages will be updated automatically"
echo ""
print_info "🆘 Support: support@zarishsphere.com"
echo ""
echo "🏥 ZARISH SPHERE Documentation updated!"