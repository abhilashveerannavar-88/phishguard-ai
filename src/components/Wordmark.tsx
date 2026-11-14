import { cx } from '../lib/cx'
import { Eyes } from './Doodle'

/** The stacked logotype: SIDE over EYE, with a small flag on the last letter. */
export function Wordmark({ className, as: As = 'h1' }: { className?: string; as?: 'h1' | 'div' }) {
  return (
    <As aria-label="Side Eye" className={cx('font-display leading-[0.8] font-black tracking-[-0.01em] text-ink select-none', className)}>
      <span aria-hidden="true" className="relative block">
        SIDE
      </span>
      <span aria-hidden="true" className="relative block">
        EYE
        <svg viewBox="0 0 28 34" className="absolute -top-[0.08em] left-[calc(100%+0.04em)] h-[0.62em] w-auto text-alert" aria-hidden="true">
          <path d="M3 32V2" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M4 4c5-2.6 8 2.4 14 0l5-2.2v13l-5 2.2c-6 2.4-9-2.6-14 0z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </span>
    </As>
  )
}

/** Small horizontal mark for the header and footer: the side-eye stare and the name. */
export function Logo({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'white' }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <Eyes size={38} blink={false} className={tone === 'white' ? 'text-white [--eye-ink:#f3f2ee] [--eye-white:#111]' : undefined} />
      <span className={cx('font-display text-[1.375rem] leading-none font-black', tone === 'white' ? 'text-white' : 'text-ink')}>Side Eye</span>
    </span>
  )
}
