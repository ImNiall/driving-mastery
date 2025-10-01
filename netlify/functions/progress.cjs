// Netlify Function: /api/progress
// CRUD for user progress using Supabase. Protected by Clerk JWT.

const { verifyToken } = require('@clerk/clerk-sdk-node');
const { getSupabaseAdmin } = require('./_supabase');

exports.handler = async function (event) {
  try {
    const method = event.httpMethod;
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method)) {
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
      // GET /api/progress?category=Motorway%20rules (optional)
      const qs = event.queryStringParameters || {};
      const category = qs.category;
      let query = supabase.from('progress').select('*').eq('clerk_user_id', sub);
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (error) throw error;
      return withCors({ statusCode: 200, body: JSON.stringify({ items: data || [] }) });
    }

    const body = safeJson(event.body);

    if (method === 'POST') {
      // Upsert a progress row: { category, correct, total }
      const { category, correct = 0, total = 0 } = body || {};
      if (!category) return withCors({ statusCode: 400, body: JSON.stringify({ error: 'Missing category' }) });
      const { data, error } = await supabase
        .from('progress')
        .upsert({ clerk_user_id: sub, category, correct, total, updated_at: new Date().toISOString() }, { onConflict: 'clerk_user_id,category' })
        .select('*');
      if (error) throw error;
      return withCors({ statusCode: 200, body: JSON.stringify({ item: (data || [])[0] }) });
    }

    if (method === 'PATCH' || method === 'PUT') {
      // Atomic increment via SQL function: increment_progress
      // Body: { category, deltaCorrect, deltaTotal }
      const { category, deltaCorrect = 0, deltaTotal = 0 } = body || {};
      if (!category) return withCors({ statusCode: 400, body: JSON.stringify({ error: 'Missing category' }) });

      const { error: rpcErr } = await supabase.rpc('increment_progress', {
        p_clerk_user_id: sub,
        p_category: category,
        p_correct: deltaCorrect,
        p_total: deltaTotal,
      });
      if (rpcErr) throw rpcErr;

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('clerk_user_id', sub)
        .eq('category', category)
        .limit(1);
      if (error) throw error;
      return withCors({ statusCode: 200, body: JSON.stringify({ item: (data || [])[0] }) });
    }

    if (method === 'DELETE') {
      // DELETE /api/progress?category=Motorway%20rules (optional)
      const qs = event.queryStringParameters || {};
      const category = qs.category;
      let query = supabase.from('progress').delete().eq('clerk_user_id', sub);
      if (category) query = query.eq('category', category);
      const { error } = await query;
      if (error) throw error;
      return withCors({ statusCode: 204, body: '' });
    }

    return withCors({ statusCode: 405, body: 'Method Not Allowed' });
  } catch (err) {
    console.error('Netlify function error /progress:', err);
    return withCors({ statusCode: 500, body: JSON.stringify({ error: 'Server error' }) });
  }
};

function safeJson(text) {
  try { return text ? JSON.parse(text) : null; } catch { return null; }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function withCors(resp) {
  return { ...resp, headers: { ...(resp.headers || {}), ...corsHeaders() } };
}
