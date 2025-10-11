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
    const { attemptId, questionId, category, isCorrect, qIndex } = body;
    if (!attemptId) {
      return { statusCode: 400, body: 'Invalid payload' };
    }

    const resolvedQuestionId = typeof questionId === 'number' ? questionId : null;
    const resolvedIndex =
      Number.isInteger(qIndex) && qIndex >= 0
        ? qIndex
        : typeof resolvedQuestionId === 'number'
          ? resolvedQuestionId
          : null;
    if (resolvedIndex === null) {
      return { statusCode: 400, body: 'Invalid payload' };
    }

    const answerPayload =
      body.answer && typeof body.answer === 'object'
        ? body.answer
        : {
            choice: body.choice ?? null,
            correct: typeof isCorrect === 'boolean' ? isCorrect : null,
            questionId: resolvedQuestionId,
          };

    const insert = {
      attempt_id: attemptId,
      user_id: userData.user.id,
      q_index: resolvedIndex,
      question_id: resolvedQuestionId,
      category: category ?? null,
      is_correct: typeof isCorrect === 'boolean' ? isCorrect : null,
      answer: answerPayload,
    };

    const { error } = await admin
      .from('quiz_answers')
      .upsert(insert, { onConflict: 'attempt_id,q_index' });
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
