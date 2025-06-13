-- =================================================================
-- COMPLETE SUPABASE STORAGE SETUP - EXECUTE THIS IN ONE GO
-- =================================================================
-- Copy and paste this entire script into Supabase SQL Editor

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('event-images', 'event-images', true),
  ('faculty-images', 'faculty-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create all storage policies for event-images bucket
CREATE POLICY IF NOT EXISTS "Public Access for Event Images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload event images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Admins can update event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'event-images' 
  AND EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

CREATE POLICY IF NOT EXISTS "Admins can delete event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'event-images' 
  AND EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- 3. Create all storage policies for faculty-images bucket
CREATE POLICY IF NOT EXISTS "Public Access for Faculty Images" ON storage.objects
FOR SELECT USING (bucket_id = 'faculty-images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload faculty images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'faculty-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Admins can update faculty images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'faculty-images' 
  AND EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

CREATE POLICY IF NOT EXISTS "Admins can delete faculty images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'faculty-images' 
  AND EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- 4. Verify setup
SELECT 
  'Buckets Created' as status,
  id as bucket_name,
  public as is_public
FROM storage.buckets 
WHERE id IN ('event-images', 'faculty-images');

-- Success message
SELECT 'Storage setup complete! Ready for image uploads.' as message;
