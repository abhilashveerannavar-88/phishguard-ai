// Every string, example and piece of seed data on the site lives here.
// The components only read from this file, so copy changes stay in one place.

export type GlyphName =
  | 'link'
  | 'envelope'
  | 'phone'
  | 'hook'
  | 'lock'
  | 'id'
  | 'coin'
  | 'flag'
  | 'magnifier'
  | 'shield'
  | 'warning'
  | 'eye'
  | 'chat'
  | 'parcel'
  | 'bank'
  | 'briefcase'
  | 'heart'
  | 'chart'
  | 'card'
  | 'users'

export const brand = {
  name: 'Side Eye',
  tagline: 'Paste a link or a message. We will point at the tricks, the pressure and the parts that do not add up.',
  short: 'A scam and phishing detector that shows its working.',
  footerCredit: 'Made for the hurried, the polite and the almost-clicked',
  footerFont: 'The title font is Londrina Solid',
}

export const nav = [
  { to: '/check', label: 'Check' },
  { to: '/guide', label: 'How it works' },
  { to: '/threats', label: 'Scam library' },
  { to: '/notes', label: 'Field notes' },
  { to: '/about', label: 'About' },
] as const

export const footerLinks = [
  { to: '/check', label: 'Check a link' },
  { to: '/check?kind=message', label: 'Check a message' },
  { to: '/guide', label: 'How it works' },
  { to: '/threats', label: 'Scam library' },
  { to: '/notes', label: 'Field notes' },
  { to: '/about', label: 'About the detector' },
  { to: '/styleguide', label: 'Style guide' },
] as const

export type Example = { id: string; label: string; kind: 'url' | 'message'; text: string }

export const examples: Example[] = [
  {
    id: 'delivery',
    label: 'Fake delivery text',
    kind: 'message',
    text: 'DHL: Your parcel is being held at our depot. A redelivery fee of £1.45 is unpaid. Pay within 24 hours or it will be returned to sender: http://dhl-redelivery-fee.top/pay?id=8842',
  },
  {
    id: 'bank-link',
    label: 'Lookalike bank link',
    kind: 'url',
    text: 'https://hsbc.co.uk.secure-verify-login.top/session',
  },
  {
    id: 'short-link',
    label: 'Shortened link',
    kind: 'url',
    text: 'https://bit.ly/3xQz9a',
  },
  {
    id: 'invoice',
    label: 'Fake invoice',
    kind: 'message',
    text: 'Hi, please find attached the invoice for last month. Our bank details have changed, so kindly transfer £2,480 today to avoid late fees. Confirm the payment to accounts@supplier-billing.co and do not tell the usual contact, she is on leave.',
  },
  {
    id: 'safe-link',
    label: 'Ordinary link',
    kind: 'url',
    text: 'https://www.bbc.co.uk/news/technology',
  },
  {
    id: 'safe-message',
    label: 'Ordinary message',
    kind: 'message',
    text: 'Hi Sam, the plumber is coming Thursday between 9 and 11. I have left the key with next door. See you then. — Mum',
  },
]

export const home = {
  kicker: 'Scam & phishing detector',
  scanTitle: 'Paste a link to check',
  scanPlaceholder: 'https://example.com/login',
  scanCta: 'Check it',
  examplesLabel: 'Or try one',
  privacy: 'Runs in your browser. Nothing you paste is uploaded or stored on a server.',
  lastCheck: 'Your last check',
  features: [
    {
      glyph: 'link' as GlyphName,
      title: 'Reads the link, not the padlock',
      body: 'Lookalike spellings, punycode, an @ in the middle, raw IP addresses, shorteners, cheap domains and installers. The lock icon proves nothing.',
    },
    {
      glyph: 'chat' as GlyphName,
      title: 'Listens for the pressure',
      body: 'Deadlines, suspension threats, requests for one-time codes, gift-card payments and prizes you never entered. The wording gives it away.',
    },
    {
      glyph: 'magnifier' as GlyphName,
      title: 'Shows its working',
      body: 'Every flag comes with the reason it fired and how much it counted. No black box, no "unsafe" with nothing behind it.',
    },
  ],
  libraryTitle: 'Know the usual tricks',
  libraryBody: 'Scams reuse the same nine shapes. Once you have seen the shape, the spelling mistake is just detail.',
  libraryCta: 'Open the scam library',
  notesTitle: 'From the field notes',
  notesCta: 'All field notes',
  ctaTitle: 'When in doubt, do not click.',
  ctaBody: 'Open the app, or type the address you already know. A real bank will never ask for a one-time code by text, and no parcel needs a gift card.',
  ctaPrimary: 'Check something',
  ctaSecondary: 'Read the guide',
}

