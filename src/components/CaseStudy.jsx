import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'

/**
 * Shared case-study chrome: a reading column, a sticky contents rail on wide
 * screens, and a consistent section rhythm. Long enough to be substantive,
 * short enough to scan.
 *
 * `min-w-0` on the grid children is load-bearing: without it the wide data
 * tables force the grid column past the viewport on small screens.
 */
export function CaseStudyLayout({ project, children }) {
  const sections = project.sections
  const accent = { navy: 'text-navy', forest: 'text-forest', ochre: 'text-ochre' }[project.accent] ?? 'text-navy'

  return (
    <div className="pb-4">
      {/* ------------------------------------------------------------- head */}
      <header className="rule-b bg-paper-2">
        <div className="shell py-10 md:py-14">
          <Link
            to="/#projects"
            className="group -mx-2 inline-flex items-center gap-2 px-2 py-2 font-mono text-xs tracking-[0.12em] text-ink-3 uppercase transition-colors hover:text-navy"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            All projects
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <p className="kicker mb-4 text-navy">
                <span className="mr-3">{project.index}</span>
                {project.domain}
              </p>
              <h1 className="max-w-3xl font-display text-[clamp(2rem,6vw,3.75rem)] leading-[1.04] tracking-[-0.03em] text-ink">
                {project.title}
              </h1>
              <p className="mt-3 font-display text-[clamp(1.0625rem,2.4vw,1.375rem)] text-ink-3">
                {project.subtitle}
              </p>
              <p className="prose-note mt-6 max-w-2xl text-[1.0625rem]">{project.summary}</p>
            </div>

            <div className="min-w-0 border-t border-rule pt-5 lg:border-t-0 lg:border-l lg:border-rule lg:pt-0 lg:pl-8">
              <p className="kicker mb-2 text-ink-3">{project.headline.label}</p>
              <p className={`tnum font-display text-[clamp(2.5rem,6vw,3.5rem)] leading-none tracking-[-0.03em] ${accent}`}>
                {project.headline.value}
              </p>
              <p className="mt-2 font-mono text-xs tracking-wide text-ink-3">
                {project.headline.unit}
              </p>
              <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-2">{project.headline.context}</p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-5">
                {project.facts.map((fact) => (
                  <div key={fact.label} className="min-w-0">
                    <dt className="font-mono text-xs tracking-[0.1em] text-ink-3 uppercase">
                      {fact.label}
                    </dt>
                    <dd className="tnum mt-1 text-[0.9375rem] text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- body */}
      <div className="shell grid gap-12 py-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 lg:py-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-28">
            <p className="kicker mb-4 text-ink-3">On this page</p>
            <ol className="space-y-2">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-3 py-1 text-[0.8125rem] text-ink-3 transition-colors hover:text-navy"
                  >
                    <span className="tnum font-mono text-xs leading-5 text-ink-3">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-5">{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>

            <div className="mt-7 border-t border-rule pt-5">
              <p className="kicker mb-3 text-ink-3">Tools</p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                {project.tools.map((tool) => (
                  <li key={tool} className="font-mono text-xs text-ink-2">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="min-w-0 max-w-3xl">{children}</div>
      </div>
    </div>
  )
}

/** One numbered section. */
export function CaseSection({ id, index, heading, children }) {
  return (
    <Reveal
      as="section"
      id={id}
      className="mt-10 border-t border-rule pt-7 first:mt-0 first:border-t-0 first:pt-0"
    >
      <div className="mb-5 flex items-baseline gap-4">
        <span className="tnum font-mono text-xs tracking-wider text-ink-3">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-display text-[clamp(1.375rem,3.2vw,1.875rem)] leading-snug tracking-[-0.02em] text-ink">
          {heading}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </Reveal>
  )
}

export function Prose({ children }) {
  return <p className="prose-note text-[1rem] leading-[1.75]">{children}</p>
}

export function Callout({ label, children }) {
  return (
    <aside className="mt-5 border-l-2 border-ochre bg-ochre-soft/60 px-5 py-4">
      <p className="kicker mb-2 text-ochre">{label}</p>
      <p className="text-[0.9375rem] leading-relaxed text-ink-2">{children}</p>
    </aside>
  )
}

/**
 * Column alignment: a column is right-aligned only when every value in it
 * reads as a number. Descriptive columns stay left-aligned, which is what
 * makes a financial table scannable.
 */
const NUMERIC = /^[+₹$]?\s?[−–-]?\(?[\d,]+(\.\d+)?\)?\s?(%|x|×)?$/

function alignmentFor(rows, columnIndex, head) {
  if (columnIndex === 0) return 'left'
  if (head[columnIndex] === '#') return 'left'
  const values = rows.map((row) => String(row[columnIndex] ?? '').trim()).filter(Boolean)
  if (values.length === 0) return 'left'
  return values.every((value) => NUMERIC.test(value)) ? 'right' : 'left'
}

/**
 * A table needs an accessible name, and `<caption>` is the only element that
 * provides one. The caption used to be a sibling `<p>`, which screen readers
 * never associate with the table, so the table announced only as "table, 4
 * columns, 6 rows" with no indication of what it held. `caption-side: top`
 * keeps it visually in the same place it was.
 */
export function DataTable({ caption, head, rows }) {
  const aligns = head.map((_, i) => alignmentFor(rows, i, head))
  const label = caption ?? head.filter(Boolean).join(', ')

  return (
    <div className="mt-5">
      <div className="relative">
        <div className="overflow-x-auto border-t border-rule-strong">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[0.875rem]">
            <caption className="kicker mb-3 text-left text-ink-3">{label}</caption>
            <thead>
              <tr className="border-b border-rule">
                {head.map((cell, i) => (
                  <th
                    key={cell}
                    scope="col"
                    className={`py-2.5 pr-4 font-mono text-xs tracking-[0.1em] text-ink-3 uppercase ${
                      aligns[i] === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="border-b border-rule/60 align-top last:border-b-0">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="py-2.5 pr-4 text-left font-normal text-ink-2">
                        {cell}
                      </th>
                    ) : (
                      <td
                        key={c}
                        className={`py-2.5 pr-4 text-ink-2 ${
                          aligns[c] === 'right' ? 'tnum text-right' : 'text-left'
                        }`}
                      >
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper to-transparent sm:hidden"
        />
      </div>
      <p className="mt-1.5 font-mono text-xs tracking-wide text-ink-3 sm:hidden">
        Swipe the table to see all columns →
      </p>
    </div>
  )
}

export function StepList({ steps }) {
  return (
    <ol className="mt-6 space-y-5">
      {steps.map((step, i) => (
        <li key={step.title} className="grid grid-cols-[2.25rem_1fr] gap-x-4">
          <span className="tnum pt-0.5 font-mono text-xs tracking-wider text-ochre">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-[1.125rem] leading-snug tracking-[-0.01em] text-ink">
              {step.title}
            </h3>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Closing block: what the project demonstrates + onward navigation. */
export function CaseStudyFooter({ project, next }) {
  return (
    <div className="mt-12 border-t border-rule-strong pt-8">
      <p className="kicker mb-4 text-navy">What this work demonstrates</p>
      <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
        {project.demonstrates.map((item) => (
          <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
            <span aria-hidden="true" className="mt-[0.6rem] h-px w-4 shrink-0 bg-navy/50" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
        <Link
          to="/#projects"
          className="group -mx-2 inline-flex items-center gap-2 px-2 py-2 font-mono text-xs tracking-[0.12em] text-ink uppercase transition-colors hover:text-navy"
        >
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          All projects
        </Link>

        {next ? (
          <Link
            to={`/projects/${next.slug}`}
            className="group inline-flex items-center gap-3 py-2 text-right transition-colors hover:text-navy"
          >
            <span>
              <span className="block font-mono text-xs tracking-[0.12em] text-ink-3 uppercase">
                Next case study
              </span>
              <span className="mt-1 block font-display text-[1.125rem] text-ink group-hover:text-navy">
                {next.title}
              </span>
            </span>
            <span aria-hidden="true" className="text-ink-3 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  )
}
