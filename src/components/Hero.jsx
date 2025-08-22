import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Headphones, Code, Gamepad2 } from 'lucide-react'

export default function Hero() {
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 200,
        delay: 1
      }
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left z-10"
          >
            {/* Greeting */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30">
                Welcome to my digital realm
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="block text-white">Hi, I'm</span>
              <span className="block text-gradient animate-pulse-slow">Ali Izzeldin</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl lg:max-w-none leading-relaxed"
            >
              Audio Engineer • Software Developer • Gaming Enthusiast
            </motion.p>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-400 mb-12 max-w-2xl lg:max-w-none leading-relaxed"
            >
              Crafting immersive audio experiences, building innovative software solutions, 
              and conquering virtual battlefields. Welcome to my world where technology meets creativity.
            </motion.p>

            {/* Expertise Icons */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center lg:justify-start items-center space-x-8 mb-12"
            >
              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="flex flex-col items-center group"
              >
                <div className="p-4 rounded-full glass glow group-hover:bg-primary/20 transition-all duration-300">
                  <Headphones className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm text-gray-400 mt-2 group-hover:text-primary transition-colors">Audio</span>
              </motion.div>

              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.2, rotate: -5 }}
                className="flex flex-col items-center group"
              >
                <div className="p-4 rounded-full glass glow group-hover:bg-secondary/20 transition-all duration-300">
                  <Code className="w-8 h-8 text-secondary" />
                </div>
                <span className="text-sm text-gray-400 mt-2 group-hover:text-secondary transition-colors">Code</span>
              </motion.div>

              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="flex flex-col items-center group"
              >
                <div className="p-4 rounded-full glass glow group-hover:bg-accent/20 transition-all duration-300">
                  <Gamepad2 className="w-8 h-8 text-accent" />
                </div>
                <span className="text-sm text-gray-400 mt-2 group-hover:text-accent transition-colors">Gaming</span>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-16"
            >
              <motion.a
                href="#about"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 glow"
              >
                Explore My Work
              </motion.a>
              
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass rounded-full text-white font-semibold border border-primary/30 hover:border-primary/60 transition-all duration-300"
              >
                Get In Touch
              </motion.a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center lg:items-start"
            >
              <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ChevronDown className="w-6 h-6 text-primary" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Spline 3D Robot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative h-[900px] lg:h-[1000px] flex items-start justify-center pt-8"
          >
            <iframe 
              src='https://my.spline.design/nexbotrobotcharacterconcept-odNgd5gDSGb57a9kcWNwQhe7/' 
              frameborder='0' 
              width='100%' 
              height='100%'
            />
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </section>
  )
}
