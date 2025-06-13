-- STEP-BY-STEP FIX FOR DATABASE ISSUE
-- Copy and paste this ENTIRE script into Supabase SQL Editor and click RUN

-- Step 1: Remove the problematic policy that's causing infinite recursion
DROP POLICY IF EXISTS "Super admins can read all admin data" ON admin_users;

-- Step 2: Create a simple policy that allows reading admin data
CREATE POLICY "Simple admin read policy" ON admin_users
    FOR SELECT USING (true);

-- Step 3: Add the missing event categories
INSERT INTO event_categories (name, description, color, icon) VALUES
    ('Academic', 'Academic conferences and seminars', '#3B82F6', 'academic-cap'),
    ('Cultural', 'Cultural events and celebrations', '#F59E0B', 'sparkles'),
    ('Research', 'Research presentations and workshops', '#10B981', 'beaker'),
    ('Workshop', 'Hands-on workshops and training', '#8B5CF6', 'wrench-screwdriver')
ON CONFLICT (name) DO NOTHING;

-- That's it! Your database should work now.
