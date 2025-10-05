// src/routes/SignIn.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  if (sent) return <p>Check your email for a sign-in link.</p>;

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      {error && <small style={{ color: 'crimson' }}>{error}</small>}
      <button type="submit">Send magic link</button>
    </form>
  );
}
