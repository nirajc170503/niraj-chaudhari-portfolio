import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import BackToTop from './components/BackToTop.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Home from './pages/Home.jsx'

/**
 * The case studies, resume and 404 are separate chunks.
 *
 * The home page is the only route a visitor is likely to land on, and it
 * accounts for a fraction of the bundle. Loading the case studies up front
 * meant paying to parse chart code and two data models before the hero could
 * paint, on a site whose whole audience is arriving on a phone over a
 * connection that may not be fast.
 */
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage.jsx'))
const Resume = lazy(() => import('./pages/Resume.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

/** Kept to a sentence so a slow chunk does not look like a broken page. */
function RouteFallback() {
  return (
    <div className="shell py-24 md:py-32" role="status" aria-live="polite">
      <p className="kicker text-ink-3">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-[0.75rem]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        {/* Wraps the routed content only, so a failure in one page does not
            take the header and footer with it. */}
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<CaseStudyPage />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <SiteFooter />
      <BackToTop />
    </>
  )
}
