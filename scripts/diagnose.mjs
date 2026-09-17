/**
 * Diagnostic: navigate, collect console messages and page errors, then report
 * basic DOM facts. Usage: node scripts/diagnose.mjs <url>
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const url = process.argv[2] ?? 'http://localhost:4317/'
const profile = mkdtempSync(join(tmpdir(), 'cdp-diag-'))
const port = 9900 + Math.floor(Math.random() * 90)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

async function target() {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch {
      /* not up */
    }
    await sleep(150)
  }
  throw new Error('no devtools endpoint')
}

const ws = new WebSocket(await target())
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true })
  ws.addEventListener('error', rej, { once: true })
})

let id = 0
const pending = new Map()
const logs = []
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.method === 'Runtime.consoleAPICalled') {
    logs.push(`[${m.params.type}] ` + m.params.args.map((a) => a.value ?? a.description ?? a.type).join(' '))
  }
  if (m.method === 'Runtime.exceptionThrown') {
    const d = m.params.exceptionDetails
    logs.push(`[EXCEPTION] ${d.text} ${d.exception?.description ?? ''}`)
  }
  if (m.method === 'Log.entryAdded') {
    logs.push(`[log:${m.params.entry.level}] ${m.params.entry.text}`)
  }
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id)
    pending.delete(m.id)
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)
  }
})

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })

await send('Runtime.enable')
await send('Log.enable')
await send('Page.enable')
await send('Page.navigate', { url })
await sleep(2500)

const { result } = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    rootChildren: document.getElementById('root')?.children.length ?? -1,
    bodyTextLength: document.body.innerText.length,
    firstHeading: document.querySelector('h1')?.textContent ?? null,
    h1Visible: (() => {
      const el = document.querySelector('h1');
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { opacity: cs.opacity, color: cs.color, display: cs.display, w: Math.round(r.width), h: Math.round(r.height) };
    })(),
    htmlClass: document.documentElement.className,
    paper: getComputedStyle(document.documentElement).getPropertyValue('--color-paper'),
    ink: getComputedStyle(document.documentElement).getPropertyValue('--color-ink'),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
  })`,
  returnByValue: true,
})

console.log('=== CONSOLE ===')
console.log(logs.length ? logs.join('\n') : '(no messages)')
console.log('\n=== DOM ===')
console.log(JSON.stringify(JSON.parse(result.value), null, 2))

ws.close()
chrome.kill()
try {
  rmSync(profile, { recursive: true, force: true })
} catch {
  /* ignore */
}
process.exit(0)
