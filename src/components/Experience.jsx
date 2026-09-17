import { experience } from '../content/credentials'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-24">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="experience-heading" label="Experience" />

        <div className="mt-10 space-y-10">
          {experience.map((role, i) => (
            <Reveal
              as="article"
              key={`${role.role}-${role.organisation}`}
              delay={i * 60}
              className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12"
            >
              <div>
                <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-navy uppercase">
                  {role.period}
                </p>
                <p className="mt-2.5 inline-block border border-rule-strong px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-2 uppercase">
                  {role.type}
                </p>
                {role.location ? (
                  <p className="mt-3 text-[0.8125rem] text-ink-3">{role.location}</p>
                ) : null}
              </div>

              <div className="border-t border-rule pt-5 lg:border-t-0 lg:pt-0">
                <h3 className="font-display text-[1.5rem] leading-tight tracking-[-0.015em] text-ink md:text-[1.75rem]">
                  {role.role}
                </h3>
                <p className="mt-1 text-[1rem] text-ink-2">{role.organisation}</p>

                <ul className="mt-5 space-y-2.5">
                  {role.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
                      <span aria-hidden="true" className="mt-[0.6rem] h-px w-4 shrink-0 bg-rule-strong" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                  {role.skills.map((skill) => (
                    <li
                      key={skill}
                      className="border border-rule bg-paper-2 px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-ink-2"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
