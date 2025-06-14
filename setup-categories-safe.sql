-- Safe Dynamic Categories Setup
-- This script can be run safely even if some parts already exist

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

-- 2. Add category_id to events table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE events ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON categories(is_active, sort_order);

-- 4. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 5. Drop and recreate policies
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;

CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- 6. Create or replace update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Drop and recreate trigger
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Insert default categories (only if they don't exist)
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

-- 9. Migrate existing events to use categories (if data exists)
DO $$
BEGIN
  -- Only migrate if events exist and don't already have category_id set
  IF EXISTS (SELECT 1 FROM events WHERE category_id IS NULL AND type IS NOT NULL) THEN
    UPDATE events 
    SET category_id = (
      SELECT id FROM categories WHERE slug = events.type
    )
    WHERE category_id IS NULL AND type IS NOT NULL;
    
    RAISE NOTICE 'Migrated existing events to use dynamic categories';
  END IF;
END $$;

-- 10. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON categories TO authenticated;
GRANT SELECT ON categories TO anon;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Dynamic categories setup completed successfully!';
END $$;
