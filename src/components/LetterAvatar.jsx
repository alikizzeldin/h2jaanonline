import React from 'react'

export default function LetterAvatar({ username, fullName, size = 'w-32 h-32', textSize = 'text-4xl' }) {
  // Get the first letter from username or full name
  const getInitial = () => {
    if (fullName && fullName.trim()) {
      return fullName.trim().charAt(0).toUpperCase()
    }
    if (username && username.trim()) {
      return username.trim().charAt(0).toUpperCase()
    }
    return '?'
  }

  // Generate a consistent color based on the initial
  const getBackgroundColor = (initial) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-cyan-500 to-cyan-600',
      'from-orange-500 to-orange-600',
      'from-teal-500 to-teal-600',
      'from-rose-500 to-rose-600',
      'from-violet-500 to-violet-600',
    ]
    
    // Use character code to get consistent color
    const charCode = initial.charCodeAt(0)
    const colorIndex = charCode % colors.length
    return colors[colorIndex]
  }

  const initial = getInitial()
  const bgColor = getBackgroundColor(initial)

  return (
    <div className={`${size} rounded-full bg-gradient-to-br ${bgColor} flex items-center justify-center shadow-lg border-4 border-white/10`}>
      <span className={`${textSize} font-bold text-white select-none`}>
        {initial}
      </span>
    </div>
  )
}
