-- Minimal fix for infinite recursion in admin_users policies
-- Run this first to resolve the immediate issue

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Super admins can read all admin data" ON admin_users;

-- Create a simple non-recursive policy
CREATE POLICY "Allow authenticated read access" ON admin_users
    FOR SELECT USING (true);

-- Add default categories
INSERT INTO event_categories (name, description, color, icon) VALUES
    ('Academic', 'Academic conferences and seminars', '#3B82F6', 'academic-cap'),
    ('Cultural', 'Cultural events and celebrations', '#F59E0B', 'sparkles'),
    ('Research', 'Research presentations and workshops', '#10B981', 'beaker'),
    ('Workshop', 'Hands-on workshops and training', '#8B5CF6', 'wrench-screwdriver')
ON CONFLICT (name) DO NOTHING;
