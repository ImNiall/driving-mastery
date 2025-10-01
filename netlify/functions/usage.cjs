// Netlify Function: /api/usage
// Tracks once-per-day feature usage. Protected by Clerk JWT.

const { verifyToken } = require('@clerk/clerk-sdk-node');
const { getSupabaseAdmin } = require('./_supabase');

exports.handler = async function (event) {
  try {
    const method = event.httpMethod;
    if (!['GET', 'POST', 'OPTIONS'].includes(method)) {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    if (method === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders() };
    }

    // Verify Clerk JWT
    const authHeader = event.headers['authorization'] || event.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return withCors({ statusCode: 401, body: JSON.stringify({ error: 'Missing Authorization header' }) });
    }
    const token = authHeader.substring('Bearer '.length);
    let sub;
    try {
      const claims = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
      sub = claims.sub;
    } catch (e) {
      return withCors({ statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) });
    }

    const supabase = getSupabaseAdmin();

    if (method === 'GET') {
      const qs = event.queryStringParameters || {};
      const feature = qs.feature;
      if (!feature) return withCors({ statusCode: 400, body: JSON.stringify({ error: 'Missing feature' }) });
      // Check if already used today
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('clerk_user_id', sub)
        .eq('feature', feature)
        .eq('used_on', today)
        .limit(1);
      if (error) throw error;
      return withCors({ statusCode: 200, body: JSON.stringify({ used: !!(data && data[0]) }) });
    }

    if (method === 'POST') {
      const body = safeJson(event.body);
      const { feature } = body || {};
      if (!feature) return withCors({ statusCode: 400, body: JSON.stringify({ error: 'Missing feature' }) });
      // Insert; unique constraint makes it once-per-day
      const { error } = await supabase
        .from('usage_limits')
        .insert([{ clerk_user_id: sub, feature }]);
      if (error) {
        // 23505 = unique_violation (already used today)
        if (error.code === '23505') {
          return withCors({ statusCode: 409, body: JSON.stringify({ used: true }) });
        }
        throw error;
      }
      return withCors({ statusCode: 201, body: JSON.stringify({ used: false }) });
    }

    return withCors({ statusCode: 405, body: 'Method Not Allowed' });
  } catch (err) {
    console.error('Netlify function error /usage:', err);
    return withCors({ statusCode: 500, body: JSON.stringify({ error: 'Server error' }) });
  }
};

function safeJson(text) { try { return text ? JSON.parse(text) : null; } catch { return null; } }
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
function withCors(resp) { return { ...resp, headers: { ...(resp.headers || {}), ...corsHeaders() } }; }
