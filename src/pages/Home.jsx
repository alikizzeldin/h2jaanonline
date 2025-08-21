import React from 'react'
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'
import BackgroundMusic from '../components/BackgroundMusic'
import Hero from '../components/Hero'
import About from '../components/About'
import Gaming from '../components/Gaming'
import Skills from '../components/Skills'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark overflow-x-hidden">
      <AnimatedBackground />
      <BackgroundMusic />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Gaming />
        <Contact />
      </main>
      
      {/* Floating elements for extra visual appeal */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
