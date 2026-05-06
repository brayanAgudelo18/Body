import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isReady, member, isAdmin } = useAuth()
  if (!isReady) return null
  if (!member) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

