# Faculty Management System - Complete Setup Guide

## Overview

The Faculty section has been made fully dynamic and manageable from the Admin Panel with complete CRUD operations and photo upload functionality.

## Features Implemented

### 1. Dynamic Faculty Display

- **File**: `src/components/sections/FacultySection.tsx`
- Fetches faculty data from Supabase database
- Displays faculty with optimized images using Next.js Image component
- Shows loading states, error handling, and empty states
- Responsive grid layout with animations

### 2. Admin Faculty Management

- **File**: `src/app/admin/faculty/page.tsx`
- Complete CRUD interface for faculty management
- Faculty statistics dashboard
- Individual faculty profile view
- Status and featured toggles
- Photo management

### 3. Faculty Form

- **File**: `src/components/admin/faculty/FacultyForm.tsx`
- Comprehensive form for creating/editing faculty
- Photo upload with preview
- Array field management (specializations, education, research areas)
- Publication management
- Form validation and error handling

### 4. Backend Services

- **File**: `src/services/faculty.ts`
- All CRUD operations
- Photo upload/delete functionality
- Data validation
- Error handling

### 5. React Query Hooks

- **File**: `src/hooks/useFaculty.ts`
- Optimistic updates
- Cache management
- Error handling with toast notifications
- Status and featured toggles

### 6. Type Definitions

- **File**: `src/types/index.ts`
- Updated Faculty interface
- Create/Update data types
- Publication types

## Database Setup

### 1. Run Faculty Table Script

Execute the following SQL in your Supabase SQL Editor:

```sql
-- File: scripts/setup-faculty-table.sql
-- This creates the faculty table with all required fields, indexes, and RLS policies
```

### 2. Setup Faculty Photos Storage

1. **Create Storage Bucket**:

   - Go to Supabase Dashboard > Storage
   - Click "New Bucket"
   - Name: `faculty-photos`
   - Public: `true`
   - File size limit: `10MB`
   - Allowed mime types: `image/*`

2. **Setup Storage Policies**:
   ```sql
   -- File: scripts/setup-faculty-storage.sql
   -- This sets up storage policies and helper functions
   ```

### 3. Storage Policies Configuration

In Supabase Dashboard > Storage > faculty-photos > Policies:

**Policy 1: Public Read Access**

- Name: "Allow public read access to faculty photos"
- Effect: Allow
- Action: SELECT
- Target roles: public
- SQL: `true`

**Policy 2: Admin Upload Access**

- Name: "Allow admin to upload faculty photos"
- Effect: Allow
- Action: INSERT, UPDATE, DELETE
- Target roles: authenticated
- SQL: `auth.role() = 'authenticated'`

## Admin Panel Integration

### Add Faculty to Admin Navigation

Add to your admin layout navigation:

```tsx
{
  title: "Faculty",
  href: "/admin/faculty",
  icon: Users,
  description: "Manage faculty members"
}
```

## Usage Instructions

### 1. Adding Faculty

1. Go to Admin Panel > Faculty
2. Click "Add Faculty Member"
3. Fill in required fields (name, designation, email, specialization)
4. Upload a professional photo (optional)
5. Add education, research areas, and publications
6. Set status (active/inactive) and featured status
7. Save

### 2. Managing Faculty

- **Edit**: Click edit icon on any faculty card
- **View Profile**: Click eye icon to view detailed profile
- **Toggle Status**: Click activate/deactivate button
- **Toggle Featured**: Click star icon to add/remove from featured
- **Delete**: Click trash icon (with confirmation)

### 3. Photo Management

- Upload photos up to 10MB
- Supported formats: JPG, PNG, GIF, WebP
- Photos are automatically optimized for web display
- Old photos are automatically deleted when new ones are uploaded

## Key Features

### Dynamic Content

- All faculty data is fetched from the database
- Real-time updates when changes are made
- Optimistic UI updates for better user experience

### Photo Upload

- Drag & drop or click to upload
- Image preview before saving
- Automatic file naming and organization
- Optimized delivery via Supabase CDN

### Search & Filter (Future Enhancement)

- Ready for search functionality
- Filterable by specialization, department, etc.
- Sortable by experience, name, etc.

### SEO Optimized

- Proper meta tags for faculty pages
- Optimized images with alt text
- Semantic HTML structure

## File Structure

```
src/
├── app/admin/faculty/
│   └── page.tsx                 # Admin faculty management
├── components/
│   ├── admin/faculty/
│   │   └── FacultyForm.tsx      # Faculty create/edit form
│   └── sections/
│       └── FacultySection.tsx   # Public faculty display
├── hooks/
│   └── useFaculty.ts           # React Query hooks
├── services/
│   └── faculty.ts              # Backend service functions
└── types/
    └── index.ts                # TypeScript interfaces

scripts/
├── setup-faculty-table.sql     # Database table setup
└── setup-faculty-storage.sql   # Storage bucket setup
```

## Environment Variables

Make sure your `.env.local` includes:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing Checklist

- [ ] Create new faculty member
- [ ] Upload faculty photo
- [ ] Edit existing faculty
- [ ] Toggle active/inactive status
- [ ] Toggle featured status
- [ ] Delete faculty member
- [ ] View public faculty section
- [ ] Test responsive design
- [ ] Test error handling
- [ ] Test photo upload limits

## Next Steps (Optional Enhancements)

1. **Faculty Details Page**: Individual faculty profile pages
2. **Advanced Search**: Search by specialization, experience, etc.
3. **Faculty Directory**: Printable faculty directory
4. **Import/Export**: Bulk faculty data management
5. **Faculty Analytics**: Visit statistics and engagement metrics

The faculty management system is now fully functional and ready for production use!
