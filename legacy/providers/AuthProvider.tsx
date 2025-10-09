import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase/client";

type AuthContextValue = {
  supabase: typeof supabase;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const init = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) {
        console.error("[AuthProvider] Failed to fetch session", error);
        setError(error.message);
        setSession(null);
        setUser(null);
      } else {
        setError(null);
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      }

      setIsLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setIsLoading(false);
      },
    );

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("[AuthProvider] Failed to refresh session", error);
      setError(error.message);
    } else {
      setError(null);
    }

    setSession(data.session ?? null);
    setUser(data.session?.user ?? null);
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      supabase,
      session,
      user,
      isLoading,
      error,
      refreshSession,
    }),
    [session, user, isLoading, error, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthCtx() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthCtx must be used within an AuthProvider");
  }
  return ctx;
}

export default AuthProvider;
