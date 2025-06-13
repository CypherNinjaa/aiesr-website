-- AIESR Events Management Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create events table
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('academic', 'cultural', 'research', 'workshop')) NOT NULL,
    image_url TEXT,
    registration_required BOOLEAN DEFAULT true,
    registration_deadline TIMESTAMPTZ,
    featured BOOLEAN DEFAULT false,
    capacity INTEGER,
    speakers TEXT[] DEFAULT '{}',
    schedule JSONB,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID NOT NULL
);

-- Create event categories table
CREATE TABLE event_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) NOT NULL, -- Hex color code
    icon VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY, -- This will be the auth.users.id
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'super_admin')) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Create event analytics table (optional)
CREATE TABLE event_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    registration_clicks INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_featured ON events(featured);
CREATE INDEX idx_events_created_at ON events(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default event categories
INSERT INTO event_categories (name, description, color, icon) VALUES
('Academic', 'Academic conferences, seminars, and scholarly events', '#3B82F6', '🎓'),
('Cultural', 'Cultural festivals, performances, and celebrations', '#8B5CF6', '🎭'),
('Research', 'Research presentations, symposiums, and exhibitions', '#10B981', '🔬'),
('Workshop', 'Hands-on workshops, training sessions, and skill development', '#F59E0B', '🛠️');

-- Row Level Security (RLS) Policies

-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read published events
CREATE POLICY "Everyone can read published events" ON events
    FOR SELECT USING (status = 'published');

-- Policy: Only admins can insert events
CREATE POLICY "Only admins can insert events" ON events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Policy: Only admins can update events
CREATE POLICY "Only admins can update events" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Policy: Only admins can delete events
CREATE POLICY "Only admins can delete events" ON events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read their own data
CREATE POLICY "Admins can read their own data" ON admin_users
    FOR SELECT USING (id = auth.uid());

-- Policy: Super admins can read all admin data
CREATE POLICY "Super admins can read all admin data" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Enable RLS on event_categories table
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read categories
CREATE POLICY "Everyone can read categories" ON event_categories
    FOR SELECT USING (true);

-- Policy: Only admins can manage categories
CREATE POLICY "Only admins can manage categories" ON event_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Enable RLS on event_analytics table
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read analytics for published events
CREATE POLICY "Everyone can read analytics" ON event_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE id = event_id AND status = 'published'
        )
    );

-- Policy: Only admins can manage analytics
CREATE POLICY "Only admins can manage analytics" ON event_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Create function to automatically create analytics entry for new events
CREATE OR REPLACE FUNCTION create_event_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO event_analytics (event_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to create analytics for new events
CREATE TRIGGER create_event_analytics_trigger
    AFTER INSERT ON events
    FOR EACH ROW
    EXECUTE FUNCTION create_event_analytics();

-- Sample data insertion (you can modify or remove this)
-- First, you need to create your admin user in auth.users, then add them to admin_users
-- INSERT INTO admin_users (id, email, name, role) VALUES 
-- ('your-auth-user-id', 'admin@aiesr.edu', 'Admin User', 'super_admin');

-- Sample events (optional - you can remove this section)
-- INSERT INTO events (
--     title, description, short_description, date, end_date, location, type, 
--     featured, capacity, speakers, registration_required, status, created_by
-- ) VALUES 
-- (
--     'Annual Literary Festival 2025',
--     'Join us for our grand annual literary festival featuring renowned authors, poets, and scholars from across the country. This three-day event will include panel discussions, poetry readings, book launches, and interactive workshops on creative writing and literary criticism.',
--     'Three-day festival with renowned authors and interactive workshops',
--     '2025-07-15 09:00:00+00',
--     '2025-07-17 18:00:00+00',
--     'AIESR Main Auditorium',
--     'cultural',
--     true,
--     500,
--     '{"Dr. Amitav Ghosh", "Prof. Mahasweta Sengupta", "Arundhati Roy"}',
--     true,
--     'published',
--     'your-admin-user-id'
-- );

-- Create a view for easy event querying with analytics
CREATE VIEW events_with_analytics AS
SELECT 
    e.*,
    COALESCE(a.views, 0) as views,
    COALESCE(a.registration_clicks, 0) as registration_clicks
FROM events e
LEFT JOIN event_analytics a ON e.id = a.event_id;

-- Grant access to the service role (for admin operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant read access to authenticated users
GRANT SELECT ON events TO authenticated;
GRANT SELECT ON event_categories TO authenticated;
GRANT SELECT ON event_analytics TO authenticated;

COMMENT ON TABLE events IS 'Main events table storing all event information';
COMMENT ON TABLE event_categories IS 'Event categories for organization and filtering';
COMMENT ON TABLE admin_users IS 'Admin users with access to event management';
COMMENT ON TABLE event_analytics IS 'Analytics data for events (views, clicks, etc.)';
