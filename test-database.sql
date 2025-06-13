-- Quick test query to check if your Supabase setup is working
-- Run this in your Supabase SQL Editor to verify the setup

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('events', 'event_categories', 'admin_users', 'event_analytics');

-- 2. Check if event categories were created
SELECT * FROM event_categories;

-- 3. Test inserting a sample event (replace 'your-admin-user-id' with an actual user ID)
-- First, you need to create an admin user in auth.users, then run:
-- INSERT INTO admin_users (id, email, name, role) VALUES 
-- ('your-auth-user-id-here', 'admin@aiesr.edu', 'Admin User', 'super_admin');

-- 4. Sample event insert (uncomment after creating admin user)
-- INSERT INTO events (
--     title, description, short_description, date, location, type, 
--     featured, registration_required, status, created_by
-- ) VALUES 
-- (
--     'Test Event',
--     'This is a test event to verify the database is working correctly.',
--     'Test event for database verification',
--     '2025-07-01 10:00:00+00',
--     'AIESR Test Location',
--     'academic',
--     true,
--     true,
--     'published',
--     'your-admin-user-id-here'
-- );

-- 5. Test querying events
-- SELECT * FROM events WHERE status = 'published';
