# Gallery Slider System

A professional, dynamic, and admin-manageable gallery slider for the university homepage.

## 🎯 Features

- **Professional Design**: Modern, responsive slider with smooth animations
- **Admin Management**: Full CRUD operations from admin panel
- **Dual Upload Options**: Both URL input and direct file upload support
- **Reordering**: Easy drag controls and up/down buttons for slide ordering
- **Status Management**: Enable/disable slides without deletion
- **Responsive**: Works seamlessly across all device sizes
- **Accessible**: ARIA labels and keyboard navigation support
- **Performance**: Optimized images with Next.js Image component

## 📁 File Structure

### Database

- `scripts/setup-gallery-slider.sql` - Complete database setup with RLS policies

### Components

- `src/components/sections/ProfessionalGallerySlider.tsx` - Main slider component
- `src/components/sections/ProfessionalGallerySlider.module.css` - Slider styles
- `src/components/admin/gallery/GalleryManagement.tsx` - Admin CRUD interface
- `src/components/admin/gallery/GalleryList.tsx` - Admin slide list with actions
- `src/components/admin/gallery/GalleryForm.tsx` - Create/edit form with dual upload

### Services & Hooks

- `src/services/gallery.ts` - Gallery CRUD and image upload service
- `src/hooks/useGallery.ts` - React Query hooks for gallery operations
- `src/types/index.ts` - TypeScript types for gallery data

### Pages

- `src/app/page.tsx` - Homepage with integrated gallery slider
- `src/app/admin/gallery/page.tsx` - Admin gallery management page

## 🛠 Setup Instructions

### 1. Database Setup

Run the SQL script to create the gallery table and policies:

```sql
-- Located in scripts/setup-gallery-slider.sql
-- Contains table creation, indexes, RLS policies, triggers, and sample data
```

Key features of the database:

- `gallery_slides` table with all necessary fields
- Row Level Security (RLS) for data protection
- Automatic sort order management
- Created/updated timestamp triggers
- Performance indexes

### 2. Dependencies

The following packages are required and should already be installed:

```json
{
  "swiper": "^11.0.0",
  "lucide-react": "^0.400.0",
  "react-dropzone": "^14.0.0"
}
```

## 🎨 Usage

### Homepage Display

The gallery slider automatically displays on the homepage above the "Upcoming Events" section. It shows only active slides, ordered by `sort_order`.

**Layout Considerations:**

- **Header Compatibility**: Gallery includes `pt-20` padding to account for the fixed header (80px height)
- **Z-Index Hierarchy**: Gallery uses `z-0` to ensure proper layering below header (`z-50`)
- **Responsive Heights**: Adapts from 400px (mobile) to 700px (desktop) minus header space

**Features:**

- Auto-play with pause on hover
- Custom navigation arrows
- Pagination dots
- Parallax effects
- Responsive breakpoints

### Admin Management

Access the gallery management at `/admin/gallery`:

**Operations:**

- ✅ Create new slides with title, subtitle, description
- ✅ Upload images via URL or file upload
- ✅ Edit existing slides
- ✅ Delete slides with confirmation
- ✅ Toggle active/inactive status
- ✅ Reorder slides with up/down buttons
- ✅ Preview images in admin interface

## 🔧 Technical Details

### Image Upload

- **Storage**: Supabase Storage bucket (`gallery-images`)
- **Formats**: JPEG, PNG, WebP, GIF
- **Size Limit**: 10MB per image
- **Optimization**: Automatic optimization via Next.js Image component

### Database Schema

```sql
CREATE TABLE gallery_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  link_url TEXT,
  link_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Validation Rules

- **Title**: Required, minimum 3 characters
- **Image**: Required (either URL or uploaded file)
- **Image URL**: Must be valid URL format
- **Link URL**: Must be valid URL format (if provided)
- **Sort Order**: Positive integer
- **Alt Text**: Auto-generated from title if not provided

## 🎛 Admin Interface

### Gallery List

- Displays all slides in a responsive table
- Shows thumbnail, title, status, and actions
- Up/down buttons for reordering
- Quick toggle for active/inactive status
- Edit and delete actions with confirmations

### Gallery Form

- **Dual Upload Tabs**: Switch between URL input and file upload
- **Live Preview**: Shows image preview as you type/upload
- **Drag & Drop**: File upload with drag and drop support
- **Validation**: Real-time validation with helpful error messages
- **Responsive**: Works on all screen sizes

## 🚀 Performance Features

- **Lazy Loading**: Images load only when needed
- **Next.js Optimization**: Automatic image optimization and resizing
- **Caching**: React Query for efficient data fetching and caching
- **Compression**: CSS modules for optimized stylesheets
- **Minimal Bundle**: Tree-shaking for unused code elimination

## 🎯 Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Logical tab order
- **Alt Text**: Image descriptions for screen readers
- **Color Contrast**: WCAG compliant color schemes

## 🔒 Security

- **Row Level Security**: Database-level access control
- **File Type Validation**: Only allowed image formats
- **Size Limits**: Prevents abuse with file size limits
- **Input Sanitization**: All inputs are validated and sanitized
- **Admin Authentication**: Protected admin routes

## 🧪 Testing

The system includes comprehensive error handling:

- Network failure recovery
- Invalid file format handling
- Image load error fallbacks
- Form validation with user-friendly messages
- Confirmation dialogs for destructive actions

## 📱 Responsive Design

**Breakpoints:**

- Mobile: Single slide, touch-friendly controls
- Tablet: Enhanced navigation, larger preview
- Desktop: Full feature set, hover effects

**Mobile Optimizations:**

- Touch-friendly buttons
- Swipe gestures
- Optimized image sizes
- Simplified admin interface

## 🔄 Future Enhancements

Potential improvements:

- Drag-and-drop reordering
- Bulk upload functionality
- Image cropping tools
- Animation customization
- A/B testing capabilities
- Analytics integration

## 📞 Support

For issues or questions about the gallery system:

1. Check the browser console for error messages
2. Verify database connection and table setup
3. Ensure proper authentication for admin access
4. Check image file formats and sizes
5. Review network connectivity for uploads

---

**Built with:** React, Next.js, TypeScript, Supabase, Swiper.js, TailwindCSS
**Status:** ✅ Production Ready
**Version:** 1.0.0
