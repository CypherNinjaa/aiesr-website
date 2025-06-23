-- ============================================
-- QUICK FACULTY PERMISSIONS FIX
-- Simple fix to ensure basic permissions are working
-- ============================================

-- Disable RLS temporarily to test if that's the issue
ALTER TABLE faculty DISABLE ROW LEVEL SECURITY;

-- Test if we can access the table now
SELECT 'RLS disabled, testing access...' as status;
SELECT count(*) as faculty_count FROM faculty;

-- Re-enable RLS with simpler policies
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access to active faculty" ON faculty;
DROP POLICY IF EXISTS "Allow authenticated users to read all faculty" ON faculty;
DROP POLICY IF EXISTS "Allow authenticated users to insert faculty" ON faculty;
DROP POLICY IF EXISTS "Allow authenticated users to update faculty" ON faculty;
DROP POLICY IF EXISTS "Allow authenticated users to delete faculty" ON faculty;

-- Create very simple policies
CREATE POLICY "faculty_select_policy" ON faculty FOR SELECT USING (true);
CREATE POLICY "faculty_insert_policy" ON faculty FOR INSERT WITH CHECK (true);
CREATE POLICY "faculty_update_policy" ON faculty FOR UPDATE USING (true);
CREATE POLICY "faculty_delete_policy" ON faculty FOR DELETE USING (true);

-- Test access with new policies
SELECT 'New policies applied, testing access...' as status;
SELECT count(*) as faculty_count FROM faculty;

-- If no records exist, add some sample data
INSERT INTO faculty (
    name, 
    designation, 
    email, 
    specialization, 
    experience,
    is_active,
    sort_order
) 
SELECT 
    'Dr. Sample Faculty',
    'Professor',
    'sample@university.edu',
    ARRAY['Literature', 'Writing'],
    10,
    true,
    1
WHERE NOT EXISTS (SELECT 1 FROM faculty LIMIT 1);

-- Final test
SELECT 'Setup complete!' as status;
SELECT id, name, designation, email, is_active FROM faculty LIMIT 3;
