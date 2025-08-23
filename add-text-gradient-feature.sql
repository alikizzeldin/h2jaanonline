-- Add text gradient feature to profiles table
-- This allows users to enable animated red and black text gradients

-- Add the text_gradient_enabled column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS text_gradient_enabled BOOLEAN DEFAULT FALSE;

-- Add comment to the column
COMMENT ON COLUMN public.profiles.text_gradient_enabled IS 'Whether the user has purchased and enabled the red and black text gradient animation feature';

-- Update existing profiles to have the feature disabled by default
UPDATE public.profiles 
SET text_gradient_enabled = FALSE 
WHERE text_gradient_enabled IS NULL;
