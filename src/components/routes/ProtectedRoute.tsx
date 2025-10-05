import { Navigate } from 'react-router-dom';
import { useAuthCtx } from '../../providers/AuthProvider';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { loading, session } = useAuthCtx();
  if (loading) return null; // or a spinner skeleton
  return session ? children : <Navigate to="/sign-in" replace />;
}
