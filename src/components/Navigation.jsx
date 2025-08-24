import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogIn, LogOut, User, Home, Users, Shield, Gamepad2, Store, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCoins } from '../contexts/CoinsContext'
import { supabase } from '../lib/supabase'
import Avatar from './Avatar'
import Logo from './Logo'
import CoinsDisplay from './CoinsDisplay'
import GradientText from './GradientText'
import { AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const { user, signOut, forceSignOut, loading, userProfile, isAdmin } = useAuth()
  const { coins, isLoading, isSessionActive, getCurrentSessionTime } = useCoins()
  const navigate = useNavigate()
  const location = useLocation()

  // Debug: Log when userProfile changes
  useEffect(() => {
    if (userProfile) {
      console.log('Navigation: userProfile updated:', userProfile)
      console.log('Navigation: text_gradient_enabled:', userProfile.text_gradient_enabled)
      console.log('Navigation: avatar present:', !!userProfile.avatar)
      console.log('Navigation: avatar length:', userProfile.avatar?.length || 0)
    }
  }, [userProfile])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      // If regular sign out fails, try force sign out
      await forceSignOut()
    }
    setUserMenuOpen(false)
  }

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

  const handleNavClick = (section, isPage = false) => {
    setIsOpen(false)
    
    if (isPage) {
      // Navigate to a different page
      navigate(`/${section}`)
    } else if (location.pathname !== '/') {
      // If not on home page, navigate to home first, then scroll
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      // If on home page, just scroll to section
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const navItems = [
    { name: 'Home', section: 'home' },
    { name: 'About', section: 'about' },
    { name: 'Skills', section: 'skills' },
    { name: 'Projects', section: 'projects' },
    { name: 'Creative', section: 'creative-skills' },
    ...(user ? [{ name: 'Games', section: 'games', isPage: true }] : []),
    ...(user ? [{ name: 'Friends', section: 'friends', isPage: true }] : []),
    { name: 'Contact', section: 'contact' },
  ]

  const mobileNavItems = [
    { name: 'Home', path: '/', icon: Home },
    ...(user ? [{ name: 'Games', path: '/games', icon: Gamepad2 }] : []),
    ...(user ? [{ name: 'Friends', path: '/friends', icon: Users }] : []),
    ...(user ? [{ name: 'Shop', path: '/shop', icon: Store }] : []),
    ...(user ? [{ name: 'Profile', path: '/profile', icon: User, isProfile: true }] : [{ name: 'Login', path: '/login', icon: LogIn }]),
  ]

  const [mobileProfileOpen, setMobileProfileOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
          scrolled ? 'glass backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/">
              <Logo size="default" />
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
                    onClick={() => handleNavClick(item.section, item.isPage)}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>

              {/* Auth Section */}
              {!loading && (
                <div className="flex items-center space-x-3 ml-6">
                  {user && <CoinsDisplay />}
                  {user && (
                    <Link to="/shop">
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center transition-all duration-300 group"
                      >
                        <Store className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-all duration-300 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                      </motion.button>
                    </Link>
                  )}
                  {user ? (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
                      >
                        <Avatar
                          src={userProfile?.avatar}
                          alt={userProfile?.full_name || userProfile?.username || user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0]}
                          size={32}
                          fallbackText={userProfile?.username || user.user_metadata?.user_name || user.email?.split('@')[0]}
                          showBorder={false}
                        />
                        <GradientText 
                          enabled={userProfile?.text_gradient_enabled}
                          className="text-gray-300 hover:text-white"
                        >
                          {userProfile?.username || user.user_metadata?.user_name || userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </GradientText>
                      </motion.button>

                      {/* User Menu Dropdown */}
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 mt-2 w-48 glass backdrop-blur-md rounded-md shadow-lg border border-white/10 z-50"
                        >
                          <div className="py-1">
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span>My Profile</span>
                            </Link>
                            {isAdmin && (
                              <Link
                                to="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <Shield className="w-4 h-4" />
                                <span>Admin Panel</span>
                              </Link>
                            )}
                            <div className="border-t border-white/10 my-1"></div>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <Link to="/login">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-md text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 glow"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </motion.button>
                    </Link>
                  )}
                </div>
              )}

              {/* Loading indicator */}
              {loading && (
                <div className="ml-6">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Coins Widget - Top Right */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="fixed top-4 right-4 z-50 md:hidden"
        >
          <div className={`relative overflow-hidden backdrop-blur-md border rounded-xl px-3 py-2 shadow-xl ${
            isSessionActive 
              ? 'bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-orange-500/10 border-yellow-500/40' 
              : 'bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/10 border-gray-500/40'
          }`}>
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
                animate={isSessionActive ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 3, -3, 0]
                } : {}}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-lg">
                  {isSessionActive ? '🪙' : '⏸️'}
                </span>
              </motion.div>

              {/* Content */}
              <div className="flex flex-col min-w-0">
                {/* Main coin count */}
                <div className={`font-bold text-sm ${
                  isSessionActive ? 'text-yellow-300' : 'text-gray-300'
                }`}>
                  {isLoading ? '...' : isSessionActive ? coins.toLocaleString() : 'Inactive'}
                </div>

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
          </div>
        </motion.div>
      )}

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100, scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        className="fixed bottom-6 left-0 right-0 flex justify-center z-50 md:hidden"
      >
        {/* Floating bubble container */}
        <div className="glass backdrop-blur-md border border-white/20 rounded-full shadow-2xl px-2 py-2">
          <div className="flex items-center space-x-1">
            {mobileNavItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              if (item.isProfile) {
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${
                      mobileProfileOpen 
                        ? 'bg-gradient-to-br from-primary via-secondary to-pink-500 text-white shadow-lg shadow-primary/30' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    
                    {/* Active indicator ring */}
                    {mobileProfileOpen && (
                      <motion.div
                        layoutId="activeRing"
                        className="absolute inset-0 rounded-full border-2 border-white/30"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Glow effect for active state */}
                    {mobileProfileOpen && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
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
              
              return (
                <Link key={item.name} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-primary via-secondary to-pink-500 text-white shadow-lg shadow-primary/30' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    
                    {/* Active indicator ring */}
                    {isActive && (
                      <motion.div
                        layoutId="activeRing"
                        className="absolute inset-0 rounded-full border-2 border-white/30"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Glow effect for active state */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Profile Menu */}
      <AnimatePresence>
        {mobileProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-40 md:hidden"
          >
            <div className="glass backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-4 min-w-[200px]">
              <div className="space-y-3">
                {/* My Profile Title */}
                <div className="text-center pb-2 border-b border-white/10">
                  <h3 className="text-white font-semibold text-sm">My Profile</h3>
                </div>
                
                {/* Profile Link */}
                <Link
                  to="/profile"
                  onClick={() => setMobileProfileOpen(false)}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </Link>
                
                {/* Admin Panel (if admin) */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileProfileOpen(false)}
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                {/* Divider */}
                <div className="border-t border-white/10 my-2"></div>
                
                {/* Sign Out */}
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileProfileOpen(false)
                  }}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove bottom padding since nav is now floating */}
      <div className="md:hidden h-0"></div>
    </>
  )
}
