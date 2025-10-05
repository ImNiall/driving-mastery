// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthCtx = { session: any; user: any; loading: boolean };
const Ctx = createContext<AuthCtx>({ session: null, user: null, loading: true });
export const useAuthCtx = () => useContext(Ctx);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null);
      setUser(s?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return <Ctx.Provider value={{ session, user, loading }}>{children}</Ctx.Provider>;
}