export const scan = {
  title: 'Check something',
  intro: 'Paste a link or a whole message. Side Eye reads it the way a scam would use it. Nothing is opened, uploaded or sent anywhere.',
  tabs: { url: 'A link', message: 'A message' },
  url: { label: 'The link', placeholder: 'https://example.com/login', hint: 'Bare addresses work too. It is safe to paste it; the link is never opened.' },
  message: { label: 'The message', placeholder: 'Paste the text, including the sender and any links…', hint: 'This screen cannot read screenshots yet. Copy the text across instead.' },
  submit: 'Check it',
  examples: 'Try one',
  error: 'Paste a link or a message first.',
  errorShort: 'That is a little too short to check. Paste a bit more.',
  result: {
    score: 'Risk score',
    findings: 'What stood out',
    advice: 'What to do',
    disclaimer: 'Side Eye works from rules, not a live reputation database. It cannot prove something is safe, and a missing flag is not permission. Verify anything that asks for money, passwords or a code.',
    again: 'Check another',
  },
  history: 'Recent checks',
  historyEmpty: 'Nothing checked yet. Anything you check is remembered only in this browser.',
  clear: 'Clear',
  cleared: 'History cleared',
  tipsTitle: 'Before you click',
  tips: [
    'Open the app, or type the address you already know.',
    'A padlock only means the connection is encrypted, not that the site is honest.',
    'No real organisation asks for a one-time code by message.',
    'If it is urgent, that is the reason to slow down.',
  ],
  privacyTitle: 'Local only',
  privacyBody: 'Checks run in this tab. Your recent list is kept in this browser and holds a short label and score, not the whole message.',
  checksCount: 'rules checked',
}

export const guide = {
  title: 'How it works',
  intro: 'Four habits, one small tool. The tool is the fast part; the habits are the part that keeps you safe.',
  steps: [
    {
      title: 'Paste it, do not click it',
      body: 'Copy the whole thing: the link, the sender, the strange spelling. Side Eye never opens the link, so pasting is the safest way to look at it.',
      tip: 'Nothing leaves your browser.',
      scene: 'paste',
    },
    {
      title: 'Read the level first',
      body: 'A score under 25 means nothing familiar fired. From 25 the message is worth a second look. From 55, treat it as hostile until you have checked another way.',
      tip: 'A low score is not a guarantee.',
      scene: 'levels',
    },
    {
      title: 'Look at the flags, not just the number',
      body: 'Each flag names the trick and what it is worth. One borrowed bank name matters more than three generic worries. If you disagree with a flag, you can still act on your own reading.',
      tip: 'One strong flag beats ten weak ones.',
      scene: 'flags',
    },
    {
      title: 'Verify out of band',
      body: 'Use the app, the card in your wallet or the number on the official website. Never use the link, number or reply address inside the message that made you suspicious.',
      tip: 'The message does not get to choose how you check it.',
      scene: 'verify',
    },
  ],
  next: 'Next',
  back: 'Back',
  finish: 'Check something',
  stepLabel: (i: number, n: number) => `Step ${i} of ${n}`,
  checksTitle: 'What it checks',
  checksIntro: 'Eight families of rule, aimed at the moves that show up again and again.',
  scope: { url: 'Link', message: 'Message', both: 'Both' },
}

