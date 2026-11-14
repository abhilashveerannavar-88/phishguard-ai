/*
  The detector. Pure functions, no network calls: every finding is a rule that
  fires on the text you paste. Scores are a rough sum of the weight of the
  rules that fired, capped at 100. Rules are deliberately conservative and
  every one explains itself, because a red badge with no reason is just noise.
*/

export type Kind = 'url' | 'message'
export type Tone = 'bad' | 'warn' | 'info' | 'good'
export type Level = 'low' | 'caution' | 'high'

export type Finding = {
  id: string
  tone: Tone
  title: string
  detail: string
  weight: number
}

export type Result = {
  kind: Kind
  target: string
  score: number
  level: Level
  label: string
  summary: string
  findings: Finding[]
  advice: string[]
  urls: number
}

const MULTI_SUFFIX = [
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'co.nz', 'com.au', 'net.au', 'co.za',
  'com.br', 'com.mx', 'co.in', 'com.sg', 'com.tr', 'com.hk', 'co.il', 'com.cn',
  'co.jp', 'com.ar', 'com.pl', 'com.ua',
]

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly', 'cutt.ly', 'rb.gy',
  'tiny.cc', 'shorturl.at', 'buff.ly', 'rebrand.ly', 't.ly', 's.id', 'v.gd',
])

const RISKY_TLDS = new Set([
  'zip', 'mov', 'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'xyz', 'click', 'link',
  'work', 'support', 'rest', 'cam', 'sbs', 'buzz', 'icu', 'monster', 'quest',
  'cfd', 'cyou', 'lol', 'autos', 'bond', 'beauty', 'makeup',
])

const CHEAP_TLDS = new Set(['info', 'biz', 'online', 'site', 'live', 'shop', 'store', 'website'])

const TRUSTED = new Set([
  'google.com', 'youtube.com', 'github.com', 'wikipedia.org', 'microsoft.com',
  'apple.com', 'amazon.com', 'amazon.co.uk', 'bbc.co.uk', 'gov.uk', 'irs.gov',
  'nytimes.com', 'cloudflare.com', 'mozilla.org', 'stripe.com', 'netflix.com',
  'paypal.com', 'linkedin.com', 'instagram.com', 'facebook.com', 'x.com',
  'office.com', 'live.com', 'icloud.com', 'signal.org', 'whatsapp.com',
  'stackoverflow.com', 'developer.mozilla.org', 'python.org', 'nodejs.org',
])

