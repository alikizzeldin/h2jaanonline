import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar'
import { 
  MessageSquare, 
  Calendar, 
  Trash2, 
  RefreshCw,
  Shield,
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  Crown,
  Trophy,
  Coins,
  Brain,
  Settings,
  BarChart3,
  Activity,
  Zap,
  Star,
  Award,
  Target,
  TrendingUp,
  Eye,
  Edit3,
  Ban,
  CheckCircle,
  AlertCircle,
  Database,
  Server,
  Globe,
  Palette,
  Bell,
  Lock,
  Unlock,
  ChevronDown,
  Check
} from 'lucide-react'

export default function Admin() {
  const { user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  
  // State for different sections
  const [activeSection, setActiveSection] = useState('overview')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
      return
    }

    if (!loading && !isAdmin) {
      navigate('/')
      return
    }

    if (isAdmin) {
      fetchAllData()
    }
  }, [user, loading, isAdmin, navigate])

  // Listen for real-time changes
  useEffect(() => {
    if (!isAdmin) return

    const subscription = supabase
      .channel('admin_realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages'
        },
        (payload) => {
          console.log('Admin: Message change detected:', payload)
          
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.new.id ? payload.new : msg
            ))
          }
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles'
        },
        (payload) => {
          console.log('Admin: Profile change detected:', payload)
          
          if (payload.eventType === 'INSERT') {
            setUsers(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setUsers(prev => prev.filter(u => u.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setUsers(prev => prev.map(u => 
              u.id === payload.new.id ? payload.new : u
            ))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [isAdmin])

  const fetchAllData = async () => {
    try {
      setLoadingData(true)
      await Promise.all([
        fetchMessages(),
        fetchUsers(),
        fetchStats()
      ])
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setError('Failed to load admin data')
    } finally {
      setLoadingData(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get total messages
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })

      // Get quiz stats
      const { data: quizStats } = await supabase
        .from('profiles')
        .select('medals, has_played_quiz, coins')

      const totalMedals = quizStats?.reduce((sum, user) => sum + (user.medals || 0), 0) || 0
      const quizPlayers = quizStats?.filter(user => user.has_played_quiz).length || 0
      const totalCoins = quizStats?.reduce((sum, user) => sum + (user.coins || 0), 0) || 0

      setStats({
        totalUsers,
        totalMessages,
        totalMedals,
        quizPlayers,
        totalCoins,
        avgMedals: totalUsers > 0 ? (totalMedals / totalUsers).toFixed(1) : 0,
        avgCoins: totalUsers > 0 ? (totalCoins / totalUsers).toFixed(1) : 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const deleteMessage = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting message:', error)
      setError('Failed to delete message')
    }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentStatus })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error toggling user status:', error)
      setError('Failed to update user status')
    }
  }

  const resetUserQuiz = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          has_played_quiz: false,
          medals: 0
        })
        .eq('id', userId)

      if (error) throw error
      
      // Refresh stats after quiz reset to update the overview
      await fetchStats()
    } catch (error) {
      console.error('Error resetting user quiz:', error)
      setError('Failed to reset user quiz')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const adminSections = [
    {
      id: 'overview',
      name: 'Overview',
      icon: BarChart3,
      description: 'Website statistics and insights'
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Users,
      description: 'Manage user accounts and permissions'
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: MessageSquare,
      description: 'View and manage contact messages'
    },
    {
      id: 'quiz',
      name: 'Quiz Management',
      icon: Brain,
      description: 'Monitor quiz performance and results'
    },
    {
      id: 'system',
      name: 'System Settings',
      icon: Settings,
      description: 'Website configuration and maintenance'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAllData}
                disabled={loadingData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Comprehensive website and user management</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-2 mb-8"
        >
          <div className="flex space-x-2 overflow-x-auto">
            {adminSections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.name}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'overview' && (
              <OverviewSection stats={stats} users={users} messages={messages} formatDate={formatDate} />
            )}
            
            {activeSection === 'users' && (
              <UsersSection 
                users={users} 
                onToggleStatus={toggleUserStatus}
                onResetQuiz={resetUserQuiz}
                loading={loadingData}
                formatDate={formatDate}
              />
            )}
            
            {activeSection === 'messages' && (
              <MessagesSection 
                messages={messages} 
                onDelete={deleteMessage}
                loading={loadingData}
                error={error}
                formatDate={formatDate}
              />
            )}
            
            {activeSection === 'quiz' && (
              <QuizSection users={users} stats={stats} />
            )}
            
            {activeSection === 'system' && (
              <SystemSection />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Overview Section Component
function OverviewSection({ stats, users, messages, formatDate }) {
  const recentUsers = users.slice(0, 5)
  const recentMessages = messages.slice(0, 5)

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12% this week'
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages || 0,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      change: '+5 today'
    },
    {
      title: 'Quiz Players',
      value: stats.quizPlayers || 0,
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      change: `${((stats.quizPlayers / stats.totalUsers) * 100 || 0).toFixed(1)}% participation`
    },
    {
      title: 'Total Coins',
      value: stats.totalCoins || 0,
      icon: Coins,
      color: 'from-yellow-500 to-yellow-600',
      change: `Avg: ${stats.avgCoins || 0} per user`
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
              <p className="text-green-400 text-xs">{stat.change}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <span>Recent Users</span>
            </h3>
            <span className="text-gray-400 text-sm">{recentUsers.length} users</span>
          </div>
          
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
              >
                <Avatar
                  src={user.avatar}
                  alt={user.full_name || user.username}
                  size={40}
                  fallbackText={user.username}
                  showBorder={false}
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{user.full_name || user.username}</p>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-sm">{user.coins || 0} coins</p>
                  <p className="text-gray-500 text-xs">{formatDate(user.created_at)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-green-400" />
              <span>Recent Messages</span>
            </h3>
            <span className="text-gray-400 text-sm">{recentMessages.length} messages</span>
          </div>
          
          <div className="space-y-4">
            {recentMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{message.sender_name}</p>
                  <p className="text-gray-500 text-xs">{formatDate(message.created_at)}</p>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{message.message}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Users Section Component
function UsersSection({ users, onToggleStatus, onResetQuiz, loading, formatDate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionType, setActionType] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [isBanning, setIsBanning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBanAction = (user, type) => {
    setSelectedUser(user)
    setActionType(type)
    setShowBanDialog(true)
  }

  const handleResetAction = (user) => {
    setSelectedUser(user)
    setShowResetDialog(true)
  }

  const confirmBanAction = async () => {
    if (selectedUser) {
      setIsBanning(true)
      try {
        await onToggleStatus(selectedUser.id, selectedUser.is_banned)
        setShowBanDialog(false)
        setSelectedUser(null)
        setActionType('')
        setSuccessMessage(`User ${actionType === 'ban' ? 'banned' : 'unbanned'} successfully!`)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } catch (error) {
        console.error('Error in ban action:', error)
      } finally {
        setIsBanning(false)
      }
    }
  }

  const confirmResetAction = async () => {
    if (selectedUser) {
      setIsResetting(true)
      try {
        await onResetQuiz(selectedUser.id)
        setShowResetDialog(false)
        setSelectedUser(null)
        setSuccessMessage('Quiz progress reset successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } catch (error) {
        console.error('Error in reset action:', error)
      } finally {
        setIsResetting(false)
      }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'banned' && user.is_banned) ||
                         (filterStatus === 'active' && !user.is_banned)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-400" />
          <span>User Management</span>
        </h2>
        <span className="text-gray-400">
          {filteredUsers.length} of {users.length} users
        </span>
      </div>

             {/* Filters */}
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="flex-1">
           <input
             type="text"
             placeholder="Search users by name, username, or email..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
           />
         </div>
         <div className="relative" ref={dropdownRef}>
           <button
             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             className="flex items-center justify-between w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:border-primary min-w-[160px]"
           >
             <span className="flex items-center space-x-2">
               {filterStatus === 'all' && <Users className="w-4 h-4" />}
               {filterStatus === 'active' && <UserCheck className="w-4 h-4" />}
               {filterStatus === 'banned' && <UserX className="w-4 h-4" />}
               <span>
                 {filterStatus === 'all' && 'All Users'}
                 {filterStatus === 'active' && 'Active Users'}
                 {filterStatus === 'banned' && 'Banned Users'}
               </span>
             </span>
             <motion.div
               animate={{ rotate: isDropdownOpen ? 180 : 0 }}
               transition={{ duration: 0.2 }}
             >
               <ChevronDown className="w-4 h-4" />
             </motion.div>
           </button>
           
           <AnimatePresence>
             {isDropdownOpen && (
               <motion.div
                 initial={{ opacity: 0, y: -10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -10, scale: 0.95 }}
                 transition={{ duration: 0.2 }}
                 className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden"
               >
                 <div className="py-2">
                   {[
                     { value: 'all', label: 'All Users', icon: Users, color: 'text-gray-600' },
                     { value: 'active', label: 'Active Users', icon: UserCheck, color: 'text-green-600' },
                     { value: 'banned', label: 'Banned Users', icon: UserX, color: 'text-red-600' }
                   ].map((option) => {
                     const Icon = option.icon
                     return (
                       <button
                         key={option.value}
                         onClick={() => {
                           setFilterStatus(option.value)
                           setIsDropdownOpen(false)
                         }}
                         className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/20 transition-colors duration-150 ${
                           filterStatus === option.value ? 'bg-primary/10 text-primary' : option.color
                         }`}
                       >
                         <Icon className="w-4 h-4" />
                         <span className="font-medium">{option.label}</span>
                         {filterStatus === option.value && (
                           <Check className="w-4 h-4 ml-auto" />
                         )}
                       </button>
                     )
                   })}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Users Found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                user.is_banned 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={user.avatar}
                    alt={user.full_name || user.username}
                    size={48}
                    fallbackText={user.username}
                    showBorder={true}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-semibold">{user.full_name || user.username}</h4>
                      {user.is_banned && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                          Banned
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">@{user.username}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-yellow-400">{user.coins || 0} coins</span>
                      <span className="text-yellow-500">{user.medals || 0} medals</span>
                      {user.has_played_quiz && (
                        <span className="text-green-400 flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Quiz</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">Joined {formatDate(user.created_at)}</p>
                  </div>
                  
                                     <div className="flex items-center space-x-2">
                     <button
                       onClick={() => handleBanAction(user, user.is_banned ? 'unban' : 'ban')}
                       className={`p-2 rounded-lg transition-colors ${
                         user.is_banned
                           ? 'text-green-400 hover:bg-green-500/20'
                           : 'text-red-400 hover:bg-red-500/20'
                       }`}
                       title={user.is_banned ? 'Unban user' : 'Ban user'}
                     >
                       {user.is_banned ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                     </button>
                     
                     {user.has_played_quiz && (
                       <button
                         onClick={() => handleResetAction(user)}
                         className="p-2 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors"
                         title="Reset quiz progress"
                       >
                         <RefreshCw className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ban/Unban Confirmation Dialog */}
      <AnimatePresence>
        {showBanDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-6 max-w-md w-full border border-white/20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${
                  actionType === 'ban' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {actionType === 'ban' ? <Ban className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {actionType === 'ban' ? 'Ban User' : 'Unban User'}
                  </h3>
                  <p className="text-gray-400 text-sm">Confirm this action</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-2">
                  Are you sure you want to {actionType === 'ban' ? 'ban' : 'unban'} 
                  <span className="text-white font-semibold"> {selectedUser?.full_name || selectedUser?.username}</span>?
                </p>
                {actionType === 'ban' && (
                  <p className="text-red-400 text-sm">
                    This user will lose access to the website until unbanned.
                  </p>
                )}
                {actionType === 'unban' && (
                  <p className="text-green-400 text-sm">
                    This user will regain access to the website.
                  </p>
                )}
              </div>
              
                             <div className="flex space-x-3">
                 <button
                   onClick={() => {
                     setShowBanDialog(false)
                     setSelectedUser(null)
                     setActionType('')
                   }}
                   disabled={isBanning}
                   className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={confirmBanAction}
                   disabled={isBanning}
                   className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                     actionType === 'ban'
                       ? 'bg-red-500 hover:bg-red-600 text-white'
                       : 'bg-green-500 hover:bg-green-600 text-white'
                   } disabled:opacity-50`}
                 >
                   {isBanning && <RefreshCw className="w-4 h-4 animate-spin" />}
                   <span>{actionType === 'ban' ? 'Ban User' : 'Unban User'}</span>
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Quiz Confirmation Dialog */}
      <AnimatePresence>
        {showResetDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-6 max-w-md w-full border border-white/20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Reset Quiz Progress</h3>
                  <p className="text-gray-400 text-sm">Confirm this action</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-2">
                  Are you sure you want to reset the quiz progress for 
                  <span className="text-white font-semibold"> {selectedUser?.full_name || selectedUser?.username}</span>?
                </p>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                  <p className="text-orange-400 text-sm font-medium mb-1">This will:</p>
                  <ul className="text-orange-300 text-sm space-y-1">
                    <li>• Reset medals to 0</li>
                    <li>• Allow them to retake the quiz</li>
                    <li>• Remove their current score</li>
                  </ul>
                </div>
              </div>
              
                             <div className="flex space-x-3">
                 <button
                   onClick={() => {
                     setShowResetDialog(false)
                     setSelectedUser(null)
                   }}
                   disabled={isResetting}
                   className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={confirmResetAction}
                   disabled={isResetting}
                   className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                 >
                   {isResetting && <RefreshCw className="w-4 h-4 animate-spin" />}
                   <span>Reset Quiz</span>
                 </button>
               </div>
            </motion.div>
                     </motion.div>
         )}
       </AnimatePresence>

       {/* Success Notification */}
       <AnimatePresence>
         {showSuccess && (
           <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 50, scale: 0.9 }}
             className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
           >
             <CheckCircle className="w-5 h-5" />
             <span className="font-medium">{successMessage}</span>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   )
 }

// Messages Section Component
function MessagesSection({ messages, onDelete, loading, error, formatDate }) {
  return (
    <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <MessageSquare className="w-6 h-6 text-green-400" />
              <span>Message Log</span>
            </h2>
            <span className="text-gray-400">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

      {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Messages Yet</h3>
              <p className="text-gray-500">Messages sent through the contact form will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
          {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(message.created_at)}</span>
                        </div>
                      </div>
                      
                                             <div className="space-y-2">
                         <div className="flex items-center space-x-2 mb-2">
                           <span className="text-primary font-medium">From:</span>
                           <span className="text-white font-semibold">{message.sender_name}</span>
                         </div>
                         <p className="text-white leading-relaxed whitespace-pre-wrap">
                           {message.message}
                         </p>
                       </div>
                    </div>
                    
                    <button
                  onClick={() => onDelete(message.id)}
                      className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
    </div>
  )
}

// Quiz Section Component
function QuizSection({ users, stats }) {
  const quizPlayers = users.filter(user => user.has_played_quiz)
  const topPlayers = quizPlayers
    .sort((a, b) => (b.medals || 0) - (a.medals || 0))
    .slice(0, 10)

  return (
    <div className="space-y-8">
      {/* Quiz Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{stats.quizPlayers || 0}</h3>
              <p className="text-gray-400 text-sm">Quiz Players</p>
            </div>
          </div>
          <p className="text-green-400 text-sm">
            {((stats.quizPlayers / stats.totalUsers) * 100 || 0).toFixed(1)}% participation rate
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{stats.totalMedals || 0}</h3>
              <p className="text-gray-400 text-sm">Total Medals</p>
            </div>
          </div>
          <p className="text-yellow-400 text-sm">
            Avg: {stats.avgMedals || 0} medals per user
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {quizPlayers.filter(u => (u.medals || 0) >= 8).length}
              </h3>
              <p className="text-gray-400 text-sm">Perfect Scores</p>
            </div>
          </div>
          <p className="text-green-400 text-sm">
            {quizPlayers.length > 0 ? ((quizPlayers.filter(u => (u.medals || 0) >= 8).length / quizPlayers.length) * 100).toFixed(1) : 0}% perfect rate
          </p>
        </div>
      </div>

      {/* Top Players */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2 mb-6">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span>Top Quiz Players</span>
        </h3>
        
        <div className="space-y-4">
          {topPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
                index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                index === 2 ? 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border border-amber-600/30' :
                'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold">
                  {index === 0 ? <Crown className="w-5 h-5 text-yellow-500" /> :
                   index === 1 ? <Award className="w-5 h-5 text-gray-400" /> :
                   index === 2 ? <Star className="w-5 h-5 text-amber-600" /> :
                   index + 1}
                </div>
                <Avatar
                  src={player.avatar}
                  alt={player.full_name || player.username}
                  size={40}
                  fallbackText={player.username}
                  showBorder={false}
                />
                <div>
                  <h4 className="text-white font-semibold">{player.full_name || player.username}</h4>
                  <p className="text-gray-400 text-sm">@{player.username}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-bold text-lg">{player.medals || 0}</span>
                </div>
                <p className="text-gray-500 text-xs">
                  {player.medals === 10 ? 'Perfect Score!' : `${player.medals || 0}/10 correct`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// System Section Component
function SystemSection() {
  const systemInfo = [
    {
      title: 'Database Status',
      status: 'Online',
      icon: Database,
      color: 'text-green-400',
      details: 'All tables operational'
    },
    {
      title: 'Server Performance',
      status: 'Optimal',
      icon: Server,
      color: 'text-blue-400',
      details: 'Response time: 45ms'
    },
    {
      title: 'Website Uptime',
      status: '99.9%',
      icon: Globe,
      color: 'text-purple-400',
      details: 'Last 30 days'
    },
    {
      title: 'Security Status',
      status: 'Protected',
      icon: Shield,
      color: 'text-green-400',
      details: 'All systems secure'
    }
  ]

  return (
    <div className="space-y-8">
      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systemInfo.map((info, index) => {
          const Icon = info.icon
          return (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-6 h-6 ${info.color}`} />
                  <h3 className="text-white font-semibold">{info.title}</h3>
                </div>
                <span className={`text-sm font-medium ${info.color}`}>{info.status}</span>
              </div>
              <p className="text-gray-400 text-sm">{info.details}</p>
        </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2 mb-6">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Quick Actions</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">Clear Cache</p>
              <p className="text-gray-400 text-sm">Refresh system cache</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
            <Database className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">Backup Database</p>
              <p className="text-gray-400 text-sm">Create system backup</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
            <Bell className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-medium">Send Notification</p>
              <p className="text-gray-400 text-sm">Notify all users</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
            <Palette className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-white font-medium">Theme Settings</p>
              <p className="text-gray-400 text-sm">Customize appearance</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
            <Lock className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-white font-medium">Security Settings</p>
              <p className="text-gray-400 text-sm">Manage permissions</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
            <Activity className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-white font-medium">System Logs</p>
              <p className="text-gray-400 text-sm">View activity logs</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
