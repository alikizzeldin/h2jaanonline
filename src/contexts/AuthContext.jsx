import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false)

  useEffect(() => {
    // Get initial session with better error handling
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          // Clear invalid session
          await supabase.auth.signOut()
          setUser(null)
          setNeedsProfileSetup(false)
          setLoading(false)
          return
        }

        if (session?.user) {
          // Validate session is not expired
          const now = Math.floor(Date.now() / 1000)
          if (session.expires_at && session.expires_at < now) {
            console.log('Session expired, clearing...')
            await supabase.auth.signOut()
            setUser(null)
            setNeedsProfileSetup(false)
            setLoading(false)
            return
          }

          setUser(session.user)
          await ensureProfileExists(session.user)
          await checkProfileSetupNeeded(session.user)
        } else {
          setUser(null)
          setNeedsProfileSetup(false)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear everything on error
        await supabase.auth.signOut()
        setUser(null)
        setNeedsProfileSetup(false)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes with better error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('Auth state change:', event, !!session)
          
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null)
            setNeedsProfileSetup(false)
            setLoading(false)
            return
          }

          if (event === 'TOKEN_REFRESHED' && session) {
            // Validate refreshed session
            const now = Math.floor(Date.now() / 1000)
            if (session.expires_at && session.expires_at < now) {
              console.log('Refreshed session still expired, signing out...')
              await supabase.auth.signOut()
              return
            }
          }

          const newUser = session?.user ?? null
          if (newUser) {
            setUser(newUser)
            
            // Only ensure profile exists for new sign ins or token refresh
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              await ensureProfileExists(newUser)
            }
            await checkProfileSetupNeeded(newUser)
          } else {
            setUser(null)
            setNeedsProfileSetup(false)
          }
          
          setLoading(false)
        } catch (error) {
          console.error('Auth state change error:', error)
          // Clear everything on error
          await supabase.auth.signOut()
          setUser(null)
          setNeedsProfileSetup(false)
          setLoading(false)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Auto-refresh session every 30 minutes to prevent expiration
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const now = Math.floor(Date.now() / 1000)
        const expiresAt = session.expires_at || 0
        
        // Refresh if session expires within 5 minutes
        if (expiresAt - now < 300) {
          console.log('Auto-refreshing session...')
          try {
            await supabase.auth.refreshSession()
          } catch (error) {
            console.error('Auto-refresh failed:', error)
            // If refresh fails, sign out to avoid broken state
            await supabase.auth.signOut()
          }
        }
      }
    }, 30 * 60 * 1000) // Check every 30 minutes

    return () => clearInterval(refreshInterval)
  }, [])

  const ensureProfileExists = async (user) => {
    if (!user) return
    
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      // If profile doesn't exist, create it
      if (fetchError && fetchError.code === 'PGRST116') {
        console.log('Creating profile for user:', user.id)
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.user_metadata?.user_name || 
                     user.user_metadata?.preferred_username || 
                     user.email?.split('@')[0] || '',
            full_name: user.user_metadata?.full_name || 
                      user.user_metadata?.name || '',
            medals: 0,
            has_played_quiz: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
          // Don't fail auth if profile creation fails
        } else {
          console.log('Profile created successfully')
        }
      } else if (fetchError) {
        console.error('Error checking profile:', fetchError)
      }
    } catch (error) {
      console.error('Error in ensureProfileExists:', error)
      // Don't fail auth if profile operations fail
    }
  }

  const checkProfileSetupNeeded = async (user) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking profile:', error)
        return
      }

      // Check if user needs profile setup
      // They need setup if:
      // 1. No profile exists in database, OR
      // 2. Profile exists but username is empty/null
      const needsSetup = !data || !data.username || data.username.trim() === ''
      
      setNeedsProfileSetup(needsSetup)
    } catch (error) {
      console.error('Error in checkProfileSetupNeeded:', error)
      setNeedsProfileSetup(false)
    }
  }

  const completeProfileSetup = () => {
    setNeedsProfileSetup(false)
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    try {
      // Clear local state first
      setUser(null)
      setNeedsProfileSetup(false)
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        // Even if signout fails, clear local storage to prevent issues
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
      }
      
      return { error }
    } catch (error) {
      console.error('Sign out failed:', error)
      // Force clear everything
      setUser(null)
      setNeedsProfileSetup(false)
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
      return { error }
    }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    return { data, error }
  }

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    })
    return { data, error }
  }

  const value = {
    user,
    loading,
    needsProfileSetup,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGitHub,
    completeProfileSetup,
    checkProfileSetupNeeded,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
