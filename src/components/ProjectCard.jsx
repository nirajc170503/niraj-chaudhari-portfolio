import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'

const accentMap = {
  navy: { rule: 'border-navy', text: 'text-navy' },
  forest: { rule: 'border-forest', text: 'text-forest' },
  ochre: { rule: 'border-ochre', text: 'text-ochre' },
}

/**
 * Editorial project card. Leads with the question the project asked and the
 * one figure that answers it, rather than a tool list.
 */
export default function ProjectCard({ project, delay = 0 }) {
  const accent = accentMap[project.accent] ?? accentMap.navy

  return (
    <Reveal as="article" delay={delay} className="border-t border-rule pt-6 md:pt-7">
      <div className="grid gap-6 lg:grid-cols-[7rem_minmax(0,1fr)_auto] lg:gap-10">
        {/* index and domain */}
        <div className="flex items-baseline gap-4 lg:block">
          <span className={`tnum block font-display text-[2.25rem] leading-none ${accent.text}`}>
            {project.index}
          </span>
          <span className="kicker block text-ink-3 lg:mt-4 lg:max-w-[6.5rem] lg:leading-[1.5]">
            {project.domain}
          </span>
        </div>

        {/* body */}
        <div className="min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-[clamp(1.5rem,3.4vw,2rem)] leading-[1.12] tracking-[-0.02em] text-ink">
              <Link
                to={`/work/${project.slug}`}
                className="transition-colors hover:text-navy focus-visible:text-navy"
              >
                {project.title}
              </Link>
            </h3>
            {project.flagship ? (
              <span className="border border-navy/30 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.12em] text-navy uppercase">
                Flagship
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 text-[0.9375rem] text-ink-3">{project.subtitle}</p>

          <p className="prose-note mt-4 text-[0.9375rem]">{project.question}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.method.map((item) => (
              <li
                key={item}
                className="border border-rule bg-paper-2 px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-ink-2"
              >
                {item}
              </li>
            ))}
          </ul>

          <Link
            to={`/work/${project.slug}`}
            className={`group mt-6 inline-flex items-center gap-2 border-b pb-1 font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors ${accent.text} ${accent.rule}`}
          >
            Read the case study
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
            <span className="sr-only">: {project.title}</span>
          </Link>
        </div>

        {/* headline figure */}
        <div className="min-w-0 lg:w-[13.5rem] lg:border-l lg:border-rule lg:pl-8">
          <span className="kicker mb-2 block text-ink-3">{project.headline.label}</span>
          <span className="tnum block font-display text-[clamp(2rem,5vw,2.75rem)] leading-none tracking-[-0.03em] text-navy">
            {project.headline.value}
          </span>
          <span className="mt-2 block font-mono text-[0.6875rem] tracking-wide text-ink-3">
            {project.headline.unit}
          </span>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-3">{project.headline.context}</p>
        </div>
      </div>
    </Reveal>
  )
}
