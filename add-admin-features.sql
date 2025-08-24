-- Add admin features to the profiles table
-- This script adds columns needed for the enhanced admin panel

-- Add is_banned column for user management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;

-- Add index for efficient banned user queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned 
ON public.profiles(is_banned);

-- Add admin role column for future admin management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Add index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role 
ON public.profiles(role);

-- Add last_login column for user activity tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Add index for last_login queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_login 
ON public.profiles(last_login);

-- Add login_count for user engagement tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Add index for login_count queries
CREATE INDEX IF NOT EXISTS idx_profiles_login_count 
ON public.profiles(login_count);

-- Add profile_views for popularity tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;

-- Add index for profile_views queries
CREATE INDEX IF NOT EXISTS idx_profiles_views 
ON public.profiles(profile_views);

-- Add created_at index if it doesn't exist (for sorting)
CREATE INDEX IF NOT EXISTS idx_profiles_created_at 
ON public.profiles(created_at);

-- Add updated_at index if it doesn't exist (for sorting)
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at 
ON public.profiles(updated_at);

-- Create a function to update last_login and login_count
CREATE OR REPLACE FUNCTION update_user_login()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_login = NOW();
    NEW.login_count = COALESCE(NEW.login_count, 0) + 1;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update login stats
DROP TRIGGER IF EXISTS trigger_update_user_login ON public.profiles;
CREATE TRIGGER trigger_update_user_login
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
    EXECUTE FUNCTION update_user_login();

-- Create a function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views()
RETURNS TRIGGER AS $$
BEGIN
    NEW.profile_views = COALESCE(NEW.profile_views, 0) + 1;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile views (this would be called manually when needed)
-- DROP TRIGGER IF EXISTS trigger_increment_profile_views ON public.profiles;
-- CREATE TRIGGER trigger_increment_profile_views
--     BEFORE UPDATE ON public.profiles
--     FOR EACH ROW
--     EXECUTE FUNCTION increment_profile_views();

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.is_banned IS 'Whether the user is banned from the platform';
COMMENT ON COLUMN public.profiles.role IS 'User role: user, admin, or moderator';
COMMENT ON COLUMN public.profiles.last_login IS 'Timestamp of the user''s last login';
COMMENT ON COLUMN public.profiles.login_count IS 'Total number of times the user has logged in';
COMMENT ON COLUMN public.profiles.profile_views IS 'Number of times the user''s profile has been viewed';

-- Grant necessary permissions
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Create a view for admin statistics
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE is_banned = false) as active_users,
    COUNT(*) FILTER (WHERE is_banned = true) as banned_users,
    COUNT(*) FILTER (WHERE has_played_quiz = true) as quiz_players,
    COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
    COUNT(*) FILTER (WHERE role = 'moderator') as moderator_count,
    AVG(coins) as avg_coins,
    AVG(medals) as avg_medals,
    SUM(coins) as total_coins,
    SUM(medals) as total_medals,
    AVG(login_count) as avg_login_count,
    MAX(created_at) as latest_registration
FROM public.profiles;

-- Grant access to the admin stats view
GRANT SELECT ON admin_stats TO authenticated;

-- Create a function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(user_id UUID)
RETURNS TABLE(
    total_logins INTEGER,
    days_since_last_login INTEGER,
    total_coins INTEGER,
    total_medals INTEGER,
    quiz_completed BOOLEAN,
    profile_views INTEGER,
    is_banned BOOLEAN,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.login_count,
        EXTRACT(DAY FROM (NOW() - p.last_login))::INTEGER,
        p.coins,
        p.medals,
        p.has_played_quiz,
        p.profile_views,
        p.is_banned,
        p.role
    FROM public.profiles p
    WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_activity_summary(UUID) TO authenticated;
