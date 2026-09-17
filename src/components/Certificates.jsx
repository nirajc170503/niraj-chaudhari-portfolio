import { certificateGroups } from '../content/certificates'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

/** Single certificate row. The entire row links to its own PDF. */
function CertificateRow({ item }) {
  return (
    <li className="border-t border-rule">
      <a
        href={item.file}
        target="_blank"
        rel="noreferrer noopener"
        className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5"
      >
        <span className="text-[0.9375rem] leading-snug text-ink underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors group-hover:text-navy group-hover:decoration-navy">
          {item.title}
          <span className="sr-only"> (opens the certificate PDF in a new tab)</span>
        </span>
        <span className="font-mono text-[0.6875rem] tracking-wide whitespace-nowrap text-ink-3 transition-colors group-hover:text-navy">
          {item.issuer}, {item.date}
          <span aria-hidden="true" className="ml-2 text-ink-3/70">
            PDF ↗
          </span>
        </span>
      </a>

      {item.extraFile ? (
        <a
          href={item.extraFile}
          target="_blank"
          rel="noreferrer noopener"
          className="link-inline mb-3 inline-block font-mono text-[0.6875rem] tracking-wide"
        >
          {item.extraLabel} ↗
        </a>
      ) : null}
    </li>
  )
}

export default function Certificates() {
  const total = certificateGroups.reduce((n, group) => n + group.items.length, 0)

  return (
    <section id="certificates" aria-labelledby="certificates-heading" className="scroll-mt-24">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="certificates-heading" label="Certificates" />

        <Reveal>
          <p className="mt-6 max-w-2xl text-[0.875rem] leading-relaxed text-ink-3">
            {total} certificates and programme records. Each title links to the certificate itself.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-2">
          {certificateGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 50} className="min-w-0">
              <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-navy uppercase">
                {group.heading}
              </h3>
              <ul className="mt-3">
                {group.items.map((item) => (
                  <CertificateRow key={item.id} item={item} />
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
