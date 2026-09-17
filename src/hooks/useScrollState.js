import { useEffect, useState } from 'react'

/**
 * Single scroll listener for the whole header: which section is under the
 * header, and how far through the document the visitor is.
 *
 * Uses one "resolution line" just below the header rather than
 * IntersectionObserver thresholds. With sections of very different heights,
 * thresholds flicker between two states on short viewports; a rAF-throttled
 * scroll handler behaves the same everywhere.
 */
export default function useScrollState(ids, line = 100) {
  const [state, setState] = useState({ active: null, progress: 0 })

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0

      // At the bottom, the last section is active even if its top never
      // crosses the resolution line.
      if (scrollable > 0 && window.scrollY >= scrollable - 2) {
        setState({ active: ids[ids.length - 1], progress })
        return
      }

      const y = window.scrollY + line
      let active = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top + window.scrollY <= y) active = id
      }
      setState({ active, progress })
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, line])

  return state
}
