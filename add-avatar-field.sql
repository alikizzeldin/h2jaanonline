-- Add avatar field to profiles table for base64 encoded images
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Add comment to document the field
COMMENT ON COLUMN public.profiles.avatar IS 'Base64 encoded avatar image data';

-- Note: We don't index the avatar data directly as it can be very large
-- Instead, we can add a boolean column to track if user has avatar
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_avatar BOOLEAN DEFAULT false;

-- Create index on the boolean column for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_has_avatar ON public.profiles (has_avatar) WHERE has_avatar = true;
