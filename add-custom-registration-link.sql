-- Add custom registration link column to events table
-- This will replace the reliance on .env fallback

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS custom_registration_link TEXT;

-- Update existing events to use the default registration URL if they had registration enabled
-- This is a one-time migration to preserve existing functionality
UPDATE events 
SET custom_registration_link = 'https://www.amity.edu/nspg/CARNIVALESQUE2025/'
WHERE registration_required = true 
AND (custom_registration_link IS NULL OR custom_registration_link = '');

-- Add a comment for future reference
COMMENT ON COLUMN events.custom_registration_link IS 'Custom registration URL for each event. Required when registration_required is true.';
