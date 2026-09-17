import { profile } from '../content/profile'
import Reveal from './Reveal.jsx'
import { DownloadIcon, LinkedInIcon, MailIcon, PhoneIcon } from './icons.jsx'

/**
 * Contact. Icon-only actions on a single row: the mail, LinkedIn and phone
 * marks are recognisable without a label, and the download arrow carries the
 * resume. Each one keeps an aria-label and a title for keyboard and hover use.
 * The block is centred so it balances the hero and closes the page cleanly.
 */
function IconAction({ href, label, icon, external = false, download }) {
  return (
    <li>
      <a
        href={href}
        aria-label={label}
        title={label}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...(download ? { download } : {})}
        className="flex h-12 w-12 items-center justify-center border border-on-inverse/25 text-on-inverse transition-colors hover:border-on-inverse/70 hover:bg-on-inverse/10"
      >
        {icon}
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
            <ul className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
              <IconAction
                href={`mailto:${profile.links.email}`}
                label={`Email ${profile.links.email}`}
                icon={<MailIcon className="h-[1.15rem] w-[1.15rem]" />}
              />
              <IconAction
                href={profile.links.linkedin}
                label="LinkedIn profile"
                icon={<LinkedInIcon className="h-[1.15rem] w-[1.15rem]" />}
                external
              />
              <IconAction
                href={`tel:${profile.links.phone.replace(/[^+\d]/g, '')}`}
                label={`Phone ${profile.links.phone}`}
                icon={<PhoneIcon className="h-[1.15rem] w-[1.15rem]" />}
              />
              <IconAction
                href={profile.links.resumePdf}
                label="Download resume (PDF)"
                icon={<DownloadIcon className="h-[1.15rem] w-[1.15rem]" />}
                download="Niraj-Chaudhari-Resume.pdf"
              />
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
