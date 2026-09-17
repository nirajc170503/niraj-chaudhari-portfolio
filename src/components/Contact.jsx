import { profile } from '../content/profile'
import SectionLabel from './SectionLabel.jsx'
import Reveal from './Reveal.jsx'

const channels = [
  {
    label: 'Email',
    value: profile.links.email,
    href: `mailto:${profile.links.email}`,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/niraj-chaudharii',
    href: profile.links.linkedin,
    external: true,
  },
  {
    label: 'Phone',
    value: profile.links.phone,
    href: `tel:${profile.links.phone.replace(/[^+\d]/g, '')}`,
  },
]

/** Short and quiet: the three ways to make contact, and two small actions. */
export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 bg-inverse text-on-inverse"
    >
      <div className="shell py-14 md:py-18">
        <Reveal>
          <SectionLabel
            id="contact-heading"
            label="Contact"
            className="[&_.section-label]:text-on-inverse/70 [&_.section-label::before]:bg-on-inverse/40"
          />
        </Reveal>

        <Reveal delay={60}>
          <ul className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-12">
            {channels.map((channel) => (
              <li key={channel.label} className="min-w-0">
                <span className="mr-3 font-mono text-[0.6875rem] tracking-[0.12em] text-on-inverse/55 uppercase">
                  {channel.label}
                </span>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="break-all text-[1rem] text-on-inverse underline decoration-on-inverse/30 underline-offset-4 transition-colors hover:decoration-on-inverse"
                >
                  {channel.value}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <a
              href={profile.links.resumePdf}
              download="Niraj-Chaudhari-Resume.pdf"
              className="font-mono text-[0.6875rem] tracking-[0.12em] text-on-inverse uppercase underline decoration-on-inverse/30 underline-offset-4 transition-colors hover:decoration-on-inverse"
            >
              Download résumé (PDF)
            </a>
            <a
              href="#top"
              className="font-mono text-[0.6875rem] tracking-[0.12em] text-on-inverse/60 uppercase transition-colors hover:text-on-inverse"
            >
              Back to top
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
