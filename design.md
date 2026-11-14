# Side Eye — design notes

A design reference for this build: the visual language, the tokens behind it,
the components, and the rules for extending it without breaking the sketchbook
feel.

Side Eye is a scam and phishing detector. The design has to do two jobs that
pull in opposite directions: make a security tool feel calm enough to use, and
make a bad result impossible to miss.

---

## 1. Personality

**A suspicious friend with a pencil, not a security dashboard.**

- Hand-drawn lines and warm paper instead of dark chrome, neon greens and
  terminal type.
- Plain words. "Worth a second look", not "Medium severity indicator".
- The interface shows its working. Every flag is a sentence you could argue
  with.
- The comedy is dry and small: a fish hook, a raised eyebrow, "urgent!" in a
  speech bubble. It never jokes about the user getting scammed.

The product name is the gesture: give the message the side eye. The mark is two
eyes looking right. That is the whole mascot.

---

## 2. Principles

1. **Paper first.** If a screen looks like it could be printed on a sheet of
   warm paper with a thick pen, it is on brand.
2. **Ink outlines, offset shadows.** Depth comes from a hard ink shadow, never
   from a soft grey blur. Cards sit on the page like stickers.
3. **One accent per job.** Butter yellow is caution. Alert red is danger. Green
   is confirmation. Never use them decoratively.
4. **Every state has a shape.** Hover lifts, press sinks into its shadow, focus
   is a thick ink ring. No invisible affordances.
5. **The score is a summary; the flags are the evidence.** Layout always puts
   the reasons within reach of the number.
6. **Honest limits.** The UI says what the tool cannot see. Do not add a fake
   "verified safe" state.

---

## 3. Identity

| Element | Rule |
| --- | --- |
| Name | **Side Eye**, always two words, title case in prose, `Side Eye` in the wordmark |
| Wordmark | Stacked `SIDE` / `EYE` in Londrina Solid 900, `leading-[0.8]`, tracking `-0.01em`, with a small alert-red flag after `EYE` |
| Mark | Two ink-outlined eyes, pupils offset to the right. `Eyes` in `src/components/Doodle.tsx` |
| Blink | The pupils blink on a long loop in the hero; the header logo does not blink |
| Tone words | suspicious, second look, flags, local, hand-drawn, pressure |
| Avoid | shields as the only metaphor, padlocks promising safety, "100% safe" |

The wordmark is set as real text, not an image, so it stays sharp and
selectable. It is decorative for assistive tech (`aria-label="Side Eye"` on the
container, letters hidden).

---

## 4. Colour

Defined as `@theme` tokens in `src/styles.css`, consumed as Tailwind utilities
(`bg-paper`, `text-graphite`, `border-ink`).

| Token | Hex | Use |
| --- | --- | --- |
| `page` | `#ffffff` | Page behind the frame |
| `paper` | `#f3f2ee` | Frame, sketch background, footer |
| `paper-2` | `#e9e7e1` | Hover fill, skeleton base |
| `card` | `#fbfaf7` | Cards, bubbles, inputs |
| `ink` | `#111111` | Lines, primary text, primary buttons |
| `ink-2` | `#2b2a28` | Dense body text |
| `graphite` | `#5f5e5a` | Secondary text (AA on paper) |
| `pencil` | `#8d8b85` | Placeholders, dashed rules (non-text) |
| `smudge` | `#d6d4ce` | Grey fills |
| `shadow` | `#c9c7c0` | Ground shadow under doodles |
| `butter` | `#f1e7a6` | Caution fill, tip tags, selection |
| `alert` | `#a3261b` | High risk, errors, the flag in the wordmark |
| `ok` | `#2f6b34` | Low risk, confirmations |

Rules:

- Text is ink or a grey. Never set body text in butter (it fails contrast).
- Butter and alert are allowed as text only inside a dark-on-colour badge or
  icon, never as long copy.
- Risk colour is always paired with a word ("High risk") and an icon. Colour is
  never the only signal.
- The dark CTA section uses `bg-ink` with white text and `text-white/80` for
  body copy.

### Risk semantics

| Level | Score | Fill | Badge | Icon |
| --- | --- | --- | --- | --- |
| `low` | 0–24 | `bg-ok` | white on green | `Check` |
| `caution` | 25–54 | `bg-butter` | ink on butter | `TriangleAlert` |
| `high` | 55–100 | `bg-alert` | white on red | `ShieldAlert` |

The verdict area also gets a very light wash (`#e8efe4`, `#f6f0d2`, `#f6e6e3`)
so the whole block reads as one state.

---

## 5. Typography

Two families, loaded from Google Fonts in `index.html`.

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
| Display | **Londrina Solid** | 400, 900 | Wordmark, page titles, card titles, numbers, section headings. Tall, hand-painted, slightly irregular |
| Sans | **Nunito** | 400–900 | Everything else. Body at 600, labels at 800, buttons at 900 |

