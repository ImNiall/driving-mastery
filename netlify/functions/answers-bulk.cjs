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
    const { attemptId, answers } = body;
    if (!attemptId || !Array.isArray(answers) || answers.length === 0) {
      return { statusCode: 400, body: 'Invalid payload' };
    }

    const rows = answers
      .filter((a) => a && typeof a.qid === 'number' && typeof a.choice === 'string' && typeof a.correct === 'boolean' && a.category)
      .map((a) => ({
        attempt_id: attemptId,
        user_id: userData.user.id,
        question_id: a.qid,
        category: a.category,
        is_correct: !!a.correct,
      }));

    if (rows.length === 0) return { statusCode: 400, body: 'No valid rows' };

    const { error } = await admin.from('quiz_answers').upsert(rows, {
      onConflict: 'attempt_id,question_id',
      ignoreDuplicates: true,
    });
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

    return { statusCode: 200, body: JSON.stringify({ ok: true, count: rows.length }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
