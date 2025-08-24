import React, { useState } from 'react'
import LetterAvatar from './LetterAvatar'

const Avatar = ({ 
  src, 
  alt, 
  size = 40, 
  className = '',
  fallbackText = '',
  showBorder = false 
}) => {
  const [imageError, setImageError] = useState(false)

  // If no src or image failed to load, show letter avatar
  if (!src || imageError) {
    // Convert pixel size to Tailwind classes
    const getSizeClass = (size) => {
      if (size <= 24) return 'w-6 h-6'
      if (size <= 32) return 'w-8 h-8'
      if (size <= 40) return 'w-10 h-10'
      if (size <= 48) return 'w-12 h-12'
      if (size <= 56) return 'w-14 h-14'
      if (size <= 64) return 'w-16 h-16'
      if (size <= 80) return 'w-20 h-20'
      if (size <= 96) return 'w-24 h-24'
      if (size <= 128) return 'w-32 h-32'
      return 'w-40 h-40'
    }
    
    const getTextSize = (size) => {
      if (size <= 24) return 'text-xs'
      if (size <= 32) return 'text-sm'
      if (size <= 48) return 'text-lg'
      if (size <= 64) return 'text-xl'
      if (size <= 80) return 'text-2xl'
      if (size <= 96) return 'text-3xl'
      if (size <= 128) return 'text-4xl'
      return 'text-5xl'
    }
    
    return (
      <LetterAvatar 
        text={fallbackText || alt || 'U'} 
        size={getSizeClass(size)}
        textSize={getTextSize(size)}
        className={className}
      />
    )
  }

  return (
    <div 
      className={`
        rounded-full overflow-hidden flex-shrink-0
        ${showBorder ? 'ring-2 ring-gray-200' : ''}
        ${className}
      `}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt || 'Avatar'}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export default Avatar
