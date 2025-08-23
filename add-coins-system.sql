-- Add coins system to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_game_session_start TIMESTAMP WITH TIME ZONE;

-- Combined function for game session management and coin awards
CREATE OR REPLACE FUNCTION public.manage_game_session(
    user_id UUID,
    action TEXT DEFAULT 'end'
)
RETURNS INTEGER AS $$
DECLARE
    session_start TIMESTAMP WITH TIME ZONE;
    minutes_played INTEGER;
    coins_earned INTEGER;
BEGIN
    IF action = 'start' THEN
        UPDATE public.profiles SET last_game_session_start = now() WHERE id = user_id;
        RETURN 0;
    ELSE
        -- Get session start and calculate coins
        SELECT last_game_session_start INTO session_start FROM public.profiles WHERE id = user_id;
        minutes_played := GREATEST(1, EXTRACT(EPOCH FROM (now() - COALESCE(session_start, now()))) / 60);
        
        -- Award coins (1 per minute)
        UPDATE public.profiles 
        SET coins = COALESCE(coins, 0) + minutes_played,
            last_game_session_start = NULL
        WHERE id = user_id;
        
        RETURN minutes_played;
    END IF;
END;
$$ language 'plpgsql' security definer;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.manage_game_session(UUID, TEXT) TO authenticated;
