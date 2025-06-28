-- =============================================
-- AIESR Event Sponsors System Setup
-- =============================================
-- This script sets up the complete sponsors system for events
-- Execute this in your Supabase SQL editor

-- 1. Create sponsors table for reusable sponsor data
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    tier VARCHAR(50) DEFAULT 'bronze', -- platinum, gold, silver, bronze
    status VARCHAR(20) DEFAULT 'active', -- active, inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    
    -- Constraints
    CONSTRAINT sponsors_name_check CHECK (length(name) >= 1),
    CONSTRAINT sponsors_status_check CHECK (status IN ('active', 'inactive')),
    CONSTRAINT sponsors_tier_check CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze', 'partner'))
);

-- 2. Create event_sponsors junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.event_sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    sponsor_tier VARCHAR(50) DEFAULT 'bronze', -- Can override sponsor's default tier for this event
    is_featured BOOLEAN DEFAULT false,
    custom_description TEXT, -- Event-specific sponsor description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    UNIQUE(event_id, sponsor_id), -- Prevent duplicate sponsors per event
    CONSTRAINT event_sponsors_display_order_check CHECK (display_order >= 0),
    CONSTRAINT event_sponsors_tier_check CHECK (sponsor_tier IN ('platinum', 'gold', 'silver', 'bronze', 'partner'))
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sponsors_status ON public.sponsors(status);
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON public.sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_name ON public.sponsors(name);
CREATE INDEX IF NOT EXISTS idx_event_sponsors_event_id ON public.event_sponsors(event_id);
CREATE INDEX IF NOT EXISTS idx_event_sponsors_sponsor_id ON public.event_sponsors(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_event_sponsors_display_order ON public.event_sponsors(event_id, display_order);

-- 4. Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create triggers for updated_at
DROP TRIGGER IF EXISTS set_sponsors_updated_at ON public.sponsors;
CREATE TRIGGER set_sponsors_updated_at
    BEFORE UPDATE ON public.sponsors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_event_sponsors_updated_at ON public.event_sponsors;
CREATE TRIGGER set_event_sponsors_updated_at
    BEFORE UPDATE ON public.event_sponsors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for sponsors table
-- Allow everyone to read active sponsors
CREATE POLICY "Allow public read access to active sponsors" ON public.sponsors
    FOR SELECT
    USING (status = 'active');

-- Allow authenticated users to read all sponsors
CREATE POLICY "Allow authenticated read access to sponsors" ON public.sponsors
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow admin users to manage sponsors
CREATE POLICY "Allow admin full access to sponsors" ON public.sponsors
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.raw_user_meta_data->>'isAdmin' = 'true')
        )
    );

-- 8. Create RLS policies for event_sponsors table
-- Allow everyone to read event sponsors for published events
CREATE POLICY "Allow public read access to event sponsors" ON public.event_sponsors
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = event_sponsors.event_id 
            AND events.status = 'published'
        )
    );

-- Allow authenticated users to read all event sponsors
CREATE POLICY "Allow authenticated read access to event sponsors" ON public.event_sponsors
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow admin users to manage event sponsors
CREATE POLICY "Allow admin full access to event sponsors" ON public.event_sponsors
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.raw_user_meta_data->>'isAdmin' = 'true')
        )
    );

-- 9. Create Supabase Storage bucket for sponsor logos (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'sponsor-logos',
    'sponsor-logos',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- 10. Create storage policies for sponsor logos
CREATE POLICY "Allow public read access to sponsor logos" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'sponsor-logos');

CREATE POLICY "Allow admin upload access to sponsor logos" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'sponsor-logos' 
        AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.raw_user_meta_data->>'isAdmin' = 'true')
        )
    );

CREATE POLICY "Allow admin delete access to sponsor logos" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'sponsor-logos' 
        AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.raw_user_meta_data->>'isAdmin' = 'true')
        )
    );

-- 11. Insert sample sponsor data for testing
INSERT INTO public.sponsors (name, logo_url, website_url, description, tier, status) VALUES
('Tech Corp', 'https://via.placeholder.com/200x100/0066CC/FFFFFF?text=Tech+Corp', 'https://techcorp.com', 'Leading technology solutions provider', 'platinum', 'active'),
('EduSoft Solutions', 'https://via.placeholder.com/200x100/00AA44/FFFFFF?text=EduSoft', 'https://edusoft.com', 'Educational software and platforms', 'gold', 'active'),
('Academic Publishers', 'https://via.placeholder.com/200x100/FF6600/FFFFFF?text=Academic+Pub', 'https://academicpub.com', 'Academic books and research publications', 'silver', 'active'),
('Local Business Chamber', 'https://via.placeholder.com/200x100/8B00FF/FFFFFF?text=Business+Chamber', 'https://chamber.com', 'Supporting local business community', 'bronze', 'active')
ON CONFLICT DO NOTHING;

-- 12. Create helpful views for easier querying
CREATE OR REPLACE VIEW public.event_sponsors_detailed AS
SELECT 
    es.id as event_sponsor_id,
    es.event_id,
    es.display_order,
    es.sponsor_tier as event_sponsor_tier,
    es.is_featured,
    es.custom_description,
    s.id as sponsor_id,
    s.name as sponsor_name,
    s.logo_url,
    s.website_url,
    s.description as sponsor_description,
    s.tier as default_tier,
    s.contact_email,
    s.contact_phone,
    e.title as event_title,
    e.status as event_status
FROM public.event_sponsors es
JOIN public.sponsors s ON es.sponsor_id = s.id
JOIN public.events e ON es.event_id = e.id
ORDER BY es.event_id, es.display_order;

-- Grant permissions on the view
GRANT SELECT ON public.event_sponsors_detailed TO authenticated, anon;

-- 13. Create function to get sponsors for an event (ordered)
CREATE OR REPLACE FUNCTION public.get_event_sponsors(p_event_id UUID)
RETURNS TABLE (
    sponsor_id UUID,
    sponsor_name VARCHAR,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    tier VARCHAR,
    display_order INTEGER,
    is_featured BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.logo_url,
        s.website_url,
        COALESCE(es.custom_description, s.description) as description,
        es.sponsor_tier,
        es.display_order,
        es.is_featured
    FROM public.event_sponsors es
    JOIN public.sponsors s ON es.sponsor_id = s.id
    WHERE es.event_id = p_event_id
    ORDER BY es.display_order ASC, s.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_event_sponsors(UUID) TO authenticated, anon;

-- =============================================
-- Setup Complete!
-- =============================================
-- The sponsors system is now ready to use.
-- 
-- Key Features:
-- 1. Reusable sponsors library
-- 2. Many-to-many relationship with events
-- 3. Sponsor tiers and ordering
-- 4. Secure file storage for logos
-- 5. RLS policies for security
-- 6. Helper views and functions
-- 
-- Next steps:
-- 1. Update the Event type in TypeScript
-- 2. Create sponsor service layer
-- 3. Add sponsor management to EventForm
-- 4. Create sponsor display components
-- =============================================
