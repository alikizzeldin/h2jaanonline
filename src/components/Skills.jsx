import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Code, 
  Database, 
  Globe, 
  Smartphone, 
  Headphones, 
  Mic, 
  Music, 
  Volume2,
  Terminal,
  Layers,
  Zap,
  Settings
} from 'lucide-react'

export default function Skills() {
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

  const skillCategories = [
    {
      title: "Audio Engineering",
      icon: <Headphones className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "Pro Tools", level: 95 },
        { name: "Logic Pro X", level: 90 },
        { name: "Ableton Live", level: 88 },
        { name: "Cubase", level: 85 },
        { name: "Reaper", level: 80 },
        { name: "Adobe Audition", level: 85 }
      ]
    },
    {
      title: "Programming",
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "JavaScript", level: 92 },
        { name: "React", level: 90 },
        { name: "Node.js", level: 85 },
        { name: "Python", level: 88 },
        { name: "TypeScript", level: 80 },
        { name: "SQL", level: 75 }
      ]
    },
    {
      title: "Audio Hardware",
      icon: <Mic className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Mixing Consoles", level: 95 },
        { name: "Microphones", level: 90 },
        { name: "Studio Monitors", level: 88 },
        { name: "Audio Interfaces", level: 85 },
        { name: "Outboard Gear", level: 82 },
        { name: "Live Sound Systems", level: 80 }
      ]
    },
    {
      title: "Development Tools",
      icon: <Terminal className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
      skills: [
        { name: "Git/GitHub", level: 88 },
        { name: "VS Code", level: 95 },
        { name: "Docker", level: 75 },
        { name: "AWS", level: 70 },
        { name: "Figma", level: 80 },
        { name: "Webpack", level: 78 }
      ]
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
          <span className="text-sm font-medium text-white">{skill.name}</span>
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
    <section id="skills" className="py-20 relative">
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
              Skills & Expertise
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive toolkit spanning audio engineering, software development, and technical innovation
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="glass p-8 rounded-2xl hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} mr-4`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <SkillBar 
                      key={skill.name} 
                      skill={skill} 
                      delay={categoryIndex * 6 + skillIndex}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technical Highlights */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Technical Highlights
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Performance",
                  description: "Optimized audio processing and real-time system performance"
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  title: "Architecture",
                  description: "Scalable software design and modular audio system integration"
                },
                {
                  icon: <Settings className="w-6 h-6" />,
                  title: "Automation",
                  description: "Custom scripts and tools for workflow optimization"
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: "Integration",
                  description: "Cross-platform compatibility and API development"
                }
              ].map((highlight, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass p-6 rounded-xl text-center hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary group-hover:text-white transition-colors">
                      {highlight.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {highlight.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {highlight.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications & Awards */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Continuous Learning</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                I'm constantly expanding my skillset through professional development, 
                industry certifications, and hands-on project experience. My passion for 
                both audio engineering and software development drives me to stay at the 
                forefront of technological innovation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "Audio Engineering Society Member",
                  "Pro Tools Certified",
                  "AWS Cloud Practitioner",
                  "Agile Development",
                  "Live Sound Specialist"
                ].map((cert, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full text-sm font-medium text-primary border border-primary/30"
                  >
                    {cert}
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
