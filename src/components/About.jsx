import { profile } from '../content/profile'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

/**
 * About. The narrative leads on the left, and the quick profile sits on the
 * right as a quiet spec sheet: label column right-aligned against the value
 * column, separated by hairline rules. The wide gap keeps the two columns
 * clearly distinct without a box around either.
 */
const quickProfile = [
  { label: 'Specialization', value: 'Financial modelling & valuation' },
  { label: 'Focus', value: 'Modelling, DCF & credit risk' },
  { label: 'Education', value: 'MBA Finance, MIT-WPU' },
  { label: 'Location', value: profile.location },
  { label: 'Status', value: profile.availability },
]

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="about-heading" label="About" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-x-20">
          {/* Narrative */}
          <Reveal className="min-w-0">
            <p className="prose-note text-[1.125rem]">{profile.intro}</p>
            <p className="prose-note mt-7 text-[1.125rem]">{profile.journey}</p>
          </Reveal>

          {/* Quick profile */}
          <Reveal delay={80} className="w-full max-w-[20rem] lg:max-w-none">
            <p className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-5 bg-rule-strong" />
              <span className="kicker text-ink-3">Quick profile</span>
            </p>
            <dl className="mt-4">
              {quickProfile.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-6 border-t border-rule py-4"
                >
                  <dt className="pt-0.5 text-right font-mono text-[0.6875rem] tracking-[0.12em] text-ink-3 uppercase">
                    {row.label}
                  </dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-ink-2">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}