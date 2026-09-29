/**
 * Layout gate: fails on the things that break a page for a real reader.
 *
 *   node scripts/check-layout.mjs <url>
 *
 * Distinguishes a WCAG 2.2 failure from this project's own 32px comfort
 * preference, so a real problem is never buried in a list of nice-to-haves.
 * Wide tables inside an overflow-x-auto wrapper are fine and not reported.
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const url = process.argv[2] ?? 'http://localhost:4173'

const ROUTES = [
  '/',
  '/projects/varun-beverages',
  '/projects/loan-default',
  '/projects/jubilant-foodworks',
  '/resume',
  // The 404 page is a real page a reader can land on, so audit it too.
  '/this-route-does-not-exist',
]
const WIDTHS = [375, 390, 768, 1440]

const AA_TARGET_MIN = 24
const MIN_FONT_PX = 12

const AUDIT = `(() => {
  const vw = document.documentElement.clientWidth;
  const offenders = [];

  const inScrollable = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowX)) return true;
    }
    return false;
  };

  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.right <= vw + 1.5 && r.left >= -1.5) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.overflow === 'hidden') return;
    if (inScrollable(el)) return;
    offenders.push(el.tagName.toLowerCase() + ': ' + (el.textContent || '').trim().slice(0, 48));
  });

  const tooSmall = [];
  document.querySelectorAll('a[href], button').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.height >= 24) return;
    const cs = getComputedStyle(el);
    const label = (el.textContent || '').trim();
    const visuallyHidden =
      (cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath.includes('inset(50%)')) &&
      r.width <= 2 && r.height <= 2;
    if (visuallyHidden) return;
    if (cs.display.startsWith('inline') && el.closest('p, li, dd, figcaption') && label.length > 12) return;
    tooSmall.push(Math.round(r.height) + 'px: ' + label.slice(0, 40));
  });

  const fonts = {};
  document.querySelectorAll('h1,h2,h3,p,li,td,th,a,span,dt,dd').forEach((el) => {
    if (!el.textContent.trim()) return;
    const size = parseInt(getComputedStyle(el).fontSize, 10);
    fonts[size] = (fonts[size] || 0) + 1;
  });

  // Guard against a vacuous pass. If the app did not mount, the tables above
  // are all empty and every check would trivially succeed, so a dead preview
  // server or a blank page has to be an explicit failure.
  const root = document.getElementById('root');
  const main = document.querySelector('main');
  const rendered = Boolean(main && main.children.length > 0 && root && root.children.length > 0);

  return {
    rendered,
    chars: document.body.innerText.trim().length,
    hasHScroll: document.documentElement.scrollWidth > vw + 1,
    offenders: offenders.slice(0, 6),
    tooSmall: tooSmall.slice(0, 6),
    minFont: Math.min(...Object.keys(fonts)),
  };
})()`

const profile = mkdtempSync(join(tmpdir(), 'cdp-layout-'))
const port = 9700 + Math.floor(Math.random() * 250)
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

// Chrome writes to the profile as it exits, so remove it after the process is
// gone. The exit handler covers a thrown error or a Ctrl-C.
let exited = false
chrome.once('exit', () => {
  exited = true
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  } catch {
    /* a leftover temp profile is not worth failing the run over */
  }
})
process.on('exit', () => {
  if (exited) return
  try {
    chrome.kill()
  } catch {
    /* already gone */
  }
})

async function target() {
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`, {
        signal: AbortSignal.timeout(1000),
      })
      if (r.ok) return (await r.json()).webSocketDebuggerUrl
    } catch {
      /* not listening yet */
    }
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('Chrome did not expose a debugging endpoint')
}

const wsUrl = await target()
const ws = new WebSocket(wsUrl)
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true })
  ws.addEventListener('error', rej, { once: true })
})

let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (!m.id || !pending.has(m.id)) return
  const { resolve, reject } = pending.get(m.id)
  pending.delete(m.id)
  if (m.error) reject(new Error(JSON.stringify(m.error)))
  else resolve(m.result)
})

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })

function sendToSession(method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params, sessionId }))
  })
}

await sendToSession('Page.enable')
await sendToSession('Emulation.setDeviceMetricsOverride', {
  width: WIDTHS[0],
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
})

const failures = []
let checks = 0

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    await sendToSession('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await sendToSession('Page.navigate', { url: url + route })

    // Wait for the app to mount instead of guessing at a delay. Routes are lazy
    // chunks, so the first visit to one can take longer than a fixed sleep, and
    // a short sleep would report a blank page as a layout problem.
    const READY = `(() => {
      const root = document.getElementById('root')
      const main = document.querySelector('main')
      return Boolean(main && main.children.length > 0 && root && root.children.length > 0)
    })()`

    let mounted = false
    for (let i = 0; i < 40 && !mounted; i++) {
      await new Promise((r) => setTimeout(r, 100))
      const poll = await sendToSession('Runtime.evaluate', {
        expression: READY,
        returnByValue: true,
      })
      mounted = poll.result?.value === true
    }

    const { result, exceptionDetails } = await sendToSession('Runtime.evaluate', {
      expression: AUDIT,
      returnByValue: true,
    })
    if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails))
    const a = result.value

    const problems = []
    if (!a.rendered) problems.push(`page did not render (${a.chars} chars of text)`)
    if (a.hasHScroll) problems.push('page scrolls horizontally')
    for (const o of a.offenders) problems.push('overflows viewport: ' + o)
    for (const t of a.tooSmall) problems.push(`target under ${AA_TARGET_MIN}px: ${t}`)
    if (a.minFont < MIN_FONT_PX) problems.push(`text at ${a.minFont}px`)

    checks++
    const label = `${route} @ ${width}px`.padEnd(42)
    if (problems.length === 0) console.log(`  PASS  ${label}`)
    else {
      console.log(`  FAIL  ${label}`)
      for (const p of problems) console.log(`          ${p}`)
      failures.push(`${label} ${problems.length} problem(s)`)
    }
  }
}

console.log('')
if (failures.length) console.error(`FAIL  ${failures.length} of ${checks} layout checks failed`)
else console.log(`PASS  ${checks}/${checks} layout checks passed`)

// Close the socket so the event loop can drain, then let the process end on
// its own. Calling process.exit() here would cut Chrome off mid-shutdown and
// leave the temp profile behind.
ws.close()
await new Promise((r) => setTimeout(r, 150))
chrome.kill()
process.exitCode = failures.length ? 1 : 0
