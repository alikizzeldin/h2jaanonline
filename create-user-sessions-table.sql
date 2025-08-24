-- Create user_sessions table to track active sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON public.user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity);

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to clean up old sessions (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE public.user_sessions 
    SET is_active = false, ended_at = now()
    WHERE is_active = true 
    AND last_activity < now() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.cleanup_old_sessions() TO authenticated;

-- Create a function to ensure only one active session per user
CREATE OR REPLACE FUNCTION public.ensure_single_active_session(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    active_count INTEGER;
BEGIN
    -- Count active sessions for this user
    SELECT COUNT(*) INTO active_count
    FROM public.user_sessions
    WHERE user_id = user_uuid AND is_active = true;
    
    -- If more than one active session, deactivate all except the most recent
    IF active_count > 1 THEN
        UPDATE public.user_sessions 
        SET is_active = false, ended_at = now()
        WHERE user_id = user_uuid 
        AND is_active = true
        AND id NOT IN (
            SELECT id FROM public.user_sessions 
            WHERE user_id = user_uuid AND is_active = true
            ORDER BY last_activity DESC 
            LIMIT 1
        );
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.ensure_single_active_session(UUID) TO authenticated;

-- Add comments
COMMENT ON TABLE public.user_sessions IS 'Tracks user sessions to prevent multiple active sessions from earning coins';
COMMENT ON FUNCTION public.cleanup_old_sessions() IS 'Cleans up sessions older than 24 hours';
COMMENT ON FUNCTION public.ensure_single_active_session(UUID) IS 'Ensures only one active session per user';
