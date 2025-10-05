// netlify/functions/_supabase.cjs
const { createClient } = require('@supabase/supabase-js');

// Prefer build-time VITE_ vars; fall back to SUPABASE_URL for functions context
const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.warn('[functions/_supabase] Missing SUPABASE envs. url:', !!url, 'service:', !!service);
}

let _admin;
function getSupabaseAdmin() {
  if (!_admin) _admin = createClient(url, service);
  return _admin;
}

async function requireUser(event) {
  const auth = (event.headers && (event.headers.authorization || event.headers.Authorization)) || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    const e = new Error('Unauthorized');
    e.statusCode = 401;
    throw e;
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data || !data.user) {
    const e = new Error('Unauthorized');
    e.statusCode = 401;
    throw e;
  }
  return data.user; // { id, email, ... }
}

module.exports = { getSupabaseAdmin, requireUser };
