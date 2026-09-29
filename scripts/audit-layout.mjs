/**
 * Layout QA via the Chrome DevTools Protocol, no dependencies.
 * Usage: node scripts/audit-layout.mjs <url> [widths...]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const url = process.argv[2] ?? 'http://localhost:4317/'
const widths = (process.argv.slice(3).length ? process.argv.slice(3) : ['375', '390', '768', '1440']).map(Number)

const profile = mkdtempSync(join(tmpdir(), 'cdp-'))
const port = 9222 + Math.floor(Math.random() * 400)

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    // GitHub Actions runs as root, where Chromium's sandbox refuses to start.
    ...(process.env.CI ? ['--no-sandbox'] : []),
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`)
      const list = await res.json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch {
      /* not up yet */
    }
    await sleep(150)
  }
  throw new Error('Could not reach Chrome DevTools endpoint')
}

const wsUrl = await getTarget()
const ws = new WebSocket(wsUrl)
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true })
  ws.addEventListener('error', reject, { once: true })
})

let id = 0
const pending = new Map()
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    if (msg.error) reject(new Error(JSON.stringify(msg.error)))
    else resolve(msg.result)
  }
})

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })

async function evaluate(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails))
  return result.value
}

const AUDIT = `(() => {
  const vw = document.documentElement.clientWidth;
  const offenders = [];

  // An element wider than the viewport is only a bug if nothing can scroll to
  // reach it. Wide tables live inside an overflow-x-auto wrapper on purpose:
  // the table scrolls, the page does not. So check for a scrollable ancestor
  // before reporting.
  const inScrollable = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll|hidden)/.test(cs.overflowX)) return true;
    }
    return false;
  };

  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.right > vw + 1.5 || r.left < -1.5) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.overflow === 'hidden') return;
      if (inScrollable(el)) return;
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 90),
        left: Math.round(r.left),
        right: Math.round(r.right),
        text: (el.textContent || '').trim().slice(0, 48),
      });
    }
  });

  // WCAG 2.2 Target Size (Minimum) is 24x24. Anything at or above that passes;
  // 32px is this project's own comfort preference, reported separately so a
  // real failure is never lost in a list of nice-to-haves.
  const AA_MIN = 24;
  const PREFERRED = 32;

  const smallTargets = [];
  const underPreferred = [];
  document.querySelectorAll('a[href], button').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.height >= PREFERRED) return;

    // WCAG 2.2 exempts links that sit inline in a sentence, where the size is
    // fixed by the surrounding line height, and visually hidden skip links.
    // Both are compliant; flagging them would train us to ignore this output.
    const cs = getComputedStyle(el);
    const label = (el.textContent || '').trim();
    const visuallyHidden =
      (cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath.includes('inset(50%)')) &&
      r.width <= 2 &&
      r.height <= 2;
    if (visuallyHidden) return;
    if (cs.display.startsWith('inline') && el.closest('p, li, dd, figcaption') && label.length > 12) {
      return; // inline in prose
    }

    const entry = {
      tag: el.tagName.toLowerCase(),
      h: Math.round(r.height),
      w: Math.round(r.width),
      text: label.slice(0, 40),
    };
    if (r.height < AA_MIN) smallTargets.push(entry);
    else underPreferred.push(entry);
  });

  const fonts = {};
  document.querySelectorAll('h1,h2,h3,p,li,td,th').forEach((el) => {
    const size = getComputedStyle(el).fontSize;
    fonts[size] = (fonts[size] || 0) + 1;
  });

  return {
    viewport: vw,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    hasHScroll: document.documentElement.scrollWidth > vw + 1,
    offenders: offenders.slice(0, 12),
    smallTargets: smallTargets.slice(0, 12),
    underPreferred: underPreferred.slice(0, 12),
    fontSizes: fonts,
    docHeight: document.documentElement.scrollHeight,
  };
})()`

const results = []
for (const width of widths) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 768,
  })
  await send('Page.navigate', { url })
  await sleep(900)
  const audit = await evaluate(AUDIT)
  results.push({ width, ...audit })
}

console.log(JSON.stringify(results, null, 2))

ws.close()
chrome.kill()
try {
  rmSync(profile, { recursive: true, force: true })
} catch {
  /* ignore */
}
process.exit(0)
