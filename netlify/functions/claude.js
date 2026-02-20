export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'ANTHROPIC_API_KEY not configured' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await req.text()

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body,
  })

  const data = await upstream.text()
  return new Response(data, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/claude/v1/messages' }
