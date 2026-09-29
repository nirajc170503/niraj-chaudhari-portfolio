import { useEffect, useRef, useState } from 'react'

/**
 * Scroll reveal.
 *
 * Two design decisions here are deliberate.
 *
 * One IntersectionObserver is shared by every Reveal on the page. The previous
 * version built one per instance, so a page with forty reveals registered forty
 * observers and forty callbacks to schedule on every intersection.
 *
 * The observer alone is not enough, though. Intersection only fires for
 * elements that cross the viewport, so a jump that skips the content in
 * between leaves it stranded at opacity 0 forever. Hash links, the End key,
 * browser scroll restoration, and find-in-page all produce exactly that jump.
 * A cheap sweep on scroll and resize reveals anything that has already reached
 * or passed the top of the viewport, which is precisely the set that must have
 * been seen.
 *
 * The hidden start state is scoped to `.js` in CSS, so if this module never
 * runs, content is visible rather than invisible.
 */

const pending = new Map()
let observer = null
let sweepQueued = false

/** Reveal everything that is already at or above the fold. */
function sweep() {
  sweepQueued = false
  if (pending.size === 0) return

  const limit = window.innerHeight
  for (const [node, setVisible] of pending) {
    if (node.getBoundingClientRect().top < limit) {
      pending.delete(node)
      setVisible(true)
    }
  }
}

function queueSweep() {
  if (sweepQueued) return
  sweepQueued = true
  requestAnimationFrame(sweep)
}

function getObserver() {
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const setVisible = pending.get(entry.target)
        if (setVisible) {
          pending.delete(entry.target)
          setVisible(true)
        }
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  )

  return observer
}

function supportsObserver() {
  return typeof window !== 'undefined' && typeof window.IntersectionObserver !== 'undefined'
}

function reveal(node, setVisible) {
  if (!node || !supportsObserver()) return () => {}

  pending.set(node, setVisible)
  const io = getObserver()
  io.observe(node)
  queueSweep()

  window.addEventListener('scroll', queueSweep, { passive: true })
  window.addEventListener('resize', queueSweep)

  return () => {
    pending.delete(node)
    io.unobserve(node)
    window.removeEventListener('scroll', queueSweep)
    window.removeEventListener('resize', queueSweep)
  }
}

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  // Seeded here rather than corrected in an effect. Where the browser cannot
  // observe, the content is visible from the first render instead of being
  // hidden and then revealed by a second pass.
  //
  // Reduced motion needs no branch at all: the media query in index.css pins
  // `.reveal` to opacity 1 with no transition, so there is nothing to observe.
  const [visible, setVisible] = useState(() => !supportsObserver())

  useEffect(() => reveal(ref.current, setVisible), [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
