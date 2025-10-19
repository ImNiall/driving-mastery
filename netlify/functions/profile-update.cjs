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
    const { display_name, name, email } = body;

    // Validate display_name if provided
    if (display_name !== undefined) {
      if (typeof display_name !== 'string' || display_name.length > 50) {
        return { statusCode: 400, body: 'Display name must be a string under 50 characters' };
      }
      // Basic profanity/content check could go here
    }

    // Upsert profile
    const profileData = {
      user_id: userId,
      ...(display_name !== undefined && { display_name }),
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email })
    };

    const { data, error } = await admin
      .from('profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select('user_id, display_name, name, email')
      .single();

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
