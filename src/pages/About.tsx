import { Check, Send, TriangleAlert } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { Button } from '../components/Button'
import { Glyph } from '../components/Doodle'
import { ChoiceGroup, TextArea, TextField } from '../components/Field'
import { Card, Container, PageHeader, SectionTitle } from '../components/UI'
import { about } from '../content'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type Fields = Partial<Record<'name' | 'email' | 'kind' | 'message', string>>
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v: { name: string; email: string; kind: string; message: string }): Fields {
  const f: Fields = {}
  if (v.name.trim().length < 2) f.name = 'Tell us your name.'
  if (!EMAIL_RE.test(v.email.trim())) f.email = 'Enter a valid email address.'
  if (!v.kind) f.kind = 'Pick what it was.'
  if (v.message.trim().length < 20) f.message = 'Paste at least 20 characters, minus anything personal.'
  return f
}

function ReportForm() {
  const f = about.form
  const [v, setV] = useState({ name: '', email: '', kind: '', message: '' })
  const [errors, setErrors] = useState<Fields>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const [focusTick, setFocusTick] = useState(0)

  useEffect(() => {
    if (focusTick) formRef.current?.querySelector<HTMLElement>('[aria-invalid=true], fieldset[aria-describedby] input')?.focus()
  }, [focusTick])

  const set = (k: keyof typeof v) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }))
    if (errors[k as keyof Fields]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const local = validate(v)
    setErrors(local)
    if (Object.keys(local).length) {
      setStatus('error')
      setMessage(f.error)
      setFocusTick((n) => n + 1)
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/report', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(v) })
      const data = (await res.json()) as { ok?: boolean; ref?: string; error?: string; fields?: Fields }
      if (!res.ok) {
        setErrors(data.fields ?? {})
        setFocusTick((n) => n + 1)
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong.')
        return
      }
      setStatus('done')
      setMessage(f.success(data.ref ?? ''))
    } catch {
      setStatus('error')
      setMessage(f.networkError)
    }
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-start gap-4" role="status">
        <Glyph name="shield" size={52} boil />
        <p className="text-[1.0625rem] font-bold">{message}</p>
        <Button
          variant="paper"
          onClick={() => {
            setV({ name: '', email: '', kind: '', message: '' })
            setStatus('idle')
          }}
        >
          {f.another}
        </Button>
      </div>
    )
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={f.name} name="name" autoComplete="name" value={v.name} onChange={(e) => set('name')(e.target.value)} error={errors.name} />
        <TextField label={f.email} name="email" type="email" autoComplete="email" value={v.email} onChange={(e) => set('email')(e.target.value)} error={errors.email} />
      </div>
      <ChoiceGroup label={f.kind} name="kind" options={f.kinds} value={v.kind} onChange={set('kind')} error={errors.kind} />
      <TextArea
        label={f.message}
        name="message"
        hint={f.messageHint}
        value={v.message}
        onChange={(e) => set('message')(e.target.value)}
        error={errors.message}
        rows={6}
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" loading={status === 'sending'} icon={<Send className="size-4" strokeWidth={2.75} />}>
          {status === 'sending' ? f.sending : f.submit}
        </Button>
        {status === 'error' && (
          <p role="alert" className="text-[0.9375rem] font-bold text-alert">
            {message}
          </p>
        )}
      </div>
    </form>
  )
}

export function About() {
  useDocumentTitle(about.title)
  return (
    <Container>
      <PageHeader title={about.title} intro={about.intro} />
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <Card className="p-6">
            <h2 className="font-display text-[1.75rem] leading-none font-black">{about.factsTitle}</h2>
            <dl className="mt-4 flex flex-col divide-y-2 divide-ink/10">
              {about.facts.map((f) => (
                <div key={f.k} className="py-2.5">
                  <dt className="text-[0.8125rem] font-extrabold text-graphite">{f.k}</dt>
                  <dd className="font-bold">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-[1.75rem] leading-none font-black">{about.contactTitle}</h2>
            <dl className="mt-3 flex flex-col gap-2">
              {about.contact.map((c) => (
                <div key={c.k}>
                  <dt className="text-[0.8125rem] font-extrabold text-graphite">{c.k}</dt>
                  <dd>
                    <a className="ink-link font-bold" href={`mailto:${c.v}`}>
                      {c.v}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border-2 border-dashed border-pencil p-4 text-[0.8125rem] text-graphite">
            <Glyph name="eye" size={34} />
            No analytics, no cookies to consent to, no account to delete.
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-16">
          <section>
            <SectionTitle>{about.descriptionTitle}</SectionTitle>
            <div className="prose-doodle mt-4 max-w-2xl text-[1.0625rem] text-ink-2">
              {about.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <h3 className="mt-6 font-display text-[1.5rem] leading-none font-black">What you get</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {about.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[1.0625rem] text-ink-2">
                  <Check className="mt-1 size-4 shrink-0 text-ok" strokeWidth={3.5} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle>{about.methodTitle}</SectionTitle>
            <div className="prose-doodle mt-4 max-w-2xl text-[1.0625rem] text-ink-2">
              {about.method.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { tone: 'bg-ok text-white', word: 'Nothing obvious', range: '0 – 24' },
                { tone: 'bg-butter text-ink', word: 'Second look', range: '25 – 54' },
                { tone: 'bg-alert text-white', word: 'High risk', range: '55 – 100' },
              ].map((l) => (
                <div key={l.word} className="rounded-[var(--radius-md)] border-2 border-ink bg-card p-4">
                  <span className={`round inline-flex h-8 items-center rounded-full border-2 border-ink px-3 text-[0.75rem] font-extrabold ${l.tone}`}>{l.word}</span>
                  <p className="mt-2 font-display text-[1.5rem] leading-none font-black tabular-nums">{l.range}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="rounded-[var(--radius-lg)] border-[2.5px] border-alert bg-card p-6 md:p-8">
              <div className="flex items-center gap-3">
                <TriangleAlert className="size-6 shrink-0 text-alert" strokeWidth={2.75} aria-hidden="true" />
                <h2 className="font-display text-[1.875rem] leading-none font-black">{about.limitsTitle}</h2>
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {about.limits.map((l) => (
                  <li key={l} className="flex items-start gap-3 text-[1rem] leading-relaxed text-ink-2">
                    <span aria-hidden="true" className="round mt-2 block size-2 shrink-0 rounded-full bg-alert" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="report">
            <SectionTitle>{about.reportTitle}</SectionTitle>
            <p className="mt-3 max-w-xl text-graphite">{about.reportBody}</p>
            <Card className="mt-6 p-6 md:p-8">
              <ReportForm />
            </Card>
          </section>
        </div>
      </div>
    </Container>
  )
}
