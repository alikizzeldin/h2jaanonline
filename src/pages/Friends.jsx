import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LetterAvatar from '../components/LetterAvatar'
import { 
  Trophy, 
  Users, 
  Play, 
  Medal, 
  Star,
  Check,
  X,
  RefreshCw,
  Crown,
  Target,
  Brain,
  Award
} from 'lucide-react'

const quizQuestions = [
  {
    id: 1,
    question: "What is Ali's absolute favorite game?",
    options: ["Valorant", "SMITE 2", "Rocket League", "CS:GO"],
    correct: 1,
    explanation: "SMITE 2 is Ali's gaming obsession and absolute favorite!"
  },
  {
    id: 2,
    question: "What is Ali's main expertise besides gaming?",
    options: ["Audio Engineering", "Graphic Design", "Video Editing", "3D Modeling"],
    correct: 0,
    explanation: "Ali is a professional Audio Engineer specializing in sound production!"
  },
  {
    id: 3,
    question: "Which role does Ali prefer in SMITE 2?",
    options: ["Support", "Jungle & ADC", "Solo Lane", "Mid Lane"],
    correct: 1,
    explanation: "Ali mains Jungle and ADC roles with aggressive strategic gameplay!"
  },
  {
    id: 4,
    question: "What programming language does Ali excel at?",
    options: ["Python", "JavaScript", "C++", "Java"],
    correct: 1,
    explanation: "Ali has 92% proficiency in JavaScript and builds React applications!"
  },
  {
    id: 5,
    question: "What's Ali's preferred development tool?",
    options: ["Sublime Text", "Atom", "VS Code", "IntelliJ"],
    correct: 2,
    explanation: "Ali uses VS Code with 95% proficiency for development!"
  },
  {
    id: 6,
    question: "Which audio software does Ali master the most?",
    options: ["Pro Tools", "FL Studio", "GarageBand", "Audacity"],
    correct: 0,
    explanation: "Ali has 95% proficiency in Pro Tools for professional audio production!"
  },
  {
    id: 7,
    question: "What's Ali's Discord username?",
    options: ["AliAudio", "h2jo", "AliDev", "SmiteKing"],
    correct: 1,
    explanation: "You can find Ali on Discord as 'h2jo' for gaming and collaboration!"
  },
  {
    id: 8,
    question: "What type of authentication does Ali implement?",
    options: ["JWT only", "Sessions", "OAuth (Google/GitHub)", "Basic Auth"],
    correct: 2,
    explanation: "Ali implements modern OAuth authentication with Google and GitHub!"
  },
  {
    id: 9,
    question: "What's Ali's approach to gaming?",
    options: ["Casual Fun", "Aggressive & Strategic", "Support Player", "Solo Only"],
    correct: 1,
    explanation: "Ali brings aggressive and strategic gameplay to all his games!"
  },
  {
    id: 10,
    question: "What does Ali specialize in for live events?",
    options: ["Lighting", "Live Sound Engineering", "Video Production", "Stage Design"],
    correct: 1,
    explanation: "Ali is a specialist in live sound engineering for events and concerts!"
  }
]

