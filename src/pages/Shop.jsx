import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useCoins } from '../contexts/CoinsContext'
import { supabase } from '../lib/supabase'
import { 
  ShoppingBag, 
  Sparkles, 
  Crown, 
  Star, 
  Zap, 
  Target, 
  Check, 
  X,
  Palette,
  Coins
} from 'lucide-react'

export default function Shop() {
  const { user, userProfile: authUserProfile, updateProfileCache, clearProfileCache } = useAuth()
  const { coins } = useCoins()
  const [loading, setLoading] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  const textGradientFeature = {
    id: 'text-gradient-animation',
    name: 'Red & Black Text Gradient',
    description: 'Add a stunning animated red and black gradient effect to your profile text across the website',
    price: 50,
    icon: Palette,
    preview: 'Red & Black Gradient',
    category: 'Profile Customization'
  }

  useEffect(() => {
    if (authUserProfile) {
      setUserProfile(authUserProfile)
    }
  }, [authUserProfile])

  const handlePurchase = async (item) => {
    if (!user) return
    
    if (coins < item.price) {
      alert('Not enough coins! You need ' + item.price + ' coins to purchase this item.')
      return
    }

    setLoading(true)
    
    try {
      // Deduct coins
      const { error: coinsError } = await supabase.rpc('award_coins', {
        user_id: user.id,
        coins_to_award: -item.price
      })

      if (coinsError) {
        console.error('Error deducting coins:', coinsError)
        alert('Purchase failed. Please try again.')
        return
      }

      // Enable the feature and mark as purchased
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          text_gradient_enabled: true,
          text_gradient_purchased: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        alert('Purchase failed. Please try again.')
        return
      }

      // Clear the cache and let AuthContext refetch fresh data
      clearProfileCache(user.id)
      
      setPurchaseSuccess(true)
      
      // Refresh coins display
      window.dispatchEvent(new CustomEvent('coinsAwarded', { 
        detail: { userId: user.id, amount: -item.price, newTotal: coins - item.price } 
      }))

      setTimeout(() => {
        setPurchaseSuccess(false)
      }, 3000)

    } catch (error) {
      console.error('Error during purchase:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Shop Access Required</h2>
          <p className="text-gray-400">Please sign in to access the shop.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-10 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black/20 to-red-800/20 animate-pulse"></div>
        
        {/* Floating geometric shapes */}
        {[...Array(15)].map((_, i) => {
          const shapes = ['triangle', 'circle', 'square', 'x']
          const shape = shapes[i % shapes.length]
          const size = Math.random() * 30 + 15
          
          return (
            <motion.div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: size,
                height: size,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "easeInOut"
              }}
            >
              {shape === 'triangle' && (
                <div className="w-full h-full border-l-2 border-b-2 border-red-500/40 transform rotate-45"></div>
              )}
              {shape === 'circle' && (
                <div className="w-full h-full border-2 border-red-600/40 rounded-full"></div>
              )}
              {shape === 'square' && (
                <div className="w-full h-full border-2 border-red-700/40 transform rotate-45"></div>
              )}
              {shape === 'x' && (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 border-l-2 border-red-500/40 transform rotate-45"></div>
                  <div className="absolute inset-0 border-l-2 border-red-600/40 transform -rotate-45"></div>
                </div>
              )}
            </motion.div>
          )
        })}

        {/* Shop-themed geometric shapes */}
        <motion.div
          className="absolute top-32 left-16 w-40 h-40 border-2 border-red-500/20 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-32 h-32 border-2 border-red-600/20 rounded-lg"
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 rounded-full bg-gradient-to-br from-red-500 to-red-700">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-white">Exclusive</span>
            <span className="text-gradient bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent animate-gradient-x">
              {' '}Shop
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Unlock amazing features and customize your profile with exclusive items from the shop!
          </p>

          {/* User Balance */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-md border border-red-500/30 rounded-full px-6 py-3">
            <Coins className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">{coins} coins available</span>
          </div>
        </motion.div>

        {/* Shop Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Gradient Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-red-600/5 to-red-700/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Item Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20">
                    <textGradientFeature.icon className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {textGradientFeature.name}
                    </h3>
                    <span className="text-red-400 text-sm font-medium">{textGradientFeature.category}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-bold text-xl">{textGradientFeature.price}</span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
                <h4 className="text-white font-semibold mb-3">Preview:</h4>
                <div className="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent animate-gradient-x">
                  {textGradientFeature.preview}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {textGradientFeature.description}
              </p>

              {/* Purchase Button */}
                              {authUserProfile?.text_gradient_enabled ? (
                <div className="flex items-center space-x-2 p-4 rounded-2xl bg-green-500/10 border border-green-500/30">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Already Purchased!</span>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(textGradientFeature)}
                  disabled={loading || coins < textGradientFeature.price}
                  className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${
                    coins < textGradientFeature.price
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl hover:shadow-red-500/30 glow'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Purchase for {textGradientFeature.price} coins</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Coming Soon Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-gray-600/5 to-gray-700/5 rounded-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="p-4 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 inline-block mb-6">
                <Star className="w-12 h-12 text-gray-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">More Items Coming Soon!</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                We're working on amazing new features and customizations. Stay tuned for more exclusive items!
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <Zap className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Custom Profile Themes</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <Crown className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Exclusive Badges</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <Target className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Special Animations</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {purchaseSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <Check className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Purchase Successful!</div>
                  <div className="text-sm opacity-90">Text gradient feature activated</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
