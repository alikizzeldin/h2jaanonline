import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Code, 
  Database, 
  Globe, 
  Smartphone, 
  Brain, 
  Cloud, 
  Terminal, 
  Layers,
  Zap,
  Settings,
  Users,
  Award,
  BookOpen,
  GitBranch
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
      title: "Programming Languages",
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "Python", level: 95 },
        { name: "JavaScript/TypeScript", level: 92 },
        { name: "C# & .NET", level: 90 },
        { name: "Java", level: 88 },
        { name: "Dart/Flutter", level: 85 },
        { name: "C++", level: 80 }
      ]
    },
    {
      title: "Web Development",
      icon: <Globe className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "React.js", level: 95 },
        { name: "ASP.NET Core", level: 92 },
        { name: "HTML5/CSS3", level: 90 },
        { name: "Django", level: 88 },
        { name: "Node.js", level: 85 },
        { name: "Bootstrap", level: 82 }
      ]
    },
    {
      title: "AI & Machine Learning",
      icon: <Brain className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "TensorFlow", level: 90 },
        { name: "Computer Vision", level: 88 },
        { name: "Natural Language Processing", level: 85 },
        { name: "OpenAI API", level: 92 },
        { name: "MediaPipe", level: 87 },
        { name: "ML.NET", level: 80 }
      ]
    },
    {
      title: "Mobile & Cloud",
      icon: <Smartphone className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
      skills: [
        { name: "Flutter Development", level: 92 },
        { name: "Firebase", level: 90 },
        { name: "AWS", level: 85 },
        { name: "Azure", level: 80 },
        { name: "Mobile UI/UX", level: 88 },
        { name: "Cross-platform", level: 90 }
      ]
    }
  ]

  const technicalSkills = [
    {
      title: "Data Science",
      icon: <Database className="w-6 h-6" />,
      skills: ["NumPy", "Pandas", "Data Analysis", "Data Visualization", "Microsoft Copilot"]
    },
    {
      title: "DevOps & Tools",
      icon: <GitBranch className="w-6 h-6" />,
      skills: ["Git/GitHub", "Linux CLI", "Docker", "VS Code", "Figma"]
    },
    {
      title: "SAP Technologies",
      icon: <Layers className="w-6 h-6" />,
      skills: ["SAP S4HANA", "SAP Analytics Cloud", "SAP BusinessObjects", "SAP SuccessFactors"]
    },
    {
      title: "Project Management",
      icon: <Users className="w-6 h-6" />,
      skills: ["Scrum Master", "Agile Development", "Problem Solving", "Critical Thinking", "Team Leadership"]
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
              Technical Skills & Expertise
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive toolkit spanning programming languages, frameworks, AI/ML, and modern development technologies
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

          {/* Additional Technical Skills */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Additional Technical Skills
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technicalSkills.map((skillGroup, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass p-6 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary group-hover:text-white transition-colors">
                      {skillGroup.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white ml-3">
                      {skillGroup.title}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {skillGroup.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full inline-block mr-2 mb-2">
                        {skill}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications & Achievements */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Professional Development</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                I'm constantly expanding my skillset through professional development, 
                industry certifications, and hands-on project experience. With over 70 certifications 
                in cutting-edge technologies, I stay at the forefront of technological innovation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "70+ Professional Certifications",
                  "Bachelor of Computer Science",
                  "AI/ML Specialization",
                  "Full Stack Development",
                  "Cloud Computing Expert",
                  "SAP Technologies Certified"
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
