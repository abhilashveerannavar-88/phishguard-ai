import { ArrowRight, Check as CheckIcon, Info, ShieldAlert, Trash2, TriangleAlert, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'

import { Button } from '../components/Button'
import { Glyph } from '../components/Doodle'
import { TextArea, TextField } from '../components/Field'
import { Card, Chip, Container, PageHeader, Tag } from '../components/UI'
import { examples, scan, type Example } from '../content'
import { analyze, type Finding, type Kind, type Level, type Result, type Tone } from '../lib/analyze'
import { timeAgo } from '../lib/format'
import { addCheck, clearChecks, levelColor, useHistory } from '../lib/history'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type Mode = Kind

const levels: Record<Level, { badge: string; soft: string; bar: string; icon: LucideIcon; word: string; range: string }> = {
  low: { badge: 'bg-ok text-white', soft: 'bg-[#e8efe4]', bar: 'bg-ok', icon: CheckIcon, word: 'Nothing obvious', range: '0 – 24' },
  caution: { badge: 'bg-butter text-ink', soft: 'bg-[#f6f0d2]', bar: 'bg-butter', icon: TriangleAlert, word: 'Second look', range: '25 – 54' },
  high: { badge: 'bg-alert text-white', soft: 'bg-[#f6e6e3]', bar: 'bg-alert', icon: ShieldAlert, word: 'High risk', range: '55 – 100' },
}

const toneStyle: Record<Tone, { icon: LucideIcon; chip: string }> = {
  bad: { icon: ShieldAlert, chip: 'bg-alert/12 text-alert' },
  warn: { icon: TriangleAlert, chip: 'bg-butter text-ink' },
  info: { icon: Info, chip: 'bg-paper-2 text-graphite' },
  good: { icon: CheckIcon, chip: 'bg-ok/12 text-ok' },
}

function Meter({ score, level }: { score: number; level: Level }) {
  return (
    <div className="mt-6">
      <div className="relative h-5 overflow-hidden rounded-full border-[2.5px] border-ink bg-card">
        <div className={`h-full transition-[width] duration-500 ease-out ${levels[level].bar}`} style={{ width: `${Math.max(score, 2)}%` }} />
        <span aria-hidden="true" className="absolute inset-y-0 left-[25%] w-[2px] bg-ink/20" />
        <span aria-hidden="true" className="absolute inset-y-0 left-[55%] w-[2px] bg-ink/20" />
      </div>
      <div className="mt-1.5 flex justify-between text-[0.6875rem] font-extrabold text-graphite">
        <span>0</span>
        <span>25 · second look</span>
        <span>55 · high risk</span>
        <span>100</span>
      </div>
    </div>
  )
}

function FindingRow({ finding }: { finding: Finding }) {
  const Icon = toneStyle[finding.tone].icon
  return (
    <li className="flex gap-3 rounded-[var(--radius-md)] border-2 border-ink/12 bg-white/70 p-4">
      <span className={`round mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${toneStyle[finding.tone].chip}`} aria-hidden="true">
        <Icon className="size-4" strokeWidth={3} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold">{finding.title}</p>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-graphite">{finding.detail}</p>
      </div>
      {finding.weight > 0 && (
        <span className="round h-7 shrink-0 rounded-full border-2 border-ink bg-card px-2 text-[0.75rem] leading-[1.4rem] font-black tabular-nums">+{finding.weight}</span>
      )}
    </li>
  )
}

function Verdict({ result, onReset }: { result: Result; onReset: () => void }) {
  const style = levels[result.level]
  const Icon = style.icon
  return (
    <div id="result" className="scroll-mt-6">
      <Card className="overflow-hidden" aria-live="polite">
        <div className={`border-b-[2.5px] border-ink p-6 md:p-8 ${style.soft}`}>
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0">
              <span className={`round inline-flex h-9 items-center gap-2 rounded-full border-2 border-ink px-3.5 text-[0.8125rem] font-extrabold ${style.badge}`}>
                <Icon className="size-4" strokeWidth={3} aria-hidden="true" />
                {result.label}
              </span>
              <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-2">{result.summary}</p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-[0.75rem] font-extrabold text-graphite">{scan.result.score}</p>
              <p className="font-display text-[3.5rem] leading-none font-black tabular-nums">
                {result.score}
                <span className="text-[1.5rem] text-graphite">/100</span>
              </p>
            </div>
          </div>
          <Meter score={result.score} level={result.level} />
          <p className="mt-3 truncate text-[0.8125rem] text-graphite">
            <span className="font-extrabold">{result.kind === 'url' ? 'Link' : 'Message'}:</span> {result.target}
          </p>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-display text-[2rem] leading-none font-black">{scan.result.findings}</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {result.findings.map((f) => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </ul>

          <h2 className="mt-8 font-display text-[2rem] leading-none font-black">{scan.result.advice}</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {result.advice.map((a) => (
              <li key={a} className="flex items-start gap-3 text-[1rem] leading-relaxed text-ink-2">
                <CheckIcon className="mt-1 size-4 shrink-0 text-ok" strokeWidth={3.5} aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t-2 border-ink/10 pt-5">
            <p className="max-w-lg text-[0.8125rem] leading-relaxed text-graphite">{scan.result.disclaimer}</p>
            <Button variant="paper" onClick={onReset}>
              {scan.result.again}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Legend() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {(['low', 'caution', 'high'] as Level[]).map((l) => {
        const style = levels[l]
        const Icon = style.icon
        return (
          <div key={l} className="rounded-[var(--radius-md)] border-2 border-ink/15 bg-card p-4">
            <span className={`round inline-flex h-7 items-center gap-1.5 rounded-full border-2 border-ink px-2.5 text-[0.75rem] font-extrabold ${style.badge}`}>
              <Icon className="size-3.5" strokeWidth={3} aria-hidden="true" />
              {style.word}
            </span>
            <p className="mt-2 font-display text-[1.375rem] leading-none font-black tabular-nums">{style.range}</p>
          </div>
        )
      })}
    </div>
  )
}

function History() {
  const { checks } = useHistory()
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-[1.5rem] leading-none font-black">{scan.history}</h2>
        <Button variant="ghost" size="sm" className="-mr-2" disabled={!checks.length} onClick={clearChecks} icon={<Trash2 className="size-4" strokeWidth={2.5} />}>
          {scan.clear}
        </Button>
      </div>
      {checks.length ? (
        <ol className="mt-3 flex flex-col divide-y-2 divide-ink/10">
          {checks.slice(0, 6).map((c) => (
            <li key={c.at} className="flex items-center gap-2.5 py-2.5">
              <span className={`round size-2.5 shrink-0 rounded-full border border-ink ${levelColor(c.level)}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.875rem] font-bold">{c.label}</p>
                <p className="text-[0.75rem] text-graphite">
                  {c.kind === 'url' ? 'Link' : 'Message'} · {c.score}/100 · {timeAgo(c.at)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-[0.9375rem] text-graphite">{scan.historyEmpty}</p>
      )}
    </Card>
  )
}

export function Check() {
  useDocumentTitle(scan.title)
  const [params] = useSearchParams()
  const [mode, setMode] = useState<Mode>('url')
  const [value, setValue] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const started = useRef(false)

  const run = (text: string, nextMode: Mode, scroll = true) => {
    const trimmed = text.trim()
    if (trimmed.length < 3) {
      setError(nextMode === 'url' ? scan.errorShort : scan.error)
      return
    }
    const r = analyze(nextMode, trimmed)
    setResult(r)
    setError('')
    addCheck({ kind: nextMode, label: r.target, score: r.score, level: r.level })
    if (scroll) window.setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const query = params.toString()
  useEffect(() => {
    if (started.current) return
    const sample = params.get('sample')
    const q = params.get('q')
    if (sample) {
      const ex = examples.find((e) => e.id === sample)
      if (ex) {
        started.current = true
        setMode(ex.kind)
        setValue(ex.text)
        run(ex.text, ex.kind, false)
      }
    } else if (q && q.trim().length >= 3) {
      started.current = true
      setMode('url')
      setValue(q)
      run(q, 'url', false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    run(value, mode)
  }

  const load = (ex: Example) => {
    setMode(ex.kind)
    setValue(ex.text)
    run(ex.text, ex.kind)
  }

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    setValue('')
    setResult(null)
    setError('')
  }

  return (
    <Container>
      <PageHeader title={scan.title} intro={scan.intro} className="md:mb-8" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card className="p-5 md:p-6">
            <div role="group" aria-label="What are you checking" className="flex flex-wrap gap-2">
              <Chip active={mode === 'url'} onClick={() => switchMode('url')}>
                {scan.tabs.url}
              </Chip>
              <Chip active={mode === 'message'} onClick={() => switchMode('message')}>
                {scan.tabs.message}
              </Chip>
            </div>

            <form onSubmit={submit} className="mt-5">
              {mode === 'url' ? (
                <TextField
                  label={scan.url.label}
                  hint={scan.url.hint}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={scan.url.placeholder}
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  error={error || undefined}
                />
              ) : (
                <TextArea
                  label={scan.message.label}
                  hint={scan.message.hint}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={scan.message.placeholder}
                  rows={7}
                  className="min-h-44"
                  error={error || undefined}
                  spellCheck
                />
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Button type="submit" icon={<ArrowRight className="size-4" strokeWidth={3} />}>
                  {scan.submit}
                </Button>
                <p className="text-[0.8125rem] text-graphite">{mode === 'url' ? 'The link is never opened.' : 'Text only; no screenshots yet.'}</p>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t-2 border-ink/10 pt-4">
              <span className="text-[0.75rem] font-extrabold text-graphite">{scan.examples}</span>
              {examples.map((ex) => (
                <Chip key={ex.id} onClick={() => load(ex)} className="h-8 px-3 text-[0.75rem]">
                  {ex.label}
                </Chip>
              ))}
            </div>
          </Card>

          {result ? <Verdict result={result} onReset={() => { setResult(null); setValue(''); setError('') }} /> : <Legend />}
        </div>

        <aside className="flex flex-col gap-5">
          <History />
          <Card className="p-5">
            <h2 className="font-display text-[1.5rem] leading-none font-black">{scan.tipsTitle}</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {scan.tips.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                  <CheckIcon className="mt-1 size-3.5 shrink-0 text-ok" strokeWidth={3.5} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Glyph name="eye" size={28} />
              <h2 className="font-display text-[1.5rem] leading-none font-black">{scan.privacyTitle}</h2>
            </div>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-graphite">{scan.privacyBody}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Tag>No account</Tag>
              <Tag>No uploads</Tag>
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  )
}
