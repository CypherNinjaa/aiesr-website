# Event Sponsors System Documentation

## Overview

The Event Sponsors System allows administrators to manage sponsors for events with a comprehensive CRUD interface, tier-based organization, and professional display capabilities.

## Features

### ✅ Admin Features

- **Create New Sponsors**: Quick sponsor creation with logo upload
- **Manage Existing Sponsors**: Add existing sponsors to events
- **Sponsor Tiers**: Platinum, Gold, Silver, Bronze, Partner levels
- **Featured Sponsors**: Highlight important sponsors
- **Custom Descriptions**: Event-specific sponsor descriptions
- **Logo Management**: URL input or file upload with preview
- **Search & Filter**: Find sponsors quickly by name
- **Professional UI**: Modern, accessible interface

### ✅ Display Features

- **Tier-based Layout**: Sponsors grouped by tier level
- **Featured Section**: Prominently display featured sponsors
- **Responsive Design**: Works on all device sizes
- **Logo Optimization**: Proper image sizing and loading
- **Website Links**: Clickable sponsor websites
- **Professional Styling**: Clean, modern appearance

## Database Schema

### Sponsors Table

```sql
sponsors (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  tier VARCHAR(50) DEFAULT 'bronze',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID
)
```

### Event Sponsors Junction Table

```sql
event_sponsors (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  sponsor_id UUID REFERENCES sponsors(id),
  display_order INTEGER DEFAULT 0,
  sponsor_tier VARCHAR(50) DEFAULT 'bronze',
  is_featured BOOLEAN DEFAULT false,
  custom_description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Sponsor Tiers

| Tier     | Priority | Default Logo Size | Description           |
| -------- | -------- | ----------------- | --------------------- |
| Platinum | 1        | Large             | Premium sponsors      |
| Gold     | 2        | Large             | Major sponsors        |
| Silver   | 3        | Medium            | Standard sponsors     |
| Bronze   | 4        | Medium            | Supporting sponsors   |
| Partner  | 5        | Small             | Partner organizations |

## Usage

### 1. Setting Up the Database

Execute the SQL script to set up tables, policies, and storage:

```bash
# Run in Supabase SQL Editor
cat scripts/setup-sponsors-system.sql
```

### 2. Admin Interface

Access sponsor management through the EventForm:

- Navigate to `/admin/events/new` or `/admin/events/[id]`
- Scroll to the "Event Sponsors" section
- Use "New Sponsor" or "Add Existing" buttons

### 3. Creating Sponsors

**New Sponsor Flow:**

1. Click "New Sponsor"
2. Fill in sponsor details
3. Upload logo (file or URL)
4. Select tier level
5. Click "Create & Add"

**Existing Sponsor Flow:**

1. Click "Add Existing"
2. Search for sponsor by name
3. Select from dropdown
4. Choose tier for this event
5. Add custom description (optional)
6. Set as featured (optional)
7. Click "Add Sponsor"

### 4. Display Integration

Add to event detail pages:

```tsx
import EventSponsorsDisplay from "@/components/events/EventSponsorsDisplay";

// In your event page
<EventSponsorsDisplay eventId={event.id} />;
```

## API Endpoints

### Service Layer

- `SponsorService.getSponsors()` - Get all sponsors
- `SponsorService.createSponsor()` - Create new sponsor
- `SponsorService.updateSponsor()` - Update sponsor
- `SponsorService.deleteSponsor()` - Delete sponsor
- `SponsorService.getEventSponsors()` - Get sponsors for event
- `SponsorService.addEventSponsor()` - Add sponsor to event
- `SponsorService.removeEventSponsor()` - Remove sponsor from event

### React Query Hooks

- `useSponsors()` - Query sponsors
- `useCreateSponsor()` - Create sponsor mutation
- `useUpdateSponsor()` - Update sponsor mutation
- `useDeleteSponsor()` - Delete sponsor mutation
- `useEventSponsors()` - Query event sponsors
- `useAddEventSponsor()` - Add event sponsor mutation
- `useRemoveEventSponsor()` - Remove event sponsor mutation

## File Structure

```
src/
├── components/
│   ├── admin/
│   │   └── events/
│   │       └── EventSponsorManager.tsx
│   └── events/
│       ├── EventSponsorsDisplay.tsx
│       └── EventSponsorsDisplay.module.css
├── hooks/
│   └── useSponsors.ts
├── services/
│   └── sponsors.ts
├── types/
│   └── index.ts (sponsor types)
└── scripts/
    └── setup-sponsors-system.sql
```

## Security Features

### Row Level Security (RLS)

- **Public Access**: Read active sponsors and event sponsors for published events
- **Authenticated Access**: Read all data
- **Admin Access**: Full CRUD operations

### Storage Security

- **Public Bucket**: `sponsor-logos` for logo storage
- **Upload Policies**: Admin-only upload permissions
- **File Validation**: Image format and size restrictions

## Performance Optimizations

### Database

- Indexes on frequently queried fields
- Efficient joins between events and sponsors
- Optimized tier and status queries

### Frontend

- React Query caching and background updates
- Image optimization with Next.js Image component
- Lazy loading for large sponsor lists
- Proper TypeScript typing for better performance

## Best Practices

### Logo Guidelines

- **Recommended Size**: 400x200px (2:1 aspect ratio)
- **Formats**: PNG, JPG, WebP, SVG
- **File Size**: Maximum 10MB
- **Background**: Transparent or white background recommended

### Tier Management

- Use tiers consistently across events
- Featured sponsors should be limited (3-5 per event)
- Maintain sponsor tier hierarchy
- Custom descriptions should be event-specific

### Admin Workflow

1. Create sponsor profile once in the system
2. Reuse sponsor for multiple events
3. Adjust tier per event as needed
4. Use featured flag for VIP sponsors
5. Keep contact information updated

## Troubleshooting

### Common Issues

1. **Logo not displaying**: Check file permissions and URL validity
2. **Sponsor not appearing**: Verify event-sponsor relationship exists
3. **Upload fails**: Check file size and format restrictions
4. **Permission denied**: Ensure proper admin authentication

### Debug Steps

1. Check browser console for errors
2. Verify database relationships
3. Test storage bucket accessibility
4. Confirm RLS policies are active

## Future Enhancements

### Possible Additions

- **Drag-and-drop reordering** (ready for implementation)
- **Sponsor analytics** tracking
- **Bulk sponsor import** from CSV
- **Sponsor template library**
- **Advanced tier customization**
- **Sponsor contact management**
- **Integration with CRM systems**

## Support

For technical support or feature requests:

1. Check the database logs in Supabase
2. Review TypeScript compilation errors
3. Test API endpoints in development
4. Verify storage bucket configuration
5. Contact the development team for assistance

---

**Last Updated**: June 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
