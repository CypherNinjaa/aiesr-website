# Supabase Storage Setup for Testimonial Photos

## Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**

   - Navigate to your project: https://app.supabase.com/project/rjbvufpkbyceygiobdus
   - Click on "Storage" in the left sidebar

2. **Create New Bucket**
   - Click "New bucket" button
   - Bucket name: `testimonial-photos`
   - Make it **Public** (check the "Public bucket" option)
   - Click "Create bucket"

## Step 2: Set Up Storage Policies

Run this SQL in your Supabase SQL Editor to set up proper access policies:

```sql
-- Create storage policies for testimonial photos bucket
-- Allow public read access to testimonial photos
INSERT INTO storage.policies (bucket_id, name, definition, check, command)
VALUES (
  'testimonial-photos',
  'Allow public read access',
  'bucket_id = ''testimonial-photos''',
  'true',
  'SELECT'
);

-- Allow authenticated users to upload photos (for submissions)
INSERT INTO storage.policies (bucket_id, name, definition, check, command)
VALUES (
  'testimonial-photos',
  'Allow authenticated upload',
  'bucket_id = ''testimonial-photos''',
  'auth.role() = ''authenticated'' OR auth.role() = ''anon''',
  'INSERT'
);

-- Allow users to update their own photos
INSERT INTO storage.policies (bucket_id, name, definition, check, command)
VALUES (
  'testimonial-photos',
  'Allow users to update own photos',
  'bucket_id = ''testimonial-photos''',
  'auth.role() = ''authenticated''',
  'UPDATE'
);

-- Allow admins to delete photos
INSERT INTO storage.policies (bucket_id, name, definition, check, command)
VALUES (
  'testimonial-photos',
  'Allow admin delete',
  'bucket_id = ''testimonial-photos''',
  'auth.role() = ''authenticated''',
  'DELETE'
);
```

## Step 3: Folder Structure

The bucket will organize photos like this:

```
testimonial-photos/
├── uploads/          (temporary uploads before approval)
├── approved/         (approved testimonial photos)
└── thumbnails/       (generated thumbnails - optional)
```

## Step 4: File Naming Convention

Photos will be named using this pattern:

- Format: `{testimonial_id}_{timestamp}.{extension}`
- Example: `abc123_1703123456_profile.jpg`
- This ensures uniqueness and easy association with testimonials

## Step 5: Environment Variables

Add these to your `.env.local` if not already present:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rjbvufpkbyceygiobdus.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 6: Image Processing (Optional)

Consider adding image processing for:

- Automatic resizing (max 800x800px)
- Compression for web optimization
- Thumbnail generation
- Format conversion (WebP for better compression)

## Security Notes

- Photos are uploaded to a public bucket for easy display
- File size should be limited (max 5MB recommended)
- Only common image formats allowed (jpg, jpeg, png, webp)
- Implement client-side validation for file types and sizes
- Consider adding virus scanning for production

## Next Steps

After creating the bucket:

1. Test upload functionality
2. Verify public access to uploaded images
3. Test the photo display in testimonials
4. Set up image optimization if needed
