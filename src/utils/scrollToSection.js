/**
 * Anchor scrolling that survives late layout shifts.
 *
 * A plain scrollIntoView on a freshly loaded page is unreliable: web fonts and
 * images can finish after the scroll starts, so the target element moves and
 * the viewport ends up at the wrong offset. This schedules the smooth scroll
 * immediately, then silently corrects once fonts and the load event have
 * settled, and only if the position actually drifted.
 */
function headerOffset() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) return 72
  return value.includes('rem') ? parsed * 16 : parsed
}

function correct(id) {
  const el = document.getElementById(id)
  if (!el) return
  const drift = Math.abs(el.getBoundingClientRect().top - headerOffset())
  if (drift > 2) el.scrollIntoView({ block: 'start', behavior: 'auto' })
}

export default function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return

  requestAnimationFrame(() => {
    el.scrollIntoView({ block: 'start', behavior: 'smooth' })
  })

  // Late layout is the usual cause of a "dead" anchor on first click.
  if (document.fonts?.ready) document.fonts.ready.then(() => correct(id))
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => correct(id), { once: true })
  }
  window.setTimeout(() => correct(id), 600)
}

/** Used when the hash is already in the URL but the visitor clicks it again. */
export function scrollToHash(hash) {
  if (!hash) return
  scrollToSection(hash.replace(/^#/, ''))
}