export type Check = { glyph: GlyphName; title: string; body: string; scope: 'url' | 'message' | 'both' }

export const checks: Check[] = [
  { glyph: 'link', title: 'Lookalike addresses', body: 'paypa1.com, micros0ft-support.net, hsbc.co.uk.verify.top. The brand is real, the domain is not.', scope: 'url' },
  { glyph: 'id', title: 'Punycode and odd characters', body: 'An "xn--" hostname can display a familiar name in another alphabet while pointing somewhere else.', scope: 'url' },
  { glyph: 'hook', title: 'Shortened and hidden links', body: 'Shorteners hide the destination. An @ in the middle hides the real host behind a friendly username.', scope: 'url' },
  { glyph: 'warning', title: 'Dangerous downloads', body: 'Links ending in .apk, .exe, .zip or .scr, and login pages buried in oddly deep folder paths.', scope: 'url' },
  { glyph: 'chat', title: 'Urgency and threats', body: '"Within 24 hours", "suspended", "final notice". Pressure is there to stop you reading twice.', scope: 'message' },
  { glyph: 'lock', title: 'Requests for secrets', body: 'Passwords, one-time codes, PINs, card numbers, seed phrases. None of these belong in a message.', scope: 'message' },
  { glyph: 'coin', title: 'Unusual payments', body: 'Gift cards, crypto, wires and "small release fees". Chosen because they are hard to trace or reverse.', scope: 'message' },
  { glyph: 'chart', title: 'Too good to be true', body: 'Prizes you did not enter, refunds you did not ask for, returns that cannot fail.', scope: 'message' },
]

export type ThreatGroup = 'account' | 'money' | 'social'

export type Threat = {
  id: string
  name: string
  kicker: string
  glyph: GlyphName
  group: ThreatGroup
  channel: string
  severity: 'Every day' | 'Common' | 'Rising'
  summary: string
  start: string
  tells: string[]
  dos: string[]
  sample?: string
}

