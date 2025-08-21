import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mic, AudioWaveform, Headphones, Music, Volume2, Radio } from 'lucide-react'

export default function About() {
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

  const audioExpertise = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Recording & Production",
      description: "Professional audio recording, mixing, and mastering with industry-standard equipment and techniques."
    },
    {
      icon: <AudioWaveform className="w-6 h-6" />,
      title: "Sound Design",
      description: "Creating immersive soundscapes and custom audio effects for various media projects."
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Audio Post-Production",
      description: "Expert in audio editing, restoration, and enhancement for broadcast and digital media."
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Music Production",
      description: "Composing, arranging, and producing original music across multiple genres and styles."
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Live Sound Engineering",
      description: "Managing live audio systems, from small venues to large-scale events and concerts."
    },
    {
      icon: <Radio className="w-6 h-6" />,
      title: "Broadcast Audio",
      description: "Specialized in radio production, podcast engineering, and streaming audio optimization."
    }
  ]

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              About Me
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A passionate creator at the intersection of audio engineering, technology, and gaming
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Personal Story */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">My Journey</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  With a deep passion for audio engineering and technology, I've dedicated my career to 
                  creating exceptional audio experiences. From recording studios to live venues, 
                  I bring technical expertise and creative vision to every project.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  My expertise spans across multiple domains - from professional audio production 
                  and sound design to software development and system optimization. I believe in 
                  the power of technology to enhance creative expression.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  When I'm not crafting the perfect mix or coding innovative solutions, you'll find me 
                  dominating the battlefields in <span className="text-primary font-semibold">SMITE 2</span>, 
                  my absolute favorite game, or competing in Valorant, Rocket League, and other competitive titles.
                </p>
              </div>
            </motion.div>

            {/* Profile Image Placeholder with Audio Visualization */}
            <motion.div variants={itemVariants} className="relative">
              <div className="glass p-8 rounded-2xl text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
                  <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                    <div className="text-6xl font-bold text-gradient">AI</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ali Izzeldin</h3>
                <p className="text-primary font-medium">Audio Engineer & Developer</p>
                
                {/* Audio Bars Animation */}
                <div className="flex justify-center items-end space-x-1 mt-6 h-16">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-primary to-secondary rounded-full"
                      animate={{
                        height: [10, Math.random() * 50 + 20, 10],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Audio Expertise Grid */}
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Audio Engineering Expertise
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {audioExpertise.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass p-6 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white ml-3">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gaming Passion Teaser */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Beyond the Studio</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                My passion extends beyond audio engineering into the competitive gaming world. 
                As a dedicated gamer, I bring the same precision and strategic thinking from audio production 
                to virtual battlefields.
              </p>
              <p className="text-primary font-semibold">
                Ready to see my gaming achievements? Check out my gaming section below! 🎮
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-pulse-slow" />
      </div>
    </section>
  )
}
