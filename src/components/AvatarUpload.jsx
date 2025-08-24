import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react'
import { 
  validateImageFile, 
  compressImageToBase64, 
  formatFileSize 
} from '../utils/imageUtils'

const AvatarUpload = ({ 
  currentAvatar, 
  onAvatarChange, 
  size = 120, 
  className = '' 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(currentAvatar)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const fileInputRef = useRef(null)

  const compressImage = (file) => {
    return compressImageToBase64(file, 0.8)
  }

  const handleFileSelect = async (file) => {
    if (!file) return

    // Validate file
    if (!validateImageFile(file)) {
      alert(`Please select a valid image file (JPG, PNG, GIF, WebP) under ${formatFileSize(10 * 1024 * 1024)}`)
      return
    }

    setUploading(true)

    try {
      const compressedBase64 = await compressImage(file)
      setPreview(compressedBase64)
      await onAvatarChange(compressedBase64)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image. Please try again.')
      // Revert preview if upload failed
      setPreview(currentAvatar)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeAvatar = async () => {
    setRemoving(true)
    try {
      setPreview(null)
      await onAvatarChange(null)
    } catch (error) {
      console.error('Error removing avatar:', error)
      // Revert preview if removal failed
      setPreview(currentAvatar)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`
          relative rounded-full border-2 border-dashed cursor-pointer
          flex items-center justify-center overflow-hidden
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        style={{ width: size, height: size }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Avatar preview"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <Upload className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200" size={24} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={32} />
            <span className="text-xs mt-2 text-center">
              Click or drag to upload
            </span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </motion.div>

              {preview && (
          <motion.button
            onClick={removeAvatar}
            disabled={removing}
            className={`absolute -top-2 -right-2 rounded-full p-1 transition-colors duration-200 ${
              removing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
            whileHover={!removing ? { scale: 1.1 } : {}}
            whileTap={!removing ? { scale: 0.9 } : {}}
          >
            {removing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <X size={16} />
            )}
          </motion.button>
        )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
      />
    </div>
  )
}

export default AvatarUpload
