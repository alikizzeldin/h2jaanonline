// Test script to debug sign-out issues
// Run this in the browser console when signed in

console.log('=== Sign Out Test Script ===')

// Check current auth state
const checkAuthState = () => {
  console.log('Current user:', window.supabase?.auth?.getUser())
  console.log('Current session:', window.supabase?.auth?.getSession())
  console.log('Local storage auth items:', Object.keys(localStorage).filter(key => key.includes('auth')))
  console.log('Session storage items:', Object.keys(sessionStorage))
}

// Force clear all auth data
const forceClearAuth = () => {
  console.log('Force clearing all auth data...')
  
  // Clear localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.includes('auth') || key.includes('supabase')) {
      localStorage.removeItem(key)
      console.log('Removed from localStorage:', key)
    }
  })
  
  // Clear sessionStorage
  sessionStorage.clear()
  console.log('Cleared sessionStorage')
  
  // Reload page
  console.log('Reloading page...')
  window.location.reload()
}

// Test sign out
const testSignOut = async () => {
  console.log('Testing sign out...')
  
  try {
    const { error } = await window.supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
    } else {
      console.log('Sign out successful')
    }
  } catch (error) {
    console.error('Sign out failed:', error)
  }
}

// Export functions to global scope
window.testAuth = {
  checkAuthState,
  forceClearAuth,
  testSignOut
}

console.log('Test functions available:')
console.log('- window.testAuth.checkAuthState() - Check current auth state')
console.log('- window.testAuth.forceClearAuth() - Force clear all auth data')
console.log('- window.testAuth.testSignOut() - Test sign out')
