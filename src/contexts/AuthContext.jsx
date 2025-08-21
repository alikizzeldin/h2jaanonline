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
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting initial session:', error)
          if (mounted) {
            setUser(null)
            setNeedsProfileSetup(false)
            setLoading(false)
          }
          return
        }

        if (session?.user && mounted) {
          setUser(session.user)
          await ensureProfileExists(session.user)
          await checkProfileSetupNeeded(session.user)
        } else if (mounted) {
          setUser(null)
          setNeedsProfileSetup(false)
        }
        
        if (mounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setUser(null)
          setNeedsProfileSetup(false)
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, !!session)
        
        if (!mounted) return

        try {
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null)
            setNeedsProfileSetup(false)
            setLoading(false)
            return
          }

          if (session?.user) {
            setUser(session.user)
            
            // Only ensure profile exists for new sign ins
            if (event === 'SIGNED_IN') {
              await ensureProfileExists(session.user)
            }
            await checkProfileSetupNeeded(session.user)
          } else {
            setUser(null)
            setNeedsProfileSetup(false)
          }
          
          setLoading(false)
        } catch (error) {
          console.error('Error in auth state change:', error)
          if (mounted) {
            setUser(null)
            setNeedsProfileSetup(false)
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
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
        } else {
          console.log('Profile created successfully')
        }
      } else if (fetchError) {
        console.error('Error checking profile:', fetchError)
      }
    } catch (error) {
      console.error('Error in ensureProfileExists:', error)
    }
  }

  const checkProfileSetupNeeded = async (user) => {
    if (!user) return
    
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
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
      }
      
      return { error }
    } catch (error) {
      console.error('Sign out failed:', error)
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
