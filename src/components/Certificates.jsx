import { certificateGroups } from '../content/certificates'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

const MONTHS = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

/** Sort key from the "Mon YYYY" strings in the manifest. */
function recency(date) {
  const [month, year] = date.split(' ')
  return Number(year) * 12 + (MONTHS[month] ?? 0)
}

/**
 * One flat list, newest first.
 *
 * The categories live in the data but are not rendered: on the page they added
 * a second layer of headings without telling a reader anything the certificate
 * itself does not say. Each row is a single link, so there is one target per
 * certificate rather than a title and a separate "PDF" affordance pointing at
 * the same file. Separation comes from spacing, not rules.
 */
const certificates = certificateGroups
  .flatMap((group) => group.items)
  .sort((a, b) => recency(b.date) - recency(a.date))

export default function Certificates() {
  return (
    <section id="certificates" aria-labelledby="certificates-heading">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="certificates-heading" label="Certificates" />

        <ul className="mt-10 grid gap-x-14 gap-y-6 lg:grid-cols-2">
          {certificates.map((item, i) => (
            <Reveal as="li" key={item.id} delay={Math.min(i, 5) * 40} className="min-w-0">
              <a
                href={item.file}
                target="_blank"
                rel="noreferrer noopener"
                className="group block"
              >
                <span className="text-[0.9375rem] leading-snug text-ink transition-colors group-hover:text-navy group-hover:underline group-hover:decoration-navy group-hover:decoration-1 group-hover:underline-offset-4">
                  {item.title}
                  <span className="sr-only"> (opens the certificate PDF in a new tab)</span>
                </span>
                <span className="mt-1 block font-mono text-[0.6875rem] tracking-wide text-ink-3">
                  {item.issuer}, {item.date}
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
