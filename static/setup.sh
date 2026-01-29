#!/bin/bash

set -e

echo "🏥 ZARISH SPHERE Documentation Setup"
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

# Check system requirements
echo "🔍 Checking system requirements..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 24+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 24 ]; then
    print_error "Node.js 24+ required. Current version: $(node -v)"
    exit 1
else
    print_success "Node.js $(node -v) detected"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm."
    exit 1
else
    print_success "npm $(npm -v) detected"
fi

# Check git
if ! command -v git &> /dev/null; then
    print_error "git not found. Please install git."
    exit 1
else
    print_success "git $(git --version | cut -d' ' -f3) detected"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Setup environment file
echo ""
echo "🔧 Setting up environment..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_success "Created .env.local from .env.example"
        print_warning "Please update .env.local with your configuration"
    else
        print_warning ".env.example not found. Creating basic .env.local"
        cat > .env.local << EOF
# Node Environment
NODE_ENV=development

# Algolia Search (Optional - requires approval)
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_INDEX_NAME=zarishsphere

# GitHub Configuration
GITHUB_TOKEN=
GITHUB_REPO=zs-docs/docs-site
GITHUB_ORG=zs-docs

# Build Configuration
EOF
        print_success "Created basic .env.local"
    fi
else
    print_success ".env.local already exists"
fi

# Setup git hooks (if husky is available)
echo ""
echo "🪝 Setting up git hooks..."
if npm list husky &> /dev/null; then
    npx husky install
    print_success "Git hooks installed"
else
    print_warning "husky not installed. Skipping git hooks setup."
fi

# Validate configuration
echo ""
echo "🔍 Validating configuration..."

# Check if docusaurus.config.ts exists
if [ -f "docusaurus.config.ts" ]; then
    print_success "docusaurus.config.ts found"
else
    print_error "docusaurus.config.ts not found"
    exit 1
fi

# Check if package.json has required scripts
if npm run | grep -q "start"; then
    print_success "Development script available"
else
    print_error "Development script not found in package.json"
    exit 1
fi

# Build documentation
echo ""
echo "🔨 Building documentation..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Documentation built successfully"
else
    print_error "Failed to build documentation"
    exit 1
fi

# Final summary
echo ""
echo "🎉 Setup completed successfully!"
echo "=================================="
echo ""
print_info "Next steps:"
echo "1. 🚀 Start development server:    npm start"
echo "2. 🏗️  Build for production:      npm run build"
echo "3. 🧪 Test production build:     npm run serve"
echo "4. 🧹 Clean cache:              npm run clear"
echo "5. 📝 Run linting:              npm run lint (if available)"
echo "6. 🔍 Type checking:            npm run typecheck"
echo ""
print_info "Development server will be available at: http://localhost:3000"
print_info "Production build will be in: ./build directory"
echo ""
print_info "📖 For more information, see: https://docs.zarishsphere.com"
print_info "🆘 Support: support@zarishsphere.com"
echo ""
echo "🏥 Welcome to ZARISH SPHERE Documentation!"