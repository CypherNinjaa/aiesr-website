-- ================================
-- SUPABASE STORAGE SETUP FOR AIESR
-- ================================
-- This script sets up storage buckets and policies for image uploads

-- 1. Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);

-- 2. Create storage policy for public read access
CREATE POLICY "Public Access for Event Images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- 3. Create storage policy for authenticated upload
CREATE POLICY "Authenticated users can upload event images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Create storage policy for admin update/delete
CREATE POLICY "Admins can update event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'event-images' 
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can delete event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'event-images' 
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid()
  )
);

-- 5. Create additional bucket for other uploads (optional)
INSERT INTO storage.buckets (id, name, public)
VALUES ('faculty-images', 'faculty-images', true);

-- Create policies for faculty images
CREATE POLICY "Public Access for Faculty Images" ON storage.objects
FOR SELECT USING (bucket_id = 'faculty-images');

CREATE POLICY "Authenticated users can upload faculty images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'faculty-images' 
  AND auth.role() = 'authenticated'
);

-- 6. Show current buckets (for verification)
SELECT * FROM storage.buckets;