export default function Friends() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [userStats, setUserStats] = useState({ medals: 0, hasPlayedQuiz: false })
  const [userProfile, setUserProfile] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchLeaderboard()
      fetchUserStats()
      fetchUserProfile()
      
      // Set up real-time subscription for profile and leaderboard changes
      const subscription = supabase
        .channel('friends_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'profiles'
          },
          (payload) => {
            // Refresh leaderboard when any profile changes
            fetchLeaderboard()
            
            // Update current user's profile if it's their change
            if (payload.new && payload.new.id === user.id) {
              setUserProfile(payload.new)
              setUserStats({
                medals: payload.new.medals || 0,
                hasPlayedQuiz: payload.new.has_played_quiz || false
              })
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

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, medals')
        .order('medals', { ascending: false })
        .limit(10)

      if (error) throw error
      setLeaderboard(data || [])
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('medals, has_played_quiz')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setUserStats({
          medals: data.medals || 0,
          hasPlayedQuiz: data.has_played_quiz || false
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user stats:', error)
      setLoading(false)
    }
  }

  const startQuiz = () => {
    if (userStats.hasPlayedQuiz) {
      alert("You've already played this quiz! You can only play once per account.")
      return
    }
    setShowQuiz(true)
    setCurrentQuestion(0)
    setScore(0)
    setQuizCompleted(false)
  }

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setScore(score + 10)
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        completeQuiz()
      }
    }, 2000)
  }

  const completeQuiz = async () => {
    setQuizCompleted(true)
    
    try {
      // Update user's medals and mark quiz as played
      const newMedals = userStats.medals + score
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          medals: newMedals,
          has_played_quiz: true,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setUserStats({
        medals: newMedals,
        hasPlayedQuiz: true
      })

      // Refresh leaderboard
      fetchLeaderboard()
    } catch (error) {
      console.error('Error updating user stats:', error)
    }
  }

  const restartToLeaderboard = () => {
    setShowQuiz(false)
    setQuizCompleted(false)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
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
        
        {/* Floating Gaming Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-xl opacity-70"
            style={{
              background: `radial-gradient(circle, ${
                ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'][i % 4]
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
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="p-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                  Friends Leaderboard
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Test your knowledge about Ali and earn medals to climb the leaderboard!
                </p>
              </div>

              {/* User Stats Card */}
              <div className="glass p-6 rounded-2xl border border-white/10 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <LetterAvatar
                      username={userProfile?.username || user?.user_metadata?.user_name || user?.email?.split('@')[0]}
                      fullName={userProfile?.full_name || user?.user_metadata?.full_name}
                      size="w-16 h-16"
                      textSize="text-xl"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {userProfile?.full_name || userProfile?.username || user?.user_metadata?.full_name || user?.user_metadata?.user_name || user?.email?.split('@')[0]}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Medal className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 font-semibold">{userStats.medals} medals</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startQuiz}
                    disabled={userStats.hasPlayedQuiz}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                      userStats.hasPlayedQuiz
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl glow'
                    }`}
                  >
                    <Brain className="w-5 h-5" />
                    <span>{userStats.hasPlayedQuiz ? 'Quiz Completed' : 'Play Quiz'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="glass p-8 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                  Top Players
                </h2>
                
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No players yet. Be the first to play!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((player, index) => (
                      <motion.div
                        key={player.username || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                          index === 2 ? 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border border-amber-600/30' :
                          'bg-white/5 border border-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold">
                            {index === 0 ? <Crown className="w-5 h-5 text-yellow-500" /> :
                             index === 1 ? <Medal className="w-5 h-5 text-gray-400" /> :
                             index === 2 ? <Award className="w-5 h-5 text-amber-600" /> :
                             index + 1}
                          </div>
                          <LetterAvatar
                            username={player.username}
                            fullName={player.full_name}
                            size="w-12 h-12"
                            textSize="text-lg"
                          />
                          <div>
                            <h4 className="text-white font-semibold">
                              {player.full_name || player.username || 'Anonymous'}
                            </h4>
                            <p className="text-gray-400 text-sm">@{player.username}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Medal className="w-5 h-5 text-yellow-500" />
                          <span className="text-yellow-500 font-bold text-lg">{player.medals || 0}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              {!quizCompleted ? (
                <div className="max-w-4xl mx-auto">
                  {/* Quiz Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                      How much do you know Ali?
                    </h1>
                    <div className="flex items-center justify-center space-x-4 text-gray-300">
                      <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                        />
                      </div>
                      <span>Score: {score}</span>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="glass p-8 rounded-2xl border border-white/10 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">
                      {quizQuestions[currentQuestion].question}
                    </h2>
                    
                    {/* 2x2 Grid of Options */}
                    <div className="grid grid-cols-2 gap-4">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={selectedAnswer !== null}
                          className={`p-6 rounded-lg text-left transition-all duration-300 ${
                            selectedAnswer === null 
                              ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30' 
                              : selectedAnswer === index
                                ? index === quizQuestions[currentQuestion].correct
                                  ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                  : 'bg-red-500/20 border-red-500/50 text-red-300'
                                : index === quizQuestions[currentQuestion].correct
                                  ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                  : 'bg-white/5 border-white/10 text-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">{option}</span>
                            {selectedAnswer !== null && (
                              <div>
                                {index === quizQuestions[currentQuestion].correct ? (
                                  <Check className="w-6 h-6 text-green-400" />
                                ) : selectedAnswer === index ? (
                                  <X className="w-6 h-6 text-red-400" />
                                ) : null}
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Explanation */}
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                      >
                        <p className="text-blue-300">
                          <strong>Explanation:</strong> {quizQuestions[currentQuestion].explanation}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto text-center">
                  {/* Quiz Results */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="glass p-8 rounded-2xl border border-white/10"
                  >
                    <div className="mb-6">
                      <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-gradient mb-4">Quiz Complete!</h2>
                      <p className="text-xl text-gray-300 mb-6">
                        You scored <span className="text-yellow-500 font-bold">{score} out of 100</span> points!
                      </p>
                      <p className="text-gray-400 mb-6">
                        You've earned <span className="text-yellow-500 font-semibold">{score} medals</span> and they've been added to your account.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={restartToLeaderboard}
                      className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 glow"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Back to Leaderboard</span>
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
