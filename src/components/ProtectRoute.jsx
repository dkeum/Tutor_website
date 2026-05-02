import { Navigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuthSession'


export default function ProtectedRoute({ children }) {
  const { session } = useAuth()

  // Still loading — don't flash the login page
  if (session === undefined) return <div>Loading...</div>

  // No session = not authenticated (or session was invalidated)
  if (!session) return <Navigate to="/login" replace />

  return children
}