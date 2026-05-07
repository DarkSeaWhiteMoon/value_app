/**
 * Vercel Serverless Function — proxies Chat Completions to OpenAI.
 * Env (set in Vercel Dashboard → Project → Settings → Environment Variables):
 *   OPENAI_API_KEY
 *
 * POST /api/openai-chat
 * Body JSON:
 *   { model?: string, messages: [{ role: "system"|"user"|"assistant", content: string }], max_tokens?: number, temperature?: number }
 *
 * Responses use Node-style res.statusCode / setHeader / end only (no Express helpers like .type(), .json(), .send()).
 */

function sendJson(res, statusCode, obj) {
  const body = JSON.stringify(obj);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(body);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    sendJson(res, 500, {
      error: 'Missing OPENAI_API_KEY on server',
      vercelEnv: process.env.VERCEL_ENV || null,
      vercelUrl: process.env.VERCEL_URL || null,
      hint: 'Ensure OPENAI_API_KEY is set (non-empty) and redeploy after changing env vars.',
    });
    return;
  }

  async function readBodyJson() {
    if (req.body && typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  const body = await readBodyJson();
  if (!body) {
    sendJson(res, 400, { error: 'Invalid JSON body (empty or unparsable)' });
    return;
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    sendJson(res, 400, { error: 'messages[] required' });
    return;
  }

  const model = typeof body.model === 'string' && body.model.trim()
    ? body.model.trim()
    : 'gpt-4o-mini';

  const payload = {
    model,
    messages,
    max_tokens: typeof body.max_tokens === 'number' ? body.max_tokens : 900,
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
  };

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    const out = r.ok ? text : (text || JSON.stringify({ error: 'OpenAI request failed' }));
    res.statusCode = r.ok ? 200 : r.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(out);
  } catch (e) {
    sendJson(res, 502, {
      error: e?.message || String(e),
      hint: 'Check OPENAI_API_KEY and Vercel function logs',
    });
  }
}
