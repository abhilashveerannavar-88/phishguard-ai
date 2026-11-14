import type { CSSProperties, ReactNode } from 'react'

import type { GlyphName } from '../content'
import { cx } from '../lib/cx'

/** The three wobble filters that `.rough` and `.boil` point at. Render once. */
export function RoughDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        {[3, 7, 11].map((seed, i) => (
          <filter key={seed} id={`rough-${'abc'[i]}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed={seed} />
            <feDisplacementMap in="SourceGraphic" scale="2.4" />
          </filter>
        ))}
      </defs>
    </svg>
  )
}

/*
  One sketch line for every idea on the site. Shapes inherit their fill from
  --glyph-fill, so the same drawing works on paper (white fill) and on ink
  (transparent fill, white line).
*/
const GLYPHS: Record<GlyphName, ReactNode> = {
  link: (
    <>
      <path d="M27 37l10-10" />
      <path d="M23 30l-4 4a8 8 0 0011 11l5-5" />
      <path d="M41 34l4-4a8 8 0 00-11-11l-5 5" />
    </>
  ),
  envelope: (
    <>
      <rect x="7" y="17" width="50" height="34" rx="4" />
      <path d="M8 20l24 18 24-18" fill="none" />
    </>
  ),
  phone: (
    <>
      <rect x="16" y="5" width="30" height="54" rx="6" />
      <path d="M27 51h8" fill="none" />
      <path d="M25 16h22v13H38l-5 5v-5h-8z" />
    </>
  ),
  hook: (
    <>
      <path d="M30 12v27a11 11 0 0022 0v-5" fill="none" />
      <path d="M52 34v-8" fill="none" />
      <circle cx="30" cy="9" r="2.5" fill="none" />
    </>
  ),
  lock: (
    <>
      <rect x="13" y="28" width="38" height="28" rx="5" />
      <path d="M22 28v-8a10 10 0 0120 0v8" fill="none" />
      <circle cx="32" cy="41" r="3.5" fill="none" />
      <path d="M32 44v6" fill="none" />
    </>
  ),
  id: (
    <>
      <rect x="5" y="14" width="54" height="36" rx="4" />
      <circle cx="20" cy="30" r="6" fill="none" />
      <path d="M12 44c1-6 4-8 8-8s7 2 8 8" fill="none" />
      <path d="M37 26h14M37 34h14M37 42h9" fill="none" />
    </>
  ),
  coin: (
    <>
      <circle cx="32" cy="32" r="24" />
      <path d="M32 17v30" fill="none" />
      <path d="M39 23c-2-2-12-2-12 4s12 3 12 9-10 6-12 3" fill="none" />
    </>
  ),
  flag: (
    <>
      <path d="M17 57V7" fill="none" />
      <path d="M17 9c11-4 17 4 30 0v21c-13 4-19-4-30 0z" />
    </>
  ),
  magnifier: (
    <>
      <circle cx="27" cy="27" r="17" />
      <path d="M39 39l13 13" fill="none" />
      <path d="M19 27l6 6 11-12" fill="none" />
    </>
  ),
  shield: (
    <>
      <path d="M32 5l23 7v16c0 14-10 23-23 29C19 51 9 42 9 28V12z" />
      <path d="M21 31l8 8 14-16" fill="none" />
    </>
  ),
  warning: (
    <>
      <path d="M32 7L59 55H5z" />
      <path d="M32 23v15" fill="none" />
      <circle cx="32" cy="46" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  eye: (
    <>
      <path d="M3 32c8-12 18-18 29-18s21 6 29 18c-8 12-18 18-29 18S11 44 3 32z" />
      <circle cx="32" cy="32" r="9" fill="none" />
      <circle cx="36" cy="30" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  chat: (
    <>
      <path d="M6 13h52v31H30L16 56V44H6z" />
      <path d="M17 25h30M17 33h19" fill="none" />
    </>
  ),
  parcel: (
    <>
      <path d="M7 20L32 9l25 11v26L32 57 7 46z" />
      <path d="M7 20l25 11 25-11M32 31v26M19 14l25 11" fill="none" />
    </>
  ),
  bank: (
    <>
      <path d="M7 26L32 9l25 17z" />
      <path d="M14 26v22M26 26v22M38 26v22M50 26v22" fill="none" />
      <path d="M6 54h52M4 48h56" fill="none" />
    </>
  ),
  briefcase: (
    <>
      <rect x="5" y="21" width="54" height="32" rx="4" />
      <path d="M24 21v-6h16v6M5 33h54M32 31v8" fill="none" />
    </>
  ),
  heart: (
    <>
      <path d="M32 55S7 41 7 24a12 12 0 0125-6 12 12 0 0125 6c0 17-25 31-25 31z" />
      <path d="M32 20l-4 9 6 4-4 9" fill="none" />
    </>
  ),
  chart: (
    <>
      <path d="M8 55V8M8 55h48" fill="none" />
      <path d="M14 45l12-13 8 7 15-21" fill="none" />
      <path d="M41 18h9v9" fill="none" />
    </>
  ),
  card: (
    <>
      <rect x="5" y="15" width="54" height="34" rx="4" />
      <path d="M5 25h54M13 39h15" fill="none" />
    </>
  ),
  users: (
    <>
      <circle cx="24" cy="22" r="9" />
      <path d="M7 50c1-9 8-14 17-14s16 5 17 14" fill="none" />
      <circle cx="46" cy="24" r="7" />
      <path d="M42 37c8-1 14 5 15 13" fill="none" />
    </>
  ),
}

export function Glyph({
  name,
  size = 48,
  className,
  label,
  boil,
  style,
}: {
  name: GlyphName
  size?: number
  className?: string
  label?: string
  boil?: boolean
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx('overflow-visible text-ink', boil ? 'boil' : 'rough', className)}
      style={style}
    >
      <g fill="var(--glyph-fill, #fff)" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {GLYPHS[name]}
      </g>
    </svg>
  )
}

/** Two eyes looking to the side. The brand mark, and the hero's stare. */
export function Eyes({ className, size = 72, blink = true }: { className?: string; size?: number; blink?: boolean }) {
  return (
    <svg viewBox="0 0 76 36" width={size} height={(size * 36) / 76} aria-hidden="true" className={cx('text-ink', className)}>
      {[20, 56].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 17} 18c4-8 9-12 17-12s13 4 17 12c-4 8-9 12-17 12s-13-4-17-12z`} fill="var(--eye-white, #fff)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
          <g className={blink ? 'animate-blink' : undefined} style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${i * 0.4}s` }}>
            <circle cx={x + 4} cy="17" r="5.1" fill="var(--eye-ink, #111)" />
            <circle cx={x + 5.6} cy="15.4" r="1.4" fill="var(--eye-white, #fff)" />
          </g>
        </g>
      ))}
    </svg>
  )
}

/** A speech bubble with a little tail. */
export function Bubble({ children, className, tail = 'left' }: { children: ReactNode; className?: string; tail?: 'left' | 'center' | 'right' }) {
  return (
    <span className={cx('relative inline-flex min-h-7 items-center whitespace-nowrap rounded-[11px] border-2 bg-card px-2.5 text-[13px] leading-none font-bold text-ink-2 shadow-[0_2px_0_0_rgb(17_17_17/0.15)]', className)}>
      {children}
      <span
        aria-hidden="true"
        className={cx('absolute -bottom-[7px] h-3 w-3 rotate-45 border-r-2 border-b-2 bg-card', tail === 'left' && 'left-3', tail === 'center' && 'left-1/2 -ml-1.5', tail === 'right' && 'right-3')}
      />
    </span>
  )
}
