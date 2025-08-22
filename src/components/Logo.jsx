import React from 'react'
import { motion } from 'framer-motion'

const Logo = ({ 
  size = 'default', 
  showText = true, 
  showSubtitle = true, 
  className = '',
  onClick = null 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  const textSizes = {
    small: 'text-sm',
    default: 'text-xl',
    large: 'text-2xl'
  }

  const subtitleSizes = {
    small: 'text-xs',
    default: 'text-xs',
    large: 'text-sm'
  }

  const LogoContent = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
             <img 
         src="/assets/logos/h2jaan-logo.png" 
         alt="H2jaan Online Logo" 
         className={sizeClasses[size]}
       />
      {showText && (
        <div className="flex flex-col">
                     <span className={`font-bold text-gradient ${textSizes[size]}`}>
             Ali Izzeldin
           </span>
           {showSubtitle && (
             <span className={`text-gray-400 -mt-1 ${subtitleSizes[size]}`}>
               Full Stack & AI Developer
             </span>
           )}
        </div>
      )}
    </div>
  )

  if (onClick) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="focus:outline-none"
      >
        <LogoContent />
      </motion.button>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
    >
      <LogoContent />
    </motion.div>
  )
}

export default Logo
