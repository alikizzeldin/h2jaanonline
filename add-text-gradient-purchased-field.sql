-- Add text_gradient_purchased field to track if user has purchased the gradient feature
-- This separates the concept of "purchased" from "enabled"

-- Add the text_gradient_purchased column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS text_gradient_purchased BOOLEAN DEFAULT FALSE;

-- Add comment to the column
COMMENT ON COLUMN public.profiles.text_gradient_purchased IS 'Whether the user has purchased the red and black text gradient animation feature';

-- Set existing users who have text_gradient_enabled = true as having purchased the feature
UPDATE public.profiles 
SET text_gradient_purchased = TRUE 
WHERE text_gradient_enabled = TRUE;

-- Update existing profiles to have the feature not purchased by default
UPDATE public.profiles 
SET text_gradient_purchased = FALSE 
WHERE text_gradient_purchased IS NULL;
