import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Code, Database, Brain, Award, Github, Linkedin } from 'lucide-react'

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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left z-10"
          >
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
              Software Developer • AI/ML Specialist • Full Stack Engineer
            </motion.p>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-400 mb-12 max-w-2xl lg:max-w-none leading-relaxed"
            >
              With 6 years of experience in full stack development, artificial intelligence, and data analytics. 
              Over 70+ certifications in cutting-edge technologies. Passionate about building intelligent, 
              user-focused solutions that drive innovation.
            </motion.p>

            {/* Creative Achievement Badge */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center lg:justify-start mb-8"
            >
              <motion.div 
                className="glass p-3 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm relative overflow-hidden group cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-dark rounded-xl h-full w-full" />
                </div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-3 relative z-10">
                  <motion.div 
                    className="p-2 rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 0 15px rgba(251, 191, 36, 0.5)",
                        "0 0 25px rgba(251, 191, 36, 0.8)",
                        "0 0 15px rgba(251, 191, 36, 0.5)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-white text-lg">🏆</span>
                  </motion.div>
                  
                  <div className="text-left">
                    <motion.div 
                      className="text-white font-bold text-base mb-1 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      70+ Professional Certifications
                    </motion.div>
                    <div className="text-gray-300 text-xs">
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">AI/ML</span>
                      <span className="text-gray-400"> • </span>
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-medium">Web Dev</span>
                      <span className="text-gray-400"> • </span>
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">Cloud</span>
                      <span className="text-gray-400"> • </span>
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-medium">SAP</span>
                      <span className="text-gray-400"> • </span>
                      <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent font-medium">Data Science</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

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
                  <Code className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm text-gray-400 mt-2 group-hover:text-primary transition-colors">Full Stack</span>
              </motion.div>

              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.2, rotate: -5 }}
                className="flex flex-col items-center group"
              >
                <div className="p-4 rounded-full glass glow group-hover:bg-secondary/20 transition-all duration-300">
                  <Brain className="w-8 h-8 text-secondary" />
                </div>
                <span className="text-sm text-gray-400 mt-2 group-hover:text-secondary transition-colors">AI/ML</span>
              </motion.div>

              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="flex flex-col items-center group"
              >
                <div className="p-4 rounded-full glass glow group-hover:bg-accent/20 transition-all duration-300">
                  <Database className="w-8 h-8 text-accent" />
                </div>
                <span className="text-sm text-gray-400 mt-2 group-hover:text-accent transition-colors">Data</span>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center lg:justify-start items-center space-x-4 mb-12"
            >
              <motion.a
                href="https://github.com/alikizzeldin"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full glass hover:bg-primary/20 transition-all duration-300"
              >
                <Github className="w-6 h-6 text-white" />
              </motion.a>
              
              <motion.a
                href="https://www.linkedin.com/in/ali-izzeldin/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full glass hover:bg-blue-500/20 transition-all duration-300"
              >
                <Linkedin className="w-6 h-6 text-white" />
              </motion.a>
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
                View My Work
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
            className="relative h-[900px] lg:h-[1000px] flex items-start justify-center -mt-20"
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
