// Netlify Function: /api/chat -> /.netlify/functions/chat
// Uses OpenAI server-side. Ensure OPENAI_API_KEY and OPENAI_MODEL are set in Netlify env.

const OpenAI = require('openai');
const { verifyToken } = require('@clerk/clerk-sdk-node');

// Minimal server-only constants (duplicated to avoid TS/ESM import issues in functions)
const DVSA_CATEGORIES = [
  "Alertness",
  "Attitude",
  "Safety and your vehicle",
  "Safety margins",
  "Hazard awareness",
  "Vulnerable road users",
  "Other types of vehicle",
  "Vehicle handling",
  "Motorway rules",
  "Rules of the road",
  "Road and traffic signs",
  "Documents",
  "Incidents, accidents and emergencies",
  "Vehicle loading"
];

const SYSTEM_INSTRUCTION = `You are "Theo", an expert AI Driving Coach for UK learner drivers. Be concise and helpful. When recommending a quiz, append a JSON action on a new line like:
<action>{"type":"start_quiz","categories":["Motorway rules"],"questionCount":10}</action>
Only include <action> if truly relevant. Categories must be one of: ${DVSA_CATEGORIES.join(', ')}.`;

function buildMessages(history) {
  const msgs = [];
  msgs.push({ role: 'system', content: SYSTEM_INSTRUCTION });
  for (const m of history || []) {
    if (m.role === 'user') msgs.push({ role: 'user', content: m.text });
    else msgs.push({ role: 'assistant', content: m.text });
  }
  return msgs;
}

function extractActionFromText(text) {
  try {
    const start = text.lastIndexOf('<action>');
    const end = text.lastIndexOf('</action>');
    if (start === -1 || end === -1 || end <= start) return undefined;
    const jsonText = text.substring(start + '<action>'.length, end).trim();
    const obj = JSON.parse(jsonText);
    if (obj && obj.type === 'start_quiz' && Array.isArray(obj.categories) && typeof obj.questionCount === 'number') {
      const allowed = DVSA_CATEGORIES.map(String);
      const mapped = obj.categories.filter((c) => allowed.includes(String(c)));
      return { type: 'start_quiz', categories: mapped, questionCount: obj.questionCount };
    }
  } catch (_) {}
  return undefined;
}

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Auth: verify Clerk JWT from Authorization header
    const authHeader = event.headers['authorization'] || event.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Missing Authorization header' }) };
    }
    const token = authHeader.substring('Bearer '.length);
    try {
      await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    } catch (e) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    if (!OPENAI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing OPENAI_API_KEY' }) };
    }

    const body = JSON.parse(event.body || '{}');
    const history = Array.isArray(body.history) ? body.history : [];

    const client = new OpenAI({ apiKey: OPENAI_API_KEY });
    const messages = buildMessages(history);

    const resp = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.3,
    });

    const text = resp.choices?.[0]?.message?.content || '';
    const action = extractActionFromText(text);

    return { statusCode: 200, body: JSON.stringify({ text, action }) };
  } catch (err) {
    console.error('Netlify function error /chat:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Upstream error contacting OpenAI' }) };
  }
};
