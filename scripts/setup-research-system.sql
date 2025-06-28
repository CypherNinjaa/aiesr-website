-- =============================================
-- AIESR Research Management System Setup
-- =============================================
-- This script sets up the complete research papers system
-- Execute this in your Supabase SQL editor

-- 1. Create authors table (reusable across papers)
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    affiliation VARCHAR(255),
    orcid_id VARCHAR(19), -- Standard ORCID format: 0000-0000-0000-0000
    bio TEXT,
    website_url TEXT,
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    CONSTRAINT authors_name_check CHECK (length(name) >= 1),
    CONSTRAINT authors_status_check CHECK (status IN ('active', 'inactive')),
    CONSTRAINT authors_orcid_format CHECK (orcid_id IS NULL OR orcid_id ~ '^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$')
);

-- 2. Create journals table (reusable across papers)
CREATE TABLE IF NOT EXISTS public.journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    impact_factor DECIMAL(6,3),
    issn VARCHAR(9), -- Format: 1234-5678
    website_url TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    CONSTRAINT journals_name_check CHECK (length(name) >= 1),
    CONSTRAINT journals_status_check CHECK (status IN ('active', 'inactive')),
    CONSTRAINT journals_issn_format CHECK (issn IS NULL OR issn ~ '^[0-9]{4}-[0-9]{3}[0-9X]$')
);

-- 3. Create research categories table
CREATE TABLE IF NOT EXISTS public.research_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    CONSTRAINT categories_name_check CHECK (length(name) >= 1),
    CONSTRAINT categories_status_check CHECK (status IN ('active', 'inactive')),
    CONSTRAINT categories_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

-- 4. Create research papers table
CREATE TABLE IF NOT EXISTS public.research_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    abstract TEXT,
    publication_date DATE,
    doi VARCHAR(255), -- Digital Object Identifier
    journal_id UUID REFERENCES public.journals(id),
    volume VARCHAR(50),
    issue VARCHAR(50),
    pages VARCHAR(50), -- e.g., "123-145" or "e123456"
    pdf_url TEXT,
    external_url TEXT, -- Link to publisher's page
    status VARCHAR(20) DEFAULT 'draft', -- draft, in-review, published, rejected
    citation_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    keywords TEXT[], -- Array of keywords
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    
    -- Constraints
    CONSTRAINT papers_title_check CHECK (length(title) >= 1),
    CONSTRAINT papers_status_check CHECK (status IN ('draft', 'in-review', 'published', 'rejected')),
    CONSTRAINT papers_citation_count_check CHECK (citation_count >= 0),
    UNIQUE(doi) -- DOI should be unique if provided
);

-- 5. Create paper_authors junction table (many-to-many with ordering)
CREATE TABLE IF NOT EXISTS public.paper_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.authors(id) ON DELETE CASCADE,
    author_order INTEGER NOT NULL DEFAULT 1, -- 1 = first author, 2 = second author, etc.
    is_corresponding BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    UNIQUE(paper_id, author_id), -- Prevent duplicate author assignments
    UNIQUE(paper_id, author_order), -- Prevent duplicate order positions
    CONSTRAINT paper_authors_order_check CHECK (author_order > 0)
);

-- 6. Create paper_categories junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.paper_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.research_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    UNIQUE(paper_id, category_id) -- Prevent duplicate category assignments
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_authors_name ON public.authors(name);
CREATE INDEX IF NOT EXISTS idx_authors_email ON public.authors(email);
CREATE INDEX IF NOT EXISTS idx_authors_orcid ON public.authors(orcid_id);

CREATE INDEX IF NOT EXISTS idx_journals_name ON public.journals(name);
CREATE INDEX IF NOT EXISTS idx_journals_issn ON public.journals(issn);
CREATE INDEX IF NOT EXISTS idx_journals_impact_factor ON public.journals(impact_factor DESC);

