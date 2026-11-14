import { Menu, Play, RotateCcw, Send } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { Button, IconButton, type Force, type Variant } from '../components/Button'
import { Bubble, Eyes, Glyph } from '../components/Doodle'
import { NoteCard } from '../components/NoteCard'
import { ChoiceGroup, TextArea, TextField } from '../components/Field'
import { Drawer, Modal } from '../components/Overlay'
import { Card, Chip, Container, EmptyState, Frame, Kbd, PageHeader, Skeleton, Stat, Tag } from '../components/UI'
import { Wordmark } from '../components/Wordmark'
import { checks, notes } from '../content'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const SWATCHES = [
  ['page', '#ffffff', 'Page behind the frame'],
  ['paper', '#f3f2ee', 'Frame and sketch background'],
  ['paper-2', '#e9e7e1', 'Hover fill'],
  ['card', '#fbfaf7', 'Cards, bubbles, inputs'],
  ['ink', '#111111', 'Lines, text, primary buttons'],
  ['ink-2', '#2b2a28', 'Body text'],
  ['graphite', '#5f5e5a', 'Secondary text (AA on paper)'],
  ['pencil', '#8d8b85', 'Placeholders, dashed lines'],
  ['smudge', '#d6d4ce', 'Grey fill'],
  ['shadow', '#c9c7c0', 'Ground shadows'],
  ['butter', '#f1e7a6', 'The one yellow: caution fills'],
  ['alert', '#a3261b', 'High risk and errors'],
  ['ok', '#2f6b34', 'Low risk and confirmations'],
] as const

const TYPE = [
  ['Display XL', 'font-display text-[5rem] leading-[0.9] font-black', 'Londrina Solid 900, 80/72'],
  ['Display L', 'font-display text-[3rem] leading-[0.95] font-black', 'Londrina Solid 900, 48'],
  ['Display M', 'font-display text-[2.25rem] leading-none font-black', 'Londrina Solid 900, 36'],
  ['Display S', 'font-display text-[1.5rem] leading-none font-black', 'Londrina Solid 900, 24'],
  ['Lead', 'text-[1.25rem] font-semibold', 'Nunito 600, 20'],
  ['Body', 'text-[1rem] font-semibold', 'Nunito 600, 16'],
  ['Label', 'text-[0.875rem] font-extrabold', 'Nunito 800, 14'],
  ['Small', 'text-[0.8125rem] text-graphite', 'Nunito 600, 13, graphite'],
] as const

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96]
const RADII = [
  ['sm', 'var(--radius-sm)', '10px'],
  ['md', 'var(--radius-md)', '16px'],
  ['lg', 'var(--radius-lg)', '24px'],
  ['frame', 'var(--radius-frame)', '34px'],
  ['pill', '999px', 'round'],
] as const
const SHADOWS = [
  ['offset', 'var(--shadow-offset)', '0 5px 0 ink'],
  ['offset-sm', 'var(--shadow-offset-sm)', '0 3px 0 ink'],
  ['soft', 'var(--shadow-soft)', 'Soft drop'],
] as const
const MOTION = [
  ['bob', 'animate-bob', '3.4s ease-in-out loop'],
  ['fall-in', 'animate-fall-in', '0.9s squish'],
  ['pop', 'animate-pop', '0.35s squish'],
  ['blink', 'animate-blink', '5s steps'],
  ['boil', 'boil', '0.5s steps, line wobble'],
] as const

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-t-[3px] border-ink pt-8 pb-14">
      <h2 className="mb-6 font-display text-[2.25rem] leading-none font-black">{title}</h2>
      {children}
    </section>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <span className="text-[0.75rem] font-extrabold text-graphite">{children}</span>
}

const STATES: Array<[string, Force | undefined, { disabled?: boolean; loading?: boolean }]> = [
  ['Default', undefined, {}],
  ['Hover', 'hover', {}],
  ['Focus', 'focus', {}],
  ['Pressed', 'pressed', {}],
  ['Disabled', undefined, { disabled: true }],
  ['Loading', undefined, { loading: true }],
]

const glyphNames = [...new Set(checks.map((c) => c.glyph))]

