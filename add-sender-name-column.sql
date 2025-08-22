-- Add sender_name column to existing messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_name TEXT NOT NULL DEFAULT 'Anonymous';

-- Update existing messages to have a default sender name if they don't have one
UPDATE messages SET sender_name = 'Anonymous' WHERE sender_name IS NULL OR sender_name = '';
