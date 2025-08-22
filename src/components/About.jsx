import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Database, Brain, Award, GraduationCap, BookOpen, Users, Zap } from 'lucide-react'

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

  const expertiseAreas = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Full Stack Development",
      description: "Expert in building scalable web and mobile applications using modern technologies and frameworks."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI & Machine Learning",
      description: "Specialized in developing intelligent solutions with computer vision, NLP, and deep learning."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Analytics",
      description: "Proficient in data analysis, visualization, and generating actionable insights from complex datasets."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Cloud Computing",
      description: "Experience with AWS, Azure, and cloud-native application development and deployment."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Strong problem-solving skills and experience working in collaborative development environments."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Continuous Learning",
      description: "Committed to staying current with 70+ certifications in cutting-edge technologies and methodologies."
    }
  ]

  const certifications = [
    { category: "Web Development", count: 8, color: "from-blue-500 to-cyan-500" },
    { category: "Programming Languages", count: 14, color: "from-green-500 to-emerald-500" },
    { category: "C# & .NET", count: 5, color: "from-purple-500 to-pink-500" },
    { category: "Data Science", count: 5, color: "from-orange-500 to-red-500" },
    { category: "AI & Machine Learning", count: 8, color: "from-indigo-500 to-blue-500" },
    { category: "SAP Technologies", count: 10, color: "from-yellow-500 to-orange-500" },
    { category: "Cloud Computing", count: 2, color: "from-teal-500 to-cyan-500" },
    { category: "DevOps & Tools", count: 2, color: "from-gray-500 to-slate-500" },
    { category: "Project Management", count: 7, color: "from-pink-500 to-rose-500" }
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
              Software Developer with 6 years of expertise in full stack development, artificial intelligence, and data analytics
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Personal Story */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">My Journey</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  I bring a solid combination of academic achievement and practical application, including expertise in developing 
                  scalable web and mobile applications, utilizing data to generate insights, and collaborating with AI models.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  With more than 70 certifications in state-of-the-art technologies and methodologies, I am committed to developing 
                  intelligent, user-focused solutions and staying up to date with the latest developments in the tech industry.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  I'm dedicated to delivering high-quality work, always adding my personal touch and pushing for complete, 
                  detail-oriented results that exceed expectations.
                </p>
              </div>
            </motion.div>

            {/* Profile Image Placeholder with Tech Visualization */}
            <motion.div variants={itemVariants} className="relative">
              <div className="glass p-8 rounded-2xl text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
                  <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                    <div className="text-6xl font-bold text-gradient">AI</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ali Izzeldin</h3>
                <p className="text-primary font-medium">Software Developer & AI Specialist</p>
                
                {/* Education Info */}
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="w-5 h-5 text-primary mr-2" />
                    <span className="text-sm text-gray-300">Bachelor of Computer Science</span>
                  </div>
                  <div className="text-sm text-gray-400">Arab American University</div>
                </div>
                
                {/* Audio Engineer Badge */}
                <motion.div 
                  className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30 cursor-pointer group relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating music notes */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-purple-400/60"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0, 1, 0],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      >
                        {['♪', '♫', '♬'][i]}
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center relative z-10">
                    <motion.span 
                      className="text-purple-400 text-sm font-medium group-hover:text-purple-200 transition-colors duration-300"
                      animate={{
                        textShadow: [
                          "0 0 5px rgba(147, 51, 234, 0.5)",
                          "0 0 15px rgba(147, 51, 234, 0.8)",
                          "0 0 5px rgba(147, 51, 234, 0.5)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      🎵 Audio Engineer
                    </motion.span>
                  </div>
                </motion.div>
                
                {/* Tech Bars Animation */}
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

          {/* Expertise Areas Grid */}
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Core Expertise Areas
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertiseAreas.map((item, index) => (
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

          {/* Certifications Overview */}
          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Professional Certifications
            </h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass p-6 rounded-xl text-center hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${cert.color} flex items-center justify-center`}>
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {cert.category}
                  </h4>
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {cert.count}
                  </div>
                  <p className="text-sm text-gray-400">
                    Certifications
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Key Projects Teaser */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Notable Projects</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                From AI-powered sign language translation systems to comprehensive family coordination apps, 
                I've developed innovative solutions that demonstrate my full-stack capabilities and AI expertise.
              </p>
              <p className="text-primary font-semibold">
                Ready to explore my projects? Check out my portfolio below! 💻
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
