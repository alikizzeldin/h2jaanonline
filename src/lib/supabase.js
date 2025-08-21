import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zjxksrybibrxqlobnuyb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeGtzcnliaWJyeHFsb2JudXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODY5NzIsImV4cCI6MjA3MTM2Mjk3Mn0.z2YAPYM2yPOC2MDs21CiCAYreJiQonW38UGmsWZbZms'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
