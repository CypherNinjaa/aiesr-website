-- Add admissions email setting to admin_settings table
-- This makes the admissions email editable from the admin panel

-- Insert the admissions_email setting if it doesn't exist
INSERT INTO admin_settings (
    key,
    value,
    description,
    category,
    is_public
) VALUES (
    'admissions_email',
    '"admissions@aiesr.amity.edu"'::jsonb,
    'Email address for admissions inquiries displayed on the Contact page',
    'contact',
    true
) ON CONFLICT (key) DO NOTHING;

-- Verify the setting was added
SELECT key, value, description, category, is_public 
FROM admin_settings 
WHERE key = 'admissions_email';
