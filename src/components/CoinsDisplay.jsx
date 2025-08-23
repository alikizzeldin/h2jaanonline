import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCoins } from '../contexts/CoinsContext'
import { useAuth } from '../contexts/AuthContext'

const CoinsDisplay = () => {
  const { coins, isLoading, timeActive } = useCoins()
  const { user } = useAuth()
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousCoins, setPreviousCoins] = useState(coins)

  // Animate when coins change
  useEffect(() => {
    if (coins > previousCoins && previousCoins > 0) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
    setPreviousCoins(coins)
  }, [coins, previousCoins])

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-md border border-yellow-500/30 rounded-full px-2 py-1 shadow-lg"
      title={`Active for ${timeActive} minutes - Earn 1 coin per minute!`}
    >
      <div className="flex items-center space-x-1">
        <motion.span 
          className="text-lg"
          animate={isAnimating ? { 
            scale: [1, 1.3, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          🪙
        </motion.span>
        <div className="flex flex-col">
          <span className="text-yellow-400 text-xs font-medium">Coins</span>
          <motion.span 
            className="text-yellow-300 text-sm font-bold"
            animate={isAnimating ? { 
              scale: [1, 1.2, 1],
              color: ["#fbbf24", "#f59e0b", "#fbbf24"]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? '...' : coins.toLocaleString()}
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

export default CoinsDisplay
