import { ArrowLeft, ArrowRight, Check, TriangleAlert } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button, ButtonLink } from '../components/Button'
import { Bubble, Glyph } from '../components/Doodle'
import { Card, Container, Frame, PageHeader, SectionTitle, Tag } from '../components/UI'
import { checks, guide } from '../content'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const levelRows = [
  { badge: 'bg-ok text-white', word: 'Nothing obvious', range: '0 – 24' },
  { badge: 'bg-butter text-ink', word: 'Second look', range: '25 – 54' },
  { badge: 'bg-alert text-white', word: 'High risk', range: '55 – 100' },
]

function Scene({ scene }: { scene: string }) {
  return (
    <div aria-hidden="true" className="relative h-full w-full">
      {scene === 'paste' && (
        <>
          <div className="absolute inset-0 grid place-items-center">
            <Glyph name="link" size={132} className="-rotate-6" boil />
          </div>
          <div className="absolute top-6 left-1/2 -translate-x-1/2">
            <Bubble tail="center">do not click</Bubble>
          </div>
          <div className="absolute bottom-[12%] left-[12%]">
            <Glyph name="envelope" size={62} className="-rotate-6" boil />
          </div>
          <div className="absolute right-[13%] bottom-[14%]">
            <Glyph name="hook" size={54} className="rotate-12" boil />
          </div>
        </>
      )}
      {scene === 'levels' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          {levelRows.map((r) => (
            <div key={r.word} className="flex w-full max-w-[300px] items-center justify-between gap-3">
              <span className={cx('round inline-flex h-8 items-center rounded-full border-2 border-ink px-3 text-[0.75rem] font-extrabold', r.badge)}>{r.word}</span>
              <span className="font-display text-[1.5rem] leading-none font-black tabular-nums">{r.range}</span>
            </div>
          ))}
        </div>
      )}
      {scene === 'flags' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
          <div className="flex w-full max-w-[320px] items-center gap-3 rounded-[var(--radius-md)] border-2 border-ink bg-card px-3 py-2.5">
            <span className="round grid size-7 shrink-0 place-items-center rounded-full bg-alert/12 text-alert">
              <TriangleAlert className="size-4" strokeWidth={3} />
            </span>
            <span className="flex-1 text-[0.8125rem] font-bold">Borrows a bank name</span>
            <span className="text-[0.75rem] font-black">+34</span>
          </div>
          <div className="flex w-full max-w-[320px] items-center gap-3 rounded-[var(--radius-md)] border-2 border-ink bg-card px-3 py-2.5">
            <span className="round grid size-7 shrink-0 place-items-center rounded-full bg-butter">
              <TriangleAlert className="size-4" strokeWidth={3} />
            </span>
            <span className="flex-1 text-[0.8125rem] font-bold">A 24-hour deadline</span>
            <span className="text-[0.75rem] font-black">+14</span>
          </div>
          <div className="flex w-full max-w-[320px] items-center gap-3 rounded-[var(--radius-md)] border-2 border-ink bg-card px-3 py-2.5">
            <span className="round grid size-7 shrink-0 place-items-center rounded-full bg-ok/12 text-ok">
              <Check className="size-4" strokeWidth={3} />
            </span>
            <span className="flex-1 text-[0.8125rem] font-bold">Encrypted connection</span>
            <span className="text-[0.75rem] font-black">+0</span>
          </div>
        </div>
      )}
      {scene === 'verify' && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Glyph name="phone" size={116} className="rotate-3" boil />
          </div>
          <div className="absolute top-[14%] right-[14%]">
            <Glyph name="shield" size={68} className="-rotate-6" boil />
          </div>
          <div className="absolute bottom-[16%] left-[12%]">
            <Bubble tail="left">the app knows</Bubble>
          </div>
          <div className="absolute top-[22%] left-[10%] -rotate-6">
            <Bubble tail="left">no link</Bubble>
          </div>
        </>
      )}
    </div>
  )
}

export function Guide() {
  useDocumentTitle(guide.title)
  const [i, setI] = useState(0)
  const steps = guide.steps
  const step = steps[i]
  const headRef = useRef<HTMLHeadingElement>(null)
  const go = (n: number) => {
    setI(n)
    requestAnimationFrame(() => headRef.current?.focus())
  }
  const last = i === steps.length - 1
  return (
    <Container>
      <PageHeader title={guide.title} intro={guide.intro} />
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Frame className="aspect-[4/3] rounded-[var(--radius-lg)] border-[3.5px] lg:aspect-auto lg:min-h-[420px]">
          <Scene key={step.scene} scene={step.scene} />
        </Frame>
        <Card className="flex flex-col p-6 md:p-8">
          <p className="text-[0.875rem] font-extrabold text-graphite" aria-live="polite">
            {guide.stepLabel(i + 1, steps.length)}
          </p>
          <h2 ref={headRef} tabIndex={-1} className="mt-2 font-display text-[2.75rem] leading-[0.95] font-black focus:outline-none">
            {step.title}
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-2">{step.body}</p>
          <p className="mt-4">
            <Tag tone="butter">{step.tip}</Tag>
          </p>
          <div className="mt-auto pt-8">
            <ol className="mb-5 flex gap-2" aria-label="Steps">
              {steps.map((s, n) => (
                <li key={s.title}>
                  <button
                    type="button"
                    aria-label={`${guide.stepLabel(n + 1, steps.length)}: ${s.title}`}
                    aria-current={n === i ? 'step' : undefined}
                    onClick={() => go(n)}
                    className="round grid size-10 place-items-center rounded-full"
                  >
                    <span className={cx('round block size-3.5 rounded-full border-2 border-ink transition-colors', n === i ? 'bg-ink' : n < i ? 'bg-pencil' : 'bg-card')} />
                  </button>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-3">
              <Button variant="paper" disabled={i === 0} onClick={() => go(i - 1)} icon={<ArrowLeft className="size-4" strokeWidth={3} />}>
                {guide.back}
              </Button>
              {last ? (
                <ButtonLink to="/check" icon={<ArrowRight className="size-4" strokeWidth={3} />}>
                  {guide.finish}
                </ButtonLink>
              ) : (
                <Button onClick={() => go(i + 1)}>
                  {guide.next}
                  <ArrowRight className="size-4" strokeWidth={3} />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <section className="mt-20">
        <SectionTitle>{guide.checksTitle}</SectionTitle>
        <p className="mt-3 max-w-2xl text-graphite">{guide.checksIntro}</p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {checks.map((c) => (
            <li key={c.title}>
              <Card className="flex h-full flex-col items-start p-5">
                <Glyph name={c.glyph} size={46} />
                <h3 className="mt-3 font-display text-[1.5rem] leading-none font-black">{c.title}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-graphite">{c.body}</p>
                <Tag className="mt-3">{c.scope === 'both' ? guide.scope.both : c.scope === 'url' ? guide.scope.url : guide.scope.message}</Tag>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  )
}
