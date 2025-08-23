-- Activity-based coin system
-- This replaces the game session system with a timer-based system

-- Function to award coins directly
CREATE OR REPLACE FUNCTION public.award_coins(user_id UUID, coins_to_award INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_coin_count INTEGER;
BEGIN
    -- Update the user's coin count
    UPDATE public.profiles 
    SET coins = COALESCE(coins, 0) + coins_to_award
    WHERE id = user_id
    RETURNING coins INTO new_coin_count;
    
    -- Return the new coin count
    RETURN COALESCE(new_coin_count, 0);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.award_coins(UUID, INTEGER) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.award_coins(UUID, INTEGER) IS 'Awards coins directly to a user based on activity time';
