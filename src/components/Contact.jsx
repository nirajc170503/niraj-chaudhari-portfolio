import { profile } from '../content/profile'
import Reveal from './Reveal.jsx'
import { DownloadIcon, LinkedInIcon, MailIcon, PhoneIcon } from './icons.jsx'

/**
 * Contact. One clear action up front (download the resume), then the direct
 * ways to reach Niraj as labelled links. Icons sit inline with their labels
 * rather than in isolated boxes, so the block reads as one considered unit.
 * The section is centred to balance the hero and close the page cleanly.
 */
function ContactLink({ href, label, icon, external = false, download }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...(download ? { download } : {})}
        className="group inline-flex items-center gap-2.5 text-[0.9375rem] text-on-inverse/75 transition-colors hover:text-on-inverse"
      >
        <span aria-hidden="true" className="text-on-inverse/50 transition-colors group-hover:text-on-inverse">
          {icon}
        </span>
        <span className="underline decoration-on-inverse/25 decoration-1 underline-offset-4 transition-colors group-hover:decoration-on-inverse">
          {label}
        </span>
      </a>
    </li>
  )
}

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-inverse text-on-inverse">
      <div className="shell pt-16 pb-12 md:pt-20 md:pb-14">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="flex items-center justify-center gap-3">
              <span aria-hidden="true" className="h-px w-5 bg-on-inverse/40" />
              <span
                id="contact-heading"
                className="font-mono text-[0.75rem] font-medium tracking-[0.18em] text-on-inverse/70 uppercase"
              >
                Contact
              </span>
              <span aria-hidden="true" className="h-px w-5 bg-on-inverse/40" />
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p className="mt-7 text-[1.0625rem] leading-relaxed text-on-inverse/80">
              Open to financial analysis, corporate finance, FP&amp;A and credit risk analyst roles from mid
              2027. Happy to walk through any of the models above.
            </p>
          </Reveal>

          <Reveal delay={110}>
            <a
              href={profile.links.resumePdf}
              download="Niraj-Chaudhari-Resume.pdf"
              className="mt-9 inline-flex items-center gap-2.5 border border-on-inverse/40 px-6 py-3 text-[0.8125rem] text-on-inverse transition-colors hover:bg-on-inverse hover:text-inverse"
            >
              <DownloadIcon className="h-4 w-4" />
              Download resume
            </a>
          </Reveal>

          <Reveal delay={160}>
            <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <ContactLink
                href={`mailto:${profile.links.email}`}
                label={profile.links.email}
                icon={<MailIcon className="h-[1.05rem] w-[1.05rem]" />}
              />
              <ContactLink
                href={profile.links.linkedin}
                label="LinkedIn"
                icon={<LinkedInIcon className="h-[1.05rem] w-[1.05rem]" />}
                external
              />
              <ContactLink
                href={`tel:${profile.links.phone.replace(/[^+\d]/g, '')}`}
                label={profile.links.phone}
                icon={<PhoneIcon className="h-[1.05rem] w-[1.05rem]" />}
              />
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}