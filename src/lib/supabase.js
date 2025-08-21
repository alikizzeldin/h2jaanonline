import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zjxksrybibrxqlobnuyb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeGtzcnliaWJyeHFsb2JudXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODY5NzIsImV4cCI6MjA3MTM2Mjk3Mn0.z2YAPYM2yPOC2MDs21CiCAYreJiQonW38UGmsWZbZms'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'h2jaan-auth-token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Test Supabase connectivity
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connectivity...')
    
    // Test 1: Basic connection
    const startTime = Date.now()
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return {
        success: false,
        error: error.message,
        responseTime
      }
    }
    
    console.log('Supabase connection test successful:', {
      responseTime: `${responseTime}ms`,
      data
    })
    
    return {
      success: true,
      responseTime,
      data
    }
  } catch (error) {
    console.error('Supabase connection test error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
