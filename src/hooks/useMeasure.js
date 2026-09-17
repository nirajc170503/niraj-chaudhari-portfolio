import { useEffect, useRef, useState } from 'react'

/**
 * Measures an element's width so charts can be drawn in real pixels rather
 * than scaled with a viewBox, which keeps axis label sizes consistent from
 * a 320px phone to a wide desktop.
 */
export default function useMeasure() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const update = () => setWidth(node.clientWidth)
    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}
