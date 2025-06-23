-- ============================================
-- COMPREHENSIVE FACULTY DIAGNOSIS
-- Detailed diagnosis of faculty table and permissions
-- ============================================

-- Test 1: Basic table access
DO $$
BEGIN
    RAISE NOTICE 'Starting faculty table diagnosis...';
END $$;

-- Test 2: Check if we can count records
SELECT 
    'Record Count Test' as test_name,
    count(*) as total_records
FROM faculty;

-- Test 3: Check RLS status
SELECT 
    'RLS Status Test' as test_name,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'faculty';

-- Test 4: Check current user and role
SELECT 
    'User Context Test' as test_name,
    current_user,
    session_user,
    current_setting('role') as current_role;

-- Test 5: Check policies (if any)
SELECT 
    'Policy Check Test' as test_name,
    count(*) as policy_count
FROM pg_policies 
WHERE tablename = 'faculty';

-- Test 6: Try to insert a test record
DO $$
BEGIN
    BEGIN
        INSERT INTO faculty (name, designation, email, specialization, experience)
        VALUES ('Test User', 'Test Position', 'test@example.com', ARRAY['Testing'], 1);
        RAISE NOTICE 'Insert test: SUCCESS';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Insert test: FAILED - %', SQLERRM;
    END;
END $$;

-- Test 7: Try to select data
DO $$
DECLARE
    rec RECORD;
    record_count INTEGER := 0;
BEGIN
    BEGIN
        FOR rec IN SELECT * FROM faculty LIMIT 3 LOOP
            record_count := record_count + 1;
        END LOOP;
        RAISE NOTICE 'Select test: SUCCESS - Found % records', record_count;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Select test: FAILED - %', SQLERRM;
    END;
END $$;

-- Test 8: Check specific permissions
SELECT 
    'Permission Test' as test_name,
    has_table_privilege('faculty', 'SELECT') as can_select,
    has_table_privilege('faculty', 'INSERT') as can_insert,
    has_table_privilege('faculty', 'UPDATE') as can_update,
    has_table_privilege('faculty', 'DELETE') as can_delete;

-- Cleanup test record
DELETE FROM faculty WHERE email = 'test@example.com';

SELECT 'Diagnosis completed!' as final_result;
