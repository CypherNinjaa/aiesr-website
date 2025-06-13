# 🚀 Final Setup Steps - AIESR Supabase Integration

## ✅ **Status: Almost Complete!**

Your Supabase credentials are configured and the development server is running at `http://localhost:3000`. Now let's complete the final setup steps.

---

## 📋 **Step-by-Step Setup (5 minutes)**

### **Step 1: Set Up Database Schema** ⏱️ 2 minutes

1. **Open Supabase Dashboard**:

   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Navigate to your project: `rjbvufpkbyceygiobdus`

2. **Run Database Schema**:

   - Click **SQL Editor** in the left sidebar
   - Click **New Query**
   - Copy the entire content from `database-schema.sql` in your project
   - Paste it in the SQL Editor
   - Click **Run** (bottom right)

   ✅ This creates all tables, security policies, and sample categories.

### **Step 2: Create Your First Admin User** ⏱️ 2 minutes

1. **Create Auth User**:

   - Go to **Authentication** → **Users** in Supabase
   - Click **Add user**
   - Fill in:
     - **Email**: `admin@aiesr.edu` (or your preferred admin email)
     - **Password**: Create a strong password
     - **Email confirm**: ✅ Check this box
   - Click **Create user**

2. **Copy User ID**:

   - After creation, click on the user in the list
   - **Copy the User UID** (something like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

3. **Add to Admin Table**:
   - Go back to **SQL Editor**
   - Run this query (replace the ID and email):
   ```sql
   INSERT INTO admin_users (id, email, name, role) VALUES
   ('your-copied-user-id-here', 'admin@aiesr.edu', 'Admin User', 'super_admin');
   ```

### **Step 3: Test the Integration** ⏱️ 1 minute

1. **Test Homepage**:

   - Visit `http://localhost:3000`
   - Check if the events section loads (might be empty initially)

2. **Test Admin Panel**:

   - Visit `http://localhost:3000/admin`
   - Sign in with your admin credentials
   - You should see the admin dashboard

3. **Create Your First Event**:
   - Click **"Add New Event"**
   - Fill in basic details:
     - **Title**: "Test Event"
     - **Type**: Academic
     - **Date**: Any future date
     - **Location**: "AIESR Main Campus"
     - **Status**: Published
   - Click **"Create Event"**

---

## 🎯 **Quick Verification Checklist**

After setup, verify these work:

- ✅ **Homepage loads** without errors
- ✅ **Events section displays** (empty or with your test event)
- ✅ **Admin login works** at `/admin`
- ✅ **Can create events** through admin panel
- ✅ **Events appear on homepage** immediately after creation
- ✅ **Registration button** opens your external form

---

## 🔧 **Troubleshooting**

### **If events don't load on homepage:**

1. Check browser console for errors
2. Verify database schema was created successfully
3. Ensure at least one event has `status = 'published'`

### **If admin login fails:**

1. Verify user exists in Supabase Auth
2. Check that user was added to `admin_users` table
3. Try signing in with exact email/password

### **If registration button doesn't work:**

- It should open: `https://www.amity.edu/nspg/CARNIVALESQUE2025/`
- Check browser's popup blocker

---

## 📱 **Admin Panel Guide**

Once logged in, you can:

### **Dashboard** (`/admin`)

- Overview of all features
- Quick actions and statistics

### **Events Management** (`/admin/events`)

- **View all events** with filtering
- **Create new events** with full details
- **Edit existing events**
- **Delete events** with confirmation
- **Change status** (Draft → Published → Completed)

### **Event Creation** (`/admin/events/new`)

Complete form with:

- ✅ **Basic info** (title, type, dates, location)
- ✅ **Descriptions** (short and full)
- ✅ **Advanced settings** (capacity, featured, speakers)
- ✅ **Content management** (images, schedule, tags)
- ✅ **Status control** (draft/published/cancelled/completed)

---

## 🎉 **You're All Set!**

After completing these steps, you'll have:

- **Dynamic events system** replacing static JSON
- **Real-time updates** across all users
- **Professional admin interface** for content management
- **Integrated registration** with your external form
- **Mobile-responsive design** for all devices
- **Analytics tracking** for event engagement

### **Key URLs:**

- **Website**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`
- **Events Management**: `http://localhost:3000/admin/events`

### **Production Deployment:**

When ready for production:

1. Deploy to Vercel/Netlify with same environment variables
2. Update Supabase project settings for production domain
3. Your events system will work exactly the same!

---

## 📞 **Need Help?**

- Check `database-schema.sql` for table structure
- Use `test-database.sql` for verification queries
- Browser console shows detailed error messages
- Supabase dashboard has logs and monitoring

**Happy event managing!** 🎊
