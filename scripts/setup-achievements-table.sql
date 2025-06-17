-- Create the achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('student', 'faculty', 'institutional', 'research', 'award')),
    type VARCHAR(50) NOT NULL CHECK (type IN ('award', 'publication', 'recognition', 'milestone', 'collaboration')),
    achiever_name VARCHAR(255) NOT NULL,
    achiever_type VARCHAR(50) NOT NULL CHECK (achiever_type IN ('student', 'faculty', 'department', 'institution')),
    date_achieved DATE NOT NULL,
    image_url TEXT,
    details JSONB,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_achievements_status ON achievements(status);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_achiever_type ON achievements(achiever_type);
CREATE INDEX IF NOT EXISTS idx_achievements_is_featured ON achievements(is_featured);
CREATE INDEX IF NOT EXISTS idx_achievements_date_achieved ON achievements(date_achieved DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_sort_order ON achievements(sort_order, date_achieved DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_achievements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER trigger_achievements_updated_at
    BEFORE UPDATE ON achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_achievements_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published achievements
CREATE POLICY "Public can view published achievements" ON achievements
    FOR SELECT USING (status = 'published');

-- Create policies for admin access (you'll need to adjust based on your admin authentication)
CREATE POLICY "Admin can manage all achievements" ON achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Insert some sample achievements for testing
INSERT INTO achievements (
    title, description, category, type, achiever_name, achiever_type, 
    date_achieved, image_url, details, is_featured, sort_order, status, created_by
) VALUES 
(
    'Best Student Award 2024',
    'Outstanding academic performance and leadership qualities demonstrated throughout the academic year.',
    'student',
    'award',
    'John Smith',
    'student',
    '2024-05-15',
    'https://via.placeholder.com/400x300',
    '{"institution": "AIESR", "award_body": "University Committee", "rank": "1", "amount": "$1000"}',
    true,
    1,
    'published',
    gen_random_uuid()
),
(
    'Research Paper Published in International Journal',
    'Groundbreaking research on contemporary English literature published in a peer-reviewed international journal.',
    'faculty',
    'publication',
    'Dr. Jane Doe',
    'faculty',
    '2024-03-10',
    'https://via.placeholder.com/400x300',
    '{"publication_details": "International Journal of English Studies, Vol. 45, Issue 2", "impact": "Cited by 15+ researchers"}',
    true,
    2,
    'published',
    gen_random_uuid()
),
(
    'Excellence in Teaching Award',
    'Recognized for innovative teaching methods and outstanding student feedback scores.',
    'faculty',
    'recognition',
    'Prof. Michael Johnson',
    'faculty',
    '2024-01-20',
    'https://via.placeholder.com/400x300',
    '{"award_body": "National Teaching Excellence Council", "institution": "AIESR"}',
    true,
    3,
    'published',
    gen_random_uuid()
),
(
    'Inter-University Debate Championship',
    'First place in the annual inter-university English debate competition.',
    'student',
    'award',
    'Sarah Williams',
    'student',
    '2024-04-05',
    'https://via.placeholder.com/400x300',
    '{"rank": "1", "institution": "AIESR", "award_body": "Inter-University Debate Council"}',
    false,
    4,
    'published',
    gen_random_uuid()
),
(
    'International Research Collaboration',
    'Successfully established research partnership with Oxford University for linguistic studies.',
    'institutional',
    'collaboration',
    'AIESR Research Department',
    'department',
    '2024-02-14',
    'https://via.placeholder.com/400x300',
    '{"collaboration_partners": ["Oxford University", "Cambridge University"], "impact": "Joint research program for 3 years"}',
    true,
    5,
    'published',
    gen_random_uuid()
),
(
    'Student Achievement in Creative Writing',
    'Short story published in national literary magazine.',
    'student',
    'publication',
    'Emma Davis',
    'student',
    '2024-06-01',
    'https://via.placeholder.com/400x300',
    '{"publication_details": "National Literary Review, Summer Edition 2024", "impact": "Featured story of the month"}',
    false,
    6,
    'published',
    gen_random_uuid()
);

-- Grant necessary permissions (adjust based on your setup)
GRANT SELECT ON achievements TO anon;
GRANT ALL ON achievements TO authenticated;
GRANT ALL ON achievements TO service_role;
