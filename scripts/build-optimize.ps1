# AIESR Website Build Optimization Script (PowerShell)
# This script optimizes the build process and ensures production readiness

Write-Host "🚀 Starting AIESR Website Build Optimization..." -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Node.js and npm are installed
Write-Status "Checking Node.js and npm installation..."

try {
    $nodeVersion = node --version
    Write-Success "Node.js version: $nodeVersion"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 18+ to continue."
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Success "npm version: $npmVersion"
} catch {
    Write-Error "npm is not installed. Please install npm to continue."
    exit 1
}

# Install dependencies
Write-Status "Installing dependencies..."
$installResult = & npm ci --silent
if ($LASTEXITCODE -eq 0) {
    Write-Success "Dependencies installed successfully"
} else {
    Write-Error "Failed to install dependencies"
    exit 1
}

# Type checking
Write-Status "Running TypeScript type checking..."
& npm run type-check
if ($LASTEXITCODE -eq 0) {
    Write-Success "TypeScript type checking passed"
} else {
    Write-Error "TypeScript type checking failed"
    exit 1
}

# Linting
Write-Status "Running ESLint..."
& npm run lint
if ($LASTEXITCODE -eq 0) {
    Write-Success "Linting passed"
} else {
    Write-Warning "Linting issues found. Running auto-fix..."
    & npm run lint:fix
}

# Format checking
Write-Status "Checking code formatting..."
& npm run format:check
if ($LASTEXITCODE -eq 0) {
    Write-Success "Code formatting is correct"
} else {
    Write-Warning "Code formatting issues found. Auto-formatting..."
    & npm run format
}

# Run tests
Write-Status "Running tests..."
& npm run test -- --passWithNoTests
if ($LASTEXITCODE -eq 0) {
    Write-Success "All tests passed"
} else {
    Write-Error "Tests failed"
    exit 1
}

# Clean previous builds
Write-Status "Cleaning previous builds..."
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
}
if (Test-Path "coverage") {
    Remove-Item -Recurse -Force "coverage"
}
Write-Success "Previous builds cleaned"

# Build the application
Write-Status "Building the application..."
& npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Success "Build completed successfully"
} else {
    Write-Error "Build failed"
    exit 1
}

# Analyze bundle size (optional)
if ($args[0] -eq "--analyze") {
    Write-Status "Analyzing bundle size..."
    & npm run build:analyze
    Write-Success "Bundle analysis completed"
}

# Check for console.logs in production build
Write-Status "Checking for console statements in production build..."
if (Test-Path ".next") {
    $consoleFiles = Get-ChildItem -Path ".next" -Recurse -Filter "*.js" | Select-String -Pattern "console\." -SimpleMatch | Select-Object -ExpandProperty Filename -Unique
    $consoleCount = ($consoleFiles | Measure-Object).Count
    
    if ($consoleCount -gt 0) {
        Write-Warning "Found $consoleCount files with console statements in production build"
        Write-Warning "Consider removing console statements for production"
    } else {
        Write-Success "No console statements found in production build"
    }
}

# Generate build report
Write-Status "Generating build report..."
$buildSize = if (Test-Path ".next") { 
    [math]::Round((Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2) 
} else { 0 }

$staticSize = if (Test-Path ".next/static") { 
    [math]::Round((Get-ChildItem -Path ".next/static" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2) 
} else { 0 }

Write-Host ""
Write-Host "📊 BUILD REPORT" -ForegroundColor Blue
Write-Host "===============" -ForegroundColor Blue
Write-Host "Total build size: ${buildSize} MB"
Write-Host "Static assets size: ${staticSize} MB"
Write-Host "Node.js version: $nodeVersion"
Write-Host "Build timestamp: $(Get-Date)"
Write-Host ""

Write-Success "🎉 Build optimization completed successfully!"
Write-Status "Your AIESR website is ready for deployment!"

# Performance recommendations
Write-Host ""
Write-Host "🔧 PERFORMANCE RECOMMENDATIONS:" -ForegroundColor Magenta
Write-Host "• Enable gzip/brotli compression on your server"
Write-Host "• Configure proper caching headers"
Write-Host "• Use a CDN for static assets"
Write-Host "• Monitor Core Web Vitals regularly"
Write-Host "• Consider implementing Service Worker for caching"

exit 0
