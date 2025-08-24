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
  const { user } = useAuth()
  
  const activityTimerRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const isActiveRef = useRef(true)

  // Load user's coins when user changes
  useEffect(() => {
    if (user) {
      loadUserCoins()
      startActivityTracking()
    } else {
      setCoins(0)
      setTimeActive(0)
      stopActivityTracking()
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
          console.log('CoinsContext: Profile change detected:', payload)
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
      stopActivityTracking()
    }
  }, [])

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

  const startActivityTracking = () => {
    if (!user) return

    // Set up activity detection
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const updateActivity = () => {
      lastActivityRef.current = Date.now()
      if (!isActiveRef.current) {
        isActiveRef.current = true
        startTimer()
      }
    }

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    // Start the timer
    startTimer()

    // Check for inactivity every 30 seconds
    const inactivityCheck = setInterval(() => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current
      
      // If inactive for more than 2 minutes, pause the timer
      if (timeSinceLastActivity > 120000 && isActiveRef.current) {
        isActiveRef.current = false
        stopTimer()
      }
    }, 30000)

    // Store cleanup function
    activityTimerRef.current = {
      cleanup: () => {
        activityEvents.forEach(event => {
          document.removeEventListener(event, updateActivity, true)
        })
        clearInterval(inactivityCheck)
        stopTimer()
      }
    }
  }

  const stopActivityTracking = () => {
    if (activityTimerRef.current) {
      activityTimerRef.current.cleanup()
      activityTimerRef.current = null
    }
  }

  const startTimer = () => {
    // Award coins every minute (60000ms)
    const timer = setInterval(async () => {
      if (isActiveRef.current && user) {
        await awardCoins(1) // Award 1 coin per minute
        setTimeActive(prev => prev + 1)
      }
    }, 60000)

    // Store timer reference
    if (activityTimerRef.current) {
      activityTimerRef.current.timer = timer
    }
  }

  const stopTimer = () => {
    if (activityTimerRef.current && activityTimerRef.current.timer) {
      clearInterval(activityTimerRef.current.timer)
      activityTimerRef.current.timer = null
    }
  }

  const awardCoins = async (amount) => {
    if (!user) return

    try {
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
      
      return data
    } catch (error) {
      console.error('Error awarding coins:', error)
      // Revert the coins if there was an error
      setCoins(coins - amount)
    }
  }

  const showCoinsEarnedNotification = (coinsEarned) => {
    if (coinsEarned > 0) {
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

  const value = {
    coins,
    isLoading,
    timeActive,
    loadUserCoins
  }

  return (
    <CoinsContext.Provider value={value}>
      {children}
    </CoinsContext.Provider>
  )
}
