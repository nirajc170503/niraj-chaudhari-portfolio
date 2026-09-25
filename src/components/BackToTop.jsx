import { useEffect, useState } from 'react'
import { ArrowUpIcon } from './icons.jsx'

/**
 * Floating scroll-to-top control. Appears once the visitor is past the first
 * screen, so it never competes with the hero.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
      className={`no-print fixed right-4 bottom-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper/90 text-ink-2 shadow-sm backdrop-blur transition-all duration-300 hover:border-navy hover:text-navy md:right-8 md:bottom-8 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUpIcon className="h-[1.15rem] w-[1.15rem]" />
    </button>
  )
}
