import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Zap, 
  Shield, 
  Sword,
  Crown,
  Star,
  Award
} from 'lucide-react'

export default function Gaming() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
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

  const games = [
    {
      name: "SMITE 2",
      status: "🏆 FAVORITE",
      description: "My absolute favorite game! Dominating the battleground of the gods with strategic gameplay and precise execution.",
      role: "Main: Jungle/ADC",
      logo: "/assets/smite2.jpg",
      color: "from-yellow-500 to-orange-500",
      gradient: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/50"
    },
    {
      name: "Valorant",
      status: "🎯 COMPETITIVE",
      description: "Tactical FPS mastery with precise aim and strategic team coordination.",
      role: "Main: Duelist/Initiator",
      logo: "/assets/valorant.jpg",
      color: "from-red-500 to-pink-500",
      gradient: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
      border: "border-red-500/50"
    },
    {
      name: "Rocket League",
      status: "🚀 AERIAL MASTER",
      description: "High-octane car soccer with incredible aerial mechanics and team plays.",
      role: "Position: All-rounder",
      logo: "/assets/rocketleauge.png",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/50"
    },
    {
      name: "CS2",
      status: "🔫 TACTICAL",
      description: "Classic tactical shooter with precise aim and strategic gameplay.",
      role: "Main: Rifler/AWPer",
      logo: "/assets/cs2.png",
      color: "from-gray-500 to-slate-500",
      gradient: "bg-gradient-to-br from-gray-500/20 to-slate-500/20",
      border: "border-gray-500/50"
    },
    {
      name: "Call of Duty",
      status: "⚡ FAST-PACED",
      description: "Intense multiplayer action with quick reflexes and aggressive playstyle.",
      role: "Style: Aggressive",
      logo: "/assets/COD.png",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
      border: "border-green-500/50"
    },
    {
      name: "Marvel Rivals",
      status: "🦸 HERO",
      description: "Superhero team battles with strategic hero selection and team coordination.",
      role: "Main: Tank/Support",
      logo: "/assets/MR.png",
      color: "from-purple-500 to-violet-500",
      gradient: "bg-gradient-to-br from-purple-500/20 to-violet-500/20",
      border: "border-purple-500/50"
    }
  ]

  const gamingStats = [
    { label: "Years Gaming", value: "15+", icon: <Trophy className="w-6 h-6" /> },
    { label: "Favorite Genre", value: "MOBA", icon: <Crown className="w-6 h-6" /> },
    { label: "Competitive Ranks", value: "High Tier", icon: <Award className="w-6 h-6" /> },
    { label: "Playstyle", value: "Strategic", icon: <Target className="w-6 h-6" /> }
  ]

  return (
    <section id="gaming" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <Gamepad2 className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Gaming Arsenal
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From the battlegrounds of ancient gods to futuristic battlefields, 
              I bring the same precision and strategic thinking from audio engineering to competitive gaming
            </p>
          </motion.div>

          {/* Gaming Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {gamingStats.map((stat, index) => (
              <div key={index} className="glass p-6 rounded-xl text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {games.map((game, index) => (
              <motion.div
                key={game.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`gaming-card glass p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 border ${game.border} ${game.gradient} group`}
              >
                                 {/* Game Header */}
                 <div className="flex items-center justify-between mb-4">
                   <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                     <img 
                       src={game.logo} 
                       alt={game.name}
                       className={`w-full h-full object-cover rounded-lg ${
                         game.name === 'Call of Duty' ? 'scale-100' : ''
                       }`}
                       onError={(e) => {
                         e.target.style.display = 'none';
                         e.target.nextSibling.style.display = 'flex';
                       }}
                     />
                     <div className="hidden w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center">
                       <Gamepad2 className="w-8 h-8 text-primary" />
                     </div>
                   </div>
                   <span className="text-xs font-bold text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                     {game.status}
                   </span>
                 </div>

                {/* Game Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                  {game.name}
                </h3>

                {/* Game Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {game.description}
                </p>

                {/* Game Details */}
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">{game.role}</span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* SMITE 2 Special Highlight */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="glass p-8 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gradient mb-4">SMITE 2 - My Gaming Obsession</h3>
                <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
                  SMITE 2 isn't just my favorite game—it's my passion. The strategic depth, 
                  mythological lore, and intense team battles create the perfect gaming experience. 
                  From mastering complex god kits to executing game-changing team fights, 
                  every match is an opportunity to showcase tactical brilliance.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-lg">
                    <div className="text-lg font-bold text-yellow-500 mb-1">Favorite Role</div>
                    <div className="text-gray-300">Jungle & ADC</div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <div className="text-lg font-bold text-yellow-500 mb-1">Playstyle</div>
                    <div className="text-gray-300">Aggressive & Strategic</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gaming Philosophy */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">The Art of Gaming</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Gaming, like audio engineering, requires precision, timing, and an understanding 
                of complex systems. Whether I'm mixing a perfect track or executing a perfect team fight, 
                the principles remain the same: attention to detail, strategic thinking, and relentless improvement.
              </p>
              <p className="text-primary font-semibold">
                Ready to team up or discuss strategies? Let's connect! 🎮
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Gaming Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Gaming Icons */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <Gamepad2 className="w-6 h-6 text-primary" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