Display scale used in code:

| Name | Classes | Where |
| --- | --- | --- |
| Hero | `text-[6rem]` → `md:text-[9.5rem]` | Home wordmark |
| Page title | `text-[3.25rem]` → `md:text-[5rem]` | `PageHeader` |
| Section | `text-[2.25rem]` → `md:text-[2.75rem]` | `SectionTitle` |
| Card title | `text-[1.5rem]`–`text-[1.875rem]`, `leading-none` | Cards |
| Score | `text-[3.5rem]`, `tabular-nums` | Verdict |

Body: 16px base, `leading-relaxed` for paragraphs, secondary copy in graphite.
Labels are `text-[0.75rem]`/`0.875rem` and extra-bold, never uppercase-tracked
except where a sentence already reads as a label.

Numbers always use `tabular-nums`.

---

## 6. Layout

- **Container:** `max-w-[1240px]`, gutters `16 / 24 / 32px` (base / sm / lg).
  The home frame container widens to `1320px`.
- **Header:** 72px tall, logo left, nav centre-right, CTA right.
- **Page rhythm:** sections are separated by `mt-24`; page headers use
  `mb-10 md:mb-14`.
- **Page gutters:** every page starts with `PageHeader` inside `Container`.
- **Two-column pages:** `lg:grid-cols-[minmax(0,1fr)_320px]` for the checker
  (content + rail), `lg:grid-cols-[320px_1fr]` for About (sticky facts).
- **Grids:** 3-up features, 2/3-up notes, 3-up scams, 4-up checks.
- **Sticky rails** only on `lg` and up (`lg:sticky lg:top-6 lg:self-start`).

### The frame

The home hero is a `Frame`: `paper-grain` background, 4px ink border,
`--radius-frame` (34px), `overflow-hidden`, with decorative doodles positioned
absolutely and hidden progressively on small screens. Content sits in a
`relative z-10` column.

---

## 7. Shape and elevation

**Everything is a squircle.** Base layer sets `corner-shape: squircle` on all
elements, then `.round` opts back to true circles for pills, avatars and eyes.
Browsers without `corner-shape` fall back to normal rounded corners, which is
acceptable.

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 10px | Chips inside cards, small fills |
| `--radius-md` | 16px | Inputs, finding rows, mini cards |
| `--radius-lg` | 24px | Cards, modals, frames in content |
| `--radius-frame` | 34px | Home hero, big sections |
| pill | 999px + `.round` | Buttons, tags, chips |

Shadows are hard and offset, in ink:

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-offset` | `0 5px 0 0 #111` | Cards, primary buttons |
| `--shadow-offset-sm` | `0 3px 0 0 #111` | Inputs at rest, icon buttons |
| `--shadow-soft` | soft drop | Rare, for layered art only |

Interactive cards lift to `0 9px 0 ink` on hover. Pressed buttons travel down
4px and lose the shadow. Nothing uses a blurred grey drop shadow.

---

## 8. Iconography and doodles

Two icon sources, one hand:

1. **Lucide** for functional UI icons (search, trash, arrows, status icons).
   Stroke width `2.5–3` to match the ink line.
2. **Sketch glyphs** in `src/components/Doodle.tsx` for concepts: `link`,
   `envelope`, `phone`, `hook`, `lock`, `id`, `coin`, `flag`, `magnifier`,
   `shield`, `warning`, `eye`, `chat`, `parcel`, `bank`, `briefcase`, `heart`,
   `chart`, `card`, `users`.

Glyph rules:

- Drawn in a 64×64 viewBox, 3px stroke, round caps and joins.
- Fill comes from `--glyph-fill` (default white). On ink sections set
  `[--glyph-fill:transparent]` so the line stays white and the shape hollow.
- The `.rough` filter applies an SVG turbulence displacement for a hand-drawn
  wobble. `.boil` cycles three seeds at 0.5s steps. Large display glyphs boil;
  tiny ones in dense lists usually do not.
- `Bubble` is a bordered speech bubble with an optional left/centre/right tail,
  used for short scam lines and captions, never for paragraphs.
- `Eyes` is the mark: two almond outlines, white fill, pupils offset right, with
  a slow blink that stops under reduced motion.

---

## 9. Motion