export function Styleguide() {
  useDocumentTitle('Style guide')
  const [replay, setReplay] = useState(0)
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [choice, setChoice] = useState('sms')
  return (
    <Container>
      <PageHeader title="Style guide" intro="The tokens and components Side Eye is built from, rendered by the real components. Hover, focus and pressed states are pinned with data-force." />
      <nav aria-label="Style guide sections" className="mb-10 flex flex-wrap gap-2">
        {['colours', 'type', 'spacing', 'radii', 'shadows', 'motion', 'buttons', 'controls', 'fields', 'doodles', 'cards', 'feedback', 'overlays'].map((s) => (
          <a key={s} href={`#${s}`} className="round inline-flex h-10 items-center rounded-full border-2 border-ink bg-card px-4 text-[0.875rem] font-extrabold capitalize hover:bg-paper-2">
            {s}
          </a>
        ))}
      </nav>

      <Section id="colours" title="Colours">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SWATCHES.map(([name, hex, use]) => (
            <li key={name}>
              <div className="h-20 rounded-[var(--radius-md)] border-[2.5px] border-ink" style={{ background: hex }} />
              <p className="mt-2 font-extrabold">{name}</p>
              <p className="font-mono text-[0.8125rem] text-graphite">{hex}</p>
              <p className="text-[0.8125rem] text-graphite">{use}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type" title="Type scale">
        <div className="flex flex-col gap-5">
          {TYPE.map(([name, cls, spec]) => (
            <div key={name} className="grid gap-1 md:grid-cols-[180px_1fr] md:items-baseline">
              <div>
                <p className="font-extrabold">{name}</p>
                <Label>{spec}</Label>
              </div>
              <p className={cx(cls, 'min-w-0 truncate')}>Side Eye</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="spacing" title="Spacing">
        <div className="flex flex-wrap items-end gap-5">
          {SPACING.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className="bg-ink" style={{ width: s, height: s }} />
              <Label>{s}</Label>
            </div>
          ))}
        </div>
      </Section>

      <Section id="radii" title="Radii">
        <div className="flex flex-wrap gap-6">
          {RADII.map(([name, r, note]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className={cx('size-24 border-[2.5px] border-ink bg-card', name === 'pill' && 'round')} style={{ borderRadius: r }} />
              <p className="font-extrabold">{name}</p>
              <Label>{note}</Label>
            </div>
          ))}
        </div>
      </Section>

      <Section id="shadows" title="Shadows">
        <div className="flex flex-wrap gap-8">
          {SHADOWS.map(([name, s, note]) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div className="size-28 rounded-[var(--radius-lg)] border-[2.5px] border-ink bg-card" style={{ boxShadow: s }} />
              <p className="font-extrabold">{name}</p>
              <Label>{note}</Label>
            </div>
          ))}
        </div>
      </Section>

      <Section id="motion" title="Motion">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Button variant="paper" size="sm" onClick={() => setReplay((n) => n + 1)} icon={<RotateCcw className="size-4" strokeWidth={2.75} />}>
            Replay
          </Button>
          <Label>Durations: fast 120ms, base 220ms, slow 600ms. Reduced motion stops loops and the boil.</Label>
        </div>
        <div key={replay} className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {MOTION.map(([name, cls, note]) => (
            <div key={name} className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border-2 border-ink/15 p-4">
              <div className="grid h-20 place-items-center">
                {name === 'blink' ? (
                  <span className="round block size-8 animate-blink rounded-full bg-ink" />
                ) : (
                  <span className={cx('block', cls)}>
                    <Glyph name="hook" size={52} />
                  </span>
                )}
              </div>
              <p className="font-extrabold">{name}</p>
              <Label>{note}</Label>
            </div>
          ))}
        </div>
      </Section>

      <Section id="buttons" title="Buttons">
        <div className="flex flex-col gap-8">
          {(['ink', 'paper', 'ghost', 'danger'] as Variant[]).map((v) => (
            <div key={v}>
              <p className="mb-3 font-extrabold capitalize">{v}</p>
              <div className="flex flex-wrap items-end gap-5">
                {STATES.map(([label, force, extra]) => (
                  <div key={label} className="flex flex-col items-start gap-2">
                    <Label>{label}</Label>
                    <Button variant={v} force={force} {...extra}>
                      {v === 'danger' ? 'Clear history' : 'Check it'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className="mb-3 font-extrabold">Sizes</p>
            <div className="flex flex-wrap items-end gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="md" icon={<Play className="size-4" strokeWidth={3} />}>
                With icon
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-3 font-extrabold">Icon buttons</p>
            <div className="flex flex-wrap items-end gap-5">
              {(['paper', 'ink', 'ghost'] as const).map((tone) =>
                STATES.slice(0, 4).map(([label, force, extra]) => (
                  <div key={tone + label} className="flex flex-col items-center gap-2">
                    <Label>
                      {tone} {label.toLowerCase()}
                    </Label>
                    <IconButton aria-label={`Menu (${tone}, ${label})`} tone={tone} force={force} disabled={extra.disabled}>
                      <Menu className="size-5" strokeWidth={2.75} />
                    </IconButton>
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section id="controls" title="Chips, tags and keys">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end gap-5">
            {[
              ['Default', undefined, false],
              ['Hover', 'hover', false],
              ['Focus', 'focus', false],
              ['Pressed', 'pressed', false],
              ['Active', undefined, true],
            ].map(([label, force, active]) => (
              <div key={label as string} className="flex flex-col gap-2">
                <Label>{label as string}</Label>
                <Chip force={force as Force | undefined} active={active as boolean}>
                  Everything
                </Chip>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <Label>Disabled</Label>
              <Chip disabled>Audio</Chip>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Tag>Alerts</Tag>
            <Tag tone="ink">High risk</Tag>
            <Tag tone="butter">Second look</Tag>
            <Kbd>Ctrl</Kbd>
            <Kbd>V</Kbd>
          </div>
          <div className="flex flex-wrap items-end gap-8">
            <Stat label="Risk score" value={42} />
            <Stat label="Checks" value={8} />
            <span className="round inline-flex h-8 items-center rounded-full border-2 border-ink bg-ok px-3 text-[0.75rem] font-extrabold text-white">Nothing obvious</span>
            <span className="round inline-flex h-8 items-center rounded-full border-2 border-ink bg-butter px-3 text-[0.75rem] font-extrabold">Second look</span>
            <span className="round inline-flex h-8 items-center rounded-full border-2 border-ink bg-alert px-3 text-[0.75rem] font-extrabold text-white">High risk</span>
          </div>
        </div>
      </Section>

      <Section id="fields" title="Fields">
        <div className="grid gap-6 md:grid-cols-3">
          <TextField label="Default" placeholder="https://example.com" />
          <TextField label="Hover" placeholder="https://example.com" force="hover" />
          <TextField label="Focus" defaultValue="https://bbc.co.uk" force="focus" />
          <TextField label="Error" defaultValue="juno@" error="Enter a valid email address." />
          <TextField label="Disabled" defaultValue="Locked" disabled />
          <TextField label="With hint" hint="Bare addresses work too." placeholder="example.com" />
          <TextArea label="Text area" placeholder="Paste the message here" />
          <ChoiceGroup
            label="Choice group"
            name="sg-kind"
            options={[
              { id: 'sms', label: 'Text message' },
              { id: 'email', label: 'Email' },
              { id: 'link', label: 'Link' },
            ]}
            value={choice}
            onChange={setChoice}
          />
          <ChoiceGroup
            label="Choice group, error"
            name="sg-kind-2"
            options={[
              { id: 'a', label: 'Text message' },
              { id: 'b', label: 'Email' },
            ]}
            value=""
            onChange={() => {}}
            error="Pick what it was."
          />
        </div>
        <div className="mt-6">
          <Button type="button" loading icon={<Send className="size-4" />}>
            Sending
          </Button>
        </div>
      </Section>

      <Section id="doodles" title="Doodles">
        <div className="flex flex-col gap-8">
          <div>
            <p className="mb-3 font-extrabold">Wordmark and mark</p>
            <Frame className="grid place-items-center gap-6 rounded-[var(--radius-lg)] border-[3px] py-8">
              <Eyes size={120} />
              <Wordmark as="div" className="text-center text-[5rem]" />
            </Frame>
          </div>
          <div>
            <p className="mb-3 font-extrabold">Glyphs</p>
            <div className="flex flex-wrap gap-7">
              {glyphNames.map((g) => (
                <div key={g} className="flex flex-col items-center gap-1">
                  <Glyph name={g} size={46} />
                  <Label>{g}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-8 pt-2">
            <Bubble>urgent!</Bubble>
            <Bubble tail="center">verify now</Bubble>
            <Bubble tail="right">do not click</Bubble>
          </div>
        </div>
      </Section>

      <Section id="cards" title="Cards">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label>Note card</Label>
            <NoteCard note={notes.posts[0]} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Note card, hover</Label>
            <NoteCard note={notes.posts[1]} force="hover" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Card</Label>
            <Card className="p-5">
              <Glyph name="shield" size={48} />
              <p className="mt-3 font-display text-[1.5rem] leading-none font-black">Plain card</p>
              <p className="mt-2 text-graphite">Ink outline, offset shadow.</p>
            </Card>
          </div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border-[2.5px] border-ink bg-card p-5" aria-label="Loading card">
            <Label>Loading</Label>
            <Skeleton className="aspect-[3/2]" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </Section>

      <Section id="feedback" title="Empty and error states">
        <div className="grid gap-6 md:grid-cols-2">
          <EmptyState title="Nothing checked yet" action={<Button size="sm">Check a link</Button>}>
            Anything you check is remembered only in this browser.
          </EmptyState>
          <div className="flex flex-col justify-center gap-3 rounded-[var(--radius-lg)] border-[2.5px] border-alert bg-card p-6">
            <p className="font-display text-[1.75rem] leading-none font-black text-alert">Could not send</p>
            <p role="note" className="text-[0.9375rem] font-bold text-alert">
              Could not reach the server. Check your connection and try again.
            </p>
          </div>
        </div>
      </Section>

      <Section id="overlays" title="Overlays">
        <div className="flex flex-wrap gap-4">
          <Button variant="paper" onClick={() => setModal(true)}>
            Open modal
          </Button>
          <Button variant="paper" onClick={() => setDrawer(true)} icon={<Menu className="size-4" strokeWidth={2.75} />}>
            Open drawer
          </Button>
        </div>
        <Modal open={modal} onClose={() => setModal(false)} title="A modal" description="Focus is trapped inside. Escape or the close button returns focus to where it was.">
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="paper" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModal(false)}>Okay</Button>
          </div>
        </Modal>
        <Drawer open={drawer} onClose={() => setDrawer(false)} title="Drawer">
          <p className="text-graphite">The mobile menu uses this drawer.</p>
          <Button className="mt-6" onClick={() => setDrawer(false)}>
            Close
          </Button>
        </Drawer>
      </Section>
    </Container>
  )
}
