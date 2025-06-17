-- Update the achievements table to use dynamic categories
-- This script updates the existing achievements table to reference the categories table

-- First, add the new category_id column
ALTER TABLE achievements ADD COLUMN category_id UUID REFERENCES categories(id);

-- Create a temporary mapping to convert old category strings to category IDs
-- You'll need to run this after the column is added
UPDATE achievements 
SET category_id = (
    CASE 
        WHEN category = 'student' THEN (SELECT id FROM categories WHERE slug = 'academic' LIMIT 1)
        WHEN category = 'faculty' THEN (SELECT id FROM categories WHERE slug = 'academic' LIMIT 1)
        WHEN category = 'institutional' THEN (SELECT id FROM categories WHERE slug = 'academic' LIMIT 1)
        WHEN category = 'research' THEN (SELECT id FROM categories WHERE slug = 'research' LIMIT 1)
        WHEN category = 'award' THEN (SELECT id FROM categories WHERE slug = 'academic' LIMIT 1)
        ELSE (SELECT id FROM categories WHERE slug = 'academic' LIMIT 1)
    END
);

-- Make category_id NOT NULL after populating it
ALTER TABLE achievements ALTER COLUMN category_id SET NOT NULL;

-- Remove the old category column constraint
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS achievements_category_check;

-- Drop the old category column (optional - you might want to keep it for backup)
-- ALTER TABLE achievements DROP COLUMN category;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_achievements_category_id ON achievements(category_id);

-- Update the achievements table to include category information in queries
-- This will help with performance when joining with categories
COMMENT ON COLUMN achievements.category_id IS 'References categories.id for dynamic category management';
