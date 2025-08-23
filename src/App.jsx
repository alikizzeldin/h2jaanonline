import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CoinsProvider } from './contexts/CoinsContext'
import Navigation from './components/Navigation'
import ProfileSetupRedirect from './components/ProfileSetupRedirect'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ProfileSetup from './pages/ProfileSetup'
import Friends from './pages/Friends'
import Admin from './pages/Admin'
import Games from './pages/Games'
import Shop from './pages/Shop'


function AppContent() {
  const location = useLocation()
  const hideNavigation = ['/login', '/signup', '/profile-setup'].includes(location.pathname)

  return (
    <ProfileSetupRedirect>
      <div className="relative min-h-screen bg-dark overflow-x-hidden">
        {!hideNavigation && <Navigation />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/games" element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          } />
          <Route path="/friends" element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          } />
          <Route path="/shop" element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
        

      </div>
    </ProfileSetupRedirect>
  )
}

function App() {
  return (
    <AuthProvider>
      <CoinsProvider>
        <Router>
          <AppContent />
        </Router>
      </CoinsProvider>
    </AuthProvider>
  )
}

export default App
