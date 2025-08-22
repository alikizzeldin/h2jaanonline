import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogIn, LogOut, User, Home, Users, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LetterAvatar from './LetterAvatar'
import Logo from './Logo'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, signOut, loading, userProfile, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Debug auth state
  useEffect(() => {
    console.log('Navigation - Auth state:', { 
      user: !!user, 
      loading, 
      userEmail: user?.email,
      hasProfile: !!userProfile
    })
  }, [user, loading, userProfile])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
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
    { name: 'Gaming', section: 'gaming' },
    { name: 'Friends', section: 'friends', isPage: true },
    { name: 'Contact', section: 'contact' },
  ]

  const mobileNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Friends', path: '/friends', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ]

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
                  {user ? (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
                      >
                        <LetterAvatar
                          username={userProfile?.username || user.user_metadata?.user_name || user.email?.split('@')[0]}
                          fullName={userProfile?.full_name || user.user_metadata?.full_name}
                          size="w-8 h-8"
                          textSize="text-sm"
                        />
                        <span>{userProfile?.username || user.user_metadata?.user_name || user.email?.split('@')[0]}</span>
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

      {/* Remove bottom padding since nav is now floating */}
      <div className="md:hidden h-0"></div>
    </>
  )
}
