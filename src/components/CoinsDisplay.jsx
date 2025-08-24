import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCoins } from '../contexts/CoinsContext'
import { useAuth } from '../contexts/AuthContext'
import { Clock, AlertCircle } from 'lucide-react'

const CoinsDisplay = () => {
  const { coins, isLoading, timeActive, isSessionActive, getCurrentSessionTime } = useCoins()
  const { user } = useAuth()
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousCoins, setPreviousCoins] = useState(coins)
  const [currentTime, setCurrentTime] = useState(0)

  // Animate when coins change
  useEffect(() => {
    if (coins > previousCoins && previousCoins > 0) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
    setPreviousCoins(coins)
  }, [coins, previousCoins])

  // Real-time timer for active session - synchronized with coin awarding
  useEffect(() => {
    if (!isSessionActive) {
      setCurrentTime(0)
      return
    }

    const timer = setInterval(() => {
      const newTime = getCurrentSessionTime()
      setCurrentTime(newTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [isSessionActive, getCurrentSessionTime])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Only show for logged-in users
  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden backdrop-blur-md border rounded-xl px-3 py-2 shadow-xl ${
        isSessionActive 
          ? 'bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-orange-500/10 border-yellow-500/40' 
          : 'bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/10 border-gray-500/40'
      }`}
      title={
        isSessionActive 
          ? `Active for ${timeActive} minutes - Earn 1 coin per minute!` 
          : 'Session inactive - Only one active session allowed per account'
      }
    >
      {/* Animated background glow */}
      {isSessionActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-yellow-500/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      <div className="relative z-10 flex items-center space-x-2">
        {/* Coin Icon */}
        <motion.div
          className={`relative p-1.5 rounded-full ${
            isSessionActive 
              ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20' 
              : 'bg-gradient-to-br from-gray-400/20 to-gray-500/20'
          }`}
          animate={isAnimating ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="text-lg">
            {isSessionActive ? '🪙' : '⏸️'}
          </span>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col min-w-0">
          {/* Main coin count */}
          <motion.div
            className={`font-bold text-sm ${
              isSessionActive ? 'text-yellow-300' : 'text-gray-300'
            }`}
            animate={isAnimating ? { 
              scale: [1, 1.1, 1],
              color: isSessionActive ? ["#fbbf24", "#f59e0b", "#fbbf24"] : ["#9ca3af", "#6b7280", "#9ca3af"]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? '...' : isSessionActive ? coins.toLocaleString() : 'Inactive'}
          </motion.div>

          {/* Timer and status row */}
          <div className="flex items-center space-x-2 mt-0.5">
            {/* Timer */}
            {isSessionActive && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-1"
              >
                <Clock className="w-3 h-3 text-yellow-400" />
                <span className="text-[11px] text-yellow-400 font-mono font-medium">
                  {formatTime(currentTime)}
                </span>
              </motion.div>
            )}

            {/* Status indicator */}
            {!isSessionActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-1"
              >
                <AlertCircle className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] text-gray-400 font-medium">
                  Session
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Subtle border glow */}
      {isSessionActive && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-yellow-500/30"
          animate={{
            boxShadow: [
              "0 0 10px rgba(251, 191, 36, 0.1)",
              "0 0 20px rgba(251, 191, 36, 0.2)",
              "0 0 10px rgba(251, 191, 36, 0.1)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}

export default CoinsDisplay
