import { Hono } from 'hono'

// The Worker in front of the static site. Detection runs entirely in the
// browser; this endpoint only receives scam reports from the About page.
// This demo build validates a report and returns a reference. Connect it to
// your inbox, a D1 table or a ticketing service to keep the reports.
type Env = { ASSETS: Fetcher }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const KINDS = ['sms', 'email', 'link', 'other'] as const

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ ok: true }))

app.post('/api/report', async (c) => {
  let body: Record<string, unknown> = {}
  try {
    const json = await c.req.json()
    if (json && typeof json === 'object') body = json as Record<string, unknown>
  } catch {
    return c.json({ error: 'Send the form as JSON.' }, 400)
  }
  const fields: Record<string, string> = {}
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const kind = String(body.kind ?? '')
  const message = String(body.message ?? '').trim()

  if (name.length < 2) fields.name = 'Tell us your name.'
  if (!EMAIL_RE.test(email)) fields.email = 'Enter a valid email address.'
  if (!KINDS.includes(kind as (typeof KINDS)[number])) fields.kind = 'Pick what it was.'
  if (message.length < 20) fields.message = 'Paste at least 20 characters, minus anything personal.'
  if (message.length > 6000) fields.message = 'That is longer than a message needs to be. Trim it to 6,000 characters.'

  if (Object.keys(fields).length) return c.json({ error: 'Check the highlighted fields.', fields }, 400)
  const ref = 'SE-' + crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return c.json({ ok: true, ref })
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