export const threats: Threat[] = [
  {
    id: 'parcel',
    name: 'The parcel that is held',
    kicker: 'Courier text',
    glyph: 'parcel',
    group: 'account',
    channel: 'SMS and email',
    severity: 'Every day',
    summary: 'A parcel you did not order is stuck, a fee smaller than the inconvenience is due, and the link is not the courier.',
    start: 'Your parcel is waiting. A redelivery fee of £1.45 is unpaid. Pay within 24 hours or it will be returned to sender.',
    tells: ['A domain the courier does not own, often ending in .top, .info or .xyz', 'A fee small enough to feel not worth checking', 'A deadline measured in hours', 'A tracking number you never received by email'],
    dos: ['Track it in the courier app you already have', 'Type the courier address yourself', 'Pay redelivery only inside that official flow'],
    sample: 'delivery',
  },
  {
    id: 'bank',
    name: 'Your account is suspended',
    kicker: 'Bank alert',
    glyph: 'bank',
    group: 'account',
    channel: 'SMS, email and phone',
    severity: 'Every day',
    summary: 'The account is frozen until you "verify" it, and the verification page wants your password or a one-time code.',
    start: 'We detected unusual activity. Your online banking is suspended. Verify your identity within 24 hours to restore access.',
    tells: ['A link where a bank would never put one', 'A request for a one-time code, PIN or full password', 'A greeting that does not use your name', 'A threat of permanent closure'],
    dos: ['Open the banking app, or call the number on your card', 'Never share a one-time code, not even with the real bank', 'If you already did, call the bank and change the password'],
    sample: 'bank-link',
  },
  {
    id: 'tech',
    name: 'The infected computer',
    kicker: 'Tech support',
    glyph: 'warning',
    group: 'account',
    channel: 'Pop-up and phone',
    severity: 'Common',
    summary: 'A full-screen warning, a phone number, and a helpful stranger who needs remote access to fix it.',
    start: 'YOUR DEVICE IS INFECTED. Do not close this window. Call Microsoft Support immediately on 0800 000 000.',
    tells: ['A browser pop-up that pretends to scan your machine', 'A request to install AnyDesk or TeamViewer', 'Payment in gift cards or a bank transfer', 'A number that is not on the software maker’s own site'],
    dos: ['Close the tab. The pop-up cannot scan anything', 'Never give a stranger remote access', 'Run your own updates and antivirus, from settings you opened'],
  },
  {
    id: 'refund',
    name: 'The refund that needs your login',
    kicker: 'Refund call',
    glyph: 'card',
    group: 'account',
    channel: 'Phone and email',
    severity: 'Rising',
    summary: 'A refund is owed, but only after you sign in, read out a code, or "accidentally" send too much money back.',
    start: 'We have processed your refund of £84.99. To release it, log in here and confirm your card details.',
    tells: ['A refund for something you did not buy', 'A login screen reached through a message', 'An overpayment you are asked to return', 'A caller who knows a little real order history'],
    dos: ['Check the order in the shop’s own app', 'Refunds arrive the way you paid, not by link', 'Never return an overpayment; report it instead'],
  },
  {
    id: 'invoice',
    name: 'The invoice you did not order',
    kicker: 'Supplier fraud',
    glyph: 'envelope',
    group: 'money',
    channel: 'Email',
    severity: 'Common',
    summary: 'A familiar supplier, a new bank account, and a payment that needs to happen today. The reply address is the tell.',
    start: 'Please find the attached invoice. Our bank details have changed, kindly transfer the balance today to avoid late fees.',
    tells: ['Payment details that changed by email alone', 'A reply-to address on a different domain', '"Kindly" and "do not tell" in the same paragraph', 'An attachment you were not expecting'],
    dos: ['Call the supplier on the number you already hold', 'Treat bank-detail changes as fraud until confirmed by phone', 'Open invoices only from senders you can verify'],
    sample: 'invoice',
  },
  {
    id: 'prize',
    name: 'You have won something',
    kicker: 'Prize draw',
    glyph: 'coin',
    group: 'money',
    channel: 'SMS, email and social',
    severity: 'Common',
    summary: 'A prize from a draw you do not remember entering, released after a small fee or a card number.',
    start: 'Congratulations! You have been selected to receive a £500 gift card. Claim your reward within 24 hours.',
    tells: ['You did not enter the draw', 'A fee, tax or delivery charge before the prize', 'Card details for "verification"', 'A countdown that resets when you reload'],
    dos: ['Delete it. Unclaimed prizes do not exist', 'Never pay to receive a prize', 'Check the brand’s own site for promotions, not the message'],
  },
  {
    id: 'crypto',
    name: 'Guaranteed returns',
    kicker: 'Investment',
    glyph: 'chart',
    group: 'money',
    channel: 'Social, WhatsApp and ads',
    severity: 'Rising',
    summary: 'A private group, a celebrity endorsement and a return that cannot fail. The withdrawal fee arrives before the profit.',
    start: 'Join our private trading group. Guaranteed 18% monthly, backed by a well-known investor. Deposit today for a 50% bonus.',
    tells: ['A fixed return, which no real investment can promise', 'A group chat that profits in screenshots', 'A deposit bonus and a withdrawal fee', 'A website that is weeks old'],
    dos: ['Check the firm on your financial regulator’s register', 'Assume any "guaranteed return" is a loss', 'Do not send crypto to someone you met online'],
  },
  {
    id: 'job',
    name: 'The job you never applied for',
    kicker: 'Job offer',
    glyph: 'briefcase',
    group: 'social',
    channel: 'Email and messaging apps',
    severity: 'Rising',
    summary: 'A recruiter found your CV, the interview is by chat, and the first task is buying equipment with their cheque.',
    start: 'Your profile stood out. The role pays £4,200 a month, no interview needed. We will send a cheque for your home office setup.',
    tells: ['An offer without a real interview', 'A cheque to buy equipment from "our supplier"', 'A training or onboarding fee', 'Bank details requested before a contract'],
    dos: ['Verify the recruiter on the company’s own site', 'Never pay to start a job', 'Be wary of cheques from strangers; they can bounce after you spend'],
  },
  {
    id: 'romance',
    name: 'The emergency',
    kicker: 'Romance',
    glyph: 'heart',
    group: 'social',
    channel: 'Dating apps and social',
    severity: 'Common',
    summary: 'Weeks of warmth, a sudden crisis, and a request for money that must stay secret.',
    start: 'I am stuck at the airport. Customs need £600 and I cannot access my account. Please do not tell anyone, I am embarrassed.',
    tells: ['A reason to never video call', 'A crisis that arrives exactly when trust does', 'Payments in crypto, gift cards or via a "friend"', 'Requests for secrecy'],
    dos: ['Stop sending money and do not send more', 'Talk to someone you trust before you decide', 'Report and block; the photos are usually stolen'],
  },
]

