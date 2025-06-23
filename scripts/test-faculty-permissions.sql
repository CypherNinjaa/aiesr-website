-- ============================================
-- TEST FACULTY PERMISSIONS
-- Simple test script to verify faculty table access
-- ============================================

-- Test 1: Check if faculty table exists and is accessible
SELECT 'Testing faculty table access...' as test_step;

-- Test 2: Count faculty records
SELECT 
    count(*) as total_faculty,
    count(*) FILTER (WHERE is_active = true) as active_faculty,
    count(*) FILTER (WHERE is_featured = true) as featured_faculty
FROM faculty;

-- Test 3: Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'faculty' 
ORDER BY ordinal_position;

-- Test 4: Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'faculty';

-- Test 5: Try to select some sample data
SELECT 
    id,
    name,
    designation,
    email,
    is_active,
    is_featured,
    created_at
FROM faculty 
LIMIT 5;

SELECT 'Faculty table tests completed!' as result;
