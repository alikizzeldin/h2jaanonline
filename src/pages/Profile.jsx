import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LetterAvatar from '../components/LetterAvatar'
import GradientText from '../components/GradientText'
import { 
  User, 
  Mail, 
  Save, 
  Edit3,
  Github,
  Chrome,
  Calendar,
  MapPin,
  Briefcase,
  LogOut,
  Shield,
  Palette,
  Sparkles
} from 'lucide-react'

export default function Profile() {
  const { user, loading, signOut, isAdmin, clearProfileCache } = useAuth()
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    location: '',
    website: '',
    company: '',
    text_gradient_enabled: false,
    text_gradient_purchased: false
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
      return
    }

    if (user) {
      fetchProfile()
    }
  }, [user, loading, navigate])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // Create initial profile
        const newProfile = {
          id: user.id,
          username: user.user_metadata?.user_name || user.email?.split('@')[0] || '',
          full_name: user.user_metadata?.full_name || '',
          bio: '',
          location: '',
          website: '',
          company: '',
          text_gradient_enabled: false,
          text_gradient_purchased: false
        }
        setProfile(newProfile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGradientToggle = async () => {
    try {
      const newGradientState = !profile.text_gradient_enabled
      
      // Update the profile state immediately for UI responsiveness
      setProfile(prev => ({
        ...prev,
        text_gradient_enabled: newGradientState
      }))

      // Update the database (only the enabled state, not the purchased state)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          text_gradient_enabled: newGradientState,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating gradient setting:', error)
        // Revert the state if there was an error
        setProfile(prev => ({
          ...prev,
          text_gradient_enabled: !newGradientState
        }))
        setError('Failed to update gradient setting')
        return
      }

      // Clear the profile cache to force a refresh
      clearProfileCache(user.id)
      
      setSuccess(`Gradient effect ${newGradientState ? 'enabled' : 'disabled'} successfully!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error toggling gradient:', error)
      setError('Failed to update gradient setting')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-lighter to-dark" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />
        
        {/* Floating Orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-xl opacity-70"
            style={{
              background: `radial-gradient(circle, ${
                ['#6366f1', '#8b5cf6', '#06b6d4'][i % 3]
              }40, transparent 70%)`,
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Mobile Action Buttons */}
      <div className="lg:hidden absolute top-6 right-6 z-20 flex space-x-2">
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 hover:text-primary/80 transition-all duration-300"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Admin</span>
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </div>

      {/* Profile Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              My Profile
            </h1>
            <p className="text-gray-300 text-lg">
              Manage your account information and preferences
            </p>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400"
            >
              {success}
            </motion.div>
          )}

          {/* Profile Card */}
          <div className="glass p-8 rounded-2xl border border-white/10">
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
              <LetterAvatar
                username={profile.username}
                fullName={profile.full_name}
                size="w-32 h-32"
                textSize="text-4xl"
              />

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <h2 className="text-2xl font-bold">
                    <GradientText 
                      enabled={profile.text_gradient_enabled}
                      className="text-white"
                    >
                      {profile.full_name || profile.username || 'Anonymous User'}
                    </GradientText>
                  </h2>
                  {user.user_metadata?.provider === 'github' && (
                    <Github className="w-5 h-5 text-gray-400" />
                  )}
                  {user.user_metadata?.provider === 'google' && (
                    <Chrome className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-400 mb-2">@{profile.username}</p>
                <p className="text-gray-300 flex items-center justify-center md:justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </motion.button>
                ) : (
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditing(false)
                        fetchProfile() // Reset changes
                      }}
                      className="px-4 py-2 bg-gray-600 rounded-lg text-white font-medium hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter full name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Company
                </label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Company name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://your-website.com"
                />
              </div>

              {/* Text Gradient Customization Section */}
              {profile.text_gradient_purchased && (
                <div className="md:col-span-2">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20">
                        <Palette className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Text Gradient Customization</h3>
                        <p className="text-gray-400 text-sm">Customize your name appearance across the website</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Preview Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Preview
                        </label>
                        <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                          <div className="text-center">
                            <GradientText 
                              enabled={true}
                              className="text-2xl font-bold"
                            >
                              {profile.full_name || profile.username || 'Your Name'}
                            </GradientText>
                            <p className="text-gray-400 text-sm mt-2">
                              This is how your name will appear in leaderboards and across the website
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Gradient Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Gradient Style
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 cursor-pointer hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300">
                            <div className="text-center">
                              <div className="text-lg font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent animate-gradient-x mb-2">
                                Red & Black Gradient
                              </div>
                              <p className="text-gray-400 text-xs">Animated red and black gradient</p>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-500/10 border border-gray-500/30 cursor-not-allowed opacity-50">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-400 mb-2">
                                More Styles Coming Soon
                              </div>
                              <p className="text-gray-500 text-xs">Stay tuned for more gradient options</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Gradient Section */}
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <label className="text-sm font-medium text-gray-300">
                              Gradient Effect
                            </label>
                          </div>
                        </div>
                        <button
                          onClick={handleGradientToggle}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                            profile.text_gradient_enabled
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
                          }`}
                        >
                          {profile.text_gradient_enabled ? 'Turn Off' : 'Turn On'}
                        </button>
                      </div>

                      {/* Info Section */}
                      <div className="flex items-start space-x-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="text-blue-300 font-medium mb-1">Gradient Feature Active</h4>
                          <p className="text-blue-400 text-sm">
                            Your name will now appear with the animated red and black gradient effect across all pages where your name is displayed, including leaderboards and profile sections.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchase Gradient Feature Section */}
              {!profile.text_gradient_enabled && (
                <div className="md:col-span-2">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-600/20">
                        <Palette className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Unlock Text Gradient</h3>
                        <p className="text-gray-400 text-sm">Make your name stand out with animated gradients</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Preview of what they could have */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Preview (After Purchase)
                        </label>
                        <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent animate-gradient-x">
                              {profile.full_name || profile.username || 'Your Name'}
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                              Your name with animated red and black gradient
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Button */}
                      <div className="text-center">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/shop')}
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 glow"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span>Purchase for 50 Coins</span>
                        </motion.button>
                        <p className="text-gray-400 text-sm mt-2">
                          Visit the shop to purchase this exclusive feature
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
