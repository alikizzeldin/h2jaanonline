import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CoinsContext = createContext()

export const useCoins = () => {
  const context = useContext(CoinsContext)
  if (!context) {
    throw new Error('useCoins must be used within a CoinsProvider')
  }
  return context
}

export const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [timeActive, setTimeActive] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const { user } = useAuth()
  
  // Refs for managing timers and state
  const coinTimerRef = useRef(null)
  const activityTimerRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const isActiveRef = useRef(true)
  const isInitializedRef = useRef(false)

  // Load user's coins
  const loadUserCoins = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error loading coins:', error)
        return
      }

      setCoins(data?.coins || 0)
    } catch (error) {
      console.error('Error loading coins:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize session (simplified - no database session tracking)
  const initializeSession = async () => {
    if (!user || isInitializedRef.current) {
      console.log('Session initialization skipped:', { user: !!user, isInitialized: isInitializedRef.current })
      return
    }

    console.log('Initializing session for user:', user.id)
    isInitializedRef.current = true

    // Start session immediately without database tracking
    console.log('Setting session as active')
    setIsSessionActive(true)
    setSessionStartTime(Date.now())
    console.log('Starting activity tracking and coin timer')
    startActivityTracking()
    startCoinTimer()
    console.log('Session initialization complete')
  }

  // Start activity tracking
  const startActivityTracking = () => {
    if (activityTimerRef.current) {
      console.log('Activity tracking already started')
      return
    }

    console.log('Starting activity tracking')
    lastActivityRef.current = Date.now()
    isActiveRef.current = true

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const updateActivity = () => {
      lastActivityRef.current = Date.now()
      if (!isActiveRef.current) {
        console.log('Resuming activity after inactivity')
        isActiveRef.current = true
      }
    }

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    // Check for inactivity every 30 seconds
    const inactivityCheck = setInterval(() => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current
      
      // If inactive for more than 2 minutes, pause the timer
      if (timeSinceLastActivity > 120000 && isActiveRef.current) {
        console.log('Pausing timer due to inactivity')
        isActiveRef.current = false
      }
    }, 30000)

    activityTimerRef.current = {
      cleanup: () => {
        console.log('Cleaning up activity tracking')
        activityEvents.forEach(event => {
          document.removeEventListener(event, updateActivity, true)
        })
        clearInterval(inactivityCheck)
      }
    }
  }

  // Start coin timer
  const startCoinTimer = () => {
    if (coinTimerRef.current) {
      console.log('Coin timer already started')
      return
    }

    console.log('Starting coin timer')
    
    // Add a debug timer that fires every 10 seconds to check if the main timer is working
    const debugTimer = setInterval(() => {
      console.log('Debug timer tick - session time:', getCurrentSessionTime(), 'seconds')
    }, 10000)
    
    coinTimerRef.current = {
      debugTimer,
      cleanup: () => {
        console.log('Cleaning up coin timer')
        clearInterval(debugTimer)
      }
    }
    console.log('✅ Coin timer started successfully, will award every 60 seconds')
  }

  // Automatic coin awarding effect
  useEffect(() => {
    if (!isSessionActive || !user) {
      console.log('Coin awarding effect: conditions not met')
      return
    }

    console.log('Setting up automatic coin awarding...')
    
    // Track the last minute we awarded a coin to prevent duplicates
    let lastAwardedMinute = -1
    
    // Function to check if we should award a coin at exact minute boundaries
    const checkAndAwardCoin = () => {
      const currentTime = new Date()
      const currentSeconds = currentTime.getSeconds()
      const currentMinutes = currentTime.getMinutes()
      const currentHours = currentTime.getHours()
      
      // Calculate total minutes since midnight for unique identification
      const totalMinutes = currentHours * 60 + currentMinutes
      
      // Only award if we're exactly at 0 seconds AND we haven't awarded for this minute yet
      if (currentSeconds === 0 && totalMinutes !== lastAwardedMinute) {
        const awardTimeString = currentTime.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })
        
        console.log(`✅ EXACT MINUTE BOUNDARY REACHED: ${awardTimeString}`)
        console.log(`Session time: ${getCurrentSessionTime()} seconds`)
        
        if (isActiveRef.current && user && isSessionActive) {
          console.log('✅ Awarding coin at exact minute boundary!')
          lastAwardedMinute = totalMinutes
          awardCoins(1)
        }
      }
    }
    
    // Check every second for exact minute boundaries
    const preciseTimer = setInterval(checkAndAwardCoin, 1000)
    
    // Store the interval for cleanup
    coinTimerRef.current = {
      ...coinTimerRef.current,
      preciseTimer,
      cleanup: () => {
        console.log('Cleaning up precise coin timer')
        if (coinTimerRef.current?.debugTimer) {
          clearInterval(coinTimerRef.current.debugTimer)
        }
        if (preciseTimer) {
          clearInterval(preciseTimer)
        }
      }
    }
    
    console.log('✅ Precise coin timer set up, will award exactly at minute boundaries (60, 120, 180 seconds)')

    return () => {
      console.log('Cleaning up precise coin timer')
      if (preciseTimer) {
        clearInterval(preciseTimer)
      }
    }
  }, [isSessionActive, user]) // Dependencies ensure this re-runs when session starts

  // Award coins
  const awardCoins = async (amount) => {
    if (!user || !isSessionActive) return

    try {
      console.log(`Awarding ${amount} coin(s) to user ${user.id}`)
      
      // Update coins immediately for better UX
      const currentCoins = coins
      const newCoins = currentCoins + amount
      setCoins(newCoins)
      
      // Show notification immediately
      showCoinsEarnedNotification(amount)
      
      // Emit custom event for real-time leaderboard updates
      window.dispatchEvent(new CustomEvent('coinsAwarded', { 
        detail: { userId: user.id, amount, newTotal: newCoins } 
      }))
      
      // Then update the database
      const { data, error } = await supabase.rpc('award_coins', {
        user_id: user.id,
        coins_to_award: amount
      })

      if (error) {
        console.error('Error awarding coins:', error)
        // Revert the coins if database update failed
        setCoins(currentCoins)
        return
      }

      // Ensure we have the correct final amount from database
      if (data && data !== newCoins) {
        setCoins(data)
      }
      
      console.log(`Successfully awarded ${amount} coin(s). New total: ${data || newCoins}`)
      return data
    } catch (error) {
      console.error('Error awarding coins:', error)
      // Revert the coins if there was an error
      setCoins(coins - amount)
    }
  }

  // Show coins earned notification
  const showCoinsEarnedNotification = (coinsEarned) => {
    if (coinsEarned > 0 && user && isSessionActive) {
      // Create a temporary notification element
      const notification = document.createElement('div')
      notification.className = 'fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full'
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span class="text-lg">🪙</span>
          <span>+${coinsEarned} coin earned for being active!</span>
        </div>
      `
      
      document.body.appendChild(notification)
      
      // Animate in
      setTimeout(() => {
        notification.style.transform = 'translateX(0)'
      }, 100)
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)'
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 300)
      }, 3000)
    }
  }

  // Cleanup all timers and listeners
  const cleanupAll = () => {
    console.log('Cleaning up all timers and listeners')
    
    // Cleanup activity tracking
    if (activityTimerRef.current) {
      activityTimerRef.current.cleanup()
      activityTimerRef.current = null
    }

    // Cleanup coin timer (debug timer only now)
    if (coinTimerRef.current) {
      coinTimerRef.current.cleanup()
      coinTimerRef.current = null
    }

    // Reset refs
    lastActivityRef.current = Date.now()
    isActiveRef.current = true
    isInitializedRef.current = false
  }

  // Calculate current session time in seconds
  const getCurrentSessionTime = () => {
    if (!sessionStartTime || !isSessionActive) {
      return 0
    }
    return Math.floor((Date.now() - sessionStartTime) / 1000)
  }

  // Calculate current session time in minutes
  const getCurrentSessionMinutes = () => {
    if (!sessionStartTime || !isSessionActive) {
      return 0
    }
    return Math.floor((Date.now() - sessionStartTime) / 60000)
  }

  // Update timeActive based on actual session time
  useEffect(() => {
    if (!isSessionActive || !sessionStartTime) {
      setTimeActive(0)
      return
    }

    const updateTimeActive = () => {
      const currentMinutes = getCurrentSessionMinutes()
      setTimeActive(currentMinutes)
    }

    // Update immediately
    updateTimeActive()

    // Then update every minute
    const timeUpdateInterval = setInterval(updateTimeActive, 60000)

    return () => {
      clearInterval(timeUpdateInterval)
    }
  }, [isSessionActive, sessionStartTime])

  // Test function to manually award coins (for debugging)
  const testAwardCoins = async (amount = 1) => {
    console.log('Testing manual coin award...')
    if (!user) {
      console.log('No user logged in')
      return
    }
    if (!isSessionActive) {
      console.log('Session not active')
      return
    }
    console.log('Manual coin award test - awarding', amount, 'coins')
    await awardCoins(amount)
  }

  // Force trigger timer check (for debugging)
  const forceTimerCheck = () => {
    console.log('Force triggering timer check...')
    console.log('Current conditions:')
    console.log('- isActiveRef.current:', isActiveRef.current)
    console.log('- user:', !!user)
    console.log('- isSessionActive:', isSessionActive)
    console.log('- Current session time:', getCurrentSessionTime(), 'seconds')
    
    if (isActiveRef.current && user && isSessionActive) {
      console.log('Conditions met - forcing coin award')
      awardCoins(1)
    } else {
      console.log('Conditions not met for forced award')
    }
  }

  // Manually trigger the timer interval (for debugging)
  const triggerTimerInterval = () => {
    console.log('=== MANUALLY TRIGGERING TIMER INTERVAL ===')
    if (coinTimerRef.current && coinTimerRef.current.timer) {
      console.log('Timer exists, manually executing timer logic...')
      
      console.log('Current session time:', getCurrentSessionTime(), 'seconds')
      console.log('Conditions check:')
      console.log('- isActiveRef.current:', isActiveRef.current)
      console.log('- user:', !!user)
      console.log('- isSessionActive:', isSessionActive)
      
      if (isActiveRef.current && user && isSessionActive) {
        console.log('✅ All conditions met - awarding coin!')
        awardCoins(1)
      } else {
        console.log('❌ Conditions not met - skipping coin award')
      }
    } else {
      console.log('❌ Timer not found!')
    }
  }

  // Initialize when user changes
  useEffect(() => {
    console.log('User effect triggered:', { user: !!user, userId: user?.id })
    
    if (user) {
      console.log('User logged in, initializing coins system')
      loadUserCoins()
      initializeSession()
    } else {
      console.log('User logged out, clearing coins system')
      setCoins(0)
      setTimeActive(0)
      setIsSessionActive(false)
      setSessionStartTime(null)
      cleanupAll()
    }
  }, [user])

  // Listen for real-time coins changes
  useEffect(() => {
    if (!user) return

    const coinsSubscription = supabase
      .channel('coins_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new && payload.new.coins !== undefined) {
            console.log('Updating coins from realtime:', payload.new.coins)
            setCoins(payload.new.coins)
          }
        }
      )
      .subscribe()

    return () => {
      coinsSubscription.unsubscribe()
    }
  }, [user])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAll()
    }
  }, [])

  const value = {
    coins,
    isLoading,
    timeActive,
    isSessionActive,
    sessionStartTime,
    getCurrentSessionTime,
    loadUserCoins,
    testAwardCoins,
    forceTimerCheck,
    triggerTimerInterval
  }

  return (
    <CoinsContext.Provider value={value}>
      {children}
    </CoinsContext.Provider>
  )
}
