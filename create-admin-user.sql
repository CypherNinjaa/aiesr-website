-- Create demo admin user for testing
-- Run this in Supabase SQL Editor

-- First, let's create a test admin user in auth.users (if not exists)
-- You'll need to do this through Supabase Auth UI or API

-- Then add the admin user to admin_users table
-- Replace 'your-user-id-here' with the actual user ID from auth.users
INSERT INTO admin_users (id, email, name, role) VALUES
  ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'Demo Admin', 'admin')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Alternative: If you want to create a user directly in the database
-- (This is for testing only - normally users should be created through Supabase Auth)

-- Check if we have any existing users
SELECT id, email FROM auth.users LIMIT 5;

-- If no users exist, you can create one through the Supabase dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Email: admin@example.com
-- 4. Password: admin123
-- 5. Copy the generated user ID and use it in the INSERT statement above
