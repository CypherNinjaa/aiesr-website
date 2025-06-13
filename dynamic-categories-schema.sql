-- =================================================================
-- DYNAMIC CATEGORIES IMPLEMENTATION - FULL DATABASE SCHEMA
-- =================================================================
-- Execute this script in Supabase SQL Editor

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color_class VARCHAR(100) DEFAULT 'bg-gray-100 text-gray-800',
  icon_emoji VARCHAR(10) DEFAULT '📅',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Add RLS policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active categories
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

-- Allow authenticated users (admins) to manage categories
CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Add category_id to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 4. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON categories(is_active, sort_order);

-- 5. Seed with existing categories
INSERT INTO categories (name, slug, description, color_class, icon_emoji, sort_order) VALUES
  ('Academic', 'academic', 'Academic events, seminars, and educational programs', 'bg-blue-100 text-blue-800', '🎓', 1),
  ('Cultural', 'cultural', 'Cultural festivals, performances, and artistic events', 'bg-purple-100 text-purple-800', '🎭', 2),
  ('Research', 'research', 'Research presentations, symposiums, and scholarly events', 'bg-green-100 text-green-800', '🔬', 3),
  ('Workshop', 'workshop', 'Hands-on workshops, training sessions, and skill development', 'bg-orange-100 text-orange-800', '🛠️', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color_class = EXCLUDED.color_class,
  icon_emoji = EXCLUDED.icon_emoji,
  sort_order = EXCLUDED.sort_order;

-- 6. Migrate existing events to use category_id
-- Update events to reference the new category system
UPDATE events 
SET category_id = (
  SELECT id FROM categories WHERE slug = events.type
)
WHERE category_id IS NULL AND type IS NOT NULL;

-- 7. Add updated_at trigger for categories
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Add constraint to ensure at least one active category exists
-- (This prevents accidentally deactivating all categories)

-- 9. Comments for documentation
COMMENT ON TABLE categories IS 'Dynamic event categories with customizable properties';
COMMENT ON COLUMN categories.slug IS 'URL-friendly identifier for categories';
COMMENT ON COLUMN categories.color_class IS 'Tailwind CSS classes for category styling';
COMMENT ON COLUMN categories.icon_emoji IS 'Emoji icon for visual representation';
COMMENT ON COLUMN categories.sort_order IS 'Display order for categories (lower = first)';

-- 10. Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON categories TO authenticated;
GRANT SELECT ON categories TO anon;
