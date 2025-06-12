#!/bin/bash

# AIESR Website Build Optimization Script
# This script optimizes the build process and ensures production readiness

echo "🚀 Starting AIESR Website Build Optimization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js and npm are installed
print_status "Checking Node.js and npm installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ to continue."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm to continue."
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Install dependencies
print_status "Installing dependencies..."
npm ci --silent
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Type checking
print_status "Running TypeScript type checking..."
npm run type-check
if [ $? -eq 0 ]; then
    print_success "TypeScript type checking passed"
else
    print_error "TypeScript type checking failed"
    exit 1
fi

# Linting
print_status "Running ESLint..."
npm run lint
if [ $? -eq 0 ]; then
    print_success "Linting passed"
else
    print_warning "Linting issues found. Running auto-fix..."
    npm run lint:fix
fi

# Format checking
print_status "Checking code formatting..."
npm run format:check
if [ $? -eq 0 ]; then
    print_success "Code formatting is correct"
else
    print_warning "Code formatting issues found. Auto-formatting..."
    npm run format
fi

# Run tests
print_status "Running tests..."
npm run test -- --passWithNoTests
if [ $? -eq 0 ]; then
    print_success "All tests passed"
else
    print_error "Tests failed"
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
npm run clean
print_success "Previous builds cleaned"

# Build the application
print_status "Building the application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Analyze bundle size (optional)
if [ "$1" = "--analyze" ]; then
    print_status "Analyzing bundle size..."
    npm run build:analyze
    print_success "Bundle analysis completed"
fi

# Check for console.logs in production build
print_status "Checking for console statements in production build..."
CONSOLE_COUNT=$(find .next -name "*.js" -exec grep -l "console\." {} \; 2>/dev/null | wc -l)
if [ $CONSOLE_COUNT -gt 0 ]; then
    print_warning "Found $CONSOLE_COUNT files with console statements in production build"
    print_warning "Consider removing console statements for production"
else
    print_success "No console statements found in production build"
fi

# Generate build report
print_status "Generating build report..."
BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
STATIC_SIZE=$(du -sh .next/static 2>/dev/null | cut -f1)

echo ""
echo "📊 BUILD REPORT"
echo "==============="
echo "Total build size: $BUILD_SIZE"
echo "Static assets size: $STATIC_SIZE"
echo "Node.js version: $NODE_VERSION"
echo "Build timestamp: $(date)"
echo ""

print_success "🎉 Build optimization completed successfully!"
print_status "Your AIESR website is ready for deployment!"

# Performance recommendations
echo ""
echo "🔧 PERFORMANCE RECOMMENDATIONS:"
echo "• Enable gzip/brotli compression on your server"
echo "• Configure proper caching headers"
echo "• Use a CDN for static assets"
echo "• Monitor Core Web Vitals regularly"
echo "• Consider implementing Service Worker for caching"

exit 0
