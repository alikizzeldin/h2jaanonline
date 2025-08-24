import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const GradientDebug = () => {
  const { userProfile } = useAuth()

  if (!userProfile) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs">
      <div className="font-bold mb-2">Gradient Debug Info:</div>
      <div>text_gradient_enabled: {userProfile.text_gradient_enabled ? '✅ true' : '❌ false'}</div>
      <div>text_gradient_purchased: {userProfile.text_gradient_purchased ? '✅ true' : '❌ false'}</div>
      <div>username: {userProfile.username}</div>
      <div>full_name: {userProfile.full_name}</div>
      <div>avatar: {userProfile.avatar ? '✅ present' : '❌ missing'}</div>
      <div>avatar length: {userProfile.avatar ? userProfile.avatar.length : 0}</div>
      <div>Last updated: {new Date().toLocaleTimeString()}</div>
    </div>
  )
}

export default GradientDebug
