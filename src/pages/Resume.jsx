import { Link } from 'react-router-dom'
import { profile } from '../content/profile'
import Seo from '../components/Seo.jsx'
import { routeSeo } from '../content/seo.js'
import { experience, education, skillGroups } from '../content/credentials'
import { certificateGroups } from '../content/certificates'

/**
 * Resume page.
 *
 * The one-page A4 PDF is the artefact, and it is served and previewed here. But
 * it is not the only thing on this page, and that is deliberate: an inline PDF
 * is invisible to a crawler, is frequently not rendered at all on a phone, and
 * does nothing for a reader using a browser without a PDF viewer. The same
 * facts are therefore also laid out as text below, from the same
 * `credentials` data the home page uses, so there is one source rather than
 * two copies to keep in step.
 */
export default function Resume() {
  return (
    <div className="shell py-10 md:py-14">
      <Seo {...routeSeo('/resume')} />
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
        <div>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 py-1.5 font-mono text-xs tracking-[0.12em] text-ink-3 uppercase transition-colors hover:text-navy"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to portfolio
          </Link>
          <h1 className="mt-4 font-display text-[clamp(1.75rem,4.4vw,2.5rem)] leading-none tracking-[-0.03em] text-ink">
            {profile.name}
          </h1>
          <p className="mt-2 font-mono text-xs tracking-wide text-ink-3">
            {profile.resumeSummary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={profile.links.resumePdf}
            download="Niraj-Chaudhari-Resume.pdf"
            className="inline-flex items-center gap-2 border border-navy bg-navy px-4 py-2.5 font-mono text-xs tracking-[0.12em] text-paper uppercase transition-colors hover:bg-transparent hover:text-navy"
          >
            Download PDF
          </a>
          <a
            href={profile.links.resumePdf}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-rule-strong px-4 py-2.5 font-mono text-xs tracking-[0.12em] text-ink uppercase transition-colors hover:border-navy hover:text-navy"
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
          aria-label={`Resume of ${profile.name}, one page, A4, PDF document`}
        >
          <div className="p-8 text-center">
            <p className="text-[0.9375rem] text-ink-2">
              Your browser cannot display the PDF inline. The same details are written out below.
            </p>
            <a href={profile.links.resumePdf} className="link-inline mt-3 inline-block text-[0.9375rem]">
              Open the resume PDF
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

      {/* ------------------------------------------------------------------------
          The same content as text.
        ------------------------------------------------------------------------ */}
      <div className="mt-16 border-t border-rule pt-10">
        <h2 className="font-display text-[1.5rem] tracking-[-0.02em] text-ink">
          The same details, as text
        </h2>
        <p className="prose-note mt-2 max-w-2xl">
          Everything below is the content of the PDF, so the two cannot disagree.
        </p>

        <section className="mt-10">
          <h3 className="kicker text-ink-3">Experience</h3>
          <ol className="mt-5 divide-y divide-rule border-y border-rule">
            {experience.map((role) => (
              <li key={role.organisation} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h4 className="text-[1.0625rem] text-ink">{role.role}</h4>
                  <p className="font-mono text-xs tracking-wide text-ink-3">{role.period}</p>
                </div>
                <p className="mt-0.5 text-[0.9375rem] text-ink-2">
                  {role.organisation}
                  {role.location ? <span className="text-ink-3">, {role.location}</span> : null}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {role.points.map((point) => (
                    <li key={point} className="text-[0.9375rem] leading-relaxed text-ink-2">
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-xs tracking-wide text-ink-3">
                  {role.skills.join(' · ')}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h3 className="kicker text-ink-3">Education</h3>
          <ol className="mt-5 divide-y divide-rule border-y border-rule">
            {education.map((item) => (
              <li key={item.qualification} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h4 className="text-[1.0625rem] text-ink">{item.qualification}</h4>
                  <p className="font-mono text-xs tracking-wide text-ink-3">
                    {item.grade ? `${item.grade.label} ${item.grade.value}` : null}
                  </p>
                </div>
                <p className="mt-0.5 text-[0.9375rem] text-ink-2">
                  {item.institution}
                  {item.location ? <span className="text-ink-3">, {item.location}</span> : null}
                  <span className="text-ink-3"> · {item.period}</span>
                </p>
                {item.coursework.length > 0 ? (
                  <p className="mt-2 font-mono text-xs tracking-wide text-ink-3">
                    Coursework: {item.coursework.join(' · ')}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h3 className="kicker text-ink-3">Skills</h3>
          <dl className="mt-5 grid gap-8 md:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.id}>
                <dt className="text-[1.0625rem] text-ink">{group.heading}</dt>
                {group.note ? <p className="mt-0.5 text-[0.8125rem] text-ink-3">{group.note}</p> : null}
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
                  {group.items.join(' · ')}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12">
          <h3 className="kicker text-ink-3">Certifications</h3>
          <ul className="mt-5 space-y-4">
            {certificateGroups.map((group) => (
              <li key={group.heading ?? group.id}>
                {group.heading ? (
                  <p className="text-[1.0625rem] text-ink">{group.heading}</p>
                ) : null}
                <ul className="mt-1 space-y-1 text-[0.9375rem] text-ink-2">
                  {group.items.map((item) => (
                    <li key={item.name ?? item.title ?? String(item)}>
                      {item.name ?? item.title}
                      {item.issuer ? <span className="text-ink-3"> — {item.issuer}</span> : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
