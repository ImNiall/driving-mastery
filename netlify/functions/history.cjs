// Netlify Function: /api/history
// Logs and retrieves quiz attempts. Protected by Supabase JWT.

const { getSupabaseAdmin, requireUser } = require('./_supabase');

exports.handler = async function (event) {
  try {
    const method = event.httpMethod;
    if (!['GET', 'POST', 'OPTIONS'].includes(method)) {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    if (method === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders() };
    }

    // Require Supabase user
    const user = await requireUser(event);

    const supabase = getSupabaseAdmin();

    if (method === 'GET') {
      const qs = event.queryStringParameters || {};
      const days = Math.max(1, Math.min(90, parseInt(qs.days || '7', 10))); // clamp 1..90
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('clerk_user_id', user.id)
        .gte('created_at', since)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return withCors({ statusCode: 200, body: JSON.stringify({ items: data || [] }) });
    }

    if (method === 'POST') {
      const body = safeJson(event.body);
      const { score, total, details } = body || {};
      if (typeof score !== 'number' || typeof total !== 'number') {
        return withCors({ statusCode: 400, body: JSON.stringify({ error: 'Missing score or total' }) });
      }
      const { error } = await supabase
        .from('quiz_history')
        .insert([{ clerk_user_id: user.id, score, total, details: details || null }]);
      if (error) throw error;
      return withCors({ statusCode: 201, body: JSON.stringify({ ok: true }) });
    }

    return withCors({ statusCode: 405, body: 'Method Not Allowed' });
  } catch (err) {
    console.error('Netlify function error /history:', err);
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
