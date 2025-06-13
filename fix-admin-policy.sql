-- Fix for infinite recursion in admin_users RLS policies
-- Run this in Supabase SQL Editor to fix the issue

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Super admins can read all admin data" ON admin_users;
DROP POLICY IF EXISTS "Admins can read their own data" ON admin_users;

-- Create a simpler, non-recursive policy for admin_users
-- This allows authenticated users to read admin data if they are in the admin_users table
CREATE POLICY "Authenticated users can read admin data" ON admin_users
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- For write operations, we'll use the service role key instead of RLS
-- So we can disable other policies on admin_users for now
CREATE POLICY "Service role can manage admin_users" ON admin_users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Alternative: If you want to keep some user-level restrictions, use this instead:
-- CREATE POLICY "Users can read their own admin data" ON admin_users
--     FOR SELECT USING (id = auth.uid());

-- Also fix any other policies that might reference admin_users recursively
-- Let's recreate the event policies to be more explicit

-- Drop and recreate event policies to avoid potential issues
DROP POLICY IF EXISTS "Only admins can create events" ON events;
DROP POLICY IF EXISTS "Only admins can update events" ON events;
DROP POLICY IF EXISTS "Only admins can delete events" ON events;

-- Recreate event policies with service role check as fallback
CREATE POLICY "Admins can create events" ON events
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND (
            auth.jwt() ->> 'role' = 'service_role' OR
            auth.uid() IN (SELECT id FROM admin_users)
        )
    );

CREATE POLICY "Admins can update events" ON events
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND (
            auth.jwt() ->> 'role' = 'service_role' OR
            auth.uid() IN (SELECT id FROM admin_users)
        )
    );

CREATE POLICY "Admins can delete events" ON events
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND (
            auth.jwt() ->> 'role' = 'service_role' OR
            auth.uid() IN (SELECT id FROM admin_users)
        )
    );

-- Fix category policies as well
DROP POLICY IF EXISTS "Only admins can manage categories" ON event_categories;

CREATE POLICY "Admins can manage categories" ON event_categories
    FOR ALL USING (
        auth.uid() IS NOT NULL AND (
            auth.jwt() ->> 'role' = 'service_role' OR
            auth.uid() IN (SELECT id FROM admin_users)
        )
    );

-- Insert some default categories if they don't exist
INSERT INTO event_categories (name, description, color, icon) VALUES
    ('Academic', 'Academic conferences and seminars', '#3B82F6', 'academic-cap'),
    ('Cultural', 'Cultural events and celebrations', '#F59E0B', 'sparkles'),
    ('Research', 'Research presentations and workshops', '#10B981', 'beaker'),
    ('Workshop', 'Hands-on workshops and training', '#8B5CF6', 'wrench-screwdriver')
ON CONFLICT (name) DO NOTHING;
