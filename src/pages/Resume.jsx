import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../content/profile'

/**
 * Résumé page. There is exactly one résumé artefact: the one-page A4 PDF that
 * scripts/resume-one-page.html generates. This page serves it, previews it,
 * and offers the download. Nothing is duplicated in markup.
 */
export default function Resume() {
  useEffect(() => {
    document.title = 'Résumé, Niraj Chaudhari'
    return () => {
      document.title = 'Niraj Chaudhari, MBA Finance | Financial Analysis, Modelling & Valuation'
    }
  }, [])

  return (
    <div className="shell py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
        <div>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] text-ink-3 uppercase transition-colors hover:text-navy"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to portfolio
          </Link>
          <h1 className="mt-4 font-display text-[clamp(1.75rem,4.4vw,2.5rem)] leading-none tracking-[-0.03em] text-ink">
            {profile.name}
          </h1>
          <p className="mt-2 font-mono text-[0.6875rem] tracking-wide text-ink-3">
            One page · A4 · Updated for {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={profile.links.resumePdf}
            download="Niraj-Chaudhari-Resume.pdf"
            className="inline-flex items-center gap-2 border border-navy bg-navy px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-paper uppercase transition-colors hover:bg-transparent hover:text-navy"
          >
            Download PDF
          </a>
          <a
            href={profile.links.resumePdf}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-rule-strong px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-ink uppercase transition-colors hover:border-navy hover:text-navy"
          >
            Open in new tab
          </a>
        </div>
      </div>

      {/* Inline preview of the same PDF */}
      <div className="mt-8 border border-rule bg-paper-2">
        <object
          data={`${profile.links.resumePdf}#view=FitH`}
          type="application/pdf"
          className="h-[70vh] min-h-[32rem] w-full"
          aria-label={`Résumé of ${profile.name}, PDF document`}
        >
          <div className="p-8 text-center">
            <p className="text-[0.9375rem] text-ink-2">
              Your browser cannot display the PDF inline.
            </p>
            <a href={profile.links.resumePdf} className="link-inline mt-3 inline-block text-[0.9375rem]">
              Open the résumé PDF
            </a>
          </div>
        </object>
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-3">
        Prefer to talk rather than read? Email{' '}
        <a href={`mailto:${profile.links.email}`} className="link-inline">
          {profile.links.email}
        </a>{' '}
        and I am happy to walk through any of the models.
      </p>
    </div>
  )
}