| Token | Value |
| --- | --- |
| `--duration-fast` | 120ms — buttons, chips |
| `--duration-base` | 220ms — cards, hovers |
| `--duration-slow` | 600ms — image/content transitions |
| `--ease-squish` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--ease-out-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` |

Named animations: `waddle`, `bob`, `blink`, `fall-in`, `pop`, `boil`,
`shadow-pulse`, plus the tutorial scene keyframes (`tut-drop`, `tut-grow`,
`tut-slide`).

Rules:

- Page transitions are a 200ms fade plus 8px rise (`motion/react`,
  `AnimatePresence` keyed on pathname).
- Modals spring in from above with a slight rotation, drawers slide from the
  right.
- Decorative loops are slow (3.4s+) and low-amplitude.
- `prefers-reduced-motion` switches off all loops, the boil and smooth
  scrolling, and shortens transitions to 0.01ms. This is set globally in
  `styles.css` and through `MotionConfig reducedMotion="user"`.

---

## 10. Components

### Button (`src/components/Button.tsx`)

- Pill, 2.5px ink border, 900 Nunito, offset ink shadow.
- Variants: `ink` (primary), `paper` (secondary), `ghost` (tertiary, no border),
  `danger` (alert border and shadow, used for destructive confirmation).
- Sizes: `sm` 40px, `md` 48px, `lg` 52px.
- States: hover lifts 2px and deepens the shadow; press sinks 4px; focus is a
  3px ink outline with 3px offset; disabled drops to 45% and loses its shadow;
  loading swaps the icon for a spinner and sets `aria-busy`.
- `data-force="hover|focus|pressed"` pins a state for the style guide.

### Chips and tags

- `Chip`: toggle for filters. Inactive paper, active ink with white text,
  `aria-pressed`. 40px tall.
- `Tag`: non-interactive label, 28px tall, `paper` / `ink` / `butter` tones.

### Cards

`Card` is `bg-card`, 2.5px ink border, `--radius-lg`, `--shadow-offset`.
`interactive` adds the lift. Content padding is usually `p-5`/`p-6`/`p-7`.
Cards are used for content blocks, never for page structure.

### Fields (`src/components/Field.tsx`)

- 2.5px ink border, 16px radius, white fill, 48px tall (textarea starts 112px).
- Hover gets the small offset shadow; focus gets an ink outline.
- Invalid state switches the border to alert and adds an alert shadow, plus a
  message announced through `aria-describedby`.
- `ChoiceGroup` renders radios as chips (hidden input + peer styles).

### Overlays (`src/components/Overlay.tsx`)

- `Modal`: bottom sheet on mobile, centred card at `sm`, ink border, 8px ink
  shadow, paper grain. Focus is trapped, Escape closes, scroll locks, focus
  returns to the trigger.
- `Drawer`: right-side panel for the mobile menu, same trap.

### Verdict, meter and findings (`src/pages/Check.tsx`)

- **Verdict card:** wash header with level badge, prose summary, big score, then
  the meter, then the target in graphite.
- **Meter:** 20px track, 2.5px ink border, filled in the level colour, ticks at
  25 and 55, labels `0 / 25 · second look / 55 · high risk / 100`.
- **Finding row:** icon disc coloured by tone (`bad`, `warn`, `info`, `good`),
  title, explanation, and a `+weight` pill for anything above zero.
- The result block is `aria-live="polite"` and scrolled into view after a
  manual check.

### Note and threat cards

Both use `Card interactive` with a 144–160px doodle plate on `paper`/white,
a tag or severity badge, a display title that stretches a link over the card
(`after:absolute after:inset-0`), body copy, and a small "read" affordance.

---

## 11. Page blueprints

### `/` Home

1. Hero frame: kicker tag, eyes, stacked wordmark, tagline, link box, example
   buttons, privacy line, last-check pill; doodles hidden on mobile.
2. Three feature cards with glyphs.
3. Scam library strip: paper panel, copy + CTA left, six glyph tiles right.
4. Field notes: heading + link, three note cards.
5. Ink CTA: hollow white glyph row, big line, buttons.

### `/check`

- Page header, then `[content | 320px rail]`.
- Content: scanner card (mode chips, labelled field, submit, examples row),
  then the verdict or, before the first check, the three-band legend.
- Rail: recent checks (clearable), "Before you click", local-only card.
- Examples and `?q=` / `?sample=` deep links run immediately, without scrolling.

### `/guide`

- Stepper: illustrated frame left, step card right with dots and Back/Next.
- Four steps: paste, read the level, read the flags, verify out of band.
- Below: eight rule-family cards with scope tags.

### `/threats`

- Header with count, filter chips, 3-up grid.
- Modal: doodle plate with severity and channel, summary, "How it opens" quote,
  tells with alert icons, dos with check icons, CTA into the checker.

### `/notes`

- Tag chips, 3-up note cards, article page with doodle banner, prose body,
  "Next note", CTA.

### `/about`

- Sticky rail: fact sheet, contact, no-tracking note.
- Main: what it is, what you get, how the score works (three bands), limits in
  an alert-bordered callout, scam report form.

### `/styleguide`

Every token and state rendered by the real components, with `data-force` pinned
states. Use it before adding a component.

### 404

Frame, tangled link doodle, huge `404`, copy that stays in voice, two ways out.

---

## 12. Responsive behaviour

Breakpoints are Tailwind defaults; the design leans on `md` (768) and `lg`
(1024).

- Navigation collapses to a drawer below `md`; the header CTA appears at `lg`.
- Hero doodles appear at `md`, with the outer ones only at `lg`.
- Hero wordmark scales `6rem → 8rem → 9.5rem`.
- Two-column pages stack below `lg`; rails become normal cards underneath.
- Page titles drop from 80px to 52px on small screens.
- The hero scan field stacks its button below `sm`.
- Tap targets are at least 40px, usually 44–48px.

---

## 13. Accessibility

- Skip link to `#main`; every page starts with one `h1`.
- Focus visible everywhere: 3px ink outline, 3px offset. Custom components
  replicate it rather than removing it.
