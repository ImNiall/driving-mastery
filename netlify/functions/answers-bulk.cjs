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
      .map((a, idx) => {
        if (!a || typeof a !== 'object') return null;
        const questionId =
          typeof a.questionId === 'number'
            ? a.questionId
            : typeof a.qid === 'number'
              ? a.qid
              : null;
        const resolvedIndex =
          Number.isInteger(a.qIndex) && a.qIndex >= 0
            ? a.qIndex
            : Number.isInteger(a.index) && a.index >= 0
              ? a.index
              : questionId != null
                ? questionId
                : idx;
        const isCorrect =
          typeof a.correct === 'boolean'
            ? a.correct
            : typeof a.isCorrect === 'boolean'
              ? a.isCorrect
              : null;
        const answerPayload =
          a.answer && typeof a.answer === 'object'
            ? a.answer
            : {
                choice: a.choice ?? null,
                correct: isCorrect,
                questionId,
              };

        return {
          attempt_id: attemptId,
          user_id: userData.user.id,
          q_index: resolvedIndex,
          question_id: questionId,
          category:
            typeof a.category === 'string' && a.category.length > 0
              ? a.category
              : null,
          is_correct: isCorrect,
          answer: answerPayload,
        };
      })
      .filter((row) => row && Number.isInteger(row.q_index));

    if (rows.length === 0) return { statusCode: 400, body: 'No valid rows' };

    const { error } = await admin.from('quiz_answers').upsert(rows, {
      onConflict: 'attempt_id,q_index',
      ignoreDuplicates: true,
    });
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

    return { statusCode: 200, body: JSON.stringify({ ok: true, count: rows.length }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
