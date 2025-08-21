import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProfileSetupRedirect({ children }) {
  const { user, loading, needsProfileSetup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return

    // Only redirect if user is logged in and needs profile setup
    if (user && needsProfileSetup) {
      // Don't redirect if already on profile setup page or auth pages
      const allowedPaths = ['/profile-setup', '/login', '/signup']
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/profile-setup')
      }
    }
  }, [user, loading, needsProfileSetup, navigate, location.pathname])

  return children
}
