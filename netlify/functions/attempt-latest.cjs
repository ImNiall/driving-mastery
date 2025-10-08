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
    const source = body.source || 'module';

    const { data, error } = await admin
      .from('quiz_attempts')
      .select('id, source, started_at, finished_at, current_index, questions')
      .eq('user_id', userData.user.id)
      .eq('source', source)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

    if (!data) return { statusCode: 200, body: 'null' };

    const finished = !!data.finished_at;
    return {
      statusCode: 200,
      body: JSON.stringify({
        attemptId: data.id,
        source: data.source,
        started_at: data.started_at,
        current_index: data.current_index ?? 0,
        questions: data.questions || null,
        finished,
      }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
