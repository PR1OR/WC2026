const webpush = require('web-push');

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL || 'mailto:admin@example.com';
  if (!pub || !priv) return { statusCode: 500, headers, body: JSON.stringify({ error: 'VAPID keys not configured in Netlify env vars' }) };

  webpush.setVapidDetails(email, pub, priv);

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { subscriptions = [], title, body: msg } = body;
  if (!subscriptions.length) return { statusCode: 200, headers, body: JSON.stringify({ sent: 0 }) };

  const payload = JSON.stringify({ title, body: msg });
  const results = await Promise.allSettled(
    subscriptions.map(sub => webpush.sendNotification(sub, payload).catch(() => null))
  );

  const sent = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
  return { statusCode: 200, headers, body: JSON.stringify({ sent }) };
};
