import { useAuth } from '@clerk/clerk-react';
import { PropsWithChildren } from 'react';

export default function AuthGate({ children }: PropsWithChildren) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <div className="p-4">Loading…</div>;
  return <>{children}</>;
}
