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
    const { attemptId, questionId, category, isCorrect } = body;
    if (!attemptId || typeof questionId !== 'number' || !category || typeof isCorrect !== 'boolean') {
      return { statusCode: 400, body: 'Invalid payload' };
    }

    const insert = {
      attempt_id: attemptId,
      user_id: userData.user.id,
      question_id: questionId,
      category,
      is_correct: isCorrect,
    };

    const { error } = await admin
      .from('quiz_answers')
      .upsert(insert, { onConflict: 'attempt_id,question_id' });
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
