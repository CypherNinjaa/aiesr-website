-- View existing events and their status
-- Use this to check which events are draft vs published
-- DO NOT automatically change draft events to published

-- Check all events and their status
SELECT id, title, status, created_at, updated_at
FROM events 
ORDER BY created_at DESC;

-- To manually publish a specific event, use:
-- UPDATE events SET status = 'published' WHERE id = 'your-event-id-here';

-- To see only draft events:
-- SELECT id, title, status FROM events WHERE status = 'draft';

-- To see only published events (what appears on website):
-- SELECT id, title, status FROM events WHERE status = 'published';
