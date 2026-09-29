/**
 * Runtime verification.
 *
 * Drives a real Chrome over CDP against a served build and asserts the things a
 * static build and a linter cannot: that every route renders, that metadata
 * actually changes per route, that the reveal animations resolve, and that the
 * page degrades to the static shell when scripting is unavailable or the
 * bundle fails to load.
 *
 * Usage:
 *   node scripts/verify.mjs [baseUrl]
 *
 * Requires Node 22.4+ for the global WebSocket and a Chrome at CHROME_PATH
 * (defaults to the macOS path, overridable by env).
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = process.argv[2] ?? 'http://localhost:4173'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Preflight. Without this the script spends its whole budget waiting for a
// page that was never going to load, and reports a wall of unrelated failures.
try {
  const response = await fetch(BASE, { signal: AbortSignal.timeout(5000) })
  if (!response.ok) {
    console.error(`${BASE} answered ${response.status}. Is the preview server running?`)
    process.exit(2)
  }
} catch (error) {
  console.error(`Cannot reach ${BASE}: ${error.message}`)
  console.error('Start one with: npm run build && npm run preview')
  process.exit(2)
}

/* -------------------------------------------------------------------------- */
/* Chrome + CDP plumbing                                                      */
/* -------------------------------------------------------------------------- */

const profile = mkdtempSync(join(tmpdir(), 'cdp-verify-'))
const port = 10100 + Math.floor(Math.random() * 400)

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    // GitHub Actions runs as root, where Chromium's sandbox refuses to start.
    // Locally the sandbox stays on.
    ...(process.env.CI ? ['--no-sandbox'] : []),
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

async function pageTarget() {
  for (let i = 0; i < 100; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch {
      /* devtools not up yet */
    }
    await sleep(150)
  }
  throw new Error('Chrome did not expose a devtools endpoint')
}

const ws = new WebSocket(await pageTarget())
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true })
  ws.addEventListener('error', rej, { once: true })
})

let msgId = 0
const pending = new Map()
const events = []

ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.method) events.push(m)
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id)
    pending.delete(m.id)
    if (m.error) reject(new Error(JSON.stringify(m.error)))
    else resolve(m.result)
  }
})

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++msgId
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })

async function evaluate(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', {
    // Async IIFE so a snippet can await, for example to walk the page and let
    // a few frames pass between scrolls.
    expression: `(async () => { ${expression} })()`,
    returnByValue: true,
    awaitPromise: true,
  })
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
  }
  return result.value
}

function resetEvents() {
  events.length = 0
}

function drain() {
  const errors = []
  for (const e of events) {
    if (e.method === 'Runtime.exceptionThrown') {
      errors.push(e.params.exceptionDetails.exception?.description ?? e.params.exceptionDetails.text)
    }
    if (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') {
      errors.push(e.params.args.map((a) => a.value ?? a.description).join(' '))
    }
    if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') {
      errors.push(e.params.entry.text)
    }
  }
  return errors
}

await send('Page.enable')
await send('Runtime.enable')
await send('Log.enable')
await send('Network.enable')

async function visit(path, { width = 1280, height = 900, wait = 1400 } = {}) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 700,
  })
  resetEvents()
  await send('Page.navigate', { url: BASE + path })
  // Poll for the app shell rather than sleeping a fixed amount, so a slow
  // machine does not produce a false failure.
  for (let i = 0; i < 60; i++) {
    await sleep(120)
    const ready = await evaluate(
      `return document.getElementById('root')?.querySelector('#main') != null`,
    ).catch(() => false)
    if (ready) break
  }
  await sleep(wait)
  return drain()
}

/* -------------------------------------------------------------------------- */
/* Assertions                                                                 */
/* -------------------------------------------------------------------------- */

let failures = 0
let checks = 0

function check(label, ok, detail = '') {
  checks += 1
  if (ok) {
    console.log(`  PASS  ${label}`)
  } else {
    failures += 1
    console.log(`  FAIL  ${label}${detail ? ` -> ${detail}` : ''}`)
  }
}