export const threatsPage = {
  title: 'Scam library',
  intro: 'Nine shapes, endlessly re-spelled. Read the tells once and the next one is easier to see.',
  filters: [
    { id: 'all', label: 'Everything' },
    { id: 'account', label: 'Account & access' },
    { id: 'money', label: 'Money' },
    { id: 'social', label: 'People & jobs' },
  ],
  empty: 'No scams in this drawer. Pick another filter.',
  tellsTitle: 'The tells',
  dosTitle: 'What to do',
  startTitle: 'How it opens',
  check: 'Check a message like this',
  close: 'Close',
  severity: 'How often',
  channel: 'Arrives by',
}

export type NoteTag = 'Alerts' | 'Explainers' | 'Method'

export type Note = {
  slug: string
  title: string
  date: string
  tag: NoteTag
  glyph: GlyphName
  excerpt: string
  body: Array<{ h?: string; p?: string; list?: string[] }>
}

export const notes: { title: string; intro: string; all: string; empty: string; back: string; readMore: string; next: string; posts: Note[] } = {
  title: 'Field notes',
  intro: 'Short, practical notes on what scams look like this month, and why the tricks keep working.',
  all: 'Everything',
  empty: 'Nothing filed under that tag yet.',
  back: 'All notes',
  readMore: 'Read note',
  next: 'Next note',
  posts: [
    {
      slug: 'parcel-fee-wave',
      title: 'A wave of fake parcel fees, in three details',
      date: '2026-11-12',
      tag: 'Alerts',
      glyph: 'parcel',
      excerpt: 'The amounts are tiny, the domains are new, and the tracking numbers are borrowed from real couriers.',
      body: [
        { p: 'The current run of delivery texts is unusually well made. The courier logo is right, the copy is clean, and the fee is £1.45, which is less than the inconvenience of arguing. Three details give it away.' },
        { h: 'The domain is not the courier’s' },
        { p: 'The link reads something like dhl-redelivery-fee.top. The courier’s name is at the front because that is the part people read. The domain, the bit immediately before the first single slash, belongs to whoever registered a £2 name this week.' },
        { h: 'The deadline is hours, not days' },
        { p: 'Real depots hold parcels for days. A countdown exists to stop you checking the sender, opening the app, or asking someone else.' },
        { h: 'The fee is the wrong size' },
        { p: 'A fee small enough to dismiss is chosen to get a card number. The charge that follows is rarely £1.45.' },
        { p: 'If a parcel is really waiting, the courier app will know. Open it, or type the address yourself. Never pay from the text.' },
      ],
    },
    {
      slug: 'the-at-sign',
      title: 'The @ in the middle of a link',
      date: '2026-11-06',
      tag: 'Explainers',
      glyph: 'hook',
      excerpt: 'Everything before the @ is a username. Everything after it is where you actually go.',
      body: [
        { p: 'A browser reads https://paypal.com@evil.example/login as a single address with a username and a host. The username is "paypal.com". The host is "evil.example". The page you land on belongs to the second one.' },
        { h: 'Why it looks convincing' },
        { p: 'On a narrow phone screen the beginning of a long link is all you see. The @ survives a copy and paste, and the reassuring word is right there in the part you read.' },
        { list: ['The host starts after the last @ in the authority.', 'A username in a URL is almost never legitimate.', 'Browsers may hide the whole thing behind a shortened display, so tap the address bar and read it.'] },
        { p: 'If you paste a link containing @ into Side Eye, it flags the userinfo trick immediately. If you are looking at a link by hand, delete everything up to and including the @ and ask yourself where the rest points.' },
      ],
    },
    {
      slug: 'urgency-is-the-tell',
      title: 'Why "urgent" is the tell',
      date: '2026-10-21',
      tag: 'Explainers',
      glyph: 'chat',
      excerpt: 'Scams are not trying to fool your judgement. They are trying to get in front of it.',
      body: [
        { p: 'A scam message rarely survives a calm read. So it does not ask for a calm read. The deadline, the suspension, the "final notice" and the countdown all do the same job: they make acting feel safer than thinking.' },
        { h: 'The two-part structure' },
        { p: 'Almost every one has a threat and a remedy. Something bad is about to happen, and here is the one link that stops it. Once you see the shape, you can name it in the moment.' },
        { list: ['Your account will be closed — verify here.', 'Your parcel will be returned — pay here.', 'Your device is infected — call this number.'] },
        { p: 'The remedy always requires something the real organisation would never ask for in a message: a password, a code, a card, a payment, remote access, or silence.' },
        { p: 'The rule that survives every version: if it is urgent, that is the reason to slow down. Open the app yourself. The real thing will still be there in ten minutes.' },
      ],
    },
    {
      slug: 'punycode-for-normal-people',
      title: 'Punycode, explained with a fake bank',
      date: '2026-10-02',
      tag: 'Method',
      glyph: 'id',
      excerpt: 'Some letters look identical in two alphabets. Domains have a way of telling you, if you know where to look.',
      body: [
        { p: 'Domain names are limited to a small set of characters, so international names are encoded into an ASCII form that starts with xn--. A Cyrillic "а" and a Latin "a" can look the same on screen while being different characters.' },
        { h: 'What it looks like' },
        { p: 'An address such as xn--pypal-4ve.com may display as "раураl.com" in the browser, using Cyrillic letters. Every letter is wrong and every letter looks right.' },
        { p: 'Browsers are better at showing the decoded form, which is exactly why the encoded form in a copied link is a useful warning. If a link you were sent contains xn-- and claims to be a bank, stop.' },
        { h: 'The boring defence' },
        { p: 'Do not judge a domain by how it looks in a message. Type the address you know, use a bookmark, or open the app. Then the alphabet cannot be used against you.' },
      ],
    },
    {
      slug: 'what-this-cannot-see',
      title: 'What this tool cannot see',
      date: '2026-09-18',
      tag: 'Method',
      glyph: 'eye',
      excerpt: 'A clean result means the usual patterns did not fire. It does not mean the page is honest.',
      body: [
        { p: 'Side Eye is a set of rules running on the text you paste. That makes it fast, private and explainable. It also makes it blind to several things that matter.' },
        { list: ['Whether the site is newly registered, reported or hosting malware right now.', 'What a shortened link opens into. The destination is only revealed by visiting it, which this tool never does.', 'Whether an email address was really sent by the person named in it.', 'Whether the page copies a real login screen perfectly.'] },
        { h: 'So what is the score for?' },
        { p: 'It is a second pair of eyes on the parts that are cheap to check and expensive to miss: the domain, the spelling, the pressure, the request. A high score is a strong reason to stop. A low score is a reason to keep your habits.' },
        { p: 'If a message asks for money, a password or a code, verify it through a channel you chose. That rule beats any score, including ours.' },
      ],
    },
  ],
}

