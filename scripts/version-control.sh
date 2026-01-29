#!/bin/bash

# 🏷️ Version Control & Release Management
# This script manages versioning, releases, and deployment coordination

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emoji icons
VERSION="🏷️"
ROCKET="🚀"
BUILD="🏗️"
DEPLOY="📤"
SUCCESS="✅"
WARNING="⚠️"
ERROR="❌"
INFO="ℹ️"

# Configuration
PACKAGE_JSON="package.json"
BUILD_DIR="build"
RELEASE_NOTES="RELEASE_NOTES.md"
CHANGELOG="CHANGELOG.md"

# Logging function
log() {
    echo -e "${GREEN}${INFO} [$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}${WARNING} [$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}${ERROR} [$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}${SUCCESS} [$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Get current version from package.json
get_current_version() {
    if [[ -f "$PACKAGE_JSON" ]]; then
        node -p "require('./package.json').version"
    else
        error "package.json not found"
        exit 1
    fi
}

# Calculate next version
calculate_next_version() {
    local current_version=$1
    local bump_type=${2:-"patch"}
    
    # Split version into parts
    IFS='.' read -ra VERSION_PARTS <<< "$current_version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}
    
    case "$bump_type" in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        "prerelease")
            patch=$((patch + 1))
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Update version in package.json
update_version() {
    local new_version=$1
    
    log "${VERSION} Updating version to $new_version"
    
    # Update package.json
    npm version "$new_version" --no-git-tag-version
    
    success "${VERSION} Version updated to $new_version"
}

# Create release notes
create_release_notes() {
    local version=$1
    local previous_version=$2
    
    log "📝 Creating release notes for v$version"
    
    # Get git log between versions
    local git_log=""
    if [[ "$previous_version" != "" ]]; then
        git_log=$(git log --pretty=format:"- %s (%h)" "v$previous_version..HEAD" 2>/dev/null || git log --pretty=format:"- %s (%h)" -10)
    else
        git_log=$(git log --pretty=format:"- %s (%h)" -10)
    fi
    
    # Create release notes
    cat > "$RELEASE_NOTES" << EOF
# Release Notes v$version

## 📅 Release Date
$(date '+%Y-%m-%d')

## 🚀 What's New

### 🔄 Changes
$git_log

### 📊 Statistics
- **Version**: v$version
- **Build**: $(git rev-parse --short HEAD)
- **Branch**: $(git branch --show-current)
- **Files**: $(find . -name "*.md" -o -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | wc -l)
- **Lines of Code**: $(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')

### 🔧 Technical Details
- **Node.js**: $(node --version)
- **npm**: $(npm --version)
- **Docusaurus**: $(npm list @docusaurus/core --depth=0 2>/dev/null | grep @docusaurus/core | awk '{print $2}' || echo "N/A")

### 🌐 Deployment
- **Environment**: Production
- **URL**: https://zs-docs.github.io/docs-site
- **Build Status**: ✅ Success

---
*This release was created automatically by the Version Control & Release Management system*
EOF

    success "📝 Release notes created: $RELEASE_NOTES"
}

# Update changelog
update_changelog() {
    local version=$1
    local release_notes_content=$(cat "$RELEASE_NOTES")
    
    log "📋 Updating changelog"
    
    # Create changelog if it doesn't exist
    if [[ ! -f "$CHANGELOG" ]]; then
        cat > "$CHANGELOG" << EOF
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

EOF
    fi
    
    # Add new release to changelog
    local temp_changelog=$(mktemp)
    {
        echo "# Changelog"
        echo ""
        echo "All notable changes to this project will be documented in this file."
        echo ""
        echo "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),"
        echo "and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)."
        echo ""
        echo "## [${version}] - $(date '+%Y-%m-%d')"
        echo ""
        echo "$release_notes_content" | sed '/^#/d' | sed '/^$/d'
        echo ""
        tail -n +6 "$CHANGELOG"
    } > "$temp_changelog"
    
    mv "$temp_changelog" "$CHANGELOG"
    
    success "📋 Changelog updated: $CHANGELOG"
}

# Create git tag and commit
create_release_commit() {
    local version=$1
    
    log "${ROCKET} Creating release commit and tag"
    
    # Configure git user
    git config --local user.email "release@zarishsphere.com"
    git config --local user.name "Release Manager"
    
    # Add version files
    git add package.json "$RELEASE_NOTES" "$CHANGELOG"
    
    # Create commit
    git commit -m "🚀 Release v$version

🏷️ **Version Update**
- Version bumped to v$version
- Release notes generated
- Changelog updated

📊 **Release Information**
- Build: $(git rev-parse --short HEAD)
- Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
- Branch: $(git branch --show-current)

🤖 *This release was created automatically by the Version Control & Release Management system*"
    
    # Create tag
    git tag -a "v$version" -m "Release v$version

🚀 **Automated Release**

- Version: v$version
- Build: $(git rev-parse --short HEAD)
- Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")

🤖 *This tag was created automatically by the Version Control & Release Management system*"
    
    success "${ROCKET} Release commit and tag created"
}

# Push release
push_release() {
    local version=$1
    
    log "${DEPLOY} Pushing release v$version"
    
    # Push commit and tag
    git push origin main
    git push origin "v$version"
    
    success "${DEPLOY} Release v$version pushed successfully"
}

# Build and test
build_and_test() {
    log "${BUILD} Building and testing"
    
    # Clean previous build
    if [[ -d "$BUILD_DIR" ]]; then
        rm -rf "$BUILD_DIR"
    fi
    
    # Install dependencies
    npm ci
    
    # Run quality checks
    npm run quality:check
    
    # Run type check
    npm run typecheck
    
    # Build documentation
    npm run build
    
    # Verify build
    if [[ ! -d "$BUILD_DIR" ]]; then
        error "Build failed - no build directory found"
        exit 1
    fi
    
    success "${BUILD} Build and test completed successfully"
}

# Create GitHub release
create_github_release() {
    local version=$1
    
    log "🌐 Creating GitHub release"
    
    # Create GitHub release using gh CLI
    if command -v gh &> /dev/null; then
        gh release create "v$version" \
            --title "Release v$version" \
            --notes-file "$RELEASE_NOTES" \
            --target main \
            --latest
    else
        warn "gh CLI not found - skipping GitHub release creation"
    fi
    
    success "🌐 GitHub release created"
}

# Main release function
create_release() {
    local bump_type=${1:-"patch"}
    local skip_build=${2:-false}
    local skip_push=${3:-false}
    
    log "🚀 Starting release process"
    
    # Get current version
    local current_version=$(get_current_version)
    log "Current version: v$current_version"
    
    # Calculate next version
    local next_version=$(calculate_next_version "$current_version" "$bump_type")
    log "Next version: v$next_version"
    
    # Update version
    update_version "$next_version"
    
    # Create release notes
    create_release_notes "$next_version" "$current_version"
    
    # Update changelog
    update_changelog "$next_version"
    
    # Build and test
    if [[ "$skip_build" != "true" ]]; then
        build_and_test
    fi
    
    # Create release commit and tag
    create_release_commit "$next_version"
    
    # Push release
    if [[ "$skip_push" != "true" ]]; then
        push_release "$next_version"
        
        # Create GitHub release
        create_github_release "$next_version"
    fi
    
    success "🎉 Release v$next_version completed successfully!"
    
    # Display summary
    echo ""
    echo "## 🎉 Release Summary"
    echo ""
    echo "### 📋 Release Details"
    echo "- **Version**: v$next_version"
    echo "- **Previous**: v$current_version"
    echo "- **Type**: $bump_type"
    echo "- **Build**: $(git rev-parse --short HEAD)"
    echo "- **Date**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo ""
    echo "### 📁 Files Created"
    echo "- **Release Notes**: $RELEASE_NOTES"
    echo "- **Changelog**: $CHANGELOG"
    echo "- **Build Directory**: $BUILD_DIR"
    echo ""
    echo "### 🌐 URLs"
    echo "- **GitHub Release**: https://github.com/zs-docs/docs-site/releases/tag/v$next_version"
    echo "- **Documentation**: https://zs-docs.github.io/docs-site"
    echo ""
    echo "✅ **Status**: Complete"
}

# Display help
show_help() {
    echo "🏷️ Version Control & Release Management"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  release [patch|minor|major] [skip-build] [skip-push]  Create a new release"
    echo "  version                                          Show current version"
    echo "  build                                            Build and test"
    echo "  notes                                            Generate release notes"
    echo "  help                                             Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 release patch                                 Create patch release"
    echo "  $0 release minor skip-build                       Create minor release without building"
    echo "  $0 release major skip-build skip-push            Create major release without building or pushing"
    echo "  $0 version                                       Show current version"
    echo ""
    echo "Environment Variables:"
    echo "  SKIP_BUILD=true                                  Skip build process"
    echo "  SKIP_PUSH=true                                   Skip pushing to remote"
    echo "  RELEASE_TYPE=patch|minor|major                   Release type"
}

# Main execution
main() {
    local command=${1:-"help"}
    
    case "$command" in
        "release")
            local bump_type=${2:-${RELEASE_TYPE:-"patch"}}
            local skip_build=${3:-${SKIP_BUILD:-"false"}}
            local skip_push=${4:-${SKIP_PUSH:-"false"}}
            create_release "$bump_type" "$skip_build" "$skip_push"
            ;;
        "version")
            echo "v$(get_current_version)"
            ;;
        "build")
            build_and_test
            ;;
        "notes")
            local current_version=$(get_current_version)
            create_release_notes "$current_version" ""
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
