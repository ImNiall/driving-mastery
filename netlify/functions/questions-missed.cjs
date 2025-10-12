'use strict';
const { getSupabaseAdmin } = require('./_supabase.js');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const auth = event.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const admin = getSupabaseAdmin();
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const { data, error } = await admin
      .from('quiz_answers')
      .select('question_id, category, is_correct, updated_at')
      .eq('user_id', userData.user.id)
      .not('question_id', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(500);

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    const stats = new Map();
    for (const row of data || []) {
      const qid = row.question_id;
      if (typeof qid !== 'number') continue;
      if (!stats.has(qid)) {
        stats.set(qid, {
          questionId: qid,
          category: row.category || null,
          correct: 0,
          incorrect: 0,
          total: 0,
          lastSeen: row.updated_at || null,
        });
      }
      const entry = stats.get(qid);
      entry.total += 1;
      if (row.is_correct === true) {
        entry.correct += 1;
      } else if (row.is_correct === false) {
        entry.incorrect += 1;
      }
      if (!entry.lastSeen || (row.updated_at && row.updated_at < entry.lastSeen)) {
        entry.lastSeen = row.updated_at || entry.lastSeen;
      }
    }

    const questions = Array.from(stats.values())
      .filter((entry) => entry.incorrect > 0)
      .sort((a, b) => {
        const incorrectDiff = b.incorrect - a.incorrect;
        if (incorrectDiff !== 0) return incorrectDiff;
        const lastA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
        const lastB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
        return lastA - lastB;
      });

    return { statusCode: 200, body: JSON.stringify({ questions }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
