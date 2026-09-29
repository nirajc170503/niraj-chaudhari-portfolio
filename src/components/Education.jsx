import { education } from '../content/credentials'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

export default function Education() {
  /* Accents cycle navy → forest → ochre for the four entries. */
  const accents = ['text-navy', 'text-forest', 'text-ochre', 'text-navy']

  return (
    <section id="education" aria-labelledby="education-heading" className="bg-paper-2">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="education-heading" label="Education" />

        <ol className="mt-10 divide-y divide-rule">
          {education.map((item, i) => (
            <Reveal as="li" key={item.qualification} delay={i * 50} className="py-6 first:pt-0 md:py-7">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-baseline lg:gap-10">
                <div className="min-w-0">
                  <h3 className="font-display text-[1.375rem] leading-snug tracking-[-0.015em] text-ink md:text-[1.625rem]">
                    {item.qualification}
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] text-ink-2">
                    {item.institution}
                    {item.location ? <span className="text-ink-3">, {item.location}</span> : null}
                  </p>

                  {item.coursework.length > 0 ? (
                    <p className="mt-4 max-w-3xl text-[0.8125rem] leading-relaxed text-ink-3">
                      <span className="font-mono text-xs tracking-wider uppercase">
                        Coursework:{' '}
                      </span>
                      {item.coursework.join(', ')}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 lg:flex-col lg:items-end lg:gap-2 lg:text-right">
                  <p className={`font-mono text-xs tracking-[0.1em] uppercase sm:whitespace-nowrap ${accents[i % accents.length]}`}>
                    {item.period}
                  </p>
                  {item.grade ? (
                    <p className="sm:whitespace-nowrap">
                      <span className="tnum font-display text-[1.375rem] leading-none text-navy">
                        {item.grade.value}
                      </span>
                      <span className="ml-2 font-mono text-xs tracking-wider text-ink-3 uppercase">
                        {item.grade.label}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
