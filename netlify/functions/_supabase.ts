import { createClient } from '@supabase/supabase-js';

// Netlify exposes build envs to functions; if not, duplicate as SUPABASE_URL.
const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) as string;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabaseAdmin = createClient(url, service);

export async function requireUser(event: any) {
  const auth = event.headers?.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    const e: any = new Error('Unauthorized');
    e.statusCode = 401;
    throw e;
  }
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    const e: any = new Error('Unauthorized');
    e.statusCode = 401;
    throw e;
  }
  return data.user;
}
