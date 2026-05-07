/**
 * Vercel Serverless Function — proxies Chat Completions to OpenAI.
 * Env (set in Vercel Dashboard → Project → Settings → Environment Variables):
 *   OPENAI_API_KEY
 *
 * POST /api/openai-chat
 * Body JSON:
 *   { model?: string, messages: [{ role: "system"|"user"|"assistant", content: string }], max_tokens?: number, temperature?: number }
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' });
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
    // Fallback: manually read stream (some runtimes don't populate req.body)
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
    res.status(400).json({ error: 'Invalid JSON body (empty or unparsable)' });
    return;
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages[] required' });
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
    if (!r.ok) {
      // Try to pass through OpenAI error JSON if present; otherwise wrap.
      res.status(r.status).type('application/json').send(text || JSON.stringify({ error: 'OpenAI request failed' }));
      return;
    }

    res.status(200).type('application/json').send(text);
  } catch (e) {
    res.status(502).json({ error: e?.message || String(e), hint: 'Check OPENAI_API_KEY and Vercel function logs' });
  }
}
