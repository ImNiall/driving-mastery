import React from 'react';
import { useAuthCtx } from '../../providers/AuthProvider';

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
export default function SupaAuthGate({ children, fallback = null }: Props) {
  const { loading, session } = useAuthCtx();
  if (loading) return null;
  return session ? <>{children}</> : <>{fallback}</>;
}
