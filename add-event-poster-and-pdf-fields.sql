-- Migration: Add poster and PDF brochure support to events table
-- File: add-event-poster-and-pdf-fields.sql

-- Add new columns to the events table for enhanced visual content
ALTER TABLE events ADD COLUMN IF NOT EXISTS poster_image TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pdf_brochure TEXT;

-- Add comments for documentation
COMMENT ON COLUMN events.poster_image IS 'URL to the main event poster image for hero display';
COMMENT ON COLUMN events.pdf_brochure IS 'URL to downloadable PDF brochure for the event';

-- Update RLS policies if needed (assuming they inherit from existing image column policies)
-- The existing RLS policies should cover these new columns since they follow the same access patterns

-- Sample data update (optional - for testing)
-- UPDATE events 
-- SET poster_image = 'https://example.com/posters/event-poster.jpg',
--     pdf_brochure = 'https://example.com/brochures/event-brochure.pdf'
-- WHERE id = 'sample-event-id';
