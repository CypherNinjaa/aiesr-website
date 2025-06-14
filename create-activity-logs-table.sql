-- Create admin activity logs table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action ON admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_resource ON admin_activity_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create function to automatically log admin actions
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

-- Create triggers for automatic logging
CREATE OR REPLACE FUNCTION trigger_log_event_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_admin_activity(
      'event_created',
      'event',
      NEW.id,
      jsonb_build_object('title', NEW.title, 'date', NEW.event_date)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_admin_activity(
      'event_updated',
      'event',
      NEW.id,
      jsonb_build_object('title', NEW.title, 'changes', jsonb_build_object(
        'title_changed', OLD.title != NEW.title,
        'date_changed', OLD.event_date != NEW.event_date,
        'status_changed', OLD.status != NEW.status
      ))
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_admin_activity(
      'event_deleted',
      'event',
      OLD.id,
      jsonb_build_object('title', OLD.title)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_events_activity_log ON events;
CREATE TRIGGER trigger_events_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON events
  FOR EACH ROW
  EXECUTE FUNCTION trigger_log_event_changes();

-- Similar triggers can be added for other tables (categories, settings, etc.)
CREATE OR REPLACE FUNCTION trigger_log_category_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_admin_activity(
      'category_created',
      'category',
      NEW.id,
      jsonb_build_object('name', NEW.name)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_admin_activity(
      'category_updated',
      'category',
      NEW.id,
      jsonb_build_object('name', NEW.name, 'old_name', OLD.name)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_admin_activity(
      'category_deleted',
      'category',
      OLD.id,
      jsonb_build_object('name', OLD.name)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_categories_activity_log ON categories;
CREATE TRIGGER trigger_categories_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION trigger_log_category_changes();

-- Insert some sample activity logs
INSERT INTO admin_activity_logs (admin_id, action, details) VALUES
  ((SELECT id FROM admin_users LIMIT 1), 'admin_login', jsonb_build_object('timestamp', NOW())),
  ((SELECT id FROM admin_users LIMIT 1), 'settings_updated', jsonb_build_object('setting', 'site_name')),
  ((SELECT id FROM admin_users LIMIT 1), 'system_status_checked', jsonb_build_object('all_services', 'healthy'));
