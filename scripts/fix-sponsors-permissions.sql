-- =============================================
-- FIX SPONSORS SYSTEM PERMISSIONS
-- =============================================
-- This script fixes the permission denied errors for sponsors and event_sponsors tables
-- Execute this in your Supabase SQL editor

-- 1. Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow admin full access to sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Allow authenticated insert sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Allow authenticated update sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Allow authenticated delete sponsors" ON public.sponsors;

DROP POLICY IF EXISTS "Allow admin full access to event sponsors" ON public.event_sponsors;
DROP POLICY IF EXISTS "Allow authenticated insert event sponsors" ON public.event_sponsors;
DROP POLICY IF EXISTS "Allow authenticated update event sponsors" ON public.event_sponsors;
DROP POLICY IF EXISTS "Allow authenticated delete event sponsors" ON public.event_sponsors;

DROP POLICY IF EXISTS "Allow admin upload access to sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete access to sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete sponsor logos" ON storage.objects;

-- 2. Create new policies for sponsors table (allow all authenticated users)
CREATE POLICY "Allow authenticated insert sponsors" ON public.sponsors
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update sponsors" ON public.sponsors
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete sponsors" ON public.sponsors
    FOR DELETE
    TO authenticated
    USING (true);

-- 3. Create new policies for event_sponsors table (allow all authenticated users)
CREATE POLICY "Allow authenticated insert event sponsors" ON public.event_sponsors
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update event sponsors" ON public.event_sponsors
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete event sponsors" ON public.event_sponsors
    FOR DELETE
    TO authenticated
    USING (true);

-- 4. Create storage policies for sponsor logos
CREATE POLICY "Allow authenticated upload sponsor logos" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'sponsor-logos');

CREATE POLICY "Allow authenticated update sponsor logos" ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'sponsor-logos');

CREATE POLICY "Allow authenticated delete sponsor logos" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'sponsor-logos');

-- 5. Also remove the created_by foreign key constraint if it exists (optional - only if causing issues)
-- ALTER TABLE public.sponsors DROP CONSTRAINT IF EXISTS sponsors_created_by_fkey;
-- ALTER TABLE public.sponsors ALTER COLUMN created_by DROP NOT NULL;

-- Done! The sponsor system should now work without permission errors.
