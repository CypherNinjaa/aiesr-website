-- Comprehensive fix for registration links and RLS issues
-- Run this in your Supabase SQL Editor

-- 1. Add the missing registration link columns
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS registration_link TEXT,
ADD COLUMN IF NOT EXISTS custom_registration_link TEXT;

-- Add comments for clarity
COMMENT ON COLUMN events.registration_link IS 'Legacy registration URL field for backward compatibility';
COMMENT ON COLUMN events.custom_registration_link IS 'Custom registration URL for each event. Required when registration_required is true.';

-- 2. Update existing events to use a default registration URL if they had registration enabled
UPDATE events 
SET custom_registration_link = 'https://www.amity.edu/nspg/CARNIVALESQUE2025/'
WHERE registration_required = true 
AND (custom_registration_link IS NULL OR custom_registration_link = '');

-- 3. Fix RLS policies to be more permissive for admin operations
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only admins can insert events" ON events;
DROP POLICY IF EXISTS "Only admins can update events" ON events;
DROP POLICY IF EXISTS "Only admins can delete events" ON events;

-- Create more flexible admin policies
CREATE POLICY "Admins can insert events" ON events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
        OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "Admins can update events" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
        OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "Admins can delete events" ON events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
        OR 
        auth.role() = 'service_role'
    );

-- 4. Allow admins to read all events (not just published ones)
CREATE POLICY "Admins can read all events" ON events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
        OR 
        auth.role() = 'service_role'
        OR 
        status = 'published'
    );

-- 5. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_registration_required ON events(registration_required);
CREATE INDEX IF NOT EXISTS idx_events_registration_deadline ON events(registration_deadline);

-- 6. Ensure RLS is properly enabled on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 7. Allow service role to access admin_users (drop if exists first)
DROP POLICY IF EXISTS "Service role can access admin_users" ON admin_users;
CREATE POLICY "Service role can access admin_users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- 8. Show current admin users for debugging (optional)
-- SELECT 'Current admin users:' as info;
-- SELECT id, email, name, role FROM admin_users;
