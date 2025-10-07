'use strict';
const { getSupabaseAdmin } = require('./_supabase.js');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const auth = event.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return { statusCode: 401, body: 'Unauthorized' };

    const admin = getSupabaseAdmin();
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return { statusCode: 401, body: 'Unauthorized' };

    const body = JSON.parse(event.body || '{}');
    const { attemptId } = body;
    if (!attemptId) return { statusCode: 400, body: 'Invalid payload' };

    // Aggregate totals for this attempt
    const { data: agg, error: aggErr } = await admin
      .from('quiz_answers')
      .select('is_correct')
      .eq('attempt_id', attemptId)
      .eq('user_id', userData.user.id);
    if (aggErr) return { statusCode: 500, body: JSON.stringify({ error: aggErr.message }) };

    const total = agg.length;
    const correct = agg.filter((a) => a.is_correct).length;
    const score_percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    const started = await admin
      .from('quiz_attempts')
      .select('started_at')
      .eq('id', attemptId)
      .eq('user_id', userData.user.id)
      .single();
    if (started.error) return { statusCode: 500, body: JSON.stringify({ error: started.error.message }) };

    const duration_sec = Math.max(0, Math.round((Date.now() - new Date(started.data.started_at).getTime()) / 1000));

    const { error: updErr } = await admin
      .from('quiz_attempts')
      .update({ finished_at: new Date().toISOString(), total, correct, score_percent, duration_sec })
      .eq('id', attemptId)
      .eq('user_id', userData.user.id);
    if (updErr) return { statusCode: 500, body: JSON.stringify({ error: updErr.message }) };

    return { statusCode: 200, body: JSON.stringify({ total, correct, score_percent, duration_sec }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
