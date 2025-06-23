-- ============================================
-- FACULTY TABLE SETUP - Dynamic Faculty Management
-- Run this script in Supabase SQL Editor
-- ============================================

-- Create faculty table
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    
    -- Professional Information
    specialization TEXT[] NOT NULL DEFAULT '{}',
    experience INTEGER NOT NULL DEFAULT 0,
    education TEXT[] DEFAULT '{}',
    qualifications TEXT[] DEFAULT '{}',
    
    -- Research & Academic
    research_areas TEXT[] DEFAULT '{}',
    publications JSONB DEFAULT '[]',
    achievements TEXT[] DEFAULT '{}',
    
    -- Profile Information
    bio TEXT,
    profile_image_url TEXT,
    office_location VARCHAR(255),
    office_hours TEXT,
    
    -- Contact & Links
    linkedin_url VARCHAR(500),
    research_gate_url VARCHAR(500),
    google_scholar_url VARCHAR(500),
    personal_website VARCHAR(500),
    
    -- Display Settings
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faculty_active ON faculty(is_active);
CREATE INDEX IF NOT EXISTS idx_faculty_featured ON faculty(is_featured);
CREATE INDEX IF NOT EXISTS idx_faculty_sort_order ON faculty(sort_order);
CREATE INDEX IF NOT EXISTS idx_faculty_specialization ON faculty USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_faculty_research_areas ON faculty USING GIN(research_areas);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_faculty_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_faculty_updated_at
    BEFORE UPDATE ON faculty
    FOR EACH ROW
    EXECUTE FUNCTION update_faculty_updated_at();

-- Enable Row Level Security
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Public read access for active faculty
CREATE POLICY "Allow public read access to active faculty" ON faculty
    FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Allow admin full access to faculty" ON faculty
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@admin.%'
        )
    );

-- Insert sample faculty data
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
    is_featured,
    sort_order
) VALUES 
(
    'Dr. Priya Sharma', 
    'Professor of English Literature', 
    'priya.sharma@aiesr.edu',
    ARRAY['Victorian Literature', 'Postcolonial Studies'],
    15,
    ARRAY['PhD in English Literature - Oxford University', 'MA English - Delhi University'],
    ARRAY['Victorian Poetry', 'Colonial Discourse', 'Gender Studies'],
    '[
        {"title": "Echoes of Empire: Victorian Literature in Colonial Context", "year": 2020, "journal": "Literary Studies Quarterly"},
        {"title": "Women Voices in Postcolonial Narratives", "year": 2021, "journal": "Modern Literary Review"},
        {"title": "Reimagining the Canon: Indian English Literature", "year": 2022, "journal": "International Journal of Literary Studies"}
    ]'::jsonb,
    'Dr. Priya Sharma is a distinguished scholar specializing in Victorian literature and postcolonial studies. Her research focuses on the intersection of colonial discourse and literary expression.',
    true,
    1
),
(
    'Prof. Rajesh Kumar', 
    'Head of Department - Creative Writing', 
    'rajesh.kumar@aiesr.edu',
    ARRAY['Creative Writing', 'Modern Poetry'],
    20,
    ARRAY['MFA Creative Writing - Iowa Writers Workshop', 'MA English Literature - JNU'],
    ARRAY['Contemporary Poetry', 'Creative Non-fiction', 'Writing Pedagogy'],
    '[
        {"title": "The Art of Storytelling in Digital Age", "year": 2019, "journal": "Creative Writing Studies"},
        {"title": "Voices from the Margin: New Indian Poetry", "year": 2021, "book": "Penguin Random House"},
        {"title": "Teaching Creative Writing: Methods and Approaches", "year": 2022, "journal": "Writing Education Review"}
    ]'::jsonb,
    'Prof. Rajesh Kumar is an award-winning poet and creative writing instructor with over two decades of experience in nurturing emerging writers.',
    true,
    2
),
(
    'Dr. Meera Patel', 
    'Associate Professor - Comparative Literature', 
    'meera.patel@aiesr.edu',
    ARRAY['Comparative Literature', 'Translation Studies'],
    12,
    ARRAY['PhD Comparative Literature - Harvard University', 'MA French Literature - Sorbonne'],
    ARRAY['Literary Translation', 'Cross-cultural Studies', 'Francophone Literature'],
    '[
        {"title": "Bridges of Understanding: Literary Translation as Cultural Mediation", "year": 2020, "journal": "Translation Review"},
        {"title": "Comparative Perspectives on World Literature", "year": 2021, "journal": "Comparative Literature Studies"}
    ]'::jsonb,
    'Dr. Meera Patel specializes in comparative literature and translation studies, with particular expertise in French and Indian literary traditions.',
    false,
    3
),
(
    'Dr. Arjun Menon', 
    'Assistant Professor - Media Studies', 
    'arjun.menon@aiesr.edu',
    ARRAY['Digital Media', 'Film Studies'],
    8,
    ARRAY['PhD Media Studies - NYU', 'MA Film Studies - FTII'],
    ARRAY['Digital Storytelling', 'Documentary Film', 'New Media'],
    '[
        {"title": "Digital Narratives in Contemporary Cinema", "year": 2021, "journal": "Media Studies Quarterly"},
        {"title": "The Future of Storytelling: VR and Interactive Media", "year": 2022, "journal": "Digital Humanities Review"}
    ]'::jsonb,
    'Dr. Arjun Menon explores the intersection of traditional storytelling and digital media, focusing on emerging narrative forms.',
    false,
    4
);

-- Create faculty_photos storage bucket setup
-- Note: Run this in Supabase Storage, not SQL Editor
-- Storage bucket will be created via the admin interface

COMMENT ON TABLE faculty IS 'Dynamic faculty management system with CRUD operations';
COMMENT ON COLUMN faculty.publications IS 'JSONB array of publication objects with title, year, journal/book, etc.';
COMMENT ON COLUMN faculty.specialization IS 'Array of faculty specialization areas';
COMMENT ON COLUMN faculty.research_areas IS 'Array of research focus areas';
