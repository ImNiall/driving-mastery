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
    const userId = userData.user.id;

    const body = JSON.parse(event.body || '{}');
    const { action, data: actionData } = body;

    // Update streak
    await admin.rpc('update_user_streak', { target_user_id: userId });

    // Update last active in profiles
    await admin
      .from('profiles')
      .upsert({ 
        user_id: userId, 
        last_active: new Date().toISOString() 
      }, { onConflict: 'user_id' });

    // Handle different actions
    switch (action) {
      case 'quiz_completed':
        await handleQuizCompleted(admin, userId, actionData);
        break;
      case 'module_completed':
        await handleModuleCompleted(admin, userId, actionData);
        break;
      case 'study_session':
        await handleStudySession(admin, userId, actionData);
        break;
    }

    // Recalculate user stats
    await recalculateUserStats(admin, userId);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (e) {
    console.error('Update user stats error:', e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};

async function handleQuizCompleted(admin, userId, data) {
  const { score_percent, is_perfect } = data;
  
  // Update quiz count and perfect scores
  await admin
    .from('user_stats')
    .upsert({
      user_id: userId,
      total_quizzes_completed: admin.raw('COALESCE(total_quizzes_completed, 0) + 1'),
      perfect_scores_count: is_perfect ? 
        admin.raw('COALESCE(perfect_scores_count, 0) + 1') : 
        admin.raw('COALESCE(perfect_scores_count, 0)')
    }, { onConflict: 'user_id' });
}

async function handleModuleCompleted(admin, userId, data) {
  const { study_time_minutes } = data;
  
  if (study_time_minutes) {
    await admin
      .from('user_stats')
      .upsert({
        user_id: userId,
        total_study_time_minutes: admin.raw(`COALESCE(total_study_time_minutes, 0) + ${study_time_minutes}`)
      }, { onConflict: 'user_id' });
  }
}

async function handleStudySession(admin, userId, data) {
  const { duration_minutes } = data;
  
  if (duration_minutes) {
    await admin
      .from('user_stats')
      .upsert({
        user_id: userId,
        total_study_time_minutes: admin.raw(`COALESCE(total_study_time_minutes, 0) + ${duration_minutes}`)
      }, { onConflict: 'user_id' });
  }
}

async function recalculateUserStats(admin, userId) {
  // Calculate average score from quiz attempts
  const { data: avgData } = await admin
    .from('quiz_attempts')
    .select('score_percent')
    .eq('user_id', userId)
    .not('score_percent', 'is', null);

  if (avgData && avgData.length > 0) {
    const averageScore = avgData.reduce((sum, attempt) => sum + attempt.score_percent, 0) / avgData.length;
    
    await admin
      .from('user_stats')
      .upsert({
        user_id: userId,
        average_score_percent: Math.round(averageScore * 100) / 100
      }, { onConflict: 'user_id' });
  }

  // Reset weekly points if needed (check if it's a new week)
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const { data: statsData } = await admin
    .from('user_stats')
    .select('weekly_points_updated_at')
    .eq('user_id', userId)
    .single();

  if (statsData && statsData.weekly_points_updated_at) {
    const lastUpdate = new Date(statsData.weekly_points_updated_at);
    if (lastUpdate < startOfWeek) {
      // Reset weekly points for new week
      await admin
        .from('user_stats')
        .update({
          weekly_points: 0,
          weekly_points_updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }
  }
}
