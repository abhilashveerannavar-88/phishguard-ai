import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { ButtonLink } from '../components/Button'
import { Glyph } from '../components/Doodle'
import { NoteCard } from '../components/NoteCard'
import { Chip, Container, EmptyState, Frame, PageHeader, Tag } from '../components/UI'
import { notes, type NoteTag } from '../content'
import { formatDate } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { NotFound } from './NotFound'

const TAGS: Array<NoteTag | 'All'> = ['All', 'Alerts', 'Explainers', 'Method']

export function NotesIndex() {
  useDocumentTitle(notes.title)
  const [tag, setTag] = useState<(typeof TAGS)[number]>('All')
  const posts = notes.posts.filter((p) => tag === 'All' || p.tag === tag)
  return (
    <Container>
      <PageHeader title={notes.title} intro={notes.intro} />
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter notes">
        {TAGS.map((t) => (
          <Chip key={t} active={tag === t} onClick={() => setTag(t)}>
            {t === 'All' ? notes.all : t}
          </Chip>
        ))}
      </div>
      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <NoteCard key={p.slug} note={p} />
          ))}
        </div>
      ) : (
        <EmptyState title={notes.empty} />
      )}
    </Container>
  )
}

export function NotePage() {
  const { slug } = useParams()
  const post = notes.posts.find((p) => p.slug === slug)
  useDocumentTitle(post?.title ?? 'Not found')
  if (!post) return <NotFound />
  const i = notes.posts.indexOf(post)
  const next = notes.posts[(i + 1) % notes.posts.length]
  return (
    <Container className="max-w-[860px]">
      <Link to="/notes" className="ink-link mb-8 inline-flex h-10 items-center gap-1.5 font-extrabold">
        <ArrowLeft className="size-4" strokeWidth={3} /> {notes.back}
      </Link>
      <article>
        <div className="flex items-center gap-3 text-[0.875rem] text-graphite">
          <Tag>{post.tag}</Tag>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h1 className="mt-4 font-display text-[3rem] leading-[0.95] font-black md:text-[4.25rem]">{post.title}</h1>
        <p className="mt-4 text-[1.1875rem] leading-relaxed text-graphite">{post.excerpt}</p>

        <Frame className="mt-8 grid place-items-center rounded-[var(--radius-lg)] border-[3px] py-10">
          <Glyph name={post.glyph} size={104} boil />
        </Frame>

        <div className="prose-doodle mt-10 text-[1.0625rem] text-ink-2">
          {post.body.map((b, n) =>
            b.h ? (
              <h2 key={n}>{b.h}</h2>
            ) : b.list ? (
              <ul key={n}>
                {b.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            ) : (
              <p key={n}>{b.p}</p>
            ),
          )}
        </div>
      </article>

      <div className="mt-14 flex flex-col items-start gap-3 border-t-2 border-ink/15 pt-8">
        <span className="text-[0.875rem] font-extrabold text-graphite">{notes.next}</span>
        <Link to={`/notes/${next.slug}`} className="font-display text-[2rem] leading-none font-black hover:underline">
          {next.title}
        </Link>
        <ButtonLink to="/check" variant="paper" className="mt-4">
          Check something
        </ButtonLink>
      </div>
    </Container>
  )
}
