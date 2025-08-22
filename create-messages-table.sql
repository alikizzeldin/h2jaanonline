-- Create messages table for contact form
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert messages (for contact form)
CREATE POLICY "Allow anyone to insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Create policy to allow only admin to view messages
CREATE POLICY "Allow admin to view messages" ON messages
  FOR SELECT USING (
    auth.jwt() ->> 'email' = 'sevenarmy364@gmail.com'
  );

-- Create policy to allow only admin to delete messages
CREATE POLICY "Allow admin to delete messages" ON messages
  FOR DELETE USING (
    auth.jwt() ->> 'email' = 'sevenarmy364@gmail.com'
  );

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON messages 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