// Brand → domains it actually uses. Anything that names the brand on another
// registrable domain is the classic phishing move.
const BRANDS: Array<{ name: string; label: string; domains: string[] }> = [
  { name: 'paypal', label: 'PayPal', domains: ['paypal.com', 'paypal.me'] },
  { name: 'apple', label: 'Apple', domains: ['apple.com', 'icloud.com'] },
  { name: 'microsoft', label: 'Microsoft', domains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com'] },
  { name: 'google', label: 'Google', domains: ['google.com', 'gmail.com', 'youtube.com', 'google.co.uk'] },
  { name: 'amazon', label: 'Amazon', domains: ['amazon.com', 'amazon.co.uk', 'amazon.de'] },
  { name: 'netflix', label: 'Netflix', domains: ['netflix.com'] },
  { name: 'facebook', label: 'Facebook', domains: ['facebook.com', 'fb.com'] },
  { name: 'instagram', label: 'Instagram', domains: ['instagram.com'] },
  { name: 'whatsapp', label: 'WhatsApp', domains: ['whatsapp.com'] },
  { name: 'linkedin', label: 'LinkedIn', domains: ['linkedin.com'] },
  { name: 'coinbase', label: 'Coinbase', domains: ['coinbase.com'] },
  { name: 'binance', label: 'Binance', domains: ['binance.com'] },
  { name: 'steam', label: 'Steam', domains: ['steampowered.com', 'steamcommunity.com'] },
  { name: 'dhl', label: 'DHL', domains: ['dhl.com', 'dhl.co.uk', 'dhl.de'] },
  { name: 'fedex', label: 'FedEx', domains: ['fedex.com'] },
  { name: 'ups', label: 'UPS', domains: ['ups.com'] },
  { name: 'usps', label: 'USPS', domains: ['usps.com'] },
  { name: 'royalmail', label: 'Royal Mail', domains: ['royalmail.com'] },
  { name: 'hmrc', label: 'HMRC', domains: ['gov.uk'] },
  { name: 'irs', label: 'IRS', domains: ['irs.gov'] },
  { name: 'hsbc', label: 'HSBC', domains: ['hsbc.com', 'hsbc.co.uk'] },
  { name: 'barclays', label: 'Barclays', domains: ['barclays.co.uk', 'barclays.com'] },
  { name: 'natwest', label: 'NatWest', domains: ['natwest.com'] },
  { name: 'lloyds', label: 'Lloyds', domains: ['lloydsbank.com'] },
  { name: 'chase', label: 'Chase', domains: ['chase.com'] },
  { name: 'wellsfargo', label: 'Wells Fargo', domains: ['wellsfargo.com'] },
  { name: 'stripe', label: 'Stripe', domains: ['stripe.com'] },
  { name: 'dropbox', label: 'Dropbox', domains: ['dropbox.com'] },
]

const SWAPS: Record<string, string> = {
  a: '[a4@]', b: '[b8]', e: '[e3]', g: '[g96]', i: '[il1!]', l: '[il1]',
  o: '[o0]', s: '[s5$]', t: '[t7]', v: '[v\\\\/]', z: '[z2]',
}

function fuzzy(word: string) {
  const body = word
    .split('')
    .map((c) => SWAPS[c] ?? c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('')
  return new RegExp(`(^|[^a-z0-9])${body}([^a-z0-9]|$)`, 'i')
}

function registrable(host: string) {
  const labels = host.split('.').filter(Boolean)
  if (labels.length <= 2) return host
  const last2 = labels.slice(-2).join('.')
  if (MULTI_SUFFIX.includes(last2)) return labels.slice(-3).join('.')
  return labels.slice(-2).join('.')
}

function isIp(host: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':')
}

function clip(value: string, n = 64) {
  const s = value.replace(/\s+/g, ' ').trim()
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

const LEVELS: Record<Level, { label: string; tone: Tone; advice: string[] }> = {
  low: {
    label: 'Nothing obvious',
    tone: 'good',
    advice: [
      'Open it the way you normally would, not through the message.',
      'If it asks for a password or a payment, type the site address yourself before signing in.',
      'A clean score is a starting point, not a guarantee.',
    ],
  },
  caution: {
    label: 'Worth a second look',
    tone: 'warn',
    advice: [
      'Do not use the link or the phone number in the message.',
      'Open the official app or type the address you already know.',
      'Ask someone else to read it. Scam text is written to sound normal at speed.',
    ],
  },
  high: {
    label: 'High risk',
    tone: 'bad',
    advice: [
      'Do not click, reply, call or pay anything in this message.',
      'If it claims to be your bank, courier or a service you use, contact them through their own app or a number from their website.',
      'If you already entered a password or a one-time code, change that password and call the organisation now.',
    ],
  },
}

function finish(kind: Kind, target: string, findings: Finding[], urls = 0): Result {
  const order: Record<Tone, number> = { bad: 0, warn: 1, info: 2, good: 3 }
  const sorted = [...findings].sort((a, b) => order[a.tone] - order[b.tone] || b.weight - a.weight)
  const score = Math.min(100, sorted.reduce((sum, f) => sum + Math.max(0, f.weight), 0))
  const level: Level = score >= 55 ? 'high' : score >= 25 ? 'caution' : 'low'
  const bad = sorted.filter((f) => f.tone === 'bad').length
  const warn = sorted.filter((f) => f.tone === 'warn').length
  const summary =
    level === 'high'
      ? `${bad || 1} serious ${bad === 1 ? 'flag' : 'flags'} and ${warn} smaller ${warn === 1 ? 'one' : 'ones'}. Treat this as hostile until you have checked it another way.`
      : level === 'caution'
        ? `Nothing conclusive, but ${bad + warn} ${bad + warn === 1 ? 'thing does' : 'things do'} not add up. Verify before you act on it.`
        : 'None of the usual patterns fired. That is a good sign, not a guarantee. Check who sent it and what it wants.'
  return {
    kind,
    target: clip(target, 70),
    score,
    level,
    label: LEVELS[level].label,
    summary,
    findings: sorted,
    advice: LEVELS[level].advice,
    urls,
  }
}

/* ---------------------------------- links --------------------------------- */

export function analyzeUrl(input: string): Result {
  const raw = input.trim().replace(/^[<("'[]+|[>)"'\]]+$/g, '')
  const findings: Finding[] = []
  const add = (id: string, tone: Tone, title: string, detail: string, weight: number) =>
    findings.push({ id, tone, title, detail, weight })

  let url: URL | null = null
  try {
    const scheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : raw.startsWith('//') ? `https:${raw}` : `https://${raw}`
    url = new URL(scheme)
  } catch {
    url = null
  }

  if (!url || (!url.hostname.includes('.') && !isIp(url.hostname))) {
    add(
      'invalid',
      'bad',
      'This is not a readable web address',
      'There is no usable domain in what you pasted. If it arrived in a message, that alone is a reason not to trust it.',
      40,
    )
    return finish('url', raw || 'Empty link', findings)
  }

  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  const domain = registrable(host)
  const labels = host.split('.').filter(Boolean)
  const subdomains = Math.max(0, labels.length - domain.split('.').length)
  const afterDomain = `${url.pathname}${url.search}${url.hash}`.toLowerCase()
  const target = `${host}${url.pathname === '/' ? '' : url.pathname}`

  // The inbox tricks: how the address is put together.
  if (url.username || url.password) {
    add(
      'userinfo',
      'bad',
      'The real destination hides after an @',
      'Everything before the @ is only a username. Browsers ignore it and go to whatever comes after it, which is rarely what the start of the link says.',
      55,
    )
  }
  if (host.includes('xn--')) {
    add(
      'punycode',
      'bad',
      'This domain uses lookalike characters',
      'The "xn--" prefix means the address is encoded in a way that can display letters from another alphabet. It can render as a familiar brand while pointing somewhere else.',
      48,
    )
  }
  if (isIp(host)) {
    add(
      'ip',
      'bad',
      'A raw address instead of a name',
      'Legitimate services publish a name, like bank.com. Links that go straight to an IP address are usually hosting a throwaway page.',
      30,
    )
  }
  if (RISKY_TLDS.has(domain.split('.').pop() ?? '')) {
    add(
      'tld',
      'warn',
      `Cheap or abused ending (.${domain.split('.').pop()})`,
      'This ending is popular for short-lived scam sites because it is cheap and lightly policed. It is not proof on its own, but it raises the stakes.',
      15,
    )
  } else if (CHEAP_TLDS.has(domain.split('.').pop() ?? '')) {
    add(
      'tld-cheap',
      'info',
      `Generic ending (.${domain.split('.').pop()})`,
      'Generic endings are used by real businesses too. Only worth noticing when the rest of the address is odd as well.',
      4,
    )
  }
  if (SHORTENERS.has(domain)) {
    add(
      'shortener',
      'warn',
      'The link is shortened',
      'A shortener hides the destination until the moment you arrive. There is no good reason for an official message to hide where it goes.',
      26,
    )
  }
  if (subdomains >= 3) {
    add(
      'subdomains',
      'warn',
      `${subdomains} subdomains before the real domain`,
      'Long chains of words before the domain are used to push a trusted-looking word into the part of the address people actually read.',
      12,
    )
  } else if (subdomains === 2) {
    add('subdomains-2', 'info', 'A busy subdomain', 'Two subdomains is common, but check the domain just before the first single slash.', 3)
  }

  const hyphenCount = (host.match(/-/g) ?? []).length
  if (hyphenCount >= 2) {
    add(
      'hyphens',
      'warn',
      'A domain stitched together with hyphens',
      'Names like secure-login-verify are built from words that reassure you. Real companies rarely need three of them in a hostname.',
      10,
    )
  }
  if (host.length > 40) {
    add('long-host', 'warn', 'An unusually long hostname', 'Length is used to bury the real domain in the middle of a reassuring sentence.', 7)
  }
  if ((host.replace(/\./g, '').match(/\d/g) ?? []).length >= 4) {
    add('digits', 'info', 'Lots of digits in the hostname', 'Often a throwaway domain. Compare it carefully with the real address.', 5)
  }

  // Brand impersonation.
  const brandOnPath = BRANDS.find((b) => fuzzy(b.name).test(url.pathname.toLowerCase()))
  let knownBrand = false
  for (const brand of BRANDS) {
    if (fuzzy(brand.name).test(host)) {
      if (brand.domains.includes(domain)) {
        knownBrand = true
      } else {
        add(
          `brand-${brand.name}`,
          'bad',
          `It borrows the ${brand.label} name`,
          `The address mentions ${brand.label} but the domain it actually belongs to is "${domain}", not ${brand.domains[0]}. This is the standard impersonation trick.`,
          34,
        )
      }
    }
  }
  if (!knownBrand && brandOnPath && !BRANDS.some((b) => b.domains.includes(domain))) {
    add(
      'brand-path',
      'warn',
      `A brand name in the folder path`,
      `The words "${brandOnPath.label}" appear after the domain, not in it. The domain is still "${domain}", and the brand does not control it.`,
      12,
    )
  }
  if (TRUSTED.has(domain)) {
    add('trusted', 'good', 'A domain we recognise', `"${domain}" is on the short list of well-known addresses this tool knows. The page itself can still be a copy; the address is not the trick here.`, 0)
  }

  // How it is served.
  if (url.protocol === 'http:') {
    add(
      'http',
      'warn',
      'No encryption (http)',
      'Anything typed on this page travels in the clear. A login form on http should never be trusted, whoever owns the site.',
      12,
    )
  } else if (url.protocol === 'https:') {
    add('https', 'good', 'The connection is encrypted', 'The padlock only means nobody can read the traffic in transit. It says nothing about who owns the site.', 0)
  }
  if (url.port && url.port !== '80' && url.port !== '443') {
    add('port', 'warn', `An unusual port (:${url.port})`, 'Normal websites live on 80 or 443. Another port suggests a private server or a temporary setup.', 9)
  }

  // What the page is likely to do.
  const loginWords = ['login', 'signin', 'sign-in', 'verify', 'verification', 'secure', 'account', 'update', 'confirm', 'banking', 'password', 'billing', 'invoice', 'wallet', 'refund', 'unlock', 'recovery', 'authorise', 'authorize', 'payment', 'webscr']
  const hits = loginWords.filter((w) => `${host}${afterDomain}`.includes(w))
  if (hits.length) {
    add(
      'login-words',
      'warn',
      'Built to look like a sign-in page',
      `The address contains ${hits.slice(0, 3).map((w) => `"${w}"`).join(', ')}. Those words are cheap to add and expensive to fall for.`,
      9,
    )
  }
  if (/\.(apk|exe|scr|msi|bat|cmd|js|vbs|jar|hta|iso)(\?|#|$)/i.test(afterDomain) || /\.(zip|rar|7z)(\?|#|$)/i.test(afterDomain)) {
    add(
      'file',
      'bad',
      'The link downloads a file',
      'Installers and archives sent by link are how a lot of malware arrives. Download software only from the developer you meant to visit.',
      30,
    )
  }
  if (/%[0-9a-f]{2}/i.test(raw) && (raw.match(/%[0-9a-f]{2}/gi) ?? []).length >= 3) {
    add(
      'encoded',
      'warn',
      'Parts of the address are encoded',
      'Heavy percent-encoding can hide the real destination or the text shown on the page. Decode it before you trust it.',
      8,
    )
  }
  if (/[?&](url|redirect|next|continue|target|return)=/i.test(url.search)) {
    add(
      'redirect',
      'info',
      'A forwarding parameter',
      'The address carries another address inside it. After the first page, you may end up somewhere unrelated.',
      6,
    )
  }
  if (raw.length > 120) {
    add('long-url', 'info', 'A very long link', 'Long links bury the part that matters. Read the domain first, then decide if the rest is worth reading.', 4)
  }

  return finish('url', target, findings)
}

/* --------------------------------- messages -------------------------------- */

const LINK_RE = /\b(?:https?:\/\/|www\.)[^\s<>"')\]]+/gi
const BARE_RE = /\b[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,24}(?:\/[^\s<>"')\]]*)?/gi

function extractLinks(text: string) {
  // Either regex can match the same destination, so key on the address without
  // its scheme and keep the first spelling we saw.
  const found = new Map<string, string>()
  const push = (raw: string) => {
    const cleaned = raw.replace(/[.,;:!?)]+$/, '')
    if (cleaned.length < 4 || /^\d[\d.]*$/.test(cleaned)) return
    const key = cleaned.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '').toLowerCase()
    if (!key.includes('.')) return
    if (!found.has(key)) found.set(key, cleaned)
  }
  for (const m of text.matchAll(LINK_RE)) push(m[0])
  for (const m of text.matchAll(BARE_RE)) push(m[0])
  return [...found.values()].slice(0, 4)
}

function firstMatch(text: string, re: RegExp) {
  const m = text.match(re)
  return m ? clip(m[0], 56) : ''
}

export function analyzeMessage(input: string): Result {
  const text = input.trim()
  const findings: Finding[] = []
  const add = (id: string, tone: Tone, title: string, detail: string, weight: number) =>
    findings.push({ id, tone, title, detail, weight })

  const deadline = firstMatch(text, /\b(urgent(?:ly)?|immediately|right away|asap|act now|final (?:notice|warning)|last warning|within (?:the next )?\d+ (?:minutes?|hours?|days?)|expires? (?:today|tonight|soon|in \d+[^.]{0,12})|24 hours)\b/i)
  if (deadline) {
    add(
      'deadline',
      'warn',
      'It wants an answer now',
      `"${deadline}" is there to stop you checking. Real organisations give you days, not minutes.`,
      14,
    )
  }

  const threat = firstMatch(text, /\b(suspend(?:ed|ing)?|locked|deactivat(?:e|ed|ion)|terminated|restricted|unusual (?:activity|login|sign[- ]?in)|unauthori[sz]ed (?:login|access|transaction|activity)|legal action|account (?:will be )?closed|permanently blocked)\b/i)
  if (threat) {
    add(
      'threat',
      'warn',
      'It threatens your account',
      `"${threat}" is a threat, not a fact. Suspension notices win because they make people act before they think.`,
      16,
    )
  }

  const secret = firstMatch(text, /\b(passwords?|passcode|pin(?:\s*number)?|one[- ]?time (?:code|password)|otp|verification code|security code|cvv|seed phrase|recovery phrase|private key|sort code|account number|card number|national insurance|social security)\b/i)
  if (secret) {
    add(
      'secret',
      'bad',
      'It asks for something secret',
      `"${secret}" is exactly what a scam needs. No bank, courier or tax office asks for it by message, and a one-time code is the keys to your account.`,
      26,
    )
  }

  const verify = firstMatch(text, /\b(?:verify|confirm|validate|update|reactivate|unlock)\s+(?:your\s+)?(?:account|identity|details|information|payment|billing|card|password)\b/i)
  if (verify) {
    add(
      'verify',
      'warn',
      'It asks you to "verify" yourself',
      `"${verify}" is the hook. The verification page is where the password or card details get taken.`,
      18,
    )
  }

  const money = firstMatch(text, /\b(gift cards?|itunes card|google play card|steam card|amazon card|bitcoin|btc|usdt|crypto(?:currency)?|wire transfer|western union|moneygram|money order|zelle|cash app|venmo|processing fee|release fee|clearance fee|customs fee|small fee)\b/i)
  if (money) {
    add(
      'money',
      'bad',
      'An unusual way to pay',
      `"${money}" is hard to trace and hard to reverse. That is why it is asked for. No legitimate bill is settled with a gift card.`,
      22,
    )
  }

  const changedDetails = firstMatch(text, /\b(bank details? (?:have|has) changed|new bank details|updated (?:bank|payment) details|change of bank details|new account details)\b/i)
  if (changedDetails) {
    add(
      'bank-change',
      'bad',
      'Payment details changed by message',
      `"${changedDetails}" is the classic invoice fraud. A real supplier change is confirmed by phone, on a number you already had, never by email alone.`,
      28,
    )
  }

  const payRequest = firstMatch(text, /\b(?:transfer|send|pay|remit)\s+(?:us\s+|me\s+)?[£$€]?\s?\d[\d,.]*/i)
  if (payRequest) {
    add(
      'pay-request',
      'warn',
      'It asks you to send money',
      `"${payRequest}" is the whole point of the message. Slow down and confirm the request through a channel you chose.`,
      14,
    )
  }

  const prize = firstMatch(text, /\b(you(?:'ve| have) won|congratulations|you are a winner|lottery|jackpot|claim your (?:prize|reward|refund)|unclaimed (?:funds|money|prize)|guaranteed (?:returns?|profit|income)|risk[- ]free|double your (?:money|investment)|earn \$?\d[\d,]* (?:a|per|every) (?:day|week|month)|free (?:iphone|gift|money))\b/i)
  if (prize) {
    add(
      'prize',
      'warn',
      'Too good to be true',
      `"${prize}" is the reward that does not exist. If you did not enter, you did not win.`,
      16,
    )
  }

  const authority = firstMatch(text, /\b(we detected|our (?:security|fraud|compliance) team|this is (?:an? )?(?:automated|security|urgent) (?:message|alert)|microsoft support|apple support|amazon security|your bank|it department|hr department|payroll team|customs (?:office|authority)|tax (?:office|authority))\b/i)
  if (authority) {
    add(
      'authority',
      'warn',
      'It borrows an authority',
      `"${authority}" is a claim, and claims are free. The message wants you to trust the name instead of checking the sender.`,
      10,
    )
  }

  const greeting = firstMatch(text.slice(0, 140), /^(?:dear|hello|hi)\s+(?:customer|user|account holder|member|client|sir\/madam|sir or madam|valued customer)\b/i)
  if (greeting) {
    add(
      'greeting',
      'info',
      'A generic greeting',
      `"${greeting}" is not proof by itself, but a company that holds your account usually knows your name.`,
      6,
    )
  }

  const secrecy = firstMatch(text, /\b(don'?t tell|do not tell|keep (?:this|it) (?:between us|confidential|quiet)|message me on (?:whatsapp|telegram|signal)|contact me on (?:whatsapp|telegram)|text (?:me|this number)|call this number|reply (?:to this|on) (?:whatsapp|telegram))\b/i)
  if (secrecy) {
    add(
      'secrecy',
      'warn',
      'It wants privacy or a different app',
      `"${secrecy}" moves the conversation somewhere there is no record and nobody to interrupt.`,
      14,
    )
  }

  const personal = firstMatch(text, /\b(date of birth|mother'?s maiden name|first (?:pet|school)|billing address|home address|full name and address|photo of your (?:id|passport|licen[cs]e)|passport (?:number|scan)|driver'?s licen[cs]e)\b/i)
  if (personal) {
    add(
      'personal',
      'bad',
      'It harvests identity details',
      `"${personal}" is the raw material for identity theft. There is no errand that needs all of it in one reply.`,
      24,
    )
  }

  const remote = firstMatch(text, /\b(remote access|anydesk|teamviewer|screen shar(?:e|ing)|install (?:this|the) (?:app|program|software)|download (?:this|the) (?:app|attachment|file)|enable macros?)\b/i)
  if (remote) {
    add(
      'remote',
      'bad',
      'It wants access to your device',
      `"${remote}" hands over the keyboard. This is how "tech support" scams empty bank accounts live on the call.`,
      24,
    )
  }

  const kindly = /\bkindly\b/i.test(text)
  const shouty = (text.match(/\b[A-Z]{3,}\b/g) ?? []).length
  const bangs = (text.match(/!/g) ?? []).length
  if (shouty >= 3 || bangs >= 3 || (kindly && text.length < 220)) {
    add(
      'formatting',
      'info',
      'The phrasing is a little off',
      'Shouting capitals, stacks of exclamation marks and "kindly" are not crimes, but they cluster in translated scam templates.',
      4,
    )
  }

  const links = extractLinks(text)
  if (links.length) {
    const linkFindings: Array<Finding & { link: string }> = []
    for (const link of links.slice(0, 3)) {
      const r = analyzeUrl(link)
      for (const f of r.findings) {
        if (f.tone === 'bad' || f.tone === 'warn') linkFindings.push({ ...f, id: `link-${link}-${f.id}`, link })
      }
    }
    linkFindings
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .forEach(({ link, ...f }) =>
        findings.push({
          ...f,
          title: `In the link: ${f.title}`,
          detail: `${f.detail} Destination: ${clip(link, 48)}.`,
        }),
      )
    if (!linkFindings.length) {
      add('links-clean', 'info', `${links.length === 1 ? 'A link' : `${links.length} links`}, nothing obviously wrong`, 'The addresses themselves do not trip our rules. The sender and the request still matter more than the link.', 3)
    }
  } else if (/\b(click|tap)\s+(?:here|below|this link|the link)\b/i.test(text)) {
    add(
      'click-here',
      'warn',
      'It asks you to click a link that is missing',
      'The text refers to a link that is not in the message you pasted. Copy the whole message, including the link, or treat it as suspicious.',
      10,
    )
  }

  const hasBad = findings.some((f) => f.tone === 'bad' || f.tone === 'warn')
  if (!hasBad) {
    add(
      'quiet',
      'good',
      'No pressure tactics found',
      'No urgency, threats, payment demands or requests for secrets matched. Read the sender and the request once more anyway.',
      0,
    )
  }

  return finish('message', text, findings, links.length)
}

export function analyze(kind: Kind, text: string): Result {
  return kind === 'url' ? analyzeUrl(text) : analyzeMessage(text)
}