- Icons are `aria-hidden` unless they carry meaning; icon-only buttons have
  labels.
- Colour is never the only indicator: risk always has an icon and a word.
- Score meter has adjacent text labels; finding weights are printed, not just
  bars.
- Results announce through `aria-live="polite"`; the step counter in the guide
  does too.
- Validation errors are tied with `aria-describedby` and `aria-invalid`.
- Modals and drawers trap focus, close on Escape and restore focus.
- Text on paper meets AA with ink/graphite; do not use pencil for copy.
- Reduced motion is respected globally.

---

## 14. Voice and content

- Short sentences. Concrete nouns. British spelling ("organisation", "colour").
- Explain the trick, not the technology: "Everything before the @ is only a
  username."
- Never blame the reader. "Scam text is written to sound normal at speed."
- Give the next action in the imperative: "Open the app, or type the address
  you already know."
- Numbers are specific and small: £1.45, 24 hours, +34.
- The tool admits its limits in the same voice it celebrates a clean result.
- No exclamation marks in UI copy except inside quoted scam text.

Scan result copy ladder:

| Level | Label | Summary shape |
| --- | --- | --- |
| low | Nothing obvious | "None of the usual patterns fired. That is a good sign, not a guarantee." |
| caution | Worth a second look | "Nothing conclusive, but N things do not add up." |
| high | High risk | "N serious flags… Treat this as hostile until you have checked it another way." |

---

## 15. Do and do not

**Do**

- Use `Card`, `Chip`, `Tag`, `PageHeader`, `Glyph` before inventing new shells.
- Add new rules as findings with a reason and a weight, not as a bare boolean.
- Keep new doodles on the 64×64 grid with a 3px stroke.
- Test dark sections with `[--glyph-fill:transparent]`.
- Add states to the style guide when you add a component.

**Do not**

- Introduce a second accent colour or a gradient background.
- Use soft blurred shadows or glassmorphism.
- Set butter text on white, or alert text on ink.
- Make a green "safe" badge that implies verification.
- Add an icon-only button without a label, or a modal without a focus trap.
- Animate anything that runs longer than a few seconds or moves more than a few
  pixels.

---

## 16. File map

| File | What lives there |
| --- | --- |
| `src/styles.css` | Tokens, base layer, squircle rule, `paper-grain`, prose styles, reduced motion |
| `src/content.ts` | All copy, examples, scam shapes, notes, facts, glyph names |
| `src/lib/analyze.ts` | Detection rules, weights, score bands, advice |
| `src/lib/history.ts` | Last checks in `localStorage`, `useSyncExternalStore` |
| `src/components/Doodle.tsx` | Wobble filters, glyph library, eyes, bubble |
| `src/components/Wordmark.tsx` | Stacked wordmark and small logo |
| `src/components/Button.tsx` | Button/link variants, icon button, pinned states |
| `src/components/UI.tsx` | Frame, Card, Chip, Tag, Kbd, Stat, PageHeader, SectionTitle, Container, EmptyState, Skeleton |
| `src/components/Field.tsx` | Text field, textarea, chip radio group |
| `src/components/Overlay.tsx` | Modal, drawer, focus trap |
| `src/components/Header.tsx` / `Footer.tsx` | Navigation shell |
| `src/pages/*` | Page blueprints above |
| `src/worker/index.ts` | Static assets plus `POST /api/report` validation |

---

## 17. Constraints worth knowing

- Londrina Solid is distinctive but condensed: long titles should be tested at
  small widths before shipping.
- `corner-shape: squircle` is progressive enhancement; layouts must not depend
  on it.
- The boil filter is SVG-based and can be expensive on large elements; keep it
  to glyphs under ~160px.
- The checker is heuristic. Any visual language that implies certainty ("Safe",
  "Verified", "Clean bill of health") is out of scope for this product.
- No analytics, no cookies, no account surfaces. The design should never
  suggest a profile or a settings page that does not exist.
