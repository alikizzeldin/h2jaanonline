import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, Save, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LetterAvatar from '../components/LetterAvatar'

export default function ProfileSetup() {
  const { user, completeProfileSetup } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    location: '',
    website: '',
    company: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Pre-fill form with OAuth data if available
    setFormData({
      username: user.user_metadata?.user_name || user.email?.split('@')[0] || '',
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      bio: '',
      location: '',
      website: '',
      company: ''
    })
  }, [user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if username is already taken
      if (formData.username) {
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', formData.username)
          .neq('id', user.id)
          .single()

        if (existingUser) {
          alert('Username is already taken. Please choose a different one.')
          setLoading(false)
          return
        }
      }

      // Update profile with form data
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username || null,
          full_name: formData.full_name || null,
          bio: formData.bio || null,
          location: formData.location || null,
          website: formData.website || null,
          company: formData.company || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        alert('Error saving profile. Please try again.')
        return
      }

      // Mark profile setup as complete and redirect to home page
      completeProfileSetup()
      navigate('/')
    } catch (error) {
      console.error('Error in profile setup:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const skipSetup = () => {
    completeProfileSetup()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <LetterAvatar
                username={formData.username}
                fullName={formData.full_name}
                size="w-20 h-20"
                textSize="text-2xl"
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-gray-400">
              Welcome to Ali's website! Let's set up your profile to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Enter your username"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="City, Country"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Your company"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="https://your-website.com"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.button
                type="submit"
                disabled={loading || !formData.username}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Complete Setup</span>
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={skipSetup}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none border border-white/20 px-6 py-3 rounded-lg text-gray-300 font-medium hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Skip for now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            You can always update your profile later from the profile page.
          </div>
        </div>
      </motion.div>
    </div>
  )
}
