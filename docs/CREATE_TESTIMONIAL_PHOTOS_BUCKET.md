# ✅ COMPLETED: testimonial-photos Bucket Setup

## 🎉 STATUS: FULLY OPERATIONAL

The `testimonial-photos` bucket has been successfully created with all required policies:

- ✅ **SELECT** - Allow public read access to testimonial photos
- ✅ **INSERT** - Allow public upload for testimonials
- ✅ **UPDATE** - Allow authenticated users to update photos
- ✅ **DELETE** - Allow authenticated users to delete photos

**Total: 4 policies in testimonial-photos** ✅

---

## STEP 1: Create the Bucket ✅ COMPLETED

1. **Go to Storage in your Supabase Dashboard**

   - URL: https://app.supabase.com/project/rjbvufpkbyceygiobdus/storage/buckets
   - (This is where you took the screenshot)

2. **Click "Create Bucket" button**

3. **Configure the bucket:**

   - **Bucket Name**: `testimonial-photos`
   - **Public bucket**: ✅ **Check this box** (This allows public read access)
   - **File size limit**: Leave default (50MB is fine for photos)
   - **Allowed MIME types**: Leave default (or specify: `image/jpeg,image/png,image/webp`)

4. **Click "Create Bucket"**

## STEP 2: Verify Bucket Creation

After creating the bucket, you should see it in your Storage list alongside:

- event-images
- faculty-images
- event-posters
- **testimonial-photos** ← New bucket

## STEP 3: Set Up Storage Policies

Once the bucket is created, you need to set up access policies:

### Policy 1: Public Upload (Allow anyone to upload)

1. Click on the **testimonial-photos** bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Configure:
   - **Name**: `Allow public uploads to testimonial-photos`
   - **Policy command**: `INSERT`
   - **Target roles**: `public` (or `anon`)
   - **USING expression**: `bucket_id = 'testimonial-photos'`
   - **WITH CHECK expression**: `bucket_id = 'testimonial-photos'`

### Policy 2: Admin Update (Allow authenticated users to update)

1. Click **"New Policy"** again
2. Configure:
   - **Name**: `Allow authenticated users to update photos`
   - **Policy command**: `UPDATE`
   - **Target roles**: `authenticated`
   - **USING expression**: `bucket_id = 'testimonial-photos'`
   - **WITH CHECK expression**: `bucket_id = 'testimonial-photos'`

### Policy 3: Admin Delete (Allow authenticated users to delete)

1. Click **"New Policy"** again
2. Configure:
   - **Name**: `Allow authenticated users to delete photos`
   - **Policy command**: `DELETE`
   - **Target roles**: `authenticated`
   - **USING expression**: `bucket_id = 'testimonial-photos'`

## STEP 4: Test the Setup

After creating the bucket and policies, you can test:

1. **Start your development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to the testimonial submission form:**

   - http://localhost:3000/submit-testimonial

3. **Try uploading a photo:**
   - Select a photo file
   - Submit the form
   - Check if the photo uploads successfully

## Troubleshooting

If you encounter issues:

1. **Check bucket exists**: Verify `testimonial-photos` appears in Storage
2. **Check public setting**: Ensure bucket was created as "Public bucket"
3. **Check policies**: Verify all 3 policies are created and active
4. **Check browser console**: Look for any error messages during upload

## Next Steps

Once the bucket is created and working:

- ✅ Photo upload in testimonial form will work
- ✅ Admin can manage (update/delete) photos
- ✅ Public can view testimonial photos
- ✅ Full testimonial system will be operational

Let me know when you've completed these steps and I can help with any issues!
