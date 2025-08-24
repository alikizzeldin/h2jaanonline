# Fixed Coins System - Session-Based Activity Tracking

## Overview
The coins system has been completely rewritten to implement proper session management and prevent abuse. The new system ensures:

1. **Only logged-in users can earn coins**
2. **One active session per account** - prevents multiple tabs/windows from earning coins simultaneously
3. **1 coin per minute of active usage** - tracks real user activity
4. **Session validation** - prevents fake activity and ensures legitimate usage

## Key Features

### Session Management
- Each user can only have **one active session** at a time
- Sessions are tracked in the `user_sessions` table
- Automatic cleanup of old sessions (24+ hours)
- Session validation every minute to ensure legitimacy

### Activity Tracking
- Tracks real user activity: mouse movements, clicks, keyboard input, scrolling
- Inactivity detection: pauses coin earning after 2 minutes of no activity
- Visual feedback: shows session status in the coins display

### Security Features
- Row Level Security (RLS) on all session data
- Users can only access their own session data
- Automatic session cleanup and validation
- Prevents multiple browser tabs from earning coins

## Database Setup

### 1. Create User Sessions Table
Run the SQL in `create-user-sessions-table.sql`:

```sql
-- This creates the user_sessions table with proper indexes and RLS
-- Also creates cleanup functions and session management utilities
```

### 2. Ensure Coins Column Exists
Make sure the `coins` column exists in the `profiles` table:

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;
```

### 3. Ensure Award Coins Function Exists
Make sure the `award_coins` function exists:

```sql
CREATE OR REPLACE FUNCTION public.award_coins(user_id UUID, coins_to_award INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_coin_count INTEGER;
BEGIN
    UPDATE public.profiles 
    SET coins = COALESCE(coins, 0) + coins_to_award
    WHERE id = user_id
    RETURNING coins INTO new_coin_count;
    
    RETURN COALESCE(new_coin_count, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.award_coins(UUID, INTEGER) TO authenticated;
```

## How It Works

### Session Lifecycle
1. **User Login**: System checks for existing active sessions
2. **Session Creation**: If no active session exists, creates a new one
3. **Activity Tracking**: Monitors user activity and awards coins every minute
4. **Session Validation**: Checks session validity every minute
5. **Session Cleanup**: Automatically cleans up when user logs out or page closes

### Coin Earning Logic
- **Active Session Required**: Only earns coins if session is active
- **Real Activity**: Tracks mouse, keyboard, and touch activity
- **Inactivity Detection**: Pauses earning after 2 minutes of inactivity
- **Rate Limiting**: Maximum 1 coin per minute of activity

### Visual Indicators
- **Active Session**: Yellow coins display with 🪙 icon
- **Inactive Session**: Gray display with ⏸️ icon and warning indicator
- **Coin Animation**: Visual feedback when coins are earned
- **Session Status**: Tooltip shows session status and earning rate

## User Experience

### For Logged-In Users
- **Active Session**: Earn 1 coin per minute of activity
- **Visual Feedback**: See real-time coin count and session status
- **Notifications**: Get notified when coins are earned
- **Leaderboards**: Compete with other users on coins leaderboard

### For Non-Logged-In Users
- **No Coin Display**: Coins display is hidden
- **No Earning**: Cannot earn coins without authentication
- **Login Prompt**: Encouraged to log in to start earning

### Session Management
- **Single Session**: Only one browser tab/window can earn coins
- **Automatic Cleanup**: Sessions are cleaned up when user logs out
- **Session Recovery**: If session becomes invalid, user can refresh to start new session

## Technical Implementation

### CoinsContext Features
- **Session Management**: Handles session creation, validation, and cleanup
- **Activity Tracking**: Monitors user activity and manages inactivity
- **Real-time Updates**: Syncs with database and other clients
- **Error Handling**: Graceful handling of network issues and errors

### Database Schema
```sql
-- user_sessions table
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- session_id: TEXT (unique session identifier)
- is_active: BOOLEAN (session status)
- started_at: TIMESTAMP (session start time)
- last_activity: TIMESTAMP (last user activity)
- ended_at: TIMESTAMP (session end time)
- created_at: TIMESTAMP (record creation time)
```

### Security Measures
- **RLS Policies**: Users can only access their own session data
- **Session Validation**: Regular checks ensure session legitimacy
- **Activity Verification**: Real activity tracking prevents automation
- **Rate Limiting**: Maximum earning rate enforced

## Troubleshooting

### Common Issues
1. **Session Not Active**: User may have another active session elsewhere
2. **No Coins Earning**: Check if user is logged in and session is active
3. **Multiple Sessions**: System automatically deactivates old sessions
4. **Inactivity**: User needs to interact with the page to earn coins

### Debug Information
- Check browser console for session-related logs
- Verify user authentication status
- Check database for active sessions
- Monitor activity tracking events

## Benefits

### For Users
- **Fair System**: Prevents abuse and ensures fair coin distribution
- **Real Rewards**: Rewards actual engagement and activity
- **Visual Feedback**: Clear indication of earning status
- **Competitive**: Leaderboards encourage engagement

### For System
- **Prevents Abuse**: Multiple sessions and automation prevented
- **Scalable**: Efficient database queries and cleanup
- **Secure**: Proper authentication and authorization
- **Maintainable**: Clean code structure and error handling

## Future Enhancements
- **Session Analytics**: Track user engagement patterns
- **Bonus Coins**: Special events and achievements
- **Coin Spending**: More items in the shop
- **Social Features**: Coin sharing and gifting
