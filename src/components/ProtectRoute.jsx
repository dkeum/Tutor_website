import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuthSession'

export default function ProtectedRoute({ children }) {
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If the session has finished loading and is null/empty, redirect
    if (session === null || session === false) {
      navigate("/login", { replace: true })
    }
  }, [session, navigate]) // Re-run if session changes


  // Still loading
  if (session === undefined) return <div>Loading...</div>
  
  // Prevent rendering children while the redirect is happening
  if (!session) return null

  return children
}