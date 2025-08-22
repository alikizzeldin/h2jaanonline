import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Headphones, 
  Mic, 
  Music, 
  Volume2, 
  Video, 
  Camera, 
  Palette, 
  Edit3,
  Zap,
  Layers,
  Settings,
  Users
} from 'lucide-react'

export default function CreativeSkills() {
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

  const audioSkills = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Over & Recording",
      description: "Professional voice recording, editing, and post-production with industry-standard equipment.",
      level: 95
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Music Production",
      description: "Composing, arranging, and producing original music across multiple genres and styles.",
      level: 90
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Mixing & Mastering",
      description: "Expert audio mixing, mastering, and sound design for various media projects.",
      level: 92
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Sound Design",
      description: "Creating immersive soundscapes and custom audio effects for media projects.",
      level: 88
    }
  ]

  const videoSkills = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Editing",
      description: "Professional video editing with Adobe Premiere Pro and advanced post-production techniques.",
      level: 90
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Motion Graphics",
      description: "Creating dynamic motion graphics and visual effects for video content.",
      level: 85
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Color Grading",
      description: "Professional color correction and grading for cinematic video quality.",
      level: 87
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Video Post-Production",
      description: "Comprehensive video post-production including effects, transitions, and final delivery.",
      level: 88
    }
  ]

  const designSkills = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Graphic Design",
      description: "Creating compelling visual designs, logos, and branding materials.",
      level: 85
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Image Editing",
      description: "Professional photo editing and manipulation using advanced techniques.",
      level: 90
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Digital Art",
      description: "Creating digital artwork and illustrations for various media platforms.",
      level: 82
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "UI/UX Design",
      description: "Designing user interfaces and user experiences for web and mobile applications.",
      level: 88
    }
  ]

  const SkillBar = ({ skill, delay }) => (
    <motion.div
      initial={{ width: 0 }}
      animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
      transition={{ duration: 1.5, delay: delay * 0.1, ease: "easeOut" }}
      className="flex items-center justify-between mb-4"
    >
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">{skill.title}</span>
          <span className="text-sm text-gray-400">{skill.level}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
            transition={{ duration: 1.5, delay: delay * 0.1, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  )

  return (
    <section id="creative-skills" className="py-20 relative">
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
              Creative Skills
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Beyond programming, I bring creative expertise in audio engineering, video production, and digital design
            </p>
          </motion.div>

          {/* Audio Engineering Skills */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-4">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Audio Engineering</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {audioSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mr-3">
                        {skill.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-white">{skill.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {skill.description}
                    </p>
                    <SkillBar skill={skill} delay={index} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Video Production Skills */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 mr-4">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Video Production</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {videoSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 mr-3">
                        {skill.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-white">{skill.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {skill.description}
                    </p>
                    <SkillBar skill={skill} delay={index} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Design Skills */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 mr-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Digital Design</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {designSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 mr-3">
                        {skill.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-white">{skill.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {skill.description}
                    </p>
                    <SkillBar skill={skill} delay={index} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Creative Philosophy */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Creative Philosophy</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                My creative skills complement my technical expertise, allowing me to create comprehensive solutions 
                that are both functionally excellent and visually appealing. Whether it's audio production, 
                video editing, or graphic design, I bring the same attention to detail and passion for quality 
                that I apply to software development.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "Adobe Premiere Pro",
                  "FL Studio",
                  "Figma",
                  "Adobe Photoshop",
                  "Sound Design",
                  "Motion Graphics"
                ].map((tool, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full text-sm font-medium text-primary border border-primary/30"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  )
}
