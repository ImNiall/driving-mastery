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

    // Get enhanced leaderboard data from view
    const { data: leaderboard, error: leaderboardErr } = await admin
      .from('enhanced_leaderboard_view')
      .select(`
        user_id, total_points, categories_mastered, last_mastery,
        current_streak, longest_streak, total_quizzes, perfect_scores,
        average_score, weekly_points, study_time_minutes,
        display_name, name, email, country, region, test_date,
        member_since, last_active, rank_change
      `)
      .order('total_points', { ascending: false })
      .order('last_mastery', { ascending: false })
      .limit(100);

    if (leaderboardErr) {
      return { statusCode: 500, body: JSON.stringify({ error: leaderboardErr.message }) };
    }

    // Create enhanced leaderboard with all stats
    const enhancedLeaderboard = leaderboard.map((entry, index) => {
      const isCurrentUser = entry.user_id === currentUserId;
      
      // Determine display name priority: display_name > name > email prefix > fallback
      let displayName;
      if (isCurrentUser) {
        displayName = 'You';
      } else if (entry.display_name) {
        displayName = entry.display_name;
      } else if (entry.name) {
        displayName = entry.name;
      } else if (entry.email) {
        displayName = entry.email.split('@')[0];
      } else {
        displayName = `User ${String(index + 1).padStart(3, '0')}`;
      }

      // Format member since date
      const memberSince = entry.member_since ? 
        new Date(entry.member_since).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        }) : null;

      // Format last active
      const lastActive = entry.last_active ? 
        formatRelativeTime(entry.last_active) : null;

      // Format study time
      const studyTimeFormatted = formatStudyTime(entry.study_time_minutes);
      
      return {
        rank: index + 1,
        name: displayName,
        masteryPoints: entry.total_points,
        categoriesMastered: entry.categories_mastered,
        isCurrentUser,
        lastActivity: entry.last_mastery,
        
        // New enhanced stats
        currentStreak: entry.current_streak,
        longestStreak: entry.longest_streak,
        totalQuizzes: entry.total_quizzes,
        perfectScores: entry.perfect_scores,
        averageScore: Math.round(entry.average_score || 0),
        weeklyPoints: entry.weekly_points,
        studyTime: studyTimeFormatted,
        memberSince: memberSince,
        lastActive: lastActive,
        country: entry.country,
        region: entry.region,
        testDate: entry.test_date,
        rankChange: entry.rank_change
      };
    });

    // Helper functions
    function formatRelativeTime(dateString) {
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) return 'Active now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return `${Math.floor(diffDays / 7)}w ago`;
    }

    function formatStudyTime(minutes) {
      if (!minutes) return '0h';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours === 0) return `${mins}m`;
      if (mins === 0) return `${hours}h`;
      return `${hours}h ${mins}m`;
    }

    // Find current user's position if not in top 100
    const currentUserEntry = enhancedLeaderboard.find(entry => entry.isCurrentUser);
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
        leaderboard: enhancedLeaderboard,
        currentUserRank: currentUserRank,
        totalEntries: leaderboard.length
      })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
