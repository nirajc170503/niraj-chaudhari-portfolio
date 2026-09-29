import { skillGroups } from '../content/credentials'
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
 * Skills. Every group uses the same treatment: a mono heading (carrying the
 * navy → forest → ochre triad) over one consistent set of chips. One layout,
 * no mixing of list and chip styles, so the section reads as a single unit.
 */
const HEADING_ACCENTS = ['text-navy', 'text-forest', 'text-ochre']

const certificates = certificateGroups
  .flatMap((group) => group.items)
  .toSorted((a, b) => recency(b.date) - recency(a.date))

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="skills-heading" label="Skills" />

        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 60} className="min-w-0">
              <div className="flex items-baseline gap-3">
                <h3
                  className={`font-mono text-xs tracking-[0.16em] uppercase ${
                    HEADING_ACCENTS[i % HEADING_ACCENTS.length]
                  }`}
                >
                  {group.heading}
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-rule" />
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border border-rule bg-paper px-3 py-1.5 text-[0.875rem] text-ink-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Certificates: the evidence */}
        <div id="certificates" className="mt-14 border-t border-rule-strong pt-10">
          <Reveal>
            <h3 className="font-display text-[1.5rem] leading-tight tracking-[-0.015em] text-ochre">
              Certificates
            </h3>
          </Reveal>

          <ul className="mt-6 grid gap-x-14 gap-y-5 sm:grid-cols-2">
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
                  <span className="mt-1 flex items-center justify-between gap-3 font-mono text-xs tracking-wide text-ink-3">
                    <span>
                      {item.issuer}, {item.date}
                    </span>
                    <span aria-hidden="true" className="text-ochre opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}