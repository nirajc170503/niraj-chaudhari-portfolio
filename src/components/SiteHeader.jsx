import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { nav, profile } from '../content/profile'
import ThemeToggle from './ThemeToggle.jsx'

export default function SiteHeader() {
  const { pathname, hash } = useLocation()

  // Scroll to the hash target on same-page navigation, otherwise to the top.
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return (
    <header className="no-print sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-md">
      <div className="shell flex h-14 items-center justify-between gap-4 md:h-16">
        <Link
          to="/"
          aria-label={`${profile.name}, home`}
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-navy font-mono text-[0.6875rem] font-medium tracking-widest text-paper transition-opacity hover:opacity-85"
        >
          {profile.monogram}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-[0.8125rem] text-ink-2 transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <a
            href={profile.links.resumePdf}
            download="Niraj-Chaudhari-Resume.pdf"
            className="shrink-0 border border-navy bg-navy px-3.5 py-2 font-mono text-[0.6875rem] tracking-[0.1em] text-paper uppercase transition-colors hover:bg-transparent hover:text-navy"
          >
            <span className="sm:hidden">Résumé ↓</span>
            <span className="hidden sm:inline">Download résumé</span>
          </a>
        </div>
      </div>

      {/* Compact scroll nav for small screens. */}
      <div className="relative lg:hidden">
        <nav
          aria-label="Sections"
          className="flex gap-1 overflow-x-auto border-t border-rule px-3 py-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="shrink-0 px-2.5 py-3 font-mono text-[0.6875rem] leading-none tracking-[0.1em] text-ink-3 uppercase transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper to-transparent"
        />
      </div>
    </header>
  )
}
