-- Add contact information settings to admin_settings table
INSERT INTO admin_settings (key, value, description, category, is_public) VALUES
  ('contact_phones', '["+91 612 2346789", "+91 612 2346790"]', 'Contact phone numbers', 'contact', true),
  ('contact_address', '{"line1": "Amity University Campus", "line2": "Patna, Bihar", "city": "Patna", "state": "Bihar", "zipCode": "800014"}', 'Contact address information', 'contact', true),
  ('support_hours', '"9 AM - 6 PM, Monday to Saturday"', 'Support/office hours', 'contact', true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public,
  updated_at = CURRENT_TIMESTAMP;
