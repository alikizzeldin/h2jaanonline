import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar'
import AvatarUpload from '../components/AvatarUpload'
import { ArrowLeft, Users, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AvatarTestPage() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [allProfiles, setAllProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchAllProfiles()
  }, [user, navigate])

  const fetchAllProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar, medals')
        .order('medals', { ascending: false })
        .limit(20)

      if (error) throw error
      setAllProfiles(data || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (avatarData) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: avatarData })
        .eq('id', user.id)

      if (error) throw error

      // Refresh the profiles list
      fetchAllProfiles()
    } catch (error) {
      console.error('Error updating avatar:', error)
      alert('Failed to update avatar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-lighter to-dark" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-24 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Avatar System Test
          </h1>
          <p className="text-xl text-gray-300">
            Test the avatar upload and display system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="glass p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Upload Your Avatar
            </h2>
            
            <div className="flex justify-center mb-6">
              <AvatarUpload
                currentAvatar={userProfile?.avatar}
                onAvatarChange={handleAvatarChange}
                size={150}
              />
            </div>

            <div className="text-center text-sm text-gray-400 space-y-2">
              <p>• Drag and drop an image or click to select</p>
              <p>• Maximum file size: 5MB</p>
              <p>• Supported formats: JPG, PNG, GIF, WebP</p>
              <p>• Images will be automatically compressed</p>
            </div>
          </div>

          {/* Current User Avatar */}
          <div className="glass p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Crown className="w-6 h-6 mr-2" />
              Your Avatar Preview
            </h2>
            
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Large (150px)</p>
                <Avatar
                  src={userProfile?.avatar}
                  alt={userProfile?.full_name || userProfile?.username}
                  size={150}
                  fallbackText={userProfile?.username}
                  showBorder={true}
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Medium (80px)</p>
                <Avatar
                  src={userProfile?.avatar}
                  alt={userProfile?.full_name || userProfile?.username}
                  size={80}
                  fallbackText={userProfile?.username}
                  showBorder={true}
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Small (40px)</p>
                <Avatar
                  src={userProfile?.avatar}
                  alt={userProfile?.full_name || userProfile?.username}
                  size={40}
                  fallbackText={userProfile?.username}
                  showBorder={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* All Users Avatars */}
        <div className="glass p-8 rounded-2xl border border-white/10 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            All Users Avatars ({allProfiles.length})
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {allProfiles.map((profile, index) => (
              <motion.div
                key={profile.username || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Avatar
                  src={profile.avatar}
                  alt={profile.full_name || profile.username}
                  size={60}
                  fallbackText={profile.username}
                  showBorder={true}
                />
                <p className="text-sm text-gray-300 mt-2 truncate">
                  {profile.full_name || profile.username}
                </p>
                <p className="text-xs text-gray-500">
                  {profile.medals || 0} medals
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
