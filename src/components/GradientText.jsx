import React from 'react'
import { motion } from 'framer-motion'

const GradientText = ({ children, className = '', enabled = false, ...props }) => {
  if (!enabled) {
    return <span className={className} {...props}>{children}</span>
  }

  // Remove any text color classes that might conflict with gradient
  const cleanClassName = className
    .replace(/\btext-\w+\b/g, '') // Remove all text color classes
    .replace(/\s+/g, ' ') // Clean up extra spaces
    .trim()
  
  // Add font size boost for gradient text
  const sizeBoost = cleanClassName.includes('text-sm') ? 'text-base' : 
                   cleanClassName.includes('text-base') ? 'text-lg' :
                   cleanClassName.includes('text-lg') ? 'text-xl' :
                   cleanClassName.includes('text-xl') ? 'text-2xl' :
                   cleanClassName.includes('text-2xl') ? 'text-3xl' :
                   'text-lg' // default boost
  const gradientClasses = `${cleanClassName} ${sizeBoost} bg-gradient-to-r from-red-400 via-red-600 to-black bg-clip-text text-transparent animate-gradient-x`
  
  return (
    <motion.span
      className={gradientClasses}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default GradientText
