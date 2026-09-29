import { profile } from '../content/profile'
import Reveal from './Reveal.jsx'

/**
 * Hero: a two-column split. Left-aligned text on the left, the portrait on
 * the right. Left-aligned copy is the most scannable path for a quick read,
 * and the portrait gives the first screen a human anchor. The section fills
 * the viewport below the sticky header so nothing else peeks at the fold.
 */
function Action({ href, children, variant = 'quiet', download }) {
  if (variant === 'solid') {
    return (
      <a
        href={href}
        {...(download ? { download } : {})}
        className="inline-flex items-center border border-navy bg-navy px-5 py-2.5 text-[0.8125rem] text-paper transition-colors hover:bg-transparent hover:text-navy"
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      {...(download ? { download } : {})}
      className="inline-flex items-center px-1 py-1 font-mono text-xs tracking-[0.12em] text-ink-2 uppercase underline-offset-4 transition-colors hover:text-navy hover:underline hover:decoration-1"
    >
      {children}
    </a>
  )
}

export default function Hero() {
  return (
    <section id="top" className="flex min-h-[calc(100dvh_-_3.5rem)] items-center">
      <div className="shell w-full py-16 md:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-16">
          {/* Left: the pitch, read left to right */}
          <div className="min-w-0">
            <Reveal>
              <p className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-5 bg-rule-strong" />
                <span className="kicker">{profile.location}</span>
              </p>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.98] tracking-[-0.035em] text-ink">
                {profile.name}
              </h1>
            </Reveal>

            {/* Roles Niraj is targeting, directly under the name. Separators
                are bound to the preceding role so they never start a wrapped
                line. */}
            <Reveal delay={110}>
              <p className="mt-7">
                {profile.targetRoles.map((role, i) => (
                  <span key={role} className="inline-block whitespace-nowrap">
                    <span className="font-mono text-[clamp(0.75rem,0.9vw,0.8125rem)] tracking-[0.1em] text-navy uppercase">
                      {role}
                    </span>
                    {i < profile.targetRoles.length - 1 ? (
                      <span aria-hidden="true" className="mx-2.5 text-navy/35 text-[clamp(0.75rem,0.9vw,0.8125rem)]">
                        ·
                      </span>
                    ) : null}
                  </span>
                ))}
              </p>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-9 max-w-xl text-[1.0625rem] leading-relaxed text-ink-2">
                {profile.positioning}
              </p>
            </Reveal>

            <Reveal delay={210}>
              <p className="mt-8 flex items-center gap-2.5 font-mono text-xs tracking-[0.12em] text-ink-3 uppercase">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-forest" />
                {profile.availability}
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap items-center gap-2.5">
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

          {/* Right: the portrait. The frame is a matted print mount sized to the
              photo's own proportions; nothing is cropped. On desktop the top
              edge aligns with the name; on mobile it stacks below the text.

              Three widths of a WebP are served and the JPEG is kept as the
              fallback, so the browser takes 23-106 kB instead of 202 kB. The
              `width`/`height` pair stays on the `img` in every branch: it fixes
              the aspect ratio before the image loads, which is what keeps this
              from being a layout shift. */}
          <Reveal delay={150} className="w-full max-w-[22.5rem] justify-self-center lg:mt-10 lg:max-w-none">
            <div className="border border-rule bg-paper-2 p-3">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/hero-photo-480.webp 480w, /hero-photo-768.webp 768w, /hero-photo-1200.webp 1200w"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 360px, 92vw"
                />
                <img
                  src={profile.photo.src}
                  srcSet="/hero-photo-480.jpg 480w, /hero-photo-768.jpg 768w, /hero-photo.jpg 1200w"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 360px, 92vw"
                  alt={profile.photo.alt}
                  width={profile.photo.width}
                  height={profile.photo.height}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-auto w-full"
                />
              </picture>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}