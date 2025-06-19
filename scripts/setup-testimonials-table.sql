-- ============================================
-- AIESR Testimonials System Database Setup
-- ============================================

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    email TEXT,
    photo_url TEXT,
    story_text TEXT NOT NULL,
    graduation_year INTEGER,
    current_position TEXT,
    company TEXT,
    program TEXT CHECK (program IN ('BA English Literature', 'MA English Literature', 'PhD English Studies', 'Certificate Courses', 'Other')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_featured BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    sort_order INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON public.testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_program ON public.testimonials(program);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_graduation_year ON public.testimonials(graduation_year DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_submitted_at ON public.testimonials(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved_at ON public.testimonials(approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON public.testimonials(sort_order);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger to avoid conflicts
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_testimonials_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials (drop existing policies first to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON public.testimonials;

-- Public can read approved testimonials
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials
    FOR SELECT USING (status = 'approved');

-- Public can insert new testimonials (submissions)
CREATE POLICY "Anyone can submit testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (status = 'pending');

-- Authenticated users can view all testimonials (for admin)
CREATE POLICY "Authenticated users can view all testimonials" ON public.testimonials
    FOR SELECT TO authenticated USING (true);

-- Authenticated users can update testimonials (for admin approval)
CREATE POLICY "Authenticated users can update testimonials" ON public.testimonials
    FOR UPDATE TO authenticated USING (true);

-- Authenticated users can delete testimonials (for admin)
CREATE POLICY "Authenticated users can delete testimonials" ON public.testimonials
    FOR DELETE TO authenticated USING (true);

-- Insert some sample data for testing (only if not already exists)
INSERT INTO public.testimonials (
    student_name,
    email,
    story_text,
    graduation_year,
    current_position,
    company,
    program,
    status,
    is_featured,
    approved_at
) 
SELECT * FROM (VALUES 
    ('Sarah Johnson', 'sarah.j@example.com', 'The creative writing program at AIESR transformed my writing. I went from being a hobbyist to getting my first novel published within a year.', 2023, 'Published Author', 'HarperCollins Publishers', 'MA English Literature', 'approved', true, NOW()),
    ('Rahul Sharma', 'rahul.s@example.com', 'The literature courses opened my mind to new perspectives. Now I work as a content strategist for a major tech company, applying critical thinking skills I learned at AIESR.', 2022, 'Content Strategist', 'Google India', 'BA English Literature', 'approved', false, NOW()),
    ('Priya Patel', 'priya.p@example.com', 'AIESR gave me the confidence to pursue my PhD. The research methodology courses were exceptional, and the faculty support was unmatched.', 2021, 'PhD Researcher', 'Oxford University', 'MA English Literature', 'approved', true, NOW())
) AS sample_data(student_name, email, story_text, graduation_year, current_position, company, program, status, is_featured, approved_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.testimonials WHERE email IN ('sarah.j@example.com', 'rahul.s@example.com', 'priya.p@example.com')
);

-- Grant necessary permissions
GRANT ALL ON public.testimonials TO authenticated;
GRANT SELECT, INSERT ON public.testimonials TO anon;
