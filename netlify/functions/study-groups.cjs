'use strict';
const { getSupabaseAdmin } = require('./_supabase.js');

exports.handler = async (event) => {
  try {
    const auth = event.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return { statusCode: 401, body: 'Unauthorized' };

    const admin = getSupabaseAdmin();
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return { statusCode: 401, body: 'Unauthorized' };
    const userId = userData.user.id;

    const method = event.httpMethod;
    const path = event.path;
    const body = event.body ? JSON.parse(event.body) : {};

    // Route handling
    if (method === 'GET' && path.includes('/study-groups')) {
      return await handleGetGroups(admin, userId);
    } else if (method === 'POST' && path.includes('/study-groups')) {
      return await handleCreateGroup(admin, userId, body);
    } else if (method === 'POST' && path.includes('/join-group')) {
      return await handleJoinGroup(admin, userId, body);
    } else if (method === 'DELETE' && path.includes('/leave-group')) {
      return await handleLeaveGroup(admin, userId, body);
    } else if (method === 'GET' && path.includes('/group-leaderboard')) {
      return await handleGroupLeaderboard(admin, userId, body.groupId);
    }

    return { statusCode: 404, body: 'Not Found' };
  } catch (e) {
    console.error('Study groups error:', e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};

async function handleGetGroups(admin, userId) {
  // Get user's groups
  const { data: userGroups, error: userGroupsErr } = await admin
    .from('study_group_members')
    .select(`
      group_id,
      role,
      joined_at,
      study_groups (
        id,
        name,
        description,
        created_by,
        is_private,
        created_at,
        study_group_members (count)
      )
    `)
    .eq('user_id', userId);

  if (userGroupsErr) {
    return { statusCode: 500, body: JSON.stringify({ error: userGroupsErr.message }) };
  }

  // Get public groups user can join
  const { data: publicGroups, error: publicGroupsErr } = await admin
    .from('study_groups')
    .select(`
      id,
      name,
      description,
      created_by,
      created_at,
      study_group_members (count)
    `)
    .eq('is_private', false)
    .not('id', 'in', `(${userGroups.map(g => g.group_id).join(',') || 'null'})`);

  if (publicGroupsErr) {
    return { statusCode: 500, body: JSON.stringify({ error: publicGroupsErr.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      userGroups: userGroups.map(ug => ({
        ...ug.study_groups,
        role: ug.role,
        joinedAt: ug.joined_at,
        memberCount: ug.study_groups.study_group_members.length
      })),
      publicGroups: publicGroups.map(pg => ({
        ...pg,
        memberCount: pg.study_group_members.length
      }))
    })
  };
}

async function handleCreateGroup(admin, userId, body) {
  const { name, description, isPrivate } = body;
  
  if (!name || name.trim().length < 3) {
    return { statusCode: 400, body: 'Group name must be at least 3 characters' };
  }

  // Generate invite code for private groups
  const inviteCode = isPrivate ? generateInviteCode() : null;

  // Create group
  const { data: group, error: groupErr } = await admin
    .from('study_groups')
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      created_by: userId,
      is_private: isPrivate,
      invite_code: inviteCode
    })
    .select()
    .single();

  if (groupErr) {
    return { statusCode: 500, body: JSON.stringify({ error: groupErr.message }) };
  }

  // Add creator as owner
  const { error: memberErr } = await admin
    .from('study_group_members')
    .insert({
      group_id: group.id,
      user_id: userId,
      role: 'owner'
    });

  if (memberErr) {
    return { statusCode: 500, body: JSON.stringify({ error: memberErr.message }) };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ ...group, memberCount: 1 })
  };
}

async function handleJoinGroup(admin, userId, body) {
  const { groupId, inviteCode } = body;

  // Check if group exists and user can join
  const { data: group, error: groupErr } = await admin
    .from('study_groups')
    .select('id, name, is_private, invite_code, max_members')
    .eq('id', groupId)
    .single();

  if (groupErr || !group) {
    return { statusCode: 404, body: 'Group not found' };
  }

  // Check invite code for private groups
  if (group.is_private && group.invite_code !== inviteCode) {
    return { statusCode: 403, body: 'Invalid invite code' };
  }

  // Check if already a member
  const { data: existingMember } = await admin
    .from('study_group_members')
    .select('id')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .single();

  if (existingMember) {
    return { statusCode: 400, body: 'Already a member of this group' };
  }

  // Check member limit
  const { count: memberCount } = await admin
    .from('study_group_members')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', groupId);

  if (memberCount >= group.max_members) {
    return { statusCode: 400, body: 'Group is full' };
  }

  // Add member
  const { error: joinErr } = await admin
    .from('study_group_members')
    .insert({
      group_id: groupId,
      user_id: userId,
      role: 'member'
    });

  if (joinErr) {
    return { statusCode: 500, body: JSON.stringify({ error: joinErr.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Joined ${group.name} successfully` })
  };
}

async function handleLeaveGroup(admin, userId, body) {
  const { groupId } = body;

  // Remove member
  const { error: leaveErr } = await admin
    .from('study_group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (leaveErr) {
    return { statusCode: 500, body: JSON.stringify({ error: leaveErr.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Left group successfully' })
  };
}

async function handleGroupLeaderboard(admin, userId, groupId) {
  // Get group members with their stats
  const { data: members, error: membersErr } = await admin
    .from('study_group_members')
    .select(`
      user_id,
      role,
      joined_at,
      profiles (
        display_name,
        name,
        email
      )
    `)
    .eq('group_id', groupId);

  if (membersErr) {
    return { statusCode: 500, body: JSON.stringify({ error: membersErr.message }) };
  }

  // Get stats for all members from enhanced leaderboard view
  const memberIds = members.map(m => m.user_id);
  const { data: memberStats, error: statsErr } = await admin
    .from('enhanced_leaderboard_view')
    .select('*')
    .in('user_id', memberIds)
    .order('total_points', { ascending: false });

  if (statsErr) {
    return { statusCode: 500, body: JSON.stringify({ error: statsErr.message }) };
  }

  // Combine member info with stats
  const groupLeaderboard = memberStats.map((stats, index) => {
    const member = members.find(m => m.user_id === stats.user_id);
    const isCurrentUser = stats.user_id === userId;
    
    let displayName;
    if (isCurrentUser) {
      displayName = 'You';
    } else if (stats.display_name) {
      displayName = stats.display_name;
    } else if (stats.name) {
      displayName = stats.name;
    } else if (stats.email) {
      displayName = stats.email.split('@')[0];
    } else {
      displayName = `Member ${index + 1}`;
    }

    return {
      rank: index + 1,
      name: displayName,
      role: member.role,
      masteryPoints: stats.total_points,
      currentStreak: stats.current_streak,
      totalQuizzes: stats.total_quizzes,
      averageScore: Math.round(stats.average_score || 0),
      weeklyPoints: stats.weekly_points,
      isCurrentUser,
      joinedAt: member.joined_at
    };
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ groupLeaderboard })
  };
}

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
