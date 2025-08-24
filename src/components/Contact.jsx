import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { supabase } from '../lib/supabase'
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Code,
  Send,
  User,
  MessageSquare,
  Briefcase
} from 'lucide-react'

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!senderName.trim() && !isAnonymous) {
      setError('Please enter your name')
      return
    }
    
    if (!message.trim()) {
      setError('Please enter a message')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_name: isAnonymous ? 'Anonymous' : senderName.trim(),
            message: message.trim(),
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        throw error
      }

      setSuccess('Message sent successfully! Ali will receive it instantly!')
      setSenderName('')
      setMessage('')
      setIsAnonymous(false)
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnonymousSend = () => {
    setIsAnonymous(true)
    setSenderName('')
  }

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

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "Professional inquiries",
      contact: "aliizzeldindev@gmail.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      description: "Direct communication",
      contact: "+970 595114517",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      description: "Available for remote work",
      contact: "Haifa Street, Jenin, Palestine",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Availability",
      description: "Open to opportunities",
      contact: "Full-time • Contract • Freelance",
      color: "from-indigo-500 to-purple-500"
    }
  ]

  const socialLinks = [
    {
      icon: <Github className="w-6 h-6" />,
      name: "GitHub",
      url: "https://github.com/alikizzeldin",
      color: "hover:text-gray-400"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/ali-izzeldin/",
      color: "hover:text-blue-400"
    },
    {
      icon: <Code className="w-6 h-6" />,
      name: "Portfolio",
      url: "#",
      color: "hover:text-primary"
    }
  ]

  return (
    <section id="contact" className="py-20 relative">
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
              Let's Connect
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ready to collaborate on your next software project, discuss AI/ML opportunities, 
              or explore full-stack development possibilities? I'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
                <p className="text-gray-300 leading-relaxed mb-8">
                  Whether you need a full-stack developer for your next project, want to discuss 
                  AI/ML integration opportunities, or are looking for expertise in mobile app development, 
                  I'm always excited to connect with fellow developers and tech enthusiasts.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="grid gap-4">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="glass p-6 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${method.color} mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        {method.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {method.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-1">
                          {method.description}
                        </p>
                        <p className="text-primary font-medium">
                          {method.contact}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Connect With Me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 glass rounded-lg text-gray-400 ${social.color} transition-all duration-300 hover:bg-white/10`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
                      {success}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
                          isAnonymous 
                            ? 'border-green-500/50 bg-green-500/10' 
                            : 'border-white/10 focus:border-primary/50'
                        }`}
                        placeholder={isAnonymous ? 'Anonymous' : "Enter your name"}
                        disabled={isAnonymous}
                        required={!isAnonymous}
                      />
                    </div>
                    {isAnonymous && (
                      <p className="text-green-400 text-sm mt-1 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Message will be sent anonymously
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        rows="6"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                        placeholder="Tell me about your project, collaboration idea, or development opportunity!"
                        required
                      ></textarea>
                    </div>
                  </div>
                 
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 glow flex items-center justify-center group disabled:opacity-50"
                    >
                      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleAnonymousSend}
                      disabled={loading || isAnonymous}
                      className={`px-4 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group disabled:opacity-50 ${
                        isAnonymous 
                          ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                          : 'bg-gray-600/20 border border-gray-500/50 text-gray-300 hover:bg-gray-600/30'
                      }`}
                    >
                      <span className="text-sm">Anonymous</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Professional CTA */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <div className="glass p-8 rounded-2xl max-w-4xl mx-auto border border-primary/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                💻 Ready to Build Something Amazing?
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                I'm passionate about creating innovative solutions that make a real impact. 
                Whether it's AI-powered applications, full-stack web development, or mobile app creation, 
                let's collaborate to bring your ideas to life!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Full Stack Development", "AI/ML Integration", "Mobile Apps", "Web Applications", "Data Analytics"].map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full text-sm font-medium text-primary border border-primary/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  )
}
