#!/bin/bash

# AIESR Achievements System Setup Script
# This script helps set up the achievements system in your Supabase database

echo "🏆 AIESR Achievements System Setup"
echo "=================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Please install it first: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory."
    echo "Please run 'supabase init' first or navigate to your project directory."
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if the SQL file exists
if [ ! -f "scripts/setup-achievements-table.sql" ]; then
    echo "❌ SQL setup file not found at scripts/setup-achievements-table.sql"
    echo "Please ensure the file exists."
    exit 1
fi

echo "✅ SQL setup file found"
echo ""

# Offer to run the setup
echo "This will:"
echo "1. Create the achievements table"
echo "2. Set up indexes for performance"
echo "3. Configure Row Level Security (RLS)"
echo "4. Insert sample data"
echo ""

read -p "Do you want to proceed? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 0
fi

echo ""
echo "🚀 Running achievements table setup..."

# Execute the SQL file
if supabase db reset --linked && supabase db push --linked; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Verify the achievements table was created in your Supabase dashboard"
    echo "2. Check that sample data was inserted"
    echo "3. Configure admin users in the admin_users table"
    echo "4. Test the achievements system in your application"
    echo ""
    echo "📚 For more information, see docs/ACHIEVEMENTS_SYSTEM.md"
else
    echo ""
    echo "❌ Setup failed. Please check the error messages above."
    echo "You may need to manually run the SQL commands in your Supabase dashboard."
    exit 1
fi
