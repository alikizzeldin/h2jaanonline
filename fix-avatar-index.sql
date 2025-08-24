-- Fix avatar indexing issue by using hash-based approach
-- Drop the problematic index first
DROP INDEX IF EXISTS idx_profiles_avatar;

-- Create a hash index on a hash of the avatar data (much smaller)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_hash TEXT;

-- Create a function to generate hash for avatar data
CREATE OR REPLACE FUNCTION generate_avatar_hash(avatar_data TEXT)
RETURNS TEXT AS $$
BEGIN
  IF avatar_data IS NULL THEN
    RETURN NULL;
  ELSE
    -- Use MD5 hash which is much smaller than the full base64 data
    RETURN MD5(avatar_data);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update avatar_hash when avatar changes
CREATE OR REPLACE FUNCTION update_avatar_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.avatar_hash = generate_avatar_hash(NEW.avatar);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for avatar hash updates
DROP TRIGGER IF EXISTS trigger_update_avatar_hash ON public.profiles;
CREATE TRIGGER trigger_update_avatar_hash
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_avatar_hash();

-- Update existing records to have avatar_hash
UPDATE public.profiles 
SET avatar_hash = generate_avatar_hash(avatar) 
WHERE avatar IS NOT NULL AND avatar_hash IS NULL;

-- Create index on the much smaller hash value
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_hash ON public.profiles (avatar_hash) WHERE avatar_hash IS NOT NULL;

-- Create a partial index for profiles with avatars (without indexing the actual data)
CREATE INDEX IF NOT EXISTS idx_profiles_has_avatar ON public.profiles (id) WHERE avatar IS NOT NULL;