function section(title) {
  console.log(`\n${title}`)
}

/* -------------------------------------------------------------------------- */
/* 1. Every route renders, with its own metadata                              */
/* -------------------------------------------------------------------------- */

const ROUTES = [
  { path: '/', expectTitle: /Niraj Chaudhari/, heading: 'Niraj Chaudhari' },
  // A resume is headed with the candidate's name, as a printed one is.
  { path: '/resume', expectTitle: /Resume/i, heading: /Niraj Chaudhari|Resume/i },
  { path: '/projects/varun-beverages', expectTitle: /Varun Beverages/i, heading: /Varun Beverages/i },
  { path: '/projects/loan-default', expectTitle: /Loan Default/i, heading: /Loan Default/i },
  { path: '/projects/jubilant-foodworks', expectTitle: /Jubilant Foodworks/i, heading: /Jubilant Foodworks/i },
  { path: '/this-route-does-not-exist', expectTitle: /not found|404/i, heading: /isn.t here|not found|404/i },
]

section('1. Routes render, and each carries its own title, description and canonical')
const seenCanonicals = new Set()
const seenTitles = new Set()
const seenDescriptions = new Set()

for (const route of ROUTES) {
  const errors = await visit(route.path)
  const info = await evaluate(`
    const meta = (sel) => document.querySelector(sel)?.getAttribute('content') ?? null
    const link = (rel) => document.querySelector('link[rel="' + rel + '"]')?.getAttribute('href') ?? null
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: link('canonical'),
      ogUrl: meta('meta[property="og:url"]'),
      ogTitle: meta('meta[property="og:title"]'),
      robots: meta('meta[name="robots"]'),
      heading: document.querySelector('h1')?.textContent?.trim() ?? null,
      h1Count: document.querySelectorAll('h1').length,
      skippedHeadings: (() => {
        const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) =>
          Number(h.tagName[1]),
        )
        const skips = []
        for (let i = 1; i < levels.length; i++) {
          if (levels[i] - levels[i - 1] > 1) {
            skips.push('h' + levels[i - 1] + ' to h' + levels[i])
          }
        }
        return skips
      })(),
      bodyText: document.body.innerText.trim().length,
    }
  `)

  check(`${route.path} renders content`, info.bodyText > 400, `${info.bodyText} chars of text`)
  check(
    `${route.path} title matches`,
    route.expectTitle.test(info.title ?? ''),
    JSON.stringify(info.title),
  )
  check(
    `${route.path} has an h1`,
    new RegExp(route.heading, 'i').test(info.heading ?? ''),
    JSON.stringify(info.heading),
  )
  check(`${route.path} has exactly one h1`, info.h1Count === 1, `found ${info.h1Count}`)
  check(
    `${route.path} heading levels never skip`,
    info.skippedHeadings.length === 0,
    info.skippedHeadings.join(', '),
  )
  check(`${route.path} has a description`, Boolean(info.description), 'missing')
  check(`${route.path} has a canonical`, Boolean(info.canonical), 'missing')
  check(
    `${route.path} og:url is absolute`,
    /^https?:\/\//.test(info.ogUrl ?? ''),
    info.ogUrl ?? 'missing',
  )
  check(`${route.path} no console errors`, errors.length === 0, errors.join(' | '))

  seenTitles.add(info.title)
  seenDescriptions.add(info.description)
  seenCanonicals.add(info.canonical ?? 'none')
}

check(
  'every route has a distinct title',
  seenTitles.size === ROUTES.length,
  `${seenTitles.size} of ${ROUTES.length}`,
)
check(
  'every route has a distinct description',
  seenDescriptions.size === ROUTES.length,
  `${seenDescriptions.size} of ${ROUTES.length}`,
)
check(
  'every route has a distinct canonical',
  seenCanonicals.size === ROUTES.length,
  `${seenCanonicals.size} of ${ROUTES.length}`,
)

