-- ============================================
-- FACULTY PHOTOS STORAGE SETUP
-- Run this script to setup storage policies for faculty photos
-- ============================================

-- Create storage bucket for faculty photos (run in Storage > New Bucket)
-- Bucket name: faculty-photos
-- Public: true
-- File size limit: 10MB
-- Allowed mime types: image/*

-- Storage policies for faculty photos
-- Note: These policies should be created in Supabase Dashboard > Storage > faculty-photos > Policies

-- Policy 1: Allow public read access to faculty photos
-- Name: "Allow public read access to faculty photos"
-- Effect: Allow
-- Action: SELECT
-- Target roles: public
-- SQL: true

-- Policy 2: Allow admin upload/update faculty photos  
-- Name: "Allow admin to upload faculty photos"
-- Effect: Allow
-- Action: INSERT, UPDATE, DELETE
-- Target roles: authenticated
-- SQL: (EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email LIKE '%@admin.%'))

-- Storage helper functions
CREATE OR REPLACE FUNCTION get_faculty_photo_url(photo_path TEXT)
RETURNS TEXT AS $$
BEGIN
    IF photo_path IS NULL OR photo_path = '' THEN
        RETURN NULL;
    END IF;
    
    RETURN (
        SELECT 
            CASE 
                WHEN photo_path LIKE 'http%' THEN photo_path
                ELSE CONCAT('https://your-supabase-url.supabase.co/storage/v1/object/public/faculty-photos/', photo_path)
            END
    );
END;
$$ LANGUAGE plpgsql;

-- Function to handle faculty photo deletion
CREATE OR REPLACE FUNCTION delete_faculty_photo(faculty_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    photo_path TEXT;
BEGIN
    -- Get current photo path
    SELECT profile_image_url INTO photo_path
    FROM faculty 
    WHERE id = faculty_id;
    
    -- Update faculty record
    UPDATE faculty 
    SET profile_image_url = NULL,
        updated_at = NOW()
    WHERE id = faculty_id;
    
    -- Note: Actual file deletion should be handled in the application layer
    -- using Supabase storage API
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_faculty_photo_url IS 'Helper function to generate full URL for faculty photos';
COMMENT ON FUNCTION delete_faculty_photo IS 'Helper function to handle faculty photo deletion';
