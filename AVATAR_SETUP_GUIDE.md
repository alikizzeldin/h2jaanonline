# Quick Avatar System Setup Guide

## Step 1: Database Migration

Run this SQL in your Supabase dashboard:

```sql
-- Add avatar field to profiles table for base64 encoded images
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Add comment to document the field
COMMENT ON COLUMN public.profiles.avatar IS 'Base64 encoded avatar image data';

-- Create index for better performance when querying profiles with avatars
CREATE INDEX IF NOT EXISTS idx_profiles_avatar ON public.profiles (avatar) WHERE avatar IS NOT NULL;
```

## Step 2: Files Created

The following files have been added to your project:

- `src/components/AvatarUpload.jsx` - Upload component with drag & drop
- `src/components/Avatar.jsx` - Display component with fallback
- `src/utils/imageUtils.js` - Utility functions for image processing
- `src/components/AvatarTest.jsx` - Test component (optional)

## Step 3: Integration

The Profile page has been updated to include avatar upload functionality. Users can now:

1. Click the avatar area to upload an image
2. Drag and drop images onto the avatar
3. See real-time preview
4. Remove avatars with the X button

## Step 4: Testing

To test the system:

1. Run your development server
2. Go to the Profile page
3. Click "Edit Profile"
4. Try uploading an image
5. Save the profile

## Features Included

✅ **Free & Unlimited**: No storage costs  
✅ **Drag & Drop**: Intuitive interface  
✅ **Image Compression**: Automatic resizing  
✅ **Multiple Formats**: JPG, PNG, GIF, WebP  
✅ **Fallback System**: Letter avatars  
✅ **Real-time Preview**: See changes immediately  

## Usage Examples

### Basic Upload
```jsx
<AvatarUpload
  currentAvatar={profile.avatar}
  onAvatarChange={handleAvatarChange}
  size={128}
/>
```

### Display Avatar
```jsx
<Avatar
  src={profile.avatar}
  alt={profile.full_name}
  size={40}
  fallbackText={profile.username}
/>
```

## File Limits

- **Max File Size**: 10MB
- **Max Dimensions**: 512x512px
- **Output Format**: JPEG (compressed)
- **Compressed Size**: ~50-200KB

## Next Steps

1. Test the upload functionality
2. Customize styling if needed
3. Add avatar display to other components (Friends, Messages, etc.)
4. Consider adding avatar cropping features

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify database migration was successful
3. Test with different image formats
4. Review the full documentation in `AVATAR_UPLOAD_SYSTEM.md`
