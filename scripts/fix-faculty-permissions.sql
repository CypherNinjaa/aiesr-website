-- ============================================
-- FACULTY TABLE RLS POLICIES FIX
-- Run this script to fix the faculty table permissions
-- ============================================

-- First, let's check if there are any existing policies on the faculty table
-- and drop them if they exist
DROP POLICY IF EXISTS "Faculty are viewable by everyone" ON faculty;
DROP POLICY IF EXISTS "Faculty can be inserted by authenticated users" ON faculty;
DROP POLICY IF EXISTS "Faculty can be updated by authenticated users" ON faculty;
DROP POLICY IF EXISTS "Faculty can be deleted by authenticated users" ON faculty;

-- Enable RLS on faculty table
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow everyone to read active faculty (public access)
CREATE POLICY "Allow public read access to active faculty"
    ON faculty FOR SELECT
    USING (is_active = true);

-- Policy 2: Allow authenticated users to read all faculty (admin access)
CREATE POLICY "Allow authenticated users to read all faculty"
    ON faculty FOR SELECT
    TO authenticated
    USING (true);

-- Policy 3: Allow authenticated users to insert faculty
CREATE POLICY "Allow authenticated users to insert faculty"
    ON faculty FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy 4: Allow authenticated users to update faculty
CREATE POLICY "Allow authenticated users to update faculty"
    ON faculty FOR UPDATE
    TO authenticated
    USING (true);

-- Policy 5: Allow authenticated users to delete faculty
CREATE POLICY "Allow authenticated users to delete faculty"
    ON faculty FOR DELETE
    TO authenticated
    USING (true);

-- Fix the foreign key constraint issue by making created_by and updated_by nullable
-- and removing the constraint if it's causing issues
ALTER TABLE faculty ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE faculty ALTER COLUMN updated_by DROP NOT NULL;

-- Update the trigger function to handle the user ID properly
CREATE OR REPLACE FUNCTION update_faculty_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    -- Only set updated_by if we have a valid auth context
    IF auth.uid() IS NOT NULL THEN
        NEW.updated_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for setting created_by and updated_by
CREATE OR REPLACE FUNCTION set_faculty_user_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Set created_by and updated_by if we have a valid auth context
    IF auth.uid() IS NOT NULL THEN
        IF TG_OP = 'INSERT' THEN
            NEW.created_by = auth.uid();
        END IF;
        NEW.updated_by = auth.uid();
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_faculty_updated_at_trigger ON faculty;
DROP TRIGGER IF EXISTS set_faculty_user_fields_trigger ON faculty;

-- Create new trigger
CREATE TRIGGER set_faculty_user_fields_trigger
    BEFORE INSERT OR UPDATE ON faculty
    FOR EACH ROW
    EXECUTE FUNCTION set_faculty_user_fields();

-- Add some sample data if the table is empty
INSERT INTO faculty (
    name, 
    designation, 
    email, 
    specialization, 
    experience, 
    education, 
    research_areas, 
    publications, 
    bio, 
    is_active, 
    is_featured, 
    sort_order
) VALUES 
(
    'Dr. Jane Smith',
    'Professor of Literature',
    'jane.smith@example.com',
    ARRAY['Contemporary Literature', 'Creative Writing', 'Literary Theory'],
    15,
    ARRAY['PhD in English Literature - Harvard University', 'MA in Creative Writing - Stanford University'],
    ARRAY['Postmodern Fiction', 'Digital Humanities', 'Gender Studies in Literature'],
    '[
        {
            "title": "Narrative Structures in Digital Age",
            "year": 2023,
            "journal": "Modern Literature Review",
            "url": "https://example.com/paper1"
        },
        {
            "title": "The Evolution of Character Development",
            "year": 2022,
            "journal": "Academic Literary Journal",
            "url": "https://example.com/paper2"
        }
    ]'::jsonb,
    'Dr. Jane Smith is a distinguished professor with over 15 years of experience in literary studies and creative writing. She has published extensively on contemporary literature and digital humanities.',
    true,
    true,
    1
),
(
    'Prof. Michael Johnson',
    'Associate Professor of Creative Writing',
    'michael.johnson@example.com',
    ARRAY['Poetry', 'Fiction Writing', 'Workshop Pedagogy'],
    12,
    ARRAY['MFA in Creative Writing - Iowa Writers Workshop', 'BA in English - Columbia University'],
    ARRAY['Contemporary Poetry', 'Writing Pedagogy', 'Literary Magazines'],
    '[
        {
            "title": "Teaching the Craft: A New Approach",
            "year": 2023,
            "journal": "Creative Writing Studies",
            "url": "https://example.com/paper3"
        }
    ]'::jsonb,
    'Professor Johnson is an accomplished poet and educator, known for his innovative approaches to teaching creative writing and his contributions to contemporary poetry.',
    true,
    false,
    2
),
(
    'Dr. Sarah Williams',
    'Assistant Professor of Linguistics',
    'sarah.williams@example.com',
    ARRAY['Applied Linguistics', 'Sociolinguistics', 'Language Acquisition'],
    8,
    ARRAY['PhD in Linguistics - MIT', 'MA in Applied Linguistics - University of Oxford'],
    ARRAY['Second Language Acquisition', 'Multilingualism', 'Language Policy'],
    '[
        {
            "title": "Multilingual Identity in Global Context",
            "year": 2023,
            "journal": "Journal of Sociolinguistics",
            "url": "https://example.com/paper4"
        },
        {
            "title": "Language Learning in Digital Environments",
            "year": 2022,
            "journal": "Applied Linguistics Quarterly",
            "url": "https://example.com/paper5"
        }
    ]'::jsonb,
    'Dr. Williams specializes in sociolinguistics and second language acquisition, with particular expertise in multilingual communities and language policy.',
    true,
    true,
    3
)
ON CONFLICT (email) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON faculty TO authenticated;
GRANT SELECT ON faculty TO anon;

-- Test the setup
SELECT 'Faculty table setup completed successfully!' as status;
SELECT count(*) as faculty_count FROM faculty;
