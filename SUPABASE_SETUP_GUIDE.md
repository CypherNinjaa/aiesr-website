# AIESR Supabase Integration Setup Guide

## 🚀 Complete Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Sign in to your account
3. Click "New Project"
4. Fill in project details:
   - **Name**: AIESR Events Management
   - **Database password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### Step 2: Get Your Supabase Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon key** (public key)
   - **Service role key** (secret key - keep this secure!)

### Step 3: Update Environment Variables

Update your `.env.local` file with your actual Supabase credentials:

```env
# Replace these with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# External Registration URL (already configured)
NEXT_PUBLIC_REGISTRATION_URL=https://www.amity.edu/nspg/CARNIVALESQUE2025/
```

### Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `database-schema.sql` file in your project root
3. Paste it in the SQL Editor
4. Click **Run** to execute the schema

This will create:

- ✅ Events table
- ✅ Event categories table
- ✅ Admin users table
- ✅ Event analytics table
- ✅ All necessary indexes and triggers
- ✅ Row Level Security policies
- ✅ Sample categories

### Step 5: Create Your First Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - **Email**: your-admin-email@domain.com
   - **Password**: Create a strong password
   - **Email confirm**: ✅ (checked)
4. Click **Create user**
5. Copy the **User UID** from the user details

6. Go back to **SQL Editor** and run this query (replace the values):

```sql
INSERT INTO admin_users (id, email, name, role) VALUES
('your-user-uid-here', 'your-admin-email@domain.com', 'Your Name', 'super_admin');
```

### Step 6: Configure Storage (Optional - for image uploads)

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `event-images`
3. Set it to **public** if you want direct image access
4. Update bucket policies for file uploads

### Step 7: Test the Integration

1. Start your development server:

```bash
npm run dev
```

2. Visit `http://localhost:3000/admin`
3. Sign in with your admin credentials
4. Try creating a test event

### Step 8: Import Existing Events (Optional)

If you want to migrate your existing events from the JSON file:

1. Go to **SQL Editor** in Supabase
2. Run this script to import your current events:

```sql
-- You'll need to manually convert your JSON events to INSERT statements
-- Example format:
INSERT INTO events (
    title, description, short_description, date, end_date, location, type,
    featured, capacity, speakers, registration_required, status, created_by
) VALUES
(
    'Annual Literary Festival 2025',
    'Join us for our grand annual literary festival...',
    'Three-day festival with renowned authors...',
    '2025-07-15 09:00:00+00',
    '2025-07-17 18:00:00+00',
    'AIESR Main Auditorium',
    'cultural',
    true,
    500,
    '{"Dr. Amitav Ghosh", "Prof. Mahasweta Sengupta", "Arundhati Roy"}',
    true,
    'published',
    'your-admin-user-id'
);
```

## 🎯 Features You Now Have

### For Website Visitors:

- ✅ **Real-time event updates** - No page refresh needed
- ✅ **Dynamic filtering** by type, date, status
- ✅ **Featured events** highlighting
- ✅ **Registration integration** with your external URL
- ✅ **Responsive design** for all devices
- ✅ **Fast loading** with optimized queries

### For Admin:

- ✅ **Complete event management** - Create, edit, delete events
- ✅ **Rich content editing** - Full control over all event details
- ✅ **Category management** - Dynamic event categories
- ✅ **Status control** - Draft, Published, Cancelled, Completed
- ✅ **Featured events** - Highlight important events
- ✅ **Image management** - Upload and manage event images
- ✅ **Analytics tracking** - View counts and registration clicks
- ✅ **User management** - Admin and Super Admin roles
- ✅ **Responsive admin panel** - Works on mobile/tablet

### Admin Panel URLs:

- **Dashboard**: `/admin`
- **Events Management**: `/admin/events`
- **Create Event**: `/admin/events/new`
- **Edit Event**: `/admin/events/[id]`
- **Categories**: `/admin/categories`
- **Analytics**: `/admin/analytics`
- **Settings**: `/admin/settings`

## 🔒 Security Features

- **Row Level Security (RLS)** - Users can only see published events
- **Admin Authentication** - Only verified admin users can manage content
- **Role-based Access** - Admin vs Super Admin permissions
- **Secure API keys** - Service role key for admin operations only
- **HTTPS by default** - All communications encrypted

## 📱 Mobile Support

- **Responsive admin panel** - Manage events from mobile/tablet
- **Touch-friendly interface** - Optimized for mobile usage
- **Fast mobile loading** - Optimized queries and caching

## 🚀 Performance Optimizations

- **Database indexing** - Fast event queries
- **Query optimization** - Minimal data fetching
- **Real-time subscriptions** - Instant updates
- **Caching strategy** - Reduced server load

## 🆘 Troubleshooting

### If events don't load:

1. Check your Supabase credentials in `.env.local`
2. Verify database schema was created successfully
3. Check browser console for errors

### If admin login fails:

1. Verify admin user was created in `admin_users` table
2. Check email/password combination
3. Ensure user has correct role ('admin' or 'super_admin')

### If registration button doesn't work:

1. Check `NEXT_PUBLIC_REGISTRATION_URL` in `.env.local`
2. Verify the external registration URL is accessible

## 📞 Need Help?

The system is now fully flexible and you can:

- ✅ Add/Edit/Delete any event content
- ✅ Manage categories dynamically
- ✅ Control event status and visibility
- ✅ Track analytics and engagement
- ✅ Handle multiple admin users
- ✅ Integration with your registration system

All events will automatically link to your registration URL: `https://www.amity.edu/nspg/CARNIVALESQUE2025/`