/* -------------------------------------------------------------------------- */
/* 2. The 404 route is excluded from indexing                                  */
/* -------------------------------------------------------------------------- */

section('2. The 404 route asks robots not to index it')
await visit('/this-route-does-not-exist')
const robots = await evaluate(
  `return document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? ''`,
)
check('404 sends noindex', /noindex/.test(robots), JSON.stringify(robots))

/* -------------------------------------------------------------------------- */
/* 3. Reveal animations resolve to visible                                    */
/* -------------------------------------------------------------------------- */

section('3. Scroll-reveal elements end up visible')
await visit('/')
// Walk down the page rather than jumping, so content is revealed the way a
// reader reveals it. A single scrollTo leaves sections that were skipped over
// legitimately un-revealed, which would be the test measuring itself.
//
// A timer is used between steps rather than requestAnimationFrame: rAF does
// not reliably fire in a headless browser with no compositor, and awaiting one
// there hangs. The step count is capped so a page that somehow reports a
// growing scrollHeight cannot spin forever.
const scrolled = await evaluate(`
  document.documentElement.style.scrollBehavior = 'auto'
  const step = Math.round(window.innerHeight * 0.7)
  const frame = () => new Promise((r) => setTimeout(r, 16))
  let y = 0
  let iterations = 0
  while (y < document.body.scrollHeight && iterations < 200) {
    y = Math.min(y + step, document.body.scrollHeight)
    window.scrollTo(0, y)
    await frame()
    iterations += 1
  }
  window.scrollTo(0, document.body.scrollHeight)
  await frame()
  return { scrollY: window.scrollY, iterations }
`)
await sleep(1200)
const reveals = await evaluate(`
  const els = [...document.querySelectorAll('.reveal')]
  const hidden = els.filter((el) => getComputedStyle(el).opacity !== '1')
  return {
    total: els.length,
    hidden: hidden.length,
    atBottom: Math.abs(window.scrollY + window.innerHeight - document.body.scrollHeight) < 4,
    sample: hidden.slice(0, 3).map((el) => (el.textContent || '').trim().slice(0, 40)),
  }
`)
check('the page actually scrolled to the end', reveals.atBottom, `scrollY ${scrolled.scrollY} in ${scrolled.iterations} steps`)
check('reveal elements exist', reveals.total > 0, String(reveals.total))
check(
  'no reveal is stuck invisible',
  reveals.hidden === 0,
  `${reveals.hidden} hidden: ${reveals.sample.join(' | ')}`,
)

/* -------------------------------------------------------------------------- */
/* 4. The header offset token matches the rendered header                      */
/* -------------------------------------------------------------------------- */

section('4. --header-h matches the real header height')
for (const width of [375, 768, 1280]) {
  await visit('/', { width })
  const header = await evaluate(`
    const el = document.querySelector('header')
    if (!el) return null
    const token = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))
    const height = el.getBoundingClientRect().height
    const links = [...el.querySelectorAll('a')]
    const tooSmall = links.filter((a) => {
      const r = a.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && r.height < 32
    }).map((a) => (a.textContent || '').trim().slice(0, 18))
    return { tokenPx: token * 16, height, tooSmall }
  `)
  if (!header) {
    check(`header found at ${width}px`, false)
    continue
  }
  check(
    `${width}px --header-h (${header.tokenPx}px) matches header (${header.height}px)`,
    Math.abs(header.tokenPx - header.height) <= 1,
    `token ${header.tokenPx} vs actual ${header.height}`,
  )
  check(
    `${width}px header links are at least 32px tall`,
    header.tooSmall.length === 0,
    header.tooSmall.join(', '),
  )
}

/* -------------------------------------------------------------------------- */
/* 5. Every data table is described                                            */
/* -------------------------------------------------------------------------- */

