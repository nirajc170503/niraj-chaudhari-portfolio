/**
 * Reliable screenshots via the Chrome DevTools Protocol.
 *
 *   node scripts/shot.mjs <url> <out.png> [--w=390] [--h=1200] [--full]
 *                                             [--scroll=1200] [--clip=0,900]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const [url, out] = process.argv.slice(2)
const flag = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const width = Number(flag('w', 1440))
const height = Number(flag('h', 1100))
const full = process.argv.includes('--full')
const scroll = Number(flag('scroll', 0))
const clip = flag('clip', null)
const dark = process.argv.includes('--dark')

const profile = mkdtempSync(join(tmpdir(), 'cdp-shot-'))
const port = 9600 + Math.floor(Math.random() * 300)

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
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
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch {
      /* not up yet */
    }
    await sleep(150)
  }
  throw new Error('Chrome DevTools endpoint not reachable')
}

const ws = new WebSocket(await getTarget())
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

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: Number(flag('scale', 2)),
  mobile: width < 768,
})

// The site honours prefers-color-scheme, so emulating the media feature is
// enough to render the dark palette.
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }],
})

await send('Page.navigate', { url })
await sleep(1600)

if (scroll) {
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scroll})` })
  await sleep(1200)
}

// Trigger any scroll reveals below the fold before a full-page capture
await send('Runtime.evaluate', {
  expression: `(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 45));
    }
    window.scrollTo(0, ${scroll || 0});
  })()`,
  awaitPromise: true,
})
await sleep(900)

const params = { format: 'png', captureBeyondViewport: full }
if (full) {
  const { cssContentSize } = await send('Page.getLayoutMetrics')
  params.clip = { x: 0, y: 0, width, height: cssContentSize.height, scale: 1 }
} else if (clip) {
  const [x, y, h] = clip.split(',').map(Number)
  params.clip = { x, y, width, height: h, scale: 1 }
}

const { data } = await send('Page.captureScreenshot', params)
writeFileSync(out, Buffer.from(data, 'base64'))
console.log(`wrote ${out} (${width}×${params.clip ? Math.round(params.clip.height) : height})`)

ws.close()
chrome.kill()
try {
  rmSync(profile, { recursive: true, force: true })
} catch {
  /* ignore */
}
process.exit(0)
