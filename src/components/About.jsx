import { profile } from '../content/profile'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

const facts = [
  { label: 'Based in', value: 'Pune, India' },
  { label: 'MBA Finance', value: 'MIT World Peace University, expected July 2027' },
  { label: 'Prior', value: 'BBA Finance, Savitribai Phule Pune University, CGPA 9.11' },
]

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="about-heading" label="About" />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <Reveal>
            <p className="prose-note max-w-2xl text-[1.0625rem]">{profile.intro}</p>
          </Reveal>

          <Reveal delay={80}>
            <dl className="space-y-5">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[0.6875rem] tracking-[0.12em] text-ink-3 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
