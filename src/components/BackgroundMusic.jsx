import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'

export default function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(30)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [showVolumePanel, setShowVolumePanel] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const audioRef = useRef(null)
  const volumeTimeoutRef = useRef(null)

  useEffect(() => {
    // Auto-play the audio when component mounts or on page reload
    const autoPlayAudio = async () => {
      if (audioRef.current) {
        try {
          // Set initial volume and playback rate
          audioRef.current.volume = volume / 100
          audioRef.current.playbackRate = playbackRate
          
          // Force load the audio
          audioRef.current.load()
          
          // Try to play immediately
          const playPromise = audioRef.current.play()
          
          if (playPromise !== undefined) {
            await playPromise
            setIsPlaying(true)
            console.log('Background music auto-started successfully')
          }
        } catch (error) {
          console.log('Auto-play failed (browser restriction):', error)
          setIsPlaying(false)
          
          // Try again after user interaction
          const handleUserInteraction = async () => {
            try {
              await audioRef.current.play()
              setIsPlaying(true)
              console.log('Background music started after user interaction')
              // Remove the listener after successful play
              document.removeEventListener('click', handleUserInteraction)
              document.removeEventListener('keydown', handleUserInteraction)
            } catch (err) {
              console.log('Still failed after user interaction:', err)
            }
          }
          
          // Add listeners for user interaction
          document.addEventListener('click', handleUserInteraction, { once: true })
          document.addEventListener('keydown', handleUserInteraction, { once: true })
        }
      }
    }

    // Handle page visibility changes (reload, tab switch, etc.)
    const handleVisibilityChange = () => {
      if (!document.hidden && audioRef.current && !isPlaying && !isMuted) {
        // Try to resume playback when page becomes visible
        setTimeout(autoPlayAudio, 100)
      }
    }

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Initial auto-play attempt
    autoPlayAudio()
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, []) // Empty dependency array to run only on mount

  // Separate effect for handling state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
      audioRef.current.playbackRate = playbackRate
    }
  }, [volume, playbackRate])

  const toggleMute = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setHasUserInteracted(true)
    if (audioRef.current) {
      const newMutedState = !isMuted
      audioRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }

  const togglePlay = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setHasUserInteracted(true)
    
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Error playing audio:', error)
      }
    }
  }

  const handleLoadedData = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100 // Set volume based on state
      audioRef.current.playbackRate = playbackRate // Set playback rate
    }
  }

  const handleVolumeChange = (newVolume) => {
    setHasUserInteracted(true)
    // Immediate state updates for instant UI feedback
    setVolume(newVolume)
    
    if (audioRef.current) {
      // Direct audio property update for real-time audio change
      audioRef.current.volume = newVolume / 100
      
      // Instant mute state updates
      if (newVolume === 0) {
        setIsMuted(true)
        audioRef.current.muted = true
      } else if (isMuted) {
        setIsMuted(false)
        audioRef.current.muted = false
      }
    }
  }

  const handlePlaybackRateChange = (rate) => {
    setHasUserInteracted(true)
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const handleVolumeHover = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current)
    }
    setShowVolumePanel(true)
  }

  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumePanel(false)
    }, 300) // Small delay to allow moving to volume panel
  }

  // Hide controls after user interaction (optional)
  const hideControlsAfterDelay = () => {
    setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  return (
    <div className="fixed top-20 left-4 z-50">
      {/* Audio element - using a direct audio file */}
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        onLoadedData={handleLoadedData}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => console.log('Audio loading error:', e)}
        preload="auto"
        crossOrigin="anonymous"
      >
        {/* Primary audio source - h2jaan_shayef.mp3 */}
        <source src="/assets/h2jaan_shayef.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Control Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center space-x-2 glass backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg"
          >
                         {/* Play/Pause Button */}
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={togglePlay}
               className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer select-none"
               title={isPlaying ? "Pause Music" : "Play Music"}
               type="button"
             >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </motion.button>

                                      {/* Volume Control with Hover Panel */}
             <div 
               className="relative"
               onMouseEnter={handleVolumeHover}
               onMouseLeave={handleVolumeLeave}
             >
               <motion.button
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={toggleMute}
                 className={`p-2 rounded-lg transition-all duration-300 cursor-pointer select-none ${
                   isMuted || volume === 0
                     ? 'bg-red-500 hover:bg-red-600 text-white' 
                     : 'bg-white/10 hover:bg-white/20 text-gray-300'
                 }`}
                 title={isMuted ? "Unmute Music" : "Mute Music"}
                 type="button"
               >
                 {isMuted || volume === 0 ? (
                   <VolumeX className="w-4 h-4" />
                 ) : (
                   <Volume2 className="w-4 h-4" />
                 )}
               </motion.button>

               {/* Volume Panel */}
               <AnimatePresence>
                 {showVolumePanel && (
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.9 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.9 }}
                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
                     className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 glass backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl min-w-[200px]"
                   >
                     {/* Volume Label */}
                     <div className="text-xs text-gray-300 mb-3 text-center font-medium">
                       Volume: {volume}%
                     </div>
                     
                     {/* Enhanced Volume Slider */}
                     <div className="flex items-center space-x-3">
                       <VolumeX className="w-3 h-3 text-gray-400" />
                       <div className="flex-1 relative">
                         {/* Custom Slider Track */}
                         <div className="volume-slider-container">
                           <div className="volume-slider-glow"></div>
                           <motion.div
                             className="volume-slider-fill"
                             style={{ width: `${volume}%` }}
                             initial={false}
                             animate={{ width: `${volume}%` }}
                             transition={{ 
                               type: "spring", 
                               stiffness: 300, 
                               damping: 30,
                               mass: 0.8
                             }}
                           />
                         </div>
                         
                         {/* Hidden Input Slider */}
                         <input
                           type="range"
                           min="0"
                           max="100"
                           value={volume}
                           onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                           className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
                           style={{ zIndex: 10 }}
                         />
                         
                         {/* Animated Volume Thumb */}
                         <motion.div
                           className="absolute top-1/2 w-5 h-5 bg-gradient-to-br from-primary via-secondary to-pink-500 rounded-full shadow-lg transform -translate-y-1/2 pointer-events-none border-2 border-white/80"
                           style={{ left: `calc(${volume}% - 10px)` }}
                           initial={false}
                           animate={{ 
                             left: `calc(${volume}% - 10px)`,
                             scale: 1
                           }}
                           whileHover={{ 
                             scale: 1.3,
                             boxShadow: "0 0 0 8px rgba(99, 102, 241, 0.2), 0 6px 20px rgba(99, 102, 241, 0.4)"
                           }}
                           transition={{ 
                             type: "spring", 
                             stiffness: 400, 
                             damping: 25 
                           }}
                         >
                           {/* Inner glow */}
                           <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
                         </motion.div>
                         
                         {/* Volume Level Indicators */}
                         <div className="absolute -bottom-2 left-0 right-0 flex justify-between text-xs opacity-50">
                           {[0, 25, 50, 75, 100].map((level) => (
                             <div
                               key={level}
                               className={`w-0.5 h-1 rounded-full transition-all duration-200 ${
                                 volume >= level ? 'bg-primary' : 'bg-gray-600'
                               }`}
                             />
                           ))}
                         </div>
                       </div>
                       <Volume2 className="w-3 h-3 text-gray-400" />
                     </div>

                     {/* Audio Speed Control */}
                     <div className="mt-4 pt-3 border-t border-white/10">
                       <div className="text-xs text-gray-300 mb-2 text-center font-medium">
                         Playback Speed: {playbackRate}x
                       </div>
                       <div className="flex justify-center space-x-1">
                         {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                           <motion.button
                             key={rate}
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => handlePlaybackRateChange(rate)}
                                                        className={`px-2 py-1 text-xs rounded transition-all duration-100 ${
                             playbackRate === rate
                               ? 'bg-gradient-to-r from-primary to-secondary text-white'
                               : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                           }`}
                           >
                             {rate}x
                           </motion.button>
                         ))}
                       </div>
                     </div>

                     {/* Arrow pointer */}
                     <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/10 border-t border-l border-white/10 rotate-45"></div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

            {/* Music Info */}
            <div className="hidden sm:block text-xs text-gray-300 ml-2">
              <div className="font-medium">H2jaan Shayef</div>
              <div className="text-gray-400">{isPlaying ? 'Playing...' : 'Paused'}</div>
            </div>

                         {/* Minimize Button */}
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={(e) => {
                 e.preventDefault()
                 e.stopPropagation()
                 setShowControls(false)
               }}
               className="p-1 rounded text-gray-400 hover:text-white transition-colors text-xs cursor-pointer select-none"
               title="Hide Controls"
               type="button"
             >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

                    {/* Minimized Controls - Show when hidden */}
       {!showControls && (
         <div 
           className="relative"
           onMouseEnter={handleVolumeHover}
           onMouseLeave={handleVolumeLeave}
         >
           <motion.button
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             onClick={(e) => {
               e.preventDefault()
               e.stopPropagation()
               setShowControls(true)
             }}
             className="p-3 glass backdrop-blur-md rounded-full border border-white/10 shadow-lg text-gray-300 hover:text-white transition-all duration-300 cursor-pointer select-none"
             title="Show Music Controls"
             type="button"
           >
             {isMuted || volume === 0 ? (
               <VolumeX className="w-5 h-5" />
             ) : (
               <Volume2 className="w-5 h-5" />
             )}
           </motion.button>

           {/* Volume Panel for Minimized State */}
           <AnimatePresence>
             {showVolumePanel && (
               <motion.div
                 initial={{ opacity: 0, y: 10, scale: 0.9 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.9 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 glass backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl min-w-[200px] z-60"
               >
                 {/* Volume Label */}
                 <div className="text-xs text-gray-300 mb-3 text-center font-medium">
                   Volume: {volume}%
                 </div>
                 
                 {/* Enhanced Volume Slider */}
                 <div className="flex items-center space-x-3">
                   <VolumeX className="w-3 h-3 text-gray-400" />
                   <div className="flex-1 relative">
                     {/* Custom Slider Track */}
                     <div className="volume-slider-container">
                       <div className="volume-slider-glow"></div>
                       <motion.div
                         className="volume-slider-fill"
                         style={{ width: `${volume}%` }}
                         initial={false}
                         animate={{ width: `${volume}%` }}
                         transition={{ 
                           type: "spring", 
                           stiffness: 1200, 
                           damping: 50,
                           mass: 0.2
                         }}
                       />
                     </div>
                     
                     {/* Hidden Input Slider */}
                     <input
                       type="range"
                       min="0"
                       max="100"
                       value={volume}
                       onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                       className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
                       style={{ zIndex: 10 }}
                     />
                     
                     {/* Animated Volume Thumb */}
                     <motion.div
                       className="absolute top-1/2 w-5 h-5 bg-gradient-to-br from-primary via-secondary to-pink-500 rounded-full shadow-lg transform -translate-y-1/2 pointer-events-none border-2 border-white/80"
                       style={{ left: `calc(${volume}% - 10px)` }}
                       initial={false}
                       animate={{ 
                         left: `calc(${volume}% - 10px)`,
                         scale: 1
                       }}
                       whileHover={{ 
                         scale: 1.3,
                         boxShadow: "0 0 0 8px rgba(99, 102, 241, 0.2), 0 6px 20px rgba(99, 102, 241, 0.4)"
                       }}
                       transition={{ 
                         type: "spring", 
                         stiffness: 1000, 
                         damping: 30 
                       }}
                     >
                       {/* Inner glow */}
                       <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
                     </motion.div>
                     
                     {/* Volume Level Indicators */}
                     <div className="absolute -bottom-2 left-0 right-0 flex justify-between text-xs opacity-50">
                       {[0, 25, 50, 75, 100].map((level) => (
                         <div
                           key={level}
                           className={`w-0.5 h-1 rounded-full transition-all duration-75 ${
                             volume >= level ? 'bg-primary' : 'bg-gray-600'
                           }`}
                         />
                       ))}
                     </div>
                   </div>
                   <Volume2 className="w-3 h-3 text-gray-400" />
                 </div>

                 {/* Audio Speed Control */}
                 <div className="mt-4 pt-3 border-t border-white/10">
                   <div className="text-xs text-gray-300 mb-2 text-center font-medium">
                     Playback Speed: {playbackRate}x
                   </div>
                   <div className="flex justify-center space-x-1">
                     {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                       <motion.button
                         key={rate}
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => handlePlaybackRateChange(rate)}
                                                    className={`px-2 py-1 text-xs rounded transition-all duration-100 ${
                             playbackRate === rate
                               ? 'bg-gradient-to-r from-primary to-secondary text-white'
                               : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                           }`}
                       >
                         {rate}x
                       </motion.button>
                     ))}
                   </div>
                 </div>

                 {/* Arrow pointer */}
                 <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/10 border-t border-l border-white/10 rotate-45"></div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       )}

      {/* Audio visualization indicator */}
      {isPlaying && !isMuted && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  )
}
