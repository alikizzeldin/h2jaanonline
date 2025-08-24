/**
 * Image utility functions for avatar upload system
 * Handles compression, validation, and base64 conversion
 */

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// Maximum dimensions for avatar images
export const MAX_DIMENSIONS = 512

// Supported image types
export const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

/**
 * Validates if a file is a supported image type
 * @param {File} file - The file to validate
 * @returns {boolean} - True if file is valid
 */
export const validateImageFile = (file) => {
  if (!file) return false
  
  // Check file type
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return false
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return false
  }
  
  return true
}

/**
 * Compresses an image file and converts it to base64
 * @param {File} file - The image file to compress
 * @param {number} quality - JPEG quality (0-1), default 0.8
 * @returns {Promise<string>} - Base64 encoded image data
 */
export const compressImageToBase64 = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        if (width > height) {
          if (width > MAX_DIMENSIONS) {
            height = (height * MAX_DIMENSIONS) / width
            width = MAX_DIMENSIONS
          }
        } else {
          if (height > MAX_DIMENSIONS) {
            width = (width * MAX_DIMENSIONS) / height
            height = MAX_DIMENSIONS
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to base64
        const base64 = canvas.toDataURL('image/jpeg', quality)
        resolve(base64)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Gets the file size in a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Estimates the base64 size of an image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} quality - JPEG quality (0-1)
 * @returns {number} - Estimated size in bytes
 */
export const estimateBase64Size = (width, height, quality = 0.8) => {
  // Rough estimation: width * height * 3 bytes per pixel * quality factor
  const estimatedBytes = width * height * 3 * quality
  // Base64 encoding increases size by ~33%
  return Math.ceil(estimatedBytes * 1.33)
}
