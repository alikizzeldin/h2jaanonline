import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Play, ExternalLink, Star, Clock, Users, Maximize2, Minimize2, Sparkles, Zap, Target, Megaphone } from 'lucide-react'
import { useCoins } from '../contexts/CoinsContext'

export default function Games() {
  const [selectedGame, setSelectedGame] = useState('fast-food-rush')
  const [isLoading, setIsLoading] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const gameContainerRef = useRef(null)
  const { timeActive } = useCoins()

  // Check if game is from GameMonetize
  const isGameMonetize = (url) => {
    return url.includes('gamemonetize.co')
  }

  // Get special styling for GameMonetize games
  const getGameMonetizeStyle = () => {
    return {
      border: '3px solid #6366f1',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))'
    }
  }

  const games = [
    {
      id: 'fast-food-rush',
      title: 'Fast Food Rush',
      description: 'A fast-paced cooking game where you manage your own fast food restaurant. Serve customers quickly and efficiently to earn points and unlock new recipes!',
      category: 'Cooking',
      difficulty: 'Easy',
      rating: 4.5,
      players: '1 Player',
      duration: '5-15 min',
      image: '/assets/logos/fast food rush.jpg',
      embedUrl: 'https://cloud.onlinegames.io/games/2025/unity/fast-food-rush/index-og.html',
      tags: ['Cooking', 'Management', 'Casual', 'Unity'],
      hasAds: true
    },
    {
      id: 'basketball-king',
      title: 'Basketball King',
      description: 'Test your basketball skills in this exciting arcade game! Shoot hoops, beat the clock, and become the ultimate Basketball King. Perfect your timing and accuracy to score the highest points!',
      category: 'Sports',
      difficulty: 'Medium',
      rating: 4.6,
      players: '1 Player',
      duration: '3-8 min',
      image: 'https://www.onlinegames.io/media/posts/907/responsive/basketball-king-lg.jpg',
      embedUrl: 'https://cloud.onlinegames.io/games/2024/construct/316/basketball-king/index-og.html',
      tags: ['Sports', 'Arcade', 'Basketball', 'Construct']
    },
    {
      id: 'mini-tennis-club',
      title: 'Mini Tennis Club',
      description: 'Join the Mini Tennis Club and compete in exciting tennis matches! Perfect your serves, master your volleys, and become the ultimate tennis champion in this fun and engaging sports game!',
      category: 'Sports',
      difficulty: 'Medium',
      rating: 4.4,
      players: '1 Player',
      duration: '5-12 min',
      image: 'https://img.gamemonetize.com/49eln5cwqtgvyhxuxvb8ksp8jkz33h81/512x512.jpg',
      embedUrl: 'https://html5.gamemonetize.co/49eln5cwqtgvyhxuxvb8ksp8jkz33h81/',
      tags: ['Sports', 'Tennis', 'Competition', 'HTML5']
    },
    {
      id: 'monster-survivors',
      title: 'Monster Survivors',
      description: 'Survive against waves of monsters in this thrilling survival game! Upgrade your abilities, collect power-ups, and fight endless hordes of creatures. How long can you survive?',
      category: 'Survival',
      difficulty: 'Hard',
      rating: 4.7,
      players: '1 Player',
      duration: '10-20 min',
      image: 'https://www.onlinegames.io/media/posts/942/responsive/Monster-survivors-lg.jpg',
      embedUrl: 'https://cloud.onlinegames.io/games/2025/unity/monster-survivors/index-og.html',
      tags: ['Survival', 'Action', 'Monsters', 'Unity'],
      hasAds: true
    },
    {
      id: 'school-stories-teacher-sim',
      title: 'School Stories: Teacher Sim',
      description: 'Experience the life of a teacher in this engaging simulation game! Manage your classroom, help students learn, and create an inspiring educational environment. Become the best teacher and make a difference in your students\' lives!',
      category: 'Simulation',
      difficulty: 'Medium',
      rating: 4.5,
      players: '1 Player',
      duration: '8-15 min',
      image: 'https://img.gamemonetize.com/xnf3bxeet7w4y8rdmifw7hugjnyzt0ds/512x384.jpg',
      embedUrl: 'https://html5.gamemonetize.co/xnf3bxeet7w4y8rdmifw7hugjnyzt0ds/',
      tags: ['Simulation', 'Education', 'Management', 'HTML5'],
      hasAds: true
    },
    {
      id: 'goal-io',
      title: 'Goal.io',
      description: 'Score amazing goals in this exciting soccer game! Master your shooting skills, beat the goalkeeper, and become the ultimate soccer champion. Perfect your timing and accuracy to score the most spectacular goals!',
      category: 'Sports',
      difficulty: 'Medium',
      rating: 4.6,
      players: '1 Player',
      duration: '5-10 min',
      image: 'https://img.gamemonetize.com/vjyl8p9lma7kpn58wh0syqkj6ph28clp/512x512.jpg',
      embedUrl: 'https://html5.gamemonetize.co/vjyl8p9lma7kpn58wh0syqkj6ph28clp/',
      tags: ['Sports', 'Soccer', 'Football', 'HTML5']
    }
  ]

  const selectedGameData = games.find(game => game.id === selectedGame)

  // Note: Coins are now awarded automatically every minute for active time on the website
  // No need to start/end game sessions anymore

  const toggleFullScreen = () => {
    // Check if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (!document.fullscreenElement) {
      // For mobile devices, try to lock to landscape orientation first
      if (isMobile && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').then(() => {
          console.log('Screen locked to landscape')
        }).catch(err => {
          console.log('Could not lock orientation:', err)
        })
      }
      
      gameContainerRef.current?.requestFullscreen().then(() => {
        setIsFullScreen(true)
      }).catch(err => {
        console.log('Error attempting to enable fullscreen:', err)
      })
    } else {
      // For mobile devices, unlock orientation when exiting fullscreen
      if (isMobile && screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock()
      }
      
      document.exitFullscreen().then(() => {
        setIsFullScreen(false)
      }).catch(err => {
        console.log('Error attempting to exit fullscreen:', err)
      })
    }
  }

  // Listen for fullscreen change events and orientation changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    const handleOrientationChange = () => {
      // Add mobile-specific styles when in landscape
      if (window.innerHeight < window.innerWidth) {
        document.body.classList.add('landscape-mode')
      } else {
        document.body.classList.remove('landscape-mode')
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)
    
    // Initial check
    handleOrientationChange()

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
      document.body.classList.remove('landscape-mode')
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-10 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 animate-pulse"></div>
        
                 {/* Floating geometric shapes */}
         {[...Array(25)].map((_, i) => {
           const shapes = ['triangle', 'circle', 'square', 'x']
           const shape = shapes[i % shapes.length]
           const size = Math.random() * 20 + 10
           
           return (
             <motion.div
               key={i}
               className="absolute opacity-30"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 width: size,
                 height: size,
               }}
               animate={{
                 y: [0, -150, 0],
                 x: [0, Math.random() * 100 - 50, 0],
                 rotate: [0, 360],
                 scale: [0.8, 1.2, 0.8],
               }}
               transition={{
                 duration: Math.random() * 15 + 10,
                 repeat: Infinity,
                 delay: Math.random() * 8,
                 ease: "easeInOut"
               }}
             >
               {shape === 'triangle' && (
                 <div className="w-full h-full border-l-2 border-b-2 border-primary/40 transform rotate-45"></div>
               )}
               {shape === 'circle' && (
                 <div className="w-full h-full border-2 border-secondary/40 rounded-full"></div>
               )}
               {shape === 'square' && (
                 <div className="w-full h-full border-2 border-accent/40 transform rotate-45"></div>
               )}
               {shape === 'x' && (
                 <div className="w-full h-full relative">
                   <div className="absolute inset-0 border-l-2 border-primary/40 transform rotate-45"></div>
                   <div className="absolute inset-0 border-l-2 border-secondary/40 transform -rotate-45"></div>
                 </div>
               )}
             </motion.div>
           )
         })}

         {/* Controller-themed geometric shapes */}
         <motion.div
           className="absolute top-32 left-16 w-40 h-40 border-2 border-primary/20 rounded-full"
           animate={{
             rotate: 360,
             scale: [1, 1.1, 1],
           }}
           transition={{
             duration: 25,
             repeat: Infinity,
             ease: "linear"
           }}
         />
         <motion.div
           className="absolute bottom-32 right-16 w-32 h-32 border-2 border-secondary/20 rounded-lg"
           animate={{
             rotate: -360,
             scale: [1, 0.9, 1],
           }}
           transition={{
             duration: 20,
             repeat: Infinity,
             ease: "linear"
           }}
         />
         <motion.div
           className="absolute top-1/2 left-8 w-24 h-24 border-2 border-accent/20 transform rotate-45"
           animate={{
             rotate: [45, 405],
             scale: [1, 1.2, 1],
           }}
           transition={{
             duration: 18,
             repeat: Infinity,
             ease: "linear"
           }}
         />
         <motion.div
           className="absolute top-1/3 right-12 w-20 h-20 relative"
           animate={{
             rotate: 360,
             scale: [1, 1.1, 1],
           }}
           transition={{
             duration: 22,
             repeat: Infinity,
             ease: "linear"
           }}
         >
           <div className="absolute inset-0 border-l-2 border-primary/30 transform rotate-45"></div>
           <div className="absolute inset-0 border-l-2 border-secondary/30 transform -rotate-45"></div>
         </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <motion.div 
              className="relative p-6 rounded-full glass glow"
              variants={pulseVariants}
              animate="animate"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-20 blur-xl"></div>
              <Gamepad2 className="w-16 h-16 text-primary relative z-10" />
              
              {/* Orbiting elements */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            <span className="text-white">Game</span>
                         <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">
               {' '}Library
             </span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Discover and play amazing games directly in your browser. From casual cooking games to challenging puzzles, 
            there's something for everyone in my curated collection.
          </motion.p>

          {/* Animated underline */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-8"
          >
            <motion.div
              className="h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Game Library Sidebar */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <div className="glass backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl"></div>
              
                             <motion.h2 
                 className="text-3xl font-bold mb-8 flex items-center relative z-10"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
               >
                 <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 mr-4">
                   <Gamepad2 className="w-8 h-8 text-primary" />
                 </div>
                                   <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
                    Game Library
                  </span>
               </motion.h2>
              
              <div className="space-y-6 relative z-10">
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ 
                      scale: 1.03,
                      y: -5,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${
                      selectedGame === game.id
                        ? 'bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/40 shadow-2xl'
                        : 'glass hover:bg-white/10 border border-white/10 hover:border-primary/30'
                    }`}
                    onClick={() => {
                      setSelectedGame(game.id)
                      setIsLoading(true)
                    }}
                  >
                    {/* Animated background for selected game */}
                    {selectedGame === game.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}

                    <div className="flex items-start space-x-4 relative z-10">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                        {game.image ? (
                          <img 
                            src={game.image} 
                            alt={game.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Play className="w-8 h-8 text-primary" />
                        )}
                        
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-xl mb-2 truncate">
                          {game.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {game.description}
                        </p>
                        
                                                 <div className="flex items-center space-x-4 text-xs text-gray-500">
                           <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded-full">
                             <Star className="w-3 h-3 text-yellow-500 mr-1" />
                             <span className="text-yellow-400 font-medium">{game.rating}</span>
                           </div>
                           <div className="flex items-center bg-blue-500/10 px-2 py-1 rounded-full">
                             <Users className="w-3 h-3 text-blue-400 mr-1" />
                             <span className="text-blue-400 font-medium">{game.players}</span>
                           </div>
                         </div>
                         
                         {/* Ads indicator in bottom-left corner */}
                         {game.hasAds && (
                           <div className="absolute bottom-1 left-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                             <Megaphone className="w-3 h-3 text-purple-400" />
                             <span className="text-purple-400 text-xs font-medium">Ads</span>
                           </div>
                         )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Game Display Area */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            {selectedGameData && (
              <div className="space-y-8">
                {/* Enhanced Game Header */}
                <div className="glass backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl"></div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 relative z-10">
                    <div>
                                             <motion.h2 
                         className="text-4xl font-bold mb-3"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.4 }}
                       >
                                                   <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
                            {selectedGameData.title}
                          </span>
                       </motion.h2>
                      <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                        {selectedGameData.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-6 lg:mt-0">
                      {selectedGameData.tags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-sm rounded-full border border-primary/30 font-medium"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    <motion.div 
                      className="text-center p-4 rounded-2xl glass hover:bg-primary/10 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="text-3xl font-bold text-primary mb-1">{selectedGameData.rating}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 rounded-2xl glass hover:bg-secondary/10 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="text-3xl font-bold text-secondary mb-1">{selectedGameData.difficulty}</div>
                      <div className="text-xs text-gray-400">Difficulty</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 rounded-2xl glass hover:bg-accent/10 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="text-3xl font-bold text-accent mb-1">{selectedGameData.players}</div>
                      <div className="text-xs text-gray-400">Players</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 rounded-2xl glass hover:bg-pink-500/10 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="text-3xl font-bold text-pink-500 mb-1">{selectedGameData.duration}</div>
                      <div className="text-xs text-gray-400">Duration</div>
                    </motion.div>
                  </div>
                </div>

                {/* Enhanced Game Embed */}
                <div className="glass backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl"></div>
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                                         <motion.h3 
                       className="text-2xl font-bold flex items-center"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.6 }}
                     >
                       <Play className="w-6 h-6 text-primary mr-3" />
                                               <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
                          Play Now
                        </span>
                     </motion.h3>
                                         <div className="flex items-center space-x-4">
                       {/* Desktop Fullscreen Button */}
                       <motion.button
                         whileHover={{ scale: 1.05, y: -2 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={toggleFullScreen}
                         className="hidden md:flex items-center space-x-2 text-primary hover:text-secondary transition-all duration-300 p-3 rounded-xl hover:bg-white/10 border border-primary/20 hover:border-primary/40"
                         title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                       >
                         {isFullScreen ? (
                           <Minimize2 className="w-5 h-5" />
                         ) : (
                           <Maximize2 className="w-5 h-5" />
                         )}
                         <span className="text-sm font-medium">{isFullScreen ? "Exit Full Screen" : "Full Screen"}</span>
                       </motion.button>
                       
                       {/* Mobile Fullscreen Button */}
                       <motion.button
                         whileTap={{ scale: 0.95 }}
                         onClick={toggleFullScreen}
                         className="md:hidden flex items-center space-x-2 text-primary hover:text-secondary transition-all duration-300 p-3 rounded-xl hover:bg-white/10 border border-primary/20 hover:border-primary/40"
                         title={isFullScreen ? "Exit Full Screen & Rotate" : "Enter Full Screen & Rotate to Landscape"}
                       >
                         {isFullScreen ? (
                           <Minimize2 className="w-5 h-5" />
                         ) : (
                           <Maximize2 className="w-5 h-5" />
                         )}
                         <span className="text-sm font-medium">
                           {isFullScreen ? "Exit" : "Full Screen"}
                         </span>
                       </motion.button>
                       
                       <motion.a
                         href={selectedGameData.embedUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         whileHover={{ scale: 1.05, y: -2 }}
                         whileTap={{ scale: 0.95 }}
                         className="flex items-center space-x-2 text-primary hover:text-secondary transition-all duration-300 p-3 rounded-xl hover:bg-white/10 border border-primary/20 hover:border-primary/40"
                       >
                         <ExternalLink className="w-5 h-5" />
                         <span className="text-sm font-medium">Open in New Tab</span>
                       </motion.a>
                     </div>
                  </div>
                  
                                     <div 
                     ref={gameContainerRef}
                     className={`relative w-full bg-black overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 ${
                       isFullScreen 
                         ? 'fixed inset-0 z-50 rounded-none border-none' 
                         : 'rounded-2xl'
                     }`}
                   >
                                         <div 
                       className={`w-full transition-all duration-300 ${
                         isFullScreen 
                           ? 'fixed inset-0 z-50' 
                           : 'aspect-video'
                       }`}
                       style={isGameMonetize(selectedGameData.embedUrl) ? getGameMonetizeStyle() : {}}
                     >
                       <iframe
                         src={selectedGameData.embedUrl}
                         title={selectedGameData.title}
                         className={`transition-all duration-300 ${
                           isFullScreen 
                             ? 'w-full h-full' 
                             : 'w-full h-full'
                         } ${isGameMonetize(selectedGameData.embedUrl) ? 'rounded-lg' : 'border-0'}`}
                         style={isGameMonetize(selectedGameData.embedUrl) ? { border: 'none' } : {}}
                         allowFullScreen
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         onLoad={() => setIsLoading(false)}
                       />
                     </div>
                    
                                         {/* Enhanced Loading overlay */}
                     {isLoading && (
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                         <div className="text-center">
                           <motion.div
                             className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-6"
                             animate={{ rotate: 360 }}
                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                           />
                           <motion.p 
                             className="text-white text-lg font-medium"
                             animate={{ opacity: [0.5, 1, 0.5] }}
                             transition={{ duration: 2, repeat: Infinity }}
                           >
                             Loading game...
                           </motion.p>
                         </div>
                       </div>
                     )}

                     {/* Mobile Landscape Instruction Overlay */}
                     {isFullScreen && window.innerHeight < window.innerWidth && (
                       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                         <div className="flex items-center space-x-2">
                           <span>🎮</span>
                           <span>Landscape Mode Active</span>
                         </div>
                       </div>
                     )}
                  </div>
                </div>

                {/* Enhanced Game Instructions */}
                <div className="glass backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl"></div>
                  
                                     <motion.h3 
                     className="text-2xl font-bold mb-6 flex items-center relative z-10"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                   >
                     <Target className="w-6 h-6 text-accent mr-3" />
                                           <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
                        How to Play
                      </span>
                   </motion.h3>
                  <div className="space-y-4 text-gray-300 relative z-10">
                    <motion.div 
                      className="flex items-start space-x-4 p-4 rounded-2xl glass hover:bg-primary/10 transition-all duration-300"
                      whileHover={{ scale: 1.02, x: 10 }}
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-sm font-bold">1</span>
                      </div>
                      <p className="text-lg">Click on the game area to start playing</p>
                    </motion.div>
                    <motion.div 
                      className="flex items-start space-x-4 p-4 rounded-2xl glass hover:bg-secondary/10 transition-all duration-300"
                      whileHover={{ scale: 1.02, x: 10 }}
                    >
                      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-secondary text-sm font-bold">2</span>
                      </div>
                      <p className="text-lg">Follow the on-screen instructions to learn the controls</p>
                    </motion.div>
                    <motion.div 
                      className="flex items-start space-x-4 p-4 rounded-2xl glass hover:bg-accent/10 transition-all duration-300"
                      whileHover={{ scale: 1.02, x: 10 }}
                    >
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-accent text-sm font-bold">3</span>
                      </div>
                      <p className="text-lg">Try to achieve the highest score possible!</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
