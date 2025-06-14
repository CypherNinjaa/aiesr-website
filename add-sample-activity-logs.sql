-- Add sample activity logs for testing the Activity page functionality
-- Run this after setting up the admin_activity_logs table

-- Insert sample activity logs
INSERT INTO admin_activity_logs (admin_id, action, resource_type, resource_id, details) VALUES
  -- Event activities
  (NULL, 'created', 'event', gen_random_uuid(), '{"title": "Literary Festival 2025", "description": "Annual literary event"}'),
  (NULL, 'updated', 'event', gen_random_uuid(), '{"title": "Research Symposium", "changes": ["date", "venue"]}'),
  (NULL, 'published', 'event', gen_random_uuid(), '{"title": "Cultural Evening", "publish_date": "2025-06-14"}'),
  (NULL, 'deleted', 'event', gen_random_uuid(), '{"title": "Outdated Seminar", "reason": "cancelled"}'),
  (NULL, 'created', 'event', gen_random_uuid(), '{"title": "Workshop on Creative Writing", "category": "workshop"}'),
  
  -- Settings activities
  (NULL, 'updated', 'setting', NULL, '{"key": "site_name", "old_value": "Old Name", "new_value": "AIESR"}'),
  (NULL, 'updated', 'setting', NULL, '{"key": "contact_email", "old_value": "old@email.com", "new_value": "info@aiesr.edu"}'),
  (NULL, 'updated', 'setting', NULL, '{"key": "hero_texts", "action": "added", "value": "New hero text"}'),
  
  -- Category activities
  (NULL, 'created', 'category', gen_random_uuid(), '{"name": "Academic Events", "description": "University academic events"}'),
  (NULL, 'updated', 'category', gen_random_uuid(), '{"name": "Cultural Events", "changes": ["description"]}'),
  
  -- System activities
  (NULL, 'login', NULL, NULL, '{"ip_address": "192.168.1.1", "user_agent": "Mozilla/5.0"}'),
  (NULL, 'logout', NULL, NULL, '{"session_duration": "2h 15m"}'),
  (NULL, 'backup', NULL, NULL, '{"status": "success", "size": "1.2GB", "duration": "5m 32s"}'),
  (NULL, 'system_action', NULL, NULL, '{"action": "cache_clear", "reason": "manual"}'),
  (NULL, 'update', NULL, NULL, '{"component": "system", "version": "1.2.0", "previous_version": "1.1.9"}');

-- Insert activities with different timestamps to simulate real activity
UPDATE admin_activity_logs SET created_at = NOW() - INTERVAL '2 hours' WHERE action = 'created' AND resource_type = 'event';
UPDATE admin_activity_logs SET created_at = NOW() - INTERVAL '4 hours' WHERE action = 'updated' AND resource_type = 'event';
UPDATE admin_activity_logs SET created_at = NOW() - INTERVAL '6 hours' WHERE action = 'published';
UPDATE admin_activity_logs SET created_at = NOW() - INTERVAL '12 hours' WHERE action = 'backup';
UPDATE admin_activity_logs SET created_at = NOW() - INTERVAL '1 day' WHERE action = 'login';
UPDATE admin_activity_logs SET created_at = NOW() - INTERVAL '2 days' WHERE action = 'deleted';
UPDATE admin_activity_logs SET created_at = NOW() - INTERVAL '3 days' WHERE action = 'system_action';

-- Verify the sample data
SELECT 
  action, 
  resource_type, 
  details->>'title' as title,
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at))/3600 as hours_ago
FROM admin_activity_logs 
ORDER BY created_at DESC 
LIMIT 10;
