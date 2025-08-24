import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const AvatarDebug = () => {
  const { userProfile } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <h3 className="font-bold mb-2">Avatar Debug</h3>
      <div className="space-y-1">
        <div>Has Avatar: {userProfile?.avatar ? 'Yes' : 'No'}</div>
        <div>Avatar Length: {userProfile?.avatar?.length || 0}</div>
        <div>Username: {userProfile?.username || 'N/A'}</div>
        <div>Cache Updated: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  )
}

export default AvatarDebug
