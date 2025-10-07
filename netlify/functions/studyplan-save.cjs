'use strict';
const { getSupabaseAdmin } = require('./_supabase.js');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const auth = event.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return { statusCode: 401, body: 'Unauthorized' };

    const admin = getSupabaseAdmin();
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return { statusCode: 401, body: 'Unauthorized' };

    const body = JSON.parse(event.body || '{}');
    const { planKey, steps } = body;
    if (!planKey || !Array.isArray(steps)) return { statusCode: 400, body: 'Invalid payload' };

    const upsert = {
      user_id: userData.user.id,
      plan_key: planKey,
      steps,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await admin
      .from('study_plan_state')
      .upsert(upsert, { onConflict: 'user_id,plan_key' })
      .select('plan_key, steps, updated_at')
      .single();
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
