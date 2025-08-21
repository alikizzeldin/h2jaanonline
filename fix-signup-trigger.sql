-- Fix the handle_new_user function to prevent 500 errors
-- This replaces the existing function with a more robust version

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table with proper error handling
  INSERT INTO public.profiles (
    id, 
    username, 
    full_name, 
    medals, 
    has_played_quiz,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'preferred_username', 
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    0, -- Default medals
    false, -- Default has_played_quiz
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  );
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If profile already exists, just return NEW
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Recreate the trigger to ensure it's properly linked
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Also ensure the profiles table has the correct structure
-- This is safe to run multiple times
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS medals INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_played_quiz BOOLEAN DEFAULT false;

-- Update any existing NULL values
UPDATE public.profiles 
SET 
  medals = COALESCE(medals, 0),
  has_played_quiz = COALESCE(has_played_quiz, false),
  created_at = COALESCE(created_at, timezone('utc'::text, now())),
  updated_at = COALESCE(updated_at, timezone('utc'::text, now()))
WHERE medals IS NULL OR has_played_quiz IS NULL OR created_at IS NULL OR updated_at IS NULL;