section('5. Data tables carry a caption')
for (const path of ['/projects/varun-beverages', '/projects/jubilant-foodworks', '/resume']) {
  await visit(path)
  const tables = await evaluate(`
    const els = [...document.querySelectorAll('table')]
    return {
      total: els.length,
      uncaptioned: els.filter((t) => !t.querySelector('caption') && !t.getAttribute('aria-label') && !t.getAttribute('aria-labelledby')).length,
    }
  `)
  if (tables.total === 0) {
    console.log(`  skip  ${path} has no tables`)
    continue
  }
  check(
    `${path}: all ${tables.total} tables are described`,
    tables.uncaptioned === 0,
    `${tables.uncaptioned} without a caption or label`,
  )
}

/* -------------------------------------------------------------------------- */
/* 6. The page degrades to the static shell                                   */
/* -------------------------------------------------------------------------- */

section('6. Without scripting, the static shell is what a reader sees')
await send('Emulation.setScriptExecutionDisabled', { value: true })
resetEvents()
await send('Page.navigate', { url: BASE + '/' })
await sleep(1200)
const noJs = await evaluate(`
  const t = document.body.innerText.replace(/\\s+/g, ' ').trim()
  return {
    length: t.length,
    heading: document.querySelector('h1')?.textContent?.trim() ?? null,
    projectLinks: document.querySelectorAll('a[href^="/projects/"]').length,
    email: !!document.querySelector('a[href^="mailto:"]'),
    resume: !!document.querySelector('a[href$=".pdf"]'),
  }
`)
check('no-JS page has real text', noJs.length > 300, `${noJs.length} chars`)
check('no-JS page shows the name', /Niraj Chaudhari/.test(noJs.heading ?? ''), JSON.stringify(noJs.heading))
check('no-JS page links to all three case studies', noJs.projectLinks === 3, String(noJs.projectLinks))
check('no-JS page offers email and resume', noJs.email && noJs.resume)
await send('Emulation.setScriptExecutionDisabled', { value: false })

section('7. If the bundle never loads, the shell is still there')
await send('Network.setBlockedURLs', { urls: ['*/assets/*.js', '*/src/main.jsx'] })
resetEvents()
await send('Page.navigate', { url: BASE + '/' })
await sleep(1500)
const brokenBundle = await evaluate(`
  const t = document.body.innerText.replace(/\\s+/g, ' ').trim()
  return { length: t.length, heading: document.querySelector('h1')?.textContent?.trim() ?? null }
`)
check('blocked bundle still shows content', brokenBundle.length > 300, `${brokenBundle.length} chars`)
check(
  'blocked bundle still shows the name',
  /Niraj Chaudhari/.test(brokenBundle.heading ?? ''),
  JSON.stringify(brokenBundle.heading),
)
await send('Network.setBlockedURLs', { urls: [] })

/* -------------------------------------------------------------------------- */
/* 8. The hero picture picks a modern format                                   */
/* -------------------------------------------------------------------------- */

section('8. The hero serves WebP at an appropriate width')
await visit('/')
const hero = await evaluate(`
  const img = document.querySelector('picture img')
  if (!img) return null
  return {
    currentSrc: img.currentSrc,
    webp: /\\.webp$/.test(img.currentSrc),
    renderedWidth: Math.round(img.getBoundingClientRect().width),
    naturalWidth: img.naturalWidth,
    srcset: img.getAttribute('srcset'),
  }
`)
if (!hero) {
  check('hero image found', false)
} else {
  check('hero uses WebP', hero.webp, hero.currentSrc)
  check('hero declares a srcset', Boolean(hero.srcset), 'missing')
  check(
    'hero served no more than ~2x its rendered width',
    hero.naturalWidth <= hero.renderedWidth * 2 + 32,
    `natural ${hero.naturalWidth}px vs rendered ${hero.renderedWidth}px`,
  )
}

/* -------------------------------------------------------------------------- */

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'}  ${checks - failures}/${checks} checks passed`)

ws.close()
chrome.kill()
try {
  rmSync(profile, { recursive: true, force: true })
} catch {
  /* ignore */
}
process.exit(failures === 0 ? 0 : 1)
