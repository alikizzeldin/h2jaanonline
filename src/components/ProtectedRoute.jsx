import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { LogIn, Shield } from 'lucide-react'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-dark relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-lighter to-dark" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-8 rounded-2xl border border-white/10 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 rounded-full bg-gradient-to-br from-red-500 to-pink-500">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-gradient mb-4">
              Access Restricted
            </h1>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              This page is only available for registered users. Please sign in to continue.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/login'}
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 glow"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </motion.button>

            <p className="text-gray-400 text-sm mt-4">
              Don't have an account?{' '}
              <a 
                href="/signup" 
                className="text-primary hover:text-secondary transition-colors"
              >
                Sign up here
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  // Render the protected content if authenticated
  return children
}

export default ProtectedRoute
