import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Code, 
  Brain, 
  Smartphone, 
  Globe, 
  Database, 
  Zap,
  Award,
  Star,
  Github,
  ExternalLink
} from 'lucide-react'

export default function Projects() {
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

  const projects = [
    {
      name: "VocalHands - Arabic Sign Language Translator AI",
      status: "🤖 AI/ML PROJECT",
      description: "Real-time Arabic sign language translation system using computer vision and machine learning. Processes 21 hand landmarks with 95% accuracy for Arabic letter recognition.",
      technologies: ["Python", "TensorFlow", "MediaPipe", "Computer Vision", "NLP"],
      role: "Full Stack AI Development",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/50",
      featured: true
    },
    {
      name: "Lamma - Family Coordination App",
      status: "📱 MOBILE APP",
      description: "Comprehensive Flutter mobile application for family coordination featuring real-time chat, event planning, interactive games, and household management tools.",
      technologies: ["Flutter", "Dart", "Firebase", "Real-time", "Cross-platform"],
      role: "Full Stack Mobile Development",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/50",
      featured: true
    },
    {
      name: "AAUP Chatbot",
      status: "💬 AI CHATBOT",
      description: "Desktop application combining real-time communication with intelligent document processing. Features voice communication, camera sharing, and AI-powered chatbot interface.",
      technologies: ["Python", "PyQt5", "WebSocket", "OpenCV", "AI APIs"],
      role: "AI Integration & Desktop Development",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
      border: "border-green-500/50"
    },
    {
      name: "MindMate - Study Helper AI Agent",
      status: "🧠 AI TUTOR",
      description: "Intelligent study companion using OpenAI API through OpenRouter. Features AI-powered tutoring, automated quiz generation, and smart task management.",
      technologies: ["Python", "OpenAI API", "CustomTkinter", "NLP", "Multi-threading"],
      role: "AI Application Development",
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
      border: "border-orange-500/50"
    },
    {
      name: "Bookstore Website - ASP.NET MVC",
      status: "🌐 WEB APPLICATION",
      description: "Full-featured ASP.NET MVC web application with user authentication, shopping cart system, and complete checkout process. Modern UI with Arabic support.",
      technologies: ["C#", "ASP.NET MVC", "Entity Framework", "SQL Server", "Bootstrap"],
      role: "Full Stack Web Development",
      color: "from-indigo-500 to-blue-500",
      gradient: "bg-gradient-to-br from-indigo-500/20 to-blue-500/20",
      border: "border-indigo-500/50"
    },
    {
      name: "Memo Game - Visual Programming",
      status: "🎮 GAME DEVELOPMENT",
      description: "Feature-rich memory card matching game with multiple difficulty levels, real-time score tracking, and custom graphics using C# and Windows Forms.",
      technologies: ["C#", "Windows Forms", "Game Logic", "Audio Integration", "UI Design"],
      role: "Game Development",
      color: "from-yellow-500 to-orange-500",
      gradient: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/50"
    }
  ]

  const projectStats = [
    { label: "Projects Completed", value: "6+", icon: <Code className="w-6 h-6" /> },
    { label: "AI/ML Projects", value: "3", icon: <Brain className="w-6 h-6" /> },
    { label: "Mobile Apps", value: "2", icon: <Smartphone className="w-6 h-6" /> },
    { label: "Web Applications", value: "3", icon: <Globe className="w-6 h-6" /> }
  ]

  return (
    <section id="projects" className="py-20 relative">
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
                <Code className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A showcase of innovative software solutions demonstrating full-stack development, 
              AI/ML expertise, and creative problem-solving across multiple domains
            </p>
          </motion.div>

          {/* Project Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {projectStats.map((stat, index) => (
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

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`project-card glass p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 border ${project.border} ${project.gradient} group relative ${project.featured ? 'ring-2 ring-primary/50' : ''}`}
              >
                {/* Project Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Code className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                      {project.status}
                    </span>
                    {project.featured && (
                      <span className="text-xs font-bold text-yellow-500 mt-1">⭐ FEATURED</span>
                    )}
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                  {project.name}
                </h3>

                {/* Project Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Role */}
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">{project.role}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-primary/20 transition-all duration-300"
                  >
                    <Github className="w-4 h-4 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-secondary/20 transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </motion.button>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* Featured Project Highlight */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="glass p-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gradient mb-4">VocalHands - AI Innovation</h3>
                <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
                  My most innovative project, VocalHands bridges communication barriers for the deaf and hard-of-hearing community 
                  through real-time Arabic sign language translation. This project demonstrates advanced computer vision, 
                  machine learning, and accessibility-focused development.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-500 mb-1">Accuracy</div>
                    <div className="text-gray-300">95%+ for trained gestures</div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-500 mb-1">Technology</div>
                    <div className="text-gray-300">Computer Vision + ML</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Development Philosophy */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Development Philosophy</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                I believe in creating solutions that not only solve technical challenges but also make a positive impact. 
                Whether it's AI-powered accessibility tools, family coordination apps, or educational AI agents, 
                my projects focus on user experience, innovation, and real-world applicability.
              </p>
              <p className="text-primary font-semibold">
                Ready to collaborate on your next project? Let's build something amazing together! 💻
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Project Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Code Icons */}
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
            <Code className="w-6 h-6 text-primary" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
