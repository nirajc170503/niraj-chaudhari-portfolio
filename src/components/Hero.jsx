import { profile } from '../content/profile'
import Reveal from './Reveal.jsx'

/**
 * Hero: centred, deliberately uncrowded. Name, the roles Niraj is targeting,
 * a short description, then the actions. The project figures now live in the
 * identity band below rather than competing for attention here.
 */
function Action({ href, children, variant = 'quiet', download }) {
  const styles =
    variant === 'solid'
      ? 'border-navy bg-navy text-paper hover:bg-transparent hover:text-navy'
      : 'border-rule-strong bg-transparent text-ink hover:border-navy hover:text-navy'

  return (
    <a
      href={href}
      {...(download ? { download } : {})}
      className={`inline-flex items-center border px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors ${styles}`}
    >
      {children}
    </a>
  )
}

export default function Hero() {
  return (
    <section id="top">
      <div className="shell py-16 md:py-24">
        {/* max-w-5xl, not 4xl: the role line below needs the extra width to
            stay on a single row on a typical laptop. */}
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="flex items-center justify-center gap-3">
              <span aria-hidden="true" className="h-px w-5 bg-rule-strong" />
              <span className="kicker">{profile.location}</span>
              <span aria-hidden="true" className="h-px w-5 bg-rule-strong" />
            </p>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-6 font-display text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.98] tracking-[-0.035em] text-ink">
              {profile.name}
            </h1>
          </Reveal>

          {/* Roles Niraj is targeting, directly under the name. The font size
              scales with the viewport so the full line fits on one row from
              roughly 880px upward; below that it wraps. Separators are bound
              to the preceding role so they never start a wrapped line. */}
          <Reveal delay={110}>
            <p className="mt-7">
              {profile.targetRoles.map((role, i) => (
                <span key={role} className="inline-block whitespace-nowrap">
                  <span className="font-mono text-[clamp(0.6875rem,0.9vw,0.8125rem)] tracking-[0.1em] text-navy uppercase">
                    {role}
                  </span>
                  {i < profile.targetRoles.length - 1 ? (
                    <span aria-hidden="true" className="mx-2.5 text-navy/35 text-[clamp(0.6875rem,0.9vw,0.8125rem)]">
                      ·
                    </span>
                  ) : null}
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-9 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-2">
              {profile.positioning}
            </p>
          </Reveal>
          <Reveal delay={210}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
              <Action href="#projects" variant="solid">
                View projects
              </Action>
              <Action href={profile.links.resumePdf} download="Niraj-Chaudhari-Resume.pdf">
                Download resume
              </Action>
              <Action href={`mailto:${profile.links.email}`}>Email</Action>
              <Action href={profile.links.linkedin}>LinkedIn</Action>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
