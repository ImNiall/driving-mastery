import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null; // wait for Clerk to bootstrap
  return isSignedIn ? children : <Navigate to="/sign-in" replace />;
}
