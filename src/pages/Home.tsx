import { ArrowRight, ShieldAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button, ButtonLink } from '../components/Button'
import { Bubble, Eyes, Glyph } from '../components/Doodle'
import { NoteCard } from '../components/NoteCard'
import { Card, Container, Frame, SectionTitle, Tag } from '../components/UI'
import { Wordmark } from '../components/Wordmark'
import { brand, examples, home, notes, threats, type GlyphName } from '../content'
import { levelColor, useHistory } from '../lib/history'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const levelWord = { low: 'Nothing obvious', caution: 'Worth a second look', high: 'High risk' } as const

function TitleScreen() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const { checks } = useHistory()
  const last = checks[0]
  const picks = examples.slice(0, 3)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = value.trim()
    navigate(v ? `/check?q=${encodeURIComponent(v)}` : '/check')
  }
  return (
    <Container className="max-w-[1320px]">
      <Frame className="px-4 py-12 md:px-8 md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute top-[8%] right-[5%] rotate-6">
            <Glyph name="envelope" size={132} className="text-ink-2" boil />
            <div className="mt-2 flex justify-end">
              <Bubble tail="right">urgent!</Bubble>
            </div>
          </div>
          <div className="absolute bottom-[18%] left-[5%] -rotate-12">
            <Glyph name="hook" size={104} className="text-ink-2" boil />
          </div>
          <div className="absolute top-[14%] left-[8%] hidden -rotate-6 lg:block">
            <Glyph name="lock" size={74} className="text-ink-2" boil />
          </div>
          <div className="absolute right-[8%] bottom-[14%] hidden rotate-6 lg:block">
            <Glyph name="phone" size={86} className="text-ink-2" boil />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <Tag tone="butter" className="gap-1.5">
            <ShieldAlert className="size-3.5" strokeWidth={3} aria-hidden="true" />
            {home.kicker}
          </Tag>
          <Eyes size={104} className="mt-6" />
          <Wordmark className="mt-5 text-[6rem] sm:text-[8rem] md:text-[9.5rem]" />
          <p className="mt-6 max-w-[36rem] text-[1.0625rem] leading-snug font-semibold text-ink-2 md:text-[1.1875rem]">{brand.tagline}</p>

          <form onSubmit={submit} className="mt-8 w-full max-w-[580px] text-left">
            <label htmlFor="hero-link" className="sr-only">
              {home.scanTitle}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="hero-link"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={home.scanPlaceholder}
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                className="h-14 w-full min-w-0 rounded-[var(--radius-md)] border-[2.5px] border-ink bg-white px-4 font-semibold text-ink shadow-[var(--shadow-offset-sm)] placeholder:text-pencil focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
              />
              <Button type="submit" size="lg" className="h-14 shrink-0" icon={<ArrowRight className="size-4" strokeWidth={3} />}>
                {home.scanCta}
              </Button>
            </div>
            <p className="mt-3 text-[0.8125rem] text-graphite">{home.privacy}</p>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[0.75rem] font-extrabold text-graphite">{home.examplesLabel}</span>
            {picks.map((ex) => (
              <ButtonLink key={ex.id} to={`/check?sample=${ex.id}`} variant="paper" size="sm" className="h-9 px-3.5 text-[0.8125rem]">
                {ex.label}
              </ButtonLink>
            ))}
          </div>

          {last && (
            <Link to="/check" className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-card px-3 py-1.5 text-[0.8125rem] font-bold hover:bg-white">
              <span className={`round size-2.5 rounded-full border border-ink ${levelColor(last.level)}`} aria-hidden="true" />
              {home.lastCheck}: {levelWord[last.level]} · {last.score}/100
            </Link>
          )}
        </div>

        <p className="relative z-10 mt-12 text-center text-[0.8125rem] text-graphite md:mt-14">
          Hand-drawn rules, not a black box.{' '}
          <Link className="ink-link" to="/guide">
            How it works
          </Link>
          .
        </p>
      </Frame>
    </Container>
  )
}

const ctaGlyphs: GlyphName[] = ['link', 'hook', 'warning', 'eye']

export function Home() {
  useDocumentTitle()
  return (
    <>
      <TitleScreen />

      <Container className="mt-24">
        <div className="grid gap-6 md:grid-cols-3">
          {home.features.map((f) => (
            <Card key={f.title} className="p-6 md:p-7">
              <Glyph name={f.glyph} size={62} className="mb-4" boil />
              <h2 className="font-display text-[1.875rem] leading-none font-black">{f.title}</h2>
              <p className="mt-3 leading-relaxed text-graphite">{f.body}</p>
            </Card>
          ))}
        </div>
      </Container>

      <Container className="mt-24">
        <div className="flex flex-col gap-8 rounded-[var(--radius-frame)] border-[3px] border-ink bg-paper p-6 md:flex-row md:items-center md:p-10">
          <div className="md:w-[38%]">
            <SectionTitle>{home.libraryTitle}</SectionTitle>
            <p className="mt-3 leading-relaxed text-graphite">{home.libraryBody}</p>
            <ButtonLink to="/threats" variant="paper" className="mt-6" icon={<ArrowRight className="size-4" strokeWidth={3} />}>
              {home.libraryCta}
            </ButtonLink>
          </div>
          <ul className="grid flex-1 grid-cols-3 gap-3 sm:grid-cols-6">
            {threats.slice(0, 6).map((t) => (
              <li key={t.id}>
                <Link
                  to="/threats"
                  className="round flex h-full flex-col items-center gap-2 rounded-[var(--radius-md)] bg-card px-2 pt-4 pb-3 text-center hover:bg-white"
                >
                  <Glyph name={t.glyph} size={38} />
                  <span className="text-[0.75rem] leading-tight font-extrabold">{t.kicker}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="mt-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionTitle>{home.notesTitle}</SectionTitle>
          <Link to="/notes" className="ink-link inline-flex h-10 items-center font-extrabold">
            {home.notesCta}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {notes.posts.slice(0, 3).map((p) => (
            <NoteCard key={p.slug} note={p} />
          ))}
        </div>
      </Container>

      <Container className="mt-24">
        <div className="relative overflow-hidden rounded-[var(--radius-frame)] bg-ink px-6 py-12 text-center text-white md:px-12 md:py-16">
          <div aria-hidden="true" className="mb-6 flex justify-center gap-8 [--glyph-fill:transparent]">
            {ctaGlyphs.map((g) => (
              <Glyph key={g} name={g} size={38} className="text-white" />
            ))}
          </div>
          <h2 className="font-display text-[2.5rem] leading-none font-black md:text-[3.5rem]">{home.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">{home.ctaBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink to="/check" variant="paper" size="lg">
              {home.ctaPrimary}
            </ButtonLink>
            <ButtonLink to="/guide" variant="ghost" size="lg" className="text-white hover:bg-white/10">
              {home.ctaSecondary}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  )
}
