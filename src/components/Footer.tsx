import { Link } from 'react-router'

import { brand, footerLinks, type GlyphName } from '../content'
import { Glyph } from './Doodle'
import { Container } from './UI'
import { Logo } from './Wordmark'

const marks: GlyphName[] = ['link', 'hook', 'shield', 'eye']

export function Footer() {
  return (
    <footer className="mt-24 border-t-[3px] border-ink bg-paper">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-graphite">{brand.short}</p>
          <div className="mt-5 flex items-end gap-3" aria-hidden="true">
            {marks.map((m) => (
              <Glyph key={m} name={m} size={30} className="text-ink-2" boil />
            ))}
          </div>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-1 sm:grid-cols-3">
          {footerLinks.map((l) => (
            <Link key={l.to} to={l.to} className="inline-flex h-10 items-center font-extrabold text-ink-2 hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
      <Container>
        <div className="flex flex-col gap-1 border-t-2 border-ink/15 py-5 text-[0.8125rem] text-graphite sm:flex-row sm:justify-between">
          <span>
            {brand.footerCredit}. The title font is Londrina Solid.
          </span>
          <span>No account, no uploads. Checks stay in your browser.</span>
        </div>
      </Container>
    </footer>
  )
}
