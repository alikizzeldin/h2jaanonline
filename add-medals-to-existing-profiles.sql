-- Add medals and quiz columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS medals INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_played_quiz BOOLEAN DEFAULT false;

-- Update existing records to have default values
UPDATE public.profiles 
SET medals = 0, has_played_quiz = false 
WHERE medals IS NULL OR has_played_quiz IS NULL;
