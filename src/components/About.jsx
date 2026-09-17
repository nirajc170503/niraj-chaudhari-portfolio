import { useState } from 'react'
import { profile } from '../content/profile'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

const facts = [
  { label: 'Based in', value: 'Pune, India' },
  { label: 'MBA Finance', value: 'MIT World Peace University, expected July 2027' },
]

/**
 * Portrait frame. Falls back to a title plate until public/portrait.jpg
 * exists, so the layout is never broken.
 */
function Portrait() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="border border-rule bg-paper-2 p-1.5">
      {failed ? (
        <div className="flex aspect-4/5 w-full flex-col justify-between bg-inverse p-5 text-on-inverse">
          <span aria-hidden="true" className="h-px w-8 bg-on-inverse/40" />
          <span>
            <span className="block font-display text-[1.5rem] leading-tight">{profile.name}</span>
            <span className="mt-2 block font-mono text-[0.6875rem] tracking-[0.16em] text-on-inverse/60 uppercase">
              {profile.location}
            </span>
          </span>
        </div>
      ) : (
        <img
          src={profile.photo.src}
          alt={profile.photo.alt}
          width="800"
          height="1000"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="aspect-4/5 w-full object-cover"
        />
      )}
    </div>
  )
}

/**
 * Rail width matches Experience and Skills (16rem) so the left edge of the
 * content lines up across those sections, and the paragraph and facts run to
 * the same right margin as every other section.
 */
export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <div className="shell py-14 md:py-20">
        <SectionLabel id="about-heading" label="About" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <Reveal className="w-full max-w-[18rem] lg:max-w-none">
            <Portrait />
          </Reveal>

          <Reveal delay={80} className="min-w-0">
            <p className="prose-note text-[1.0625rem]">{profile.intro}</p>

            <dl className="mt-10 grid gap-x-14 gap-y-6 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0">
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
