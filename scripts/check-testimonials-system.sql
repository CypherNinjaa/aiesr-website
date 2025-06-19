-- ============================================
-- AIESR Testimonials System Troubleshooting
-- Run this to check the current state of your testimonials system
-- ============================================

-- Check if testimonials table exists
SELECT 
    'Table Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'testimonials')
        THEN '✓ testimonials table exists'
        ELSE '✗ testimonials table NOT found'
    END as status;

-- Check table structure
SELECT 
    'Table Columns' as check_type,
    string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position) as status
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'testimonials';

-- Check RLS status
SELECT 
    'RLS Status' as check_type,
    CASE 
        WHEN relrowsecurity = true THEN '✓ Row Level Security is enabled'
        ELSE '✗ Row Level Security is disabled'
    END as status
FROM pg_class 
WHERE relname = 'testimonials' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Check policies
SELECT 
    'RLS Policies' as check_type,
    COUNT(*) || ' policies found: ' || string_agg(policyname, ', ') as status
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'testimonials';

-- Check indexes
SELECT 
    'Indexes' as check_type,
    COUNT(*) || ' indexes found: ' || string_agg(indexname, ', ') as status
FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'testimonials';

-- Check triggers
SELECT 
    'Triggers' as check_type,
    COUNT(*) || ' triggers found: ' || string_agg(trigger_name, ', ') as status
FROM information_schema.triggers 
WHERE event_object_schema = 'public' AND event_object_table = 'testimonials';

-- Check functions
SELECT 
    'Functions' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_testimonials_updated_at')
        THEN '✓ update_testimonials_updated_at function exists'
        ELSE '✗ update_testimonials_updated_at function NOT found'
    END as status;

-- Check data count
SELECT 
    'Data Count' as check_type,
    COALESCE(
        (SELECT COUNT(*)::text || ' testimonials in database' FROM public.testimonials),
        'Unable to count - table may not exist or no access'
    ) as status;

-- Check sample data
SELECT 
    'Sample Data' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.testimonials WHERE email IN ('sarah.j@example.com', 'rahul.s@example.com', 'priya.p@example.com'))
        THEN '✓ Sample data found'
        ELSE '✗ No sample data found'
    END as status;
