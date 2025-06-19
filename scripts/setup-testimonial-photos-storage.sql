-- ============================================
-- Supabase Storage Setup for Testimonial Photos
-- Run this after creating the 'testimonial-photos' bucket
-- ============================================

-- Create RLS policies for the testimonial-photos bucket
-- Note: Make sure the bucket 'testimonial-photos' exists and is set to PUBLIC

-- 1. Allow public read access to all photos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow public read access to testimonial photos'
    ) THEN
        CREATE POLICY "Allow public read access to testimonial photos"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'testimonial-photos');
        
        RAISE NOTICE 'Created SELECT policy for public access';
    ELSE
        RAISE NOTICE 'SELECT policy already exists';
    END IF;
END $$;

-- 2. Allow anyone to upload photos (for public testimonial submissions)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow public upload for testimonials'
    ) THEN
        CREATE POLICY "Allow public upload for testimonials"
        ON storage.objects FOR INSERT
        TO public
        WITH CHECK (bucket_id = 'testimonial-photos');
        
        RAISE NOTICE 'Created INSERT policy for public upload';
    ELSE
        RAISE NOTICE 'INSERT policy already exists';
    END IF;
END $$;

-- 3. Allow authenticated users to update photos (for admin management)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow authenticated users to update photos'
    ) THEN
        CREATE POLICY "Allow authenticated users to update photos"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'testimonial-photos')
        WITH CHECK (bucket_id = 'testimonial-photos');
        
        RAISE NOTICE 'Created UPDATE policy for authenticated users';
    ELSE
        RAISE NOTICE 'UPDATE policy already exists';
    END IF;
END $$;

-- 4. Allow authenticated users to delete photos (for admin management)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow authenticated users to delete photos'
    ) THEN
        CREATE POLICY "Allow authenticated users to delete photos"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'testimonial-photos');
        
        RAISE NOTICE 'Created DELETE policy for authenticated users';
    ELSE
        RAISE NOTICE 'DELETE policy already exists';
    END IF;
END $$;

-- Verify the policies were created
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%testimonial%'
ORDER BY cmd, policyname;

-- Create missing policies if they don't exist
-- Check and create UPDATE policy for authenticated users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow authenticated users to update photos'
    ) THEN
        CREATE POLICY "Allow authenticated users to update photos"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'testimonial-photos')
        WITH CHECK (bucket_id = 'testimonial-photos');
        
        RAISE NOTICE 'Created UPDATE policy for authenticated users';
    ELSE
        RAISE NOTICE 'UPDATE policy already exists';
    END IF;
END $$;

-- Check and create DELETE policy for authenticated users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow authenticated users to delete photos'
    ) THEN
        CREATE POLICY "Allow authenticated users to delete photos"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'testimonial-photos');
        
        RAISE NOTICE 'Created DELETE policy for authenticated users';
    ELSE
        RAISE NOTICE 'DELETE policy already exists';
    END IF;
END $$;

-- Create the missing admin policies with alternative approach
-- Sometimes authenticated role policies need to be created differently

-- Drop existing policies if they exist (in case of partial creation)
DROP POLICY IF EXISTS "Allow authenticated users to update photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete photos" ON storage.objects;

-- Create UPDATE policy for authenticated users (simplified)
CREATE POLICY "Allow authenticated users to update photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'testimonial-photos');

-- Create DELETE policy for authenticated users (simplified)
CREATE POLICY "Allow authenticated users to delete photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonial-photos');

-- Alternative: Create policies with service_role if authenticated doesn't work
-- Uncomment the following if the above doesn't work:

/*
CREATE POLICY "Allow service role to update photos"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'testimonial-photos');

CREATE POLICY "Allow service role to delete photos"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'testimonial-photos');
*/

-- Check if we need to enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Final verification - check all policies
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'SELECT' THEN 'Public Read'
        WHEN cmd = 'INSERT' THEN 'Public Upload'
        WHEN cmd = 'UPDATE' THEN 'Admin Update'
        WHEN cmd = 'DELETE' THEN 'Admin Delete'
        ELSE cmd
    END as policy_type,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as using_status,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
        ELSE 'No WITH CHECK clause'
    END as check_status
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%testimonial%'
ORDER BY cmd, policyname;
