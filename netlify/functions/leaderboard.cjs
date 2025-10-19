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
    const currentUserId = userData.user.id;

    // Get leaderboard data from view
    const { data: leaderboard, error: leaderboardErr } = await admin
      .from('leaderboard_view')
      .select('user_id, total_points, categories_mastered, last_mastery')
      .order('total_points', { ascending: false })
      .order('last_mastery', { ascending: false })
      .limit(100);

    if (leaderboardErr) {
      return { statusCode: 500, body: JSON.stringify({ error: leaderboardErr.message }) };
    }

    // Get user profiles for display names (anonymized)
    const userIds = leaderboard.map(entry => entry.user_id);
    const { data: profiles, error: profilesErr } = await admin
      .from('users')
      .select('id, email')
      .in('id', userIds);

    if (profilesErr) {
      console.warn('Failed to fetch user profiles:', profilesErr.message);
    }

    // Create anonymized leaderboard with ranks
    const anonymizedLeaderboard = leaderboard.map((entry, index) => {
      const profile = profiles?.find(p => p.id === entry.user_id);
      const isCurrentUser = entry.user_id === currentUserId;
      
      return {
        rank: index + 1,
        name: isCurrentUser ? 'You' : `User ${String(index + 1).padStart(3, '0')}`,
        masteryPoints: entry.total_points,
        categoriesMastered: entry.categories_mastered,
        isCurrentUser,
        lastActivity: entry.last_mastery
      };
    });

    // Find current user's position if not in top 100
    const currentUserEntry = anonymizedLeaderboard.find(entry => entry.isCurrentUser);
    let currentUserRank = null;
    
    if (!currentUserEntry) {
      // Get current user's rank if they're not in top 100
      const { data: userRankData, error: userRankErr } = await admin
        .rpc('get_user_leaderboard_rank', { target_user_id: currentUserId });
      
      if (!userRankErr && userRankData) {
        currentUserRank = {
          rank: userRankData.rank,
          name: 'You',
          masteryPoints: userRankData.total_points,
          categoriesMastered: userRankData.categories_mastered,
          isCurrentUser: true,
          lastActivity: userRankData.last_mastery
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        leaderboard: anonymizedLeaderboard,
        currentUserRank: currentUserRank,
        totalEntries: leaderboard.length
      })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