export const about = {
  title: 'About the detector',
  intro: 'Side Eye is a small, local-first tool for the moment before you click. No account, no uploads, no black box.',
  descriptionTitle: 'What it is',
  description: [
    'Side Eye reads links and messages against a set of rules drawn from the tricks that show up again and again: borrowed brand names, lookalike spellings, hidden destinations, deadlines, threats, requests for codes and payments that cannot be reversed.',
    'It runs entirely in your browser. Nothing you paste is sent to a server, logged or used to train anything. The only thing kept is a short recent list in this browser’s storage, which you can clear at any time.',
  ],
  factsTitle: 'Fact sheet',
  facts: [
    { k: 'Built for', v: 'The moment before you click' },
    { k: 'Runs', v: 'Entirely in your browser' },
    { k: 'Data', v: 'Nothing pasted is uploaded' },
    { k: 'Accounts', v: 'None' },
    { k: 'Covers', v: 'Links and message text' },
    { k: 'Cost', v: 'Free, no sign-up' },
  ],
  methodTitle: 'How the score works',
  method: [
    'Each rule that fires adds a weight, from 3 for a mild style note to 38 for an @ that hides the real host. The weights add up to a score out of 100.',
    'Under 25 is "Nothing obvious": no strong pattern matched. From 25 it is "Worth a second look". From 55 it is "High risk", which is where borrowed brands, requests for secrets and hidden destinations land.',
    'The score is a summary, not the evidence. Read the flags: one strong flag is worth more than several weak ones, and your own knowledge of the sender matters more than both.',
  ],
  featuresTitle: 'Built to be checked',
  features: [
    'Every flag names the rule it came from and what it counted',
    'No link is ever opened, requested or previewed',
    'No account, no tracking pixels, no server-side history',
    'Works offline once the page has loaded',
    'Copy-paste friendly, including bare domains',
  ],
  limitsTitle: 'What it cannot do',
  limits: [
    'It cannot prove a link is safe. A new phishing site with a clean-looking domain will score low.',
    'It cannot see where a shortened link goes without visiting it, which it will not do.',
    'It cannot verify who really sent an email. Display names and reply addresses are easy to forge.',
    'It cannot read screenshots. Paste the text instead.',
  ],
  reportTitle: 'Send us a scam',
  reportBody: 'Got one that slipped through? Send the text and what it pretended to be. Reports are read by hand; this demo build returns a reference number and does not store the message.',
  form: {
    name: 'Your name',
    email: 'Email',
    kind: 'What was it',
    kinds: [
      { id: 'sms', label: 'Text message' },
      { id: 'email', label: 'Email' },
      { id: 'link', label: 'Link' },
      { id: 'other', label: 'Other' },
    ],
    message: 'The message, minus anything personal',
    messageHint: 'Remove your name, account numbers and addresses. At least 20 characters.',
    submit: 'Send report',
    sending: 'Sending',
    success: (ref: string) => `Thank you. Your reference is ${ref}. If this pattern is new to us it will turn up in the field notes.`,
    another: 'Send another',
    networkError: 'Could not reach the server. Check your connection and try again.',
    error: 'Check the highlighted fields.',
  },
  contactTitle: 'Contact',
  contact: [
    { k: 'Reports', v: 'reports@example.com' },
    { k: 'Everything else', v: 'hello@example.com' },
  ],
}

export const notFound = {
  title: 'Nothing here but a dead link',
  body: 'This address led nowhere. Fitting, really. Check the address, or check a link that found you.',
  home: 'Back to the start',
  check: 'Check a link',
}
