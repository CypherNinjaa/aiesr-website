-- Create settings table for admin configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false, -- Whether setting can be accessed by public API
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);
CREATE INDEX IF NOT EXISTS idx_admin_settings_category ON admin_settings(category);

-- Insert default settings
INSERT INTO admin_settings (key, value, description, category, is_public) VALUES
  ('site_name', '"AIESR - Amity Institute of English Studies & Research"', 'Website name displayed in headers and titles', 'general', true),
  ('site_url', '"https://aiesr-website.vercel.app"', 'Primary website URL', 'general', true),
  ('default_registration_url', '""', 'Default registration URL for events', 'events', false),
  ('email_notifications', 'true', 'Enable email notifications for new registrations', 'notifications', false),
  ('auto_publish_events', 'false', 'Automatically publish events when created', 'events', false),
  ('allow_guest_registration', 'true', 'Allow users to register for events without account', 'events', false),
  ('maintenance_mode', 'false', 'Enable maintenance mode to disable website', 'system', false),
  ('max_events_per_page', '10', 'Number of events to show per page', 'events', true),
  ('hero_texts', '["Where Words Come Alive", "Craft Your Literary Legacy", "Discover the Power of Language", "Shape Your Future in Literature"]', 'Hero section rotating texts', 'content', true),
  ('contact_email', '"info@aiesr.edu"', 'Primary contact email', 'general', true),
  ('social_media', '{"facebook": "", "twitter": "", "instagram": "", "linkedin": ""}', 'Social media links', 'general', true)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can view all settings" ON admin_settings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin can insert settings" ON admin_settings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin can update settings" ON admin_settings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ));

-- Public can only view public settings
CREATE POLICY "Public can view public settings" ON admin_settings FOR SELECT
  USING (is_public = true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_settings_updated_at();
