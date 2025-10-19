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
    const body = event.body ? JSON.parse(event.body) : {};

    if (method === 'GET') {
      return await handleGetChallenges(admin, userId, body.groupId);
    } else if (method === 'POST') {
      return await handleCreateChallenge(admin, userId, body);
    } else if (method === 'PUT') {
      return await handleJoinChallenge(admin, userId, body);
    }

    return { statusCode: 404, body: 'Not Found' };
  } catch (e) {
    console.error('Group challenges error:', e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};

async function handleGetChallenges(admin, userId, groupId) {
  // Get active challenges for the group
  const { data: challenges, error: challengesErr } = await admin
    .from('group_challenges')
    .select(`
      id,
      title,
      description,
      challenge_type,
      target_value,
      start_date,
      end_date,
      created_by,
      is_active,
      created_at,
      group_challenge_participants (
        user_id,
        current_progress,
        completed_at,
        joined_at
      )
    `)
    .eq('group_id', groupId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (challengesErr) {
    return { statusCode: 500, body: JSON.stringify({ error: challengesErr.message }) };
  }

  // Format challenges with participation info
  const formattedChallenges = challenges.map(challenge => {
    const participants = challenge.group_challenge_participants;
    const userParticipation = participants.find(p => p.user_id === userId);
    
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      challengeType: challenge.challenge_type,
      targetValue: challenge.target_value,
      startDate: challenge.start_date,
      endDate: challenge.end_date,
      createdBy: challenge.created_by,
      participantCount: participants.length,
      completedCount: participants.filter(p => p.completed_at).length,
      userProgress: userParticipation?.current_progress || 0,
      userCompleted: !!userParticipation?.completed_at,
      userJoined: !!userParticipation,
      daysLeft: Math.max(0, Math.ceil((new Date(challenge.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
    };
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ challenges: formattedChallenges })
  };
}

async function handleCreateChallenge(admin, userId, body) {
  const { groupId, title, description, challengeType, targetValue, endDate } = body;

  // Verify user is admin/owner of the group
  const { data: membership, error: memberErr } = await admin
    .from('study_group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .single();

  if (memberErr || !membership || !['admin', 'owner'].includes(membership.role)) {
    return { statusCode: 403, body: 'Only group admins can create challenges' };
  }

  // Create challenge
  const { data: challenge, error: challengeErr } = await admin
    .from('group_challenges')
    .insert({
      group_id: groupId,
      title: title.trim(),
      description: description?.trim() || null,
      challenge_type: challengeType,
      target_value: targetValue,
      end_date: endDate,
      created_by: userId
    })
    .select()
    .single();

  if (challengeErr) {
    return { statusCode: 500, body: JSON.stringify({ error: challengeErr.message }) };
  }

  return {
    statusCode: 201,
    body: JSON.stringify(challenge)
  };
}

async function handleJoinChallenge(admin, userId, body) {
  const { challengeId } = body;

  // Check if challenge exists and is active
  const { data: challenge, error: challengeErr } = await admin
    .from('group_challenges')
    .select('id, end_date, is_active')
    .eq('id', challengeId)
    .single();

  if (challengeErr || !challenge || !challenge.is_active) {
    return { statusCode: 404, body: 'Challenge not found or inactive' };
  }

  // Check if challenge hasn't ended
  if (new Date(challenge.end_date) < new Date()) {
    return { statusCode: 400, body: 'Challenge has ended' };
  }

  // Check if already participating
  const { data: existing } = await admin
    .from('group_challenge_participants')
    .select('id')
    .eq('challenge_id', challengeId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    return { statusCode: 400, body: 'Already participating in this challenge' };
  }

  // Join challenge
  const { error: joinErr } = await admin
    .from('group_challenge_participants')
    .insert({
      challenge_id: challengeId,
      user_id: userId,
      current_progress: 0
    });

  if (joinErr) {
    return { statusCode: 500, body: JSON.stringify({ error: joinErr.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Joined challenge successfully' })
  };
}
