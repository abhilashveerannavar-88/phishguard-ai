import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

import type { Note } from '../content'
import { formatDate } from '../lib/format'
import { Glyph } from './Doodle'
import { Card, Tag } from './UI'

export function NoteCard({ note, force }: { note: Note; force?: 'hover' }) {
  return (
    <Card interactive force={force} className="group flex h-full flex-col overflow-hidden">
      <div className="relative grid h-36 place-items-center border-b-[2.5px] border-ink bg-paper-2/60">
        <Glyph name={note.glyph} size={78} boil />
        <span className="absolute top-3 right-3 text-graphite opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
          <ArrowUpRight className="size-5" strokeWidth={2.75} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-[0.8125rem] text-graphite">
          <Tag>{note.tag}</Tag>
          <time dateTime={note.date}>{formatDate(note.date)}</time>
        </div>
        <h3 className="mt-3 font-display text-[1.625rem] leading-[1.02] font-black">
          <Link
            to={`/notes/${note.slug}`}
            className="inline-flex min-h-10 items-center after:absolute after:inset-0 focus:outline-none after:rounded-[var(--radius-lg)] focus-visible:after:outline-3 focus-visible:after:outline-offset-3 focus-visible:after:outline-ink"
          >
            {note.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 leading-relaxed text-graphite">{note.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-extrabold">
          Read note <ArrowRight className="size-3.5" strokeWidth={3} />
        </span>
      </div>
    </Card>
  )
}
