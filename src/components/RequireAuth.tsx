import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isReady, member } = useAuth()
  if (!isReady) return null
  if (!member) return <Navigate to="/login" replace />
  return <>{children}</>
}

