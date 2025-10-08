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
    const { attemptId, currentIndex, state, questions } = body;
    if (!attemptId || typeof currentIndex !== 'number') {
      return { statusCode: 400, body: 'Invalid payload' };
    }

    const update = { current_index: currentIndex };
    if (state) update.state = state;

    if (Array.isArray(questions) && questions.length > 0) {
      const existing = await admin
        .from('quiz_attempts')
        .select('questions')
        .eq('id', attemptId)
        .eq('user_id', userData.user.id)
        .single();
      if (!existing.error && (existing.data?.questions == null)) {
        update.questions = questions;
      }
    }

    const { error: updErr } = await admin
      .from('quiz_attempts')
      .update(update)
      .eq('id', attemptId)
      .eq('user_id', userData.user.id);
    if (updErr) return { statusCode: 500, body: JSON.stringify({ error: updErr.message }) };

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
