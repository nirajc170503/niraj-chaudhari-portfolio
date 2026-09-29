import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { nav } from '../content/profile'
import useScrollState from '../hooks/useScrollState.js'
import scrollToSection from '../utils/scrollToSection.js'
import ThemeToggle from './ThemeToggle.jsx'

/**
 * Header.
 *
 * Design notes, from the nav research:
 *  - one slim row (56px), because a header above ~10% of the viewport feels
 *    oppressive, especially on a phone;
 *  - scroll spy with a sliding underline, so the nav always says where you
 *    are without needing hover;
 *  - the current section name stands in for a wordmark on small screens,
 *    which is more useful than decorative branding and keeps the left side
 *    from being empty;
 *  - no resume button here: the download is already a primary action in the
 *    hero and again in the contact section, so a third copy was noise.
 */
const SECTION_IDS = nav.map((item) => item.to.replace('/#', ''))

function MenuIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-[1.15rem] w-[1.15rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {open ? (
        <path d="m4.5 4.5 11 11M15.5 4.5l-11 11" />
      ) : (
        <path d="M3 6h14M3 10h14M3 14h9" />
      )}
    </svg>
  )
}

export default function SiteHeader() {
  const { pathname, hash } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const linkRefs = useRef({})
  const [underline, setUnderline] = useState({ left: 0, width: 0, ready: false })

  const ids = useMemo(() => SECTION_IDS, [])
  const { active, progress } = useScrollState(ids, 100)

  const goTo = (id) => {
    setMenuOpen(false)
    scrollToSection(id)
  }

  // Direct URL loads (and cross-page navigation) land on the hash section.
  // Clicks are handled by goTo above, which also covers the case where the
  // hash is unchanged and this effect therefore never re-runs.
  //
  // Both values are read from useLocation rather than captured, and reacting to
  // exactly these two is the point: the effect exists to put the viewport in the
  // right place when the URL changes, not on every render.
  // oxlint-disable-next-line react/exhaustive-deps
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      if (document.getElementById(id)) {
        requestAnimationFrame(() => scrollToSection(id))
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  // Escape closes the small-screen menu.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Position the sliding underline under the active link.
  useEffect(() => {
    const measure = () => {
      const container = navRef.current
      const link = active ? linkRefs.current[active] : null
      if (!container || !link) {
        setUnderline((prev) => ({ ...prev, ready: false }))
        return
      }
      const c = container.getBoundingClientRect()
      const l = link.getBoundingClientRect()
      setUnderline({ left: l.left - c.left, width: l.width, ready: true })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  const activeLabel = nav.find((item) => item.to === `/#${active}`)?.label ?? null

  return (
    <header className="no-print sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="shell relative flex h-14 items-center">
        {/* Small screens: the current section, which doubles as orientation */}
        <span
          aria-hidden="true"
          className={`truncate font-mono text-xs tracking-[0.14em] text-navy uppercase transition-opacity duration-200 lg:hidden ${
            activeLabel ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {activeLabel ?? '·'}
        </span>

        {/* Desktop: centred navigation with a sliding active indicator.
            The links fill the header height so the whole strip is the tap
            target, rather than a 20px band of text floating inside it. */}
        <nav aria-label="Primary" ref={navRef} className="relative mx-auto hidden h-full items-center lg:flex">
          {nav.map((item) => {
            const id = item.to.replace('/#', '')
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => goTo(id)}
                ref={(el) => {
                  linkRefs.current[id] = el
                }}
                aria-current={active === id ? 'true' : undefined}
                className={`flex h-full items-center px-3.5 text-[0.8125rem] transition-colors ${
                  active === id ? 'text-navy' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          {/* Sits just under the link text, clear of the progress line that
              runs along the bottom edge of the header. */}
          <span
            aria-hidden="true"
            className="absolute bottom-[0.875rem] left-0 h-px bg-navy transition-[transform,width,opacity] duration-300 ease-out"
            style={{
              width: `${underline.width}px`,
              transform: `translateX(${underline.left}px)`,
              opacity: underline.ready ? 1 : 0,
            }}
          />
        </nav>

        <div className="ml-auto flex items-center gap-0.5 lg:absolute lg:right-0 lg:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 items-center justify-center text-ink-2 transition-colors hover:text-navy lg:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Reading progress, flush with the bottom edge of the header */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-navy/70 transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* Small-screen section list */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-rule bg-paper lg:hidden"
      >
        <nav aria-label="Sections" className="shell py-2">
          <ul>
            {nav.map((item) => {
              const id = item.to.replace('/#', '')
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => goTo(id)}
                    className={`flex items-center justify-between border-b border-rule/60 py-3.5 text-[0.9375rem] last:border-b-0 ${
                      active === id ? 'text-navy' : 'text-ink-2'
                    }`}
                  >
                    {item.label}
                    {active === id ? (
                      <span aria-hidden="true" className="h-px w-5 bg-navy" />
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
