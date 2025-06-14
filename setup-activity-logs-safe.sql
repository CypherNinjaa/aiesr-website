-- Safe Activity Logs Table Setup
-- This script can be run safely even if some parts already exist

-- 1. Create the table (safe with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50), -- 'event', 'category', 'setting', etc.
  resource_id UUID, -- ID of the affected resource
  details JSONB, -- Additional details about the action
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes (safe with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action ON admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_resource ON admin_activity_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

-- 3. Enable RLS (safe - does nothing if already enabled)
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 4. Drop and recreate policies (safe approach)
DROP POLICY IF EXISTS "Admin can view all activity logs" ON admin_activity_logs;
DROP POLICY IF EXISTS "Admin can insert activity logs" ON admin_activity_logs;

CREATE POLICY "Admin can view all activity logs" ON admin_activity_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin can insert activity logs" ON admin_activity_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ));

-- 5. Create or replace the logging function
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_action VARCHAR(100),
  p_resource_type VARCHAR(50) DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_activity_logs (
    admin_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Add sample activity logs (optional)
INSERT INTO admin_activity_logs (admin_id, action, details) 
SELECT 
  (SELECT id FROM admin_users LIMIT 1),
  'system_setup',
  jsonb_build_object('message', 'Activity logging system initialized')
WHERE NOT EXISTS (
  SELECT 1 FROM admin_activity_logs WHERE action = 'system_setup'
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Activity logs table setup completed successfully!';
END $$;
