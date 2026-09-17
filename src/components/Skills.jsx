import { skillGroups } from '../content/credentials'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

/**
 * Skills, ordered the way a recruiter reads them: the finance capability first
 * and unmistakable, the tooling second, everything else quiet. No proficiency
 * ratings; the case studies are the evidence.
 */
export default function Skills() {
  const finance = skillGroups.find((group) => group.primary)
  const rest = skillGroups.filter((group) => !group.primary)

  return (
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-24 bg-paper-2">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="skills-heading" label="Skills" />

        {/* Finance: the headline set */}
        <Reveal className="mt-10">
          <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
            <div>
              <h3 className="font-display text-[1.5rem] leading-tight tracking-[-0.015em] text-navy">
                {finance.heading}
              </h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-3">{finance.note}</p>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {finance.items.map((item) => (
                <li
                  key={item}
                  className="border border-navy/25 bg-paper px-3.5 py-2 text-[0.9375rem] text-navy"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Tools and professional skills */}
        <div className="mt-12 grid gap-x-14 gap-y-10 border-t border-rule pt-10 lg:grid-cols-2">
          {rest.map((group, i) => (
            <Reveal key={group.id} delay={i * 60} className="min-w-0">
              <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-navy uppercase">
                {group.heading}
              </h3>
              <ul className="mt-3.5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border border-rule bg-paper px-2.5 py-1 text-[0.875rem] text-ink-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
