-- Simple fix: Remove the problematic index and don't index avatar data
-- The avatar data is large and doesn't need to be indexed for typical queries

-- Drop the problematic index
DROP INDEX IF EXISTS idx_profiles_avatar;

-- Optional: Create a simple boolean column to track if user has avatar
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_avatar BOOLEAN DEFAULT false;

-- Update existing records
UPDATE public.profiles 
SET has_avatar = (avatar IS NOT NULL AND avatar != '') 
WHERE has_avatar IS NULL;

-- Create a trigger to automatically update has_avatar when avatar changes
CREATE OR REPLACE FUNCTION update_has_avatar()
RETURNS TRIGGER AS $$
BEGIN
  NEW.has_avatar = (NEW.avatar IS NOT NULL AND NEW.avatar != '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for has_avatar updates
DROP TRIGGER IF EXISTS trigger_update_has_avatar ON public.profiles;
CREATE TRIGGER trigger_update_has_avatar
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_has_avatar();

-- Create index on the boolean column (much more efficient)
CREATE INDEX IF NOT EXISTS idx_profiles_has_avatar_bool ON public.profiles (has_avatar) WHERE has_avatar = true;
