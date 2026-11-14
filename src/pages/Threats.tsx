import { ArrowRight, Check, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { ButtonLink } from '../components/Button'
import { Glyph } from '../components/Doodle'
import { Modal } from '../components/Overlay'
import { Card, Chip, Container, EmptyState, PageHeader, Tag } from '../components/UI'
import { examples, threats, threatsPage as copy, type Threat, type ThreatGroup } from '../content'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type Filter = 'all' | ThreatGroup

function ThreatCard({ threat, onOpen, force }: { threat: Threat; onOpen: () => void; force?: 'hover' }) {
  return (
    <Card interactive force={force} className="flex h-full flex-col overflow-hidden">
      <div className="relative grid h-40 place-items-center border-b-[2.5px] border-ink bg-white/60">
        <Glyph name={threat.glyph} size={72} boil />
        <Tag tone={threat.severity === 'Rising' ? 'butter' : 'ink'} className="absolute top-3 left-3">
          {threat.severity}
        </Tag>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.75rem] font-extrabold text-graphite">{threat.kicker}</p>
        <h2 className="mt-1 font-display text-[1.75rem] leading-none font-black">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex min-h-10 min-w-10 items-center text-left after:absolute after:inset-0 after:rounded-[var(--radius-lg)] focus:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-3 focus-visible:after:outline-ink"
          >
            {threat.name}
          </button>
        </h2>
        <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-graphite">{threat.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-extrabold">
          {copy.tellsTitle} <ArrowRight className="size-3.5" strokeWidth={3} />
        </span>
      </div>
    </Card>
  )
}

export function Threats() {
  useDocumentTitle(copy.title)
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<Threat | null>(null)
  const list = threats.filter((t) => filter === 'all' || t.group === filter)
  const sample = open?.sample ? examples.find((e) => e.id === open.sample) : undefined
  return (
    <Container>
      <PageHeader title={copy.title} intro={copy.intro}>
        <p className="shrink-0 font-display text-[1.5rem] leading-none font-black">{threats.length} shapes</p>
      </PageHeader>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter scams">
        {copy.filters.map((f) => (
          <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id as Filter)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {list.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <li key={t.id}>
              <ThreatCard threat={t} onOpen={() => setOpen(t)} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={copy.empty} />
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} description={open?.kicker}>
        {open && (
          <div>
            <div className="paper-grain flex h-36 items-center justify-center gap-6 rounded-[var(--radius-md)] border-2 border-ink">
              <Glyph name={open.glyph} size={66} boil />
              <div className="flex flex-col gap-1.5 text-[0.75rem] font-extrabold">
                <span>
                  {copy.severity}: {open.severity}
                </span>
                <span>
                  {copy.channel}: {open.channel}
                </span>
              </div>
            </div>

            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-2">{open.summary}</p>

            <p className="mt-5 text-[0.75rem] font-extrabold text-graphite">{copy.startTitle}</p>
            <blockquote className="mt-1.5 rounded-[var(--radius-md)] border-l-4 border-ink bg-paper px-4 py-3 text-[0.9375rem] leading-relaxed text-ink-2">
              “{open.start}”
            </blockquote>

            <h3 className="mt-5 font-display text-[1.5rem] leading-none font-black">{copy.tellsTitle}</h3>
            <ul className="mt-2.5 flex flex-col gap-2">
              {open.tells.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-alert" strokeWidth={2.75} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>

            <h3 className="mt-5 font-display text-[1.5rem] leading-none font-black">{copy.dosTitle}</h3>
            <ul className="mt-2.5 flex flex-col gap-2">
              {open.dos.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={3} aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <ButtonLink to={sample ? `/check?sample=${sample.id}` : '/check'}>
                {sample?.kind === 'url' ? 'Check a link like this' : copy.check}
              </ButtonLink>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  )
}
