# Coins System Setup Guide

## 🪙 **Coins System Implementation**

This guide will help you set up the coins system for your website. Users will earn 1 coin for every minute they spend playing games.

## 📋 **Prerequisites**

- Access to your Supabase dashboard
- Your website is already set up with authentication

## 🗄️ **Database Setup**

### Step 1: Run SQL Commands

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Run the following SQL commands from the `add-coins-system.sql` file:

```sql
-- Add coins column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;

-- Add last_game_session_start column to track game time
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_game_session_start TIMESTAMP WITH TIME ZONE;

-- Create function to award coins for game time
CREATE OR REPLACE FUNCTION public.award_coins_for_game_time(
    user_id UUID,
    minutes_played INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    coins_earned INTEGER;
    current_coins INTEGER;
BEGIN
    -- Calculate coins earned (1 coin per minute)
    coins_earned := minutes_played;
    
    -- Get current coins
    SELECT coins INTO current_coins FROM public.profiles WHERE id = user_id;
    
    -- Update coins
    UPDATE public.profiles 
    SET coins = COALESCE(current_coins, 0) + coins_earned
    WHERE id = user_id;
    
    -- Return total coins after update
    SELECT coins INTO current_coins FROM public.profiles WHERE id = user_id;
    RETURN current_coins;
END;
$$ language 'plpgsql' security definer;

-- Create function to start game session
CREATE OR REPLACE FUNCTION public.start_game_session(user_id UUID)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    UPDATE public.profiles 
    SET last_game_session_start = now()
    WHERE id = user_id;
    
    RETURN now();
END;
$$ language 'plpgsql' security definer;

-- Create function to end game session and award coins
CREATE OR REPLACE FUNCTION public.end_game_session_and_award_coins(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    session_start TIMESTAMP WITH TIME ZONE;
    minutes_played INTEGER;
    coins_earned INTEGER;
BEGIN
    -- Get session start time
    SELECT last_game_session_start INTO session_start 
    FROM public.profiles WHERE id = user_id;
    
    -- Calculate minutes played (minimum 1 minute)
    IF session_start IS NOT NULL THEN
        minutes_played := GREATEST(1, EXTRACT(EPOCH FROM (now() - session_start)) / 60);
    ELSE
        minutes_played := 1;
    END IF;
    
    -- Award coins
    SELECT public.award_coins_for_game_time(user_id, minutes_played::INTEGER) INTO coins_earned;
    
    -- Clear session start time
    UPDATE public.profiles 
    SET last_game_session_start = NULL
    WHERE id = user_id;
    
    RETURN coins_earned;
END;
$$ language 'plpgsql' security definer;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.award_coins_for_game_time(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_game_session(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.end_game_session_and_award_coins(UUID) TO authenticated;
```

## ✅ **Verification**

### Step 2: Test the Setup

1. **Check Database Schema**:
   - Go to **Table Editor** in Supabase
   - Check that the `profiles` table now has:
     - `coins` column (INTEGER, default 0)
     - `last_game_session_start` column (TIMESTAMP)

2. **Test Functions**:
   - Go to **SQL Editor**
   - Run this test query (replace `YOUR_USER_ID` with an actual user ID):
   ```sql
   SELECT * FROM public.profiles WHERE id = 'YOUR_USER_ID';
   ```

## 🎮 **How It Works**

### **For Users:**
1. **Sign in** to your website
2. **Navigate to Games** section
3. **Play any game** - coins are automatically tracked
4. **Earn 1 coin per minute** of gameplay
5. **See coins displayed** in the top-right corner
6. **Get notifications** when coins are earned

### **Technical Flow:**
1. **Game Session Start**: When user enters Games page
2. **Time Tracking**: System tracks time spent on the page
3. **Session End**: When user leaves Games page or closes browser
4. **Coin Calculation**: 1 coin per minute (minimum 1 coin)
5. **Database Update**: Coins are added to user's profile
6. **UI Update**: Coins display updates in real-time
7. **Notification**: User sees a green notification with coins earned

## 🎨 **Features**

### **Visual Elements:**
- **Coins Display**: Golden coin icon with count in top-right corner
- **Notifications**: Green popup showing coins earned
- **Real-time Updates**: Coins count updates immediately
- **Responsive Design**: Works on all screen sizes

### **User Experience:**
- **Automatic Tracking**: No user action required
- **Fair System**: 1 coin per minute of actual gameplay
- **Transparent**: Users can see their coin balance
- **Motivating**: Encourages continued gameplay

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Coins not updating**:
   - Check if user is signed in
   - Verify database functions are created
   - Check browser console for errors

2. **Functions not working**:
   - Ensure RLS policies allow authenticated users
   - Check function permissions are granted
   - Verify user has a profile record

3. **Display issues**:
   - Check if CoinsProvider is wrapped around the app
   - Verify CoinsDisplay component is imported
   - Check for JavaScript errors

### **Debug Steps:**
1. Open browser developer tools
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify Supabase connection in lib/supabase.js

## 🚀 **Next Steps**

After setup, you can:
1. **Add coin spending features** (shop, rewards, etc.)
2. **Create leaderboards** based on coins
3. **Add coin multipliers** for special events
4. **Implement coin gifting** between users
5. **Create coin-based achievements**

---

**Setup Time**: 5-10 minutes
**Difficulty**: Beginner-friendly
**Requirements**: Supabase access, basic SQL knowledge
