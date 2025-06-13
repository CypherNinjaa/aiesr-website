-- Migration to add registration link fields to events table
-- Run this in your Supabase SQL Editor

-- Add the missing registration link columns
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS registration_link TEXT,
ADD COLUMN IF NOT EXISTS custom_registration_link TEXT;

-- Add comments for clarity
COMMENT ON COLUMN events.registration_link IS 'Legacy registration URL field for backward compatibility';
COMMENT ON COLUMN events.custom_registration_link IS 'Custom registration URL for each event. Required when registration_required is true.';

-- Update existing events to use a default registration URL if they had registration enabled
-- This preserves existing functionality
UPDATE events 
SET custom_registration_link = 'https://www.amity.edu/nspg/CARNIVALESQUE2025/'
WHERE registration_required = true 
AND (custom_registration_link IS NULL OR custom_registration_link = '');

-- Index for better performance on registration queries
CREATE INDEX IF NOT EXISTS idx_events_registration_required ON events(registration_required);
CREATE INDEX IF NOT EXISTS idx_events_registration_deadline ON events(registration_deadline);
