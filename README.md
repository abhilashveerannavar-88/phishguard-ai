# Side Eye

A scam and phishing detector with a hand-drawn face. Paste a link or a whole
message and it points at the tricks: lookalike domains, hidden destinations,
deadlines, threats, requests for one-time codes and payments that cannot be
reversed. Every flag names the rule it came from, so the checker can be argued
with.

The design is the same sketchbook system as the small indie-game template this
project started from: warm paper, one ink, offset shadows, squircles and a
hand-wobbled line.

## Run it

```sh
bun install        # or: npm install
bun run dev        # http://localhost:5366 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/side_eye/index.js (Worker)
bun run typecheck
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Title screen with a live link box, what it checks, scam-library teaser, latest notes |
| `/check` | The checker: link or message, verdict, score meter, every flag, recent checks |
| `/check?q=…` | Pre-fills and runs a link |
| `/check?sample=…` | Runs one of the worked examples (see `examples` in `src/content.ts`) |
| `/guide` | Four-step method, plus the eight families of rule |
| `/threats` | Nine scam shapes with filters, a detail modal, tells and what to do |
| `/notes`, `/notes/:slug` | Field notes with tag filters |
| `/about` | Method, limits, fact sheet, scam-report form |
| `/styleguide` | Tokens and every component state ([open it](http://localhost:5366/styleguide)) |

## How detection works

`src/lib/analyze.ts` is the whole detector, and it never makes a network
request. It has two entry points, `analyzeUrl` and `analyzeMessage`, plus
`analyze(kind, text)`.

- **Links** are parsed with the URL API after adding `https://` if the scheme
  is missing. Rules cover userinfo (`paypal.com@evil.example`), punycode
  (`xn--`), raw IP hosts, brand names on domains they do not own (including
  digit/symbol lookalikes), risky and cheap endings, shorteners, deep
  subdomain chains, hyphens, digits, unusual ports, http, login-shaped paths,
  installer downloads, percent-encoding and forwarding parameters.
- **Messages** are matched against pressure, account threats, requests for
  secrets, "verify your account" hooks, gift-card/crypto/wire payments,
  too-good-to-be-true offers, borrowed authority, generic greetings, secrecy
  and off-platform moves, identity harvesting and remote-access requests.
  Any links inside the message are passed through the link analyser, and the
  worst findings are merged in.
- **Scoring**: each fired rule adds its weight (3 for a style note, up to 38
  for a hidden host). The sum is capped at 100. Under 25 is `low`, 25–54 is
  `caution`, 55+ is `high`. Positive findings weigh 0 and exist to be honest
  about what did *not* fire.

The last eight checks are kept under `side-eye:v1` in `localStorage`, as a
short label and a score — never the whole message. `src/lib/history.ts` wraps
that with `useSyncExternalStore`.

## Edit it

- `src/content.ts` holds every string, example, scam shape, note and fact.
  Start there.
- `src/styles.css` holds the tokens: paper, ink, graphite, butter, `alert` and
  `ok`, radii, offset shadows and the motion keyframes.
- `src/components/Doodle.tsx` holds the sketch glyph library as SVG paths and
  the wobble filters. `--glyph-fill` switches a glyph from paper-fill to
  transparent for dark sections.
- `src/worker/index.ts` is the Cloudflare Worker. `POST /api/report` validates
  a scam report and returns a reference. This build does not persist reports;
  wire it to your inbox, a D1 table or a ticketing service.

## Limits, stated in the product

The score is a set of rules, not a reputation database. It cannot tell you a
site is safe, cannot see where a shortened link goes, and cannot verify who
really sent an email. The About page and the result card both say so.

## Deploy with Freebuff Sites

`deploy.json` points at the build output. After `bun run build`, deploy it with
the `sites_deploy` tool from this directory.
