import React, { useState } from 'react'
import AvatarUpload from './AvatarUpload'
import Avatar from './Avatar'

const AvatarTest = () => {
  const [avatarData, setAvatarData] = useState(null)

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Avatar Upload Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Upload Avatar</h3>
          <AvatarUpload
            currentAvatar={avatarData}
            onAvatarChange={setAvatarData}
            size={150}
          />
          <div className="text-sm text-gray-400">
            <p>• Drag and drop an image or click to select</p>
            <p>• Maximum file size: 5MB</p>
            <p>• Supported formats: JPG, PNG, GIF, WebP</p>
            <p>• Images will be automatically compressed</p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Preview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Large Avatar (150px)</p>
              <Avatar
                src={avatarData}
                alt="Test User"
                size={150}
                fallbackText="TU"
                showBorder={true}
              />
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-2">Medium Avatar (80px)</p>
              <Avatar
                src={avatarData}
                alt="Test User"
                size={80}
                fallbackText="TU"
                showBorder={true}
              />
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-2">Small Avatar (40px)</p>
              <Avatar
                src={avatarData}
                alt="Test User"
                size={40}
                fallbackText="TU"
                showBorder={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Info */}
      {avatarData && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Base64 Data Info</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Data length: {avatarData.length} characters</p>
            <p>Estimated size: {Math.round(avatarData.length * 0.75)} bytes</p>
            <p>Format: {avatarData.substring(0, 30)}...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AvatarTest
