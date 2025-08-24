-- Clean up all user sessions to remove spam
-- This will delete all existing sessions and reset the table

-- Delete all existing sessions
DELETE FROM public.user_sessions;

-- Reset the sequence if it exists
-- ALTER SEQUENCE IF EXISTS public.user_sessions_id_seq RESTART WITH 1;

-- Verify the cleanup
SELECT COUNT(*) as remaining_sessions FROM public.user_sessions;

-- Optional: Show any remaining sessions (should be 0)
SELECT * FROM public.user_sessions LIMIT 10;
