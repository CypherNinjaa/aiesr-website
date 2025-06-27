-- ============================================
-- HOMEPAGE GALLERY SLIDER - Database Setup
-- Professional gallery system for university homepage
-- ============================================

-- Create the gallery_slides table
CREATE TABLE gallery_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  image_alt VARCHAR(255),
  link_url TEXT,
  link_text VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_gallery_slides_active_order ON gallery_slides (is_active, sort_order);
CREATE INDEX idx_gallery_slides_created_at ON gallery_slides (created_at);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_slides_updated_at 
    BEFORE UPDATE ON gallery_slides 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO gallery_slides (title, subtitle, description, image_url, image_alt, link_url, link_text, sort_order, is_active) VALUES
(
  'Welcome to AIESR University',
  'Excellence in Education Since 1990',
  'Discover world-class education, cutting-edge research, and a vibrant campus community that prepares students for global success.',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop',
  'AIESR University Campus Aerial View',
  '/about',
  'Learn More',
  1,
  true
),
(
  'State-of-the-Art Facilities',
  'Modern Learning Environments',
  'Our campus features advanced laboratories, digital classrooms, and collaborative spaces designed to enhance your learning experience.',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=1080&fit=crop',
  'Modern University Laboratory',
  '/facilities',
  'Explore Facilities',
  2,
  true
),
(
  'Global Research Excellence',
  'Pioneering Innovation',
  'Join our research community and contribute to groundbreaking discoveries that shape the future of technology and society.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
  'Research Laboratory Scientists',
  '/research',
  'View Research',
  3,
  true
),
(
  'Vibrant Student Life',
  'Community & Growth',
  'Experience a rich campus life with diverse clubs, sports, cultural events, and opportunities for personal and professional development.',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop',
  'Students in Campus Courtyard',
  '/student-life',
  'Student Experience',
  4,
  true
);

-- Row Level Security (RLS) policies
ALTER TABLE gallery_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active slides
CREATE POLICY "Gallery slides are viewable by everyone" 
ON gallery_slides FOR SELECT 
USING (is_active = true);

-- Allow authenticated users to manage slides (for admin)
CREATE POLICY "Gallery slides are manageable by authenticated users" 
ON gallery_slides FOR ALL 
USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON gallery_slides TO anon;
GRANT ALL ON gallery_slides TO authenticated;

-- Optional: Create a view for public access that only shows active slides
CREATE VIEW public_gallery_slides AS
SELECT 
  id,
  title,
  subtitle,
  description,
  image_url,
  image_alt,
  link_url,
  link_text,
  sort_order,
  created_at
FROM gallery_slides 
WHERE is_active = true 
ORDER BY sort_order ASC, created_at ASC;

-- Grant access to the view
GRANT SELECT ON public_gallery_slides TO anon;
GRANT SELECT ON public_gallery_slides TO authenticated;
