# Image Functionality Test Guide

## Features Implemented

### 1. **Dual Image Input Methods**

- **Image URL**: Paste external image URLs (recommended for production)
- **File Upload**: Upload images directly from device (converts to base64)

### 2. **Real-time Image Preview**

- Live preview updates as you enter URL or upload file
- Preview shows actual image with proper sizing and aspect ratio
- Option to remove/clear image with one click

### 3. **Enhanced UX Features**

- Toggle buttons to switch between URL and upload modes
- Proper accessibility with fieldset, labels, and ARIA attributes
- Loading states and error handling
- File type validation (JPG, PNG, GIF, WebP)
- Size recommendations (max 10MB)

## Testing Steps

### Test 1: Image URL Method

1. Go to http://localhost:3000/admin
2. Login with admin credentials
3. Navigate to "Events" → "Create New Event"
4. Scroll to the "Event Image" section
5. Ensure "Image URL" tab is selected (default)
6. Enter a test image URL: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800`
7. Verify image preview appears immediately
8. Fill other required fields and save event
9. Check that image displays correctly on events page

### Test 2: File Upload Method

1. In the same form, click "Upload Image" tab
2. Click the file input to select an image from your computer
3. Choose any image file (JPG, PNG, etc.)
4. Verify image preview updates with uploaded image
5. Verify "Remove Image" button works
6. Try uploading again with different image
7. Save event and verify image displays correctly

### Test 3: Edit Event with Image

1. Edit an existing event that has an image
2. Verify current image shows in preview
3. Test switching between URL and upload methods
4. Test clearing and adding new image
5. Save changes and verify updates persist

## Expected Results

✅ **URL Method**:

- Instant preview when valid URL entered
- Image persists after save
- No file size limitations

✅ **Upload Method**:

- File selection dialog opens properly
- Image converts to base64 and shows in preview
- Image data saves to database
- File validation works for supported formats

✅ **Preview Functionality**:

- Images display with proper aspect ratio
- Remove button clears image and resets form
- Toggle between methods works seamlessly

✅ **Accessibility**:

- Proper ARIA labels and descriptions
- Keyboard navigation works
- Screen reader friendly

## Sample Test Images URLs

1. Academic Event: `https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800`
2. Cultural Event: `https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800`
3. Workshop: `https://images.unsplash.com/photo-1552664730-d307ca884978?w=800`
4. Research: `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800`

## Troubleshooting

**Preview not showing?**

- Check image URL is valid and accessible
- Ensure file size is within limits
- Check browser console for errors

**Upload not working?**

- Verify file is supported format
- Check file size (max 10MB recommended)
- Try different image file

**Images not saving?**

- Check network connection to Supabase
- Verify admin authentication
- Check browser developer tools for errors
