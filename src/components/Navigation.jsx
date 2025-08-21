import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LetterAvatar from './LetterAvatar'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch user profile data
  useEffect(() => {
    if (user) {
      fetchUserProfile()
      
      // Set up real-time subscription for profile changes
      const subscription = supabase
        .channel('profile_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new) {
              setUserProfile(payload.new)
            }
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  const fetchUserProfile = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setUserProfile(data)
      } else {
        // Fallback to user metadata if no profile exists
        setUserProfile({
          username: user.user_metadata?.user_name || user.email?.split('@')[0] || '',
          full_name: user.user_metadata?.full_name || ''
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Fallback to user metadata
      setUserProfile({
        username: user.user_metadata?.user_name || user.email?.split('@')[0] || '',
        full_name: user.user_metadata?.full_name || ''
      })
    }
  }

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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-gradient">
                Ali Izzeldin
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        className="md:hidden overflow-hidden glass backdrop-blur-md"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ x: 10 }}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10 w-full text-left"
              onClick={() => handleNavClick(item.section, item.isPage)}
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  )
}