CREATE INDEX IF NOT EXISTS idx_papers_title ON public.research_papers USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_papers_abstract ON public.research_papers USING gin(to_tsvector('english', abstract));
CREATE INDEX IF NOT EXISTS idx_papers_status ON public.research_papers(status);
CREATE INDEX IF NOT EXISTS idx_papers_publication_date ON public.research_papers(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_papers_doi ON public.research_papers(doi);
CREATE INDEX IF NOT EXISTS idx_papers_keywords ON public.research_papers USING gin(keywords);

CREATE INDEX IF NOT EXISTS idx_paper_authors_paper_id ON public.paper_authors(paper_id);
CREATE INDEX IF NOT EXISTS idx_paper_authors_author_id ON public.paper_authors(author_id);
CREATE INDEX IF NOT EXISTS idx_paper_authors_order ON public.paper_authors(paper_id, author_order);

CREATE INDEX IF NOT EXISTS idx_paper_categories_paper_id ON public.paper_categories(paper_id);
CREATE INDEX IF NOT EXISTS idx_paper_categories_category_id ON public.paper_categories(category_id);

-- 8. Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create triggers for updated_at
DROP TRIGGER IF EXISTS set_authors_updated_at ON public.authors;
CREATE TRIGGER set_authors_updated_at
    BEFORE UPDATE ON public.authors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_journals_updated_at ON public.journals;
CREATE TRIGGER set_journals_updated_at
    BEFORE UPDATE ON public.journals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_research_categories_updated_at ON public.research_categories;
CREATE TRIGGER set_research_categories_updated_at
    BEFORE UPDATE ON public.research_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_research_papers_updated_at ON public.research_papers;
CREATE TRIGGER set_research_papers_updated_at
    BEFORE UPDATE ON public.research_papers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_categories ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies

-- Authors policies
CREATE POLICY "Allow public read access to active authors" ON public.authors
    FOR SELECT
    USING (status = 'active');

CREATE POLICY "Allow authenticated read access to authors" ON public.authors
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated full access to authors" ON public.authors
    FOR ALL
    TO authenticated
    USING (true);

-- Journals policies
CREATE POLICY "Allow public read access to active journals" ON public.journals
    FOR SELECT
    USING (status = 'active');

CREATE POLICY "Allow authenticated full access to journals" ON public.journals
    FOR ALL
    TO authenticated
    USING (true);

-- Research categories policies
CREATE POLICY "Allow public read access to active categories" ON public.research_categories
    FOR SELECT
    USING (status = 'active');

CREATE POLICY "Allow authenticated full access to categories" ON public.research_categories
    FOR ALL
    TO authenticated
    USING (true);

-- Research papers policies
CREATE POLICY "Allow public read access to published papers" ON public.research_papers
    FOR SELECT
    USING (status = 'published');

CREATE POLICY "Allow authenticated full access to papers" ON public.research_papers
    FOR ALL
    TO authenticated
    USING (true);

-- Paper authors policies
CREATE POLICY "Allow public read access to paper authors" ON public.paper_authors
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.research_papers 
            WHERE research_papers.id = paper_authors.paper_id 
            AND research_papers.status = 'published'
        )
    );

CREATE POLICY "Allow authenticated full access to paper authors" ON public.paper_authors
    FOR ALL
    TO authenticated
    USING (true);

-- Paper categories policies
CREATE POLICY "Allow public read access to paper categories" ON public.paper_categories
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.research_papers 
            WHERE research_papers.id = paper_categories.paper_id 
            AND research_papers.status = 'published'
        )
    );

CREATE POLICY "Allow authenticated full access to paper categories" ON public.paper_categories
    FOR ALL
    TO authenticated
    USING (true);

-- 12. Insert sample data
INSERT INTO public.research_categories (name, description, color) VALUES
('Artificial Intelligence', 'AI and machine learning research', '#3B82F6'),
('Natural Language Processing', 'NLP and computational linguistics', '#10B981'),
('Educational Technology', 'Technology in education and learning', '#F59E0B'),
('Digital Humanities', 'Intersection of technology and humanities', '#8B5CF6'),
('Cognitive Science', 'Study of mind and intelligence', '#EF4444'),
('Computational Linguistics', 'Computer processing of human language', '#06B6D4')
ON CONFLICT (name) DO NOTHING;

-- Sample authors
INSERT INTO public.authors (name, email, affiliation, orcid_id) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@aiesr.edu', 'AIESR - AI Research Lab', '0000-0002-1825-0097'),
('Prof. Michael Chen', 'michael.chen@aiesr.edu', 'AIESR - Computational Linguistics', '0000-0003-2156-5432'),
('Dr. Emily Rodriguez', 'emily.rodriguez@aiesr.edu', 'AIESR - Digital Humanities', '0000-0001-9876-5432')
ON CONFLICT DO NOTHING;

-- Sample journals
INSERT INTO public.journals (name, publisher, impact_factor, issn) VALUES
('Nature Machine Intelligence', 'Nature Publishing Group', 25.898, '2522-5839'),
('Computational Linguistics', 'MIT Press', 3.474, '0891-2017'),
('Educational Technology Research', 'Springer', 2.156, '1042-1629'),
('Digital Scholarship in the Humanities', 'Oxford University Press', 1.045, '2055-7671')
ON CONFLICT DO NOTHING;

-- Done! Research management system is now ready.
