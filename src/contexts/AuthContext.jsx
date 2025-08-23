import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, testSupabaseConnection } from '../lib/supabase'

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
  const [initialized, setInitialized] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Helper functions for localStorage
  const getCachedProfile = (userId) => {
    try {
      const cached = localStorage.getItem(`profile_${userId}`)
      if (cached) {
        const profile = JSON.parse(cached)
        // Check if cache is less than 1 hour old
        if (Date.now() - profile.cachedAt < 60 * 60 * 1000) {
          console.log('Using cached profile data')
          return profile.data
        }
      }
    } catch (error) {
      console.error('Error reading cached profile:', error)
    }
    return null
  }

  const setCachedProfile = (userId, profileData) => {
    try {
      const cacheData = {
        data: profileData,
        cachedAt: Date.now()
      }
      localStorage.setItem(`profile_${userId}`, JSON.stringify(cacheData))
      console.log('Profile data cached in localStorage')
    } catch (error) {
      console.error('Error caching profile:', error)
    }
  }

  const clearCachedProfile = (userId) => {
    try {
      localStorage.removeItem(`profile_${userId}`)
      console.log('Cached profile cleared')
    } catch (error) {
      console.error('Error clearing cached profile:', error)
    }
  }

  // Check if user is admin
  const checkIfAdmin = (user) => {
    if (user && user.email === 'sevenarmy364@gmail.com') {
      setIsAdmin(true)
      return true
    } else {
      setIsAdmin(false)
      return false
    }
  }

  // Debug auth state
  useEffect(() => {
    console.log('AuthContext state changed:', { 
      user: !!user, 
      loading, 
      initialized,
      needsProfileSetup,
      hasInitialized,
      userEmail: user?.email 
    })
  }, [user, loading, initialized, needsProfileSetup, hasInitialized])

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setUser(null)
            setNeedsProfileSetup(false)
            setLoading(false)
            setInitialized(true)
            setHasInitialized(true)
          }
          return
        }

        console.log('Session found:', !!session, 'User:', !!session?.user)

        if (session?.user && mounted) {
          setUser(session.user)
          checkIfAdmin(session.user)
          await ensureProfileExists(session.user)
        } else if (mounted) {
          setUser(null)
          setNeedsProfileSetup(false)
        }
        
        if (mounted) {
          setLoading(false)
          setInitialized(true)
          setHasInitialized(true)
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error)
        if (mounted) {
          setUser(null)
          setNeedsProfileSetup(false)
          setLoading(false)
          setInitialized(true)
          setHasInitialized(true)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, 'Session:', !!session, 'User:', !!session?.user)
        
        if (!mounted) return

        try {
                  if (event === 'SIGNED_OUT' || !session) {
          console.log('User signed out or no session')
          setUser(null)
          setIsAdmin(false)
          setNeedsProfileSetup(false)
          setLoading(false)
          setInitialized(true)
          return
        }

          if (session?.user) {
            console.log('User signed in:', session.user.email)
            setUser(session.user)
            checkIfAdmin(session.user)
            
            // Set a maximum timeout to ensure loading state is set to false
            const maxTimeout = setTimeout(() => {
              if (mounted && loading) {
                console.log('Maximum timeout reached, forcing loading to false')
                setLoading(false)
                setInitialized(true)
              }
            }, 15000) // 15 seconds maximum
            
            // Only run profile operations if this is a new sign in (not from initializeAuth)
            if (event === 'SIGNED_IN' && !hasInitialized) {
              console.log('Ensuring profile exists...')
              try {
                await ensureProfileExists(session.user)
                console.log('Profile ensured')
              } catch (error) {
                console.error('Profile ensure failed:', error)
                // Test connectivity when operations fail
                if (error.message === 'Database query timeout') {
                  console.log('Running connectivity test due to timeout...')
                  const connectivityResult = await testSupabaseConnection()
                  console.log('Connectivity test result:', connectivityResult)
                }
                // Set loading to false immediately on error
                if (mounted) {
                  console.log('Setting loading to false due to profile ensure error')
                  clearTimeout(maxTimeout)
                  setLoading(false)
                  setInitialized(true)
                  return
                }
              }
            }
            
            // Set loading to false after all operations complete (or fail)
            if (mounted) {
              console.log('Setting loading to false and initialized to true')
              clearTimeout(maxTimeout)
              setLoading(false)
              setInitialized(true)
            }
          } else {
            setUser(null)
            setIsAdmin(false)
            setNeedsProfileSetup(false)
            if (mounted) {
              setLoading(false)
              setInitialized(true)
            }
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          if (mounted) {
            setUser(null)
            setIsAdmin(false)
            setNeedsProfileSetup(false)
            setLoading(false)
            setInitialized(true)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [hasInitialized])

  const ensureProfileExists = async (user) => {
    if (!user) return
    
    try {
      console.log('Ensuring profile exists for user:', user.id)
      
      // First, try to get profile from cache
      const cachedProfile = getCachedProfile(user.id)
      if (cachedProfile && cachedProfile.hasOwnProperty('text_gradient_enabled') && cachedProfile.hasOwnProperty('text_gradient_purchased')) {
        console.log('Using cached profile:', cachedProfile)
        setUserProfile(cachedProfile)
        const needsSetup = !cachedProfile.username || cachedProfile.username.trim() === ''
        setNeedsProfileSetup(needsSetup)
        return
      } else if (cachedProfile) {
        console.log('Cached profile missing gradient fields, clearing cache and refetching')
        clearCachedProfile(user.id)
      }
      
      // If no cache, fetch from database
      console.log('No cached profile found, fetching from database...')
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      )
      
      // Check if profile exists with timeout
      const profilePromise = supabase
        .from('profiles')
        .select('id, username, full_name, text_gradient_enabled, text_gradient_purchased')
        .eq('id', user.id)
        .single()

      const { data: existingProfile, error: fetchError } = await Promise.race([
        profilePromise,
        timeoutPromise
      ])

      console.log('Profile check completed:', { existingProfile, fetchError })

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
            text_gradient_enabled: false,
            text_gradient_purchased: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
        } else {
          console.log('Profile created successfully')
          // Cache the newly created profile
          const newProfile = {
            id: user.id,
            username: user.user_metadata?.user_name || 
                     user.user_metadata?.preferred_username || 
                     user.email?.split('@')[0] || '',
            full_name: user.user_metadata?.full_name || 
                      user.user_metadata?.name || '',
            text_gradient_enabled: false,
            text_gradient_purchased: false
          }
          setCachedProfile(user.id, newProfile)
          setUserProfile(newProfile)
          const needsSetup = !newProfile.username || newProfile.username.trim() === ''
          setNeedsProfileSetup(needsSetup)
        }
      } else if (fetchError) {
        console.error('Error checking profile:', fetchError)
      } else {
        console.log('Profile already exists')
        // Cache the existing profile
        setCachedProfile(user.id, existingProfile)
        setUserProfile(existingProfile)
        const needsSetup = !existingProfile.username || existingProfile.username.trim() === ''
        setNeedsProfileSetup(needsSetup)
      }
      
      console.log('ensureProfileExists completed successfully')
    } catch (error) {
      console.error('Error in ensureProfileExists:', error)
      console.log('ensureProfileExists completed with error')
    }
  }

  const completeProfileSetup = () => {
    setNeedsProfileSetup(false)
  }

  const updateProfileCache = (userId, newProfileData) => {
    setCachedProfile(userId, newProfileData)
    setUserProfile(newProfileData)
  }

  const clearProfileCache = (userId) => {
    clearCachedProfile(userId)
    setUserProfile(null)
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
      console.log('Signing out user...')
      // Clear profile cache when signing out
      if (user) {
        clearCachedProfile(user.id)
      }
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
      } else {
        console.log('User signed out successfully')
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
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    return { data, error }
  }

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
        scopes: 'read:user user:email'
      }
    })
    return { data, error }
  }

  const value = {
    user,
    loading,
    needsProfileSetup,
    initialized,
    userProfile,
    isAdmin,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGitHub,
    completeProfileSetup,
    updateProfileCache,
    clearProfileCache,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
