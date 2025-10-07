'use strict';
const { getSupabaseAdmin } = require('./_supabase.js');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

    const auth = event.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return { statusCode: 401, body: 'Unauthorized' };

    const admin = getSupabaseAdmin();
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return { statusCode: 401, body: 'Unauthorized' };
    const userId = userData.user.id;

    // Category performance
    const { data: cats, error: catsErr } = await admin
      .from('v_category_performance')
      .select('category, correct, total')
      .eq('user_id', userId);
    if (catsErr) return { statusCode: 500, body: JSON.stringify({ error: catsErr.message }) };

    // Attempts summary (last 20)
    const { data: attempts, error: attemptsErr } = await admin
      .from('quiz_attempts')
      .select('id, started_at, finished_at, total, correct, score_percent, duration_sec, source')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(20);
    if (attemptsErr) return { statusCode: 500, body: JSON.stringify({ error: attemptsErr.message }) };

    // Mastery points
    const { data: masteryAgg, error: masteryErr } = await admin
      .from('module_mastery')
      .select('points')
      .eq('user_id', userId);
    if (masteryErr) return { statusCode: 500, body: JSON.stringify({ error: masteryErr.message }) };
    const masteryPoints = (masteryAgg || []).reduce((a, b) => a + (b.points || 0), 0);

    // Study plan latest
    const { data: plan, error: planErr } = await admin
      .from('study_plan_state')
      .select('plan_key, steps, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (planErr) return { statusCode: 500, body: JSON.stringify({ error: planErr.message }) };

    return {
      statusCode: 200,
      body: JSON.stringify({ categories: cats || [], attempts: attempts || [], masteryPoints, studyPlan: plan || null })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
