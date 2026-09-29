import { Link, useLocation } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import { notFoundSeo } from '../content/seo.js'
import { projects } from '../content/projects.js'

/**
 * The catch-all route. It also covers a mistyped case-study slug, so rather
 * than just pointing back at the home page it offers the three projects that
 * do exist. A dead end that names the alternatives is far more useful than one
 * that does not.
 */
export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <div className="shell py-24 md:py-32">
      <Seo {...notFoundSeo(pathname)} />

      <p className="kicker mb-4 text-navy">404</p>
      <h1 className="max-w-2xl font-display text-[clamp(1.75rem,5vw,2.75rem)] leading-tight tracking-[-0.025em] text-ink">
        That page isn&rsquo;t here.
      </h1>
      <p className="prose-note mt-4 max-w-xl">
        The link may be out of date. There are three case studies on this site:
      </p>

      <ul className="mt-10 max-w-2xl divide-y divide-rule border-y border-rule">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              to={`/projects/${project.slug}`}
              className="flex flex-col gap-1 py-4 transition-colors hover:text-navy sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="text-[1.0625rem]">{project.title}</span>
              <span className="font-mono text-xs tracking-[0.12em] text-ink-3 uppercase">
                {project.domain}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 border border-inverse bg-inverse px-5 py-3 font-mono text-xs tracking-[0.12em] text-on-inverse uppercase transition-colors hover:border-navy hover:bg-navy hover:text-paper"
      >
        Back to home →
      </Link>
    </div>
  )
}
