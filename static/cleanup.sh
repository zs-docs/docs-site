#!/bin/bash

set -e

echo "🧹 ZARISH SPHERE Documentation Cleanup"
echo "======================================"

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

# Clean Docusaurus build artifacts
echo "🔧 Cleaning build artifacts..."

# Remove build directories
if [ -d "build" ]; then
    rm -rf build
    print_success "Removed build directory"
else
    print_info "No build directory to remove"
fi

if [ -d ".docusaurus" ]; then
    rm -rf .docusaurus
    print_success "Removed .docusaurus directory"
else
    print_info "No .docusaurus directory to remove"
fi

# Clean cache directories
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    print_success "Removed npm cache directory"
else
    print_info "No npm cache directory to remove"
fi

# Remove temporary files
echo ""
echo "🗑️  Removing temporary files..."

# Remove temp-tools directory if it exists
if [ -d "temp-tools" ]; then
    rm -rf temp-tools
    print_success "Removed temp-tools directory"
else
    print_info "No temp-tools directory to remove"
fi

# Remove any temporary markdown files
find . -name "*.tmp.md" -type f -delete 2>/dev/null || true
find . -name "*.temp.md" -type f -delete 2>/dev/null || true
print_success "Removed temporary markdown files"

# Clean up any leftover development files
echo ""
echo "🧼 Cleaning development files..."

# Remove Docusaurus template artifacts if they exist
if [ -d "docs/tutorial-basics" ]; then
    rm -rf docs/tutorial-basics
    print_success "Removed tutorial-basics directory"
fi

if [ -d "docs/tutorial-extras" ]; then
    rm -rf docs/tutorial-extras
    print_success "Removed tutorial-extras directory"
fi

# Remove template files if they exist
if [ -f "docs/congratulations.md" ]; then
    rm -f docs/congratulations.md
    print_success "Removed congratulations.md"
fi

if [ -f "docs/manage-docs-versions.md" ]; then
    rm -f docs/manage-docs-versions.md
    print_success "Removed manage-docs-versions.md"
fi

# Clean up log files
echo ""
echo "📋 Cleaning log files..."

# Remove log files
find . -name "*.log" -type f -delete 2>/dev/null || true
print_success "Removed log files"

# Remove coverage reports if they exist
if [ -d "coverage" ]; then
    rm -rf coverage
    print_success "Removed coverage directory"
fi

# Clean up editor backup files
echo ""
echo "📝 Cleaning editor backup files..."

# Remove editor backup files
find . -name "*.swp" -type f -delete 2>/dev/null || true
find . -name "*.swo" -type f -delete 2>/dev/null || true
find . -name "*~" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
print_success "Removed editor backup files"

# Remove OS specific files
find . -name "Thumbs.db" -type f -delete 2>/dev/null || true
find . -name "ehthumbs.db" -type f -delete 2>/dev/null || true
print_success "Removed OS specific files"

# Clean up any duplicate or unnecessary files
echo ""
echo "🔄 Cleaning duplicate files..."

# Remove duplicate ZARISH SPHERE files if they exist
find . -name "ZARISH_SPHERE_*.md" -type f -delete 2>/dev/null || true
print_success "Removed duplicate ZARISH SPHERE files"

# Remove summary files if they exist
if [ -f "EXECUTIVE_SUMMARY.md" ]; then
    rm -f EXECUTIVE_SUMMARY.md
    print_success "Removed EXECUTIVE_SUMMARY.md"
fi

if [ -f "INDEX_AND_READING_GUIDE.md" ]; then
    rm -f INDEX_AND_READING_GUIDE.md
    print_success "Removed INDEX_AND_READING_GUIDE.md"
fi

# Final cleanup
echo ""
echo "🏁 Final cleanup..."

# Remove any empty directories
find . -type d -empty -delete 2>/dev/null || true

# Clear npm cache (optional)
print_info "Running npm cache clean (optional)..."
npm cache clean --force 2>/dev/null || true

# Summary
echo ""
echo "🎉 Cleanup completed successfully!"
echo "=================================="
echo ""
print_info "What was cleaned:"
echo "  📦 Build artifacts (build/, .docusaurus/)"
echo "  🗑️  Temporary files and directories"
echo "  🧼 Development template files"
echo "  📋 Log files and coverage reports"
echo "  📝 Editor backup files"
echo "  🔄 Duplicate and unnecessary files"
echo "  💾 Cache files"
echo ""
print_info "Next steps:"
echo "  🚀 Start development: npm start"
echo "  🏗️  Build project: npm run build"
echo "  🧹 Clear cache: npm run clear"
echo ""
print_info "📖 Documentation: https://docs.zarishsphere.com"
print_info "🆘 Support: support@zarishsphere.com"
echo ""
echo "🏥 ZARISH SPHERE Documentation is now clean!"