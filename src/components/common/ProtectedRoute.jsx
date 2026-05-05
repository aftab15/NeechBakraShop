import { Navigate, useLocation } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { PageLoader } from './LoadingSpinner'

const isPlaceholder = import.meta.env.VITE_CONVEX_URL?.includes('placeholder')

export function ProtectedRoute({ children }) {
  const location = useLocation()
  // In placeholder mode Convex never resolves — skip auth so UI is reachable
  const me = useQuery(api.users.getMe, isPlaceholder ? 'skip' : {})

  if (isPlaceholder) return children
  if (me === undefined) return <PageLoader />
  if (!me) return <Navigate to="/auth" state={{ from: location.pathname }} replace />
  return children
}

export function AdminRoute({ children }) {
  const location = useLocation()
  const me = useQuery(api.users.getMe, isPlaceholder ? 'skip' : {})

  if (isPlaceholder) return children
  if (me === undefined) return <PageLoader />
  if (!me) return <Navigate to="/auth" state={{ from: location.pathname }} replace />
  if (me.role !== 'admin') return <Navigate to="/" replace />
  return children
}
