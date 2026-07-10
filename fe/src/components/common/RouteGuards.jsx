import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { selectIsAuthenticated, selectUser } from '../../states/auth/authSlice';

export function ProtectedRoute({ children, adminOnly = false }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

export function GuestRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}
