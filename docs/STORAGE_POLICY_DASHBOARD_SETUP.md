-- ============================================
-- SUPABASE STORAGE POLICIES - DASHBOARD SETUP GUIDE
-- For testimonial-photos bucket
-- ============================================

-- ❌ PERMISSION ERROR SOLUTION:
-- The error "must be owner of table objects" means you need to create
-- the remaining policies through the Supabase Dashboard UI, not SQL.

-- ✅ CURRENT STATUS:
-- Public Read (SELECT) - ✅ Created
-- Public Upload (INSERT) - ✅ Created  
-- Admin Update (UPDATE) - ❌ Missing
-- Admin Delete (DELETE) - ❌ Missing

-- ============================================
-- CREATE MISSING POLICIES VIA DASHBOARD
-- ============================================

-- Step 1: Go to Supabase Dashboard
-- URL: https://app.supabase.com/project/rjbvufpkbyceygiobdus/storage/policies

-- Step 2: Click on "testimonial-photos" bucket

-- Step 3: Click "New Policy" and create these 2 policies:

-- POLICY 1: Admin Update
-- Name: Allow authenticated users to update photos
-- Policy command: UPDATE
-- Target roles: authenticated  
-- USING expression: bucket_id = 'testimonial-photos'
-- WITH CHECK expression: bucket_id = 'testimonial-photos'

-- POLICY 2: Admin Delete
-- Name: Allow authenticated users to delete photos  
-- Policy command: DELETE
-- Target roles: authenticated
-- USING expression: bucket_id = 'testimonial-photos'

-- ============================================
-- VERIFICATION QUERY (Run this after creating policies)
-- ============================================

-- Check all policies are working
SELECT
policyname,
cmd,
CASE
WHEN cmd = 'SELECT' THEN '✅ Public Read'
WHEN cmd = 'INSERT' THEN '✅ Public Upload'
WHEN cmd = 'UPDATE' THEN '✅ Admin Update'
WHEN cmd = 'DELETE' THEN '✅ Admin Delete'
ELSE cmd
END as policy_type,
CASE
WHEN qual IS NOT NULL THEN '✅ Has USING clause'
ELSE '❌ No USING clause'
END as using_status,
CASE
WHEN with_check IS NOT NULL THEN '✅ Has WITH CHECK clause'
ELSE '❌ No WITH CHECK clause'
END as check_status
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%testimonial%'
ORDER BY cmd, policyname;

-- Expected result: 4 policies total
-- SELECT, INSERT, UPDATE, DELETE

-- ============================================
-- TESTING CHECKLIST
-- ============================================

-- After creating all policies, test:
-- ✅ Public can upload photos (testimonial form)
-- ✅ Public can view photos (testimonial display)  
-- ✅ Admins can manage photos (admin panel)
-- ✅ No permission errors in console
