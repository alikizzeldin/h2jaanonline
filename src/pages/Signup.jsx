import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, Github, Chrome, ArrowLeft, User } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { signUp, signInWithGoogle, signInWithGitHub } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Account created! Please check your email to verify your account.')
      setTimeout(() => navigate('/login'), 3000)
    }
    
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  const handleGitHubSignIn = async () => {
    setLoading(true)
    const { error } = await signInWithGitHub()
    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-lighter to-dark" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />
        
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-xl opacity-70"
            style={{
              background: `radial-gradient(circle, ${
                ['#6366f1', '#8b5cf6', '#06b6d4'][i % 3]
              }40, transparent 70%)`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Spline Robot */}
      <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block">
        <div className="relative w-full h-full flex items-center justify-end pr-8">
          <div className="relative">
            {/* Welcome Message Cloud */}
                         <motion.div
               initial={{ opacity: 0, y: -20, scale: 0.8 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="absolute -top-20 left-1/6 transform -translate-x-1/2"
             >
              {/* Cloud shape with multiple circles */}
              <div className="relative">
                {/* Main cloud body */}
                <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-md border border-primary/30 rounded-[50px] px-8 py-6 shadow-2xl">
                  {/* Cloud puffs */}
                  <div className="absolute -top-3 -left-2 w-8 h-8 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-sm"></div>
                  <div className="absolute -top-2 -right-1 w-6 h-6 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full blur-sm"></div>
                  <div className="absolute -bottom-2 left-4 w-5 h-5 bg-gradient-to-br from-primary/25 to-secondary/25 rounded-full blur-sm"></div>
                  <div className="absolute -bottom-1 right-6 w-4 h-4 bg-gradient-to-br from-secondary/25 to-primary/25 rounded-full blur-sm"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="flex items-center justify-center space-x-2 mb-2"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.0 }}
                      className="text-white font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    >
                      Welcome! 👋
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      className="text-gray-200 text-sm mt-1 font-medium"
                    >
                      Ready to explore amazing things?
                    </motion.p>
                  </div>
                </div>
                
                {/* Cloud tail with gradient */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-primary/20"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-secondary/20"></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="w-96 h-96">
              <iframe 
                src='https://my.spline.design/genkubgreetingrobot-f95PGdQ2gbUnBL9tjZWI2Mgx/' 
                frameborder='0' 
                width='100%' 
                height='100%'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Portfolio</span>
      </Link>

      {/* Signup Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
                 <div className="glass p-8 rounded-2xl border border-white/10">
           {/* Header */}
           <div className="text-center mb-8">
             <h1 className="text-3xl font-bold text-gradient mb-2">Create Account</h1>
             <p className="text-gray-300">Join the community and get started</p>
           </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all duration-200 disabled:opacity-50"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all duration-200 disabled:opacity-50"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark text-gray-400">Or create with email</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 glow"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
