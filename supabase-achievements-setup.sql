-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('student', 'faculty', 'institutional', 'research', 'award')),
    type TEXT NOT NULL CHECK (type IN ('award', 'publication', 'recognition', 'milestone', 'collaboration')),
    achiever_name TEXT NOT NULL,
    achiever_type TEXT NOT NULL CHECK (achiever_type IN ('student', 'faculty', 'department', 'institution')),
    date_achieved TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    details JSONB,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_achievements_status ON public.achievements(status);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_achiever_type ON public.achievements(achiever_type);
CREATE INDEX IF NOT EXISTS idx_achievements_is_featured ON public.achievements(is_featured);
CREATE INDEX IF NOT EXISTS idx_achievements_date_achieved ON public.achievements(date_achieved DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_sort_order ON public.achievements(sort_order);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_achievements_updated_at ON public.achievements;
CREATE TRIGGER update_achievements_updated_at
    BEFORE UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow public read access to published achievements
CREATE POLICY "Public can view published achievements" ON public.achievements
    FOR SELECT USING (status = 'published');

-- Allow authenticated admin users to manage achievements
CREATE POLICY "Admin users can manage achievements" ON public.achievements
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.admin_users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Insert some sample data (optional)
INSERT INTO public.achievements (
    title,
    description,
    category,
    type,
    achiever_name,
    achiever_type,
    date_achieved,
    details,
    is_featured,
    status,
    sort_order
) VALUES 
(
    'Best Research Paper Award',
    'Awarded for outstanding research in English Literature and Linguistics at the International Conference on Modern Literature.',
    'faculty',
    'award',
    'Dr. Sarah Johnson',
    'faculty',
    '2024-11-15',
    '{"institution": "AIESR", "award_body": "International Literature Society", "rank": "1st", "amount": "$5000"}',
    true,
    'published',
    1
),
(
    'Dean''s List Achievement',
    'Recognized for exceptional academic performance with a GPA of 3.9/4.0 in English Studies program.',
    'student',
    'recognition',
    'Emma Williams',
    'student',
    '2024-12-01',
    '{"institution": "AIESR", "rank": "Top 5%"}',
    true,
    'published',
    2
),
(
    'Research Publication in Nature Communications',
    'Published groundbreaking research on computational linguistics in a top-tier international journal.',
    'faculty',
    'publication',
    'Prof. Michael Chen',
    'faculty',
    '2024-10-20',
    '{"publication_details": "Nature Communications, Vol 15, Article 8542", "impact": "High Impact Factor: 14.7"}',
    true,
    'published',
    3
),
(
    'Student Poetry Competition Winner',
    'First place in the National Inter-University Poetry Competition for contemporary English poetry.',
    'student',
    'award',
    'James Anderson',
    'student',
    '2024-09-30',
    '{"award_body": "National Poetry Society", "rank": "1st", "amount": "$2000"}',
    false,
    'published',
    4
),
(
    'International Research Collaboration',
    'Established successful research partnership with Oxford University for medieval literature studies.',
    'institutional',
    'collaboration',
    'AIESR Research Department',
    'department',
    '2024-08-15',
    '{"collaboration_partners": ["Oxford University", "Cambridge University"], "impact": "3-year joint research program"}',
    true,
    'published',
    5
);

-- Grant necessary permissions
GRANT ALL ON public.achievements TO authenticated;
GRANT SELECT ON public.achievements TO anon;
