# AIESR Achievements System Setup Script (PowerShell)
# This script helps set up the achievements system in your Supabase database

Write-Host "🏆 AIESR Achievements System Setup" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it first: https://supabase.com/docs/guides/cli" -ForegroundColor Yellow
    exit 1
}

# Check if we're in a Supabase project
if (-not (Test-Path "supabase/config.toml")) {
    Write-Host "❌ Not in a Supabase project directory." -ForegroundColor Red
    Write-Host "Please run 'supabase init' first or navigate to your project directory." -ForegroundColor Yellow
    exit 1
}

# Check if the SQL file exists
if (-not (Test-Path "scripts/setup-achievements-table.sql")) {
    Write-Host "❌ SQL setup file not found at scripts/setup-achievements-table.sql" -ForegroundColor Red
    Write-Host "Please ensure the file exists." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ SQL setup file found" -ForegroundColor Green
Write-Host ""

# Offer to run the setup
Write-Host "This will:" -ForegroundColor Cyan
Write-Host "1. Create the achievements table" -ForegroundColor White
Write-Host "2. Set up indexes for performance" -ForegroundColor White
Write-Host "3. Configure Row Level Security (RLS)" -ForegroundColor White
Write-Host "4. Insert sample data" -ForegroundColor White
Write-Host ""

$response = Read-Host "Do you want to proceed? (y/N)"

if ($response -notmatch "^[Yy]$") {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚀 Running achievements table setup..." -ForegroundColor Cyan

# Execute the SQL file
try {
    # First, let's try to apply the migration
    $sqlContent = Get-Content "scripts/setup-achievements-table.sql" -Raw
    
    # You can either:
    # 1. Use Supabase CLI to run the SQL
    # 2. Or instruct the user to run it manually
    
    Write-Host ""
    Write-Host "📋 SQL Commands to Run:" -ForegroundColor Yellow
    Write-Host "Copy and paste the following SQL commands into your Supabase SQL Editor:" -ForegroundColor White
    Write-Host ""
    Write-Host "-- Navigate to your Supabase Dashboard > SQL Editor" -ForegroundColor Gray
    Write-Host "-- Copy the contents of scripts/setup-achievements-table.sql" -ForegroundColor Gray
    Write-Host "-- Paste and run in the SQL Editor" -ForegroundColor Gray
    Write-Host ""
    
    # Open the SQL file for the user
    if (Get-Command notepad -ErrorAction SilentlyContinue) {
        $openFile = Read-Host "Would you like to open the SQL file now? (y/N)"
        if ($openFile -match "^[Yy]$") {
            Start-Process notepad "scripts/setup-achievements-table.sql"
        }
    }
    
    Write-Host ""
    Write-Host "✅ Setup instructions provided!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy the SQL from scripts/setup-achievements-table.sql" -ForegroundColor White
    Write-Host "2. Paste and run it in your Supabase SQL Editor" -ForegroundColor White
    Write-Host "3. Verify the achievements table was created" -ForegroundColor White
    Write-Host "4. Check that sample data was inserted" -ForegroundColor White
    Write-Host "5. Configure admin users in the admin_users table" -ForegroundColor White
    Write-Host "6. Test the achievements system in your application" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 For more information, see docs/ACHIEVEMENTS_SYSTEM.md" -ForegroundColor Yellow
    
} catch {
    Write-Host ""
    Write-Host "❌ Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please manually run the SQL commands in your Supabase dashboard." -ForegroundColor Yellow
    exit 1
}
